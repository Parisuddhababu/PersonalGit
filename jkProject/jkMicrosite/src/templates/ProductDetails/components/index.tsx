import { getTypeWiseComponentName } from "@util/common";
import React from "react";
import ExploreDesign1 from "@templates/ProductDetails/components/ExploreDesign";
import ExploreDesign2 from "@templates/ProductDetails/components/ExploreDesign/explore-design-2";

import ProductShipingDetail1 from "@templates/ProductDetails/components/ProductShipingDetail";
import ProductShipingDetail2 from "@templates/ProductDetails/components/ProductShipingDetail/product-shiping-detail-2";
import RatingReview1 from "@templates/ProductDetails/components/RatingReview";
import RecentlyViewProduct1 from "@templates/ProductDetails/components/RecentlyProductView";
import RecentlyViewProduct2 from "@templates/ProductDetails/components/RecentlyProductView/recently-product-view-2";

import SimilarProductView1 from "@templates/ProductDetails/components/SimilarProductView";
import SimilarProductView2 from "@templates/ProductDetails/components/SimilarProductView/similar-product-view-2";

import WebsiteProductDetails1 from "@templates/ProductDetails/components/WebsiteProductDetail";
import WebsiteProductDetails2 from "@templates/ProductDetails/components/WebsiteProductDetail/website-product-detail-2";
import RatingReview2 from "@templates/ProductDetails/components/RatingReview/rating-and-review-2";
import ProductPairView from "./RecentlyProductView/product-pair-view";
import ProductSetView from "./RecentlyProductView/product-set-view";
import FeatureFooter1 from "@templates/AppHome/components/FeatureFooter";
import FeatureFooter2 from "@templates/AppHome/components/FeatureFooter/feature-footer-2";
import { IProductTagList } from "@components/Meta";
import ProductPairView2 from "./RecentlyProductView/product-pair-view-2";
import ProductSetView2 from "./RecentlyProductView/product-set-view-2";

// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  website_product_detail_1: WebsiteProductDetails1,
  website_product_detail_2: WebsiteProductDetails2,
  product_and_shipping_details_1: ProductShipingDetail1,
  product_and_shipping_details_2: ProductShipingDetail2,
  product_similar_views_1: SimilarProductView1,
  product_similar_views_2: SimilarProductView2,

  rating_and_reviews_1: RatingReview1,
  rating_and_reviews_2: RatingReview2,

  recently_viewed_products_1: RecentlyViewProduct1,
  recently_viewed_products_2: RecentlyViewProduct2,

  pair_products_1: ProductPairView,
  pair_products_2: ProductPairView2,
  match_products_1: ProductSetView,
  match_products_2: ProductSetView2,
  explore_other_designs_1: ExploreDesign1,
  explore_other_designs_2: ExploreDesign2,

  quick_links_1: FeatureFooter1,
  quick_links_2: FeatureFooter2,

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
