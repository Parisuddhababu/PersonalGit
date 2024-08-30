import AddEditAddress from "@templates/MyAddress/components/AddEditAddress/addEditAddres-1";
import { ICityData, ICountryData, IStateData } from "@type/Common/Base";

export interface IAddEditAddressProps {
  onClose: () => void;
  isModal: boolean;
  filteredData?: IAddEditAddressForm;
  cityData?: ICityData[];
  countryData?: ICountryData[];
  stateData?: IStateData[];
  editMode?: boolean;
  setFormEditMode: () => void;
  idOfAddress?: string;
  showOption?: boolean;
  billingAddressId?: string;
  shippingAdressId?: string
  onComplete: () => void
}

export interface ICity {
  _id: string;
  name: string
}

export interface IState {
  _id: string;
  name: string
}

export interface IAddEditAddressForm {
  first_name: string;
  last_name: string;
  country_id: string |undefined;
  mobile_number: string;
  address: string
  country: {
    value: string;
    name: string;
    country_id: string;
  };
  state_id: string,
  city_id: string;
  pincode: string;
  is_default_billing: number;
  is_default_shipped: number;
  state: {
    name: string;
    state_id: string;
    value: string;

  };
  city: {
    name: string;
    value: string;
    city_id: string;
  }

}

export default AddEditAddress;
