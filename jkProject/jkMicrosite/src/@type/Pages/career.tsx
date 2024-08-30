import { IImage, IPagination } from "@type/Common/Base";

export interface ICareerBannerWithSearchBox {
  banner_image: IImage;
  banner_title: string;
  created_at: string;
  is_active: number;
  link: string;
  _id: string;
}

export interface ICareerList extends IPagination {
  data: ICarrerListData[];
}

export interface ICarrerListData {
  created_at: string;
  description: string;
  location: string;
  max_exp: number;
  min_exp: number;
  title: string;
  type: string;
  _id: string;
  showMore: boolean
}

export interface ICareer {
  ICareerBannerWithSearchBox: ICareerBannerWithSearchBox;
  ICareerList: ICareerList;
}
