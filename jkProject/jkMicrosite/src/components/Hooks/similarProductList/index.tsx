import { IImage } from "@type/Common/Base";

export interface IUseSimilarProductState {
  product_id: string;
  sectionName?: "product_match_set" | "product_set" | "recently_view" | "similar_view";
}

export interface ISimilarProductsProps {
  default_size: string;
  images: IImage[];
  is_in_wishlist: number;
  net_weight: number;
  product: {
    gross_weight: number;
    hsn_code: number;
    sku: string;
    slug: string;
    title: string;
    _id: string;
  };
  product_id: string;
  total_price: number;
  _id: string;
  website_product_detail: {
    type: string;
    _id: string;
  };
  diamond_total_carat: number;
  price_breakup: {
    account_group_id: string;
    account_id: string;
    certificate_charge: number;
    color_stone_rate: number;
    country_id: string;
    created_at: string;
    created_by: string;
    discount_per: number;
    fancy_diamond_rate: number;
    hallmark_charge: number;
    is_active: number;
    is_b2b: number;
    is_certificate: number;
    is_customizable: number;
    is_default: number;
    is_discounted: number;
    is_for_microsite_admin: number;
    is_hallmark: number;
    labour_charge: number;
    labour_rate: number;
    metal_rate: number;
    net_weight: number;
    original_total_price: number;
    per_metal_weight_rate: number;
    product_id: string;
    sequence: string;
    side_diamond_rate: number;
    stamping_charge: number;
    total_color_stone_price: number;
    total_diamond_price: number;
    total_fancy_diamond_price: number;
    total_metal_price: number;
    total_price: number;
    total_side_diamond_price: number;
    updated_at: string;
    website_product_id: string;
    _id: string;
    is_fix_price?: number;
  };
  product_tag_name: string;
  discount_percentage?: number;
  is_available_for_order?: number;
  is_fix_price?: number
}
