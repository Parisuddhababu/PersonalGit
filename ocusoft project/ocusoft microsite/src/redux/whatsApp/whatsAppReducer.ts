import { WhatsAppActionTypes } from "./whatsAppTypes";

const initialState = {
  whatsAppNumber: '',
  generalConNumber: '',
  generalCountryCode: '',
  whatsappFeed: '',
  email: '',
  mobileNumber: '',
  countryCode: ''
};

export interface IWhatsAppReducerType {
  type?: string;
  payload: string;
}

export interface IWhatsappState {
  whatsAppNumber: string,
  generalConNumber: string,
  generalCountryCode: string,
  whatsappFeed: string,
  email: string,
  mobileNumber: string,
  countryCode: string,
  logo: string,
}

export const WhatsAppReducer = (
  state: IWhatsappState,
  { type, payload }: IWhatsAppReducerType
) => {
  const newState = state ?? initialState;
  switch (type) {
    case WhatsAppActionTypes.SET_WHATSAPP_NUMBER:
      return { ...newState, whatsAppNumber: payload };
    case WhatsAppActionTypes.SET_GENERAL_CONF_NUMBER:
      return { ...newState, generalConNumber: payload };
    case WhatsAppActionTypes.SET_GENERAL_CONF_COUNTRY:
      return { ...newState, generalCountryCode: payload };
    case WhatsAppActionTypes.SET_WHATSAPP_FEED:
      return { ...newState, whatsappFeed: payload };
    case WhatsAppActionTypes.SET_EMAIL:
      return { ...newState, email: payload };
    case WhatsAppActionTypes.SET_MOBILE_NUMBER:
      return { ...newState, mobileNumber: payload }
    case WhatsAppActionTypes.SET_COUNTRY_CODE:
      return { ...newState, countryCode: payload }
    case WhatsAppActionTypes.SET_SITE_LOGO:
      return { ...newState, logo: payload }
    default:
      return newState;
  }
};

export default WhatsAppReducer;
