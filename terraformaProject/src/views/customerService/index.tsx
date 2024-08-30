import React, { useCallback, useEffect, useRef } from 'react'
import UpdatedHeader from '@components/header/updatedHeader'
import { Attachment, MessageBox, PhoneCall } from '@components/icons/icons'
import TextInput from '@components/textInput/TextInput'
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import CustomerService from '@assets/images/customer-service.png';
import Button from '@components/button/button';
import { useNavigate } from 'react-router-dom';
import { MAX_FILE_SIZE, ROUTES, uploadAttachment } from '@config/constant';
import { useFormik } from 'formik';
import { whiteSpaceRemover } from '@utils/helpers';
import { toast } from 'react-toastify';
import useValidation from '@framework/hooks/validations';
import { useMutation } from '@apollo/client';
import { CREATE_CUSTOMER_TICKET } from '@framework/graphql/mutations/customerTicket';
import { useSelector } from 'react-redux';
import { UserProfileType } from 'src/types/common';

function Index() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { createCustomerTicket } = useValidation();
    const [createTicket] = useMutation(CREATE_CUSTOMER_TICKET)
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const initialValues = {
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        message: '',
        attachments: '',
        fileName: ''
    }
    const { userProfileData} = useSelector(
		(state: { userProfile: { userProfileData: UserProfileType} }) => state.userProfile,
	  );
  	
    const formik = useFormik({
        initialValues,
        validationSchema: createCustomerTicket,
        onSubmit: (values) => {
            createTicket({
                variables: {
                    ticketData: {
                        first_name: values?.first_name,
                        last_name: values?.last_name,
                        phone_number: values?.phone_number,
                        email: values?.email,
                        message: values?.message,
                        attachments: values?.attachments,
                    }
                }
            }).then((res) => {
                const data = res.data.createTicket
                toast.success(data?.message);
                formik.resetForm();
            })
                .catch((err) => {
                    toast.error(err?.networkError?.result?.errors?.[0]?.message);
                });
        },
    })

    useEffect(() => {
        if (userProfileData?.getProfile?.data) {
            formik.setValues({
                ...initialValues,
                first_name: userProfileData?.getProfile?.data?.first_name,
                last_name: userProfileData?.getProfile?.data?.last_name,
                phone_number: userProfileData?.getProfile?.data?.phone_number,
                email: userProfileData?.getProfile?.data?.email,
            })
           
        }
    }, [userProfileData?.getProfile?.data])

    const handleTextInputClick = useCallback(() => {
        fileInputRef?.current?.click();
    }, []);

    const handleFileEvent = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;
        if (files) {
            const allowedExtensions = ['pdf'];
            const maxFileSize = MAX_FILE_SIZE
            const selectedFiles = Array.from(files);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validFiles = selectedFiles.filter((file: any) => {
                const extension = file.name.split('.').pop()?.toLowerCase();
                const fileSize = file.size;
                if (!allowedExtensions.includes(extension)) {
                    toast.error(`Invalid file type: ${file.name}`);
                    return false;
                }
                if (fileSize > maxFileSize) {
                    toast.error('Please make sure your file is must be less than 5MB.');
                    return false;
                }
                return true;
            });
            if (validFiles.length > 0) {
                const formData = new FormData();
                formik.setFieldValue('fileName', validFiles?.[0]?.name);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formData.append('file', validFiles[0] as any);
                const files = await uploadAttachment(formData);                
                formik.setFieldValue('attachments', files?.key);
            } else {
                formik.setFieldError('attachments', 'Invalid file type Please enter valid attachment');
            }
        }
    };

    const ticketsList = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.ticketsList}`)
    }, [])

    const headerActionConst = () => {
        return (
            <Button className='btn btn-normal max-md:mr-1.5 btn-secondary w-[140px] mt-auto whitespace-nowrap' type='submit' onClick={ticketsList} label={'View History'} />
        )
    }

    const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            <div className='flex border border-solid max-2lg:flex-wrap border-border-primary rounded-xl 2lg:h-[calc(100%-141px)] overflow-hidden'>
                <div className='p-3 md:p-5 bg-p-list-box-btn-bg w-full 2lg:w-[40%] md:min-w-[400px] flex flex-col py-5 2lg:py-12 overflow-auto'>
                    <div className='mt-auto mb-7'>
                        <picture>
                            <img src={CustomerService} alt="Customer Service" title='CustomerService' width='520' className='mx-auto' height='381' />
                        </picture>
                    </div>
                    <div className='flex flex-col mt-auto space-y-2.5 md:space-y-4 2lg:space-y-7'>
                        <a href="tel:(604) 874-7283" className='flex items-center btn space-x-2.5 text-base md:text-lg justify-center btn-green-lg'>
                            <span><PhoneCall /></span>
                            <span>(604) 874-7283</span>
                        </a>
                        <a href="mailto:contact@terraformasystems.com" className='flex items-center btn space-x-2.5 text-base md:text-lg justify-center btn-green-lg'>
                            <span><MessageBox className='fill-p-list-box-btn' /></span>
                            <span className='overflow-hidden text-ellipsis'>contact@terraformasystems.com</span>
                        </a>
                    </div>
                </div>
                <div className='w-full 2lg:w-[60%] p-3 md:p-5 2lg:py-7 xl:py-12 xl:px-7 flex flex-col overflow-auto'>
                    <h1 className='mb-5 text-primary'>{t('Contact Us')}</h1>
                    <p className='mb-4 text-base md:text-lg xl:mb-2'>{t('Fill up the form and our team will get back to you in 24 to 48 Hours!')}</p>
                    <div className='-mx-2.5 space-y-3 xl:space-y-5 mb-7 2lg:mb-5'>
                        <div className='inline-block w-full xl:w-1/2 px-2.5'>
                            <TextInput placeholder={t('Enter First Name')} required={true} label={t('First Name')} name='first_name' id='first_name' onChange={formik.handleChange} value={formik?.values.first_name} error={formik.errors.first_name && formik.touched.first_name ? formik.errors.first_name : ''} type='text' />
                        </div>
                        <div className='inline-block w-full xl:w-1/2 px-2.5'>
                            <TextInput placeholder={t('Enter Last Name')} required={true} label={t('Last Name')} name='last_name' id='last_name' onChange={formik.handleChange} value={formik?.values.last_name} error={formik.errors.last_name && formik.touched.last_name ? formik.errors.last_name : ''} type='text' />
                        </div>
                        <div className='inline-block w-full xl:w-1/2 px-2.5'>
                            <TextInput placeholder={t('Enter Email')} required={true} label={t('Email')} name='email' id='email' onChange={formik.handleChange} value={formik?.values.email} error={formik.errors.email && formik.touched.email ? formik.errors.email : ''} type='email' />
                        </div>
                        <div className='inline-block w-full xl:w-1/2 px-2.5'>
                            <TextInput placeholder={t('Enter Phone No')} required={true} label={t('Phone No')} name='phone_number' id='phone_number' onChange={formik.handleChange} value={formik?.values.phone_number} error={formik.errors.phone_number && formik.touched.phone_number ? formik.errors.phone_number : ''} type='tel' />
                        </div>
                        <div className='w-full px-2.5'>
                            <label htmlFor="textarea">{t('Message')}<span className='text-red-500'> *</span></label>
                            <textarea
                                id="message"
                                name="message"
                                rows={3}
                                cols={83}
                                value={formik.values.message}
                                onBlur={OnBlur}
                                onChange={formik.handleChange}
                                placeholder='Enter Company Details'
                                className='border border-border-primary block rounded-xl p-3.5 w-full focus:bg-white resize-none'
                                style={{ resize: 'none' }}
                            ></textarea>
                            <p className='error'>{formik.errors.message && formik.touched.message && formik.errors.message}</p>
                        </div>
                        <div className='inline-block w-full xl:w-1/2 px-2.5'>
                            <label htmlFor="attachment">Attachments<span className='text-red-500'> *</span>
                                <input
                                    id="attachments"
                                    type="file"
                                    name="attachments"
                                    multiple
                                    className="focus:bg-transparent hidden"
                                    accept=".pdf"
                                    onChange={(e) => handleFileEvent(e)}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    key={uuidv4()}
                                />
                                <button onClick={handleTextInputClick} className='w-full' type='button' title=''>
                                    <TextInput
                                        className='pointer-events-none'
                                        placeholder={t(formik?.values?.fileName ? formik?.values?.fileName : 'Attachments File')}
                                        required={false}
                                        name="title"
                                        type="text"
                                        inputIcon={<Attachment fontSize="22" />}
                                    />
                                </button>
                                <p className='error mt-2'>{formik.errors.attachments && formik.touched.attachments && formik.errors.attachments}</p>
                            </label>
                        </div>
                    </div>
                    <Button className='w-full btn btn-primary md:w-[160px] mt-auto whitespace-nowrap min-h-[40px] md:min-h-[50px]' type='button' label={'Send'} onClick={formik.handleSubmit} title={`${t('Send')}`}/>
                </div>
            </div>
        </>
    )
}

export default Index
