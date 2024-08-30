import { useCartQuery, useCurrentCartId } from '@graphcommerce/magento-cart'
import { usePaymentMethodContext, useCartLock} from '@graphcommerce/magento-cart-payment-method'
import {
  Controller,
  useForm,
  useFormCompose,
  UseFormComposeOptions,
  useFormPersist,
} from '@graphcommerce/react-hook-form'
import { Box, FormControlLabel, FormGroup, Radio, RadioGroup, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { usePaypalOnShoppingCart, useSetPaymentMethodForm } from '../hooks'
import { CartBillingAddressForm } from './PaymentPage'
// import { PayPalButtons } from "@paypal/react-paypal-js";
import {ShippingPageDocument} from "@graphcommerce/magento-cart-checkout";
import PaypalIcon from "@graphcommerce/magento-payment-paypal/icons/paypal.svg";
import {IconSvg} from "@graphcommerce/next-ui";

export type PaymentMethodActionCardListFormProps = Pick<UseFormComposeOptions, 'step'> & {
  children?: React.ReactNode
}
export const notAllowedPaymentMethods = ['braintree_cc_vault', 'braintree', 'paypal_express_bml']
export function CheckoutPaymentMethodActionCardListForm(props: PaymentMethodActionCardListFormProps) {
  const { children } = props
  const { currentCartId } = useCurrentCartId()
  const { methods, selectedMethod, setSelectedMethod, setSelectedModule, modules } =
    usePaymentMethodContext()

  const {data: cartData} = useCartQuery(ShippingPageDocument, { returnPartialData: true, errorPolicy: 'all' })
  const [paypalCaputre, setPaypalCaputre] = useState<boolean>(false)


  const [lockState] = useCartLock()

  type FormFields = { code: string | null; paymentMethod?: string }
  const form = useForm<FormFields>({
    defaultValues: { code: lockState.method },
  })

  const {setPaymentMethodOnCart, loading: paymentLoading} = useSetPaymentMethodForm()
  const {callPaypalMethod, loading: paypalLoading} = usePaypalOnShoppingCart({})

  const { control, handleSubmit, watch, setValue } = form
  const submit = handleSubmit(() => {})

  const paymentMethod = watch('paymentMethod')

  useFormPersist({ form, name: 'PaymentMethodActionCardList' })
  useFormCompose({ form, step: 1, submit, key: 'PaymentMethodActionCardList' })

  useEffect(() => {
    const [code, child] = paymentMethod?.split('___') ?? ['']
    if (code === selectedMethod?.code) return

    const foundMethod = methods.find(
      (method) => method.code === code && (!child || method.child === child),
    )
    console.log("modules checkout", modules)
    if (foundMethod && !modules?.[foundMethod?.code ?? '']) {
      console.error(`No PaymentModule found for method ${foundMethod.code}`)
    }
    setSelectedMethod(foundMethod)
    setSelectedModule(modules?.[foundMethod?.code ?? ''])
  }, [methods, modules, paymentMethod, selectedMethod?.code, setSelectedMethod, setSelectedModule])

  useEffect(() => {
    if (selectedMethod?.code) {
      setValue('code', selectedMethod.code)
      setPaymentMethodOnCart({
        variables: {
          cartId: currentCartId,
          code: selectedMethod.code,
          payer_id: "",
          token: ""
        }
      })
    }
  }, [selectedMethod?.code, setValue])

  const cartItemsData = () => {
    return cartData?.cart?.items?.map((item) => {
      return {
        name: item?.product?.name,
        quantity: item?.quantity,
        unit_amount: {
          currency_code: item?.product?.price?.regularPrice?.amount?.currency,
          value: item?.product?.price?.regularPrice?.amount?.value
        },
        sku: item?.product?.sku
      }
    })
  }

  const handleCreateOrder = (data, action) => {
    try {
      return action.order.create({
          intent: "CAPTURE",
          purchase_units: [
              {
                  items: cartItemsData(),
                  amount: {
                      currency_code: cartData?.cart?.prices?.grand_total?.currency,
                      value: cartData?.cart?.prices?.grand_total?.value,
                      breakdown: {
                        item_total: {
                          currency_code: cartData?.cart?.prices?.subtotal_excluding_tax?.currency,
                          value: cartData?.cart?.prices?.subtotal_excluding_tax?.value,
                        },
                        shipping: {
                          currency_code: cartData?.cart?.shipping_selected_methods?.amount?.currency,
                          value: cartData?.cart?.shipping_selected_methods?.amount?.value,
                        },
                      }
                  },
              }
          ]
      })
    } catch (error) {
        console.log(error);
    }
  }

  if (!methods || methods.length < 1) return null

  return (
    <Box >
    <Controller
      render={({ field }) => (
      <RadioGroup {...field} >
        {methods?.map((method) => (
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            borderBottom: '1px solid #cccccc',
            padding: '1.094rem 0',
            '& b': {
              marginLeft: '0.5rem'
            }
          }}
          key={method?.code}>
            <FormControlLabel sx={{
              flexDirection: 'row',
              margin: '0',
              '& .MuiRadio-root': {
                padding: '0',
                fontSize: '0.5rem',
                marginRight: '0.45rem',
              }
            }}
            disabled={notAllowedPaymentMethods.includes(method.code)}
            value={`${method.code}___${method.child}`} control={<Radio />} labelPlacement="start"
            label="" />
            <Typography>
              {method?.title}
            </Typography>
            {selectedMethod?.code === method.code && (<Box sx={{
              width: '100%',
              paddingLeft: {md:'3rem'},
              paddingTop: '0.75rem',
            }}>
              {method.code !== 'paypal_express' && ( <CartBillingAddressForm>
                {children}
              </CartBillingAddressForm>)}
              {/*{(method.code === 'paypal_express' && !paypalCaputre) && (<PayPalButtons*/}
              {/*style={{ layout: "horizontal" }}*/}
              {/*createOrder={(data, action) => handleCreateOrder(data, action)}*/}
              {/*onApprove={(data, actions) => {*/}
              {/*  return actions?.order?.capture().then((details) => {*/}
              {/*    const name = details?.payer?.name?.given_name;*/}
              {/*    setPaypalCaputre(true)*/}
              {/*    callPaypalMethod({*/}
              {/*      onCompleted: (response) => {*/}
              {/*        setPaymentMethodOnCart({*/}
              {/*          variables: {*/}
              {/*            cartId: currentCartId,*/}
              {/*            code: 'paypal_express',*/}
              {/*            payer_id: details?.payer?.payer_id ?? "",*/}
              {/*            token: response?.createPaypalExpressToken?.token ?? ""*/}
              {/*          }*/}
              {/*        })*/}
              {/*      }*/}
              {/*    })*/}
              {/*}) as any;*/}
              {/*}} />)}*/}
              {(method.code === 'paypal_express') &&(
              <FormGroup>
                <IconSvg src={PaypalIcon}/> {children}
              </FormGroup>
              )}
            </Box>)}
          </Box>
        ))}
      </RadioGroup>
    )}
    name="paymentMethod"
    control={control}
    />
   </Box>
  )
}
