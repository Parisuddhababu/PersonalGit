"use client";

import { NEXT_PUBLIC_SOCIAL_MEDIA_WINDOW_ORIGIN } from "@/config/app.config";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";
import { useSearchParams } from "next/navigation";
import { useEffect, } from "react";
import { useDispatch } from "react-redux";

const YoutubeAuth = () => {
  const dispatch = useDispatch();
  const params = useSearchParams();

  useEffect(() => {
    dispatch(setLoadingState(true))
    console.log(params?.get('code'), 'CODE')
    if (params?.get('code')) {
      window.opener.postMessage({ code: params?.get('code'), platform: "LinkedIn" }, '*');
      window.close()
      return
    }
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77niswamrlsqma&scope=r_liteprofile,w_member_live,w_organization_live,r_organization_live,w_member_live,r_organization_admin&redirect_uri=${NEXT_PUBLIC_SOCIAL_MEDIA_WINDOW_ORIGIN}/linkedin-auth/`
  }, [])

  return (
    <h2 className="text-center">Connecting to LinkedIn...</h2>
  );
};

export default YoutubeAuth;
