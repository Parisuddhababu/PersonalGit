import { useEffect } from "react";
import APPCONFIG from "../../config/app";
import { IsBrowser } from "../../utils";

export interface IFacebookLoginSignupProps {
  onClose: (data: any) => void;
}

const FacebookLogin = ({ onClose }: IFacebookLoginSignupProps) => {
  const initializeFacebook = () => {
    if (window["FB"]) {
      // Intialize facebook
      window["FB"].init({
        appId: APPCONFIG.facebookAppId,
        cookie: true,
        xfbml: true, // parse social plugins on this page
        version: "v13.0", // Specify the Graph API version to use,
        scope: "name,email,first_name,last_name",
      });
    }
  };

  useEffect(() => {
    if (IsBrowser) {
      initializeFacebook();
    }
  }, []);

  // check current user is login
  const checkLoginState = () => {
    if (IsBrowser) {
      window["FB"].getLoginStatus(function (response: any) {
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
        window["FB"].api("/me", { fields: "name,email,first_name,last_name" }, function (response: any) {
          onClose(response);
        });
      } else {
        // Open login Popup window
        window["FB"].login(
          function (response: any) {
            if (response.authResponse) {
              checkLoginState();
            } else {
              console.log("User cancelled login or did not fully authorize.");
            }
          },
        );
      }
    }
  };
  return (
    <button type="button" onClick={checkLoginState} className="btn btn-secondary btn-w-full btn-left-icon">
      <span className="icon-facebook-fill"></span>
      Sign In with Facebook
    </button>
  );
};

export default FacebookLogin;
