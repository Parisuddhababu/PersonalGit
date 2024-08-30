import { IImage, IPagination, IWebsite } from "@type/Common/Base";

export interface IFooterContactData {
  _id: string;
  website: IWebsite;
  contactus_contact_number: string;
  contactus_email: string;
  social_facebook: string;
  social_google: string;
  social_instagram: string;
  social_linkedin: string;
  social_meetlink: string;
  social_twitter: string;
  social_whatsapp_number: string;
  social_youtube: string;
  social_pinterest_link?: string
  social_tumblr_link?: string
  country?: {
    country_phone_code?: string
  }
}

export interface IFooterContact extends IPagination {
  data: IFooterContactData[];
}

export interface IFooterMenuLinks {
  link: string;
  title: string;
}

export interface IFooterMenus {
  menu_header_title: string;
  menu_links: IFooterMenuLinks[];
  is_show: number;
}

export interface IAccountData {
  account_id: string,
  account_name: string
}

export interface IFooterLogo {
  _id: string,
  account: IAccountData,
  announcement: string,
  generalconf_link: string,
  generalconf_logo: IImage,
  generalconf_phone_number: string
}

export interface IFooterDetailsData {
  "360_image_link": string;
  fb_link: string;
  footer_back_color: string;
  footer_copyright_text: string;
  footer_menus: IFooterMenus[];
  footer_text_color: string;
  google_photos_link: string;
  instagram_link: string;
  ip_address: string;
  is_active: number;
  is_main_website: number;
  linkedin_link: string;
  pintrest_link: string;
  port: string;
  sitename: string;
  sub_title: string;
  title: string;
  twitter_link: string;
  website_id: string;
  youtube_link: string;
  _id: string;
}

export interface IFooterTemplateProps {
  footerData?: IFooterContactData;
  footerMenu?: any;
  footerDescription?: string;
  footerLogo?: any;
  copyrightText?: string;
}

export interface IFooterDetails {
  data: IFooterDetailsData[];
}

export interface IFooter {
  footer_contact: IFooterContact;
  footer_details: IFooterDetails;
  footer_description: string;
}
