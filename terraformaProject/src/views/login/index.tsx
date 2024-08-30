import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import LoginImg from '@assets/images/login-img.jpg';
import Logo from '@assets/images/logo.png';
import { ROUTES,USER_TYPE } from '@config/constant';
import Button from '@components/button/button';
import { Eye, EyeCrossed } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import { LoginResponse } from '@framework/graphql/graphql';
import { LOGIN_USER } from '@framework/graphql/mutations/user';
import useValidation from '@framework/hooks/validations';
import { LoginInput } from 'src/types/views';
import EncryptionFunction from 'src/services/encryption';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { setIntroductoryPage } from 'src/redux/user-profile-slice';
import { NavlinkReturnFunction } from '@utils/helpers';

const Login = () => {
	const { t } = useTranslation();
	const [login, loading] = useMutation(LOGIN_USER);
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const { loginValidationSchema } = useValidation();
	const initialValues: LoginInput = {
		email: '',
		password: '',
	};

	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues,
		validationSchema: loginValidationSchema,
		onSubmit: (values) => {
			login({
				variables: { login: { email: values.email, password: values.password } },
			})
				.then((res) => {

					const data = res?.data as LoginResponse;
					localStorage.setItem('userId', EncryptionFunction(data?.login?.data?.user?.uuid));
					localStorage.setItem('authToken', EncryptionFunction(data?.login?.data?.token));
					localStorage.setItem('profileName', EncryptionFunction(data?.login?.data?.user?.first_name));
					localStorage.setItem('userType',EncryptionFunction((data?.login?.data?.user?.user_type)?.toString()));
					if (data?.login?.data?.user?.is_required_reset_password) {
						dispatch(setIntroductoryPage(data?.login?.data?.user?.introductory_page))
						return navigate(`/${ROUTES.app}/${ROUTES.userProfilePasswordChange}`)
					}
					else {
						return navigate(NavlinkReturnFunction(data?.login?.data?.user?.user_type,USER_TYPE.SUPER_ADMIN,`/${ROUTES.app}/${ROUTES.dashboard}`,`/${ROUTES.app}/${ROUTES.subscriber}`));
					}
				})
				.catch((err) => {
					toast.error(err.networkError.result.errors[0].message);
				});
		},
	});

	const handleToggleShowPassword = useCallback(() => {
		setShowPassword((prevState) => !prevState);
	}, []);
	
	return (
		<div className='flex w-full h-screen bg-white nm'>
			<img className='hidden object-cover md:block md:w-1/2' src={LoginImg} alt='LoginImage' title='image' />
			<div className='flex items-center justify-center w-full px-5 md:w-1/2 md:px-12'>
				<form className='w-full max-w-[486px] bg-white' onSubmit={formik.handleSubmit}>
					<img className='max-w-[302px] mb-5 md:mb-7 w-full mx-auto' src={Logo} alt="logo" title='image' />
					<h1 className='mb-2 text-center md:mb-1 text-primary'>{t('Welcome')}  {':)'}</h1>
					<h6 className='mb-3 text-center md:mb-5'>{t('Login to Account')}</h6>
					<div className='mb-3 md:mb-5'>
						<TextInput placeholder={t('Email')} name='email' onChange={formik.handleChange} label={t('Email ID')} value={formik.values.email} error={formik.errors.email} loginInput={true} />
					</div>
					<div className='relative mb-5 md:mb-7'>
						<TextInput placeholder='Password' name='password' type={showPassword ? 'text' : 'password'} label={t('Password')} onChange={formik.handleChange} value={formik.values.password} error={formik.errors.password} loginInput={true} />
						<Button onClick={handleToggleShowPassword} className='absolute right-4 top-9 md:top-11' label={''}>
							{showPassword ? <Eye /> : <EyeCrossed />}
						</Button>
					</div>
					<div className='mb-5 text-right md:mb-7'>
						<a className='inline-block text-sm font-normal align-baseline text-primary hover:text-primary hover:underline hover:cursor-pointer'
							href='/forgot-password'
						>
							{t(' Forgot Password')}?
						</a>
					</div>
					<Button className='w-full btn-primary btn-normal btn-login' type='submit' label={t('Login')} disabled={loading?.loading} title="login"/>
				</form>
			</div>
		</div>
	);
};
export default Login;
