import { getTypeWiseComponentName } from "@util/common";
import React from "react";
import ContactUsMain1 from "@templates/contact-us-list/components/contactUsMain/contactUsMain-1";
import { IContactUsMain } from "..";


// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  contactus_1: ContactUsMain1,
};

/**
 * Render Dynamic Component
 * @param type
 * @param name component Name
 * @param props required props
 * @returns
 */
export const getComponents = (type: string, name: string, props: IContactUsMain) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} />;
  }
};
