import APPCONFIG from "@config/app.config";
import { IRootColor } from "@type/Common/Base";
import { IQuerySlugProps } from "@type/Common/PageService";
import { isNullOrUndefined } from "util";
import Cookies from "js-cookie";
import { parse } from "cookie";
import {
  getCurrentGuestCartItems,
  getCurrentWishListItems,
} from "./addGuestCartData";
import { ICustomiseAddtoProduct } from "@components/Hooks/addtoCart";
import { IProducts } from "@type/Pages/cart";
import { IProductTagList } from "@components/Meta";

/**
 * @name : Check numbe is Even
 * @param n : number
 * @returns : boolean
 */
export const IsEven = (n: number) => {
  return n % 2 === 0;
};

/**
 * @name : path has a image extension
 * @description : return boolean value
 * @param src : string
 * @returns : boolean
 */
export const IsImage = (src: string) => {
  // eslint-disable-next-line
  const ImageRegx: RegExp = new RegExp(/\.(jpe?g|png|gif|svg)$/gi);
  return ImageRegx.test(src);
};

/**
 * @name : set animation delay in sequence
 * @param duration
 * @returns : boolean
 */
export const AnimateDelay = (duration: number, start = 400) => {
  return duration * 50 + start;
};

/**
 * @name : text ellipsis
 * @param str
 * @param limit
 * @description :  truncate a text or line with ellipsis
 */
export const TextTruncate = (str: string, limit: number) => {
  return str?.length > limit ? `${str.substr(0, limit)}...` : str;
};

/**
 * @name : stringOnly
 * @param str
 * @description : remove space from string
 *
 */
export const stringOnly = (str: string): string => {
  return str.replace(/\s/g, "");
};

/**
 *
 * @param content : html content
 * @description : replace \r\n  to br tag
 */
export const replaceBr = (content: string) => {
  content = content.replace(/(\r\n\r\n)+/gi, "<br/><br/>");
  return isEmpty(content) ? "" : content.replace(/(\r\n)+/gi, "<br/>");
};

/**
 * @name : is browser
 * @description : Check script load in browser or server side
 */
export const IsBrowser: boolean = typeof window !== "undefined";

/**
 * @description return boolean value base on value
 * @param value must be string or number
 */
export const isEmpty = (value: string | number): boolean => {
  return isNullOrUndefined(value) || value === "#" || value === ""
    ? true
    : false;
};

/**
 * @name : stepNumber
 * @param n
 * @description : format numbers by prepending 0 to single-digit number
 */
export const stepNumber = (n: number): string => ("0" + n).slice(-2);

/**
 * @name : IsDay
 * @param hour
 * @param zone
 * @description : get hour type base on time
 */
export const IsDay = (hour: number, min: number, zone: "AM" | "PM") => {
  const lower = (str: string) => str.toLowerCase();
  if (hour >= 6 && hour <= 18) return lower("PM");
  if (hour < 6 || hour > 18) return lower("AM");
  return lower(zone);
};

/**
 * @name : determineUrlType
 * @param url
 * @description : validate if url is external,internal, single slug or multiple slug
 */
export const determineUrlType = (link: string) => {
  // const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  const expression = /(https|http|www)?:\/\/((?:[\w\d-]+\.)+[\w\d]{2,})/i;
  //   eslint-disable-next-line
  const queryExpression = /(\?|\&)([^=]+)\=([^&]+)/;
  const regex = new RegExp(expression);
  const queryRegex = new RegExp(queryExpression);
  if (regex.test(link) && !link.includes("brainvire.com")) return 0;
  else if (queryRegex.test(link)) return 5;
  else {
    const parsedUrl = link.split("/");
    const passedSlugs = parsedUrl?.filter((item) => item !== "");
    return passedSlugs.length;
  }
};

/**
 * @name : LightenDarkenColor
 * @param col
 * @description : to find the lighter shade if the given color programatically.
 */
export const LightenDarkenColor = (col: string) => {
  // col = parseInt(col, 16);
  return (
    "#" +
    col
      .replace(/^#/, "")
      .replace(/../g, (colNew) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(colNew, 16) + 40)).toString(16)
        ).substr(-2)
      )
  );
  // return (
  //   "#" + (((col & 0x0000ff) + 40) | ((((col >> 8) & 0x00ff) + 40) << 8) | (((col >> 16) + 40) << 16)).toString(16)
  // );
};

/**
 * @name : scrollToElement
 * @param Element
 * @description : Smooth Scrolling to Specific Element.
 */
