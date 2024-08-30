import { AddProductsToCartForm, RelatedProductsFragment } from '@graphcommerce/magento-product'
import {
  SidebarSlider,
  RenderType,
  responsiveVal,
  SidebarSliderProps,
  isTypename,
} from '@graphcommerce/next-ui'

import { Trans } from '@lingui/react'
import { Typography, Checkbox, Box, Button, Link } from '@mui/material'
import { useState } from 'react'
import { productListRenderer } from '../../../ProductListItems/productListRenderer'
import { RowProductFragment } from '../RowProduct.gql'

type RelatedProps = RowProductFragment &
  RelatedProductsFragment &
  Pick<SidebarSliderProps, 'sx'> & {
    setSelectedRelatedProducts
    selectedRelatedProducts
  }

export function Related(props: RelatedProps) {
  const { related_products, sx, setSelectedRelatedProducts, selectedRelatedProducts } = props
  const title = 'Related Products'
  const [isChecked, setIsChecked] = useState(false)

  if (!related_products || related_products.length === 0) return null

  const handleCheck = (sku) => {
    setSelectedRelatedProducts((prevSelectedItems: string[]) => {
      const selectedItems = prevSelectedItems || []
      if (selectedItems.includes(sku as string)) {
        return selectedItems.filter((item) => item !== sku)
      }
      return [...selectedItems, sku]
    })
    setIsChecked(false)
  }

  const handleSelectAll = () => {
    if (!isChecked) {
      const allSkus = related_products
        .filter((item) => isTypename(item!, ['SimpleProduct'])) // Filter items based on typename
        .map((item) => item?.sku)
        .filter(Boolean)
      setSelectedRelatedProducts(allSkus)
    } else {
      setSelectedRelatedProducts([])
    }
    setIsChecked(!isChecked)
  }

  return (
    <AddProductsToCartForm>
      <Box sx={{marginBottom: '0.875rem'}}>
        <Typography 
          variant='body1' 
          component='h6' 
          sx={{
            fontWeight: '700',
            fontVariationSettings: "'wght' 700"
          }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{marginBottom: '1.25rem'}}>
        <Trans id='Check items to add to the cart or' />{' '}
        <Link
          onClick={handleSelectAll}
          underline='hover'
          sx={{
            font: 'inherit',
            cursor: 'pointer',
          }}
        >
          {isChecked ? 'unselect All' : 'select All'}
        </Link>
      </Box>
      <Box
        sx={{
          paddingLeft: {xs:'0.938rem', md:'0'},
          '& .SidebarSlider-sidebar': {
            paddingLeft: '0',
            paddingRight: '0',
          },
          '& .SidebarSlider-root': {
            marginBottom: '6.25rem'
          },
          '& .SidebarSlider-grid': {
            '& .SidebarSlider-scrollerContainer': {
              '& .Scroller-root': {
                gridGap: '0.25rem',
                gridAutoColumns: 'min-content',
                paddingRight: '0'
              }
            }
          }
        }}
      >
        <SidebarSlider sx={sx} sidebar={''}>
          {related_products?.map((item) =>
            item ? (
              <Box 
                sx={{ 
                  position: 'relative',
                  width: '15.5rem',
                  '& .ProductListItem-root': {
                    '&:hover': {
                      boxShadow: 'none',
                      borderColor: 'transparent',
                      zIndex: '0',
                    },
                    '& .product-card-footer': {
                      display: 'flex',
                      position: 'relative',
                      right: '0',
                      boxShadow: 'none',
                      border: '0',
                      padding: '0.65rem 0',
                    }
                  }
                }} 
                key={item.uid}>
                <RenderType
                  key={item.uid ?? ''}
                  renderer={productListRenderer}
                  sizes={responsiveVal(200, 400)}
                  titleComponent='h3'
                  {...item}
                />
                {isTypename(item, ['SimpleProduct']) && (
                  <Checkbox
                    checked={isChecked || selectedRelatedProducts?.includes(item!.sku)}
                    sx={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      marginTop: '0',
                      marginLeft: '0',
                      // zIndex: '9'
                    }}
                    onClick={() => handleCheck(item.sku)}
                  />
                )}
              </Box>
            ) : null,
          )}
        </SidebarSlider>
      </Box>
    </AddProductsToCartForm>
  )
}
