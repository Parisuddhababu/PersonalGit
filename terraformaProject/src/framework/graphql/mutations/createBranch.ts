import { gql } from '@apollo/client';

export const CREATE_NEW_BRANCH = gql`
  mutation CreateCompanyBranch($companyBranchData: CreateCompanyBranchDto!) {
    createCompanyBranch(companyBranchData: $companyBranchData) {
      message
      data {
        uuid
      }
    }
  }
`

export const DELETE_EMPLOYEE_USER = gql`
  mutation DeleteSubscriberEmployeeUser($subscriberUserId: String!, $userData: DeleteUserDto) {
    deleteSubscriberEmployeeUser(subscriberUserId: $subscriberUserId, userData: $userData) {
      message
    }
  }
`