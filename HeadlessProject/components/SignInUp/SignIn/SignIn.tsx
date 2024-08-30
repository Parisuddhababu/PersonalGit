import {
  useFormIsEmailAvailable,
  SignInDocument,
  ApolloCustomerErrorAlert,
} from '@graphcommerce/magento-customer'
import { graphqlErrorByCategory } from '@graphcommerce/magento-graphql'
import {
  Button,
  FormRow,
  FormActions,
  LayoutTitle,
  extendableComponent,
  FullPageMessage,
} from '@graphcommerce/next-ui'
import { useFormGqlMutation, emailPattern } from '@graphcommerce/react-hook-form'
import { Trans } from '@lingui/react'
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  SxProps,
  Theme,
  CircularProgress,
  Grid,
  InputLabel,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect, useRef, useState } from 'react'
import { passRegex } from '../../../config/constants'
import { useAssignCompareIdToCustomer } from '../../../graphql/hooks'
import { AlertToast } from '../../AlertToast'
import { EyeOpen, EyeClose } from '../../Icons'
import { UIContext } from '../../common/contexts/UIContext'

const titleContainerSx: SxProps<Theme> = (theme) => ({
  typography: 'body1',
  marginBottom: theme.spacings.xs,
})

const parts = ['root', 'titleContainer'] as const
const { classes } = extendableComponent('AccountSignInUpForm', parts)

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const { assignCompareList, data } = useAssignCompareIdToCustomer()
  const router = useRouter()
  const [compareListId, setCompareListId] = useState<string>('')
  const [state, setState] = useContext(UIContext)
  const ref = useRef<boolean>(false)

  const form = useFormGqlMutation(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    SignInDocument,
    {
      defaultValues: {},
      onBeforeSubmit: (values) => ({ ...values }),
      onComplete: async (values) => {
        if (compareListId) {
          await assignCompareList(compareListId)
        }
        // if (!values?.errors || (values?.errors && values?.errors?.length <= 0)) {
        //   console.log('Successful signin')
        //   router.back()
        // }
      },
    },
    { errorPolicy: 'all' },
  )

  const { muiRegister, handleSubmit, watch, required, formState, error } = form
  const [remainingError, authError] = graphqlErrorByCategory({
    category: 'graphql-authentication',
    error,
  })
  const { mode } = useFormIsEmailAvailable({ email: watch('email') })

  useEffect(() => {
    const compareId = localStorage.getItem('CompareListId')
    if (compareId) {
      setCompareListId(compareId)
    }
    if (mode === 'signedin') {
      if (!ref.current) {
        console.log('In useeffect')
        ref.current = true
        router.back()
      }
      // router
      //   .push('/account')
      //   .then(() => {})
      //   .catch(() => {})
    }
  }, [router, mode, assignCompareList, data])

  useEffect(() => {
    if (authError?.message)
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'error',
            message: `<span>The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.
          </span>`,
            timeout: 10000,
            targetLink: router.pathname,
          },
        ],
      }))
  }, [authError?.message])

  const submitHandler = handleSubmit(() => {})
  // const isValidPassword = passRegex.test(watch('password'))
  const isValidEmail = emailPattern.test(watch('email'))

  return (
    <>
      {state?.alerts?.length > 0 && (
        <AlertToast sx={{ marginTop: '1rem' }} alerts={state?.alerts} link={router?.pathname} />
      )}
      {!(mode === 'signin' || mode === 'signup' || mode === 'session-expired') && (
        <FullPageMessage icon={<CircularProgress />} title={<Trans id='' />}>
          {/* <Trans id='This may take a second' /> */}
        </FullPageMessage>
      )}
      {(mode === 'signin' || mode === 'signup' || mode === 'session-expired') && (
        <Box
          sx={{
            paddingTop: '1.3rem',
          }}
        >
          <Box
            sx={{
              // margin: '40px 0px',
              display: 'flex',
              paddingBottom: '2rem',
              // flexDirection: { xs: 'column', md: 'row' },
              '& h1': {
                fontWeight: '300',
                fontVariationSettings: `'wght' 300`,
              },
            }}
          >
            <LayoutTitle variant='h2' gutterTop={false} gutterBottom={false}>
              <Trans id='Customer Login' />
            </LayoutTitle>
          </Box>

          <Grid container spacing={{ xs: 3, md: 6.42 }}>
            <Grid item xs={12} md={6}>
              <Box>
                <Box component='form' onSubmit={submitHandler} noValidate>
                  <Box className={classes.titleContainer} sx={titleContainerSx}>
                    <Typography
                      variant='h5'
                      sx={{
                        paddingBottom: '0.55rem',
                        marginBottom: '0.875rem',
                        borderBottom: '1px solid #e8e8e8',
                        fontSize: '1.125rem !important',
                        fontWeight: '400',
                        fontVariationSettings: `'wght' 400`,
                      }}
                    >
                      <Trans id='Registered Customers' />
                    </Typography>
                    <Typography>
                      <Trans id='If you have an account, sign in with your email address.' />
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      maxWidth: { xs: '100%', md: '30rem' },
                      marginRight: 'auto',
                      padding: '1rem 0 2rem',
                    }}
                  >
                    <Box
                      sx={{
                        marginTop: '0',
                        marginBottom: '1rem',
                      }}
                    >
                      <InputLabel required htmlFor='Email'>
                        <Trans id='Email' />
                      </InputLabel>

                      <TextField
                        variant='outlined'
                        type='text'
                        autoComplete='email'
                        autoFocus
                        error={
                          (formState.isSubmitted && !!formState.errors.email) ||
                          !!(watch('email') && !isValidEmail)
                        }
                        helperText={formState.isSubmitted && formState.errors.email?.message}
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
                      />
                    </Box>

                    <Box
                      sx={{
                        marginTop: '0',
                        marginBottom: '0',
                      }}
                    >
                      <InputLabel required htmlFor='Password'>
                        <Trans id='Password' />
                      </InputLabel>
                      <TextField
                        sx={{ minWidth: '100%' }}
                        key='password'
                        variant='outlined'
                        type={showPassword ? 'text' : 'password'}
                        error={!!formState.errors.password}
                        autoComplete='current-password'
                        id='current-password'
                        required={required.password}
                        {...muiRegister('password', {
                          required: {
                            value: true,
                            message: 'This is a required field.',
                          },
                        })}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                aria-label='toggle password visibility'
                                onClick={handleClickShowPassword}
                              >
                                {showPassword ? <EyeOpen /> : <EyeClose />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        helperText={formState.errors.password?.message}
                        disabled={formState.isSubmitting}
                      />
                    </Box>
                  </Box>

                  <ApolloCustomerErrorAlert error={remainingError} key='error' />

                  <FormActions
                    sx={{
                      padding: '0',
                      display: 'flex',
                      marginBottom: '2.25rem',
                    }}
                  >
                    <FormControl
                      sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: { xs: 0, md: 'auto' },
                        flexDirection: { xs: 'column', md: 'row' },
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
                        loading={formState.isSubmitting}
                        variant='contained'
                        size='medium'
                        color='secondary'
                      >
                        <Trans id='Sign In' />
                      </Button>
                      <Link
                        href='/account/forgot-password'
                        underline='hover'
                        color='secondary'
                        sx={{
                          whiteSpace: 'nowrap',
                          marginRight: 'auto',
                        }}
                      >
                        <Trans id='Forgot Your Password?' />
                      </Link>
                    </FormControl>
                  </FormActions>

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

                <Box
                  sx={{
                    margin: { xs: '2rem auto 1rem 0', md: '4rem auto 2rem 0' },
                    backgroundColor: '#fdf0d5',
                    padding: '1rem 1.563rem 1rem 2.813rem',
                    // maxWidth: '25rem',
                    width: '100%',
                    color: '#6f4400',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '0.625rem',
                      left: '0.625rem',
                    }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                    >
                      <path d='M12 5.177l8.631 15.823h-17.262l8.631-15.823zm0-4.177l-12 22h24l-12-22zm-1 9h2v6h-2v-6zm1 9.75c-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25 1.25.56 1.25 1.25-.561 1.25-1.25 1.25z' />
                    </svg>
                  </Box>
                  <Typography
                    sx={{
                      ml: 0,
                      marginBottom: '0.75rem',
                      fontWeight: '700',
                      fontVariationSettings: `'wght' 700`,
                    }}
                  >
                    <Trans id='Try Demo Customer Access' />
                  </Typography>
                  <Typography
                    sx={{
                      ml: 0,
                      marginBottom: '0.75rem',
                    }}
                  >
                    <Trans id='Email:' /> roni_cost@example.com
                  </Typography>
                  <Typography sx={{ ml: 0 }}>
                    <Trans id='Password:' /> roni_cost@example.com
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  // background: '#cccccc',
                  // textAlign: 'center',
                  // width: '50%',
                  // flexBasis: '0',
                  // flexGrow: '1',
                  // maxWidth: '50%'
                  paddingBottom: '2rem',
                }}
              >
                <Box className={classes.titleContainer} sx={titleContainerSx}>
                  {/* <LayoutTitle variant='h3' gutterTop={false} gutterBottom={false}>
                    <Trans id='New Customers' />
                  </LayoutTitle>
                  <Typography variant='h6' align='left'>
                    <Trans id='Creating an account has many benefits: check out faster, keep more than one address, track orders and more.' />
                  </Typography> */}
                  <Typography
                    variant='h5'
                    sx={{
                      paddingBottom: '0.55rem',
                      marginBottom: '0.875rem',
                      borderBottom: '1px solid #e8e8e8',
                      fontSize: '1.125rem !important',
                      fontWeight: '400',
                      fontVariationSettings: `'wght' 400`,
                    }}
                  >
                    <Trans id='New Customers' />
                  </Typography>
                  <Typography>
                    <Trans id='Creating an account has many benefits: check out faster, keep more than one address, track orders and more.' />
                  </Typography>
                </Box>
                <Button
                  sx={{
                    minWidth: { xs: '100%', md: '64px' },
                  }}
                  variant='contained'
                  size='medium'
                  color='secondary'
                  onClick={() => {
                    router
                      .push('/account/signup')
                      .then(() => {})
                      .catch(() => {})
                  }}
                >
                  <Trans id='Create an Account' />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default SignInForm
