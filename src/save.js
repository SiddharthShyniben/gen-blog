import { existsSync, readFileSync, writeFileSync } from "node:fs";

let internalData = null;

export function getInternalData() {
  if (internalData) return internalData;
  else return _fetchInternalData();
}

export function writeInternalData(data) {
  internalData = data;
}

export function commitData(data) {
  writeFileSync(
    "./src/data/internal.json",
    JSON.stringify((internalData = data || internalData)),
  );
}

function _fetchInternalData() {
  let data = {
    ratios: [],
  };

  if (existsSync("./src/data/internal.json")) {
    data = JSON.parse(readFileSync("./src/data/internal.json", "utf8"));
  } else {
    commitData(data);
  }

  return (internalData = data);
}
