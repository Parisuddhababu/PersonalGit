import * as React from 'react';
import { useCallback } from 'react';
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RegisterFormValidatorSchema } from '../../validators/register-form/registerForm';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';

interface ICreateUser {
  firstname: string;
  lastname: string;
  phone: string;
  countrycode: string;
  email: string;
  password: string;
}

const Register = () => {
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      firstname: '',
      lastname: '',
      phone: '',
      countrycode: '',
      email: '',
      password: '',
    },
    resolver: yupResolver(RegisterFormValidatorSchema),
    mode: 'onChange',
  });

  const [values, setValues] = React.useState<{
    password: string;
    showPassword: boolean;
  }>({
    password: '',
    showPassword: false,
  });

  const countries = ['+91', '+1'];

  const handleClickShowPassword = useCallback(() => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  }, [values]);

  const handleMouseDownPassword = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
    []
  );

  const onSubmit = async (formValues: ICreateUser) => {
    try {
      const formData = {
        firstName: formValues.firstname,
        lastName: formValues.lastname,
        phoneNumber: formValues.countrycode + formValues.phone,
        email: formValues.email,
        password: formValues.password,
      };
      console.log(formData, 'Your filled Data');
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <Stack sx={{ display: 'flex', alignItems: 'center' }} spacing={2}>
      <Typography variant='h3' color='lightblue'>
        Register Form
      </Typography>
      <Box sx={{ boxShadow: '5' }}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item sm={6} xs={12}>
              <TextField
                error={Boolean(formState?.errors?.firstname)}
                fullWidth
                helperText={formState?.errors?.firstname?.message}
                label='First Name'
                margin='normal'
                type='text'
                {...register('firstname')}
                name='firstname'
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                error={Boolean(formState?.errors?.lastname)}
                fullWidth
                helperText={formState?.errors?.lastname?.message}
                label='Last Name'
                margin='normal'
                {...register('lastname')}
                name='lastname'
              />
            </Grid>
            <Grid item sm={12} xs={12}>
              <TextField
                error={Boolean(formState?.errors?.email)}
                fullWidth
                helperText={formState?.errors?.email?.message}
                label='Work Email'
                margin='normal'
                type='email'
                {...register('email')}
                name='email'
              />
            </Grid>
            <Grid item sm={12} xs={12}>
              <TextField
                error={Boolean(formState?.errors?.password)}
                fullWidth
                helperText={formState?.errors?.password?.message}
                label='Password'
                margin='normal'
                type={values.showPassword ? 'text' : 'password'}
                {...register('password')}
                name='password'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='start'>
                      <IconButton
                        sx={{ color: 'gray' }}
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge='end'
                      >
                        {values.showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item sm={12} xs={12}>
              <Stack direction='row' spacing={2}>
                <Box sx={{ mt: 2, width: '30%' }}>
                  <TextField
                    select
                    fullWidth
                    id='countrycode'
                    {...register('countrycode')}
                    error={Boolean(formState?.errors?.countrycode)}
                    label='Code'
                    name='countrycode'
                  >
                    {countries.map((name) => (
                      <MenuItem key={name} value={name}>
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </TextField>
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {formState?.errors?.countrycode?.message
                      ? formState?.errors?.countrycode?.message
                      : ''}
                  </FormHelperText>
                </Box>
                <Box sx={{ mt: 0, width: '70%' }}>
                  <TextField
                    error={Boolean(formState?.errors?.phone)}
                    fullWidth
                    helperText={formState?.errors?.phone?.message}
                    label='Phone Number'
                    margin='normal'
                    type='number'
                    {...register('phone')}
                    name='phone'
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '20px',
            }}
          >
            <Button
              size='large'
              type='reset'
              variant='outlined'
              onClick={useCallback(() => {
                reset();
              }, [reset])}
            >
              Cancel
            </Button>
            <LoadingButton
              type='submit'
              variant='contained'
              loading={formState?.isSubmitting}
              size='large'
            >
              Create Account
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Stack>
  );
};

export default Register;
