/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable react-hooks/exhaustive-deps */
import { WaitForQueries } from '@graphcommerce/ecommerce-ui'
import { PageOptions } from '@graphcommerce/framer-next-pages'
import { useLazyQuery, useMutation, useQuery } from '@graphcommerce/graphql'
import { useCartIdCreate } from '@graphcommerce/magento-cart'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetWishlistProductsDocument } from '@graphcommerce/magento-wishlist'
import { GetStaticProps, iconHeart, FullPageMessage, Button, IconSvg } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Box, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import { LayoutOverlayProps } from '../../../components'
import { AlertToast } from '../../../components/AlertToast'
import { AccountLayoutNav } from '../../../components/Layout/AccountLayoutNav'
import { LayoutDocument } from '../../../components/Layout/Layout.gql'
import { WishListItem } from '../../../components/WishListItem'
import { UIContext } from '../../../components/common/contexts/UIContext'
import { useRemoveFromWishlist, useAddToCartFromWishlist } from '../../../graphql/hooks/index'
import {
  WISHLIST_ITEM_DATA,
  UPDATE_WISHLIST_PRODUCTS,
  CART_INFO,
} from '../../../graphql/my-account/index'
import { graphqlSharedClient, graphqlSsrClient } from '../../../lib/graphql/graphqlSsrClient'
import { CustomerDocument, useCustomerQuery } from '@graphcommerce/magento-customer'
import { Pagination } from '@components/common/Pagination'

type Props = Record<string, unknown>
type GetPageStaticProps = GetStaticProps<LayoutOverlayProps, Props>

