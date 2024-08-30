import { useApolloClient } from '@graphcommerce/graphql'
import { graphqlErrorByCategory } from '@graphcommerce/magento-graphql'
import { Button, FormRow, FormActions } from '@graphcommerce/next-ui'
import { useFormGqlMutation } from '@graphcommerce/react-hook-form'
import { Trans } from '@lingui/react'
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  SxProps,
  TextField,
  Theme,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { emailPattern } from '@graphcommerce/react-hook-form'
import { EyeOpen, EyeClose } from '@components/Icons'
import {
  SignInDocument,
  CustomerDocument,
  ApolloCustomerErrorAlert,
} from '@graphcommerce/magento-customer'
import { passRegex } from 'config/constants'

type SignInFormProps = { email: string; sx?: SxProps<Theme>; loginPopUp?: string }

export function CheckoutPasswordForm(props: SignInFormProps) {
  const { email, sx, loginPopUp } = props
  const labelStyle = {
    color: '#000',
    marginBottom: '0.5rem',
    fontWeight: '600',
  }
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const client = useApolloClient()
  const form = useFormGqlMutation(
    SignInDocument,
    {
      defaultValues: { email },
      onBeforeSubmit: async (values) => {
        return { ...values, email }
      },
      onComplete: (respone) => {
        console.log('response', respone)
      },
    },
    { errorPolicy: 'all' },
  )

  const { muiRegister, handleSubmit, watch, required, formState, error } = form
  const [remainingError, authError] = graphqlErrorByCategory({
    category: 'graphql-authentication',
    error,
  })
  const submitHandler = handleSubmit(() => {})
  const isValidPassword = passRegex.test(watch('password'))
  const isValidEmail = emailPattern.test(watch('email'))

  return (
    <Box component='form' onSubmit={submitHandler} noValidate sx={sx}>

      <Box sx={{marginBottom: '1.5rem'}}>

        <Box sx={{marginBottom: '0.5rem'}}>

          <InputLabel sx={{ ...labelStyle }} htmlFor='Password'>
            <Trans id='Password' />
          </InputLabel>
          <TextField
            key='password'
            variant='outlined'
            type={showPassword ? 'text' : 'password'}
            error={
              !!formState.errors.password ||
              !!authError ||
              (watch('password') && !isValidPassword ? true : false)
            }
            autoComplete='current-password'
            id='current-password'
            required={required.password}
            {...muiRegister('password', { required: {
                    value: true,
                    message: 'This is a required field.',
                },
                pattern: {
                    value: passRegex,
                    message: 'Minimum of different classes of characters in password is 3. Classes of characters: Lower Case, Upper Case, Digits, Special Characters.',
                },
            })}
            InputProps={{
              endAdornment: (
                <>
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleClickShowPassword}
                    >
                      {showPassword ? <EyeOpen /> : <EyeClose />}
                    </IconButton>
                  </InputAdornment>
                </>
              ),
            }}
            helperText={formState.errors.password?.message || authError?.message}
            disabled={formState.isSubmitting}
          />

        </Box>

        {!loginPopUp && (
          <Typography
            variant='body1'
          >
            <Trans id='You already have an account with us. Sign in or continue as guest.' />
          </Typography>
        )}

      </Box>

      <ApolloCustomerErrorAlert error={remainingError} key='error' />

      <FormActions
        sx={{
          padding: '0',
          display: 'block',
          paddingTop: '0',
        }}
      >
        <FormControl
          className='popoverFooterControl'
          sx={{
            display: 'flex',
            alignItems: 'center',
            // justifyContent: 'space-between',
            flexDirection: {xs: 'column', md:'row'},
            gap: {xs: '1rem', md:'0.938rem'}
          }}
        >
          <Button
            type='submit'
            loading={formState.isSubmitting}
            color='secondary'
            variant='contained'
            size='medium'
            sx={{
              width: {xs: '100%', md: 'auto'},
            }}
          >
              <Trans id='Log in' />
          </Button>
          <Link
              href='/account/forgot-password'
              underline='hover'
              sx={{ whiteSpace: 'nowrap' }}
          >
              <Trans id='Forgot password?' />
          </Link>
        </FormControl>

      </FormActions>

    </Box>
  )
}
