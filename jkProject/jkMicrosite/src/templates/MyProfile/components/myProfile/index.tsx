import MyProfileSection1 from "@templates/MyProfile/components/myProfile/my-profile-1";

export interface IMyProfileForm {
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  points: string;
  country: string;
  mobile_otp?: string;
}

export default MyProfileSection1;
