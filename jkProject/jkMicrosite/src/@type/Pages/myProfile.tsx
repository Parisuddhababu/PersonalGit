import { ICountryCode, IImage } from "@type/Common/Base";

export interface ICountryDropDownData {
    country_id: string | any;
    name: string;
    country_code: string;
    country_phone_code: string;
    currency_code: string;
    currency_symbol: string;
    country_flag: IImage[]
}
export interface IMyProfileData extends ICountryCode {
  email: string;
  first_name: string;
  last_name: string;
  mobile: string;
  _id: string;
  country: ICountryDropDownData
  points:string;
  profile_image:IImage
}

export interface imageData {
  imageData ?: IImage
}

export interface IMyProfile {
  IMyProfileData: IMyProfileData;
}
