import { SelectElement, TextFieldElement } from '@graphcommerce/ecommerce-ui'
import { useQuery } from '@graphcommerce/graphql'
import { CountryRegionsDocument } from '@graphcommerce/magento-store'
import { filterNonNullableKeys, FormRow } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { InputLabel, Box, Typography } from '@mui/material'
import React, { useMemo } from 'react'

export function AddressForm(props) {
  const { form } = props

  const countryQuery = useQuery(CountryRegionsDocument, { fetchPolicy: 'cache-and-network' })
  const countries = countryQuery.data?.countries ?? countryQuery.previousData?.countries

  const { watch, required, control, setValue } = form

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
  const labelStyle = {
    color: '#000',
    marginBottom: '0.5rem',
    fontWeight: '600',
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          marginTop: '0',
          marginBottom: '0.625rem',
        }}
      >
        <InputLabel required sx={{ ...labelStyle }} htmlFor='Street Address'>
          <Trans id='Street Address' />
        </InputLabel>
        <TextFieldElement
          variant='outlined'
          control={control}
          required={required.street}
          name='street'
          type='text'
          autoComplete='address-line1'
        />
      </Box>

      <Box
        sx={{
          marginTop: '0',
          marginBottom: '1rem',
        }}
      >
        <TextFieldElement
          control={control}
          name='addition'
          variant='outlined'
          type='text'
          required={required.addition}
          // label={<Trans id='' />}
          autoComplete='address-line3'
        />
      </Box>

      <Box
        sx={{
          marginTop: '0',
          marginBottom: '1rem',
        }}
      >
        <InputLabel required sx={{ ...labelStyle }} htmlFor='city'>
          <Trans id='City' />
        </InputLabel>
        <TextFieldElement
          control={control}
          name='city'
          variant='outlined'
          type='text'
          required={required.city}
        />
      </Box>

      <Box
        sx={{
          marginTop: '0',
          marginBottom: '1rem',
        }}
      >
        <InputLabel required sx={{ ...labelStyle }} htmlFor='State/Province'>
          <Trans id='State/Province' />
        </InputLabel>
        {regionList.length > 0 ? (
          <SelectElement
            control={control}
            name='region'
            SelectProps={{ native: true, displayEmpty: true }}
            variant='outlined'
            required
            options={filterNonNullableKeys(regionList, ['id', 'name']).map(
              ({ id, name: label }) => ({
                id,
                label,
              }),
            )}
          />
        ) : (
          <TextFieldElement
            control={control}
            name='suffix'
            variant='outlined'
            type='text'
            required={required.suffix}
          />
        )}
      </Box>
      <Box
        sx={{
          marginTop: '0',
          marginBottom: '1rem',
        }}
      >
        <InputLabel required sx={{ ...labelStyle }} htmlFor='Zip/Postal Code'>
          <Trans id='Zip/Postal Code' />
        </InputLabel>
        <TextFieldElement
          control={control}
          name='postcode'
          variant='outlined'
          type='text'
          required={required.postcode}
          validation={{
            pattern: {
              value: /^\d{6}$/,
              message: 'invalid postcode',
            },
          }}
        />
      </Box>

      <Box
        sx={{
          marginTop: '0',
          marginBottom: '1rem',
        }}
      >
        <InputLabel required sx={{ ...labelStyle }} htmlFor='Country'>
          <Trans id='Country' />
        </InputLabel>
        <SelectElement
          control={control}
          name='countryCode'
          SelectProps={{ autoWidth: true }}
          variant='outlined'
          required={required.countryCode}
          onChange={() => {
            setValue('suffix', '')
            setValue('region', '')
          }}
          options={filterNonNullableKeys(countryList, [
            'two_letter_abbreviation',
            'full_name_locale',
          ]).map(({ two_letter_abbreviation: id, full_name_locale: label }) => ({ id, label }))}
        />
      </Box>
    </Box>
  )
}
