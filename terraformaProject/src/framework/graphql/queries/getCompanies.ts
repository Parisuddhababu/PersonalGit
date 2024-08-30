import { gql } from '@apollo/client'

export const GET_COMPANIES_WITH_PAGINATION_DATA = gql`
query GetCompaniesWithPagination($filterData: ExistingCompanyListDto!) {
  getCompaniesWithPagination(filterData: $filterData) {
    message
    data {
      companies {
        uuid
        name
        branch_uuid
        branch_name
        user_count
      }
      count
    }
  }
}
`