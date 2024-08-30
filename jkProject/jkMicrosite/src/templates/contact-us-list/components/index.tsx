import { getTypeWiseComponentName } from "@util/common";
import React from "react";
import ContactUsMain1 from "./contactUsMain/contactUsMain-1";
import ContactUsMain2 from "./contactUsMain/contactUsMain-2";


// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  contactus_1: ContactUsMain1,
  contactus_2: ContactUsMain2
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
