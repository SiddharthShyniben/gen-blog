import { readdir } from "fs/promises";
import { join } from "path";

export const ls = async (folder) => {
  const files = await readdir(join(import.meta.dirname, folder), {
    withFileTypes: true,
  });
  return files
    .filter((file) => !file.isDirectory())
    .map((file) => join(import.meta.dirname, folder, file.name));
};

export const RATIOS = [
  0, 39, 0, 0, 1, 0, 1185, 1, 1, 0, 1, 10, 3258, 3, 4, 1, 1, 0,
];

export const _arrow = (depth) => {
  const color = `\x1b[38;5;${depth + 9}m`;
  return `${" ".repeat(depth)}${color}➜\x1b[0m`;
};

export const arrow = (depth = 0, ...rest) => {
  console.log(_arrow(depth), ...rest);
};
