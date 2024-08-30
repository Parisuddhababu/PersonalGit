import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { Box, Button, FormHelperText, TextField } from '@mui/material';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseLoginValidator } from '../../validator/firebase-login';

const FirebaseLogin = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null,
    },
    validationSchema: FirebaseLoginValidator,
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        const login = await signInWithEmailAndPassword(
          getAuth(),
          values.email,
          values.password
        );
        if (login) {
          const returnUrl = (router.query.returnUrl as string) || '/';
          router.push(returnUrl);
        }
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err?.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <form noValidate onSubmit={formik.handleSubmit}>
        <TextField
          error={Boolean(formik.touched.email && formik.errors.email)}
          fullWidth
          helperText={formik.touched.email && formik.errors.email}
          label='Email Address'
          margin='normal'
          name='email'
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type='email'
          value={formik.values.email}
        />
        <TextField
          error={Boolean(formik.touched.password && formik.errors.password)}
          fullWidth
          helperText={formik.touched.password && formik.errors.password}
          label='Password'
          margin='normal'
          name='password'
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type='password'
          value={formik.values.password}
        />
        {formik.errors.submit && (
          <Box sx={{ mt: 3 }}>
            <FormHelperText error>{formik.errors.submit}</FormHelperText>
          </Box>
        )}
        <Box sx={{ mt: 2 }}>
          <Button
            disabled={formik.isSubmitting}
            fullWidth
            size='large'
            type='submit'
            variant='contained'
          >
            Login
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default FirebaseLogin;
