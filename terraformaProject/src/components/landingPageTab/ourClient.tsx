/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textInput/TextInput';
import { CLIENT_DETAIL } from '@framework/graphql/queries/manageClient';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_CLIENT } from '@framework/graphql/mutations/manageClient';
import logo from '@assets/images/sidebar-logo.png';
import { useFormik } from 'formik';
import { IMAGE_BASE_URL, API_MEDIA_END_POINT, DATA_URL_TO_FILE, MAX_FILE_SIZE, uploadImage } from '@config/constant';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Camera, Cross } from '@components/icons/icons';
import { Dialog } from 'primereact/dialog';
import 'cropperjs/dist/cropper.css';
import { Cropper, ReactCropperElement } from 'react-cropper';
import useValidation from '@framework/hooks/validations';
interface Client {
    title?: string;
    image: string;
    uuid: string,
    __typename?: string;
}

function OurClient() {
    const { t } = useTranslation();
    const { data, refetch } = useQuery(CLIENT_DETAIL);
    const [ourClientImage, setOurClientImage] = useState(logo);
    const [cropDataIndex, setCropDataIndex] = useState(0);
    const [ourClientCropper, setOurClientCropper] = useState(false);
    const ourClientCropperRef = createRef<ReactCropperElement>();
    const ourClientFileInputRef = useRef<HTMLInputElement | null>(null);
    const [ourClientLoading, setOurClientLoading] = useState<boolean>(false);
    const [changeOurClientServices] = useMutation(UPDATE_CLIENT);
    const { ClientValidationSchema } = useValidation();
    const ourClientInitialValues: any = {
        order: 0,
        title: '',
        uuid: '',
        manageClient: [
            {
                image: '',
                uuid: '',
                title: ''
            },
        ],
    };


    const formik = useFormik({
        validationSchema: ClientValidationSchema,
        initialValues: ourClientInitialValues,
        onSubmit: async (values) => {
            const apiPromises = values?.manageClient.map((service: any) => {                
                return changeOurClientServices({
                    variables: {
                        inputData: {
                            ...service,
                            title: values.title
                        }
                    },
                });
            });
            try {
                const responses = await Promise.all(apiPromises);                
                toast.success(responses[0]?.data?.updateClientDetailsForWebsite?.message);
                refetch();
            } catch (error: any) {
                toast.error(error?.networkError?.result?.errors[0]?.message);
            }
        },
    });

    const onOurClientDeleteImage = useCallback(async (index: number): Promise<void> => {
        const data = { fileName: formik.values.manageClient[index].image };
        axios.delete(`${API_MEDIA_END_POINT}/remove`, { data })
            .then(() => {
                formik.setFieldValue(`manageClient[${index}].image`, '');
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message)
            });
    }, [formik]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOurClientLogo = (e: any, index: number) => {
        e.preventDefault();
        setCropDataIndex(index);
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
                        setOurClientImage(reader.result as any);
                        setOurClientCropper(true);
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                toast.error('Please select a valid image file');
            }
        }
        if (ourClientFileInputRef.current) {
            ourClientFileInputRef.current.value = ''; // This clears the input field
        }
    };

    const getOurClientCropData = async (): Promise<void> => {
        if (typeof ourClientCropperRef.current?.cropper !== 'undefined') {
            let fileName: string | null = null;
            const file = DATA_URL_TO_FILE(ourClientCropperRef.current?.cropper.getCroppedCanvas().toDataURL(), `manageClient[${cropDataIndex}].image.png`);
            const formData = new FormData();
            formData.append('image', file);
            setOurClientLoading(true);
            fileName = await uploadImage(formData, 'website');
            if (fileName) {
                setOurClientLoading(false);
                formik.setFieldValue(`manageClient[${cropDataIndex}].image`, fileName);
                setOurClientCropper(false);
                setCropDataIndex(0);
            }
        }
    };

    const ourClientDialogActionConst = () => {
        return (
            <div className='flex justify-end gap-3 md:gap-5'>
                <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Cancel" onClick={() => setOurClientCropper(false)}  title={`${t('Cancel')}`}/>
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Save" onClick={() => getOurClientCropData()} disabled={ourClientLoading}  title={`${t('Save')}`}/>
            </div>
        )
    }

    useEffect(() => {
        if (data?.getClientsForWebsite?.data?.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const cleanedServices: Client[] = data?.getClientsForWebsite?.data.map(({ __typename, ...rest }: Client) => rest);
            const defaultTitle = cleanedServices[0]?.title ?? '';
            formik.setValues({
                ...cleanedServices[0],
                title: defaultTitle,
                manageClient: cleanedServices.map(service => ({ image: service.image, title: '', uuid: service.uuid, })),
            });
        }
    }, [data]);

    const clientErrors = formik?.errors?.manageClient as any[];
    
    return (
        <div className='flex flex-col h-full px-5 py-2'>

            <TextInput
                placeholder={t('Enter Title')}
                label={'Enter Title'}
                required={true}
                name={'title'}
                id={'title'}
                onChange={formik.handleChange}
                value={formik?.values?.title}
                error={formik?.errors?.title ? formik?.errors?.title : ''}

            />
            {formik?.values?.manageClient?.map((serviceData: { image: string, title: string, uuid: string }, index: number) => (

                <div key={`${index + 1}`} className='flex flex-wrap gap-x-5 gap-y-3'>

                    <div key={serviceData.uuid} className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                        <label htmlFor={`image-${index}`}>
                            {t('Client Company Logo')}
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
                                    name={`manageClient[${index}].image`}
                                    ref={ourClientFileInputRef}
                                    onChange={(e) => handleOurClientLogo(e, index)}
                                />
                                <div className='absolute bottom-0 p-2 text-2xl font-bold text-white rounded-full right-1 sm:right-2 bg-primary'>{<Camera />}</div>
                            </label>
                            {serviceData.image &&
                                <Button className='absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-3 md:right-4 bg-error text-lg md:text-xl' type='button' label='' onClick={() => onOurClientDeleteImage(index)}  title={`${t('Close')}`}>
                                    <Cross className='fill-white' />
                                </Button>
                            }
                        </div>
                        {clientErrors?.[index]?.image ? <p className='mt-2 error md:text-xs-15'>{t(clientErrors?.[index]?.image)}</p> : ''}

                    </div>


                </div>))}
            <div className='flex py-5 mt-auto'>
                <Button
                    className='w-full ml-auto btn btn-primary whitespace-nowrap md:w-[140px]'
                    type='button'
                    label={t('Submit')}
                    onClick={formik.handleSubmit}
                    title={`${t('Submit')}`}
                />
            </div>
            <Dialog className="custom-dialog" header="Crop Image" visible={ourClientCropper} style={{ width: '50vw', borderRadius: '12px' }} onHide={() => setOurClientCropper(false)} footer={() => ourClientDialogActionConst()}>
                {
                    ourClientImage &&
                    <Cropper
                        ref={ourClientCropperRef}
                        style={{ height: 400, width: '100%' }}
                        zoomTo={0.5}
                        // aspectRatio={2/1}
                        preview=".img-preview"
                        src={ourClientImage}
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

export default OurClient;
