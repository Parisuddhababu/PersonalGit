import { NEXT_PUBLIC_SOCIAL_MEDIA_WINDOW_ORIGIN } from "@/config/app.config";
import { IUseChildEventHandlerProps } from "@/types/hooks";
import { getPopupStyleCustomization } from "@/utils/helpers";
import { useEffect } from "react";

const useChildEventHandler = ({ fbCallback, youtubeCallback, linkedInCallback }: IUseChildEventHandlerProps) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event?.data?.platform === "Facebook" && event?.data?.response) {
        // responseFacebook(event.data);
        fbCallback(event.data.response);
      }

      if (event?.data?.platform === "Youtube" && event?.data?.code) {
        youtubeCallback(event?.data?.code);
      }
      if (event?.data?.platform === "LinkedIn" && event?.data?.code) {
        linkedInCallback(event?.data?.code);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const sentDataToChildForFacebook = async (socialConnection: { appId: string; scope: string }, redirectUri: string) => {
    //Live
    const childWindow = window.open(`${NEXT_PUBLIC_SOCIAL_MEDIA_WINDOW_ORIGIN}/facebook-auth?subDomain=${window.origin}`, "childWindow", getPopupStyleCustomization());
    setTimeout(() => {
      childWindow?.postMessage(
        {
          appId: socialConnection?.appId,
          scope: socialConnection?.scope,
          redirectUri: redirectUri,
        },
        NEXT_PUBLIC_SOCIAL_MEDIA_WINDOW_ORIGIN
      );
    }, 3000);

    //Local
    // const childWindow = window.open(`http://localhost:3000/facebook-auth?subDomain=${window.origin}`, "childWindow", getPopupStyleCustomization());
    // if (childWindow) {
    //     childWindow.onload = () => {
    //       setTimeout(() => {
    //         childWindow.postMessage(
    //           {
    //             appId: socialConnection?.appId,
    //             scope: socialConnection?.scope,
    //             redirectUri: redirectUri,
    //           },
    //           'http://localhost:3000'
    //         );
    //       }, 2000);
    //     };
    //   } else {
    //     console.error("Failed to open child window.");
    //   }
  };

  const sendDataToChildForYoutube = async (youtubeCred: { clientId: string; scope: string; redirectUri: string }) => {
    const childWindow = window.open(`${NEXT_PUBLIC_SOCIAL_MEDIA_WINDOW_ORIGIN}/youtube-auth?subDomain=${window.origin}`, "childWindow", getPopupStyleCustomization());
    setTimeout(() => {
      childWindow?.postMessage(
        {
          clientId: youtubeCred?.clientId,
          scope: youtubeCred?.scope,
          redirectUri: NEXT_PUBLIC_SOCIAL_MEDIA_WINDOW_ORIGIN,
        },
        NEXT_PUBLIC_SOCIAL_MEDIA_WINDOW_ORIGIN
      );
    }, 3000);

    //Local Test
    // const childWindow = window.open(`http://localhost:3000/youtube-auth?subDomain=${window.origin}`, "childWindow", getPopupStyleCustomization());
    // setTimeout(() => {
    //   console.log( {
    //     clientId: youtubeCred?.clientId,
    //     scope: youtubeCred?.scope,
    //     redirectUri: WHI_DEMO_URL,
    //   }, "@@ parent ");
    //   childWindow?.postMessage(
    //     {
    //       clientId: youtubeCred?.clientId,
    //       scope: youtubeCred?.scope,
    //       redirectUri: WHI_DEMO_URL,
    //     },
    //     "http://localhost:3000"
    //   );
    // }, 2000);
  };
  const sendDataToChildForLinkedIn = async () => {
    window.open(`${NEXT_PUBLIC_SOCIAL_MEDIA_WINDOW_ORIGIN}/linkedin-auth?subDomain=${window.origin}`, "childWindow", getPopupStyleCustomization());
    //Local Test
    // const childWindow = window.open(`http://localhost:3000/youtube-auth?subDomain=${window.origin}`, "childWindow", getPopupStyleCustomization());
    // setTimeout(() => {
    //   console.log( {
    //     clientId: youtubeCred?.clientId,
    //     scope: youtubeCred?.scope,
    //     redirectUri: WHI_DEMO_URL,
    //   }, "@@ parent ");
    //   childWindow?.postMessage(
    //     {
    //       clientId: youtubeCred?.clientId,
    //       scope: youtubeCred?.scope,
    //       redirectUri: WHI_DEMO_URL,
    //     },
    //     "http://localhost:3000"
    //   );
    // }, 2000);
  };

  return {
    sentDataToChildForFacebook,
    sendDataToChildForYoutube,
    sendDataToChildForLinkedIn,
  };
};

export default useChildEventHandler;
