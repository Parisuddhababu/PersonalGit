import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ErrorHandler from "@components/ErrorHandler";
import FormValidationError from "@components/FormValidationError";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IResetPasswordForm, IResetPasswordRes } from "@type/Pages/resetPassword";
import useResetPasswordHook from "@components/Hooks/ResetPassword/resetPassword";
import { PASSWORD_REGEX } from "@constant/regex";
import { Message } from "@constant/errorMessage";
import Head from "next/head";
import { useRouter } from "next/router";
import CONFIG from "@config/api.config";
import Loader from "@components/customLoader/Loader";
import { getTypeBasedCSSPath } from "@util/common";
import { toast } from "react-toastify"

const IResetPasswordForm1 = () => {
  const router = useRouter();
  const { t } = router.query;
  const [defaultValues] = useState<IResetPasswordForm>({
    new_password: "",
    confirm_password: "",
  });
  const [isDisabled, setisDisabled] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm({ defaultValues });
  const { createResetPasswordFunc, resetPasswordData } = useResetPasswordHook();
  const watchAllFields = watch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordSecurity, setPasswordSecurity] = useState(true)

  const Validations = {
    new_password: {
      required: Message.PASSWORD_REQUIRED,
      pattern: {
        value: PASSWORD_REGEX,
        message: Message.PASSWORD_PATTERN,
      },
    },
    confirm_password: {
      required: Message.PASSWORD_MATCH,
      validate: (value: string) => value === watchAllFields.new_password || Message.PASSWORD_MATCH,
    },
  };

  // eslint
  useEffect(() => {
    if (resetPasswordData) {
      setIsLoading(false);
      showMessages(resetPasswordData);
    }
  }, [resetPasswordData]);

  const showMessages = (data: IResetPasswordRes) => {
    if (
      data?.meta &&
      (data?.meta?.status_code === 201 || data?.meta?.status_code === 200)
    ) {
      toast.success(data?.meta?.message);
      reset();
      setisDisabled(false);
      router.push("/sign-in");
    } else {
      setisDisabled(false);
      ErrorHandler(data, toast.error);
    }
  };

  const submitPassword = (data: IResetPasswordForm) => {
    let obj = {
      new_password: data.new_password,
      confirm_password: data.confirm_password,
      t: t,
    };
    setIsLoading(true);
    createResetPasswordFunc(CONFIG.RESET_PASSWORD, obj);
  };
  return (
    <>
      <Head>
        <title>Reset Password</title>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.resetPassword)} />
      </Head>
      {isLoading && <Loader />}
      <section className="set-new-password-section">
        <div className="container">
          <h2 className="title-center">SET A NEW PASSWORD</h2>
          <div className="set-new-password-content">
            <div className="subtitle-with-border">
              <span>Password Recovery</span>
            </div>
            <form onSubmit={handleSubmit(submitPassword)} className="set-new-password-form">
              <div className="form-group">
                <label className="control-label">New Password*</label>
                <input
                  {...register("new_password", Validations.new_password)}
                  type={passwordSecurity ? "password" : "text"}
                  className="form-control"
                  name="new_password"
                  id="userPassword"
                  placeholder="New Password"
                />
                <FormValidationError errors={errors} name="new_password" />
              </div>
              <div className="form-group">
                <label className="control-label">Confirm New Password*</label>
                <input
                  {...register("confirm_password", Validations.confirm_password)}
                  type={passwordSecurity ? "password" : "text"}
                  name="confirm_password"
                  className="form-control"
                  id="userConfirmPassword"
                  placeholder="Confirm New Password"
                />
                <FormValidationError errors={errors} name="confirm_password" />
              </div>
              <div className="ocs-checkbox">
                <input type="checkbox" id="check1" name="check1"
                  checked={!passwordSecurity}
                  onChange={() => setPasswordSecurity(!passwordSecurity)}
                />
                <label htmlFor="check1">Show Password</label>
              </div>
              <button type="submit" className="btn btn-primary-large" aria-label="set-new-password-btn" disabled={isDisabled}>SET A NEW PASSWORD</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default IResetPasswordForm1;
