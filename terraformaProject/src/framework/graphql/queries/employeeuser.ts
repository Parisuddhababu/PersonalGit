import { gql } from '@apollo/client';
export const FETCH_EMPLOYEE_USER_LIST = gql `
query GetSubscriberEmployeesUserListWithPagination($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getSubscriberEmployeesUserListWithPagination(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      message
      data {
        employee {
          email
          uuid
          status
          first_name
          last_name
          user_type
          phone_number
          country_code {
            id
            uuid
            name
            countryCode
            phoneCode
          }
          department
          company_id {
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
          }
          user_roles {
            uuid
            role_id {
              uuid
              name
              description
              status
            }
          }
          user_branches {
            uuid
            branch {
              location
              city
              uuid
            }
          }
        }
        count
      }
    }
  }`


export const FETCH_EMPLOYEE_USER_LIST_VIEW = gql `
query GetSubscriberEmployeeById($subscriberUserId: String!, $userType: Float) {
  getSubscriberEmployeeById(subscriberUserId: $subscriberUserId, userType: $userType) {
    message
    data {
      uuid
      email
      pronounce
      first_name
      last_name
      phone_number
      country_code {
        id
        uuid
        name
        countryCode
        phoneCode
      }
      preferred_language
      location
      department
      user_roles {
        uuid
        role_id {
          uuid
          name
          description
          status
        }
      }
      reporting_manager_id {
        id
        email
        uuid
        status
        pronounce
        position
        first_name
        last_name
        phone_number
        country_code
        profile_picture
        preferred_language
        educational_interests
        organization
        location
        department
        reporting_manager_id
        user_type
        company_id
        branch_id
        subscriber_id {
          uuid
          first_name
          last_name 
          company_name
          address
          phone_number
          logo
          subscribe_start
          subscribe_end
          email
          status
        }
      }
    }
  }
}
`

export const FETCH_TENANT_COMPANY_LIST = gql `
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