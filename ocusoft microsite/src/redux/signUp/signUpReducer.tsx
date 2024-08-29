import { ActionTypes } from "./signUpTypes";

// Demo Flow Of redux with redux thunk middleware


const initialState = {
  listData: [],
};

export const signUpReducer = (state : any, { type, payload }: any) => {
  const newState = state ?? initialState
  switch (type) {
    case ActionTypes.FETCH_LIST_DATA:
      return { ...newState, loading: true };
    case ActionTypes.ADD_LIST_DATA_SUCCESS:
      return { ...newState, listData: payload, loading: false };
    case ActionTypes.ADD_LIST_DATA_SUCCESS:
      return { ...newState, loading: true };
    default:
      return newState;
  }
};

export default signUpReducer;
