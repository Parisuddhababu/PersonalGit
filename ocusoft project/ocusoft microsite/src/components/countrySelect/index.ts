import { ICountryDropDownData } from "@type/Pages/myProfile";
import CountrySelect from "@components/countrySelect/CountrySelect";
import { ICityData, ICountryData } from "@type/Common/Base";

export interface ICountrySelectState {
  countryList: ICountrylist[];
  topCountryList: ICountrylist[];
  phone: string;
  selectedFlag: string;
  contactPlaceholder: string;
  countryCode: string;
  country: string;
  inputId: string;
  inputName: string;
  cursor: number;
  filter: string;
}

export interface ICountrylist {
  label: string;
  iso2: string;
  value: string;
}

export interface ICountrySelectProps {
  placeholder: string;
  page?: string [];
  inputId?: string;
  inputName?: string;
  className?: string;
  phoneNumberProp?:string;
  country?: ICountryDropDownData;
  id?: string;
  disable?: boolean;
  otpFlow?: boolean;
  resetPhone?: (isReset: boolean) => void;
  sendedOTP?: boolean;
  updatedOTP?: (data: string) => void;
  sendOTP?: (isSend: boolean) => void;
  verifyOTP?: (isVerifyClick: boolean) => void;

}

export interface IDropdownProps {
  value : string | undefined,
  onChange : (data: ICountryData) => void;
  url : string;
  name : string;
  inputId : string;
  id : string;
  page : string;
  className : string;
  placeholder : string
  country?: ICountryDropDownData ;
  disable?: boolean;
  data?: ICityData[];
  countryId?: string | Blob;
  label?: string,
  stateId?: string,
}


export default CountrySelect;
