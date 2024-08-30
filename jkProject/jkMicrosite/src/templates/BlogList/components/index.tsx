import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import IBlogBannerSection1 from "@templates/BlogList/components/BlogBanner/blog-banner-1";
import IBlogBannerSection2 from "@templates/BlogList/components/BlogBanner/blog-banner-2";
import BlogListMain1 from "@templates/BlogList/BlogListMain/blog-list-main-1";
import BlogListMain2 from "@templates/BlogList/BlogListMain/blog-list-main-2";

// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  // For Template 1

  banner_and_blogs_1: IBlogBannerSection1,
  blog_listing_and_other_details_1: BlogListMain1,

  // For Template 2
  banner_and_blogs_2: IBlogBannerSection2,
  blog_listing_and_other_details_2: BlogListMain2,

};

/**
 * Render Dynamic Component
 * @param type Template Type of Dynamic Component
 * @param name component Name
 * @param props required props
 * @returns
 */

export const getComponents = (type: string, name: string, props: any) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} />;
  }
};
