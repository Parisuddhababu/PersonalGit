import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import ReferEarnBanner1 from "@templates/refer-earn/components/Banner";
import ReferEarnDetail1 from "@templates/refer-earn/components/Details"


// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  refer_earn_banner_1: ReferEarnBanner1,
  refer_earn_detail_1: ReferEarnDetail1
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
