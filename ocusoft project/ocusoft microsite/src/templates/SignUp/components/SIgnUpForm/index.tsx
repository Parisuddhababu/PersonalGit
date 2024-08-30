import SignUpFormSection1 from "@templates/SignUp/components/SIgnUpForm/sign-up-form-1";

export interface ISignUpForm {
  first_name: string;
  last_name: string;
  name: string;
  gender_id?: string;
  country: string;
  city: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  referal_code: string;
  country_phone_code: string;
  email_otp: number,
  mobile_otp: number
  is_guest?: number,
  postal_code: string,
  state: string,
  newsletter_selection: number,
  street_address: string

}

export interface ICountryStateCityType {
  _id: string,
  name: string
}
export interface ICountryStateChange {
  value: string,
  label?: string
}



export default SignUpFormSection1;
