import React, { useEffect, useState, useRef } from "react";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { emailLowerCase, getCurrentSelectedCountry, getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Modal from "@components/Modal";
import { IOfferForm, IOfferProps } from "@templates/OfferPopup";
import CustomImage from "@components/CustomImage/CustomImage";
import { IMAGE_PATH } from "@constant/imagepath";
import { useForm, Controller } from "react-hook-form";
import { Message } from "@constant/errorMessage";
import { EMAIL_REGEX, NAME_MAXLENGTH, PHONENUMBER_REGEX, SPECIAL_CHARCATER } from "@constant/regex";
import FormValidationError from "@components/FormValidationError";
// import useOfferPopup from "@components/Hooks/OfferPopup/offerPopup";
import { IGenderPropsData } from "@type/Common/Base";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import { useToast } from "@components/Toastr/Toastr";
import { IOtherValueType } from "@type/Pages/customiseDesign";
import APPCONFIG from "@config/app.config";
import CountrySelect from "@components/countrySelect";
import Loader from "@components/customLoader/Loader";
import ErrorHandler from "@components/ErrorHandler";
import { IContactList } from "@type/Pages/contactUsAddress";
import CONFIG from "@config/api.config";

const OfferPopup = ({ isModal, onClose, InputSelection }: IOfferProps) => {
  // const { submitOfferPopup } = useOfferPopup();
  const [genderOption, setGenderOption] = useState<IGenderPropsData[]>();
  const [otherValue, setOtherValue] = useState<IOtherValueType>({
    upload_logo: null,
  });
  const [imagePlaceHolder, setImagePlaceHolder] = useState<string>();
  const { showError, showSuccess } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [countryData, setCountryData] = useState<IContactList[]>([]);

  useEffect(() => {
    getGenderData();
    getCountry();
    // eslint-disable-next-line
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<IOfferForm>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      city: "",
      message: "",
      gender: "",
      country: "",
    },
  });
  const toggleModal = () => {
    onClose();
  };

  const setCountryId = (data: any) => {
    if (data?.[0]?._id || data?.countryId) {
      setValue("country", data?.[0]?._id ?? data?.countryId);
    }
    setValue("phone", data?.phone);
  };

  const getCountry = async () => {
    setLoader(true);
    await pagesServices
      .postPage(CONFIG.GET_COUNTRY, {})
      .then((result) => {
        setCountryData(result?.data?.country_list);
        //@ts-ignore
        setCountryId(result?.data?.country_list.filter((a) => a._id === getCurrentSelectedCountry()));
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        ErrorHandler(error, showError);
      });
  };

  const getGenderData = async () => {
    await pagesServices.getPage(APICONFIG.GENDER, {}).then((result) => {
      if (result.meta && result.status_code == 200) {
        setGenderOption(result?.data?.gender_list ? result?.data?.gender_list : ["Male", "Female", "Other"]);
      }
    });
  };

  const submitForm = async (data: IOfferForm) => {
    setLoader(true);
    let obj = {
      "name": data.name,
      "phone": data.phone,
      "email": emailLowerCase(data.email),
      "city": data.city,
      "message": data.message,
      "gender": data.gender,
      "country": data.country,
    }
    let formData = new FormData();
    formData.append('data', JSON.stringify(obj))
    otherValue?.upload_logo && formData.append('file', otherValue.upload_logo);
    await pagesServices.postPage(CONFIG.POPUP_API, formData).then(
      (result) => {
        setLoader(false);
        if (result.meta && result.meta.status_code == 201) {
          showSuccess(result.meta.message)
          toggleModal();
        } else {
          ErrorHandler(result, showError)
        }
      },
      (error) => {
        setLoader(false);
        ErrorHandler(error, showError);
      }
    );

  };

  const uploadImage = async (event: any) => {
    let files: FileList = event.target.files;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const file: File = files[0]; // file
    setImagePlaceHolder(URL.createObjectURL(file));

    // return if file upload has cancel from file explore
    if (!file) return;

    if (allowedTypes.includes(file.type) === false) {
      // file is not valid then return function
      showError("Allow only png, jpg and jpeg");
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
    setOtherValue({ ...otherValue, ["upload_logo"]: file });
  };

  const removeSelectImage = () => {
    setOtherValue({ ...otherValue, ["upload_logo"]: null });
    setImagePlaceHolder("");
    if (fileInputRef && fileInputRef?.current?.value) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.customiseFileUpload)} />
        <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_COMPONENT + "offer-popup.min.css"} />
      </Head>
      {loader && <Loader />}
      <Modal className="offer-modal" headerName="Offer Popup" open={isModal} onClose={toggleModal} dimmer={false}>
        <div className="modal-content">
          <div className="d-row">
            <div className="d-col d-col-66">
              <CustomImage
                src={InputSelection?.image ? InputSelection?.image?.path : IMAGE_PATH.offerImageJpg}
                alt="offer Image"
                title="Offer Image"
                width="525"
                height="525"
                pictureClassName="pop-up-offer-image"
              />
            </div>
            <div className="d-col d-col-33">
              <form noValidate={true} onSubmit={handleSubmit(submitForm)}>
                {InputSelection?.form_field.indexOf("NAME") > -1 && (
                  <div className="form-group">
                    <Controller
                      name="name"
                      control={control}
                      rules={{
                        required: Message.NAME_REQUIRED,
                        pattern: {
                          value: SPECIAL_CHARCATER,
                          message: Message.SPECIAL_CHARACTERS_NOW_ALLOW,
                        },
                      }}
                      render={({ field }) => (
                        <>
                          <input
                            placeholder="Name*"
                            className="form-control"
                            maxLength={NAME_MAXLENGTH}
                            id={field.name}
                            {...field}
                            autoFocus
                          />
                        </>
                      )}
                    />
                    <FormValidationError errors={errors} name="name" />
                  </div>
                )}
                {InputSelection?.form_field.indexOf("PHONE") > -1 && countryData.length && (
                  <div className="form-group">
                    <Controller
                      name="phone"
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
                          <CountrySelect
                            setCountryContact={(d) => setCountryId(d)}
                            placeholder=""
                            page="offerPopup"
                            inputId={field?.name}
                            country={countryData.filter(a => a._id === getCurrentSelectedCountry())[0]}
                          />{" "}
                        </>
                      )}
                    />

                    <FormValidationError errors={errors} name="phone" />
                  </div>
                )}
                {InputSelection?.form_field.indexOf("CITY") > -1 && (
                  <div className="form-group">
                    <Controller
                      name="city"
                      control={control}
                      rules={{
                        required: Message.CITY_REQUIRED,
                        pattern: {
                          value: SPECIAL_CHARCATER,
                          message: Message.SPECIAL_CHARACTERS_NOW_ALLOW,
                        },
                      }}
                      render={({ field }) => (
                        <>
                          <input placeholder="City*" className="form-control" id={field.name} {...field} />
                        </>
                      )}
                    />
                    <FormValidationError errors={errors} name="city" />
                  </div>
                )}
                {InputSelection?.form_field.indexOf("GENDER") > -1 && (
                  <div className="form-group">
                    <Controller
                      name="gender"
                      control={control}
                      rules={{
                        required: Message.GENDER_REQUIRED,
                      }}
                      render={({ field }) => (
                        <>
                          <select className="custom-select form-control" {...field} id={field.name}>
                            <option selected>Select Gender</option>
                            {genderOption?.map((ele, eInd) => (
                              <option key={eInd} value={ele?._id}>
                                {ele?.name}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    />
                    <FormValidationError errors={errors} name="gender" />
                  </div>
                )}
                {InputSelection?.form_field.indexOf("EMAIL") > -1 && (
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
                          <input placeholder="Email Address*" className="form-control" id={field.name} {...field} />
                        </>
                      )}
                    />
                    <FormValidationError errors={errors} name="email" />
                  </div>
                )}
                {InputSelection?.form_field.indexOf("MESSAGE") > -1 && (
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
                          <textarea
                            rows={3}
                            cols={30}
                            className="form-control"
                            placeholder="Message*"
                            id={field.name}
                            {...field}
                          />
                        </>
                      )}
                    />
                    <FormValidationError errors={errors} name="message" />
                  </div>
                )}
                {InputSelection?.form_field.indexOf("FILE") > -1 && (
                  <div className="form-group">
                    <label htmlFor="uploadFile">Upload</label>
                    <div className="file-upload">
                      {otherValue.upload_logo && imagePlaceHolder ? (
                        <>
                          <img src={imagePlaceHolder} alt="" />
                          <i className="jkm-close" onClick={() => removeSelectImage()}></i>
                        </>
                      ) : (
                        <>
                          <input
                            type="file"
                            ref={fileInputRef}
                            title=" "
                            name="image"
                            onChange={uploadImage}
                            // onChange={(event: React.ChangeEvent<HTMLFormElement>): Promise<void> => uploadImage(event)}
                            accept={APPCONFIG.acceptProfileImage}
                          />
                          <i className="jkm-file-upload file-upload-icon"></i>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <button type="submit" className="btn-popup">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OfferPopup;
