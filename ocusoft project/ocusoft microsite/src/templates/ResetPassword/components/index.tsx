import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import ResetPasswordBanner, { IResetPasswordBannerProps } from "@templates/ResetPassword/components/resetPasswordBanner";
// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  reset_password_form_and_banner_1: ResetPasswordBanner,
};

/**
 * Render Dynamic Component
 * @param type
 * @param name component Name
 * @param props required props
 * @returns
 */
export const getComponents = (type: string, name: string, props: IResetPasswordBannerProps) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} />;
  }
};
