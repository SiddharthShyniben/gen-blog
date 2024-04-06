---
social_image: null
main_image: null
tags: html, css, javascript, tutorial
published_at: 2021-07-01T03:07:52.465Z
---

# TExtarea iMproved Part 2: better lists, auto-resize, and more!

Welcome to v2 of the TExtarea iMproved! We're gonna add a few more features to our previous textarea improver to make it nicer to use.

Here's what it looks like:

{% codepen https://codepen.io/SiddharthShyniben/pen/LYWwOze %}

This one won't actually make much sense without reading the previous part of this series, so go read that first!

{% link https://dev.to/siddharthshyniben/let-s-improve-the-textarea-1pjo %}

Anyways, we got a lot more features to work out, so let's get straight in!

## Automatic list item insertion

Wouldn't it be nice if you could just hit enter from a list item to get a new item added for you automatically? Something like this: 

<br>
![cropped-list-auto](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2yl006h0me72rxmy9pob.gif)

<br>
That's a great feature we could use, and it's really easy to implement!

So, first we should add an event listener for 'Enter':

```js
editing.addEventListener('keydown', function (event) {
	// Other older stuff...
	if (event.key === 'Enter') {
		// Code...
	}
}
```

Next thing to do is figure out whether the line being edited actually contains a bullet. We can abstract that to a new function, and first thing to do is get the part of the line being edited:

```js
function looksLikeBullet(text, caretPos) {
	let line = text.substring(0, caretPos).split(/\r?\n|\r/).pop();
}
```

Then we can use this kind-of-confusing regex to check if there's a bullet:

```js
let bulletRegex = /^([ \t]*[\*\-\+]\s*).*/gim;
if (bulletRegex.test(line)) {
	return {
		bullet: line.replace(bulletRegex, '$1')
	};
}
return false;
```

The regex is not so confusing, here's an explanation:

```js
/^([ \t]*[\*\-\+]\s*).*/gim

/        // Start of regex
^        // Start of line
(        // Capturing group
[ \t]*   // Any number of spaces or tabs
[\*\-\+] // Any of the bullet symbols +, -, or *
\s*      // The whitespace after the bullet. We capture this so that we can use it later 
)        // End of capturing group
.*       // Anything, ie. the rest of the bullet
/gim     // End of regex, and tags global, case insensitive, and multiline
```

So, next thing to do is use the function in our event listener:

```js
let bullet = looksLikeBullet(editing.value, editing.selectionStart);
if (bullet) {
	// Code...
}
```

And then insert the bullet:

```js
// Prevent the newline from being added:
event.preventDefault();
// Store the text after the cursor, so it can be added to the next line:
let addition = editing.value.substring(editing.selectionStart);
// Remove the text after the cursor:
editing.value = editing.value.substring(0, editing.selectionStart);
// Insert the bullet in the textarea
editing.value += ('\n' + bullet.bullet + addition);
```

And it's done! You can now easily make lists.

### Fixing it for numbered lists

Of course, this doesn't work for numbered lists, so we have to fix that. We can easily just make an else block in the `looksLikeBullet` function, and check for numbers. 

```js
...
let numberedListRegex = /^[ \t]*(\d+\.\s*).*/gim;
if (...) {
...
} else if (numberedListRegex.test(line)) {
	return {
		bullet: line
				.replace(numberedListRegex, "$1")
	}
}
return false;
```

But, the problem is that numbers don't get auto incremented. So we can fix that using _yet another regex_ to increment numbers:

```js
bullet: line
		.replace(numberedListRegex, "$1")
		.replace((/\d+/, (number) => +number + 1)
```

<br>
![list-auto-number](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oz8mpuw4mt7wmb7tgpfy.gif)
<figcaption>That works well</figcaption>

<br>

## Auto resize

It's so not nice to have to resize a textarea manually – I mean we have to use the mouse! We should fix that.

This one is quite simple, just create a resize function:

```js
function resize() {
	editing.style.height = '24px';
	editing.style.height = this.scrollHeight + 12 + 'px';
}
```

And then listen to the `input` event:

```js
editing.addEventListener('input', resize)
```

But then, we also need to resize when we insert text programmatically, so we can call resize in the `keydown` listener also. If we do that, we get the perfect auto-resize

![resize](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oe6vxl2acvwnsixzoemn.gif) 
<figcaption>That's really helpful</figcaption>

There are better ways of doing this out there, but we'll keep this for now
<!-- https://codepen.io/vsync/pen/frudD -->

--- 

That's it, we got an even better textarea which we can use!
There's a huge (**Edit: 100%**) probability of the third part of this series coming out someday, so stay tuned!