// /user/:id - de a A z minusculo ou maisculo, 1 ou mais vez, global
// ^ significa que a regex comeca com pathWithParams
// $1 posicao um do regex, entao se tiver users/:id/groups/:groupId, eles vem nomeados
export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g;
  const pathWithParams = path.replaceAll(
    routeParametersRegex,
    "(?<$1>[a-z0-9-_]+)"
  );

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);
  return pathRegex;
}
