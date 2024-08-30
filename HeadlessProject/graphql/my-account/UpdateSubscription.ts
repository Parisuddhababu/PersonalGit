import { gql } from '@graphcommerce/graphql'

const UPDATE_SUBSCRIPTION = gql`
  mutation UpdateNewsletterSubscription($isSubscribed: Boolean!) {
    updateCustomer(input: { is_subscribed: $isSubscribed }) {
      customer {
        is_subscribed
      }
    }
  }
`
export default UPDATE_SUBSCRIPTION
