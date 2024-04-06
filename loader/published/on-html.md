---
social_image: null
main_image: null
tags: html, css, frameworks
published_at: 2021-06-03T07:36:34.840Z
---

# On HTML

Just a few days ago, my Angular CLI broke, and I was forced to code some [stuff](https://siddharthshyniben.github.io/webdown) in plain old HTML – No transpiling, no compiling, no build tools other than my hands on the keyboard.

It was a simple task, but I was bent on building it in Angular. But I couldn't and had to write it in plain HTML.

This made me think – If I had used Angular for such a small task,
- The code would be _wayyyy_ bigger, because of all the Angular stuff
- I'm 99% sure that it would have taken _wayyyy_ more time to build – It almost felt like I wrote the app in HTML in the same time it takes for Angular to create a project using `ng new` 😃

Writing HTML felt tremendously liberating. It felt nice to write the actual HTML, CSS, and JavaScript which will be delivered to the end users.

Don't get me wrong – I absolutely recognize why complex pipelines are important for complex websites. If you're part of a big group, you in all likelihood want to have processes in place so that everyone can contribute to the codebase in a consistent way.

But that setup isn’t appropriate for each website. And all those equipment and techniques which are supposed to save time every now and then waste time down the road. Ever had to revisit a project after, say, six or twelve months? Maybe you just want to make one little change to the CSS. But you can’t because a dependency is broken. So you try to update it. But it relies on a different version of Node. Before you know it, you’re Bryan Cranston changing a light bulb. You should be tweaking one line of CSS but instead, you’re [battling entropy](https://blog.jim-nielsen.com/2020/cheating-entropy-with-native-web-tech/).

I think we should cut down. No more [weighty](https://dev.to/leoat12/the-nodemodules-problem-29dc) `node_modules`; just crispy HTML, CSS and JavaScript