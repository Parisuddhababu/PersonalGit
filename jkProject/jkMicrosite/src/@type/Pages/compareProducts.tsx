import { IImage } from "@type/Common/Base";
import { IPriceBreakupProduct } from "./productDetails";

export interface ICompareProductsProps {
  account_id: string;
  color_shape_stone_name: string;
  color_stone_details: any[];
  color_stone_name: string;
  default_metal: {
    metal_purity_id: string;
    metal_purity_name: string;
    metal_type_id: string;
    metal_type_name: string;
    weight: number;
  };
  default_metal_name: string;
  default_size_details: any[];
  diamond_detail_name: string;
  diamond_details: {
    carat: number;
    diamond_quality_id: string;
    diamond_quality_name: string;
    diamond_shape_id: string;
    diamond_shape_name: string;
    diamond_sieve_id: string;
    diamond_sieve_name: string;
    pcs: number;
  };
  diamond_shape_quality_name: string;
  images: IImage[];
  is_active: number;
  is_certificate: number;
  is_customizable: number;
  is_hallmark: number;
  long_desc: string;
  loyalty_program: {
    carat: number;
    point: number;
  };
  matchpair_products: any[];
  max_order_qty: number;
  min_order_qty: number;
  price_breakup: IPriceBreakupProduct;
  product: {
    dimensions: {
      height: string;
      length: string;
      width: string;
    };
    gross_weight: number;
    hsn_code: string;
    sku: string;
    slug: string;
    title: string;
    _id: string;
  };
  product_id: string;
  product_review: {
    product_id: string;
    rating: string;
    review_description: string;
    review_title: string;
    _id: string;
  }[];
  product_sets: any[];
  review_avg: number;
  seo: {
    seo_desc: string;
    seo_keywords: string;
    seo_title: string;
  }
  shop_for: {
    id: string;
    name: string;
  }[];
  shop_for_ids: string[];
  shop_for_names: string;
  short_desc: string;
  size_names: string;
  sizes: {
    size_id: string;
    size_name: string;
  }[];
  total_color_carat: number;
  total_color_pcs: number;
  total_diamond_carat: number;
  total_diamond_pcs: number;
  total_reviews: number;
  type: string;
  _id: string;
  product_tag_name: string;
  is_discounted?: number;
  is_available_for_order?: number;
}