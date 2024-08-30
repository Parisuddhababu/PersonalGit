import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import QuotationData1 from "@templates/Quotation/components/data/quotation-data-1"


// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  quotation_1: QuotationData1,
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
