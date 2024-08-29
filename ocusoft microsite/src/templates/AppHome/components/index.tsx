import React from "react";
import { getTypeWiseComponentName } from "@util/common";
import IBannerSection1 from "@templates/AppHome/components/BannerSection";
import { HomePageProductList } from "@templates/AppHome/components/HomePageProductList/home-page-product-list";
import SubscribeNewsLetter1 from "./SubscribeNewsLetter";
import HomePagePrescribedProductList from "./HomePageProductList/home-page-prescribed-product-list";

// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  banner_section_1: IBannerSection1,
  prescribed_products_2: HomePagePrescribedProductList,
  middle_section_2: HomePageProductList,
  home_subscribe_newsletter_1: SubscribeNewsLetter1,
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
    return <RenderComponent {...props} key={name} />;
  }
};
