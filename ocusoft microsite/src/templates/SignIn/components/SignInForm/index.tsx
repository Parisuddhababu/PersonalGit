import SignInFormSection1 from "@templates/SignIn/components/SignInForm/sign-in-form-1";
import { ISignInBanner } from "@type/Pages/signIn";

export interface ISignInForm {
  email: string;
  password:string;
}
export interface ISigninFormProps {
  guestUser?: boolean;
  SignInformData?: ISignInBanner
  reloadPage?: boolean;
  onComplete?: () => void;
}

export interface ISignInSocialState {
  social_id: string;
  social_type: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface IOTP {
  otp: string;
}

export default SignInFormSection1;
