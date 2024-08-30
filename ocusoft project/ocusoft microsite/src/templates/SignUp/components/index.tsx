import { getTypeWiseComponentName } from "@util/common";

import SignUpBannerSection1 from "@templates/SignUp/components/SignUpBanner/sign-up-banner-1";
import { ISignUpBanner } from "@type/Pages/signUp";

// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  signup_form_and_banner_1: SignUpBannerSection1,

};

/**
 * Render Dynamic Component
 * @param type Template Type of Dynamic Component
 * @param name component Name
 * @param props required props
 * @returns
 */

export const getComponents = (type: string, name: string, props: ISignUpBanner) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} />;
  }
};
