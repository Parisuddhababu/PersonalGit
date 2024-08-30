import { SelectElement, TextFieldElement } from '@graphcommerce/ecommerce-ui'
import { Trans } from '@lingui/react'
import { useQuery } from '@graphcommerce/graphql'
import { CountryRegionsDocument } from '@graphcommerce/magento-store'
import { filterNonNullableKeys, FormRow, InputCheckmark } from '@graphcommerce/next-ui'
import { assertFormGqlOperation, UseFormReturn } from '@graphcommerce/react-hook-form'
import { useMemo } from 'react'
import { Box, InputLabel, Typography } from '@mui/material'

export type CounrtyFieldValues = {
  country?: string
  state?: string
  zipCode?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CountryRegionDropDownProps = { form: UseFormReturn<any>; readOnly?: boolean }

export const CountryRegionDropDown = (props: CountryRegionDropDownProps) => {
  const { form } = props

  const countryQuery = useQuery(CountryRegionsDocument, { fetchPolicy: 'cache-and-network' })
  const countries = countryQuery.data?.countries ?? countryQuery.previousData?.countries

  assertFormGqlOperation<CounrtyFieldValues>(form)
  const { watch, required, control } = form
  const country = watch('country')

  const countryList = useMemo(() => {
    const countriesWithLocale = (countries ?? [])?.filter((c) => c?.full_name_locale)
    return countriesWithLocale.sort((a, b) =>
      (a?.full_name_locale ?? '')?.localeCompare(b?.full_name_locale ?? ''),
    )
  }, [countries])

  const regionList = useMemo(() => {
    const availableRegions = Object.values(
      countryList.find((c) => c?.full_name_locale === country)?.available_regions ?? {},
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
  const regionField = () => {
    if (regionList.length > 0) {
      return (
        <FormRow>
          <Box>
            <InputLabel required sx={{ ...labelStyle }} htmlFor='orderBy'>
              <Trans id='Region' />
            </InputLabel>

            <SelectElement
              control={control}
              name='state'
              // SelectProps={{ native: true, displayEmpty: true }}
              variant='outlined'
              options={filterNonNullableKeys(regionList, ['id', 'name']).map(
                ({ name: id, name: label }) => ({ id, label }),
              )}
            />
          </Box>
        </FormRow>
      )
    } else {
      return (
        <FormRow>
          <Box>
            <InputLabel required sx={{ ...labelStyle }} htmlFor='Region'>
              <Trans id='Region' />
            </InputLabel>
            <TextFieldElement control={control} name='state' variant='outlined' type='text' />
          </Box>
        </FormRow>
      )
    }
  }

  return (
    <>
      <FormRow>
        <Box>
          <InputLabel required sx={{ ...labelStyle }} htmlFor='Country'>
            <Trans id='Country' />
          </InputLabel>
          <SelectElement
            control={control}
            name='country'
            SelectProps={{ autoWidth: true }}
            variant='outlined'
            required={required.country}
            options={filterNonNullableKeys(countryList, [
              'two_letter_abbreviation',
              'full_name_locale',
            ]).map(({ full_name_locale: id, full_name_locale: label }) => ({ id, label }))}
          />
        </Box>
      </FormRow>
      {regionField()}
      <FormRow>
        <Box>
          <InputLabel required sx={{ ...labelStyle }} htmlFor='Zip/Postal Code'>
            <Trans id='Zip/Postal Code' />
          </InputLabel>
          <TextFieldElement
            control={control}
            name='zipCode'
            variant='outlined'
            type='text'
            required={required.zipCode}
          />
        </Box>
      </FormRow>
    </>
  )
}

export default CountryRegionDropDown
