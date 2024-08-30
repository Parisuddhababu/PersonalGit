/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textInput/TextInput';
import { useMutation, useQuery } from '@apollo/client';
import { WHY_CHOOSE_US } from '@framework/graphql/mutations/whyChooseUs';
import { WHY_CHOOSE } from '@framework/graphql/queries/whyChooseUs';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { IMAGE_BASE_URL, API_MEDIA_END_POINT, DATA_URL_TO_FILE, MAX_FILE_SIZE, uploadImage } from '@config/constant';
import { Camera, Cross } from '@components/icons/icons';
import axios from 'axios';
import { Cropper, ReactCropperElement } from 'react-cropper';
import logo from '@assets/images/sidebar-logo.png';
import { Dialog } from 'primereact/dialog';
import useValidation from '@framework/hooks/validations';
interface InitialValues {
    title: string,
    description: string,
    image: string,
    order?: number
}
function WhyChooseUs() {
    const { t } = useTranslation();
    const [changeChooseUs] = useMutation(WHY_CHOOSE_US);
    const { data, refetch } = useQuery(WHY_CHOOSE);
    const [loading, setLoading] = useState<boolean>(false);
    const [image, setImage] = useState(logo);
    const [cropper, setCropper] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const cropperRef = createRef<ReactCropperElement>();
    const { whyChooseValidationSchema } = useValidation();
    const initialValues: InitialValues = {
        title: '',
        description: '',
        image: '',
        order: 0
    };

    const formik = useFormik({
        validationSchema: whyChooseValidationSchema,
        initialValues,
        onSubmit: async (values) => {
            changeChooseUs({
                variables: {
                    inputData: {
                        title: values?.title,
                        description: values?.description,
                        image: values?.image,
                        order: values?.order
                    }
                },
            })
                .then((response) => {
                    toast.success(response?.data?.updateWhyChooseUsDetailsForWebsite?.message);
                    formik.resetForm()
                    refetch()
                })
                .catch((error) => {
                    toast.error(error.networkError.result.errors[0].message);
                });
        }
    });

    useEffect(() => {
        if (data?.getWhyChooseUsForWebsite?.data) {
            const whyChooseUsData = data?.getWhyChooseUsForWebsite?.data;

            formik.resetForm({
                values: {
                    title: whyChooseUsData?.title,
                    description: whyChooseUsData?.description,
                    image: whyChooseUsData?.image
                }
            });
        }
    }, [data]);

    const onDeleteImage = useCallback(() => {
        const data = { fileName: formik.values.image };
        axios.delete(`${API_MEDIA_END_POINT}/remove`, { data })
            .then(() => {
                formik.setFieldValue('image', '');
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message)
            });
    }, [formik]);


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleLogo = (e: any) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                if (file.size > MAX_FILE_SIZE) {
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
            fileInputRef.current.value = ''; // This clears the input field
        }
    };

    const getCropData = async (): Promise<void> => {
        if (typeof cropperRef.current?.cropper !== 'undefined') {
            let fileName: string | null = null;
            const file = DATA_URL_TO_FILE(cropperRef.current?.cropper.getCroppedCanvas().toDataURL(), 'image.image.png');
            const formData = new FormData();
            formData.append('image', file);
            setLoading(true);
            fileName = await uploadImage(formData, 'website');
            if (fileName) {
                setLoading(false);
                formik.setFieldValue('image', fileName);
                setCropper(false);
            }
        }
    };

    const dialogActionConst = () => {
        return (
            <div className='flex justify-end gap-3 md:gap-5'>
                <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Cancel" onClick={() => setCropper(false)}  title={`${t('Cancel')}`} />
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Save" onClick={() => getCropData()} disabled={loading}  title={`${t('Save')}`} />
            </div>
        )
    }
    return (
        <div className='flex flex-col h-full px-5 py-2'>
            <div className='flex flex-wrap mb-5 gap-x-5 gap-y-3'>
                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                    <TextInput placeholder={t('Enter Title')} label={'Title'} required={true} name='title' id='title' value={formik.values.title} onChange={formik.handleChange} error={formik.errors.title} />
                </div>
                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                    <TextInput placeholder={t('Enter Description')} label={'Description'} required={true} name='description' id='description' value={formik.values.description} onChange={formik.handleChange} error={formik.errors.description} />
                </div>
                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                    <label htmlFor={'image'}>
                        {t('Image')}
                    </label>
                    <div className='box-border border border-solid aspect-video border-border-primary rounded-xl relative flex flex-col items-center justify-center overflow-hidden'>
                        <label
                            htmlFor={'image'}
                            className='relative flex flex-col h-full w-full items-center justify-center'>
                            <div className='flex items-center justify-center overflow-hidden border border-solid w-full h-full cursor-pointer border-border-primary'>
                                <img src={formik.values?.image?.includes(IMAGE_BASE_URL) ? formik.values?.image : IMAGE_BASE_URL + formik.values?.image} alt='service_image' className='object-contain w-full h-full bg-black' />
                            </div>
                            <input
                                type='file'
                                multiple
                                className='focus:bg-transparent absolute top-1/2 opacity-0'
                                accept='image/*'
                                id={'image'}
                                name={'image'}
                                ref={fileInputRef}
                                onChange={(e) => handleLogo(e)}
                            />
                            <div className='absolute bottom-0 p-2 text-2xl font-bold text-white rounded-full right-1 sm:right-2 bg-primary'>{<Camera />}</div>
                        </label>
                        {formik.values?.image &&
                            <Button className='absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-3 md:right-4 bg-error text-lg md:text-xl' type='button' label='' onClick={() => onDeleteImage()}  title={`${t('Close')}`} >
                                <Cross className='fill-white' />
                            </Button>
                        }
                    </div>
                    <p className='mt-2 error md:text-xs-15'>{formik.errors.image}</p>
                </div>

            </div>
            <div className='flex py-5 mt-auto'>
                <Button
                    className='w-full ml-auto btn btn-primary whitespace-nowrap md:w-[140px]'
                    type='button'
                    label={t('Submit')}
                    onClick={() => formik.handleSubmit()}
                    title={`${t('Submit')}`}
                />
            </div>
            <Dialog className="custom-dialog" header="Crop Image" visible={cropper} style={{ width: '50vw', borderRadius: '12px' }} onHide={() => setCropper(false)} footer={() => dialogActionConst()}>
                {
                    image &&
                    <Cropper
                        ref={cropperRef}
                        style={{ height: 400, width: '100%' }}
                        zoomTo={0.5}
                        // aspectRatio={1}
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
                        cropBoxResizable={true}
                    />
                }
            </Dialog>
        </div>
    )
}

export default WhyChooseUs;
