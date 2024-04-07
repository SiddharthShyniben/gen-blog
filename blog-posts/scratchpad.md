---
title: Scratchpad, a new prototyping tool for JavaScript
tags: [javascript]
cover: /scratch.png
cta: A small yet powerful JavaScript prototyping tool
date: 2024-04-08
---

![Scratchpad](/scratch.png)
<figcaption>A fully fledged prototype</figcaption>

Scratchpad is a small yet powerful tool for experimentation and prototyping in
JavaScript. It serves as a fully fledged, in-browser REPL. Inspired from tools
like runkit and replit, scratchpad solves many of the small problems found in
these tools and provides a tool for a more small scale protoyping use case.

You can create and run JavaScript scripts in the browser using scratchpad. Each
script consists of a number of sections of either text or code. The division of
code into multiple sections allows for running them independently, which is
handy in a prototyping use case.

![Sample](/scratch2.png)
<figcaption>A demo of scratchpad</figcaption>

All your scratchpads are saved in the browser in localStorage. Hence, saving
and loading times are extremely fast.

Scratchpad also provides a fully fledged editor using
[CodeMirror](https://codemirror.net/), which allows you use autocomplete, find
and replace, folding, and so much more!

![Demo](/scratch3.png)
<figcaption>Smart autocomplete with snippets</figcaption>

![Demo](/scratch4.png)
<figcaption>Find and replace</figcaption>

## Small features

One of the many reasons that prompted me to build this tool was the small improvements I could bring. 

Before I developed scratchpad, I used runkit as my prototyping tool. It was an
excellent tool but I always had one problem - every time I went to the "New"
page but didn't create anything, runkit created a blank script for me anyways.
This was a small bug, but I used runkit so commonly that I had tons of empty
scripts clogging up my home screen. In scratchpad, a new pad is created only if
a title is entered.

Another small feature is the support for all the `console.*` functions:

![Demo](/scratch5.png)
<figcaption></figcaption>

The `console.debug` output is disabled by default, and can be enabled manually in settings.

## Microinteraction

One thing I particularly loved implementing were all the microinteractions.
Look at this delightful animation for deleting a scratchpad:

![Animation for deletion](/scratch-delete_quick.gif)
<figcaption></figcaption>

Or this one for cloning a pad:

![Animation for cloning](/scratch-clone_quick.gif)
<figcaption></figcaption>

The animations are all minimal and suit the programming vibes of the overall
project. Such microinteractions are a small yet powerful inclusion to projects.

Another cool animation is the home screen for when there are no scratchpads to show:

![Animation for empty home page](/scratch-empty_quick.gif)
<figcaption></figcaption>

The animation is disabled for anybody who `prefers-reduced-motion`, so accesibility concerns aren't an issue here!
