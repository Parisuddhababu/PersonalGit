import { getTypeWiseComponentName } from "@util/common";

import MyOrderSection1 from "@templates/MyOrder/components/Order/index";
import { IMyOrderListData } from "@type/Pages/orderDetails";
// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  order_list_1: MyOrderSection1,
};

/**
 * Render Dynamic Component
 * @param type Template Type of Dynamic Component
 * @param name component Name
 * @param props required props
 * @returns
 */

export const getComponents = (type: string, name: string, props: IMyOrderListData) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} />;
  }
};
