import { gql } from '@apollo/client';

export const GET_DIVERSION_ADMIN_WITH_PAGINATION = gql`query GetDiverAdminWithPagination($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $nameSearch: String!, $locationSearch: String!) {
    getDiverAdminWithPagination(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, nameSearch: $nameSearch, locationSearch: $locationSearch) {
      message
      data {
        diversionAdmin {
          
          location {
            location
            uuid
          }
          user {
            email
            uuid
            first_name
            last_name 
          }
        }
        count
      }
    }
  }
  `;