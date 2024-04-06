---
social_image: null
main_image: null
tags: cheatsheet, npm
published_at: 2021-05-19T09:56:19.918Z
---

# How to build an npm package using TypeScript, Jest, and XO

> This is not an article which describes the steps in detail or describes why you need to use TypeScript, Jest, or XO; It is just meant to be a cheatsheet based on my experience which helps to get things done quickly. Also note that this does not include any steps on creating READMEs and related files.

Enough talk, let's start!

- Create a folder
   ```sh
   mkdir project-name && cd project-name
   ```
- Initialise Git
   ```sh
   git init
   ```
- Write a `.gitignore`
   ```
   node_modules/

   # Build files
   lib/
   ```
- Initialise npm
   ```sh
   npm init
   ```
- Install TypeScript
   ```sh
   npm install --save-dev typescript
   ```
- Create a `tsconfig.json`
   ```sh
   {
       "compilerOptions": {
           "target": "es5",
           "module": "commonjs",
           "declaration": true,
           "outDir": "./lib",
           "strict": true,
           "esModuleInterop": true
       },
       "include": ["src"],
       "exclude": ["node_modules", "**/__tests__/*"]
   }
   ```
- Write your code in `src/index.ts`
- Add your build script in `package.json`
   ```json
   {
       // ...
       "scripts": {
           "build": "tsc",
           "test": "echo 'error no test specified' && exit 0"
       }
       // ...
   }
   ```
- Build your code
   ```sh
   npm run build
   ```
- Initialise XO
  ```sh
  npm i -g xo # If you haven't already

  npm init xo
  ```
- Add your lint script in `package.json`
   ```json
   {
      // ...
       "scripts": {
           "build": "tsc",
           "lint": "xo --fix",
           "test": "echo 'error no test specified' && exit 0"
       }
       // ...
   }
   ```
- Lint your code
   ```sh
   npm run lint
   ```
- Add the `files` property in your `package.json`
   ```json
   {
       // ...
       // Whitelisting is better than blacklisting everything
       "files": [
           "lib/**/*"
       ],
       // ...
   }
   ```
- Install Jest 
   ```
   npm install --save-dev jest ts-jest @types/jest
   ```
- Create a `jestconfig.json`
   ```json
   {
      "transform": {
          "^.+\\.(t|j)sx?$": "ts-jest"
      },
      "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
      "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"]
   }
   ```
- Add your test script in `package.json`
   ```json
   {
       // ...
       "scripts": {
           "build": "tsc",
           "lint": "xo --fix",
           "test": "jest --config jestconfig.json"
       }
       // ...
   }
   ```
- Write tests in `src/__test__/`
- Run tests
   ```sh
   npm run test
   ```
- Add some more scripts
   ```json
   {
       // ...
       "scripts": {
           // Previous ones...
           "prepare" : "npm run build",
           "prepublishOnly" : "npm run test && npm run lint",
           "preversion" : "npm run lint",
           // You could also add "version" and "preversion" scripts to push to github, but I prefer doing it manually 
       }
       // ...
   }
   ```
- Update your `package.json` file with proper entries
    - Don't forget to set `main` to `lib/index.js`
    - Update all other things as necessary.
- Commit all changes
- Publish
- Repeat!
