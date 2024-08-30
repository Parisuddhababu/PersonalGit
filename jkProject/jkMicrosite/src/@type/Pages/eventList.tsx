import { IImage, IPagination } from "@type/Common/Base";

export interface IEventList  {
  //  Main Event list
  data: IEventListPageData;
}

export interface IEventListPageData extends IPagination{
  data: IEventListData[];
}

export interface IEventListData {
  _id: string;
  title: string;
  description: string;
  location_details: string;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  link: string;
  cover_image: IImage;
  is_active: number;
  event_interested: any[];
}

export interface IEventBanner {
  // main Event Banner
  banner_title: string;
  link: string;
  banner_image: IImage;
  is_active: number;
  created_at: string;
  type: number;
  _id: string
}

export interface IEvent {
  event_event_list: IEventList;
  event_banner_type: string;
  event_list: IEventList;
  event_banner: IEventBanner;
}
