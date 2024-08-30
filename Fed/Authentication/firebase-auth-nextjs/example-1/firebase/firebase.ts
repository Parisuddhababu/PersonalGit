import { init } from "next-firebase-auth";
import { getAuth } from "firebase/auth";

import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import { firebaseConfig } from "./config";


const initAuth = () => {
  init(firebaseConfig);
};

const app: FirebaseApp = initializeApp(firebaseConfig.firebaseClientInitConfig);
const auth: Auth = getAuth(app);

export const firebase = {
  app,
  auth,
};

export default initAuth;
