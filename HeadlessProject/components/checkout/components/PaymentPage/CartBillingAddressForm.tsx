import { useCartIdCreate, useCartQuery } from "@graphcommerce/magento-cart"
import { GetCartSummaryDocument } from "@graphcommerce/magento-cart/components/CartSummary/GetCartSummary.gql"
import { isSameAddress } from "@graphcommerce/magento-cart-shipping-address/utils/isSameAddress"
import { AddEditAddressForm, CheckoutAddrssField } from "."
import { FormGroup, FormControlLabel, Checkbox, Button, CircularProgress, Box } from "@mui/material"
import { useEffect, useState } from "react"
import { Trans } from "@lingui/react"
import { SetBillingAddressDocument } from "@graphcommerce/magento-cart-shipping-address/components/ShippingAddressForm/SetBillingAddress.gql"
import { useMutation } from '@apollo/client'

export type CartBillingAddressFormProps = {
  children?: React.ReactNode
}

export function CartBillingAddressForm(props: CartBillingAddressFormProps) {
  const {children} = props
  const [isBilling, setIsBilling] = useState<boolean>(true);
  const [billingAddressUpdated, setBillingAddressUpdated] = useState<boolean | undefined>(true)
  const { data, loading } = useCartQuery(GetCartSummaryDocument, { allowUrl: true })
  const cartId = useCartIdCreate()

  useEffect(() => {
    if(!loading && data?.cart) {
      const isBillingSameAsShipping = isSameAddress(data?.cart?.shipping_addresses[0], data?.cart?.billing_address)
      console.log('shipping', isBillingSameAsShipping)
      setIsBilling(isBillingSameAsShipping)
    }
  }, [loading, data, children])

  const [setBillingSameAsShipping, {loading: shippingLoading, error}] = useMutation(SetBillingAddressDocument, {
    variables: {
      cartId: '',
      firstname: '',
      lastname: '',
      postcode: '',
      city: '',
      countryCode: '',
      street: '',
      telephone: '',
      addition: '',
      saveInAddressBook: true,
      company: '',
      regionId: null,
    }
  })

  if (!data?.cart) return null

  const { shipping_addresses, billing_address } = data?.cart

  const setValue = async () => {
    setBillingSameAsShipping({
      variables: {
        cartId: await cartId(),
        firstname: shipping_addresses?.[0]?.firstname ?? '',
        lastname: shipping_addresses?.[0]?.lastname ?? '',
        postcode: shipping_addresses?.[0]?.postcode ?? '',
        city: shipping_addresses?.[0]?.city ?? '',
        countryCode: shipping_addresses?.[0]?.country.code ?? '',
        street: shipping_addresses?.[0]?.street?.[0] ?? '',
        telephone: shipping_addresses?.[0]?.telephone ?? '',
        addition: shipping_addresses?.[0]?.street?.[2] ?? '',
        saveInAddressBook: true,
        company: shipping_addresses?.[0]?.company ?? '',
        regionId: shipping_addresses?.[0]?.region?.region_id ?? null,
      }
    })
  }

  const section = () => {
    if (shippingLoading) {
      return <CircularProgress/>
    }
    return(
      <Box
        sx={{
          paddingLeft: {md:'1.75rem'}
        }}
      >
        {(isBilling || billingAddressUpdated) && <CheckoutAddrssField {...billing_address} sx={{
          '& div': {
            paddingTop: '0.4rem'
          }
        }}/>}
        {(billingAddressUpdated) && (
          <Button
            type='button'
            variant='contained'
            color='secondary'
            size='medium'
            onClick={() => {
              setBillingAddressUpdated(false)
              setIsBilling(false)
            }}
            sx={{
              marginTop: '0.5rem',
            }}
          >
            <Trans id='Edit' />
          </Button>)
        }
        {(!isBilling && !billingAddressUpdated) && <AddEditAddressForm setBillingAddressUpdated={(val) => setBillingAddressUpdated(val)}  />}
        {children}
      </Box>
    )
  }

  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={isBilling} />}
          label="My billing and shipping address are the same"
          onChange={(_, checked) => {
            setIsBilling(checked)
            setBillingAddressUpdated(false)
            if (checked) {
              setValue()
            }
          }}
        />
      </FormGroup>
      {section()}
    </>
  )
}
