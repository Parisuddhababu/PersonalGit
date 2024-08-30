/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unneeded-ternary */
import { TextFieldElement } from '@graphcommerce/ecommerce-ui'
import { PageOptions } from '@graphcommerce/framer-next-pages'
import { useApolloClient, useMutation } from '@graphcommerce/graphql'
import {
  ChangePasswordDocument,
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
  CustomerDocument,
  useCustomerQuery,
  WaitForCustomer,
} from '@graphcommerce/magento-customer'
import { UpdateCustomerNameDocument } from '@graphcommerce/magento-customer/components/ChangeNameForm/UpdateCustomerName.gql'
import { SignOutFormDocument } from '@graphcommerce/magento-customer/components/SignOutForm/SignOutForm.gql'
import { UpdateCustomerEmailDocument } from '@graphcommerce/magento-customer/components/UpdateCustomerEmailForm/UpdateCustomerEmail.gql'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { Button, Form, FormActions, GetStaticProps } from '@graphcommerce/next-ui'
import { useFormGqlMutation } from '@graphcommerce/react-hook-form'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Grid,
  InputLabel,
} from '@mui/material'
import { useRouter } from 'next/router'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { LayoutNavigationProps, LayoutOverlayProps } from '../../../components'
import { AlertToast } from '../../../components/AlertToast'
import { EyeClose, EyeOpen } from '../../../components/Icons/index'
import { AccountLayoutNav } from '../../../components/Layout/AccountLayoutNav'
import { LayoutDocument } from '../../../components/Layout/Layout.gql'
import { UIContext } from '../../../components/common/contexts/UIContext'
import { passRegex } from '../../../config/constants'
import { UPDATE_NAME, UPDATE_EMAIL, UPDATE_PASSWORD } from '../../../graphql/my-account'
import { graphqlSharedClient, graphqlSsrClient } from '../../../lib/graphql/graphqlSsrClient'

type GetPageStaticProps = GetStaticProps<LayoutOverlayProps>

