"use client";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";
import { FacebookLoginResponse } from "@/types/graphql/pages";
import { IFacebookDetails } from "@/types/pages";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useDispatch } from "react-redux";
import "@/styles/pages/my-account.scss";

const FacebookAuth = () => {
  const [facebookDetails, setFacebookDetails] = useState<IFacebookDetails>();
  const facebookBtnRef = useRef<HTMLButtonElement>(null);
  const params = useSearchParams();
  const dispatch = useDispatch();

  const responseFacebook = (response: FacebookLoginResponse) => {
    if (response) {
      window.opener.postMessage({ response, platform: "Facebook" }, params.get("subDomain"));
      window.close();
    }
  };

  useEffect(() => {
    window.addEventListener("message", function (event) {
      if (event.origin === params.get("subDomain") && event?.data?.appId && event?.data?.redirectUri && event?.data?.scope) {
        setFacebookDetails(event.data);
      }
    });
  }, [params.get("subDomain")]);

  useEffect(() => {
    dispatch(setLoadingState(true));
    if (facebookBtnRef.current) {
      setTimeout(() => {
        facebookBtnRef.current?.click();
      }, 2000);
    }
  }, [facebookBtnRef, facebookDetails]);

  return (
    <div className="text-center youtube-auth">
      <h2>Connecting to facebook....</h2>
      {facebookDetails && (
        <FacebookLogin
          appId={facebookDetails.appId}
          callback={responseFacebook}
          scope={facebookDetails.scope}
          render={(renderProps) => (
            <button type="button" className="btn opacity"  ref={facebookBtnRef} onClick={renderProps.onClick}>
              Connecting to facebook....
            </button>
          )}
          redirectUri={facebookDetails?.redirectUri}
        />
      )}
    </div>
  );
};

export default FacebookAuth;
