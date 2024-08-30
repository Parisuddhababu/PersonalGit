'use client'
import FormValidationError from '@/components/FormValidationError/FormValidationError'
import { ROUTES } from '@/config/staticUrl.config'
import { Message } from '@/constant/errorMessage'
import { SelectedOption, SignForm } from '@/types/pages'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/client'
import { LOGIN_USER } from '@/framework/graphql/mutations/user'
import { useDispatch } from 'react-redux'
import { setLoadingState } from '@/framework/redux/reducers/commonSlice'
import { DEFAULT_PRIMARY_COLOR, FIELDS, LABELS, LOCAL_STORAGE_KEY, PLACE_HOLDERS } from '@/constant/common'
import APPCONFIG from '@/config/app.config'
import ReCAPTCHA from "react-google-recaptcha"
import "@/styles/pages/auth.scss"
import { useRouter } from 'next/navigation'
import Select from 'react-select';
import { handleGraphQLErrors } from '@/utils/helpers'
import useValidation from '@/framework/hooks/validations'
import useDetectDomain from '@/framework/hooks/useDetectDomain';
import Cookies from "js-cookie";
import { LoginResponse } from '@/types/graphql/pages'

export default function SignIn() {
    const [brandChange, setBrandChange] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<SignForm>({
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const [passwordSecurity, setPasswordSecurity] = useState(true)
    const [captchaVerified, setCaptchaVerified] = useState<boolean>(false)
    const [selectedUserType, setSelectedUserType] = useState<{
        value: string
        label: string
    }>({
        value: 'Influencer',
        label: 'Influencer'
    })
    const [login, { loading, error }] = useMutation(LOGIN_USER)
    const dispatch = useDispatch()
    const router = useRouter();
    const domain = useDetectDomain()
    const {signInFormValidations} = useValidation()

    useEffect(() => {
        let preFetchPages = ['/', `/${ROUTES.private?.changePassword}/?resetPassword=true`]
        const lastVisitedRoute = Cookies.get(LOCAL_STORAGE_KEY.lastVisitedRoute);
        if (lastVisitedRoute) preFetchPages = [...preFetchPages, lastVisitedRoute]
        preFetchPages.forEach((prePath) => {
            router.prefetch(prePath)
        })
    }, [router])

    const redirectToPage = (isResetPassword: boolean) => {
        if (isResetPassword) {
            router.push(`/${ROUTES.private?.changePassword}/?resetPassword=true`);
            localStorage.setItem(LOCAL_STORAGE_KEY.currentPassword, getValues('password'))
            return
        }
        const lastRoute = localStorage.getItem(LOCAL_STORAGE_KEY.lastRoute);
        if (lastRoute === '/') {
            localStorage.setItem(LOCAL_STORAGE_KEY.lastRoute, "");
            router.push(lastRoute);
            return;
        }
        if (window.history.length > 2) {
            router.back()
            return
        }
        router.push("/");
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Get the current URL
            const currentURL = window.location.href;

            // Extract the domain from the URL
            const domain = new URL(currentURL).hostname;

            if (domain === 'localhost' || domain === 'whimarketingfront.demo.brainvire.dev') {
                setBrandChange(true)
            }
        }
    }, [])

    const onSubmit: SubmitHandler<SignForm> = (values) => {
        if (!captchaVerified) {
            toast.error(Message.CAPTCHA_REQUIRED)
            return
        }
        login({
            variables: { ...values, email:values.email.toLowerCase(), type: selectedUserType?.value },
        })
            .then((res) => {
                const data = res?.data as LoginResponse
                if (data?.loginUser?.meta?.statusCode === 200) {
                    localStorage.setItem(LOCAL_STORAGE_KEY.primaryColor,data?.loginUser?.data?.brand_user_setting?.primary_color ?? DEFAULT_PRIMARY_COLOR)
                    localStorage.setItem(LOCAL_STORAGE_KEY.authToken, data?.loginUser?.data?.token)
                    Cookies.set(LOCAL_STORAGE_KEY.authToken,data?.loginUser?.data?.token)
                    localStorage.setItem(LOCAL_STORAGE_KEY.userDetails, JSON.stringify(data?.loginUser?.data?.user))
                    data?.loginUser?.data?.current_plan_details ? localStorage.setItem(LOCAL_STORAGE_KEY.UsersCurrentPlan, JSON.stringify(data?.loginUser?.data?.current_plan_details)) : localStorage.removeItem(LOCAL_STORAGE_KEY.UsersCurrentPlan);
                    redirectToPage(!data?.loginUser?.data?.user?.reset_password)
                }
            })
    }

    useEffect(() => {
        dispatch(setLoadingState(loading))
        if (!error) return
        handleGraphQLErrors(error)
    }, [loading, error])

    const onRecaptcha = useCallback(() => {
        setCaptchaVerified(true)
    }, [])

    const onUserTypeChange = (user: SelectedOption) => {
        setSelectedUserType(user)
    }

    useEffect(() => {
        if (domain === 'Brand' || domain === 'WHIBrand') {
            setSelectedUserType({
                value: 'Brand',
                label: 'Brand'
            })
        }
    }, [domain]);

    return (
        <div>
            <div className="login-card customer-login">
                <div className="card-title-wrapper">
                    <h1 className="card-title">
                        {
                            selectedUserType?.value === 'Brand' ?
                                LABELS.brandLogin :
                                LABELS.influencerLogin
                        }
                    </h1>
                    <p className="card-title-description letter-spacing-032">{LABELS.loginHeader}</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="user-email">{FIELDS.email}</label>
                        <input
                            {...register("email", signInFormValidations.email)}
                            type="email"
                            name="email"
                            id="user-email"
                            placeholder={PLACE_HOLDERS.email}
                            className="form-control" />
                        <FormValidationError errors={errors} name="email" />
                    </div>
                    <div className="form-group password-form-group spacing-30">
                        <label htmlFor="user-password">{FIELDS.password}</label>
                        <div className="form-group-password">
                            <input
                                {...register("password", signInFormValidations.password)}
                                type={passwordSecurity ? "password" : "text"}
                                name="password"
                                id="user-password"
                                placeholder={PLACE_HOLDERS.password}
                                className="form-control" />
                            <FormValidationError errors={errors} name="password" />
                            <span className={passwordSecurity ? "icon-eye-off password-icon" : "icon-eye password-icon"}
                                onClick={() => setPasswordSecurity(!passwordSecurity)} ></span>
                        </div>
                    </div>
                    {
                        brandChange &&
                        <div className="form-group password-form-group">
                            <label htmlFor="user-type">Select user type</label>
                            <div className="react-select-design">
                                <Select
                                    placeholder="+123"
                                    className='countryCode'
                                    aria-label="user type"
                                    id="user-type"
                                    name="countryCodeId"
                                    value={selectedUserType}
                                    onChange={(e) => onUserTypeChange(e as SelectedOption)}
                                    options={[{
                                        value: 'Influencer',
                                        label: 'Influencer'
                                    },
                                    {
                                        value: 'Brand',
                                        label: 'Brand'
                                    }]} />
                            </div>
                        </div>
                    }
                    <div className="text-right spacing-40">
                        <Link href={`/${ROUTES.public.forgotPassword}`} className="link letter-spacing-032">{LABELS.forgotPassword}?</Link>
                    </div>
                    <div className="form-group">
                        <ReCAPTCHA
                            sitekey={APPCONFIG.reCaptchaSiteKey}
                            onChange={onRecaptcha}
                            aria-label="Captcha"
                        />
                    </div>
                    <div className="spacing-40">
                        <button aria-label="login button" className="btn btn-primary login-btn">{LABELS.signIn}</button>
                    </div>
                    {
                        selectedUserType?.value === 'Influencer' &&
                        <p className="letter-spacing-032">{LABELS.doNotHaveAccount}? <Link href={`/${ROUTES.public.signUp}`} className="link">SignUp</Link></p>
                    }
                </form>
            </div>
        </div>
    )
}
