import MyAddressSection1 from "@templates/MyAddress/components/Address/address-1";



export interface IAddressListPropsData {
  useraddressDetails: IAddressListData[]
  showOption?: boolean
  getUpdateValue?: (billingAddress?: string, shippingAddress?: string) => void
}



export interface IAddressListData {
  newsletter_selection: string | number;
  email: string;
  address: string;
  city: {
    name: string;
    value: string;
    city_id: string;
  }
  city_id: string;
  country: {
    value: string;
    name: string;
    country_id: string;
    country_phone_code:string;
  };
  mobile_number: string;
  pincode: string;
  state: {
    name: string;
    state_id: string;
    value: string;
  };
  state_id: string;
  user_id: string;
  _id: string;
  country_phone_code: string;
  fullname: string;
  user?: {
    first_name?: string;
    last_name?: string;
  }
  first_name: string;
  last_name: string;
  is_default_shipped: number;
  is_default_billing: number;
  country_id: string
}





export default MyAddressSection1;
