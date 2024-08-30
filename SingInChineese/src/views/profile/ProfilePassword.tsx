import React, { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import { Errors } from '@config/errors';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { useNavigate } from 'react-router-dom';
import { PASSWORD_REGEX } from '@config/regex';
import { ROUTES } from '@config/constant';
import { Key } from '@components/icons';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { destroyAuth } from '@utils/helpers';

enum FieldNames {
	oldPassword = 'oldPassword',
	newPassword = 'newPassword',
	confirmPassword = 'confirmPassword',
}

const ProfilePassword = () => {
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const initialValues = {
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	};

	/**
	 *
	 * @returns Method used for get validation for edit settings
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			oldPassword: Yup.string().required(Errors.PLEASE_ENTER_OLD_PASSWORD).matches(PASSWORD_REGEX, Errors.PASSWORD_MUST_CONTAIN_COMBINATION_CHARACTERS),
			newPassword: Yup.string().required(Errors.PLEASE_ENTER_NEW_PASSWORD).matches(PASSWORD_REGEX, Errors.PASSWORD_MUST_CONTAIN_COMBINATION_CHARACTERS),
			confirmPassword: Yup.string()
				.required(Errors.PLEASE_ENTER_CONFIRM_PASSWORD)
				.oneOf([Yup.ref('newPassword'), ''], Errors.CONFIRM_PASSWORD_NOT_MATCH),
		};

		return Yup.object<ObjectShape>(obj);
	};

	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			APIService.postData(`${URL_PATHS.changePassword}`, values)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						toast.success(response?.data?.message);
						destroyAuth();
						navigate(`/${ROUTES.login}`);
					}
					setLoading(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoading(false);
				});
		},
	});

	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
	}, []);

	return (
		<form className='w-full mb-3 bg-white shadow-lg rounded-lg p-3' onSubmit={formik.handleSubmit}>
			{loading && <Loader />}
			<div className='flex gap-3 mb-4 '>
				<div className=' w-full'>
					<div className='border-b p-3 flex items-center justify-between'>
						<h6 className='font-medium flex items-center'>
							<Key className='inline-block mr-2 text-primary' /> Change Password
						</h6>
					</div>
					<div className=' grid grid-cols-2 gap-x-4 p-3'>
						<div className='mb-4'>
							<TextInput name={FieldNames.oldPassword} placeholder='Current password' onChange={formik.handleChange} type='password' label='Current password' value={formik.values.oldPassword} error={formik.errors.oldPassword && formik.touched.oldPassword ? formik.errors.oldPassword : ''} required />
						</div>
						<div className='mb-4'>
							<TextInput name={FieldNames.newPassword} placeholder='New password' onChange={formik.handleChange} type='password' label='New password' value={formik.values.newPassword} error={formik.errors.newPassword && formik.touched.newPassword ? formik.errors.newPassword : ''} required />
						</div>

						<div className='mb-4'>
							<TextInput name={FieldNames.confirmPassword} placeholder='Confirm new password' onChange={formik.handleChange} type='password' label='Confirm new password' value={formik.values.confirmPassword} error={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : ''} required />
						</div>
					</div>
				</div>
			</div>
			<div className='md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-center p-3 '>
				<Button className='btn btn-primary btn-large' disabled={!!loading} type='submit'>
					Save
				</Button>
				<Button className='btn-default btn-large justify-center ml-3' onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</form>
	);
};
export default ProfilePassword;
