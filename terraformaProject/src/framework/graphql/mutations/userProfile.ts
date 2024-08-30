import { gql } from '@apollo/client';
export const CHANGE_USERPROFILE_PASSWORD = gql`
mutation ChangePassword($userData: ChangePasswordDto!) {
    changePassword(userData: $userData) {
      message
    }
  }`

export const UPDATE_USER_PROFILE = gql`
mutation UpdateUser($userId: String!, $userData: UpdateUserDetailsDto!) {
  updateUser(userId: $userId, userData: $userData) {
    message
    
  }
}`
  
  
