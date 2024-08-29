import { IImage } from "@type/Common/Base";
export interface ICatalogBanner {
  collection_image: IImage;
  title: string;
  _id: string;
  description : string
}
export interface ICatalogDetails {
  catalogue_banner: ICatalogBanner[];
}
