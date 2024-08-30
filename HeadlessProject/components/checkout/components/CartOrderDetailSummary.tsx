import { useLazyQuery, useQuery } from "@graphcommerce/graphql"
import { ApolloCartErrorAlert } from "@graphcommerce/magento-cart"
import { CartPageQuery } from "@graphcommerce/magento-cart-checkout"
import { GetCartSummaryQuery } from "@graphcommerce/magento-cart/components/CartSummary/GetCartSummary.gql"
import { CountryRegionsDocument, Money, MoneyProps } from "@graphcommerce/magento-store"
import { getShippingSummaryDocument } from "@graphql/common/getShippingSummary.gql"
import { Trans } from "@lingui/react"
import { Box, CircularProgress, Divider, SxProps, Theme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { getCountryCode, getRegionLabelFromId } from '@components/common/utils'

export type CartOrderDetailSummaryProps = {
  sx?: SxProps<Theme>,
  shippingLoad?: boolean
  shippingData?: GetCartSummaryQuery
} & CartPageQuery

export function CartOrderDetailSummary(props: CartOrderDetailSummaryProps) {
  const {sx, cart, shippingLoad, shippingData} = props
  const router = useRouter()
  const countryQuery = useQuery(CountryRegionsDocument, { fetchPolicy: 'cache-and-network' })
  const countries = countryQuery.data?.countries ?? countryQuery.previousData?.countries
  const [fetchSummary, {called, loading, data: summaryDetails, error}] = useLazyQuery(getShippingSummaryDocument)

  useEffect(() => {
    if(cart && !shippingLoad) {
      fetchSummary({
        variables: {
          cartId: cart?.id,
          country: getCountryCode(shippingData?.cart?.selectedData?.selectedCountryId as string, countries),
          state: getRegionLabelFromId(shippingData?.cart?.selectedData?.selectedRegionId, countries, shippingData?.cart?.selectedData?.selectedCountryId),
          zipCode: shippingData?.cart?.selectedData?.selectedPostcode ?? '',
          discountCode: cart?.applied_coupons?.[0]?.code ?? '',
          shippingMethodName: shippingData?.cart?.shipping_selected_methods?.carrierTitle ?? shippingData?.cart?.shipping_addresses?.[0]?.selected_shipping_method?.carrier_title,
        }
      })
    }
  }, [shippingLoad, cart])

  const priceBox = (label: string, amount: MoneyProps, subLabel = '', sx = {}) => {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '0.5rem 0',
        ...sx
      }}>
          <span>
            <Trans id={label}/>
            <br/>
            {!subLabel.includes('undefined') && (<small>
              <Trans id={subLabel}/>
            </small>)}
          </span>
          <span>
           {amount ?  <Money {...amount} /> : 0}
          </span>
      </Box>
    )
  }

  if (router.asPath !== '/checkout/payment') return null

  if (called && loading) {
    return <CircularProgress />
  }

  return (
    <Box sx={{
      borderTop: '1px solid #cccccc',
    }}>
      {priceBox('Cart Subtotal', summaryDetails?.GetSummaryShoppingCart?.subtotal as MoneyProps)}
      {
        summaryDetails?.GetSummaryShoppingCart?.discountData && summaryDetails?.GetSummaryShoppingCart?.discountData?.map((discount) => (
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '0.5rem 0',
          }} key={discount?.title}>
            <span>
              <Trans id="Discount" /> ({discount?.title})
            </span>
            <span>
              - {discount?.amount ? <Money {...discount?.amount} /> : 0}
            </span>
          </Box>
        ))
      }
      {priceBox('Shipping',
      summaryDetails?.GetSummaryShoppingCart?.selectedShippingMethods?.[0]?.amount as MoneyProps,
      summaryDetails?.GetSummaryShoppingCart?.selectedShippingMethods?.[0]?.methodTitle as string + ' - ' +
      summaryDetails?.GetSummaryShoppingCart?.selectedShippingMethods?.[0]?.carrierTitle as string)}
        {summaryDetails?.GetSummaryShoppingCart?.tax?.value && summaryDetails?.GetSummaryShoppingCart?.tax?.value > 0 &&
            (<Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.7rem',
            }}>
                    <span>
                      <Trans id="Tax" />
                    </span>
                <span>
                      {summaryDetails?.GetSummaryShoppingCart?.tax && <Money {...summaryDetails?.GetSummaryShoppingCart?.tax} />}
                    </span>
            </Box>)
        }
      <Divider />
      {priceBox('Order Total',
       summaryDetails?.GetSummaryShoppingCart?.orderTotal as MoneyProps, 'undefined', {
          fontWeight: '600',
          fontVariationSettings: "'wght' 600",
          fontSize: '1.2rem'
        })
      }
      {error && <ApolloCartErrorAlert error={error} />}
    </Box>
  )
}
