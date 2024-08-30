import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import IBannerSection1 from "@templates/ProductList/components/BannerSection";
import IProductListSection1 from "@templates/ProductList/components/ProductListSection/product-list-section-1";
import { SlugInfoProps } from "@components/Meta";
import { ParentCategory } from "@type/Pages/catalogue";

// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  category_banner_1: IBannerSection1,
  product_list_with_filter_options_1: IProductListSection1,
};

/**
 * Render Dynamic Component
 * @param type Template Type of Dynamic Component
 * @param name component Name
 * @param props required props
 * @returns
 */
export const getComponents = (type: string, name: string, props: {
  breadCrumbData: { image:string | null, title: string, slug: string }[]
},
  domainName?: string | undefined, slugInfo?: SlugInfoProps,
  productListing?: any, categories?: ParentCategory[]) => {

  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} domainName={domainName}
      slugInfo={slugInfo} product_tags_detail={slugInfo?.product_tags_detail}
      type={type}
      productListing={productListing}
      categories={categories}
    />;
  }
};
