import AddEditAddress from "@templates/MyAddress/components/AddEditAddress/addEditAddres-1";
import { ICityData, ICountryData, IStateData } from "@type/Common/Base";

export interface IAddEditAddressProps {
  onClose: () => void;
  isModal: boolean;
  filteredData?: IAddEditAddressForm;
  clearFilteredData: () => void;
  cityData?: ICityData[];
  countryData?: ICountryData[];
  stateData?: IStateData[];
  editMode?: boolean;
  setFormEditMode: () => void;
  // eslint-disable-next-line
  stateChages: (state: string) => any;
  // eslint-disable-next-line
  countryChange: (country: string | undefined) => any;
  idOfAddress?: string;
  showOption?: boolean
}

export interface ICity {
  _id : string;
  name : string
}

export interface IState {
  _id : string;
  name : string
}

export interface IAddEditAddressForm {
  fullname?: string;
  address_line1?: string;
  address_line2?: string;
  country_id?: string;
  city_id?: string;
  pincode?: string;
  mobile_number?: string;
  is_active?: number;
  state_id?: string;
  country?: ICountryData
  country_phone_code: string;
  name?: string;
  city?: ICity;
  state?: IState
}

export default AddEditAddress;
