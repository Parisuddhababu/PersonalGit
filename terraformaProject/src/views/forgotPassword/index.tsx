import { useMutation } from '@apollo/client';
import Button from '@components/button/button';
import TextInput from '@components/textInput/TextInput';
import { ForgotPasswordResponse } from '@framework/graphql/graphql';
import { USER_FORGOT_PASSWORD } from '@framework/graphql/mutations/user';
import useValidation from '@framework/hooks/validations';
import { useFormik } from 'formik';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ForgotPasswordInput } from 'src/types/views';
import LoginImg from '@assets/images/login-img.jpg';
import Logo from '@assets/images/logo.png';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
	const { t } = useTranslation();
	const navigate = useNavigate()
	const [forgotPassword] = useMutation(USER_FORGOT_PASSWORD);
	const [loading, setLoading] = useState(false);
	const initialValues: ForgotPasswordInput = {
		email: '',
	};
	const { forgotPasswordValidationSchema } = useValidation();
	const formik = useFormik({
		initialValues,
		validationSchema: forgotPasswordValidationSchema,
		onSubmit: (values) => {
			setLoading(true);
			forgotPassword({
				variables: { email: values.email },
			})
				.then((res) => {
					const data = res.data as ForgotPasswordResponse;
					toast.success(t(data?.forgotPassword?.message));
					setLoading(false);
					formik.resetForm();
				})
				.catch((err) => {
					toast.error(err.networkError.result.errors[0].message);
					setLoading(false);
				});
		},
	});
	const login = useCallback(() => {
		navigate('/');
	}, [])
	return (
		<div className='flex w-full h-screen bg-white nm'>
			<img className='hidden object-cover object-left md:block md:w-1/2' src={LoginImg} alt='LoginImage' title='image' />
			<div className='flex items-center justify-center w-full p-5 md:w-1/2 md:p-12'>
				<form onSubmit={formik.handleSubmit} className='w-full max-w-[486px] bg-white'>
					<img className='max-w-[302px] mb-5 md:mb-7 w-full mx-auto' src={Logo} alt="logo" title='image' />
					<h1 className='mb-3 text-center md:mb-5 text-primary'>{t('Forgot Password')}</h1>
					<div className='mb-7 md:mb-10'>
						<TextInput label={t('Enter your e-mail address below to reset your password.')} placeholder={t('Email')} name='email' onChange={formik.handleChange} value={formik.values.email} error={formik.errors.email} />
					</div>
					<div>
						<Button type='submit' className='justify-center w-full mb-3 btn-primary btn-normal' disabled={loading} label={t('Submit')}  title={`${t('Submit')}`}  />
						<Button className='w-full btn-secondary btn-normal' onClick={login} label={t('Login')}  title={`${t('Login')}`} />
					</div>
				</form>
			</div>
		</div>
	);
};

export default ForgotPassword;
