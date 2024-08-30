import { gql } from '@apollo/client';

export const CONTRACTOR_MANAGEMENT_LISTING = gql `
query GetTenantsContractorsCompaniesWithPagination($userData: GetCompanyTypeDto!) {
  getTenantsContractorsCompaniesWithPagination(userData: $userData) {
    message
    data {
      data {
        status
        company {
          uuid
          name
          description
          type
          attachments
          website_url          
          industryType {
            uuid
            name
            description
          }
          tenantContractorType {
            uuid
            name
            description
            type
          }
        }
        branch {
          uuid
          location
          status
        }        
        user_count
      }
      count
    }
  }
}
`


