---
social_image: null
main_image: null
tags: javascript, tutorial
published_at: 2021-07-07T06:03:57.988Z
---

# The SUPERFLEXIBLE star rating system – the future of star rating in the Terminal

In the last few days, many people made star rating systems for the web. But nobody could build one in the terminal, so I am presenting the "star rating" that will change the ~~world~~ universe!

And I call it – **SUPERFLEXIBLE**

{% replit @SiddharthShynib/SUPERFLEXIBLEStarRating %}

![star-rating](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pdsy2j514xzf99mnr96p.gif) 

Now, why colour the whole star when you can fine-tune however the star is colored?

![Screen Shot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xm7q91awqc2i692vi9dq.png)
 
<!-- Why have it rotate when it can just be going side by side? -->

The implementation is pretty much the same as my [previous star rating](), except I have just changed the stars and hardcoded it in another file:

```js
module.exports = {
  0: 
`    A
___/_\\___
 ',. ..'
 /.'^'.\\
/'     '\\`,
  1: 
`    \u001b[31mA
\u001b[0m___\u001b[31m/_\\\u001b[0m___
 ',. ..'
 /.'^'.\\
/'     '\\`,
  2: 
`    \u001b[31mA
\u001b[0m___\u001b[31m/_\\___
 \u001b[0m',. \u001b[31m..' \u001b[0m
 /.'^'.\\
/'     '\\`,
  3: 
`    \u001b[31mA
\u001b[0m___\u001b[31m/_\\___
 \u001b[0m',. \u001b[31m..' \u001b[0m
 /.'^\u001b[31m'.\\\u001b[0m
/'     \u001b[31m'\\\u001b[0m`,
  4: 
`    \u001b[31mA
\u001b[0m___\u001b[31m/_\\___
 \u001b[0m',. \u001b[31m..' \u001b[0m
 \u001b[31m/.'^'.\\
/'     '\\\u001b[0m`,u can 
  5: 
`    \u001b[31mA
___/_\\___
 ',. ..'
 /.'^'.\\
/'     '\\\u001b[0m`
}
```

The usage is also same: `m` to increase, `l` to decrease, and `<number>` to set the rating

The beauty of this method is that you can just change the stars and the rating still works. Try changing the exports in the `stars.js` file and see how much customizability you can have.

+ **Plus big fixes** Now you can't [rate more than the max](https://dev.to/link2twenty/comment/1g325)
+ **Plus big fixes** Now you can press 0 to set the rating ot 0
+ **Plus Improvements** Everything is automated and the only thing you have to change is in the `stars.js` file. Try editing it.

Here are some alternate ratings:

**Smileys!**

![star-rating](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0tsczm8y0zcfmgfl3wrg.gif)

Go check out the [REPL](https://replit.com/@SiddharthShynib/SUPERFLEXIBLEStarRating), and try modifying the [`stars.js`](https://replit.com/@SiddharthShynib/SUPERFLEXIBLEStarRating#stars.js) file. And if you design any nice star ratings with it, let me know!

**Our old stars**

![star-rating](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9x12imb4ollmygm2icjp.gif)

**Text**

![star-rating](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ylr9ofdzlhzul7k43e7f.gif)

**Shading star** 

![star-rating](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n2p97g5ecpkt4h6sps1a.gif)

**Rocket (I couldn't help myself)** 

![star-rating](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qy5tm8h8w7iyyur8rhlv.gif)
<figcaption>I'm getting good at text art</figcaption> 

There's more! Feel free to try editing the `stars.js` file and tell me in the comments if you find nice ones!