/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css'; // core css
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Button from '@components/button/button';
import { Camera, Cross } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import { SUPER_ADMIN_CREATE_NEW_COMPANY, SUPER_ADMIN_UPDATE_NEW_COMPANY } from '@framework/graphql/mutations/createCompney';
import useValidation from '@framework/hooks/validations';
import { CreateCompany } from 'src/types/createCompany';
import { whiteSpaceRemover } from '@utils/helpers';
import logo from '@assets/images/sidebar-logo.png'
import { Dialog } from 'primereact/dialog';
import { DATA_URL_TO_FILE, uploadImage } from '@config/constant';
import CountryDropdown from '@components/countryDropdown/countryDropdown';
import { useSelector } from 'react-redux';
interface Countries {
    value: string
    label: string;
}
function AddNewCompany(props: any) {
    const { t } = useTranslation();
    const [isRoleModelShow, setIsRoleModelShow] = useState<boolean>(false)
    const [addClass, setAddClass] = useState<boolean>(false);
    const { addCompanyValidationSchema } = useValidation();
    const [isEditCategory, setIsEditCategory] = useState<boolean>(false);
    const [createCompany, loading] = useMutation(SUPER_ADMIN_CREATE_NEW_COMPANY);
    const [updateCompany, updateLoading] = useMutation(SUPER_ADMIN_UPDATE_NEW_COMPANY);
    const [cropper, setCropper] = useState(false);
    const [image, setImage] = useState('');
    const { countryData } = useSelector((state: { country: { countryData: Countries } }) => state.country)
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const cropperRef = createRef<ReactCropperElement>();
    const [imageLoader,setImageLoader] = useState(false);

    const initialValues = {
        country_id: '',
        description: '',
        email: '',
        location: '',
        name: '',
        phone_number: '',
        website_url: '',
        image_url: ''
    };

    useEffect(() => {
        setIsRoleModelShow(true);
        setAddClass(true);
    }, [])

    const formik = useFormik({
        initialValues,
        validationSchema: addCompanyValidationSchema,
        onSubmit: async (values) => {
            if (props?.onData?.uuid) {
                const companyDirectoryData = {
                    country_id: values.country_id,
                    description: values.description,
                    email: values.email,
                    location: values.location,
                    name: values.name,
                    phone_number: values.phone_number,
                    website_url: values.website_url,
                    image_url: values.image_url,
                };
                updateCompany({
                    variables: {
                        companyDirectoryData: companyDirectoryData,
                        companyId: String(props?.onData?.uuid),
                    },
                })
                    .then((res) => {
                        const data = res.data
                        toast.success(data?.updateSuperAdminCompanyDirectory?.message)
                        formik.resetForm();
                        props.onCloseAddForm();
                        props.onDataRefetch();
                    })
                    .catch((err) => {
                        toast.error(err?.networkError?.result?.errors[0]?.message)

                    })

            } else {
                createCompany({
                    variables: {
                        superAdminCompanyDirectoryData: {
                            country_id: values.country_id,
                            description: values.description,
                            email: values.email,
                            location: values.location,
                            name: values.name,
                            phone_number: values.phone_number,
                            website_url: values.website_url,
                            image_url: values.image_url
                        },
                    },
                })
                    .then((res) => {
                        const data = res.data
                        toast.success(data?.createSuperAdminCompanyDirectory?.message)
                        formik.resetForm()
                        props.onCloseAddForm()
                        props.onData();
                    })
                    .catch((err) => {
                        toast.error(err?.networkError?.result?.errors[0]?.message)
                    })
            }
        }
    })

    useEffect(() => {
        if (countryData) {
            formik.setFieldValue('country_id', countryData?.value);
        }
    }, [countryData]);

    useEffect(() => {
        if (props?.onData?.uuid) {
            formik.setValues({
                country_id: props?.onData?.country_uuid,
                description: props?.onData?.description,
                email: props?.onData?.email,
                location: props?.onData?.location,
                name: props?.onData?.name,
                phone_number: props?.onData?.phone_number,
                website_url: props?.onData?.website_url,
                image_url: props?.onData?.image_url

            });

        }
    }, []);

    /**
 * 
 * @param fieldName particular field name pass base on error show
 * @returns 
 */
    const getErrorUserMng = (fieldName: keyof CreateCompany) => {
        return formik.errors[fieldName] && formik.touched[fieldName]
            ? formik.errors[fieldName]
            : ''
    }

    /**
     *  not add empty space logic
     */
    const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleLogo = useCallback((e: any) => {
        e.preventDefault();
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                if (file.size > 5 * 1024 * 1024) {
                    toast.error('Image size must be less than 5MB');
                } else {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setImage(reader.result as any);
                        setCropper(true);
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                toast.error('Please select a valid image file');
            }
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);
    useEffect(() => {
        setIsRoleModelShow(true);
        setAddClass(true);
        if (props?.onData?.uuid) {
            setIsEditCategory(true);
        }
    }, [])

    const getCropData = async (): Promise<void> => {
        if (typeof cropperRef.current?.cropper !== 'undefined') {
            await setImageLoader(true);
            let fileName: string | null = null;
            const file = DATA_URL_TO_FILE(cropperRef.current?.cropper.getCroppedCanvas().toDataURL(), 'image.png');
            const formData = new FormData();
            formData.append('image', file);
            fileName = await uploadImage(formData, '');
            if (fileName) {
                formik.setFieldValue('image_url', fileName);
                setCropper(false);
            }
            await setImageLoader(false);
        }
    };


    const dialogActionConst = () => {
        return (
            <div className='flex justify-end gap-5'>
                <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Cancel" onClick={() => setCropper(false)} title={`${t('Cancel')}`} />
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Save" disabled={imageLoader} onClick={() => getCropData()} title={`${t('Save')}`} />
            </div>
        )
    }

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
                                    <p className='text-xl font-bold text-baseColor'>{isEditCategory ? 'Update New Company' : 'Add New Company'}</p>
                                    <Button onClick={props.onCloseAddForm} label={t('')} title={`${t('Close')}`}>
                                        <span className='text-xl-22'><Cross className='text-error' /></span>
                                    </Button>
                                </div>
                                {/* <!-- Modal body --> */}
                                <div className='w-full'>
                                    <form>
                                        <div className='p-5 bg-white max-h-[calc(100vh-260px)] overflow-auto'>
                                            <div className='box-border flex flex-col items-center justify-center p-3 mb-5 border border-solid border-border-primary rounded-xl'>
                                                <label
                                                    htmlFor='image_url'
                                                    className='relative flex flex-col items-center justify-center'>
                                                    <div className='flex items-center justify-center w-32 h-32 overflow-hidden border border-gray-300 border-solid rounded-full cursor-pointer sm:w-44 sm:h-44'>
                                                        {formik?.values?.image_url ? <img src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${formik.values.image_url}`} alt='Logo' className='object-contain w-full h-full bg-black' /> :
                                                            <img src={logo} alt='image_url' className='object-contain w-full h-full bg-black' />}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        id="image_url"
                                                        name="image_url"
                                                        accept="image/*"
                                                        onChange={handleLogo}
                                                        ref={fileInputRef}
                                                        className="hidden"
                                                    />
                                                    <div className='absolute bottom-0 p-2 text-2xl font-bold text-white rounded-full right-1 sm:right-2 bg-primary'>{<Camera />}</div>
                                                </label>
                                                {formik.errors.image_url && formik.touched.image_url ? <span className='relative mt-2 md:text-xs-15 error'>{formik.errors.image_url}</span> : ''}
                                            </div>

                                            <div className="flex flex-wrap gap-x-5">
                                                <div className='mb-3 sm:mb-5 w-full sm:w-[calc(50%-10px)]'>
                                                    <TextInput onBlur={OnBlur} placeholder={t('Enter Name of Company')} required={true} name='name' onChange={formik.handleChange} label={t('Name of Company')} value={formik.values.name} error={getErrorUserMng('name')} />
                                                </div>

                                                <div className='mb-3 sm:mb-5 w-full sm:w-[calc(50%-10px)]'>
                                                    <TextInput onBlur={OnBlur} placeholder={t('Enter Website URL')} required={true} name='website_url' onChange={formik.handleChange} label={t('Website URL')} value={formik.values.website_url} error={getErrorUserMng('website_url')} />
                                                </div>
                                                <div className='mb-3 sm:mb-5 w-full sm:w-[calc(50%-10px)]'>
                                                    <span>Select Country Code <span className='error'>*</span></span>
                                                    <CountryDropdown error={formik?.errors?.country_id} />
                                                </div>
                                                <div className='mb-3 sm:mb-5 w-full sm:w-[calc(50%-10px)]'>
                                                    <TextInput onBlur={OnBlur} placeholder={t('Enter Contact Number')} required={true} name='phone_number' type='tel' onChange={formik.handleChange} label={t('Contact Number')} value={formik.values.phone_number} error={getErrorUserMng('phone_number')} />
                                                </div>
                                                <div className='mb-3 sm:mb-5 w-full sm:w-[calc(50%-10px)]'>
                                                    <TextInput onBlur={OnBlur} placeholder={t('Enter Email ID')} required={true} name='email' onChange={formik.handleChange} label={t('Email ID')} value={formik.values.email} error={getErrorUserMng('email')} />
                                                </div>
                                                <div className='mb-3 sm:mb-5 w-full sm:w-[calc(50%-10px)]'>
                                                    <TextInput onBlur={OnBlur} placeholder={t('Enter Location')} required={true} name='location' onChange={formik.handleChange} label={t('Location')} value={formik.values.location} error={getErrorUserMng('location')} />

                                                </div>
                                                <div>
                                                    <label htmlFor="textarea">Company Details <span className='text-red-500'>*</span></label>
                                                    <textarea
                                                        id="description"
                                                        name="description"
                                                        rows={4}
                                                        cols={83}
                                                        value={formik.values.description}
                                                        onBlur={OnBlur}
                                                        placeholder='Enter Company Details'
                                                        onChange={formik.handleChange}
                                                        className='border border-border-primary rounded-xl p-3.5 w-full focus:bg-white'
                                                        style={{ resize: 'none' }}

                                                    ></textarea>

                                                    <p className='error'>{formik.errors.description && formik.touched.description && formik.errors.description}</p>

                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                            <Button className='btn-primary btn-normal mb-2 md:mb-0 w-full md:w-auto min-w-[160px]' type='button' onClick={() => formik.handleSubmit()} label={'Submit'} disabled={(loading?.loading) || (updateLoading?.loading)} title={`${t('Submit')}`}/>
                                            <Button className='btn-secondary btn-normal w-full md:w-[160px]' label={t('Cancel')} onClick={props.onCloseAddForm} title={`${t('Cancel')}`} />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Dialog className="custom-dialog" header="Crop Image" visible={cropper} style={{ width: '50vw' }} onHide={() => setCropper(false)} footer={() => dialogActionConst()}>
                {
                    image &&
                    <Cropper
                        ref={cropperRef}
                        style={{ height: 400, width: '100%' }}
                        zoomTo={0.5}
                        aspectRatio={1}
                        preview=".img-preview"
                        src={image}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                        guides={true}
                        cropBoxResizable={false}
                    />
                }
            </Dialog>
        </>
    )
}

export default AddNewCompany


