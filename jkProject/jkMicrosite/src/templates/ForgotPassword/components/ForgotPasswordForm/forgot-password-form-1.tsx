
import { useEffect, useState } from "react";
import { IForgotPasswordForm } from "@type/Pages/forgotPassword";
import { useToast } from "@components/Toastr/Toastr";
import { Controller, useForm } from "react-hook-form";
import useForgotPasswordHook from "@components/Hooks/ForgotPassword/forgotPassword";
import ErrorHandler from "@components/ErrorHandler";
import FormValidationError from "@components/FormValidationError";
import { Message } from "@constant/errorMessage";
import { EMAIL_REGEX } from "@constant/regex";
import CONFIG from "@config/api.config";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";
import Loader from "@components/customLoader/Loader";
import { useRouter } from "next/router";
import Link from "next/link";

const IForgotPasswordForm1 = () => {
    const [defaultValues] = useState<IForgotPasswordForm>({
        email: "",
    });
    const [isDisabled, setisDisabled] = useState<boolean>(false);
    const { showError, showSuccess }: any = useToast();
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({ defaultValues });
    const {
        createForgotPasswordFunc,
        forgotPasswordData
    } = useForgotPasswordHook();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter();


    // eslint
    useEffect(() => {
        if (forgotPasswordData) {
            setIsLoading(false)
            showMessages(forgotPasswordData)
        }
        // eslint-disable-next-line
    }, [forgotPasswordData])

    const showMessages = (data: any) => {
        if (data?.meta && data?.meta?.status_code === 201) {
            showSuccess(data?.meta?.message);
            reset();
            setisDisabled(false);
            router.push("/sign-in");
        } else {
            setisDisabled(false);
            ErrorHandler(data, showError);
        }
    }

    const submitEmail = (data: IForgotPasswordForm) => {
        let obj = {
            email: data?.email
        }
        setIsLoading(true)
        createForgotPasswordFunc(
            CONFIG.FORGOT_PASSWORD,
            obj
        );

    }
    return (
        <>
            <Head>
                <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_COMPONENT + CSS_NAME_PATH.forgotPassword + ".min.css"} />
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
            <section className="forgot-password-sec">
                <div className="container">
                    <div className="forgot-password-wrap">
                        <Link href="/sign-in"><a><i className="jkm-arrow-left arrow-left"></i></a></Link>
                        <p className="para-text">{`Enter your email address and`} <br></br>{`we'll send you a link to reset your password`}</p>
                        <form onSubmit={handleSubmit(submitEmail)}>
                            <div className="form-group">
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: Message.EMAIL_REQUIRED,
                                        pattern: {
                                            value: EMAIL_REGEX,
                                            message: Message.EMAIL_PATTERN,
                                        },
                                    }}
                                    render={({ field }) => (
                                        <>
                                            <label>Email Address*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter your email"
                                                id={field.name}
                                                {...field}
                                            />
                                        </>
                                    )}

                                />
                                <FormValidationError errors={errors} name="email" />
                            </div>
                            <button className="btn btn-primary btn-large" type="submit" disabled={isDisabled}>Submit</button>
                            <p className="create-account">New User ? <a href="/sign-up" className="create-new-account">Create an Account</a></p>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default IForgotPasswordForm1;
