import { getTypeWiseComponentName } from "@util/common";

import MyProfileSection1 from "@templates/MyProfile/components/myProfile/my-profile-1";
import { IMyProfileData } from "@type/Pages/myProfile";
// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  user_account_details_1: MyProfileSection1,
};

/**
 * Render Dynamic Component
 * @param type Template Type of Dynamic Component
 * @param name component Name
 * @param props required props
 * @returns
 */

export const getComponents = (type: string, name: string, props: IMyProfileData) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} />;
  }
};
