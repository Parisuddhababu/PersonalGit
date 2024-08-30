import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { converDateMMDDYYYY, getTypeBasedCSSPath, getCurrentSelectedCountry, getUserDetails } from "@util/common";
import Head from "next/head";
import {
  IAskQuestionState,
  IReviewRatingProps,
  IWriteReviewState,
  RatingReviewCountState,
} from "@templates/ProductDetails/components/RatingReview";
import useReviewRatings from "@components/Hooks/ReviewRatings/useReviewRatings";
import { useEffect, useRef, useState } from "react";
import CustomRating from "@components/customRatings/customRating";
import { useForm } from "react-hook-form";
import FormValidationError from "@components/FormValidationError";
import { IImage, ISignInReducerData, IAPIError } from "@type/Common/Base";
import useImageUpload from "@components/Hooks/ImageUpload/useImageUpload";
import { Message } from "@constant/errorMessage";
import useSliderHook from "@components/Hooks/sliderHook";
import CustomImage from "@components/CustomImage/CustomImage";
import { IProductReviewDetails } from "@components/Hooks/ReviewRatings";
import { EMAIL_REGEX, PHONENUMBER_REGEX } from "@constant/regex";
import CustomRatingViews from "@components/customRatings/customRatingViews";
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import APICONFIG from "@config/api.config";
import { useToast } from "@components/Toastr/Toastr";
import ErrorHandler from "@components/ErrorHandler";
import Loader from "@components/customLoader/Loader";
import pagesServices from "@services/pages.services";
import CONFIG from "@config/api.config";
import { IContactList } from "@type/Pages/contactUsAddress";
import CountrySelect from "@components/countrySelect";
import { IImageUploadState } from "@components/Hooks/ImageUpload";
import { updateReviewCounter } from "src/redux/signIn/signInAction";
import { useDispatch, useSelector } from "react-redux";

