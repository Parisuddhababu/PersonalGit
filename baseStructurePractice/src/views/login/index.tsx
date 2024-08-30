import React from 'react';
import { useMutation } from '@apollo/client';
import TextInput from '@components/input/TextInput';
import { LoginResponse } from '@framework/graphql/graphql';
import { LOGIN_USER } from '@framework/graphql/mutations/user';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ROUTES } from '@config/constant';
import { LoginInput } from 'src/types/views';
import { t } from 'i18next';
import * as CryptoJS from 'crypto-js';
import useValidation from '@components/hooks/validation';
import Button from '@components/button/button';

const Login = () => {
	const [login] = useMutation(LOGIN_USER);
	const navigate = useNavigate();
	const initialValues: LoginInput = {
		email: '',
		password: '',
	};
	const { loginValidation } = useValidation();
	const formik = useFormik({
		initialValues,
		validationSchema: Yup.object(loginValidation),
		onSubmit: (values) => {
			// // Encrypt data
			const secretKey = 'mySecretKey';

			const encryptedData = (text: string) => {
				const encrypt = CryptoJS.AES.encrypt(JSON.stringify(text), secretKey).toString();
				return encrypt;
			};
			login({
				variables: values,
			})
				.then((res) => {
					const data = res.data as LoginResponse;
					localStorage.setItem('authToken', encryptedData(data.loginUser.data.token));
					navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
				})
				.catch(() => {
					toast.error(t('Failed to login'));
				});
		},
	});

	return (
		<React.Fragment>
			<div className='bg-white py-6 sm:py-8 lg:py-12'>
				<div className='max-w-screen-2xl px-4 md:px-8 mx-auto '>
					<div className='w-full flex items-center justify-center mt-20'>
						<form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4' onSubmit={formik.handleSubmit}>
							<h2 className='text-gray-800 text-2xl lg:text-3xl font-bold mb-4 md:mb-6'>{t('Login')}</h2>
							<h4 className='text-gray-600 mb-4'>{t('Sign In to your account')}</h4>
							<div className='mb-4'>
								<TextInput placeholder={'Email'} name='email' onChange={formik.handleChange} value={formik.values.email} error={formik.errors.email} />
							</div>
							<div className='mb-6'>
								<TextInput placeholder='*****' name='password' type='password' onChange={formik.handleChange} value={formik.values.password} error={formik.errors.password} />
							</div>

							<Button type='submit' className='btn btn-primary' label={t('Sign In')}></Button>
						</form>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
export default Login;
