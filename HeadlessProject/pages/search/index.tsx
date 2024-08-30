import { MiniCompareProducts } from '../../components/MiniCompareProducts'
import { MiniRecentOrders } from '../../components/MiniRecentOrders'
import { MiniWishlist } from '../../components/MiniWishlist'
import { PageOptions } from '@graphcommerce/framer-next-pages'
import {
  ProductListParamsProvider,
  ProductListDocument,
  extractUrlQuery,
  parseParams,
  FilterTypes,
  ProductListParams,
  getFilterTypes,
  ProductFiltersDocument,
  ProductListQuery,
  ProductFiltersQuery,
} from '@graphcommerce/magento-product'
import { CategorySearchQuery } from '@graphcommerce/magento-search'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps, LayoutTitle } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Alert, Box, Button, Container, IconButton, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { LayoutNavigation, LayoutNavigationProps, ProductListItems } from '../../components'
import { Ascending, Descending, GridView, ListView } from '../../components/Icons/index'
import { LayoutDocument } from '../../components/Layout/Layout.gql'
import { Sort } from '../../components/Sort/index'
import { DefaultPageDocument, DefaultPageQuery } from '../../graphql/DefaultPage.gql'
import { graphqlSharedClient, graphqlSsrClient } from '../../lib/graphql/graphqlSsrClient'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import { useProductListLink } from '@graphcommerce/magento-product/hooks/useProductListLink'
import { useRouter } from 'next/router'
import { AlertToast } from '../../components/AlertToast'
import { UIContext } from '../../components/common/contexts/UIContext'
import { AdvanceSearchFilterInfo } from '@components/AdvanceSearchFilterInfo'
import { Pagination } from '@components/common/Pagination'

type SearchResultProps = DefaultPageQuery &
  ProductListQuery &
  ProductFiltersQuery &
  CategorySearchQuery & { filterTypes: FilterTypes; params: ProductListParams }
type RouteProps = { url: string[] }
export type GetPageStaticProps = GetStaticProps<
  LayoutNavigationProps,
  SearchResultProps,
  RouteProps
>

