import { LayoutDocument } from '@components/Layout/Layout.gql'
import { PageOptions } from '@graphcommerce/framer-next-pages'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps, LayoutTitle } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Box, Container, Typography, Grid } from '@mui/material'
import { LayoutNavigation, LayoutOverlayProps, LayoutNavigationProps } from '../../components'
import { graphqlSharedClient, graphqlSsrClient } from '../../lib/graphql/graphqlSsrClient'
import { ForgotPassWordForm } from '../../components/Forgot-Reset-Password/ForgotPassWordForm/index'
import { AlertToast } from '@components/AlertToast'
import { useContext } from 'react'
import { UIContext } from '@components/common/contexts/UIContext'
import { useRouter } from 'next/router'

type GetPageStaticProps = GetStaticProps<LayoutNavigationProps>

function AccountForgotPasswordPage() {
  const [state] = useContext(UIContext)
  const router = useRouter()
  return (
    <>
      <Container
        maxWidth='lg'
        sx={{
          paddingTop: '1.3rem',
        }}
      >
        <PageMeta title={i18n._(/* i18n */ 'Forgot Password')} metaRobots={['noindex']} />
        <Box
          sx={{
            // margin: '40px 0px',
            display: 'flex',
            paddingBottom: '2rem',
            // flexDirection: { xs: 'column', md: 'row' },
            '& h1': {
              fontWeight: '300',
              fontVariationSettings: `'wght' 300`,
            },
          }}
        >
          <LayoutTitle size='medium' gutterBottom={false} gutterTop={false} variant='h2'>
            <Trans id='Forgot your password?' />
          </LayoutTitle>
        </Box>
        <Box>
          {state?.alerts?.length > 0 && (
            <AlertToast sx={{ marginTop: '1rem' }} alerts={state?.alerts} link={router?.pathname} />
          )}
        </Box>

        <Typography
          variant='h6'
          // sx={{ marginTop: '0rem' }}
        >
          <Trans id='Please enter your email address below to receive a password reset link.' />
        </Typography>

        <Grid container spacing={{ xs: 3, md: 6 }}>
          <Grid item xs={12} md={8} lg={6}>
            <ForgotPassWordForm />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

const pageOptions: PageOptions<LayoutOverlayProps> = {
  overlayGroup: 'account-public',
  sharedKey: () => 'account-signin',
  Layout: LayoutNavigation,
}
AccountForgotPasswordPage.pageOptions = pageOptions

export default AccountForgotPasswordPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const staticClient = graphqlSsrClient(locale)

  const conf = client.query({ query: StoreConfigDocument })
  const layout = staticClient.query({ query: LayoutDocument })

  return {
    props: {
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
      variantMd: 'bottom',
      size: 'max',
      up: { href: '/account/signin', title: i18n._(/* i18n */ 'Sign in') },
    },
  }
}
