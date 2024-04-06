---
social_image: null
main_image: null
tags: javascript, guide, tutorial
published_at: null
---

# Monkey Patching: My Thoughts.

<!--https://replit.com/@SiddharthShynib/MonkeyPatchTrial#index.js

https://www.audero.it/blog/2016/12/05/monkey-patching-javascript/#:~:text=Monkey%20patching%20is%20a%20technique,that%20were%20missing%20in%20JavaScript.
-->
If done safely, Monkey Patching is a great way to make your code simpler. Here, I will demonstrate the best ways to Monkey Patch in Javascript.

{% details <h2>What is monkey Patching? (expand to learn more)</h2> %}

Monkey Patching is a technique to add, modify, or suppress the default behavior of a piece of code without changing its original source code.

It has been widely used in the past by libraries and developers to add methods that were missing. A well-known example is the `endsWith()` method, which has been introduced in ECMAScript 2015. Before this version, developers had to implement this method themselves. There are a couple of ways to do that.

One way is to create a `Utility` object that exposes a `endsWith()` method as shown below:

```javascript
const Utility = {
   endsWith: function(string, suffix) {
      return string.indexOf(suffix, string.length - suffix.length) !== -1;
   }
};
```

With this code the developer would call the method as follows:

```javascript
const doesEnd = Utility.endsWith('polyfilled this endsWith method', 'od');
```

Another approach is to Monkey Patch the built-in String object to expose the method:

```javascript
String.prototype.endsWith = function(suffix) {
   return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
```

With this approach, the developer would call the method as follows:

```javascript
var doesEnd = 'polyfilled this endsWith method'.endsWith('od');
```

At first glance, the second version makes more sense because an `endsWith()` method logically belongs to a string. However this approach can cause several problems. Many of them can be avoided using the instructions in this post

The `endsWith()` example demonstrates how to use Monkey Patching to add a method to a built-in object, but Monkey Patching can be used also to change the behavior of a method.

Monkey Patching is often considered a dangerous technique. Not too long ago, the use of Monkey Patching has caused the rename of ECMAScript 2015's method `String.prototype.contains()` to [`String.prototype.includes()`](mdn.io/String.includes). This change was necessary to avoid that websites using [MooTools](https://mootools.net/), which adds a `contains()` method to String.prototype, were broken due to introduction of the ECMAScript version of the method. In particular, the problem was that the `contains()` method added by MooTools and the `contains()` method added in ECMAScript 2015 were incompatible. If you want to know more about this topic, you can read the [`includes()` method page on MDN.](mdn.io/String.includes).

{% enddetails %}


## How to Monkey Patch

### Monkey Patching for Polyfilling

One case where Monkey Patching is a good choice is when it’s used to polyfill methods that are already part of the ECMAScript standard and that are not supported by every browser. This is a safe choice because the method has already been standardized, thus you know its exact behavior. In addition you can ensure that you add your own version only if the built-in one isn’t available. To understand how you can safely employ Monkey Patching, let’s see an example.

As mentioned before, one of the methods introduced in ECMAScript 2015 is `String.prototype.includes()`. It returns true if one string is contained within another; false otherwise. Its signature is the following:

```javascript
String.prototype.includes(searchString[, position])
```

`searchString` is the string to be searched for and the optional `position` argument specifies the position within the string at which to begin searching for `searchString` and defaults to 0.

To add support for browsers which don't have this method, you can polyfill it easily:

```javascript
String.prototype.includes = function(search, start) {
    'use strict';

    if (search instanceof RegExp) {
      throw TypeError('first argument must not be a RegExp');
    }
    if (start === undefined) { start = 0; }
    return this.indexOf(search, start) !== -1;
  };
```

If we use the previous snippet as is, we also override the native implementation of `String.prototype.includes()` in browsers that support the method natively. To avoid this effect, we should only add the function if it doesn’t exist in the browser. This can be achieved like this: 

```javascript
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';

    if (search instanceof RegExp) {
      throw TypeError('first argument must not be a RegExp');
    }
    if (start === undefined) { start = 0; }
    return this.indexOf(search, start) !== -1;
  };
}
```

Pretty simple, right?

Here's a live demo:

{% runkit %}
// Note that the original includes method has been set to undefined for understanding; you can comment it out if you like
String.prototype.includes = undefined

if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        // log to show that the polyfill is being used
        console.log("Using polyfilled includes method")
        if (search instanceof RegExp) {
            throw TypeError('first argument must not be a RegExp');
        }
        if (start === undefined) {
            start = 0;
        }
        return this.indexOf(search, start) !== -1;
    };
}

// In runkit, the last statement gets automatically logged to the console
"hello".includes("w")
{% endrunkit %}


### Monkey patching to create a method

Sometimes we need to implement our own methods using monkey patching. When doing this, I wanted to make sure:

- Patching is easy. There should be a reusable function/class which helps in patching
- If the method exists, due to some future update of ECMAScript, it should be saved.
- There is a way to revert the changes in the future (maybe use a `revert()` function?) and also a way to unrevert (`unrevert()`)

In this example, we will Monkey Patch a function which replaces a character of a string at a particular index. Signature:

```javascript
str.replaceAt(index, subStr);
```

Where `index` is the index to replace at and `subStr` is the string which is to be placed. Example:

```javascript
"hello world".replaceAt(6, "hello")
// => "hello hello"
```

#### The function logic

First let's get the logic out of the way. The function would look something like this:

```javascript
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}
```

#### Implementation

So, I decided a class would be the best for my reusable Monkey Patching handler. I needed to store all my Monkey Patched stuff for future reference so that I can revert and unrevert. I also wanted to add an option to polyfill. Keeping this in mind I made this class:

```javascript
class MonkeyPatcher {
  constructor() {
    this.patched = [];
  }

  patch(objectToPatch, keyToPatch, valuetoPatch, polyfill = false) {

  }

  revert(keysToRevert = []) {

  }

  unRevert(keysToUnrevert = []) {

  }
};
``` 

##### Patching

The patch method is easy to do. Here's an example of how it would be used:

```javascript
const patcher = new MonkeyPatcher();

monkeyPatcher.patch(String.prototype, "replaceAt", function(index, replacement) {
    return this.substr(0, index) + replacement + 
    this.substr(index + replacement.length);
});
```

And here's the patch method:

```js
//...
patch(objectToPatch, keyToPatch, valueToPatch, polyfill = false) {

    if (polyfill) {
      // This is a polyfill, not a patch (I mean it is a patch but still)
      objectToPatch[keyToPatch] = objectToPatch[keyToPatch] || valueToPatch;

      this.patched.push({
        polyfill: true,
        objectToPatch,
        keyToPatch,
        valueToPatch
      });

    } else {
      let keyExists = false;

      if (keyToPatch in objectToPatch) {
        // Value already exists so set `_${valueToPatch}` as the existing value
        keyExists = true;
        objectToPatch["_" + keyToPatch] = objectToPatch[keyToPatch]
      }

       objectToPatch[keyToPatch] = valueToPatch;

      this.patched.push({
        existing: keyExists,
        polyfill: false,
        objectToPatch,
        keyToPatch,
        valueToPatch
      });
    }
  }
//...
```

#### Reverting

For reverting, we can use