import MyProfileSection1 from "@templates/MyProfile/components/myProfile/my-profile-1";

export interface IMyProfileForm {
  first_name: string;
  last_name: string;
  email: string;
  newsletter_selection: string | number;
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export default MyProfileSection1;
