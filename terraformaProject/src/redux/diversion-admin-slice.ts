/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const initialState: DiversionAdminType = {
    locationName: '',
    fullName:'',
    updateLocationName:'',
    updateLocationId:''
};

const diversionAdminManagementSlice = createSlice({
    name: 'diversionAdminDetails',
    initialState,
    reducers: {
        setLocationName: (state, action) => {
            state.locationName = action.payload;
        },
        setFullName:(state,action) =>{
            state.fullName = action.payload;
        },
        setUpdateLocationName:(state,action)=>{
            state.updateLocationName=action.payload;
        },
        setUpdateLocationID:(state,action)=>{
            state.updateLocationId=action.payload;
        }
        

    },
});

export const { setLocationName ,setFullName,setUpdateLocationName,setUpdateLocationID} = diversionAdminManagementSlice.actions;
export default diversionAdminManagementSlice.reducer;

export type DiversionAdminType = {
    locationName: string;
    fullName:string;
    updateLocationName:string;
    updateLocationId:string;
}
