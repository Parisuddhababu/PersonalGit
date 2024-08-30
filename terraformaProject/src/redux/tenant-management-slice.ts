/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const initialState: YourStateType = {
    getCompanyTenantDetails: [],
    getCompanyContractorDetails: [],
};

const resetInitialState: YourStateType = {
    getCompanyTenantDetails: [],
    getCompanyContractorDetails: [],
};

const tenantManagementSlice = createSlice({
    name: 'tenantManagementDetails',
    initialState,
    reducers: {
        setGetCompanyTenantDetails(state, action){
            state.getCompanyTenantDetails = action.payload;
        },
        setGetCompanyContractorDetails(state, action) {
            state.getCompanyContractorDetails = action.payload;
        },
        setResetAllTenantData: () => {
            return resetInitialState;
        }
    },
});

export const { setGetCompanyTenantDetails, setResetAllTenantData, setGetCompanyContractorDetails } = tenantManagementSlice.actions;
export default tenantManagementSlice.reducer;

export type YourStateType = {
    getCompanyTenantDetails: [],
    getCompanyContractorDetails: []
}
