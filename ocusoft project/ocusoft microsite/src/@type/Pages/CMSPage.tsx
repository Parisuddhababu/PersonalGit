import { IPagination, IWebsite } from "@type/Common/Base";

export interface IICMSPageListData {
  _id: string;
  slug: string;
  page_title: string;
  description: string;
  is_active: number;
  website: IWebsite;

}

export interface ICMSPageList extends IPagination {
  data: IICMSPageListData[];
}

export interface ICMSPage {
  privacy_policy: ICMSPageList;
}
