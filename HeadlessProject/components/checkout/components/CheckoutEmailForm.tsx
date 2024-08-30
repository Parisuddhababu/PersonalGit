import { PopOverValues } from '@components/common/pop-over'
import { useQuery } from '@graphcommerce/graphql'
import {
  useCartQuery,
  useFormGqlMutationCart,
  useMergeCustomerCart,
} from '@graphcommerce/magento-cart'
import { CartEmailDocument } from '@graphcommerce/magento-cart-email/EmailForm/CartEmail.gql'
import { SetGuestEmailOnCartDocument } from '@graphcommerce/magento-cart-email/EmailForm/SetGuestEmailOnCart.gql'
import {
  ApolloCustomerErrorAlert,
  IsEmailAvailableDocument,
  useCustomerSession,
} from '@graphcommerce/magento-customer'
import { FormRow, FormDiv } from '@graphcommerce/next-ui'
import { emailPattern, useFormAutoSubmit, useFormCompose } from '@graphcommerce/react-hook-form'
import { Trans } from '@lingui/react'
import {
  Box,
  CircularProgress,
  InputLabel,
  SxProps,
  TextField,
  Theme,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { CheckoutPasswordForm } from '..'

export type CheckoutEmailFormProps = {
  sx?: SxProps<Theme>
  loginPopUpProp?: string
}

export const CheckoutEmailForm = (props: CheckoutEmailFormProps) => {
  const { sx, loginPopUpProp } = props
  useMergeCustomerCart()

  const step = 1
  const { loggedIn } = useCustomerSession()
  const cartEmail = useCartQuery(CartEmailDocument, { hydration: true })

  const email = cartEmail.data?.cart?.email ?? ''

  const [mode, setMode] = useState<'signin' | ''>('')

  const form = useFormGqlMutationCart(SetGuestEmailOnCartDocument, {
    mode: 'onChange',
    defaultValues: { email },
  })

  const { data: isEmailAvailable, loading } = useQuery(IsEmailAvailableDocument, {
    variables: { email },
    skip: !email,
  })

  const { formState, handleSubmit, muiRegister, required, watch, error } = form

  const submit = handleSubmit(() => {})
  useFormCompose({ form, step, submit, key: 'EmailForm' })
  const autoSubmitting = useFormAutoSubmit({
    form,
    submit,
    fields: ['email'],
    forceInitialSubmit: loggedIn ? false : true,
  })
  const hasAccount = isEmailAvailable?.isEmailAvailable?.is_email_available === false
  const { isDirty, isSubmitSuccessful, isSubmitted, isValid } = formState
  const disableFields = formState.isSubmitting && !autoSubmitting

  useEffect(() => {
    if (!isValid) return
    if (!isDirty && isSubmitted && isSubmitSuccessful && isValid) {
      setMode(hasAccount ? 'signin' : '')
    }
  }, [hasAccount, isDirty, isSubmitSuccessful, isSubmitted, isValid])

  if (loggedIn && disableFields) {
    return <CircularProgress />
  }

  return (
    <FormDiv sx={{ ...sx, padding: '0' }}>
      <form noValidate onSubmit={submit}>
        <ApolloCustomerErrorAlert error={error} sx={{ transform: 'translateY(-1rem)' }} />
        <Box
          sx={{
            display: 'flex',
            // alignItems: 'center',
            width: '100%',
            paddingTop: '0',
            gap: '0.25rem',
            marginBottom: '1rem',
          }}
        >
          <Box
            sx={{
              width: '100%',
            }}
          >
            <InputLabel required htmlFor='Email Address'>
              <Trans id='Email Address' />
            </InputLabel>
            <TextField
              variant='outlined'
              type='email'
              autoFocus
              error={formState.isSubmitted && !!formState.errors.email}
              helperText={formState.isSubmitted && formState.errors.email?.message}
              required={required.email}
              disabled={disableFields || loggedIn}
              {...muiRegister('email', {
                required: { value: required.email, message: 'This filed is required.' },
                pattern: {
                  value: emailPattern,
                  message: 'Please enter a valid email address (Ex: johndoe@domain.com).',
                },
              })}
              InputProps={{
                autoComplete: 'email',
                endAdornment: <>{loading && <CircularProgress />}</>,
              }}
              sx={{
                minWidth: '100%',
              }}
            />
          </Box>
          {!loginPopUpProp && (
            <PopOverValues
              text={"We'll send your order confirmation here."}
              sx={{ paddingTop: '1.45rem' }}
            />
          )}
        </Box>
        {mode !== 'signin' && !loginPopUpProp && (
          <Typography variant='body1'>
            <Trans id='You can create an account after checkout.' />
          </Typography>
        )}
      </form>

      {(mode === 'signin' || loginPopUpProp) && (
        <Box>
          <CheckoutPasswordForm email={watch('email')} loginPopUp={loginPopUpProp} />
        </Box>
      )}
    </FormDiv>
  )
}

export default CheckoutEmailForm
