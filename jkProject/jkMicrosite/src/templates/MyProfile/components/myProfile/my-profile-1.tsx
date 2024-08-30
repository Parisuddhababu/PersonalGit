import FormValidationError from "@components/FormValidationError";
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import { useToast } from "@components/Toastr/Toastr";
import APICONFIG from "@config/api.config";
import { Message } from "@constant/errorMessage";
import {
  EMAIL_REGEX,
  ONLY_CHARACTERS,
  PHONENUMBER_REGEX,
} from "@constant/regex";
import { IMyProfileData } from "@type/Pages/myProfile";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { IMyProfileForm } from ".";
import { useRouter } from "next/router";
import ErrorHandler from "@components/ErrorHandler";
import pagesServices from "@services/pages.services";
import { ISignInReducerData } from "@type/Common/Base";
import Head from "next/head";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import MyaccountComponent from "@components/Account";
import MyAccountHeaderComponent from "@components/Account/MyAccountHeaderComponent";
// import { removeLoginData } from "@util/common";
// import { Action_UserDetails } from "src/redux/signIn/signInAction";
import { useDispatch, useSelector } from "react-redux";
import CountrySelect from "@components/countrySelect";
import Loader from "@components/customLoader/Loader";
import DropdownWithSearch from "@components/DropdownWithSearch/DropdownWithSearch";
import { getParseUser, setDataInLocalStorage } from "@util/common";
import { Action_UserDetails } from "src/redux/signIn/signInAction";
import Cookies from "js-cookie";

