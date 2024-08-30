import { IAPIData } from "@type/Common/Base";
import { getUserDetails} from "@util/common";
import { SignInActionTypes } from "./signInTypes";

const initialState = {
  userData: getUserDetails() ?? [],
  review_count : 0,
  otp_verification : {}
};

export interface ITypes {
  type?: any;
  payload?: IAPIData;
  loader?: boolean;
}


export const signInReducer = (
  state : any,
  { type, payload, loader }: ITypes
) => {
  const newState = state ?? initialState
  switch (type) {
    case SignInActionTypes.INITIATE_ADD_DATA:
      return { ...newState, loadingState: loader };
    case SignInActionTypes.ADD_SIGNIN_DATA_SUCCESS:
      return { ...newState, userData: payload, loadingState: loader };
    case SignInActionTypes.ADD_SIGNIN_DATA_FAIL:
      return { ...newState, loadingState: loader };
    case SignInActionTypes.UPDATE_SIGNIN_DATA_SUCCESS:
      return { ...newState, userData: payload, loadingState: loader };
    case SignInActionTypes.CART_COUNT:
      return { ...newState, cart_count: payload, loadingState: loader };
    case SignInActionTypes.REVIEW_COUNT:
      return { ...newState, review_count: payload, loadingState: loader };
    case SignInActionTypes.OTP_VERIFICATION:
      return { ...newState, otp_verification: payload, loadingState: loader };
    default:
      return newState;
  }
};

export default signInReducer;
