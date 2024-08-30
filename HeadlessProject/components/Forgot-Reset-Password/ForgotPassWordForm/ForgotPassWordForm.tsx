import {
  ApolloCustomerErrorAlert,
  ForgotPasswordDocument,
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables,
} from '@graphcommerce/magento-customer'
import { Button, Form, FormRow } from '@graphcommerce/next-ui'
import { emailPattern, useFormGqlMutation } from '@graphcommerce/react-hook-form'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { TextField, SxProps, Theme, Box, InputLabel, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { UIContext } from '@components/common/contexts/UIContext'

const ForgotPassWordForm = (props: { sx?: SxProps<Theme> }) => {
  const { sx = [] } = props

  const router = useRouter()
  const [, setState] = useContext(UIContext)
  const form = useFormGqlMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(
    ForgotPasswordDocument,
    {
      onComplete: () => {
        setState((prev) => ({
          ...prev,
          alerts: [
            {
              type: 'success',
              message: `If there is an account associated with ${watch(
                'email',
              )} you will receive an email with a link to reset your password.`,
              timeout: 10000,
              targetLink: '/account/signin',
            },
          ],
        }))
      },
    },
  )
  const { muiRegister, handleSubmit, required, data, formState, error, watch } = form
  const submitHandler = handleSubmit(() => {})

  if (formState.isSubmitSuccessful && data) {
    router.push({
      pathname: '/account/signin',
      query: { data: watch('email') },
    })
  }

  return (
    <Form onSubmit={submitHandler} noValidate sx={sx}>
      <FormRow
        sx={{
          marginBottom: '1rem',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <InputLabel required htmlFor='Email'>
            <Trans id='Email' />
          </InputLabel>
          <TextField
            sx={{ minWidth: '100%' }}
            variant='outlined'
            type='text'
            autoFocus
            error={!!formState.errors.email}
            required={required.email}
            {...muiRegister('email', {
              required: {
                value: true,
                message: 'This is a required field.',
              },
              pattern: {
                value: emailPattern,
                message: i18n._(
                  /* i18n */ 'Please enter a valid email address (Ex: johndoe@domain.com).',
                ),
              },
            })}
            helperText={formState.errors.email?.message}
            disabled={error ? !formState.isSubmitting : formState.isSubmitting}
          />
        </Box>
      </FormRow>

      <Box
        sx={{
          margin: '0 0 2.5rem',
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

      <ApolloCustomerErrorAlert error={error} />

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
          loading={error ? false : formState.isSubmitting}
          color='secondary'
          variant='contained'
          size='medium'
          // sx={{ position: 'relative', bottom: '30px' }}
        >
          <Trans id='Reset My Password' />
        </Button>
      </Box>
    </Form>
  )
}

export default ForgotPassWordForm
