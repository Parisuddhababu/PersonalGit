import { IProductTagList } from "@components/Meta";
import WebsiteProductDetails1 from "@templates/ProductDetails/components/WebsiteProductDetail/website-product-detail-1";
import { IProductDetails } from "@type/Pages/productDetails";
export interface IWebsiteProductDetailsProps {
  data: IProductDetails;
  product_tags_detail?: IProductTagList[];
  type : number
}

export interface IPincodeMessage {
  message: string;
  isValid: boolean;
}

export interface IProductBadgeProps {
  details : IProductDetails
  product_tags_detail : IProductTagList[] | undefined
}

export default WebsiteProductDetails1;
