import { PageOptions } from '@graphcommerce/framer-next-pages'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { PageMeta, GetStaticProps, Row, LayoutTitle, LayoutHeader } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { GetStaticPaths } from 'next'
import {
  BlogAuthor,
  BlogHeader,
  BlogList,
  BlogPostTaggedPathsDocument,
  BlogListTaggedDocument,
  BlogListTaggedQuery,
  BlogTags,
  BlogTitle,
  LayoutNavigation,
  LayoutNavigationProps,
  RowRenderer,
} from '../../../components'
import { LayoutDocument } from '../../../components/Layout/Layout.gql'
import { DefaultPageDocument, DefaultPageQuery } from '../../../graphql/DefaultPage.gql'
import { graphqlSsrClient, graphqlSharedClient } from '../../../lib/graphql/graphqlSsrClient'

type Props = DefaultPageQuery & BlogListTaggedQuery
type RouteProps = { url: string }
type GetPageStaticPaths = GetStaticPaths<RouteProps>
type GetPageStaticProps = GetStaticProps<LayoutNavigationProps, Props, RouteProps>

function BlogPage(props: Props) {
  const { pages, blogPosts } = props
  const page = pages[0]
  const title = page.title ?? ''

  return (
    <>
      <LayoutHeader floatingMd>
        <LayoutTitle size='small'>{title}</LayoutTitle>
      </LayoutHeader>
      <Row>
        <PageMeta title={title} metaDescription={title} canonical={`/${page.url}`} />

        <BlogTitle>
          <Trans id='Tagged in: {title}' values={{ title }} />
        </BlogTitle>

        {page.author ? <BlogAuthor author={page.author} date={page.date} /> : null}
        {page.asset ? <BlogHeader asset={page.asset} /> : null}
        <RowRenderer {...page} />
        <BlogTags relatedPages={page.relatedPages} />
      </Row>
      <BlogList blogPosts={blogPosts} />
    </>
  )
}

BlogPage.pageOptions = {
  Layout: LayoutNavigation,
} as PageOptions

export default BlogPage

export const getStaticPaths: GetPageStaticPaths = async ({ locales = [] }) => {
  if (import.meta.graphCommerce.limitSsg) return { paths: [], fallback: 'blocking' }

  const responses = locales.map(async (locale) => {
    const staticClient = graphqlSsrClient(locale)
    const BlogPostPaths = staticClient.query({ query: BlogPostTaggedPathsDocument })
    const { pages } = (await BlogPostPaths).data
    return (
      pages.map((page) => ({
        params: { url: `${page?.url}`.replace('blog/tagged/', '') },
        locale,
      })) ?? []
    )
  })
  const paths = (await Promise.all(responses)).flat(1)
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetPageStaticProps = async ({ locale, params }) => {
  const urlKey = params?.url ?? '??'
  const client = graphqlSharedClient(locale)
  const staticClient = graphqlSsrClient(locale)
  const limit = 99
  const conf = client.query({ query: StoreConfigDocument })
  const page = staticClient.query({
    query: DefaultPageDocument,
    variables: { url: `blog/tagged/${urlKey}` },
  })
  const layout = staticClient.query({ query: LayoutDocument })

  const blogPosts = staticClient.query({
    query: BlogListTaggedDocument,
    variables: { currentUrl: [`blog/tagged/${urlKey}`], first: limit, tagged: params?.url },
  })
  if (!(await page).data.pages?.[0]) return { notFound: true }

  return {
    notFound: true, // redirects page directly on 404 on this "/blog/tagged/[url]" route
    props: {
      ...(await page).data,
      ...(await blogPosts).data,
      ...(await layout).data,
      up: { href: '/blog', title: 'Blog' },
      apolloState: await conf.then(() => client.cache.extract()),
    },
    revalidate: 60 * 20,
  }
}
