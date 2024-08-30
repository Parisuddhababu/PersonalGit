import { gql } from '@graphcommerce/graphql'

const CUSTOMER_PAYMENT_TOKENS = gql`
  query {
    customerPaymentTokens {
      items {
        details
        public_hash
        payment_method_code
        type
      }
    }
  }
`
export default CUSTOMER_PAYMENT_TOKENS
