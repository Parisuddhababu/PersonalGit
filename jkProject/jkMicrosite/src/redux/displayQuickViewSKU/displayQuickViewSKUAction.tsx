import { IAPIData } from "@type/Common/Base";
import { Dispatch } from "redux";
import { displayQuickViewSKUActionType } from "./displayQuickViewSKUTypes";

export const Action_UpdateDisplayQuickViewSKUReducer = (data: IAPIData) => {
  return (dispatch: Dispatch) => {
    dispatch(dataUpdateFunction(data));
  };
};

const dataUpdateFunction = (data: IAPIData) => {
  return {
    type: displayQuickViewSKUActionType.SET_SHOW_DATA_QUICK_VIEW_SKU,
    payload: data,
    loader: false,
  };
};
