import { gql } from '@graphcommerce/graphql'

const SIGN_OUT = gql`
  mutation SignOutForm {
    revokeCustomerToken {
      result
    }
  }
`
export default SIGN_OUT
