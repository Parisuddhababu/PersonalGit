import { gql } from '@apollo/client';

export const CREATE_CUSTOMER_TICKET = gql`
  mutation CreateTicket($ticketData: CreateTicketDto!) {
    createTicket(ticketData: $ticketData) {
      message
    }
  }
`

export const CUSTOMER_TICKET_STATUS_CHANGE = gql`
  mutation ChangeStatusOfTicket($ticketData: TicketStatusChangeDto!) {
    changeStatusOfTicket(ticketData: $ticketData) {
      message
    }
  }
`
export const CUSTOMER_TICKET_DELETE = gql`
  mutation DeleteTicket($ticketId: String!) {
    deleteTicket(ticketId: $ticketId) {
      message
    }
  }
`