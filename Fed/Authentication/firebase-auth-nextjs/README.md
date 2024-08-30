# Next Firebase Auth

- ### Purpose & Usage:

  > Purpose of this package is while you need to authentication using firebase and your next js application is `Server side` then only you need to use this package

  > This package also worked for `Client side` rendering app but it is not given much more output as compare to `Server side` rendering the app

  > So we suggest whenever your application is `Server side` then only used it

  > This Package make your authentication simple and get the firebase user details and it's token

- ### prerequisite:

  - Node version: v16.16.0
  - NPM version: 9.6.7

### How We Can Used In Other Application

- Firebase V8

```
$ npm i next-firebase-auth
```

- Firebase V9

```
npm i next-firebase-auth@canary
```

### Configuration

| Options                  | Required or Optional | Description                                                        | Example                                               |
| ------------------------ | -------------------- | ------------------------------------------------------------------ | ----------------------------------------------------- |
| authPageURL              | Optional             | Login Page Url                                                     | '/login'                                              |
| appPageURL               | Optional             | Home page Url                                                      | '/dashboard'                                          |
| loginAPIEndpoint         | Required             | Login api end point                                                | '/api/login'                                          |
| logoutAPIEndpoint        | Required             | Logout api end point                                               | '/api/logout'                                         |
| onLoginRequestError      | Optional             | function that handle login request error                           | onLoginRequestError: (err) => { console.error(err) }  |
| onLogoutRequestError     | Optional             | function that handle logout request error                          | onLogoutRequestError: (err) => { console.error(err) } |
| firebaseAuthEmulatorHost | Optional             | firebase local server url                                          | 'localhost:9001'                                      |
| firebaseAdminInitConfig  | Required             | It is having Object of firebase credentails and database Url       | Please check below Firebase Admin Init Config         |
| firebaseClientInitConfig | required             | it is having a object of Firebase client application configuration | Please check below Firebase Client Init Config        |
| cookies                  | required             | It is having a object of cookies that can be used                  | Please check below Configuration of Cookies           |
| onVerifyTokenError       | Optional             | function that handle error while verifying token                   | onVerifyTokenError: (err) => { console.error(err) }   |
| onTokenRefreshError      | Optional             | function that handle error while refresh firebase token            | onTokenRefreshError: (err) => { console.error (err) } |

> ### Firebase Admin Init Config

| Options     | Required or Optional | Description                                                    | Example                                        |
| ----------- | -------------------- | -------------------------------------------------------------- | ---------------------------------------------- |
| credential  | required             | it is having a object of project id, client email, private key | Please check below Firebase Credentails Config |
| databaseURL | required             | firebase database url                                          | 'https://my-example-app.firebaseio.com'        |

> ### Firebase Credentail Config

| Options     | Required or Optional | Description                                                                       | Example                                   |
| ----------- | -------------------- | --------------------------------------------------------------------------------- | ----------------------------------------- |
| projectId   | required             | firebase project key                                                              | 'example-app-id'                          |
| clientEmail | required             | firebase client email (not your email address insted of firebase generated email) | 'example@example-app.gserviceaccount.com' |
| privateKey  | required             | firebase private key, this key can not accessible on client side                  | '1313-dfaf-1231'                          |

> ### Firebase Client Init Config

| Options     | Required or Optional | Description                     | Example                                 |
| ----------- | -------------------- | ------------------------------- | --------------------------------------- |
| apiKey      | required             | firebase api key                | 'MyExampleApiKey123'                    |
| authDomain  | optional             | firebase auth domain url        | 'example-app.firebaseapp.com'           |
| databaseURL | optional             | firebase database url           | 'https://my-example-app.firebaseio.com' |
| projectId   | optional             | firebase project id of your app | 'example-app-id'                        |

