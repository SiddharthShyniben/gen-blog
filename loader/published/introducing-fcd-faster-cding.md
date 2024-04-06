---
social_image: null
main_image: null
tags: terminal, showdev, package, npm
published_at: 2021-04-17T10:13:05.735Z
---

# Introducing fcd: "faster cding"

Ever had to type out a long `cd ~/Sites/Projects/project`, find out the path is wrong, rewrite it to `cd ~/Sites/Sandbox/project`? You just wasted a minute or two. This inspired me to create a tool: `fcd`.

`fcd` is a utility which helps you `cd` faster on macOS.

You can directly use it in place of `cd` like so:

```sh
fcd /some/path/here
```

And what happens is the path to any folder with the same name as the `basename` of the input in the `dirname` of the input (basically, `/some/path/here` => `/some/path/**/here`) gets copied to your clipboard.

If this is confusing, then just read the README of the repo. And please leave a star if you find this useful!

{% github SiddharthShyniben/fcd no-readme %}

