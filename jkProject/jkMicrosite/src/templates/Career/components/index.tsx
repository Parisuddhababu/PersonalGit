import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import BannerWithSearchBoxSection1 from "@templates/Career/components/bannerWithSearchBox/banner-with-searchBox-1";
import CareerListSection1 from "@templates/Career/components/careerList/career-list-1";
import BannerWithSearchBoxSection2 from "@templates/Career/components/bannerWithSearchBox/banner-with-searchBox-2";
import CareerListSection2 from "@templates/Career/components/careerList/career-list-2";

// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  banner_with_searchbox_1: BannerWithSearchBoxSection1,
  career_list_1: CareerListSection1,
  banner_with_searchbox_2: BannerWithSearchBoxSection2,
  career_list_2: CareerListSection2,
};

/**
 * Render Dynamic Component
 * @param type
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
