/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textInput/TextInput';
import { useMutation, useQuery } from '@apollo/client';
import logo from '@assets/images/sidebar-logo.png';
import { SERVICE_DETAIL } from '@framework/graphql/queries/service';
import { UPDATE_WEST_COLLECTION, UPDATE_WEST_COLLECTION_POINT } from '@framework/graphql/mutations/wasteCollection';
import { toast } from 'react-toastify';
import axios from 'axios';
import { IMAGE_BASE_URL, API_MEDIA_END_POINT, DATA_URL_TO_FILE, MAX_FILE_SIZE, uploadImage } from '@config/constant';
import { useFormik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { Camera, Cross } from '@components/icons/icons';
import useValidation from '@framework/hooks/validations';
interface About {
    order: number;
    title: string;
    uuid: string;
    description?: string;
    image: string;
    __typename?: string;
}
interface InitialValues {
    title: string;
    description: string;
    order: number;
    uuid: string;
    landing_page_services: About[];
}

function WasteCollection() {
    const { t } = useTranslation();
    const { data, refetch } = useQuery(SERVICE_DETAIL);
    const [updateAboutUs] = useMutation(UPDATE_WEST_COLLECTION);
    const [updateWastPoint] = useMutation(UPDATE_WEST_COLLECTION_POINT);
    const [cropDataWasteCollection, setCropDataWasteCollection] = useState(0);
    const [wasteCollectionImage, setWasteCollectionImage] = useState(logo);
    const [wasteCollectionCropper, setWasteCollectionCropper] = useState(false);
    const fileWasteCollectionInputRef = useRef<HTMLInputElement | null>(null);
    const [wasteCollectionCropperLoading, setWasteCollectionLoading] = useState<boolean>(false);
    const { wasteCollectionValidationSchema } = useValidation();
    const cropperWasteCollectionRef = createRef<ReactCropperElement>();
    const wastCollectionInitialValues: InitialValues = {
        title: '',
        description: '',
        order: 0,
        uuid: '',
        landing_page_services: [
            {
                title: '',
                description: '',
                image: '',
                order: 0,
                uuid: '',
            },
        ],
    };

    useEffect(() => {
        if (data?.getServicesForWebsite?.data) {
            const about = data?.getServicesForWebsite?.data;
            const aboutDetails = data?.getServicesForWebsite?.data?.landing_page_services?.map((aboutDetail: { title: string, uuid: string, order: number, description: string, image: string }) => {
                return {
                    title: aboutDetail?.title,
                    description: aboutDetail?.description,
                    image: aboutDetail?.image,
                    order: aboutDetail?.order,
                    uuid: aboutDetail?.uuid,
                };
            });
            formik.resetForm({
                values: {
                    title: about?.title,
                    description: about?.description,
                    order: about?.order,
                    uuid: about?.uuid,
                    landing_page_services: aboutDetails
                }
            });
        }
    }, [data?.getServicesForWebsite?.data]);

    const handleWastCollectionCheckPoint = async () => {
        const apiWastCollectionPromises = formik?.values?.landing_page_services.map((service) => {
            const inputData = {
                uuid: service?.uuid,
                title: service?.title,
                order: service?.order,
                image: service?.image,
                description: service?.description
            };

            return updateWastPoint({
                variables: {
                    inputData: inputData,
                },
            });
        });
        try {
            await Promise.all(apiWastCollectionPromises);
            formik.resetForm();
            refetch();
        } catch (error: any) {
            toast.error(error?.networkError?.result?.errors[0]?.message);
        }
        return true
    }

    const formik = useFormik({
        validationSchema: wasteCollectionValidationSchema,
        initialValues: wastCollectionInitialValues,
        onSubmit: async (values) => {
            updateAboutUs({
                variables: {
                    inputData: {
                        // uuid: values?.uuid,
                        title: values?.title,
                        description: values?.description,
                        order: values?.order,
                    }
                },
            })
                .then((response) => {
                    toast.success(response?.data?.updateServiceDetailsForWebsite?.message);
                    formik.resetForm()
                    handleWastCollectionCheckPoint()
                    refetch()
                })
                .catch((error) => {
                    toast.error(error.networkError.result.errors[0].message);
                });
        }
    });

    const onDeleteWastCollectionImage = useCallback(async (index: number): Promise<void> => {
        const data = { fileName: formik.values.landing_page_services[index].image };
        axios.delete(`${API_MEDIA_END_POINT}/remove`, { data })
            .then(() => {
                formik.setFieldValue(`landing_page_services[${index}].image`, '');
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message)
            });
    }, [formik]);


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleWastCollectionLogo = (e: any, index: number) => {
        e.preventDefault();
        setCropDataWasteCollection(index);
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
                        setWasteCollectionImage(reader.result as any);
                        setWasteCollectionCropper(true);
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                toast.error('Please select a valid image file');
            }
        }
        if (fileWasteCollectionInputRef.current) {
            fileWasteCollectionInputRef.current.value = ''; // This clears the input field
        }
    };

    const getWastCropData = async (): Promise<void> => {
        if (typeof cropperWasteCollectionRef.current?.cropper !== 'undefined') {
            let fileName: string | null = null;
            const file = DATA_URL_TO_FILE(cropperWasteCollectionRef.current?.cropper.getCroppedCanvas().toDataURL(), `landing_page_services[${cropDataWasteCollection}].image.png`);
            const formData = new FormData();
            formData.append('image', file);
            setWasteCollectionLoading(true);
            fileName = await uploadImage(formData, 'website');
            if (fileName) {
                setWasteCollectionLoading(false);
                formik.setFieldValue(`landing_page_services[${cropDataWasteCollection}].image`, fileName);
                setWasteCollectionCropper(false);
                setCropDataWasteCollection(0);
            }
        }
    };

    const dialogWastActionConst = () => {
        return (
            <div className='flex justify-end gap-3 md:gap-5'>
                <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Cancel" onClick={() => setWasteCollectionCropper(false)} title={`${t('Cancel')}`} />
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Save" onClick={() => getWastCropData()} disabled={wasteCollectionCropperLoading} title={`${t('Save')}`} />
            </div>
        )
    }

    const wasteErrors = formik?.errors?.landing_page_services as any[];

    return (
        <div className='flex flex-col h-full px-5 py-2'>
            <div className='flex flex-wrap gap-x-5 gap-y-3'>
                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                    <TextInput placeholder={t('Enter Title')} label={'Title'} required={true} name='title' id='title' onChange={formik.handleChange} value={formik?.values?.title} error={formik.errors.title} />
                </div>
                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                    <TextInput placeholder={t('Enter SubTitle')} label={'SubTitle'} required={true} name='description' id='description' onChange={formik.handleChange} value={formik?.values?.description} error={formik.errors.description} />
                </div>
                {formik?.values?.landing_page_services?.map((serviceData: About, index: number) => (
                    <div key={serviceData.uuid} className='w-full'>
                        <div className='flex flex-wrap py-4 gap-x-5 gap-y-3'>
                            <h4 className='w-full mb-5'>{t('Waste Collection')} {index + 1}</h4>
                            <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                                <label htmlFor={`image-${index}`}>
                                    {t('Collection Image')}
                                </label>
                                <div className='box-border border border-solid aspect-video border-border-primary rounded-xl relative flex flex-col items-center justify-center overflow-hidden'>
                                    <label
                                        htmlFor={`image-${index}`}
                                        className='relative flex flex-col h-full w-full items-center justify-center'>
                                        <div className='flex items-center justify-center overflow-hidden border border-solid w-full h-full cursor-pointer border-border-primary'>
                                            <img src={serviceData?.image?.includes(IMAGE_BASE_URL) ? serviceData.image : IMAGE_BASE_URL + serviceData.image} alt='service_image' className='object-contain w-full h-full bg-black' />
                                        </div>
                                        <input
                                            type='file'
                                            multiple
                                            className='focus:bg-transparent absolute top-1/2 opacity-0'
                                            accept='image/*'
                                            id={`image-${index}`}
                                            name={`landing_page_services[${index}].image`}
                                            ref={fileWasteCollectionInputRef}
                                            onChange={(e) => handleWastCollectionLogo(e, index)}
                                        />
                                        <div className='absolute bottom-0 p-2 text-2xl font-bold text-white rounded-full right-1 sm:right-2 bg-primary'>{<Camera />}</div>
                                    </label>
                                    {serviceData.image &&
                                        <Button className='absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-3 md:right-4 bg-error text-lg md:text-xl' type='button' label='' onClick={() => onDeleteWastCollectionImage(index)} title={`${t('Close')}`} >
                                            <Cross className='fill-white' />
                                        </Button>
                                    }
                                </div>
                                {wasteErrors?.[index]?.image && formik.touched.landing_page_services?.[index]?.image ? <p className='mt-2 error md:text-xs-15'>{t(wasteErrors?.[index]?.image)}</p> : ''}
                            </div>
                            <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                                <TextInput placeholder={t('Enter Collection Title')} label={'Collection Title'} required={true}
                                    name={`landing_page_services[${index}].title`}
                                    id={`title-${index}`}
                                    onChange={formik.handleChange}
                                    value={serviceData.title}
                                    error={wasteErrors?.[index]?.title && formik.touched.landing_page_services?.[index]?.title ? wasteErrors?.[index]?.title : ''}
                                />
                            </div>
                            <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                                <TextInput placeholder={t('Enter Collection Description')} label={'Collection Description'} required={true}
                                    name={`landing_page_services[${index}].description`}
                                    id={`description-${index}`}
                                    onChange={formik.handleChange}
                                    value={serviceData.description}
                                    error={wasteErrors?.[index]?.description && formik.touched.landing_page_services?.[index]?.description ? wasteErrors?.[index]?.description : ''}
                                />
                            </div>
                        </div>
                    </div>))}
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
            <Dialog className="custom-dialog" header="Crop Image" visible={wasteCollectionCropper} style={{ width: '50vw', borderRadius: '12px' }} onHide={() => setWasteCollectionCropper(false)} footer={() => dialogWastActionConst()}>
                {
                    wasteCollectionImage &&
                    <Cropper
                        ref={cropperWasteCollectionRef}
                        style={{ height: 400, width: '100%' }}
                        zoomTo={0.5}
                        // aspectRatio={1}
                        preview=".img-preview"
                        src={wasteCollectionImage}
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

export default WasteCollection;
