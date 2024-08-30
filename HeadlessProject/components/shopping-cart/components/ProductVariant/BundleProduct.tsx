import { CurrencyEnum, Maybe } from "@graphcommerce/graphql-mesh"
import { BundleCartItemFragment } from "@graphcommerce/magento-product-bundle/components/BundleCartItem/BundleCartItem.gql"
import { Money, MoneyProps } from "@graphcommerce/magento-store"
import { SelectedBundleOptionValue } from "@graphql/schema/magentoSchema"
import { Box, SxProps, Theme } from "@mui/material"

export type BundleProductProps = {
  sx?: SxProps<Theme>
} & BundleCartItemFragment

export const BundleProduct = (props: BundleProductProps) => {
  const {sx, bundle_options} = props

  const moneyObject = (amount: number): MoneyProps => {
    const amt: MoneyProps = {
      currency: 'USD' as CurrencyEnum,
      value: Number(amount) as number
    }
    return amt
  }


  const bundleValue = (value?: Array<Maybe<SelectedBundleOptionValue>>): string => {
    return value?.[0]?.quantity + ' X ' + value?.[0]?.label;
  }

  if (bundle_options?.length < 0) {
    return <></>
  }

  return(
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      ...sx,
      '& > span':{
        '& > b': {
          '&:first-child': {
            display: 'block',
          }
        }
      }
    }}>
      {bundle_options?.map((item) => {
        return(
          <span>
            <b>{item?.label}:</b> <span>{bundleValue(item?.values)} <b><Money {...moneyObject(item?.values?.[0]?.price as number)}/></b></span>
          </span>
        )
      })}
    </Box>
  )
}

export default BundleProduct