import { Message } from "@/constant/errorMessage";
import { ALLOW200CHAR, ALLOW50CHAR, BRAND_NAME_VALIDATION, EMAIL_REGEX, IMAGES_VALIDATION, ONLY_CHARACTERS, ONLY_NUMBER, PASSWORD_REGEX1, PHONE_NUMBER_REGEX } from "@/constant/regex";

const useValidationFields = () => {
  const firstName = {
    required: Message.FIRST_NAME_REQUIRED,
    pattern: {
      value: ONLY_CHARACTERS,
      message: Message.ALLOW_ONLY_CHARACTERS,
    },
  };

  const lastName = {
    required: Message.LAST_NAME_REQUIRED,
    pattern: {
      value: ONLY_CHARACTERS,
      message: Message.ALLOW_ONLY_CHARACTERS,
    },
  };

  const email = {
    required: Message.EMAIL_REQUIRED,
    pattern: {
      value: EMAIL_REGEX,
      message: Message.EMAIL_PATTERN,
    },
  };

  const gender = {
    required: Message.GENDER_REQUIRED,
  };

  const countryCodeId = {
    required: Message.COUNTRY_REQUIRED,
  };

  const phoneNumber = {
    required: Message.MOBILE_NUMBER_REQUIRED,
    pattern: {
      value: PHONE_NUMBER_REGEX,
      message: Message.MOBILE_PATTERN,
    },
  };

  const password = {
    required: Message.PASSWORD_REQUIRED,
    pattern: {
      value: PASSWORD_REGEX1,
      message: Message.PASSWORD_PATTERN,
    },
  };

  const confirmPassword = {
    required: Message.PASSWORD_MATCH,
  };

  const apply = {
    required: Message.TERMS_CONDITIONS,
  };

  const currentPassword = {
    required: Message.CURRENT_PASSWORD_REQUIRED,
  };

  const newPassword = {
    required: Message.NEW_PASSWORD_REQUIRED,
    pattern: {
      value: PASSWORD_REGEX1,
      message: Message.PASSWORD_PATTERN,
    },
  };

  const message = {
    required: Message.MESSAGE_REQUIRED,
  };

  const keyWords = {
    required: Message.KEYWORDS,
    maxLength: {
      value: 6,
      message: Message.ALLOW6CHAR,
    },
  };

  const keyWordCount = {
    required: Message.KEYWORD_COUNT,
    pattern: {
      value: ONLY_NUMBER,
      message: Message.ALLOW_ONLY_NUMBER,
    },
    maxLength: {
      value: 3,
      message: Message.MAX_LENGTH_3,
    },
  };

  const brandName = {
    required: Message.BRAND_NAME,
    pattern: {
      value: BRAND_NAME_VALIDATION,
      message: Message.BRAND_NAME_PATTERN,
    },
  };

  const companyName = {
    required: Message.COMPANY_NAME,
  };

  const sessionCount = {
    required: Message.SESSION_COUNT,
    pattern: {
      value: ONLY_NUMBER,
      message: Message.NUMBERS,
    },
  };

  const influencerCount = {
    required: Message.INFLUENCER_COUNT,
    pattern: {
      value: ONLY_NUMBER,
      message: Message.NUMBERS,
    },
  };

  const userName = {
    required: Message.INSTAGRAM_ID_REQUIRED,
  };

  const passwordReq = {
    required: Message.PASSWORD_REQUIRED,
  };

  const streaming_key = {
    required: Message.STREAMING_KEY_REQUIRED,
  };

  const streaming_url = {
    required: Message.STREAMING_URL_REQUIRED,
  };

  const productName = {
    required: Message.PRODUCT_REQUIRED,
  };

  const url = {
    required: Message.URL_REQUIRED,
    pattern: {
      value: IMAGES_VALIDATION,
      message: Message.INVALID_PRODUCT_URL,
    },
  };

  const description = {
    required: Message.PRODUCT_DESCRIPTION,
  };

  const sku = {
    required: Message.SKU_REQUIRED,
  };

  const images = {
    required: Message.IMAGES_REQUIRED,
    pattern: {
      value: IMAGES_VALIDATION,
      message: Message.INVALID_IMAGES,
    },
  };

  const color = {
    required: Message.COLOR_REQUIRED,
  };

  const size = {
    required: Message.SIZE_REQUIRED,
  };

  const price = {
    required: Message.PRICE_REQUIRED,
    pattern: {
      value: ONLY_NUMBER,
      message: Message.ALLOW_ONLY_NUMBER,
    },
  };

  const streamTitle = {
    pattern: {
      value: ALLOW50CHAR,
      message: Message.ALLOW50CHAR,
    },
  };

  const streamDescription = {
    pattern: {
      value: ALLOW200CHAR,
      message: Message.ALLOW200CHAR,
    },
  };

  const timeZone = {
    required: Message.TIME_ZONE_REQUIRED,
  };

  const scheduleTitle = {
    required: Message.STREAM_TITLE_REQUIRED,
    ...streamTitle,
  };

  const scheduleDescription = {
    required: Message.STREAM_DESCRIPTION_REQUIRED,
    ...streamDescription,
  };

  const influencerRequired = {
    required: Message.INFLUENCER_REQUIRED,
  };

  return {
    firstName,
    lastName,
    email,
    gender,
    countryCodeId,
    phoneNumber,
    password,
    confirmPassword,
    apply,
    currentPassword,
    newPassword,
    message,
    keyWords,
    keyWordCount,
    brandName,
    companyName,
    sessionCount,
    influencerCount,
    userName,
    passwordReq,
    streaming_key,
    streaming_url,
    productName,
    url,
    description,
    sku,
    images,
    color,
    size,
    price,
    streamTitle,
    streamDescription,
    scheduleTitle,
    timeZone,
    scheduleDescription,
    influencerRequired
  };
};

export default useValidationFields;
