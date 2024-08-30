import SignInFormSection1 from "@templates/SignIn/components/SignInForm/sign-in-form-1";
import { ISignInBanner } from "@type/Pages/signIn";

export interface ISignInForm {
  email: string;
  password: any;
  mobile: string;
  otp: string | number;
}
export interface ISigninFormProps {
  guestUser?: boolean;
  SignInformData?: ISignInBanner
  reloadPage?: boolean;
  pageOne?: boolean;
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

export interface IMobileAndEmailData {
  mobile?: string;
  email?: string;
  is_mobile?: number;
  is_email?: number;
  country?: string;
  is_mobile_signin_with_otp?: string;
  otp?: string;
  password? : string
}

export interface IMobileAndEmailProps {
  onStepOne: (_: IMobileAndEmailData) => void;
  setIsPageOne: () => void;
  previousData: IMobileAndEmailData | null;
}

export interface ISelectCountryData {
  country : string
  countryCode : string
  phone : string
}

export default SignInFormSection1;
