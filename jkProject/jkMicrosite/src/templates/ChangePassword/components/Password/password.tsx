import ErrorHandler from "@components/ErrorHandler";
import FormValidationError from "@components/FormValidationError";
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import { useToast } from "@components/Toastr/Toastr";
import APICONFIG from "@config/api.config";
import { Message } from "@constant/errorMessage";
import { PASSWORD_REGEX } from "@constant/regex";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IChangePasswordForm } from ".";
import { useRouter } from "next/router";
import Head from "next/head";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { removeLoginData } from "@util/common";
import { useDispatch, useSelector } from "react-redux";
import { Action_UserDetails } from "src/redux/signIn/signInAction";
import { setLoader } from "src/redux/loader/loaderAction";
import Loader from "@components/customLoader/Loader";

const ChangePasswordSection1 = () => {
  const { showError, showSuccess } = useToast();
  const dispatch = useDispatch();
  const loaderData = useSelector((state) => state);
  const { makeDynamicFormDataAndPostData } = usePostFormDataHook();
  const router = useRouter();
  const onSubmit: SubmitHandler<IChangePasswordForm> = async (data) => {
    // @ts-ignore
    dispatch(setLoader(true));

    const responceData = makeDynamicFormDataAndPostData(
      data,
      APICONFIG.CHANGE_PASSWORD
    );
    responceData
      ?.then((resp) => {
        if (resp?.meta?.status_code === 201 || resp?.meta?.status_code === 200) {
          clearLoginInData();
          // @ts-ignore
          dispatch(setLoader(false));
          showSuccess(resp?.meta?.message);
          router.push("/sign-in");
        } else {
          // @ts-ignore
          dispatch(setLoader(false));
          showError(resp?.meta?.message);
        }
      })
      .catch((err) => {
        // @ts-ignore
        dispatch(setLoader(false));
        ErrorHandler(err, showError);
      });
  };

  const clearLoginInData = () => {
    removeLoginData();
    // @ts-ignore
    dispatch(Action_UserDetails(null));
  };

  const [defaultValues] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IChangePasswordForm>({ defaultValues });

  const watchAllFields = watch();

  const Validations = {
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
      </Head>
      {/* @ts-ignore */}
      {loaderData?.loaderRootReducer?.loadingState ? (
        <Loader />
      ) : (
        <section className="bank_details tab-content current">
          <div className="firm_details">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h4 className="sort-info__title">Change Password</h4>
              <div className="d-row">
                <div className="d-col d-col-2">
                  <div className="form-group invalid">
                    <label>
                      Old Password <em>*</em>
                    </label>
                    <input
                      {...register("old_password", Validations.password)}
                      type="password"
                      className="form-control"
                      name="old_password"
                      placeholder="Old Password"
                    />
                    <FormValidationError errors={errors} name="old_password" />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form-group invalid">
                    <label>
                      New Password <em>*</em>
                    </label>
                    <input
                      {...register("new_password", Validations.new_password)}
                      type="password"
                      className="form-control"
                      name="new_password"
                      placeholder="New Password"
                    />
                    <FormValidationError errors={errors} name="new_password" />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form-group invalid">
                    <label>
                      Re-enter Password <em>*</em>
                    </label>
                    <input
                      {...register("confirm_password", Validations.password)}
                      type="password"
                      className="form-control"
                      name="confirm_password"
                      placeholder="Re-enter Password"
                    />
                    {watchAllFields.new_password !==
                      watchAllFields.confirm_password &&
                      watchAllFields.confirm_password !== "" && (
                        <small className="p-error">
                          {Message.PASSWORD_MATCH}
                        </small>
                      )}
                    <FormValidationError
                      errors={errors}
                      name="confirm_password"
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-secondary">
                Change Password
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default ChangePasswordSection1;
