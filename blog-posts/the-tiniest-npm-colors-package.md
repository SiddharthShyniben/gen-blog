---
title: Potentially the smallest node.js color library?
tags: [javascript, nodejs]
slug: smallest-color-library
cover: /cg.png
cta: A compact and efficient terminal styling library that offers an impressive array of 40 different styles, all packed into a minzipped code size of just 227 bytes!
date: 2024-04-07
---

A while ago, I published PlanckColors. It's probably the smallest node module for colors on the internet, at just 227 bytes minzipped! It's so small, here's the source code:

```javascript
s=(S,A=3,T='black,red,green,yellow,blue,magenta,cyan,white'.split`,`)=>T.map((a,i)=>module.exports[a+S]=t=>`\x1b[${i+A*10}m${t}\x1b[0m`)&&s;s('')('Bg',4)('BrBg',10)('Br',9)('',0,'reset,bold,dim,italic,underline,blink,,reverse,hide,strike'.split`,`)
```

That's it! 🤯
8 bit colors with foreground and background support, with variants for brightness, making 32 colors. Plus eight styling options including bold, dim, italic, and more!

## What's going on here??

```javascript
s = (
    S,         // suffix for all the variants
    A = 3,     // The indice to start from for the color codes. Defaults to 3*10 = 30
    // These are the names for the colors, to which suffixes will be added. Defaults to the eight bit colors.
    T = 'black,red,green,yellow,blue,magenta,cyan,white'.split`,`
) =>
    T.map( // For each color...
        (a, i) => 
            module.exports[a + S] = // export a color function a with the suffix S...
                t => `\x1b[${i + A * 10}m${t}\x1b[0m`) // which higlights the given text with the appropriate color i + A * 10
                                                       // For example, for red with i = 1, A = 3, the code will be `\x1b[31m`
                                                       // For redBrBg with i = 1, A = 10, the code will be `\x1b[101m`
                && s;               // And return the same function so we can reuse it
s('')         // Export the 8 bit foreground colors
    ('Bg', 4) // And the background colors which start from 40
    ('Br', 9) // And bright variants which start at 90
    ('BrBg', 10) // And bright background variants which start at 100
    ('', 0, 'reset,bold,dim,italic,underline,blink,,reverse,hide,strike'.split`,`) // And the miscellaneous styles
```

The typescript compiler throws a bunch of errors here for the hacky syntax and method calls, but only because we forego all clean code conventions. This code is perfectly functional and will not break.

## Should I ditch chalk and use this?

You can!

The only thing to consider is the fact that this library doesn't provide any
color detection out of the box. However, since this module only provides 16
colors, it may not be such a big issue. Almost all terminals support 16 colors.

The other concern might be the weird syntax, with the global variable being defined and such. But for such a small project, it is not a major concern

If you do end up using this, let me know!
