'use client'
import FormValidationError from '@/components/FormValidationError/FormValidationError';
import { Message } from '@/constant/errorMessage';
import { IResetPasswordForm } from '@/types/pages';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { USER_RESET_PASSWORD } from '@/framework/graphql/mutations/user';
import { useDispatch } from 'react-redux';
import { setLoadingState } from '@/framework/redux/reducers/commonSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/config/staticUrl.config';
import Link from 'next/link';
import "@/styles/pages/auth.scss";
import { handleGraphQLErrors } from '@/utils/helpers';
import useValidation from '@/framework/hooks/validations';

export default function ResetPassword () {
    const defaultValues = {
        password: "",
        confirmPassword: "",
    }
    const [resetPassword, { loading, error }] = useMutation(USER_RESET_PASSWORD);
    const [formState, setFormState] = useState({
        password: false,
        confirmPassword: false,

    });
    const {
        register,
        formState: { errors },
        handleSubmit,
        getValues
    } = useForm({ defaultValues });
    const params = useSearchParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const {resetPasswordValidations} = useValidation()

    const Validations = {
        ...resetPasswordValidations,
        confirmPassword: {
            required: Message.CONFIRM_PASSWORD_REQUIRED,
            validate: (value: string) => value === getValues('password') || Message.PASSWORD_MATCH,
        },
    };

    const submitPassword = (data: IResetPasswordForm) => {
        resetPassword({
            variables: { ...data, token: params.get('token') },
        }).then((res) => {
            const data = res?.data;
            if (data?.resetPassword?.meta?.statusCode === 200) {
                toast.success(data?.resetPassword?.meta?.message);
                router.push(`/${ROUTES.public.signIn}`);
                return
            }
        }).catch(() => {
            return;
        });
    };

    useEffect(() => {
        dispatch(setLoadingState(loading))
        if (error) {
            handleGraphQLErrors(error)
        }
    }, [loading, error])

    return (
        <div>
            <div className="login-card change-password">
                <div className="card-title-wrapper">
                    <h1 className="card-title">Update Password</h1>
                    <p className="card-title-description letter-spacing-032">Want to Reset Your Password? No Problem, Password must contain 1 upper case, 1 lower case, 1 number, 1 special character ( @ ! $ % ^ & #) & minimum 8 characters to maximum 40 characters.</p>
                </div>
                <form onSubmit={handleSubmit(submitPassword)} >
                    <div className="form-group spacing-40">
                        <label htmlFor="Confirm Password">New Password*</label>
                        <div className="form-group-password">
                            <input  {...register("password", Validations.password)}
                                type={formState.password ? "password" : "text"}
                                placeholder="Enter New Password"
                                className="form-control"
                                name="password"
                                id="password"
                            />
                            <FormValidationError errors={errors} name="password" />
                            <span className={formState.password ? "icon-eye-off password-icon" : "icon-eye password-icon"} onClick={() => setFormState({ ...formState, password: !formState.password })}></span>
                        </div>
                    </div>
                    <div className="form-group spacing-40">
                        <label htmlFor="Confirm Password">Confirm Password*</label>
                        <div className="form-group-password">
                            <input   {...register("confirmPassword", Validations.confirmPassword)}
                                type={formState.confirmPassword ? "password" : "text"}
                                placeholder="Enter Confirm Password"
                                className="form-control"
                                name="confirmPassword"
                                id="confirmPassword"
                            />
                            <span className={formState.confirmPassword ? "icon-eye-off password-icon" : "icon-eye password-icon"} onClick={() => setFormState({ ...formState, confirmPassword: !formState.confirmPassword })}></span>
                            <FormValidationError errors={errors} name="confirmPassword" />
                        </div>
                    </div>
                    <div className="btn-group">
                        <Link href={`/${ROUTES.public.signIn}`}>
                            <button type='button' className="btn btn-secondary" >Cancel</button>
                        </Link>
                        <button type='submit' className="btn btn-primary" >Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
