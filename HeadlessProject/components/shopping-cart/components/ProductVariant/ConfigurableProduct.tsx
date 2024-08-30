import { CartItemFragment } from "@graphcommerce/magento-cart-items"
import { ConfigurableCartItemFragment } from "@graphcommerce/magento-product-configurable/ConfigurableCartItem/ConfigurableCartItem.gql"
import { Box, SxProps, Theme } from "@mui/material"

export type ConfigurableProductProps = {
  sx?: SxProps<Theme>
} & ConfigurableCartItemFragment

export const ConfigurableProduct = (props: ConfigurableProductProps) => {
  const {sx, configurable_options} = props
  
  if (configurable_options?.length < 0) {
    return <></>
  }

  return(
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      ...sx
    }}>
      {configurable_options?.map((item) => {
        return(
          <span>
            <b>{item?.option_label}</b> : <span>{item?.value_label}</span>
          </span>
        )
      })}
    </Box>
  )
}

export default ConfigurableProduct