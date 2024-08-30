/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import Button from '@components/button/button';
import { Cross } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import { SUBSCRIBER_ADMIN_CREATE_NEW_COMPANY } from '@framework/graphql/mutations/createCompney';
import useValidation from '@framework/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import CountryDropdown from '@components/countryDropdown/countryDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { setCountryData } from 'src/redux/country-slice';
interface ValidationTypes {
    country_id: string,
    description: string,
    email: string,
    name: string,
    phone_number: string,
    website_url: string
}
interface Countries {
	value: string
	label: string;
}
function AddNewCompanySubscriber(props: any) {
    const { t } = useTranslation();
    const [isRoleModelShow, setIsRoleModelShow] = useState<boolean>(false)
    const [addClass, setAddClass] = useState<boolean>(false);
    const { addSubscriberCompanyValidationSchema } = useValidation();
    const [createCompanyDirectory , loading] = useMutation(SUBSCRIBER_ADMIN_CREATE_NEW_COMPANY);
    const dispatch = useDispatch()
    const { countryData } = useSelector((state: { country: { countryData: Countries } }) => state.country)
    const initialValues = {
        country_id: '',
        description: '',
        email: '',
        name: '',
        phone_number: '',
        website_url: '',
    };

    useEffect(() => {
        setIsRoleModelShow(true);
        setAddClass(true);
    }, [])

    
    const formik = useFormik({
        initialValues,
        validationSchema: addSubscriberCompanyValidationSchema,
        onSubmit: (values) => {
            
            createCompanyDirectory({
                variables: {
                    companyDirectoryData: {
                        country_id: values.country_id,
                        description: values.description,
                        email: values.email,
                        name: values.name,
                        phone_number: values.phone_number,
                        website_url: values.website_url,
                    },
                },
            })
                .then((res) => {
                    const data = res.data
                    toast.success(data?.createCompanyDirectory?.message)
                    props.onCloseAddForm()
                    props.onData();
                })
                .catch((err) => {
                    toast.error(err?.networkError?.result?.errors[0]?.message)
                })

        }
    })

	useEffect(() => {
        if(countryData?.value){
            formik.setFieldValue('country_id', countryData?.value);
        }
	}, [countryData]);

    /**
 * 
 * @param fieldName particular field name pass base on error show
 * @returns 
 */
    const getErrorUserMng = (fieldName: keyof ValidationTypes) => {
        return formik.errors[fieldName] && formik.touched[fieldName]
            ? formik.errors[fieldName]
            : ''
    }
    /**

    /**
     *  not add empty space logic
     */
    const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);


    useEffect(() => {
        setIsRoleModelShow(true);
        setAddClass(true);
    }, [])

    useEffect(()=>{
        return () =>{
            dispatch(setCountryData(''))
        }
    },[])
    
    return (
        <>
            {isRoleModelShow && (
                <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-screen bg-modal modal ${isRoleModelShow ? '' : 'hidden'}`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={` py-5 flex items-center justify-center h-full ${addClass ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
                        <div className='w-full mx-5 sm:max-w-[780px]'>
                            {/* <!-- Modal content --> */}
                            <div className='relative bg-white rounded-xl'>
                                {/* <!-- Modal header --> */}
                                <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                                    <p className='text-xl font-bold text-baseColor'>{'Add New Request Company'}</p>
                                    <Button onClick={props.onCloseAddForm} label={t('')} title={`${t('Close')}`}>
                                        <span className='text-xl-22'><Cross className='text-error' /></span>
                                    </Button>
                                </div>
                                {/* <!-- Modal body --> */}
                                <div className='w-full'>
                                    <form className='h-full'>
                                        <div className='p-5 bg-white max-h-[calc(100vh-260px)] overflow-auto'>
                                            <div className="flex flex-wrap gap-x-5">
                                                <div className='mb-3 sm:mb-5 w-full sm:w-[calc(50%-10px)]'>
                                                    <TextInput onBlur={OnBlur} placeholder={t('Enter Name of Company')} required={true} name='name' onChange={formik.handleChange} label={t('Name of Company')} value={formik.values.name} error={getErrorUserMng('name')} />
                                                </div>

                                                <div className='mb-3 sm:mb-5 w-full sm:w-[calc(50%-10px)]'>
                                                    <TextInput onBlur={OnBlur} placeholder={t('Enter Website URL')} required={true} name='website_url' onChange={formik.handleChange} label={t('Website URL')} value={formik.values.website_url} error={getErrorUserMng('website_url')} />
                                                </div>

                                                <div className='mb-3 sm:mb-5 w-full sm:w-[calc(50%-10px)]'>
                                                    <TextInput onBlur={OnBlur} placeholder={t('Enter Contact Number')} type='tel' required={true} name='phone_number' onChange={formik.handleChange} label={t('Contact Number')} value={formik.values.phone_number} error={getErrorUserMng('phone_number')} />
                                                </div>
                                                <div className='mb-3 sm:mb-5 w-full sm:w-[calc(50%-10px)]'>
                                                    <TextInput onBlur={OnBlur} placeholder={t('Enter Email ID')} required={true} name='email' onChange={formik.handleChange} label={t('Email ID')} value={formik.values.email} error={getErrorUserMng('email')} />
                                                </div>

                                                <div className='w-full mb-3 sm:mb-5'>
                                                    <label>Select Country <span className='error'>*</span></label>
                                                    <CountryDropdown error={formik.errors.country_id}/>
                                                </div>

                                                <div>
                                                    <label htmlFor="textarea">Description <span className='text-red-500'>*</span></label>
                                                    <textarea
                                                        id="description"
                                                        name="description"
                                                        rows={4}
                                                        cols={83}
                                                        value={formik.values.description}
                                                        onBlur={OnBlur}
                                                        placeholder='Description'
                                                        onChange={formik.handleChange}
                                                        className='border border-border-primary rounded-xl p-3.5 w-full focus:bg-white'
                                                        style={{ resize: 'none' }}

                                                    ></textarea>

                                                    <p className='error'>{formik.errors.description && formik.touched.description && formik.errors.description}</p>

                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                            <Button className='btn-primary btn-normal mb-2 md:mb-0 w-full md:w-[160px]' type='button' onClick={() => formik.handleSubmit()} label={'Submit'} disabled={(loading?.loading)} title={`${t('Submit')}`} />
                                            <Button className='btn-secondary btn-normal w-full md:w-[160px]' label={t('Cancel')} onClick={props.onCloseAddForm} title={`${t('Cancel')}`} />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default AddNewCompanySubscriber


