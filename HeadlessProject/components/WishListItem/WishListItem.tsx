/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Image, ImageProps } from '@graphcommerce/image'
import { ProductListItemFragment, useProductLink } from '@graphcommerce/magento-product'
import { ProductListPrice } from '@graphcommerce/magento-product/components/ProductListPrice/ProductListPrice'
import { ProductReviewSummary } from '@graphcommerce/magento-review'
import { responsiveVal, extendableComponent, breakpointVal, IconSvg } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import {
  ButtonBase,
  Typography,
  Box,
  styled,
  SxProps,
  Theme,
  Link,
  TextareaAutosize,
  TextField,
  InputLabel,
  IconButton,
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { useRemoveFromWishlist, useAddToCartFromWishlist } from '../../graphql/hooks/index'
import { AddToCartBtn } from '../AddToCartBtn'
import { DeleteIcon, PenIcon } from '../Icons'
import { UIContext } from '../common/contexts/UIContext'
import { TrashIcon } from '@components/Icons'

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
}

const StyledImage = styled(Image)({})

function WishListItem(props) {
  const {
    topRight,
    bottomLeft,
    bottomRight,
    imageOnly = false,
    loading,
    product,
    id,
    wishListData,
    handleUpdate,
    index,
    linkProps,
    cartData,
    aspectRatio = [4, 3],
    titleComponent = 'h2',
    sx = [],
  } = props

  const { small_image, name, price_range, sku } = product
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const productLink = useProductLink(linkProps)
  const { addToCartFromWishlist } = useAddToCartFromWishlist()
  const { removeFromWishlist } = useRemoveFromWishlist()
  const [, setState] = useContext(UIContext)
  const [description, setDescription] = useState(wishListData?.items?.[index]?.description)
  const [quantity, setQuantity] = useState<number | ''>(wishListData?.items?.[index]?.qty)

  const handleRemoveFromCart = async (arg) => {
    await removeFromWishlist(parseInt(wishListData?.id, 10), [parseInt(id, 10)])
    if (arg === 'removeAlert') {
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
  }
  const handleAddToCart = async () => {
    if (linkProps?.__typename !== 'SimpleProduct') {
      await router.push(productLink)
      return
    }
    await addToCartFromWishlist(cartData?.data?.customerCart?.id, [{ sku, quantity }], '', name)
    await handleRemoveFromCart('')
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target
    value = value.replace(/[^0-9]/g, '')
    const sanitizedValue: number | '' = value ? Math.max(Number(value), 1) : ''
    setQuantity(sanitizedValue)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  useEffect(() => {
    handleUpdate(id, quantity, description)
  }, [quantity, description, handleUpdate])

  const [isHovered, setIsHovered] = useState(false)

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={[
        (theme) => ({
          display: 'block',
          padding: '0px 5px !important',
          position: 'relative',
          border: '1px solid transparent',
          height: '100%',
          ...breakpointVal(
            'borderRadius',
            theme.shape.borderRadius * 2,
            theme.shape.borderRadius * 3,
            theme.breakpoints.values,
          ),
          [theme.breakpoints.up('md')]: {
            ...(isHovered && {
              boxSizing: 'border-box !important',
              background: '#ffffff',
              boxShadow: '3px 4px 4px 0 rgba(0,0,0,0.3)',
              borderColor: '#bbbbbb',
              borderRadius: '0px !important',
              position: 'relative',
            }),
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      className={classes.root}
    >
      <Box
        sx={(theme) => ({
          display: { xs: 'flex', md: 'grid' },
          padding: '0px 0px important',
          bgcolor: 'background.image',
          ...breakpointVal(
            'borderRadius',
            theme.shape.borderRadius * 2,
            theme.shape.borderRadius * 3,
            theme.breakpoints.values,
          ),
          overflow: 'hidden',
          '& > picture': {
            gridArea: `1 / 1 / 3 / 3`,
            margin: `calc(${responsiveVal(8, 12)} * -1)`,
          },
        })}
        className={classes.imageContainer}
      >
        <ButtonBase href={productLink}>
          {small_image ? (
            <StyledImage
              layout='fill'
              width={1}
              height={1}
              src={small_image.url ?? ''}
              alt={small_image.label ?? ''}
              className={classes.image}
              loading={loading}
              sx={{ objectFit: 'contain', aspectRatio: `3 / 4` }}
            />
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
        </ButtonBase>
        {!imageOnly && (
          <>
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
          </>
        )}
      </Box>

      {!imageOnly && (
        <Box
          className={classes.titleContainer}
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'baseline',
            marginTop: theme.spacings.xs,
            columnGap: 1,
            gridTemplateAreas: {
              xs: `"title title" "subtitle price"`,
              md: `"title subtitle price"`,
            },
            gridTemplateColumns: { xs: 'unset', md: 'auto auto 1fr' },
            justifyContent: 'space-between',
          })}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              '.MuiButtonBase-root': { padding: '0px 8px 0px 0px' },
            }}
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
            <ProductReviewSummary {...linkProps} />
          </Box>

          <ProductListPrice
            {...price_range.minimum_price}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              fontWeight: '700',
              fontVariationSettings: `'wght' 700`,
            }}
          />
          <Box
            sx={{
              width: '100%',
            }}
          >
            {bottomRight}
          </Box>
        </Box>
      )}
      <Box
        sx={[
          (theme) => ({
            display: 'block',
            backgroundColor: '#ffffff',
            borderRadius: '0px !important',
            margin: '9px 0 0 0',
            [theme.breakpoints.up('md')]: {
              display: 'none',
              border: '1px solid #bbbbbb',
              boxShadow: '3px 4px 4px 0 rgba(0,0,0,0.3)',
              borderTop: 'none',
              left: '0',
              width: 'auto',
              margin: '9px 0 0 -1px',
              padding: '0.75rem 5px 0',
              position: 'absolute',
              top: '97%',
              right: '-1px',
              zIndex: '2',
              ...(isHovered && { display: 'block' }),
            },
          }),
        ]}
      >
        <TextareaAutosize
          style={{
            width: '100%',
            resize: 'none',
            fontSize: '1rem',
            padding: '0.75rem 1rem',
            height: '2.813rem',
          }}
          placeholder='Comment'
          aria-label='textarea'
          minRows={1}
          value={description}
          onChange={handleTextareaChange}
        />

        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
          }}
        >
          <InputLabel htmlFor='product-quantity' sx={{ color: '#000000', marginTop: '0.5rem' }}>
            Qty
          </InputLabel>

          <TextField
            id='product-quantity'
            type='text'
            value={quantity === '' ? '' : quantity?.toString()}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
              min: 1,
              style: {
                padding: '0.372rem 0.75rem',
              },
            }}
            onChange={handleInputChange}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            // alignItems: 'center',
            padding: '0.75rem 0 0.875rem',
            flexWrap: 'wrap',
            gap: '0.35rem',
          }}
        >
          <AddToCartBtn
            sx={{
              color: '#ffffff',
              backgroundColor: '#1979c3',
              border: '1px solid #1979c3',
              '&:hover, &:active': { backgroundColor: '#006bb4' },
            }}
            onClick={handleAddToCart}
          />
          {/* <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.25rem'
            }}
          > */}
          {/* <ButtonBase
              onClick={async () => {
                await router.push(productLink)
              }}
            >
              <IconSvg sx={{ margin: '10px 10px 5px 10px', cursor: 'pointer' }} src={PenIcon} />
            </ButtonBase> */}

          <IconButton
            aria-label='edit'
            size='small'
            onClick={async () => {
              await router.push(productLink)
            }}
          >
            <IconSvg src={PenIcon} />
          </IconButton>

          {/* <ButtonBase onClick={() => handleRemoveFromCart('removeAlert')}>
              <IconSvg sx={{ margin: '10px 10px 5px 5px', cursor: 'pointer' }} src={DeleteIcon} />
            </ButtonBase> */}

          <IconButton
            aria-label='delete'
            size='small'
            onClick={() => handleRemoveFromCart('removeAlert')}
            sx={{
              height: '2.063rem',
              width: '2.063rem',
              boxShadow: 'none',
              '& svg': {
                fontSize: '1.125rem',
                color: '#757575',
                '& path': {
                  fill: '#757575',
                },
              },
            }}
          >
            {/* <IconSvg src={DeleteIcon} /> */}
            <TrashIcon />
          </IconButton>
          {/* </Box> */}
        </Box>
      </Box>
    </Box>
  )
}

WishListItem.selectors = { ...selectors, ...ProductListPrice.selectors }
// eslint-disable-next-line import/no-default-export
export default WishListItem
