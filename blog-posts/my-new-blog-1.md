---
title: My new blog!
tags: [showcase]
slug: welcome-1
cover: https://picsum.photos/1600/900
cta: The integrated blogging experience
date: 2022-04-28
---

## Table of Contents

## Introduction

This is my new blog!

It's custom built from a fragile combination of Node.js, EJS, remark, rehype,
and some other stuff.

It's still a bit rough and buggy, and I've not even *touched* SEO. But I've
added some really cool features related to the blog post content that will blow
your mind!

![Image lol](/img/debugging.png)

## Better code blocks

The one feature which was the hugest headache is this:

```typescript twoslash
// @errors: 2345
const message = 'Hello world!';
//    ^?
const sum = (a: number, b: number) => a + b;
console.log(sum(1, message));
```

:exploding_head:

This is achieved by a little tool called Twoslash, used in the TypeScript
website itself. You can do more cool stuff:

```typescript twoslash
// Hello
console.error("This is an error")
// @error: This is an error
console.log("This is a log")
// @log: This is a log
console.warn("This is a warning")
// @warn: This is a warning
```

```typescript twoslash
// @noErrors
useless.code();
more.useless.code();
some.more();
const date = new Date();
//           ^^^^^^^^^^
console.log(date)
```

```typescript twoslash
// @annotate: right - Creates date. Some more blah blah to stress test this
const date = new Date();
```

```typescript twoslash
interface Person {
	name: string;
	age: number;
}

// ---cut---

const a: Person = {
	name: 'John',
	age: 42,
};

// @noErrors
console.log(a.n
//             ^|
```

You can see 2 things here:
1. The Person interface is hidden
2. The compiler gives you autocomplete!

```typescript twoslash
// @noErrors
// @esModuleInterop
import express from "express"
const app = express()

app.get("/", (req, res) => {
  res.sen
//       ^|
})



app.listen(3000)
```

Simply install the devdependency `@types/express` and you can see the
autocomplete for the `res.send` method!

Another thing I setup is that you can embed code, like MDX:

<script>
let counter = 1;
function increment() {
	counter++;
	document.querySelector('p.inc').innerHTML = `The number is ${counter}`;
}
</script>
<button onclick='increment()'>Click me</button>
<p class='inc'>The number is 1</p>

```html
<script>
let counter = 1;
function increment() {
	counter++;
	document.querySelector('p.inc').innerHTML = `The number is ${counter}`;
}
</script>
<button onclick='increment()'>Click me</button>
<p class='inc'>The number is 1</p>
```

Not quite MDX, but I rarely use frameworks in blog posts, so ¯\\\_(ツ)\_/¯

And if you're curious, the beautiful highlight comes from
[Shiki](https://shiki.matsu.io/). It uses TextMate grammars used by most IDEs to
get the syntax *just* right!

## TODO[^1]

- [ ] Analytics
- [ ] Fix the tag links in the homepage
- [ ] Comments!
- [ ] SEO
- [ ] Drafts? (Then I would have to make this closed source :( )

[^1]: <small>Yes, I just showed off GFM Task lists. And footnotes</small>

### Yes

#### It's

##### A

###### TOC

## More stuff

While we're at it, let's try some more stuff:

```mermaid
graph TD;
	A-->B;
	A-->C;
	B-->D;
	C-->D;
```

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">It took me 2 hours to successfully build a blog MVP with Node.js but it took me days to fail to build a blog MVP with frameworks.<br><br>Guess I am a backend guy after all</p>&mdash; Siddharth Shyniben (@SiddharthShyn) <a href="https://twitter.com/SiddharthShyn/status/1518796282533658624?ref_src=twsrc%5Etfw">April 26, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
