import { ICountryDropDownData } from "@type/Pages/myProfile";
import CountrySelect from "./CountrySelect";
import { ICityData, ICountryData } from "@type/Common/Base";
import { ChangeEvent } from "react";
// import { IAddEditAddressForm } from "@templates/MyAddress/components/AddEditAddress";

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
  // eslint-disable-next-line
  setCountryContact: (data: any) => void;
  placeholder: string;
  page?: string | any;
  inputId?: string;
  inputName?: string;
  className?: string;
  phoneNumberProp?:string;
  country?: ICountryDropDownData | any;
  id?: string;
  disable?: boolean;
  otpFlow?: boolean;
  // eslint-disable-next-line
  resetPhone?: (isReset: boolean) => void;
  sendedOTP?: boolean;
  // eslint-disable-next-line
  updatedOTP?: (data: string) => void;
  // eslint-disable-next-line
  sendOTP?: (isSend: boolean) => void;
  // eslint-disable-next-line
  verifyOTP?: (isVerifyClick: boolean) => void;
  changeHandler?: (_:ChangeEvent)=> void
  onTypeChangeToMobile?: true
}

export interface IDropdownProps {
  value : string | undefined,
    // eslint-disable-next-line no-unused-vars
  onChange : (data: ICountryData) => void;
  url : string;
  name : string;
  inputId : string;
  id : string;
  page : string;
  className : string;
  placeholder : string
  country?: ICountryDropDownData | any;
  disable?: boolean;
  data?: ICityData[] | undefined;
  countryId?: string | Blob;
  label?: string,
  stateId?: string,
}


// setData: (data: IData) => void;

export default CountrySelect;
