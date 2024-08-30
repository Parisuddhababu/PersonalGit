import { configureStore } from "@reduxjs/toolkit";
import glassSlice from "./waterSlice";

const store = configureStore({
  reducer: { selectBottle: glassSlice },
});
export default store;
