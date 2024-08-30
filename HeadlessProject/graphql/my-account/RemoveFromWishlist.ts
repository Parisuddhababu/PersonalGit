import { gql } from '@graphcommerce/graphql'

const REMOVE_FROM_WISHLIST = gql`
  mutation removeProductsFromWishlist($wishlistId: ID!, $wishlistItemsIds: [ID!]!) {
    removeProductsFromWishlist(wishlistId: $wishlistId, wishlistItemsIds: $wishlistItemsIds) {
      wishlist {
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
            quantity
            product {
              uid
              name
              sku
              price_range {
                minimum_price {
                  regular_price {
                    currency
                    value
                  }
                }
                maximum_price {
                  regular_price {
                    currency
                    value
                  }
                }
              }
            }
          }
        }
      }
      user_errors {
        code
        message
      }
    }
  }
`

export default REMOVE_FROM_WISHLIST
