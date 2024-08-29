import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import WebsiteProductDetails1 from "@templates/ProductDetails/components/WebsiteProductDetail";
import { IProductTagList } from "@components/Meta";

// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  website_product_detail_1: WebsiteProductDetails1,

};

/**
 * Render Dynamic Component
 * @param type
 * @param name component Name
 * @param props required props
 * @returns
 */
export const getComponents = (type: string, name: string, props: any,product_tags_detail : IProductTagList[] | undefined) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} product_tags_detail={product_tags_detail} type={type} />;
  }
};
