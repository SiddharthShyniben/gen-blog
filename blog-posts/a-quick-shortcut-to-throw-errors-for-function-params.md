---
title: A quick shortcut to throw errors for function params
tags: [javascript, tips]
slug: param-error-shortcut
cover: https://picsum.photos/1600/900
cta: Removes quite a lot of duplicated code
date: 2021-06-09
---

```typescript twoslash
function throwError(propName: string) {
    throw new Error(`'${propName}' is required`)
}

function doSomething(someArg = throwError("someArg")) {
    return someArg;
}

doSomething();
// Uncaught Error: someArg is required
```
