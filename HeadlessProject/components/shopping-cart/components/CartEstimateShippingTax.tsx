import {
  useFormAutoSubmit,
} from '@graphcommerce/ecommerce-ui'
import {
  useCartQuery
} from '@graphcommerce/magento-cart'
import { ApolloError, useQuery } from '@graphcommerce/graphql'
import { CountryRegionsDocument } from '@graphcommerce/magento-store'
import { Form } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { SxProps, Theme, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { CountryRegionDropDown, ShippingMethodList } from '.'
import { useFormGqlQueryCart } from '../hooks/useFormGqlQueryCart'
import { CartPageQuery } from '@graphcommerce/magento-cart-checkout'
import { getShippingSummaryDocument } from '@graphql/common/getShippingSummary.gql'
import FullPageOverlaySpinner from '@components/common/FullPageOverlaySpinner'
import { shopCountry } from 'config/constants'
import { GetAddressesOnCartDocument } from '@graphql/cart/getSelectedAddress.gql'

export type CartEstimateShippingTaxProps = {
  sx?: SxProps<Theme>
  setErrorHandler?: React.Dispatch<React.SetStateAction<ApolloError | undefined>>
} & CartPageQuery

export const CartEstimateShippingTax = React.memo<CartEstimateShippingTaxProps>((props) => {
  const { sx, cart, setErrorHandler } = props
  const { data: cartQuery, refetch: cartRefetch } = useCartQuery(GetAddressesOnCartDocument)
  const countryQuery = useQuery(CountryRegionsDocument, { fetchPolicy: 'cache-and-network' })
  const countries = countryQuery.data?.countries ?? countryQuery.previousData?.countries
  const refInital = useRef<boolean>(false)

  const [selectedMethod, setSelectedMethod] = useState<string>('')

  let Query = getShippingSummaryDocument

  const getCountryCode = (code?: string | null) => {
    const selectesShopCode = countries
    ?.find((country) => country?.two_letter_abbreviation === code)
    ?.full_name_locale?.toString()
    return selectesShopCode ?? shopCountry
  }

  const getRegionLabel = (regionId?: string | null) => {
    const selectesShopCode = countries
    ?.find((country) => country?.two_letter_abbreviation === cartQuery?.cart?.selectedData?.selectedCountryId)
    ?.available_regions?.find((reg) => reg?.id === Number(regionId))?.name
    return selectesShopCode ?? ''
  }

  const form = useFormGqlQueryCart(Query, {
    defaultValues: {
      country: getCountryCode(cartQuery?.cart?.selectedData?.selectedCountryId),
      state: getRegionLabel(cartQuery?.cart?.selectedData?.selectedRegionId) ?? '',
      zipCode: cartQuery?.cart?.selectedData?.selectedPostcode ?? '',
      discountCode: cart?.applied_coupons?.[0]?.code ?? '',
      shippingMethodName: selectedMethod ?? ''
    },
    mode: 'onChange',
    onBeforeSubmit: (variables) => {
      return {
        ...variables,
      }
    },
    onComplete: () => {
      cartRefetch()
    }
  })

  const { handleSubmit, formState, error, data: shippingMethods, loading, refetch } = form
  const submit = handleSubmit(() => {})

  useEffect(() => {
    if (!refInital.current) {
      refInital.current = true
      return
    }
    refetch()
  }, [cart])

  useEffect(() => {
    if (setErrorHandler) {
      setErrorHandler(error)
    }
  }, [error])

  const autoSubmitting = useFormAutoSubmit({
    form,
    submit,
    fields: ['zipCode', 'country', 'state'],
    forceInitialSubmit: true
  })
  const readOnly = formState.isSubmitting && !autoSubmitting

  return(
    <>
    <Form onSubmit={submit} noValidate sx={{ paddingBottom: '0', ...sx}}>
      <Typography
          sx={{
            marginBottom: '1rem',
          }}
        >
        <Trans id='Enter your destination to get a shipping estimate.' />
      </Typography>
      <CountryRegionDropDown  form={form} key='countryfields' readOnly={readOnly} />
    </Form>
    <ShippingMethodList
      {...shippingMethods}
      cartId={cartQuery?.cart?.id}
      loading={loading}
      setSelectedMethod={setSelectedMethod}
    />
    {loading && <FullPageOverlaySpinner sx={{
      zIndex: '999999'
    }} />}
    </>
  )
})

export default CartEstimateShippingTax;
