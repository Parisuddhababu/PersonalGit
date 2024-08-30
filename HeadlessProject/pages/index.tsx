import { PageOptions } from '@graphcommerce/framer-next-pages'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import {GetStaticProps} from '@graphcommerce/next-ui'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { LayoutNavigation, LayoutNavigationProps } from '../components'
import { AlertToast } from '../components/AlertToast'
import { LayoutDocument } from '../components/Layout/Layout.gql'
import { UIContext } from '../components/common/contexts/UIContext'
import { CmsPageQuery, CmsPageQueryDocument } from '../graphql/common/cmsPage.gql'
import { graphqlSharedClient, graphqlSsrClient } from '../lib/graphql/graphqlSsrClient'
import { RichContent } from '../lib/magento-page-builder'
import { Container } from '@mui/material'
import FullPageOverlaySpinner from '@components/common/FullPageOverlaySpinner'

type Props = CmsPageQuery
type RouteProps = { url: string }
type GetPageStaticProps = GetStaticProps<LayoutNavigationProps, Props, RouteProps>

function HomePage(props: Props) {
  const router = useRouter()
  const [state] = useContext(UIContext)

  return (
    <>
      {/* <PageMeta*/}
      {/*  title={page?.metaTitle ?? page?.title ?? ''}*/}
      {/*  metaDescription={page?.metaDescription ?? ''}*/}
      {/*  metaRobots={page?.metaRobots.toLowerCase().split('_') as MetaRobots[] | undefined}*/}
      {/*  canonical='/'*/}
      {/*/> */}

      {/* <LayoutHeader floatingMd floatingSm /> */}
      {state?.alerts?.length > 0 && (
        <Container
          maxWidth='lg'
          sx={{
            padding: '2rem 0',
          }}
        >
          <AlertToast
            sx={{ marginLeft: '0 !important' }}
            alerts={state?.alerts}
            link={router?.pathname}
          />
        </Container>
      )}
      {state?.compareLoading && <FullPageOverlaySpinner />}
      <RichContent html={props?.cmsPage?.content} />
    </>
  )
}

HomePage.pageOptions = {
  Layout: LayoutNavigation,
} as PageOptions

export default HomePage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const staticClient = graphqlSsrClient(locale)

  const conf = client.query({ query: StoreConfigDocument })
  const page = staticClient.query({
    query: CmsPageQueryDocument,
    variables: { identifier: `home` },
  })
  const layout = staticClient.query({ query: LayoutDocument })

  if (!(await page).data.cmsPage) return { notFound: true }

  return {
    props: {
      ...(await page).data,
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
    revalidate: 30,
  }
}
