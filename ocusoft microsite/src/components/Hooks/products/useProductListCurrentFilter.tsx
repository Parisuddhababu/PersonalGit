import { IUseProductListCurrentFilterProps } from "@components/Hooks/products";
import { ICustomURLState } from "@templates/ProductList/components/FilterSection";
import { IFilterOptions } from "@type/Pages/ProductFilters";
import { useEffect, useState } from "react";

const useProductListCurrentFilter = (
  props: IUseProductListCurrentFilterProps
) => {
  const [selectedFilter, setSelectedFilter] = useState<IFilterOptions[]>(
    props?.options
  );
  const [selectedRouteURL] = useState<ICustomURLState[]>(
    props?.customRouteURL
  );
  useEffect(() => {
    setSelectedFilter(props?.options);
  }, [props?.options]);


  return {
    selectedFilter,
    selectedRouteURL,
  };
};

export default useProductListCurrentFilter;
