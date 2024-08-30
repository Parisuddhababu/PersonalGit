'use client'
import "@/styles/pages/contact-us.scss";
import { Message } from "@/constant/errorMessage";
import { SubmitHandler, useForm } from "react-hook-form";
import FormValidationError from "@/components/FormValidationError/FormValidationError";
import { Country, ICountryData, SelectedOption } from "@/types/pages";
import { useCallback, useEffect, useState } from "react";
import Select from 'react-select';
import { GET_COUNTRIES } from "@/framework/graphql/queries/country";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { ContactUsForm } from "@/types/components";
import { CREATE_CONTACT_US } from "@/framework/graphql/mutations/contactUs";
import { useDispatch } from "react-redux";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";
import { IMAGE_PATH } from "@/constant/imagePath";
import useValidation from "@/framework/hooks/validations";
import Image from "next/image";

const ContactUs = () => {
    const { data } = useQuery(GET_COUNTRIES);
    const [createContactUs] = useMutation(CREATE_CONTACT_US);
    const [selectedCountry, setSelectedCountry] = useState<string>();
    const [countryData, setCountryData] = useState<ICountryData[]>();
    const dispatch = useDispatch();
    const defaultValues = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        countryCodeId: '',
        email: '',
        message: ''
    }
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
        getValues
    } = useForm<ContactUsForm>({ defaultValues });
    const {contactUsValidations} = useValidation();

    //submit handler for add edit
    const onSubmit: SubmitHandler<ContactUsForm> = async (values: ContactUsForm) => {
        dispatch(setLoadingState(true))
        createContactUs({
            variables: {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email.toLowerCase(),
                phoneNumber: values.phoneNumber,
                countryCodeId: values.countryCodeId,
                message: values.message,
            },
        })
            .then((res) => {
                dispatch(setLoadingState(false))
                const data = res?.data;
                if (data?.createContactUs?.meta.statusCode === 200 || data.createContactUs?.meta.statusCode === 201) {
                    toast.success(data?.createContactUs?.meta.message);
                    reset();
                    setSelectedCountry('');
                }
            })
            .catch(() => {
                dispatch(setLoadingState(false))
                return;
            });

    };

    const onCountryChange = useCallback((selectedOption: SelectedOption) => {
        setValue("countryCodeId", selectedOption?.value);
        setSelectedCountry(selectedOption?.value);
    }, [selectedCountry]);

    useEffect(() => {
        if (data?.fetchCountries) {
            setCountryData(data.fetchCountries.data.CountryData);
        }
    }, [data])

    return (
        <div className="contact-us-wrapper">
            <div className="banner-row">
            <Image className="" src={IMAGE_PATH.contactBanner}  alt="Contact Banner" width={1920} height={677} style={{objectFit:"cover",width: "100%",height: "100%"}}/>
            </div>
            <div className="container-md ">
                <div className="contact-from-inner">
                    <div className="card-title-wrapper">
                        <h1 className="card-title">
                            Contact Us
                        </h1>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="contact-row row">
                            <div className="form-group">
                                <label htmlFor="contact-first-name">First Name*</label>
                                <input
                                    {...register("firstName", contactUsValidations.firstName)}
                                    type="text"
                                    name="firstName"
                                    id="contact-first-name"
                                    placeholder="Enter First Name"
                                    className="form-control" />
                                <FormValidationError errors={errors} name="firstName" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact-last-name">Last Name*</label>
                                <input
                                    {...register("lastName", contactUsValidations.lastName)}
                                    type="text"
                                    name="lastName"
                                    id="contact-last-name"
                                    placeholder="Enter Last Name"
                                    className="form-control" />
                                <FormValidationError errors={errors} name="lastName" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact-email">Email*</label>
                                <input
                                    {...register("email", contactUsValidations.email)}
                                    type="email"
                                    name="email"
                                    id="contact-email"
                                    placeholder="Enter Email"
                                    className="form-control" />
                                <FormValidationError errors={errors} name="email" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact-number">Mobile Number*</label>
                                <div className='phone-wrapper form-control'>
                                    <Select
                                        {...register("countryCodeId", contactUsValidations.countryCodeId)}
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
                                        {...register("phoneNumber", contactUsValidations.phoneNumber)}
                                        type="text"
                                        name="phoneNumber"
                                        id="contact-number"
                                        placeholder="Enter Mobile Number"
                                        className="userMobile" />
                                </div>                                
                                {!getValues('countryCodeId') && (
                                    <>
                                        {errors?.phoneNumber?.type === "required" && (
                                            <small className="p-error">{Message.MOBILE_AND_COURT_CODE}</small>
                                        )}
                                        {errors?.phoneNumber?.type === "pattern" && (
                                            <small className="p-error">{Message.COUNTRY_REQUIRED + ' and ' + Message.MOBILE_PATTERN}</small>
                                        )}
                                        {!errors?.phoneNumber && (
                                            <FormValidationError errors={errors} name="countryCodeId" />
                                        )}
                                    </>
                                )}
                                {getValues('countryCodeId') && (
                                    <FormValidationError errors={errors} name="phoneNumber" />
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact-message">Message*</label>
                            <textarea {...register("message", contactUsValidations.message)}
                                name="message" id="contact-message" className="form-control" placeholder='Enter Message'></textarea>
                            <FormValidationError errors={errors} name="message" />
                        </div>
                        <div className="">
                            <button className="btn btn-primary" type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ContactUs;