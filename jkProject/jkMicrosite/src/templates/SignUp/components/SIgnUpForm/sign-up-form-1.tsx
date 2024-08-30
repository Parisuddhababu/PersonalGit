import { useForm, SubmitHandler } from "react-hook-form";
import { ISignUpForm } from "@templates/SignUp/components/SIgnUpForm/index";
import { useEffect, useState } from "react";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import { Message } from "@constant/errorMessage";
import CountrySelect from "@components/countrySelect";
import { EMAIL_REGEX, ONLY_CHARACTERS, PASSWORD_REGEX, PHONENUMBER_REGEX } from "@constant/regex";
import FormValidationError from "@components/FormValidationError";
import FacebookLogin from "@components/customSocialLogin/facebookLogin";
import Head from "next/head";
import GoogleLogin from "@components/customSocialLogin/googleLogin";
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import {
  IAPIResponse,
  // ICityData,
  IGenderPropsData,
} from "@type/Common/Base";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { useToast } from "@components/Toastr/Toastr";
import { useRouter } from "next/router";
import ErrorHandler from "@components/ErrorHandler";
import {
  getCountryName,
  getCountryObj,
  getCurrentSelectedCountry,
  setDataInCookies,
  setDataInLocalStorage,
} from "@util/common";
import { ISignInSocialState } from "@templates/SignIn/components/SignInForm";
import { getCurrentGuestCartItems } from "@util/addGuestCartData";
import { setLoader } from "src/redux/loader/loaderAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@components/customLoader/Loader";
import { Action_UserDetails, userSignInOTP } from "src/redux/signIn/signInAction";
import { setGuestUser } from "src/redux/guestUser/guestUserAction";
import DropdownWithSearch from "@components/DropdownWithSearch/DropdownWithSearch";
import Link from "next/link";
import Cookies from "js-cookie";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { encryptDecrypt } from "@components/Hooks/paymentGatewayKey/usePaymentGatewayKey";

