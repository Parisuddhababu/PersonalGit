import { Box, FormControlLabel, Radio, RadioGroup, SxProps, Theme } from "@mui/material"
import { 
  Controller,
  useFormAutoSubmit,
  useFormPersist,
} from "@graphcommerce/react-hook-form"
import {
  Form
} from '@graphcommerce/next-ui'
import { useFormGqlMutationCart, ApolloCartErrorAlert } from "@graphcommerce/magento-cart"
import { ShippingMethodFormMutation, ShippingMethodFormMutationVariables, ShippingMethodFormDocument } from "@graphcommerce/magento-cart-shipping-method/components/ShippingMethodForm/ShippingMethodForm.gql"
import { useEffect, useMemo } from "react"
import { useCartContext } from "../hooks/cartContext"
import { Money } from "@graphcommerce/magento-store"
import { getShippingSummaryQuery } from "@graphql/common/getShippingSummary.gql"
import FullPageOverlaySpinner from "@components/common/FullPageOverlaySpinner"

export type ShippingMethodListProps = {
  sx?: SxProps<Theme>
  cartId?: string
  loading?: boolean
  setSelectedMethod?: React.Dispatch<React.SetStateAction<string>>
} & getShippingSummaryQuery

export const ShippingMethodList = (props: ShippingMethodListProps) => {
  const {sx, GetSummaryShoppingCart, loading, setSelectedMethod } = props;
  const  {setCartSummaryDetails} = useCartContext()

  useEffect(() => {
    setCartSummaryDetails && setCartSummaryDetails(GetSummaryShoppingCart)
  }, [GetSummaryShoppingCart])

  const availableMethods = useMemo(() => {
    if (GetSummaryShoppingCart?.shippingMethods && GetSummaryShoppingCart.shippingMethods.length > 0) {
      return GetSummaryShoppingCart?.shippingMethods
    }
    return []
  }, [GetSummaryShoppingCart])

  // The default: When there is only a single shipping method, select that one.
  // let carrierMethod: string | undefined | null = availableMethods.length === 1 ? availableMethods[0]?.methodTitle : undefined

  const form = useFormGqlMutationCart<
    ShippingMethodFormMutation,
    ShippingMethodFormMutationVariables
  >(ShippingMethodFormDocument, {
    defaultValues: {
      carrier: GetSummaryShoppingCart?.selectedShippingMethods?.[0]?.methodTitle as string ?? 'Free'
    },
    onBeforeSubmit: (variables) => {
      const selectedMethod = availableMethods.find((method) => method?.methodTitle === variables.carrier)
      setSelectedMethod && setSelectedMethod(selectedMethod?.carrierTitle as string)
      return { ...variables, carrier: selectedMethod?.carrierCode as string, method: selectedMethod?.methodCode as string }
    }
  })

  const { handleSubmit, control, error, loading: shippingMethodLoading } = form
  const submit = handleSubmit(() => {})

  useFormPersist({ form, name: 'ShippingMethodForm' })
  useFormAutoSubmit({ form, submit, fields: ['carrier'] })

  return (
    <Form onSubmit={submit} noValidate sx={{
      position: 'relative',
      ...sx
    }}>
      <Controller
      render={({ field }) => (
        <RadioGroup {...field} >
        {availableMethods?.map((method) => {
          return (
            <Box 
              key={method?.carrierTitle}
              sx={{
                marginBottom: '0.65rem',
                '&:last-child': {
                  marginBottom: '1.4rem',
                },
                '& b': {
                  fontWeight: 700,
                  fontVariationSettings: "'wght' 700",
                }
              }}
              >
              <b>{method?.carrierTitle}</b>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                '& b': {
                  marginLeft: '0.25rem',
                  fontWeight: 700,
                  fontVariationSettings: "'wght' 700",
                }
              }}>
                <FormControlLabel sx={{
                  flexDirection: 'row',
                  margin: 0,
                  marginLeft: '-0.625rem',
                }}
                key={method?.methodTitle + "_shipping_methods"}
                value={method?.methodTitle} control={<Radio />} labelPlacement="start"
                label={method?.methodTitle} /> 
                {method?.amount && <b><Money {...method.amount} /></b>}
              </Box>
            </Box>
          )
        })}
      </RadioGroup>
      )}
      name="carrier"
      control={control}
      ></Controller>
      <ApolloCartErrorAlert error={error} />
      {(loading || shippingMethodLoading) && <FullPageOverlaySpinner />}
    </Form>
  )
}

export default ShippingMethodList