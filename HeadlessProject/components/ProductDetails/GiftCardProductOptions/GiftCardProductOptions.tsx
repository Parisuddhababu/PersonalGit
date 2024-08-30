import { useCartQuery, useCurrentCartId, useFormGqlMutationCart } from '@graphcommerce/magento-cart'
import { TextInputNumber, extendableComponent } from '@graphcommerce/next-ui'
import { emailPattern } from '@graphcommerce/react-hook-form'

import { GiftCardProductsAddToCartDocument } from '@graphql/product/GiftCardProducts/GiftCardProductsAddToCart.gql'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  FormControl,
  FormHelperText,
} from '@mui/material'
import { Button } from '@graphcommerce/next-ui'
import { CartPageDocument } from '@graphcommerce/magento-cart-checkout'
import { useContext, useEffect, useState } from 'react'
import { UIContext } from '@components/common/contexts/UIContext'
import { useRouter } from 'next/router'
import { UpdateCartButton } from '@components/UpdateCartButton'

const componentName = 'OrderDetails' as const
const parts = [
  'root',
  'sectionContainer',
  'orderDetailTitle',
  'orderDetailsInnerContainer',
  'totalsContainer',
  'totalsRow',
  'totalsDivider',
  'totalsVat',
  'iconContainer',
  'invoice',
] as const
const { classes } = extendableComponent(componentName, parts)

