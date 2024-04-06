---
social_image: null
main_image: null
tags: css, logic
published_at: 2021-04-11T08:31:25.888Z
---

# Conditional logic with CSS – The CSS custom property trick.

The whole world of conditional logic and bulk toggling in CSS only exists because of one tiny footnote in the CSS spec. 

[That line](https://www.w3.org/TR/css-variables-1/#syntax:~:text=Note%3A%20While%20%3Cdeclaration%2Dvalue%3E%20must%20represent%20at,one%20token%20may%20be%20whitespace.) is:

> Note: While <declaration-value> must represent at least one token, that one token may be whitespace.

That means `--foo: ;` is valid.

Now, this doesn’t read as some massive revelation that unlocks huge doors, but it is! Now we have the capability to make conditional statements all in CSS!

Here's a demo:

{% codepen https://codepen.io/SiddharthShyniben/pen/QWdaevQ default-tab=css,result %}

<sup><small>_(Open the pen in a new tab and resize to see the full effect)_</small></sup>

Let me explain: 

* There is a breakpoint setup here at 350px. This is where the variable `--color` changes from `initial` to an empty space
* When the browser window is wider than 350px, the value of `--color` is `initial`
    * That makes the variable `--color-when-small` contain two values: `initial` and `red` which is **invalid**. (This is not exactly correct and I'm writing it like this for simplicity. See [this comment](https://dev.to/afif/comment/1dalp))
    * So when we actually set the color and call that variable like `background-color: var(--color-when-small, var(--color-when-big));`, the **second** value (the fallback) is used because the first is invalid.
* When the browser window is narrower than 350px, the value of `--color` is a space.
    * That makes the variable `--color-when-small` contain the value `"(space)red"`, which is **valid**
    * So when we actually set the color and call that variable like `background-color: var(--color-when-small, var(--color-when-big));`, the **first** value is used

So, now we can flip the color between two values by changing a placeholder variable. I hope that clicks for you.

When we see this as simply changing a single value, it’s almost like _ok, you’ve found a really complex way to change some padding, but you could have just changed the padding in the media query._ But the trick is that now we have this placeholder variable that has changed and we can key into that to change unlimited other values.

We could have a single media query (or set of media queries) in our CSS that only toggles these placeholder variables and we use elsewhere to toggle values. That could be nice and clean compared to sprinkling media queries all over the CSS. It’s a proper toggle in CSS, like a form of IF/THEN logic that we haven’t quite had before.

For example, imagine we had a border for our earlier coloured div. Instead of changing the border directly in the media query, we can use the custom property again to change the border. 

Here is an example: 

{% codepen https://codepen.io/SiddharthShyniben/pen/yLgvBOd default-tab=css,result %}

<sup><small>_(Open the pen in a new tab and resize to see the full effect)_</small></sup>

If we were creating a complex card, this could come in handy.

This is not just for media queries. CSS trickery master Lea Verou has [set her sights](https://lea.verou.me/2020/10/the-var-space-hack-to-toggle-multiple-values-with-one-custom-property/?) on this too:

> What if I told you you could use a single property value to turn multiple different values on and off across multiple different properties and even across multiple CSS rules?

It’s the same trick!

This opens up a lot of possibilities in CSS. We could do AND, OR, XOR, NOR etc. with this trick. But I'm leaving that for you to find. 

Thanks for reading!