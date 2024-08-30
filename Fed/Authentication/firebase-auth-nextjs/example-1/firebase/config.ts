import Cookies from "js-cookie";

const TWELVE_DAYS_IN_MS = 12 * 60 * 60 * 24 * 1000;
export const firebaseConfig = {
  debug: false,
  appPageURL: "/",
  authPageURL: "/login",
  firebaseAdminInitConfig: {
    credential: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
        : undefined,
    },
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || '',
  },
  firebaseClientInitConfig: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  },
  cookies: {
    name: "example-1",
    httpOnly: false,
    maxAge: TWELVE_DAYS_IN_MS,
    overwrite: true,
    path: "/",
    sameSite: "lax",
    secure: "true",
    signed: false,
  },
  tokenChangedHandler: async (authUser: any) => {
    let response;
    // If the user is authed, call login to set a cookie.
    if (authUser.id) {
      const userToken = await authUser.getIdToken();
      const token = Cookies.get("useSwyft.AuthUserTokens");
      // check if token not get then call login and set the token
      if (!token) {
        response = await fetch("/api/login", {
          method: "POST",
          headers: {
            Authorization: userToken,
          },
          credentials: "include",
        });
        if (!response.ok) {
          const responseJSON = await response.json();
          throw new Error(
            `Received ${
              response.status
            } response from login API endpoint: ${JSON.stringify(
              responseJSON,
            )}`,
          );
        }
      }
      return response;
    }
    // If the user is not authed, call logout to unset the cookie.
    response = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      const responseJSON = await response.json();
      throw new Error(
        `Received ${
          response.status
        } response from logout API endpoint: ${JSON.stringify(responseJSON)}`,
      );
    }

    return response;
  },
};

