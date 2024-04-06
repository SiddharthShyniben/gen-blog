---
social_image: null
main_image: null
tags: 
published_at: 2021-06-06T10:14:29.609Z
---

# Building a compiler – basic setup

# Building a compiler – basic setup

> Be sure to check out the [previous part](https://dev.to/siddharthshyniben/building-a-compiler-basic-concepts-1j1d) to learn the basics

Now that you have a general overview on a compiler, let's setup a few files so you can start creating one!

I'm gonna code this using nodejs, but you can choose any environment you like, as there is nothing nodejs specific in here.

You only _**have**_ to create a single JS file, and you can safely skip this part of this series if you like. But I recommend doing this.

--------

You still here? Alright let's start!

## The files
I like to divide everything up, so I am going to create 
- The main index file
- The tokenizer
- The parser
- The traverser
- The transformer
- The code generator

Plus a few more files
- A simple cli which parses input and logs it to the console, just made for testing purposes
- A test file which compiles some code and checks if the code is compiled correctly

So I am going to put all the boilerplate code here, which you can just copy and paste. Also, I am using [`.mjs`](https://stackoverflow.com/questions/57492546/what-is-the-difference-between-js-and-mjs-files) because I prefer the import/export statements more than require.

### `index.mjs`

```js
import {tokenizer} from './components/tokenizer';
import {parser} from './components/parser';
import {transformer} from './components/transformer';
import {codeGenerator} from './components/code-generator';


export function compiler(input) {
	const tokens = tokenizer(input);
	const oldAST = parser(tokens);
	const newAST = transformer(oldAST);
	const output = codeGenerator(newAST);

	return output;
}
```

### `components/tokenizer.mjs`

```js
export function tokenizer(input) {
	
}
```

### `components/parser.mjs`

```js
export function parser(tokens) {
	
}
```

### `components/traverser.mjs`

```js
export function traverser(ast, visitor) {
	
}
```

### `components/transformer.mjs`

```js
export function transformer(ast) {
	
}
```

### `components/code-generator.mjs`

```js
export function codeGenerator(node) {
	
}
```

### `cli.mjs` 

```js
import {compiler} from "./index";

const argv = process.argv.slice(2);

argv.forEach(codeBlock => {
	console.log(`\`${codeBlock}\` compiles to\n\n${compiler(codeBlock)}\n`)
});
```

### `tests.mjs`

```js
import assert from 'assert';
import {compiler} from './compiler';

function itCompiles(codeBlock, expectedOutput) {
	assert.strictEqual(
		compiler(codeBlock),
		expectedOutput
	)
}

// No tests now
```

--------
That's all, and see you in the next part!