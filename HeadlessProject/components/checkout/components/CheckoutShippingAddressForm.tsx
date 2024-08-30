// @ts-nocheck
import { PopOverValues } from '@components/common/pop-over'
import { SelectElement, TextFieldElement } from '@graphcommerce/ecommerce-ui'
import { useQuery } from '@graphcommerce/graphql'
import {
  ApolloCartErrorAlert,
  useCartQuery,
  useFormGqlMutationCart,
} from '@graphcommerce/magento-cart'
import { CartAddressFragment } from '@graphcommerce/magento-cart/components/CartAddress/CartAddress.gql'
import { SetShippingAddressDocument } from '@graphcommerce/magento-cart-shipping-address/components/ShippingAddressForm/SetShippingAddress.gql'
import { SetShippingBillingAddressDocument } from '@graphcommerce/magento-cart-shipping-address/components/ShippingAddressForm/SetShippingBillingAddress.gql'
import { isSameAddress } from '@graphcommerce/magento-cart-shipping-address/utils/isSameAddress'
import { useCustomerQuery, CustomerDocument } from '@graphcommerce/magento-customer'
import { CountryRegionsDocument } from '@graphcommerce/magento-store'
import {Form, FormRow, filterNonNullableKeys, Button} from '@graphcommerce/next-ui'
import {
  useFormPersist,
  useFormCompose,
  phonePattern,
} from '@graphcommerce/react-hook-form'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Box, InputLabel, SxProps, Theme } from '@mui/material'
import { useMemo } from 'react'
import { shopCountryCode } from 'config/constants'
import { GetAddressesOnCartDocument } from '@graphql/cart/getSelectedAddress.gql'

export type CheckoutShippingAddressFormProps = {
  sx?: SxProps<Theme>
  ignoreCache?: boolean
  addNewAddress?: boolean
  addNewSubmit?: (value: any) => void
}

