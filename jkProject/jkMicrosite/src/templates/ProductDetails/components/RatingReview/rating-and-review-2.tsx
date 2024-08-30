import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { converDateMMDDYYYY, getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import {
  IReviewRatingProps,
  RatingReviewCountState,
} from "@templates/ProductDetails/components/RatingReview";
import useReviewRatings from "@components/Hooks/ReviewRatings/useReviewRatings";
import { useEffect, useState } from "react";
import { IAPIError, IImage, ISignInReducerData } from "@type/Common/Base";
import useSliderHook from "@components/Hooks/sliderHook";
import CustomImage from "@components/CustomImage/CustomImage";
import { IProductReviewDetails } from "@components/Hooks/ReviewRatings";
import CustomRatingViews from "@components/customRatings/customRatingViews";
import { useSelector } from "react-redux";
import AskQuestion from "./ask-question";
import Modal from "@components/Modal";
import WriteReview from "./write-review";
import DeletePopup from "@components/Deletepopup/DeletePopup";
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import ErrorHandler from "@components/ErrorHandler";
import APICONFIG from "@config/api.config";
import { useToast } from "@components/Toastr/Toastr";
import Loader from "@components/customLoader/Loader";

const RatingReview2 = (props: IReviewRatingProps) => {
  const {
    reviewRatings,
    totalReviewCount,
    totalRatingCount,
    getReviewRatings,
  } = useReviewRatings({
    product_id: props?.data?.website_product_detail?.product_id,
    callApi: true,
  });
  const totalStar = ["5", "4", "3", "2", "1"];
  const [, setStartWiseCount] = useState<RatingReviewCountState[]>([]);
  const signIndata = useSelector((state: ISignInReducerData) => state);
  const [isAskQues, setIsAskQues] = useState<boolean>(false);
  const [isWriteReview, setIsWriteReview] = useState<boolean>(false);
  const [editReviewData, setEditReviewData] =
    useState<IProductReviewDetails | null>(null);
  const [isDeletePopup, setIsDeletePopup] = useState<boolean>(false);
  const { deleteDataHook } = usePostFormDataHook();
  const [loader, setLoader] = useState<boolean>(false);
  const { showError, showSuccess } = useToast();

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
    // eslint-disable-next-line
  }, [reviewRatings]);

  const toggleModal = () => {
    setIsAskQues(false);
    setIsWriteReview(false);
    getReviewRatings();
  };

  const onCloseDeleteModal = () => {
    setIsDeletePopup(false);
  };

  const handleDeleteData = async (isDelete: boolean) => {
    if (isDelete) {
      try {
        const response = await deleteDataHook(
          {},
          `${APICONFIG.DELETE_REVIEW}${editReviewData?._id}`
        );
        if (response?.meta?.status_code == 200) {
          showSuccess(response?.meta?.message);
          setLoader(false);
          getReviewRatings();
          onCloseDeleteModal();
        }
      } catch (err) {
        setLoader(false);
        ErrorHandler(err as IAPIError, showError);
      }
    }
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.prodDetailRatingReview)}
        />
      </Head>
      {loader && <Loader />}
      <section className="rating-review-section">
        <div className="container">
          <div className="user-rating-top-section">
            <div className="rating-counter-section">
              <div className="count-star">
                <strong>
                  <span>{totalRatingCount || 0}</span>Out of 5
                </strong>
                <CustomRatingViews ratingCounts={totalRatingCount || 0}  type={props?.type}/>
              </div>
              <div className="total-review">
                {totalReviewCount || 0} Ratings
              </div>
            </div>
            <div className="review-action-button">
              <button
                aria-label="btn write review"
                className="btn btn-secondary btn-review"
                onClick={() => setIsWriteReview(true)}
              >
                Write a Review
              </button>
              <button
                aria-label="btn ask question"
                className="btn btn-secondary btn-review"
                onClick={() => setIsAskQues(true)}
              >
                Ask a Question
              </button>
            </div>
          </div>
          <div className="user-review-slider">
            <div className="slider-group row">
              {hideLeftButton &&
                reviewRatings &&
                reviewRatings?.length >= 2 && (
                  <button
                    className="btn btn-slider btn-prev"
                    onClick={() => SliderButton("LEFT", arrayIndex - 1)}
                  >
                    <i className="jkms2-arrow-right"></i>
                  </button>
                )}
              {slicedData[arrayIndex] &&
                slicedData[arrayIndex]?.map(
                  (ele: IProductReviewDetails, eIndex: number) => (
                    <div key={eIndex} className="d-col d-col-4">
                      <div className="review-card">
                        <div className="rating-slider-bottom-side">
                          <p className="date">
                            {converDateMMDDYYYY(ele?.created_at)}
                          </p>
                          <div className="rating-verified">
                            <CustomRatingViews
                              ratingCounts={Number(ele?.rating || 0)}
                              type={props?.type}
                            />
                            {ele?.verify_purchase ? (
                              <div className="verified">
                                <i className="icon jkms2-green-check"></i>
                                <span>Verified Purchase</span>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                          <h5>{ele?.review_title}</h5>
                          <p className="description">
                            {ele?.review_description}
                          </p>
                          {ele?.image && (
                            <div className="product-img-group">
                              {ele?.image?.map((img: IImage, eInd: number) => (
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
                        </div>
                        {signIndata?.signIn?.userData?.user_detail?._id ==
                          ele?.user_id ? (
                          <div className="rating-slider-bottom-side">
                            <div className="profile-name">{ele?.name}</div>
                            <div className="like-section">
                              <div
                                className="like-box"
                                onClick={() => {
                                  setEditReviewData(ele);
                                  setIsWriteReview(true);
                                }}
                              >
                                <i className="icon jkms2-pencil"></i>
                                <span>Edit</span>
                              </div>
                              <div
                                className="like-box"
                                onClick={() => {
                                  setIsDeletePopup(true);
                                  setEditReviewData(ele);
                                }}
                              >
                                <i className="icon jkms2-close"></i>
                                <span>Delete</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  )
                )}
              {slicedData[arrayIndex] &&
                hideRightButton &&
                reviewRatings &&
                reviewRatings?.length >= 2 && (
                  <button
                    onClick={() => SliderButton("RIGHT", arrayIndex + 1)}
                    aria-label="btn next"
                    className="btn btn-slider btn-next"
                  >
                    <i className="jkms2-arrow-right"></i>
                  </button>
                )}
            </div>
          </div>
        </div>
        {isAskQues ? (
          <Modal
            open={true}
            onClose={toggleModal}
            dimmer={false}
            headerName="Ask a Question"
            className="ask-question-popup"
          >
            <AskQuestion data={props?.data} toggleModal={toggleModal} />
          </Modal>
        ) : (
          <></>
        )}
        {isWriteReview ? (
          <Modal
            open={true}
            onClose={toggleModal}
            dimmer={false}
            headerName="Write a Review"
            className="write-review-modal"
          >
            <WriteReview
              data={props?.data}
              toggleModal={toggleModal}
              productReviewData={editReviewData}
            />
          </Modal>
        ) : (
          <></>
        )}
        {isDeletePopup && (
          <DeletePopup
            onClose={onCloseDeleteModal}
            isDelete={(isDelete) => handleDeleteData(isDelete)}
            message="Are you sure you want to delete review?"
          />
        )}
      </section>
    </>
  );
};

export default RatingReview2;
