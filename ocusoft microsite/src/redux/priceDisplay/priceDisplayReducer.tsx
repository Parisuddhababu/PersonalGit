import { priceDisplayActionType } from "./priceDisplayTypes";

const initialState = {
  priceDisplay: true,
};

export interface ITypes {
  type?: any;
  payload?: string;
  loader?: boolean;
}

export interface IPriceDisplayState {
  priceDisplay: boolean,
}

export const priceDisplayReducer = (
  state : IPriceDisplayState,
  { type, payload, loader }: ITypes
) => {
  const newState = state ?? initialState
  switch (type) {
    case priceDisplayActionType.INITIAL_ADD_DATA:
      return { ...newState, loadingState: loader };
    case priceDisplayActionType.SET_IS_PRICE_DISPLAY:
      return { ...newState, priceDisplay: payload, loadingState: loader };
    default:
      return newState;
  }
};

export default priceDisplayReducer;
