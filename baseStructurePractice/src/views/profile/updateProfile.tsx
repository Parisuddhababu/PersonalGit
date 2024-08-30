import React, { useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_USER_PROFILE } from '@framework/graphql/mutations/profile';
import { GET_PROFILE_INFORMATION } from '@framework/graphql/queries/profile';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/input/TextInput';
import { ROUTES } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UpdatePassword from './changePassword';
import { CheckCircle, Cross } from '@components/icons';
import useValidation from '@components/hooks/validation';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';

const UpdateAdmin = () => {
	const { data: userData } = useQuery(GET_PROFILE_INFORMATION);
	const navigate = useNavigate();
	const [updateProfile] = useMutation(UPDATE_USER_PROFILE, {
		refetchQueries: [{ query: GET_PROFILE_INFORMATION }],
	});
	const { t } = useTranslation();

	/*initial values*/

	const initialValues = {
		firstName: '',
		lastName: '',
		userName: '',
		email: '',
	};

	const { updateprofileValidation } = useValidation();

	/*submit the values*/
	const formik = useFormik({
		initialValues,
		validationSchema: Yup.object(updateprofileValidation),

		onSubmit: async (values) => {
			updateProfile({
				variables: {
					firstName: values.firstName,
					lastName: values.lastName,
					email: values.email,
					userName: values.userName,
				},
			})
				.then((res) => {
					const data = res.data;
					if (data?.updateUserProfile.meta?.statusCode === 200) {
						toast.success(data?.updateUserProfile.meta.message);
					}
				})
				.catch(() => {
					toast.error(t('Failed to update'));
				});
		},
	});
	/*cancel handler to change password handler*/
	const cancelHandler = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
	}, [navigate]);
	/*handler for onchange values*/
	const handleInputChange = useCallback(
		(event: { target: { name: string; value: string } }) => {
			const { name, value } = event.target;
			formik.setFieldValue(name, value);
		},
		[formik]
	);

	/*get updated user values */
	useEffect(() => {
		if (userData) {
			const data = userData?.getProfileInformation?.data;
			formik.setValues({
				firstName: data?.first_name.trim(),
				lastName: data?.last_name.trim(),
				userName: data?.user_name.trim(),
				email: data?.email.trim(),
			});
		}
	}, [userData]);

	return (
		<>
			{/* main div  */}
			<div>
				<div className=' mb-6 bg-white   border border-[#c8ced3] rounded-[0.25rem] shadow dark:bg-gray-800 mx-6'>
					<form onSubmit={formik.handleSubmit}>
						<div className='flex justify-end '>
							<p className='mb-2 mt-3 mr-3'>
								{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
							</p>
						</div>
						<h4 className='mb-3 text-l text-[1.4rem] font-[400] px-5'>{t('Profile Information')}</h4>
						{/* inputs div  */}
						<div className='p-5 bg-white border-t border-gray-300   dark:bg-gray-800 dark:border-gray-700'>
							<div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2'>
								<div>
									<TextInput placeholder={t('First Name') as string} type='text' label={t('First Name')} id='firstName' name='firstName' value={formik.values.firstName} onChange={handleInputChange} error={formik.errors.firstName && formik.touched.firstName ? formik.errors.firstName : ''} required />
								</div>

								<div>
									<TextInput placeholder={t('Last Name') as string} type='text' id='lastName' name='lastName' label={t('Last Name')} value={formik.values.lastName} onChange={handleInputChange} error={formik.errors.lastName && formik.touched.lastName ? formik.errors.lastName : ''} required />
								</div>
								<div>
									<TextInput type='text' id='userName' name='userName' label={t('UserName')} disabled value={formik.values.userName} />
								</div>
								<div>
									<TextInput disabled type='text' id='email' name='email' label={t('Email')} value={formik.values.email} />
								</div>
							</div>
						</div>
						{/* buttons div  */}
						<div className='border-t border-gray-300 bg-[#f0f3f5] px-5 py-3 '>
							<div className='flex btn-group'>
								<Button className='btn-primary btn-normal' label={t('Update Profile')} type='submit'>
									<div className='mr-1 text-white'>
										<CheckCircle className='text-white' fontSize='12px' />
									</div>
								</Button>
								<Button className='btn-warning btn-normal' onClick={cancelHandler} label={t('Cancel')}>
									<Cross className='mr-1' />
								</Button>
							</div>
						</div>
					</form>
				</div>
			</div>

			<UpdatePassword />
		</>
	);
};

export default UpdateAdmin;
