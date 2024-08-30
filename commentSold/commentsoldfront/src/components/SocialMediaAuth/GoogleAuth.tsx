import React, { useEffect, useRef, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin, CodeResponse, NonOAuthError } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";
import { toast } from "react-toastify";
import { Message } from "@/constant/errorMessage";
import { IYoutubeAuthCred } from "@/types/pages";
import { useSearchParams } from "next/navigation";
import "@/styles/pages/my-account.scss";
import { IGooglePopupFailType } from "@/types/components";

const GoogleSignIn: React.FC<{ scope: string; redirectUri: string }> = ({ scope, redirectUri }) => {
  const dispatch = useDispatch();
  const youtubeBtnRef = useRef<HTMLButtonElement>(null);
  const [showTryAgainBtn, setShowTryAgainBtn] = useState(false);
  const params = useSearchParams();

  const handleGooglePopupRes = (type: IGooglePopupFailType) => {
    switch (type) {
      case "popup_failed_to_open":
        setShowTryAgainBtn(true);
        alert(Message.YOUTUBE_POPUP_BLOCKED);
        break;
      case "popup_closed":
        window.close();
        break;
      default:
        setShowTryAgainBtn(true);
        alert(Message.YOUTUBE_LOGIN_FAILED);
        break;
    }
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse: CodeResponse) => {
      if (codeResponse?.code) {
        if (codeResponse?.code) {
          window.opener.postMessage({ code: codeResponse.code, platform: "Youtube" }, params.get("subDomain"));
          window.close();
        }
      }
    },
    onError: () => {
      toast.error(Message.YOUTUBE_LOGIN_FAILED);
    },
    onNonOAuthError: (nonOAuthError: NonOAuthError) => {
      handleGooglePopupRes(nonOAuthError?.type);
    },
    flow: "auth-code",
    scope,
    redirect_uri: redirectUri,
    state: "state_parameter_passthrough_value",
    enable_serial_consent: true,
  });

  useEffect(() => {
    showTryAgainBtn ? dispatch(setLoadingState(false)) : dispatch(setLoadingState(true));
  });

  useEffect(() => {
    if (!youtubeBtnRef) return;
    youtubeBtnRef.current?.click();
  }, [youtubeBtnRef.current]);

  return (
    <div className="youtube-auth text-center">
      <h2 className="spacing-30">{showTryAgainBtn ? "If you not get login form please try again." : "Waiting for response..."}</h2>
      <button
        type="button"
        ref={youtubeBtnRef}
        className={`btn btn-secondary ${showTryAgainBtn ? "" : "opacity"}`}
        onClick={() => {
          setShowTryAgainBtn(false);
          login();
        }}
      >
        {!showTryAgainBtn ? "Waiting for response..." : "Try Again"}
      </button>
    </div>
  );
};

const GoogleAuth: React.FC<IYoutubeAuthCred> = ({ clientId, scope, redirectUri }) => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleSignIn scope={scope} redirectUri={redirectUri} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
