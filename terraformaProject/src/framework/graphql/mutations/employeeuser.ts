import { gql } from '@apollo/client';

export const DELETE_EMPLOYEE_USER = gql`
  mutation DeleteSubscriberEmployeeUser($subscriberUserId: String!, $userData: DeleteUserDto) {
    deleteSubscriberEmployeeUser(subscriberUserId: $subscriberUserId, userData: $userData) {
      message
    }
  }
`

export const DELETE_TENANT_COMPANY = gql`
mutation DeleteTenantCompany($tenantBranchId: String!, $tenantCompanyId: String!) {
  deleteTenantCompany(tenantBranchId: $tenantBranchId, tenantCompanyId: $tenantCompanyId) {
    message
  }
}
`

export const DELETE_CONTRACTOR_COMPANY = gql`
mutation DeleteContractorCompany($contractorBranchId: String!, $contractorCompanyId: String!) {
  deleteContractorCompany(contractorBranchId: $contractorBranchId, contractorCompanyId: $contractorCompanyId) {
    message
  }
}`