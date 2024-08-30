import { IAPIData, IOTPData } from "@type/Common/Base";
import { SignInActionTypes } from "./signInTypes";
import { Dispatch } from "redux";

export const Action_UserDetails = (data: IAPIData) => {
  return (dispatch: Dispatch) => {
    dispatch(dataAdditionProcessInitiated());
    dispatch(dataAddFunction(data));
  };
};

// For Demo Purpose To Updata Data in Redux

export const Action_UpdateUserDetails = (data: IAPIData) => {
  return (dispatch: Dispatch) => {
    dispatch(dataAdditionProcessInitiated());
    dispatch(dataUpdateFunction(data));
  };
};

const dataAdditionProcessInitiated = () => {
  return {
    type: SignInActionTypes.INITIATE_ADD_DATA,
    loader: true,
  };
};

const dataAddFunction = (data: IAPIData) => {
  return {
    type: SignInActionTypes.ADD_SIGNIN_DATA_SUCCESS,
    payload: data?.data ?? data,
    loader: false,
  };
};

const dataUpdateFunction = (data: IAPIData) => {
  return {
    type: SignInActionTypes.UPDATE_SIGNIN_DATA_SUCCESS,
    payload: data,
    loader: false,
  };
};

export const updateCartCounter = (cart_count: number) => {
  return {
    type: SignInActionTypes.CART_COUNT,
    payload: cart_count,
    loader: false,
  };
};
export const updateWishListCounter = (wishlist_count: number) => {
  return {
    type: SignInActionTypes.WISH_LIST_COUNT,
    payload: wishlist_count,
    loader: false,
  };
};
export const updateReviewCounter = (review_count: number) => {
  return {
    type: SignInActionTypes.REVIEW_COUNT,
    payload: review_count,
    loader: false,
  };
};
export const userSignInOTP = (obj: IOTPData) => {
  return {
    type: SignInActionTypes.OTP_VERIFICATION,
    payload: obj,
    loader: false,
  };
};
