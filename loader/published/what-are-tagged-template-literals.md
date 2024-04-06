---
social_image: null
main_image: null
tags: tutorial, javascript
published_at: 2021-05-16T16:01:51.162Z
---

# What are Tagged template literals?

> Quick refresher
> - Template literals are basically strings which are quoted with &#96;&#96; instead of single or double quotes.
> - You can interpolate data in them using `${}` syntax. For example, if the variable `data` is `"world"`, `Hello ${data}` will output `"Hello World"`

Tagged template literals are the next step from template literals. They are essentially functions which take a template literal as an argument, but in a special way.

## How does this function work?

Example:

```javascript
someFunction`some ${data} contained in a ${template} literal`
```

As you can see, there are no parenthesis (brackets) for the function call. And the `someFunction` is basically a regular function. 



Now let's see what kind of arguments the function gets:

{% runkit %}
// normal function to inspect the arguments
const inspector = (...args) => {
    console.log(args)
}

// Let's try it!
// First let's use an empty string
console.log(inspector&#96;hello world&#96;)
{% endrunkit %}

Hmm. We get the string as an array. Now, let's just add some interpolation before I explain how this happened: 

{% runkit %}
// normal function to inspect the arguments
const inspector = (...args) => {
    console.log(args)
}

const life = 42;

console.log(inspector&#96;hello world, life is ${life}, and some more ${life} lives&#96;)
{% endrunkit %}

Now we get:
- An array of strings
- 42
- 42

Now let me explain.

Whenever a function is called using this syntax, it get's the following arguments: 
- an array of strings. The strings are obtained by splitting the string wherever there is an interpolation (`` `Hello ${people} and the world` `` => `["Hello ", " and the world"]`)
- all the other arguments are the values of the interpolated data

Now, as this function is a normal function, it can return anything a normal function can. 

## Use cases

Now this may all seem pretty useless, but there are some uses. One could be to sanitize HTML:

```javascript
function sanitize(strings, ...args) {
    // sanitize args
    // join the strings together
    // now return safe strings
}

let userMessages = ['hi', 'what are you up to?', '<script>alert("something evil")</script>']
const sanitized = `
  <div class="chat-list">
    <ul>
      ${userMessages.map(message => sanitize`<li>${message}</li>`)}
    </ul>
  </div>
`
```

Another is CSS in JSX. I don't really use JSX, but I'm pretty sure that's what they do; Why else would they use an object?

Another (main) reason is – they are syntactic sugar. 

Example: did you know you could write `str.split("chars")` as ``string.split`chars```? You just saved a few chars – that could be useful for some code golf?