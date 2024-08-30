/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
const initialState: UserProfileType = {
    userProfileData: [],
    createEmployeeUserDetails: [],
    employeeDetailsData: [],
    companyType: 0,
    createNewCompany: false,
    selectFromExitingCompany: false,
    createTenantDetails: [],
    createContractorDetails: [],
    createTenantPersonalDetail: [],
    userProfileSaved: false,
    createNewContractor: false,
    selectFromExitingContractor: false,
    companyDetails: {},
    isIntroductoryPage: false,
    readAnnouncement: false,
};

const userProfileSlice = createSlice({
    name: 'userProfileDetail',
    initialState,
    reducers: {
        userProfileData: (state, action) => {
            state.userProfileData = action.payload;
        },
        userCreateEmployeeUserDetails: (state, action) => {
            state.createEmployeeUserDetails = action.payload;
        },
        userCreateEmployeeUserDetailsReset: (state) => {
            state.createEmployeeUserDetails = [];
        },
        userCompanyType: (state, action) => {
            state.companyType = action.payload;
        },
        setCreateNewCompany: (state, action) => {
            state.createNewCompany = action.payload;
        },
        setSelectFromExitingCompany: (state, action) => {
            state.selectFromExitingCompany = action.payload;
        },
        setCreateNewContractor: (state, action) => {
            state.createNewContractor = action.payload;
        },
        setSelectFromExitingContractor: (state, action) => {
            state.selectFromExitingContractor = action.payload;
        },
        setCreateTenantDetails: (state, action) => {
            state.createTenantDetails = action.payload;
        },
        setCreateContractorDetails: (state, action) => {
            state.createContractorDetails = action.payload;
        },
        setCreateTenantPersonalDetails: (state, action) => {
            state.createTenantPersonalDetail = action.payload;
        },
        setUserProfileSaved: (state, action) => {
            state.userProfileSaved = action.payload;
        },
        setEmployeeDetails: (state, action) => {
            state.employeeDetailsData = action.payload;
        },
        setResetAllUserData: (state) => {
            state.createEmployeeUserDetails = []
            state.employeeDetailsData = []
            state.companyType = 0
            state.createNewCompany = false
            state.selectFromExitingCompany = false
            state.createTenantDetails = []
            state.createContractorDetails = []
            state.createTenantPersonalDetail = []
            state.userProfileSaved = false
            state.createNewContractor = false
            state.selectFromExitingContractor = false
            state.companyDetails = {}
        },
        setCompanyDetails: (state, action) => {
            state.companyDetails = action.payload;
        },
        setIntroductoryPage: (state, action) => {
            state.isIntroductoryPage = action.payload
        },
        setReadAnnouncement: (state, action) => {
            state.readAnnouncement = action.payload
        },
    },
});

export const { userProfileData, setCompanyDetails, setReadAnnouncement, setCreateContractorDetails, setResetAllUserData, userCompanyType, setCreateNewContractor, setSelectFromExitingContractor, setEmployeeDetails, setSelectFromExitingCompany, setCreateNewCompany, userCreateEmployeeUserDetails, userCreateEmployeeUserDetailsReset, setCreateTenantDetails, setCreateTenantPersonalDetails, setUserProfileSaved, setIntroductoryPage } = userProfileSlice.actions;
export default userProfileSlice.reducer;

export type UserProfileType = {
    userProfileData?: [],
    createEmployeeUserDetails: [],
    companyType: number,
    createNewCompany: boolean,
    selectFromExitingCompany: boolean,
    createTenantDetails: [],
    createTenantPersonalDetail: [],
    userProfileSaved: boolean,
    employeeDetailsData: [],
    createNewContractor: boolean,
    selectFromExitingContractor: boolean
    createContractorDetails: [],
    companyDetails: object,
    isIntroductoryPage: boolean,
    readAnnouncement: boolean,
}
