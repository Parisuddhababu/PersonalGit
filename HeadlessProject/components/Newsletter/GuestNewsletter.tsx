import { UIContext } from '@components/common/contexts/UIContext'
import { TextFieldElement, useFormGqlMutation } from '@graphcommerce/ecommerce-ui'
import { GuestNewsletterToggleDocument } from '@graphcommerce/magento-newsletter/components/GuestNewsletterToggle/GuestNewsletterToggle.gql'
import { Form, Button } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import router from 'next/router'
import { useContext, useEffect } from 'react'

export function GuestNewsletter() {
  const [, setState] = useContext(UIContext)
  const form = useFormGqlMutation(GuestNewsletterToggleDocument, {}, { errorPolicy: 'all' })

  const { handleSubmit, formState, error, control, reset } = form
  const submit = handleSubmit((data) => {
    if (data) {
      reset({
        email: '',
      })
    }
  })
  const submittedWithoutErrors = formState.isSubmitSuccessful && !error

  useEffect(() => {
    if (submittedWithoutErrors) {
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'success',
            message: `<span>Thank you for your subscription.</span> `,
            timeout: 10000,
            targetLink: router.pathname,
          },
        ],
      }))
    }
    if (error) {
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'error',
            message: `${error.message}`,
            timeout: 10000,
            targetLink: router.pathname,
          },
        ],
      }))
    }
  }, [error?.message, submittedWithoutErrors])

  return (
    <Form
      noValidate
      onSubmit={submit}
      sx={{
        display: 'flex',
        padding: '0',
      }}
    >
      <TextFieldElement
        required
        variant='filled'
        type='email'
        placeholder={i18n._(/* i18n */ 'Enter your email address')}
        control={control}
        name='email'
        size='small'
        inputProps={{ autoComplete: 'email' }}
        className='news-letter-field'
      />

      <Button
        loading={formState.isSubmitting}
        variant='contained'
        color='secondary'
        type='submit'
        size='medium'
      >
        {<Trans id='Subscribe' />}
      </Button>
    </Form>
  )
}
