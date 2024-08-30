import { Dispatch } from "redux";
import { guestUserActionTypes } from "./guestUserTypes";

export const setGuestUser = (state: boolean) => {
  return (dispatch: Dispatch) => {
    dispatch(guestUserStatusChange(state));
  };
};

export const guestUserStatusChange = (state: boolean) => {
  return {
    type: guestUserActionTypes.GUEST_USER_FLAG,
    guestUser: state,
  };
};
