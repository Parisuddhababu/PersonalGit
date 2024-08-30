import { CurrencySymbolActionType } from "./currencySymbolTypes";

const initialState = {
  currencySymbol: null,
};

export interface ITypes {
  type?: any;
  payload?: string;
  loader?: boolean;
}

export const currencySymbolReducer = (
  state = initialState,
  { type, payload, loader }: ITypes
) => {
  switch (type) {
    case CurrencySymbolActionType.INITIAL_ADD_DATA:
      return { ...state, loadingState: loader };
    case CurrencySymbolActionType.SET_CURRENCY_SYMBOL:
      return { ...state, currencySymbol: payload, loadingState: loader };
    default:
      return state;
  }
};

export default currencySymbolReducer;
