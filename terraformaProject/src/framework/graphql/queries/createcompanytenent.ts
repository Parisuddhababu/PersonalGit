import { gql } from '@apollo/client';
export const GET_TYPE_OF_TENANT = gql`
  query GetCompanyTypes($type: Float!, $sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getCompanyTypes(type: $type, sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      message
      data {
        count
        tenantContractorType {
          uuid
          type
          name
          description
        }
      }
    }
  }
`

export const GET_INDUSTRY_TYPE = gql`
  query GetIndustryTypes($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getIndustryTypes(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      message
      data {
        count
        industries {
          uuid
          name
          description
        }
      }
    }
  }
`

export const GET_COMPANY_DETAILS = gql`
query GetCompanyDetails($branchId: String!, $companyId: String!) {
  getCompanyDetails(branchId: $branchId, companyId: $companyId) {
    message
    data {
      uuid
      name
      description
      type
      attachments
      website_url
      status
      company_branches {
        branch {
          uuid
          location
        }
      }
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
      authorize_person {
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
          country_code {
            id
            uuid
            name
            countryCode
            phoneCode
          }
          logo
          thumbnail
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