function MyWishList() {
  const customer = useCustomerQuery(CustomerDocument)
  const customerInfo = customer?.data?.customer
  const itemData = useQuery(WISHLIST_ITEM_DATA)
  const router = useRouter()
  const cart = useQuery(CART_INFO)
  const cartId = useCartIdCreate()
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const wlData = useQuery(GetWishlistProductsDocument)
  const totalPages = Math.ceil(
    (wlData?.data?.customer?.wishlists?.[0]?.items_count || 10) / pageSize,
  )
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const wishlistItemsData = wlData?.data?.customer?.wishlists?.[0]?.items_v2?.items
  const itemsToShow = wishlistItemsData?.slice(startIndex, endIndex) ?? []
  const { addToCartFromWishlist } = useAddToCartFromWishlist()
  const { removeFromWishlist } = useRemoveFromWishlist()
  const wishlistData = itemData?.data?.customer?.wishlists?.[0]
  const [updateWishlist] = useMutation(UPDATE_WISHLIST_PRODUCTS, {
    refetchQueries: [{ query: WISHLIST_ITEM_DATA }],
  })
  const [data, setData] = useState<
    Array<{ wishlist_item_id: string; quantity: number; description: string }>
  >([])
  const [state, setState] = useContext(UIContext)
  useEffect(() => {
    if (itemsToShow?.length === 0 && wishlistItemsData && wishlistItemsData?.length > 0) {
      setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
    }
  }, [itemsToShow])

  const handleUpdate = useCallback((id, quantity, description) => {
    setData((prevData) => {
      const itemIndex = prevData.findIndex((item) => item.wishlist_item_id === id)

      if (itemIndex !== -1) {
        const updatedData = [...prevData]
        updatedData[itemIndex] = {
          ...updatedData[itemIndex],
          ...(quantity ? { quantity } : { quantity: 1 }),
          description,
        }
        return updatedData
      }

      const newItem = {
        wishlist_item_id: id,
        quantity,
        description,
      }
      return [...prevData, newItem]
    })
  }, [])

  const handleUpdateWishlist = async () => {
    await updateWishlist({
      variables: {
        wishlistId: wishlistData?.id,
        wishlistItems: data,
      },
    })
    setState((prev) => ({
      ...prev,
      alerts: [
        {
          type: 'success',
          message: 'Wishlist has been updated',
          timeout: 5000,
          targetLink: router?.pathname,
        },
      ],
    }))
  }

  const handleAddAllToCart = async () => {
    const arr: { sku: string; quantity: number }[] = []
    const simpleArr: number[] = []
    const alertArr: object[] = []
    const addedItems: string[] = []
    wishlistItemsData?.map((item, index) => {
      if (item?.__typename === 'SimpleWishlistItem') {
        arr.push({ sku: item?.product?.sku || '', quantity: data?.[index]?.quantity })
        simpleArr.push(parseInt(item?.id, 10))
        addedItems.push(`"${item?.product?.name}"`)
      }
      if (item?.__typename !== 'SimpleWishlistItem') {
        alertArr.push({
          type: 'error',
          message: `You need to choose options for your item for "${item?.product?.name}"`,
          timeout: 7000,
          targetLink: router?.pathname,
        })
      }
      return null
    })
    if (simpleArr?.length > 0) {
      alertArr.push({
        type: 'success',
        message: `<span>${
          simpleArr?.length
        } product(s) have been added to <a href='/cart'>shopping cart</a>, ${addedItems?.join(
          ', ',
        )}</span>`,
        timeout: 7000,
        targetLink: router?.pathname,
      })
      await addToCartFromWishlist(await cartId(), arr, '', '')
      await removeFromWishlist(parseInt(wishlistData?.id, 10), simpleArr)
    }
    setState((prev) => ({ ...prev, alerts: alertArr }))
  }

  const formatTotalCount = () => {
    const total = wlData?.data?.customer?.wishlists?.[0]?.items_count
    if (!total || total === 0 || !wishlistItemsData) {
      return null
    }

    if (total < pageSize) {
      return `${total} Item${total > 1 ? 's' : ''}`
    }

    const start = (currentPage - 1) * pageSize + 1
    const end = Math.min(currentPage * pageSize, total)

    return `Items ${start}-${end} of ${total}`
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0px 0px !important',
        flexBasis: 0,
        flexGrow: 1,
        maxWidth: { xs: '100%', md: 'calc( 100% - 17.25rem )' },
      }}
    >
      {state?.alerts?.length > 0 && <AlertToast alerts={state?.alerts} link={router?.pathname} />}
      <PageMeta title={i18n._(/* i18n */ 'Wishlist')} metaRobots={['noindex']} />
      <WaitForQueries
        waitFor={wlData}
        fallback={
          <Box>
            <FullPageMessage
              title={<Trans id='Loading wishlist' />}
              icon={<IconSvg src={iconHeart} size='xxl' />}
            >
              <Trans id='We are fetching your favorite products, one moment please!' />
            </FullPageMessage>
          </Box>
        }
      >
        <Box>
          {!wishlistItemsData || wishlistItemsData.length === 0 || !customerInfo ? (
            <FullPageMessage
              title={<Trans id='Your wishlist is empty' />}
              icon={<IconSvg src={iconHeart} size='xxl' />}
              button={
                <Button href='/' variant='pill' color='secondary' size='large'>
                  <Trans id='Continue shopping' />
                </Button>
              }
            >
              <Trans id='Discover our collection and add items to your wishlist!' />
            </FullPageMessage>
          ) : null}

          {wishlistItemsData && wishlistItemsData.length > 0 && customerInfo ? (
            <Box sx={{ width: '100%', paddingLeft: { xs: '0', md: '1rem', lg: '1.563rem' } }}>
              <Typography
                variant='h2'
                sx={{
                  fontWeight: '300',
                  fontVariationSettings: `'wght' 300`,
                  paddingBottom: { xs: '1rem', md: '2rem' },
                  marginTop: { xs: '0', md: '-0.25rem' },
                }}
              >
                Wish List
              </Typography>
              <Pagination
                itemsCount={<Trans id={formatTotalCount() ?? ''} />}
                totalPages={totalPages}
                currentPageState={[currentPage, setCurrentPage]}
                sizeOptions={[10, 20, 50]}
                pageNumbers={pageNumbers}
                pageSizeState={[pageSize, setPageSize]}
              />
              <Grid container spacing={2}>
                {itemsToShow?.map((item, index, arr) => (
                  <Grid item key={item?.id} xs={12} sm={6} md={4} lg={3} xl={3}>
                    <WishListItem
                      loading='lazy'
                      {...item}
                      linkProps={item?.product}
                      wishListData={wishlistData}
                      handleUpdate={handleUpdate}
                      cartData={cart}
                      index={index}
                      aspectRatio={[1, 1]}
                    />
                  </Grid>
                ))}
              </Grid>

              <Box
                sx={{
                  marginTop: '1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  gap: '1.25rem',
                }}
              >
                <Button variant='contained' size='medium' onClick={handleUpdateWishlist}>
                  Update Wish List
                </Button>
                <Button
                  disableRipple
                  onClick={handleAddAllToCart}
                  variant='contained'
                  size='medium'
                >
                  Add All to Cart
                </Button>
              </Box>
              <Pagination
                itemsCount={<Trans id={formatTotalCount() ?? ''} />}
                totalPages={totalPages}
                currentPageState={[currentPage, setCurrentPage]}
                sizeOptions={[10, 20, 50]}
                pageNumbers={pageNumbers}
                pageSizeState={[pageSize, setPageSize]}
              />
            </Box>
          ) : null}
        </Box>
      </WaitForQueries>
    </Box>
  )
}

const pageOptions: PageOptions<LayoutOverlayProps> = {
  Layout: AccountLayoutNav,
}
MyWishList.pageOptions = pageOptions

export default MyWishList

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const staticClient = graphqlSsrClient(locale)
  const conf = client.query({ query: StoreConfigDocument })
  const layout = staticClient.query({ query: LayoutDocument })

  return {
    props: {
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
  }
}
