import { IBaseTemplateProps } from "@templates/index";
import ProductList from "@templates/ProductList/product-list";
import { IFilterOptions } from "@type/Pages/ProductFilters";

export interface IProductBannerProps {
  image: string;
  title: string;
}

export interface IProductBannerReq {
  sub_category?: string;
  category?: string;
  category_type?: string;
}

export interface IListProductProps {
  commingFromOther?: boolean;
  OtherProductTotalPages?: number;
  FilterOptions?: IFilterOptions[];
  applyFilter?: () => void;
  pageName?: string;
}

export interface IonAppliedFilterChangeState {
  module_name: string;
  ids: string[];
  category_type_id?: string;
  category_id?: string;
}

export interface IProductSortByOptionsProps {
  name: string;
  sortby: string;
  urlValue: string;
}

export type ProductListingBreadcrumbs = {
  title: string
  slug: string
  image: string
}[]

export type ProductListProps = {
  breadCrumbData: ProductListingBreadcrumbs
  categories: IProductCategories[]
}
export interface IProductCategories {
  description: string | null;
  icon_image: string | null;
  image: string;
  name: string;
  url: string;
}

export interface ICategoryProducts {
  child_category: IProductCategories[];
  description: string | null;
  icon_image: string | null;
  image: string;
  name: string;
  url: string;
}
export interface IProductBox {
  product_id: string;
  account_id: string;
  currency_symbol: string;
  default_image: string;
  id: string;
  is_available_for_order: number;
  is_featured: number;
  product_tag_name: null | string;
  short_description: string;
  sku: string;
  slug: string;
  title: string;
  total_price: number;
  website_product_id: string | number;
}

export interface IProductListProps extends IBaseTemplateProps, IListProductProps { }

export default ProductList;
