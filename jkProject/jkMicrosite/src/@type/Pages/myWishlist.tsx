import { IProductTagList } from "@components/Meta";
import { IImage, IPagination } from "@type/Common/Base";

export interface IWishListProps extends IPagination {
  data: IWishListPropsData[];
  guest?: boolean;
  refreshData: () => void;
  product_tags_detail?: IProductTagList[];
}

export interface IWishListPropsData {
  images: IImage[] | IImage;
  price_breakup: IPriceBreakUProps;
  product: IProductProps;
  product_id:string
  _id : string;
  product_tag_name: string;
  is_discounted?: number;
  is_available_for_order?: number;
}

export interface IPriceBreakUProps {
  is_available_for_order: number;
  original_total_price: number;
  product_id: string;
  total_price: number;
  website_product_id: string;
  is_discounted: number; 
  discount_per: number;
}

export interface IProductProps {
  sku: string;
  title: string;
  _id: string;
}
