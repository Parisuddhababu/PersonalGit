'use client'
import FormValidationError from '@/components/FormValidationError/FormValidationError';
import { IForgotPasswordForm } from '@/types/pages';
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { USER_FORGOT_PASSWORD } from '@/framework/graphql/mutations/user';
import { useDispatch } from 'react-redux';
import { setLoadingState } from '@/framework/redux/reducers/commonSlice';
import "@/styles/pages/auth.scss";
import { PLACE_HOLDERS } from '@/constant/common';
import Link from 'next/link';
import { ROUTES } from '@/config/staticUrl.config';
import { handleGraphQLErrors } from '@/utils/helpers';
import useDetectDomain from '@/framework/hooks/useDetectDomain';
import useValidation from '@/framework/hooks/validations';
import { ForgotPasswordResponse } from '@/types/graphql/pages';

export default function ForgotPassword () {
    const defaultValues = {
        email: '',
    }
    const [forgotPassword, { loading, error }] = useMutation(USER_FORGOT_PASSWORD);
    const domain = useDetectDomain()
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({ defaultValues });
    const {forgotPasswordValidations} = useValidation() 
    const dispatch = useDispatch();

    const submitEmail = (values: IForgotPasswordForm) => {
        forgotPassword({
            variables: { email: values?.email?.toLowerCase(), type: (domain === "Brand" || domain === 'WHIBrand') ? 'Brand' :  'Influencer'},
        })
            .then((res) => {
                const data = res?.data as ForgotPasswordResponse;
                if (data?.forgotPassword?.meta?.statusCode === 200) {
                    toast.success(data?.forgotPassword?.meta?.message);
                    reset()
                    return
                }
            })
            .catch(() => {
                return;
            });
    }

    useEffect(() => {
        dispatch(setLoadingState(loading))
        if (error) {
            handleGraphQLErrors(error)
        }
    }, [loading, error])

    return (
        <div>
            <div className="login-card forgot-password">
                <div className="card-title-wrapper">
                    <h1 className="card-title">Forgot Password</h1>
                    <p className="card-title-description letter-spacing-032">Please enter your email address below, You will receive a link to reset your password</p>
                </div>
                <form onSubmit={handleSubmit(submitEmail)} >
                    <div className="form-group spacing-10">
                        <label htmlFor="forgot-email">Your Email Address*</label>
                        <input
                            {...register("email", forgotPasswordValidations.email)} type="email"
                            name="email"
                            id="forgot-email"
                            className="form-control" placeholder={PLACE_HOLDERS.email} />

                        <FormValidationError errors={errors} name="email" />
                    </div>
                    <div className="text-right spacing-40">
                        <Link target='_self' href={`/${ROUTES.public.signIn}`} className="link letter-spacing-032">SignIn?</Link>
                    </div>
                    <div>
                        <button className="btn btn-primary" disabled={loading}>Reset Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
