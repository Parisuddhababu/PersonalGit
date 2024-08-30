import React, { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ROUTES } from '@config/constant';
import { toast } from 'react-toastify';
import { CHANGE_PASSWORD } from '@framework/graphql/mutations/profile';
import TextInput from '@components/input/TextInput';
import { CheckCircle, Cross } from '@components/icons';
import { t } from 'i18next';
import useValidation from '@components/hooks/validation';
import Button from '@components/button/button';

const UpdatePassword = () => {
	const navigate = useNavigate();
	const [changePassword] = useMutation(CHANGE_PASSWORD);
	/*initial values*/
	const initialValues = {
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	};
	/*cancel handler to change password handler*/
	const cancelPassWordHandler = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
	}, [navigate]);
	/*submit the values*/
	const { passwordValidation } = useValidation();

	const formik = useFormik({
		initialValues,
		validationSchema: Yup.object(passwordValidation),
		onSubmit: (values) => {
			changePassword({
				variables: {
					oldPassword: values.oldPassword.trim(),
					newPassword: values.newPassword.trim(),
					confirmPasssword: values.confirmPassword.trim(),
				},
			})
				.then((response) => {
					toast.success(response.data?.changeUserProfilePassword?.meta.message);
					cancelPassWordHandler();
				})
				.catch((error) => {
					toast.error(error);
				});
		},
	});

	return (
		<div>
			<div className=' mb-6 bg-white   border border-[#c8ced3] rounded-[0.25rem] shadow dark:bg-gray-800  mx-6'>
				<form onSubmit={formik.handleSubmit} className='max-w-full mx-auto'>
					{/* main div  */}
					<div className='p-5 '>
						<div className='flex justify-end'>
							<p>
								{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
							</p>
						</div>
						<h4 className='mb-3 text-l text-[1.4rem] font-[400]'>{t('Change Password')}</h4>
						{/* text inputs div  */}
						<div className='p-5 bg-white border-t border-gray-300   dark:bg-gray-800 dark:border-gray-700'>
							<div className='grid grid-cols-1 gap-6 mb-5 md:grid-cols-2 xl:grid-cols-2'>
								<div className='relative'>
									<TextInput id='oldPassword' placeholder={t('Current PassWord') as string} name='oldPassword' type='password' label={t('Current PassWord')} value={formik.values.oldPassword} onChange={formik.handleChange} error={formik.errors.oldPassword && formik.touched.oldPassword ? formik.errors.oldPassword : ''} required />
								</div>
								<div className='relative'>
									<TextInput id='newPassword' placeholder={t('New Password') as string} type='password' name='newPassword' label={t('New Password')} value={formik.values.newPassword} onChange={formik.handleChange} error={formik.errors.newPassword && formik.touched.newPassword ? formik.errors.newPassword : ''} required />
								</div>
								<div className='relative'>
									<TextInput id='confirmPassword' name='confirmPassword' type='password' label={t('Confirm Password')} value={formik.values.confirmPassword} onChange={formik.handleChange} placeholder={t('Confirm Password') as string} error={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : ''} required />
								</div>
							</div>
						</div>
					</div>
					<div className='border-t border-gray-300 bg-[#f0f3f5] px-5 py-3 '>
						<div className='flex btn-group '>
							<Button className='btn-primary btn-normal' label={t('Change Password')} type='submit'>
								<div className='mr-1 text-white'>
									<CheckCircle className='text-white' fontSize='12px' />
								</div>
							</Button>
							<Button className='btn-warning btn-normal' onClick={cancelPassWordHandler} label={t('Cancel')}>
								<Cross className='mr-1' />
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UpdatePassword;
