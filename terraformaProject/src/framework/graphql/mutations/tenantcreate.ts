import { gql } from '@apollo/client';

export const CREATE_COMPANY_TENANT = gql`
mutation CreateCompanyTenantUser($userData: CreateUserWithCompanyDto!) {
  createCompanyTenantUser(userData: $userData) {
    message
    data {
      uuid
      name      
    }
  }
}
`

export const UPDATE_COMPANY_TENANT = gql`
mutation UpdateTenantCompany($tenantCompanyData: UpdateCompanyDto!, $tenantCompanyId: String!) {
  updateTenantCompany(tenantCompanyData: $tenantCompanyData, tenantCompanyId: $tenantCompanyId) {
    message
  }
}
`

export const CREATE_COMPANY_CONTRACTOR = gql`
mutation CreateCompanyContractorUser($userData: CreateUserWithCompanyDto!) {
  createCompanyContractorUser(userData: $userData) {
    message
    data {
      uuid
    }
  }
}
`