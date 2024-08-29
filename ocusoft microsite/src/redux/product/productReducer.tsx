import { productActionTypes } from "./productTypes";

const initialState = {
  cartCount: 0,
};

export interface ProductState {
  cartCount: number
}

export const productReducer = (state: ProductState, { type, payload }: any) => {
  const newState = state ?? initialState
  if (type === productActionTypes.SET_CART_COUNT) {
    return { ...newState, cartCount: payload };
  } else {
    return newState;
  }
};

export default productReducer;
