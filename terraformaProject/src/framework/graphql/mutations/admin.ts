import { gql } from '@apollo/client';

export const  UPDATE_ADMIN_PROFILE=gql`
mutation UpdateUserProfile($firstName: String, $lastName: String) {
    updateUserProfile(first_name: $firstName, last_name: $lastName) {
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
`
export const CHANGE_USERPROFILE_PASSWORD=gql`
mutation ChangePassword($userData: ChangePasswordDto!) {
  changePassword(userData: $userData) {
    message
  }
}
`