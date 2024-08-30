import { CountryCodeEnum } from "@graphcommerce/graphql-mesh"
import { CartAddressFragment } from "@graphcommerce/magento-cart/components/CartAddress/CartAddress.gql"
import { useFindCountry } from "@graphcommerce/magento-store"
import { SxProps, Theme, Typography, Link, Box } from "@mui/material"

export type CheckoutAddrssFieldProps = Partial<CartAddressFragment> & {
  sx?: SxProps<Theme>
}

export function CheckoutAddrssField(props: CheckoutAddrssFieldProps) {
  const {
    sx,
    region,
    firstname,
    lastname,
    street,
    city,
    postcode,
    telephone,
    company,
    country
  } = props

  const countryName = useFindCountry(country?.code as CountryCodeEnum)?.full_name_locale ?? country?.code as CountryCodeEnum

  return (
    <>
      <Box 
        sx={{
          ...sx,
          '& > p': {
            lineHeight: '1.688rem',
          }
        }}
      >
        <Typography variant='body1'>
          {firstname} {lastname}
        </Typography>
        <Typography variant='body1'>
          {company}
        </Typography>
        <Typography variant='body1'>
          {street?.[0]} {street?.slice(1).join('')}
        </Typography>
        <Typography variant='body1'>
          {city} {region?.label} {postcode}
        </Typography>
        <Typography variant='body1'>
          {countryName}
        </Typography>
        <Link href={'tel:' + telephone} underline='hover'>
          {telephone}
        </Link>
      </Box>
    </>
  )
}