import { IImage } from "@type/Common/Base";

export interface ISignInBanner {
  banner_title: string;
  banner_image: IImage;
  link: string;
  is_active: number;
  created_at: string;
  type: number;
  guest_user?:boolean
}

export interface ISignInMain {
  signUpBanner: ISignInBanner;
}
