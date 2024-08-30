import { useMutation } from '@graphcommerce/graphql'
import { ADD_TO_CART_FROM_WISHLIST } from '../my-account/index'
import { UIContext } from '@components/common/contexts/UIContext'
import { useContext } from 'react'
import { useRouter } from 'next/router'

const useAddToCartFromWishlist = () => {
  const [, setState] = useContext(UIContext)
  const router = useRouter()
  const [addToCartFromWishlistMutation, { loading, data, error }] =
    useMutation(ADD_TO_CART_FROM_WISHLIST)

  const addToCartFromWishlist = async (cartId, cartItems, type, name) => {
    await addToCartFromWishlistMutation({
      variables: { cartId, cartItems },
      onCompleted: (res) => {
        if (type === 'singleProduct') {
          if (res?.addProductsToCart?.user_errors?.length > 0) {
            setState((prev) => ({
              ...prev,
              alerts: [
                {
                  type: 'error',
                  message: `${res?.addProductsToCart?.user_errors
                    ?.map((e) => e?.message)
                    .join(', ')}`,
                  timeout: 5000,
                  targetLink: router?.pathname,
                },
              ],
            }))
            return
          }
          setState((prev) => ({
            ...prev,
            alerts: [
              {
                type: 'success',
                message: `<span>You added ${name} to your <a href='/cart'>shopping cart.</a></span>`,
                timeout: 5000,
                targetLink: router?.pathname,
              },
            ],
          }))
        }
      },
    })
  }

  return { addToCartFromWishlist, loading, data, error }
}

export default useAddToCartFromWishlist
