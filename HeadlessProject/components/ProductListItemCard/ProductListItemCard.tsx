import { Image, ImageProps } from '@graphcommerce/image'
import { ProductListItemFragment, useProductLink } from '@graphcommerce/magento-product'
import { ProductListPrice } from '@graphcommerce/magento-product/components/ProductListPrice/ProductListPrice'
import { ProductReviewSummary } from '@graphcommerce/magento-review'
import { Money } from '@graphcommerce/magento-store'
import { responsiveVal, extendableComponent, breakpointVal } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { Typography, Box, styled, SxProps, Theme, useEventCallback, Link } from '@mui/material'
import Head from "next/head";

const { classes, selectors } = extendableComponent('ProductListItem', [
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

export type OverlayAreaKeys = 'topLeft' | 'bottomLeft' | 'topRight' | 'bottomRight'

export type OverlayAreas = Partial<Record<OverlayAreaKeys, React.ReactNode>>

type StyleProps = {
  aspectRatio?: [number, number]
  imageOnly?: boolean
}

type BaseProps = { subTitle?: React.ReactNode; children?: React.ReactNode } & StyleProps &
  OverlayAreas &
  ProductListItemFragment &
  Pick<ImageProps, 'loading' | 'sizes' | 'dontReportWronglySizedImages'>

export type ProductListItemProps = BaseProps & {
  sx?: SxProps<Theme>
  titleComponent?: React.ElementType
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>, item: ProductListItemFragment) => void
} & {
  selectedOptions?: {
    selectedColor: null | string
    selectedSize: null | string
  } | null
}

const StyledImage = styled(Image)({})

export function ProductListItemCard(props: ProductListItemProps) {
  const {
    subTitle,
    topRight,
    bottomLeft,
    bottomRight,
    small_image,
    name,
    price_range,
    children,
    imageOnly = false,
    loading,
    selectedOptions,
    sizes,
    dontReportWronglySizedImages,
    aspectRatio = [4, 3],
    titleComponent = 'h2',
    sx = [],
    onClick,
  } = props

  const handleClick = useEventCallback((e: React.MouseEvent<HTMLAnchorElement>) =>
    onClick?.(e, props),
  )

  const productLink = useProductLink(props)

  return (
    <Box>
      <Head>
        {small_image?.url && <link href={small_image.url} rel="preload" as="image"/>}
      </Head>
      <Box
        className={classes.root}
        sx={[
          (theme) => ({
            cursor: 'default',
            display: 'block',
            position: 'relative',
            height: 'auto',
            ...breakpointVal(
              'borderRadius',
              theme.shape.borderRadius * 2,
              theme.shape.borderRadius * 3,
              theme.breakpoints.values,
            ),
            '.ProductListItem-imageContainer': {
              padding: '0px 0px',
            },
            padding: '0.313rem',
            borderRadius: '0 !important',
            border: '1px solid transparent',
            '&:hover': {
              boxShadow: { xs: 'none', md: '3px 4px 4px 0 rgba(0,0,0,0.3)' },
              borderColor: { xs: 'transparent', md: '#bbbbbb' },
              background: '#ffffff',
              position: 'relative',
              zIndex: '9',
              '& .product-card-footer': {
                display: { md: 'flex' },
              },
            },
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <Box
          sx={(theme) => ({
            display: 'grid',
            bgcolor: 'background.image',
            overflow: 'hidden',
            padding: responsiveVal(8, 12),
            '& > picture': {
              gridArea: `1 / 1 / 3 / 3`,
              margin: `calc(${responsiveVal(8, 12)} * -1)`,
            },
          })}
          className={classes.imageContainer}
        >
          {small_image ? (
            <Link href={productLink} onClick={onClick ? handleClick : undefined}>
              <StyledImage
                layout='fill'
                width={1}
                height={1}
                sizes={sizes}
                dontReportWronglySizedImages={dontReportWronglySizedImages}
                src={small_image.url ?? ''}
                alt={small_image.label ?? ''}
                className={classes.image}
                loading="eager"
                quality={30}
                sx={{ objectFit: 'contain', aspectRatio: `3 / 4` }}
              />
            </Link>
          ) : (
            <Box
              sx={{
                gridArea: `1 / 1 / 3 / 3`,
                typography: 'caption',
                display: 'flex',
                textAlign: 'center',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'background.default',
                userSelect: 'none',
              }}
              className={`${classes.placeholder} ${classes.image}`}
            >
              <Trans id='No Image' />
            </Box>
          )}

          {!imageOnly && (
            <Box className='product-card-details'>
              {/* <Box
                sx={{
                  gridArea: `1 / 1 / 2 / 2`,
                  zIndex: 1,
                }}
                className={classes.topLeft}
              >
                {discount > 0 && (
                  <Box
                    className={classes.discount}
                    sx={{
                      typography: 'caption',
                      bgcolor: 'text.primary',
                      fontWeight: 'fontWeightBold',
                      border: 1,
                      borderColor: 'divider',
                      padding: '0px 6px',
                      color: 'background.default',
                      display: 'inline-block',
                    }}
                  >
                    {formatter.format(discount / -100)}
                  </Box>
                )}
                {topLeft}
              </Box> */}
              <Box
                sx={{
                  justifySelf: 'end',
                  textAlign: 'right',
                  gridArea: `1 / 2 / 2 / 3`,
                  zIndex: 1,
                }}
                className={classes.topLeft}
              >
                {topRight}
              </Box>
              <Box
                sx={{
                  alignSelf: 'flex-end',
                  gridArea: `2 / 1 / 3 / 2`,
                  zIndex: 1,
                }}
                className={classes.bottomLeft}
              >
                {bottomLeft}
              </Box>
              {/* <Box
                sx={{
                  textAlign: 'right',
                  alignSelf: 'flex-end',
                  gridArea: `2 / 2 / 3 / 3`,
                  zIndex: 1,
                  justifySelf: 'end',
                }}
                className={classes.bottomRight}
              >
                {bottomRight}
              </Box> */}
            </Box>
          )}
        </Box>

        {!imageOnly && (
          <Box className='product-card-details'>
            <Box
              className={classes.titleContainer}
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'baseline',
                // marginTop: theme.spacings.xs,
                marginTop: '0.375rem',
                columnGap: 1,
                gridTemplateAreas: {
                  xs: `"title title" "subtitle price"`,
                  md: `"title subtitle price"`,
                },
                gridTemplateColumns: { xs: 'unset', md: 'auto auto 1fr' },
                justifyContent: 'space-between',
                marginBottom: { xs: '0rem', md: '1.05rem' },
              })}
            >
              <Link
                href={productLink}
                sx={{
                  color: '#000000',
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
                    // wordBreak: 'break-all',
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
                <ProductReviewSummary {...props} />
              </Box>
              {selectedOptions?.selectedColor || selectedOptions?.selectedSize ? (
                <Box
                  sx={{
                    fontWeight: '700',
                    fontVariationSettings: `'wght' 700`,
                  }}
                >
                  <Money {...price_range?.minimum_price?.final_price} />
                </Box>
              ) : (
                <ProductListPrice
                  {...price_range?.minimum_price}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    fontWeight: '700',
                    fontVariationSettings: `'wght' 700`,
                  }}
                />
              )}
              <Box
                sx={{
                  width: '100%',
                }}
              >
                {bottomRight}
              </Box>
            </Box>
            {children}
          </Box>
        )}
      </Box>
    </Box>
  )
}

ProductListItemCard.selectors = { ...selectors, ...ProductListPrice.selectors }
