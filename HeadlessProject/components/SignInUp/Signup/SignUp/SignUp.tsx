/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useQuery } from '@graphcommerce/graphql'
import {
  ApolloCustomerErrorSnackbar,
  IsEmailAvailableDocument,
  SignUpDocument,
  SignUpMutation,
  SignUpMutationVariables,
  useFormIsEmailAvailable,
} from '@graphcommerce/magento-customer'
import { SignUpConfirmDocument } from '@graphcommerce/magento-customer/components/SignUpForm/SignUpConfirm.gql'
import { graphqlErrorByCategory } from '@graphcommerce/magento-graphql'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { Button, FormActions, InputCheckmark, LayoutTitle } from '@graphcommerce/next-ui'
import { useFormGqlMutation, useFormPersist, emailPattern } from '@graphcommerce/react-hook-form'
import { useAssignCompareIdToCustomer } from '../../../../graphql/hooks'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import {
  Alert,
  FormControlLabel,
  TextField,
  InputAdornment,
  IconButton,
  Link,
  Box,
  Grid,
  Typography,
  Checkbox,
  InputLabel,
  CircularProgress,
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { EyeOpen, EyeClose } from '../../../Icons'
import { UIContext } from '../../../common/contexts/UIContext'
import { AlertToast } from '@components/AlertToast'
import { passRegex } from 'config/constants'

const requireEmailValidation = process.env.BUILD_FLAG_CUSTOMER_REQUIRE_EMAIL_CONFIRMATION === '1'

const SignUpForm = () => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false)
  const router = useRouter()
  const { assignCompareList, data } = useAssignCompareIdToCustomer()
  const [compareListId, setCompareListId] = useState<string>('')
  const [state, setState] = useContext(UIContext)

  const storeConfig = useQuery(StoreConfigDocument).data?.storeConfig

  const Mutation = requireEmailValidation ? SignUpConfirmDocument : SignUpDocument

  const form = useFormGqlMutation<
    SignUpMutation,
    SignUpMutationVariables & { confirmPassword?: string }
  >(
    Mutation,
    {
      defaultValues: {},
      onBeforeSubmit: (values) => ({ ...values }),
      onComplete: async (values) => {
        if (compareListId) {
          await assignCompareList(compareListId)
        }

        if (!values?.errors || (values?.errors && values?.errors?.length <= 0)) {
          await router.push('/account')
          setState((prev) => ({
            ...prev,
            alerts: [
              {
                type: 'success',
                message: `<span>Thank you for registering with Main Website Store.</span>`,
                timeout: 8000,
                targetLink: '/account',
              },
            ],
          }))
        }
      },
    },
    { errorPolicy: 'all' },
  )

  const { muiRegister, handleSubmit, valid, required, watch, formState, error } = form
  const [inputError] = graphqlErrorByCategory({ category: 'graphql-input', error })
  const { data: isEmailAvailable } = useQuery(IsEmailAvailableDocument, {
    variables: { email: watch('email') },
  })
  const hasAccount = isEmailAvailable?.isEmailAvailable?.is_email_available === false
  const submitHandler = handleSubmit(() => {})
  const watchPassword = watch('password')
  const { mode } = useFormIsEmailAvailable({ email: watch('email') })
  useEffect(() => {
    const compareId = localStorage.getItem('CompareListId')
    if (compareId) {
      setCompareListId(compareId)
    }
    if (mode === 'signedin') {
      router
        .push('/account')
        .then(() => {})
        .catch(() => {})
    }
  }, [router, mode, assignCompareList, data])

  useEffect(() => {
    if (inputError?.message)
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'error',
            message: `<span>There is already an account with this email address. If you are sure that it is your email address, <a href='/account/forgot-password'>click here</a> to get your password and access your account.
          </span>`,
            timeout: 10000,
            targetLink: router.pathname,
          },
        ],
      }))
  }, [inputError?.message])

  useFormPersist({ form, name: 'SignUp', exclude: ['password', 'confirmPassword'] })

  if (requireEmailValidation && form.formState.isSubmitSuccessful) {
    return (
      <Alert>
        <Trans
          id='Please check your inbox to validate your email ({email})'
          values={{ email: watch('email') }}
        />
      </Alert>
    )
  }

  const isValidEmail = emailPattern.test(watch('email'))
  return (
    <Box
      sx={{
        paddingTop: '1.3rem',
      }}
    >
      <form onSubmit={submitHandler} noValidate>
        <LayoutTitle
          variant='h2'
          gutterBottom={false}
          gutterTop={false}
          sx={{
            // margin: '40px 0px',
            display: 'flex',
            paddingBottom: '2rem',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            // flexDirection: { xs: 'column', md: 'row' },
            '& h1': {
              fontWeight: '300',
              fontVariationSettings: `'wght' 300`,
            },
          }}
        >
          <Trans id='Create New Customer Account' />
        </LayoutTitle>

        {state?.alerts?.length > 0 && (
          <AlertToast
            sx={{
              margin: '1rem 0 2rem',
              zIndex: '10',
              position: 'relative',
            }}
            alerts={state?.alerts}
            link={router?.pathname}
          />
        )}
        <Grid container spacing={{ xs: 3, md: 6 }}>
          <Grid item xs={12} md={8} lg={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                marginRight: 'auto',
                paddingTop: '0',
              }}
            >
              <Typography
                variant='h4'
                sx={{
                  color: '#333',
                  fontSize: { xs: '1rem', md: '1.375rem' },
                  fontWeight: '300',
                  fontVariationSettings: `'wght' 300`,
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid #c6c6c6',
                  marginBottom: { xs: '0.875rem', md: '1.5rem' },
                }}
              >
                <Trans id='Personal Information' />
              </Typography>

              <Box
                sx={{
                  marginTop: '0',
                  marginBottom: '1rem',
                }}
              >
                <InputLabel required htmlFor='First Name'>
                  <Trans id='First Name' />
                </InputLabel>
                <TextField
                  sx={{ minWidth: '100%' }}
                  required={required.firstname}
                  variant='outlined'
                  error={formState.isSubmitted && !!formState.errors.firstname}
                  helperText={formState.isSubmitted && formState.errors.firstname?.message}
                  type='text'
                  autoFocus
                  InputProps={{
                    endAdornment: <InputCheckmark show={valid.firstname} />,
                  }}
                  {...muiRegister('firstname', {
                    required: {
                      value: true,
                      message: 'This is a required field.',
                    },
                  })}
                />
              </Box>

              <Box
                sx={{
                  marginTop: '0',
                  marginBottom: '1rem',
                }}
              >
                <InputLabel required htmlFor='Last Name'>
                  <Trans id='Last Name' />
                </InputLabel>
                <TextField
                  sx={{ minWidth: '100%' }}
                  required={required.lastname}
                  variant='outlined'
                  error={formState.isSubmitted && !!formState.errors.lastname}
                  helperText={formState.isSubmitted && formState.errors.lastname?.message}
                  type='text'
                  InputProps={{
                    endAdornment: <InputCheckmark show={valid.lastname} />,
                  }}
                  {...muiRegister('lastname', {
                    required: {
                      value: true,
                      message: 'This is a required field.',
                    },
                  })}
                />
              </Box>

              <Box
                sx={{
                  marginBottom: { xs: '0.875rem', md: '1.875rem' },
                }}
              >
                <FormControlLabel
                  control={<Checkbox color='primary' />}
                  {...muiRegister('isSubscribed', { required: required.isSubscribed })}
                  disabled={formState.isSubmitting}
                  label={<Trans id='Sign Up for Newsletter' />}
                />
              </Box>

              <Box>
                <Typography
                  variant='h4'
                  sx={{
                    color: '#333',
                    fontSize: { xs: '1rem', md: '1.375rem' },
                    fontWeight: '300',
                    fontVariationSettings: `'wght' 300`,
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid #c6c6c6',
                    marginBottom: { xs: '0.875rem', md: '1.5rem' },
                  }}
                >
                  <Trans id='Sign-In Information' />
                </Typography>
              </Box>

              <Box
                sx={{
                  marginTop: '0',
                  marginBottom: '1rem',
                }}
              >
                <InputLabel required htmlFor='email'>
                  <Trans id='Email' />
                </InputLabel>
                <TextField
                  sx={{ minWidth: '100%' }}
                  variant='outlined'
                  type='text'
                  autoComplete='email'
                  error={
                    (formState.isSubmitted && !!formState.errors.email) ||
                    !!(watch('email') && !isValidEmail) ||
                    hasAccount
                  }
                  helperText={
                    (formState.isSubmitted && formState.errors.email?.message) ||
                    (hasAccount && (
                      <Typography component='span'>
                        There is already an account with this email address. If you are sure that it
                        is your email address, <a href='/account/forgot-password'>click here</a> to
                        get your password and access your account.
                      </Typography>
                    ))
                  }
                  required={required.email}
                  disabled={false}
                  {...muiRegister('email', {
                    required: {
                      value: true,
                      message: 'This is a required field.',
                    },
                    pattern: {
                      value: emailPattern,
                      message: 'Please enter a valid email address (Ex: johndoe@domain.com).',
                    },
                  })}
                  InputProps={{
                    autoComplete: 'email',
                  }}
                />
              </Box>

              <Box
                sx={{
                  marginTop: '0',
                  marginBottom: '1rem',
                }}
              >
                <InputLabel required htmlFor='Password'>
                  <Trans id='Password' />
                </InputLabel>
                <TextField
                  variant='outlined'
                  type={showPassword ? 'text' : 'password'}
                  error={!!formState.errors.password}
                  autoComplete='new-password'
                  required={required.password}
                  {...muiRegister('password', {
                    required: {
                      value: true,
                      message: 'This is a required field.',
                    },
                    minLength: {
                      value: Number(storeConfig?.minimum_password_length ?? 8),
                      message: i18n._(/* i18n */ 'Password must have at least 8 characters'),
                    },
                    pattern: {
                      value: passRegex,
                      message:
                        'Minimum of different classes of characters in password is 3. Classes of characters: Lower Case, Upper Case, Digits, Special Characters.',
                    },
                  })}
                  helperText={formState.errors.password?.message}
                  disabled={formState.isSubmitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={() => setShowPassword((prevShowPassword) => !prevShowPassword)}
                        >
                          {showPassword ? <EyeClose /> : <EyeOpen />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box
                sx={{
                  marginTop: '0',
                  marginBottom: '1rem',
                }}
              >
                <InputLabel required htmlFor='Confirm password'>
                  <Trans id='Confirm password' />
                </InputLabel>
                <TextField
                  sx={{ minWidth: '100%' }}
                  variant='outlined'
                  type={showConfirmPassword ? 'text' : 'password'}
                  error={!!formState.errors.confirmPassword}
                  autoComplete='new-password'
                  required
                  {...muiRegister('confirmPassword', {
                    required: {
                      value: true,
                      message: 'This is a required field.',
                    },
                    validate: (value) =>
                      value === watchPassword ||
                      i18n._(/* i18n */ 'Please enter the same value again.'),
                  })}
                  helperText={formState.errors.confirmPassword?.message}
                  disabled={formState.isSubmitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword((prevShowPassword) => !prevShowPassword)
                          }
                        >
                          {showConfirmPassword ? <EyeClose /> : <EyeOpen />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                margin: '0.875rem 0 1rem',
              }}
            >
              <Typography
                component='p'
                sx={{
                  color: '#e02b27',
                  fontSize: '0.75rem !important',
                  lineHeight: '0.875rem !important',
                }}
              >
                * Required Fields
              </Typography>
            </Box>

            {/* <ApolloCustomerErrorSnackbar error={remainingError} /> */}

            <FormActions
              sx={{
                paddingBottom: '0.625rem',
                paddingTop: { xs: '0.875rem', md: '1.875rem' },
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginRight: { xs: 0, md: 'auto' },
              }}
            >
              <Button
                sx={{
                  color: '#ffffff',
                  marginRight: { xs: 0, md: '1rem' },
                  marginBottom: { xs: '1rem', md: '0' },
                  minWidth: { xs: '100%', md: '64px' },
                }}
                type='submit'
                id='create-account'
                variant='contained'
                color='secondary'
                size='medium'
                loading={formState.isSubmitting}
                disabled={hasAccount}
              >
                <Trans id='Create an Account' />
              </Button>
            </FormActions>

            <Box
              component='div'
              sx={{
                display: 'flex',
                marginBottom: '2rem',
                justifyContent: 'flex-start',
              }}
            >
              Already a customer?{' '}
              <Link
                sx={{ marginLeft: '0.75rem' }}
                underline='hover'
                color='secondary'
                href='/account/signin'
              >
                Sign in
              </Link>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

// eslint-disable-next-line import/no-default-export
export default SignUpForm
