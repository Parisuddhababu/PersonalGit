import { PageOptions } from '@graphcommerce/framer-next-pages'
import { useMergeCustomerCart } from '@graphcommerce/magento-cart'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { useMergeGuestWishlistWithCustomer } from '@graphcommerce/magento-wishlist'
import { GetStaticProps } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Container } from '@mui/material'
import { LayoutNavigation, LayoutNavigationProps } from '../../components'
import { LayoutDocument } from '../../components/Layout/Layout.gql'
import { SignUpForm } from '../../components/SignInUp/Signup/SignUp/index'
import { graphqlSharedClient, graphqlSsrClient } from '../../lib/graphql/graphqlSsrClient'

type GetPageStaticProps = GetStaticProps<LayoutNavigationProps>

function AccountSignUpPage() {
  useMergeCustomerCart()
  useMergeGuestWishlistWithCustomer()

  return (
    <Container maxWidth="lg">
      <PageMeta title={i18n._(/* i18n */ 'Sign up')} metaRobots={['noindex']} />
      <SignUpForm />
    </Container>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: LayoutNavigation,
}

AccountSignUpPage.pageOptions = pageOptions

export default AccountSignUpPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })
  const staticClient = graphqlSsrClient(locale)
  const layout = staticClient.query({ query: LayoutDocument })

  return {
    props: {
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
  }
}
