/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const initialState: countryType = {
    countryData: '',
};

const countrySlice = createSlice({
    name: 'countryDetail',
    initialState,
    reducers: {
        setCountryData: (state, action) => {
            state.countryData = action.payload;
        }
    },
});

export const { setCountryData } = countrySlice.actions;
export default countrySlice.reducer;

export type countryType = {
    countryData: string,
}
