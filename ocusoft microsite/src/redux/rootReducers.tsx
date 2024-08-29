// Demo Flow Of redux with redux thunk middleware

import { combineReducers } from "redux";
import signup from "./signUp/signUpReducer";
import signIn from "./signIn/signInReducer";
import currencyData from "./currencySymbol/currencySymbolReducer";
import priceDisplayData from "./priceDisplay/priceDisplayReducer";
import loaderRootReducer from "./loader/loaderReducer";
import whatsAppReducer from "./whatsApp/whatsAppReducer";
import productReducer from "./product/productReducer";

const rootReducer = combineReducers({
  signup,
  signIn,
  currencyData,
  priceDisplayData,
  loaderRootReducer,
  whatsAppReducer,
  productReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
