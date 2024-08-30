export interface ILink {
  title: string;
  url: string;
  target: string;
}

export interface ITLink {
  link: string;
  link_text: string;
}



export interface IImage {
  _id?: string;
  name: string;
  file_name?: string;
  path: string;
  relative_path?: string;
  video_url?: string;
}

export interface IPagination {
  draw: number;
  recordsTotal: number;
  currentPage: number;
  recordsFiltered: number;
  type?: string;
}

export interface IWebsite {
  website_id: string;
  website_name: string;
}

export interface IRootColor {
  "--data_button_primary_color": string;
  "--data_button_secondary_color": string;
  "--data_site_border_radius": string;
  "--data_site_font_primary": string;
  "--data_site_font_primary_url": string;
  "--data_site_font_secondary": string;
  "--data_site_font_secondary_url": string;
  "--data_site_primary_color": string;
  "--data_site_secondary_color": string;
  "--data_site_text_color": string;
  "--data_site_theme_color": string;
  "--data_site_theme_highlight": string;
  "--data_footer_bg"?: string;
  "--data_footer_text"?: string
}

export interface IMetaError {
  status: boolean;
  message: string;
  message_code: string;
  status_code: number;
}
export interface IAPIError {
  meta: IMetaError;
  errors: any;
}

export interface ICountryCode {
  country_code: string;
  country_id: string;
  country_phone_code: string;
  currency_code: string;
  currency_symbol: string;
  name: string;
}

export interface IFollowUs {
  _id: number;
  social_twitter: string;
  social_google: string;
  social_linkedin: string;
  social_youtube: string;
  social_facebook: string;
  social_instagram: string;
  social_meetlink: string;
  social_whatsapp_number: string;
}

export interface IAccount {
  account_id: string;
  account_name: string;
  code: string;
  is_main_website: number;
  ip_address: string;
  url: string;
}

export interface IAPIResponse {
  meta: IAPIMeta;
  data: IAPIData;
}

export interface IAPIMeta {
  status: boolean;
  message: string;
  message_code: string;
  status_code: number;
}

export interface IAPIData {
  original: IAPIOriginal;
  data: Array<[]>;
  user_detail: object;
  token_type: string;
  access_token: string;
  cart_count: number;
  compare_count: number;
  showProductSku: boolean;
  showQuickView: boolean;
  showAddToCart: boolean
}

export interface IAPIOriginal {
  data: Array<[]>;
  recordsFiltered: number;
  recordsTotal: number;
}

export interface ICountryData {
  country_id: string;
  _id: string;
  name: string;
  country_code: string;
  country_phone_code: string;
  currency_code: string;
  currency_symbol: string;
  country_flag: IImage[];
}

export interface IStateData {
  _id: string;
  name: string;
  state_code: string;
  country_id: string;
  is_active: number;
  updated_at: string;
  created_at: string;
}

export interface IGenderProps {
  data: IGenderPropsData[];
}

export interface IGenderPropsData {
  _id: string;
  name: string;
  code: string;
}

export interface ICityData {
  country_id: string;
  created_at: string;
  is_active: number;
  name: string;
  state_id: string;
  updated_at: string;
  _id: string;
}

export interface ISignInReducer {
  signIn: ISignInReducerData;
}

export interface ISignInReducerData {
  guestUserRootReducer: {
    guestUserFlag: string;
  };
  signIn: {
    userData: {
      original: IAPIOriginal;
      data: Array<[]>;
      user_detail: IUserDetailsData;
      token_type: string;
      access_token: string;
      cart_count: number;
      review_count: number;
    };

    cart_count: number;
    review_count: number;
  };
  displayQuickViewSKUReducer: {
    showQuickView: boolean;
    showProductSku: boolean;
    showAddToCart: boolean;
  }
}

export interface IUserDetailsData {
  email: string;
  profile_image: {
    path: string;
  };
  first_name: string;
  last_name: string;
  _id: string;
  mobile: string;
  referal_code: string;
  country: {
    country_id: string;
    country_phone_code: string;
  };
  login_usertype: string;
  session_start_time?: string;
}

export interface IReduxStore {
  signIn: ISignInReducerData;
  currencyData: {
    currencySymbol: string;
  };
  signup: {
    listData: [];
  };
  priceDisplayData: {
    priceDisplay: boolean;
  };
  whatsAppReducer: {
    whatsAppNumber: string;
    generalConNumber?: string;
    generalCountryCode?: string;
    whatsappFeed: string;
    email: string;
  }
}

export interface IOTPData {
  email?: string;
  phone?: string;
}
