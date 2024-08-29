import { useForm, SubmitHandler } from "react-hook-form";
import { ICountryStateChange, ICountryStateCityType, ISignUpForm } from "@templates/SignUp/components/SIgnUpForm/index";
import { useCallback, useEffect, useState } from "react";
import APICONFIG from "@config/api.config";
import { Message } from "@constant/errorMessage";
import { EMAIL_REGEX, ONLY_CHARACTERS, PASSWORD_REGEX, PHONENUMBER_REGEX, PINCODE_REGEX } from "@constant/regex";
import FormValidationError from "@components/FormValidationError";
import Head from "next/head";
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { useRouter } from "next/router";
import ErrorHandler from "@components/ErrorHandler";
import { getTypeBasedCSSPath } from "@util/common";
import { setLoader } from "src/redux/loader/loaderAction";
import { useDispatch } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import pagesServices from "@services/pages.services";
import Select from 'react-select';
import BreadCrumbs from "@components/BreadCrumbs";
const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderRadius: '30px',
    fontFamily: 'Calibri',
    fontWeight: 500,
    fontSize: '17.5px',
    lineHeight: '18px',
    border: '1px solid var(--data_site_gray_color)',
    width: '100%',
    padding: '5px 5px',
    outline: 0,
    color: 'var(--data_site_gray_color)',
  }),
};

