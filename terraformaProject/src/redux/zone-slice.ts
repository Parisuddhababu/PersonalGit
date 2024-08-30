/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import { ZoneDataArr } from 'src/types/zoneManagement';

const initialState: zoneSliceType= {
    existingZones: [
      {
        uuid:'',
        name: '',
        diversion_percentage: ''
      },
    ],
    openPopUp:false,
    buttonContent:'',
    zones:[],
    zonesPaginationCount:0,
    activeLocationsDataArray:[],
    hideAndShowInputs:false,
    popupContent:'',
  }

const zoneSlice = createSlice({
    name: 'zoneDetails',
    initialState,
    reducers: {
        setZoneData: (state, action) => {
            state.existingZones = action.payload;
        },
        setOpenPopUp:(state,action)=>{
          state.openPopUp = action.payload;
        },
        setButtonContent:(state,action)=>{
          state.buttonContent = action.payload;
         
        },
        setZones:(state,action)=>{
          state.zones = action.payload;
        },
        setZonesPaginationCount:(state,action)=>{
          state.zonesPaginationCount = action.payload;
        },
        setActiveLocationsDataArray:(state,action)=>{
          state.activeLocationsDataArray = action.payload;
        },
        setHideAndShowInputs:(state,action)=>{
          state.hideAndShowInputs = action.payload;
        },
        setPopUpConetent:(state,action)=>{
          state.popupContent=action.payload;
        }

    },
});

export const { setZoneData,setOpenPopUp,setButtonContent,setZones,setZonesPaginationCount,setActiveLocationsDataArray ,setPopUpConetent} = zoneSlice.actions;
export default zoneSlice.reducer;

export type zoneSliceType = {
    existingZones: {
      uuid:string;
      name: string;
      diversion_percentage: number|string;
    }[];
    openPopUp:boolean;
    buttonContent:string;
    zones:ZoneDataArr[];
    zonesPaginationCount:number;
    activeLocationsDataArray:string[];
    hideAndShowInputs:boolean;
    popupContent:string;
  } 