/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unsafe-optional-chaining */
import { PageOptions } from '@graphcommerce/framer-next-pages'
import { Asset } from '@graphcommerce/graphcms-ui'
import { flushMeasurePerf } from '@graphcommerce/graphql'
import {
  CategoryDescription,
  CategoryHeroNav,
  CategoryHeroNavTitle,
  CategoryMeta,
  getCategoryStaticPaths,
} from '@graphcommerce/magento-category'
import {
  extractUrlQuery,
  FilterTypes,
  getFilterTypes,
  parseParams,
  ProductFiltersDocument,
  ProductFiltersQuery,
  ProductListDocument,
  ProductListParams,
  ProductListParamsProvider,
  ProductListQuery,
} from '@graphcommerce/magento-product'
import { useProductListLink } from '@graphcommerce/magento-product/hooks/useProductListLink'
import { StoreConfigDocument, redirectOrNotFound } from '@graphcommerce/magento-store'
import {
  LayoutTitle,
  LayoutHeader,
  GetStaticProps,
  MetaRobots,
  iconChevronDown,
  IconSvg,
} from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { Box, Button, Container, MenuItem, Select, Typography, IconButton } from '@mui/material'
import { GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import {
  LayoutNavigation,
  LayoutNavigationProps,
  ProductListItems,
  RowProduct,
  RowRenderer,
} from '../components'
import { AlertToast } from '../components/AlertToast'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import { Filter } from '../components/Filter/index'
import { Closemenu, Ascending, Descending, GridView, ListView } from '../components/Icons'
import { LayoutDocument } from '../components/Layout/Layout.gql'
import { MiniCompareProducts } from '../components/MiniCompareProducts'
import MiniRecentOrders from '../components/MiniRecentOrders/MiniRecentOrders'
import { MiniWishlist } from '../components/MiniWishlist'
import { Sort } from '../components/Sort/index'
import { UIContext } from '../components/common/contexts/UIContext'
import { CategoryPageDocument, CategoryPageQuery } from '../graphql/CategoryPage.gql'
import { graphqlSsrClient, graphqlSharedClient } from '../lib/graphql/graphqlSsrClient'
import { Pagination } from '@components/common/Pagination'
// import { Closemenu } from '../Icons'

export type CategoryProps = CategoryPageQuery &
  ProductListQuery &
  ProductFiltersQuery & { filterTypes?: FilterTypes; params?: ProductListParams }
export type CategoryRoute = { url: string[] }

type GetPageStaticPaths = GetStaticPaths<CategoryRoute>
type GetPageStaticProps = GetStaticProps<LayoutNavigationProps, CategoryProps, CategoryRoute>

function CategoryPage(props: CategoryProps) {
  const { categories, products, filters, params, filterTypes, pages } = props
  const category = categories?.items?.[0]
  const isLanding = category?.display_mode === 'PAGE'
  const page = pages?.[0]
  const isCategory = params && category && products?.items && filterTypes
  const router = useRouter()
  const [view, setView] = useState('grid')
  const [showShopBy, setShowShopBy] = useState(false)
  const sortBy = Object.keys(params!.sort).length === 0 ? 'position' : Object.keys(params!.sort)[0]
  const sortOrder =
    Object.keys(params!.sort).length === 0 ? 'position' : Object.values(params!.sort)[0]
  const [sort, setSort] = useState(sortOrder === 'DESC' ? 1 : 0)
  const [state] = useContext(UIContext)
  const [pageSize, setPageSize] = useState<number>(params?.pageSize ? params?.pageSize : 12)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(products!.total_count! / pageSize)
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  useEffect(() => {
    if (params?.currentPage) {
      setCurrentPage(params?.currentPage)
      return
    }
    setCurrentPage(1)
  }, [params?.currentPage])

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

  const withoutCategory = {
    ...filters,
    aggregations: filters?.aggregations?.filter((item) => item?.label !== 'Category'),
  }
  const categoryFilterData = filters?.aggregations?.filter((el) => el?.label === 'Category')?.[0]
  const newOptions = category?.children?.map((el) => ({
    count: categoryFilterData?.options?.filter((item) => item?.label === el?.name)?.[0]?.count,
    label: el?.name ?? '',
    value: el?.uid ?? '',
    __typename: 'AggregationOption',
  }))
  const newCategoryEl = {
    attribute_code: 'category_uid',
    count: newOptions?.length,
    label: 'Category',
    options: newOptions,
    __typename: 'Aggregation',
  }
  if (newOptions && newOptions.length > 0) {
    withoutCategory?.aggregations?.unshift(newCategoryEl as any)
  }
  const containerStyles = (theme) => ({
    // paddingLeft: '0px',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      // gridTemplateColumns: '20% 80%',
      gridTemplateColumns: '20.833% 1fr',
      position: 'relative',
      alignItems: 'flex-start',
    },
  })

  const boxStyles = (theme) => ({
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
      ...(showShopBy && { display: 'block' }),
      // '&.open-sidebar-menu': {
      //   display: 'block',
      // }
    },
  })

  const buttonStyles = (theme) => ({
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    padding: '0.313rem 0.938rem',
    marginBottom: '0.625rem',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  })

  return (
    <Container sx={{ padding: '0px !important' }} maxWidth='lg'>
      <CategoryMeta
        params={params}
        title={page?.metaTitle}
        metaDescription={page?.metaDescription}
        metaRobots={page?.metaRobots.toLowerCase().split('_') as MetaRobots[]}
        canonical={page?.url ? `/${page.url}` : undefined}
        {...category}
      />
      <LayoutHeader floatingMd>
        <LayoutTitle size='small' component='span'>
          {category?.name ?? page.title}
        </LayoutTitle>
      </LayoutHeader>
      {!isLanding && (
        <Container maxWidth={false}>
          {isCategory && categories.items && (
            <Breadcrumb
              breadcrumb={categories?.items?.[0]?.breadcrumbs}
              name={categories?.items?.[0]?.name || ''}
              sx={{
                marginTop: '24px',
                display: { xs: 'none', sm: 'block' },
              }}
            />
          )}
          <LayoutTitle
            variant='h1'
            gutterTop={false}
            sx={{
              margin: '1rem 0 2.25rem 0',
              // marginBottom: category?.description && theme.spacings.md,
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
            {category?.name ?? page.title}
          </LayoutTitle>
        </Container>
      )}
      {isCategory && isLanding && (
        <CategoryHeroNav
          {...category}
          asset={pages?.[0]?.asset && <Asset asset={pages[0].asset} loading='eager' />}
          title={<CategoryHeroNavTitle>{category?.name}</CategoryHeroNavTitle>}
        />
      )}
      {isCategory && !isLanding && (
        <>
          <CategoryDescription description={category.description} />
          {/* <CategoryChildren params={params}>{category.children}</CategoryChildren> */}
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
              sx={containerStyles}
            >
              <Box
                sx={boxStyles}
              >
                <IconButton
                  size='small'
                  sx={{
                    alignSelf: 'baseline',
                    display: { xs: 'block', md: 'none' },
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    '& > svg': {
                      fontSize: '1.125rem',
                    },
                  }}
                  onClick={() => setShowShopBy(false)}
                >
                  <Closemenu />
                </IconButton>
                <Filter {...withoutCategory} filterTypes={filterTypes} />
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

                    <Button
                      size='small'
                      sx={buttonStyles}
                      onClick={() => setShowShopBy(true)}
                    >
                      Shop By
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
                <ProductListItems
                  view={view}
                  title={category.name ?? ''}
                  items={products?.items}
                  loadingEager={1}
                  sx={{
                    marginBottom: { xs: '0.875rem', md: '1.875rem', lg: '2.875rem' },
                  }}
                />
                <Pagination
                  totalPages={totalPages}
                  currentPageState={[currentPage, setCurrentPage]}
                  sizeOptions={[12, 24, 36]}
                  routingFn={routingFn}
                  pageNumbers={pageNumbers}
                  pageSizeState={[pageSize, setPageSize]}
                />
              </Container>
            </Container>
          </ProductListParamsProvider>
        </>
      )}
      {page && (
        <RowRenderer
          content={page.content}
          renderer={{
            RowProduct: (rowProps) => (
              <RowProduct
                {...rowProps}
                {...products?.items?.[0]}
                items={products?.items?.slice(0, 8)}
              />
            ),
          }}
        />
      )}
    </Container>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: LayoutNavigation,
  sharedKey: () => 'category',
}
CategoryPage.pageOptions = pageOptions

export default CategoryPage

export const getStaticPaths: GetPageStaticPaths = async ({ locales = [] }) => {
  // Disable getStaticPaths while in development mode
  if (process.env.NODE_ENV === 'development') return { paths: [], fallback: 'blocking' }

  const path = (loc: string) => getCategoryStaticPaths(graphqlSsrClient(loc), loc)
  const paths = (await Promise.all(locales.map(path))).flat(1)
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetPageStaticProps = async ({ params, locale }) => {
  const [url, query] = extractUrlQuery(params)
  if (!url || !query) return { notFound: true }

  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })
  const filterTypes = getFilterTypes(client)
  const staticClient = graphqlSsrClient(locale)
  const categoryPage = staticClient.query({
    query: CategoryPageDocument,
    variables: { url },
  })
  
  const layout = staticClient.query({ query: LayoutDocument })
  const productListParams = parseParams(url, query, await filterTypes)
  const filteredCategoryUid = productListParams && productListParams.filters.category_uid?.in?.[0]
  let categoryUid = filteredCategoryUid
  if (!categoryUid) {
    categoryUid = (await categoryPage).data.categories?.items?.[0]?.uid ?? ''
    if (productListParams) productListParams.filters.category_uid = { in: [categoryUid] }
  }

  const hasPage = filteredCategoryUid ? false : (await categoryPage).data.pages.length > 0
  const hasCategory = Boolean(productListParams && categoryUid)

  if (!productListParams || !(hasPage || hasCategory))
    return redirectOrNotFound(staticClient, params, locale)
  if (!hasCategory) {
    return {
      props: {
        ...(await categoryPage).data,
        ...(await layout).data,
        apolloState: await conf.then(() => client.cache.extract()),
      },
      revalidate: 60 * 20,
    }
  }

  const filters = staticClient.query({
    query: ProductFiltersDocument,
    variables: { filters: { category_uid: { eq: categoryUid } } },
  })

  const products = staticClient.query({
    query: ProductListDocument,
    variables: {
      ...productListParams,
      filters: { ...productListParams.filters, category_uid: { eq: categoryUid } },
    },
  })

  // assertAllowedParams(await params, (await products).data)
  if (!(await products).data) return redirectOrNotFound(client, params, locale)

  const { category_name, category_url_path } =
    (await categoryPage).data.categories?.items?.[0]?.breadcrumbs?.[0] ?? {}

  const up =
    category_url_path && category_name
      ? { href: `/${category_url_path}`, title: category_name }
      : { href: `/`, title: 'Home' }
  const result = {
    props: {
      ...(await categoryPage).data,
      ...(await products).data,
      ...(await filters).data,
      ...(await layout).data,
      filterTypes: await filterTypes,
      params: productListParams,
      apolloState: await conf.then(() => client.cache.extract()),
      up,
    },
    revalidate: 60 * 20,
  }
  flushMeasurePerf()
  return result
}
