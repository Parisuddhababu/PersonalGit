import { configureStore } from "@reduxjs/toolkit";
import insectSlice from "./insectSlice";

const store = configureStore({
  reducer: { insect: insectSlice },
});
export default store;
