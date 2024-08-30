import { PageOptions } from '@graphcommerce/framer-next-pages'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { FullPageMessage, GetStaticProps, LayoutTitle } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { CircularProgress, Container, Box, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { LayoutNavigation, LayoutNavigationProps } from '../../components'
import { LayoutDocument } from '../../components/Layout/Layout.gql'
import { graphqlSharedClient, graphqlSsrClient } from '../../lib/graphql/graphqlSsrClient'
import { ResetPassWordForm } from '../../components/Forgot-Reset-Password/ResetPassWordForm/index'

type GetPageStaticProps = GetStaticProps<LayoutNavigationProps>

function CreatePasswordPage() {
  const router = useRouter()
  const { email, token } = router.query

  if (!token || !email) {
    return (
      <FullPageMessage icon={<CircularProgress />} title={<Trans id='Loading your data' />}>
        <Trans id='This may take a second' />
      </FullPageMessage>
    )
  }

  return (
    <Container
      maxWidth='lg'
      sx={{
        paddingTop: '1.3rem',
      }}
    >
      <PageMeta title={i18n._(/* i18n */ 'Reset Password')} metaRobots={['noindex']} />
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
          <Trans id='Set a New Password' />
        </LayoutTitle>
      </Box>
      <Grid container spacing={{ xs: 3, md: 6 }}>
        <Grid item xs={12} md={8} lg={6}>
          <ResetPassWordForm email={email} token={token} />
        </Grid>
      </Grid>
    </Container>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: LayoutNavigation,
}

CreatePasswordPage.pageOptions = pageOptions

export default CreatePasswordPage

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
