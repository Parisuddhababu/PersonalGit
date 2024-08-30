import { gql } from '@graphcommerce/graphql'

const WISHLIST_ITEM_DATA = gql`
  query GetIsInWishlists {
    customer {
      wishlists {
        id
        items_count
        items {
          id
          qty
          description
        }
        items_v2 {
          items {
            id
            product {
              uid
              url_key
            }
          }
        }
      }
    }
  }
`
export default WISHLIST_ITEM_DATA
