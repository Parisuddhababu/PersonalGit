import { AlertToast } from '@components/AlertToast'
import Breadcrumb from '@components/Breadcrumb/Breadcrumb'
import { UIContext } from '@components/common/contexts/UIContext'
import { OrdersAndReturnForm } from '@components/OrdersAndReturnsForm'
import { PageOptions } from '@graphcommerce/framer-next-pages'
import { useLazyQuery, useQuery } from '@graphcommerce/graphql'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps, LayoutTitle } from '@graphcommerce/next-ui'
import { OrdersAndReturnsDocument } from '@graphql/orders-and-returns/OrdersAndReturns.gql'
import { Trans } from '@lingui/react'
import { Box, Container, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { LayoutNavigation, LayoutNavigationProps, LayoutOverlayProps } from '../../components'
import { LayoutDocument } from '../../components/Layout/Layout.gql'
import { graphqlSharedClient, graphqlSsrClient } from '../../lib/graphql/graphqlSsrClient'

type GetPageStaticProps = GetStaticProps<LayoutOverlayProps>

function OrdersAndReturns() {
  const router = useRouter()
  const [state, setState] = useContext(UIContext)
  const [formData, setFormData] = useState({
    orderId: '',
    lastName: '',
    findBy: 'Email',
    emailZip: '',
  })

  const [orderData, { loading }] = useLazyQuery(OrdersAndReturnsDocument, {
    fetchPolicy: 'network-only',
  })
  const handleSubmit = async () => {
    orderData({
      variables: {
        orderId: formData.orderId,
        billingLastName: formData.lastName,
        email: formData.emailZip,
        findOrderBy: formData.findBy,
        zipCode: formData.emailZip,
      },
    })
      .then(async (data) => {
        if (data?.error) {
          setState((prev) => ({
            ...prev,
            alerts: [
              {
                type: 'error',
                message: 'You entered incorrect data. Please try again.',
                timeout: 5000,
                targetLink: router.pathname,
              },
            ],
          }))
          return
        }
        const result = Object.assign(data?.data ?? {})
        await router.push({
          pathname: 'order-view',
          query: {
            orderData: encodeURIComponent(JSON.stringify(Object.keys(result).length && result)),
          },
        })
      })
      .catch((error) => {
        console.log('Error: ', error)
      })
  }

  return (
    <Container maxWidth='lg' sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Breadcrumb
          name='Order Information'
          breadcrumb={[]}
          sx={{
            marginTop: '24px',
            display: { xs: 'none', sm: 'block' },
          }}
        />
        <LayoutTitle
          variant='h1'
          gutterTop={false}
          sx={{
            margin: '1rem 0 2.25rem 0',
            textAlign: 'left',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            '& > h1': {
              fontSize: { xs: '26px', md: '40px' },
              lineHeight: { xs: '28px', md: '44px' },
              fontWeight: '300',
              fontVariationSettings: `'wght' 300`,
            },
          }}
          gutterBottom={false}
        >
          <Trans id='Orders and Returns' />
        </LayoutTitle>
        {state?.alerts?.length > 0 && (
          <AlertToast
            sx={{ margin: '0 0 1rem !important' }}
            alerts={state?.alerts}
            link={router?.pathname}
          />
        )}
      </Box>
      <Grid container spacing={{ xs: 3, md: 6 }}>
        <Grid item xs={12} md={8} lg={6}>
          <OrdersAndReturnForm
            formDataState={[formData, setFormData]}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: LayoutNavigation,
}
OrdersAndReturns.pageOptions = pageOptions

export default OrdersAndReturns

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
