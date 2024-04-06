---
social_image: null
main_image: null
tags: javascript, json
published_at: 2021-05-25T15:08:17.790Z
---

# Pretty printing JSON.stringify

Most of use `JSON.stringify` a lot to avoid the infamous `"[object Object]"`. But did you know that it had a few more arguments?

`JSON.stringify` takes a total of 3 arguments. The first one is the data, the second is a _replacer function_, and the third one is the _indentation_.

The main topic of this article is the third argument. If you provide a string as the third argument, that string will be used as indentation. Here's an example:

```js
JSON.stringify({a: 'B', c: {d: 'e'}})
// => {"a":"B","c":{"d":"e"}}
JSON.stringify({a: 'B', c: {d: 'e'}}, null, "  ")
// => 
// {
//   "a": "B",
//   "c": {
//     "d": "e"
//   }
// }
JSON.stringify({a: 'B', c: {d: 'e'}}, null, "test")
// =>
// {
// test"a": "B",
// test"c": {
// testtest"d": "e"
// test}
// }
```

You can also pass in a number instead. If you do so, that many spaces will be inserted as indentation:

```js
JSON.stringify({a: 'B', c: {d: 'e'}}, null, 2)
// => 
// {
//   "a": "B",
//   "c": {
//     "d": "e"
//   }
// }
```

Hope this helps you while debugging sometime!
