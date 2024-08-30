import { priceDisplayActionType } from "./priceDisplayTypes";

const initialState = {
  priceDisplay: true,
  productDetails: {}
};

export interface ITypes {
  type?: any;
  payload?: string;
  loader?: boolean;
  productDetails?: any;
}

export const priceDisplayReducer = (
  state = initialState,
  { type, payload, loader }: ITypes
) => {
  switch (type) {
    case priceDisplayActionType.INITIAL_ADD_DATA:
      return { ...state, loadingState: loader };
    case priceDisplayActionType.SET_IS_PRICE_DISPLAY:
      return { ...state, priceDisplay: payload, loadingState: loader };
    case priceDisplayActionType.PRODUCT_DATA:
      return { ...state, productDetails: payload, };
    default:
      return state;
  }
};

export default priceDisplayReducer;
