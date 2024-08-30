import { ActionTypes } from "./signUpTypes";

// Demo Flow Of redux with redux thunk middleware


const initialState = {
  listData: [],
};

export const signUpReducer = (state = initialState, { type, payload }: any) => {
  switch (type) {
    case ActionTypes.FETCH_LIST_DATA:
      return { ...state, loading: true };
    case ActionTypes.ADD_LIST_DATA_SUCCESS:
      return { ...state, listData: payload, loading: false };
    case ActionTypes.ADD_LIST_DATA_SUCCESS:
      return { ...state, loading: true };
    default:
      return state;
  }
};

export default signUpReducer;
