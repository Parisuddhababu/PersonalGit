import { gql } from '@apollo/client';

export const GET_DIVERSION_CONTRACTOR_WITH_PAGINATION = gql`query GetDiversionContractorsWithPagination($locationId: String!, $sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getDiversionContractorsWithPagination(locationId: $locationId, sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      message
      data {
        count
        diversionContractors {
          uuid
          subscriber {
            uuid
          }
          location {
            uuid
            location
          }
          contractor_company {
            name
            uuid
          }
          service_count
        }
      }
    }
  }`;