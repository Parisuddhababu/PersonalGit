import { IBaseTemplateProps } from "@templates/index";
import ProductList from "@templates/ProductList/product-list";
import { IFilterOptions } from "@type/Pages/ProductFilters";

export interface IProductBannerProps {
  image: string;
  mobileImage?: string;
  title: string;
  description: string;
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

export interface productSortByOptionsProps {
  name: string;
  sortby: string;
  urlValue: string;
}

export interface IProductListProps extends IBaseTemplateProps, IListProductProps {}

export default ProductList;