function SearchResultPage(props: SearchResultProps) {
  const { products, params } = props
  const router = useRouter()
  const [state] = useContext(UIContext)
  const search = params.url.split('/')[1]
  const noSearchResults = search && (!products || (products.items && products?.items?.length <= 0))
  const [view, setView] = useState('grid')
  const sortBy = Object.keys(params!.sort).length === 0 ? 'position' : Object.keys(params!.sort)[0]
  const sortOrder =
    Object.keys(params!.sort).length === 0 ? 'position' : Object.values(params!.sort)[0]
  const [sort, setSort] = useState(sortOrder === 'DESC' ? 1 : 0)
  const [pageSize, setPageSize] = useState<number>(params?.pageSize ? params?.pageSize : 12)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(products!.total_count! / pageSize)
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  const advance = Boolean(Object.entries(params.filters).length)
  const breadCrumbData = [
    {
      category_uid: '1',
      category_name: 'Catalog Advanced Search',
      category_url_path: 'catalogsearch/advanced',
    },
  ]
  const routingFn = (param: string, value: number | string) => {
    const newParams = {
      filters: params?.filters ?? {},
      sort: params?.sort ?? {},
      url: params?.url ?? '',
      ...(param === 'pageSize' && { pageSize: Number(value), currentPage: 1 }),
      ...(param === 'pageNum' && { currentPage: Number(value) }),
      ...(param === 'sort' && { sort: { [sortBy]: value } }),
    }

    const productListLink = useProductListLink(newParams)
    router
      .push(`${productListLink}`)
      .then(() => {})
      .catch(() => {})
  }

  const formatTotalCount = () => {
    if (!products?.total_count || products?.total_count === 0 || !products?.items) {
      return null
    }

    if (products?.total_count < pageSize) {
      return `${products?.total_count} Item${products?.total_count > 1 ? 's' : ''}`
    }

    const start = (currentPage - 1) * pageSize + 1
    const end = Math.min(currentPage * pageSize, products?.total_count)

    return `Items ${start}-${end} of ${products?.total_count}`
  }

  const noItems = Boolean(products?.items?.length === 0)
  const filters: [string, { match?: string; in?: string[]; from?: string; to?: string }][] =
    Object.entries(Object.assign(params.filters))

  return (
    <>
      <PageMeta
        title={
          search
            ? i18n._(/* i18n */ 'Results for ‘{search}’', { search })
            : i18n._(/* i18n */ 'Search')
        }
        metaRobots={['noindex']}
        canonical='/search'
      />
      <Container>
        <Breadcrumb
          breadcrumb={advance ? breadCrumbData : []}
          name={advance ? 'Results' : `Search results for: ${search}`}
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
          {advance ? (
            <Trans id='Category Advanced Search' />
          ) : (
            <Trans id={`Search results for: ${search}`} />
          )}
        </LayoutTitle>
      </Container>
      {state?.alerts?.length > 0 && (
        <Container sx={{ marginBottom: '1.75rem !important' }} maxWidth='lg'>
          <AlertToast
            sx={{ marginLeft: '0 !important' }}
            alerts={state?.alerts}
            link={router?.pathname}
          />
        </Container>
      )}
      <ProductListParamsProvider value={params}>
        <Container
          sx={(theme) => ({
            [theme.breakpoints.up('md')]: {
              display: 'grid',
              gridTemplateColumns: '20.833% 1fr',
              position: 'relative',
              alignItems: 'flex-start',
            },
          })}
        >
          <Box
            sx={(theme) => ({
              [theme.breakpoints.down('md')]: {
                display: 'none',
                // display: 'block',
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: '#ffffff',
                zIndex: '9999',
                width: '100%',
                padding: '2rem 1rem',
                overflow: 'auto',
              },
            })}
          >
            <MiniCompareProducts />
            <MiniRecentOrders />
            <MiniWishlist />
          </Box>
          <Container
            maxWidth={false}
            sx={{
              paddingRight: '0px !important',
              paddingLeft: {
                xs: '0 !important',
                md: '1.25rem !important',
                lg: '1.875rem !important',
              },
            }}
          >
            {noSearchResults && (
              <Alert severity='warning' variant='standard'>
                <Trans id='Your search returned no results.' />
              </Alert>
            )}
            {advance && (
              <AdvanceSearchFilterInfo
                totalCount={products?.total_count}
                noItems={noItems}
                filters={filters}
                params={params}
              />
            )}
            {products?.items && products?.items?.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: { xs: 'flex-start', md: 'center' },
                  justifyContent: 'space-between',
                  marginBottom: '1.345rem',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'flex-start',
                  }}
                >
                  <Button
                    title='Grid View'
                    variant='contained'
                    size='small'
                    // color='secondary'
                    disableElevation
                    sx={{
                      display: { xs: 'none', md: 'inline-flex' },
                      minWidth: '1.813rem',
                      padding: '3px 6px',
                      border: '1px solid #cccccc',
                      borderTopRightRadius: '0',
                      borderBottomRightRadius: '0',
                      color: '#5e5e5e',
                      ...(view === 'grid' && {
                        transition: 'ease-in 0.1s',
                        backgroundColor: '#dedede',
                        color: '#5e5e5e',
                        minWidth: '1.813rem',
                        padding: '3px 6px',
                        boxShadow:
                          'inset 0 1px 0 0 rgba(204,204,204,0.8), inset 0 -1px 0 0 rgba(204,204,204,0.3)',
                        '&:hover, &.active': {
                          backgroundColor: '#ebebeb',
                          color: '#5e5e5e',
                          boxShadow:
                            'inset 0 1px 0 0 rgba(204,204,204,0.8), inset 0 -1px 0 0 rgba(204,204,204,0.3)',
                        },
                      }),
                    }}
                    onClick={() => setView('grid')}
                  >
                    <GridView />
                  </Button>
                  <Button
                    title='List View'
                    onClick={() => setView('list')}
                    variant='contained'
                    size='small'
                    // color='secondary'
                    disableElevation
                    sx={{
                      display: { xs: 'none', md: 'inline-flex' },
                      minWidth: '1.813rem',
                      padding: '3px 6px',
                      border: '1px solid #cccccc',
                      borderTopLeftRadius: '0',
                      borderBottomLeftRadius: '0',
                      color: '#5e5e5e',
                      ...(view === 'list' && {
                        transition: 'ease-in 0.1s',
                        backgroundColor: '#dedede',
                        color: '#5e5e5e',
                        minWidth: '1.813rem',
                        padding: '3px 6px',
                        boxShadow:
                          'inset 0 1px 0 0 rgba(204,204,204,0.8), inset 0 -1px 0 0 rgba(204,204,204,0.3)',
                        '&:hover, &.active': {
                          backgroundColor: '#ebebeb',
                          color: '#5e5e5e',
                          boxShadow:
                            'inset 0 1px 0 0 rgba(204,204,204,0.8), inset 0 -1px 0 0 rgba(204,204,204,0.3)',
                        },
                      }),
                      marginRight: '1.25rem',
                    }}
                  >
                    <ListView />
                  </Button>
                  <Trans id={formatTotalCount() ?? ''} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography id='sortBy' variant='body1' component='span'>
                    Sort By
                  </Typography>
                  <Sort
                    currentSort={sort === 1 ? 'DESC' : 'ASC'}
                    sort_fields={products?.sort_fields}
                    total_count={products?.total_count}
                    sx={{
                      marginTop: '0',
                      marginBottom: '0',
                    }}
                  />
                  <IconButton
                    aria-label='sorting'
                    size='small'
                    sx={{
                      '& svg': {
                        '& svg': {
                          height: '1.25rem',
                        },
                      },
                    }}
                  >
                    {sort === 0 ? (
                      <Ascending
                        fontSize='inherit'
                        onClick={() => {
                          setSort(1)
                          routingFn('sort', 'DESC')
                        }}
                        sx={{ color: '#757575', cursor: 'pointer', '&:hover': { color: '#333' } }}
                      />
                    ) : (
                      <Descending
                        fontSize='inherit'
                        onClick={() => {
                          setSort(0)
                          routingFn('sort', 'ASC')
                        }}
                        sx={{ color: '#757575', cursor: 'pointer', '&:hover': { color: '#333' } }}
                      />
                    )}
                  </IconButton>
                </Box>
              </Box>
            )}
            <ProductListItems
              view={view}
              title={`Search ${search}`}
              items={products?.items}
              loadingEager={1}
            />
            {products?.items && products?.items?.length > 0 && (
              <Pagination
                totalPages={totalPages}
                currentPageState={[currentPage, setCurrentPage]}
                sizeOptions={[12, 24, 36]}
                routingFn={routingFn}
                pageNumbers={pageNumbers}
                pageSizeState={[pageSize, setPageSize]}
              />
            )}
          </Container>
        </Container>
      </ProductListParamsProvider>
    </>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: LayoutNavigation,
  sharedKey: () => 'search',
}

