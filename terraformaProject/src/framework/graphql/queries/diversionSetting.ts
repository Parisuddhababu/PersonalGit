import { gql } from '@apollo/client';

export const UPDATE_DIVERSION_REPORT_SETTINGS = gql`mutation UpdateDiversionReportSettings($diversionSettingsData: UpdateDiversionReportSettingsDto!) {
    updateDiversionReportSettings(diversionSettingsData: $diversionSettingsData) {
      message
      data {
        frequency
        start_date
        end_date
        start_month
        end_month
      }
    }
  }`;

  export const GET_DIVERSION_REPORT_SETTING_BY_ID = gql`mutation GetDiversionReportSettingById($locationId: String!) {
    getDiversionReportSettingById(locationId: $locationId) {
      message
      data {
        frequency
        start_date
        end_date
        start_month
        end_month
      }
    }
  }`;