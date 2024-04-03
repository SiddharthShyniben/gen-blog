import { readdir } from "fs/promises";
import { join } from "path";

import tokyonight from "./tokyo-night-storm-color-theme.json" assert { type: "json" };

import { visit } from "unist-util-visit";
import { codeToHtml } from "shiki";
import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";

export const ls = async (folder) => {
  const files = await readdir(join(import.meta.dirname, folder), {
    withFileTypes: true,
  });
  return files
    .filter((file) => !file.isDirectory())
    .map((file) => join(import.meta.dirname, folder, file.name));
};

export const RATIOS = [39, 0, 0, 1, 1185, 1, 1, 0, 1, 10, 3258, 3, 4, 1, 1, 0];

export const _arrow = (depth) => {
  const color = `\x1b[38;5;${depth + 9}m`;
  return `${" ".repeat(depth)}${color}➜\x1b[0m`;
};

export const arrow = (depth = 0, ...rest) => {
  console.log(_arrow(depth), ...rest);
};

export const shikiVisitor = () => (tree) => {
  visit(tree, "code", async (node) => {
    console.error(node);
    const code = node.value;
    if (node.meta === "twoslash") {
      const html = await codeToHtml(code, {
        lang: node.lang,
        theme: "vitesse-dark",
        transformers: [transformerTwoslash({ renderer: rendererRich() })],
      });

      node.value = html;
    } else {
      try {
        node.value = await codeToHtml(code, {
          lang: node.lang,
          theme: "vitesse-dark",
        });
      } catch (e) {
        console.log(`Could not highlight ${node.lang} for ${node.value}`);
        node.value = code;
      }
    }
  });
};
