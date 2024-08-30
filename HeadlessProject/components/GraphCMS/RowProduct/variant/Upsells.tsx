import { AddProductsToCartForm, UpsellProductsFragment } from '@graphcommerce/magento-product'
import {
  SidebarSlider,
  RenderType,
  responsiveVal,
  SidebarSliderProps,
} from '@graphcommerce/next-ui'
import { Typography, Box } from '@mui/material'
import { productListRenderer } from '../../../ProductListItems/productListRenderer'
import { RowProductFragment } from '../RowProduct.gql'

type UpsellsProps = RowProductFragment & UpsellProductsFragment & Pick<SidebarSliderProps, 'sx'>

export function Upsells(props: UpsellsProps) {
  const { upsell_products, sx } = props
  const title = 'We found other products you might like!'
  if (!upsell_products || upsell_products.length === 0) return null

  return (
    <AddProductsToCartForm>
      <Box
        sx={{
          paddingLeft: {xs:'0.938rem', md:'0'},
          '& .SidebarSlider-sidebar': {
            paddingLeft: '0',
            paddingRight: '0',
          },
          '& .SidebarSlider-root': {
            marginBottom: '4rem',
          },
          '& .SidebarSlider-grid': {
            '& .SidebarSlider-scrollerContainer': {
              '& .Scroller-root': {
                gridGap: '0.25rem',
                gridAutoColumns: 'min-content'
              },
              '& .SidebarSlider-centerLeft, & .SidebarSlider-centerRight': {
                '& button': {
                  '& svg': {
                    fontSize: '1.65rem !important'
                  }
                }
              }
            }
          }
        }}
      >
        <SidebarSlider 
          sx={sx} 
          sidebar={
            <Typography 
              variant='body1' 
              component='h6' 
              sx={{
                fontWeight: '700',
                fontVariationSettings: "'wght' 700"
              }}>
              {title}
            </Typography>
          }
        >
          {upsell_products?.map((item) =>
            item ? (
              <Box 
                sx={{ 
                  position: 'relative',
                  width: '15.5rem',
                  '& .ProductListItem-root': {
                    '&:hover': {
                      boxShadow: 'none',
                      borderColor: 'transparent',
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
              </Box>
            ) : null,
          )}
        </SidebarSlider>
      </Box>
    </AddProductsToCartForm>
  )
}
