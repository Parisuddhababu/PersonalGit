/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const initialState: AddWeightType = {
    compactorLifts: [],
    volumeDataForWeights:{},
    frequencyData:{},
    materialData:{},
    liftIndex:undefined,
    compactorUuid:'',
    isSaveDraft:false,
    frequencyTime:'',
};

const addWeightSlice = createSlice({
    name: 'addWeightsDetails',
    initialState,
    reducers: {
        setCompactorLifts: (state, action) => {
            state.compactorLifts = [...state.compactorLifts,action.payload];
        },
        setVolumeDataForWeights:(state,action)=>{
            state.volumeDataForWeights = action.payload;
        },
        setFrequencyData:(state,action)=>{
            state.frequencyData=action.payload;
        },
        setMaterailData:(state,action)=>{
            state.materialData=action.payload
        },
        setLiftIndex:(state,action)=>{
            state.liftIndex=action.payload
        },
        setCompactorUuid:(state,action)=>{
            state.compactorUuid=action.payload;
        },
        setIsSaveDraft:(state,action)=>{
            state.isSaveDraft=action.payload
        },
        setFrequencyTime:(state,action)=>{
            state.frequencyTime=action.payload
        }
    },
});

export const { setCompactorLifts,setVolumeDataForWeights,setFrequencyData ,setMaterailData,setLiftIndex,setCompactorUuid,setIsSaveDraft,setFrequencyTime} = addWeightSlice.actions;
export default addWeightSlice.reducer;

export type AddWeightType = {
    compactorLifts: {name:string,uuid:string,weight:number,date:string}[],
    volumeDataForWeights:{[key:string]:{ volume: string; uuid:string; cubic:number,equipment:string}},
    frequencyData:{[key:string]:number},
    materialData:{[key:string]:number},
    liftIndex:undefined|number,
    compactorUuid:string;
    isSaveDraft:boolean;
    frequencyTime:string;
}
