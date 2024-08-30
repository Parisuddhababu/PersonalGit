import { IImage } from "@type/Common/Base";

export interface IListMainProductProps {
  id: string;
  product_id: string;
  website_product_id: string;
  currency_symbol: string;
  title: string;
  sku: string;
  slug: string;
  account_id: string;
  is_available_for_order: number;
  total_metal_price: number;
  total_diamond_price: number;
  total_color_stone_price: number;
  original_total_price: number;
  is_discounted: number;
  discount_per: number;
  is_featured: number;
  default_image: string;
  diamond_total_carat: number;
  net_weight: number;
  product_tag_name: string;
  total_price: number;
  is_fix_price?: number;
  images: IImage[];
  product: {
    gross_weight: number;
    hsn_code: number;
    sku: string;
    slug: string;
    title: string;
    _id: string;
  };
  _id: string
  price_breakup: {
    is_discounted: number
    original_total_price: number
  }
  discount_percentage: number
}

export interface IProductList {
  totalRecords: number;
  mediaPath: string;
  data: IListMainProductProps[];
}



export interface IProductListMainProps {
  totalRecords: number
  mediaPath: string
  data: IProductData1[]
  type: number
  quick_links_type: number
  category_banner: CategoryBanner
}

export interface IProductData1 {
  id: string
  product_id: string
  website_product_id: string
  currency_symbol: string
  title: string
  sku: string
  slug: string
  short_description: string
  account_id: string
  is_available_for_order: number
  is_featured: number
  total_price: number
  selling_price: number;
  default_image: string
  product_tag_name: null;
}

export interface CategoryBanner {
  image: string
}