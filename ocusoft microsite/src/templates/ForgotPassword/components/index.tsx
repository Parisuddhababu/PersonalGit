import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import ForgotPasswordBanner, { IForgotPasswordBannerProps } from "@templates/ForgotPassword/components/ForgotPasswordBanner";
// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  forgot_password_form_and_banner_1: ForgotPasswordBanner,
};

/**
 * Render Dynamic Component
 * @param type
 * @param name component Name
 * @param props required props
 * @returns
 */
export const getComponents = (type: string, name: string, props: IForgotPasswordBannerProps) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} />;
  }
};
