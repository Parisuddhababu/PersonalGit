import { gql } from '@apollo/client';

export const GET_INVOICES = gql`
  query GetInvoicesWithPagination($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getInvoicesWithPagination(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      message
      data {
        invoice {
          uuid
          title
          date
          invoice
          status
        }
        count
      }
    }
  }
`