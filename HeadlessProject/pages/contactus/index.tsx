import { PageOptions } from '@graphcommerce/framer-next-pages'
import { ApolloCustomerErrorAlert } from '@graphcommerce/magento-customer'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import {
  Button,
  Form,
  FormActions,
  FormRow,
  GetStaticProps,
  extendableComponent,
  LayoutTitle,
} from '@graphcommerce/next-ui'
import { emailPattern, useFormGqlMutation } from '@graphcommerce/react-hook-form'
import { ContactUsFormDocument } from '@graphql/ContactUsForm.gql'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import {
  Container,
  FormControl,
  Grid,
  TextField,
  Typography,
  Box,
  Link,
  InputLabel,
} from '@mui/material'
import { LayoutNavigation, LayoutNavigationProps } from '../../components'
import { LayoutDocument } from '../../components/Layout/Layout.gql'
import { graphqlSharedClient, graphqlSsrClient } from '../../lib/graphql/graphqlSsrClient'
import router from 'next/router'
import { UIContext } from '@components/common/contexts/UIContext'
import { useContext } from 'react'
import { AlertToast } from '@components/AlertToast'
import { namePattern, phoneNumberRegex } from '@components/common/utils/formRegex'

type GetPageStaticProps = GetStaticProps<LayoutNavigationProps>

const name = 'CreateProductReviewForm' as const
const parts = [
  'root',
  'ratingContainer',
  'rating',
  'ratingLabel',
  'submitButton',
  'cancelButton',
  'formActions',
] as const
const { classes } = extendableComponent(name, parts)

