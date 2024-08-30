"use client";

import GoogleAuth from "@/components/SocialMediaAuth/GoogleAuth";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";
import { IYoutubeAuthCred } from "@/types/pages";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const YoutubeAuth = () => {
  const dispatch = useDispatch();
  const params = useSearchParams();
  const [youtubeCred, setYoutubeCred] = useState<IYoutubeAuthCred>();

  useEffect(() => {
    const handleMessage = function (event: MessageEvent) {
      if (event.origin === params.get("subDomain") && event?.data?.clientId && event?.data?.redirectUri && event?.data?.scope) {
        setYoutubeCred(event.data);
      }
    };
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [params.get("subDomain")]);

  useEffect(()=>{
     youtubeCred ? dispatch(setLoadingState(false)) :  dispatch(setLoadingState(true))
  },[youtubeCred])

  return (
    <>
      {!youtubeCred && <h2 className="text-center">Connecting to Youtube...</h2>}
      {youtubeCred && <GoogleAuth clientId={youtubeCred?.clientId} scope={youtubeCred?.scope} redirectUri={youtubeCred?.redirectUri} />}
    </>
  );
};

export default YoutubeAuth;
