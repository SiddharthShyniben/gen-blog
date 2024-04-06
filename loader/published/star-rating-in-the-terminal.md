---
social_image: null
main_image: null
tags: javascript, tutorial
published_at: 2021-07-06T12:48:59.642Z
---

# Star rating in the Terminal

Seeing that I couldn't be another Sith Lord in the [Star[Rating] Wars](https://dev.to/inhuofficial/star-rating-wars-the-madsafif-menice-an-even-better-star-rating-system-and-a-comparison-3pg5) I decided to hack into the Imperial Star[Rating] Destroyers and give a better star rating experience to Darth @afif and Darth @madsstoumann (Maybe also Darth @link2twenty).



{% replit @SiddharthShynib/Star-rating %}
<figcaption>Rate my star rating!</figcaption>

It is pretty easy to use and build. And I'll show you how to build it.

## Design

We want the rating system to be accessible in two ways:
- We could give it an argument as the star rating: `node star-rating.js <rating>`
- We could interactively choose the rating (by pressing `m` to increase the rating and `l` to decrease the rating, and pressing `Ctrl + C` to submit/quit).
  ![star-rating](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gky46510t42a3ijonsbz.gif) 
- We can also press a number to set the star rating as that number

## Pseudocode

This is some pseudocode on how our code is going to look like:

```js
let the red ansi escape be \u001b[31m
let the reset ansi escape be \u001b[0m
let the stars be ★ ★ ★ ★ ★ // Add more stars if you need
let the current rating be 0

log the rating(rating = 0, message = \n\nRate us!) {
	clear the previous log
	log the star rating and the message to the console
}

handle the rating(rating) {
	do something with the rating here (maybe send to an external service or something)

	exit from process
}

increase rating () {
	if (rating is less than number of stars) rating = rating + 1
}

decrease rating () {
	if (rating is more than 0) rating = rating - 1
}

if there is a first argument {
	handle rating(first argument)
} else {
	listen to keydown events

	when a key is pressed {
		if (the key is m) increase the rating
		if (the key is l) decrease the rating
		if (the key is a number) set the rating as the correct number and render again
		if (the key is ctrl+c) handle rating
	}

	log the rating(currentRating)
}
```

That is the whole pseudocode of our star rating component. You can just write your own code from this, or follow the explanation below.

## Full explanation

We will start by creating an `if` block:

```js
if (first argument) {
	
} else {

}
```

For finding out the first argument, we can use `process.argv`.

`process.argv` is an array of the arguments provided when running `node somefile.js arguments...`. It looks like this:

```js
['/path/to/node', '/path/to/executed/file.js', 'rest', 'of', 'the', 'arguments']
```

Keeping that in mind, we can find out our first argument like so:

```js
if (+process.argv[2]) {
	
} else {

}
```
<figcaption>Note the `+` sign, which is used to convert a string into a number</figcaption>

If there is a first argument, we can just `handleRating` it:

```js
function handleRating(rating) {
	// Do something useful here
	console.log(`You rated us ${rating}`);

	// Exit – just in case
	process.exit(0);
}

if (+process.argv[2]) {
	handleRating(+process.argv[2]);
} else {

}
```

Now, we need to figure out how we can listen to keypress events in our `else` block. And we can do that using the [`keypress`](https://npm.im/keypress) module (Fun fact, the keydown event was part of the NodeJS core, but somehow it was removed). Don't forget to install the package!

`keypress` usage is fairly simple:

```js
else {
	const keypress = require('keypress');

	keypress(process.stdin);

	process.stdin.addEventListener('keypress', (ch, key) => {
		// Here `ch` contains the key which was pressed and `key contains more data on the pressed key`
	})
}
```

Next thing to do is set a global variable which will contain our current rating:

```js
let currentRating = 0;
```

Now we can simply check for all our keys with a `switch` and do accordingly:

```js
switch (ch) {
  case '1': 
    currentRating = 1;
    break;
  case '2': 
    currentRating = 2;
    break;
  case '3': 
    currentRating = 3;
    break;
  case '4': 
    currentRating = 4;
      break;
  case '5': 
    currentRating = 5;
    break;
  case 'm':
    increaseRating();
    break;
  case 'l':
    decreaseRating();
    break;
}
```
<figcaption>Not the best way to do it, but it's easy to understand</figcaption>

We also need a way to quit, so we add another listener (outside the switch):

```js
if (key && key.ctrl && key.name == 'c') handleRating(currentRating);
```

Finally, we need to resume the `stdin`, so we call `.resume` outside our event listener at the end of the `else`:

```js
process.stdin.setRawMode(true);
process.stdin.resume();
```

This may work as expected, but the problem is: you can't see the stars. Now, we can write a small `logStarRating` function which clears the console and logs a star rating (with a message).

Clearing the previous log and rewriting can be done using some `stdout` tricks, but it doesn't work everywhere, so I decided to use another library to achieve this: [`log-update`](https://npm.im/log-update)

```js
function logStarRating(rating, message) {
	// Code...
}
```

We are going to show selected stars (feel free to change the icon!) using colors, specifically a red color when a star is selected.

Here's a quick one liner which highlights stars (and also the message if all stars are selected)

```js
// All the stars (or whatever shapes you like)
const allStars = '★ ★ ★ ★ ★';
// Ansi escape codes. If you enter any of these in the console, the style of the text will change.
const redAnsi = '\u001b[31m', resetAnsi = '\u001b[0m';

// The star
const star = 
	// Add the red escape code
	redAnsi + 
	// Split the stars into an array
	allStars.split(' ')
	// If we have reached the right place, insert the reset ansi code
	.map((item, index) => index >= number ? resetAnsi + item : item)
	// Join everything back together
	.join(' ');
```

Finally, we can call `logUpdate` to update our stars:

```js
const logUpdate = require('log-update');
// Message comes from the second function argument
logUpdate(`${star}${message}`);
```

Now that we have our function up and running, we can call `logStarRating` after our earlier `switch`:

```js
	// ...
	case 'l':
		decreaseRating();
		break;
}

logStarRating(currentRating)
```

--- 

That's it! we got ourselves a super simple star rating! Next thing to do is add support for half stars etc. but I lost my connection to the hacked Star Destroyers. Might add it some other day.