import { gql } from '@graphcommerce/graphql'

const CART_INFO = gql`
  query CustomerCart {
    customerCart {
      id
    }
  }
`

export default CART_INFO
