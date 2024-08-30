import { CartContext } from '@components/shopping-cart/hooks/cartContext'
import { ApolloCartErrorAlert, useCartQuery } from '@graphcommerce/magento-cart'
import { CartPageDocument } from '@graphcommerce/magento-cart-checkout'
import { Typography, Box } from '@mui/material'
import MiniCartItemList from './MiniCartItemList'

const MiniCart = (props: any) => {
  const { setAnchorEl } = props
  const cartData = useCartQuery(CartPageDocument, { returnPartialData: true, errorPolicy: 'all' })
  const { data, error } = cartData
  const hasItems =
    (data?.cart?.total_quantity ?? 0) > 0 &&
    typeof data?.cart?.prices?.grand_total?.value !== 'undefined'
  const cart = data

  if (error) {
    return (
      <Box
        sx={{
          padding: { xs: '0.75rem 0.5rem', md: '1.5rem 0.5rem' },
        }}
      >
        <ApolloCartErrorAlert error={error} />
      </Box>
    )
  }

  return (
    <Box
      className='mini-cart-inner'
      sx={{
        height: { xs: 'calc( 100vh - 100px )', md: 'auto' },
        overflow: { xs: 'auto', md: 'visible' },
      }}
    >
      {hasItems ? (
        <CartContext>
          {cart?.cart && (
            <MiniCartItemList
              {...cart}
              subtotal={cart.cart.prices?.subtotal_excluding_tax}
              setAnchorEl={setAnchorEl}
            />
          )}
        </CartContext>
      ) : (
        <Box
          sx={{
            padding: { xs: '2rem 0.938rem', md: '3.563rem 1.875rem' },
          }}
        >
          <Typography
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              fontVariationSettings: "'wght' 700",
            }}
          >
            You have no items in your shopping cart.
          </Typography>
        </Box>
      )}
    </Box>
  )
}
export default MiniCart
