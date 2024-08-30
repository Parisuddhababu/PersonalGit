import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { IOTP } from "@templates/SignIn/components/SignInForm/index";
import { Message } from "@constant/errorMessage";
import FormValidationError from "@components/FormValidationError";
import { OTP_REGEX } from "@constant/regex";
import { IOTPData } from "@type/Common/Base";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import { useToast } from "@components/Toastr/Toastr";
import ErrorHandler from "@components/ErrorHandler";
import { userSignInOTP } from "src/redux/signIn/signInAction";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setLoader } from "src/redux/loader/loaderAction";

const OtpForm1 = ({ email }: IOTPData) => {
  const [counter, setCounter] = useState<number>(59);
  const { showError, showSuccess } = useToast();
  const Router = useRouter();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IOTP>({
    defaultValues: {
      otp: "",
    },
  });


  const onSubmit: SubmitHandler<IOTP> = async (data) => {
    dispatch(setLoader(true));
    let obj = {
      email: email,
      otp: data?.otp,
    };
    await pagesServices.postPage(APICONFIG.VERIFY_OTP, obj).then(
      (result) => {
        showSuccess(result?.meta?.message);
        dispatch(userSignInOTP({}));
        dispatch(setLoader(false));
        Router.push("/sign-in");
      },
      (error) => {
        dispatch(setLoader(false));
        ErrorHandler(error, showError);
      }
    );
  };

  const Validations = {
    otp: {
      required: Message.OTP_REQUIRED,
      pattern: {
        value: OTP_REGEX,
        message: Message.OTP_LENGTH,
      },
    },
  };

  const resendOTP = async () => {
    dispatch(setLoader(true));
    let obj = {
      email: email,
      resend_otp: "yes",
    };
    await pagesServices.postPage(APICONFIG.RESEND_OTP, obj).then(
      (result) => {
        showSuccess(result?.meta?.message);
        setCounter(59);
        dispatch(setLoader(false));
      },
      (error) => {
        dispatch(setLoader(false));
        ErrorHandler(error, showError);
      }
    );
  };

  return (
    <div className="sign-in-wrap">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>OTP*</label>
          <input
            {...register("otp", Validations.otp)}
            type="text"
            name="otp"
            className="form-control"
            id="password"
            maxLength={6}
          />
          <FormValidationError errors={errors} name="otp" />
        </div>
        <div>
          {counter ? <span>{counter}</span> : null}
          {counter ? (
            <button type="button" className="btn btn-primary btn-small" disabled={true}>
              {" "}
              RE-SEND OTP{" "}
            </button>
          ) : (
            <button type="button" className="btn btn-primary btn-small" onClick={() => resendOTP()}>
              {" "}
              RE-SEND OTP{" "}
            </button>
          )}
        </div>
        <input type="submit" className="btn btn-primary btn-big" value={"Verify OTP"} />
      </form>
    </div>
  );
};

export default OtpForm1;
