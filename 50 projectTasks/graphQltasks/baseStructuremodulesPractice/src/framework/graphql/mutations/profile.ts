import { gql } from "@apollo/client";

export const  UPDATE_USER_PROFILE=gql`
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

export const CHANGE_PASSWORD=gql`
mutation Mutation($oldPassword: String, $newPassword: String, $confirmPasssword: String) {
  changeUserProfilePassword(oldPassword: $oldPassword, newPassword: $newPassword, confirmPasssword: $confirmPasssword) {
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
}`