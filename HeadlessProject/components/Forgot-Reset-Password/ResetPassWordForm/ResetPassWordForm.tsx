import {
  PasswordElement,
  PasswordRepeatElement,
  TextFieldElement,
} from '@graphcommerce/ecommerce-ui'
import { Button, Form } from '@graphcommerce/next-ui'
import { emailPattern, useFormGqlMutation } from '@graphcommerce/react-hook-form'
import { Trans } from '@lingui/react'
import { useRouter } from 'next/router'

import { i18n } from '@lingui/core'
import {
  ResetPasswordDocument,
  ResetPasswordMutation,
  ResetPasswordMutationVariables,
} from '@graphcommerce/magento-customer/components/ResetPasswordForm/ResetPassword.gql'
import { passRegex } from 'config/constants'
import { ApolloCustomerErrorAlert } from '@graphcommerce/magento-customer'
import { UIContext } from '@components/common/contexts/UIContext'
import { useContext, useEffect } from 'react'
import { Box, InputLabel, Typography } from '@mui/material'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { useQuery } from '@graphcommerce/graphql'

type ResetPasswordFormProps = {
  email?: string | string[]
  token?: string | string[]
}

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
  const { token, email } = props
  const [, setState] = useContext(UIContext)
  const storeConfig = useQuery(StoreConfigDocument).data?.storeConfig

  const form = useFormGqlMutation<
    ResetPasswordMutation,
    ResetPasswordMutationVariables & { confirmPassword?: string }
  >(
    ResetPasswordDocument,
    {
      onBeforeSubmit: (formData) => ({
        ...formData,
        resetPasswordToken: token as string,
      }),
      onComplete: () => {
        setState((prev) => ({
          ...prev,
          alerts: [
            {
              type: 'success',
              message: `Password has been Successfully Updated`,
              timeout: 10000,
              targetLink: '/account/signin',
            },
          ],
        }))
      },
    },
    { errorPolicy: 'all' },
  )

  const router = useRouter()
  const { handleSubmit, data, formState, error, control } = form
  const submitHandler = handleSubmit(() => {})
  useEffect(() => {
    if (error) {
      router.push('/account/forgot-password')
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'error',
            message: `${error.message}`,
            timeout: 10000,
            targetLink: '/account/forgot-password',
          },
        ],
      }))
    }
  }, [error])

  if (formState.isSubmitSuccessful && data && !error) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push({
      pathname: '/account/signin',
      query: { data: 'updatedSuccessfully' },
    })
  }

  return (
    <Form onSubmit={submitHandler} noValidate sx={{ display: 'block', padding: '0' }}>
      <Box
        sx={{
          margin: '0 0 1rem',
        }}
      >
        <InputLabel htmlFor='Last Name'>
          <Trans id='Email' />
        </InputLabel>
        <TextFieldElement
          control={control}
          name='email'
          variant='outlined'
          type='email'
          defaultValue={email as string}
          disabled={true}
          validation={{
            pattern: emailPattern,
          }}
        />
      </Box>
      <Box
        sx={{
          margin: '0 0 1rem',
        }}
      >
        <InputLabel required htmlFor='New Password'>
          <Trans id='New Password' />
        </InputLabel>
        <PasswordElement
          sx={{ width: '100%' }}
          control={control}
          name='newPassword'
          variant='outlined'
          type='password'
          validation={{
            minLength: {
              value: Number(storeConfig?.minimum_password_length ?? 8),
              message: i18n._(/* i18n */ 'Password must have at least 8 characters'),
            },
            pattern: {
              value: passRegex,
              message: i18n._(
                /* i18n */ 'Minimum of different classes of characters in password is 3 . classes of characters: Lower case ,upper case , digits,special characters ',
              ),
            },
          }}
          required
          disabled={formState.isSubmitting}
        />
      </Box>
      <Box
        sx={{
          margin: '0 0 2.5rem',
        }}
      >
        <InputLabel required htmlFor='Confirm New Password'>
          <Trans id='Confirm New Password' />
        </InputLabel>
        <PasswordRepeatElement
          control={control}
          sx={{ width: '100%' }}
          name='confirmPassword'
          passwordFieldName='newPassword'
          variant='outlined'
          type='password'
          required
          disabled={formState.isSubmitting}
        />
      </Box>

      {/* <ApolloCustomerErrorAlert error={error} /> */}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginBottom: '1rem',
        }}
      >
        <Button
          type='submit'
          loading={formState.isSubmitting}
          color='secondary'
          variant='contained'
          size='medium'
        >
          <Trans id='Set a new password' />
        </Button>
      </Box>
    </Form>
  )
}

export default ResetPasswordForm
