import React, { useCallback, useState } from 'react'
import { useMutation } from '@apollo/client'
import TextInput from '@components/textInput/TextInput'
import { ResetPasswordResponse } from '@framework/graphql/graphql'
import { USER_RESET_PASSWORD } from '@framework/graphql/mutations/user'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { ROUTES } from '@config/constant'
import { ResetPasswordInput } from 'src/types/views'
import Button from '@components/button/button'
import { ResetPasswordNavParams } from 'src/types/common'
import useValidation from '@framework/hooks/validations'
import LoginImg from '@assets/images/login-img.jpg'
import Logo from '@assets/images/logo.png'
import { Eye, EyeCrossed } from '@components/icons/icons'

const ResetPassword = () => {
    const { t } = useTranslation()
    const location = useLocation();

    // Parse the query string
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token') as unknown as ResetPasswordNavParams
    const [showPassword, setShowPassword] = useState({ newPassword: false, confirmPassword: false });
    const { resetPasswordValidationSchema } = useValidation()
    const [resetPassword] = useMutation(USER_RESET_PASSWORD)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const initialValues: ResetPasswordInput = {
        password: '',
        confirmPassword: ''
    }

    const formik = useFormik({
        initialValues,
        validationSchema: resetPasswordValidationSchema,
        onSubmit: values => {
            setLoading(true);
            resetPassword({
                variables: { userData: { newPassword: values.password, token: token } },
            }).then((res) => {
                const data = res.data as ResetPasswordResponse
                toast.success(t(data.forgotSetPassword.message))
                setLoading(false);
                navigate(`/${ROUTES.login}`);
            }).catch((err) => {
                toast.error(err.networkError.result.errors[0].message)
                setLoading(false);
            })
        },
    })

    const login = useCallback(() => {
        navigate(`/${ROUTES.login}`);
    }, [])

    return (
        <div className='flex w-full h-screen bg-white nm'>
            <img className='hidden object-cover md:block md:w-1/2' src={LoginImg} alt='LoginImage' />
            <div className='flex items-center justify-center w-full p-5 md:w-1/2 md:p-12'>
                <form onSubmit={formik.handleSubmit} className='w-full max-w-[486px] bg-white'>
                    <img className='max-w-[302px] mb-7 w-full mx-auto' src={Logo} alt="logo" />
                    <h4 className='mb-5 text-3xl font-bold text-center text-primary'>{t('Reset Password')}</h4>
                    <div className='relative mb-5 md:mb-7'>
                        <TextInput
                            placeholder='New Password'
                            name='password'
                            type={showPassword.newPassword ? 'text' : 'password'}
                            label={t('New Password')}
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            error={formik.errors.password}
                            loginInput={true}
                        />
                        <Button onClick={() => setShowPassword((prevState) => ({ ...prevState, newPassword: !showPassword.newPassword }))} className='absolute right-4 top-9 md:top-11' label={''} title=''>
                            {showPassword.newPassword ? <Eye /> : <EyeCrossed />}
                        </Button>
                    </div>
                    <div className="relative mb-5 md:mb-7">
                        <TextInput
                            placeholder='Confirm New Password'
                            name='confirmPassword'
                            type={showPassword.confirmPassword ? 'text' : 'password'}
                            label={t('Confirm New Password')}
                            onChange={formik.handleChange}
                            value={formik.values.confirmPassword}
                            error={formik.errors.confirmPassword}
                            loginInput={true}
                        />
                        <Button onClick={() => setShowPassword((prevState) => ({ ...prevState, confirmPassword: !showPassword.confirmPassword }))} className='absolute right-4 top-9 md:top-11' label={''} title=''>
                            {showPassword.confirmPassword ? <Eye /> : <EyeCrossed />}
                        </Button>
                    </div>
                    <div>
                        <Button type='submit' className='justify-center w-full mb-3 btn-primary btn-normal' disabled={loading} label={t('Reset')} />
                        <Button className='justify-center w-full mb-3 btn-normal btn-gray' onClick={login} label={t('Login')} 
                        title={`${t('Login')}`} />
                    </div>
                </form>
            </div>
        </div>
    )
}
export default ResetPassword