const MyProfileSection1 = (props: IMyProfileData) => {

  const reduxData = useSelector((state: ISignInReducerData) => state);
  const [fieldDisable, setFielDisabled] = useState<boolean>(false);
  const [sendedOTP, setSendedOTP] = useState<boolean>(false);
  const [oldPhone, setOldPhone] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [isOtpOptional,setIsOtpOptional] = useState<number>(1);
  const isOptionalCookie = Cookies.get("isOtpOptional")

  const router = useRouter();
  // const dispatch = useDispatch();
  const { makeDynamicFormDataAndPostData } = usePostFormDataHook();
  const { showError, showSuccess } = useToast();
  // const [countryData, setCountryData] = useState<ICountryData[]>();
  const [countryVal, setCountryVal] = useState<string>('')

  useEffect(() => {
    if (reduxData?.guestUserRootReducer?.guestUserFlag) {
      router.push('/sign-in')
    }
    // eslint-disable-next-line
  }, [])
  useEffect(() => {
    // getAllCountryData();
    setOldPhone(props?.mobile);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setValue("country", props?.country?.country_id)
    setCountryVal(props?.country?.name)
    //  eslint-disable-next-line
  }, [])

  const onSubmit: SubmitHandler<IMyProfileForm> = (data) => {

    const responceData = makeDynamicFormDataAndPostData(
      data,
      APICONFIG.UPDATE_PROFILE_DATA
    );
    responceData
      ?.then((resp) => {
        if (resp?.data && resp?.meta) {
          showSuccess(resp?.meta?.message);
          let parseUser = getParseUser() as any;
          if (parseUser?.user_detail) {
            parseUser.user_detail.first_name = data.first_name;
            parseUser.user_detail.last_name = data.last_name;
            parseUser.user_detail.email = data.email;
            parseUser.user_detail.mobile = data.mobile;
            setDataInLocalStorage("auth", parseUser, true);
            //@ts-ignore
            dispatch(Action_UserDetails(parseUser));
          }
        }else{
          isOtpOptional === 0 ? showError(Message.OTP_SETTING_CHANGE) : ErrorHandler(resp, showError);
        }
      })
      .catch((err) => {
        ErrorHandler(err, showError);
      });
  };

  // const clearLoginInData = () => {
  //   removeLoginData();
  //   // @ts-ignore
  //   dispatch(Action_UserDetails(null));
  // };

  const [defaultValues] = useState({
    first_name: props.first_name,
    last_name: props.last_name,
    mobile: props.mobile,
    email: props.email,
    points: props?.points,
    mobile_otp: "",
    country: ''
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues
  } = useForm<IMyProfileForm>({ defaultValues });

  const Validations = {
    first_name: {
      required: Message.FIRSTNAME_REQUIRED,
      pattern: {
        value: ONLY_CHARACTERS,
        message: Message.ALLOW_ONLY_CHARACTERS,
      },
    },
    country: {
      required: Message.COUNTRY_REQUIRED,
    },
    last_name: {
      required: Message.LASTNAME_REQUIRED,
      pattern: {
        value: ONLY_CHARACTERS,
        message: Message.ALLOW_ONLY_CHARACTERS,
      },
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
  };

  const setCountryId = (data: any) => {
    if (oldPhone !== data?.phone) {
      setValue("mobile", data?.phone);
      setFielDisabled(true);
    }
  };

  const resetMobileValue = () => {
    setValue("mobile", oldPhone);
    // setValue("country", oldCountryPhoneCode);
    setFielDisabled(false);
    setSendedOTP(false);
  };

  const sendOTPMobileNo = async () => {
    if (!PHONENUMBER_REGEX.test(getValues("mobile"))) {
      showError("Please enter valid mobile number");
      return;
    }
    setIsLoading(true);
    await pagesServices
      .postPage(APICONFIG.MOBILE_VERIFY_OTP_SEND, {
        mobile: getValues("mobile"),
        country: getValues("country"),
      })
      .then((result) => {
        setIsLoading(false);
        if (result?.meta?.status_code == "201") {
          showSuccess(result?.meta?.message);
          setSendedOTP(true);
        }else{
          showError(Message.OTP_NOT_SEND_REFRESH)
        }
      })
      .catch((error) => {
        setIsLoading(false);
        ErrorHandler(error, showError);
      });
  };

  const verifyOTP = async () => {
    if (getValues("mobile_otp") === "") {
      showError("Please enter otp");
      return;
    }
    setIsLoading(true);
    await pagesServices
      .postPage(APICONFIG.MOBILE_OTP_VERIFY, {
        mobile_otp: getValues("mobile_otp"),
      })
      .then((result) => {
        if (result?.meta?.status_code == "200") {
          setIsLoading(false);
          showSuccess(result?.meta?.message);
          setFielDisabled(false);
          setSendedOTP(false);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        showError(error, showError);
      });
  };

  const onCountryChange = (data: any) => {
    setValue("country", data._id)
    setCountryVal(data.name)

  }

  useEffect(()=>{
    setIsOtpOptional(+isOptionalCookie!)
  },[isOptionalCookie])

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
      </Head>
      {isLoading && <Loader />}
      <main>
        <MyaccountComponent />
        <section className="account_details">
          <div className="container">
            <MyAccountHeaderComponent />
            <section id="my_profile" className="tab-content current">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="d-row">
                  <div className="d-col d-col-2">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        {...register("first_name", Validations.first_name)}
                        type="text"
                        name="first_name"
                        className="form-control"
                        id="first_name"
                        disabled={fieldDisable}
                      />
                      <FormValidationError errors={errors} name="first_name" />
                    </div>
                  </div>
                  <div className="d-col d-col-2">
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        {...register("last_name", Validations.last_name)}
                        type="text"
                        name="last_name"
                        className="form-control"
                        id="last_name"
                        disabled={fieldDisable}
                      />
                      <FormValidationError errors={errors} name="last_name" />
                    </div>
                  </div>
                  <div className="d-col d-col-2">
                    <div className="form-group">
                      <label>Mobile Number</label>
                      <CountrySelect
                        {...register("mobile", Validations.mobile)}
                        setCountryContact={(d) => setCountryId(d)}
                        placeholder=""
                        page="myProfile"
                        inputId="my-profile-country"
                        phoneNumberProp={props?.mobile}
                        country={props?.country}
                        disable={false}
                        otpFlow={fieldDisable}
                        resetPhone={() => resetMobileValue()}
                        sendedOTP={sendedOTP}
                        updatedOTP={(e) => setValue("mobile_otp", e)}
                        verifyOTP={() => verifyOTP()}
                        sendOTP={() => sendOTPMobileNo()}
                      />
                      <FormValidationError errors={errors} name="mobile" />
                    </div>
                  </div>
                  <div className="d-col d-col-2">
                    <div className="form-group">
                      <label>Country</label>
                      <DropdownWithSearch
                        {...register("country", Validations.country)}
                        name="country"
                        className="form-control"
                        id={'country'}
                        inputId="country"
                        placeholder="Enter Country Name"
                        url={APICONFIG.GET_ALL_COUNTRIES_LIST}
                        onChange={onCountryChange}
                        value={countryVal}
                        disable={true}
                        page={'my-profile'}
                        label="country"

                      />
                      {/* <select
                        {...register("country", Validations.country)}
                        name="country"
                        className="custom-select form-control"
                        id="country-select"
                        disabled={fieldDisable}
                      >
                        {countryData?.map((ele) => {
                          return (
                            <>
                              <option value={ele?._id}>{ele?.name}</option>
                            </>
                          );
                        })}
                      </select> */}
                      <FormValidationError errors={errors} name="country" />
                      {/* {(defaultValues.country == "" || !defaultValues.country) ? */}
                      {/* // <FormValidationError errors={Message.COUNTRY_REQUIRED} name="country" /> */}
                      {/* <small className="p-error">{Message.COUNTRY_REQUIRED}</small> : '' */}
                      {/* } */}
                    </div>
                  </div>

                  <div className="d-col d-col-2">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        {...register("email", Validations.email)}
                        type="email"
                        className="form-control"
                        name="email"
                        id="userEmail"
                        placeholder="xyz@gmail.com"
                        disabled
                      />
                      <FormValidationError errors={errors} name="email" />
                    </div>
                  </div>
                  <div className="d-col">
                    <div className="form-group">
                      <label>Points</label>
                      <textarea
                        {...register("points")}
                        className="form-control"
                        name="points"
                        id="points"
                        rows={3}
                        disabled={fieldDisable}
                      ></textarea>
                    </div>
                  </div>
                  <div className="d-col d-col-1 mb-0">
                    <button type="submit" className="btn btn-secondary">
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </section>
      </main>
    </>
  );
};

export default MyProfileSection1;
