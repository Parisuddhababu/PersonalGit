/* eslint-disable react/jsx-filename-extension */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable react-hooks/rules-of-hooks */
// import { Image } from '@graphcommerce/image'
import { useCartIdCreate } from '@graphcommerce/magento-cart'
import { AddProductsToCartForm } from '@graphcommerce/magento-product'
import { ProductWishlistChip } from '@graphcommerce/magento-wishlist'
import { StarRatingField } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { Box, Typography, Link, Stack, IconButton } from '@mui/material'
import cn from 'classnames'
// import Link from 'next/link'
import { useRouter } from 'next/router'
import { number, shape, string } from 'prop-types'
import { useContext, useEffect, useState } from 'react'
import { AddToCartBtn } from '../../../../components/AddToCartBtn'
import { SizeColorOptions } from '../../../../components/ConfigurableProduct'
import { ProductPrice } from '../../../../components/common/ProductPrice/ProductPrice'
import { UIContext } from '../../../../components/common/contexts/UIContext'
import { useAddToCartFromWishlist, useAddToCompareList } from '../../../../graphql/hooks'
import { mergeClasses } from '../PageBuilder/classify'
import { makeOptimizedUrl as resourceUrl } from '../PageBuilder/makeUrl'
import defaultClasses from './item.module.scss'
import { CompareIcon } from '@components/Icons'
import FullPageOverlaySpinner from '@components/common/FullPageOverlaySpinner'
// import React from "@types/react";
// import Image from "next/image";
import NextImage from '@components/common/magento-image'
import Head from "next/head";
// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300

// Gallery switches from two columns to three at 640px.
const IMAGE_SIZE_BREAKPOINTS = new Map()
IMAGE_SIZE_BREAKPOINTS.set('small', 640)

const IMAGE_SIZES = new Map()
IMAGE_SIZES.set('small', IMAGE_WIDTH)
IMAGE_SIZES.set('medium', 840)

const ItemPlaceholder = ({ classes }) => (
  <div className={classes.root_pending}>
    <div className={classes.images_pending}>Place Holder Image</div>
    <div className={classes.name_pending} />
    <div className={classes.price_pending} />
  </div>
)

