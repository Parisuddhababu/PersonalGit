import { ICountryData, IFollowUs, IImage } from "@type/Common/Base";

export interface Ievent_detail_with_map {
  title: string;
  description: string;
  location_details: string;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  link: string;
  cover_image: IImage;
  emails: IEmailsData[];
  country: ICountryData[];
  phones: IPhonesData[];
  is_active: number;
  account: {
    account_id: string;
  };
  images_of_event: IImage[];
  event_interested: { event_id: string }[];
  type: string;
}

export interface IPhonesData {
  phone: string;
  country: string;
}

export interface IEmailsData {
  email: string;
}

export interface IVerticalSection extends Ievent_detail_with_map {
  share_event: IShareEvent;
  Logo_event: ILogoEvent;
  organizer: IOrganizer;
}

export interface IOrganizer {
  name: string;
  account_address: IAccountAddressData[];
}

export interface IAccountAddressData {
  account_id: string;
  address_line1: string;
  address_line2: string;
  state_id: string;
  city_id: string;
  pincode: number;
  is_active: number;
  is_default: number;
  state: {
    id: string;
    name: string;
  };
  city: {
    id: string;
    name: string;
  };
}

export interface ILogoEvent {
  data: ILogoEventData[];
}

export interface ILogoEventData {
  account: {
    account_id: string;
    account_name: string;
  };
  announcement: string;
  generalconf_link: string;
  generalconf_logo: IImage;
  generalconf_phone_number: number;
}

export interface IShareEvent {
  data: IFollowUs[];
  type: number;
}

export interface IEvent_detail_banner {
  _id: string;
  banner_title: string;
  link: string;
  banner_image: IImage;
  is_active: number;
  created_at: string;
}

export interface IBannerData {
  data: IBannerDataList,
  type: string;
}

export interface IBannerDataList {
  details: IEventDetailsMain;
  event_detail_banner: IEvent_detail_banner;
  interestedList: IEventInterested[];
  start_date?: string;
}

export interface IEventInterested {
  _id: string,
  event_id: string,
  is_interested: number
}

export interface IEventDetailsMain {
  event_detail_with_map: Ievent_detail_with_map;
  event_detail_banner: IEvent_detail_banner[];
  Logo_event: ILogoEvent;
  organizer: IOrganizer;
  photo_slider_type: string;
  event_detail_banner_type: string;
  share_event: IShareEvent;
}
