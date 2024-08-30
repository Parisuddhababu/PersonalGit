import { gql } from '@apollo/client'

export const GET_ROLES_DATA = gql`
query GetRoles($limit: Float!, $page: Float!, $search: String!, $sortOrder: String!, $sortField: String!) {
  getRoles(limit: $limit, page: $page, search: $search, sortOrder: $sortOrder, sortField: $sortField) {
    data {
      role {
        uuid
        name
        status
        description
      }
      count
    }
    message
  }
}
`

export const GET_ACTIVE_ROLES_DATA = gql`
  query GetActiveRoles($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getActiveRoles(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      message
      data {
        role {
          uuid
          name
          description
          status
        }
        count
      }
    }
  }
`

export const GET_REPORTING_MANAGERS = gql`
query GetReportingManagers($userData: ReportingManagerDto!) {
  getReportingManagers(userData: $userData) {
    message
    data {
      email
      first_name
      last_name
      phone_number
      status
      uuid
    }
  }
}
`