---
social_image: null
main_image: null
tags: node, javascript
published_at: null
---

# 10 NodeJS projects you can do to test your knowledge on every level

Whenever you code, you must learn to use everything at the disposal of your framework/language. You must learn to use all built-in functionality, everything you can do without reinventing the wheel or reaching out for an extra library.

The best way to test your skill at this is to build new projects. So here, I will show you 10 NodeJS projects which you can build to test your skill.

## Quick note about the build

When you are building, try to only use built-in modules. This may not be possible _everywhere_ (You can't rewrite a websocket library!) but try your maximum.

1. **Build a local notes app to learn the basics**

    This is a simple project you can build to learn the basics. Your app should be able to read notes as arguments from the terminal. The notes can be written to a local file. Users should be able to delete, update, and list notes. Bonus points if you figure out how to build an interactive prompt!

    **What you can learn**

    When you build this project, you will learn to make use of `process.argv` to parse command line arguments. You will then learn how to use the `fs` library to write files. You may also use the `readline` module to make interactive prompts.

    You may also learn about `require` and other stuff when you want to separate the logic of your app.

2. **Learn how to build servers in NodeJS by building a small note API**

    This project will teach you how to setup servers which can accept requests. This app should be able to read and write data to a JSON file which contains notes (possibly the notes from the previous project on this list). There should be 4 types of requests allowed:

    - **GET** all notes or a note by ID
    - **POST** a new note
    - **PUT** or **PATCH** an existing note to update it
    - **DELETE** a note

    **What you can learn**

    You will learn how to setup servers, listen for requests, respond to requests, and other server related things.

3. **Increase your file system game by building a file manager**
<!-- In a localhost or terminal -->

4. **Go realtime by building a Chat app**
<!-- socket.io -->

5. **Start authenticating with a user management system**
<!-- With UI -->

6. **Up your realtime game with a collaborative document 
editing app**
<!-- CSS -->

7. **Increase your server skills by building a RSS reader**
<!-- Readline -->

8. **Dig into the terminal by building a compression CLI**

9. **Dive headfirst into headless Chromium by building an automatic form filler**

10. **Bring everything together with an eCommerce platform**