export const scrollToElement = (destination: any, e: any) => {
  const classList = e.target.parentElement.classList.contains("active");
  if (!classList) {
    const easings = {
      easeOutQuart(t: any) {
        return 1 - --t * t * t * t;
      },
    };
    const duration = 3000;
    const easing = "easeOutQuart";

    const start = window.pageYOffset;
    const startTime =
      "now" in window.performance ? performance.now() : new Date().getTime();
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.getElementsByTagName("body")[0].clientHeight;
    const destinationOffset =
      typeof destination === "number" ? destination : destination.offsetTop;
    const destinationOffsetToScroll = Math.round(
      documentHeight - destinationOffset < windowHeight
        ? documentHeight - windowHeight
        : destinationOffset
    );

    if ("requestAnimationFrame" in window === false) {
      window.scroll(0, destinationOffsetToScroll);
      return;
    }

    const scroll = () => {
      const now =
        "now" in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, (now - startTime) / duration);
      const timeFunction = easings[easing](time);
      window.scroll(
        0,
        Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start)
      );
      if (Math.ceil(window.pageYOffset) === destinationOffsetToScroll) {
        return;
      }

      requestAnimationFrame(scroll);
    };

    scroll();
  }
};
export const myLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality: number;
}) => {
  return `${src}?w=${width}&q=${quality || 50}`;
};

/***
 * Check the is valid param1 from the URL.
 * **/
export const isParamUrlValid = (query: IQuerySlugProps) => {
  return (
    query["slug"] !== "portfolio" &&
    query["slug"] !== "case-study" &&
    query["param1"] !== "" &&
    query["param1"] !== "assets" &&
    query["slug"] !== "assets" &&
    query["slug"] !== "fonts"
  );
};

export const getTypeBasedCSSPath = (
  type: string | number | null = null,
  fileNameWithPath: string
) => {
  const styleBasePath = APPCONFIG.STYLE_BASE_PATH_COMPONENT;
  if (fileNameWithPath && type) {
    return styleBasePath + fileNameWithPath + "-" + type + ".min.css";
  }
  return styleBasePath + fileNameWithPath + ".min.css";
};

export const getTypeBasedCSSPathPages = (
  type: string | null | number = null,
  fileNameWithPath: string
) => {
  const styleBasePath = APPCONFIG.STYLE_BASE_PATH_PAGES;
  if (fileNameWithPath && type) {
    return styleBasePath + fileNameWithPath + "-" + type + ".min.css";
  }
  return styleBasePath + fileNameWithPath + ".min.css";
};

/**
 * Get Component Name Like IHomeBannerSectionFirst (name + type)
 * @param type
 * @param name Component Name
 * @returns
 */
export const getTypeWiseComponentName = (type: string, name: string) => {
  if (type) {
    const convertedType = type;
    return name + "_" + convertedType;
  }
  return name + "_1";
};

/**
 * Font External URL render in Head tag using link tag
 * @param fontUrl string
 */
export const loadExternalLink = (fontUrl: string) => {
  if (IsBrowser) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontUrl;
    if (document.getElementsByTagName("head")) {
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }
};

/**
 * Check Is URL
 * @param str string
 * @returns boolean
 */
export const isURL = (str: string) => {
  try {
    return Boolean(new URL(str));
  } catch (e) {
    return false;
  }
};

/**
 * Add a Dynamic Css Style Variable to the roots define variable CSS
 * @data IRootColor
 * @theme Light / Dark Theme Color
 */
export const setDynamicDefaultStyle = (data: IRootColor, theme: string) => {
  if (IsBrowser) {
    if (data && typeof data === "object") {
      Object.entries(data).map(([key, value]) => {
        if (IsBrowser) {
          if (isURL(value)) {
            // if Value is Valid URL then render in link tag
            loadExternalLink(value);
          }
          const body = document.getElementsByTagName("body");
          if (body && body.length > 0 && body[0]) {
            body[0].style.setProperty(key, value);
          }
          //   document.documentElement.style.setProperty(key, value);
        }
      });
    }
    if (theme) {
      const html = document.getElementsByTagName("html");
      if (html && html.length > 0) {
        html[0].classList.add(theme);
      }
    }
  }
};

