import { IImage } from "@type/Common/Base";

export interface IChildCategory {
  name: string;
  url: string;
}
export interface IParentCategory {
  name: string;
  url: string;
  child_category: IChildCategory[];
  new_arrival_image: IImage;
  recently_viewed_image: IImage;
}
export default interface IHeader {
  name: string;
  url: string;
  parent_category: IParentCategory[];
  logo_image: IImage;
}
