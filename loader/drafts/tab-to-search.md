---
social_image: null
main_image: null
tags: productivity, tutorial
published_at: null
---

# Let's add tab to search to our website!

You may have used it on a chromium based browser – type out the link of a website, and hit tab to search the site. Works for GitHub, DEV, StackOverflow, Google, Twitter, `npmjs.org`, etc. In this post, I am going to show you how to implement tab to search for your own site.

### 1. Method one: Create a form, and \*hope\* that chromium picks up on it and uses it.

Yes. You can literally create a form (with a few restrictions) and if you are lucky Chromium will recognize it and use it. 

The (main) restrictions:
- The form must generate a `GET`
- The form must result in an `HTTP` url
- The form must not have an onsubmit script(!)
- There must be only one input element with type text.
- No passwords, files or text areas. 
- All other input elements must be in their default state.

OK, not the best way. 

### 2. Method two: Link to an [OSDD](https://developer.mozilla.org/en-US/docs/Web/OpenSearch)

Just create an xml file called `osdd.xml` (or whatever) and put the following code in it:

```xml
<?xml version="1.0"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
    <ShortName>Search My Site</ShortName>
    <Description>Search My Site</Description>
    <Url type="text/html" method="get" template="http://my_site/{searchTerms}"/>
</OpenSearchDescription>
```

And then link to it in your html file like so:

```html
<head>
    <link type="application/opensearchdescription+xml" rel="search" href="url_of_osdd_file"/>
</head>
```

And you are good to go!

You can test mine [here](https://siddharthshyniben.github.io/tab-to-search/). Or if you don't want to, just see the gif below:

![tab-to-search](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4xtettvgyj7faqp61qm7.gif)
 

There's more info on this [here](https://www.chromium.org/tab-to-search). Thanks for reading!