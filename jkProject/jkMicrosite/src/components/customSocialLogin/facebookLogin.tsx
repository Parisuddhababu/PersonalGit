import { encryptDecrypt } from "@components/Hooks/paymentGatewayKey/usePaymentGatewayKey";
import { IsBrowser } from "@util/common";
import { useEffect } from "react";

export interface IFacebookLoginSignupProps {
  // eslint-disable-next-line
  onClose: (data: any) => void;
  buttonLabel?: string;
  facebookId?: string;
  type?: number | string;
}

const FacebookLogin = ({
  onClose,
  buttonLabel,
  facebookId,
  type = 1,
}: IFacebookLoginSignupProps) => {
  const initializeFacebook = async () => {
    if (window["FB" as any]) {
      // Intialize facebook
      // @ts-ignore
      window["FB" as any].init({
        appId: encryptDecrypt(facebookId),
        cookie: false,
        xfbml: true, // parse social plugins on this page
        version: "v14.0", // Specify the Graph API version to use,
        scope: "name,email,first_name,last_name",
      });
      //   window["FB"].logout();
    }
  };

  useEffect(() => {
    if (IsBrowser) {
      initializeFacebook();
    }
    // eslint-disable-next-line
  }, []);

  // check current user is login
  const checkLoginState = () => {
    if (IsBrowser) {
      // @ts-ignore
      window["FB" as any].getLoginStatus(function (response) {
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
        // @ts-ignore
        window["FB" as any].api(
          "/me",
          { fields: "name,email,first_name,last_name" },
          function (response: any) {
            onClose(response);
          },
          {
            scope: "email",
          }
        );
      } else {
        // Open login Popup window
        initializeFacebook();

        // @ts-ignore
        window["FB" as any].login(
          function (response: any) {
            if (response.authResponse) {
              checkLoginState();
            }
          },
          { scope: "email" }
        );
      }
    }
  };
  return (
    <div className="access-links-link facebook" onClick={checkLoginState}>
      <a>
        <i className="jkm-meta-fill-square facebook"></i>
        {
          type == 1 ? (
            <span className="social-icon-text">
              {buttonLabel ? buttonLabel : "Sign In with Facebook"}
            </span>
          ) : (
            <span>Sign In with Facebook</span>
          )
        }
      </a >
    </div >

    // <button type="button" onClick={checkLoginState} className="btn btn-secondary btn-w-full btn-left-icon">
    //   <span className="jkm-facebook-fill"></span>
    //   {buttonLabel ? buttonLabel : 'Sign In with Facebook'}
    // </button>
  );
};

export default FacebookLogin;
