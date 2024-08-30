import { gql } from '@apollo/client';

export const GET_CUSTOMER_TICKETS_WITH_PAGINATION = gql `
  query GetCustomerTicketsWithPagination($filterData: TicketListDto!) {
    getCustomerTicketsWithPagination(filterData: $filterData) {
      message
      data {
        tickets {
          uuid
          first_name
          last_name
          email
          phone_number
          message
          attachments
          status
          createdAt
        }
        count
      }
    }
  }
`