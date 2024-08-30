import MyAddressSection1 from "@templates/MyAddress/components/Address/address-1";
import { ICountryData } from "@type/Common/Base";



export interface IAddressListPropsData {
    useraddressDetails : IAddressListData[]
    showOption? : boolean
    // eslint-disable-next-line no-unused-vars
    getUpdateValue?: (billingAddress?: string, shippingAddress?: string) => void
}



export interface IAddressListData {
    address_line1: string;
    address_line2: string;
    city: { _id: string; name: string };
    city_id: string;
    country: ICountryData;
    mobile_number: string;
    pincode: string;
    state: { _id: string; name: string };
    state_id: string;
    user_id: string;
    _id: string;
    country_phone_code: string;
    fullname: string;
    user?: {
      first_name?: string;
      last_name?: string;
    }
}

export default MyAddressSection1;
