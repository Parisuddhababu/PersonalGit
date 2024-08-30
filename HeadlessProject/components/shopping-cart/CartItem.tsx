import {Grid, Typography, Box, Container} from "@mui/material"
import { Trans } from '@lingui/react'
import { CartDiscountCoupon, CartListItem, CartRelatedProductList, CartSummary } from "./components"
import { CartPageQuery } from "@graphcommerce/magento-cart-checkout"
import {AlertToast} from "@components/AlertToast";
import {useRouter} from "next/router";
import {useContext} from "react";
import {UIContext} from "@components/common/contexts/UIContext";

export type CartItems = {
  cart: CartPageQuery
}

export const CartItems = (props: CartItems): JSX.Element => { //NOSONAR
  const {cart} = props
    const router = useRouter()
    const [state] = useContext(UIContext)

  return(
    <>
      <Box
        sx={{
          paddingTop: '1.3rem',
          paddingBottom: {xs: '1rem', md:'1.875rem', lg:'2.25rem'},
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: '300',
            fontVariationSettings: `'wght' 300`,
          }}
        >
          <Trans id='Shopping Cart' />
        </Typography>
          {state?.alerts?.length > 0 && (
              <AlertToast
                  sx={{ marginLeft: '0 !important', marginTop: '0.5rem !important' }}
                  alerts={state?.alerts}
                  link={router?.pathname}
              />
          )}
      </Box>

      <Grid
        container
        spacing={{xs: 1, md:4, lg:6.2}}
        sx={{
          marginBottom: '1.5rem'
        }}
        >

        <Grid item xs={12} md={8.607} sx={{ order: {xs:'1', md: '0'} }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              {cart.cart?.items ? <CartListItem id={cart.cart?.id} items={cart.cart?.items} /> : <Trans id='Shopping cart is empty' />}
            </Grid>
            <Grid item xs={12} md={10} lg={6}>
              <CartDiscountCoupon {...cart} />
            </Grid>
            <Grid item xs={12} md={12}>
              <CartRelatedProductList productSkus={cart.cart?.items?.map((item) => item?.product?.sku)}
                sx={{
                  '& .MuiContainer-root': {
                    padding: '0 !important',
                    // '& > h6': {
                    //   fontWeight: 700,
                    //   fontVariationSettings: "'wght' 700",
                    //   lineHeight: '1.125rem',
                    //   fontSize: '0.875rem'
                    // }
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={3.393} sx={{
          // padding: {md: '1rem'},
          order: {xs:'0', md: '1'}
        }}>
          <CartSummary {...cart} />
        </Grid>

      </Grid>

    </>
  )
}

export default CartItems
