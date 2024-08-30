import { useMutation } from '@graphcommerce/graphql'
import { REMOVE_FROM_WISHLIST } from '../my-account/index'

const useRemoveFromWishlist = () => {
  const [removeFromWishlistMutation] = useMutation(REMOVE_FROM_WISHLIST)

  const removeFromWishlist = async (wishlistId: number, wishlistItemsIds: number[]) => {
    await removeFromWishlistMutation({
      variables: {
        wishlistId,
        wishlistItemsIds,
      },
    })
  }
  return { removeFromWishlist }
}

export default useRemoveFromWishlist
