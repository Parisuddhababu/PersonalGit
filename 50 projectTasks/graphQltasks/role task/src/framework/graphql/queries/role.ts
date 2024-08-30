import { gql } from "@apollo/client";

export const FETCH_ROLES_DATA = gql`
  query fetchRoles(
    $page: Int
    $limit: Int
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    fetchRoles(
      page: $page
      limit: $limit
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      data {
        Roledata {
          id
          uuid
          role_name
          key
          status
          created_at
          updated_at
        }
        count
      }
      meta {
        errorType
        errors {
          error
          errorField
        }
        message
        messageCode
        status
        statusCode
        type
      }
    }
  }
`;
