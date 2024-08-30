import { LayoutDocument } from '@components/Layout/Layout.gql'
import { WaitForQueries } from '@graphcommerce/ecommerce-ui'
import { PageOptions } from '@graphcommerce/framer-next-pages'
import {
  ApolloCartErrorAlert,
  EmptyCart,
  useCartQuery,
} from '@graphcommerce/magento-cart'
import { CartPageDocument } from '@graphcommerce/magento-cart-checkout'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import {
  GetStaticProps,
  FullPageMessage,
} from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { CircularProgress, Container } from '@mui/material'
import { LayoutNavigation, LayoutNavigationProps } from '../components'
import { graphqlSharedClient, graphqlSsrClient } from '../lib/graphql/graphqlSsrClient'
import { CartItems } from '@components/shopping-cart'
import { CartContext } from '@components/shopping-cart/hooks/cartContext'

type Props = Record<string, unknown>
type GetPageStaticProps = GetStaticProps<LayoutNavigationProps, Props>

function CartPage() {
  const cart = useCartQuery(CartPageDocument, { returnPartialData: true, errorPolicy: 'all' })
  const { data, error } = cart
  const hasItems =
    (data?.cart?.total_quantity ?? 0) > 0 &&
    typeof data?.cart?.prices?.grand_total?.value !== 'undefined'

  return (
    <>
      <WaitForQueries
        waitFor={cart}
        fallback={
          <FullPageMessage icon={<CircularProgress />} title={<Trans id='Loading' />}>
            <Trans id='This may take a second' />
          </FullPageMessage>
        }
      >
        <Container maxWidth='lg'>
          <>
            {hasItems ? (
              <CartContext>
                <CartItems cart={data} />
              </CartContext>
            ) : (
              <EmptyCart>{error && <ApolloCartErrorAlert error={error} />}</EmptyCart>
            )}
          </>
        </Container>
      </WaitForQueries>
    </>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: LayoutNavigation
}
CartPage.pageOptions = pageOptions

export default CartPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const staticClient = graphqlSsrClient(locale)
  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })
  const layout = staticClient.query({ query: LayoutDocument })
  
  return {
    props: {
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
  }
}
