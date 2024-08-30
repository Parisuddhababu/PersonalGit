import React, { useCallback, useEffect, useState } from 'react';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import TextInput from '@components/textInput/TextInput';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { ChangeUserPasswordRes } from '@framework/graphql/graphql';
import { ChangeUserPassword } from 'src/types/user';
import { CHANGE_USER_PASSWORD } from '@framework/graphql/mutations/user';
import { Cross, Eye, EyeCrossed, Info } from '@components/icons/icons';
import useValidation from '@framework/hooks/validations';
const PassWordChange = ({ onClose, UserObj, show }: ChangeUserPassword) => {
	const { t } = useTranslation();
	const [changePasswordUser] = useMutation(CHANGE_USER_PASSWORD);
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [addClass, setAddClass] = useState(false);
	const { changeProfileValidationSchema } = useValidation();
	const initialValues = {
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	};



	const formik = useFormik({
		initialValues,
		validationSchema: changeProfileValidationSchema,
		onSubmit: (values) => {
			changePasswordUser({
				variables: {
					changeUserPasswordId: UserObj.id,
					oldPassword: values.oldPassword,
					newPassword: values.newPassword,
					confirmPasssword: values.confirmPassword,
				},
			})
				.then((res) => {
					const data = res.data as ChangeUserPasswordRes;
					if (data.changeUserPassword.meta.statusCode === 200) {
						toast.success(data.changeUserPassword.meta.message);
					} else {
						toast.error(data.changeUserPassword.meta.message);
					}
					onClose();
				})
				.catch(() => {
					toast.error(t('Failed to update'));
				});
		},
	});

	useEffect(() => {
		if (show) {
			setTimeout(() => {
				setAddClass(true);
			}, 100);
		}
	}, [show]);
	const handlesShowconformpassword = useCallback(() => {
		setShowConfirmPassword(!showConfirmPassword)
	}, [])
	const handleshowOldpassword = useCallback(() => {
		setShowOldPassword(!showOldPassword)
	}, [])
	const handleShowNewpassword = useCallback(() => {
		setShowNewPassword(!showNewPassword)
	}, [])

	return (
		<div className={`${show ? '' : 'hidden'} fixed top-0 left-0 right-0 z-50 h-full  bg-slate-200 bg-opacity-[2px] backdrop-blur-sm `}>
			<div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${addClass ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
				<div className='relative w-full max-w-2xl max-h-full '>
					{/* <!-- Modal content --> */}
					<div className='relative mt-10 bg-white rounded-sm shadow dark:bg-gray-700'>

						<div className='flex justify-between p-4 border-b rounded-t bg-primary '>
							<div className='flex items-center '>
								<Info className='inline-block mr-1 fill-white' fontSize='1.2em' />
								<span className='text-[1.09rem] font-medium text-white  dark:text-white'>{t('Change Password')}</span>
							</div>
							<Button onClick={onClose} label={''}  title={`${t('Close')}`} >
								<Cross className='my-1 text-red-500 ' />
							</Button>
						</div>{' '}

						<form className='px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md' onSubmit={formik.handleSubmit}>
							<div className='max-h-[calc(100vh-260px)] overflow-auto'>
								<div className='mb-4'>
									<div className='relative'>
										<div className='mb-2'>
											<label>{t('Old Password')} <span className='text-red-700'>*</span> </label>
										</div>
										<TextInput placeholder={t('Old Password')} name='oldPassword' type={showOldPassword ? 'text' : 'password'} onChange={formik.handleChange} value={formik.values.oldPassword} error={formik.errors.oldPassword} />
										<Button className='absolute right-3 top-1' onClick={handleshowOldpassword} label={''} title=''>
											<div className='mt-7'>
												{showOldPassword ? <Eye /> : <EyeCrossed />}
											</div>
										</Button>
									</div>
								</div>
								<div className='mb-4'>
									<div className='relative'>
										<div className='mb-2'>
											<label>{t('New Password')} <span className='text-red-700'>*</span> </label>
										</div>
										<TextInput placeholder={t('New Password')} name='newPassword' type={showNewPassword ? 'text' : 'password'} onChange={formik.handleChange} value={formik.values.newPassword} error={formik.errors.newPassword} />
										<Button className='absolute right-3 top-1 ' onClick={handleShowNewpassword} label={''} title=''>
											<div className='mt-7'>
												{showNewPassword ? <Eye /> : <EyeCrossed />}
											</div>
										</Button>
									</div>
								</div>
								<div className='mb-4'>
									<div className='relative'>
										<div className='mb-2'>
											<label>{t('Confirm Password')} <span className='text-red-700'>*</span> </label>
										</div>
										<TextInput placeholder={t('Confirm Password')} name='confirmPassword' type={showConfirmPassword ? 'text' : 'password'} onChange={formik.handleChange} value={formik.values.confirmPassword} error={formik.errors.confirmPassword} />
										<Button className='absolute right-3 top-1' onClick={handlesShowconformpassword} label={''} title=''>
											<div className='mt-4'>
												<div className='mt-3'>
													{showConfirmPassword ? <Eye /> : <EyeCrossed />}
												</div>
											</div>
										</Button>
									</div>
								</div>
							</div>

							<div className='flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b jus dark:border-gray-600'>
								<Button type='submit' className='btn-primary btn-normal' label={t('Submit')}  title={`${t('Submit')}`}  />
								<Button className='btn-warning btn-normal' onClick={onClose} label={t('Close')} title={`${t('Close')}`}  />
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PassWordChange;
