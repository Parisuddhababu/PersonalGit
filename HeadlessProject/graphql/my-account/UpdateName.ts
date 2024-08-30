import { gql } from '@graphcommerce/graphql'

const UPDATE_NAME = gql`
  mutation UpdateCustomerName($prefix: String, $firstname: String!, $lastname: String!) {
    updateCustomer(input: { prefix: $prefix, firstname: $firstname, lastname: $lastname }) {
      customer {
        prefix
        firstname
        lastname
      }
    }
  }
`
export default UPDATE_NAME
