import FormValidationError from "@components/FormValidationError";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getTypeBasedCSSPath,
  getUserDetails,
} from "@util/common";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import {
  IWriteReviewProps,
  IWriteReviewState,
} from "@templates/ProductDetails/components/RatingReview";
import { ISignInReducerData } from "@type/Common/Base";
import { useDispatch, useSelector } from "react-redux";
import useReviewRatings from "@components/Hooks/ReviewRatings/useReviewRatings";
import Loader from "@components/customLoader/Loader";
import { Message } from "@constant/errorMessage";
import { EMAIL_REGEX, PHONENUMBER_REGEX } from "@constant/regex";

import CustomRating from "@components/customRatings/customRating";
import { updateReviewCounter } from "src/redux/signIn/signInAction";
import { IImageUploadState } from "@components/Hooks/ImageUpload";
import useImageUpload from "@components/Hooks/ImageUpload/useImageUpload";
import { IProductReviewDetails } from "@components/Hooks/ReviewRatings";

const WriteReview = (props: IWriteReviewProps) => {
  const [loader, setLoader] = useState<boolean>(false);
  const signIndata = useSelector((state: ISignInReducerData) => state);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { formImageData, removeOneImage, onHandleUpload, setImages, resetFileCache, clearImage } = useImageUpload({
    imageSize: 5,
    fileUploadRef: fileUploadRef,
  });
  const {
    createReviewRatings,
    getReviewRatings,
    updateReviewRatings,
  } = useReviewRatings({
    product_id: props?.data?.website_product_detail?.product_id,
    callApi: true,
  });

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

  useEffect(() => {
    if (props?.productReviewData) {
      editReviewData(props?.productReviewData)
    }
    // eslint-disable-next-line
  }, [])

  const editReviewData = (data: IProductReviewDetails) => {
    setValue("name", data?.name);
    setValue("review_title", data?.review_title);
    setValue("review_description", data?.review_description);
    setValue("rating", parseInt(data?.rating));
    setValue("user_id", signIndata?.signIn?.userData?.user_detail?._id);
    setValue("product_id", props?.data?._id);
    setImages(data?.image);
    setReviewId(data?._id);
  };

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

  const removeSelectImage = (img: IImageUploadState) => {
    removeOneImage(img);
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.prodDetailWriteReview)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.popupBoxDesign)}
        />
      </Head>
      {loader && <Loader />}
      <div className="user-write-review">
        {/* <h3>Write a Review</h3> */}
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
                  {...register(
                    "review_description",
                    Validations.review_description
                  )}
                  name="review_description"
                  className="form-control"
                  placeholder="Description"
                ></textarea>
                <FormValidationError
                  errors={errors}
                  name="review_description"
                />
              </div>
            </div>
          </div>
          <div className="d-row">
            <div className="d-col d-col-12">
              <div className="form-group grid-span-full">
                <div className="col-md-6 mb-3">
                  <label>
                    Upload Product Images{" "}
                    <span className="text-primary">(306px X 194px)</span>
                  </label>
                  {/* <div className="form-control upload-image-wrap multi-upload-image-wrap"> */}
                  <div className="profile profile-pic">
                    {formImageData?.length
                      ? formImageData?.map((img: IImageUploadState, index: number) => (
                        <div
                          className="profile-wrapper"
                          key={index + "_upload_img_review"}
                        >
                          <img
                            src={img.url ? img.url : img.path}
                            alt={"Write Review Image"}
                            title={"Write a Review Image"}
                            height="145px"
                            width="406px"
                          />
                          <i
                            className="jkm-close"
                            onClick={() => removeSelectImage(img)}
                          ></i>
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
    </>
  );
};

export default WriteReview;
