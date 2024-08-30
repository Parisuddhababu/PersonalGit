import { IImage } from "@type/Common/Base";

export interface IExploreOtherDesign {
  data: {
    _id: string;
    name: string;
    slug: string;
  }[];
  type: number;
}

interface IDiamondDetails {
  diamond_shape_id: string;
  diamond_shape_name: string;
  diamond_quality_id: string;
  diamond_quality_name: string;
  diamond_sieve_id: string;
  diamond_sieve_name: string;
  pcs: number;
  carat: number;
  per_carat_rate: string;
  total_price: number;
}

interface IColorStoneDetails {
  color_stone_shape_id: string;
  color_stone_shape_name: string;
  color_stone_quality_id: string;
  color_stone_quality_name: string;
  color_stone_sieve_id: string;
  color_stone_sieve_name: string;
  color_stone_name: string;
  pcs: number;
  carat: number;
  per_carat_rate: string;
  total_price: number;
  color_stone_id: string
}

export interface IImageVideo {
  _id?: string;
  name: string;
  file_name?: string;
  path: string;
  relative_path?: string;
  video_url?: string;
}

export interface IWebsiteProductDetails {
  _id: string;
  diamond_details: IDiamondDetails[];
  color_stone_details: IColorStoneDetails[];
  is_certificate: number;
  is_hallmark: number;
  default_metal: {
    weight: number;
    metal_type_id: string;
    metal_purity_id: string;
  };
  max_order_qty: string;
  min_order_qty: string;
  product_id: string;
  images: IImageVideo[];
  default_size_details: { default_size_id: string };
  product_certificate: {
    _id: string;
    image: IImage;
    name: string;
  }[];
  is_available_for_order: number;
  is_customizable: number;
  long_desc: string;
  short_desc: string;
  metal_type: string;
  default_metal_type: string;
  product_tag_name: string;
  discount_percentage?: number;
  video:IImageVideo;
  thumbnail?:IThumbnailData
}

export interface IThumbnailData {
  _id: string;
  file_name: string;
  path: string;
  relative_path: string;
  sorting: any[]; // You might want to define a specific type for sorting if available
}

export interface IPriceBreakupProduct {
  _id: string;
  website_product_id: string;
  product_id: string;
  net_weight: number;
  hallmark_charge: number;
  stamping_charge: number;
  certificate_charge: number;
  metal_rate: number;
  side_diamond_rate: number;
  color_stone_rate: number;
  labour_rate: number;
  total_metal_price: number;
  total_diamond_price: number;
  total_color_stone_price: number;
  labour_charge: number;
  total_price: number;
  is_discounted: number;
  discount_per: number;
  original_total_price: number;
  is_certificate: number;
  is_hallmark: number;
  created_at: string;
  diamond_details: IDiamondDetails[];
  color_stone_details: IColorStoneDetails[];
  metal_quality: string;
  account_id: string;
  metal_type: string;
  is_fix_price?: number;
  metal_discount?: number;
  colorstone_discount?: number;
  diamond_discount?: number;
  colorstone_discount_type? : string;
  metal_discount_type? : string;
  diamond_discount_type? : string;
}

export type CustomizableMetal = {
  metal_data_name: string;
  metal_purity_code: string;
  metal_purity_id: string;
  metal_purity_name: string;
  metal_type_code: string;
  metal_type_id: string;
  metal_type_name: string;
  rate_card_id: string;
  _id: string;
}[];

export interface IProductCustomisation {
  customizable_diamonds: {
    diamond_quality_code: string;
    diamond_quality_id: string;
    diamond_quality_name: string;
    _id: string;
  }[];
  customizable_metals: {
    [key: string]: CustomizableMetal
  }
  customizable_color_stones: IColorStoneDetails[]
}

export interface IProductDetails {
  _id: string;
  title: string;
  sku: string;
  hsn_code: string;
  category_type_names: string;
  dimensions: {
    width: string;
    height: string;
    length: string;
  };
  is_in_wishlist: number;
  is_view_price_breakup: number;
  product_similar_views: {
    type: number;
  };
  product_and_shipping_details: {
    type: number;
  };
  rating_and_reviews_type: number;
  recently_viewed_products_type: number;
  explore_other_designs: IExploreOtherDesign;
  website_product_detail: IWebsiteProductDetails;
  website_product_detail_type: number;
  product_size_list: {
    _id: string;
    name: string;
  }[];
  price_breakup: IPriceBreakupProduct;
  gross_weight:number
  seo_details: {
    meta_title: string;
    meta_keyword: string;
    meta_description: string;
  };
  not_sure_size: {
    is_size_link: number;
    sizefile: {
      path: string;
    };
    size_link: string;
  };
  products_customisation: IProductCustomisation;
  new_size_id?: string;
  default_size_details: {
    default_size_id: string
  }

}
