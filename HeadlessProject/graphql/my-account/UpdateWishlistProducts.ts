import { gql } from '@graphcommerce/graphql'

const UPDATE_WISHLIST_PRODUCTS = gql`
  mutation updateProductsInWishlist($wishlistId: ID!, $wishlistItems: [WishlistItemUpdateInput!]!) {
    updateProductsInWishlist(wishlistId: $wishlistId, wishlistItems: $wishlistItems) {
      wishlist {
        id
        items_count
        items_v2 {
          items {
            id
            quantity
            product {
              name
              sku
              uid
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

export default UPDATE_WISHLIST_PRODUCTS
