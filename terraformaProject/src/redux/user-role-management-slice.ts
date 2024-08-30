/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const initialState: YourStateType = {
    userRolePermissionsData: [],
    rolePermission: {},
    subscriberManagement: {},
    category:{},
    technicalManualsGuides: {},
    companyDirectory: {},
    educationEngagement: {},
    course: {},
    educationInsights: {},
    dashboard: {},
    allCourses: {},
    templates: {},
    userManagement: {},
    employee: {},
    tenant: {},
    contractor: {},
};

const resetInitialState: YourStateType = {
    userRolePermissionsData: [],
    rolePermission: {},
    subscriberManagement: {},
    category:{},
    technicalManualsGuides: {},
    companyDirectory: {},
    educationEngagement: {},
    course: {},
    educationInsights: {},
    dashboard: {},
    allCourses: {},
    templates: {},
    userManagement: {},
    employee: {},
    tenant: {},
    contractor: {},
};

const userRolesManagementSlice = createSlice({
    name: 'userRolesManagementDetails',
    initialState,
    reducers: {
        setUserRolePermissionsData: (state, action) => {
            state.userRolePermissionsData = action.payload;
        },
        setRolePermission: (state, action) => {
            state.rolePermission = action.payload;
        },
        setSubscriberManagement: (state, action) => {
            state.subscriberManagement = action.payload;
        },
        setCategory: (state, action) => {
            state.category = action.payload;
        },
        setTechnicalManualsGuides: (state, action) => {
            state.technicalManualsGuides = action.payload;
        },
        setCompanyDirectory: (state, action) => {
            state.companyDirectory = action.payload;
        },
        setEducationEngagement: (state, action) => {
            state.educationEngagement = action.payload;
        },
        setCourse: (state, action) => {
            state.course = action.payload;
        },
        setEducationInsights: (state, action) => {
            state.educationInsights = action.payload;
        },
        setDashboard: (state, action) => {
            state.dashboard = action.payload;
        },
        setAllCourses: (state, action) => {
            state.allCourses = action.payload;
        },
        setTemplates: (state, action) => {
            state.templates = action.payload;
        },
        setResetAllUserRoleData: () => {
            return resetInitialState;
        },
        setUserManagement: (state, action) => {
            state.userManagement = action.payload;
        },
        setEmployee: (state, action) => {
            state.employee = action.payload;
        },
        setTenant: (state, action) => {
            state.tenant = action.payload;
        },
        setContractor: (state, action) => {
            state.contractor = action.payload;
        },
    },
});

export const { setUserRolePermissionsData, setEmployee, setTenant, setContractor, setUserManagement, setResetAllUserRoleData, setRolePermission, setSubscriberManagement, setCategory, setTechnicalManualsGuides, setCompanyDirectory, setEducationEngagement, setCourse, setEducationInsights, setDashboard, setAllCourses, setTemplates } = userRolesManagementSlice.actions;
export default userRolesManagementSlice.reducer;

export type YourStateType = {
    userRolePermissionsData: [],
    rolePermission: object,
    subscriberManagement: object,
    category:object,
    technicalManualsGuides: object,
    companyDirectory: object,
    educationEngagement: object,
    course: object,
    educationInsights: object,
    dashboard: object,
    allCourses: object,
    templates: object,
    userManagement: object,
    employee: object,
    tenant: object,
    contractor: object,
}
