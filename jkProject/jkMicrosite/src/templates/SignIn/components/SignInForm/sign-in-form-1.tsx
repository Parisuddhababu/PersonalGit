import { useForm, SubmitHandler } from "react-hook-form";
import {
  IMobileAndEmailData,
  ISignInForm,
  ISigninFormProps,
  ISignInSocialState,
} from "@templates/SignIn/components/SignInForm/index";
import { useEffect, useState } from "react";
import APICONFIG from "@config/api.config";
import { Message } from "@constant/errorMessage";
import { PASSWORD_REGEX } from "@constant/regex";
import FormValidationError from "@components/FormValidationError";
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import { IAPIResponse, IOTPData } from "@type/Common/Base";
import { useDispatch } from "react-redux";
import {
  Action_UserDetails,
  updateCartCounter,
  updateWishListCounter,
} from "src/redux/signIn/signInAction";
import { emailLowerCase, setDataInCookies, setDataInLocalStorage } from "@util/common";
import { useToast } from "@components/Toastr/Toastr";
import Head from "next/head";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import ErrorHandler from "@components/ErrorHandler";
import { useRouter } from "next/router";
import FacebookLogin from "@components/customSocialLogin/facebookLogin";
import pagesServices from "@services/pages.services";
import GoogleLogin from "@components/customSocialLogin/googleLogin";
import OtpForm1 from "@templates/SignIn/components/SignInForm/otp-form-1";
import SignUpFormSection1 from "@templates/SignUp/components/SIgnUpForm";
import { getCurrentGuestCartItems } from "@util/addGuestCartData";
// import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import { setGuestUser } from "src/redux/guestUser/guestUserAction";
import { useSelector } from "react-redux";
import Link from "next/link";
import { IsBrowser } from "@util/common";
import Cookies from "js-cookie";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { encryptDecrypt } from "@components/Hooks/paymentGatewayKey/usePaymentGatewayKey";
import MobileAndEmailForm from "@templates/SignIn/components/SignInForm/mobile-and-email-form";
import Loader from "@components/customLoader/Loader";

