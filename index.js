import { arrow, ls, _arrow } from "./utils.js";
import { SingleBar, Presets } from "cli-progress";
import { process, write, writeMetaData } from "./process.js";

arrow(0, "Building");
const files = await ls("blog-posts/");
arrow(1, "Found", files.length, "posts");

const processed = [];
arrow(1, "Processing posts");
for (const file of files) processed.push(await process(file));
arrow(1, "Processed", processed.length, "posts");

const posts = [];
const bar = new SingleBar(
  {
    format: `  ${_arrow(1).trim()} Writing files                   \x1b[32m{bar}\x1b[0m {step}`,
    barCompleteChar: "━",
    barIncompleteChar: "─",
  },
  Presets.shades_classic,
);
bar.start(processed.length + 1, 0, { step: "" });
for (const post of processed) {
  posts.push(await write(post, bar));
}
bar.increment({ step: "" });
bar.stop();

writeMetaData(posts);
arrow(0, "Done");
