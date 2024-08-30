import { PopOverValues } from '@components/common/pop-over'
import { TextFieldElement, SelectElement } from '@graphcommerce/ecommerce-ui'
import { useQuery } from '@graphcommerce/graphql'
import { useCartQuery, useFormGqlMutationCart } from '@graphcommerce/magento-cart'
import { GetBillingAddressDocument } from '@graphcommerce/magento-cart-billing-address/components/EditBillingAddressForm/GetBillingAddress.gql'
import { SetBillingAddressDocument } from '@graphcommerce/magento-cart-shipping-address/components/ShippingAddressForm/SetBillingAddress.gql'
import {
  ApolloCustomerErrorAlert,
} from '@graphcommerce/magento-customer'
import { CountryRegionsDocument } from '@graphcommerce/magento-store'
import {
  Button,
  filterNonNullableKeys,
  Form,
  FormActions,
  FormRow,
} from '@graphcommerce/next-ui'
import { phonePattern } from '@graphcommerce/react-hook-form'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { SxProps, Theme, Box, InputLabel } from '@mui/material'
import { shopCountryCode } from 'config/constants'
import { useMemo } from "react"

export type AddEditAddressFormProps = {
  sx?: SxProps<Theme>,
  isAddForm?: boolean
  setBillingAddressUpdated?: (val?: boolean) => void
}

export function AddEditAddressForm(props: AddEditAddressFormProps) {
  const { sx, setBillingAddressUpdated } = props
  const countryQuery = useQuery(CountryRegionsDocument, { fetchPolicy: 'cache-and-network' })
  const countries = countryQuery.data?.countries ?? countryQuery.previousData?.countries
  const address = useCartQuery(GetBillingAddressDocument)?.data?.cart?.billing_address

  const form = useFormGqlMutationCart(SetBillingAddressDocument, {
    defaultValues: {
      firstname: address?.firstname ?? '',
      lastname: address?.lastname ?? '',
      postcode: address?.postcode ?? '',
      city: address?.city ?? '',
      countryCode: address?.country.code ?? shopCountryCode,
      street: address?.street?.[0] ?? '',
      telephone: address?.telephone ?? '',
      addition: address?.street?.[2] ?? '',
      saveInAddressBook: true,
      company: address?.company ?? '',
      regionId: address?.region?.region_id ?? null,
    },
    onBeforeSubmit: (variables) => {
      const regionId = countries
        ?.find((country) => country?.two_letter_abbreviation === variables.countryCode)
        ?.available_regions?.find((region) => region?.id === variables.regionId)?.id

      return {
        ...variables,
        telephone: variables.telephone || '000 - 000 0000',
        regionId,
      }
    },
    onComplete: ({ errors }) => {
      if (!errors) setBillingAddressUpdated && setBillingAddressUpdated(true)
    },
  })

  const { handleSubmit, formState, required, error, muiRegister, valid, watch } = form
  const submitHandler = handleSubmit(() => {})

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

  return (
    <>

      <Form onSubmit={submitHandler} noValidate sx={sx}>

        <Box sx={{maxWidth: {md:'31.25rem'}}}>

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
              onInput = {(e) => {
                const target = e.target as HTMLInputElement
                const valid = Number(Math.max(0, parseInt(target.value ?? 0)).toString().slice(0,6))
                target.value = isNaN(valid) ? "0" : valid.toString()
              }}
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
            <Box sx={{ width: '100%' }}>
              <InputLabel required htmlFor='Phone Number'>
                <Trans id='Phone Number' />
              </InputLabel>
              <TextFieldElement
                control={form.control}
                name='telephone'
                variant='outlined'
                type='text'
                required={required.telephone}
                onInput = {(e) => {
                  const target = e.target as HTMLInputElement
                  const valid = Number(Math.max(0, parseInt(target.value ?? 0)).toString().slice(0,10))
                  target.value = isNaN(valid) ? "0" : valid.toString()
                }}
                validation={{
                  required: {
                    value: true,
                    message: 'This field is required.'
                  },
                  pattern: { value: phonePattern, message: i18n._(/* i18n */ 'Invalid phone number') },
                }}
              />
            </Box>
            <PopOverValues text="For delivery questions." sx={{paddingTop:'1.45rem'}}/>
          </Box>

        </Box>

        <FormActions sx={{
          paddingBottom: 0,
          paddingTop: 0,
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center'
        }}>
          <Button
            type='button'
            variant='contained'
            color='inherit'
            size='medium'
            disabled={formState.isSubmitting}
            onClick={() => setBillingAddressUpdated && setBillingAddressUpdated(true)}
          >
            <Trans id='cancel' />
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='secondary'
            size='medium'
            loading={formState.isSubmitting}
          >
            <Trans id='Update' />
          </Button>
        </FormActions>
      </Form>

      <ApolloCustomerErrorAlert error={error} />

    </>
  )
}
