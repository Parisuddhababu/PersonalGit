import {
  IAddCatalogValidations,
  IAddInflueValiadtions,
  IChangePasswordValidations,
  IContactUsValidations,
  IForgotPasswordValidations,
  IGoLiveStep1Validations,
  IGoLiveStep2Validations,
  IInstaWithKeyValidations,
  IInstaWithPasswordValidations,
  IKeywordValidations,
  IMyAccountValidations,
  IResetPasswordValidations,
  IScheduleStep1Validations,
  IScheduleStep4Validations2,
  ISignInFormValidations,
  ISignUpFormValidations,
  IStartGrowingValidations,
} from "@/types/hooks";
import useValidationFields from "./fields";

const useValidation = () => {
  const {
    firstName,
    message,
    lastName,
    email,
    brandName,
    companyName,
    sessionCount,
    influencerCount,
    gender,
    keyWords,
    keyWordCount,
    countryCodeId,
    phoneNumber,
    password,
    confirmPassword,
    apply,
    currentPassword,
    newPassword,
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
    influencerRequired,
  } = useValidationFields();

  const signUpFormValidations: ISignUpFormValidations = {
    firstName,
    lastName,
    email,
    gender,
    countryCodeId,
    phoneNumber,
    password,
    confirmPassword,
    apply,
  };

  const signInFormValidations: ISignInFormValidations = {
    email,
    password,
  };

  const changePasswordValidations: IChangePasswordValidations = {
    currentPassword,
    newPassword,
  };

  const contactUsValidations: IContactUsValidations = {
    firstName,
    lastName,
    countryCodeId,
    phoneNumber,
    email,
    message,
  };

  const forgotPasswordValidations: IForgotPasswordValidations = {
    email,
  };

  const myAccountValidations: IMyAccountValidations = {
    firstName,
    lastName,
    email,
    phoneNumber,
  };

  const keywordValidations: IKeywordValidations = {
    keyWords,
    keyWordCount,
  };

  const addInflueValiadtions: IAddInflueValiadtions = {
    firstName,
    lastName,
    email,
    gender,
    phoneNo: phoneNumber,
  };

  const resetPasswordValidations: IResetPasswordValidations = {
    password,
  };

  const startGrowingValidations: IStartGrowingValidations = {
    brandName,
    companyName,
    firstName,
    lastName,
    phoneNumber,
    brandEmail: email,
    sessionCount,
    influencerCount,
  };

  const instaWithPasswordValidations: IInstaWithPasswordValidations = {
    username: userName,
    password: passwordReq,
  };

  const instaWithKeyValidations: IInstaWithKeyValidations = {
    streaming_key,
    streaming_url,
  };

  const addCatalogValidations: IAddCatalogValidations = {
    name: productName,
    url,
    description,
    sku,
    images,
    color,
    size,
    price,
  };

  const goLiveStep1Validations: IGoLiveStep1Validations = {
    streamTitle,
    streamDescription,
  };

  const goLiveStep2Validations: IGoLiveStep2Validations = {
    productId: productName,
  };

  const scheduleStep1Validations: IScheduleStep1Validations = {
    streamTitle: scheduleTitle,
    streamDescription: scheduleDescription,
    timeZone,
  };

  const scheduleStep4Validations2: IScheduleStep4Validations2 = {
    user_uuid1: influencerRequired,
    product_uuid1: productName,
    user_uuid2: influencerRequired,
    product_uuid2: productName,
    user_uuid3: influencerRequired,
    product_uuid3: productName,
    user_uuid4: influencerRequired,
    product_uuid4: productName,
  };

  return {
    signUpFormValidations,
    signInFormValidations,
    changePasswordValidations,
    contactUsValidations,
    forgotPasswordValidations,
    myAccountValidations,
    keywordValidations,
    addInflueValiadtions,
    resetPasswordValidations,
    startGrowingValidations,
    instaWithPasswordValidations,
    instaWithKeyValidations,
    addCatalogValidations,
    goLiveStep1Validations,
    goLiveStep2Validations,
    scheduleStep1Validations,
    scheduleStep4Validations2,
  };
};

export default useValidation;