const SignUpFormSection1 = ({ isGuest = false }) => {
  const router = useRouter();
  const { referral_code } = router.query;
  const [countryVal, setCountryVal] = useState<string | undefined>();
  const [cityVal, setCityVal] = useState<string>("");

  const [defaultValues] = useState({
    // company_name: "",
    first_name: "",
    last_name: "",
    gender_id: APPCONFIG.DEFAULT_GENDER_ID,
    country: getCurrentSelectedCountry(),
    city: APPCONFIG.DEFAULT_STATE_ID,
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    referal_code: referral_code ? referral_code : "",
    country_phone_code: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ISignUpForm>({
    defaultValues,
  });

  const loaderData = useSelector((state) => state);

  // const [cityData, setCityData] = useState<ICityData[]>();
  // const [countryData, setCountryData] = useState<ICountryData[]>();
  const [passwordType, setPasswordType] = useState<string>("password");
  const [passwordTypeConfirmPassword, setPasswordTypeConfirmPassword] = useState<string>("password");

  const [genderOption, setGenderOption] = useState<IGenderPropsData[]>();
  const [showOtpForm, setShowOtpForm] = useState(false);
  const watchAllFields = watch();
  const { makeDynamicFormDataAndPostData } = usePostFormDataHook();
  const [selectedCountry, setSelectedCountry] = useState<object>();
  const [socialFacebookId, setSocialFacebookId] = useState<string | null>(null);
  const [socialGoogleId, setSocialGoogleId] = useState<string | null>(null);
  const propertyArrayOfOmit = [
    // "company_name",
    "city",
    "confirmPassword",
    "gender_id",
    "password",
    "referal_code",
    "country_phone_code",
  ];
  const [isOtpOptional, setIsOtpOptional] = useState<number>(1);

  useEffect(() => {
    setCountryVal(getCountryName());
    setSelectedCountry(getCountryObj());
  }, []);

  useEffect(() => {
    setSelectedCountry(getCountryObj());
    setCountryVal(getCountryName());
    // eslint-disable-next-line
  }, [Cookies.get("countryObj"), Cookies.get("country_name")]);

  const omitTheData = (data: ISignUpForm) => {
    propertyArrayOfOmit?.map((ele) => {
      // @ts-ignore
      delete data[ele];
    });
    data.is_guest = 1;
    return data;
  };

  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<ISignUpForm> = (data) => {
    // @ts-ignore
    dispatch(setLoader(true));
    if (isGuest) {
      if (showOtpForm) {
        const omittedObject = omitTheData(data);

        const responceData = makeDynamicFormDataAndPostData(omittedObject, APICONFIG.GUEST_USER_OTP_VERIFY);

        responceData
          ?.then(async (resp) => {
            setDataInRedux(resp);
            showSuccess(resp?.meta?.message);
            setDataInLocalStorage("auth", resp?.data, true);
            setDataInCookies("auth", resp?.data);
            setDataInRedux(resp);
            if (resp?.data) {
              // @ts-ignore
              // dispatch(setLoader(false));
              // showSuccess(resp?.meta?.message);
              // setDataInLocalStorage("auth", resp?.data, true);
              // setDataInCookies("auth", resp?.data);

              // currentCartData?.map(async (ele: any) => {
              //   await guestUpdateOriginalCart({
              //     item_id: ele?.item_id,
              //     qty: ele?.qty,
              //     from_guest: true,
              //   });
              // });
              const currentCartData = getCurrentGuestCartItems();
              if (currentCartData?.length) {
                await pagesServices.postPage(
                  APICONFIG.GUEST_ADD_TO_CART,
                  { "product_id": currentCartData },
                );
              }
              // @ts-ignore
              dispatch(setLoader(false));
              window.location.href = "/cart/checkout_list"
              // setTimeout(() => {
              //   router.push("/cart/checkout_list");

              //   // @ts-ignore
              //   dispatch(setLoader(false));
              // }, 1000);
            } else {
              // @ts-ignore
              dispatch(setLoader(false));
              ErrorHandler(resp, showError);
            }
          })
          .catch((error) => {
            // @ts-ignore
            dispatch(setLoader(false));
            ErrorHandler(error, showError);
          });
      } else {
        const omittedObject = omitTheData(data);
        const responceData = makeDynamicFormDataAndPostData(omittedObject, APICONFIG.GUEST_USER_SIGNUP);

        responceData
          ?.then((resp) => {
            if (resp?.data) {
              // @ts-ignore
              dispatch(setLoader(false));
              setShowOtpForm(true);
              showSuccess(resp?.meta?.message);
            } else {
              // @ts-ignore
              dispatch(setLoader(false));
              ErrorHandler(resp, showError);
            }
          })
          .catch((err) => {
            // @ts-ignore
            dispatch(setLoader(false));
            ErrorHandler(err, showError);
          });
      }
    } else {
      const responceData = makeDynamicFormDataAndPostData(data, APICONFIG.SIGNUP_API);
      responceData
        ?.then(async (resp) => {
          if (resp?.data && resp?.meta) {
            // @ts-ignore
            dispatch(setLoader(false));
            showSuccess(resp?.meta?.message);
            const obj = {
              email: data?.email,
              phone: data?.mobile,
            };
            isOtpOptional === 1 && dispatch(userSignInOTP(obj));
            router.push("/sign-in");
          } else {
            // @ts-ignore

            dispatch(setLoader(false));
            ErrorHandler(resp, showError);
          }
        })
        .catch((error) => {
          ErrorHandler(error, showError);
          // @ts-ignore
          dispatch(setLoader(false));
        });
    }
  };

  const onError = (errors: any) => {
    const keys = Object.keys(errors);
    keys.map((ele) => {
      showError(errors[ele].message);
    });
  };

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    // getAllCityList();
    getGenderData();
    getSocialLoginKey();
    // getAllCountryData();
    // getCitiesAsPerCountry(APPCONFIG.DEFAULT_COUNTRY_ID, []);
    // eslint-disable-next-line
  }, []);

  const getSocialLoginKey = async () => {
    const obj = {
      url: window.location.origin,
    };
    const response = await pagesServices.postPage(APICONFIG.GET_ACCOUNT_SHOW_LIST, obj);
    if (response?.status && response?.status_code === 200) {
      if (response?.data?.SETTINGS) {
        setSocialFacebookId(response?.data?.SETTINGS?.facebook_app_id || null);
        setSocialGoogleId(response?.data?.SETTINGS?.google_client_id || null);
      }
    }

    if(response?.data?.ACCOUNT_URL_DATA){
      setIsOtpOptional(response?.data?.ACCOUNT_URL_DATA?.send_otp)
    }
  };

  // const getAllCountryData = async () => {
  //   await pagesServices
  //     .postPage(APICONFIG.GET_ALL_COUNTRIES_LIST, {})
  //     .then((result) => {
  //       if (result.meta && result.status_code == 200) {
  //         setCountryData(result?.data?.country_list);
  //       }
  //     });
  // };

  const getGenderData = async () => {
    await pagesServices.getPage(APICONFIG.GENDER, {}).then((result) => {
      if (result.meta && result.status_code == 200) {
        setGenderOption(result?.data?.gender_list ? result?.data?.gender_list : ["Male", "Female", "Other"]);
      }
    });
  };

  // const getCitiesAsPerCountry = (countryId: string, data: any) => {

  //   setValue("country_phone_code", (data.length && data) ? data?.[0]?.country_phone_code : '+91');
  //   setValue("country", countryId);
  //   const formData = new FormData();
  //   formData.append("country_id", countryId);
  //   pagesServices
  //     .postPage(APICONFIG.GET_CITY_NAME_API, formData)
  //     .then((result) => {
  //       setCityData(result?.data?.city_list);
  //       setValue("city", APPCONFIG.DEFAULT_STATE_ID)
  //     })
  //     .catch((err) => err);
  //   // }
  // };

  const Validations = {
    first_name: {
      required: Message.FIRSTNAME_REQUIRED,
      pattern: {
        value: ONLY_CHARACTERS,
        message: Message.ALLOW_ONLY_CHARACTERS,
      },
    },
    last_name: {
      required: Message.LASTNAME_REQUIRED,
      pattern: {
        value: ONLY_CHARACTERS,
        message: Message.ALLOW_ONLY_CHARACTERS,
      },
    },
    gender_id: {
      required: Message.GENDER_REQUIRED,
    },
    country: {
      required: Message.COUNTRY_REQUIRED,
    },
    city: {
      required: Message.CITY_REQUIRED,
    },
    mobile: {
      required: Message.MOBILENUMBER_REQUIRED,
      pattern: {
        value: PHONENUMBER_REGEX,
        message: Message.MOBILE_PATTERN,
      },
    },
    email: {
      required: Message.EMAIL_REQUIRED,
      pattern: {
        value: EMAIL_REGEX,
        message: Message.EMAIL_PATTERN,
      },
    },
    password: {
      required: Message.PASSWORD_REQUIRED,
      pattern: {
        value: PASSWORD_REGEX,
        message: Message.PASSWORD_PATTERN,
      },
    },
    confirmPassword: {
      required: Message.PASSWORD_MATCH,
      validate: (value: any) => value === watchAllFields.password || Message.PASSWORD_MATCH,
    },
    email_otp: {
      required: Message.EMAILOTP_REQUIRED,
    },
    mobile_otp: {
      required: Message.MOBILEOTP_REQUIRED,
    },
  };

  const setDataInRedux = (data: IAPIResponse) => {
    // @ts-ignore
    dispatch(Action_UserDetails(data));
    // @ts-ignore
    dispatch(setGuestUser(false));
  };

  /**
   * Handle Facebook login response
   * @param response
   */
  const responseFacebook = (response: any) => {
    if (response?.userId || response?.id) {
      const formData = {
        social_id: response?.userId || response?.id,
        social_type: "facebook",
        first_name: response?.first_name,
        last_name: response?.last_name,
        email: response?.email,
      };
      socialSignIn(formData);
    }
  };

  /**
   * Handle Google Login Response
   * @param response
   */
  const responseGoogle = (response: any) => {
    if (response?.googleId) {
      const formData = {
        social_id: response?.googleId,
        social_type: "Google",
        first_name: response?.givenName,
        last_name: response?.familyName,
        email: response?.email,
      };
      socialSignIn(formData);
    }
  };

  /**
   * Handle Social Sign In
   * @param formData
   */
  const socialSignIn = async (formData: ISignInSocialState) => {
    await pagesServices.postPage(APICONFIG.SOCIAL_LOGIN_API, formData).then(
      async (result) => {
        if (result?.data && result?.meta) {
          showSuccess(result?.meta?.message);
          setDataInLocalStorage("auth", result?.data, true);
          setDataInCookies("auth", result?.data);
          setDataInRedux(result);
          if (isGuest) {
            const currentCartData = getCurrentGuestCartItems();
            // await currentCartData?.map(async (ele: any) => {
            //   await guestUpdateOriginalCart({
            //     item_id: ele?.item_id,
            //     qty: ele?.qty,
            //     from_guest: true,
            //   });
            // });
            if (currentCartData?.length) {
              await pagesServices.postPage(
                APICONFIG.GUEST_ADD_TO_CART,
                { "product_id": currentCartData },
              );
            }
            // router.push("/cart/list");
            window.location.href = "/cart/checkout_list"
          } else {
            const currentCartData = getCurrentGuestCartItems();
            if (currentCartData?.length) {
              await pagesServices.postPage(
                APICONFIG.GUEST_ADD_TO_CART,
                { "product_id": currentCartData },
              );
            }
            // router.push("/");
            window.location.href = "/"
          }
          // router.push("/");
        } else {
          ErrorHandler(result, showError);
        }
      },
      (error) => {
        ErrorHandler(error, showError);
      }
    );
  };

  const setCountryId = (data: any) => {
    setValue("country_phone_code", data?.countryCode);
    setValue("mobile", data?.phone);
  };

  const onCountryChange = (data: any) => {
    setValue("country", data._id);
    setCountryVal(data.name);
    // getCitiesAsPerCountry(data._id, data)
    setSelectedCountry(data);
  };

  const onCityChange = (data: any) => {
    setValue("city", data._id);
    setCityVal(data.name);
  };

  const onTogglePassword = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else {
      setPasswordType("text");
    }
  };

  const onToggleConfirmPassword = () => {
    if (passwordTypeConfirmPassword === "text") {
      setPasswordTypeConfirmPassword("password");
    } else {
      setPasswordTypeConfirmPassword("text");
    }
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.toasterDesign +
            ".css"
          }
        />

        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.signUp + ".min.css"
          }
        />
      </Head>
      {/* @ts-ignore */}
      {loaderData?.loaderRootReducer?.loadingState ? (
        <Loader />
      ) : (
        <section className="sign-up-sec ">
          <div className="container">
            <div className="sign-up-wrap">
              {!showOtpForm && (
                <>
                  {socialFacebookId || socialGoogleId ? (
                    <div className="social-links-access">
                      <div className={`d-row access-links ${socialFacebookId && socialGoogleId ? "" : "single-item"}`}>
                        {socialFacebookId && (
                          <div className="d-col d-col-2">
                            <FacebookLogin
                              onClose={responseFacebook}
                              buttonLabel="Sign Up with Facebook"
                              facebookId={socialFacebookId}
                            />
                          </div>
                        )}
                        {socialGoogleId && (
                          <GoogleOAuthProvider clientId={encryptDecrypt(socialGoogleId) as string}>
                            <div className="d-col d-col-2">
                              <GoogleLogin
                                onClose={responseGoogle}
                                buttonLabel="Sign Up with Google"
                              />
                            </div>
                          </GoogleOAuthProvider>
                        )}
                      </div>
                      <p>OR</p>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}

              <form onSubmit={handleSubmit(onSubmit, onError)}>
                <div className="d-row">
                  {showOtpForm && (
                    <>
                      <div className="d-col">
                        <div className="form-group">
                          <label>Email Otp</label>
                          <input
                            {...register("email_otp", Validations["email_otp"])}
                            type="text"
                            name="email_otp"
                            className="form-control"
                            id="email_otp"
                          />
                          <FormValidationError errors={errors} name="email_otp" />
                        </div>
                      </div>
                      <div className="d-col">
                        <div className="form-group">
                          <label>Mobile Otp</label>
                          <input
                            {...register("mobile_otp", Validations["mobile_otp"])}
                            type="text"
                            name="mobile_otp"
                            className="form-control"
                            id="mobile_otp"
                          />
                          <FormValidationError errors={errors} name="mobile_otp" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* {!isGuest && (
                    <div className="d-col d-col-2">
                      <div className="form-group">
                        <label>Company Name</label>
                        <input
                          {...register("company_name")}
                          type="text"
                          name="company_name"
                          className="form-control"
                          id="companyName"
                        />
                        <FormValidationError
                          errors={errors}
                          name="company_name"
                        />
                      </div>
                    </div>
                  )} */}
                  {!showOtpForm && (
                    <>
                      <div className="d-col d-col-2">
                        <div className="form-group">
                          <label>First Name*</label>
                          <input
                            {...register("first_name", Validations.first_name)}
                            type="text"
                            name="first_name"
                            className="form-control"
                            id="first_name"
                          />
                          <FormValidationError errors={errors} name="first_name" />
                        </div>
                      </div>
                      <div className="d-col d-col-2">
                        <div className="form-group">
                          <label>Last Name*</label>
                          <input
                            {...register("last_name", Validations.last_name)}
                            type="text"
                            name="last_name"
                            className="form-control"
                            id="last_name"
                          />
                          <FormValidationError errors={errors} name="last_name" />
                        </div>
                      </div>
                    </>
                  )}
                  {!isGuest && (
                    <div className="d-col d-col-2">
                      <div className="form-group">
                        <label>Gender*</label>

                        <select
                          className="custom-select form-control"
                          {...register("gender_id", Validations.gender_id)}
                        >
                          {genderOption?.map((ele) => {
                            return (
                              <>
                                <option value={ele?._id}>{ele?.name}</option>
                              </>
                            );
                          })}
                        </select>
                        <FormValidationError errors={errors} name="gender_id" />
                      </div>
                    </div>
                  )}
                  {!showOtpForm && (
                    <div className="d-col d-col-2">
                      <div className="form-group form-field">
                        <label>Country*</label>
                        <DropdownWithSearch
                          {...register("country", Validations.country)}
                          name="country"
                          className="form-control"
                          id={"country"}
                          inputId="country"
                          placeholder="Enter Country Name"
                          url={APICONFIG.GET_ALL_COUNTRIES_LIST}
                          onChange={onCountryChange}
                          value={countryVal}
                          disable={true}
                          label="country"
                          page={"sign-up"}
                        />
                        {/* <select
                          {...register("country", Validations.country)}
                          name="country"
                          className="custom-select"
                          onChange={getCitiesAsPerCountry}
                        >
                          {countryData?.map((ele) => {
                            return (
                              <>
                                <option
                                  value={ele?._id}
                                  selected={
                                    ele?.name === "India" ? true : false
                                  }
                                >
                                  {ele?.name}
                                </option>
                              </>
                            );
                          })}
                        </select> */}
                        <FormValidationError errors={errors} name="country" />
                      </div>
                    </div>
                  )}
                  {!isGuest && (
                    <div className="d-col d-col-2">
                      <div className="form-group form-field">
                        <label>City*</label>
                        <DropdownWithSearch
                          {...register("city", Validations.city)}
                          name="city"
                          className="form-control"
                          id={"city"}
                          inputId="city"
                          placeholder="Enter City"
                          url={APICONFIG.GET_CITY_NAME_API}
                          onChange={onCityChange}
                          value={cityVal}
                          disable={true}
                          page={"sign-up"}
                          label="city"
                          countryId={getValues("country")}
                          stateId=""
                        />

                        {/* <select
                          {...register("city", Validations.city)}
                          className="custom-select"
                          name="city"
                          placeholder="Select City"
                        >
                          {cityData?.map((ele) => {
                            return (
                              <>
                                <option value={ele?.name}>{ele?.name}</option>
                              </>
                            );
                          })}
                        </select> */}
                        <FormValidationError errors={errors} name="city" />
                      </div>
                    </div>
                  )}
                  {!showOtpForm && (
                    <>
                      <div className="d-col d-col-2">
                        <div className="form-group">
                          <label>Mobile Number*</label>
                          <CountrySelect
                            {...register("mobile", Validations.mobile)}
                            setCountryContact={(d) => setCountryId(d)}
                            placeholder=""
                            page="signUp"
                            inputId="sign-up"
                            id="sign-up-page"
                            country={selectedCountry}
                          />
                          <FormValidationError errors={errors} name="mobile" />
                        </div>
                      </div>

                      <div className="d-col d-col-2">
                        <div className="form-group">
                          <label>Email Address*</label>
                          <input
                            {...register("email", Validations.email)}
                            type="email"
                            className="form-control"
                            name="email"
                            id="userEmail"
                            placeholder="xyz@gmail.com"
                          />
                          <FormValidationError errors={errors} name="email" />
                        </div>
                      </div>
                    </>
                  )}

                  {!isGuest && (
                    <>
                      <div className="d-col d-col-2">
                        <div className="form-group">
                          <label>Password*</label>
                          <div className="form-group-wrapper">
                            <input
                              {...register("password", Validations.password)}
                              type={passwordType}
                              className="form-control"
                              name="password"
                              id="userPassword"
                              placeholder="Abcd@1234"
                            />
                            <i
                              className={`${passwordType === "text" ? "jkm-eye-fill" : "jkm-eye-off"
                                } hide-show-icon active`}
                              onClick={() => onTogglePassword()}
                            // onMouseDown={() => setPasswordType("text")}
                            // onMouseUp={() => setPasswordType("password")}
                            ></i>
                          </div>
                          {/* <i className="jkm-eye-fill hide-show-icon "></i> */}
                        </div>
                        <FormValidationError errors={errors} name="password" />
                      </div>
                      <div className="d-col d-col-2">
                        <div className="form-group">
                          <label>Confirm Password*</label>
                          <div className="form-group-wrapper">
                            <input
                              {...register("confirmPassword", Validations.confirmPassword)}
                              type={passwordTypeConfirmPassword}
                              name="confirmPassword"
                              className="form-control"
                              id="userConfirmPassword"
                              placeholder="Abcd@1234"
                            />
                            <i
                              className={` ${passwordTypeConfirmPassword === "text" ? "jkm-eye-fill" : "jkm-eye-off"
                                } hide-show-icon active`}
                              onClick={() => onToggleConfirmPassword()}

                            // onMouseDown={() =>
                            //   setPasswordTypeConfirmPassword("text")
                            // }
                            // onMouseUp={() =>
                            //   setPasswordTypeConfirmPassword("password")
                            // }
                            ></i>
                          </div>
                        </div>
                        <FormValidationError errors={errors} name="confirmPassword" />
                        {/* {watchAllFields.password !==
                          watchAllFields.confirmPassword && (
                          <small className="p-error">
                            {Message.PASSWORD_MATCH}
                          </small>
                        )} */}
                      </div>
                      <div className="d-col d-col-2">
                        <div className="form-group">
                          <label>Referral Code</label>
                          <input
                            {...register("referal_code")}
                            type="text"
                            className="form-control"
                            name="referal_code"
                            id="referal_code"
                            disabled={referral_code ? true : false}
                          />
                          <FormValidationError errors={errors} name="referal_code" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <input
                  type="submit"
                  className="btn btn-primary btn-big"
                  value={isGuest ? "SignUp as Guest" : "SignUp"}
                />

                {/* <button className="btn btn-primary btn-big" type="submit">Register</button> */}
                {!showOtpForm && (
                  <p className="create-account">
                    Exiting User ?{" "}
                    <Link href="/sign-in">
                      <a className="create-new-account">Sign In</a>
                    </Link>
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default SignUpFormSection1;