export const isEmptyArrayObjectNull = (data: object | [] | null) => {
  if (data === null) {
    return true;
  } else if (
    data &&
    Object.keys(data).length === 0 &&
    Object.getPrototypeOf(data) === Object.prototype
  ) {
    return true;
  } else if (Array.isArray(data) && data.length <= 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * Convert Date string like 12 Jan 2022
 * @param dateStr
 * @returns string
 */
export const converDateMMDDYYYY = (dateStr: string | Date) => {
  if (dateStr !== null && dateStr !== undefined && dateStr !== "") {
    const dateObj = new Date(dateStr);
    const date = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    if (date) {
      return date + " " + month + " " + year;
    } else {
      return "";
    }
  }
};

/**
 * Convert Date string like 12 Jan 2022
 * @param dateStr
 * @returns string
 */
export const converDateDDMMYYYY = (dateStr: string | Date) => {
  if (dateStr !== null && dateStr !== undefined && dateStr !== "") {
    const dateObj = new Date(dateStr);
    const date = dateObj.getDate().toString().padStart(2, "0");
    let month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    if (date) {
      return date + "-" + (month < 10 ? "0" + month : month) + "-" + year;
    } else {
      return "";
    }
  }
};

export const splitArrayInChunk = (data: any, chunkSize: number) => {
  const tempData = [];
  for (let i = 0; i < data?.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    tempData.push(chunk);
  }
  return tempData;
};

export const generateFormData = (data: any) => {
  const formData = new FormData();
  let arr;
  Object.keys(data)?.map((ele) => {
    if (Array.isArray(data?.[ele])) {
      arr = data?.[ele]?.map((e: any) => e);
      formData.append(ele, JSON.stringify(arr));
    } else {
      formData.append(ele, data?.[ele]);
    }
  });

  return formData;
};

export const setDataInLocalStorage = (
  key: any,
  value: any,
  convertTojsonDataOrNot = false
) => {
  if (value !== undefined) {
    if (convertTojsonDataOrNot) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  }
};

export const setDataInCookies = (key: any, data: any, expiryTime = 365) => {
  Cookies.set(key, JSON.stringify(data), { expires: expiryTime });
};

export const removeLoginData = () => {
  if (IsBrowser) {
    localStorage.removeItem("auth");
    localStorage.removeItem("productList");
  }
  Cookies.remove("auth");
};

export const getParseCookie = async (cookies: any) => {
  if (cookies) {
    let parseCookie = cookies;
    return parse(parseCookie);
  } else {
    return cookies;
  }
};
export const setAuthHeader = async (req: any) => {
  const cookie = await getParseCookie(req?.headers?.cookie);
  if (cookie && cookie?.auth) {
    const auth = JSON.parse(cookie.auth);
    const token = auth.token_type + " " + auth.access_token;
    if (token) {
      return token;
    }
  }
  return cookie;
};

export const getParseUser = () => {
  if (IsBrowser) {
    const currentUser = localStorage.getItem("auth");
    let parseUser = "";
    if (currentUser) {
      parseUser = JSON.parse(currentUser);
    }
    return parseUser;
  }
};

export const getUserDetails = () => {
  return getParseUser() ? getParseUser() : "";
};

export const getCartcount = () => {
  if (IsBrowser) {
    const guestUser = getCurrentGuestCartItems();
    let sum = 0;
    if (guestUser) {
      guestUser.forEach((element: ICustomiseAddtoProduct) => {
        sum = sum + element.qty;
      });
    }
    return sum;
  }
};

export const getWishListcount = () => {
  if (IsBrowser) {
    const guestUser = getCurrentWishListItems();
    if (guestUser) {
      return guestUser.length;
    }
  }
  return 0;
};

export const getUserToken = () => {
  return getParseLocalStorageData()
    ? getParseLocalStorageData().token_type +
        " " +
        getParseLocalStorageData().access_token
    : "";
};

export const getParseLocalStorageData = () => {
  if (IsBrowser) {
    const currentUser = localStorage.getItem("auth");
    let parseUser = null;
    if (currentUser) {
      parseUser = JSON.parse(currentUser);
    }
    return parseUser;
  }
};

/**
 * Convert Price into number format
 * @param price number
 * @returns Converted Price In Number Format
 */
export const covertPriceInLocalString = (price: number) => {
  if (price) {
    return price.toLocaleString(APPCONFIG.NUMBER_FORMAT_LANG);
  } else {
    return price;
  }
};
/**
 * Check string is null empty or undefined string
 * @param data string | null | undefined
 * @returns boolean
 */
export const checkNullEmptyString = (data: string | null | undefined) => {
  if (data === null || data === undefined || data === "") {
    return true;
  }
  return false;
};
/*
 * Get Country Id from Cookies
 * @returns string
 */
export const getCurrentSelectedCountry = () => {
  return Cookies.get("country_id");
};

export const getCurrencyCode = () => {
  return Cookies.get("currency_code");
};

export const getCountryName = () => {
  return Cookies.get("country_name");
};

export const getCountryObj = () => {
  if (Cookies.get("countryObj")) {
    return JSON.parse(Cookies.get("countryObj") || "");
  }
};

export const setUpdatedCountryGlobal = async (
  id: string,
  currencyCode: string,
  name: string,
  countryObj: string | object | undefined,
  currencySymbol: string
) => {
  Cookies.set("country_id", id, { expires: 365 });
  Cookies.set("currency_code", currencyCode, { expires: 365 });
  Cookies.set("country_name", name, { expires: 365 });
  Cookies.set("countryObj", JSON.stringify(countryObj), { expires: 365 });
  Cookies.set("currencySymbol", currencySymbol, { expires: 365 });
  return id;
};

/**
 * Convert Date to '17/05/2022'
 * @param dateStr string of date
 * @returns string
 */
export const ConvertDateCommonDisplay = (comingDate: string) => {
  const date = new Date(comingDate) || new Date();
  // Function to convert
  // single digit input
  // to two digits
  const formatData = (input: any) => {
    if (input > 9) {
      return input;
    } else return `0${input}`;
  };

  // Function to convert
  // 24 Hour to 12 Hour clock
  const formatHour = (input: any) => {
    if (input > 12) {
      return input - 12;
    }
    return input;
  };

  // Data about date
  const format = {
    dd: formatData(date.getDate()),
    mm: formatData(date.getMonth() + 1),
    yyyy: date.getFullYear(),
    HH: formatData(date.getHours()),
    hh: formatData(formatHour(date.getHours())),
    MM: formatData(date.getMinutes()),
    SS: formatData(date.getSeconds()),
  };
  const format24Hour = ({ dd, mm, yyyy, HH, MM, SS }: any) => {
    return `${mm}/${dd}/${yyyy} ${HH}:${MM}:${SS}`;
  };

  // Time in 24 Hour format
  const dateStr = format24Hour(format);

  return dateStr;
};

/**
 * Convert object to parsed string
 * @param obj object with key value
 * @return string
 */
export const objToString = (obj: any): string => {
  return Object.entries(obj).reduce((str, [p, val], index) => {
    const lastIndex = index === Object.keys(obj).length - 1;
    return `${str}${p}=${val}${lastIndex ? "" : "&"}`;
  }, "");
};

export const stringToObj = (data: string) => {
  let objData = data.split("&").reduce(function (obj, str) {
    let strParts = str.split("=");
    if (strParts[0] && strParts[1]) {
      // @ts-ignore
      obj[strParts[0].replace(/\s+/g, "")] = strParts[1].trim();
    }
    return obj;
  }, {});
  return objData as any;
};

export const getTodayRateDisplay = () => {
  return Cookies.get("isMetalrateDisplay");
};

export const getCurrentCurrencySymbol = () => {
  return Cookies.get("currencySymbol");
};

export const extractDomain = (url: string) => {
  let domain = url;

  // Remove "https://" if present
  if (domain?.includes("https://")) {
    domain = domain.replace("https://", "");
  }

  // Remove "http://" if present
  if (domain?.includes("http://")) {
    domain = domain.replace("http://", "");
  }

  // Remove "www." if present
  if (domain?.includes("www.")) {
    domain = domain.replace("www.", "");
  }

  domain = domain?.split("/")?.[0];
  return domain;
};

export const emailLowerCase = (email: string) => {
  return email ? email.toLowerCase() : "";
};

export const getVideoId = (url: string) => {
  let videoId = "";
  const pattern1 = /(?:\?v=|\/embed\/|\.be\/)([\w-]{11})(?:\S+)?/;
  const pattern2 =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/([\w-]{11})(?:\S+)?/;
  const pattern3 =
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([\w-]{11})(?:\S+)?/;

  const match1 = url.match(pattern1);
  const match2 = url.match(pattern2);
  const match3 = url.match(pattern3);

  if (match1 && match1[1]) {
    videoId = match1[1];
  } else if (match2 && match2[1]) {
    videoId = match2[1];
  } else if (match3 && match3[1]) {
    videoId = match3[1];
  }

  return videoId;
};

export const getTotalDiamondCarat = (data :IProducts )=>{
  const TotalCarat = data?.diamond_details?.reduce((accumulator : number, {carat}) => accumulator + +carat,0)
  return TotalCarat
}

export const getDymanicBgTagColorAndImg = (tagTitle : string, product_tags_detail : IProductTagList[] | undefined)=>{
  const matchingTag = product_tags_detail?.find(({title})=> title === tagTitle);
  const tagImgPath = matchingTag?.product_tag_image?.[0]?.tag_image?.path;
  const tagBgColor = matchingTag?.product_tag_image?.[0]?.tag_color
  const style = {
    '--tag-bg-color': tagBgColor ? `#${tagBgColor}` : "#F2D7D9",
  } as React.CSSProperties;
  const data = {imgPath : tagImgPath ? tagImgPath : "", style : style }
  return data
}
