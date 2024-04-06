---
title: A better typeof
tags: [javascript, todayilearned]
slug: better-typeof
cover: https://picsum.photos/1600/900
cta: A replacement for the buggy JavaScript typeof
date: 2021-05-23
---

The `typeof` operator is a really useful one but it has a few pitfalls:

```typescript twoslash
typeof ["an", "array"] // object
typeof /regex/g // object
typeof null // object
typeof NaN // number
typeof Number('I am not a number!') // number
```

Ok, that's a lot of pitfalls;

But there is a way to get more detailed types using `Object.prototype.toString.call()` on a value: 

```typescript twoslash
// This statement basically means: "Call the toString method of the object prototype on whatever value you like"
Object.prototype.toString.call({ object: "true" }) // the infamous [object Object]
Object.prototype.toString.call(["an", "array"]) // [object Array]
Object.prototype.toString.call("a string") // [object String]
Object.prototype.toString.call(1n) // [object Bigint]
Object.prototype.toString.call(new Date()) // [object Date] really
Object.prototype.toString.call(new Error("an error")) // [object Error]
Object.prototype.toString.call(function () {}) // [object Function]
Object.prototype.toString.call(function* () {}) // [object GeneratorFunction]
Object.prototype.toString.call(/regex/gi) // [object RegExp]
Object.prototype.toString.call(Symbol()) // [object Symbol]
Object.prototype.toString.call(NaN) // it's not perfect: [object Number]
```

Of course, this could be made a function (with a few finishing touches from [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#real-world_usage))

```typescript twoslash
function type(obj: any, showFullClass = false) {
    // Whether to return the whole type
    if (showFullClass && typeof obj === "object") {
        return Object.prototype.toString.call(obj);
    }

    if (obj == null) { return (obj + '').toLowerCase(); } // implicit toString() conversion

    if (Object.is(obj, NaN)) return "nan";

    var deepType = Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
    if (deepType === 'generatorfunction') { return 'function' }

    // Prevent overspecificity (for example, [object HTMLDivElement], etc).
    // Account for functionish Regexp (Android <=2.3), functionish <object> element (Chrome <=57, Firefox <=52), etc.
    // String.prototype.match is universally supported.

    return deepType.match(/^(array|bigint|date|error|function|generator|regexp|symbol)$/) ? deepType :
       (typeof obj === 'object' || typeof obj === 'function') ? 'object' : typeof obj;
}
```
