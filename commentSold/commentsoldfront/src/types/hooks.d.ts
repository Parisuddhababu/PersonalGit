import { FacebookLoginResponse } from "./graphql/pages";

export type DomainType = "Influencer" | "Brand" | "WHIBrand";

//validations type   start
interface IPattern {
  value: RegExp;
  message: string;
}

interface IRequiredPattern {
  required: string;
  pattern: IPattern;
}

interface IRequired {
  required: string;
}

interface IOnlyPattern {
  pattern: IPattern;
}

export interface ISignUpFormValidations {
  firstName: IRequiredPattern;
  lastName: IRequiredPattern;
  email: IRequiredPattern;
  gender: IRequired;
  countryCodeId: IRequired;
  phoneNumber: IRequiredPattern;
  password: IRequiredPattern;
  confirmPassword: IRequired;
  apply: IRequired;
}

export interface ISignInFormValidations {
  email: IRequiredPattern;
  password: IRequiredPattern;
}

export interface IChangePasswordValidations {
  currentPassword: IRequired;
  newPassword: IRequiredPattern;
}

export interface IContactUsValidations {
  firstName: IRequiredPattern;
  lastName: IRequiredPattern;
  countryCodeId: IRequired;
  phoneNumber: IRequiredPattern;
  email: IRequiredPattern;
  message: IRequired;
}

export interface IForgotPasswordValidations {
  email: IRequiredPattern;
}

export interface IMyAccountValidations {
  firstName: IRequiredPattern;
  lastName: IRequiredPattern;
  phoneNumber: IRequiredPattern;
  email: IRequiredPattern;
}

interface IMaxLengthPattern {
  maxLength;
}

export interface IKeywordValidations {
  keyWords: IRequired & IMaxLengthPattern;
  keyWordCount: IRequiredPattern & IMaxLengthPattern;
}

export interface IAddInflueValiadtions {
  firstName: IRequiredPattern;
  lastName: IRequiredPattern;
  email: IRequiredPattern;
  gender: IRequired;
  phoneNo: IRequiredPattern;
}

export interface IResetPasswordValidations {
  password: IRequiredPattern;
}

export interface IStartGrowingValidations {
  brandName: IRequiredPattern;
  companyName: IRequired;
  firstName: IRequiredPattern;
  lastName: IRequiredPattern;
  phoneNumber: IRequiredPattern;
  brandEmail: IRequiredPattern;
  sessionCount: IRequiredPattern;
  influencerCount: IRequiredPattern;
}

export interface IInstaWithPasswordValidations {
  username: IRequired;
  password: IRequired;
}

export interface IInstaWithKeyValidations {
  streaming_key: IRequired;
  streaming_url: IRequired;
}

export interface IAddCatalogValidations {
  name: IRequired;
  url: IRequiredPattern;
  description: IRequired;
  sku: IRequired;
  images: IRequiredPattern;
  color: IRequired;
  size: IRequired;
  price: IRequiredPattern;
}

export interface IGoLiveStep1Validations {
  streamTitle: IOnlyPattern;
  streamDescription: IOnlyPattern;
}

export interface IGoLiveStep2Validations {
  productId: IRequired;
}

export interface IScheduleStep1Validations {
  streamTitle: IRequiredPattern;
  streamDescription: IRequiredPattern;
  timeZone: IRequired;
}

export interface IScheduleStep4Validations2 {
  user_uuid1: IRequired;
  product_uuid1: IRequired;
  user_uuid2: IRequired;
  product_uuid2: IRequired;
  user_uuid3: IRequired;
  product_uuid3: IRequired;
  user_uuid4: IRequired;
  product_uuid4: IRequired;
}

export interface ITikAPIPopupOptions {
  client_id: string;
  scope?: string | string[];
  state?: string;
  email?: string;
  country?: string;
  url?: string;
  is_popup?: boolean;
}

export interface IUserInfo {
  avatar: string;
  birthday: string | null;
  followers_count: number;
  followings_count: number;
  gender: string | null;
  id: string;
  nickname: string;
  private: boolean;
  sec_user_id: string;
  user_verified: boolean;
  username: string;
}

export interface ITikAPIResponse {
  _tikapi: boolean;
  type: string;
  message: string;
  client_id: string;
  access_token: string;
  scope: string[];
  userInfo: IUserInfo;
}
export interface IUseChildEventHandlerProps {
  fbCallback: (_: FacebookLoginResponse) => void;
  youtubeCallback: (_: string) => void;
  linkedInCallback: (_: string) => void;
}
export interface IActivePlatforms {
  [key: string]: boolean;
}

export interface IPlatformDetails {
  connection_name: string;
  status: string;
}