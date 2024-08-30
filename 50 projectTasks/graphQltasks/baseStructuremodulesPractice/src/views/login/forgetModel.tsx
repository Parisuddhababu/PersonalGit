import { useMutation } from '@apollo/client';
import Button from '@components/button/button';
import { Close } from '@components/icons/index';
import TextInput from '@components/input/TextInput';
import { USER_FORGOT_PASSWORD } from '@framework/graphql/mutations/user';
import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ForgotPasswordInput } from 'src/types/views';
import { ForgetModelProps } from 'src/types/common';
import * as Yup from 'yup';

const ForgetModel = ({ onClose, onSubmit, show }: ForgetModelProps) => {
	const [forgotPassword] = useMutation(USER_FORGOT_PASSWORD);
	const { t } = useTranslation();
	const [addClass, setAddClass] = useState(false);
	const initialValues: ForgotPasswordInput = {
		email: '',
	};
	const validationScema = Yup.object({
		email: Yup.string()
			.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,}/, t('Please Enter Valid Mail') as string)
			.required(t('Please enter email') as string)
			.trim(),
	});
	useEffect(() => {
		if (show) {
			setTimeout(() => {
				setAddClass(true);
			}, 100);
		}
	}, [show]);

	const formik = useFormik({
		initialValues,
		validationSchema: validationScema,
		onSubmit: (values) => {
			forgotPassword({
				variables: values,
			})
				.then((res) => {
					const data = res.data;
					if (data?.forgotPassword?.meta.statusCode === 200) {
						toast.success(t(data?.forgotPassword?.meta?.message));
					} else {
						toast.error(t(data?.forgotPassword?.meta?.message));
					}
					formik.resetForm();
				})
				.catch(() => {
					toast.error(t('Failed to Forgot Password'));
				});
			onSubmit();
		},
	});
	return (
		<>
			<div className={`${show ? '' : 'hidden'} fixed top-0 left-0 right-0 z-50 h-full  bg-slate-200 bg-opacity-[2px] backdrop-blur-sm `}>
				<div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={` pt-10 flex justify-center ${addClass ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
					<div className=' max-h-full '>
						{/* <!-- Modal content --> */}
						<div className='relative bg-white rounded-sm shadow dark:bg-gray-700 min-w-[500px] '>
							<div className='flex items-start justify-between p-4 border-b rounded-t bg-primary '>
								<div className='flex'>
									<h3 className='text-xl font-semibold text-white dark:text-white'>Forget Password</h3>
								</div>
								<Button onClick={onClose} label={''}>
									<Close className='mr-1 fill-red-500' />
								</Button>
							</div>
							<div className=''>
								<form onSubmit={formik.handleSubmit}>
									<div className='mb-4 p-3'>
										<TextInput label={t('Enter your e-mail address below to reset your password.')} placeholder={t('Email')!} name='email' onChange={formik.handleChange} value={formik.values.email} error={formik.errors.email} />
									</div>
									<div className='btn-group flex justify-end px-4 pb-4'>
										<Button type='submit' className='btn-primary btn-normal ' disabled={formik.values.email === '' || formik.errors.email ? true : false} label={t('Submit')} />
										<Button className='hover:bg-gray-400 btn-gray btn-normal ' onClick={onClose} label={t('Close')} />
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ForgetModel;
