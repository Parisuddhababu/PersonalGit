import { configureStore } from "@reduxjs/toolkit";
import regFormSlice from "./regFormSlice";

const store = configureStore({
  reducer: { regForm: regFormSlice },
});
export default store;
