import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import IBannerSection1 from "./BannerSection";
import HomeAboutUs1 from "./AboutUs";
import CustomizeJewellery1 from "./CustomizeJewellery";
import IOurProductCategory1 from "./OurProductCategory";
import DownloadApp1 from "./DownloadApp";
import OurBenifits1 from "./OurBenifits";
import Testimonial1 from "./Testimonial";
import Blog1 from "./Blog";
import SubscribeNewsLetter1 from "./SubscribeNewsLetter";
import FeatureFooter1 from "./FeatureFooter";
import IBannerSection2 from "./BannerSection/banner-section-2";
import IOurProductCategory2 from "./OurProductCategory/our-product-category-2";
import DownloadApp2 from "./DownloadApp/download-app-2";
import OurBenifits2 from "./OurBenifits/our-benefits-2";
import Testimonial2 from "./Testimonial/testimonial-2";
import Blog2 from "./Blog/blog-2";
import SubscribeNewsLetter2 from "./SubscribeNewsLetter/subscribe-news-letter-2";
import FeatureFooter2 from "./FeatureFooter/feature-footer-2";
import NewCollections from "./NewCollections";
import TrendingProductSection2 from "./TrendingProduct/trending-product-template-2";
import { BestSellerProductsSection2 } from "./BestSellerProducts/best-seller-products-2";

// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  banner_section_1: IBannerSection1,
  banner_section_2: IBannerSection2,

  aboutus_data_1: HomeAboutUs1,
  aboutus_data_2: HomeAboutUs1,

  customize_jewellery_1: CustomizeJewellery1,

  category_1: IOurProductCategory1,
  category_2: IOurProductCategory2,

  download_app_1: DownloadApp1,
  download_app_2: DownloadApp2,

  our_benefits_1: OurBenifits1,
  our_benefits_2: OurBenifits2,

  testimonials_1: Testimonial1,
  testimonials_2: Testimonial2,

  blog_1: Blog1,
  blog_2: Blog2,

  home_subscribe_newsletter_1: SubscribeNewsLetter1,
  home_subscribe_newsletter_2: SubscribeNewsLetter2,

  home_page_quick_links_1: FeatureFooter1,
  home_page_quick_links_2: FeatureFooter2,

  collection_2: NewCollections,
  trending_product_2: TrendingProductSection2,
  best_seller_product_2: BestSellerProductsSection2,
  trending_product_1: TrendingProductSection2,
  best_seller_product_1: BestSellerProductsSection2
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
