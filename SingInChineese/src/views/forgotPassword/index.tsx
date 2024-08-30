import React, { useState } from 'react';
import TextInput from '@components/textInput/TextInput';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ROUTES } from '@config/constant';
import { ForgotPasswordInput } from 'src/types/views';
import Button from '@components/button/Button';
import AuthClasses from '@pageStyles/Auth.module.scss';
import cn from 'classnames';
import { Errors } from '@config/errors';
import logo from '@assets/images/logo.png';
import { URL_PATHS } from '@config/variables';
import { Email } from '@components/icons';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';

const ForgotPassword = () => {
	const [loadingForgetPassword, setLoadingForgetPassword] = useState(false);
	const initialValues: ForgotPasswordInput = {
		email: '',
	};

	const validationSchema = Yup.object({
		email: Yup.string().email(Errors.PLEASE_ENTER_VALID_EMAIL).required(Errors.PLEASE_ENTER_YOUR_REGISTERED_EMAIL),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			setLoadingForgetPassword(true);
			APIService.postData(URL_PATHS.forgotPassword, {
				email: values.email,
			})
				.then((response) => {
					if (response.status === ResponseCode.success) {
						toast.success(response.data.message);
						formik.resetForm();
					} else {
						toast.error(response.data.message);
					}
					setLoadingForgetPassword(false);
				})
				.catch((err) => {
					toast.error(err.response.data.message);
					setLoadingForgetPassword(false);
				});
		},
	});

	return (
		<div className={cn(AuthClasses['auth-wrapper'])}>
			<figure>
				<img src={logo} alt='Logo' className='mb-10 lg:max-w-[200px] max-w-[150px]' />
			</figure>
			<div className={cn(AuthClasses['auth-box'])}>
				<form onSubmit={formik.handleSubmit}>
					<h3 className={cn(AuthClasses['auth-box-heading'])}>Forgot Password</h3>
					<div className='mb-4'>
						<TextInput label='Enter Email' placeholder='abc@domain.com' name='email' onChange={formik.handleChange} value={formik.values.email} error={formik.errors.email && formik.touched.email ? formik.errors.email : ''} inputIcon={<Email />} required />
					</div>
					<div className='flex items-center justify-between'>
						<Button type='submit' className={`btn btn-primary btn-large ${loadingForgetPassword ? 'loading' : ''}`} disabled={!!loadingForgetPassword}>
							Send Recovery
						</Button>
						<Link to={`/${ROUTES.login}`} className='inline-block align-baseline font-bold text-sm text-primary'>
							Login?
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};
export default ForgotPassword;