function ContactUsPage() {
  const [state, setState] = useContext(UIContext)
  const form = useFormGqlMutation(
    ContactUsFormDocument,
    {
      defaultValues: {},

      onBeforeSubmit: (formData) => ({
        ...formData,
      }),
      onComplete: () => {
        setState((prev) => ({
          ...prev,
          alerts: [
            {
              type: 'success',
              message: `Thanks for contacting us with your comments and questions. We will respond to you very soon..`,
              timeout: 7000,
              targetLink: router?.pathname,
            },
          ],
        }))
      },
    },

    { errorPolicy: 'all' },
  )
  const { handleSubmit, muiRegister, formState, required, error, reset } = form

  const submitHandler = handleSubmit((dataHandle) => {
    reset({
      ...dataHandle,
      fullname: '',
      email: '',
      telephone: '',
      message: '',
    })
  })

  return (
    <Container
      maxWidth='lg'
      sx={{ padding: { xs: '1.3rem 0.938rem', lg: '1.3rem 1.875rem' }, position: 'relative' }}
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
          <Trans id='Contact Us' />
        </LayoutTitle>
      </Box>
      {state?.alerts?.length > 0 && <AlertToast alerts={state?.alerts} link={router?.pathname} />}

      <Typography
        sx={{
          backgroundColor: '#f5f5f5',
          padding: '1.25rem',
          margin: { xs: '0 -0.938rem 0.938rem', md: '0 0 35px -20px' },
          fontSize: '1.375rem !important',
          lineHeight: '1.5rem !important',
          fontWeight: 300,
          fontVariationSettings: "'wght' 300",
        }}
      >
        <Trans id='We love hearing from you, our Luma customers. Please contact us about anything at all. Your latest passion, unique health experience or request for a specific product. We’ll do everything we can to make your Luma experience unforgettable every time. Reach us however you like' />
      </Typography>

      <Grid container spacing={{ xs: 3, md: 6.42 }}>
        <Grid item xs={12}>
          <Grid container spacing={{ xs: 3, md: 6.42 }}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant='h6'
                sx={{
                  marginBottom: '1rem',
                }}
              >
                <Trans id='Phone' />
              </Typography>

              <Typography
                variant='h3'
                sx={{
                  fontSize: '2.25rem !important',
                  lineHeight: '2.25rem !important',
                  fontWeight: 300,
                  fontVariationSettings: "'wght' 300",
                  marginBottom: '0.75rem',
                }}
              >
                <Trans id='1-800-403-8838' />
              </Typography>

              <Typography sx={{ marginBottom: { sm: '2.375rem' } }}>
                <Trans id=' Call the Luma Helpline for concerns, product questions, or anything else. We’re here for you 24 hours a day - 365 days a year.' />{' '}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant='h6'
                sx={{
                  mt: 0,
                  marginBottom: '1rem',
                }}
              >
                <Trans id='Apparel Design Inquiries' />
              </Typography>

              <Typography>
                <Trans id=' Are you an independent clothing designer? Feature your products on the Luma website! Please direct all inquiries via email to:' />
                <Link
                  href='mailTo:cs@luma.com'
                  color='secondary'
                  underline='hover'
                  sx={{
                    marginLeft: '0.3rem',
                  }}
                >
                  cs@luma.com
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={10} lg={6} sx={{ paddingTop: { sm: '0 !important' } }}>
          <Box
            sx={{
              marginBottom: { xs: '2.5rem', md: '3.125rem' },
            }}
          >
            <Typography variant='h6' sx={{ marginBottom: { xs: '0.875rem', md: '1.125rem' } }}>
              <Trans id='Press Inquiries' />
            </Typography>

            <Typography>
              <Trans id='Please direct all media inquiries via email to:' />
              <Link
                href='mailTo:pr@luma.com'
                color='secondary'
                underline='hover'
                sx={{
                  marginLeft: '0.3rem',
                }}
              >
                pr@luma.com
              </Link>
            </Typography>
          </Box>

          <Box>
            <Typography variant='h6' sx={{ marginBottom: { xs: '0.875rem', md: '1.125rem' } }}>
              <Trans id='Write Us' />
            </Typography>

            <Typography sx={{ mb: '0rem' }}>
              <Trans id='Jot us a note and we’ll get back to you as quickly as possible.' />
            </Typography>
          </Box>

          <Form noValidate className={classes.root} sx={{ display: 'block', paddingBottom: 0 }}>
            <Box
              sx={{
                marginTop: '0',
                marginBottom: '1rem',
              }}
            >
              <InputLabel required htmlFor='name'>
                <Trans id=' Full Name' />
              </InputLabel>
              <TextField
                sx={{ minWidth: '100%' }}
                variant='outlined'
                type='text'
                autoFocus
                error={formState.isSubmitted && !!formState.errors.fullname}
                helperText={formState.isSubmitted && formState.errors.fullname?.message}
                required={required.fullname}
                {...muiRegister('fullname', {
                  required: {
                    value: true,
                    message: 'This is a required field.',
                  },
                  pattern: {
                    value: namePattern,
                    message: i18n._(
                      /* i18n */ 'empty space is not allowed and only alphabetics are allowed',
                    ),
                  },
                })}
                disabled={formState.isSubmitting}
              />
            </Box>

            <Box
              sx={{
                marginTop: '0',
                marginBottom: '1rem',
              }}
            >
              <InputLabel required htmlFor='name'>
                Email
              </InputLabel>
              <TextField
                sx={{ minWidth: '100%' }}
                variant='outlined'
                type='text'
                autoComplete='email'
                error={formState.isSubmitted && !!formState.errors.email}
                helperText={formState.isSubmitted && formState.errors.email?.message}
                required={required.email}
                {...muiRegister('email', {
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

            <Box
              sx={{
                marginTop: '0',
                marginBottom: '1rem',
              }}
            >
              <InputLabel required htmlFor='name'>
                Phone Number
              </InputLabel>
              <TextField
                sx={{ minWidth: '100%' }}
                variant='outlined'
                type='text'
                error={!!formState.errors.telephone}
                required={required.telephone}
                {...muiRegister('telephone', {
                  required: {
                    value: true,
                    message: 'This is a required field.',
                  },
                  pattern: {
                    value: phoneNumberRegex,
                    message: i18n._(/* i18n */ 'Invalid phone number'),
                  },
                })}
                helperText={formState.isSubmitted && formState.errors.telephone?.message}
                disabled={formState.isSubmitting}
              />
            </Box>

            <Box
              sx={{
                marginTop: '0',
                marginBottom: '1rem',
              }}
            >
              <InputLabel required htmlFor='name'>
                What's in your mind
              </InputLabel>
              <TextField
                sx={{ minWidth: '100%' }}
                variant='outlined'
                type='text'
                required={required.message}
                {...muiRegister('message', {
                  required: {
                    value: true,
                    message: 'This is a required field.',
                  },
                  pattern: { value: /^(?!\s).*$/, message: 'emptySpace is not allowed' },
                })}
                error={formState.isSubmitted && !!formState.errors.message}
                helperText={formState.isSubmitted && formState.errors.message?.message}
                disabled={formState.isSubmitting}
                multiline
                rows={4}
              />
            </Box>

            <ApolloCustomerErrorAlert error={error} />

            <Box
              sx={{
                paddingTop: '0.6rem',
              }}
            >
              <FormControl>
                <Button
                  type='button'
                  variant='contained'
                  size='medium'
                  color='secondary'
                  onClick={submitHandler}
                  className={classes.submitButton}
                  loading={formState.isSubmitting}
                >
                  <Trans id='Submit' />
                </Button>
              </FormControl>
            </Box>
          </Form>
        </Grid>
      </Grid>
    </Container>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: LayoutNavigation,
}

ContactUsPage.pageOptions = pageOptions

export default ContactUsPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })
  const staticClient = graphqlSsrClient(locale)
  const layout = staticClient.query({ query: LayoutDocument })

  return {
    props: {
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
  }
}
