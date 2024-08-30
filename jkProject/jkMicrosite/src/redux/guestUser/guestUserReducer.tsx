import { getUserDetails } from "@util/common";
import { guestUserActionTypes } from "./guestUserTypes";

const initialState = {
  guestUserFlag: getUserDetails() !== "" ? false : true,
};

export const guestUserReducer = (
  state = initialState,
  { type, guestUser }: any
) => {
  switch (type) {
    case guestUserActionTypes.GUEST_USER_FLAG:
      return { ...state, guestUserFlag: guestUser };

    default:
      return state;
  }
};

export default guestUserReducer;
