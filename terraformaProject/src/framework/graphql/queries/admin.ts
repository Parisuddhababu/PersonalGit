import { gql } from '@apollo/client';

export const GET_ADMIN = gql`
  query GetProfileInformation {
    getProfileInformation {
      data {
        id
        uuid
        first_name
        middle_name
        last_name
        user_name
        email
        gender
        date_of_birth
        phone_no
        phone_country_id
        role
        profile_img
        device_type
        status
        user_role_id
        created_at
        updated_at
      }
      meta {
        message
        messageCode
        statusCode
        status
        type
        errors {
          errorField
          error
        }
        errorType
      }
    }
  }
`;

export const GET_ANNOUNCEMENT_COUNT = gql `
  query GetAnnouncementCount {
    getAnnouncementCount {
      message
      data {
        count
      }
    }
  }
`;

export const SUPER_ADMIN_CHANGE_PASSWORD = gql` mutation SuperAdminChangePassword($userData: SuperAdminChangePasswordDto!) {
  superAdminChangePassword(userData: $userData) {
    message
  }
}`