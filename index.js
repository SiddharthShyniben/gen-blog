import { SingleBar, Presets } from "cli-progress";

import { arrow, ls, _arrow } from "./src/utils.js";
import {
  process as _process,
  write,
  writeIndex,
  writeMetaData,
} from "./src/process.js";

const FORCE = process.argv[2] == "--force";

arrow(0, "Building");
const files = await ls("../blog-posts/");
arrow(1, "Found", files.length, `post${files.length > 1 ? "s" : ""}`);

const processed = [];
for (const file of files) processed.push(await _process(file, FORCE));
arrow(1, "Processed", processed.filter((x) => x.slug).length || "no", "posts");

if (processed.filter((x) => x.slug).length) {
  const posts = [];
  const bar = new SingleBar(
    {
      format: ` ${_arrow(1).trim()} Writing files                    \x1b[32m{bar}\x1b[0m \x1b[2m({eta}s left)\x1b[0m {step}`,
      barCompleteChar: "━",
      barIncompleteChar: "─",
    },
    Presets.shades_classic,
  );
  bar.start(processed.length + 1, 0, { step: "" });
  let start = Date.now();
  for (const post of processed.filter(Boolean))
    posts.push(await write(post, bar));
  bar.increment({ step: `Finished in \x1b[32m${Date.now() - start}ms\x1b[0m` });
  bar.stop();

  writeMetaData(posts);
  await writeIndex(posts);
}
arrow(0, "Done");
