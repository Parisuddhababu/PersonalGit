import { CustomerAddressFragment } from '@graphcommerce/magento-customer/components/CreateCustomerAddressForm/CustomerAddress.gql'
import { useFindCountry } from '@graphcommerce/magento-store'
import { extendableComponent } from '@graphcommerce/next-ui'
import { SxProps, Theme, Typography } from '@mui/material'

type AddressMultiLineProps = CustomerAddressFragment & { sx?: SxProps<Theme> }

const name = 'AddressMultiLine'
const parts = ['root', 'title'] as const
const { classes } = extendableComponent(name, parts)

function AddressCard(props: AddressMultiLineProps) {
  const {
    company,
    prefix,
    firstname,
    lastname,
    middlename,
    suffix,
    street,
    region,
    city,
    postcode,
    country_code,
    sx = [],
  } = props
  const countryName = useFindCountry(country_code)?.full_name_locale ?? country_code

  const regionName = typeof region === 'string' ? region : region?.region

  return (
    <Typography variant='body1' component='div' className={classes.root} sx={sx}>
      <div className={classes.title}>
        <div>
          {prefix} {firstname} {middlename} {lastname} {suffix}
        </div>
        <div>{company}</div>
      </div>
      <div>
        {street?.[0]}, {street?.[1]}
      </div>
      <div>
        {city}, {regionName && `${regionName}, `}
        {postcode}
      </div>
      <div>{countryName}</div>
    </Typography>
  )
}

// eslint-disable-next-line import/no-default-export
export default AddressCard
