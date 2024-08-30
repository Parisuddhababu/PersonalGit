import { AnyAction } from "redux";
import { WhatsAppActionTypes } from "./whatsAppTypes";

export const Action_UpdateWhatsAppNumber = (whatsAppNumber: string): AnyAction => {
  return {
    payload: whatsAppNumber,
    type: WhatsAppActionTypes.SET_WHATSAPP_NUMBER,
  };
};

export const Action_Update_generalconf_phone_number = (generalconfPhoneNumber: string): AnyAction => {
  return {
    payload: generalconfPhoneNumber,
    type: WhatsAppActionTypes.SET_GENERAL_CONF_NUMBER,
  };
};
export const Action_Update_generalconf_country = (generalconfConutry: string): AnyAction => {
  return {
    payload: generalconfConutry,
    type: WhatsAppActionTypes.SET_GENERAL_CONF_COUNTRY,
  };
};
export const Action_Update_text_feed = (feed: string): AnyAction => {
  return {
    payload: feed,
    type: WhatsAppActionTypes.SET_WHATSAPP_FEED,
  };
};
export const Action_Update_email = (email: string): AnyAction => {
  return {
    payload: email,
    type: WhatsAppActionTypes.SET_EMAIL
  }
}

export const Action_Update_Mobile_number = (mobile: string): AnyAction => {
  return {
    payload: mobile,
    type: WhatsAppActionTypes.SET_MOBILE_NUMBER
  }
}

export const Action_Update_Country_code = (countryCode: string): AnyAction => {
  return {
    payload: countryCode,
    type: WhatsAppActionTypes.SET_COUNTRY_CODE
  }
}

export const Action_Update_Site_Logo = (logo: string): AnyAction => {
  return {
    payload: logo,
    type: WhatsAppActionTypes.SET_SITE_LOGO
  }
}