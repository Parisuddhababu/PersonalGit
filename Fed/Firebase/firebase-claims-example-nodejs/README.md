## **[Firebase Singup base on Node Js](#)**

Implementing user registration or signup functionality using Firebase Authentication in a Node.js application. Firebase Authentication is a service provided by Firebase that simplifies the process of handling user authentication, including signup, login, and account management.

### Purpose

1. User Authentication

   - Secure Signup

2. Email/Password Authentication
3. Secure Token-Based Authentication
4. Password Reset Functionality
5. Email Verification

### prerequisite:

- Node version: v16.16.0
- NPM version: 9.6.7

### Setup Project

```bash
$ npm i
$ npm run dev
```

> open a `localhost:3001` in your browser

#### Build Command

```bash
$ npm run build
```

---

### Usage & Node Js Documentation

---

> Step 1

```
npm init
```

> Step 2: Create `package.json` file

```
{
  "name": "firebase-custom-claims",
  "version": "1.0.0",
  "description": "Add Custom Claims At Singup (Adding New user in firebase with Custom Claims)",
  "main": "server.js",
  "scripts": {
    "dev": "nodemon server.js"
  },
  "author": "Akash Sanariya",
  "dependencies": {
    "body-parser": "^1.19.2",
    "express": "^4.17.1",
    "firebase-admin": "^10.0.2"
  },
  "devDependencies": {
    "dotenv": "^8.6.0",
    "nodemon": "^2.0.15"
  },
  "license": "ISC"
}
```

> Step 3: Run command

```
npm install
```

> Step 4: Create `server.js` file

```
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 * Environment Configuration
 */
const dotenv = require("dotenv");
dotenv.config();

app.use(express.static(__dirname + "/views"));

app.get("/", (req, res) => {
  res.redirect("signup.html");
});

app.post("/signup", urlencodedParser, async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let role = req.body.role;
  // Write down your logic
  res.redirect("signupSucess.html");
});

app.listen(3000)
```

> Step 5: create views folder

> Step 6: inside a view folder define your pages.

> Step 7: Running Your Application `npm run dev`

### Snapshot

![Firbase Claims Signup](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Firebase/firebase-claims-example-nodejs/Application%20Snapshot/firebase-claims-example-nodejs.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=2&versionDescriptor%5Bversion%5D=36e74b873c5c3010c7eb16e00a64473545047fc3&resolveLfs=true&%24format=octetStream&api-version=5.0)

![Firbase Claims Signup Successfull](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Firebase/firebase-claims-example-nodejs/Application%20Snapshot/firebase-claims-example-nodejs-2.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=2&versionDescriptor%5Bversion%5D=36e74b873c5c3010c7eb16e00a64473545047fc3&resolveLfs=true&%24format=octetStream&api-version=5.0)
