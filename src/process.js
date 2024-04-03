import { SingleBar, Presets } from "cli-progress";
import dictionary from "dictionary-en";
import { parse } from "yaml";
import ejs from "ejs";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import remarkToc from "remark-toc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { remarkMermaid } from "remark-mermaidjs";
import retextSpell from "retext-spell";
import retextPassive from "retext-passive";
import retextReadability from "retext-readability";
import retextSimplify from "retext-simplify";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import { transformerTwoslash, rendererRich } from "@shikijs/twoslash";

import { basename, join } from "path";
import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { arrow, _arrow } from "./utils.js";
import remarkOembed from "remark-oembed";
import remarkPresetLintRecommended from "remark-preset-lint-recommended";
import tokyonight from "./themes/tokyo-night-storm-color-theme.json" assert { type: "json" };

export async function process(file) {
  const fname = basename(file, ".md");
  const start = Date.now();
  const content = readFileSync(file, "utf-8");

  let frontmatter = {};

  const bar = new SingleBar(
    {
      format: `   ${_arrow(2).trim()} \x1b[1;33m${fname.padEnd(30, " ")}\x1b[0m \x1b[33m{bar}\x1b[0m \x1b[2m({eta}s left)\x1b[0m {step}`,
      barCompleteChar: "━",
      barIncompleteChar: "─",
    },
    Presets.shades_classic,
  );

  bar.start(9, 0, { step: "" });
  const log = (step) => () => () => bar.increment({ step });

  const rendered = await unified()
    .use(log("Parsing markdown..."))
    .use(remarkPresetLintRecommended)
    .use(remarkParse)
    .use(log("Extracting frontmatter..."))
    .use(remarkFrontmatter)
    .use(() => (tree) => {
      tree.children.forEach((node) => {
        if (node.type === "yaml") frontmatter = parse(node.value);
      });
    })
    .use(log("Converting additional formats..."))
    .use(remarkGfm)
    .use(remarkEmoji)
    .use(remarkOembed)
    .use(remarkMermaid, { theme: "dark" })
    .use(remarkToc, { tight: true, ordered: true })
    .use(log("Performing language checks.."))
    .use(retextSpell, dictionary)
    .use(retextPassive)
    .use(retextReadability)
    .use(retextSimplify)
    .use(log("Convert to HTML..."))
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(log("Using shiki to highlight code..."))
    .use(rehypeShiki, {
      theme: tokyonight,
      transformers: [
        transformerTwoslash({
          renderer: rendererRich(),
        }),
      ],
    })
    .use(log("Autolinking headings..."))
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(log("Converting tree back to string..."))
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  let slug = frontmatter?.slug ?? basename(file, ".md");

  if (frontmatter?.date)
    frontmatter.date = new Date(frontmatter.date).getTime();

  frontmatter.date ??= new Date().getTime();
  frontmatter.tags ??= [];

  log(`Finished in \x1b[32m${Date.now() - start}ms\x1b[0m`)()();

  bar.stop();

  return {
    slug,
    content: String(rendered),
    frontmatter,
    tags: frontmatter.tags,
  };
}

export async function write(data, bar) {
  const { slug, content, frontmatter } = data;
  try {
    mkdirSync(`../public/${slug}`);
  } catch {}

  const out = await ejs.renderFile("templates/post.ejs", {
    title: frontmatter?.title,
    content,
  });

  writeFileSync(`../public/${slug}/index.html`, out);
  bar.increment({ step: `../public/${slug}/index.html` });
  return frontmatter;
}

export function writeMetaData(posts) {
  writeFileSync("data/meta.json", JSON.stringify({ posts }, null, "\t"));
  arrow(1, "Wrote", "meta.json");
}

export async function writeIndex(posts) {
  const out = await ejs.renderFile("templates/index.ejs", { posts });
  writeFileSync(join(import.meta.dirname, "../public/index.html"), out);
  arrow(1, "Wrote index.html");
}
