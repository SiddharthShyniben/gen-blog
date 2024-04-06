---
social_image: null
main_image: null
tags: 
published_at: 2021-06-06T10:39:17.060Z
---

# Building a compiler – what we are aiming for

> Check out the [previous post](https://dev.to/siddharthshyniben/building-a-compiler-basic-setup-43de) for some basic setup

First things first, sorry for delaying the code again!

Now, before we start, I wanted to clear up what exactly we are aiming at creating. I like to call it EnglishScript. The main things I want to convert are:

- Primitives (`"strings"`, `123` numbers)
- Variable declarations
  ```js
  // Normal js style
  let x = 12;
  // "English" style™
  let x be 12
  let the variable x be 12
  ```