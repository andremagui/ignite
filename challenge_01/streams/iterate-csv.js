import fs from "node:fs";
import { parse } from "csv-parse";

const filePath = new URL("./challenge_01.csv", import.meta.url);

const csvStream = fs.createReadStream(filePath);

const csvParseCfg = parse({
  delimiter: ",",
  skipEmptyLines: true,
  fromLine: 2,
});

async function iterate() {
  const parseCsv = csvStream.pipe(csvParseCfg);

  for await (const row of parseCsv) {
    const [title, description] = row;

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
  }
}

iterate();
