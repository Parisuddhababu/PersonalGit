import FullPageOverlaySpinner from '@components/common/FullPageOverlaySpinner'
import {
  ApolloCartErrorAlert,
  useCartQuery,
  useFormGqlMutationCart,
} from '@graphcommerce/magento-cart'
import { GetShippingMethodsDocument } from '@graphcommerce/magento-cart-shipping-method/components/ShippingMethodForm/GetShippingMethods.gql'
import { ShippingMethodFormMutation, ShippingMethodFormMutationVariables, ShippingMethodFormDocument } from '@graphcommerce/magento-cart-shipping-method/components/ShippingMethodForm/ShippingMethodForm.gql'
import { Money } from '@graphcommerce/magento-store'
import {
  Form,
  FormHeader
} from '@graphcommerce/next-ui'
import {
  Controller,
  FormProvider,
  useFormAutoSubmit,
  useFormCompose,
  UseFormComposeOptions,
  UseFormGraphQlOptions,
  useFormPersist,
  useWatch,
} from '@graphcommerce/react-hook-form'
import { Trans } from '@lingui/react'
import { Box, Divider, FormControlLabel, Radio, RadioGroup, SxProps, Theme, Typography } from '@mui/material'
import {getShippingSummaryQuery} from "@graphql/common/getShippingSummary.gql";

export type ShippingMethodFormProps = Pick<UseFormComposeOptions, 'step'> & {
  sx?: SxProps<Theme>
  children?: React.ReactNode
  shippingMethodList?: getShippingSummaryQuery | null
} & UseFormGraphQlOptions<
    ShippingMethodFormMutation,
    ShippingMethodFormMutationVariables & { carrierMethod?: string }
  >

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

export function CheckoutShippingMethodForm(props: ShippingMethodFormProps) {
  const { step, shippingMethodList, sx, children, onBeforeSubmit = (vars) => vars, ...options } = props
  // const { data: cartQuery, loading, error: listMethodsError } = useCartQuery(GetShippingMethodsDocument)

  const shippingMethods = shippingMethodList?.GetSummaryShoppingCart?.shippingMethods?.map((method) => {
    return {
      price_excl_tax: method?.amount,
      carrier_code: method?.carrierCode,
      carrier_title: method?.carrierTitle,
      method_code: method?.methodCode,
      method_title: method?.methodTitle
    }
  })

  const selectedMethod = shippingMethods?.find((method) => method.carrier_code === shippingMethodList?.GetSummaryShoppingCart?.selectedShippingMethods?.[0]?.carrierCode)

  const form = useFormGqlMutationCart<
    ShippingMethodFormMutation,
    ShippingMethodFormMutationVariables & { carrierMethod?: string }
  >(ShippingMethodFormDocument, {
    defaultValues: { carrierMethod: selectedMethod?.carrier_code as string ?? 'freeshipping' },
    onBeforeSubmit: (variables) => {
      const methodName = shippingMethods?.find((method) => method?.carrier_code === variables.carrierMethod)
      return onBeforeSubmit({ ...variables, carrier: methodName?.carrier_code as string, method: methodName?.method_code as string })
    },
    ...options,
  })

  const { handleSubmit, control, error, loading: formSubmision } = form
  const submit = handleSubmit(() => {})

  useFormPersist({ form, name: 'ShippingMethodForm' })
  useFormCompose({ form, step, submit, key: 'ShippingMethodForm' })
  useFormAutoSubmit({ form, submit, fields: ['carrierMethod'], forceInitialSubmit: true })

  if (formSubmision) {
    return <FullPageOverlaySpinner />
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={submit} noValidate sx={{ ...sx, padding: '0' }}>
        <FormHeader variant='h4' 
          sx={(theme) => ({ 
            fontSize: '1.625rem !important',
            mb: 0, 
            paddingBottom: '0.5rem',
            borderBottom: '1px solid #cccccc',
          })}
        >
          <Trans id='Shipping method' />
        </FormHeader>
        <Controller
          render={({ field }) => (
            <RadioGroup {...field} >
              {shippingMethods?.map((method) => (
                  <Box 
                    key={method?.carrier_title}
                    sx={{
                      display: 'grid',
                      alignItems: 'center',
                      gridTemplateColumns: {xs:'36px repeat(auto-fill, minmax(80px, 1fr))', md:'42px repeat(auto-fill, minmax(122px, 1fr))'},
                      '&:not(:last-child)': {
                        borderBottom: '1px solid #cccccc',
                      },
                      '& b': {
                        marginLeft: '0.5rem',
                      },
                      '& strong': {
                        fontWeight: '700',
                        fontVariationSettings: "'wght' 700",
                      },
                    }}
                  >
                    <FormControlLabel sx={{
                      flexDirection: 'row',
                      margin: {xs: '0 0 0 -0.45rem', md: '0 0 0 -0.65rem'},
                    }}
                    value={method?.carrier_code} control={<Radio />} labelPlacement="start"
                    label="" />

                    <Typography variant='body1' component='strong'>
                      {method?.price_excl_tax && <Money {...method.price_excl_tax} />}
                    </Typography>

                    <Typography variant='body1' component='span'>
                      {method?.method_title}
                    </Typography>

                    <Typography variant='body1' component='span'>
                      {method?.carrier_title}
                    </Typography>
                  </Box>
                )
              )
            }
            </RadioGroup>
          )}
          name="carrierMethod"
          control={control}          
        />
        <ApolloCartErrorAlert error={error} />
      </Form>
      {children}
    </FormProvider>
  )
}
