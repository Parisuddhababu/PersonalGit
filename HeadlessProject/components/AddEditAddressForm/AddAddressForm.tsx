import { useMutation, useQuery } from '@graphcommerce/graphql'
import { CreateCustomerAddressDocument } from '@graphcommerce/magento-customer/components/CreateCustomerAddressForm/CreateCustomerAddress.gql'
import { CountryRegionsDocument } from '@graphcommerce/magento-store'
import { Form, FormActions, Button } from '@graphcommerce/next-ui'
import { useFormGqlMutation } from '@graphcommerce/react-hook-form'
import { Trans } from '@lingui/react'
import { Box, Checkbox, FormControlLabel, Typography, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { ADD_ADDRESS } from '../../graphql/my-account'
import { UIContext } from '../common/contexts/UIContext'
import { AddressForm } from './AddressForm'
import { ContactForm } from './ContactForm'

function AddAddressForm(props) {
  const { addresses } = props
  const countryQuery = useQuery(CountryRegionsDocument, { fetchPolicy: 'network-only' })
  const countries = countryQuery.data?.countries ?? countryQuery.previousData?.countries
  const [addAddress, { loading }] = useMutation(ADD_ADDRESS)
  const router = useRouter()
  const [, setState] = useContext(UIContext)

  const [checkBoxes, setCheckBoxes] = useState({
    billing: false,
    shipping: false,
  })

  const defaultBilling = addresses?.data?.customer?.addresses?.filter((a) => a?.default_billing)
  const defaultShipping = addresses?.data?.customer?.addresses?.filter((a) => a?.default_shipping)

  const form = useFormGqlMutation(
    CreateCustomerAddressDocument,
    {
      onComplete: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`/account/addresses`)
      },
    },
    { errorPolicy: 'all' },
  )

  const { formState, watch } = form

  const region = countries
    ?.find((country) => country?.two_letter_abbreviation === watch('countryCode'))
    ?.available_regions?.find((r) => r?.id?.toString() === watch('region'))

  const submitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    await addAddress({
      variables: {
        firstname: watch('firstname'),
        lastname: watch('lastname'),
        telephone: watch('telephone'),
        ...(watch('company') && { company: watch('company') }),
        street: watch('street'),
        addition: watch('addition') ?? '',
        city: watch('city'),
        ...(watch('countryCode') && {
          region: {
            region: region?.name ?? watch('suffix'),
            region_code: region?.code,
            region_id: region?.id,
          },
        }),
        postcode: watch('postcode'),
        countryCode: watch('countryCode'),
        ...((!addresses || addresses?.length <= 0) && { defaultBilling: true }),
        ...((!addresses || addresses?.length <= 0) && { defaultShipping: true }),
        ...(defaultShipping.concat(defaultBilling).length >= 1
          ? { defaultBilling: checkBoxes.billing, defaultShipping: checkBoxes.shipping }
          : { defaultBilling: true, defaultShipping: true }),
      },
    })
    setState((prevData) => ({
      ...prevData,
      alerts: [
        {
          type: 'success',
          message: 'You saved the address.',
          timeout: 5000,
          targetLink: '/account/addresses',
        },
      ],
    }))
    await router.push({
      pathname: '/account/addresses',
    })
  }

  const handleCheckBox = (value: string) => {
    setCheckBoxes({ ...checkBoxes, [`${value}`]: !checkBoxes[`${value}`] })
  }

  return (
    <Box sx={{ width: '100%', paddingLeft: {xs:'0', md:'1rem', lg:'1.563rem' } }}>

      <Form sx={{ padding: '0px' }} onSubmit={submitHandler} noValidate>
        
        <Typography
          variant='h2'
          sx={{
            fontWeight: '300',
            fontVariationSettings: `'wght' 300`,
            paddingBottom: {xs:'1rem', md:'2rem'}, 
            marginTop: {xs:'0', md:'-0.25rem'}
          }}
        >
          Add New Address
        </Typography>

        <Grid container spacing={{xs:2, md: 3, lg: 4.75}}>
          <Grid item xs={12} md={6}>
            <Typography
                variant='h4'
                sx={{
                  color: '#333',
                  fontSize: {xs:'1rem', md:'1.375rem'},
                  fontWeight: '300',
                  fontVariationSettings: `'wght' 300`,
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid #c6c6c6',
                  marginBottom: {xs:'0.875rem', md:'1.5rem'},
                }}
              >
              Contact Information
            </Typography>
            <ContactForm form={form} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
                variant='h4'
                sx={{
                  color: '#333',
                  fontSize: {xs:'1rem', md:'1.375rem'},
                  fontWeight: '300',
                  fontVariationSettings: `'wght' 300`,
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid #c6c6c6',
                  marginBottom: {xs:'0.875rem', md:'1.5rem'},
                }}
              >
                Address
              </Typography>
              <AddressForm form={form} />
              {defaultShipping.concat(defaultBilling).length >= 1 && (
                <>
                  <FormControlLabel
                    sx={{ width: 'fit-content' }}
                    control={
                      <Checkbox
                        size='small'
                        value='billing'
                        checked={checkBoxes.billing}
                        onChange={(e) => handleCheckBox(e.target.value)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                    label='Use as my default billing address'
                  />
                  <FormControlLabel
                    sx={{ width: 'fit-content' }}
                    control={
                      <Checkbox
                        size='small'
                        value='shipping'
                        checked={checkBoxes.shipping}
                        onChange={(e) => handleCheckBox(e.target.value)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                    label='Use as my default shipping address'
                  />
                </>
              )}
          </Grid>

        </Grid>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            padding: '1rem 0 2rem',
            gap: '1rem'
          }}
        >
          <Button
            sx={{
              color: '#ffffff',
              backgroundColor: '#1979c3',
              '&:hover, &:active': { backgroundColor: '#006bb4' },
            }}
            variant='contained'
            size='medium'
            onClick={() => router.back()}
          >
            <Trans id='Back' />
          </Button>
          <Button
            sx={{
              color: '#ffffff',
              backgroundColor: '#1979c3',
              '&:hover, &:active': { backgroundColor: '#006bb4' },
            }}
            type='submit'
            variant='contained'
            size='medium'
            loading={loading}
            disabled={!formState.isValid}
          >
            <Trans id='Save Address' />
          </Button>
        </Box>
      </Form>
    </Box>
  )
}

// eslint-disable-next-line import/no-default-export
export default AddAddressForm
