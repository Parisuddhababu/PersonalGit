import { IPlatform } from "@/types/pages"
import { E_PLATFORMS } from "./enums"

export const APP_NAME = 'WHI Marketing'

export const LOCAL_STORAGE_KEY = {
    authToken: 'authToken',
    facebookDetail: 'facebookDetail',
    facebookPage: 'facebookPage',
    userDetails: 'userDetails',
    goLiveSession: 'goLiveSession',
    isLiveStreamStarted: 'isLiveStreamStarted',
    keyword: 'keyword',
    instaGramDetails: 'instaGramDetails',
    lastRoute: 'lastRoute',
    productKeyWord: 'productKeyWord',
    currentPassword: 'currentPassword',
    instaAccount: 'instaAccount',
    isReload: 'isReload',
    brandName: 'brandName',
    UsersCurrentPlan: 'UsersCurrentPlan',
    lastVisitedRoute: "lastVisitedRoute",
    primaryColor: 'primaryColor',
    selectedProduct: 'selectedProduct',
    youtubeChannel: "youtubeChannel",
    tikTokAccount: 'tikTokAccount',
    linkedinData: "linkedinData"
}

export const PLACE_HOLDERS = {
    email: 'Enter Email',
    password: 'Enter Password',
}

export const FIELDS = {
    email: 'Email',
    password: 'Password',
}

export const LABELS = {
    forgotPassword: 'Forgot Password',
    doNotHaveAccount: `Don't have an Account`,
    signUp: 'Sign up',
    signIn: 'Login',
    loginHeader: 'If you have an account, Sign in with your email address.',
    influencerLogin: 'Influencer Login',
    brandLogin: 'Brand Login',
    goLive: 'Go live',
    insights: 'Insights',
    replayHistory: 'Replay History',
    catalog: 'Catalog',
    settings: 'Settings',
    signOut: 'Sign out',
    myAccount: 'My Account',
    liveSchedule: 'Live Schedule',
    manageUser: 'Manage User',
}

export const FB_CONFIGURATIONS = {
    scopes: `publish_video,pages_manage_engagement,read_insights,pages_messaging,pages_manage_ads,pages_read_engagement,pages_manage_posts,business_management,pages_manage_metadata,pages_read_user_content,pages_show_list,instagram_basic,instagram_manage_insights,instagram_content_publish`
}

export const DATE_TIME_FORMAT = {
    format1: 'DD-MM-YYYY',
    format2: 'hh:mm A',
    format3: 'HH:mm:ss',
    format4: 'hh:mm',
    format5: 'YYYY-MM-DD HH:mm:ss',
    format6: 'HH:mm',
}

export const DEFAULT_TIME_ZONE = 'Asia/Kolkata'

export const RESTRICT_URL=[
    '/payment/failure',
    '/payment/success',
    '/',
    '/change-password',
    '/my-account',
    '/insights',
    '/replay-history'   
]

export const RESTRICT_FOR_LOGIN_USER = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
];

export const DEFAULT_PRIMARY_COLOR = "#FF9269"



export const GLOBAL_FILE_PATHS = {
   sampleCsv : '/csv/sample.csv'
}

export const WHI_MARKETING_URL = 'https://whimarketing.com'
export const WHI_DEMO_URL = "https://whimarketingfront.demo.brainvire.dev"
export const pathsToHideHeaderAndFooter = ["/facebook-auth","/youtube-auth"] 

export const TIKTOK_AVAILABLE_SCOPES = [
  "CONVERSATION_REQUESTS",
  "EDIT_PROFILE",
  "EXPLORE",
  "FOLLOW_ACTIONS",
  "LIVE",
  "MEDIA_ACTIONS",
  "SEND_MESSAGES",
  "VIEW_ANALYTICS",
  "VIEW_COINS",
  "VIEW_COLLECTIONS",
  "VIEW_FOLLOWERS",
  "VIEW_MESSAGES",
  "VIEW_NOTIFICATIONS",
  "VIEW_PROFILE",
]

export const  TIKTOK_OAUTH_URL=  "https://tikapi.io/account/authorize";
export const DOMAIN_STRING_ARRAY = ['www', 'whimarketing', 'com', 'buy','live','localhost:3000','demo','brainvire','dev','whimarketingfront'];


export const insightPlatforms: IPlatform[] = [
    { key: E_PLATFORMS.Facebook, icon: "icon-facebook", name: "Facebook", dataKey: "facebook" },
    { key: E_PLATFORMS.Instagram, icon: "icon-instagram", name: "Instagram", dataKey: "instagram" },
    { key: E_PLATFORMS.Youtube, icon: "icon-youtube", name: "Youtube", dataKey: "youtube" },
    { key: E_PLATFORMS.TikTok, icon: "icon-tiktok", name: "TikTok", dataKey: "tiktok" }
  ];