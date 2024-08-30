import { IAccount, IImage, IPagination } from "@type/Common/Base";
import IHeader from "@type/Header";
import { ReactNode } from "react";

export interface IHeaderProps {
  breadcrumbs: {
    name: string;
    link: string;
  };
  children?: ReactNode;
  pageTemplate: string;
  menu: IHeader[];
  categoryTypeCount: number;
}

export interface ISeoLink {
  menu: IMainMenuProps[];
}

export interface IHeaderTopProps {
  email: string;
  phone: string;
  fullname: string;
  profile_image: IImage;
}

export interface IHeaderTopData {
  contactus_contact_number: string;
  announcement: string;
}

export interface IMetalType {
  code: string;
  created_at: string;
  created_by: string;
  description: string;
  is_active: number;
  is_default: number;
  name: string;
  type: string;
  updated_at: string;
  updated_by: string;
  _id: string;
}

export interface IMainMenuProps {
  menu: IHeader[];
  logo: string;
  metal_type: IMetalType[];
  categoryTypeCount ?: number
}

export interface IHeaderState {
  modal: boolean;
}

export interface IMenuBottomProps {
  email: string;
  phone: string;
}

export interface IHeaderTopState {
  contact_header?: any;
  announcement: string;
  generalconf_logo: IImage;
  generalconf_favicon_icon: IImage;
  generalconf_phone_number: string;
  website: {
    website_id: string;
    website_name: string;
  };
  _id: string;
  generalconf_link: string;
  cartCount: number;
  wishlistCount: number;
  availablePages: string[];
  header_contact?: IheaderContact[];
  menu?: ITYPE;
}

interface ITYPE {
  type: number;
}

export interface IheaderContact {
  data : IHeaderContactData[]
}

export interface IHeaderContactData {
  country: {
    country_phone_code:string
  }
  contact_header?: {
    country: {
      country_phone_code: string;
    };
  };
}

export interface IHeaderTopProps {
  headerData: IHeaderTopState;
}

export interface IPopup extends IPagination {
  //  Main Popup Data
  popup_form: IPopupData[];
}

export interface ISlug_Details {
  slug_id: string;
  slug_name: string;
}
export interface IPopupData {
  _id: string;
  slug_master_details: ISlug_Details[];
  slug_master_id: [];
  url: string;
  valid_from: string;
  valid_to: string;
  form_field: [] | [any];
  image: IImage;
  is_active: number;
  duration: number;
  account: IAccount;
}

export interface IPopupUseData {
  form_field: [] | [string];
  image: IImage | null;
}