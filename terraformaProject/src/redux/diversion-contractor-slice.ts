/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import {  DiversionContractorsRes, DiversionReportServicesListRes } from 'src/types/diversionContractors';


const initialState: DiversionContractorType = {
    contractorData:null ,
    isOpenDiversionTemplateSelectionPopup:false,
    createDiversionReportTableViewData:[],
    selectedTemplateIds:[],
    locationId:'',
    deleteServiceIds:[],
    frequencyId:''
};

const diversionContractorSlice = createSlice({
    name: 'contractorDetail',
    initialState,
    reducers: {
        setDiversionContractorData: (state, action) => {
            state.contractorData = action.payload;
        },
        setIsOpenDiversionTemplateSelectionPopup:(state,action)=>{
            state.isOpenDiversionTemplateSelectionPopup=action.payload;
        },
        setCreateDiversionReportTableViewData:(state,action)=>{
            state.createDiversionReportTableViewData =[ ...state.createDiversionReportTableViewData,...action.payload];
        },
        setSelectedTemplateIds:(state,action)=>{
            state.selectedTemplateIds= [...state.selectedTemplateIds,...action.payload];
        },
        setResetDeleteIds:(state,action)=>{
            state.deleteServiceIds=action.payload
        },
        setDeleteDiversionReportTableViewData:(state,action)=>{
            if(action.payload.serviceId!=''){
                state.deleteServiceIds= [...state.deleteServiceIds,action.payload.serviceId]
            }
            state.createDiversionReportTableViewData =state.createDiversionReportTableViewData?.filter((_,index)=>index!==action.payload.index);
            state.selectedTemplateIds = state.selectedTemplateIds.filter((id)=>id!==action.payload.templateId);
        },
        setLocationId:(state,action)=>{
            state.locationId=action.payload;
        },
        setResetCreateDiversionReportTableViewData:(state,action)=>{
            state.createDiversionReportTableViewData=action.payload;
        },
        setFrequecyId:(state,action)=>{
            state.frequencyId=action.payload;
        },
        setResetSelectionIds:(state,action)=>{
            state.selectedTemplateIds=action.payload;
        }


    },
});

export const { setDiversionContractorData,setIsOpenDiversionTemplateSelectionPopup,setCreateDiversionReportTableViewData,setSelectedTemplateIds,setDeleteDiversionReportTableViewData,setLocationId,setResetCreateDiversionReportTableViewData,setResetDeleteIds,setFrequecyId,setResetSelectionIds} = diversionContractorSlice.actions;
export default diversionContractorSlice.reducer;

export type DiversionContractorType = {
    contractorData: DiversionContractorsRes|null,
    isOpenDiversionTemplateSelectionPopup:boolean;
    createDiversionReportTableViewData:DiversionReportServicesListRes[];
    selectedTemplateIds:string[];
    locationId:string;
    deleteServiceIds:string[];
    frequencyId:string
}
