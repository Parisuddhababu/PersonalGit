import { PageOptions } from '@graphcommerce/framer-next-pages'
import { extractUrlQuery, ProductListParams } from '@graphcommerce/magento-product'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps, LayoutHeader } from '@graphcommerce/next-ui'
import { Container } from '@mui/material'
import { GetStaticPaths } from 'next'
import { LayoutDocument } from '../../components/Layout/Layout.gql'
import { LayoutNavigation, LayoutNavigationProps } from '../../components/Layout/index'
import { cmsPaths } from '../../config/cmsPaths'
import { CmsPageQuery, CmsPageQueryDocument } from '../../graphql/common/cmsPage.gql'
import { graphqlSharedClient, graphqlSsrClient } from '../../lib/graphql/graphqlSsrClient'
import { RichContent } from '../../lib/magento-page-builder'
import Breadcrumb from '@components/Breadcrumb/Breadcrumb'

export type CategoryProps = { params?: ProductListParams }
export type CategoryRoute = { url: string[] }

type Props = CmsPageQuery
type GetPageStaticPaths = GetStaticPaths<CategoryRoute>
type GetPageStaticProps = GetStaticProps<LayoutNavigationProps, CategoryProps, CategoryRoute>

function CmsPage(props: Props) {
  const { cmsPage } = props
  return (
    <Container maxWidth='lg'>
      <LayoutHeader floatingMd floatingSm />
      <Breadcrumb
        breadcrumb={[]}
        name={cmsPage?.title ?? ''}
        sx={{
          marginTop: '24px',
          display: { xs: 'none', sm: 'block' },
        }}
      />
      <RichContent html={props?.cmsPage?.content} />
    </Container>
  )
}

CmsPage.pageOptions = {
  Layout: LayoutNavigation,
} as PageOptions

export default CmsPage

export const getStaticPaths: GetPageStaticPaths = ({ locales = [] }) => {
  if (process.env.NODE_ENV === 'development') return { paths: [], fallback: 'blocking' }

  const urls = cmsPaths
  const paths = locales
    .map((locale) =>
      urls.map((url) => ({
        params: { url: [url] },
        locale,
      })),
    )
    .flat(1)
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetPageStaticProps = async ({ params, locale }) => {
  const [url, query] = extractUrlQuery(params)
  if (!url || !query) return { notFound: true }
  const client = graphqlSharedClient(locale)
  const staticClient = graphqlSsrClient(locale)

  const conf = client.query({ query: StoreConfigDocument })
  const page = staticClient.query({
    query: CmsPageQueryDocument,
    variables: { identifier: url },
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
