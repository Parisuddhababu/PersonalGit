import ICurrentFilterSection1 from "@templates/ProductList/components/CurrentFilter/current-filter-section-1";
import { IFilterOptions } from "@type/Pages/ProductFilters";
import { ICustomURLState } from "@templates/ProductList/components/FilterSection";

export interface ICurrentFilterProps {
  options: IFilterOptions[];
  // @ts-ignore
  // eslint-disable-next-line
  resetFilters: (data, cateogryId, updatedRouteURL) => void;
  isFilterApply: boolean;
  customRouteURL: ICustomURLState[];
  resetAllFiltersPrice: () => void;
}

export default ICurrentFilterSection1;
