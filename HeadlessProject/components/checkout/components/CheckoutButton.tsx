import { CartStartCheckoutFragment } from '@graphcommerce/magento-cart/components/CartStartCheckout/CartStartCheckout.gql'
import { iconChevronRight, IconSvg, LinkOrButton, LinkOrButtonProps } from '@graphcommerce/next-ui'
import { getShippingSummaryQuery } from '@graphql/common/getShippingSummary.gql'
import { Trans } from '@lingui/react'
import { Box, Link, SxProps, Theme } from '@mui/material'
import React, { useState } from 'react'

export type CartStartCheckoutLinkOrButtonProps = CartStartCheckoutFragment & {
  children?: React.ReactNode
  sx?: SxProps<Theme>
  onStart?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    cart: CartStartCheckoutFragment,
  ) => void
  linkOrButtonProps?: LinkOrButtonProps
} & getShippingSummaryQuery['GetSummaryShoppingCart']
// import { PayPalButtons } from '@paypal/react-paypal-js'
import { usePaypalOnShoppingCart } from '../hooks'
import FullPageOverlaySpinner from '@components/common/FullPageOverlaySpinner'
import { useRouter } from 'next/router'
import DownloadableCheckoutPopUp from './DownloadableCheckoutPopUp/DownloadableCheckoutPopUp'
import { useCustomerSession } from '@graphcommerce/magento-customer'

export const CartStartCheckoutButton = (props: CartStartCheckoutLinkOrButtonProps) => {
  const {
    children,
    onStart,
    linkOrButtonProps: { onClick, button, ...linkOrButtonProps } = {},
    orderTotal,
    ...cart
  } = props
  const router = useRouter()
  const [openPopUp, setOpenPopUp] = useState(false)
  const { loggedIn } = useCustomerSession()

  const hasTotals = (orderTotal?.value ?? 0) > 0
  const hasErrors = cart.items?.some((item) => (item?.errors?.length ?? 0) > 0)
  const downloadableProuct = cart.items?.some((item) =>
    item?.__typename.includes('DownloadableCartItem'),
  )
  const {
    callPaypalMethod,
    data: paypalData,
    loading: paypalLoading,
    error: paypalError,
  } = usePaypalOnShoppingCart({})
  const initPaypal = () => {
    callPaypalMethod({
      onCompleted: (response) => {
        // router.push(response.createPaypalExpressToken?.paypal_urls?.start as string)
        window.open(
          response.createPaypalExpressToken?.paypal_urls?.start as string,
          'paypal',
          'width=1000,height=1000,scrollbars=yes',
        )
      },
    })
  }
  if (openPopUp && loggedIn) {
    router.push('/checkout')
  }
  return (
    <>
      {openPopUp && (
        <DownloadableCheckoutPopUp openPopUp={openPopUp} onClose={() => setOpenPopUp(false)} />
      )}
      <LinkOrButton
        onClick={(e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
          onClick?.(e)
          onStart?.(e, cart)
          if (downloadableProuct && !loggedIn) {
            setOpenPopUp(true)
          } else {
            router.push('/checkout')
          }
        }}
        button={{ variant: 'contained', ...button }}
        disabled={!hasTotals || hasErrors}
        color='secondary'
        // href='/checkout'
        // endIcon={<IconSvg src={iconChevronRight} />}
        {...linkOrButtonProps}
        className='proceed-checkout-btn'
      >
        <Trans id='Proceed to Checkout' />
      </LinkOrButton>
      <Box
        sx={{
          paddingTop: '0.938rem',
          '& .paypal-buttons': {
            verticalAlign: 'middle',
          },
        }}
      >
        {/*<PayPalButtons style={{ layout: 'horizontal' }} onClick={() => initPaypal()} />*/}
        {/* <button type="button" onClick={() => initPaypal()} disabled={paypalLoading}>
          Paypal checkout
        </button> */}
      </Box>
      {paypalLoading && (
        <FullPageOverlaySpinner
          sx={{
            zIndex: '999999',
          }}
        />
      )}
    </>
  )
}

export default CartStartCheckoutButton
