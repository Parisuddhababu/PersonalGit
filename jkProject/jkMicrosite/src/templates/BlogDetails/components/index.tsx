import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import IBlogDetailsRelatedPostSection1 from "@templates/BlogDetails/components/BlogDetailsRelatedPosts/blog-details-related-posts-1";
import IBlogDetailsRelatedPostSection2 from "@templates/BlogDetails/components/BlogDetailsRelatedPosts/blog-details-related-posts-2";

import BlogOtherDetails1 from "./BlogOtherDetails/BlogOtherDetails-1";
import BlogOtherDetails2 from "./BlogOtherDetails/BlogOtherDetails-2";

// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  blog_and_other_detail_1: BlogOtherDetails1,
  related_blog_1: IBlogDetailsRelatedPostSection1,

  // Components For Template 2
  blog_and_other_detail_2: BlogOtherDetails2,
  related_blog_2: IBlogDetailsRelatedPostSection2,

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
