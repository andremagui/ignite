import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((route) => {
    //use route.path.rest(url) para checar se o regex esta funcionando
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }
  return res.writeHead(404).end();
});

server.listen(3333);

//como o front end envia as infos
// query parameters => http://localhost:3333/users?userId=1&name=Andre => filtros, paginacao, busca e sao nao obrigatorios
// route parameters => GET / DELETE /... http://localhost:3333/users/1 => identificacao de um recurso
// request body => envio de infos em formularios (https) POST http://localhost:3333/users
