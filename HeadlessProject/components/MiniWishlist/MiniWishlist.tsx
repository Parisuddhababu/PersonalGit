/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useQuery } from '@graphcommerce/graphql'
import { Image } from '@graphcommerce/image'
import { useCartIdCreate } from '@graphcommerce/magento-cart'
import { ProductLinkFragment, useProductLink } from '@graphcommerce/magento-product'
import { ProductListPrice } from '@graphcommerce/magento-product/components/ProductListPrice/ProductListPrice'
import { useWishlistItems } from '@graphcommerce/magento-wishlist'
import { Trans } from '@lingui/react'
import { Box, styled, Button, Typography, ButtonBase, IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { useAddToCartFromWishlist, useRemoveFromWishlist } from '../../graphql/hooks'
import { WISHLIST_ITEM_DATA } from '../../graphql/my-account'
import { UIContext } from '../common/contexts/UIContext'
import { Closemenu } from '../Icons'

type ProductLinkProps = Omit<ProductLinkFragment, 'uid'>

const MiniWishlist = () => {
  const wishlistItemsData = useWishlistItems()
  const itemData = useQuery(WISHLIST_ITEM_DATA)
  const cartId = useCartIdCreate()
  const wishlistData = itemData?.data?.customer?.wishlists?.[0]
  const { removeFromWishlist } = useRemoveFromWishlist()
  const { addToCartFromWishlist } = useAddToCartFromWishlist()
  const StyledImage = styled(Image)({})
  const productLink = (link: ProductLinkProps) => {
    if (link) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useProductLink(link)
    }
    return null
  }
  const router = useRouter()
  const [, setState] = useContext(UIContext)

  const handleRemoveFromCart = async (id: string, name: string) => {
    await removeFromWishlist(parseInt(wishlistData?.id, 10), [parseInt(id, 10)])
    setState((prev) => ({
      ...prev,
      alerts: [
        {
          type: 'success',
          message: `${name} has been removed from your Wish List.`,
          timeout: 5000,
          targetLink: router?.pathname,
        },
      ],
    }))
  }
  const handleAddToCart = async (
    name: string,
    sku: string,
    type: string,
    link: ProductLinkProps,
    id: string,
    index: number,
  ) => {
    if (type !== 'SimpleWishlistItem') {
      await router.push(productLink(link) ?? '')
      return
    }
    await addToCartFromWishlist(
      await cartId(),
      [{ sku, quantity: wishlistData?.items?.[index]?.qty }],
      '',
      name,
    )
    await removeFromWishlist(parseInt(wishlistData?.id, 10), [parseInt(id, 10)])
    setState((prev) => ({
      ...prev,
      alerts: [
        {
          type: 'success',
          message: `<span>You added ${name} to your <a href='/cart'>shopping cart.</a></span>`,
          timeout: 5000,
          targetLink: router?.pathname,
        },
      ],
    }))
  }

  return (
    <Box sx={{ marginTop: '40px' }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '1rem' }}
      >
        <Typography
          sx={{
            fontSize: '1.125rem !important',
            fontWeight: '300 !important',
            marginRight: '0.5rem',
          }}
        >
          My Wish Lists
        </Typography>
        <Typography
          variant='subtitle2'
          component='span'
          sx={{
            fontSize: '0.75rem !important',
          }}
        >
          {wishlistItemsData?.data && wishlistItemsData?.data?.length > 0 && (
            <Trans
              id={`(${wishlistItemsData?.data?.length} item${
                wishlistItemsData?.data?.length > 1 ? 's' : ''
              })`}
            />
          )}
        </Typography>
      </Box>
      {wishlistItemsData?.data && wishlistItemsData?.data?.length > 0 ? (
        <>
          {wishlistItemsData?.data?.slice(0, 3)?.map((item, index) => (
            <Box sx={{ marginBottom: '1.125rem' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: '0',
                }}
              >
                <ButtonBase href={productLink(item?.product) ?? ''}>
                  {item?.product?.small_image && (
                    <StyledImage
                      layout='fill'
                      width={1}
                      height={1}
                      src={item?.product?.small_image?.url ?? ''}
                      alt={item?.product?.small_image?.label ?? ''}
                      loading='lazy'
                      sx={{ objectFit: 'contain', height: '2.813rem', width: '2.344rem' }}
                    />
                  )}
                </ButtonBase>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '3rem',
                    alignItems: 'flex-start',
                    width: '100%',
                  }}
                >
                  <Typography
                    dangerouslySetInnerHTML={{ __html: item?.product?.name }}
                    variant='subtitle2'
                    component='span'
                    onClick={() => router.push(productLink(item?.product) ?? '')}
                    sx={{
                      fontSize: '0.875rem !important',
                      lineHeight: '19px',
                      fontWeight: '400',
                      fontVariationSettings: `'wght' 400`,
                      marginBottom: '0.5rem',
                      '&:hover': { textDecoration: 'underline', cursor: 'pointer' },
                    }}
                  />
                  <ProductListPrice
                    {...item?.product?.price_range?.minimum_price}
                    sx={{
                      fontWeight: '700',
                      marginBottom: '0.5rem',
                    }}
                  />
                  <Button
                    disableRipple
                    onClick={async (e) => {
                      e.preventDefault()
                      await handleAddToCart(
                        item?.product?.name,
                        item?.product?.sku,
                        item?.__typename,
                        item?.product,
                        item?.id,
                        index,
                      )
                    }}
                    sx={{
                      color: '#ffffff',
                      backgroundColor: '#1979c3',
                      border: '1px solid #1979c3',
                      '&:hover, &:active': { backgroundColor: '#006bb4' },
                    }}
                    variant='contained'
                    size='medium'
                    color='secondary'
                  >
                    <Trans id='Add to Cart' />
                  </Button>
                </Box>
                {/* <CloseIcon
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleRemoveFromCart(item?.id, item?.product?.name)}
                  /> */}
                <IconButton
                  size='small'
                  sx={{
                    alignSelf: 'baseline',
                    '& > svg': {
                      fontSize: '15px',
                    },
                  }}
                  onClick={() => handleRemoveFromCart(item?.id, item?.product?.name)}
                >
                  <Closemenu />
                </IconButton>
              </Box>
            </Box>
          ))}
          <Button
            disableRipple
            sx={{
              color: '#006bb4',
              justifyContent: 'flex-start',
              paddingLeft: '0px',
              paddingRight: '1rem',
              fontWeight: '400',
              '&:hover': {
                textDecoration: 'underline',
                backgroundColor: 'transparent',
              },
              '&:active': {
                color: 'red',
                textDecoration: 'underline',
                backgroundColor: 'transparent',
              },
            }}
            onClick={() => router.push('/account/wishlist')}
          >
            Go to Wish List
          </Button>
        </>
      ) : (
        <Trans id='You have no items in your wish list.' />
      )}
    </Box>
  )
}
// eslint-disable-next-line import/no-default-export
export default MiniWishlist
