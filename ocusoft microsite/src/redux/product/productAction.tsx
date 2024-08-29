import { productActionTypes } from "./productTypes";

export const setCartCountAction = (count: number) => {
  return {
    type: productActionTypes.SET_CART_COUNT,
    payload: count,
  };
};