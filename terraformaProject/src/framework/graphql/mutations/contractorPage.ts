import { gql } from '@apollo/client';
export const CHANGE_CONTRACTOR_STATUS =gql`
mutation ActiveInActiveCompany($branchId: String!, $companyId: String!) {
  activeInActiveCompany(branchId: $branchId, companyId: $companyId) {
    message
  }
}`
export const UPDATE_CONTRACTOR =gql`
mutation UpdateContractorCompany($contractorCompanyData: UpdateCompanyDto!, $contractorCompanyId: String!) {
  updateContractorCompany(contractorCompanyData: $contractorCompanyData, contractorCompanyId: $contractorCompanyId) {
    message
    data {
      name
      website_url
      industryType {
        uuid
        name
        description
      }
      address
      description
      attachments
      first_name
      last_name
      phone_number
      position
    }
  }
}`

export const CHANGE_EMPLOYEE_STATUS =gql`
  mutation ActiveInactiveEmployee($subscriberUserId: String!) {
    activeInactiveEmployee(subscriberUserId: $subscriberUserId) {
      message
    }
  }  
`