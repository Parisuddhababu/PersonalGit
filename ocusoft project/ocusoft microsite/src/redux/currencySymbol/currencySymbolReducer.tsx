import { CurrencySymbolActionType } from "./currencySymbolTypes";

const initialState = {
  currencySymbol: null,
};

export interface ITypes {
  type?: any;
  payload?: string;
  loader?: boolean;
}

export interface ICurrencyState{
  currencySymbol: string,
  loadingState: boolean
}

export const currencySymbolReducer = (
  state : ICurrencyState,
  { type, payload, loader }: ITypes
) => {
  
  const newState = state ?? initialState
  switch (type) {
    case CurrencySymbolActionType.INITIAL_ADD_DATA:
      return { ...newState, loadingState: loader };
    case CurrencySymbolActionType.SET_CURRENCY_SYMBOL:
      return { ...newState, currencySymbol: payload, loadingState: loader };
    default:
      return newState;
  }
};

export default currencySymbolReducer;
