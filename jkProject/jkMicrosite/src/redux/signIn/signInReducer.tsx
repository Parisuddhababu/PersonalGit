import { IAPIData } from "@type/Common/Base";
import { getCartcount, getUserDetails, getWishListcount } from "@util/common";
import { SignInActionTypes } from "./signInTypes";

const initialState = {
  userData: getUserDetails() ?? [],
  cart_count : getCartcount() ?? 0,
  wishlist_count : getWishListcount() ?? 0,
  review_count : 0,
  otp_verification : {}
};

export interface ITypes {
  type?: any;
  payload?: IAPIData;
  loader?: boolean;
}

export const signInReducer = (
  state = initialState,
  { type, payload, loader }: ITypes
) => {
  switch (type) {
    case SignInActionTypes.INITIATE_ADD_DATA:
      return { ...state, loadingState: loader };
    case SignInActionTypes.ADD_SIGNIN_DATA_SUCCESS:
      return { ...state, userData: payload, loadingState: loader };
    case SignInActionTypes.ADD_SIGNIN_DATA_FAIL:
      return { ...state, loadingState: loader };
    case SignInActionTypes.UPDATE_SIGNIN_DATA_SUCCESS:
      return { ...state, userData: payload, loadingState: loader };
    case SignInActionTypes.CART_COUNT:
      return { ...state, cart_count: payload, loadingState: loader };
    case SignInActionTypes.WISH_LIST_COUNT:
      return { ...state, wishlist_count: payload, loadingState: loader };
    case SignInActionTypes.REVIEW_COUNT:
      return { ...state, review_count: payload, loadingState: loader };
    case SignInActionTypes.OTP_VERIFICATION:
      return { ...state, otp_verification: payload, loadingState: loader };
    default:
      return state;
  }
};

export default signInReducer;
