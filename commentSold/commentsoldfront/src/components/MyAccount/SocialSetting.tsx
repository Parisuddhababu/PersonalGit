import { LOCAL_STORAGE_KEY, TIKTOK_AVAILABLE_SCOPES } from "@/constant/common";
import { E_PLATFORMS } from "@/constant/enums";
import { Message } from "@/constant/errorMessage";
import { IMAGE_PATH } from "@/constant/imagePath";
import { CONNECT_TIK_TOK_AUTHORIZATION,CONNECT_LINKEDIN_AUTHORIZATION, DISCONNECT_FB, DISCONNECT_TIK_TOK, DISCONNECT_YOUTUBE, GET_SOCIAL_PAGES, SELECT_SOCIAL_PAGE } from "@/framework/graphql/mutations/socialChannels";
import {
  DISCONNECT_LINKEDIN,
  FETCH_SOCIAL_CONNECTION_DETAILS,
  GET_INSTA_ACCOUNT,
  GET_SOCIAL_CONNECTION,
  GET_TIK_TOK_AUTHORIZATION_DATA,
  LIST_OF_SOCIAL_PAGES,
  LIST_OF_YOUTUBE_CHANNELS,
  GET_LINKEDIN_AUTHORIZATION_DATA,
} from "@/framework/graphql/queries/connectChannel";
import { GET_AUTHORIZATION_CODE } from "@/framework/graphql/queries/myProfile";
import useChildEventHandler from "@/framework/hooks/socialMediaAuth/useChildEventHandler";
import { useTikAPI } from "@/framework/hooks/socialMediaAuth/useTikAPI";
import useGetActiveSocialPlatform from "@/framework/hooks/useGetActiveSocialPlatform";
import useLoadingAndErrors from "@/framework/hooks/useLoadingAndErrors";
import { CommonSliceTypes } from "@/framework/redux/redux";
import { ILinkedInAccountInfo } from "@/types/components";
import {
  DisconnectSocialPageListResponse,
  FacebookLoginResponse,
  GetSocialPageListResponse,
  GetSocialPageParam,
  GetSocialPageResponse,
  ITikTokSocialConnectionData,
  SelectSocialPageResponse,
  SocialPage,
} from "@/types/graphql/pages";
import { ITikAPIResponse } from "@/types/hooks";
import { ITikTokAuthPayload } from "@/types/pages";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const SocialSetting = () => {
  const { userDetails, userType } = useSelector((state: CommonSliceTypes) => state.common);
  const path = usePathname();
  const [getSocialPages, { loading, error }] = useMutation(GET_SOCIAL_PAGES);
  const [selectedPage, setSelectedPage] = useState("");
  const [socialPages, setSocialPages] = useState<{ value: string; label: string }[]>([]);
  const [instaAccountInfo, setInstaAccountInfo] = useState<{ instaUuid: string; instaPageName: string }>({ instaUuid: "", instaPageName: "" });
  const { data: socialConnection, loading: SLoading } = useQuery(FETCH_SOCIAL_CONNECTION_DETAILS);
  const { loading: lLoading, refetch: refetchListOfPages } = useLazyQuery(LIST_OF_SOCIAL_PAGES)[1];
  const [redirectUri, setRedirectUri] = useState("");
  const [disconnectPage, { loading: dLoading, error: dError }] = useMutation(DISCONNECT_FB);
  const [selectSocialPage, { loading: sLoading, error: sError }] = useMutation(SELECT_SOCIAL_PAGE);
  const [getInstaAccount, { loading: intaLoading, data: instaAccountData }] = useLazyQuery(GET_INSTA_ACCOUNT, { variables: { socialPageUuid: selectedPage } });
  const { loading: youtubeLoading, refetch: refetchYoutubeChannels } = useLazyQuery(LIST_OF_YOUTUBE_CHANNELS)[1];
  const [youtubeChannels, setYoutubeChannels] = useState<{ value: string; label: string }[]>([]);
  const [selectedYoutubeChannel, setSelectedYoutubeChannel] = useState<string>("");
  const [disconnectYoutubeChannel, { loading: yLoading, error: yError }] = useMutation(DISCONNECT_YOUTUBE);
  const { data: youtubeCred, loading: youtubeCredLoading } = useQuery(GET_SOCIAL_CONNECTION, { variables: { connectionName: "youtube" } });
  const [getAuthorizationCode, { loading: authorizeLoading }] = useLazyQuery(GET_AUTHORIZATION_CODE);
  const [connectToTikTok, { loading: connectToTikTokLoad, error: errorToConnectTikTok }] = useMutation(CONNECT_TIK_TOK_AUTHORIZATION);
  const { loading: fetchTikTokDataLoading, refetch: getTikTokDetails } = useLazyQuery(GET_TIK_TOK_AUTHORIZATION_DATA)[1];
  const [tikTokAccountInfo, setTikTokAccountInfo] = useState<ITikTokSocialConnectionData | null>();
  const [disConnectToTikTokAuth, { loading: disconnectToTikTokLoad, error: disconnectToTikTokErr }] = useMutation(DISCONNECT_TIK_TOK);
  const [connectLinkedin, { loading: linkedinConnectLoading }] = useMutation(CONNECT_LINKEDIN_AUTHORIZATION);
  const { loading: linkedinLoading, refetch: refetchLinkedInPage } = useLazyQuery(GET_LINKEDIN_AUTHORIZATION_DATA)[1];
  const [linkedinAccountInfo, setLinkedinAccountInfo] = useState<ILinkedInAccountInfo | null>();
  const [disConnectLinkedin, { loading: disconnectLinkedinLoad, error: disconnectLinkedinErr }] = useMutation(DISCONNECT_LINKEDIN);
  const { activePlatformList } = useGetActiveSocialPlatform();
  const loadingStates = [
    loading,
    SLoading,
    lLoading,
    dLoading,
    sLoading,
    intaLoading,
    youtubeLoading,
    youtubeCredLoading,
    authorizeLoading,
    yLoading,
    connectToTikTokLoad,
    fetchTikTokDataLoading,
    disconnectToTikTokLoad,
    linkedinConnectLoading,linkedinLoading,disconnectLinkedinLoad
  ];
  const errorStates = [error, dError, sError, yError, errorToConnectTikTok, disconnectToTikTokErr,disconnectLinkedinErr];
  useLoadingAndErrors(loadingStates, errorStates);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const currentURL = window?.location?.href;

    // Extract the domain from the URL
    const domain = new URL(currentURL).hostname;

    if (domain === "localhost" || domain === "commentsoldfront.demo.brainvire.dev") {
      setRedirectUri(currentURL);
      return;
    }
    const subdomain = window?.location?.hostname.split(".")[0];
    const _redirectUri = `https://${subdomain}.whimarketing.com/callback`; // Update with your callback URL
    setRedirectUri(_redirectUri);
  }, []);

  useEffect(() => {
    if (selectedPage) {
      fetchInstaAccountDetails(selectedPage);
    }
  }, [selectedPage, socialPages]);

  const fetchSocialPage = () => {
    refetchListOfPages().then((res) => {
      const data = res.data as GetSocialPageListResponse;
      setSocialPages(
        data?.listSocialPages?.data?.map((i: SocialPage) => {
          return {
            value: i?.uuid,
            label: i?.social_page_title,
          };
        })
      );
      const selectedPage = data?.listSocialPages?.data?.filter((i) => i?.is_selected === true);
      if (!selectedPage?.length) {
        return;
      }
      setSelectedPage(selectedPage?.[0]?.uuid ?? "");
      localStorage.setItem(LOCAL_STORAGE_KEY.facebookPage, selectedPage?.[0]?.uuid ?? "");
    });
  };

  const responseFacebook = (response: FacebookLoginResponse) => {
    if (!response?.error && response.accessToken && response.userID) {
      localStorage.setItem(LOCAL_STORAGE_KEY.facebookDetail, JSON.stringify(response));
      _getSocialPages({ accessToken: response.accessToken, facebookId: response.userID });
    }
  };

  const _getSocialPages = (param: GetSocialPageParam) => {
    getSocialPages({
      variables: param,
    }).then((res) => {
      const pages = res.data as GetSocialPageResponse;
      setSocialPages(
        pages?.getUserSocialPages?.data?.map((i: SocialPage) => {
          return {
            value: i?.uuid,
            label: i?.social_page_title,
          };
        })
      );
      fetchSocialPage();
    });
  };

  useEffect(() => {
    let tempInstaData = { instaUuid: "", instaPageName: "" };
    if (selectedPage && instaAccountData) {
      tempInstaData = { instaUuid: instaAccountData?.getInstaAccount?.data?.uuid ?? "", instaPageName: instaAccountData?.getInstaAccount?.data?.social_page_title ?? "" };
    }
    localStorage.setItem(LOCAL_STORAGE_KEY.instaAccount, JSON.stringify(tempInstaData));
    setInstaAccountInfo(tempInstaData);
  }, [instaAccountData, selectedPage]);

  const fetchInstaAccountDetails = (pageUuid: string) => {
    getInstaAccount({ variables: { socialPageUuid: pageUuid } });
  };

  const onSelect = (value: string) => {
    if (value == "select_page") {
      setSelectedPage("");
      localStorage.setItem(LOCAL_STORAGE_KEY.facebookPage, "");
      return;
    }
    selectSocialPage({
      variables: {
        selectSocialPageId: value,
      },
    }).then((res) => {
      const response = res.data as SelectSocialPageResponse;
      if (response?.selectSocialPage?.meta?.statusCode === 200) {
        localStorage.setItem(LOCAL_STORAGE_KEY.facebookPage, value);
        setSelectedPage(value);
      }
    });
  };

  const disconnectFacebook = () => {
    disconnectPage().then((res) => {
      const response = res.data as DisconnectSocialPageListResponse;
      if (response?.disconnectFacebook?.meta?.statusCode === 200) {
        setSocialPages([]);
        localStorage.removeItem(LOCAL_STORAGE_KEY.facebookPage);
      }
    });
  };

  const disConnectTikTok = () => {
    disConnectToTikTokAuth().then((res) => {
      const response = res.data;
      if (response?.disconnectTikTokAuthorizationData?.meta?.statusCode === 200) {
        setTikTokAccountInfo(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY.tikTokAccount);
      }
    });
  };

  const disConnectLinkedIn = () => {
    disConnectLinkedin().then((res) => {
      const response = res.data;
      if (response?.disconnectLinkendInAuthorizationData?.meta?.statusCode === 200) {
        setLinkedinAccountInfo(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY.linkedinData);
      }
    });
  };

  const fetchTikTokAccountDetails = () => {
    getTikTokDetails().then((res) => {
      const tikTokData = res.data?.getTikTokAuthorizationData?.data;
      if (tikTokData?.channel_name) {
        setTikTokAccountInfo(tikTokData);
        localStorage.setItem(LOCAL_STORAGE_KEY.tikTokAccount, JSON.stringify(tikTokData));
        return;
      }
      setTikTokAccountInfo(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY.tikTokAccount);
    });
  };

  const handleTikTokConnect = async (data: ITikTokAuthPayload) => {
    connectToTikTok({
      variables: {
        connectTikTokAuthorizationInputParameters: data,
      },
    })
      .then((data) => {
        if (data?.data?.connectTikTokAuthorization?.data?.channel_name) {
          fetchTikTokAccountDetails();
          toast.success(Message.TIKTOK_CONNECTED_SUCCESS);
          return;
        }
        toast.error(Message.TIKTOK_LOGIN_FAILED);
      })
      .catch(() => {
        return;
      });
  };

  const getTikTokAuthDetails = (data: ITikAPIResponse) => {
    const tikTokPayload = {
      access_token: data?.access_token,
      username: data?.userInfo?.username,
      tiktok_id: data?.userInfo?.id,
      sec_user_id: data?.userInfo?.sec_user_id,
    };

    handleTikTokConnect(tikTokPayload);
  };

  useEffect(() => {
    if (userDetails?.user_type === "2") {
      fetchSocialPage();
      fetchLinkedinPage();
    }
    if (userType !== "brand") {
      fetchYoutubeChannels();
      fetchTikTokAccountDetails();
    }
  }, [userDetails, path]);

  const fetchYoutubeChannels = async () => {
    const youtubeChannels = await refetchYoutubeChannels();

    if (youtubeChannels?.data?.listYouTubeChannels?.data?.length > 0) {
      setYoutubeChannels(
        youtubeChannels?.data?.listYouTubeChannels?.data?.map((i: SocialPage) => {
          return {
            value: i?.uuid,
            label: i?.channel_name,
          };
        })
      );

      const selectedYoutubeChannel = youtubeChannels?.data?.listYouTubeChannels?.data?.filter((i: { last_access: boolean }) => i?.last_access === true);
      if (!selectedYoutubeChannel?.length) {
        return;
      }
      setSelectedYoutubeChannel(selectedYoutubeChannel?.[0]?.uuid ?? "");
      localStorage.setItem(LOCAL_STORAGE_KEY.youtubeChannel, selectedYoutubeChannel?.[0]?.uuid ?? "");
      return;
    }

    setYoutubeChannels([]);
  };

  const fetchLinkedinPage = () => {
    // refetchLinkedInPage().then((res) => {
    //   const linkedinData = res.data?.getLinkendInAuthorizationData?.data as ILinkedInAccountInfo;
    //   if (linkedinData?.channel_name) {
    //     setLinkedinAccountInfo(linkedinData);
    //     localStorage.setItem(LOCAL_STORAGE_KEY.linkedinData, JSON.stringify(linkedinData));
    //     return;
    //   }
    //   setLinkedinAccountInfo(null);
    //   localStorage.removeItem(LOCAL_STORAGE_KEY.linkedinData);
    // });
  };


  const getAuthorizedCode = async (code: string) => {
    getAuthorizationCode({
      variables: {
        authorizationCode: code,
      },
    })
      .then((data) => {
        if (data?.data?.getAuthorizationCode?.data?.length) {
          fetchYoutubeChannels();
          toast.success(Message.YOUTUBE_CONNECTED_SUCCESS);
        }
      })
      .catch(() => {
        toast.error(Message.YOUTUBE_LOGIN_FAILED);
      });
  };

  const getLinkedInAuthorizedCode = async (code: string) => {
    connectLinkedin({
      variables: {
        connectLinkendInAuthorizationInputParameters: {
          access_token: code,
        },
      },
    })
      .then((data) => {
        if (data?.data?.connectLinkendInAuthorization?.data) {
          fetchLinkedinPage();
          toast.success(Message.LINKEDIN_CONNECTED_SUCCESS);
        }
      })
      .catch(() => {
        toast.error(Message.LINKEDIN_LOGIN_FAILED);
      });
  };

  const disconnectYoutube = () => {
    disconnectYoutubeChannel().then((res) => {
      const response = res.data;
      if (response?.disconnectYoutube?.meta?.statusCode === 200) {
        setYoutubeChannels([]);
        setSelectedYoutubeChannel("");
        localStorage.removeItem(LOCAL_STORAGE_KEY.youtubeChannel);
      }
    });
  };

  const { sentDataToChildForFacebook, sendDataToChildForYoutube, sendDataToChildForLinkedIn } = useChildEventHandler({ fbCallback: responseFacebook, youtubeCallback: getAuthorizedCode, linkedInCallback: getLinkedInAuthorizedCode, });

  const { openPopup } = useTikAPI(getTikTokAuthDetails);

  return (
    <div className="card-wrapper spacing-20 social-wrapper">
      <h2 className="h3 spacing-10">Social Settings</h2>
      <p className="content spacing-40">Control and configure your connections for Facebook and Instagram.</p>
      {activePlatformList?.[E_PLATFORMS.Facebook] && !socialPages?.length && socialConnection?.fetchSocialConnectionDetails?.data?.client_key != undefined && (
        <div className="innerCard-wrapper spacing-30">
          <h2 className="h3 spacing-30">Connect Facebook</h2>
          <div className="form-row social-row">
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  sentDataToChildForFacebook(
                    { appId: socialConnection?.fetchSocialConnectionDetails?.data?.client_key, scope: socialConnection?.fetchSocialConnectionDetails?.data?.scope },
                    redirectUri
                  )
                }
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
      {activePlatformList?.[E_PLATFORMS.Youtube] && (youtubeChannels?.length <= 0 || !selectedYoutubeChannel) && userType !== "brand" && youtubeCred?.getSocialConnection?.data?.client_key && (
        <div className="innerCard-wrapper spacing-30">
          <h2 className="h3 spacing-30">Connect Youtube</h2>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              sendDataToChildForYoutube({
                clientId: youtubeCred?.getSocialConnection?.data?.client_key,
                scope: youtubeCred?.getSocialConnection?.data?.scope?.join(" "),
                redirectUri: redirectUri,
              })
            }
          >
            Connect
          </button>
        </div>
      )}
      {activePlatformList?.[E_PLATFORMS.TikTok] && !tikTokAccountInfo?.channel_name && (
        <div className="innerCard-wrapper spacing-30">
          <h2 className="h3 spacing-30">Connect Tiktok</h2>
          <div className="form-row social-row">
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  openPopup({
                    client_id: "c_4EEAUO6AVU",
                    scope: TIKTOK_AVAILABLE_SCOPES,
                  })
                }
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
      {activePlatformList?.[E_PLATFORMS.Linkedin] && !linkedinAccountInfo?.channel_name && (
        <div className="innerCard-wrapper spacing-30">
          <h2 className="h3 spacing-30">Connect LinkedIn</h2>
          <button type="button" className="btn btn-primary spacing-20" onClick={() => sendDataToChildForLinkedIn()}>
            Connect
          </button>
          <span><strong>Access Criteria : </strong><Link target="_blank"  href={'https://www.linkedin.com/help/linkedin/answer/a568503'}>https://www.linkedin.com/help/linkedin/answer/a568503 </Link> </span>
        </div>
      )}
      {socialPages?.length > 0 && (
        <div className="innerCard-wrapper spacing-30">
          <div className="social-titlebar">
            <ul className="social-icon list-unstyled">
              <li>
                <Link href="" className="social-icon-btn" aria-label="Facebook Icon">
                  <i className="icon-facebook"></i>
                </Link>
              </li>
            </ul>
            <h2 className="h3">Connect Facebook and Instagram Business Pages</h2>
          </div>
          <div className="divider-line"></div>
          <p className="letter-spacing-030 content spacing-30">
            Once you select a Facebook Page, Video will automatically identify the Instagram account available for streaming. To go live on Instagram, you’ll need to connect your Instagram Via
            Instafeed.
          </p>
          <div className="form-row social-row">
            <div className="select-field">
              <select className="form-control" name="select-facebook" onChange={(e) => onSelect(e?.target?.value)} value={selectedPage} defaultValue={selectedPage} aria-label="Select Facebook Page">
                <option value="select_page">Select page</option>
                {socialPages?.map((i) => (
                  <option key={i?.value} value={i?.value}>
                    {i?.label}
                  </option>
                ))}
              </select>
              <span className="icon-down"></span>
            </div>
            <button type="button" className="btn btn-primary" onClick={disconnectFacebook}>
              Disconnect
            </button>
          </div>
        </div>
      )}
      {activePlatformList?.[E_PLATFORMS.Instagram] && socialPages?.length > 0 && (
        <div className="innerCard-wrapper spacing-30">
          <div className="social-titlebar spacing-30">
            <ul className="social-icon list-unstyled">
              <li>
                <Link href="" className="social-icon-btn" aria-label="Instagram Icon">
                  <i className="icon-instagram"></i>
                </Link>
              </li>
            </ul>
            <h3 className="">Connect to Instagram Account</h3>
          </div>
          <p className="title spacing-30">Associated Instagram Page</p>
          <div className="form-row social-row">
            <div className="left-title">
              <p className="sub-title">{instaAccountInfo?.instaPageName ? instaAccountInfo?.instaPageName : "No instagram account is connected yet"}</p>
            </div>
          </div>
        </div>
      )}
      {selectedYoutubeChannel && youtubeChannels?.length > 0 && (
        <div className="innerCard-wrapper spacing-30">
          <div className="social-titlebar spacing-30">
            <ul className="social-icon list-unstyled">
              <li>
                <Link href="" className="social-icon-btn youtube" aria-label="youtube Icon">
                  <Image src={IMAGE_PATH.youtubeLogo} alt="youtube icon" width={56} height={56} layout={"fit"} objectFit={"contain"} />
                </Link>
              </li>
            </ul>
            <h3 className="">Connect to Youtube Channel</h3>
          </div>
          <p className="title spacing-30">Associated Youtube Channel</p>
          <div className="form-row social-row">
            <div className="left-title">
              <p className="sub-title">{youtubeChannels?.[0].label}</p>
            </div>
            <button type="button" className="btn btn-primary" onClick={disconnectYoutube}>
              Disconnect
            </button>
          </div>
        </div>
      )}
      {!!tikTokAccountInfo?.channel_name && (
        <div className="innerCard-wrapper spacing-30">
          <div className="social-titlebar spacing-30">
            <ul className="social-icon list-unstyled">
              <li>
                <Link href="" className="social-icon-btn" aria-label="Instagram Icon">
                  <i className="icon-tiktok"></i>
                </Link>
              </li>
            </ul>
            <h3 className="">Connect to TikTok Account</h3>
          </div>
          <p className="title spacing-30">Associated TikTok Id</p>
          <div className="form-row social-row">
            <div className="left-title">
              <p className="sub-title">{tikTokAccountInfo?.channel_name ? tikTokAccountInfo?.channel_name : "No TikTok account is connected yet"}</p>
            </div>
            <button type="button" className="btn btn-primary" onClick={disConnectTikTok}>
              Disconnect
            </button>
          </div>
        </div>
      )}
      {!!linkedinAccountInfo?.channel_name && (
        <div className="innerCard-wrapper ">
          <div className="social-titlebar spacing-30">
            <ul className="social-icon list-unstyled">
              <li>
                <Link href="" className="social-icon-btn" aria-label="Instagram Icon">
                  <i className="icon-instagram"></i>
                </Link>
              </li>
            </ul>
            <h3 className="">Connect to Linkedin Account</h3>
          </div>
          <p className="title spacing-30">Associated Linkedin Page</p>
          <div className="form-row social-row">
            <div className="left-title">
              <p className="sub-title">{linkedinAccountInfo?.channel_name ? linkedinAccountInfo?.channel_name : "No TikTok account is connected yet"}</p>
            </div>
            <button type="button" className="btn btn-primary" onClick={disConnectLinkedIn}>
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialSetting;
