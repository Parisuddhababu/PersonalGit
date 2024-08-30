import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import IBannerSection1 from "@templates/ProductList/components/BannerSection";
import IFilterSection1 from "@templates/ProductList/components/FilterSection";
import ICurrentFilterSection1 from "@templates/ProductList/components/CurrentFilter";
import IProductListSection1 from "@templates/ProductList/components/ProductListSection/product-list-section-1";
import ICompareProductSection1 from "@templates/ProductList/components/CompareProduct";
import FeatureFooter1 from "@templates/AppHome/components/FeatureFooter";
import IQuickView1 from "@templates/ProductList/components/QuickView";
import IBannerSection2 from "@templates/ProductList/components/BannerSection/banner-section-2";
import ProductListSection2 from "@templates/ProductList/components/ProductListSection/product-list-section-2";
import FilterSection2 from "@templates/ProductList/components/FilterSection/filter-section-2";
import CurrentFilterSection2 from "@templates/ProductList/components/CurrentFilter/current-filter-section-2";
import CompareProductSection2 from "@templates/ProductList/components/CompareProduct/compare-product-section-2";
import QuickView2 from "@templates/ProductList/components/QuickView/quick-view-2";
import { SlugInfoProps } from "@components/Meta";
import FeatureFooter2 from "@templates/AppHome/components/FeatureFooter/feature-footer-2";

// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  category_banner_1: IBannerSection1,
  filter_section_1: IFilterSection1,
  current_filter_section_1: ICurrentFilterSection1,
  product_list_with_filter_options_1: IProductListSection1,
  compare_product_section_1: ICompareProductSection1,
  quick_links_1: FeatureFooter1,
  quick_links_2: FeatureFooter2,
  quick_view_1: IQuickView1,
  category_banner_2: IBannerSection2,
  product_list_with_filter_options_2: ProductListSection2,
  filter_section_2: FilterSection2,
  current_filter_section_2: CurrentFilterSection2,
  compare_product_section_2: CompareProductSection2,
  quick_view_2: QuickView2,
};

/**
 * Render Dynamic Component
 * @param type Template Type of Dynamic Component
 * @param name component Name
 * @param props required props
 * @returns
 */
export const getComponents = (type: string, name: string, props: any, domainName?: string | undefined, slugInfo?: SlugInfoProps) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} domainName ={domainName} slugInfo={slugInfo} product_tags_detail={slugInfo?.product_tags_detail} type={type}/>;
  }
};
