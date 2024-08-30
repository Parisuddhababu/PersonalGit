import { IImageUploadState } from "@components/Hooks/ImageUpload";
import { IProductReviewDetails } from "@components/Hooks/ReviewRatings";
import RatingReview1 from "@templates/ProductDetails/components/RatingReview/rating-and-review-1";
import { IProductDetails } from "@type/Pages/productDetails";
export interface IReviewRatingProps {
  data: IProductDetails;
  type: number;
}

export interface RatingReviewCountState {
  star: string;
  count: number;
}

export interface IWriteReviewState {
  name: string;
  review_title: string;
  review_description: string;
  rating: number;
  images?: IImageUploadState[];
  product_id?: string;
  user_id?: string;
}

export interface IAskQuestionState {
  name: string;
  email: string;
  phone: string;
  query: string;
  product_id?: string;
  country_phone_code?: string;
}

export interface IAskaQuestionPopup {
  toggleModal : () => void;
  data: IProductDetails;
}

export interface IWriteReviewProps {
  toggleModal : () => void;
  data: IProductDetails;
  productReviewData: IProductReviewDetails | null;
}

export default RatingReview1;
