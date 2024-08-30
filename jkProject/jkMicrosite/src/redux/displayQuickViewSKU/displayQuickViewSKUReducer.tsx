import { displayQuickViewSKUActionType } from "./displayQuickViewSKUTypes";

const initialState = {
  showProductSku: true,
  showQuickView: true,
  showAddToCart : true
};

export interface ITypes {
  type?: any;
  payload?: {
    showProductSku?: boolean;
    showQuickView?: boolean;
    showAddToCart?: boolean;
  };
  loader?: boolean;
}

export const displayQuickViewSKUReducer = (
  state = initialState,
  { type, payload, loader }: ITypes
) => {
  switch (type) {
    case displayQuickViewSKUActionType.INITIAL_ADD_DATA:
      return { ...state, loadingState: loader };
    case displayQuickViewSKUActionType.SET_SHOW_DATA_QUICK_VIEW_SKU:
      return {
        ...state,
        showProductSku: payload?.showProductSku,
        showQuickView: payload?.showQuickView,
        showAddToCart: payload?.showAddToCart,
        loadingState: loader,
      };
    default:
      return state;
  }
};

export default displayQuickViewSKUReducer;
