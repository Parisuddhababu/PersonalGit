
import { useEffect, useState } from "react";
import { useToast } from "@components/Toastr/Toastr";
import { useForm } from "react-hook-form";
import ErrorHandler from "@components/ErrorHandler";
import FormValidationError from "@components/FormValidationError";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IResetPasswordForm } from "@type/Pages/resetPassword";
import useResetPasswordHook from "@components/Hooks/ResetPassword/resetPassword";
import { PASSWORD_REGEX } from "@constant/regex";
import { Message } from "@constant/errorMessage";
import Head from "next/head";
import { useRouter } from "next/router";
import CONFIG from "@config/api.config";
import Loader from "@components/customLoader/Loader";
import Link from "next/link";


const IResetPasswordForm2 = ({ banner }: { banner?: string }) => {
    const router = useRouter()
    const { t } = router.query
    const [defaultValues] = useState<IResetPasswordForm>({
        new_password: "",
        confirm_password: ""
    });
    const [isDisabled, setisDisabled] = useState<boolean>(false);
    const { showError, showSuccess }: any = useToast();
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        watch
    } = useForm({ defaultValues });
    const {
        createResetPasswordFunc,
        resetPasswordData
    } = useResetPasswordHook();
    const [passwordType, setPasswordType] = useState<string>("password");
    const [passwordTypeConfirmPassword, setPasswordTypeConfirmPassword] =
        useState<string>("password");
    const watchAllFields = watch();
    const [isLoading, setIsLoading] = useState<boolean>(false)


    const Validations = {
        new_password: {
            required: Message.PASSWORD_REQUIRED,
            pattern: {
                value: PASSWORD_REGEX,
                message: Message.PASSWORD_PATTERN,
            },
        },
        confirm_password: {
            validate: {},
        },
    };


    // eslint
    useEffect(() => {
        if (resetPasswordData) {
            setIsLoading(false)
            showMessages(resetPasswordData)
        }
        // eslint-disable-next-line
    }, [resetPasswordData])

    const showMessages = (data: any) => {
        if (data?.meta && (data?.meta?.status_code === 201 || data?.meta?.status_code === 200)) {
            showSuccess(data?.meta?.message);
            reset();
            setisDisabled(false);
            router.push("/sign-in");
        } else {
            setisDisabled(false);
            ErrorHandler(data, showError);
        }
    }

    const submitPassword = (data: IResetPasswordForm) => {
        let obj = {
            new_password: data.new_password,
            confirm_password: data.confirm_password,
            t: t
        }
        setIsLoading(true)
        createResetPasswordFunc(
            CONFIG.RESET_PASSWORD,
            obj
        );

    }
    return (
        <>
            <Head>
                <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_COMPONENT + 'forgot-password-2' + ".min.css"} />
                <link
                    rel="stylesheet"
                    href={
                        APPCONFIG.STYLE_BASE_PATH_COMPONENT +
                        CSS_NAME_PATH.toasterDesign +
                        ".css"
                    }
                />
            </Head>
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
            <section className="forgot-password-sec"
                style={{
                    background: `url(${banner})`
                }}
            >
                <div className="container">
                    <div className="forgot-password-wrap">
                        <h3>Reset password</h3>
                        <Link href={"/forgot-password"}><a><i className="jkms2-arrow-left arrow-left"></i></a></Link>
                        <form onSubmit={handleSubmit(submitPassword)}>
                            <div className="d-col d-col-2">
                                <div className="form-group">
                                    <label>New Password*</label>
                                    <div className="form-group-wrapper">
                                        <input
                                            {...register("new_password", Validations.new_password)}
                                            type={passwordType}
                                            className="form-control"
                                            name="new_password"
                                            id="userPassword"
                                            placeholder="India@123456"
                                        />
                                        <i
                                            className="jkms2-eye-off hide-show-icon active"
                                            onMouseDown={() => setPasswordType("text")}
                                            onMouseUp={() => setPasswordType("password")}
                                        ></i>
                                    </div>
                                    {/* <i className="jkms2-eye-fill hide-show-icon "></i> */}
                                    <FormValidationError errors={errors} name="new_password" />
                                </div>
                            </div>
                            <div className="d-col d-col-2">
                                <div className="form-group">
                                    <label>Confirm Password*</label>
                                    <div className="form-group-wrapper">
                                        <input
                                            {...register("confirm_password")}
                                            type={passwordTypeConfirmPassword}
                                            name="confirm_password"
                                            className="form-control"
                                            id="userConfirmPassword"
                                            placeholder="India@123456"
                                        />
                                        <i
                                            className="jkms2-eye-off hide-show-icon active"
                                            onMouseDown={() => setPasswordTypeConfirmPassword("text")}
                                            onMouseUp={() =>
                                                setPasswordTypeConfirmPassword("password")
                                            }
                                        ></i>
                                    </div>
                                </div>
                                {watchAllFields.new_password !==
                                    watchAllFields.confirm_password && (
                                        <small className="p-error">{Message.PASSWORD_MATCH}</small>
                                    )}
                            </div>
                            <button className="btn btn-primary btn-large reset-pwd" type="submit" disabled={isDisabled}>Reset Password</button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default IResetPasswordForm2;
