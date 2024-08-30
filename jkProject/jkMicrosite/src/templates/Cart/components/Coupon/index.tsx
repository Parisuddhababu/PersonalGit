import ICoupon1 from "@templates/Cart/components/Coupon/coupon-1";
import { IAccount } from "@type/Common/Base";

export interface ICouponView1Props {
  onClose: () => void;
  updateCoupon: () => void;
  isModal: boolean;
  cart_id: string;
  coupon_code : string
}

export interface ICouponData {
  _id: string;
  name: string;
  code: string;
  account: IAccount;
  description: string;
  discount_type: number;
  discount: number;
  valid_from: string;
  valid_to: string;
  min_amt: number;
  max_amt: number;
  max_use_count: number;
  per_user_limit: number;
  type: string;
  is_active: number;
}

export interface ICouponForm {
  coupon_code : string
} 

export interface ICoupon {
  data: ICouponData[]
}



export default ICoupon1;
