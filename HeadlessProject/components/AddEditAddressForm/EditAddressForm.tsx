/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQuery } from '@graphcommerce/graphql'
import { UpdateCustomerAddressDocument } from '@graphcommerce/magento-customer/components/EditAddressForm/UpdateCustomerAddress.gql'
import { CountryRegionsDocument } from '@graphcommerce/magento-store'
import { Form, FormActions, Button } from '@graphcommerce/next-ui'
import { useFormGqlMutation } from '@graphcommerce/react-hook-form'
import { Trans } from '@lingui/react'
import { Alert, Box, Checkbox, FormControlLabel, Typography, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { EDIT_ADDRESS } from '../../graphql/my-account'
import { AlertToast } from '../AlertToast'
import { UIContext } from '../common/contexts/UIContext'
import { AddressForm } from './AddressForm'
import { ContactForm } from './ContactForm'

function EditAddressForm(props) {
  const { addresses, editId } = props
  const countryQuery = useQuery(CountryRegionsDocument, { fetchPolicy: 'network-only' })
  const countries = countryQuery.data?.countries ?? countryQuery.previousData?.countries
  const [editAddress, { loading }] = useMutation(EDIT_ADDRESS)
  const router = useRouter()
  const [state, setState] = useContext(UIContext)

  const editData = addresses?.data?.customer?.addresses?.filter((a) => a?.id?.toString() === editId)
  const [checkBoxes, setCheckBoxes] = useState({
    billing: editData?.[0]?.default_billing,
    shipping: editData?.[0]?.default_shipping,
  })

  const form = useFormGqlMutation(
    UpdateCustomerAddressDocument,
    {
      defaultValues: {
        id: editData?.[0]?.id ?? undefined,
        firstname: editData?.[0]?.firstname,
        lastname: editData?.[0]?.lastname,
        street: editData?.[0]?.street?.[0] ?? undefined,
        postcode: editData?.[0]?.postcode,
        city: editData?.[0]?.city,
        countryCode: editData?.[0]?.country_code,
        telephone: editData?.[0]?.telephone,
        region: editData?.[0]?.region?.region_id,
        suffix: editData?.[0]?.region?.region,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        addition: editData?.[0]?.street?.[1],
      },
      onComplete: async () => {
        await router.push(`/account/addresses`)
      },
    },
    { errorPolicy: 'all' },
  )

  const { formState, error, watch } = form

  const region = countries
    ?.find(
      (country) =>
        country?.two_letter_abbreviation === (watch('countryCode') || editData?.[0]?.country_code),
    )
    ?.available_regions?.find(
      (r) =>
        r?.id?.toString() ===
        (watch('region')?.toString() || editData?.[0]?.region?.region_id?.toString()),
    )

  const submitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    await editAddress({
      variables: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        id: parseInt(editId, 10),
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
        defaultBilling: checkBoxes.billing,
        defaultShipping: checkBoxes.shipping,
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
    await router.push({ pathname: '/account/addresses' })
  }

  const defaultBilling = editData?.[0]?.default_billing
  const defaultShipping = editData?.[0]?.default_shipping

  const handleCheckBox = (value: string) => {
    setCheckBoxes({ ...checkBoxes, [`${value}`]: !checkBoxes[`${value}`] })
  }

  useEffect(() => {
    if (error?.message) {
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'error',
            message: error?.message,
            timeout: 5000,
            targetLink: router?.pathname,
          },
        ],
      }))
    }
  }, [error])

  return (
    <Box sx={{ width: '100%', paddingLeft: {xs:'0', md:'1rem', lg:'1.563rem' } }}>
      {state?.alerts?.length > 0 && <AlertToast alerts={state?.alerts} link={router?.pathname} />}
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
          Edit Address
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
              {defaultBilling ? (
                <Alert
                  severity='warning'
                  variant='standard'
                  sx={{
                    marginBottom: '1rem',
                    '.MuiAlert-icon': {
                      alignItems: 'center',
                    },
                  }}
                >
                  <Typography>This is your default billing address.</Typography>
                </Alert>
              ) : (
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
              )}
              {defaultShipping ? (
                <Alert
                  severity='warning'
                  variant='standard'
                  sx={{
                    marginBottom: '1rem',
                    '.MuiAlert-icon': {
                      alignItems: 'center',
                    },
                  }}
                >
                  <Typography>This is your default shipping address.</Typography>
                </Alert>
              ) : (
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
export default EditAddressForm
