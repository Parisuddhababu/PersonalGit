import { EncryptionMode, UID, SDK_MODE } from "agora-rtc-sdk-ng";

const config: configType = {
  uid: 13,
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID as string,
  channelName: process.env.NEXT_PUBLIC_AGORA_CHANNEL_NAME as string,
  rtcToken: process.env.NEXT_PUBLIC_AGORA_APP_RTC_TOKEN as string,
  serverUrl: "",
  proxyUrl: "http://localhost:8080/",
  tokenExpiryTime: 600,
  token: "",
  encryptionMode: "none",
  salt: "",
  encryptionKey: "",
  destChannelName: "",
  destChannelToken: "",
  destUID: 2,
  secondChannel: "",
  secondChannelToken: "",
  secondChannelUID: 2,
  selectedProduct: "rtc"
};

export type configType = {
  uid: UID;
  appId: string;
  channelName: string;
  rtcToken: string | null;
  serverUrl: string;
  proxyUrl: string;
  tokenExpiryTime: number;
  token: string;
  encryptionMode: EncryptionMode;
  salt: "";
  encryptionKey: string;
  destUID: number;
  destChannelName: string,
  destChannelToken: string,
  secondChannel: string,
  secondChannelToken: string
  secondChannelUID: number,
  selectedProduct: SDK_MODE
};

export default config;