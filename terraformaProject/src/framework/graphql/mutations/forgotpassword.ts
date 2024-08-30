import { gql } from '@apollo/client'
export const IS_REQUIRED_PASSWORD_CHANGE = gql`
mutation ChangePassword($userData: ChangePasswordDto!) {
    changePassword(userData: $userData) {
      message
    }
  }
`
