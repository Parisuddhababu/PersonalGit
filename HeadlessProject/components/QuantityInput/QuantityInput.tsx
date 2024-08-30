import { NumberFieldElement, NumberFieldElementProps } from '@graphcommerce/ecommerce-ui'
import { QueryResult } from '@graphcommerce/graphql'
import { CurrencyEnum } from '@graphcommerce/graphql-mesh'
import { AddProductsToCartMutationVariables } from '@graphcommerce/magento-product'
import { useFormAddProductsToCart } from '@graphcommerce/magento-product'
import { EditCartDetailsQuery } from '@graphql/cart/edit-cart-details/EditCartDetails.gql'
import { NumberElement } from './NumberElement'

type AddToCartQuantityProps = Omit<
  NumberFieldElementProps<AddProductsToCartMutationVariables>,
  'error' | 'required' | 'inputProps' | 'helperText' | 'name' | 'control' | 'name'
> & { index?: number }

export function QuantityInput(props) {
  const { index = 0, cartDetails } = props
  const { control } = useFormAddProductsToCart()
  const number = cartDetails?.qty ? Number(cartDetails?.qty) : null

  return (
    <NumberElement
      cartQty={number}
      defaultValue={number ?? 1}
      variant='outlined'
      size='small'
      color='primary'
      {...props}
      required
      inputProps={{ min: 1 }}
      control={control}
      name={`cartItems.${index}.quantity`}
    />
  )
}
