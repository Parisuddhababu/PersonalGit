import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { Message } from "@constant/errorMessage";
import { IContactAddress, IContactList } from "@type/Pages/contactUsAddress";
import { getCurrentSelectedCountry, getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import FormValidationError from "@components/FormValidationError";
import { EMAIL_REGEX, PHONENUMBER_REGEX } from "@constant/regex";
import CONFIG from "@config/api.config";
import { useToast } from "@components/Toastr/Toastr";
import ErrorHandler from "@components/ErrorHandler";
import useContactUsHook from "@components/Hooks/ContactUs";
import APPCONFIG from "@config/app.config";
import pagesServices from "@services/pages.services";
import Loader from "@components/customLoader/Loader";
import CountrySelect from "@components/countrySelect";

const ContactUsAddressList1 = () => {
  const [defaultValues] = useState<IContactAddress>({
    first_name: "",
    last_name: "",
    mobile_number: "",
    email: "",
    message: "",
    country_id: "",
  });
  const [isDisabled, setisDisabled] = useState<boolean>(false);
  const { showError, showSuccess }: any = useToast();
  const [countryData, setCountryData] = useState<IContactList[]>([]);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({ defaultValues });
  const { createContactUsFunc, contactUsData } = useContactUsHook();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // eslint
  useEffect(() => {
    if (contactUsData) {
      setIsLoading(false);
      showMessages(contactUsData);
    }
    // eslint-disable-next-line
  }, [contactUsData]);

  useEffect(() => {
    setTimeout(() => {
      getCountry();
    }, 2000);
    // eslint-disable-next-line
  }, []);

  const setCountryId = (data: any) => {
    setValue("country_id", data?.countryCode);
    setValue("mobile_number", data?.phone);
  };

  const getCountry = async () => {
    setIsLoading(true);
    await pagesServices
      .postPage(CONFIG.GET_COUNTRY, {})
      .then((result) => {
        setCountryData(result?.data?.country_list);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(true);
        setisDisabled(false);
        ErrorHandler(error, showError);
      });
  };

  const showMessages = (data: any) => {
    if (data?.meta && data?.meta?.status_code === 201) {
      showSuccess(data?.meta?.message);
      reset();
      setisDisabled(false);
    } else {
      setisDisabled(false);
      ErrorHandler(data, showError);
    }
  };

  const submitAddress = (data: IContactAddress) => {
    setisDisabled(true);
    let obj = {
      first_name: data?.first_name,
      last_name: data?.last_name,
      phone: data?.mobile_number,
      email: data?.email,
      description: data?.message,
      country: data?.country_id,
    };
    setIsLoading(true);
    createContactUsFunc(CONFIG.CONTACTUS_CREATE, obj);
  };

  return (
    <>
      {isLoading && <Loader />}
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.contactForm)}
        />
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.toasterDesign +
            ".css"
          }
        />
      </Head>
      <section className="contact-form">
        <div className="container">
          <div className="form-wrap jk-card">
            <h3 className="title">{"Let's Get in Touch"}</h3>
            <form onSubmit={handleSubmit(submitAddress)}>
              <div className="d-row">
                <div className="d-col d-col-2">
                  <div className="form-group">
                    <Controller
                      name="first_name"
                      control={control}
                      rules={{
                        required: Message.FIRSTNAME_REQUIRED,
                      }}
                      render={({ field }) => (
                        <>
                          <label>First Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="First Name"
                            id={field.name}
                            {...field}
                          />
                        </>
                      )}
                    />
                    <FormValidationError errors={errors} name="first_name" />
                  </div>
                </div>
                <div className="d-col d-col-2">
                  <div className="form-group">
                    <Controller
                      name="last_name"
                      control={control}
                      rules={{
                        required: Message.LASTNAME_REQUIRED,
                      }}
                      render={({ field }) => (
                        <>
                          <label>Last Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Last Name"
                            id={field.name}
                            {...field}
                          />
                        </>
                      )}
                    />
                    <FormValidationError errors={errors} name="last_name" />
                  </div>
                </div>
                {countryData.length ? (
                  <div className="d-col d-col-2">
                    <div className="form-group">
                      <Controller
                        name="mobile_number"
                        control={control}
                        rules={{
                          required: Message.NUMBER_REQUIRED,
                          pattern: {
                            value: PHONENUMBER_REGEX,
                            message: Message.NUMBER_PATTERN,
                          },
                        }}
                        render={({ field }) => (
                          <>
                            <label>Mobile Number*</label>
                            <CountrySelect
                              setCountryContact={(d) => setCountryId(d)}
                              placeholder=""
                              page="contactUs"
                              inputId={field.name}
                              country={countryData.filter(a => a._id === getCurrentSelectedCountry())[0]}
                            />
                          </>
                        )}
                      />
                      <FormValidationError
                        errors={errors}
                        name="mobile_number"
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="d-col d-col-2">
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
                            placeholder="Email@gmail.com"
                            id={field.name}
                            {...field}
                          />
                        </>
                      )}
                    />
                    <FormValidationError errors={errors} name="email" />
                  </div>
                </div>

                <div className="d-col">
                  <div className="form-group">
                    <Controller
                      name="message"
                      control={control}
                      render={({ field }) => (
                        <>
                          <label>Message</label>
                          <textarea
                            className="form-control"
                            placeholder="Write your message here"
                            id={field.name}
                            {...field}
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="d-col d-col-12 button-section">
                <button
                  type="submit"
                  disabled={isDisabled}
                  className="btn-submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUsAddressList1;