const SignUpFormSection1 = () => {
  const router = useRouter();
  const [countryData, setCountryData] = useState<ICountryStateChange[]>([]);
  const [stateData, setStateData] = useState<ICountryStateChange[]>([]);

  const [defaultValues] = useState({
    first_name: "",
    last_name: "",
    country: "",
    city: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    postal_code: "",
    state: "",
    newsletter_selection: 0,
    street_address: ""
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

  const watchAllFields = watch();
  const { makeDynamicFormDataAndPostData } = usePostFormDataHook();
  const [selectedCountry, setSelectedCountry] = useState<ICountryStateChange>();
  const [selectedState, setSelectedState] = useState<ICountryStateChange | null>();
  const [selectedCity, setSelectedCity] = useState<ICountryStateChange | null>();
  const [captchVerified, setCaptchaVerified] = useState<boolean>(false);
  const [cityData, setCityData] = useState<ICountryStateChange[]>([]);
  const [currentPasswordSecurity, setCurPasswordSecurity] = useState(true);
  const [oldPasswordSecurity, setOldPasswordSecurity] = useState(true);


  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<ISignUpForm> = (data) => {


    if (!captchVerified) {
      toast.error('Please verify captcha!')
      return
    }
    dispatch(setLoader(true));
    const responceData = makeDynamicFormDataAndPostData(data, APICONFIG.SIGNUP_API);
    responceData
      ?.then(async (resp) => {
        if (resp?.data && resp?.meta) {
          dispatch(setLoader(false));
          toast.success(resp?.meta?.message);
          router.push("/sign-in");
        } else {
          dispatch(setLoader(false));
          ErrorHandler(resp, toast.error);
        }
      })
      .catch((error) => {
        ErrorHandler(error, toast.error);
        dispatch(setLoader(false));
      });
  };

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
      validate: (value: string) => value === watchAllFields.password || Message.PASSWORD_MATCH,
    },
    email_otp: {
      required: Message.EMAILOTP_REQUIRED,
    },
    mobile_otp: {
      required: Message.MOBILEOTP_REQUIRED,
    },
    state: {
      required: Message.STATE_REQUIRED,
    },
    postal_code: {
      required: Message.PINCODE_REQUIRED,
      pattern: {
        value: PINCODE_REGEX,
        message: Message.PINCODE_REGEX_MESSAGE,
      },
    },
    street_address: {
      required: Message.ADDRESS_REQUIRED,
    },
  };

  const onCountryChange = useCallback((data: ICountryStateChange | null) => {
    if (data) {
      setValue("country", data?.value);
      setSelectedCountry(data);
      setValue("state", '');
      setSelectedState(null);
      setValue("city", '');
      setValue("postal_code", '');
      setSelectedCity(null);
    }
  }, []);

  const onStateChange = useCallback((data: ICountryStateChange | null) => {
    if (data) {
      setValue("state", data?.value);
      setSelectedState(data);
      setValue("city", '');
      setValue("postal_code", '');
      setSelectedCity(null);
    }
  }, []);

  console.log(getValues('state'), 'City Val')

  const onCityChange = useCallback((data: ICountryStateChange | null) => {
    if (data) {
      setValue("city", data?.value);
      setSelectedCity(data);
      setValue("postal_code", '');
    }

  }, [selectedCity]);

  const onRecaptcha = useCallback(() => {
    setCaptchaVerified(true);
  }, [])

  const getCountry = async () => {
    setLoader(true);
    await pagesServices
      .postPage(APICONFIG.GET_COUNTRY, { for_phonecode: 1 })
      .then((result) => {
        if (result?.data?.country_list?.length) {
          setCountryData(result?.data?.country_list?.map((country: ICountryStateCityType) => ({
            value: country._id,
            label: country.name
          })));
        }
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
      });
  };

  const getState = async () => {
    setLoader(true);
    await pagesServices
      .postPage(APICONFIG.GET_ALL_STATE_LIST, { country_id: selectedCountry?.value })
      .then((result) => {
        setStateData(result?.data?.state_list?.map((country: ICountryStateCityType) => ({
          value: country._id,
          label: country.name
        })));
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
      });
  };

  //get city
  const getCityData = async () => {
    setLoader(true);
    await pagesServices
      .postPage(APICONFIG.GET_CITY_NAME_API, { country_id: selectedCountry?.value, state_id: selectedState?.value })
      .then((result) => {
        setCityData(result.data.city_list.map((city: ICountryStateCityType) => ({
          value: city._id,
          label: city.name
        })));
      })
  }

  useEffect(() => {
    getCountry();
  }, []);

  useEffect(() => {
    if (selectedCountry?.value) {
      getState();
    }
  }, [selectedCountry])

  useEffect(() => {
    getCityData();
  }, [selectedState])


  return (
    <>
      <Head>
        <title>Sign Up</title>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.registration)} />
      </Head>
      <BreadCrumbs item={[{ slug: '/sign-up', title: 'Register' }]} />
      <section className="registration-section">
        <div className="container">
          <h2>REGISTER</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
            <div className="row">
              <div className="form-group d-col d-col-2">
                <label className="control-label">First Name*</label>
                <input
                  {...register("first_name", Validations.first_name)}
                  type="text"
                  name="first_name"
                  id="first_name"
                  placeholder="Enter first name"
                  className="form-control" />
                <FormValidationError errors={errors} name="first_name" />
              </div>

              <div className="form-group d-col d-col-2">
                <label className="control-label">Last Name*</label>
                <input
                  {...register("last_name", Validations.last_name)}
                  type="text"
                  name="last_name"
                  id="last_name"
                  placeholder="Enter last name"
                  className="form-control" />
                <FormValidationError errors={errors} name="last_name" />
              </div>

              <div className="form-group d-col d-col-2">
                <label className="control-label">Email Address*</label>
                <input
                  {...register("email", Validations.email)}
                  type="email"
                  name="email"
                  id="userEmail"
                  placeholder="Enter email"
                  className="form-control" />
                <FormValidationError errors={errors} name="email" />
              </div>

              <div className="form-group d-col d-col-2">
                <label className="control-label">Phone Number*</label>
                <input
                  {...register("mobile", Validations.mobile)}
                  type="text"
                  name="mobile"
                  id="userMobile"
                  placeholder="Enter Phone Number"
                  className="form-control" />
                <FormValidationError errors={errors} name="mobile" />
              </div>
              <div className="form-group d-col d-col-1">
                <label className="control-label">Street Address*</label>
                <input
                  {...register("street_address", Validations.street_address)}
                  type="text"
                  name="street_address" id="street_address" placeholder="Address 1" className="form-control" />
                <FormValidationError
                  errors={errors}
                  name="street_address"
                />
              </div>

              <div className="form-group d-col d-col-2">
                <label className="control-label">Country*</label>
                <Select
                  {...register("country", Validations.country)}
                  placeholder="Enter Country Name"
                  id="country"
                  name="country"
                  styles={customStyles}
                  value={selectedCountry}
                  onChange={onCountryChange}
                  options={countryData} />
                {
                  !getValues('country') &&
                  <FormValidationError errors={errors} name="country" />
                }
              </div>
              <div className="form-group d-col d-col-2">
                <label className="control-label">State/Province*</label>
                <Select
                  {...register("state", Validations.state)}
                  placeholder="Enter State"
                  styles={customStyles}
                  id="state"
                  name="state"
                  value={selectedState}
                  onChange={onStateChange}
                  options={stateData} />
                {
                  !getValues('state') &&
                  <FormValidationError errors={errors} name="state" />
                }
              </div>
              <div className="form-group d-col d-col-2">
                <label className="control-label">City*</label>
                <Select
                  {...register("city", Validations.city)}
                  placeholder="Enter city"
                  styles={customStyles}
                  id="city"
                  name="city"
                  value={selectedCity}
                  onChange={onCityChange}
                  options={cityData} />
                {
                  !getValues('city') &&
                  <FormValidationError errors={errors} name="city" />
                }
              </div>
              <div className="form-group d-col d-col-2">
                <label className="control-label">Zip Code*</label>
                <input
                  {...register("postal_code", Validations.postal_code)}
                  type="text"
                  name="postal_code" id="postal_code" placeholder="Enter zip code" className="form-control" />
                <FormValidationError errors={errors} name="postal_code" />
              </div>

              <div className="form-group d-col d-col-2">
                <label className="control-label">Password*</label>
                <div className="password-field">
                  <input
                    {...register("password", Validations.password)}
                    type={currentPasswordSecurity ? "password" : "text"}
                    name="password" id="userPassword" placeholder="Enter your password" className="form-control" />
                  <FormValidationError errors={errors} name="password" />
                  <i className={!currentPasswordSecurity ? "osicon-visible-eye" : "osicon-invisible-eye"} onClick={() => setCurPasswordSecurity(!currentPasswordSecurity)} ></i>
                </div>
              </div>

              <div className="form-group d-col d-col-2">
                <label className="control-label">Confirm Password*</label>
                <div className="password-field">
                  <input
                    {...register("confirmPassword", Validations.confirmPassword)}
                    type={oldPasswordSecurity ? "password" : "text"}
                    name="confirmPassword"
                    id="userConfirmPassword"
                    placeholder="Confirm your password"
                    className="form-control" />
                  <FormValidationError errors={errors} name="confirmPassword" />
                  <i className={!oldPasswordSecurity ? "osicon-visible-eye" : "osicon-invisible-eye"} onClick={() => setOldPasswordSecurity(!oldPasswordSecurity)} ></i>
                </div>
              </div>
              <div className="d-col recaptcha-box">
                <ReCAPTCHA
                  sitekey={APPCONFIG.reCaptchaSiteKey}
                  onChange={onRecaptcha}
                />
              </div>
              <div className="sign-up-newsletter d-col">
                <div className="ocs-checkbox">
                  <input
                    {...register("newsletter_selection")}
                    type="checkbox"
                    name="checkBox"
                    className="form-control"
                    id="check1"
                    checked={getValues('newsletter_selection') === 1}
                    onChange={(e) => {
                      setValue('newsletter_selection', e.target.checked ? 1 : 0);
                    }}
                  />
                  <label htmlFor="check1">Sign up for Newsletter</label>
                </div>
              </div>
              <div className="button-center">
                <button className="btn btn-primary-large" type="submit" aria-label="create-account-btn" >CREATE AN ACCOUNT</button>
              </div>
            </div>
          </form >
        </div >
      </section >

    </>
  )

};

export default SignUpFormSection1;
