import { gql } from '@apollo/client';

export const CREATE_INVOICE = gql`
  mutation CreateInvoice($invoiceData: CreateInvoiceDto!) {
    createInvoice(invoiceData: $invoiceData) {
      message
      data {
        uuid
        title
        date
        invoice
        status
      }
    }
  }
`

export const DELETE_INVOICE = gql`
  mutation DeleteInvoice($invoiceId: String!) {
    deleteInvoice(invoiceId: $invoiceId) {
      message
    }
  }
`