> ### Cookies Configuration
>
> | Options   | Required or Optional | Description                                                            | Example                                                    |
> | --------- | -------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- |
> | name      | Required             | Cookies Name that you can set                                          | 'ExampleApp'                                               |
> | keys      | Optional             | Key are required unless you set the signed to false, keys having array | [ 'CurrentKey', 'PreviousKey ]                             |
> | httpOnly  | optional             | cookies can read httpOnly, boolean value                               | true                                                       |
> | maxAge    | Required             | Cookies can be store to particular time                                | 12 _ 60 _ 60 _ 24 _ 1000 // twelve day                     |
> | overwrite | optional             | If cookies change then it can be overwrite if true                     | true                                                       |
> | path      | required             | cookies setting path                                                   | 'myapp/'                                                   |
> | sameSite  | required             | cookies can be used only same site                                     | 'strict'                                                   |
> | secure    | required             | store your cookies in encrypted formate                                | true // set this to false in local (non-HTTPS) development |
> | signed    | required             | used for the keys checking, value boolena                              | true                                                       |

### Full Example of Configuration

```
// ./initAuth.js
import { init } from 'next-firebase-auth'

const initAuth = () => {
  init({
    authPageURL: '/auth',
    appPageURL: '/',
    loginAPIEndpoint: '/api/login', // required
    logoutAPIEndpoint: '/api/logout', // required
    onLoginRequestError: (err) => {
      console.error(err)
    },
    onLogoutRequestError: (err) => {
      console.error(err)
    },
    firebaseAuthEmulatorHost: 'localhost:9099',
    firebaseAdminInitConfig: {
      credential: {
        projectId: 'my-example-app-id',
        clientEmail: 'example-abc123@my-example-app.iam.gserviceaccount.com',
        // The private key must not be accessible on the client side.
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      },
      databaseURL: 'https://my-example-app.firebaseio.com',
    },
    // Use application default credentials (takes precedence over fireaseAdminInitConfig if set)
    // useFirebaseAdminDefaultCredential: true,
    firebaseClientInitConfig: {
      apiKey: 'MyExampleAppAPIKey123', // required
      authDomain: 'my-example-app.firebaseapp.com',
      databaseURL: 'https://my-example-app.firebaseio.com',
      projectId: 'my-example-app-id',
    },
    cookies: {
      name: 'ExampleApp', // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: true, // set this to false in local (non-HTTPS) development
      signed: true,
    },
    onVerifyTokenError: (err) => {
      console.error(err)
    },
    onTokenRefreshError: (err) => {
      console.error(err)
    },
  })
}

export default initAuth
```

### Initialize Firebase Auth

- How to initialize firebase auth in your next js project
- Open a \_app.tsx file or open a your application root page
- add given below code on this page

```
import initAuth from '../initAuth' // your firebase configuration file
initAuth();
```

### Create a login api for accessing, storing Cookies

- Create a new folder inside a `pages` folder and give it's name `api`
- After creating a folder of api create new file inside a `pages/api/` folder and give it's name `login.ts`
- Write down below code for setting a cookies

```
import { setAuthCookies } from 'next-firebase-auth'
import initAuth from '../../initAuth' // Firebase configration

initAuth()

const handler = async (req, res) => {
  try {
    await setAuthCookies(req, res)
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.' })
  }
  return res.status(200).json({ success: true })
}

export default handler
```

### Create a logout api for remove Cookies

- Create a new folder inside a `pages` folder and give it's name `api`
- After creating a folder of api create a new file inside a `pages/api/` folder and give it's name `logout.ts`
- Write down below code for remove a cookies from you app

```
import { unsetAuthCookies } from 'next-firebase-auth'
import initAuth from '../../initAuth' // Firebase configuration

initAuth()

const handler = async (req, res) => {
  try {
    await unsetAuthCookies(req, res)
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.' })
  }
  return res.status(200).json({ success: true })
}

export default handler
```

### How we can used Authenticated User details in our page or How we can render page only on if User is Authenticated

```
// ./pages/demo
import React from 'react'
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'

const Demo = () => {
  const AuthUser = useAuthUser()
  return (
    <div>
      <p>Your email is {AuthUser.email ? AuthUser.email : 'unknown'}.</p>
    </div>
  )
}

// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserTokenSSR()()

export default export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Demo)
```

### Available Options (Api or methods)

1. init(config)

   - Initialize next firebase auth before used any other methods

2. withAuthUser({ ...options })

   - A higher order function that provide a AuthUser context to a component

3. whenAuthed

   - If user is authenticated then it will take a `AuthAction.RENDER` or `AuthAction.REDIRECT_TO_APP`
   - Default Value: `AuthAction.RENDER`

4. whenAuthedBeforeRedirect

   - The action to take while waiting for the browser to redirect. Relevant when the user is authenticated and `whenAuthed` is set to `AuthAction.REDIRECT_TO_APP`. One of: `AuthAction.RENDER` or `AuthAction.SHOW_LOADER` or `AuthAction.RETURN_NULL`.
   - Default Value: `AuthAction.RETURN_NULL`

5. whenUnauthedBeforeInit

   - The action to take if the user is not authenticated but the Firebase client JS SDK has not yet initialized. One of: `AuthAction.RENDER`, `AuthAction.REDIRECT_TO_LOGIN`, `AuthAction.SHOW_LOADER`.
   - Default Value: `AuthAction.RENDER`

6. whenUnauthedAfterInit

   - The action to take if the user is not authenticated and the Firebase client JS SDK has already initialized. One of: `AuthAction.RENDER`, `AuthAction.REDIRECT_TO_LOGIN`

7. appPageURL

   - Redirect Destination page URL when we should to redirect to app: `config.appPageURL`

8. authPageURL

   - Redirect Destination page URL when we should to redirect to login page: `config.authPageURL`

9. LoaderComponent
   - The component to render when the user is unauthed and `whenUnauthedBeforeInit` is set to `AuthAction.SHOW_LOADER`

> Here Given below example show redirect to login page if user is not authenticated after init

```
import { withAuthUser, AuthAction } from 'next-firebase-auth'

const DemoPage = () => <div>My demo page</div>

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/my-login-page/',
})(DemoPage)
```

> Here's an example of a login page that shows a loader until Firebase is initialized, then redirects to the app if the user is already logged in:

```
import { withAuthUser, AuthAction } from 'next-firebase-auth'

const MyLoader = () => <div>Loading...</div>

const LoginPage = () => <div>My login page</div>

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  LoaderComponent: MyLoader,
})(LoginPage)
```

### Typescript

```
// /pages/demo.tsx
import { VFC } from 'react'
import { Loading } from 'components/Loading/Loading'
import { AuthAction, withAuthUser } from 'next-firebase-auth'

type DemoDataType = {
  name: string
}

const Demo: VFC<DemoDataType> = ({ name }) => {
  return <div>Hello {name}!</div>
}

export default withAuthUser<DemoDataType>({ // <--- Ensure that the type is provided
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loading,
})(Demo)
```

> withAuthUserTokenSSR({ ...options })(getServerSidePropsFunc = ({ AuthUser }) => {})

- A higher-order function that wraps a Next.js pages's getServerSideProps function to provide the AuthUser context during server-side rendering. Optionally, it can server-side redirect based on the user's auth status.

| Options      | Description                                                                                                        | Default value      |
| ------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------ |
| whenAuthed   | The action to take if the user is authenticated. Either `AuthAction.RENDER` or `AuthAction.REDIRECT_TO_APP`.       | AuthAction.RENDER  |
| whenUnauthed | The action to take if the user is not authenticated. Either `AuthAction.RENDER` or `AuthAction.REDIRECT_TO_LOGIN`. | AuthAction.RENDER  |
| appPageURL   | The redirect destination URL when we should redirect to the app. A PageURL.                                        | config.appPageURL  |
| authPageURL  | The redirect destination URL when we should redirect to the login page. A PageURL.                                 | config.authPageURL |

### Example

```
import { withAuthUser, AuthAction } from 'next-firebase-auth'

const DemoPage = ({ thing }) => <div>The thing is: {thing}</div>

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  // Optionally, get other props.
  const token = await AuthUser.getIdToken()
  const response = await fetch('/api/my-endpoint', {
    method: 'GET',
    headers: {
      Authorization: token,
    },
  })
  const data = await response.json()
  return {
    props: {
      thing: data.thing,
    },
  }
})

export default withAuthUser()(DemoPage)
```

> withAuthUserSSR({ ...options })(getServerSidePropsFunc = ({ AuthUser }) => {})

- Behaves nearly identically to withAuthUserTokenSSR, with one key difference: it does not validate an ID token.
- Instead, it simply uses the `AuthUser` data from a cookie. Consequently

  1. It does not provide an ID token on the server side. The `AuthUser` provided via context will resolve to null when you call `AuthUser.getIdToken()`.
  2. It does not need to make a network request to refresh an expired ID token, so it will, on average, be faster than `withAuthUserTokenSSR`.
  3. It does not check for token revocation. If you need verification that the user's credentials haven't been revoked, you should always use `withAuthUserTokenSSR`.

> useAuthUser() Hooks

- Example

```
import { useAuthUser, withAuthUser } from 'next-firebase-auth'

const Demo = () => {
  const AuthUser = useAuthUser()
  return (
    <div>
      <p>Your email is {AuthUser.email ? AuthUser.email : 'unknown'}.</p>
    </div>
  )
}

export default withAuthUser()(Demo)
```

> setAuthCookies(req, res)

- Sets cookies to store the authenticated user's info. Call this from your "login" API endpoint.
- Cookies are managed with cookies. See the config for cookie options.
- The req argument should be an IncomingMessage / Next.js request object. The res argument should be a ServerResponse / Next.js response object. It requires that the Authorization request header be set to the Firebase user ID token, which this package handles automatically.
- This can only be called on the server side.

> unsetAuthCookies(req, res)

- Unsets (expires) the auth cookies. Call this from your "logout" API endpoint.
- The req argument should be an IncomingMessage / Next.js request object. The res argument should be a ServerResponse / Next.js response object.
- This can only be called on the server side.

> verifyIdToken(token) => Promise<AuthUser>

- Verifies a Firebase ID token and resolves to an AuthUser instance. This serves a similar purpose as Firebase admin SDK's `verifyIdToken`.

  ### Auth UserActions

  | Options           | Type                                |
  | ----------------- | ----------------------------------- | -------- | ------ |
  | id                | string `or` null                    |
  | email             | string `or` null                    |
  | emailVerified     | boolean                             |
  | phoneNumber       | string `or` null                    |
  | displayName       | string `or` null                    |
  | photoURL          | string `or` null                    |
  | claims            | object                              |
  | getIdToken        | Function => Promise<String`or`null> |
  | clientInitialized | boolean                             |
  | firebaseUser      | FirebaseUser `or` null              |
  | signOut           | Function => Promise<void>           |
  | PageURL           | String                              | Function | Object |

> AuthAction

- An object that defines rendering/redirecting options for withAuthUser and withAuthUserTokenSSR.

  1. `AuthAction.RENDER`: render the child component

  2. `AuthAction.SHOW_LOADER`: show a loader component

  3. `AuthAction.RETURN_NULL`: return null instead of any component

  4. `AuthAction.REDIRECT_TO_LOGIN`: redirect to the login page

  5. `AuthAction.REDIRECT_TO_APP`: redirect to the app

### Dyamic Redirect

```
// ./utils/initAuth.js
import { init } from 'next-firebase-auth'
import absoluteUrl from 'next-absolute-url'

const initAuth = () => init({
  // This demonstrates setting a dynamic destination URL when
  // redirecting from app pages. Alternatively, you can simply
  // specify `authPageURL: '/auth-ssr'`.
  authPageURL: ({ ctx }) => {
    const isServerSide = typeof window === 'undefined'
    const origin = isServerSide
      ? absoluteUrl(ctx.req).origin
      : window.location.origin
    const destPath =
      typeof window === 'undefined' ? ctx.resolvedUrl : window.location.href
    const destURL = new URL(destPath, origin)
    return `auth-ssr?destination=${encodeURIComponent(destURL)}`
  },

  // This demonstrates setting a dynamic destination URL when
  // redirecting from auth pages. Alternatively, you can simply
  // specify `appPageURL: '/'`.
  appPageURL: ({ ctx }) => {
    const isServerSide = typeof window === 'undefined'
    const origin = isServerSide
      ? absoluteUrl(ctx.req).origin
      : window.location.origin
    const params = isServerSide
      ? new URL(ctx.req.url, origin).searchParams
      : new URLSearchParams(window.location.search)
    const destinationParamVal = params.get('destination')
      ? decodeURIComponent(params.get('destination'))
      : undefined

    // By default, go to the index page if the destination URL
    // is invalid or unspecified.
    let destURL = '/'
    if (destinationParamVal) {
      // Verify the redirect URL host is allowed.
      // https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/11-Client_Side_Testing/04-Testing_for_Client_Side_URL_Redirect
      const allowedHosts = ['localhost:3000', 'nfa-example.vercel.app']
      const allowed =
        allowedHosts.indexOf(new URL(destinationParamVal).host) > -1
      if (allowed) {
        destURL = destinationParamVal
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `Redirect destination host must be one of ${allowedHosts.join(
            ', '
          )}.`
        )
      }
    }
    return destURL
  },

  // ... other config
}

export default initAuth
```

### Live Demo Link & Example Repo & Official Doc link

> https://nfa-example.vercel.app/

> https://github.com/gladly-team/next-firebase-auth/tree/main/example

> https://github.com/gladly-team/next-firebase-auth
