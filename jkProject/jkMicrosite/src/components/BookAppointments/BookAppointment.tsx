import FormValidationError from "@components/FormValidationError";
import {
  IBookAppointment,
  IBookAppointmentProps,
} from "@type/Pages/bookApointment";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  EMAIL_REGEX,
  NAME_MINLENGTH,
  ONLY_CHARACTERS,
  SPECIAL_CHARCATER,
  FIRSTNAME_MAXLENGTH,
  LASTNAME_MAXLENGTH,
  PHONENUMBER_REGEX,
  TRIMMED_STRING,
} from "@constant/regex";
import { Message } from "@constant/errorMessage";
import pagesServices from "@services/pages.services";
import CONFIG from "@config/api.config";
import { IContactList } from "@type/Pages/contactUsAddress";
import ErrorHandler from "@components/ErrorHandler";
import { useToast } from "@components/Toastr/Toastr";
import APICONFIG from "@config/api.config";
import Loader from "@components/customLoader/Loader";
import {
  converDateDDMMYYYY,
  getCurrentSelectedCountry,
  getTypeBasedCSSPath,
} from "@util/common";
import CountrySelect from "@components/countrySelect";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import APPCONFIG from "@config/app.config";

const BookAppointment = ({ toggleModal }: IBookAppointmentProps) => {
  const [defaultValues] = useState<IBookAppointment>({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    date: null,
    time: null,
    message: "",
    city: "",
    country: "",
    country_phone_code: "",
  });
  const placeInputRef = useRef(null);

  const [isDisabled, setisDisabled] = useState(false);
  // const [countryId, setCountryId] = useState<string>('')
  const [countryData, setCountryData] = useState<IContactList[]>([]);
  const { showError, showSuccess }: any = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({ defaultValues });

  useEffect(() => {
    getCountry();
    // eslint-disable-next-line
  }, []);

  const setCountryId = (data: any) => {
    setValue("country_phone_code", data?.countryCode);
    setValue("contact", data?.phone);
  };

  const loadGoogleMapScript = (callback: any) => {
    // @ts-ignore
    if (
      typeof window["google" as any] === "object" &&
      // @ts-ignore
      typeof window["google" as any]?.maps === "object"
    ) {
      callback();
    } else {
      const googleMapScript = document.createElement("script");
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${APPCONFIG.gmapKey}&libraries=places`;
      window.document.body.appendChild(googleMapScript);
      googleMapScript.addEventListener("load", callback);
    }
  };

  useEffect(() => {
    loadGoogleMapScript(() => {
      setTimeout(() => {
        initPlaceAPI();
      }, 3000);
    });
    // eslint-disable-next-line
  }, []);

  // initialize the google place autocomplete
  const initPlaceAPI = () => {
    try {
      // @ts-ignore
      let autocomplete = new window["google" as any].maps.places.Autocomplete(
        placeInputRef.current
      );
      // @ts-ignore
      new window["google" as any].maps.event.addListener(
        autocomplete,
        "place_changed",
        function () {
          let place = autocomplete.getPlace();
          setValue("city", place.formatted_address);
        }
      );
    } catch (error) {
    }
  };

  const getCountry = async () => {
    setIsLoading(true);
    await pagesServices
      .postPage(CONFIG.GET_COUNTRY, {})
      .then((result) => {
        setCountryData(result?.data?.country_list);
        setCountryId(result?.data?.country_list?.[0]?._id);
        setIsLoading(false);
      })
      .catch((error) => {
        setisDisabled(false);
        setIsLoading(false);
        ErrorHandler(error, showError);
      });
  };

  const submitBook = async (data: IBookAppointment) => {
    if (data) {
      let obj = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        contact: data.contact,
        date: converDateDDMMYYYY(new Date(data.date)),
        time: data.time,
        message: data.message,
        city: data.city,
        country: data?.contact,
        country_phone_code: data?.country_phone_code,
      };
      setIsLoading(true);
      pagesServices
        .postPage(APICONFIG.BookDamo, obj)
        .then((result) => {
          setIsLoading(false);
          if (result?.meta && result?.meta?.status_code === 201) {
            showSuccess(result?.meta?.message);
            reset();
            setisDisabled(false);
            toggleModal();
          } else {
            setisDisabled(false);
            ErrorHandler(result, showError);
          }
        })
        .catch((err) => err);
    }
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.bookAppointmentPopup)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.testimonailModel)}
        />
      </Head>
      {isLoading && <Loader />}
      <div className="modal-content">
        <form noValidate onSubmit={handleSubmit(submitBook)}>
          <div className="d-row">
            <div className="d-col d-col-2">
              <div className="form-group">
                <Controller
                  name="first_name"
                  control={control}
                  rules={{
                    required: Message.FIRSTNAME_REQUIRED,
                    pattern: {
                      value: ONLY_CHARACTERS,
                      message: Message.ALLOW_ONLY_CHARACTERS,
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <label>
                        First Name<span className="asterisk">*</span>
                      </label>
                      <div className="display-count">
                        <input
                          placeholder="Enter first name"
                          className="form-control"
                          id={field.name}
                          {...field}
                          autoFocus
                          minLength={NAME_MINLENGTH}
                          maxLength={FIRSTNAME_MAXLENGTH}
                        />
                        {/* <span className="character-count">
                                                                {getValues("first_name").length}/{FIRSTNAME_MAXLENGTH}
                                                            </span> */}
                      </div>
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
                    pattern: {
                      value: ONLY_CHARACTERS,
                      message: Message.ALLOW_ONLY_CHARACTERS,
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <label>
                        Last Name<span className="asterisk">*</span>
                      </label>
                      <div className="display-count">
                        <input
                          placeholder="Enter last name"
                          id={field.name}
                          {...field}
                          minLength={NAME_MINLENGTH}
                          maxLength={LASTNAME_MAXLENGTH}
                          className="form-control"
                        />
                        {/* <span className="character-count">
                                                                {getValues("last_name").length}/{LASTNAME_MAXLENGTH}
                                                            </span> */}
                      </div>
                    </>
                  )}
                />
                <FormValidationError errors={errors} name="last_name" />
              </div>
            </div>
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
                      <label>
                        Email<span className="asterisk">*</span>
                      </label>
                      <input
                        placeholder="Enter your email"
                        className="form-control"
                        id={field.name}
                        {...field}
                      />
                    </>
                  )}
                />
                <FormValidationError errors={errors} name="email" />
              </div>
            </div>
            {countryData?.length ? (
              <div className="d-col d-col-2">
                <div className="form-group">
                  <Controller
                    name="contact"
                    control={control}
                    rules={{
                      required: Message.MOBILENUMBER_REQUIRED,
                      pattern: {
                        value: PHONENUMBER_REGEX,
                        message: Message.MOBILE_PATTERN,
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <>
                          <label>Contact*</label>
                          <CountrySelect
                            setCountryContact={(d) => setCountryId(d)}
                            placeholder=""
                            page="bookAppointment"
                            inputId={field.name}
                            country={
                              countryData.filter(
                                (a) => a._id === getCurrentSelectedCountry()
                              )[0]
                            }
                            id="BookAnAppointment"
                          />
                        </>
                      </>
                    )}
                  />
                  <FormValidationError errors={errors} name="contact" />
                </div>
              </div>
            ) : (
              <> </>
            )}
            <div className="d-col d-col-2">
              <div className="form-group">
                <Controller
                  name="city"
                  control={control}
                  rules={{
                    required: Message.CITY_REQUIRED,
                    pattern: {
                      value: TRIMMED_STRING,
                      message: Message.WHITE_SPACE,
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <label>
                        City<span className="asterisk">*</span></label>
                      <input
                        placeholder="Enter your city"
                        className="form-control"
                        id={field.name}
                        {...field}
                        ref={placeInputRef}
                      />
                    </>
                  )}
                />
                <FormValidationError errors={errors} name="city" />
              </div>
            </div>
            <div className="d-col d-col-2">
              <div className="form-group">
                <Controller
                  name="date"
                  control={control}
                  rules={{
                    required: Message.DATE_REQUIRED,
                  }}
                  render={({ field }) => (
                    <>
                      <label>
                        Date<span className="asterisk">*</span>
                      </label>
                      <input
                        placeholder="DD/MM/YYYY"
                        type="date"
                        className="form-control"
                        id={field.name}
                        {...field}
                      />
                    </>
                  )}
                />
                <FormValidationError errors={errors} name="date" />
              </div>
            </div>
            <div className="d-col d-col-2">
              <div className="form-group">
                <Controller
                  name="time"
                  control={control}
                  rules={{
                    required: Message.TIME_REQUIRED,
                    // pattern: { value: PHONENUMBER_REGEX, message: Message.TOMORROW_DATE },
                  }}
                  render={({ field }) => (
                    <>
                      <label>
                        Time<span className="asterisk">*</span>
                      </label>
                      <input
                        placeholder="00:00"
                        type="time"
                        id={field.name}
                        className="form-control"
                        {...field}
                      />
                    </>
                  )}
                />
                <FormValidationError errors={errors} name="time" />
              </div>
            </div>
            <div className="d-col">
              <div className="form-group">
                <Controller
                  name="message"
                  control={control}
                  rules={{
                    required: Message.MESSAGE_REQUIRED,
                    pattern: {
                      value: SPECIAL_CHARCATER,
                      message: Message.SPECIAL_CHARACTERS_NOW_ALLOW,
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <label>
                        Message<span className="asterisk">*</span>
                      </label>
                      <textarea
                        placeholder="Type your message...."
                        rows={8}
                        className="form-control"
                        id={field.name}
                        {...field}
                      />
                    </>
                  )}
                />
                <FormValidationError errors={errors} name="message" />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isDisabled}
            className=" btn btn-primary"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default BookAppointment;
