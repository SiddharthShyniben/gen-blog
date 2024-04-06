---
title: A new way to build CSS frameworks with... TailwindCSS?
tags: [css, tailwindcss]
slug: tailwind-css-custom-frameworks
cover: https://picsum.photos/1600/900
cta: Tailwind gives us all the tools to create our own frameworks!
date: 2021-06-21
---

TailwindCSS has a great color scheme, good default styles, a way to remove unused classes, a way to make custom classes, and lots more. It would be the greatest thing if we could use its styles to make our own CSS frameworks. Guess what, we can!

I haven't done it yet, but the main steps look like so: 

- Use tailwind's `@apply` to create your classes
- Create an HTML file (which will be used for purging unused classes)
- Run Tailwind (using PostCSS or whatever)

That's it! You will get a new CSS file with your framework ready to use. 

There are a few more things you could try:

- Wanna use any of tailwind's built-in classes? Just add the classes to any elements in the HTML file I mentioned before, and they won't be removed from the CSS!
- Dig into the tailwind config files to get more stuff like dark mode, custom color schemes, plugins, and more!
- You got more ideas? Comment them down below!

I think this is the same approach that tailwindui is using.
