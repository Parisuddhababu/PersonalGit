import { IImage } from "@type/Common/Base";

export interface IReferEarnBannerData {
  _id: string;
  banner_title: string;
  link: string;
  is_active: number;
  banner_image: IImage;
  created_at: string;
}

export interface IReferEarnDetails {
  _id: string;
  description: string;
  step1_description: string;
  step1_image: IImage;
  step1_title: string;
  step2_description: string;
  step2_image: IImage;
  step2_title: string;
  step3_description: string;
  step3_image: IImage;
  step3_title: string;
  step4_description: string;
  step4_image: IImage;
  step4_title: string;
  terms_and_conditions: string;
  they_get_discount: string;
  they_get_discount_type: number;
  title: string;
  you_get_discount: string;
  you_get_discount_type: number;
}

export interface IRefer {
  refer_earn_banner: IReferEarnBannerData;
  refer_earn_detail: IReferEarnDetails;
}