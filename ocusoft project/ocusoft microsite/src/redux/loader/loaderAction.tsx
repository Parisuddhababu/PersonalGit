import { loaderActionTypes } from "./loaderTypes";

export const setLoader = (state: boolean) => {
  return {
    type: loaderActionTypes.SET_LOADER,
    loader: state,
  };
};