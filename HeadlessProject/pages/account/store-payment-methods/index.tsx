import { PageOptions } from '@graphcommerce/framer-next-pages'
import { useQuery } from '@graphcommerce/graphql'
import { WaitForCustomer } from '@graphcommerce/magento-customer'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { FullPageMessage, GetStaticProps, iconBox, IconSvg } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Alert, Box, Container, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { LayoutOverlayProps } from '../../../components'
import { StoredPaymentList } from '../../../components/AccountStoredPayments/StoredPaymentList/StoredPaymentList'
import { AlertToast } from '../../../components/AlertToast'
import { AccountLayoutNav } from '../../../components/Layout/AccountLayoutNav'
import { LayoutDocument } from '../../../components/Layout/Layout.gql'
import { UIContext } from '../../../components/common/contexts/UIContext'
import { CUSTOMER_PAYMENT_TOKENS } from '../../../graphql/my-account'
import { graphqlSharedClient, graphqlSsrClient } from '../../../lib/graphql/graphqlSsrClient'

type GetPageStaticProps = GetStaticProps<LayoutOverlayProps>

function AccountStoredPaymentPage() {
  const router = useRouter()
  const { data } = useQuery(CUSTOMER_PAYMENT_TOKENS)
  const paymentMethods = data?.customerPaymentTokens.items
  const [state] = useContext(UIContext)

  return (
    <WaitForCustomer waitFor={paymentMethods}>
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
        <PageMeta title={i18n._(/* i18n */ 'Orders')} metaRobots={['noindex']} />

          {paymentMethods && paymentMethods.length > 0 && (
            <Box sx={{ width: '100%', paddingLeft: {xs:'0', md:'1rem', lg:'1.563rem' } }}>
              
              <Typography variant='h2' 
                sx={{ 
                  fontWeight: '300', 
                  fontVariationSettings: `'wght' 300`,
                  paddingBottom: {xs:'1rem', md:'2rem'}, 
                  marginTop: {xs:'0', md:'-0.25rem'}
                }}
              >
                Stored Payment Methods
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box sx={{ width: '100%', paddingBottom: '2rem' }}>
                  {state?.alerts?.length > 0 && (
                    <AlertToast
                      sx={{ paddingLeft: '0px 0px !important', marginLeft: '0px 0px !important' }}
                      alerts={state?.alerts}
                      link={router?.pathname}
                    />
                  )}
                  <StoredPaymentList paymentMethods={paymentMethods} />
                </Box>
              </Box>
              
            </Box>
          )}
          {paymentMethods && paymentMethods.length < 1 && (
            <FullPageMessage
              title={<Trans id='You have no stored payment methods yet' />}
              icon={<IconSvg src={iconBox} size='xl' />}
            />
          )}
      </Box>
    </WaitForCustomer>
  )
}

const pageOptions: PageOptions<LayoutOverlayProps> = {
  Layout: AccountLayoutNav,
}
AccountStoredPaymentPage.pageOptions = pageOptions

export default AccountStoredPaymentPage

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
