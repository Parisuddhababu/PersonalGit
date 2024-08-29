import { IImage, IWebsite } from "@type/Common/Base";
import { IDiamondDetails } from "@type/Pages/Products";
import { IProduct } from "@type/Pages/recentlyView";
import HomePageMiddleSectionProducts from "@components/HomePageMiddleSection/HomePageMiddleSectionProducts";
import { IProductTagList } from "@components/Meta";
import { IHomePagePrescription } from "@components/HomePagePrescription";

export interface IBestSellerTrendingProductProps {
  data?: IBestSellerTrendingProductsData[];
  title?: string;
  product_tags_detail?: IProductTagList[]
  key: number;
}

export interface IBestSellerTrendingProductsData {
  _id?: string;
  type?: string;
  net_weight?: number;
  default_size?: string;
  diamond_details?: IDiamondDetails;
  product_tag_name?: string[],
  images: IImage[],
  total_price?: number,
  original_total_price?: number,
  is_discounted?: number
  discount_per?: number,
  website_product_detail?: IWebsite
  product?: IProduct
}


export interface HomeMiddlePrescription {
  products: IHomePagePrescription[];
  title: string;
  _id: string;
  product_id: string[];

}

export default HomePageMiddleSectionProducts;
