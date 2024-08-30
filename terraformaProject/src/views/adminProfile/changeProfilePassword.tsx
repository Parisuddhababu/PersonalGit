/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { ROUTES, USER_TYPE } from '@config/constant';
import Button from '@components/button/button';
import TextInput from '@components/textInput/TextInput';
import { Eye, EyeCrossed } from '@components/icons/icons';
import { useFormik } from 'formik';
import useValidation from '@framework/hooks/validations';
import { NavlinkReturnFunction, whiteSpaceRemover } from '@utils/helpers';
import LoginImg from '@assets/images/login-img.jpg';
import Logo from '@assets/images/logo.png';

import { useMutation } from '@apollo/client';
import { IS_REQUIRED_PASSWORD_CHANGE } from '@framework/graphql/mutations/forgotpassword';
import { useSelector } from 'react-redux';
import { UserProfileType } from 'src/types/common';

const UserProfilePasswordChange = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [changePassword] = useMutation(IS_REQUIRED_PASSWORD_CHANGE);
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { changePasswordValidationSchema } = useValidation();
	const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));

	const userType = userProfileData?.getProfile?.data?.user_type ?? ''
	const initialValues = {
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	};
	const { isIntroductoryPage } = useSelector(((state: { userProfile: { isIntroductoryPage: boolean | string } }) => state.userProfile));
	const cancelPassWordHandler = useCallback(() => {
		navigate(NavlinkReturnFunction(userType,USER_TYPE.SUPER_ADMIN,`/${ROUTES.app}/${ROUTES.dashboard}`,`/${ROUTES.app}/${ROUTES.subscriber}`));
	}, []);


	const formik = useFormik({
		initialValues,
		validationSchema: changePasswordValidationSchema,
		onSubmit: (values) => {
			changePassword({
				variables: {
					userData: {
						oldPassword: values.oldPassword,
						newPassword: values.newPassword,
					}
				},
			})
				.then((response) => {
					toast.success(response?.data?.message);
					if (!isIntroductoryPage && userType === USER_TYPE.SUBSCRIBER_ADMIN) {
						return navigate(`/${ROUTES.introductory}`)
					}
					else {
						navigate(NavlinkReturnFunction(userType,USER_TYPE.SUPER_ADMIN,`/${ROUTES.app}/${ROUTES.dashboard}`,`/${ROUTES.app}/${ROUTES.subscriber}`));
					}
					cancelPassWordHandler();
				})
				.catch((error) => {
					toast.error(error.networkError.result.errors[0].message);
				});
		},
	});

	useEffect(() => {
		if (!userProfileData?.getProfile?.data?.is_required_reset_password && userProfileData?.getProfile?.data?.introductory_page && userType !== USER_TYPE.SUBSCRIBER_ADMIN) {
			return navigate(NavlinkReturnFunction(userType,USER_TYPE.SUPER_ADMIN,`/${ROUTES.app}/${ROUTES.dashboard}`,`/${ROUTES.app}/${ROUTES.subscriber}`))
		}
		else if (!userProfileData?.getProfile?.data?.is_required_reset_password && !userProfileData?.getProfile?.data?.introductory_page && userType === USER_TYPE.SUBSCRIBER_ADMIN) {
			return navigate(`/${ROUTES.introductory}`)
		}
	}, [userProfileData])

	const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	const handleShowPassword = useCallback(() => {
		setShowOldPassword((prevState) => !prevState);
	}, []);

	const handleShowNewPassword = useCallback(() => {
		setShowNewPassword((prevState) => !prevState);
	}, []);

	const handleConfirmPassword = useCallback(() => {
		setShowConfirmPassword((prevState) => !prevState);
	}, []);

	return (
		<div className='flex w-full h-screen bg-white nm'>
			<img className='hidden object-cover md:block md:w-1/2' src={LoginImg} alt='LoginImage' title='loginimage' height={981} width={961} />
			<div className='flex items-center justify-center w-full px-5 md:w-1/2 md:px-12'>
				<form className='w-full max-w-[486px] bg-white' onSubmit={formik.handleSubmit}>
					<picture>
						<img className='max-w-[302px] mb-5 md:mb-[30px] w-full mx-auto' src={Logo} alt="logo" title='logo' height={80} width={302} />
					</picture>
					<h1 className='mb-3 text-center md:mb-5 text-primary'>{t('Change Your Password')}</h1>
					<div className='relative mb-3 md:mb-5'>
						<TextInput required={true} id='oldPassword' onBlur={OnBlur} type={showOldPassword ? 'text' : 'password'} label={t('Current Password')} value={formik.values.oldPassword} onChange={formik.handleChange} placeholder={t('Current Password')!} />
						<Button className='absolute bg-transparent right-3 top-11' onClick={handleShowPassword} label={''} title=''>
							{showOldPassword ? <Eye className='text-light-grey' /> : <EyeCrossed className='text-light-grey' />}
						</Button>
						{formik.touched.newPassword && formik.errors.oldPassword && <p className='text-red-400'>{formik.errors.oldPassword}</p>}
					</div>

					<div className='relative mb-3 md:mb-5'>
						<TextInput required={true} onBlur={OnBlur} id='newPassword' type={showNewPassword ? 'text' : 'password'} label={t('New Password')} value={formik.values.newPassword} onChange={formik.handleChange} placeholder={t('New Password')!} />
						<Button onClick={handleShowNewPassword} className='absolute bg-transparent right-3 top-11' label={''} title=''>
							{showNewPassword ? <Eye className='text-light-grey' /> : <EyeCrossed className='text-light-grey' />}
						</Button>
						{formik.touched.newPassword && formik.errors.newPassword && <p className='text-red-400'>{formik.errors.newPassword}</p>}
					</div>

					<div className='relative mb-5 md:mb-[30px]'>
						<TextInput required={true} onBlur={OnBlur} id='confirmPassword' type={showConfirmPassword ? 'text' : 'password'} label={t('Re-enter New Password')} value={formik.values.confirmPassword} onChange={formik.handleChange} placeholder={t('Re-enter New Password')!} />
						<Button onClick={handleConfirmPassword} className='absolute bg-transparent right-3 top-11' label={''} title=''>
							{showConfirmPassword ? <Eye className='text-light-grey' /> : <EyeCrossed className='text-light-grey' />}
						</Button>
						{formik.touched.confirmPassword && formik.errors.confirmPassword && <p className='text-red-400'>{formik.errors.confirmPassword}</p>}
					</div>
					<Button className='w-full btn-primary btn-normal btn-login' type='submit' label={t('Update Password')} 
					title={`${t('Update Password')}`} />
				</form>
			</div>
		</div>
	);
};

export default UserProfilePasswordChange;
