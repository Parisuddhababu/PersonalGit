import { productListRenderer } from "@components/ProductListItems"
import { SxProps, Theme, Container, Divider, Typography, Grid  } from "@mui/material"
import {
  filterNonNullableKeys,
  ItemScroller,
  RenderType,
  responsiveVal,
} from '@graphcommerce/next-ui'
import { useQuery } from '@graphcommerce/graphql'
import { CartAddedDocument, CrosssellsDocument, useCartQuery } from "@graphcommerce/magento-cart"
import { AddProductsToCartForm } from '@graphcommerce/magento-product'
import { Trans } from '@lingui/react'
import { useMemo } from "react"

export type CartRelatedProductListProps = {
  productSkus: (string | null | undefined)[] | undefined
  sx?: SxProps<Theme>
}

export const CartRelatedProductList = (props: CartRelatedProductListProps) => {
  const {productSkus} = props;
  const cartAdded = useCartQuery(CartAddedDocument)
  const items = filterNonNullableKeys(cartAdded.data?.cart?.items)

  const lastItem = productSkus && productSkus[productSkus.length - 1]

  const crosssels = useQuery(CrosssellsDocument, {
    variables: { pageSize: 1, filters: { sku: { eq: lastItem } } },
    skip: !lastItem,
    ssr: false,
  })
  
  const crossSellItems = useMemo(
    () =>
      filterNonNullableKeys(
        crosssels.data?.products?.items?.[0]?.crosssell_products ??
          crosssels.previousData?.products?.items?.[0]?.crosssell_products,
      ).filter(
        (item) =>
          items.every((i) => i.product.sku !== item.sku) && item.stock_status === 'IN_STOCK',
      ),
    [crosssels.data?.products?.items, crosssels.previousData?.products?.items, items],
  )

  const showCrossSell = crossSellItems.length > 0

 return (
  <>
    {showCrossSell && (
        <>
          <Container maxWidth={false} sx={{
            padding: '0 !important'
          }}>
            <Divider />
            <Typography
              variant='h6'
              gutterBottom
              sx={(theme) => ({
                display: { xs: 'block' },
                // my: theme.spacings.sm,
                textAlign: 'left',
                fontWeight: 700,
                fontVariationSettings: "'wght' 700",
                lineHeight: '1.125rem !important',
                fontSize: '0.875rem !important',
                marginTop: '2rem',
                marginBottom: '1rem',
              })}
            >
              <Trans id='More Choices:' />
            </Typography>
          </Container>
          <AddProductsToCartForm>
            {/* <ItemScroller
              sx={(theme) => ({
                width: 'auto',
                mb: theme.page.vertical,
              })}
            > */}
            <Grid container spacing={{xs: 1, md:1.5, lg:3}}>
              {crossSellItems.slice(0,5).map((item) => (
                <Grid item xs={6} lg={4}>
                  <RenderType
                    key={item.uid ?? ''}
                    renderer={productListRenderer}
                    {...item}
                    // sizes={responsiveVal(200, 300)}
                  />
                </Grid>
              ))}
            </Grid>
            {/* </ItemScroller> */}
          </AddProductsToCartForm>
        </>
      )}
  </>
 )
}

export default CartRelatedProductList