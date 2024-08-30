import React from 'react';
import Button from '@components/button/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import { Errors } from '@config/errors';
import { PASSWORD_REGEX } from '@config/regex';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { Cross } from '@components/icons';
import { ChangePassword } from 'src/types/common';
import { ChangePasswordUser } from 'src/types/user';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';

const PasswordChange = ({ onClose, onSubmitPassword }: ChangePasswordUser | ChangePassword) => {
	useEscapeKeyPress(() => onClose()); // use to close model on Eac key.
	const initialValues = {
		newPassword: '',
		confirmPassword: '',
	};

	const validationSchema = Yup.object({
		newPassword: Yup.string().required(Errors.PLEASE_ENTER_NEW_PASSWORD).matches(PASSWORD_REGEX, Errors.PASSWORD_MUST_CONTAIN_COMBINATION_CHARACTERS),
		confirmPassword: Yup.string()
			.required(Errors.PLEASE_ENTER_CONFIRM_PASSWORD)
			.oneOf([Yup.ref('newPassword'), ''], Errors.CONFIRM_PASSWORD_NOT_MATCH),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			onSubmitPassword(values);
		},
	});

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					<h4>Change Password</h4>
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}
				<form className='w-[90vw] md:w-[75vw] lg:w-[40vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='mb-4'>
							<TextInput placeholder='New password' name='newPassword' type='password' onChange={formik.handleChange} value={formik.values.newPassword} error={formik.errors.newPassword && formik.touched.newPassword ? formik.errors.newPassword : ''} />
						</div>
						<div className='mb-4'>
							<TextInput placeholder='Confirm new password' name='confirmPassword' type='password' onChange={formik.handleChange} value={formik.values.confirmPassword} error={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : ''} />
						</div>
					</div>
					{/* <!-- Modal footer --> */}
					<div className={cn(ModelStyle['model__footer'])}>
						<Button className='btn btn-primary btn-large min-w-[100px] justify-center' type='submit'>
							Update
						</Button>
						<Button className='btn btn-default btn-large min-w-[100px] justify-center' onClick={onClose}>
							Cancel
						</Button>
					</div>
					{/* <!-- Modal footer End --> */}
				</form>
			</div>
		</div>
	);
};

export default PasswordChange;
