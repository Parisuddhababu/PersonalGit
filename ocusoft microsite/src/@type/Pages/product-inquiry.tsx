import { IImage } from "@type/Common/Base";
export interface IProductInquiryProps {
  _id: string;
  product_id: string;
  account_id?: string;
  images: IImage[];
  title: string;
  sku: string;
  pageTitle? : string
  domainName? : string
}
