import { gql } from '@graphcommerce/graphql'

const ADD_TO_CART_FROM_WISHLIST = gql`
  mutation AddProductsToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
    addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
      cart {
        id
        __typename
        total_quantity
        items {
          __typename
          uid
          quantity
          errors {
            code
            message
            __typename
          }
          product {
            uid
            name
            sku
            thumbnail {
              url
              label
              __typename
            }
            __typename
          }
          prices {
            discounts {
              amount {
                currency
                value
                __typename
              }
              __typename
            }
            row_total_including_tax {
              currency
              value
              __typename
            }
            price {
              currency
              value
              __typename
            }
            __typename
          }
        }
        prices {
          grand_total {
            currency
            value
            __typename
          }
          __typename
          applied_taxes {
            amount {
              currency
              value
              __typename
            }
            label
            __typename
          }
          discounts {
            amount {
              currency
              value
              __typename
            }
            label
            __typename
          }
          subtotal_excluding_tax {
            currency
            value
            __typename
          }
          subtotal_including_tax {
            currency
            value
            __typename
          }
          subtotal_with_discount_excluding_tax {
            currency
            value
            __typename
          }
        }
        shipping_addresses {
          selected_shipping_method {
            carrier_code
            method_code
            method_title
            carrier_title
            amount {
              currency
              value
              __typename
            }
            __typename
          }
          available_shipping_methods {
            carrier_code
            method_code
            price_incl_tax {
              currency
              value
              __typename
            }
            price_excl_tax {
              currency
              value
              __typename
            }
            __typename
          }
          __typename
        }
      }
      user_errors {
        code
        message
        __typename
      }
      __typename
    }
  }
`

export default ADD_TO_CART_FROM_WISHLIST
