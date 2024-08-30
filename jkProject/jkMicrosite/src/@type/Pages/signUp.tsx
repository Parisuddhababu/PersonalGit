import { IImage } from "@type/Common/Base";

export interface ISignUpBanner {
  banner_title: string;
  banner_image: IImage;
  link: string;
  is_active: number;
  created_at: string;
  type: number;
}

export interface ISignUpBannerProps {
  isGuest?: boolean , 
  SignUpformData?:ISignUpBanner
} 

export interface ISignUpMain {
  signUpBanner: ISignUpBanner;
}
