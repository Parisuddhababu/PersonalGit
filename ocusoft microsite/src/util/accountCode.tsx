import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import Cookies from "js-cookie";
import { extractDomain, getParseCookie, setDynamicDefaultStyle } from "@util/common";
import http from "@util/axios";
// import getConfig from "next/config";

// const { publicRuntimeConfig } = getConfig();
export const getCurrentWebsite = () => {
  return Cookies.get("accountcode");
};

export const setCurrentWebsiteGlobal = (code: string) => {
  Cookies.set("accountcode", code, { expires: 365 });
  return code;
};

export const getHostnameFromRegex = (url: string) => {
  // run against regex
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  // extract hostname (will be null if no match is found)
  return matches && matches[0];
};

export const getWebsiteCode = async (req: string) => {
  console.log(req, 'Hello@@@')
  let obj = {
    url:'https://ocusoftms2.demo.brainvire.dev/'
    // url: req === "https://localhost:3000" || req === "https://undefined" ? publicRuntimeConfig.FRONT_URL : getHostnameFromRegex(req),
  };
  const isPreview = req.includes('preview_') ? '1' : '0';
  //@ts-ignore
  http.defaults.headers["Ispreview"] = isPreview;
  http.defaults.headers.common['Ispreview'] = isPreview;

  //set isPreview in cookies
  Cookies.set("isPreview", isPreview)

  const response = await pagesServices.postPage(APICONFIG.GET_ACCOUNT_SHOW_LIST, obj);

  setDynamicDefaultStyle(response?.default_style, response?.theme);
  if (response?.data?.ACCOUNT_URL_DATA?.code) {
    const accountData = response?.data?.ACCOUNT_URL_DATA ?? null;

    setCurrentWebsiteGlobal(accountData?.code);
  }
  //for error page
  if (!response?.data?.ACCOUNT_URL_DATA) {
    Cookies.set("isUnderMaintainence", 'true')
  } else {
    Cookies.remove("isUnderMaintainence")
  }

  Cookies.set("termsConditionsLink", response?.data?.SETTINGS?.terms_condition_link ?? '');
  return {
    accountCode: response?.data?.ACCOUNT_URL_DATA?.code,
    cmsPageStatic: response?.data?.CMS_PAGES,
    domainName: extractDomain(response?.data?.URL),
    isPreview: isPreview
  };
};

export const getCountryIdFromServerside = async (req: any) => {
  const cookie = await getParseCookie(req?.headers?.cookie);
  if (cookie && cookie?.country_id) {
    return cookie?.country_id;
  }
};