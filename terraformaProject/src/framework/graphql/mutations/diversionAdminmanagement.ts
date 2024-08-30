import { gql } from '@apollo/client';

export const UPDATE_DIVERSION_REPORT_ADMIN= gql`mutation UpdateDiversionReportAdmin($diversionAdminData: UpdateDiversionReportAdminDto!) {
    updateDiversionReportAdmin(diversionAdminData: $diversionAdminData) {
      message
      data {   
        location {
          uuid
          location
          city
        }
        user {
          uuid
          first_name
          last_name
        }
      }
    }
  }`;

  export const GET_USER_BY_LOCATION_ID = gql`mutation GetUserByLocationId($locationId: String!) {
    getUserByLocationId(locationId: $locationId) {
      message
      data {
        user {
          first_name
          last_name
          user_type
          uuid
        }
      }
    }
  }
  `;