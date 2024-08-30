import { PageOptions } from '@graphcommerce/framer-next-pages'
import {
  useCustomerQuery,
  WaitForCustomer,
  AccountDashboardAddressesDocument,
} from '@graphcommerce/magento-customer'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps, iconAddresses, IconHeader } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Box, Container } from '@mui/material'
import { useRouter } from 'next/router'
import { LayoutOverlayProps } from '../../../components'
import { EditAddressForm } from '../../../components/AddEditAddressForm'
import { AccountLayoutNav } from '../../../components/Layout/AccountLayoutNav'
import { LayoutDocument } from '../../../components/Layout/Layout.gql'
import { graphqlSharedClient, graphqlSsrClient } from '../../../lib/graphql/graphqlSsrClient'

type GetPageStaticProps = GetStaticProps<LayoutOverlayProps>

function EditAddressPage() {
  const router = useRouter()

  const addresses = useCustomerQuery(AccountDashboardAddressesDocument, {
    fetchPolicy: 'network-only',
  })

  const address = addresses.data?.customer?.addresses?.find(
    (a) => a?.id === Number(router.query.addressId),
  )

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
        <PageMeta title={i18n._(/* i18n */ 'Edit address')} metaRobots={['noindex']} />
        {!address && (
          <Box marginTop={3}>
            <IconHeader src={iconAddresses} size='small'>
              <Trans id='Address not found' />
            </IconHeader>
          </Box>
        )}

        {address && <EditAddressForm addresses={addresses} editId={router.query.addressId} />}
      </Box>
    </WaitForCustomer>
  )
}

const pageOptions: PageOptions<LayoutOverlayProps> = {
  Layout: AccountLayoutNav,
}
EditAddressPage.pageOptions = pageOptions

export default EditAddressPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const staticClient = graphqlSsrClient(locale)
  const conf = client.query({ query: StoreConfigDocument })
  const layout = staticClient.query({ query: LayoutDocument })

  return {
    props: {
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
      up: { href: '/account/addresses', title: 'Addresses' },
    },
  }
}
