import { gql } from '@apollo/client';

export const GET_COMPANY_BRANCHES = gql`
  query GetCompanyBranches($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!, $companyId: String!) {
    getCompanyBranches(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search, companyId: $companyId) {
      message
      data {
        count
        branches {          
          uuid
          branch {
            location
            uuid
          }
        }
      }
    }
  }
`

export const GET_COMPANY_TENANT_DETAILS = gql`
  query GetCompanyTenantDetails($companyId: String!, $branchId: String!) {
    getCompanyTenantDetails(company_id: $companyId, branch_id: $branchId) {
      message
      data {
        email
        company_name
        website
        authorized_person
        industry_type
        type        
        phone_number
        country_code
        location
        total_employees
      }
    }
  }
`

export const GET_COMPANY_CONTRACTOR_DETAILS = gql`
query GetCompanyContractorDetails($branchId: String!, $companyId: String!) {
  getCompanyContractorDetails(branch_id: $branchId, company_id: $companyId) {
    message
    data {
      authorized_person
      company_name
      email
      industry_type
      location
      total_employees
      phone_number
      country_code
      type
      website
    }
  }
}
`

export const GET_COMPANY_TENANT_EMPLOYEE_LIST = gql`
query GetCompanyTenantEmployeeList($userData: GetSubscriberDto!) {
  getCompanyTenantEmployeeList(userData: $userData) {
    data {
      employee {
        email
        uuid
        status
        first_name
        last_name
        phone_number
        country_code {
          name
          id
          uuid
          countryCode
          phoneCode
        }
        department
        user_type
        company_id {
          uuid
          name
          description
          type
          attachments          
          website_url          
          industryType {
            name
            uuid
            description
          }
        }
      }
      count
    }
  }
}
`
export const GET_COMPANY_CONTRACTOR_EMPLOYEE_LIST = gql`
query GetCompanyContractorsList($userData: GetSubscriberDto!) {
  getCompanyContractorsList(userData: $userData) {
    message
    data {
      employee {
        email
        uuid
        status
        first_name
        last_name
        phone_number
        country_code {         
          uuid
          name
          phoneCode
        }        
        department
        user_type
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
          }
          tenantContractorType {
            uuid
            name            
            type
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
      }
      count
    }
  }
}
`

export const GET_USER_DETAILS_BY_ID = gql`
  query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
      message
      data {
        user {
          country_code {
            countryCode
            name
            phoneCode
            uuid
          }
          position
          email
          educational_interests
          first_name
          last_name
          user_type
          is_required_reset_password
          organization
          phone_number
          preferred_language
          profile_picture
          role_name
          uuid
          pronounce
          reporting_manager_id {
            uuid
            profile_picture
            last_name
            first_name
            location
            organization
          }
          department
          location
        }
        location
        role_id {
          name
          status
          uuid
        }
        role
      }
    }
  }
`