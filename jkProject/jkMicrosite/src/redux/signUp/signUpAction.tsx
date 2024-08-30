import axios from "axios";
import { ActionTypes } from "./signUpTypes";


// Demo Flow Of redux with redux thunk middleware


export const dataAdditionAction = (listData: any) => {
  return (dispatch: any) => {
    dispatch(fetchingStart())
    axios
      .get("https://jsonplaceholder.typicode.com/comments")
      .then((res) => {
        if (res.data) {
          dispatch(addFormDataSuccess(listData));
        }
      })
      .catch(() => {
        dispatch(addFormDataFailure);
      });
  };
};

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

export const addFormDataSuccess = (listdata: any) => {
  return {
    type: ActionTypes.ADD_LIST_DATA_SUCCESS,
    payload: listdata,
  };
};
