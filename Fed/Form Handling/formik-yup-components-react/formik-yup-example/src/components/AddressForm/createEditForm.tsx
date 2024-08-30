import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
} from '@mui/material';
import { AddressLine1, Country, StateOrProvince } from '../address';
import { Formik } from 'formik';
import { useCallback } from 'react';

interface Address {
  city: string;
  country: string;
  line1: string;
  line2?: string;
  notes?: string;
  postalCode: string;
  province: string;
}

interface CreateEditAddressInfoProps {
  address?: Address;
}

const CreateEditAddress = ({ address }: CreateEditAddressInfoProps) => {
  const initialValues = {
    addressLine1: address?.line1 || '',
    addressLine2: address?.line2 || '',
    city: address?.city || '',
    province: address?.province || '',
    country: address?.country || '',
    postalCode: address?.postalCode || '',
    submit: null,
  };

  // eslint-disable-next-line
  const onSubmitForm = async (values: any, helpers: any): Promise<void> => {
    try {
      const formData = {
        address: {
          line1: values.addressLine1,
          line2: values.addressLine2,
          city: values.city,
          postalCode: values.postalCode,
          province: values.province,
          country: values.country,
        },
      };
      console.log('FormData', formData);
    } catch (err: any) {
      helpers.setStatus({ success: false });
      helpers.setSubmitting(false);
      helpers.setErrors({ submit: err?.message });
    }
  };
  const handleOnSubmit = useCallback((_values, { setStatus }) => {
    onSubmitForm(_values, setStatus);
  }, []);

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleOnSubmit}
        validateOnMount={true}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit} autoComplete='off'>
            <Card>
              <CardHeader
                title={'Create Edit Address Information'}
                sx={{
                  borderBottom: 1,
                  borderColor: 'neutral.200',
                }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <AddressLine1
                      label='Address Line 1'
                      name='addressLine1'
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.addressLine1}
                      isFor={'AddressLine1'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <AddressLine1
                      label='Address Line 2'
                      name='addressLine2'
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.addressLine2}
                      isFor={'AddressLine2'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Country
                      label='Country'
                      name='country'
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.country}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StateOrProvince
                      label='State or Province'
                      name='province'
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.province}
                      countrycode={formik.values.country}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <AddressLine1
                      label='City'
                      name='city'
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.city}
                      isFor={'City'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <AddressLine1
                      label='Postal or Zip Code'
                      name='postalCode'
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.postalCode}
                      isFor={'PostalOrZipCode'}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Box>
                  <Button sx={{ m: 1 }} variant='outlined' type='reset'>
                    Cancel
                  </Button>
                  <Button
                    sx={{ m: 1 }}
                    variant='contained'
                    type='submit'
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    Save
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </form>
        )}
      </Formik>
    </>
  );
};

export default CreateEditAddress;
