import IFilterSection1 from "@templates/ProductList/components/FilterSection/filter-section-1";
import { IFilterOptions, IURLFilterApplyData } from "@type/Pages/ProductFilters";
export interface IFilterSection1Props {
  options: IFilterOptions[];
  URLFilterData?: IURLFilterApplyData;
}

export interface IFilterStates {
  filter: IFilterOptions[];
}

export interface ICustomURLState {
  name: string;
  value: string[];
}

export default IFilterSection1;
