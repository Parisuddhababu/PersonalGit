import FormValidationError from "@components/FormValidationError";

import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  EMAIL_REGEX,
  NAME_MINLENGTH,
  ONLY_CHARACTERS,
  FIRSTNAME_MAXLENGTH,
  PHONENUMBER_REGEX,
  ONLY_NUMBER,
} from "@constant/regex";
import { Message } from "@constant/errorMessage";
import pagesServices from "@services/pages.services";
import CONFIG from "@config/api.config";
import { IContactList } from "@type/Pages/contactUsAddress";
import ErrorHandler from "@components/ErrorHandler";
import { useToast } from "@components/Toastr/Toastr";
import APICONFIG from "@config/api.config";
import Loader from "@components/customLoader/Loader";
import { getCurrentSelectedCountry, getTypeBasedCSSPath } from "@util/common";
import CountrySelect from "@components/countrySelect";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { ICareerApplication, ICareerApplicationProps } from "@type/Pages/careerApplication";
import APPCONFIG from "@config/app.config";



const CarrerApplication = ({ toggleModal, careerId }: ICareerApplicationProps) => {
  const [defaultValues] = useState<ICareerApplication>({
    first_name: "",
    email: "",
    contact: "",
    message: "",
    current_location: "",
    country: "",
    country_phone_code: "",
    experience: '',
    notice_period: 0,
    file: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const placeInputRef = useRef(null);

  const [isDisabled, setisDisabled] = useState(false);
  // const [countryId, setCountryId] = useState<string>('')
  const [countryData, setCountryData] = useState<IContactList[]>([]);
  const { showError, showSuccess }: any = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customImage, setCustomImage] = useState<Blob | string>('')
  const [imagePlaceHolder, setImagePlaceHolder] = useState<string>()
  // const [place, setPlace] = useState<object>({});

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

  const loadGoogleMapScript = (callback: any) => {
    // @ts-ignore
    if (typeof window["google" as any] === 'object' && typeof window["google" as any]?.maps === 'object') {
      callback();
    } else {
      const googleMapScript = document.createElement("script");
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${APPCONFIG.gmapKey}&libraries=places`;
      window.document.body.appendChild(googleMapScript);
      googleMapScript.addEventListener("load", callback);

    }
  }

  useEffect(() => {
    loadGoogleMapScript(() => {
      initPlaceAPI();
    });
    // eslint-disable-next-line
  }, []);

  // initialize the google place autocomplete
  const initPlaceAPI = () => {
    // @ts-ignore
    let autocomplete = new window["google" as any].maps.places.Autocomplete(placeInputRef.current);
    // @ts-ignore
    new window["google" as any].maps.event.addListener(autocomplete, "place_changed", function () {
      let place = autocomplete.getPlace();
      setValue("current_location", place.formatted_address);
    });
  };


  const setCountryId = (data: any) => {
    setValue("country_phone_code", data?.countryCode);
    setValue("contact", data?.phone);
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


  const removeSelectImage = () => {
    setCustomImage('')
    setImagePlaceHolder('');
    if (fileInputRef && fileInputRef?.current?.value) {
      fileInputRef.current.value = "";
    }
  }

  const uploadImage = async (event: any) => {
    let files: FileList = event.target.files;
    const allowedTypes = ["pdf", "application/pdf", 'doc', 'docx'];
    const file: File = files[0]; // file
    setImagePlaceHolder(URL.createObjectURL(file));


    // return if file upload has cancel from file explore
    if (!file) return;

    if (allowedTypes.includes(file.type) === false) {
      // file is not valid then return function
      showError("Allow only pdf and doc");
      return;
    }

    if (file.size / 1000 / 1024 > APPCONFIG.maxFileSize) {
      showError("Maximum " + APPCONFIG.maxFileSize + "MB allowed to upload.");
      // clear image cache
      if (fileInputRef && fileInputRef?.current?.value) {
        fileInputRef.current.value = "";
      }
      return;
    }
    setCustomImage(file)
  };

  const submitApplication = async (data: ICareerApplication) => {
    if (data) {
      let obj = {
        "name": data.first_name,
        "email": data.email,
        "mobile_no": data.contact,
        "current_location": data.current_location,
        "experience": data.experience,
        "notice_period": data.notice_period,
        "about": data.message,
        "is_active": 1,
        career_id: careerId,
        country: data.country_phone_code
      }
      const formData = new FormData();
      formData.append('data', JSON.stringify(obj));
      formData.append("resume", customImage);

      setIsLoading(true);
      pagesServices
        .postPage(APICONFIG.CAREER_APPLICATION, formData)
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
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.customiseFileUpload)} />

      </Head>
      {isLoading && <Loader />}
      <div className="modal-content">
        <form noValidate onSubmit={handleSubmit(submitApplication)}>
          <div className="d-row">
            <div className="d-col d-col-2">
              <div className="form-group">
                <Controller
                  name="first_name"
                  control={control}
                  rules={{
                    required: Message.FULLNAME_REQUIRED,
                    pattern: {
                      value: ONLY_CHARACTERS,
                      message: Message.ALLOW_ONLY_CHARACTERS,
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <label>
                        Full Name<span className="asterisk">*</span>
                      </label>
                      <div className="display-count">
                        <input
                          placeholder="Enter full name"
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
                          <label>Mobile No*</label>
                          <CountrySelect
                            setCountryContact={(d) => setCountryId(d)}
                            placeholder=""
                            page="careerApplication"
                            inputId={field.name}
                            country={countryData.filter(a => a._id === getCurrentSelectedCountry())[0]}
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
                  name="notice_period"
                  control={control}
                  rules={{
                    pattern: {
                      value: ONLY_NUMBER,
                      message: Message.ALLOW_ONLY_NUMBER,
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <label>
                        Notice Period
                      </label>
                      <div className="display-count">
                        <input
                          placeholder="Enter Notice period"
                          className="form-control"
                          id={field.name}
                          {...field}
                          autoFocus

                        />
                        {/* <span className="character-count">
                                                                {getValues("first_name").length}/{FIRSTNAME_MAXLENGTH}
                                                            </span> */}
                      </div>
                    </>
                  )}
                />
                <FormValidationError errors={errors} name="notice_period" />
              </div>
            </div>

            <div className="d-col d-col-2">
              <div className="form-group">
                <Controller
                  name="experience"
                  control={control}

                  render={({ field }) => (
                    <>
                      <label>
                        Experience
                      </label>
                      <div className="display-count">
                        <input
                          placeholder="Enter Notice period"
                          className="form-control"
                          id={field.name}
                          {...field}
                          autoFocus

                        />
                        {/* <span className="character-count">
                                                                {getValues("first_name").length}/{FIRSTNAME_MAXLENGTH}
                                                            </span> */}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>

            <div className="d-col d-col-2">
              <div className="form-group">
                <Controller
                  name="current_location"
                  control={control}
                  rules={{
                    required: Message.CURRENT_LOCATION,
                  }}
                  render={({ field }) => (
                    <>
                      <label>
                        Current Location<span className="asterisk">*</span>
                      </label>
                      <div className="display-count">
                        <input
                          placeholder="Enter Current Location"
                          className="form-control"
                          id={field.name}
                          {...field}
                          autoFocus
                          ref={placeInputRef}
                        />

                      </div>
                    </>
                  )}
                />
                <FormValidationError errors={errors} name="current_location" />
              </div>
            </div>

            <div className="d-col d-col-2">
              <div className="form-group">
                <Controller
                  name="file"
                  control={control}

                  render={({ }) => (
                    <>
                      <label>
                        Upload Resume
                      </label>
                      <div className="file-upload">
                        {/* <input type="file" name="Upload-file" id="uploadFile" required /> */}
                        {(customImage && imagePlaceHolder) ?
                          <>
                            <img
                              src={imagePlaceHolder}
                              alt=""
                            />
                            <i className="jkm-close" onClick={() => removeSelectImage()}></i>
                          </>
                          :
                          <>
                            <input
                              type="file"
                              ref={fileInputRef}
                              title=" "
                              name="image"
                              onChange={uploadImage}
                              // onChange={(event: React.ChangeEvent<HTMLFormElement>): Promise<void> => uploadImage(event)}
                              accept={APPCONFIG.acceptedOnlyPdf}
                            />
                            <i className="jkm-file-upload file-upload-icon"></i>
                          </>
                        }
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="d-col">
              <div className="form-group">
                <Controller
                  name="message"
                  control={control}

                  render={({ field }) => (
                    <>
                      <label>
                        About
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
              </div>
            </div>
            <div className="d-col btn-wrapper">
              <button
                type="submit"
                disabled={isDisabled}
                className=" btn btn-primary"
              >
                Apply Application
              </button>
              <button
                type="submit"
                disabled={isDisabled}
                className=" btn btn-primary"
                onClick={toggleModal}
              >
                Cancle Application
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CarrerApplication;
