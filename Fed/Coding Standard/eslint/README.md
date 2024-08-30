# ES Lint

ESLint is a static code analysis tool for identifying and fixing problems in JavaScript code. Its primary purpose is to enforce code quality and consistency within a codebase.

- ### Purpose:

  1. Code Quality and Consistency:

     - Static Analysis
     - Coding Standards

  2. Error Prevention

  3. Readability and Maintainability

  4. Custom Rules & Configurability

  5. Integration with Development Workflow

  6. Compatibility with ECMAScript Versions

     - Support for Latest ECMAScript Features

  7. Tool Integration

     - IDE and Editor Integration
     - Command Line Usage

### Usage & Installing command

> Using NPM

```
$ npm install eslint --save-dev
```

> Using Yarn

```
$ yarn add eslint --dev
```

---

> Step 1: Create a .eslintrc.json file or hit below command directly

```
$ npx eslint --init
```

- After hiting the above given command the will ask some question to setup the eslint based on your project requirement gives that question answer

> Question asked

1. How would you like to use ESLint?

   Ans: Problem

2. What type of modules does your project use?

   Ans: esm

3. Which framework does your project use?

   Ans: React

4. Does your project use TypeScript?

   Ans: Yes

5. Where does your code run?

   Ans: Web

6. What format do you want your config file to be in?

   Ans: JSON

---

> Step 2: Open Your project package.json file and inside a script tag

```
"scripts": {
    ...other config
    "lint": "eslint .",
    "lint:fix": "eslint --fix"
  },
```

---

> Step 3: Igoner Build and node modules folder

- Inside a .eslintrc.json file you need to specify your build folder path and node module folder path like given below

```
ignorePatterns: ["node_modules/", "build/"]
```

## You can check with demo of auto-complete
