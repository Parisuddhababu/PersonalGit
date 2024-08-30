
import { configureStore } from '@reduxjs/toolkit';
import coursesManagementSlice from './courses-management-slice';
import userRolesManagementSlice from './user-role-management-slice';
import userProfileSlice from './user-profile-slice';
import tenantManagementSlice from './tenant-management-slice';
import countrySlice from './country-slice';
import zoneSlice from './zone-slice';
import equipmentSlice from './equipment-slice';
import materialSlice from './material-slice';
import diversionReportTemplateSlice from './diversion-report-template-slice';
import diversionAdminSlice from './diversion-admin-slice';
import diversionContractorSlice from './diversion-contractor-slice';
import addWeightsSlice from './addWeights-slice';
import diversionReportHistorySlice from './diversionHistory-slice';
const store = configureStore({
  reducer: {
    coursesManagement: coursesManagementSlice,
    rolesManagement: userRolesManagementSlice,
    userProfile: userProfileSlice,
    tenantDetails: tenantManagementSlice,
    country: countrySlice,
    zoneManagement:zoneSlice,
    equipmentManagement:equipmentSlice,
    materialManagement:materialSlice,
    diversionReportTemplate:diversionReportTemplateSlice,
    diversionAdminManagement:diversionAdminSlice,
    diversionContractors:diversionContractorSlice,
    addWeightsManagement:addWeightsSlice,
    diversionReportHistroyManagement:diversionReportHistorySlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;