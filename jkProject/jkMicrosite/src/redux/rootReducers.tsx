// Demo Flow Of redux with redux thunk middleware

import { combineReducers } from "redux";
import signUpReducer from "./signUp/signUpReducer";
import signInReducer from "./signIn/signInReducer";
import currencySymbolReducer from "./currencySymbol/currencySymbolReducer";
import priceDisplayReducer from "./priceDisplay/priceDisplayReducer";
import loaderReducer from "./loader/loaderReducer";
import guestUserReducer from "./guestUser/guestUserReducer";
import displayQuickViewSKUReducer from "./displayQuickViewSKU/displayQuickViewSKUReducer";
import WhatsAppReducer from "./whatsApp/whatsAppReducer";

const rootReducer = combineReducers({
  signup: signUpReducer,
  signIn: signInReducer,
  currencyData: currencySymbolReducer,
  priceDisplayData: priceDisplayReducer,
  loaderRootReducer: loaderReducer,
  guestUserRootReducer: guestUserReducer,
  displayQuickViewSKUReducer: displayQuickViewSKUReducer,
  whatsAppReducer: WhatsAppReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
