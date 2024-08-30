const APPCONFIG = {
  reCaptchaSiteKey: process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_KEY ?? '6LesPnMpAAAAAMp87YE5eUhtNMXiZJwG6BMT0D7E',
  IMAGE_PATH_URL: "/images/",
};
export const REACT_APP_API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? 'https://whimarketingapi.demo.brainvire.dev';
export const NEXT_PUBLIC_SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'wss://whimarketingapi.demo.brainvire.dev';
export const NEXT_PUBLIC_SOCKET_TRANSPORT = process.env.NEXT_PUBLIC_SOCKET_TRANSPORT ?? 'websocket';
export const REACT_APP_ENCRYPTION_DECRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_DECRYPTION_KEY;
export const IS_HIGH_QLY_ENABLED = process.env.IS_ENABLE_HIGH_RESOLUTION ?? false;
export const NEXT_PUBLIC_SOCIAL_MEDIA_WINDOW_ORIGIN = process.env.NEXT_PUBLIC_SOCIAL_MEDIA_WINDOW_ORIGIN ?? 'https://whimarketingfront.demo.brainvire.dev';

export default APPCONFIG;
