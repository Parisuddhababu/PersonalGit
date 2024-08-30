import { PageOptions } from '@graphcommerce/framer-next-pages'
import {InlineAccount, useCartQuery} from '@graphcommerce/magento-cart'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import {
  FullPageMessage,
  GetStaticProps,
  iconParty,
  iconSadFace,
  LayoutHeader,
  IconSvg,
  LayoutTitle,
} from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Button, Box, Container, Typography, Link } from '@mui/material'
import { useRouter } from 'next/router'
import { LayoutNavigationProps, LayoutMinimalProps, LayoutNavigation } from '../../components'
import { LayoutDocument } from '../../components/Layout/Layout.gql'
import { DefaultPageDocument } from '../../graphql/DefaultPage.gql'
import { graphqlSsrClient, graphqlSharedClient } from '../../lib/graphql/graphqlSsrClient'

type Props = Record<string, unknown>
type GetPageStaticProps = GetStaticProps<LayoutNavigationProps, Props>

function OrderSuccessPage() {
  const hasCartId = !!useRouter().query.cart_id
  const orderNumber = useRouter().query.order_number

  return (
    <>
      <PageMeta title={i18n._(/* i18n */ 'Checkout summary')} metaRobots={['noindex']} />
      <LayoutHeader floatingMd>
        {hasCartId && (
          <LayoutTitle size='small' icon={iconParty}>
            <Trans id='Thank you for your purchase!' />
          </LayoutTitle>
        )}
      </LayoutHeader>
      <Container maxWidth='lg' sx={{
        minHeight: "calc(100vh - 48vh)"
      }}>
        {!hasCartId && (
          <FullPageMessage
            title={<Trans id='You have not placed an order' />}
            icon={<IconSvg src={iconSadFace} size='xxl' />}
            button={
              <Button href='/' variant='contained' color='secondary' size='medium'>
                <Trans id='Continue shopping' />
              </Button>
            }
          >
            <Trans id='Discover our collection and add items to your cart!' />
          </FullPageMessage>
        )}
        {hasCartId && (
          <Box sx={{padding: '1.25rem 0'}}>
            <Typography variant='h2'
                sx={{
                    fontWeight: '300',
                    fontVariationSettings: "'wght' 300",
                    marginBottom: {xs: '1rem', md:'2rem'}
                }}
            >
                <Trans id='Thank you for your purchase!' />
            </Typography>

            <Box>
              <Typography variant="body1" sx={{marginBottom: '0.75rem'}}>
                <Trans id="Your order number is:" /> <Link href={"account/my-orders/view?orderId=" + orderNumber} underline="hover" sx={{fontWeight: '700', fontVariationSettings: "'wght' 700",}}>{orderNumber ?? 'null'}</Link>
              </Typography>

              <Typography variant="body1" sx={{marginBottom: '0.5rem'}}>
                <Trans id="We'll email you an order confirmation with details and tracking info." />
              </Typography>

              <Button href='/' color='secondary' variant='contained' size='medium' id='back-to-home'>
                <Trans id='Continue Shopping' />
              </Button>

            </Box>

            <InlineAccount accountHref='/account' />
          </Box>
        )}
      </Container>
    </>
  )
}

const pageOptions: PageOptions<LayoutMinimalProps> = {
  Layout: LayoutNavigation,
  sharedKey: () => 'checkout',
}
OrderSuccessPage.pageOptions = pageOptions

export default OrderSuccessPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const staticClient = graphqlSsrClient(locale)
  const conf = client.query({ query: StoreConfigDocument })
  const page = staticClient.query({
    query: DefaultPageDocument,
    variables: { url: `checkout/success` },
  })
  const layout = staticClient.query({ query: LayoutDocument })

  return {
    props: {
      ...(await page).data,
      ...(await layout).data,
      up: { href: '/', title: 'Home' },
      apolloState: await conf.then(() => client.cache.extract()),
    },
  }
}
