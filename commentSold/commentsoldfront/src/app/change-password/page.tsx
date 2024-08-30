'use client'
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Message } from "@/constant/errorMessage";
import FormValidationError from "@/components/FormValidationError/FormValidationError";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useRouter, useSearchParams} from "next/navigation";
import "@/styles/pages/auth.scss";
import { CHANGE_PROFILE_PASSWORD } from "@/framework/graphql/mutations/changePassword";
import { IChangePasswordForm } from "@/types/components";
import { useDispatch } from "react-redux";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";
import { LOCAL_STORAGE_KEY } from "@/constant/common";
import { handleGraphQLErrors } from "@/utils/helpers";
import useValidation from "@/framework/hooks/validations";
import { ChangePasswordResponse } from "@/types/graphql/pages";

const ChangePasswordSection = () => {
    const [changeProfilePassword, { loading, error }] = useMutation(CHANGE_PROFILE_PASSWORD);
    const [formState, setFormState] = useState({
        currentPasswordSecurity: true,
        newPasswordSecurity: true,
        confirmPasswordSecurity: true,
    });
    const params = useSearchParams();
    const password = params.get?.('resetPassword');
    const dispatch = useDispatch();
    const router = useRouter();
    const {changePasswordValidations} = useValidation()
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues
    } = useForm<IChangePasswordForm>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }
    });

    useEffect(() => {
        const currentPassword = localStorage.getItem(LOCAL_STORAGE_KEY.currentPassword)
        if (password === 'true' && currentPassword) {
            setValue('currentPassword', currentPassword)
        }
    }, [password])

    useEffect(() => {
        dispatch(setLoadingState(loading))
        if (error) {
            handleGraphQLErrors(error)
        }

        return () => {
            localStorage.removeItem(LOCAL_STORAGE_KEY.currentPassword)
        }
    }, [loading, error])

    const Validations = {
        ...changePasswordValidations,
        confirmPassword: {
            required: Message.CONFIRM_PASSWORD_REQUIRED,
            validate: (value: string) => value === getValues('newPassword') || Message.PASSWORD_MATCH,
        }
    };

    const onSubmit: SubmitHandler<IChangePasswordForm> = async (data) => {
        changeProfilePassword({
            variables: {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            }
        }).then((res) => {
            const response = res.data as ChangePasswordResponse
            if (response?.changeProfilePassword?.meta.statusCode === 200) {
                toast.success(response?.changeProfilePassword?.meta.message);
                router.push(`/`);
                localStorage.removeItem(LOCAL_STORAGE_KEY.currentPassword)
            }
        })
    };
    
    return (
        <div>
            <div className="login-card change-password">
                <div className="card-title-wrapper">
                    <h1 className="card-title">Update Password</h1>
                    <p className="card-title-description letter-spacing-032">Want to Update? No Problem,Password must contain 1 upper case, 1 lower case, 1 number, 1 special character ( @ ! $ % ^ & #) & minimum 8 characters to maximum 40 characters.</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} >
                    {
                        !password &&
                        <div className="form-group">
                            <label htmlFor="currentPassword">Current Password*</label>
                            <div className="form-group-password">
                                <input   {...register("currentPassword", Validations.currentPassword)}
                                    type={formState.currentPasswordSecurity ? "password" : "text"}
                                    placeholder="Enter Current Password"
                                    className="form-control"
                                    name="currentPassword"
                                    id="currentPassword"
                                />
                                <FormValidationError errors={errors} name="currentPassword" />
                                <span className={formState.currentPasswordSecurity ? "icon-eye-off password-icon" : "icon-eye password-icon"} onClick={() => setFormState({ ...formState, currentPasswordSecurity: !formState.currentPasswordSecurity })}></span>
                            </div>
                        </div>
                    }
                    <div className="form-group spacing-40">
                        <label htmlFor="newPassword">New Password*</label>
                        <div className="form-group-password">
                            <input  {...register("newPassword", Validations.newPassword)}
                                type={formState.newPasswordSecurity ? "password" : "text"}
                                placeholder="Enter New Password"
                                className="form-control"
                                name="newPassword"
                                id="newPassword"
                            />
                            <FormValidationError errors={errors} name="newPassword" />
                            <span className={formState.newPasswordSecurity ? "icon-eye-off password-icon" : "icon-eye password-icon"} onClick={() => setFormState({ ...formState, newPasswordSecurity: !formState.newPasswordSecurity })}></span>
                        </div>
                    </div>
                    <div className="form-group spacing-40">
                        <label htmlFor="confirmPassword">Confirm Password*</label>
                        <div className="form-group-password">
                            <input   {...register("confirmPassword", Validations.confirmPassword)}
                                type={formState.confirmPasswordSecurity ? "password" : "text"}
                                placeholder="Enter Confirm Password"
                                className="form-control"
                                name="confirmPassword"
                                id="confirmPassword"
                            />
                            <span className={formState.confirmPasswordSecurity ? "icon-eye-off password-icon" : "icon-eye password-icon"} onClick={() => setFormState({ ...formState, confirmPasswordSecurity: !formState.confirmPasswordSecurity })}></span>
                            <FormValidationError errors={errors} name="confirmPassword" />
                        </div>
                    </div>
                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary" >Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ChangePasswordSection;