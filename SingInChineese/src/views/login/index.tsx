import React, { useEffect, useState } from 'react';
import TextInput from '@components/textInput/TextInput';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PASSWORD_MAX_LIMIT, ROUTES } from '@config/constant';
import { LoginInput } from 'src/types/views';
import Button from '@components/button/Button';
import AuthClasses from '@pageStyles/Auth.module.scss';
import cn from 'classnames';
import { Errors } from '@config/errors';
import logo from '@assets/images/logo.png';
import CheckBox from '@components/checkbox/CheckBox';
import { Check, Email, Lock } from '@components/icons';
import { URL_PATHS } from '@config/variables';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';

const Login = () => {
	const navigate = useNavigate();
	const [checked, setChecked] = useState(false);
	const [loadingLogin, setLoadingLogin] = useState(false);

	/**
	 * Conditon to check the hostname
	 */
	const isDevAdminB2B = window.location.hostname.includes('b2b');

	const initialValues: LoginInput = {
		email: '',
		password: '',
	};
	const validationSchema = Yup.object({
		email: Yup.string().email(Errors.PLEASE_ENTER_VALID_EMAIL).required(Errors.PLEASE_ENTER_YOUR_REGISTERED_EMAIL),
		password: Yup.string().required(Errors.PLEASE_ENTER_PASSWORD).max(PASSWORD_MAX_LIMIT, Errors.PASSWORD_CHARACTERS_LIMIT),
	});

	/**
	 * Method used for set the checkbox
	 */
	const onChangeCheckBox = () => {
		setChecked(!checked);
	};

	/**
	 * Method used for setValue from login  data by email,password
	 */
	useEffect(() => {
		if (localStorage.getItem('rememberMe') === 'true') {
			formik.setFieldValue('email', localStorage.getItem('email'));
			formik.setFieldValue('password', localStorage.getItem('password'));
			setChecked(true);
		} else {
			localStorage.removeItem('email');
			localStorage.removeItem('password');
			localStorage.removeItem('rememberMe');
		}
	}, []);

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			setLoadingLogin(true);
			localStorage.setItem('rememberMe', checked ? 'true' : 'false');
			if (checked) {
				localStorage.setItem('email', values.email);
				localStorage.setItem('password', values.password);
			}
			APIService.postData(URL_PATHS.login, {
				email: values.email,
				password: values.password,
				isForB2B: !!isDevAdminB2B,
			})
				.then((response) => {
					if (response.status === ResponseCode.success) {
						toast.success(response.data.message);
						localStorage.setItem('authToken', response.data.data.token);
						localStorage.setItem('userDetails', JSON.stringify(response.data.data.userDetails));
						localStorage.setItem('permissions', JSON.stringify(response.data.data.userDetails.permissions));
						localStorage.setItem('role', response.data.data.userDetails.userType);
						navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
					}
					setLoadingLogin(false);
				})
				.catch((err) => {
					toast.error(err.response.data.message);
					setLoadingLogin(false);
				});
		},
	});

	/**
	 *Conditon to apply the background image based on hostname
	 */
	const wrapperClass = cn(AuthClasses['auth-wrapper'], {
		[AuthClasses['dev-sing-learning']]: !isDevAdminB2B,
		[AuthClasses['dev-sing-learning-b2b']]: isDevAdminB2B,
	});

	return (
		<div className={wrapperClass}>
			<figure>
				<img src={logo} alt='Logo' className='mb-10 lg:max-w-[200px] max-w-[150px]' />
			</figure>
			<div className={cn(AuthClasses['auth-box'])}>
				<form onSubmit={formik.handleSubmit}>
					<h3 className={cn(AuthClasses['auth-box-heading'])}>Login</h3>
					{/* <h5 className='text-gray-600 mb-4'>Sign In to your account</h5> */}
					<div className='mb-4'>
						<TextInput label='Enter Email' placeholder='Email' name='email' onChange={formik.handleChange} value={formik.values.email} error={formik.errors.email && formik.touched.email ? formik.errors.email : ''} inputIcon={<Email />} required />
					</div>
					<div className='mb-3'>
						<TextInput label='Enter Password' placeholder='*****' name='password' type='password' onChange={formik.handleChange} value={formik.values.password} error={formik.errors.password && formik.touched.password ? formik.errors.password : ''} inputIcon={<Lock />} required />
					</div>
					<div className='mb-6'>
						<ul className='text-gray-400'>
							<li>
								<Check className='text-gray-500 mr-2' />
								at least 8 letters, a capital letter, numbers and special characters allowed
							</li>
							<li>
								<Check className='text-gray-500 mr-2' /> no space
							</li>
							<li>
								<Check className='text-gray-500 mr-2' /> no emoji
							</li>
						</ul>
					</div>
					<div className='flex items-center justify-between mb-6'>
						<CheckBox option={[{ id: 'remember', name: 'Remember Me', value: 'Remember me', checked: checked, onChange: () => onChangeCheckBox() }]} />
						<Link to={`/${ROUTES.forgotPassword}`} className='inline-block align-baseline font-bold text-sm text-primary'>
							Forgot Password?
						</Link>
					</div>
					<Button type='submit' className={`btn btn-primary btn-large ${loadingLogin ? 'loading' : ''}`} disabled={loadingLogin}>
						Sign In
					</Button>
				</form>
			</div>
		</div>
	);
};
export default Login;
