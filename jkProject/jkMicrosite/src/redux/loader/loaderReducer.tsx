import { loaderActionTypes } from "./loaderTypes";

const initialState = {
    loadingState: false,
};

export const loaderReducer = (state = initialState, { type, loader }: any) => {
  switch (type) {
    case loaderActionTypes.SET_LOADER:
      return { ...state, loadingState: loader };

    default:
      return state;
  }
};

export default loaderReducer;
