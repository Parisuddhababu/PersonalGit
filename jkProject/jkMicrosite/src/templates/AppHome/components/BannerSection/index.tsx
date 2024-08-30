import { IHomeBannerDetails } from "@type/Pages/home";
import IBannerSection1 from "./banner-section-1";
export interface IBannerSection1Props {
  banner1: IHomeBannerDetails;
  banner2: IHomeBannerDetails;
}

export interface IBanner {
  _id: string;
  banner_title: string;
  type: string;
  link: string;
  banner_image: {
    _id: string;
    file_name: string;
    path: string;
    relative_path: string;
    sorting: number;
  };
}

export interface IBannerProps {
  data: IBanner[];
  type: number;
}

export default IBannerSection1;
