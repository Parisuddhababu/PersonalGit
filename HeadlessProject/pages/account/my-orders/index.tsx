import { PageOptions } from '@graphcommerce/framer-next-pages'
import {
  useCustomerQuery,
  WaitForCustomer,
  AccountDashboardOrdersDocument,
} from '@graphcommerce/magento-customer'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { FullPageMessage, GetStaticProps, iconBox, IconSvg } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Box, Container, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { LayoutOverlayProps } from '../../../components'
import { AccountOrdersList } from '../../../components/AccountMyOrders/AccountOrdersList'
import { AlertToast } from '../../../components/AlertToast'
import { AccountLayoutNav } from '../../../components/Layout/AccountLayoutNav'
import { LayoutDocument } from '../../../components/Layout/Layout.gql'
import { UIContext } from '../../../components/common/contexts/UIContext'
import { graphqlSharedClient, graphqlSsrClient } from '../../../lib/graphql/graphqlSsrClient'

type GetPageStaticProps = GetStaticProps<LayoutOverlayProps>

function AccountOrdersPage() {
  const { query } = useRouter()
  const router = useRouter()
  const [pagesize, setPageSize] = useState<number>(10)
  const [state] = useContext(UIContext)

  const orders = useCustomerQuery(AccountDashboardOrdersDocument, {
    fetchPolicy: 'cache-and-network',
    variables: {
      pageSize: pagesize,
      currentPage: Number(query?.page ?? 1),
    },
  })
  const { data } = orders
  const customer = data?.customer

  return (
    <WaitForCustomer waitFor={orders}>
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
          {customer?.orders && customer.orders.items.length > 0 && (
            <Box sx={{ width: '100%', paddingLeft: {xs:'0', md:'1rem', lg:'1.563rem' } }}>
              {state?.alerts?.length > 0 && (
                <AlertToast alerts={state?.alerts} link={router?.pathname} />
              )}
              <Typography variant='h2' 
                sx={{ 
                  fontWeight: '300', 
                  fontVariationSettings: `'wght' 300`,
                  paddingBottom: {xs:'1rem', md:'2rem'}, 
                  marginTop: {xs:'0', md:'-0.25rem'}
                }}
              >
                My Orders
              </Typography>{' '}
              <Box sx={{ width: '100%', paddingBottom: '2rem' }}>
                <AccountOrdersList {...customer} setPageSize={setPageSize} pagesize={pagesize} />
              </Box>
            </Box>
          )}

          {customer?.orders && customer.orders.items.length < 1 && (
            <FullPageMessage
              title={<Trans id='You have no orders yet' />}
              icon={<IconSvg src={iconBox} size='xxl' />}
            >
              <Trans id='Discover our collection and place your first order!' />
            </FullPageMessage>
          )}
      </Box>
    </WaitForCustomer>
  )
}

const pageOptions: PageOptions<LayoutOverlayProps> = {
  Layout: AccountLayoutNav,
}
AccountOrdersPage.pageOptions = pageOptions

export default AccountOrdersPage

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
