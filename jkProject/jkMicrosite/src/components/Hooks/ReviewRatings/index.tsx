import { IImage } from "@type/Common/Base";

export interface IProductReviewDetails {
  account: {
    account_id: string;
    account_name: string;
    code: string;
    ip_address: string;
    is_main_website: number;
    url: string;
  };
  created_at: string;
  image: IImage[];
  name: string;
  product_id: string;
  rating: string;
  review_description: string;
  review_title: string;
  sorting: number;
  user_id: string;
  verify_purchase: boolean;
  _id: string;
}

export interface ReviewRatingProps {
  product_review_detail: IProductReviewDetails[];
  product_total_ratting: string;
  product_total_reviews: string;
}

export interface IUserReviewRatingProps {
  product_id: string;
  callApi: boolean;
}
