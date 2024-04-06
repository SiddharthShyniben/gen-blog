---
social_image: null
main_image: null
tags: tutorial, javascript, webdev
published_at: 2021-06-02T05:05:35.813Z
---

# What is the Virtual DOM? (Let's build it!)

You might have heard of the Virtual DOM (and also the Shadow DOM). You may have even used it (JSX is basically sugar for the VDOM). If you want to learn more about it, you've come to the right place!

In this tutorial, I am giong to show you what a Virtual DOM is, and (probably in the next part of this series) show you how we can implement our own. So let's go!

## What is a Virtual DOM?

DOM Manipulation is really heavy. The difference may seem small when doing it once (about ~0.4ms difference between assigning a property to an object) but it adds up over time.

```js
// Assigning a property to an object 1000 times
let obj = {};
console.time("obj");
for (let i = 0; i < 1000; i++) {
  obj[i] = i;
}
console.timeEnd("obj");

// Manipulating dom 1000 times
console.time("dom");
for (let i = 0; i < 1000; i++) {
  document.querySelector(".some-element").innerHTML += i;
}
console.timeEnd("dom");
```

When I ran the above snippet, I found that the first loop took about ~3ms while the second one took **~41ms**.

Now let's take a real life example. 

```js
function generateList(list) {
    let ul = document.createElement('ul');
    document.getElementByClassName('.fruits').appendChild(ul);

    fruits.forEach(function (item) {
        let li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += item;
    });

    return ul;
}

document.querySelector("ul.some-selector").innerHTML = generateList(["Banana", "Apple", "Orange"])
```

So far so good. Now, if the array changes and we have to re-render, we do this:

```js
document.querySelector("ul.some-selector").innerHTML = generateList(["Banana", "Apple", "Mango"])
```

See what's going wrong?

**Even though only one element has to be changed, we change the whole thing because _we are lazy_**

That's why the Virtual DOM was created. 

I know you have been waiting for long, so let's get to the point.

### What _is_ the Virtual DOM?

The Virtual DOM is the representation of the DOM as an object. So if you have the following HTML:

```html
<div class="contents">
    <p>Text here</p>
    <p>Some other <b>Bold</b> content</p>
</div>
```

It can be written as the following VDOM object:

```js
let vdom = {
    tag: "div",
    props: { class: 'contents' },
    children: [
        {
            tag: "p",
            children: "Text here"
        },
        {
            tag: "p",
            children: ["Some other ", { tag: "b", children: "Bold" }, " content"]
        }

    ]
}
```

> Note that there might be more properties in real life and this is a simplified version.

I'm pretty sure that was self explanatory, especially if you have used React. If not:
- The VDOM is basically an object with 
  - A property called `tag` (sometimes also called `type`) which is basically the tag's name
  - A property named `props` which contains all props
  - A property named `children` which is either 
    - A string if the contents are just text
    - An array of VDOMs if the contents contain elements

We use the VDOM like so: 
- We make a change to the VDOM instead of the DOM
- A function checks all the differences between the DOM and the VDOM and changes **only what has really changed**
- The VDOM which has just been used for changing stuff is marked as the latest change, so that we can just **compare the VDOMs next time which saves even more**

## What are the benefits?

I'm pretty sure you already now, but here's a practical example. Let's take our previous `generateList` function and improve it:

```js
function generateList(list) {
    // VDOM generating stuff which I will explain later...
}

patch(oldUL, generateList(["Banana", "Apple", "Orange"]));
```

Don't mind the patch function, it basically appends the changes to the DOM.

Now when we change the DOM again in the future:

```js
patch(oldUL, generateList(["Banana", "Apple", "Mango"]));
```

The patch function finds out that only the third `li` has changed and **only the third `li` is changed instead of changing _all three elements_**

That's all for what the VDOM is, and in the next part I will show you how we can implement the VDOM