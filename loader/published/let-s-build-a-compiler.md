---
social_image: null
main_image: null
tags: 
published_at: 2021-06-05T14:11:40.176Z
---

# Let's build a compiler!

# Discontinued! 
Sorry, but I made too many mistakes while teaching this tutorial and so I have decided to discontinue this series

Let's build a super simple compiler!

In this series, I am going to show you how to build a compiler. This post is going to contain all the metadata for this series, and the next post onwards will explain all the concepts and stuff.

## Why should I care?

- There are tons of compilers around you, and many important concepts can be taken from them.
  ![What I cannot create, I do not understand](https://pbs.twimg.com/media/DeC-SV5W4AEDegt.png)
- It's a fun side project (my reason)
- You might create a simple language which is faster to code in than javascript and save some time!

## But they seem scary!

According to [the super tiny compiler](https://github.com/jamiebuilds/the-super-tiny-compiler#but-compilers-are-scary)

> Yes, they are. But that's our fault (the people who write compilers), we've taken something that is reasonably straightforward and made it so scary that most think of it as this totally unapproachable thing that only the nerdiest of the nerds are able to understand.

## Ok Ok, I'm in, what exactly are we building?

We are going to build a compiler (basically a function which takes a string as input). The compiler compiles english like syntax into javascript. So if we:

|      Had to...     |      We would...      |
|--------------------|-----------------------|
| Declare a variable | `let the variable variableName be 12.` |

This may seem like nothing, but it is enough to show how a compiler works and its major parts. Edit: I \*will\* stop on this compiler after showing you the first part because I got an idea for another compiler

That's all for now, see you in the next part!