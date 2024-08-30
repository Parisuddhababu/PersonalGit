import { useCartIdCreate } from '@graphcommerce/magento-cart'
import {
  ProductListItem,
  ProductListItemRenderer,
  useProductLink,
} from '@graphcommerce/magento-product'
import { ProductReviewSummary } from '@graphcommerce/magento-review'
import { ProductWishlistChip } from '@graphcommerce/magento-wishlist'
import { Box, IconButton, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { useAddToCartFromWishlist, useAddToCompareList } from '../../graphql/hooks'
import { AddToCartBtn } from '../AddToCartBtn'
import { ConfigurableProduct } from '../ConfigurableProduct'
import { CompareIcon } from '../Icons'
import { ProductListItemCard } from '../ProductListItemCard'
import FullPageOverlaySpinner from '@components/common/FullPageOverlaySpinner'

export const productListRenderer: ProductListItemRenderer = {
  SimpleProduct: (props) => {
    const { sku, name, id } = props
    const router = useRouter()
    const cartId = useCartIdCreate()
    const { addToCartFromWishlist, loading } = useAddToCartFromWishlist()
    const { addToCompareList, loading: compareLoading } = useAddToCompareList()

    const handleAddToCart = async () => {
      await addToCartFromWishlist(await cartId(), { sku, quantity: 1 }, 'singleProduct', name)
    }
    const handleAddToCompareList = async () => {
      await addToCompareList([String(id)], String(name), router?.pathname)
    }
    return (
      <ProductListItemCard
        {...props}
        aspectRatio={[1, 1]}
        bottomRight={
          // <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Stack
            className='product-card-footer'
            spacing={1}
            direction='row'
            flexWrap='wrap'
            sx={(theme) => ({
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: '0.63rem',
              background: '#ffffff',
              left: '0',
              margin: '0.313rem 0 0 -0.063rem',
              padding: '0.6rem 0rem 0.125rem',
              [theme.breakpoints.up('md')]: {
                padding: '0.6rem 0.313rem 1.25rem',
                border: '1px solid #bbbbbb',
                borderTop: 'none',
                boxShadow: '3px 4px 4px 0 rgba(0,0,0,0.3)',
                display: 'none',
                position: 'absolute',
                right: '-1px',
                zIndex: '2',
              },
            })}
          >
            {compareLoading && <FullPageOverlaySpinner />}
            <AddToCartBtn
              disabled={loading}
              onClick={handleAddToCart}
              title={loading ? 'Adding...' : 'Add to Cart'}
            />
            <Box
              sx={{
                // display: 'flex',
                // flexDirection: 'column'
                '& .MuiIconButton-sizeSmall': {
                  padding: '0.438rem',
                  '& .IconSvg-root': {
                    fontSize: '1.25rem',
                  },
                },
              }}
            >
              <ProductWishlistChip {...props} />
            </Box>
            <IconButton
              onClick={handleAddToCompareList}
              size='small'
              sx={{
                alignSelf: 'baseline',
                padding: '0.313rem',
                '& > svg': {
                  fontSize: '1.5rem',
                },
              }}
            >
              <CompareIcon />
            </IconButton>
          </Stack>
        }
      />
    )
  },
  ConfigurableProduct: (props) => (
    <ConfigurableProduct
      {...props}
      aspectRatio={[1, 1]}
      swatchLocations={{
        topLeft: [],
        topRight: [],
        bottomLeft: [],
        bottomRight: [],
      }}
    />
  ),
  BundleProduct: (props) => {
    const { name, id } = props
    const { addToCompareList, loading } = useAddToCompareList()
    const productLink = useProductLink(props)
    const router = useRouter()
    const handleAddToCompareList = async () => {
      await addToCompareList([String(id)], String(name), router?.pathname)
    }
    return (
      <ProductListItemCard
        {...props}
        aspectRatio={[1, 1]}
        bottomRight={
          <Stack
            className='product-card-footer'
            spacing={1}
            direction='row'
            flexWrap='wrap'
            sx={(theme) => ({
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: '0.63rem',
              background: '#ffffff',
              left: '0',
              margin: '0.313rem 0 0 -0.063rem',
              padding: '0.6rem 0rem 0.125rem',
              [theme.breakpoints.up('md')]: {
                padding: '0.6rem 0.313rem 1.25rem',
                border: '1px solid #bbbbbb',
                borderTop: 'none',
                boxShadow: '3px 4px 4px 0 rgba(0,0,0,0.3)',
                display: 'none',
                position: 'absolute',
                right: '-1px',
                zIndex: '2',
              },
            })}
          >
            {loading && <FullPageOverlaySpinner />}
            <AddToCartBtn
              onClick={() =>
                router
                  .push(productLink)
                  .then(() => {})
                  .catch(() => {})
              }
            />

            <Box
              sx={{
                '& .MuiIconButton-sizeSmall': {
                  padding: '0.438rem',
                  '& .IconSvg-root': {
                    fontSize: '1.25rem',
                  },
                },
              }}
            >
              <ProductWishlistChip {...props} />
            </Box>
            <IconButton
              onClick={handleAddToCompareList}
              size='small'
              sx={{
                alignSelf: 'baseline',
                padding: '0.313rem',
                '& > svg': {
                  fontSize: '1.5rem',
                },
              }}
            >
              <CompareIcon />
            </IconButton>
          </Stack>
        }
      />
    )
  },
  VirtualProduct: (props) => {
    const { name, id } = props
    const { addToCompareList, loading } = useAddToCompareList()
    const productLink = useProductLink(props)
    const router = useRouter()
    const handleAddToCompareList = async () => {
      await addToCompareList([String(id)], String(name), router?.pathname)
    }
    return (
      <ProductListItemCard
        {...props}
        aspectRatio={[1, 1]}
        bottomLeft={<ProductReviewSummary {...props} />}
        bottomRight={
          <Stack
            className='product-card-footer'
            spacing={1}
            direction='row'
            flexWrap='wrap'
            sx={(theme) => ({
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: '0.63rem',
              background: '#ffffff',
              left: '0',
              margin: '0.313rem 0 0 -0.063rem',
              padding: '0.6rem 0rem 0.125rem',
              [theme.breakpoints.up('md')]: {
                padding: '0.6rem 0.313rem 1.25rem',
                border: '1px solid #bbbbbb',
                borderTop: 'none',
                boxShadow: '3px 4px 4px 0 rgba(0,0,0,0.3)',
                display: 'none',
                position: 'absolute',
                right: '-1px',
                zIndex: '2',
              },
            })}
          >
            {loading && <FullPageOverlaySpinner />}
            <AddToCartBtn
              onClick={() =>
                router
                  .push(productLink)
                  .then(() => {})
                  .catch(() => {})
              }
            />
            <Box
              sx={{
                '& .MuiIconButton-sizeSmall': {
                  padding: '0.438rem',
                  '& .IconSvg-root': {
                    fontSize: '1.25rem',
                  },
                },
              }}
            >
              <ProductWishlistChip {...props} />
            </Box>
            <IconButton
              onClick={handleAddToCompareList}
              size='small'
              sx={{
                alignSelf: 'baseline',
                padding: '0.313rem',
                '& > svg': {
                  fontSize: '1.5rem',
                },
              }}
            >
              <CompareIcon />
            </IconButton>
          </Stack>
        }
      />
    )
  },
  DownloadableProduct: (props) => {
    const { name, id } = props
    const { addToCompareList } = useAddToCompareList()
    const productLink = useProductLink(props)
    const router = useRouter()
    const handleAddToCompareList = async () => {
      await addToCompareList([String(id)], String(name), router?.pathname)
    }
    return (
      <ProductListItemCard
        {...props}
        aspectRatio={[1, 1]}
        bottomRight={
          <Stack
            className='product-card-footer'
            spacing={1}
            direction='row'
            flexWrap='wrap'
            sx={(theme) => ({
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: '0.63rem',
              background: '#ffffff',
              left: '0',
              margin: '0.313rem 0 0 -0.063rem',
              padding: '0.6rem 0rem 0.125rem',
              [theme.breakpoints.up('md')]: {
                padding: '0.6rem 0.313rem 1.25rem',
                border: '1px solid #bbbbbb',
                borderTop: 'none',
                boxShadow: '3px 4px 4px 0 rgba(0,0,0,0.3)',
                display: 'none',
                position: 'absolute',
                right: '-1px',
                zIndex: '2',
              },
            })}
          >
            <AddToCartBtn
              onClick={() =>
                router
                  .push(productLink)
                  .then(() => {})
                  .catch(() => {})
              }
            />
            <Box
              sx={{
                '& .MuiIconButton-sizeSmall': {
                  padding: '0.438rem',
                  '& .IconSvg-root': {
                    fontSize: '1.25rem',
                  },
                },
              }}
            >
              <ProductWishlistChip {...props} />
            </Box>
            <IconButton
              onClick={handleAddToCompareList}
              size='small'
              sx={{
                alignSelf: 'baseline',
                padding: '0.313rem',
                '& > svg': {
                  fontSize: '1.5rem',
                },
              }}
            >
              <CompareIcon />
            </IconButton>
          </Stack>
        }
      />
    )
  },

  GroupedProduct: (props) => {
    const { name, id } = props
    const { addToCompareList, loading } = useAddToCompareList()
    const router = useRouter()
    const productLink = useProductLink(props)
    const handleAddToCompareList = async () => {
      await addToCompareList([String(id)], String(name), router?.pathname)
    }
    return (
      <ProductListItemCard
        {...props}
        aspectRatio={[1, 1]}
        bottomRight={
          <Stack
            className='product-card-footer'
            spacing={1}
            direction='row'
            flexWrap='wrap'
            sx={(theme) => ({
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: '0.63rem',
              background: '#ffffff',
              left: '0',
              margin: '0.313rem 0 0 -0.063rem',
              padding: '0.6rem 0rem 0.125rem',
              [theme.breakpoints.up('md')]: {
                padding: '0.6rem 0.313rem 1.25rem',
                border: '1px solid #bbbbbb',
                borderTop: 'none',
                boxShadow: '3px 4px 4px 0 rgba(0,0,0,0.3)',
                display: 'none',
                position: 'absolute',
                right: '-1px',
                zIndex: '2',
              },
            })}
          >
            {loading && <FullPageOverlaySpinner />}
            <AddToCartBtn
              onClick={() =>
                router
                  .push(productLink)
                  .then(() => {})
                  .catch(() => {})
              }
            />
            <Box
              sx={{
                // display: 'flex',
                // flexDirection: 'column'
                '& .MuiIconButton-sizeSmall': {
                  padding: '0.438rem',
                  '& .IconSvg-root': {
                    fontSize: '1.25rem',
                  },
                },
              }}
            >
              <ProductWishlistChip {...props} />
            </Box>
            <IconButton
              onClick={handleAddToCompareList}
              size='small'
              sx={{
                alignSelf: 'baseline',
                padding: '0.313rem',
                '& > svg': {
                  fontSize: '1.5rem',
                },
              }}
            >
              <CompareIcon />
            </IconButton>
          </Stack>
        }
      />
    )
  },
  // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // // @ts-ignore GiftCardProduct is only available in Commerce
  GiftCardProduct: (props) => <ProductListItem {...props} aspectRatio={[1, 1]} />,
}
