import { PageOptions } from '@graphcommerce/framer-next-pages'
import {
  CustomerDocument,
  useCustomerQuery,
  WaitForCustomer,
  AccountDashboardAddressesQuery,
} from '@graphcommerce/magento-customer'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Box } from '@mui/material'
import { LayoutOverlayProps } from '../../../components'
import { AddAddressForm } from '../../../components/AddEditAddressForm'
import { AccountLayoutNav } from '../../../components/Layout/AccountLayoutNav'
import { LayoutDocument } from '../../../components/Layout/Layout.gql'
import { graphqlSharedClient, graphqlSsrClient } from '../../../lib/graphql/graphqlSsrClient'

type Props = AccountDashboardAddressesQuery
type GetPageStaticProps = GetStaticProps<LayoutOverlayProps, Props>

function AddNewAddressPage() {
  const addresses = useCustomerQuery(CustomerDocument, {
    fetchPolicy: 'network-only',
  })

  return (
    <WaitForCustomer waitFor={addresses}>
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
        <PageMeta title={i18n._(/* i18n */ 'Add address')} metaRobots={['noindex']} />
        <AddAddressForm addresses={addresses} />
      </Box>
    </WaitForCustomer>
  )
}

const pageOptions: PageOptions<LayoutOverlayProps> = {
  Layout: AccountLayoutNav,
}
AddNewAddressPage.pageOptions = pageOptions

export default AddNewAddressPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const staticClient = graphqlSsrClient(locale)
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
