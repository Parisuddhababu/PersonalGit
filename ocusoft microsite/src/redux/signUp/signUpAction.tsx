import { ActionTypes } from "./signUpTypes";


export const addFormDataFailure = () => {
  return {
    type: ActionTypes.ADD_LIST_DATA_FAIL,
  };
};

export const fetchingStart = () => {
  return {
    type: ActionTypes.FETCH_LIST_DATA
  }
}


