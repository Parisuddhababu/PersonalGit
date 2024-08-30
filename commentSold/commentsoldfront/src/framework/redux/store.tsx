"use client";

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import commonSlice from './reducers/commonSlice';

const rootReducer = combineReducers({
  common: commonSlice,
});

const store = configureStore({
  reducer: rootReducer,
});
export default store;