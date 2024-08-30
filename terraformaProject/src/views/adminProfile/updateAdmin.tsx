import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/button';
import { CheckCircle, Cross } from '@components/icons/icons';
import { UPDATE_ADMIN_PROFILE } from '@framework/graphql/mutations/admin';
import { GET_ADMIN } from '@framework/graphql/queries/admin';
import { useFormik } from 'formik';
import { ROUTES, USER_TYPE } from '@config/constant';
import { updateUserProfile } from '@framework/graphql/graphql';
import useValidation from '@framework/hooks/validations';
import { t } from 'i18next';
import { NavlinkReturnFunction, whiteSpaceRemover } from '@utils/helpers';

import { useMutation, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { UserProfileType } from 'src/types/common';

const UpdateProfileForm = () => {
	const { data: adminData } = useQuery(GET_ADMIN);
	const navigate = useNavigate();
	const [updateUserProfile] = useMutation(UPDATE_ADMIN_PROFILE, {
		refetchQueries: [{ query: GET_ADMIN }],
	});
	const { updateAdminValidationSchema } = useValidation();
	const { userProfileData } = useSelector(
		(state: { userProfile: { userProfileData: UserProfileType; } }) => state.userProfile,
	);
	const userType = userProfileData?.getProfile?.data?.user_type ?? '';

	useEffect(() => {
		if (adminData) {
			const data = adminData?.getProfileInformation?.data;
			formik.setValues({
				firstName: data?.first_name,
				lastName: data?.last_name,
				userName: data?.user_name,
				email: data?.email,
			});
		}
	}, [adminData]);

	const initialValues = {
		firstName: '',
		lastName: '',
		userName: '',
		email: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: updateAdminValidationSchema,

		onSubmit: async (values) => {
			updateUserProfile({
				variables: {
					firstName: values.firstName,
					lastName: values.lastName,
					email: values.email,
					userName: values.userName,
				},
		
			})
				.then((res) => {
					const data = res.data as updateUserProfile;
					if (data?.updateUserProfile.meta?.statusCode === 200) {
						toast.success(data?.updateUserProfile.meta.message);
					}
				})
				.catch(() => {
					toast.error(t('Failed to update'));
				});
				
				localStorage.setItem('valuesList',(values.firstName))
				localStorage.setItem('valuesListLastName',(values.lastName))
				},
	});

	const cancelUpdateHandler = useCallback(() => {
		navigate(NavlinkReturnFunction(userType,USER_TYPE.SUPER_ADMIN,`/${ROUTES.app}/${ROUTES.dashboard}`,`/${ROUTES.app}/${ROUTES.subscriber}`));
	}, []);

	const handleInputChange = useCallback((event: { target: { name: string; value: string } }) => {
		const { name, value } = event.target;
		formik.setFieldValue(name, value);
	}, []);
	const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	return (
		<>
			<div>
				<div className=' mb-6 bg-white   border border-[#c8ced3] rounded-[0.25rem] shadow'>
					<form  onSubmit={formik.handleSubmit}>
						<div className='flex justify-end '>
							<p className='mb-2 mt-3 mr-3'>
								{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
							</p>
						</div>
						<h4 className='mb-3 text-l text-[1.4rem] font-[400] px-5'>{t('Profile Information')}</h4>
						<div className='p-5 bg-white border-t border-gray-300'>
							<div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2'>
								<div>
									<TextInput required={true}  onBlur={OnBlur} placeholder={t('First Name')} type='text' label={t('First Name')} id='firstName' name='firstName' value={formik.values.firstName} onChange={handleInputChange} />
									{formik.touched.firstName && formik.errors.firstName && <p className='text-red-400'>{formik.errors.firstName}</p>}
								</div>
								<div>
									<TextInput required={true}  onBlur={OnBlur} placeholder={t('Last Name')} type='text' id='lastName' name='lastName' label={t('Last Name')} value={formik.values.lastName} onChange={handleInputChange} />
									{formik.touched.lastName && formik.errors.lastName && <p className='text-red-400'>{formik.errors.lastName}</p>}
								</div>
								<div>
									<TextInput placeholder='' type='text' id='userName' name='userName' label={t('Username')} disabled value={formik.values.userName} />
								</div>
								<div>
									<TextInput placeholder='' disabled type='text' id='email' name='email' label={t('Email')} value={formik.values.email} />
								</div>
							</div>
						</div>

						<div className='border-t border-gray-300 bg-[#f0f3f5] px-5 py-3 '>
							<div className='flex btn-group'>
								<Button className='btn-primary btn-normal' label={t('Update Profile')} type='submit' 
								title={`${t('Update Profile')}`}>
									<div className='mr-2'>
									<CheckCircle />
									</div>
								</Button>
								<Button className='btn-warning btn-normal  ' label={t('Cancel')} onClick={cancelUpdateHandler} 
								title={`${t('Cancel')}`}>
									<Cross className='mr-1' />
								</Button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default UpdateProfileForm;
