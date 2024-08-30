/* eslint-disable react-hooks/exhaustive-deps */
import { PageOptions } from '@graphcommerce/framer-next-pages'
import { useMutation } from '@graphcommerce/graphql'
import {
  CustomerDocument,
  useCustomerQuery,
  WaitForCustomer,
} from '@graphcommerce/magento-customer'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { Button, FormActions, GetStaticProps } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { Box, Checkbox, Container, FormControlLabel, FormGroup, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { AlertToast } from '../../../components/AlertToast'
import {
  AccountLayoutNav,
  LayoutNavigationProps,
} from '../../../components/Layout/AccountLayoutNav'
import { LayoutDocument } from '../../../components/Layout/Layout.gql'
import { UIContext } from '../../../components/common/contexts/UIContext'
import { DefaultPageDocument } from '../../../graphql/DefaultPage.gql'
import { UPDATE_SUBSCRIPTION } from '../../../graphql/my-account'
import { graphqlSsrClient, graphqlSharedClient } from '../../../lib/graphql/graphqlSsrClient'

type GetPageStaticProps = GetStaticProps<LayoutNavigationProps>

function NewsLetterPage() {
  const router = useRouter()
  const dashboard = useCustomerQuery(CustomerDocument, {
    fetchPolicy: 'network-only',
  })
  const [updateIsSubscribed, { error, loading }] = useMutation(UPDATE_SUBSCRIPTION)
  const [checkBox, setCheckBox] = useState(false)
  const [state, setState] = useContext(UIContext)

  useEffect(() => {
    if (dashboard.data) {
      setCheckBox(dashboard?.data?.customer?.is_subscribed ?? false)
    }
  }, [dashboard.data])

  useEffect(() => {
    if (error?.message) {
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'error',
            message: error?.message,
            timeout: 5000,
            targetLink: router?.pathname,
          },
        ],
      }))
    }
  }, [error])

  const handleSubscriptionSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const closerFn = async () => {
      const updateSubscription = await updateIsSubscribed({ variables: { isSubscribed: checkBox } })
      await router.push({
        pathname: '/account',
      })
      setState((prevData) => ({
        ...prevData,
        alerts: [
          {
            type: 'success',
            message: 'We have updated your subscription.',
            timeout: 5000,
            targetLink: '/account',
          },
        ],
      }))
      return updateSubscription
    }
    closerFn()
      .then(() => {})
      .catch(() => {})
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
          maxWidth: {xs:'100%', md:'calc( 100% - 17.25rem )'},
        }}
      >
        {state?.alerts?.length > 0 && <AlertToast alerts={state?.alerts} link={router?.pathname} />}
        <Box>
          <Box sx={{ width: '100%', paddingLeft: {xs:'0', md:'1rem', lg:'1.563rem' } }}>

            <Typography variant='h2' 
              sx={{ 
                fontWeight: '300', 
                fontVariationSettings: `'wght' 300`,
                paddingBottom: {xs:'1rem', md:'2rem'}, 
                marginTop: {xs:'0', md:'-0.25rem'}
              }}
            >
              Newsletter Subscription
            </Typography>

            <Typography
              variant='h4'
              sx={{
                color: '#333',
                fontSize: {xs:'1rem', md:'1.375rem'},
                fontWeight: '300',
                fontVariationSettings: `'wght' 300`,
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #c6c6c6',
                marginBottom: {xs:'0.875rem', md:'0.875rem'},
              }}
            >
              Subscription option
            </Typography>

            <Box component='form' onSubmit={(e) => handleSubscriptionSubmit(e)}>
              <FormGroup>
                <FormControlLabel
                  sx={{
                    width: 'fit-content',
                    '.MuiTypography-root': { color: '#0F0F10 !important' },
                  }}
                  control={
                    <Checkbox
                      size='small'
                      value='email'
                      checked={checkBox}
                      disabled={loading}
                      color="secondary"
                      onChange={(e) => {
                        setCheckBox(e.target.checked)
                      }}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label='General Subscription'
                />
              </FormGroup>
              <FormActions sx={{ justifyContent: 'flex-start', paddingTop: '2rem' }}>
                <Button
                  sx={{
      
                  }}
                  disableRipple
                  type='submit'
                  variant='contained'
                  size='medium'
                  color='secondary'
                  loading={loading}
                >
                  <Trans id='Save' />
                </Button>
              </FormActions>
            </Box>
          </Box>
        </Box>
      </Box>
    </WaitForCustomer>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: AccountLayoutNav,
}

NewsLetterPage.pageOptions = pageOptions

export default NewsLetterPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const staticClient = graphqlSsrClient(locale)
  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })

  const page = staticClient.query({ query: DefaultPageDocument, variables: { url: 'account' } })
  const layout = staticClient.query({ query: LayoutDocument })

  return {
    props: {
      ...(await page).data,
      ...(await layout).data,
      up: { href: '/', title: 'Home' },
      apolloState: await conf.then(() => client.cache.extract()),
    },
    revalidate: 60 * 20,
  }
}