function GiftCardProductOptions(props: any) {
  const { product, cartDetails } = props
  const [, setState] = useContext(UIContext)
  const router = useRouter()
  const messageRegex = (max) => {
    return new RegExp(`^.{1,${max}}$`)
  }
  const { currentCartId } = useCurrentCartId()
  const [selectedAmount, setSelectedAmount] = useState('choose an amount...')
  const [customAmount, setCustomAmount] = useState('')
  const [quantity, setQuantity] = useState(
    cartDetails?.editData?.[0]?.qty ? cartDetails?.editData?.[0]?.qty : '1',
  )
  const [submitClicked, setSubmitClicked] = useState(false)

  const handleAmountChange = (event) => {
    const selectedValue = event.target.value
    setSelectedAmount(selectedValue)

    if (selectedValue === 'custom') {
      setCustomAmount('')
    }
  }

  const handleCustomAmountChange = (event) => {
    setCustomAmount(event.target.value)
  }

  const { refetch: refetchCart } = useCartQuery(CartPageDocument, {
    variables: {
      cartId: currentCartId,
    },
  })
  const form = useFormGqlMutationCart(GiftCardProductsAddToCartDocument, {
    defaultValues: {
      quantity: quantity,
      senderName:
        cartDetails?.options?.find((el) => el?.code === 'giftcard_sender_name')?.value ?? '',
      senderEmail:
        cartDetails?.options?.find((el) => el?.code === 'giftcard_sender_email')?.value ?? '',
      recipientName:
        cartDetails?.options?.find((el) => el?.code === 'giftcard_recipient_name')?.value ?? '',
      recipientEmail:
        cartDetails?.options?.find((el) => el?.code === 'giftcard_recipient_email')?.value ?? '',
      message: cartDetails?.options?.find((el) => el?.code === 'giftcard_message')?.value ?? '',
      sku: product.sku,
      cartId: currentCartId,
    },
    mode: 'onChange',
    onBeforeSubmit: async (formData) => ({
      ...formData,
      quantity: formData?.quantity ? formData?.quantity : cartDetails?.qty,
      amount: selectedAmount === 'custom' ? customAmount.toString() : selectedAmount.toString(),
    }),
    onComplete: async (res) => {
      await refetchCart()
    },
  })

  const { handleSubmit, muiRegister, formState, required, error, setValue, reset, watch } = form

  const giftCardData = {
    amount: customAmount || (Number(selectedAmount) ? selectedAmount : ''),
    qty: watch('quantity'),
    recipientName: watch('recipientName'),
    recipientEmail: watch('recipientEmail'),
    senderEmail: watch('senderEmail'),
    senderName: watch('senderName'),
    message: watch('message'),
  }
  const checkError =
    product.giftcard_type !== 'PHYSICAL'
      ? Boolean(
          (Number(customAmount) || Number(selectedAmount)) &&
            watch('quantity') &&
            watch('recipientName') &&
            watch('senderName') &&
            watch('recipientEmail') &&
            watch('senderEmail'),
        )
      : Boolean(
          (Number(customAmount) || Number(selectedAmount)) &&
            watch('quantity') &&
            watch('recipientName') &&
            watch('senderName'),
        )
  const showSuccess = !formState.isSubmitting && formState.isSubmitSuccessful && !error?.message
  const showErrorSnackbar = error?.message
  useEffect(() => {
    if (showSuccess) {
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'success',
            message: `<span>You added ${product?.name} to your <a href='/cart'>shopping cart.</a></span>`,
            timeout: 5000,
            targetLink: router?.pathname,
          },
        ],
      }))
      reset()
    }
    if (showErrorSnackbar) {
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'error',
            message: `${error.message}`,
            timeout: 5000,
            targetLink: router?.pathname,
          },
        ],
      }))
      reset()
    }
  }, [showSuccess, showErrorSnackbar])

  const submitHandler = () => {
    setSubmitClicked(true)
    handleSubmit((data) => {})()
  }

  useEffect(() => {
    if (cartDetails?.qty) {
      setValue('quantity', cartDetails.qty)
    }
  }, [])

  const renderAmountTextField = () => {
    if (!product.allow_open_amount) {
      return null
    }

    return (
      <Box>
        <InputLabel required>Amount in USD</InputLabel>
        <TextField
          variant='outlined'
          type='text'
          autoFocus
          error={
            selectedAmount === '' ||
            (formState.isSubmitted && !!formState.errors.amount) ||
            (customAmount !== '' &&
              ((product?.open_amount_min && customAmount < product.open_amount_min) ||
                (product?.open_amount_max && customAmount > product.open_amount_max)))
          }
          helperText={
            (selectedAmount === '' && 'This is a required field.') ||
            (formState.isSubmitted && formState.errors.amount?.message)
          }
          required={required.amount}
          {...muiRegister('amount', {
            required: {
              value: true,
              message: 'This is a required field.',
            },
            min: {
              value: product?.open_amount_min,
              message: `Please enter a value greater than or equal to ${product?.open_amount_min}.`,
            },
            max: {
              value: product?.open_amount_max,
              message: `Please enter a value less than or equal to  ${product?.open_amount_max}.`,
            },
          })}
          inputProps={{ min: product?.open_amount_min, max: product?.open_amount_max }}
          disabled={formState.isSubmitting}
          value={customAmount || ''}
          onChange={handleCustomAmountChange}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: '0',
          }}
        >
          {product?.open_amount_min && (
            <Typography>Minimum:- {product?.open_amount_min}</Typography>
          )}
          {product?.open_amount_max && (
            <Typography>Maximum:- {product?.open_amount_max}</Typography>
          )}
        </Box>
      </Box>
    )
  }

  return (
    <form noValidate>
      <Box
        sx={(theme) => ({
          borderBottom: `1px solid #c1c1c1`,
          paddingBottom: { xs: '1rem', md: '1.875rem' },
          marginBottom: '1rem',
        })}
      >
        <Grid container spacing={{ xs: 2, md: 3.125 }}>
          {product.giftcard_amounts.length > 0 ? (
            <>
              <Grid item xs={12} md={6}>
                <Box>
                  <InputLabel required>Amount</InputLabel>
                  <FormControl
                    error={submitClicked && selectedAmount === 'choose an amount...'}
                    sx={{
                      width: '100%',
                    }}
                  >
                    <Select
                      value={selectedAmount}
                      onChange={handleAmountChange}
                      sx={{
                        width: '100%',
                        borderRadius: '0',
                        '& .MuiSelect-select': {
                          // padding: '0.375rem 1.563rem 0.375rem 0.625rem',
                        },
                      }}
                    >
                      <MenuItem value='choose an amount...'>Choose an Amount....</MenuItem>
                      {product.giftcard_amounts.map((amount) => (
                        <MenuItem key={amount.value_id} value={amount.value}>
                          {'$'}
                          {amount.website_value}
                        </MenuItem>
                      ))}
                      {product.allow_open_amount && (
                        <MenuItem value='custom'>Choose Another Amount</MenuItem>
                      )}
                    </Select>
                    {submitClicked && selectedAmount === 'choose an amount...' && (
                      <FormHelperText>This is a required field</FormHelperText>
                    )}
                  </FormControl>
                </Box>
              </Grid>
              {selectedAmount === 'custom' ? (
                <Grid item xs={12} md={6}>
                  {renderAmountTextField()}
                </Grid>
              ) : null}
            </>
          ) : (
            <Grid item xs={12} md={6}>
              {renderAmountTextField()}
            </Grid>
          )}
        </Grid>
      </Box>

      <Grid container spacing={3.125} sx={{ marginBottom: '1rem' }}>
        <Grid item xs={12} md={6}>
          <Box>
            <InputLabel required>Sender name</InputLabel>
            <TextField
              variant='outlined'
              type='text'
              defaultValue={
                cartDetails?.options?.find((el) => el?.code === 'giftcard_sender_name')?.value ?? ''
              }
              autoFocus
              error={formState.isSubmitted && !!formState.errors.senderName}
              helperText={formState.isSubmitted && formState.errors.senderName?.message}
              required={required.senderName}
              {...muiRegister('senderName', {
                required: {
                  value: true,
                  message: 'This is a required field.',
                },
              })}
              disabled={formState.isSubmitting}
            />
          </Box>
        </Grid>

        {product.giftcard_type !== 'PHYSICAL' && (
          <Grid item xs={12} md={6}>
            <Box>
              {' '}
              <InputLabel required>Sender Email</InputLabel>
              <TextField
                variant='outlined'
                type='text'
                autoComplete='email'
                error={formState.isSubmitted && !!formState.errors.senderEmail}
                helperText={formState.isSubmitted && formState.errors.senderEmail?.message}
                required={required.senderEmail}
                {...muiRegister('senderEmail', {
                  required: {
                    value: true,
                    message: 'This is a required field.',
                  },
                  pattern: {
                    value: emailPattern,
                    message: i18n._(/* i18n */ 'Invalid email address'),
                  },
                })}
                disabled={formState.isSubmitting}
              />
            </Box>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <Box>
            <InputLabel required>Recipient Name</InputLabel>
            <TextField
              variant='outlined'
              type='text'
              error={!!formState.errors.recipientName}
              required={required.recipientName}
              {...muiRegister('recipientName', {
                required: {
                  value: true,
                  message: 'This is a required field.',
                },
              })}
              helperText={formState.isSubmitted && formState.errors.recipientName?.message}
              disabled={formState.isSubmitting}
            />
          </Box>
        </Grid>

        {product.giftcard_type !== 'PHYSICAL' && (
          <Grid item xs={12} md={6}>
            <Box>
              <InputLabel required>Recipient Email</InputLabel>
              <TextField
                variant='outlined'
                type='text'
                required={required.recipientEmail}
                {...muiRegister('recipientEmail', {
                  required: {
                    value: true,
                    message: 'This is a required field.',
                  },
                  pattern: { value: /^(?!\s).*$/, message: 'emptySpace is not allowed' },
                })}
                error={formState.isSubmitted && !!formState.errors.recipientEmail}
                helperText={formState.isSubmitted && formState.errors.recipientEmail?.message}
                disabled={formState.isSubmitting}
              />
            </Box>
          </Grid>
        )}

        <Grid item xs={12}>
          <Box>
            <InputLabel>Message</InputLabel>
            <TextField
              variant='outlined'
              type='text'
              {...muiRegister('message', {
                pattern: {
                  value: messageRegex(product?.message_max_length),
                  message: `*Please enter no more than ${product?.message_max_length} characters.`,
                },
              })}
              inputProps={{ max: product.message_max_length }}
              error={formState.isSubmitted && !!formState.errors.message}
              helperText={formState.isSubmitted && formState.errors.message?.message}
              disabled={formState.isSubmitting}
              multiline
              rows={4}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              marginBottom: { xs: '1.25rem', md: '1.875rem' },
            }}
          >
            <InputLabel>Qty</InputLabel>
            <TextInputNumber
              size='small'
              variant='outlined'
              defaultValue={quantity}
              inputProps={{ min: 1 }}
              error={!!formState.errors.quantity}
              {...muiRegister('quantity', { required: required.quantity })}
              helperText={formState.errors.quantity?.message}
              onChange={(event) => setQuantity(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === '-') {
                  event.preventDefault()
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Box
        sx={(theme) => ({
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' },
          alignItems: 'start',
          columnGap: theme.spacings.xs,
          '& button': {
            width: { xs: '100%', md: 'auto' },
            minWidth: { xs: '100%', md: '243px' },
          },
        })}
      >
        {cartDetails && checkError ? (
          <UpdateCartButton
            fullWidth
            product={product}
            editDetails={cartDetails}
            getGiftCard={giftCardData}
            sx={{
              backgroundColor: '#1979c3',
              color: '#ffffff',
              borderRadius: '0',
              fontWeight: '500',
              ':hover': { backgroundColor: '#006bb4' },
            }}
          />
        ) : (
          <Button
            fullWidth
            variant='contained'
            size='large'
            color='secondary'
            onClick={submitHandler}
            loading={formState.isSubmitting}
          >
            <Trans id={cartDetails ? 'Update Cart' : 'Add to Cart'} />
          </Button>
        )}
      </Box>

      {/* <FormActions sx={{ gridAutoFlow: 'row' }}>
        <FormControl>
          <Button
            fullWidth
            variant='contained'
            size='large'
            color='secondary'
            // sx={{
            //   backgroundColor: '#0287D1',
            //   color: '#ffffff',
            //   borderRadius: '0',
            //   fontWeight: '500',
            //   fontSize: '2rem',

            //   ':hover': { backgroundColor: '#1979c3' },
            // }}
            onClick={submitHandler}
          >
            <Trans id={cartDetails?.qty ? 'Update Cart' : 'Add to Cart'} />
          </Button>
        </FormControl>
      </FormActions> */}
    </form>
  )
}

export default GiftCardProductOptions
