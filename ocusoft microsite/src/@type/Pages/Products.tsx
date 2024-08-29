import { IImage } from "@type/Common/Base";

interface ICategoryTypes {
  category_type_id: string;
  category_type_name: string;
}

interface ICategories {
  category_id: string;
  category_name: string;
}

interface ISubCategories {
  sub_category_id: string;
  subcategory_name: string;
}

interface IOccasions {
  occasione_id: string;
  occasion_name: string;
}
interface IDimensions {
  height: string;
  width: string;
  length: string;
}

interface IShopFor {
  shop_for_id: string;
  shop_for_name: string;
}

export interface IDiamondDetails {
  type: string;
  diamond_shape_id: string;
  diamond_shape_name: string;
  diamond_sieve_id: string;
  diamond_sieve_name: string;
  diamond_quality_id: string;
  diamond_quality_name: string;
  carat: string;
  pcs: string;
}

interface IColorStoneDetails {
  color_stone_shape_id: string;
  color_stone_id: string;
  carat: number;
  pcs: number;
  color_stone_shape_name: string;
  color_stone_name: string;
}

interface IloyaltyProgram {
  carat: number;
  point: number;
}

interface IDefaultMetal {
  weight: number;
  metal_type_id: string;
  metal_type_name: string;
  metal_purity_id: string;
  metal_purity_name: string;
}

interface IDefaultSizeDetails {
  default_size_id: string;
  default_size_name: string;
  default_size_code: string;
}

interface IWebsiteProductDetail {
  _id: string;
  type: string;
  net_weight: number;
  shop_for: IShopFor[];
  sizes: string[];
  size_ids: string[];
  diamond_details: IDiamondDetails[];
  color_stone_details: IColorStoneDetails[];
  is_active: number;
  is_top_sell: number;
  is_customizable: number;
  is_new: number;
  is_featured: number;
  is_available_for_order: number;
  is_certificate: number;
  is_hallmark: number;
  loyalty_program: IloyaltyProgram;
  default_metal: IDefaultMetal;
  min_order_qty: string;
  max_order_qty: string;
  product_id: string;
  account_id: string;
  images: IImage[];
  default_size_details: IDefaultSizeDetails;
  long_desc: string;
  seo: string[];
  short_desc: string;
  labour_type_ids: string[];
  discount_percentage: number;
  show_discounted_price: number;
  product_tag_name: string
}

interface IProductSizeList {
  _id: string;
  name: string;
  code: string;
}

export interface IPriceBreakup {
  _id: string;
  website_product_id: string;
  product_id: string;
  net_weight: number;
  account_id: string;
  account_group_id: string;
  sequence: string;
  country_id: string;
  hallmark_charge: number;
  stamping_charge: number;
  certificate_charge: number;
  metal_rate: number;
  side_diamond_rate: number;
  fancy_diamond_rate: number;
  color_stone_rate: number;
  labour_rate: number;
  total_metal_price: number;
  total_side_diamond_price: number;
  total_diamond_price: number;
  total_fancy_diamond_price: number;
  total_color_stone_price: number;
  labour_charge: number;
  total_price: number;
  is_discounted: number;
  is_featured:number,
  discount_per: number;
  original_total_price: number;
  is_customizable: number;
  is_certificate: number;
  is_hallmark: number;
  is_default: number;
  is_b2b: number;
  is_for_microsite_admin: number;
  is_active: number;
  created_by: string;
  updated_at: string;
  created_at: string;
  metal_quality: string;
  is_fix_price?: number;
}

interface ISocialList {
  social_facebook: string;
  social_google: string;
  social_instagram: string;
  social_linkedin: string;
  social_meetlink: string;
  social_twitter: string;
  social_whatsapp_number: string;
  social_youtube: string;
  _id: string;
}

interface ISocialData {
  data: ISocialList[];
}

export interface IProductDetailsData {
  _id: string;
  title: string;
  sku: string;
  product:{
    sku: string;
    title:string;
  }
  hsn_code: number;
  category_type_names: string;
  category_types: ICategoryTypes[];
  category_type_ids: string[];
  categorie_names: string;
  categories: ICategories[];
  category_ids: string[];
  sub_categorie_names: string;
  sub_categories: ISubCategories[];
  sub_category_ids: string[];
  occasions: IOccasions[];
  occasion_names: string;
  occasion_ids: string[];
  gross_weight: number;
  dimensions: IDimensions;
  updated_by: string;
  website_product_detail: IWebsiteProductDetail;
  images: IImage[];
  product_size_list: IProductSizeList[];
  price_breakup: IPriceBreakup;
  social_links: ISocialData;
  not_sure_size: {
    is_size_link: number;
    sizefile: {
      path: string;
    };
    size_link: string;
  };
}

export interface IProductDetails {
  data: IProductDetailsData;
}

interface ICategorySummaryItem {
  qty: number;
  label: string;
  diamondCarats: number;
  colorStoneCarats: number;
  metalWeight: number;
}

export interface ICategorySummaryItems {
  name: string;
  data: ICategorySummaryItem[];
}
