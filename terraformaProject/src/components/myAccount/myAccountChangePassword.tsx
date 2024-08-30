import { useMutation } from '@apollo/client';
import Button from '@components/button/button';
import { Check, Eye, EyeCrossed } from '@components/icons/icons'
import TextInput from '@components/textInput/TextInput'
import { CHANGE_USERPROFILE_PASSWORD } from '@framework/graphql/mutations/admin';
import { whiteSpaceRemover } from '@utils/helpers';
import { useFormik } from 'formik';
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useValidation from '@framework/hooks/validations';
interface SetPasswordToggle {
	showOldPassword: boolean;
	showNewPassword: boolean;
	showConfirmPassword: boolean;
}

function MyAccountChangePassword() {
    const { t } = useTranslation();
	const [updatePass, setUpdatePass] = useState(false);
    const { changePasswordValidationSchema } = useValidation();
    const [passwordHideShow, setPasswordHideShow] = useState<SetPasswordToggle>({
		showOldPassword: false,
		showNewPassword: false,
		showConfirmPassword: false
	});
	const [changeUserProfilePassword] = useMutation(CHANGE_USERPROFILE_PASSWORD);
    const initialValues = {
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	};

    const formik = useFormik({
        validationSchema: changePasswordValidationSchema,
		initialValues,
		onSubmit: async (values) => {
			changeUserProfilePassword({
				variables: {
					userData: {
						oldPassword: values.oldPassword,
						newPassword: values.newPassword,
					}
				},
			})
				.then((response) => {
					toast.success(response?.data?.changePassword?.message);
					setUpdatePass(true)
                    formik.resetForm()
				})
				.catch((error) => {
					toast.error(error.networkError.result.errors[0].message);
				});
		},
	});

    const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

    return (
        <>
            <div className='border border-border-primary rounded-xl p-3 md:p-5 mb-3 md:mb-5 lg:mb-[30px]'>
                <h6 className='mb-3 md:mb-5 leading-[30px]'>Change Password</h6>
                <div className='flex flex-wrap items-start justify-center sm:justify-start lg:flex-nowrap mb-3 md:mb-5 md:mb-[30px] gap-3 md:gap-5'>
                    <div className='relative w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-10px)]'>
                        <TextInput required={true} id='oldPassword' onBlur={OnBlur} type={passwordHideShow?.showOldPassword ? 'text' : 'password'} label={t('Current Password')} value={formik.values.oldPassword} onChange={formik.handleChange} placeholder={t('Current Password')} />
                        <Button onClick={() => setPasswordHideShow((prevState) => ({ ...prevState, showOldPassword: !passwordHideShow?.showOldPassword }))} className='right-3 top-[2.8rem] absolute' label={''} title=''>
                            {passwordHideShow?.showOldPassword ? <Eye /> : <EyeCrossed />}
                        </Button>
                        {formik.touched.newPassword && formik.errors.oldPassword && <p className='text-red-400'>{formik.errors.oldPassword}</p>}
                    </div>
                    <div className='relative w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-10px)]'>
                        <TextInput required={true} onBlur={OnBlur} id='newPassword' type={passwordHideShow?.showNewPassword ? 'text' : 'password'} label={t('New Password')} value={formik.values.newPassword} onChange={formik.handleChange} placeholder={t('New Password')} />
                        <Button onClick={() => setPasswordHideShow((prevState) => ({ ...prevState, showNewPassword: !passwordHideShow?.showNewPassword }))} className='absolute right-3 top-[2.8rem]' label={''} title=''>
                            {passwordHideShow?.showNewPassword ? <Eye /> : <EyeCrossed />}
                        </Button>
                        {formik.touched.newPassword && formik.errors.newPassword && <p className='text-red-400'>{formik.errors.newPassword}</p>}
                    </div>
                    <div className='relative w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-10px)]'>
                        <TextInput required={true} onBlur={OnBlur} id='confirmPassword' type={passwordHideShow?.showConfirmPassword ? 'text' : 'password'} label={t('Confirm Password')} value={formik.values.confirmPassword} onChange={formik.handleChange} placeholder={t('Confirm Password')} />
                        <Button onClick={() => setPasswordHideShow((prevState) => ({ ...prevState, showConfirmPassword: !passwordHideShow?.showConfirmPassword }))} className='absolute right-3 top-[2.8rem]' label={''} title=''>
                            {passwordHideShow?.showConfirmPassword ? <Eye /> : <EyeCrossed />}
                        </Button>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className='text-red-400'>{formik.errors.confirmPassword}</p>}
					</div>
                </div>
                <Button className='mr-5 btn-primary btn-normal mb-2 md:mb-0 w-full md:w-[196px]' type='button' onClick={formik.handleSubmit} label={t('Update Password')}  title={`${t('Update Password')}`} />
            </div>
            {updatePass && <div className='fixed top-0 left-0 right-0 z-[1000] h-full bg-modal'>
                <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={` pt-40 flex items-center justify-center ${updatePass ? '' : 'opacity-0 transform -translate-y-full scale-150 '}  transition-all duration-300 `}>
                    <div className='w-full mx-5 sm:max-w-[640px]'>
                        <div className='relative p-5 text-center bg-white shadow rounded-xl md:p-[30px]'>
                            <div className='flex justify-center mb-3 md:mb-5'><span className='p-[14px] md:p-[18px] lg:p-[23px] rounded-full bg-success text-xl-35 md:text-5xl'><Check className='stroke-2 fill-white' fontSize='34' /></span></div>
                            <h6 className='mb-6 md:mb-8 lg:mb-11'>Your password has been updated.</h6>
                            <div className='flex items-center justify-center space-x-5 md:flex-row'>
                                <Button className='btn-primary btn-normal min-w-[86px] w-[160px] ' onClick={() => { setUpdatePass(false) }} label={t('Ok')}  title={`${t('Ok')}`} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default MyAccountChangePassword
