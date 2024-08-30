/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { useMutation, useQuery } from '@apollo/client';
import { Dialog } from 'primereact/dialog';
import 'cropperjs/dist/cropper.css';
import Button from '@components/button/button';
import logo from '@assets/images/sidebar-logo.png'
import TextInput from '@components/textInput/TextInput';
import { Camera, Cross } from '@components/icons/icons';
import { MANAGE_STEPS } from '@framework/graphql/queries/manaeSteps';
import { UPDATE_SERVICES } from '@framework/graphql/mutations/services';
import { IMAGE_BASE_URL, API_MEDIA_END_POINT, DATA_URL_TO_FILE, MAX_FILE_SIZE, uploadImage } from '@config/constant';
import useValidation from '@framework/hooks/validations';
interface Service {
    description: string;
    image: string;
    order: number;
    title: string;
    uuid: string;
    __typename?: string;
}

function Services() {
    const { t } = useTranslation();
    const { data, refetch } = useQuery(MANAGE_STEPS);
    const [image, setImage] = useState(logo);
    const [cropDataLandingServiceIndex, setCropLandingServiceDataIndex] = useState(0);
    const [landingServiceCropper, setLandingServiceCropper] = useState(false);
    const [landingServiceLoading, setLandingServiceLoading] = useState<boolean>(false);
    const [changeServices] = useMutation(UPDATE_SERVICES);
    const landingServiceFileInputRef = useRef<HTMLInputElement | null>(null);
    const cropperLandingServiceRef = createRef<ReactCropperElement>();
    const { changeServicesValidationSchema } = useValidation();
    const landingServiceInitialValues: { services: Service[] } = {
        services: [
            {
                description: '',
                image: '',
                order: 0,
                title: '',
                uuid: '',
            },
        ],
    };

    useEffect(() => {
        if (data?.getStepsForWebsite?.data?.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const cleanedServices: Service[] = data?.getStepsForWebsite?.data.map(({ __typename, ...rest }: Service) => rest);
            formik.setFieldValue('services', cleanedServices);
        }
    }, [data]);

    const formik = useFormik({
        validationSchema: changeServicesValidationSchema,
        initialValues: landingServiceInitialValues,
        onSubmit: async (values) => {
            const apiPromises = values.services.map((service) => {
                return changeServices({
                    variables: {
                        inputData: service
                    },
                });
            });
            try {
                const responses = await Promise.all(apiPromises);
                toast.success(responses[0]?.data?.updateStepDetailsForWebsite?.message);
                refetch();
            } catch (error: any) {
                toast.error(error?.networkError?.result?.errors[0]?.message);
            }
        },
    });

    const onLadingServiceDeleteImage = useCallback(async (index: number): Promise<void> => {
        const data = { fileName: formik.values.services[index].image };
        axios.delete(`${API_MEDIA_END_POINT}/remove`, { data })
            .then(() => {
                formik.setFieldValue(`services[${index}].image`, '');
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message)
            });
    }, [formik]);


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const landingServiceHandleLogo = (e: any, index: number) => {
        e.preventDefault();
        setCropLandingServiceDataIndex(index);
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
                        setLandingServiceCropper(true);
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                toast.error('Please select a valid image file');
            }
        }
        if (landingServiceFileInputRef.current) {
            landingServiceFileInputRef.current.value = ''; // This clears the input field
        }
    };

    const getLandingServiceCropData = async (): Promise<void> => {
        if (typeof cropperLandingServiceRef.current?.cropper !== 'undefined') {
            let fileName: string | null = null;
            const file = DATA_URL_TO_FILE(cropperLandingServiceRef.current?.cropper.getCroppedCanvas().toDataURL(), `services[${cropDataLandingServiceIndex}].image.png`);
            const formData = new FormData();
            formData.append('image', file);
            setLandingServiceLoading(true);
            fileName = await uploadImage(formData,'website');
            if (fileName) {
                setLandingServiceLoading(false);
                formik.setFieldValue(`services[${cropDataLandingServiceIndex}].image`, fileName);
                setLandingServiceCropper(false);
                setCropLandingServiceDataIndex(0);
            }
        }
    };

    const landingServiceDialogActionConst = () => {
        return (
            <div className='flex justify-end gap-3 md:gap-5'>
                <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Cancel" onClick={() => setLandingServiceCropper(false)}  title={`${t('Cancel')}`} />
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Save" onClick={() => getLandingServiceCropData()} disabled={landingServiceLoading}  title={`${t('Save')}`} />
            </div>
        )
    }
    const serviceErrors = formik?.errors?.services as any[];

    return (
        <div className='px-5 pt-2 pb-5'>
            {formik?.values?.services?.map((serviceData: { image: string, title: string, description: string, uuid: string }, index: number) => (
                <div key={serviceData?.uuid} className='mb-5'>
                    <h4 className='mb-5'>{t(`Step ${index + 1}`)}:</h4>
                    <div className='flex flex-wrap gap-x-5 gap-y-3'>
                        <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                            <label htmlFor={`image-${index}`}>
                                {t('Service Image')}
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
                                        name={`services[${index}].image`}
                                        ref={landingServiceFileInputRef}
                                        onChange={(e) => landingServiceHandleLogo(e, index)}
                                    />
                                    <div className='absolute bottom-0 p-2 text-2xl font-bold text-white rounded-full right-1 sm:right-2 bg-primary'>{<Camera />}</div>
                                </label>
                                {serviceData.image &&
                                    <Button className='absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-3 md:right-4 bg-error text-lg md:text-xl' type='button' label='' onClick={() => onLadingServiceDeleteImage(index)}  title={`${t('Close')}`} >
                                        <Cross className='fill-white' />
                                    </Button>
                                }
                            </div>
                            {serviceErrors?.[index]?.image && formik.touched.services?.[index]?.image ? <p className='mt-2 error md:text-xs-15'>{t(serviceErrors?.[index]?.image)}</p> : ''}
                        </div>
                        <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                            <TextInput
                                placeholder={t('Enter Service Title')}
                                label={'Service Title'}
                                required={true}
                                name={`services[${index}].title`}
                                id={`title-${index}`}
                                onChange={formik.handleChange}
                                value={serviceData.title}
                                error={serviceErrors?.[index]?.title && formik.touched.services?.[index]?.title ? serviceErrors?.[index]?.title : ''}
                            />
                        </div>
                        <div className='w-full 2xl:w-[calc(33.3%-13px)]'>
                            <TextInput
                                placeholder={t('Enter Service Description')}
                                label={'Service Description'}
                                required={true}
                                name={`services[${index}].description`}
                                id={`description-${index}`}
                                onChange={formik.handleChange}
                                value={serviceData.description}
                                error={serviceErrors?.[index]?.description && formik.touched.services?.[index]?.description ? serviceErrors?.[index]?.description : ''}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <div className='flex'>
                <Button
                    className='w-full ml-auto btn btn-primary whitespace-nowrap md:w-[140px]'
                    type='button'
                    label={t('Submit')}
                    onClick={() => formik.handleSubmit()}
                    title={`${t('Submit')}`}
                />
            </div>

            <Dialog className="custom-dialog" header="Crop Image" visible={landingServiceCropper} style={{ width: '50vw', borderRadius: '12px' }} onHide={() => setLandingServiceCropper(false)} footer={() => landingServiceDialogActionConst()}>
                {
                    image &&
                    <Cropper
                        ref={cropperLandingServiceRef}
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
    );
}

export default Services;
