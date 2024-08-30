import { useMutation } from '@apollo/client';
import Button from '@components/button/button';
import { Cross, Eye, EyeCrossed, Info } from '@components/icons/icons'
import TextInput from '@components/textInput/TextInput'
import { whiteSpaceRemover } from '@utils/helpers';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useValidation from '@framework/hooks/validations';
import { ChangePasswordSubscribersProps } from '@types';
import { SUPER_ADMIN_CHANGE_PASSWORD } from '@framework/graphql/queries/admin';

interface SetPasswordToggle {
    showOldPassword: boolean;
    showNewPassword: boolean;
    showConfirmPassword: boolean;
}

const ChangePasswordSubscriber = ({ openPopUp, data, onClose }: ChangePasswordSubscribersProps) => {
    const { t } = useTranslation();
    const { changePasswordSubscriberValidationSchema } = useValidation();
    const [passwordHideShow, setPasswordHideShow] = useState<SetPasswordToggle>({
        showOldPassword: false,
        showNewPassword: false,
        showConfirmPassword: false
    });
    const [changeSuperAdminPassword,{loading}] = useMutation(SUPER_ADMIN_CHANGE_PASSWORD);
    const initialValues = {
        newPassword: '',
        confirmPassword: '',
    };
	const [addClass, setAddClass] = useState(false);

    const formik = useFormik({
        validationSchema: changePasswordSubscriberValidationSchema,
        initialValues,
        onSubmit: async (values) => {
            changeSuperAdminPassword({
                variables: {
                    userData: {
                        password: values.newPassword,
                        re_enter_password: values.confirmPassword,
                        user_id: data?.uuid
                    }

                },
            })
                .then((response) => {
                    toast.success(response?.data?.superAdminChangePassword?.message);
                    onClose();
                    formik.resetForm()
                })
                .catch((error) => {
                    onClose();
                    toast.error(error.networkError.result.errors[0].message);
                });
        },
    });

    const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);
    useEffect(() => {
		if (openPopUp) {
			setTimeout(() => {
				setAddClass(true);
			}, 100);
		}
	}, [openPopUp]);
    return (
    <div >
   {loading && <div className='z-50 w-12 h-12 mx-auto rounded-[50%] border-solid border-4 border-[#E8E8EA] border-r-[#2575d6] animate-spin absolute left-[58%] top-[40%] '></div>}
    <div className={`${openPopUp ? '' : 'hidden'} absolute top-0 left-0 right-0 z-[1000] h-full bg-modal`}>
        <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${addClass ? '' : 'opacity-0 transform -translate-y-full scale-150 '}  transition-all duration-300 `}>
            <div className='w-full mx-5 sm:max-w-[780px]'>

                <div className='relative bg-white shadow rounded-xl'>
                    <div className='flex items-center justify-between px-5 py-6 border-b bg-accents-2 rounded-t-xl'>
                        <div className='flex items-center '>
                            <Info className='inline-block mr-3 fill-baseColor' fontSize='20' />
                            <span className='text-xl font-bold text-baseColor'>{t('Confirmation')}</span>
                        </div>
                        <Button onClick={onClose} label={''} title='Close'>
                            <Cross className='text-error' fontSize='14' />
                        </Button>
                    </div>
                    
                    <form onSubmit={formik.handleSubmit}>
                        <div className='model-body'>
                            <div className=' p-3 md:p-5 mb-3 md:mb-5 lg:mb-[30px]'>
                                <h6 className='mb-3 md:mb-5 leading-[30px]'>Change Password</h6>
                                <div className='flex flex-wrap items-start justify-center sm:justify-start lg:flex-nowrap mb-3 md:mb-5  gap-3 md:gap-5'>

                                    <div className='relative w-full lg:w-[calc(50%-10px)] '>
                                        <TextInput required={true} onBlur={OnBlur} id='newPassword' type={passwordHideShow?.showNewPassword ? 'text' : 'password'} label={t('New Password')} value={formik.values.newPassword} onChange={formik.handleChange} placeholder={t('New Password')} />
                                        <Button onClick={() => setPasswordHideShow((prevState) => ({ ...prevState, showNewPassword: !passwordHideShow?.showNewPassword }))} className='absolute right-3 top-[2.8rem]' label={''}>
                                            {passwordHideShow?.showNewPassword ? <Eye /> : <EyeCrossed />}
                                        </Button>
                                        {formik.touched.newPassword && formik.errors.newPassword && <p className='text-red-400'>{formik.errors.newPassword}</p>}
                                    </div>
                                    <div className='relative w-full lg:w-[calc(50%-10px)] '>
                                        <TextInput required={true} onBlur={OnBlur} id='confirmPassword' type={passwordHideShow?.showConfirmPassword ? 'text' : 'password'} label={t('Confirm Password')} value={formik.values.confirmPassword} onChange={formik.handleChange} placeholder={t('Confirm Password')} />
                                        <Button onClick={() => setPasswordHideShow((prevState) => ({ ...prevState, showConfirmPassword: !passwordHideShow?.showConfirmPassword }))} className='absolute right-3 top-[2.8rem]' label={''}>
                                            {passwordHideShow?.showConfirmPassword ? <Eye /> : <EyeCrossed />}
                                        </Button>
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className='text-red-400'>{formik.errors.confirmPassword}</p>}
                                    </div>
                                </div>
                                <div className='flex justify-end px-5 gap-4'>
                                    <Button className='btn-primary  ' type='submit' label={t('Submit')} disabled={loading} title='Submit' />
                                    <Button className='btn-error  ' onClick={onClose} label={t('Close')} title='Close' />
                                </div>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
    </div>);

}

export default ChangePasswordSubscriber;