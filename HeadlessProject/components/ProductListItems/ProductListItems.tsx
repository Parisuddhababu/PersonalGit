import {
  ProductListItemsBase,
  ProductItemsGridProps,
  AddProductsToCartForm,
} from '@graphcommerce/magento-product'
import { productListRenderer } from './productListRenderer'

export type ProductListItemsProps = Omit<ProductItemsGridProps, 'renderers'>

type GridListType = {
  view?: string
}

export function ProductListItems(props: ProductListItemsProps & GridListType) {
  const { view } = props
  return (
    <AddProductsToCartForm>
      <ProductListItemsBase view={view} renderers={productListRenderer} {...props} />
    </AddProductsToCartForm>
  )
}
