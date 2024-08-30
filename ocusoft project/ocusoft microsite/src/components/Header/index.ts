import { IAccount, IImage, IPagination } from "@type/Common/Base";

export interface IHeaderProps {
  menu: HeaderMenu;
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

export type HeaderMenu = {
  categories: {
    icon_image: string | null
    image: string | null
    url: string
    name: string
    parent_category: {
      icon_image: string | null
      image: string | null
      url: string
      name: string
      description?: string
      child_category: []
    }[]
  }[]
}

export interface IMainMenuProps {
  menu: HeaderMenu;
}

export interface IHeaderState {
  modal: boolean;
}

export interface IMenuBottomProps {
  email: string;
  phone: string;
}

export interface IHeaderTopState {
  contact_header?: string;
  base_template?: number;
  cartCount: number;
  availablePages: string[];
  header_contact?: IheaderContact[];
  menu?: ITYPE;
  data: {
    header: {
      announcement: string;
      country: {
        country_phone_code: string;
      }
      header_link: string;
      mobile: string;
      email: string;
      site_logo: {
        path: string;
      }
    },
    micrsoite_logo: {
      loader_image: {
        path: string;
      }
    }

  }
}

interface ITYPE {
  type: number;
}

export interface IheaderContact {
  data: IHeaderContactData[]
}

export interface IHeaderContactData {
  country: {
    country_phone_code: string
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

export interface ISlugDetails {
  slug_id: string;
  slug_name: string;
}
export interface IPopupData {
  _id: string;
  slug_master_details: ISlugDetails[];
  slug_master_id: [];
  url: string;
  valid_from: string;
  valid_to: string;
  form_field: [];
  image: IImage;
  is_active: number;
  duration: number;
  account: IAccount;
}

export interface IPopupUseData {
  form_field: [] | [string];
  image: IImage | null;
}