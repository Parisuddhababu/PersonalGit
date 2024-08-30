import { IAPIData } from "@type/Common/Base";
import { Dispatch } from "redux";
import { CurrencySymbolActionType } from "./currencySymbolTypes";

export const Action_UpdateCurrencySymbol = (data: IAPIData) => {
  return (dispatch: Dispatch) => {
    dispatch(dataUpdateFunction(data));
  };
};

const dataUpdateFunction = (data: IAPIData) => {
  return {
    type: CurrencySymbolActionType.SET_CURRENCY_SYMBOL,
    payload: data,
    loader: false,
  };
};
