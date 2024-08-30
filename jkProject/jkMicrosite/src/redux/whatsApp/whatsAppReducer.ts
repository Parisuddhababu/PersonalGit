import { WhatsAppActionTypes } from "./whatsAppTypes";

const initialState = {
    whatsAppNumber: '',
    generalConNumber: '',
    generalCountryCode: '',
    whatsappFeed: '',
};

export interface IWhatsAppReducerType {
  type?: string;
  payload: string;
}

export const WhatsAppReducer = (
  state = initialState,
  { type, payload }: IWhatsAppReducerType
) => {
  switch (type) {
    case WhatsAppActionTypes.SET_WHATSAPP_NUMBER:
      return { ...state, whatsAppNumber: payload };
    case WhatsAppActionTypes.SET_GENERAL_CONF_NUMBER:
      return { ...state, generalConNumber: payload };
    case WhatsAppActionTypes.SET_GENERAL_CONF_COUNTRY:
      return { ...state, generalCountryCode: payload };
    case WhatsAppActionTypes.SET_WHATSAPP_FEED:
      return { ...state, whatsappFeed: payload };
    default:
      return state;
  }
};

export default WhatsAppReducer;
