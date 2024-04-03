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

import { basename, resolve } from "path";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { arrow, _arrow } from "./utils.js";
import remarkOembed from "remark-oembed";
import remarkPresetLintRecommended from "remark-preset-lint-recommended";
import tokyonight from "./themes/tokyo-night-storm-color-theme.json" assert { type: "json" };
import { commitData, getInternalData, writeInternalData } from "./save.js";
import { createHash } from "crypto";

if (!existsSync("./src/data/meta.json"))
  writeFileSync("./src/data/meta.json", JSON.stringify({ posts: [] }));
const meta = JSON.parse(readFileSync("./src/data/meta.json", "utf8"));

export async function process(file) {
  const fname = basename(file, ".md");
  const start = Date.now();
  const content = readFileSync(file, "utf-8");

  const internal = getInternalData();
  internal.ratios ??= [];
  internal.hashes ??= {};

  const contentHash = createHash("sha1").update(content).digest("base64");

  if (internal.hashes[fname] == contentHash) {
    return meta.posts.find((x) => x.frontmatter.fname == fname);
  }

  internal.hashes[fname] = contentHash;

  let frontmatter = {};

  const bar = new SingleBar(
    {
      format: `   ${_arrow(2).trim()} \x1b[1;33m${fname.padEnd(30, " ")}\x1b[0m \x1b[33m{bar}\x1b[0m \x1b[2m({eta}s left)\x1b[0m {step}`,
      barCompleteChar: "━",
      barIncompleteChar: "─",
    },
    Presets.shades_classic,
  );

  let i = 0;
  let stepStart = Date.now();
  bar.start(internal.ratios.reduce((a, b) => a + b, 0) || 8, 0, { step: "" });

  const log =
    (step, addRatio = true) =>
    () =>
    () => {
      let elapsed = Date.now() - stepStart;
      stepStart = Date.now();
      if (addRatio) {
        if (internal.ratios[i])
          internal.ratios[i] = (internal.ratios[i] + elapsed) / 2;
        else internal.ratios[i] = elapsed;
      }

      bar.increment(addRatio ? internal.ratios[i++] || 1 : 0, { step });
    };

  const rendered = await unified()
    .use(log("Parsing markdown...", false))
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

  let slug = frontmatter?.slug ?? fname;
  frontmatter.slug ??= slug;

  if (frontmatter?.date)
    frontmatter.date = new Date(frontmatter.date).getTime();

  frontmatter.date ??= new Date().getTime();
  frontmatter.tags ??= [];
  frontmatter.fname = fname;

  log(`Finished in \x1b[32m${Date.now() - start}ms\x1b[0m`)()();
  writeInternalData(internal);

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
  if (!slug) {
    bar.increment({ step: `Skipped ${frontmatter.slug}` });
    return { frontmatter };
  }

  try {
    mkdirSync(resolve(`/public/${slug}`));
  } catch {}

  const out = await ejs.renderFile("src/templates/post.ejs", {
    title: frontmatter?.title,
    content,
  });

  writeFileSync(resolve(`public/${slug}/index.html`), out);
  bar.increment({ step: `../public/${slug}/index.html` });
  return { frontmatter };
}

export function writeMetaData(posts) {
  writeFileSync(
    resolve("src/data/meta.json"),
    JSON.stringify({ posts }, null, "\t"),
  );
  arrow(1, "Wrote", "meta.json");
  commitData();
}

export async function writeIndex(posts) {
  const out = await ejs.renderFile("src/templates/index.ejs", { posts });
  writeFileSync(resolve("public/index.html"), out);
  arrow(1, "Wrote index.html");
}
