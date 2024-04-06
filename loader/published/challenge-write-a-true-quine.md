---
social_image: null
main_image: null
tags: challenge, javascript
published_at: 2021-05-08T10:16:12.072Z
---

# Challenge: Write a true quine

By a true quine I mean a real true quine. Maybe the wikipedia article of quine will help:

{% wikipedia https://en.wikipedia.org/wiki/Quine_(computing) %}

So no evals or reading the source like this:
```javascript
function quine() { console.log(quine.toString()+" quine();") } quine();
```

Can you do it? 

{% details If you need a hint %} The wikipedia article contains a Java Quine {% enddetails %}