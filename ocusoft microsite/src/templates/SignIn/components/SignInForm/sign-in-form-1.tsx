import { useForm, SubmitHandler } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import {
  ISignInForm,
} from "@templates/SignIn/components/SignInForm/index";
import { useCallback, useState, useEffect } from "react";
import APICONFIG from "@config/api.config";
import { Message } from "@constant/errorMessage";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@constant/regex";
import FormValidationError from "@components/FormValidationError";
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import { IAPIResponse } from "@type/Common/Base";
import { useDispatch } from "react-redux";
import {
  Action_UserDetails,
  updateCartCounter,
} from "src/redux/signIn/signInAction";
import { getTypeBasedCSSPath, setDataInCookies, setDataInLocalStorage, IsBrowser } from "@util/common";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import ErrorHandler from "@components/ErrorHandler";
import { useRouter } from "next/router";
import Link from "next/link";
import { StaticRoutes } from "@config/staticurl.config";
import APPCONFIG from "@config/app.config";
import { toast } from "react-toastify";
import BreadCrumbs from "@components/BreadCrumbs";
import { setLoader } from "src/redux/loader/loaderAction";

const SignInFormSection1 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const [previousURL, setPreviousURL] = useState<string>("");
  const { makeDynamicFormDataAndPostData } = usePostFormDataHook();
  const [captchVerified, setCaptchaVerified] = useState<boolean>(false);
  const [passwordSecurity, setPasswordSecurity] = useState(true);
  const [googleCaptcha, setGoogleCaptch] = useState('');

  const naviagateToScreen = (reload: boolean) => {
    if (reload) {
      window.location.href = '/';
    } else {
      router.push("/");
    }
  }

  const redirectToPrevScreen = (reload = false) => {
    if (previousURL && previousURL !== "") {
      if (previousURL === "sign-up" || previousURL === "/sign-up/") {
        naviagateToScreen(reload)
        return true;
      }
      if (
        previousURL?.indexOf("/reset-password/") > -1 ||
        previousURL?.indexOf("/forgot-password/") > -1 ||
        previousURL?.indexOf("/my-orders/") > -1 ||
        previousURL?.indexOf("/verify-email/") > -1 ||
        previousURL?.indexOf("/change-password/") > -1
      ) {
        naviagateToScreen(reload)
        return true;
      }
      router.push(previousURL);
      if (reload) {
        window.location.href = previousURL;
      } else {
        router.push(previousURL)
      }
    } else {
      naviagateToScreen(reload)
    }
  };
  const onSubmit: SubmitHandler<ISignInForm> = (data) => {
    if (!captchVerified) {
      toast.error('Please verify captcha!')
      return
    }
    dispatch(setLoader(true))
    const responceData = makeDynamicFormDataAndPostData(
      {
        ...data,
        'g-recaptcha-response': googleCaptcha
      },
      APICONFIG.SINGIN_API
    );
    responceData
      ?.then(async (resp) => {
        dispatch(setLoader(false))
        if (resp?.data && resp?.meta) {
          toast.success(resp?.meta?.message)
          let authData = resp?.data;
          authData.user_detail["session_start_time"] = new Date();
          setDataInLocalStorage("auth", authData, true);
          setDataInCookies("auth", authData);
          setDataInRedux(resp);
          redirectToPrevScreen(true);
        } else {
          ErrorHandler(resp, toast.error);
        }
      })
      .catch((err) => {
        dispatch(setLoader(false))
        ErrorHandler(err, toast.error);
      });
  };

  useEffect(() => {
    if (IsBrowser) {
      //@ts-ignore
      setPreviousURL(window["next_referrer"]);
    }
  }, []);

  const setDataInRedux = (data: IAPIResponse) => {
    // @ts-ignore
    dispatch(Action_UserDetails(data));
    dispatch(updateCartCounter(data?.data?.cart_count ?? 0));
  };

  const Validations = {
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
  };

  const onRecaptcha = useCallback((res: any) => {
    setCaptchaVerified(true);
    setGoogleCaptch(res);
  }, [])

  return (
    <>
      <Head>
        <title>Sign in</title>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.login)} />
      </Head>
      <BreadCrumbs item={[{ slug: '/sign-in', title: 'Sign In' }]} />
      <section className="login-section">
        <div className="container">
          <h2 className="title-center">CUSTOMER LOGIN</h2>
          <div className="row">
            <div className="d-col d-col-2">
              <div className="returning-customers-login">
                <div className="subtitle-with-border">
                  <span>Returning Customers</span>
                  <p>If you have an account, sign in with your email address.</p>
                </div>
                <div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                      <label className="control-label">Email</label>
                      <input
                        {...register("email", Validations.email)}
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Youremail@gmail.com"
                        className="form-control" />
                      <FormValidationError errors={errors} name="email" />
                    </div>
                    <div className="form-group">
                      <label className="control-label">Password</label>
                      <div className="password-field">
                        <input
                          {...register("password", Validations.password)}
                          type={passwordSecurity ? "password" : "text"}
                          name="password"
                          id="password"
                          placeholder="Enter Password"
                          className="form-control" />
                        <FormValidationError errors={errors} name="password" />
                        <i className={!passwordSecurity ? "osicon-visible-eye" : "osicon-invisible-eye"} onClick={() => setPasswordSecurity(!passwordSecurity)} ></i>
                      </div>
                    </div>
                    <div className="forgot-password-bar">
                      <div className="ocs-checkbox">
                        <input type="checkbox" id="check1" name="check1" />
                        <label htmlFor="check1">Remember me ?</label>
                      </div>
                      <Link href={StaticRoutes.forgotPassword}>
                        <a >Forgot password ?</a>
                      </Link>
                      <Link href={StaticRoutes.signUp}>
                        <a >Not registered ?</a>
                      </Link>
                    </div>
                    <div className="recaptcha-box">
                      <ReCAPTCHA
                        sitekey={APPCONFIG.reCaptchaSiteKey}
                        onChange={onRecaptcha}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" aria-label="login-btn">LOGIN</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="d-col d-col-2">
              <div className="new-customers">
                <div className="subtitle-with-border">
                  <span>New Customers</span>
                  <p>By creating an account on our website, you will be able to shop faster, be up to date on an
                    orders status, and keep track of the orders status, and keep track of the order you have
                    previously made.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignInFormSection1;
