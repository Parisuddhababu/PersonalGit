import { Dispatch } from "redux";
import { loaderActionTypes } from "./loaderTypes";

export const setLoader = (state: boolean) => {
  return (dispatch: Dispatch) => {
    dispatch(loaderInitialize(state));
  };
};

export const loaderInitialize = (state: boolean) => {
  return {
    type: loaderActionTypes.SET_LOADER,
    loader: state,
  };
};