export const CheckoutShippingAddressForm = (props: CheckoutShippingAddressFormProps) => {
  const step = 0
  const { sx, ignoreCache = false, addNewAddress = false, addNewSubmit } = props
  const { data: cartQuery } = useCartQuery(GetAddressesOnCartDocument)
  const countryQuery = useQuery(CountryRegionsDocument, { fetchPolicy: 'cache-and-network' })
  const countries = countryQuery.data?.countries ?? countryQuery.previousData?.countries
  const { data: customerQuery } = useCustomerQuery(CustomerDocument)

  const shippingAddress = cartQuery?.cart?.shipping_addresses?.[0]
  const billingAddress = cartQuery?.cart?.billing_address
  const currentAddress: CartAddressFragment | undefined | null = shippingAddress

  let Mutation = SetShippingBillingAddressDocument

  // Customer has a different shipping address than the billing address we only need to update the shipping address here.
  if (!isSameAddress(shippingAddress, billingAddress)) Mutation = SetShippingAddressDocument

  const form = useFormGqlMutationCart(Mutation, {
    defaultValues: ignoreCache
      ? { saveInAddressBook: true }
      : {
          firstname: currentAddress?.firstname ?? customerQuery?.customer?.firstname ?? '',
          lastname: currentAddress?.lastname ?? customerQuery?.customer?.lastname ?? '',
          telephone: currentAddress?.telephone ? currentAddress?.telephone : '',
          city: currentAddress?.city ?? '',
          company: currentAddress?.company ?? '',
          postcode: cartQuery?.cart?.selectedData?.selectedPostcode ?? '',
          street: currentAddress?.street?.[0] ?? '',
          addition: currentAddress?.street?.[2] ?? ' ',
          regionId: cartQuery?.cart?.selectedData?.selectedRegionId !== "" ? Number(cartQuery?.cart?.selectedData?.selectedRegionId) : null,
          countryCode: cartQuery?.cart?.selectedData?.selectedCountryId !== "" ? cartQuery?.cart?.selectedData?.selectedCountryId : shopCountryCode,
          saveInAddressBook: true,
        },
    onBeforeSubmit: (variables) => {
      const regionId = countries
        ?.find((country) => country?.two_letter_abbreviation === variables.countryCode)
        ?.available_regions?.find((region) => region?.id === variables.regionId)?.id

      return {
        ...variables,
        telephone: variables.telephone ?? '0000-0000-00',
        regionId,
        customerNote: '',
      }
    },
    onComplete: (res) => {
      if (addNewAddress) {
        addNewSubmit(res?.data?.setShippingAddressesOnCart?.cart?.shipping_addresses[0])
      }
    },
  })
  const { handleSubmit, required, error, watch, loading } = form
  const submit = handleSubmit(() => {})

  const country = watch('countryCode')

  const countryList = useMemo(() => {
    const countriesWithLocale = (countries ?? [])?.filter((c) => c?.full_name_locale)
    return countriesWithLocale.sort((a, b) =>
      (a?.full_name_locale ?? '')?.localeCompare(b?.full_name_locale ?? ''),
    )
  }, [countries])

  const regionList = useMemo(() => {
    const availableRegions = Object.values(
      countryList.find((c) => c?.two_letter_abbreviation === country)?.available_regions ?? {},
    )
    type Region = (typeof availableRegions)[0]

    const compare: (a: Region, b: Region) => number = (a, b) =>
      (a?.name ?? '')?.localeCompare(b?.name ?? '')

    return availableRegions?.sort(compare)
  }, [country, countryList])

  useFormPersist({ form, name: 'ShippingAddressForm' })
  useFormCompose({ form, step, submit, key: 'ShippingAddressForm' })

  return (
    <Form onSubmit={submit} noValidate sx={{ ...sx, padding: '0', marginBottom: '0.75rem' }}>

      <Box className='address-form-inner'>

        <Box sx={{marginBottom: '1rem'}}>
          <InputLabel required htmlFor='First Name'>
            <Trans id='First Name' />
          </InputLabel>
          <TextFieldElement
            sx={{ minWidth: '100%' }}
            control={form.control}
            name='firstname'
            required={required.firstname}
            variant='outlined'
            type='text'
          />
        </Box>

        <Box sx={{marginBottom: '1rem'}}>
          <InputLabel required htmlFor='Last Name'>
            <Trans id='Last Name' />
          </InputLabel>
          <TextFieldElement
            sx={{ minWidth: '100%' }}
            control={form.control}
            name='lastname'
            required={required.lastname}
            variant='outlined'
            type='text'
          />
        </Box>

        <Box sx={{marginBottom: '1rem'}}>
          <InputLabel htmlFor='Company'>
            <Trans id='Company' />
          </InputLabel>
          <TextFieldElement
            sx={{ minWidth: '100%' }}
            control={form.control}
            name='company'
            variant='outlined'
            type='text'
          />
        </Box>

        <Box sx={{marginBottom: '0.5rem'}}>
          <InputLabel required htmlFor='Street Address'>
            <Trans id='Street Address' />
          </InputLabel>
          <TextFieldElement
            sx={{ minWidth: '100%' }}
            variant='outlined'
            control={form.control}
            required={required.street}
            name='street'
            type='text'
            autoComplete='address-line1'
          />
        </Box>

        <Box sx={{marginBottom: '1rem'}}>
          <TextFieldElement
            sx={{ minWidth: '100%' }}
            control={form.control}
            name='addition'
            variant='outlined'
            type='text'
            autoComplete='address-line2'
          />
        </Box>

        <Box sx={{marginBottom: '1rem'}}>
          <InputLabel required htmlFor='Country'>
            <Trans id='Country' />
          </InputLabel>
          <SelectElement
            sx={{ minWidth: '100%' }}
            control={form.control}
            name='countryCode'
            SelectProps={{ autoWidth: true }}
            variant='outlined'
            required={required.countryCode}
            options={filterNonNullableKeys(countryList, [
              'two_letter_abbreviation',
              'full_name_locale',
            ]).map(({ two_letter_abbreviation: id, full_name_locale: label }) => ({ id, label }))}
          />
        </Box>

        <Box sx={{marginBottom: '1rem'}}>
          <InputLabel required htmlFor='State/Province'>
            <Trans id='State/Province' />
          </InputLabel>
          {regionList && regionList.length > 0 && (
            <SelectElement
              control={form.control}
              sx={{ minWidth: '100%' }}
              name='regionId'
              // SelectProps={{ native: true, displayEmpty: true }}
              variant='outlined'
              required
              options={filterNonNullableKeys(regionList, ['id', 'name']).map(
                ({ id, name: label }) => ({ id, label }),
              )}
            />
          )}
          {(!regionList || regionList?.length === 0) && (
            <TextFieldElement
              sx={{ minWidth: '100%' }}
              control={form.control}
              name='regionId'
              variant='outlined'
              type='text'
              required
            />
          )}
        </Box>

        <Box sx={{marginBottom: '1rem'}}>
          <InputLabel required htmlFor='City'>
            <Trans id='City' />
          </InputLabel>
          <TextFieldElement
            sx={{ minWidth: '100%' }}
            control={form.control}
            name='city'
            variant='outlined'
            type='text'
            required
          />
        </Box>

        <Box sx={{marginBottom: '1rem'}}>
          <InputLabel required htmlFor='Zip/Postal Code'>
            <Trans id='Zip/Postal Code' />
          </InputLabel>
          <TextFieldElement
            sx={{ minWidth: '100%' }}
            control={form.control}
            name='postcode'
            variant='outlined'
            type='text'
            required={required.postcode}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            // alignItems: 'center',
            width: '100%',
            paddingTop: '0',
            gap: '0.25rem',
            marginBottom: '1rem'
          }}
        >
          <Box sx={{
              width: '100%',
            }}>
            <InputLabel required htmlFor='Phone Number'>
              <Trans id='Phone Number' />
            </InputLabel>
            <TextFieldElement
              control={form.control}
              sx={{ minWidth: '100%' }}
              name='telephone'
              variant='outlined'
              type='text'
              required={required.telephone}
              validation={{
                pattern: { value: phonePattern, message: i18n._(/* i18n */ 'Invalid phone number') },
              }}
            />
          </Box>
          <PopOverValues text='For delivery questions.' sx={{paddingTop:'1.45rem'}}/>
        </Box>

      </Box>

      <ApolloCartErrorAlert error={error} />
        {addNewAddress && <FormRow
          sx={{
            paddingBottom: '0',
            display: 'flex',
            justifyContent: 'end'
          }}
        >
            <Button
                sx={{
                  marginBottom: '0',
                  width: '10rem'
                }}
                type="button"
                variant='contained'
                size='medium'
                disabled={loading}
                color='inherit'
                onClick={() => addNewSubmit(null)}
            >
              <Trans id='Cancel'/>
            </Button>
            <Button
              sx={{
                  marginBottom: '0',
                  width: '10rem'
              }}
              type="submit"
              variant='contained'
              size='medium'
              color='secondary'
              loading={loading}
              disabled={loading}
            >
              <Trans id='Ship Here'/>
            </Button>
        </FormRow>}
    </Form>
  )
}

export default CheckoutShippingAddressForm
