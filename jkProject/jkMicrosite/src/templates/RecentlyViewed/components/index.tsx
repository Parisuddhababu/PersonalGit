import { getTypeWiseComponentName } from "@util/common";
import React from "react";
import RecentlyViewListing1 from "@templates/RecentlyViewed/components/Listing/RecentlyViewListing-1";
import RecentlyViewListing2 from "@templates/RecentlyViewed/components/Listing/RecentlyViewListing-2";
import { IProductTagList } from "@components/Meta";

// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  recently_viewed_1: RecentlyViewListing1,
  recently_viewed_2: RecentlyViewListing2,

};


/**
 * Render Dynamic Component
 * @param type Template Type of Dynamic Component
 * @param name component Name
 * @param props required props
 * @returns
 */
export const getComponents = (type: string, name: string, props: any,product_tags_detail : IProductTagList[] | undefined) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} product_tags_detail={product_tags_detail}/>;
  }
};
