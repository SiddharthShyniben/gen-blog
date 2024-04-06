---
social_image: null
main_image: null
tags: 
published_at: 2021-06-06T09:25:03.471Z
---

# Building a compiler – basic concepts

> Be sure to check out the [previous part](https://dev.to/siddharthshyniben/let-s-build-a-compiler-11c3) for more info on this series

Let's talk about how a compiler works.

Most compilers seperate their work into three parts:

- **Parsing** is taking raw code and turning it into a more abstract representation of the code
- **Transformation** is taking the abstract structure and _transforming_ it into something more like the language you want to compile to
- **Code Generation** is generating code from the transformed structure

## Parsing

Parsing typically gets broken down into 2 steps;

- **Lexical analysis** takes the raw code and splits it apart into these things called tokens by a thing called a tokenizer (or lexer).

  Tokens are basically objects which show a piece of the code and what it is. They could be numbers, variables, punctuation. operators, whatever
  
- **Syntactic analysis** takes the tokens and adds more meaning to them

  For example, It's not very helpful to see a number followed by an operator followed by an operator in it's raw form; It makes more sense to group them together and that's exactly what this step does.
  
  The output of this step is an Abstract Syntax Tree.
  An abstract syntax tree, or AST, is a deeply nested object which gives us a lot of info about the code in a way which is easier to work with.
  
For the following syntax:

```js
let the variable x be 1 + 2;
```

The tokens might look like this:

```json
[
    { "type": "identifier", "value": "let"      },
    { "type": "extrapunct", "value": "the"      },
    { "type": "extrapunct", "value": "variable" },
    { "type": "identifier", "value": "x"        },
    { "type": "punctuator", "value": "be"       },
    { "type": "number",     "value": "1"        },
    { "type": "punctuator", "value": "+"        },
    { "type": "number",     "value": "2"        }
]
```

And the AST may look like this:
```json
{
    "type": "Program",
    "body": [
        {
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "x"
                    },
                    "init": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "NumericLiteral",
                            "value": "1"
                        },
                        "operator": "+",
                        "right": {
                            "type": "NumericLiteral",
                            "value": "2"
                        }
                    }
                }
            ],
        }
    ],
}
```

If you read through this you should get a good idea of what this means.

## Transformation

The next thing to do is to transform the AST. This step just takes the AST from the last step and makes changes to it. The kind of manipulation depends on the compiler. We can manipulate the AST in the same language (TypeScript for example) or we can translate into a different language (our case).

Since we are compiling to a new language, we'll focus on creating an entire new AST that is similar to the target language. More on this later.

### Moving through the AST

We need to be able to navigate through all the parts of an AST. We do so depth-first, i.e we go deeper and deeper through the first part (or **node**) until we reach it's end, then go to the next node.

So for the following AST:

```jsonc
{
    "type": "Program", // (1)
    "body": [
        {
            "type": "VariableDeclaration", // (2)
            "declarations": [
                {
                    "type": "VariableDeclarator", // (3)
                    "id": { // (4)
                        "type": "Identifier",
                        "name": "x"
                    },
                    "init": { // (5)
                        "type": "BinaryExpression", // (6)
                        "left": { 
                            "type": "NumericLiteral", // (7)
                            "value": "1"
                        },
                        "operator": "+", // (8)
                        "right": {
                            "type": "NumericLiteral", // (9)
                            "value": "2"
                        }
                    }
                }
            ],
        }
    ],
}
```

We would go like this:
- `Program` _(1)_ – The top level
- `VariableDeclaration` _(2)_ – The first node in `Program`
- `VariableDeclarator` _(3)_ – The first declaration
- `id` _(4)_ – The name of the variable being declared
- `init` _(5)_ – Whatever the variable is initialized to
- `BinaryExpression` _(6)_ – We are initializing an expression (with two sides, so binary) which is 1 _(7)_ + _(8)_ 2 _(9)_

If we were directly manipulating this AST, we would have to make all sorts of changes, but visiting each node is enough for creating a new AST.

I use the word "visiting" is because there is this pattern of how to represent  operations on elements of an object structure.


#### Visitors

The basic idea here is that we are going to create a "visitor" object that has methods which will handle different nodes.

```js
const visitor = {
    NumberLiteral() {},
    CallExpressiom() {}
}
```

When we traverse the AST, we can call the methods on this visitor whenever we "visit" a node of a matching type.

We also want to pass in the node and a reference to the parent node

```js
const visitor = {
    NumberLiteral(parent, node) {},
    CallExpressiom(parent, node) {}
}
```

But there's a few cases we need to talk about. Let's take our previous AST:

- `Program`
    - `VariableDeclaration`
        - `VariableDeclarator`
            - `Identifier`
        - `init`
            - `BinaryExpression`
                - `NumericLiteral`
                - `NumericLiteral`

At some point we are gonna reach a dead end in the tree, so we have to go up a level or "exit". So going down the tree we "enter" each node and going up we "exit".

- -> `Program` (enter)
    - -> `VariableDeclaration` (enter)
        - -> `VariableDeclarator` (enter)
            - -> `Identifier` (enter)
            - <- `Identifier` (exit)
        - <- `VariableDeclarator` (exit)
        - -> `init` (enter)
            - -> `BinaryExpression` (enter)
                - -> `NumericLiteral` (enter)
                - <- `NumericLiteral` (exit)
                - -> `NumericLiteral` (enter)
                - <- `NumericLiteral` (exit)
            - <- `BinaryExpression` (exit)
        - <- `init` (exit)
    - <- `VariableDeclaration` (exit)
- <- `Program` (exit)

So, to support this, we need to change our `visitor` one last time

```js
const visitor = {
    NumberLiteral: {
        enter(parent, node) {},
        exit(parent, node) {},
    },
    // Rest of the stuff
}
```

## Code generation

The last thing to do is to generate code. This may sometimes overlap with transformation, but most of the time it is just taking our final AST and stringifies it into code.

Code generators work several different ways, some compilers reuse the tokens from earlier, others will have created a separate AST so that they can print nodes linearly, but from what I can tell most will use the same AST we just created, which is what we’re going to focus on.

 Effectively our code generator will know how to "print" all of the different node types of the AST, and it will recursively call itself to print nested nodes until everything is printed into one long string of code.
 
 ------------
 And that's it! That's all the different pieces of a compiler. 
 
 Every compiler won't look the same way. Compilers have many purposes, but some of them may need more steps than shown here. But you should have a high level idea of what compilers look like.
 
 Now that I’ve explained all of this, you’re all good to go write your own compilers right? 
 
 Just kidding, that's what I'm here to help with :P
 
 So we'll begin in the next part! 