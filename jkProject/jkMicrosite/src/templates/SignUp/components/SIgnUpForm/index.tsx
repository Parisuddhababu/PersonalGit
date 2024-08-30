import SignUpFormSection1 from "@templates/SignUp/components/SIgnUpForm/sign-up-form-1";

export interface ISignUpForm {
  // company_name: any;
  first_name: any;
  last_name: any;
  name: any;
  gender_id: string;
  country: string;
  city: string;
  mobile: string;
  email: string;
  password: any;
  confirmPassword: any;
  referal_code: any;
  country_phone_code: string;
  email_otp: number,
  mobile_otp: number
  is_guest?: number,

}

export default SignUpFormSection1;
