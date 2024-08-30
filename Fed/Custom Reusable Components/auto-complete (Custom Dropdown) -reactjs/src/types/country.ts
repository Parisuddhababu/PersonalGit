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
  activeScrollElement: number;
}

export interface ICountrylist {
  label: string;
  iso2: string;
  value: string;
}

export interface ICountrySelectProps {
  setCountryContact: (data: ISelectedCountry) => void;
  placeholder: string;
  inputId?: string;
  inputName?: string;
  className?: string;
}

export interface ISelectedCountry {
  country: string;
  countryCode: string;
  phone: string;
}