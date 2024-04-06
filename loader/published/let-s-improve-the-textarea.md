---
social_image: null
main_image: null
tags: html, css, javascript, tutorial
published_at: 2021-06-28T03:23:46.997Z
---

# Let's Improve the textarea!

I improved the textarea, and I'll show you how I did it here!

Here's the final result: 
{% codepen https://codepen.io/SiddharthShyniben/pen/LYWwOze %}

## The base

We are gonna use a textarea to implement this because 
- Textareas support all the native keyboard shortcuts, clicking, and stuff which we don't want to reimplement
- A11y!
- Many chrome extensions (like Grammarly) support checking your writing in textareas, so we need that to work
- It's almost the only option we got

So the first thing we should do is, well, create a textarea! Give it a proper ID and stuff so that we can target it later.

```html
<textarea name="editor" id="editor"></textarea>
```

## Adding two characters when typing one of them

One of the first things I want to do is insert another `'` when a `'` is typed and position the cursor properly.

First things first, let's create a map of which characters we want to insert

```js
const keymap = {
	// value: the value to insert when the character is typed
	// pos: the number of characters the cursor should move forwards
	'<': {value: '<>', pos: 1},
	'(': {value: '()', pos: 1},
	'{': {value: '{}', pos: 1},
	'[': {value: '[]', pos: 1},
	'\'': {value: '\'\'', pos: 1},
	'"': {value: '"', pos: 1},
	'“': {value: '“”', pos: 1},
	'`': {value: '``', pos: 1},
	'‘': {value: '‘’', pos: 1},
	'«': {value: '«»', pos: 1},
	'「': {value: '「」', pos: 1},
	'*': {value: '**', pos: 1},
	'_': {value: '__', pos: 1},
	'>': {value: '> ', pos: 2},
	'~': {value: '~~', pos: 1},
};
```

I've added maps for quotes, smart quotes, some uncommon quotes, and some common markdown syntax. Feel free to add more snippets

Next thing to do is add a keydown listener to the textarea:

```js
const editing = document.getElementById('editor');

editing.addEventListener('keydown', event => {
	// Code...
});
```

Check if there is a matching key in the keymap:

```js
if (keymap[event.key]) {
	// Code..
}
```

And if there is, prevent the default action, which is inserting a character:

```js
event.preventDefault();
```

And insert the correct character:

```js
const pos = editing.selectionStart;
editing.value = editing.value.slice(0, pos) +
	keymap[event.key].value +
	editing.value.slice(editing.selectionEnd);

editing.selectionStart = editing.selectionEnd = pos + keymap[event.key].pos;
```
<br>
![double-char](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x3nug2gae2pjmdvxh9fu.gif)
<figcaption>There it is! Double characters inserted!</figcaption>

<br>
I gotta say, it feels very useful for creating emoticons `¯\_(ツ)_/¯`

## Inserting a tab character when we enter tab

It's so irritating to have to type four characters when we mean to insert a tab... we _have to_ fix it!

We can listen to a Tab key in our `eventListener`, and the rest of the code is pretty much the same as our previous snippet example:

```js
if (event.key === 'Tab') {
	event.preventDefault();
	const pos = editing.selectionStart;
	editing.value = editing.value.slice(0, pos) +
	// Please don't start a tabs vs spaces debate
			'	' + editing.value.slice(editing.selectionEnd);

	editing.selectionStart = editing.selectionEnd = pos + 1;
}
```

And I also wanna change the tab width to 4:

```css
#editor {
	tab-size: 4;
}
```

<br>
![tab](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gabkgd55ogwt0dkfx064.gif)
<figcaption>TAB TAB TAB TAB TAB</figcaption>

<br>
That looks nice, only thing being we can no longer use tab to go to the next element. Well, I'll fix that someday. 

## Tab-to-expand snippets

Yeah! Snippets! 
I don't really have any ideas on snippets, but, we'll manage...

Once again, we are going to create a map with our keyboard shortcuts:

```js
const snipmap = {
    // These make no sense but I'll add them for completeness
    '1#': '# ',
    '2#': '## ',

    // These make sense
    '3#': '### ',
    '4#': '#### ',
    '5#': '##### ',
    '6#': '###### ',
	
	// Lorem ipsum
    'Lorem': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum!',

    // Might be a good idea to add a snippet for a table sometime.
};
```

Next, we gotta do a bit of refactoring on out `Tab` section. We should make an if statement:

```js
if (event.key === 'Tab') {
	if (snippet exists) {
	
	} else {
		event.preventDefault();
		const pos = editing.selectionStart;
		editing.value = editing.value.slice(0, pos) +
				'	' + editing.value.slice(editing.selectionEnd);

		editing.selectionStart = editing.selectionEnd = pos + (snipmap[word].length - 1);
	}
}
```

So that we can add a snippet if it exists, else just insert a Tab character.

First thing to do is check if a given snippet exists. So we have to
- Get the word behind the cursor
- Check if it is in the `snipmap`
  - If it is, then remove the snippet text and insert the snippet

First we'll define our `getWord` function:

```js
function getWord(text, caretPos) {
	let preText = text.substring(0, caretPos);
	let split = preText.split(/\s/);
	return split[split.length - 1].trim();
}
```

Then use it in the if statement:

```js
const word = getWord(editing.value, editing.selectionStart);
if (word && snipmap[word]) {
	event.preventDefault();
	const pos = editing.selectionStart;
	// Subtract the word's length because we need to remove the snippet from the original text
	editing.value = editing.value.slice(0, pos - word.length) +
			snipmap[word].value +
			editing.value.slice(editing.selectionEnd);
	editing.selectionStart = editing.selectionEnd = pos + snipmap[word].pos;
} else {
	// Tab code
}
```

<br>
![tab-snip](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pisoc03bs5s4ujf8wkl1.gif)  
<figcaption>*type* TAB TAB *type* *type* TAB</figcaption>

<br>
And now we have our Tab snippets working. 

## Bonus: A Bookmarklet

Well, If we could just have this work for every textarea, that would be awesome!! So, I just made a bookmarklet out of it, and here's the pen:

{% codepen https://codepen.io/SiddharthShyniben/pen/zYZgaxb %}

That bookmarklet works on almost every website, even on DEV!

--- 

That's it! Stay tuned for part 2 of this post, I have a few features planned and also a few ideas which I don't know how to implement ;)