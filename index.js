import { SingleBar, Presets } from "cli-progress";

import { arrow, ls, _arrow } from "./src/utils.js";
import { process, write, writeIndex, writeMetaData } from "./src/process.js";

arrow(0, "Building");
const files = await ls("../blog-posts/");
arrow(1, "Found", files.length, `post${files.length > 1 ? "s" : ""}`);

const processed = [];
for (const file of files) processed.push(await process(file));
arrow(1, "Processed", processed.filter((x) => x.slug).length || "no", "posts");

const posts = [];
const bar = new SingleBar(
  {
    format: ` ${_arrow(1).trim()} Writing files                   \x1b[32m{bar}\x1b[0m {step}`,
    barCompleteChar: "━",
    barIncompleteChar: "─",
  },
  Presets.shades_classic,
);
bar.start(processed.length + 1, 0, { step: "" });
for (const post of processed.filter(Boolean))
  posts.push(await write(post, bar));
bar.increment({ step: "" });
bar.stop();

writeMetaData(posts);
await writeIndex(posts);
arrow(0, "Done");
