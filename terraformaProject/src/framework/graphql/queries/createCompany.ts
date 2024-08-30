import { gql } from '@apollo/client';
export const FETCH_COMPANY_DIRECTORIES = gql`
query GetCompanyDirectoriesWithPagination($requestedCompanyApproval: Boolean!,$sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getCompanyDirectoriesWithPagination(requestedCompanyApproval: $requestedCompanyApproval, sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      message
      data {
        companyDirectories {
          uuid
          name
          description
          website_url
          location
          email
          country_uuid
          country_name
          phoneCode
          countryCode
          phone_number
          image_url
          is_vote
          vote_count
        }
        count
      }
    }
  }`