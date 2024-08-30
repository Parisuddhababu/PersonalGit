import { PageOptions } from '@graphcommerce/framer-next-pages'
import { CustomerDocument, useCustomerQuery } from '@graphcommerce/magento-customer'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { FullPageMessage, GetStaticProps } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { LayoutOverlayProps } from '../../../components'

import { AccountLayoutNav } from '../../../components/Layout/AccountLayoutNav'
import { LayoutDocument } from '../../../components/Layout/Layout.gql'
import { graphqlSharedClient, graphqlSsrClient } from '../../../lib/graphql/graphqlSsrClient'
import { GetMyDownloadableProductsDocument } from '@graphql/MyDownloadableProducts/GetMyDownloadableProducts.gql'
import { DownloadableProducts } from '@components/DownloadableProducts/DownloadableProducts'
import { WaitForQueries } from '@graphcommerce/ecommerce-ui'

type GetPageStaticProps = GetStaticProps<LayoutOverlayProps>

function MyDownloadableProducts() {
  const { data: customerQuery } = useCustomerQuery(CustomerDocument)

  const downloadableQuery = useCustomerQuery(GetMyDownloadableProductsDocument, {
    variables: { customerEmail: customerQuery?.customer?.email as string },
  })
  const { data: downloadableProducts } = downloadableQuery
  const productList = downloadableProducts?.GetMyDownloadableProducts?.CollectionData

  return (
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
      <Box sx={{ width: '100%', paddingLeft: { xs: '0', md: '1rem', lg: '1.563rem' } }}>
        <Typography
          variant='h2'
          sx={{
            fontWeight: '300',
            fontVariationSettings: `'wght' 300`,
            paddingBottom: { xs: '1rem', md: '2rem' },
            marginTop: { xs: '0', md: '-0.25rem' },
          }}
        >
          My Downloadable Products
        </Typography>

        <PageMeta title={i18n._(/* i18n */ 'Orders')} metaRobots={['noindex']} />
        <WaitForQueries
          waitFor={downloadableQuery}
          fallback={
            <FullPageMessage icon={<CircularProgress />} title={<Trans id='Loading your data' />}>
              <Trans id='This may take a second' />
            </FullPageMessage>
          }
        >
          {productList && productList?.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box sx={{ width: '100%', paddingBottom: '2rem' }}>
                <DownloadableProducts productList={productList} />
              </Box>
            </Box>
          ) : (
            <Alert severity='error'>
              <Trans id='You have not purchased any downloadable products yet.' />
            </Alert>
          )}
        </WaitForQueries>
      </Box>
    </Box>
  )
}

const pageOptions: PageOptions<LayoutOverlayProps> = {
  Layout: AccountLayoutNav,
}
MyDownloadableProducts.pageOptions = pageOptions

export default MyDownloadableProducts

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
