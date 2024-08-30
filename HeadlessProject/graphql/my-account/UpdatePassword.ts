import { gql } from '@graphcommerce/graphql'

const UPDATE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changeCustomerPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      email
    }
  }
`
export default UPDATE_PASSWORD
