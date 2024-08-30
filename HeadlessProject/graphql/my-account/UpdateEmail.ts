import { gql } from '@graphcommerce/graphql'

const UPDATE_EMAIL = gql`
  mutation UpdateCustomerEmail($email: String!, $password: String!) {
    updateCustomerEmail(email: $email, password: $password) {
      customer {
        email
      }
    }
  }
`
export default UPDATE_EMAIL
