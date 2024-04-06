---
social_image: null
main_image: null
tags: 
published_at: 2021-07-08T02:57:07.307Z
---

# DEV Protip: Set the Slug of your posts

## TL;DR

When creating a post, set it's title to the slug you like and then publish it. You can change the title to the desired one later.

---

Check out the slug of this post ^ up there. Do you see it? 

The slug should have been `dev-protip-set-the-slug-of-your-posts` or something like that. But instead, it is `dev-tip-set-slug`, which is much more readable. Here, I'll show you how to set the slugs of any post.

> Note: This won't work for published posts. You have to do this when you create a new post or edit a draft.

1. **Create a Post**

    ![create-post](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zd327wxordp2wt0yba8i.png)
    <figcaption>Click on that button at the top right</figcaption>
  

2. **Set the title of the post as the slug**

    ![set-slug](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1762g5raj53vypysbchr.png)
    <figcaption>Choose a small, appropriate slug</figcaption> 

3. **Write your content and publish the post**

    You can continue writing your post's contents. Just make sure to not change the title. Once you finish, you can publish the post.

    Now, the slug will be generated from the post title.

    ![view-slug](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nh48z2mi2qeoahumfsge.png) 

4. **Fix the title**

    Now, you edit the post and set the proper title, then you can click `Save Changes`. The trick here is that if you edit the title, the [slug will not be recalculated](https://github.com/forem/forem/issues/5653).

5. **Done!**

    You can continue making changes to the title, body and tags, but the slug will never change. This is supposed to be a bug, but it can be sort of useful.

    If you want, you can view the post which I showed you in this post [here](https://dev.to/siddharthshyniben/this-is-the-slug-3079)