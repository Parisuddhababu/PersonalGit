/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const initialState: materialSliceType = {
    materialDetails:[ {
        type: '',
        weight: ''
    },] ,
};

const materialSlice = createSlice({
    name: 'materialDetails',
    initialState,
    reducers: {
        setInputFields: (state, action) => {
            state.materialDetails = action.payload;
        }
    },
});

export const { setInputFields } = materialSlice.actions;
export default materialSlice.reducer;

export type materialSliceType = {
    materialDetails:{type:string; weight:number|string}[],
}
