import { Message } from "@constant/errorMessage";
import { IContactAddress } from "@type/Pages/contactUsAddress";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormValidationError from "@components/FormValidationError";
import { EMAIL_REGEX, NAME_STRING } from "@constant/regex";
import ErrorHandler from "@components/ErrorHandler";
import useContactUsHook from "@components/Hooks/ContactUs";
import Loader from "@components/customLoader/Loader";
import APICONFIG from "@config/api.config";
import ReCAPTCHA from "react-google-recaptcha";
import APPCONFIG from "@config/app.config";
import Link from "next/link";
import { toast } from "react-toastify";
import pagesServices from "@services/pages.services";
import Select from 'react-select';
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { ICountryStateChange, ICountryStateCityType } from "@templates/SignUp/components/SIgnUpForm";
import { IAPIError, IReduxStore } from "@type/Common/Base";

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderRadius: '30px',
    fontFamily: 'Calibri',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '18px',
    border: '1px solid var(--data_site_gray_color)',
    width: '100%',
    padding: '5px 5px',
    outline: 0,
    color: 'var(--data_site_gray_color)',
  }),
};

const ContactUsAddressList1 = () => {
  const [defaultValues] = useState<IContactAddress>({
    first_name: "",
    email: "",
    description: "",
    country: "",
  });
  const [selectedCountry, setSelectedCountry] = useState<ICountryStateChange>();
  const [captchVerified, setCaptchaVerified] = useState<boolean>(false);
  const [countryData, setCountryData] = useState<ICountryStateChange[]>([]);
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm({ defaultValues });
  const { createContactUsFunc, contactUsData } = useContactUsHook();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter()
  const data = useSelector((state:IReduxStore) => state);
  // eslint
  useEffect(() => {
    if (contactUsData) {
      setIsLoading(false);
      showMessages(contactUsData);
    }
  }, [contactUsData]);


  const onCountryChange = useCallback((data: ICountryStateChange | null) => {
    if (data) {
      setValue("country", data?.value);
      setSelectedCountry(data);
    }
  }, []);

  const showMessages = (data: IAPIError) => {
    if (data?.meta?.status_code === 201) {
      toast.success(data.meta?.message)
      reset();
      router.push('/')
    } else {
      ErrorHandler(data, toast.error);
    }
  };

  const submitAddress = (data: IContactAddress) => {
    if (!captchVerified) {
      toast.error('Please verify captcha!')
      return
    }
    setIsLoading(true);

    let obj = {
      first_name: data?.first_name,
      email: data?.email,
      description: data?.description,
      country: data?.country,
    };
    createContactUsFunc(APICONFIG.CONTACTUS_CREATE, obj);
  };

  const Validations = {
    first_name: {
      required: Message.NAME_REQUIRED,
      pattern: {
        value: NAME_STRING,
        message: Message.INVALID_NAME,
      },
    },
    country: {
      required: Message.COUNTRY_REQUIRED,
    },
    email: {
      required: Message.EMAIL_REQUIRED,
      pattern: {
        value: EMAIL_REGEX,
        message: Message.EMAIL_PATTERN,
      },
    },
    description: {
      required: Message.INQUIRY_REQUIRED,
    },
  };

  const onRecaptcha = useCallback(() => {
    setCaptchaVerified(true);
  }, [captchVerified])

  const getCountry = async () => {
    await pagesServices
      .postPage(APICONFIG.GET_COUNTRY, { for_phonecode: 1 })
      .then((result) => {
        if (result?.data?.country_list?.length) {
          setCountryData(result?.data?.country_list?.map((country: ICountryStateCityType) => ({
            value: country._id,
            label: country.name
          })));
        }
      })
  };

  useEffect(() => {
    getCountry();
  }, [])

  return (
    <>
      <Head><title>Contact Us</title></Head>
      {isLoading && <Loader />}
      <section className="contactus-section">
        <div className="container">
          <div className="categories-section">
            <span>TOPICS</span>
            <ul className="categories-wrap">
              <li><Link href="/about"><a>About Us</a></Link></li>
              <li><Link href="/contact-us"><a>Contact us</a></Link></li>
            </ul>
          </div>
          <div className="contactus-description-wrap">
            <h2>Contact Us</h2>
            <p>We are currently experiencing large call volumes, please feel free to place your order online or
              contact our customer service department directly by email at <a
                href={`mailto:${data?.whatsAppReducer?.email}`}>{data?.whatsAppReducer?.email}</a>. Please include your company name and
              office phone number or Consumer First name, Last Name & Phone Number.
              Thank you for your support.
            </p>
            <form onSubmit={handleSubmit(submitAddress)} className="contactus-form">
              <h2>Contact Form</h2>
              <div className="row">
                <div className="d-col d-col-3 form-group">
                  <input
                    {...register("first_name", Validations.first_name)}
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="Your Name"
                    className="form-control" />
                  <FormValidationError errors={errors} name="first_name" />
                </div>
                <div className="d-col d-col-3 form-group">
                  <input
                    {...register("email", Validations.email)}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your Email Address"
                    className="form-control" />
                  <FormValidationError errors={errors} name="email" />
                </div>
                <div className="d-col d-col-3 form-group">
                  <Select
                    {...register("country", Validations.country)}
                    placeholder="Enter Country Name"
                    id="country"
                    name="country"
                    value={selectedCountry}
                    styles={customStyles}
                    onChange={onCountryChange}
                    options={countryData} />
                  {
                    !getValues('country') &&
                    <FormValidationError errors={errors} name="country" />
                  }
                </div>
                <div className="d-col form-group">
                  <input
                    {...register("description", Validations.description)}
                    type="description"
                    name="description"
                    id="description"
                    className="form-control"
                    placeholder="Enter Your Inquiry"
                  />
                  <FormValidationError errors={errors} name="description" />
                </div>
                <div className="d-col form-group">
                  <div className="recaptcha-box">
                    <ReCAPTCHA
                      sitekey={APPCONFIG.reCaptchaSiteKey}
                      onChange={onRecaptcha}
                    />
                  </div>
                </div>
                <div className="d-col submit-btn">
                  <button type="submit" className="btn btn-primary-with-icon" aria-label="submit-btn">SUBMIT</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUsAddressList1;
