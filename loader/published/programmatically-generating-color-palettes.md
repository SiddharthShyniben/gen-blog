---
social_image: null
main_image: null
tags: css, design, javascript, color
published_at: 2021-06-07T14:09:18.635Z
---

# Programmatically generating color palettes

You may have seen color palettes like the [Material Palette](https://material.io/design/color/the-color-system.html#:~:text=2014%20Material%20Design,Design%20color%20palettes) or the [tailwind colors](https://tailwindcss.com/docs/customizing-colors). Well, I wanted to know how these were generated and wanted to generate my own too. Here's how I did it.

## The Base Colors

This was the easiest one because I could just [use `hsl`](https://dev.to/siddharthshyniben/why-hsl-is-better-3inl) to adjust the hue by a certain step. So we get `hsl(0, 50%, 50%)`, `hsl(20, 50%, 50%)`, `hsl(40, 50%, 50%)`

![Base colors](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8kq88u0ojl9zd0kppd6u.png)
<figcaption>That was easy enough</figcaption>

## The rest of the palette

Then, I thought of iterating over the saturation to brighten or darken the colors. So I iterated again, adding in 10 to the value, but there was always grey at the start of every color.

![Color palette with grey at the start](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/v5rhodyhl7xwi0dfn9uz.png)
 <figcaption>Not quite right</figcaption>

Tweaking the loop gave me this final palette:

{% codepen https://codepen.io/SiddharthShyniben/pen/JjWLBYe %}

Not the best, but OK by my standards

