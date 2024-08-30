import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IMobileAndEmailData, IMobileAndEmailProps, ISelectCountryData, ISignInForm } from "@templates/SignIn/components/SignInForm";
import { Message } from "@constant/errorMessage";
import { EMAIL_REGEX, PHONENUMBER_REGEX } from "@constant/regex";
import { emailLowerCase, getCountryObj } from "@util/common";
import FormValidationError from "@components/FormValidationError";
import CountrySelect from "@components/countrySelect";
import Cookies from "js-cookie";
import Loader from "@components/customLoader/Loader";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import ErrorHandler from "@components/ErrorHandler";
import { useToast } from "@components/Toastr/Toastr";
import Router from "next/router";
import { ICountryData } from "@type/Common/Base";

const MobileAndEmailForm = (props: IMobileAndEmailProps) => {
  const [inputType, setInputType] = useState<string>("text");
  const [selectedCountry, setSelectedCountry] = useState<ICountryData | undefined>();
  const [afterValidationFired, setAfterValidationFired] = useState(false);
  const [validationChange, setValidationChange] = useState(false);
  const { showError } = useToast();
  const {
    register,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ISignInForm>({
    defaultValues: {
      email: "",
      password: "",
      mobile: "",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const customError = {
    custom: {
      message: "Please Enter Email Or Mobile Number",
    },
  };

  const Validations = {
    email: {
      required: Message.EMAIL_REQUIRED,
      pattern: {
        value: EMAIL_REGEX,
        message: Message.EMAIL_PATTERN,
      },
    },
    mobile: {
      required: Message.MOBILENUMBER_REQUIRED,
      pattern: {
        value: PHONENUMBER_REGEX,
        message: Message.MOBILE_PATTERN,
      },
    },
  };

  useEffect(() => {
    if (props?.previousData?.email) {
      setInputType("email");
      setValue("email", props?.previousData?.email);
    }
    if (props?.previousData?.mobile) {
      setInputType("number");
      setValue("mobile", props?.previousData?.mobile);
    }
  }, [props?.previousData]);

  useEffect(() => {
    setSelectedCountry(getCountryObj());
  }, []);

  useEffect(() => {
    setSelectedCountry(getCountryObj());
  }, [Cookies.get("countryObj"), Cookies.get("country_name")]);

  const handleInputChange = (event: ChangeEvent) => {
    const inputValue = (event.target as HTMLInputElement).value;
    let newInputType = /^\d+$/.test(inputValue) ? "number" : "email";
    if (inputValue === "") {
      newInputType = "text";
    }
    setValue("email", inputValue);
    setValue("mobile", inputValue);
    afterValidationFired && trigger();
    setInputType(newInputType);
  };

  const validateForm = async () => {
    await trigger();
    setAfterValidationFired(true);
    setValidationChange(!validationChange);
  };

  useEffect(() => {
    let isValidate = false;
    if (inputType === "email") {
      isValidate = !Object.keys(errors).includes("email");
    }
    if (inputType === "number") {
      isValidate = !Object.keys(errors).includes("mobile");
    }
    if (afterValidationFired && isValidate) {
      let obj = {};
      if (inputType === "number") {
        obj = { is_mobile_signin_with_otp: 1, mobile: getValues("mobile"), country : selectedCountry?._id };
      }
      if (inputType === "email") {
        obj = { is_mobile_signin_with_otp: 0, email: getValues("email") };
      }
      IsUserDataIsRegistered(obj)
    }
  }, [validationChange]);

  const setCountryId = (data : ISelectCountryData) => {
    console.log(data,"data")
    setValue("mobile", data?.phone);
  };

  const IsUserDataIsRegistered = async(mobileAndEmailData : IMobileAndEmailData) =>{
    const formData = new FormData();

    (mobileAndEmailData?.email) && formData.append("email", emailLowerCase(mobileAndEmailData?.email));  
    (mobileAndEmailData?.mobile) && formData.append("mobile", mobileAndEmailData?.mobile);  
    (mobileAndEmailData) && formData.append("is_mobile_signin_with_otp",mobileAndEmailData?.is_mobile_signin_with_otp!);  
    (mobileAndEmailData?.mobile) &&  (mobileAndEmailData?.country) && formData.append("country", mobileAndEmailData?.country);  

    setIsLoading(true)
    await pagesServices.postPage(APICONFIG.GET_OTP_IN_MOBILE_OR_EMAIL, formData).then(
      (result) => {
        if (result?.meta?.status) {
          props?.setIsPageOne();
          props?.onStepOne(mobileAndEmailData);
          setIsLoading(false)
        }else{
          setIsLoading(false);
          showError(result?.meta?.message)
          Router.push("/sign-up");
        }
      },
      (error) => {
        setIsLoading(false);
        ErrorHandler(error, showError);
        Router.push("/sign-up");
      }
    );
  }

  return (
    <>
    {isLoading ? <Loader /> : <></>}
    <form>
      <div className="form-group">
        {inputType !== "text" && <label>
          {inputType === "number"
              ? "Mobile Number*"
              : "Email Address*"}
        </label>}
        {inputType === "text" && <label>Mobile Number/Email*</label>}
        {inputType === "number" ? (
          <CountrySelect
            {...register("mobile", Validations.mobile)}
            setCountryContact={(d) => setCountryId(d)}
            placeholder=""
            phoneNumberProp={getValues("mobile")}
            country={selectedCountry}
            changeHandler={handleInputChange}
            onTypeChangeToMobile={true}
          />
        ) : (
          <input
            {...register("email", Validations.email)}
            type="email"
            className="form-control"
            name="email"
            id="email"
            placeholder={
              inputType === "text"
                ? "Enter Mobile Number or Email"
                : "Enter Email Adress"
            }
            onChange={(e) => handleInputChange(e)}
            autoFocus
          />
        )}
        {inputType !== "text" ? (
          <FormValidationError
            errors={errors}
            name={inputType === "number" ? "mobile" : "email"}
          />
        ) : (
          afterValidationFired && (
            <FormValidationError errors={customError} name="custom" />
          )
        )}
      </div>
      <button
        type="button"
        className="btn btn-primary btn-large"
        onClick={validateForm}
      >
        {" "}
        CONTINUE TO LOGIN
      </button>
    </form>
    </>
  );
};

export default MobileAndEmailForm;
