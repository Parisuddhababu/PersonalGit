import { AddProductsToCartFabProps, useAddProductsToCartAction } from "@graphcommerce/magento-product"
import {
  Fab as FabBase,
} from '@mui/material'
import { Trans } from '@lingui/react'

export const AddToCartButton = (props: AddProductsToCartFabProps) => {
  const action = useAddProductsToCartAction(props)

  const {
    disabled,
    loading,
    ...fabProps
  } = action

  return (
    <FabBase
      type='submit'
      color='info'
      size={'medium'}
      variant="extended"
      {...fabProps}
      disabled={loading}
      sx={[{ 
        display: 'grid',
        width: 'auto',
        boxShadow: 'none',
        border: '1px solid',
        backgroundColor: '#1979c3',
        color: '#ffffff',
        borderRadius: '0',
        fontSize: '1rem',
        fontWeight: '500',
        marginTop: '0.2rem',
        '&:hover': {
          backgroundColor: '#1979c3',
          color: '#ffffff',
        } 
      }, ]}
    >
      <Trans id="Add to Cart" />
    </FabBase>
  )
}

export default AddToCartButton