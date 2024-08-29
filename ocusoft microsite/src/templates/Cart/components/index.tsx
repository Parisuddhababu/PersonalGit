import { getTypeWiseComponentName } from "@util/common";
import React from "react";
import CartList1 from "@templates/Cart/components/CartList/cartList-1";


// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
    cart_items_1: CartList1,
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
