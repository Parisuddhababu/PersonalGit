import React, { useEffect, useState } from 'react';
import TextInput from '@components/textInput/TextInput';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ROUTES } from '@config/constant';
import { ResetPasswordInput } from 'src/types/views';
import Button from '@components/button/Button';
import AuthClasses from '@pageStyles/Auth.module.scss';
import cn from 'classnames';
import { Errors } from '@config/errors';
import logo from '@assets/images/logo.png';
import { URL_PATHS } from '@config/variables';
import { Check, Lock } from '@components/icons';
import { PASSWORD_REGEX } from '@config/regex';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { destroyAuth } from '@utils/helpers';

const ResetPassword = () => {
	destroyAuth();
	const search = useLocation().search;
	const token = new URLSearchParams(search).get('token');
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const initialValues: ResetPasswordInput = {
		password: '',
		confirmPassword: '',
	};

	const validationSchema = Yup.object({
		password: Yup.string().min(8, Errors.PASSWORD_MUST_BE_EIGHT_CHARACTERS).matches(PASSWORD_REGEX, Errors.PASSWORD_MUST_CONTAIN_COMBINATION_CHARACTERS).required(Errors.PLEASE_ENTER_PASSWORD),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('password'), ''], Errors.CONFIRM_PASSWORD_NOT_MATCH)
			.required(Errors.PLEASE_ENTER_CONFIRM_PASSWORD),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			setLoading(true);
			APIService.postData(`${URL_PATHS.resetPassword}${token}`, {
				password: values.password,
				confirmPassword: values.confirmPassword,
			})
				.then((response) => {
					if (response.status === ResponseCode.success) {
						toast.success(response.data.message);
						navigate(`/${ROUTES.login}`);
					} else {
						toast.error(response.data.message);
					}
					setLoading(false);
				})
				.catch((err) => {
					toast.error(err.response.data.message);
					setLoading(false);
				});
		},
	});

	useEffect(() => {
		if (!token) {
			toast.error(Errors.TOKEN_IS_MISSING);
		}
	}, []);

	return (
		<div className={cn(AuthClasses['auth-wrapper'])}>
			<figure>
				<img src={logo} alt='Logo' className='mb-10 lg:max-w-[200px] max-w-[150px]' />
			</figure>
			<div className={cn(AuthClasses['auth-box'])}>
				<form onSubmit={formik.handleSubmit}>
					<h3 className={cn(AuthClasses['auth-box-heading'])}>Reset Password</h3>
					<div className='mb-4'>
						<TextInput label='Password' placeholder='*****' name='password' type='password' onChange={formik.handleChange} value={formik.values.password} error={formik.errors.password && formik.touched.password ? formik.errors.password : ''} inputIcon={<Lock />} required />
					</div>
					<div className='mb-6'>
						<TextInput label='Confirm Password' placeholder='*****' name='confirmPassword' type='password' onChange={formik.handleChange} value={formik.values.confirmPassword} error={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : ''} inputIcon={<Lock />} required />
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
					<div className='flex items-center justify-between'>
						<Button type='submit' className={`btn btn-primary btn-large ${loading ? 'loading' : ''}`} disabled={loading}>
							Reset
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
export default ResetPassword;
