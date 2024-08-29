
import { useCallback, useEffect, useState } from "react";
import { IForgotPasswordForm } from "@type/Pages/forgotPassword";
import { Controller, useForm } from "react-hook-form";
import useForgotPasswordHook from "@components/Hooks/ForgotPassword/forgotPassword";
import ErrorHandler from "@components/ErrorHandler";
import FormValidationError from "@components/FormValidationError";
import { Message } from "@constant/errorMessage";
import { EMAIL_REGEX } from "@constant/regex";
import CONFIG from "@config/api.config";
import Loader from "@components/customLoader/Loader";
import { useRouter } from "next/router";
import { toast } from "react-toastify"
import BreadCrumbs from "@components/BreadCrumbs";
import { IAPIError } from "@type/Common/Base";

const IForgotPasswordForm1 = () => {
    const [defaultValues] = useState<IForgotPasswordForm>({
        email: "",
    });
    const [isDisabled, setisDisabled] = useState<boolean>(false);
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
    }, [forgotPasswordData])

    const showMessages = (data: IAPIError) => {
        if (data?.meta && data?.meta?.status_code === 200) {
            toast.success(data?.meta?.message)
            reset();
            setisDisabled(false);
            router.push("/sign-in");
        } else {
            setisDisabled(false);
            ErrorHandler(data, toast.error);
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
    const emailFieldHandler = useCallback(({ field }: { field: { name: string } }) => {
        return (
            <>
                <label className="control-label">Your Email Address*</label>
                <input
                    type="email"
                    className="form-control"
                    placeholder="Youremail@gmail.com"
                    id={field.name}
                    {...field}
                />

            </>
        )
    }, []);


    return (
        <>
            {isLoading && <Loader />}
            <BreadCrumbs item={[{ slug: '/forgot-password', title: 'Forgot Password' }]} />
            <section className="forgot-password-section">
                <div className="container">
                    <h2>FORGOT PASSWORD</h2>
                    <div className="forgot-password-content">
                        <div className="subtitle-with-border">
                            <span>Password Recovery</span>
                            <p>Please enter your email address below, You will receive a link to reset
                                your password
                            </p>
                        </div>
                        <form onSubmit={handleSubmit(submitEmail)} className="forgot-password-form">
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
                                    render={emailFieldHandler}

                                />
                                <FormValidationError errors={errors} name="email" />
                            </div>
                            <button type="submit" className="btn btn-primary-large" aria-label="reset-password-btn" disabled={isDisabled}>RESET PASSWORD</button>
                        </form>
                    </div>
                </div>
            </section>

        </>
    );
};

export default IForgotPasswordForm1;
