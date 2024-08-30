/* eslint-disable react-hooks/rules-of-hooks */
import { PageOptions } from '@graphcommerce/framer-next-pages'
import { useQuery } from '@graphcommerce/graphql'
import { CustomerDocument, useCustomerQuery } from '@graphcommerce/magento-customer'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { FullPageMessage, GetStaticProps } from '@graphcommerce/next-ui'
import { Alert, Box, CircularProgress, Container, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { LayoutNavigation, LayoutNavigationProps, LayoutOverlayProps } from '../../components'
import { AlertToast } from '../../components/AlertToast'
import { CompareListTable } from '../../components/CompareListTable'
import { LayoutDocument } from '../../components/Layout/Layout.gql'
import { UIContext } from '../../components/common/contexts/UIContext'
import { compareListDocument } from '../../graphql/compare-product/CompareList.gql'
import { graphqlSharedClient, graphqlSsrClient } from '../../lib/graphql/graphqlSsrClient'
import { Trans } from '@lingui/react'
import { WaitForQueries } from '@graphcommerce/ecommerce-ui'

type GetPageStaticProps = GetStaticProps<LayoutOverlayProps>

function CompareIndexPage() {
  const customer = useCustomerQuery(CustomerDocument)
  const router = useRouter()
  let compareId = ''
  if (typeof window !== 'undefined') {
    compareId =
      customer?.data?.customer?.compare_list?.uid || localStorage.getItem('CompareListId') || ''
  }
  const data = useQuery(compareListDocument, { variables: { uid: compareId } })
  const [state] = useContext(UIContext)

  const items = data?.data?.compareList?.items

  return (
    <Container
      maxWidth='lg'
      sx={{ padding: { xs: '1.3rem 0.938rem', lg: '1.3rem 1.875rem' }, position: 'relative' }}
    >
      <Box
        sx={{
          display: 'flex',
          paddingBottom: { xs: '1.5rem', md: '2rem' },
          '& h2': {
            fontWeight: '300',
            fontVariationSettings: `'wght' 300`,
          },
        }}
      >
        <Typography variant='h2'>Compare Products</Typography>
      </Box>
      <WaitForQueries
        waitFor={data}
        fallback={
          <FullPageMessage icon={<CircularProgress />} title={<Trans id='Loading your data' />}>
            <Trans id='This may take a second' />
          </FullPageMessage>
        }
      >
        <Box>
          {state?.alerts?.length > 0 && (
            <AlertToast alerts={state?.alerts} link={router?.pathname} />
          )}
          {items && items?.length > 0 ? (
            <CompareListTable items={items} compareId={compareId} />
          ) : (
            <Alert severity='warning'>
              <Trans id='You have no items to compare.' />
            </Alert>
          )}
        </Box>
      </WaitForQueries>
    </Container>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: LayoutNavigation,
}
CompareIndexPage.pageOptions = pageOptions

export default CompareIndexPage

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
