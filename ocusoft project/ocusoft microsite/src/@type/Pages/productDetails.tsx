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
  total_price: number
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

export interface IWebsiteCategory {
  url_key: string;
  name: string;
  entity_id: string;
  _id: string;
}

export interface IProductDetails {
  price_breakup: {
    is_discounted: boolean | string | number;
    discount_per: string | number;
  }
  website_product_detail: {
    product_tag_name: string;
    is_available_for_order: number | string;
    product: {
      attachment_file: string[];
      base_image: string;
      categories: {
        category: IWebsiteCategory[];
        category_type: IWebsiteCategory[]
      };
      description: string;
      low_stock_qty: number;
      media_gallery: string[];
      name: string;
      product_icons: IProductIcons[];
      short_description: string;
      sku: string;
      product_purchase_limit: number;
      backorder?:number
    };
    product_id: string;
    selling_price: number;
    _id: string;
  };
  website_product_detail_type: number;
}

export interface IProductIcons {
  icon_image: string;
  icon_label: string;
}


