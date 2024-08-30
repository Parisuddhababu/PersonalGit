import { IAPIData } from "@type/Common/Base";
import { Dispatch } from "redux";
import { priceDisplayActionType } from "./priceDisplayTypes";

export const Action_UpdatePriceIsDisplay = (data: IAPIData) => {
  return (dispatch: Dispatch) => {
    dispatch(dataUpdateFunction(data));
  };
};

const dataUpdateFunction = (data: IAPIData) => {
  return {
    type: priceDisplayActionType.SET_IS_PRICE_DISPLAY,
    payload: data,
    loader: false,
  };
};
