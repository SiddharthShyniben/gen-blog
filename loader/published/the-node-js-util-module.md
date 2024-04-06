---
social_image: null
main_image: null
tags: node, javascript, util
published_at: 2021-05-31T10:07:26.567Z
---

# The Node.js `util` module

<!-- Callbackify
Debuglog/
Deprecate
Format/
Inspect
Deep strict equal
Promisify
Text encoder decoder
Types -->

There are [**a lot**](https://www.w3schools.com/nodejs/ref_modules.asp) of builtin modules in Node.js. Most of us only use a few of them (I'm pretty sure the `path`, `fs`, and the server related modules are the most used ones). 

But one of the more overlooked modules is the [`util`](https://nodejs.org/api/util.html) module. Here, I'm going to show you some of the helpful functions from this module.

## [`util.callbackify(original)`](https://nodejs.org/api/util.html#util_util_callbackify_original)

I don't think I will use this a lot because I love promises, but I think some people might love this.

Just like it's name, it basically "Takes an `async` function (or a function that returns a `Promise`) and returns a function following the error-first callback style, i.e. taking an `(err, value) => ...` callback as the last argument"

```js
const util = require('util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```

## [`util.promisify(original)`](https://nodejs.org/api/util.html#util_util_promisify_original)

I love this method. No more callback functions and more promises!

Just like it's name, it basically "Takes a function following the common error-first callback style, i.e. taking an `(err, value) => ...` callback as the last argument, and returns a version that returns promises."

```js
const util = require('util');
const fs = require('fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // Do something with `stats`
}).catch((error) => {
  // Houston, we have a problem
});
```

## [`util.deprecate(fn, msg[, code])`](https://nodejs.org/api/util.html#util_util_deprecate_fn_msg_code)

Basically, this function takes in a deprecated function and a deprecation message (and an optional deprecation code) and it returns a new function (which is basically the same as the original function). However, whenever the function returned is called, it will emit a `DeprecationWarning` (which will basically be logged to the console). You may have seen this before.

```js
const util = require('util');

exports.obsoleteFunction = util.deprecate(() => {
  // Do something here.
}, 'obsoleteFunction() is deprecated. Use newShinyFunction() instead.');
```

## [`util.inspect(object[, options])`](https://nodejs.org/api/util.html#util_util_inspect_object_options)

This function logs an object to the console, but instead of directly logging it, it applies some transformations to the object.

```js
const util = require('util')

const obj = {
  foo: '{}',
  bar: {
    baz: undefined
  }
}

util.inspect(obj)
// => { foo: '{}', bar: { baz: undefined } }
```

Now, you may think it is just an equivalent of `console.log(JSON.stringify(obj))`, but there is a lot more functionality available using the options object. Some of the more useful options are:

- `depth` (number): useful when you have a deep nested structure and want to limit the number of recursions
- `colors` (boolean): whether to add syntax highlighting to the output
- `compact` (boolean): whether to show the output in a compact manner (defaults to true). Setting to false will break each property to a newline.

## [`util.isDeepStrictEqual(val1, val2)`](https://nodejs.org/api/util.html#util_util_isdeepstrictequal_val1_val2)

Think of it like the `toBe` Jest matcher — it uses `Object.is()` on primitives and compares objects checking their keys recursively.

```js
const util = require('util')

util.isDeepStrictEqual(
  { someKey: 'someValue', somThingElse: { nested: true } },
  { somThingElse: { nested: true }, someKey: 'someValue' }
)
```

## [`util.types`](https://nodejs.org/api/util.html#util_util_types)

It's basically a type checker — you have functions like `util.types.isAsyncFunction(value)`, `util.types.isPromise(value)`, `util.types.isGeneratorFunction(value)`, `util.types.isDate(value)`, and even some crazy ones like `util.types.isArgumentsObject(value)`, `util.types.isCryptoKey(value)`, `util.types.isBooleanObject(value)`, and more.

## A lot more!

I only chose the ones which seemed like they could be used by almost anyone, but there is a lot more. Debug logs, `printf` like string formatting, Text Decoding and Encoding, and more. You should totally check it out [here](https://nodejs.org/api/util.html)