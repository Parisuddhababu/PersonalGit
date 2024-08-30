import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import ForgotPasswordBanner from "@templates/ForgotPassword/components/ForgotPasswordBanner";
import IForgotPasswordBanner2 from "./ForgotPasswordBanner/forgot-password-banner-2";

// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  forgot_password_form_and_banner_1: ForgotPasswordBanner,
  forgot_password_form_and_banner_2: IForgotPasswordBanner2
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
