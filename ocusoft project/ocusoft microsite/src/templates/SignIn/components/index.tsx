import { getTypeWiseComponentName } from "@util/common";

import SignInBannerSection1 from "@templates/SignIn/components/SignInBanner/sign-in-banner-1";
import { ISignInBanner } from "@type/Pages/signIn";


// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  signin_form_and_banner_1: SignInBannerSection1,

};

/**
 * Render Dynamic Component
 * @param type Template Type of Dynamic Component
 * @param name component Name
 * @param props required props
 * @returns
 */

export const getComponents = (type: string, name: string, props: ISignInBanner) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} />;
  }
};
