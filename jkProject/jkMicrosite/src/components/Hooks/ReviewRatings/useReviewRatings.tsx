import ErrorHandler from "@components/ErrorHandler";
import {
  IProductReviewDetails,
  IUserReviewRatingProps,
} from "@components/Hooks/ReviewRatings";
import { useToast } from "@components/Toastr/Toastr";
import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import {
  IAskQuestionState,
  IWriteReviewState,
} from "@templates/ProductDetails/components/RatingReview";
import { useState } from "react";

const useReviewRatings = (props: IUserReviewRatingProps) => {
  const [reviewRatings, setReviewRatings] = useState<IProductReviewDetails[]>();
  const [totalReviewCount, setTotalReviewCount] = useState<number | null>(null);
  const [totalRatingCount, setTotalRatingCount] = useState<number | null>(null);
  const { showError, showSuccess } = useToast();

  // useEffect(() => {
  //   getReviewRatings();
  //   // eslint-disable-next-line
  // }, []);

  const getReviewRatings = async () => {
    if (props?.callApi && props?.product_id) {
      return await pagesServices
        .getPage(`${APICONFIG.GET_PRODUCT_REVIEW}${props?.product_id}`, {})
        .then((result) => {
          setReviewRatings(result?.data?.product_review_detail);
          if (
            typeof result?.data?.product_total_reviews === "string" ||
            typeof result?.data?.product_total_reviews === "number"
          ) {
            setTotalReviewCount(result?.data?.product_total_reviews || 0);
            setTotalRatingCount(result?.data?.product_total_ratting || 0);
          } else {
            setTotalReviewCount(0);
            setTotalRatingCount(0);
          }
          return result;
        })
        .catch(() => {});
    }
  };

  const createReviewRatings = async (data: IWriteReviewState) => {
    const formData = new FormData();
    formData.append("name", data?.name);
    formData.append("review_title", data?.review_title);
    formData.append("review_description", data?.review_description);
    formData.append("rating", data?.rating.toString());
    formData.append("product_id", data?.product_id || "");
    formData.append("user_id", data?.user_id || "");
    data.images?.map((ele, index) => {
      formData.append(`image[${index}]`, ele.obj);
    });

    return await pagesServices
      .postPage(APICONFIG.PRODUCT_REVIEW_CREATE, formData)
      .then((resp: any) => {
        if (resp?.data && resp?.meta) {
          showSuccess(resp?.meta?.message);
        } else {
          ErrorHandler(resp, showError);
        }
        return resp;
      })
      .catch((err: any) => {
        ErrorHandler(err, showError);
      });
  };

  const updateReviewRatings = async (data: IWriteReviewState, id: string) => {
    const formData = new FormData();
    formData.append("name", data?.name);
    formData.append("review_title", data?.review_title);
    formData.append("review_description", data?.review_description);
    formData.append("rating", data?.rating.toString());
    formData.append("product_id", data?.product_id || "");
    formData.append("user_id", data?.user_id || "");
    formData.append("_id", id);
    data.images?.map((ele, index) => {
      if (ele?.obj) formData.append(`image[${index}]`, ele.obj);
    });
    return await pagesServices
      .postPage(`${APICONFIG.PRODUCT_REVIEW_UPDATE}`, formData)
      .then((resp: any) => {
        if (resp?.data && resp?.meta) {
          showSuccess(resp?.meta?.message);
        } else {
          ErrorHandler(resp, showError);
        }
        return resp;
      })
      .catch((err: any) => {
        ErrorHandler(err, showError);
      });
  };

  const createAskQuestion = async (data: IAskQuestionState) => {
    const formData = new FormData();
    formData.append("name", data?.name);
    formData.append("email", data?.email);
    formData.append("phone", data?.phone);
    formData.append("query", data?.query);
    formData.append("product_id", data?.product_id || "");
    return await pagesServices
      .postPage(APICONFIG.PRODUCT_ASK_QUESTION, formData)
      .then((resp) => {
        if (resp?.data && resp?.meta) {
          showSuccess(resp?.meta?.message);
        } else {
          ErrorHandler(resp, showError);
        }
        return resp;
      })
      .catch((err) => {
        ErrorHandler(err, showError);
      });
  };

  return {
    getReviewRatings,
    reviewRatings,
    totalReviewCount,
    totalRatingCount,
    createReviewRatings,
    createAskQuestion,
    updateReviewRatings,
  };
};

export default useReviewRatings;
