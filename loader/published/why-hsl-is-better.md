---
social_image: null
main_image: null
tags: 
published_at: 2021-06-03T09:16:39.588Z
---

# Why `hsl` is better

I prefer `hsl` over `rgb`. It's really impossible to get colors manually using `rgb`. `hsl(h, s, l)`/`hsla(h, s, l, a)` is really easy to understand.

- `h` - **Hue:** The hue. It's the only thing you actually need to know. Think of it like a color wheel. Around 0<sup>o</sup> and 360<sup>o</sup> are reds. 120<sup>o</sup> is where greens are and 240<sup>o</sup> are blues. Use anything in between 0-360. Values above and below will be modulus 360.
- `s` - **Saturation:** 0% is completely desaturated (grayscale). 100% is fully saturated (full color).
- `l` - **Lightness:** 0% is completely dark (black). 100% is completely light (white). 50% is average lightness.
- `a` - **Alpha:** Opacity/Transparency value. 0 is fully transparent. 1 is fully opaque. 0.5 is 50% transparent.

You can hand-manipulate any of those four values and have a decent idea of what's going to take place. Change the hue to take a journey around the color wheel. Change the saturation to get deeper or more muted hues. Change the lightness to essentially mix in black or white.

You may know what `rgb(0, 0, 0)` and `rgb(255, 0, 0)` is, but creating a sea blue and going a bit darker or getting a deep yellow isn't exactly math.

`hsl` is also easy to manipulate with JavaScript. You could create a color scheme from a hue by adjusting the saturation and lightness.

## Example

According to what I said, if you set hue to 240, you get blue. So I just took 240 as the hue, and `50%` as the saturation and the lightness, and I got this pleasing blue:

![Blue](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z23prtln5p3rm3clmzem.png)
 
Which looks way better than the `#0000ff` blue. 

![Base Blue](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h9zek8r1bnwjld51x2i5.png)

Here's a red (`hsl(0, 50%, 50%)`) and a green (`hsl(120, 50%, 50%)`)

![Red](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cke5gxtpkh5meigv6j3o.png)
![Green](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bqihrgbuulf9rvnbn04q.png)