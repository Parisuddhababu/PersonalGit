/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import { DiversionReportTemplateRes } from 'src/types/diversionReporttemplate';


const initialState: DiversionReportTemplateSliceType = {
    popupType: '',
    locationId:'',
    diversionTemplateData:null,
};

const diversionReportTemplateSlice = createSlice({
    name: 'diversionReportTemplateDetail',
    initialState,
    reducers: {
        setPopupType: (state, action) => {
            state.popupType = action.payload;
        },
        setLocationId:(state,action)=>{
            state.locationId=action.payload;
        },
        setDiversionTemplateData:(state,action)=>{
            state.diversionTemplateData=action.payload;
        }

    },
});

export const { setPopupType ,setLocationId,setDiversionTemplateData } = diversionReportTemplateSlice.actions;
export default diversionReportTemplateSlice.reducer;

export type DiversionReportTemplateSliceType = {
    popupType: string,
    locationId:string,
    diversionTemplateData:{count:number; diversionReport:DiversionReportTemplateRes[]}|null
}
