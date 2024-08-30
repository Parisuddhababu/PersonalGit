"use client";

import { createSlice } from "@reduxjs/toolkit";
import { CommonStateType } from "../redux";

const initialState: CommonStateType = {
    loading: true,
    landingPage: undefined,
    openLandingPageForm: false,
    showLandingPagePlans: false,
    headerMenu: true,
    userDetails: undefined,
    insightId: '',
    userType: 'influencer',
    isWhiInfluencer: false,
    brandName: '',
    isUserHaveActivePlan: false
};

export const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        setLoadingState(state, action) {
            state.loading = action.payload;
        },
        setLandingPageState(state, action) {
            state.landingPage = action.payload;
        },
        setHeaderMenuState(state, action) {
            state.headerMenu = action.payload;
        },
        setUserDetailsState(state, action) {
            state.userDetails = action.payload;
        },
        setInsightIdState(state, action) {
            state.insightId = action.payload
        },
        setUserType(state, action) {
            state.userType = action.payload
        },
        setIsBrandInfluencer(state, action) {
            state.isWhiInfluencer = action.payload
        },
        setBrandName(state, action) {
            state.brandName = action.payload
        },
        setIsUserHaveActivePlan(state, action) {
            state.isUserHaveActivePlan = action.payload
        },
        setOpenLandingPageForm(state, action) {
            state.openLandingPageForm = action.payload
        },
        setShowLandingPagePlans(state, action) {
            state.showLandingPagePlans = action.payload
        }
    }
});

export const { setLoadingState, setLandingPageState, setHeaderMenuState, setUserDetailsState, setInsightIdState, setUserType, setIsBrandInfluencer, setBrandName, setIsUserHaveActivePlan, setOpenLandingPageForm, setShowLandingPagePlans } = commonSlice.actions;
export default commonSlice.reducer; 