const GalleryItem = (props) => {
  const { item, AddToWishlist, AddToWishlistLabel } = props
  const {
    name,
    id,
    price_range = {},
    small_image,
    url_key,
    rating_summary,
    review_count,
    sku,
    configurable_options,
    variants,
    stock_status,
    classes: classList,
    __typename,
  } = item || {}

  const router = useRouter()
  const { addToCompareList } = useAddToCompareList()
  const { addToCartFromWishlist, loading } = useAddToCartFromWishlist()
  const [, setState] = useContext(UIContext)
  const cartId = useCartIdCreate()
  const classes = mergeClasses(defaultClasses, classList)
  const [selectedOptions, setSelectedOptions] = useState({
    selectedColor: null,
    selectedSize: null,
  })
  const [unavailable, setUnavailable] = useState({ unavailableColors: [], unavailableSizes: [] })

  if (!item) {
    return <ItemPlaceholder classes={classes} />
  }

  const normalizedRating = Math.round(rating_summary / (10 / 5)) / 10

  const productUrlSuffix = ''

  const productLink = resourceUrl(`/${url_key}${productUrlSuffix}`)

  const colors = configurable_options ? configurable_options[0]?.values : null
  const sizes = configurable_options ? configurable_options[1]?.values : null
  const sizeUids = sizes?.map((el) => el?.uid)
  const colorUids = colors?.map((el) => el?.uid)

  const unpairedFn = () => {
    const pairedSizeArr = []
    const pairedColorArr = []
    for (const variant of variants) {
      const variantColorUid = variant?.attributes?.[0]?.uid // First element is always the color UID
      const variantSizeUid = variant?.attributes?.[1]?.uid // Second element is always the size UID

      if (variantColorUid === selectedOptions?.selectedColor) {
        pairedSizeArr.push(variantSizeUid ?? '')
      }
      if (variantSizeUid === selectedOptions?.selectedSize) {
        pairedColorArr.push(variantColorUid ?? '')
      }
    }
    const unpairedSizes = selectedOptions?.selectedColor
      ? sizeUids?.filter((sizeUid) => sizeUid && !pairedSizeArr.includes(sizeUid))
      : []
    const unpairedColors = selectedOptions?.selectedSize
      ? colorUids?.filter((colorUid) => colorUid && !pairedColorArr.includes(colorUid ?? ''))
      : []

    setUnavailable({
      unavailableColors: unpairedColors,
      unavailableSizes: unpairedSizes,
    })
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!variants || variants?.length === 0) {
      return
    }
    unpairedFn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions, variants])

  const matchingVariants = variants?.filter(
    (variant) =>
      variant?.attributes?.filter((attribute) => selectedOptions?.selectedColor === attribute?.uid)
        .length,
  )

  const getFormattedMessage = (nameToast) => {
    const html = String(
      `<span>You added ${nameToast} to your <a href='/cart'>shopping cart.</a></span>`,
    )
    return html
  }

  const handleAddToCart = async () => {
    if (
      __typename === 'ConfigurableProduct' &&
      (!selectedOptions?.selectedColor || !selectedOptions?.selectedSize)
    ) {
      await router.push(`/p/${url_key}`)
    }
    if (__typename !== 'ConfigurableProduct' && __typename !== 'SimpleProduct') {
      await router.push(`/p/${url_key}`)
    }
    const selected_options = [selectedOptions?.selectedColor, selectedOptions?.selectedSize]
    await addToCartFromWishlist(await cartId(), [
      { ...(__typename === 'ConfigurableProduct' && { selected_options }), sku, quantity: 1 },
    ])
    setState((prev) => ({
      ...prev,
      alerts: [
        {
          type: 'success',
          message: getFormattedMessage(name),
          timeout: 5000,
          targetLink: router?.pathname,
        },
      ],
    }))
  }

  const handleAddToCompareList = async () => {
    setState((prev) => ({
      ...prev,
      compareLoading: true,
    }))
    await addToCompareList([String(id)], String(name), router?.pathname)
  }

  return (
      <>
          <Head>
              <link href={matchingVariants?.[0]?.product?.small_image?.url || small_image} rel="preload" as="image" />
          </Head>
          <AddProductsToCartForm>
              <Box
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  className={cn(classes.root, 'product-item')}
                  sx={[
                      () => ({
                          cursor: 'default',
                          display: 'block',
                          position: 'relative',
                          height: 'auto',
                          '.ProductListItem-imageContainer': {
                              padding: '0px 0px',
                          },
                          padding: '0.313rem',
                          borderRadius: '0 !important',
                          border: '1px solid transparent',
                      }),
                  ]}
              >
                  {AddToWishlist && (
                      <div data-role='add-to-links' className='actions-secondary'>
                          <AddToWishlist
                              productId={item.id}
                              qty={1}
                              labelText={<AddToWishlistLabel width={31} height={20} />}
                              isMultiWishlist={false}
                          />
                      </div>
                  )}
                  <Link href={`/p${productLink}`} className={classes.images} aria-label={name}>
                      {/*<Image*/}
                      {/*  layout='fill'*/}
                      {/*  src={matchingVariants?.[0]?.product?.small_image?.url || small_image}*/}
                      {/*  alt={name}*/}
                      {/*  width={1}*/}
                      {/*  loading='eager'*/}
                      {/*  height={1}*/}
                      {/*  sx={{ objectFit: 'contain', aspectRatio: `3 / 4` }}*/}
                      {/*  unoptimized={true}*/}
                      {/*/>*/}
                      {/*  <Image*/}
                      {/*      loading='eager'*/}
                      {/*      src={matchingVariants?.[0]?.product?.small_image?.url || small_image}*/}
                      {/*      // layout="fill"*/}
                      {/*      fill*/}
                      {/*      // sizes="(min-width: 768px) 50vw, (min-width: 1025px) 100vw, 33vw"*/}
                      {/*      // width={640}*/}
                      {/*      // height={360}*/}
                      {/*      // objectFit="contain"*/}
                      {/*      // className={classes.backgroundAsImage}*/}
                      {/*      quality="20"*/}
                      {/*      priority*/}
                      {/*      unoptimized={false}*/}
                      {/*  />*/}
                      <NextImage
                          src={matchingVariants?.[0]?.product?.small_image?.url || small_image}
                          quality="30"
                          fill={true}
                          alt={matchingVariants?.[0]?.product?.small_image?.url || small_image}
                          loading="eager"
                      />
                  </Link>
                  <Box className='product-card-details' sx={{
                      minHeight: '265px'
                  }}>
                      <Box
                          className={classes.titleContainer}
                          sx={() => ({
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
                              href={`/p${productLink}`}
                              sx={{
                                  color: '#000000',
                                  textDecoration: 'none',
                                  display: 'inline-block',
                                  marginBottom: '0.2rem',
                                  '&:hover': { textDecoration: 'underline' },
                              }}
                          >
                              <Typography
                                  component='h2'
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
                              />
                          </Link>

                          <Box
                              sx={{
                                  display: 'flex',
                                  marginBottom: '0.75rem',
                                  '& .MuiRating-root': {
                                      marginRight: '0.5rem',
                                      '& .IconSvg-root': {
                                          fill: '#ff5501',
                                          fontSize: { xs: '1rem', md: '1.25rem' },
                                          margin: '0',
                                      },
                                  },
                              }}
                          >
                              {normalizedRating !== 0 && (
                                  <StarRatingField readOnly size='small' defaultValue={normalizedRating} />
                              )}
                              {review_count !== 0 && (
                                  <Typography
                                      onClick={() =>
                                          router.push({ pathname: `/p${productLink}`, query: { data: 'review' } })
                                      }
                                      sx={{
                                          '&:hover': { textDecoration: 'underline' },
                                          color: '#006bb4',
                                          cursor: 'pointer',
                                      }}
                                  >
                                      {`${review_count} `}
                                      {review_count === 1 ? <Trans id='Review' /> : <Trans id='Reviews' />}
                                  </Typography>
                              )}
                          </Box>

                          <Box
                              sx={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  '& span': {
                                      fontWeight: '700',
                                      fontVariationSettings: `'wght' 700`,
                                  },
                              }}
                          >
                              <ProductPrice priceRange={price_range} />
                          </Box>
                      </Box>

                      <Box
                          sx={{
                              marginBottom: '0.75rem',
                          }}
                      >
                          {__typename === 'ConfigurableProduct' && (
                              <SizeColorOptions
                                  sizes={sizes}
                                  colors={colors}
                                  selected={[selectedOptions, setSelectedOptions]}
                                  unavailable={unavailable}
                              />
                          )}
                      </Box>

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
                              margin: '0',
                              padding: '0 0 0.125rem',
                              [theme.breakpoints.up('md')]: {
                                  padding: '0 0 1.25rem',
                              },
                          })}
                      >
                          {stock_status === 'IN_STOCK' ? (
                              <AddToCartBtn
                                  disabled={loading}
                                  onClick={async (e) => {
                                      e.preventDefault()
                                      await handleAddToCart()
                                  }}
                                  title={loading ? 'Adding...' : 'Add to Cart'}
                              />
                          ) : (
                              <Trans id='Out of stock' />
                          )}

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
                              <ProductWishlistChip {...item} />
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
                  </Box>

                  {/* <h4 className='item-name'>
          <Link dangerouslySetInnerHTML={{ __html: name }} href={`/p${productLink}`} />
        </h4> */}
                  {/* <Box
          sx={{
            display: 'flex',
            marginLeft: '-0.5rem',
            marginBottom: '0.2rem',
            alignItems: 'center',
          }}
        >
          {normalizedRating && (
            <StarRatingField readOnly size='small' defaultValue={normalizedRating ?? 0} />
          )}
          {review_count === 0 ? (
            <Trans id='Be the first one to give a review' />
          ) : (
            <Typography
              onClick={() =>
                router.push({ pathname: `/p${productLink}`, query: { data: 'review' } })
              }
              sx={{
                '&:hover': { textDecoration: 'underline' },
                color: '#006bb4',
                cursor: 'pointer',
              }}
            >
              {`${review_count} `}
              {review_count === 1 ? <Trans id='Review' /> : <Trans id='Reviews' />}
            </Typography>
          )}
        </Box> */}
                  {/* <div className='item-price'>
          <ProductPrice priceRange={price_range} />
          {__typename === 'ConfigurableProduct' && (
            <SizeColorOptions
              sizes={sizes}
              colors={colors}
              selected={[selectedOptions, setSelectedOptions]}
              unavailable={unavailable}
            />
          )}
        </div> */}
                  {/* <AddToCartBtn
          disabled={loading}
          onClick={async (e) => {
            e.preventDefault()
            await handleAddToCart()
          }}
          title={loading ? 'Adding...' : 'Add to Cart'}
        /> */}
              </Box>
          </AddProductsToCartForm>
      </>
  )
}

GalleryItem.propTypes = {
  classes: shape({
    image: string,
    imageContainer: string,
    imagePlaceholder: string,
    image_pending: string,
    images: string,
    images_pending: string,
    name: string,
    name_pending: string,
    price: string,
    price_pending: string,
    root: string,
    root_pending: string,
  }),
  item: shape({
    id: number.isRequired,
    name: string.isRequired,
    small_image: string.isRequired,
    url_key: string.isRequired,
    price_range: shape({
      minimum_price: shape({
        final_price: shape({
          value: number.isRequired,
          currency: string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }),
}

export default GalleryItem
