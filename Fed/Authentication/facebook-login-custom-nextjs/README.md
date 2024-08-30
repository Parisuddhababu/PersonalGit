# Custom Facebook Login And Singup

- ### Purpose:

  - User Convenience

    - Login Efficiency
    - Signup Simplification

  - Social Integration

    - Leveraging Facebook Data

  - Trust and Security
    - Trusted Authentication
    - Reduced Password Management

- ### Usage:

  - Implementing Social Login/Signup

    - OAuth Integration

  - User Profile Data Retrieval

    - Accessing User Information

  - Personalization and Social Features

    - Tailoring User Experience

  - Error Handling and User Feedback
    - Effective Error Handling
    - Feedback on Permissions

- ### prerequisite:

  - Node version: v16.16.0
  - NPM version: 9.6.7

### How We Can Used In Other Application

- Create a new facebook.js file and add given below code in that file

```
!(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'))
```

- Create a new functions inside a utils file

```
export const IsBrowser: boolean = typeof window !== "undefined";
```

- Create a new component file for handlig login and singup anf gives it's name like `customFacebook.tsx`
- Add given below code inside that file

```
import { useEffect } from "react";

export const IsBrowser: boolean = typeof window !== "undefined";

export interface IFacebookLoginSignupProps {
  onClose: (data: any) => void;
}

const FacebookLogin = ({ onClose }: IFacebookLoginSignupProps) => {
  useEffect(() => {
    if (IsBrowser) {
      if (window["FB"]) {
        // Intialize facebook
        window["FB"].init({
          appId: "123132112312",
          cookie: true,
          xfbml: true, // parse social plugins on this page
          version: "v13.0", // Specify the Graph API version to use
        });
      }
    }
  }, []);

  // check current user is login
  const checkLoginState = () => {
    if (IsBrowser) {
      window["FB"].getLoginStatus(function (response) {
        statusChangeCallback(response);
      });
    }
  };

  // Status Change handle from the facebook
  const statusChangeCallback = (response: any) => {
    if (IsBrowser) {
      // Check facebook user is already login
      if (response.status === "connected") {
        // get logged used details.
        window["FB"].api("/me", function (response) {
          console.log("Successful login for: " + response);
          onClose(response);
        });
      } else {
        // Open login Popup window
        window["FB"].login(function (response) {
          if (response.authResponse) {
            checkLoginState();
          } else {
            console.log("User cancelled login or did not fully authorize.");
          }
        });
      }
    }
  };
  return (
    // Here you can add your button custom design
    <button type="button" onClick={checkLoginState} className="btn btn-secondary btn-w-full btn-left-icon">
      <span className="icon-facebook-fill"></span>
      Sign In with Facebook
    </button>
  );
};

export default FacebookLogin;

```

- Add button inside in any of your component

```
import FacebookLogin from "@components/customSocialLogin/facebookLogin";

const singUp = () => {

  responseFacebook = (response: any) => {
    // Here you need to handle facebook response as per your requirements
  }

  return (
    <FacebookLogin onClose={responseFacebook} />
  )
}
```

- Last You need to import js

```
<script src="YOUR_RELATIVE_JS PATH/facebook.js" defer={true} />
```

### Snapshot

![Facebook Login](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Authentication/facebook-login-custom-nextjs/Application%20Snapshot/facebook-login-custom-nextjs.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)
