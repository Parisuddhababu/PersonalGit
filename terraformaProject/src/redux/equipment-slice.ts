/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const initialState: EquipmentSliceType = {
    volumeData:{} ,
    volumeDataForDiversionReport:{}
};

const equipmentSlice = createSlice({
    name: 'equipmentDetails',
    initialState,
    reducers: {
        setVolumeData: (state, action) => {
            state.volumeData = action.payload;
        },
        setVolumeDataForDiversionReport:(state,action)=>{
            state.volumeDataForDiversionReport = action.payload;
        }
    },
});

export const { setVolumeData,setVolumeDataForDiversionReport } = equipmentSlice.actions;
export default equipmentSlice.reducer;

export type EquipmentSliceType = {
    volumeData:{[key:string]:number},
    volumeDataForDiversionReport:{[key:string]:{[key:string]:string}}
}
