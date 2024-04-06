---
social_image: null
main_image: null
tags: 
published_at: 2021-06-07T07:48:54.646Z
---

# Building a compiler – working on the tokenizer

# Building a compiler – working on the tokenizer

> Be sure to check out the [previous part](https://dev.to/siddharthshyniben/building-a-compiler-what-we-are-aiming-at-ccj) if you want to learn the syntax 

Finally, let's actually start working on the code! The first thing to build is the `tokenizer` which does lexical analysis on the code.

We're just gonna take our string of code and break it down into an array of tokens.

```js
let x be 1; => [{type: 'identifier', value: 'let'}, ...]
```

## The tokenizer

We start by creating a function that accepts a string of code,
```js
function tokenizer(input) {/* Rest of the code in here, added sequentially */}
```

And we are gonna set up two things...
```js
// A current variable to track our positions in the code, like a cursor
let current = 0;
// An array of tokens
let tokens = [];
```

We start by creating a while loop, where we can increment the current as many times as we want

We also set up a char variable which contains our current character
```js
while (current < input.length) {
	let char = input[current];
    
    // Rest of the code...
}
```

Now, the first we want to do is check for parentheses. 


> **Important note:** I have decided not do grouping and math operations because it will make the series too complex. So you can safely skip matching parenthesis and math operations. If you want, you can leave it there as an exercise for the reader.
```js
if (char === '(') {
    // ...
}
```

If we do match, we want to 
- Push it into the tokens array
- Increment the current variable
- Move to the next iteration of the loop (`continue`)

```js
if (char === '(') {
	tokens.push({
		type: 'paren',
		value: '('
	})

	current++;
	continue;
}
```

And we also do the same thing for a closing parenthesis

```js
if (char === ')') {
	tokens.push({
		type: 'paren',
		value: ')'
	})

	current++;
	continue;
}
```

The next thing we want to check for is whitespace. This is an interesting case because we need whitespace to exist to separate characters, but we actually don't need it as a token in our `tokens` array. So we are just going to check for whitespace and if it exists, we just continue on.

```js
let WHITESPACE = /\s/;
if (WHITESPACE.test(char)) {
    current++;
    continue;
}
```

The next thing to check is for numbers. This is a different case because numbers can be any number of characters and we want to capture the whole thing as a single token. 

So first we are going to check if there is a number in the code...
```js
let NUMBERS = /[0-9]/;
if (NUMBERS.test(char)) {
    // Code here...
}
```

Next, we are going to create a variable to store our number
```js
let value = '';
```

Then we are going to loop through each character in the code until we hit a character that is not a number, incrementing current and storing the number as we go. In the end, we push our number into our tokens array and then we continue on.

```js
while (NUMBERS.test(char)) {
    value += char;
    char = input[++current];
}

tokens.push({ type: 'number', value });
continue;
```

The next thing to do is to support strings. This one is going to be similar to how we implemented numbers.

We'll start by checking for quotes...
```js
if (char === '"') {
    // Code...
}
```
> Note: we are not checking for single quotes. If you want to, you can implement this by repeating this if block with different quotes

Like before, we are going to create a `value` variable, increment `char`, `while` loop till we hit the next quote, push to `tokens`, and `continue`.

```js
let value = '';

char = input[current++];

while (char !== '"') {
    value += char;
    char = input[current++];
}

char = input[current++];
tokens.push({type: 'string', value});
continue;
```

> Note: this part is obsolete. Read previous note.
The next thing to do is to check for math operators. This one is pretty simple so I won't even comment.

```js
if (char === '+') {
	tokens.push({type: 'punctuator', value: '+'});

	current++;
	continue;
}

if (char === '-') {
	tokens.push({type: 'punctuator', value: '-'});

	current++;
	continue;
}

if (char === '/') {
	tokens.push({type: 'punctuator', value: '/'});

	current++;
	continue;
}

if (char === '*') {
	tokens.push({type: 'punctuator', value: '*'});

	current++;
	continue;
}

if (char === '=') {
	tokens.push({type: 'punctuator', value: '='});

	current++;
	continue;
}

if (char === '.') {
	tokens.push({type: 'punctuator', value: '.'});

	current++;
	continue;
}
```

The next final thing to check for is an identifier like `let`, `the`, and also the generic names of variables, which can be anything.

The first thing to do is loop over the characters the same way we did with numbers

```js
const LETTERS = /[a-z]/i;
if (LETTERS.test(char)) {
	let value = '';

	char = input[current++];

	while (char && LETTERS.test(char)) {
		value += char;
		char = input[current++];
	}

    // Later...
}
```

Then, we add a `switch` statement which checks if the `value` matches any known keywords.

We also add a default clause so that any variables can be pushed to the tokens array
```js
switch (value) {
	case 'let':
		tokens.push({type: 'identifier', value});
		break;
	case 'the':
	case 'variable':
			// Don't push anything because they are just extras
		break;
	case 'be':
	    // Be is equivalent to `=`, so it's a punctuator
		tokens.push({type: 'punctuator', value});
		break;
	default:
		tokens.push({type: 'identifier', value});
		break;
}
	
continue;
```

In the end, we can throw a `TypeError` _inside_ the while loop.

```js
throw new TypeError('I don\'t know what this character is: ' + char);
```

And `return tokens` at the end _outside_ the while loop.

----

That's it! we got our tokenizer ready!!