function AccountInformationPage() {
  const router = useRouter()
  const client = useApolloClient()
  const [updateName, { loading: nameLoading }] = useMutation(UPDATE_NAME)
  const [updateEmail, { error: emailError, loading: emailLoading }] = useMutation(UPDATE_EMAIL)
  const [updatePassword, { error: passwordError, loading: passwordLoading }] =
    useMutation(UPDATE_PASSWORD)
  const [state, setState] = useContext(UIContext)

  const dashboard = useCustomerQuery(CustomerDocument, {
    fetchPolicy: 'cache-and-network',
  })

  const [checkBoxes, setCheckBoxes] = useState({
    email: false,
    password: router?.query?.data === 'changePassword',
    remote: false,
    showPass: false,
    newPass: false,
    confirmPass: false,
  })
  const customer = dashboard.data?.customer

  const nameForm = useFormGqlMutation(
    UpdateCustomerNameDocument,
    {
      defaultValues: {
        firstname: customer?.firstname ?? '',
        lastname: customer?.lastname ?? '',
      },
    },
    { errorPolicy: 'all' },
  )

  const emailForm = useFormGqlMutation(
    UpdateCustomerEmailDocument,
    {
      defaultValues: {
        email: customer?.email ?? '',
      },
    },
    { errorPolicy: 'all' },
  )

  const { handleSubmit: handleSubmitSignout } = useFormGqlMutation(
    SignOutFormDocument,
    {
      onComplete: async () => {
        await client.clearStore()
        await router.push('/account/signin')
        setState((prevData) => ({
          ...prevData,
          alerts: [
            {
              type: 'success',
              message: 'You saved the account information.',
              timeout: 5000,
              targetLink: '/account/signin',
            },
          ],
        }))
      },
    },
    { errorPolicy: 'all' },
  )

  const passwordForm = useFormGqlMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables & { confirmPassword?: string }
  >(ChangePasswordDocument)

  const { formState, required, watch: watchName } = nameForm
  const { formState: formStateEmail, required: requiredEmail, watch: watchEmail } = emailForm

  const {
    muiRegister: muiRegisterPassword,
    formState: formStatePassword,
    required: requiredPassword,
    watch: watchPassword,
  } = passwordForm

  const submitHandlerSignout = handleSubmitSignout(() => {})

  const handleCheckBox = (value: string) => {
    setCheckBoxes({ ...checkBoxes, [`${value}`]: !checkBoxes[`${value}`] })
  }
  const isValidPassword = passRegex.test(watchPassword('newPassword'))
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const closerFn = async () => {
      const nameRes = await updateName({
        variables: { firstname: watchName('firstname'), lastname: watchName('lastname') },
      })

      if (checkBoxes.email) {
        const emailRes = await updateEmail({
          variables: {
            email: watchEmail('email'),
            password: watchEmail('password'),
          },
        })
        await submitHandlerSignout()
        return emailRes
      }

      if (checkBoxes.password) {
        const passRes = await updatePassword({
          variables: {
            currentPassword: watchEmail('password'),
            newPassword: watchPassword('confirmPassword'),
          },
        })
        await submitHandlerSignout()
        return passRes
      }
      if (!(checkBoxes?.email || checkBoxes?.password)) {
        await router.push({
          pathname: '/account',
        })
        setState((prevData) => ({
          ...prevData,
          alerts: [
            {
              type: 'success',
              message: 'You saved the account information.',
              timeout: 5000,
              targetLink: '/account',
            },
          ],
        }))
      }
      return nameRes
    }
    closerFn()
      .then(() => {})
      .catch(() => {})
  }

  useEffect(() => {
    if (emailError?.message || passwordError?.message) {
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'error',
            message: `${emailError?.message || passwordError?.message}`,
            timeout: 5000,
            targetLink: router?.pathname,
          },
        ],
      }))
    }
  }, [emailError, passwordError])
  const labelStyle = {
    color: '#000',
    marginBottom: '0.5rem',
    fontWeight: '600',
  }
  return (
    <WaitForCustomer waitFor={dashboard}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0px 0px !important',
          flexBasis: 0,
          flexGrow: 1,
          maxWidth: { xs: '100%', md: 'calc( 100% - 17.25rem )' },
        }}
      >
        {state?.alerts?.length > 0 && <AlertToast alerts={state?.alerts} link={router?.pathname} />}

        <Box sx={{ width: '100%', paddingLeft: { xs: '0', md: '1rem', lg: '1.563rem' } }}>
            <PageMeta title={i18n._(/* i18n */ 'Name')} metaRobots={['noindex']} />

            <Form sx={{ padding: '0px' }} onSubmit={(e) => handleSubmit(e)} noValidate>
              <Typography
                variant='h2'
                sx={{
                  fontWeight: '300',
                  fontVariationSettings: `'wght' 300`,
                  paddingBottom: { xs: '1rem', md: '2rem' },
                  marginTop: { xs: '0', md: '-0.25rem' },
                }}
              >
                Edit Account Information
              </Typography>

              <Grid container spacing={{ xs: 2, md: 3, lg: 4.75 }}>
                <Grid item xs={12} md={6}>
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
                    Account Information
                  </Typography>

                  <Box
                    sx={{
                      marginTop: '0',
                      marginBottom: '1rem',
                    }}
                  >
                    <InputLabel sx={{ ...labelStyle }} htmlFor='First Name'>
                      <Trans id='First Name' />
                      <Typography component='span' className='asterisk'>
                        *
                      </Typography>
                    </InputLabel>

                    <TextFieldElement
                      control={nameForm.control}
                      name='firstname'
                      required={required.firstname}
                      variant='outlined'
                      type='text'
                    />
                  </Box>

                  <Box
                    sx={{
                      marginTop: '0',
                      marginBottom: '1rem',
                    }}
                  >
                    <InputLabel sx={{ ...labelStyle }} htmlFor='Last Name'>
                      <Trans id='Last Name' />
                      <Typography component='span' className='asterisk'>
                        *
                      </Typography>
                    </InputLabel>

                    <TextFieldElement
                      control={nameForm.control}
                      name='lastname'
                      required={required.lastname}
                      variant='outlined'
                      type='text'
                    />
                  </Box>

                  <FormGroup
                    sx={{
                      marginBottom: { xs: '2.45', md: '3.45rem', lg: '4.45rem' },
                    }}
                  >
                    <FormControlLabel
                      sx={{ width: 'fit-content' }}
                      control={
                        <Checkbox
                          size='small'
                          value='email'
                          checked={checkBoxes.email}
                          onChange={(e) => handleCheckBox(e.target.value)}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label='Change Email'
                    />

                    <FormControlLabel
                      sx={{ width: 'fit-content' }}
                      control={
                        <Checkbox
                          size='small'
                          value='password'
                          checked={checkBoxes.password}
                          onChange={(e) => handleCheckBox(e.target.value)}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label='Change Password'
                    />

                    <FormControlLabel
                      sx={{ width: 'fit-content' }}
                      control={
                        <Checkbox
                          size='small'
                          value='remote'
                          checked={checkBoxes.remote}
                          onChange={(e) => handleCheckBox(e.target.value)}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label='Allow remote shopping assistance'
                    />
                  </FormGroup>

                  <FormActions
                    sx={{
                      justifyContent: 'flex-start',
                      padding: '0',
                    }}
                  >
                    <Button
                      sx={{
                        color: '#ffffff',
                        backgroundColor: '#1979c3',
                        '&:hover, &:active': { backgroundColor: '#006bb4' },
                      }}
                      disableRipple
                      type='submit'
                      color='primary'
                      variant='contained'
                      size='small'
                      disabled={
                        !formState.isValid ||
                        (checkBoxes.email && !formStateEmail.isValid) ||
                        (checkBoxes.password && !formStatePassword.isValid) ||
                        (checkBoxes.password && !isValidPassword)
                      }
                      loading={nameLoading || emailLoading || passwordLoading}
                    >
                      <Trans id='Save' />
                    </Button>
                  </FormActions>
                </Grid>
                {(checkBoxes.email || checkBoxes.password) && (
                  <Grid item xs={12} md={6}>
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
                      Change {checkBoxes.email && 'Email'}{' '}
                      {checkBoxes.email && checkBoxes.password && 'and'}{' '}
                      {checkBoxes.password && 'Password'}
                    </Typography>

                    {checkBoxes.email && (
                      <Box
                        sx={{
                          marginTop: '0',
                          marginBottom: '1rem',
                        }}
                      >
                        <InputLabel sx={{ ...labelStyle }} htmlFor='Email'>
                          <Trans id='Email' />
                          <Typography component='span' className='asterisk'>
                            *
                          </Typography>
                        </InputLabel>

                        <TextFieldElement
                          control={emailForm.control}
                          name='email'
                          required={requiredEmail.email}
                          variant='outlined'
                          type='text'
                        />
                      </Box>
                    )}

                    <Box
                      sx={{
                        marginTop: '0',
                        marginBottom: '1rem',
                      }}
                    >
                      <InputLabel sx={{ ...labelStyle }} htmlFor='Current Password'>
                        <Trans id='Current Password' />
                        <Typography component='span' className='asterisk'>
                          *
                        </Typography>
                      </InputLabel>

                      <TextFieldElement
                        control={emailForm.control}
                        name='password'
                        autoComplete='off'
                        required={requiredEmail.password}
                        variant='outlined'
                        type={checkBoxes.showPass ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                aria-label='toggle password visibility'
                                onClick={() => {
                                  handleCheckBox('showPass')
                                }}
                              >
                                {checkBoxes.showPass ? <EyeOpen /> : <EyeClose />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    {checkBoxes.password && (
                      <>
                        <Box
                          sx={{
                            marginTop: '0',
                            marginBottom: '1rem',
                          }}
                        >
                          <InputLabel sx={{ ...labelStyle }} htmlFor='New Password'>
                            <Trans id='New Password' />
                            <Typography component='span' className='asterisk'>
                              *
                            </Typography>
                          </InputLabel>

                          <TextField
                            variant='outlined'
                            type={checkBoxes.newPass ? 'text' : 'password'}
                            error={
                              !!formStatePassword.errors.newPassword ||
                              (watchPassword('newPassword') && !isValidPassword ? true : false)
                            }
                            autoComplete='off'
                            required
                            {...muiRegisterPassword('newPassword', {
                              required: requiredPassword.newPassword,
                            })}
                            helperText={
                              formStatePassword.errors.newPassword?.message ||
                              (watchPassword('newPassword') &&
                                !isValidPassword &&
                                'Minimum of different classes of characters in password is 3. Classes of characters: Lower Case, Upper Case, Digits, Special Characters.')
                            }
                            disabled={formStatePassword.isSubmitting}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={() => {
                                      handleCheckBox('newPass')
                                    }}
                                  >
                                    {checkBoxes.newPass ? <EyeOpen /> : <EyeClose />}
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
                          <InputLabel sx={{ ...labelStyle }} htmlFor='Confirm New Password'>
                            <Trans id='Confirm New Password ' />
                            <Typography component='span' className='asterisk'>
                              *
                            </Typography>
                          </InputLabel>
                          <TextField
                            variant='outlined'
                            autoComplete='off'
                            type={checkBoxes.confirmPass ? 'text' : 'password'}
                            error={
                              !!formStatePassword.errors.confirmPassword ||
                              !!(
                                watchPassword('confirmPassword') &&
                                watchPassword('newPassword') !== watchPassword('confirmPassword')
                              )
                            }
                            required
                            {...muiRegisterPassword('confirmPassword', {
                              required: true,
                              validate: (value) =>
                                value === watchPassword('newPassword') ||
                                i18n._(/* i18n */ "Passwords don't match"),
                            })}
                            helperText={
                              formStatePassword.errors.confirmPassword?.message ||
                              (watchPassword('newPassword') !== watchPassword('confirmPassword') &&
                                watchPassword('confirmPassword') &&
                                'Please enter the same value again.')
                            }
                            disabled={formStatePassword.isSubmitting}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={() => {
                                      handleCheckBox('confirmPass')
                                    }}
                                  >
                                    {checkBoxes.confirmPass ? <EyeOpen /> : <EyeClose />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      </>
                    )}
                  </Grid>
                )}
              </Grid>
            </Form>
        </Box>
      </Box>
    </WaitForCustomer>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: AccountLayoutNav,
}
AccountInformationPage.pageOptions = pageOptions

export default AccountInformationPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const staticClient = graphqlSsrClient(locale)
  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })
  const layout = staticClient.query({ query: LayoutDocument })

  return {
    props: {
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
      up: { href: '/account', title: 'Account' },
    },
  }
}
