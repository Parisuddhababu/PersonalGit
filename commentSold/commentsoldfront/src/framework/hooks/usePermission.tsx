import { E_USER_TYPE } from "@/constant/enums";

type IPermissionList = {
  [key: string]: string[];
};

const usePermission = () => {
  let permissionList: IPermissionList = {
    "go-live": [E_USER_TYPE.Influencer, E_USER_TYPE.Brand, E_USER_TYPE.BrandInfluencer],
    "manage-user": [E_USER_TYPE.Brand],
    "live-schedule": [
      E_USER_TYPE.Brand,
      E_USER_TYPE.Influencer,
      E_USER_TYPE.BrandInfluencer,
    ],
    insights: [
      E_USER_TYPE.Brand,
      E_USER_TYPE.Influencer,
      E_USER_TYPE.BrandInfluencer,
    ],
    "replay-history": [E_USER_TYPE.Influencer, E_USER_TYPE.BrandInfluencer],
    catalog: [E_USER_TYPE.Brand, E_USER_TYPE.Influencer],
    "my-account": [
      E_USER_TYPE.Brand,
      E_USER_TYPE.Influencer,
      E_USER_TYPE.BrandInfluencer,
    ],
    "my-plans": [E_USER_TYPE.Brand, E_USER_TYPE.Influencer],
  };

  const getPermissionList = (
    brandName: string | undefined,
    isWhiInfluencer: boolean | undefined
  ) => {
    if (brandName === "whi" || isWhiInfluencer) {
      permissionList = {
        ...permissionList,
        catalog: [E_USER_TYPE.Influencer, E_USER_TYPE.BrandInfluencer],
      };
    }
    if (isWhiInfluencer) {
      permissionList = {
        ...permissionList,
        "go-live": [E_USER_TYPE.Influencer, E_USER_TYPE.BrandInfluencer],
      };
    }
    return permissionList;
  };

  return { getPermissionList };
};

export default usePermission;
