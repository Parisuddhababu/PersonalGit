/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import { DiversionReportHistoryRes } from 'src/types/diversionReport';


const initialState: DiversionReportHistorySliceType = {
 
    locationId:'',
    diversionReportHistroyData:null,
};

const diversionReportHistorySlice = createSlice({
    name: 'diversionReportHistoryDetails',
    initialState,
    reducers: {
        setHistoryLocationId:(state,action)=>{
            state.locationId=action.payload;
        },
        setDiversionHistroyData:(state,action)=>{
            state.diversionReportHistroyData=action.payload;
        }

    },
});

export const { setHistoryLocationId,setDiversionHistroyData } = diversionReportHistorySlice.actions;
export default diversionReportHistorySlice.reducer;

export type DiversionReportHistorySliceType = {
    locationId:string,
    diversionReportHistroyData:DiversionReportHistoryRes|null
}
