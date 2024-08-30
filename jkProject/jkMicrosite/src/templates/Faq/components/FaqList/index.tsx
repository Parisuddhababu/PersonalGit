import { getTypeWiseComponentName } from "@util/common";

import FaqListSection1 from "@templates/Faq/components/FaqList/faq_list_1";
import FaqListSection2 from "@templates/Faq/components/FaqList/faq_list_2";


// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  faq_list_1: FaqListSection1,
  faq_list_2: FaqListSection2,

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
