---
social_image: null
main_image: null
tags: javascript, webdev, tutorial
published_at: 2021-06-02T16:09:11.909Z
---

# Let's build a VDOM!

> Please check out my [previous post which explains what the VDOM is](https://dev.to/siddharthshyniben/what-is-the-virtual-dom-let-s-build-it-5070) if you don't know what the VDOM is.

Alright, now that we know what the VDOM is, let's build it!

So, we need to be able to do 4 things:

- Create a Virtual Node (I'll just call it vnode).
- Mount (load) a VDOM
- Unmount a VDOM
- Patch (compare two vnodes and figure out the difference and then mount)

Alright, let's go!

## Creating a vnode

This is basically just a utility function

```js
function createVNode(tag, props = {}, children = []) {
    return { tag, props, children}
}
```
> In Vue (and many other places) this function is called `h`, short for `hyperscript`. But I choose to give it a better name

## Mounting a vnode

By mounting, I mean appending the vnode to any container like `#app` or any other place it should be mounted.

This function will recursively walk through all of the nodes' children and mount them to the respective containers.

Note that all the following code is to be placed in the mount function.

```js
function mount(vnode, container) { ... }
```

1. Create a DOM Element

```js
const element = (vnode.element = document.createElement(vnode.tag))
```

You may be thinking what `vnode.element` is. It's just a small property which is set internally so we can know which element is the parent of the vnode

2. Set all attributes from the props object

We can just loop over them
```js
Object.entries(vnode.props || {}).forEach([key, value] => {
    element.setAttribute(key, value)
})
```

3. Mount the children.

There are two cases to handle:
- The `children` is just text
- The `children` are an array of vnodes

```js
if (typeof vnode.children === 'string') {
    element.textContent = vnode.children
} else {
    vnode.children.forEach(child => {
        mount(child, element) // Recursively mount the children
    })
}
```

4. Finally, we have to append the stuff to the DOM

```js
container.appendChild(element)
```

Here is the final result

```js
function mount(vnode, container) { 
    const element = (vnode.element = document.createElement(vnode.tag))

    Object.entries(vnode.props || {}).forEach([key, value] => {
        element.setAttribute(key, value)
    })

    if (typeof vnode.children === 'string') {
        element.textContent = vnode.children
    } else {
        vnode.children.forEach(child => {
            mount(child, element) // Recursively mount the children
        })
    }

    container.appendChild(element)
}
```

## Unmounting a vnode

Unmounting is as simple as removing an element from the DOM:

```js
function unmount(vnode) {
    vnode.element.parentNode.removeChild(vnode.element)
}
```

## Patching a vnode

This is (only comparatively) the most complex function we have to write. It basically find out the difference between two vnodes and only patch the changes.

This time, I will put the explanation in the code comments, so be sure to read through it!

Let's go!

```js
function patch(VNode1, VNode2) {
    // Assign the parent DOM element
    const element = (VNode2.element = VNode1.element);

    // Now we have to check the difference between the two vnodes

    // If the nodes are of different tags, assume that the whole content has changed.
    if (VNode1.tag !== VNode2.tag) {
        // Just unmount the old node and mount the new node
        mount(VNode2, element.parentNode)
        unmount(Vnode1)
    } else {
        // Nodes have same tags
        // So we have two checks remaining
        // - Props
        // - Children

        // I am not going to check the props for now because it would just lengthen the post and miss the point. I might write a third article which contains the full implementation

        // Checking the children
        // If the new node has a string for children
        if (typeof VNode2.children == "string") {
            // If the two children are **strictly** different
            if (VNode2.children !== VNode1.children) {
                element.textContent = VNode2.children;
            }
        } else {
            // If the new node has an array of children
            // - The length of children is the same
            // - The old node has more children than the new one
            // - The new node has more children than the old one

            // Find out the lengths
            const children1 = VNode1.children;
            const children2 = VNode2.children;
            const commonLen = Math.min(children1.length, children2.length)

            // Recursively call patch for all the common children
            for (let i = 0; i < commonLen; i++) {
                patch(children1[i], children2[i])
            }

            // If the new node has fewer children
            if (children1.length > children2.length) {
                children1.slice(children2.length).forEach(child => {
                    unmount(child)
                })
            }

            // If the new node has more children
            if (children2.length > children1.length) {
                children2.slice(children1.length).forEach(child => {
                    mount(child, element)
                })
            }

        }
    }
}
```

And that's it! This is a ***really*** basic version of a vdom implementation just so you can grasp the concept. There's a few more stuff left to do, including checking the props and some more speed improvements. 

For now let's render a VDOM!

Let's go back to out really old `generateList` example. For our vdom implementation, we could do something like this:

```js
function generateList(list) {
    let children = list.map(child => createVNode("li", null, child));

    return createVNode("ul", { class: 'fruits-ul' }, children)
}

mount(generateList(["apple", "banana", "orange"]), document.querySelector("#app")/* any selector */)
```

Here is a pen:

{% codepen https://codepen.io/SiddharthShyniben/pen/MWpQrwM %}
