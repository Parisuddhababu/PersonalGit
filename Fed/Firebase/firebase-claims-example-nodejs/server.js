const express = require('express');
const app = express();
app.disable('x-powered-by');
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false });
let firebaseAdmin = require('firebase-admin');

/**
 * Environment Configuration
 */
const dotenv = require('dotenv');
dotenv.config();

// Fire base Initialization
const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.APP_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.APP_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.APP_FIREBASE_PRIVATE_KEY
      ? JSON.parse(process.env.APP_FIREBASE_PRIVATE_KEY)
      : undefined,
  }),
  databaseURL: process.env.APP_FIREBASE_DATABASE_URL,
});

app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
  res.redirect('signup.html');
});

app.post('/signup', urlencodedParser, async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let role = req.body.role;
  if (typeof role === 'string') {
    role = [req.body.role];
  }

  // Add New User to firebase
  const newCreatedUserToken = await firebaseAdmin
    .auth()
    .createUser({
      email: email,
      password: password,
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(error, 'Error');
    });

  // Adding Custom claims to currently created users
  firebaseAdmin
    .auth()
    .setCustomUserClaims(newCreatedUserToken.uid, {
      permissions: role,
    })
    .then(() => {})
    .catch(function (error) {
      console.log('Error adding Claims:', error);
      process.exit();
    });
  res.redirect('signupSucess.html');
});

app.listen(3001);
