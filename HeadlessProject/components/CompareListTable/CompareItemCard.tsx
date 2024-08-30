import { Image } from '@graphcommerce/image'
import { useCartIdCreate } from '@graphcommerce/magento-cart'
import { useProductLink } from '@graphcommerce/magento-product'
import { ProductListPrice } from '@graphcommerce/magento-product/components/ProductListPrice/ProductListPrice'
import { ProductListItemProps, ProductReviewSummary } from '@graphcommerce/magento-review'
import { ProductWishlistChip } from '@graphcommerce/magento-wishlist'
import { extendableComponent } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { Box, Link, styled, Typography, useEventCallback } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { useAddToCartFromWishlist } from '../../graphql/hooks'
import { AddToCartBtn } from '../AddToCartBtn'
import { UIContext } from '../common/contexts/UIContext'

const { classes } = extendableComponent('ProductListItem', [
  'root',
  'item',
  'title',
  'titleContainer',
  'subtitle',
  'price',
  'overlayItems',
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
  'imageContainer',
  'placeholder',
  'image',
  'discount',
] as const)

const StyledImage = styled(Image)({})

export const CompareItemCard = (props: { item: ProductListItemProps }) => {
  const { item } = props
  const {
    small_image,
    sku,
    name,
    price_range,
    subTitle,
    titleComponent = 'h2',
    imageOnly = false,
    onClick,
    __typename,
  } = item

  const router = useRouter()
  const cartId = useCartIdCreate()
  const { addToCartFromWishlist, data, loading } = useAddToCartFromWishlist()
  const productLink = useProductLink(item)
  const [, setState] = useContext(UIContext)

  const handleClick = useEventCallback((e: React.MouseEvent<HTMLAnchorElement>) =>
    onClick?.(e, item),
  )

  const handleAddToCart = async () => {
    if (__typename !== 'SimpleProduct') {
      await router.push(productLink)
    }
    await addToCartFromWishlist(await cartId(), { sku, quantity: 1 }, 'singleProduct', name)
    if (data?.addProductsToCart?.user_errors?.length > 0) {
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'error',
            message: `${data?.addProductsToCart?.user_errors?.map((e) => e?.message).join(', ')}`,
            timeout: 5000,
            targetLink: router?.pathname,
          },
        ],
      }))
      return
    }
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
    <Box>
      <Box
        sx={{
          bgcolor: 'background.image',
          overflow: 'hidden',
        }}
      >
        {small_image ? (
          <Link href={productLink} onClick={onClick ? handleClick : undefined}>
            <StyledImage
              width={1}
              height={1}
              src={small_image.url ?? ''}
              alt={small_image.label ?? ''}
              loading='lazy'
              sx={{ objectFit: 'contain', height: '8.75rem', width: '8.75rem' }}
            />
          </Link>
        ) : (
          <Box
            sx={{
              typography: 'caption',
              display: 'flex',
              textAlign: 'center',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'background.default',
              userSelect: 'none',
            }}
          >
            <Trans id='No Image' />
          </Box>
        )}
      </Box>
      {!imageOnly && (
        <Box className='product-card-details'>
          <Box
            className={classes.titleContainer}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'baseline',
              marginTop: '0.375rem',
              columnGap: 1,
              gridTemplateAreas: {
                xs: `"title title" "subtitle price"`,
                md: `"title subtitle price"`,
              },
              gridTemplateColumns: { xs: 'unset', md: 'auto auto 1fr' },
              justifyContent: 'space-between',
              marginBottom: { xs: '0rem', md: '1.05rem' },
            }}
          >
            <Link
              href={productLink}
              sx={{
                color: '#000',
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: '0.2rem',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              <Typography
                component={titleComponent}
                dangerouslySetInnerHTML={{ __html: name }}
                variant='subtitle1'
                sx={{
                  display: 'inline',
                  overflowWrap: 'break-word',
                  maxWidth: '100%',
                  gridArea: 'title',
                  fontWeight: '400',
                  fontVariationSettings: `'wght' 400`,
                  fontSize: '0.875rem !important',
                  marginTop: '0.375rem',
                }}
                className={classes.title}
              />
            </Link>

            <Box sx={{ gridArea: 'subtitle' }} className={classes.subtitle}>
              {subTitle}
            </Box>

            <Box
              sx={{
                marginBottom: '0.75rem',
                '& > div': {
                  alignItems: 'center',
                },
                '& .ProductReviewSummary-root': {
                  '& .ProductReviewSummary-iconStarDisabled': {
                    fill: '#e0e0e0',
                    fontSize: { xs: '1rem', md: '1.25rem' },
                  },
                  '& .ProductReviewSummary-iconStar': {
                    fill: '#ff5501',
                    fontSize: { xs: '1rem', md: '1.25rem' },
                  },
                },
                '& .MuiTypography-root': {
                  fontSize: '0.75rem',
                  lineHeight: '1rem',
                  cursor: 'pointer',
                  marginLeft: '0.25rem',
                },
              }}
            >
              <ProductReviewSummary {...item} />
            </Box>

            <ProductListPrice
              {...price_range?.minimum_price}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                fontWeight: '700',
                fontVariationSettings: `'wght' 700`,
                marginBottom: '1.25rem',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
              }}
            >
              <AddToCartBtn
                disabled={loading}
                onClick={handleAddToCart}
                title={loading ? 'Adding...' : 'Add to Cart'}
              />
              <Box
                sx={{
                  marginLeft: '0.5rem',
                  '& .MuiIconButton-sizeSmall': {
                    padding: '0.438rem',
                    '& .IconSvg-root': {
                      fontSize: '1.25rem',
                    },
                  },
                }}
              >
                <ProductWishlistChip {...item} />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