SearchResultPage.pageOptions = pageOptions

export default SearchResultPage

export const getStaticProps: GetPageStaticProps = async ({ params, locale }) => {
  const [searchShort = '', query = []] = extractUrlQuery(params)
  const search = searchShort.length >= 3 ? searchShort : ''

  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })
  const filterTypes = getFilterTypes(client)

  const staticClient = graphqlSsrClient(locale)
  const page = staticClient.query({ query: DefaultPageDocument, variables: { url: 'search' } })
  const layout = staticClient.query({ query: LayoutDocument })

  const productListParams = parseParams(
    search ? `search/${search}` : 'search',
    query,
    await filterTypes,
  )

  if (!productListParams) return { notFound: true, revalidate: 60 * 20 }

  const filters = staticClient.query({ query: ProductFiltersDocument, variables: { search } })

  const products = staticClient.query({
    query: ProductListDocument,
    variables: {
      ...productListParams,
      search,
      filters: { ...productListParams.filters },
    },
  })

  // const categories = search
  //   ? staticClient.query({ query: CategorySearchDocument, variables: { search } })
  //   : undefined

  return {
    props: {
      ...(await page).data,
      ...(await products).data,
      ...(await filters).data,
      // ...(await categories)?.data,
      ...(await layout)?.data,
      filterTypes: await filterTypes,
      params: productListParams,
      up: { href: '/', title: 'Home' },
      apolloState: await conf.then(() => client.cache.extract()),
    },
    revalidate: 60 * 20,
  }
}