const SignInFormSection1 = ({ guestUser = false, reloadPage = false, onComplete }: ISigninFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISignInForm>({
    defaultValues: {
      password: "",
      otp: "",
    },
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const isB2BUser = parseInt(Cookies.get("isB2BUser") ?? '') === 1 ? true : false;
  const stateData = useSelector((state) => state);
  // @ts-ignore
  const otpData = stateData?.signIn?.otp_verification;
  // for demo purpose how to fetch data from redux
  // const signIndata = useSelector((state:RootState) => state?.signIn);
  // const { guestUpdateOriginalCart } = useAddtoCart();
  const [previousURL, setPreviousURL] = useState<string>("");
  const [passwordType, setPasswordType] = useState("password");
  const { showError, showSuccess } = useToast();
  const { makeDynamicFormDataAndPostData } = usePostFormDataHook();
  const [openSignUpFormForUser, setSignUpFormForUser] =
    useState<boolean>(false);
  const [socialFacebookId, setSocialFacebookId] = useState<string | null>(null);
  const [socialGoogleId, setSocialGoogleId] = useState<string | null>(null);
  const [ispageOne, setIsPageOne] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(59);
  const [mobileAndEmailData, setMobileAndEmailData] =
    useState<IMobileAndEmailData | null>(null);
  const [verifyEmailWithOtp, setVerifyEmailWithOtp] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { mail, phone } = router.query;
  const [registerUser, setRegisterUser] = useState({
    mail: mail != undefined ? mail : undefined,
    phone: phone != undefined ? phone : undefined,
  });

  const redirectToPrevScreen = (reload = false) => {
    if (previousURL && previousURL !== "") {
      if (previousURL === "sign-up" || previousURL === "/sign-up/") {
        !reload ? router.push("/") : window.location.href = '/';
        return true;
      }
      if (
        previousURL?.indexOf("/reset-password/") > -1 ||
        previousURL?.indexOf("/forgot-password/") > -1 ||
        previousURL?.indexOf("/my-orders/") > -1 ||
        previousURL?.indexOf("/verify-email/") > -1 ||
        previousURL?.indexOf("/change-password/") > -1
      ) {
        !reload ? router.push("/") : window.location.href = '/';
        return true;
      }
      router.push(previousURL);
      !reload ? router.push(previousURL) : window.location.href = previousURL;
    } else {
      !reload ? router.push("/") : window.location.href = '/';
    }
  };
  const onSubmit: SubmitHandler<ISignInForm> = (data) => {
    const formData : IMobileAndEmailData = {};

    if(mobileAndEmailData?.email) formData["email"] = emailLowerCase(mobileAndEmailData?.email);
    if(mobileAndEmailData?.mobile) formData["mobile"] = mobileAndEmailData?.mobile;

    if(verifyEmailWithOtp){
      formData["otp"] = data.otp as string
    }else{
      formData["password"] =  data.password
    }

    const responceData = makeDynamicFormDataAndPostData(
      formData,
      APICONFIG.SINGIN_WITH_MULTIPLE_OPTIONS_API
    );
    responceData
      ?.then(async (resp) => {
        if (resp?.data && resp?.meta) {
          showSuccess(resp?.meta?.message);
          let authData = resp?.data;
          authData.user_detail["session_start_time"] = new Date();
          setDataInLocalStorage("auth", authData, true);
          setDataInCookies("auth", authData);
          setDataInRedux(resp);
          if (guestUser) {
            const currentCartData = getCurrentGuestCartItems();
            if (currentCartData?.length) {
              await pagesServices.postPage(
                APICONFIG.GUEST_ADD_TO_CART,
                { "product_id": currentCartData },
              );
            }
            setDataInRedux(resp);
            if (reloadPage) router.reload();
            else router.push("/cart/list");
          } else {
            const currentCartData = getCurrentGuestCartItems();
            if (!currentCartData?.length) {
              redirectToPrevScreen();
              return
            }

            await pagesServices.postPage(
              APICONFIG.GUEST_ADD_TO_CART,
              { "product_id": currentCartData },
            );
            redirectToPrevScreen(true);
          }
        } else {
          ErrorHandler(resp, showError);
        }
      })
      .catch((err) => {
        ErrorHandler(err, showError);
      });
  };

  const setDataInRedux = (data: IAPIResponse) => {
    // @ts-ignore
    dispatch(Action_UserDetails(data));
    dispatch(updateCartCounter(data?.data?.cart_count ?? 0));
    dispatch(updateWishListCounter(data?.data?.wishlist_count ?? 0));
    // @ts-ignore
    dispatch(setGuestUser(false));
  };

  const Validations = {
    // email: {
    //   required: Message.EMAIL_REQUIRED,
    //   pattern: {
    //     value: EMAIL_REGEX,
    //     message: Message.EMAIL_PATTERN,
    //   },
    // },
    password: {
      required: Message.PASSWORD_REQUIRED,
      pattern: {
        value: PASSWORD_REGEX,
        message: Message.PASSWORD_PATTERN,
      },
    },
    otp: {
      required: Message.OTP_REQUIRED,
    },
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
          if (guestUser) {
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
            if (reloadPage) router.reload();
            else router.push("/cart/list");
            if (onComplete)
              onComplete();
          } else {
            // const currentCartData = getCurrentGuestCartItems();
            // if (currentCartData?.length) {
            //   await pagesServices.postPage(
            //     APICONFIG.GUEST_ADD_TO_CART,
            //     { "product_id": currentCartData },
            //   );
            // }
            // window.location.href = "/"
            redirectToPrevScreen();
            if (onComplete)
              onComplete();
          }
        } else {
          ErrorHandler(result, showError);
        }
      },
      (error) => {
        ErrorHandler(error, showError);
      }
    );
  };

  useEffect(() => {
    if (IsBrowser) {
      //@ts-ignore
      setPreviousURL(window["next_referrer"]);
    }

    getSocialLoginKey();
  }, []);

  const getSocialLoginKey = async () => {
    const obj = {
      url: window.location.origin,
    };
    const response = await pagesServices.postPage(
      APICONFIG.GET_ACCOUNT_SHOW_LIST,
      obj
    );
    if (response?.status && response?.status_code === 200) {
      if (response?.data?.SETTINGS) {
        setSocialFacebookId(response?.data?.SETTINGS?.facebook_app_id || null);
        setSocialGoogleId(response?.data?.SETTINGS?.google_client_id || null);
      }
    }
  };

  const onStepOne = (obj: IMobileAndEmailData) => {
    reset();
    setCounter(59)
    setMobileAndEmailData(obj);
    setVerifyEmailWithOtp(true);
  };

  const getOtpInMobileOrEmail = async () => {

    const formData = new FormData();

    (mobileAndEmailData?.email) && formData.append("email", emailLowerCase(mobileAndEmailData?.email));
    (mobileAndEmailData?.mobile) && formData.append("mobile", mobileAndEmailData?.mobile);
    (mobileAndEmailData) && formData.append("is_mobile_signin_with_otp", mobileAndEmailData?.is_mobile_signin_with_otp!);
    (mobileAndEmailData?.mobile) && (mobileAndEmailData?.country) && formData.append("country", mobileAndEmailData?.country);

    setIsLoading(true)
    await pagesServices.postPage(APICONFIG.GET_OTP_IN_MOBILE_OR_EMAIL, formData).then(
      (result) => {
        if (result?.meta?.status) {
          setCounter(59)
          setIsLoading(false)
        }else{
          setIsLoading(false);
          showError(result?.meta?.message)
        }
      },
      (error) => {
        setIsLoading(false);
        ErrorHandler(error, showError);
      }
    );
  }

  useEffect(() => {
    if ((registerUser.mail && registerUser.phone) ||
      (!ispageOne && verifyEmailWithOtp)) {
      let timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      //@ts-ignore
      return () => clearInterval(timer);
    }
  }, [counter, mobileAndEmailData?.mobile, verifyEmailWithOtp, ispageOne]);

  useEffect(() => {
    let { mail, phone } = router.query;
    if (mail == undefined && phone == undefined) {
      setRegisterUser({
        mail: "",
        phone: "",
      });
    }
  }, [router.query]);

  return (
    <>
      {isLoading ? <Loader /> : <></>}
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

        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.signIn + ".min.css"
          }
        />
      </Head>

      <section className="sign-in-sec">
        <div className="container">
          {Object.entries(otpData).length ? (
            <OtpForm1 {...(otpData as IOTPData)} />
          ) : openSignUpFormForUser ? (
            <div className="guest-sign-in">
              <SignUpFormSection1 isGuest={true} />
            </div>
          ) : (
            <div className="sign-in-wrap">
              {socialFacebookId || socialGoogleId ? (
                <div className="social-links-access">
                  {socialFacebookId && (
                    <FacebookLogin
                      onClose={responseFacebook}
                      buttonLabel="Sign In with Facebook"
                      facebookId={socialFacebookId}
                    />
                  )}
                  {socialGoogleId && (
                    <GoogleOAuthProvider clientId={encryptDecrypt(socialGoogleId) as string}>
                      <GoogleLogin
                        onClose={responseGoogle}
                        buttonLabel="Sign In with Google"
                      />

                    </GoogleOAuthProvider>

                  )}
                  <p>OR</p>
                </div>
              ) : (
                <></>
              )}
              <form onSubmit={handleSubmit(onSubmit)}>
                {ispageOne && (
                  <MobileAndEmailForm
                    onStepOne={onStepOne}
                    setIsPageOne={() => setIsPageOne(false)}
                    previousData={mobileAndEmailData}
                  />
                )}
                {!ispageOne && (
                  <div className="user-details-change">
                    <div className="user-details">
                      <p>
                        {mobileAndEmailData?.email || mobileAndEmailData?.mobile}
                      </p>
                    </div>
                    <div
                      className="change-button"
                      onClick={() => setIsPageOne(true)}
                    >
                      Change
                    </div>
                  </div>
                )}
                {!ispageOne && (
                  <div className="form-group">
                    {!verifyEmailWithOtp ? (
                      <>
                        <label>Password*</label>
                        <div className="form-group-wrapper">
                        <input
                          {...register("password", Validations.password)}
                          type={passwordType}
                          name="password"
                          className="form-control"
                          id="password"
                          placeholder="Enter Password"
                        />
                        <i
                          className={
                            passwordType == "password"
                              ? "jkm-eye-off hide-show-icon active"
                              : "jkm-eye-fill hide-show-icon active"
                          }
                          onClick={() =>
                            setPasswordType(
                              passwordType == "password" ? "text" : "password"
                            )
                          }
                        ></i>
                        </div>
                        <FormValidationError errors={errors} name="password" />
                      </>
                    ) : (
                      <>
                        <label>OTP*</label>
                        <input
                          {...register("otp", Validations.otp)}
                          type="text"
                          name="otp"
                          className="form-control"
                          id="otp"
                          placeholder="Enter OTP"
                        />
                        <FormValidationError errors={errors} name="otp" />
                      </>
                    )}
                  </div>
                )}
                {/* <div className="form-group">
                  <label>Email Address*</label>
                  <input
                    {...register("email", Validations.email)}
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="xyz@gmail.com"
                  />
                  <FormValidationError errors={errors} name="email" />
                </div>

                <div className="form-group">
                  <label>Password*</label>
                  <div className="form-group-wrapper">
                    <input
                      {...register("password", Validations.password)}
                      type={passwordType}
                      name="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter Password"
                    />
                    <i
                      className={
                        passwordType == "password"
                          ? "jkm-eye-off hide-show-icon active"
                          : "jkm-eye-fill hide-show-icon active"
                      }
                      onClick={() =>
                        setPasswordType(
                          passwordType == "password" ? "text" : "password"
                        )
                      }
                    ></i>
                  </div>
                  <FormValidationError errors={errors} name="password" />
                </div>
                {!guestUser ? (
                  <Link href="/forgot-password">
                    <a className="forgot-password-link">Forgot Password ?</a>
                  </Link>
                ) : (
                  <></>
                )} */}
                {!ispageOne && (
                  <button type="submit" className="btn btn-primary btn-large">
                    {" "}
                    Login
                  </button>
                )}

                {ispageOne && guestUser && !isB2BUser && (
                  <p
                    className="create-account"
                    onClick={() => setSignUpFormForUser(true)}
                  >
                    <a className="create-new-account">Continue as a Guest</a>
                  </p>
                )}

                {!verifyEmailWithOtp &&
                  !ispageOne && (
                    <Link href="/forgot-password">
                      <a className="forgot-password-link">Forgot Password ?</a>
                    </Link>
                  )}

                {
                  ((!ispageOne && verifyEmailWithOtp)) &&
                  <>
                    {counter ? <p className="resend-otp">Resend in {counter} sec</p> :
                      <p className="resend-otp" onClick={() => getOtpInMobileOrEmail()}>RESEND OTP</p>}
                  </>
                }
                {!ispageOne && (
                  <>
                    {/* <p className="or-text">OR</p> */}
                    <button
                      type="button"
                      className="btn btn-primary btn-large"
                      onClick={() => {
                        reset();
                        setCounter(59)
                        setVerifyEmailWithOtp(!verifyEmailWithOtp);
                        !verifyEmailWithOtp && getOtpInMobileOrEmail()
                      }}
                    >
                      {verifyEmailWithOtp
                        ? "LOGIN WITH PASSWORD"
                        : "GET OTP"}
                    </button>
                  </>
                )}
                {ispageOne && <p className="create-account">
                  New User ?{" "}
                  <Link href="/sign-up">
                    <a className="create-new-account">Create an Account</a>
                  </Link>
                </p>}
                {/* {guestUser ? (
                  <>
                    <input
                      type="submit"
                      className="btn btn-primary btn-large"
                    />

                    {
                      !isB2BUser && (
                        <p
                          className="create-account"
                          onClick={() => setSignUpFormForUser(true)}
                        >
                          <a className="create-new-account">Continue as a Guest</a>
                        </p>
                      )
                    }

                    <p className="create-account">
                      New User ?
                      <Link href="/sign-up">
                        <a className="create-new-account">Create an Account</a>
                      </Link>
                    </p>
                  </>
                ) : (
                  <>
                    <button type="submit" className="btn btn-primary btn-large">
                      Submit
                    </button>
                    <p className="create-account">
                      New User ?
                      <Link href="/sign-up">
                        <a className="create-new-account">Create an Account</a>
                      </Link>
                    </p>
                  </>
                )} */}
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SignInFormSection1;
