import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import getConfig from "next/config";
import Cookies from "js-cookie";
import { extractDomain, getParseCookie, getUserDetails, setDynamicDefaultStyle } from "@util/common";

const { publicRuntimeConfig } = getConfig();

export const getCurrentWebsite = () => {
  return Cookies.get("accountcode");
};

export const setCurrentWebsiteGlobal = (code: string) => {
  // Cookies.remove("accountcode");
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
  let obj = {
    url: req === "https://localhost:3000" || req === "https://undefined" ? publicRuntimeConfig.FRONT_URL : getHostnameFromRegex(req),
  };
  const response = await pagesServices.postPage(APICONFIG.GET_ACCOUNT_SHOW_LIST, obj);
  await setDynamicDefaultStyle(response?.default_style, response?.theme);
  if (response?.data?.ACCOUNT_URL_DATA?.code) {
    const accountData = response?.data?.ACCOUNT_URL_DATA ?? null;

    setCurrentWebsiteGlobal(accountData?.code);
    const b2bCompanyName = accountData?.name ?? '';
    const isB2BMode = accountData?.is_b2b_enquiry ?? 0;
    const isForceLogin = accountData?.is_force_login ?? 0;

    let isShowPrice = 1;
    const baseShowPrice = accountData?.is_show_price ?? 1;
    isShowPrice = isB2BMode == '1' && (baseShowPrice == '0' || !getUserDetails()) ? 0 : 1;

    Cookies.set("showPrice", String(isShowPrice));
    Cookies.set("forceLogin", isForceLogin);
    Cookies.set("isB2BUser", isB2BMode);
    Cookies.set("b2bCompanyName", b2bCompanyName);
    Cookies.set("isOtpOptional",response?.data?.ACCOUNT_URL_DATA?.send_otp)
  }

  Cookies.set("termsConditionsLink", response?.data?.SETTINGS?.terms_condition_link ?? '');

  if (response?.data?.TODAYS_RATE) {
    Cookies.set("isMetalrateDisplay", "1");
  } else {
    Cookies.set("isMetalrateDisplay", "0");
  }
  if (response?.data?.ACCOUNT_URL_DATA?.is_show_price === 0) {
    Cookies.set("is_Price_display", "false")
  } else {
    Cookies.set("is_Price_display", "true")
  }

  return { accountCode: response?.data?.ACCOUNT_URL_DATA?.code, cmsPageStatic: response?.data?.CMS_PAGES, domainName: extractDomain(response?.data?.URL), micrositeName : response?.data?.ACCOUNT_URL_DATA?.name};
};

export const getCountryIdFromServerside = async (req: any) => {
  const cookie = await getParseCookie(req?.headers?.cookie);
  if (cookie && cookie?.country_id) {
    return cookie?.country_id;
  }
};