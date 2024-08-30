'use client'
import FormValidationError from '@/components/FormValidationError/FormValidationError';
import { ROUTES } from '@/config/staticUrl.config';
import { Message } from '@/constant/errorMessage';
import { Country, ICountryData, IGenderChange, ISignUpForm, SelectedOption, SignForm } from '@/types/pages';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import { REGISTER_USER } from '@/framework/graphql/mutations/user';
import { useDispatch } from 'react-redux';
import { setLoadingState } from '@/framework/redux/reducers/commonSlice';
import "@/styles/pages/auth.scss";
import Select from 'react-select';
import Link from 'next/link';
import APPCONFIG from '@/config/app.config';
import ReCAPTCHA from "react-google-recaptcha";
import { GET_COUNTRIES } from '@/framework/graphql/queries/country';
import { LABELS } from '@/constant/common';
import useValidation from '@/framework/hooks/validations';
import { RegisterUserResponse } from '@/types/graphql/pages';

export default function SignUp() {
    const defaultValues = {
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        countryCodeId: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        apply: false
    }
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<ISignUpForm>({
        defaultValues,
    });
    const watchAllFields = watch();
    const router = useRouter();
    const { data } = useQuery(GET_COUNTRIES, {
        variables: { sortBy: 'name', sortOrder: 'ASC' }
    });
    const [registerUser, { loading, error }] = useMutation(REGISTER_USER);
    const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);
    const dispatch = useDispatch();
    const [formState, setFormState] = useState({
        captchaVerified: false,
        currPassSecurity: true,
        oldPassSecurity: true
    });
    const [selectedGender, setSelectedGender] = useState<IGenderChange>();
    const [termsAndConditions, setTermsAndConditions] = useState<boolean>(false);
    const [countryCodeSelected, setCountryCodeSelected] = useState<boolean>(false);
    const [selectedCountry, setSelectedCountry] = useState<string>();
    const [countryData, setCountryData] = useState<ICountryData[]>();
    const {signUpFormValidations} = useValidation()

    const onSubmit: SubmitHandler<SignForm> = (values) => {
        if (!countryCodeSelected) {
            toast.error(Message.COUNTRY_CODE_REQUIRED)
            return
        }
        if (!captchaVerified) {
            toast.error(Message.CAPTCHA_REQUIRED)
            return
        }
        if (!termsAndConditions) {
            toast.error(Message.TERMS_AND_CONDITIONS_REQUIRED_TOAST)
            return
        }
        registerUser({
            variables: {...values, email:values.email.toLowerCase()},
        })
            .then((res) => {
                const data = res?.data as RegisterUserResponse;
                if (data?.registerUser?.meta?.statusCode === 200) {
                    toast.success(data?.registerUser?.meta.message);
                    router.push(`/${ROUTES.public.signIn}`);
                }
            })
            .catch(() => {
                return;
            });
    };

    useEffect(() => {
        dispatch(setLoadingState(loading))
        if (error?.message === "INFLUENCER_ALREADY_EXIST") {
            toast.error(Message.INFLUENCER_EXIST);
        }
        if (error?.message && error?.message !== "INFLUENCER_ALREADY_EXIST") {
            toast.error(error?.message)
        }
    }, [loading, error])

    const onGenderChange = useCallback((data: IGenderChange | null) => {
        if (data) {
            setValue("gender", data?.value!);
            setSelectedGender(data);
        }
    }, []);

    const onCountryChange = useCallback((selectedOption: SelectedOption) => {
        setValue("countryCodeId", selectedOption?.value!);
        setSelectedCountry(selectedOption?.value);
        setCountryCodeSelected(true);
    }, [selectedCountry]);

    const onRecaptcha = useCallback(() => {
        setCaptchaVerified(true);
    }, [])

    const onchangeTerms = (event: ChangeEvent<HTMLInputElement>) => {
        setTermsAndConditions(event.target.checked);
    }
    
    useEffect(() => {
        if (data && data?.fetchCountries) {
            setCountryData(data.fetchCountries.data.CountryData);
        }
    }, [data])

    return (
        <div>
            <div className="login-card register">
                <div className="card-title-wrapper">
                    <h1 className="card-title">{LABELS.signUp}</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className="form-group">
                        <label htmlFor="First Name">First Name*</label>
                        <input
                            {...register("firstName", signUpFormValidations.firstName)}
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="Enter First Name"
                            className="form-control" />
                        <FormValidationError errors={errors} name="firstName" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Last Name">Last Name*</label>
                        <input
                            {...register("lastName", signUpFormValidations.lastName)}
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Enter Last Name"
                            className="form-control" />
                        <FormValidationError errors={errors} name="lastName" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Email">Email Address*</label>
                        <input
                            {...register("email", signUpFormValidations.email)}
                            type="email"
                            name="email"
                            id="userEmail"
                            placeholder="Enter Email"
                            className="form-control" />
                        <FormValidationError errors={errors} name="email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Phone Number">Mobile Number*</label>
                        <div className='phone-wrapper form-control'>
                            <Select
                                {...register("countryCodeId")}
                                placeholder="Country Code"
                                className='countryCode'
                                id="countryCodeId"
                                name="countryCodeId"
                                aria-label="country code"
                                value={selectedCountry && { label: `+ ${selectedCountry}` }}
                                onChange={(e) => onCountryChange(e as SelectedOption)}
                                options={countryData?.map((country: Country) => ({
                                    value: country?.phone_code,
                                    label: `${country?.phone_code + "  "} ${"  " + country?.name}`
                                }))} />
                            <input
                                {...register("phoneNumber", signUpFormValidations.phoneNumber)}
                                type="text"
                                name="phoneNumber"
                                id="userMobile"
                                placeholder="Enter Mobile Number"
                                className="userMobile" />
                        </div>
                        <FormValidationError errors={errors} name="phoneNumber" />
                    </div>
                    <div className="form-group">
                        <label htmlFor='gender' >Gender*</label>
                        <Select
                            {...register("gender", signUpFormValidations.gender)}
                            placeholder="Select"
                            id="gender"
                            name="gender"
                            aria-label='gender'
                            className='react-select'
                            value={selectedGender}
                            onChange={onGenderChange}
                            options={[
                                { value: 'MALE', label: 'Male' },
                                { value: 'FEMALE', label: 'Female' },
                                { value: 'OTHER', label: 'Other' },
                            ]} />
                        {
                            !getValues('gender') &&
                            <FormValidationError errors={errors} name="gender" />
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="Password">Password*</label>
                        <div className="form-group-password">
                            <input
                                {...register("password", signUpFormValidations.password)}
                                type={formState.oldPassSecurity ? "password" : "text"}
                                name="password" id="userPassword" placeholder="Enter Your Password"
                                className="form-control" />
                            <FormValidationError errors={errors} name="password" />
                            <span className={formState.oldPassSecurity ? "icon-eye-off password-icon" : "icon-eye password-icon"} onClick={() => setFormState({ ...formState, oldPassSecurity: !formState.oldPassSecurity })}></span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="Password">Confirm Your Password*</label>
                        <div className="form-group-password">
                            <input
                                {...register("confirmPassword", signUpFormValidations.confirmPassword)}
                                type={formState.currPassSecurity ? "password" : "text"}
                                name="confirmPassword"
                                id="userConfirmPassword"
                                placeholder="Confirm Your Password"
                                className="form-control" />
                            <span className={formState.currPassSecurity ? "icon-eye-off password-icon" : "icon-eye password-icon"} onClick={() => setFormState({ ...formState, currPassSecurity: !formState.currPassSecurity })}></span>
                            {watchAllFields.password !==
                                watchAllFields.confirmPassword &&
                                watchAllFields.confirmPassword !== "" && (
                                    <small className="p-error">
                                        {Message.PASSWORD_MATCH}
                                    </small>
                                )}
                            <FormValidationError errors={errors} name="confirmPassword" />
                        </div>
                    </div>
                    <div className="form-group">
                        <ReCAPTCHA
                            sitekey={APPCONFIG.reCaptchaSiteKey}
                            onChange={onRecaptcha}
                        />
                    </div>
                    <div className="spacing-40 custom-checkbox">
                        <input
                            type="checkbox"
                            id="apply" name="apply"
                            checked={termsAndConditions}
                            onChange={onchangeTerms}

                        />
                        <span className="checkbox-tick icon-check"  ></span>
                        <label htmlFor="apply"> <Link href={`/${ROUTES.public.termsOfUse}`}>T & C Apply*</Link></label><br />
                        {!termsAndConditions && <FormValidationError errors={errors} name="apply" />}
                    </div>
                    <div className="spacing-40">
                        <button className="btn btn-primary">Create Account</button>
                    </div>
                    <p className="letter-spacing-032">Already have an Account? <Link href={`/${ROUTES.public.signIn}`} className="link">SignIn</Link></p>
                </form>
            </div>
        </div>
    );
}
