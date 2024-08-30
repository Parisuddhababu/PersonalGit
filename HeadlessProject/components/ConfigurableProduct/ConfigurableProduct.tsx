/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useCartIdCreate } from '@graphcommerce/magento-cart'
import {
  OverlayAreaKeys,
  ProductListItemProps,
  useProductListParamsContext,
  isFilterTypeEqual,
} from '@graphcommerce/magento-product'
import { ProductListItemConfigurableFragment } from '@graphcommerce/magento-product-configurable'
import { SwatchList } from '@graphcommerce/magento-product-configurable/SwatchList'
import { ProductWishlistChip } from '@graphcommerce/magento-wishlist'
import { Box, IconButton, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAddToCartFromWishlist, useAddToCompareList } from '../../graphql/hooks'
import { AddToCartBtn } from '../AddToCartBtn'
import { CompareIcon } from '../Icons'
import { ProductListItemCard } from '../ProductListItemCard'
import { SizeColorOptions } from './SizeColorOptions'
import FullPageOverlaySpinner from '@components/common/FullPageOverlaySpinner'

export type ProductListItemConfigurableActionProps = ProductListItemConfigurableFragment & {
  variant?: NonNullable<ProductListItemConfigurableFragment['variants']>[0]
}

export type ProdustListItemConfigurableProps = ProductListItemConfigurableFragment &
  ProductListItemProps & {
    swatchLocations?: Partial<Record<OverlayAreaKeys, string[]>>
  }

export const ConfigurableProduct = (props: ProdustListItemConfigurableProps) => {
  const {
    variants,
    configurable_options,
    children,
    swatchLocations = { bottomLeft: [], bottomRight: [], topLeft: [], topRight: [] },
    bottomLeft,
    bottomRight,
    topLeft,
    topRight,
    sku,
    id,
    url_key,
    name,
    ...configurableProduct
  } = props
  const { params } = useProductListParamsContext()
  const { addToCartFromWishlist, loading } = useAddToCartFromWishlist()
  const { addToCompareList, loading: compareLoading } = useAddToCompareList()
  const router = useRouter()
  const cartId = useCartIdCreate()
  const [selectedOptions, setSelectedOptions] = useState<{
    selectedColor: null | string
    selectedSize: null | string
  }>({ selectedColor: null, selectedSize: null })
  const [unavailable, setUnavailable] = useState<{
    unavailableColors: (string | null | undefined)[] | undefined
    unavailableSizes: (string | null | undefined)[] | undefined
  }>({ unavailableColors: [], unavailableSizes: [] })

  const options: [string, string[]][] =
    configurable_options
      ?.filter(
        (option) =>
          option?.attribute_code &&
          params.filters[option.attribute_code] &&
          isFilterTypeEqual(params.filters[option.attribute_code]),
      )
      .map((option) => {
        const filter = params.filters[option?.attribute_code ?? '']
        return [option?.attribute_code ?? '', (filter?.in as string[]) ?? []]
      }) ?? []

  const selected = {}

  options.forEach(([attr, values]) => {
    if (!selected[attr]) selected[attr] = values
  })

  const matchingVariants = variants?.filter(
    (variant) =>
      variant?.attributes?.filter((attribute) => selectedOptions?.selectedColor === attribute?.uid)
        .length,
  )
  const colors = configurable_options ? configurable_options[0]?.values : null
  const sizes = configurable_options ? configurable_options[1]?.values : null
  const sizeUids = sizes?.map((item) => item?.uid)
  const colorUids = colors?.map((item) => item?.uid)

  const unpairedFn = (): void => {
    const pairedSizeArr: string[] = []
    const pairedColorArr: string[] = []
    if (variants) {
      for (const variant of variants) {
        const variantColorUid = variant?.attributes?.[0]?.uid
        const variantSizeUid = variant?.attributes?.[1]?.uid

        if (variantColorUid === selectedOptions?.selectedColor) {
          pairedSizeArr.push(variantSizeUid ?? '')
        }
        if (variantSizeUid === selectedOptions?.selectedSize) {
          pairedColorArr.push(variantColorUid ?? '')
        }
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

  useEffect(() => {
    if (!variants || variants?.length === 0) {
      return
    }
    unpairedFn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions])

  const handleAddToCart = async () => {
    if (!selectedOptions?.selectedColor || !selectedOptions?.selectedSize) {
      await router.push(`/p/${url_key}`)
    }
    const selected_options = [selectedOptions?.selectedColor, selectedOptions?.selectedSize]
    await addToCartFromWishlist(
      await cartId(),
      [{ selected_options, sku, quantity: 1 }],
      'singleProduct',
      name,
    )
  }

  const handleAddToCompareList = async () => {
    await addToCompareList([String(id)], String(name), router?.pathname)
  }

  return (
    <ProductListItemCard
      {...configurableProduct}
      selectedOptions={selectedOptions}
      url_key={url_key}
      name={name}
      small_image={matchingVariants?.[0]?.product?.small_image ?? configurableProduct.small_image}
      topLeft={
        <>
          {topLeft}
          <SwatchList
            attributes={swatchLocations.topLeft}
            configurable_options={configurable_options}
          />
        </>
      }
      topRight={
        <>
          {topRight}
          <SwatchList
            attributes={swatchLocations.topRight}
            configurable_options={configurable_options}
          />
        </>
      }
      bottomLeft={
        <>
          {bottomLeft}
          <SwatchList
            attributes={swatchLocations.bottomLeft}
            configurable_options={configurable_options}
          />
        </>
      }
      bottomRight={
        <>
          {bottomRight}
          <SwatchList
            attributes={swatchLocations.bottomRight}
            configurable_options={configurable_options}
          />
        </>
      }
    >
      {children}
      <Box>
        {compareLoading && <FullPageOverlaySpinner />}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <SizeColorOptions
            sizes={sizes}
            colors={colors}
            selected={[selectedOptions, setSelectedOptions]}
            unavailable={unavailable}
          />
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
            disabled={loading}
            onClick={async (e: { preventDefault: () => void }) => {
              e.preventDefault()
              await handleAddToCart()
            }}
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
      </Box>
    </ProductListItemCard>
  )
}
