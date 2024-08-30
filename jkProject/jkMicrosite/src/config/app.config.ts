import getConfig from "next/config";
import TAG_CONFIG from "./tags.config";

// Only holds serverRuntimeConfig and publicRuntimeConfig
const { publicRuntimeConfig } = getConfig();

const APPCONFIG = {
  ENV: publicRuntimeConfig.ENV,
  Domain: publicRuntimeConfig.DOMAIN,
  NoIndex: publicRuntimeConfig.NoIndex,
  NoFollow: publicRuntimeConfig.NoFollow,
  baseURL: {
    v1: publicRuntimeConfig.BASE_URL,
    v2: publicRuntimeConfig.BASE_URL_V2,
    v3: publicRuntimeConfig.BASE_URL_V3,
  },
  GMETAVERIFY: publicRuntimeConfig.GMETAVERIFY,
  assetstPath: publicRuntimeConfig.ASSETS_DOMAIN,
  gmapKey: publicRuntimeConfig.GMAP_KEY,
  googleClientId:
    "541526034424-ba7q05ht4gv7dftpdv1c7hg0kt9bmsva.apps.googleusercontent.com",

  gCaptcha: publicRuntimeConfig.GOOGLE_RECAPTCHA,
  gtmID: publicRuntimeConfig.GTM_ID,
  starRatedColor: "#FF4242",
  maxFileSize: 10,
  maxFileUpload: 3,
  acceptedFiles: ".jpeg,.jpg,.png,.csv,.xls,.pdf,.zip",
  acceptedOnlyPdf: ".pdf,.doc",
  defaultImage: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D",
  SafeHtml: TAG_CONFIG,
  mapOption: {
    center: {
      lat: 42.49865933415444,
      lng: -93.86447214999998,
    },
    zoom: 3,
  },
  // Image URL
  IMAGE_PATH_URL: "/assets/images/",
  SESSION_TIME_OUT_HOURS: 23,

  //
  STYLE_BASE_PATH_PAGES: "/assets/css/pages/",
  STYLE_BASE_PATH_COMPONENT: "/assets/css/components/",

  defaultSliderDelay: 5000,
  facebookAppId: 395994905628125,

  ANY_LIST_LENGTH: 10,
  PRODUCT_LIST_WITH_FILTER: {
    collection: "collection_slug",
    catalogue: "catalog_slug",
  },

  filterInputType: {
    multiSelectCheckbox: "Multi Checkbox",
    range: "Range",
  },
  filterModuleName: {
    category: "CATEGORY",
    priceRange: "PRICE_RANGE",
    subCategory: "SUB_CATEGORY",
    newArrival: "NEW_ARRIVAL",
    featured: "FEATURED"
  },
  SEARCH_URL_TYPE: {
    CATEGORY: "--CAT++",
    PRICE_RANGE: "--PR++",
    SUB_CATEGORY: "--SUBCAT++",
    METAL_WEIGHT: "--MW++",
    DIAMOND_QUALITY: "--DQ++",
    DIAMOND_SHAPE: "--DS++",
    SIZE: "--SZ++",
    METAL_TYPE: "--MT++",
    METAL_PURITY: "--MP++",
    COLLECTION: "--COL++",
    STYLE: "--ST++",
    SORT: "--SORT++",
    PRODUCT_WEAR_TAG: "--PWT++",
    PRODUCT_LOOK_TAG: "--PLT++",
    SHOP: "--SHOP++",
    NEW_ARRIVAL: "--NEW_ARRIVAL++",
  },
  READY_TO_SHIP_SLUG: "ready-to-ship",
  NEW_ARRIVAL_SLUG: "new-arriaval",
  MAKE_TO_ORDER_SLUG: "make-to-order",
  MAKE_TO_ORDER: "MAKE_TO_ORDER",
  READY_TO_SHIP: "READY_TO_SHIP",
  NUMBER_FORMAT_LANG: "en-IN",
  PRODUCT_SORT_BY: [
    { name: "Discount", sortby: "desc", urlValue: "discount_per" },
    { name: "Price:: Low to High", sortby: "asc", urlValue: "low_to_high" },
    { name: "Price:: High to Low", sortby: "desc", urlValue: "high_to_low" },
    { name: "Latest", sortby: "desc", urlValue: "created_at" },
    { name: "Featured", sortby: "desc", urlValue: "is_featured" },
  ],
  PRODUCT_LIST_PAGE_LIMIT: "16",
  COLLECTION_LIST_PAGE_LIMIT: 9,
  LOCALSTORAGEKEY: {
    productCompareList: "productCompareList",
    oneTimePopup: "onetimePopup",
  },
  DOTS: "...",
  MAP_STYLE: "mapbox://styles/mapbox/streets-v9",
  priceRange: {
    min: 0,
    max: 10000,
    code: "1",
  },
  customise_price_range: {
    min: 0,
    max: 10000000,
    code: "1",
  },
  acceptProfileImage: ".jpeg,.jpg,.png",
  API_METHOD_NAME_FOR_LOADMOREHOOK: "getPage",
  DEFAULT_QTY_TYPE: 1,
  DEFAULT_COUNTRY_ID: "5eb67e86e24e352ebd3ff56d",
  DEFAULT_STATE_ID: "5a1fcb4362b24b0f00002464",
  DEFAULT_COUNTRY_NAME: "India",
  DEFAULT_COUNTRY: {
    country_code: "INDIA",
    country_flag: [
      {
        file_name: "blob_1661163516.",
        path: "https://s3.ap-south-1.amazonaws.com/manicad.in/country/5eb67e86e24e352ebd3ff56d/blob_1661163516.",
        relative_path: "/country/5eb67e86e24e352ebd3ff56d/",
        _id: "630357fc5dcafa537c0ae162",
      },
    ],
    country_phone_code: "+91",
    currency_code: "INR",
    currency_symbol: "₹",
    name: "India",
    _id: "5eb67e86e24e352ebd3ff56d",
  },
  DEFAULT_GENDER_ID: "626bcc404ac3c6794c16d2e3",
  GUEST_CART_DATA: "GUEST_CART_DATA",
  GUEST_WISHLIST_DATA: "GUEST_WISHLIST_DATA",
  TEMPLATE_TYPE: "1",
  PAYMENT_METHOD_KEY_ENCRYPTION: {
    ENCRYPTION_KEY: "@@@@&&&&@@@@&&&&",
  },
  AVAILABLE_PAGES: {
    homePage: "HOME_PAGE",
    productList: "PRODUCT_LIST",
    productDetails: "PRODUCT_DETAILS",
    aboutUs: "ABOUTUS",
    faq: "FAQ",
    contactUs: "CONTACTUS",
    testimonials: "TESTIMONIALS",
    termConditions: "TERM_AND_CONDITIONS",
    career: "CAREERS",
    blogList: "BLOG_LIST",
    blogDetails: "BLOG_DETAILS",
    eventList: "EVENT_LIST",
    eventDetails: "EVENT_DETAILS",
    recentlyView: "RECENTLY_VIEWED_PAGE",
    myAccount: "MY_ACCOUNT",
    signIn: "SIGN_IN",
    signUp: "SIGN_UP",
    forgotPassword: "FORGOT_PASSWORD",
    resetPassword: "RESET_PASSWORD",
  },
  PAYMENT_METHODS: {
    stripe: "stripe",
    razorpay: "razorpay",
    ccavenue: "ccavenue",
    cod: "cod",
    phonepe: "phonepe"
  },
  ORDER_PAYMENT_STATUS: {
    success: "success",
    failed: "failed",
    cancel: "cancel",
  },
  IMAGE_ZOOM: {
    zoomLevel: 1.3,
  },
};

export default APPCONFIG;
