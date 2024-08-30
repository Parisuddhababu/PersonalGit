import { IImage, IPagination, IWebsite } from "@type/Common/Base";
import { IFilterOptions } from "@type/Pages/ProductFilters";


export interface ICategoryType {
  category_type_id: string;
  category_type_name: string;
}
export interface ICategory {
  category_id: string;
  category_name: string;
}
export interface ISubCategory {
  sub_category_id: string;
  subcategory_name: string;
}
export interface ICollection {
  collection_id: string;
  collection_name: string;
}

export interface IStyle {
  style_id: string;
  style_name: string;
}

export interface IOccasion {
  occasione_id: string;
  occasion_name: string;
}

export interface IDimension {
  height: number;
  width: number;
  length: number;
}
export interface IProduct {
  _id: string;
  title: string;
  sku: string;
  hsn_code: string;
  category_type_ids: Array<string>;
  sub_category_ids: Array<string>;
  collection_ids: Array<string>;
  style_ids: Array<string>;
  occasion_ids: Array<string>;
  category_types: ICategoryType[];
  category_type_names: string;
  categories: ICategory;
  categorie_names: string;
  sub_categories: ISubCategory[];
  sub_categorie_names: string;
  collections: ICollection;
  collection_names: string;
  styles: IStyle[];
  style_names: string;
  occasions: IOccasion;
  occasion_names: string;
  gross_weight: number;
  net_weight: number;
  dimensions: IDimension;
  product_available_in_days: number;
  created_by: string;
  slug: string;
  updated_by: string;
  account_id: string;
}

export interface ICollectionDetailsPdf {
    _id: string;
    name: string;
    file_name: string;
    path: string;
    relative_path: string;
    sorting: string;
}

export interface ICollectionDetailsData {
    _id: string;
    title: string;
    description: string;
    pdf: ICollectionDetailsPdf;
    product_id: string[];
    website: IWebsite;
    collections_image: IImage;
    collection_slug: string;
    desktop_image: IImage;
    mobile_image: IImage;
    menu_logo: IImage;
    is_active: number;
    sorting: number;
    created_at: string;
    collection_filter: IFilterOptions[];
}

export interface IProductDetailsData {
    _id: string;
    images: IImage[];
    product_id: string;
    product: IProduct;
    total_diamond_carat: number;
    is_added_to_wishlist: number;
    slug: string;
    product_price: number;
    is_in_wishlist: number;
}

export interface IProductDetails extends IPagination {
    data: IProductDetailsData[];
}

export interface ICollectionShow {
    collecion_details: ICollectionDetailsData;
    product_details: IProductDetails;
}

export interface ICollectionDetails {
    collection_banner: ICollectionDetailsData[];
}
