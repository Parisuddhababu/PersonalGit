import React, { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import TextInput from '@components/input/TextInput';
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
import ForgetModel from './forgetModel';

const Login = () => {
	const [login] = useMutation(LOGIN_USER);
	const navigate = useNavigate();
	const [isShowForgetModel, setIsForgetShowModel] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	const initialValues: LoginInput = {
		email: '',
		password: '',
	};

	useEffect(() => {
		const rememberMeValue = localStorage.getItem('rememberMe');
		if (rememberMeValue === 'true') {
			setRememberMe(true);
			// Set the formik values with saved email and password
			const savedEmail = localStorage.getItem('savedEmail');
			const savedPassword = localStorage.getItem('savedPassword');
			formik.setValues({
				...formik.values,
				email: savedEmail || '',
				password: savedPassword || '',
			});
		}
	}, []);

	const { loginValidation } = useValidation();
	const formik = useFormik({
		initialValues,
		validationSchema: Yup.object(loginValidation),
		onSubmit: async (values) => {
			localStorage.setItem('rememberMe', rememberMe.toString());
			// Save the email and password if rememberMe is checked
			if (rememberMe) {
				localStorage.setItem('savedEmail', values.email);
				localStorage.setItem('savedPassword', values.password);
			} else {
				// Clear saved email and password
				localStorage.removeItem('savedEmail');
				localStorage.removeItem('savedPassword');
			}
			// Encrypt data
			const secretKey = 'mySecretKey';

			const encryptedData = (text: string) => {
				const encrypt = CryptoJS.AES.encrypt(JSON.stringify(text), secretKey).toString();
				return encrypt;
			};

			try {
				const res = await login({
					variables: values,
				});

				const data = res.data;

				if (data.loginUser.meta.statusCode === 200) {
					toast.success(data.loginUser.meta.message);
					localStorage.setItem('authToken', encryptedData(data.loginUser.data.token));
					navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
				} else {
					toast.error(data.loginUser.meta.message);
				}
			} catch (error) {
				toast.error(t('Failed to login'));
			}
		},
	});
	const onClose = useCallback(() => {
		setIsForgetShowModel(false);
	}, []);
	const onSubmit = useCallback(() => {
		setIsForgetShowModel(false);
	}, []);

	const rememberHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRememberMe(event.target.checked);
	};

	return (
		<React.Fragment>
			<div className='flex h-[100%] justify-center items-center '>
				<div className='w-full sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px]  px-4 '>
					<div className='w-full flex items-center justify-center mt-28 m-auto'>
						<form className='w-full md:w-[500px] lg:w-[540px] bg-white shadow-md rounded p-[2.5rem] ' onSubmit={formik.handleSubmit}>
							<h3 className='text-gray-800 mb-[0.5rem] font-[500] '>{t('Login')}</h3>
							<p className='text-[#73818f] mb-4 '>{t('Sign In to your account')}</p>
							<div className='mb-[1rem]'>
								<TextInput placeholder={'Email'} name='email' onChange={formik.handleChange} value={formik.values.email} error={formik.errors.email} />
							</div>

							{/* password  */}
							<div className='relative mb-[1rem] '>
								<TextInput id='oldPassword' placeholder={t('Current PassWord') as string} name='password' type='password' label={t('Current PassWord')} value={formik.values.password} onChange={formik.handleChange} error={formik.errors.password && formik.touched.password ? formik.errors.password : ''} required />
							</div>

							{/* password  */}

							<div className='flex items-center justify-between mb-[0.75rem] '>
								<div className='flex items-center mr-2 '>
									<input id='default-checkbox' type='checkbox' value='' checked={rememberMe} className='w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-200 dark:focus:ring-red-300 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' onChange={rememberHandler} />
									<label htmlFor='default-checkbox' className='ml-2 text-sm font-[400] text-[#23282c] hover:cursor-pointer dark:text-gray-300'>
										{t('Remember me')}
									</label>
								</div>
								<a
									className='inline-block font-[400] align-baseline text-sm 
							text-primary hover:text-primary	 hover:underline hover:cursor-pointer'
									href='#'
									onClick={() => {
										setIsForgetShowModel(true);
									}}
								>
									{t(' Forgot Password')}?
								</a>
							</div>

							<Button type='submit' className='btn btn-primary' label={t('Sign In')}></Button>
						</form>
					</div>
				</div>
			</div>
			{isShowForgetModel && <ForgetModel show={isShowForgetModel} onClose={onClose} onSubmit={onSubmit} />}
		</React.Fragment>
	);
};
export default Login;