const RatingReview1 = (props: IReviewRatingProps) => {
  const [currentActiveTab, setCurrentActiveTab] = useState<"rating" | "askQues">("rating");
  const {
    reviewRatings,
    totalReviewCount,
    totalRatingCount,
    createReviewRatings,
    createAskQuestion,
    getReviewRatings,
    updateReviewRatings,
  } = useReviewRatings({
    product_id: props?.data?.website_product_detail?.product_id,
    callApi: true,
  });
  const totalStar = ["5", "4", "3", "2", "1"];
  const [startWiseCount, setStartWiseCount] = useState<RatingReviewCountState[]>([]);
  const dispatch = useDispatch();
  const signIndata = useSelector((state: ISignInReducerData) => state);
  const { deleteDataHook } = usePostFormDataHook();
  const { showError, showSuccess } = useToast();
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const reviewRef = useRef<HTMLInputElement>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [countryData, setCountryData] = useState<IContactList[]>([]);
  const { formImageData, removeOneImage, onHandleUpload, setImages, resetFileCache, clearImage } = useImageUpload({
    imageSize: 5,
    fileUploadRef: fileUploadRef,
  });

  const {
    slicedData,
    hideRightButton,
    SliderButton,
    hideLeftButton,
    arrayIndex,
    splitDataArray,
    //@ts-ignore
  } = useSliderHook(reviewRatings, 2);

  const getTotalCountsStartWise = () => {
    const data = [] as RatingReviewCountState[];
    totalStar?.map((ele) => {
      const count = reviewRatings?.filter((fs) => fs.rating === ele);
      data.push({
        star: ele,
        count: count?.length || 0,
      });
    });
    setStartWiseCount(data);
    return data;
  };

  useEffect(() => {
    getTotalCountsStartWise();
    splitDataArray(reviewRatings || []);
    getCountry();
    // eslint-disable-next-line
  }, [reviewRatings]);

  const getCountry = async () => {
    setLoader(true);
    await pagesServices
      .postPage(CONFIG.GET_COUNTRY, {})
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
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IWriteReviewState>({
    defaultValues: {
      name: signIndata?.signIn?.userData?.user_detail
        ? `${signIndata?.signIn?.userData?.user_detail?.first_name ?? ""} ${signIndata?.signIn?.userData?.user_detail?.last_name ?? ""
        }`
        : "",
      review_title: "",
      review_description: "",
      rating: 4,
    },
  });

  const {
    register: askQuesRegister,
    handleSubmit: askQueHandleSubmit,
    formState: { errors: asQuesError },
    resetField,
  } = useForm<IAskQuestionState>({
    defaultValues: {
      name: signIndata?.signIn?.userData?.user_detail
        ? `${signIndata?.signIn?.userData?.user_detail?.first_name ?? ""} ${signIndata?.signIn?.userData?.user_detail?.last_name ?? ""
        }`
        : "",
      email: `${signIndata?.signIn?.userData?.user_detail?.email ?? ""}`,
      phone: `${signIndata?.signIn?.userData?.user_detail?.mobile ?? ""}`,
      country_phone_code: `${signIndata?.signIn?.userData?.user_detail?.country?.country_phone_code ?? ""}`,
      query: "",
    },
  });

  const onSubmit = async (data: IWriteReviewState) => {
    setLoader(true);
    const obj = {
      name: data?.name,
      review_title: data?.review_title,
      review_description: data?.review_description,
      rating: data?.rating,
      product_id: props?.data?._id,
      user_id: signIndata?.signIn?.userData?.user_detail?._id,
      images: formImageData,
    };
    let response;
    if (reviewId) response = await updateReviewRatings(obj, reviewId);
    else response = await createReviewRatings(obj);
    if (response?.meta?.status_code == 201) {
      reset();
      resetFileCache();
      clearImage();
      getReviewRatings();
      setReviewId(null);
      dispatch(updateReviewCounter(signIndata?.signIn?.review_count + 1));
    }
    setLoader(false);
  };

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
      setCurrentActiveTab("rating");
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

  const editReviewData = (data: IProductReviewDetails) => {
    setCurrentActiveTab("rating");
    scrollUP();
    setValue("name", data?.name);
    setValue("review_title", data?.review_title);
    setValue("review_description", data?.review_description);
    setValue("rating", parseInt(data?.rating));
    setValue("user_id", signIndata?.signIn?.userData?.user_detail?._id);
    setValue("product_id", props?.data?._id);
    setImages(data?.image);
    setReviewId(data?._id);
  };

  const deleteReview = async (data: IProductReviewDetails) => {
    setLoader(true);
    try {
      const response = await deleteDataHook({}, `${APICONFIG.DELETE_REVIEW}${data?._id}`);
      if (response?.meta?.status_code == 200) {
        showSuccess(response?.meta?.message);
        getReviewRatings();
        reset();
        resetFileCache();
        clearImage();
        setReviewId(null);
        setLoader(false);
      }
    } catch (err) {
      setLoader(false);
      ErrorHandler(err as IAPIError, showError);
    }
  };

  const scrollUP = () => {
    window.scrollTo({
      behavior: "smooth",
      top: reviewRef?.current?.offsetTop,
    });
  };

  const removeSelectImage = (img: IImageUploadState) => {
    removeOneImage(img);
  };

  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.prodDetailRatingReview)} />
      </Head>
      {loader && <Loader />}
      <section className="rating-review-section" ref={reviewRef} id="review">
        <div className="container">
          <div className="tabinarion-section">
            <ul id="rating-tabs" className="nav nav-tabs">
              <li className="nav-item" onClick={() => setCurrentActiveTab("rating")}>
                <a
                  id="tab-rating"
                  href="#content-rating"
                  className={`nav-link ${currentActiveTab === "rating" && "active"}`}
                >
                  Ratings & Reviews
                </a>
              </li>
              <li className="nav-item" onClick={() => setCurrentActiveTab("askQues")}>
                <a
                  id="tab-ask-que"
                  href="#content-ask-que"
                  className={`nav-link ${currentActiveTab === "askQues" && "active"}`}
                >
                  Ask a Question
                </a>
              </li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane active">
                <div className="collapse-heading">
                  <h5>
                    <a href="#collapse-rating">Ratings & Reviews</a>
                  </h5>
                </div>

                <div id="collapse-rating" className="collapse">
                  <div className="collapse-body">
                    <div className="user-rating-section">
                      <div className="overall-ratings">
                        <div className="rating-counter-section">
                          <>
                            <strong>
                              <span>{totalRatingCount || 0}</span>Out of 5
                            </strong>
                            <CustomRatingViews ratingCounts={totalRatingCount || 0} type={props.type} />
                            <div className="total-review">{totalReviewCount || 0} Ratings</div>
                          </>
                        </div>
                        <div className="rating-processbar-section">
                          {startWiseCount?.map((swc, eInd) => (
                            <div key={eInd} className="process-box">
                              <span className="number">{swc?.star}</span>
                              <i className="icon jkm-star-fill"></i>
                              <div className="progress-line">
                                <div
                                  className="progress-bar"
                                  style={{
                                    width:
                                      (reviewRatings?.length ? (swc?.count * 100) / reviewRatings?.length : 0) + "%",
                                  }}
                                ></div>
                              </div>
                              <span className="number">{swc?.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {currentActiveTab === "rating" ? (
                        <div className="user-write-review">
                          <h3>Write a Review</h3>
                          <CustomRating onChange={(change) => setValue("rating", change)} />
                          <form className="user-review-form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="d-row">
                              <div className="d-col d-col-2">
                                <div className="form-group">
                                  <label>Name*</label>
                                  <input
                                    {...register("name", Validations.name)}
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    placeholder="Name"
                                    disabled
                                  />
                                  <FormValidationError errors={errors} name="name" />
                                </div>
                              </div>

                              <div className="d-col d-col-2">
                                <div className="form-group">
                                  <label>Title*</label>
                                  <input
                                    {...register("review_title", Validations.review_title)}
                                    type="text"
                                    className="form-control"
                                    name="review_title"
                                    placeholder="Title"
                                  />
                                  <FormValidationError errors={errors} name="review_title" />
                                </div>
                              </div>

                              <div className="d-col d-col-1">
                                <div className="form-group">
                                  <label>Review*</label>
                                  <textarea
                                    {...register("review_description", Validations.review_description)}
                                    name="review_description"
                                    className="form-control"
                                    placeholder="Description"
                                  ></textarea>
                                  <FormValidationError errors={errors} name="review_description" />
                                </div>
                              </div>
                            </div>
                            <div className="d-row">
                              <div className="d-col d-col-12">
                                <div className="form-group grid-span-full">
                                  <div className="col-md-6 mb-3">
                                    <label>
                                      Upload Product Images <span className="text-primary">(306px X 194px)</span>
                                    </label>
                                    {/* <div className="form-control upload-image-wrap multi-upload-image-wrap"> */}
                                    <div className="profile profile-pic" >
                                      {formImageData?.length
                                        ? formImageData?.map((img, index) => (
                                          <div className="profile-wrapper" key={index + "_upload_img_review"}>
                                            <img
                                              src={img.url ? img.url : img.path}
                                              alt={"Write Review Image"}
                                              title={"Write a Review Image"}
                                              height="145px"
                                              width="406px"
                                            />
                                            <i className="jkm-close" onClick={() => removeSelectImage(img)}></i>
                                          </div>
                                        ))
                                        : null}
                                    </div>
                                    {/* {!formImageData?.length && ( */}
                                    <div className="profile">
                                      <div className="fileupload">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          ref={fileUploadRef}
                                          multiple={true}
                                          onChange={(e) => onHandleUpload(e, reviewId)}
                                        />
                                        <i className="jkm-file-upload file-upload-icon"></i>
                                      </div>

                                      {/* <div className="profile-wrapper">
                                            <p className="mb-0">
                                              <span className="jkm-upload-file" />
                                            </p>
                                          </div> */}
                                    </div>
                                    {/* )} */}
                                    {/* </div> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {getUserDetails() ? (
                              <button className="btn btn-secondary btn-small">Submit</button>
                            ) : (
                              <> </>
                            )}
                          </form>
                        </div>
                      ) : (
                        <div className="user-write-review">
                          <h3>Ask a Question</h3>
                          <form className="user-review-form" onSubmit={askQueHandleSubmit(onAskQuestionSubmit)}>
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
                                      phoneNumberProp={signIndata?.signIn?.userData?.user_detail?.mobile ?? ""}
                                      // @ts-ignore
                                      country={countryData.filter(a => a._id === getCurrentSelectedCountry())[0]}
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
                            {getUserDetails() ? <button className="btn btn-secondary btn-small">Submit</button> : <></>}
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="user-review-slider">
            <div className="slider-group row">
              {hideLeftButton && reviewRatings && reviewRatings?.length >= 2 && (
                <button className="btn btn-slider btn-prev" onClick={() => SliderButton("LEFT", arrayIndex - 1)}>
                  <i className="jkm-arrow-right"></i>
                </button>
              )}
              {slicedData[arrayIndex] &&
                slicedData[arrayIndex]?.map((ele: IProductReviewDetails, eInd: number) => (
                  <div key={eInd} className="d-col d-col-2">
                    <div className="review-card">
                      <div className="profile-section">
                        <div className="profile-name">{ele?.name}</div>
                        {ele?.verify_purchase ? (
                          <div className="verified">
                            <i className="icon jkm-green-check"></i>
                            <span>Verified Purchase</span>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <h5 className="product-name">{ele?.review_title}</h5>
                      <div className="rating-date">
                        <>
                          <p className="date">{converDateMMDDYYYY(ele?.created_at)}</p>
                          <CustomRatingViews ratingCounts={Number(ele?.rating || 0)} type={props.type} />
                        </>
                      </div>
                      <p className="description">{ele?.review_description}</p>
                      {ele?.image && (
                        <div className="product-img-group">
                          {ele?.image?.map((img: IImage, eInd) => (
                            <CustomImage
                              key={eInd}
                              src={img?.path}
                              alt={img?.file_name}
                              title={img?.file_name}
                              height="60px"
                              width="60px"
                            />
                          ))}
                        </div>
                      )}
                      {
                        signIndata?.signIn?.userData?.user_detail?._id == ele?.user_id ?

                          <div className="like-section">
                            <div className="like-box" onClick={() => editReviewData(ele)}>
                              <i className="icon jkm-pencil"></i>
                              <span>Edit</span>
                            </div>
                            <div className="like-box" onClick={() => deleteReview(ele)}>
                              <i className="icon jkm-close"></i>
                              <span>Delete</span>
                            </div>
                          </div> : <></>}
                    </div>
                  </div>
                ))}
              {slicedData[arrayIndex] && hideRightButton && reviewRatings && reviewRatings?.length >= 2 && (
                <button className="btn btn-slider btn-next" onClick={() => SliderButton("RIGHT", arrayIndex + 1)}>
                  <i className="jkm-arrow-right"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RatingReview1;
