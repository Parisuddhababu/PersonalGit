import MyAccountHeaderComponent from "@components/Account/MyAccountHeaderComponent";
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IMyProfileData } from "@type/Pages/myProfile";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IMyProfileForm } from ".";
import { Message } from "@constant/errorMessage";
import { EMAIL_REGEX, ONLY_CHARACTERS, PASSWORD_REGEX } from "@constant/regex";
import APICONFIG from "@config/api.config";
import { toast } from "react-toastify";
import FormValidationError from "@components/FormValidationError";
import ErrorHandler from "@components/ErrorHandler";
import { IChangePasswordForm } from "@templates/ChangePassword/components/Password";
import BreadCrumbs from "@components/BreadCrumbs";
import { useDispatch } from "react-redux";
import { setLoader } from "src/redux/loader/loaderAction";
import { useRouter } from "next/router";


const MyProfileSection1 = (props: IMyProfileData) => {
  const router = useRouter()
  const [changeEmailFormShow, setShowEmailForm] = useState(false);
  const [changePasswordFormShow, setShowChangePasswordForm] = useState(router?.query?.password === '1');
  const { makeDynamicFormDataAndPostData } = usePostFormDataHook();
  const dispatch = useDispatch();
  const [oldPasswordSecurity, setOldPasswordSecurity] = useState(true);
  const [newPasswordSecurity, setNewPasswordSecurity] = useState(true);
  const [confirmPasswordSecurity, setConfirmPasswordSecurity] = useState(true);

  const defaultValues = changePasswordFormShow
    ? {
      first_name: props.first_name,
      last_name: props.last_name,
      old_password: "",
      new_password: "",
      confirm_password: "",
    }
    : {
      first_name: props.first_name,
      last_name: props.last_name,
      email: props.email,
      old_password: "",
      new_password: "",
      confirm_password: "",
    };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<IMyProfileForm>({ defaultValues });

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
    email: {
      required: Message.EMAIL_REQUIRED,
      pattern: {
        value: EMAIL_REGEX,
        message: Message.EMAIL_PATTERN,
      },
    },
    password: {
      required: Message.PASSWORD_REQUIRED,
    },
    new_password: {
      required: Message.PASSWORD_REQUIRED,
      pattern: {
        value: PASSWORD_REGEX,
        message: Message.PASSWORD_PATTERN,
      },
    },
    confirm_password: {
      required: Message.PASSWORD_REQUIRED,
    }
  };

  const watchAllFields = watch();

  const changePasswordHandler = async (data: IChangePasswordForm) => {
    const responceData = makeDynamicFormDataAndPostData(
      data,
      APICONFIG.CHANGE_PASSWORD
    );
    dispatch(setLoader(true));
    responceData
      ?.then((resp) => {
        dispatch(setLoader(false));
        if (resp?.meta?.status) {
          toastMessage(resp?.meta?.message)
          clearPassword()
          return
        }
        toast.error(resp?.meta?.message);
      })
      .catch((err) => {
        dispatch(setLoader(false));
        ErrorHandler(err, toast.error);
      });
  };

  const toastMessage = (msg: string) => {
    if (changeEmailFormShow && changePasswordFormShow) {
      toast.success('Profile has been updated successfully');
      return
    }
    if (changeEmailFormShow && !changePasswordFormShow) {
      toast.success('Your email has been updated successfully, check your email to verify');
      return
    }
    toast.success(msg);
  }

  const changeEmailHandler = (data: IMyProfileForm, isToast = true) => {
    const responceData = makeDynamicFormDataAndPostData(
      data,
      APICONFIG.UPDATE_PROFILE_DATA
    );
    if (isToast) {
      dispatch(setLoader(true));
    }
    responceData
      ?.then((resp) => {
        if (isToast) {
          dispatch(setLoader(false))
        }
        if (resp?.meta?.status) {
          if (isToast) {
            toastMessage(resp?.meta?.message)
            setShowEmailForm(false)
          }
          return
        }
        if (isToast) {
          toast.error(resp?.meta?.message);
        }
      })
      .catch((err) => {
        if (isToast) {
          ErrorHandler(err, toast.error);
          dispatch(setLoader(false));
        }
      });
  };

  const onChangeEmailHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked === true) {
      setShowEmailForm(true);
    }
    else {
      setShowEmailForm(false);
      setValue('email', props.email)
    }
  }

  const onChangePasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setShowChangePasswordForm(event.target.checked);
  }

  const clearPassword = () => {
    reset()
    setShowChangePasswordForm(false);
    setShowEmailForm(false)
    if (router?.query?.password === '1') {
      router.replace('/my-account')
    }
  }

  const onSubmit: SubmitHandler<IMyProfileForm> = (data) => {
    if (changeEmailFormShow && changePasswordFormShow) {
      changeEmailHandler(data, false);
      changePasswordHandler(data);
      return
    }
    if (changePasswordFormShow) {
      changePasswordHandler(data);
      return
    }
    changeEmailHandler(data);
  };
  return (
    <>
      <Head>
        <title>Account Information</title>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.accountTabbing)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.accountInfoContent)}
        />
      </Head>
      <main>
        <BreadCrumbs item={[{ slug: '/account-information', title: 'Account Information' }]} />
        <section className="account-information-section my-order-section">
          <div className="container">
            <MyAccountHeaderComponent />
            <div className="account-right-content-wrap">
              <div className="account-content-title">
                <h2>Account Information</h2>
              </div>
              <div className="account-information-content">
                <form onSubmit={handleSubmit(onSubmit)} className="account-information-form row">
                  <div className="d-col form-group">
                    <label className="control-label">First Name*</label>
                    <input
                      {...register("first_name", Validations.first_name)}
                      type="text"
                      name="first_name"
                      className="form-control"
                      id="first_name"
                    />
                    <FormValidationError errors={errors} name="first_name" />
                  </div>
                  <div className="d-col form-group">
                    <label className="control-label">Last Name*</label>
                    <input
                      {...register("last_name", Validations.last_name)}
                      type="text"
                      name="last_name"
                      className="form-control"
                      id="last_name"
                    />
                    <FormValidationError errors={errors} name="last_name" />
                  </div>
                  <div className="d-col change-checkboxes">
                    <div className="ocs-checkbox">
                      <input
                        type="checkbox"
                        id="change-email"
                        name="change-email"
                        checked={changeEmailFormShow}
                        onChange={onChangeEmailHandler}
                      />
                      <label htmlFor="change-email">Change Email</label>
                    </div>
                    <div className="ocs-checkbox">
                      <input
                        type="checkbox"
                        id="change-pass"
                        name="change-pass"
                        checked={changePasswordFormShow}
                        onChange={onChangePasswordHandler}
                      />
                      <label htmlFor="change-pass">Change Password</label>
                    </div>
                  </div>
                  {
                    (changeEmailFormShow || changePasswordFormShow) &&
                    <div className="d-col change-email-pass-title">
                      {
                        (changeEmailFormShow && changePasswordFormShow) &&
                        <h3>Change email and password</h3>
                      }
                      {
                        (changeEmailFormShow && !changePasswordFormShow) &&
                        <h3>Change email</h3>
                      }
                      {
                        (!changeEmailFormShow && changePasswordFormShow) &&
                        <h3>Change password</h3>
                      }
                    </div>
                  }

                  {changeEmailFormShow && <div className="d-col form-group">
                    <label className="control-label">Email*</label>
                    <input
                      {...register("email", Validations.email)}
                      type="email"
                      className="form-control"
                      name="email"
                      id="userEmail"
                      placeholder="xyz@gmail.com"
                    />
                    <FormValidationError errors={errors} name="email" />
                  </div>}
                  {
                    changePasswordFormShow &&
                    <>
                      <div className="d-col form-group">
                        <label className="control-label">Current Password*</label>
                        <div className="password-field">
                          <input   {...register("old_password", Validations.password)}
                            type={oldPasswordSecurity ? "password" : "text"}
                            placeholder="Enter your current password"
                            className="form-control"
                            name="old_password"
                            id="old_password"
                          />
                          <FormValidationError errors={errors} name="old_password" />
                          <i className={!oldPasswordSecurity ? "osicon-visible-eye" : "osicon-invisible-eye"} onClick={() => setOldPasswordSecurity(!oldPasswordSecurity)} ></i>
                        </div>
                      </div>
                      <div className="d-col form-group">
                        <label className="control-label">New Password*</label>
                        <div className="password-field">
                          <input  {...register("new_password", Validations.new_password)}
                            type={newPasswordSecurity ? "password" : "text"}
                            placeholder="Enter your new password"
                            className="form-control"
                            name="new_password"
                            id="new_password"
                          />
                          <FormValidationError errors={errors} name="new_password" />
                          <i className={!newPasswordSecurity ? "osicon-visible-eye" : "osicon-invisible-eye"} onClick={() => setNewPasswordSecurity(!newPasswordSecurity)} ></i>
                        </div>
                      </div>
                      <div className="d-col form-group">
                        <label className="control-label">Confirm Password*</label>
                        <div className="password-field">
                          <input   {...register("confirm_password", Validations.confirm_password)}
                            type={confirmPasswordSecurity ? "password" : "text"}
                            placeholder="Confirm your password"
                            className="form-control"
                            name="confirm_password"
                            id="confirm_password"
                          />
                          <i className={!confirmPasswordSecurity ? "osicon-visible-eye" : "osicon-invisible-eye"} onClick={() => setConfirmPasswordSecurity(!confirmPasswordSecurity)} ></i>
                          {watchAllFields.new_password !==
                            watchAllFields.confirm_password &&
                            watchAllFields.confirm_password !== "" && (
                              <small className="p-error">
                                {Message.PASSWORD_MATCH}
                              </small>
                            )}
                          <FormValidationError errors={errors} name="confirm_password" />
                        </div>
                      </div>
                    </>

                  }
                  <div className="d-col">
                    <button type="submit" className="btn btn-primary">
                      SAVE
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>


  );
};

export default MyProfileSection1;
