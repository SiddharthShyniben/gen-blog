---
social_image: null
main_image: null
tags: javascript, tutorial, codenewbie
published_at: 2021-06-04T02:56:55.126Z
---

# Understanding the Rest and Spread operators

> I wrote this post because I was [requested](https://dev.to/siddharthshyniben/what-js-concept-function-should-i-explain-51na#:~:text=Could,?) here. If you have any more requests, just put them on the same post!

In this post I will show you what the rest and spread operators are.

## Rest operator (aka Rest parameters)

The `rest parameter` (`...variable`) is used to select an infinite number of arguments and convert them to an array.

```js
// put three dots behind a variable to make it a rest parameter
function sum(...numbers) {

  // `numbers` is an array of all the arguments
  // It is similar to the `arguments` property

  // The array is a real array, not an array-like
  // So you can use any array functions
  return numbers.reduce((previous, current) => {
    return previous + current;
  });
}

sum(1, 2, 3);
// Here the numbers property will be equal to [1, 2, 3]
```

In plain english, the rest argument converts all comma separated arguments (`1, 2, 3`) and adds brackets to the sides (`[1, 2, 3]`)

You can also add more arguments in functions which use rest parameters.

```js
function map(mapFunc, ...args) {
  return args.map(mapFunc)
}

map(thing => thing*2, 1, 2, 3)
// Here mapFunc is `thing => thing*2`, and args is [1, 2, 3]
```

Just note that only the last argument can be a rest parameter.

```js
foo(...a, ...b)
// Where to stop a and where to start b?

foo(...args, a, b)
// Where to start a?
// You may say this should be allowed and I think the same but it's not allowed.

foo(arg1, arg2, ...correct)
// OK
```

## Spread operator (aka Spread syntax)

Think of this as the opposite of the rest operator

```js
function sum(x, y, z) {
  return x+y+z;
}

let numbers = [1, 2, 3];

// We can't just sum(numbers) because numbers is an array
// So we `spread` the arguments (remove the brackets by putting three dots `...` behind the array) so [1, 2, 3] => 1, 2, 3

sum(...numbers)
```

In plain english, the spread syntax takes an array (`1, 2, 3`) and adds brackets to the sides (`[1, 2, 3]`)

This operator is really useful if you want to merge two arrays 
```js
let arr1 = [1, 2, 3]
let arr2 = [4, 5, 6]

let arr1AndArr2 = [...arr1, ...arr2] 
// => [1, 2, 3, 4, 5, 6]
```

And did you know that the spread syntax can also be used for objects?
```js
let obj1 = { 1: "one", 2: "two" }
let obj2 = { 3: "three", 4: "four" }

let obj1AndObj2 = { ...obj1, ...obj2 }
// => { 1: "one", 2: "two", 3: "three", 4: "four" }
```

That's it! You learned what the spread and rest operators are.