import { readdir } from "fs/promises";
import { join } from "path";

import { visit } from "unist-util-visit";
import shiki from "shiki";
import tokyonight from "./tokyo-night-storm-color-theme.json" assert { type: "json" };
import { runTwoSlash, renderCodeToHTML } from "shiki-twoslash";

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

const highlighter = await shiki.getHighlighter({ theme: tokyonight });
export const shikiVisitor = () => (tree) => {
  visit(tree, "code", (node) => {
    const code = node.value;
    if (node.meta === "twoslash") {
      const twoslash = runTwoSlash(code, "ts", {});
      let highlight = {};
      if (twoslash.highlights) {
        twoslash.highlights.forEach(({ line }) => {
          highlight[line + 1] = true;
        });
      }
      const html = renderCodeToHTML(
        twoslash.code,
        "ts",
        { twoslash: true, highlight },
        {},
        highlighter,
        twoslash,
      );

      node.value = html;
    } else {
      try {
        node.value = highlighter.codeToHtml(code, { lang: node.lang });
      } catch (e) {
        console.log(`Could not highlight ${node.lang} for ${node.value}`);
        node.value = code;
      }
    }

    node.value = node.value.replaceAll(
      "border-bottom: solid 2px lightgrey",
      "border-bottom: solid 2px #3d59a1",
    );

    node.type = "html";
    node.children = [];
  });
};
