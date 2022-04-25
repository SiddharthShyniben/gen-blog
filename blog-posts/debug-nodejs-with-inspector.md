---
title: Let's debug a node.js app using the built-in debugger.
dev-tags: 
- node
- javascript
- tutorial
- beginners
hashnode-tags:
- JavaScript
- Node.js
- Tutorial
- Beginner Developers
---

It's about time we stop using `console.log` to debug things. While [`console.*` are really powerfull tools](https://blog.siddu.tech/7-console-log-alternatives), it's a pain to maintain.

Most of us can use our IDEs to debug code. But did you know that Node.js comes with a built-in debugger? It's a simple terminal based one, but extremely powerful, too. Let's check it out by debugging a sample app using the built-in debugger

## The code

This is the simple program we are going to be debugging right now:

```javascript
const numbers = process.argv;
const sum = (a, b) => a + b;
let out = numbers.reduce(sum);
console.log(out);
```

If you are a seasoned developer, you should have caught the bugs already. But forget it.

Here's some sample output from this program:

```bash
$ node index.js 1 2 3 4
/usr/local/Cellar/node/17.5.0/bin/node/Users/mac/Blog/Code/node-debug/index.js1234
```

## Firing up the debugger.

Node.js has two ways to start the debugger.

The first way is to run `node --inspect file.js`. This starts a websocket connection to the debugger and clients can use this connection to debug the code.

The second way is to use the built-in inspector client, using `node inspect file.js` (note that it's a command now, not a `--flag`)

We can start the inspector for our app by running `node inspect index.js`

```bash
$ node inspect index.js
< Debugger listening on ws://127.0.0.1:9229/516c8247-4fe0-471d-9c71-a87aa191b256
< For help, see: https://nodejs.org/en/docs/inspector
<
< Debugger attached.
<
 ok
Break on start in index.js:1
> 1 const numbers = process.argv;
  2 const sum = (a, b) => a + b;
  3 let out = numbers.reduce(sum);
debug>
```

This gives us a debug prompt, where we can run commands to debug the code.

The basic ones are:

- `cont`, `c`: Continue execution
- `next`, `n`: Step next
- `step`, `s`: Step in
- `out`, `o`: Step out
- `repl`: Enter a repl in the current scope.

For now, let's press `n<enter>` to go to the next line.
The debugger will look like this now:

```bash
break in index.js:2
  1 const numbers = process.argv;
> 2 const sum = (a, b) => a + b;
  3 let out = numbers.reduce(sum);
  4 console.log(out);
debug>
```

We are at the second line now.

Now, we know that there is something wrong with the `numbers` array. We can take a look at it's value by "watching" it. We can run the command `watch('numbers')` to do so. Then, we can use the `watchers` command to print all watched variables. 

This is what it will look like now:

```bash
debug> watch('numbers')
debug> watchers
  0: numbers =
    [ '/usr/local/Cellar/node/17.5.0/bin/node',
      '/Users/mac/Blog/Code/node-debug/index.js' ]
debug>
```

We just spotted the bug! We forgot to get rid of the first 2 arguments in the `process.argv` 🤦. Silly me!

Let's fix the code. First, exit the debugger with `Ctrl-d`, then modify the first line:

```javascript
const numbers = process.argv.slice(2);;
const sum = (a, b) => a + b;
let out = numbers.reduce(sum);
console.log(out);
```

...but it's still broken! `node index.js 1 2 3 4` just prints `1234`.

Let's try debugging again. Fire up the debugger again and head to the third line, where the addition goes on.

```bash
$ node inspect index.js 1 2 3 4 # notice how we can pass arguments
< Debugger listening on ws://127.0.0.1:9229/0db8e855-c117-4511-a022-ab5c908cff46
< For help, see: https://nodejs.org/en/docs/inspector
<
< Debugger attached.
<
 ok
Break on start in index.js:1
> 1 const numbers = process.argv.slice(2);
  2 const sum = (a, b) => a + b;
  3 let out = numbers.reduce(sum);
debug> n
break in index.js:2
  1 const numbers = process.argv.slice(2);
> 2 const sum = (a, b) => a + b;
  3 let out = numbers.reduce(sum);
  4 console.log(out);
debug> n
break in index.js:3
  1 const numbers = process.argv.slice(2);
  2 const sum = (a, b) => a + b;
> 3 let out = numbers.reduce(sum);
  4 console.log(out);
  5
debug>
```

Now, instead of going to the next line, we can `step` into the line so we know what exactly is going on.

Pressing `s` will move us back to the `sum` call. Now, we can watch `a` and `b`.

```bash
debug> step
break in index.js:2
  1 const numbers = process.argv.slice(2);
> 2 const sum = (a, b) => a + b;
  3 let out = numbers.reduce(sum);
  4 console.log(out);
debug> watch('a')
debug> watch('b')
debug> watchers
  0: a = '1'
  1: b = '2'
debug>
```

We just spotted the second bug! We are trying to add two strings of numbers, instead of strings. Let's fix that right away by converting all the strings to numbers:

```javascript
const numbers = process.argv.slice(2).map(Number);
const sum = (a, b) => a + b;
let out = numbers.reduce(sum);
console.log(out);
```

Running this program `node index.js 1 2 3 4` will now correctly output 10. Yay!

## Wrap!

The Node.js builtin debugger can be a life-saver when you don't have a proper IDE at hand. You should take a moment to check out the [official documentation](https://nodejs.org/api/debugger.html) for the debugger so you can understand the rest of the features. You could even build your own client!

What's your favourite debugging tool? 👀
