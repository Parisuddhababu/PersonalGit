import { loaderActionTypes } from "./loaderTypes";

const initialState = {
    loadingState: false,
};

export interface ILoadingState {
  loadingState : boolean
}

export const loaderReducer = (state : ILoadingState, { type, loader }: any) => {
  const newState = state ?? initialState
  if (type === loaderActionTypes.SET_LOADER) {
    return { ...newState, loadingState: loader };
  } else {
    return newState;
  }
};

export default loaderReducer;
