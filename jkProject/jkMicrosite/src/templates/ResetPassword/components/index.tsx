import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import ResetPasswordBanner from "@templates/ResetPassword/components/resetPasswordBanner";
import IResetPasswordBanner2 from "./resetPasswordBanner/reset-password-banner-2";
// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  reset_password_form_and_banner_1: ResetPasswordBanner,
  reset_password_form_and_banner_2: IResetPasswordBanner2,
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
