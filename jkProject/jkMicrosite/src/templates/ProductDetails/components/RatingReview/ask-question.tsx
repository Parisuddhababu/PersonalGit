import FormValidationError from "@components/FormValidationError";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getCurrentSelectedCountry,
  getTypeBasedCSSPath,
  getUserDetails,
} from "@util/common";
import CountrySelect from "@components/countrySelect";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import {
  IAskaQuestionPopup,
  IAskQuestionState,
} from "@templates/ProductDetails/components/RatingReview";
import { ISignInReducerData } from "@type/Common/Base";
import { useSelector } from "react-redux";
import useReviewRatings from "@components/Hooks/ReviewRatings/useReviewRatings";
import Loader from "@components/customLoader/Loader";
import { Message } from "@constant/errorMessage";
import { EMAIL_REGEX, PHONENUMBER_REGEX } from "@constant/regex";
import { IContactList } from "@type/Pages/contactUsAddress";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import ErrorHandler from "@components/ErrorHandler";
import { useToast } from "@components/Toastr/Toastr";

const AskQuestion = (props: IAskaQuestionPopup) => {
  const [loader, setLoader] = useState<boolean>(false);
  const signIndata = useSelector((state: ISignInReducerData) => state);
  const [countryData, setCountryData] = useState<IContactList[]>([]);

  const { createAskQuestion } = useReviewRatings({
    product_id: props?.data?.website_product_detail?.product_id,
    callApi: true,
  });
  const { showError } = useToast();

  useEffect(() => {
    getCountry();
    // eslint-disable-next-line
  }, []);

  const getCountry = async () => {
    setLoader(true);
    await pagesServices
      .postPage(APICONFIG.GET_COUNTRY, {})
      .then((result) => {
        setCountryData(result?.data?.country_list);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        ErrorHandler(error, showError);
      });
  };

  const {
    register: askQuesRegister,
    handleSubmit: askQueHandleSubmit,
    formState: { errors: asQuesError },
    resetField,
    setValue
  } = useForm<IAskQuestionState>({
    defaultValues: {
      name: signIndata?.signIn?.userData?.user_detail
        ? `${signIndata?.signIn?.userData?.user_detail?.first_name ?? ""} ${
            signIndata?.signIn?.userData?.user_detail?.last_name ?? ""
          }`
        : "",
      email: `${signIndata?.signIn?.userData?.user_detail?.email ?? ""}`,
      phone: `${signIndata?.signIn?.userData?.user_detail?.mobile ?? ""}`,
      country_phone_code: `${
        signIndata?.signIn?.userData?.user_detail?.country
          ?.country_phone_code ?? ""
      }`,
      query: "",
    },
  });

  const onAskQuestionSubmit = async (data: IAskQuestionState) => {
    setLoader(true);
    const obj = {
      name: data?.name,
      email: data?.email,
      phone: `${data?.country_phone_code}${data?.phone}`,
      query: data?.query,
      product_id: props?.data?._id,
    };
    const response = await createAskQuestion(obj);
    if (response?.meta?.status_code == 201) {
      resetField("query");
      props.toggleModal();
    }
    setLoader(false);
  };

  const Validations = {
    name: {
      required: Message.NAME_REQUIRED,
    },
    review_title: {
      required: Message.REVIEW_TITLE_REQUIRED,
    },
    review_description: {
      required: Message.REVIEW_DESCRIPTION_REQUIRED,
    },
    rating: {
      required: Message.REVIEW_RATING_REQUIRED,
    },
    email: {
      required: Message.EMAIL_REQUIRED,
      pattern: {
        value: EMAIL_REGEX,
        message: Message.EMAIL_PATTERN,
      },
    },
    phone: {
      required: Message.MOBILENUMBER_REQUIRED,
      pattern: {
        value: PHONENUMBER_REGEX,
        message: Message.MOBILE_PATTERN,
      },
    },
    query: {
      required: Message.DESCRIPTION_REQUIRED,
    },
  };

  const setCountryId = (data: any) => {
    //@ts-ignore
    setValue("country_phone_code", data?.countryCode);
    //@ts-ignore
    setValue("phone", data?.phone);
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.prodDetailAskQuestion)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.popupBoxDesign)}
        />
      </Head>
      {loader && <Loader />}
      <div className="modal-content">
        <div className="user-write-review">
          {/* <h3>Ask a Question</h3> */}
          <form
            className="user-review-form"
            onSubmit={askQueHandleSubmit(onAskQuestionSubmit)}
          >
            <div className="d-row">
              <div className="d-col d-col-2">
                <div className="form-group">
                  <label>Name*</label>
                  <input
                    {...askQuesRegister("name", Validations.name)}
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Name"
                  />
                  <FormValidationError errors={asQuesError} name="name" />
                </div>
              </div>

              <div className="d-col d-col-2">
                <div className="form-group">
                  <label>Email*</label>
                  <input
                    {...askQuesRegister("email", Validations.email)}
                    type="text"
                    className="form-control"
                    name="email"
                    placeholder="Enter Email"
                  />
                  <FormValidationError errors={asQuesError} name="email" />
                </div>
              </div>
              {countryData.length ? (
                <div className="d-col d-col-2">
                  <div className="form-group">
                    <label>Mobile No*</label>
                    <CountrySelect
                      setCountryContact={(d) => setCountryId(d)}
                      placeholder=""
                      page="rating"
                      inputId="sign-up"
                      // @ts-ignore
                      country={
                        countryData.filter(
                          (a) => a._id === getCurrentSelectedCountry()
                        )[0]
                      }
                    />
                    {/* <label>country_phone_code*</label>
                                  <input
                                    {...askQuesRegister("country_phone_code")}
                                    type="text"
                                    name="country_phone_code"
                                    className="form-control"
                                    id="country_phone_code"
                                  />
                                </div>
                                <div className="form-group">
                                  <label>Mobile No*</label>
                                  <input
                                    {...askQuesRegister(
                                      "phone",
                                      Validations.phone
                                    )}
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    placeholder="Enter Mobile No"
                                  /> */}
                    <FormValidationError errors={asQuesError} name="phone" />
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="d-col d-col-1">
                <div className="form-group">
                  <label>Message*</label>
                  <textarea
                    {...askQuesRegister("query", Validations.query)}
                    name="query"
                    className="form-control"
                    placeholder="Description"
                  ></textarea>
                  <FormValidationError errors={asQuesError} name="query" />
                </div>
              </div>
            </div>
            {getUserDetails() ? (
              <button className="btn btn-secondary btn-small">Submit</button>
            ) : (
              <></>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default AskQuestion;
