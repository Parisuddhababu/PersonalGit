import { IBaseTemplateProps } from "@templates/index";
import MyProfile from "@templates/MyProfile/my-profile";
import { IMyProfile } from "@type/Pages/myProfile";

export interface IMyProfileMain extends IBaseTemplateProps, IMyProfile {}

export default MyProfile;
