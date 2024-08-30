/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textInput/TextInput';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TESTIMONIAL_POINT, DELETE_TESTIMONIAL_POINT, UPDATE_TESTIMONIAL, UPDATE_TESTIMONIAL_POINT } from '@framework/graphql/queries/testimonial';
import { LIST_TESTIMONIALS } from '@framework/graphql/mutations/testimonial';
import useValidation from '@framework/hooks/validations';
import { useFormik } from 'formik';
import { IMAGE_BASE_URL, API_MEDIA_END_POINT, DATA_URL_TO_FILE, MAX_FILE_SIZE, uploadImage } from '@config/constant';
import { Camera, Cross } from '@components/icons/icons';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { toast } from 'react-toastify';
import logo from '@assets/images/sidebar-logo.png';
import { Cropper, ReactCropperElement } from 'react-cropper';

interface Testimonial {
    uuid?: string;
    name?: string;
    description?: string;
    image?: string;
    order?: number;
    tag?: string;
    __typename?: string;
}
interface InitialValues {
    title?: string;
    description?: string;
    image?: string;
    order?: number;
    landing_page_testimonials?: Testimonial[];
}

function Testimonials() {
    const { t } = useTranslation();
    const { data, refetch } = useQuery(LIST_TESTIMONIALS);
    const [updateTestimonial] = useMutation(UPDATE_TESTIMONIAL);
    const [updateTestimonialPoint] = useMutation(UPDATE_TESTIMONIAL_POINT)
    const [addTestimonialPoint] = useMutation(ADD_TESTIMONIAL_POINT);
    const [removeTestimonial] = useMutation(DELETE_TESTIMONIAL_POINT);
    const [cropDataIndex, setCropDataIndex] = useState(0);
    const [deleteTestimonial, setDeleteTestimonial] = useState<string[]>([]);
    const [image, setImage] = useState(logo);
    const [cropper, setCropper] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { testimonialValidationSchema } = useValidation();
    const cropperRef = createRef<ReactCropperElement>();
    const initialValues: InitialValues = {
        title: '',
        description: '',
        image: '',
        order: 0,
        landing_page_testimonials: [
            {
                uuid: '',
                name: '',
                description: '',
                image: '',
                order: 0,
                tag: ''
            },
        ],
    };


    const formik = useFormik({
        validationSchema: testimonialValidationSchema,
        initialValues,
        onSubmit: async (values) => {
            updateTestimonial({
                variables: {
                    inputData: {
                        title: values?.title,
                        order: values?.order,
                    }
                },
            })
                .then(async (response) => {
                    await handleCheckPoint()
                    toast.success(response?.data?.updateTestimonialDetailsForWebsite?.message);
                    formik.resetForm()

                    refetch()
                })
                .catch((error) => {
                    toast.error(error.networkError.result.errors[0].message);
                });
        }
    });

    useEffect(() => {
        if (data?.getTestimonialsForWebsite) {
            const about = data?.getTestimonialsForWebsite?.data;
            const testimonialsDetails = data?.getTestimonialsForWebsite?.data?.landing_page_testimonials?.map((testimonials: { name: string, uuid: string, order: number, description: string, image: string, tag: string }) => {
                return {
                    name: testimonials?.name,
                    description: testimonials?.description,
                    image: testimonials?.image,
                    tag: testimonials?.tag,
                    order: testimonials?.order,
                    uuid: testimonials?.uuid,
                };
            });
            formik.resetForm({
                values: {
                    title: about?.title,
                    order: about?.order,
                    landing_page_testimonials: testimonialsDetails
                }
            });
        }
    }, [data?.getTestimonialsForWebsite]);

    const handleCheckPoint = async () => {
        const apiPromises: any = formik?.values?.landing_page_testimonials?.map((service) => {
            if (service?.uuid) {
                const inputData = {
                    uuid: service?.uuid,
                    name: service?.name,
                    tag: service?.tag,
                    order: service?.order,
                    image: service?.image,
                    description: service?.description
                };

                return updateTestimonialPoint({
                    variables: {
                        inputData: inputData,
                    },
                });
            } else {
                const inputData = {
                    // uuid: service?.uuid,
                    name: service?.name,
                    tag: service?.tag,
                    order: service?.order,
                    image: service?.image,
                    description: service?.description
                };

                return addTestimonialPoint({
                    variables: {
                        inputData: inputData,
                    },
                });

            }

        });
        apiPromises.push(
            removeTestimonial({
                variables: {
                    deleteIds: deleteTestimonial
                }
            })
        )

        try {
            await Promise.all(apiPromises);
            formik.resetForm();
            refetch();
        } catch (error: any) {
            toast.error(error?.networkError?.result?.errors[0]?.message);
        }

        return true;
    }


    const onDeleteImage = useCallback(async (index: number): Promise<void> => {
        const landingPageTestimonials = formik?.values?.landing_page_testimonials;

        if (landingPageTestimonials?.[index]) {
            const data = { fileName: landingPageTestimonials[index].image };
            axios.delete(`${API_MEDIA_END_POINT}/remove`, { data })
                .then(() => {
                    formik.setFieldValue(`landing_page_testimonials[${index}].image`, '');
                })
                .catch((error) => {
                    toast.error(error?.response?.data?.message);
                });
        }
    }, [formik]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleLogo = (e: any, index: number) => {
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
            const file = DATA_URL_TO_FILE(cropperRef.current?.cropper.getCroppedCanvas().toDataURL(), `landing_page_testimonials[${cropDataIndex}].image.png`);
            const formData = new FormData();
            formData.append('image', file);
            setLoading(true);
            fileName = await uploadImage(formData, 'website');
            if (fileName) {
                setLoading(false);
                formik.setFieldValue(`landing_page_testimonials[${cropDataIndex}].image`, fileName);
                setCropper(false);
                setCropDataIndex(0);
            }
        }
    };

    const dialogActionConst = () => {
        return (
            <div className='flex justify-end gap-3 md:gap-5'>
                <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Cancel" onClick={() => setCropper(false)} title={`${t('Cancel')}`} />
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Save" onClick={() => getCropData()} disabled={loading} title={`${t('Save')}`} />
            </div>
        )
    }

    function handleAddTestimonial() {

        formik.setFieldValue('landing_page_testimonials', [
            ...formik?.values?.landing_page_testimonials || [],
            {
                uuid: '',
                name: '',
                description: '',
                image: '',
                order: formik?.values?.landing_page_testimonials?.length || 0 + 1,
                tag: ''
            }
        ])
    }

    const handleDeleteTestimonial = (index: number, serviceData: Testimonial) => {
        const testimonialsList = [...formik?.values?.landing_page_testimonials || []];
        testimonialsList.splice(index, 1);
        formik.setFieldValue('landing_page_testimonials', testimonialsList);
        if (serviceData?.uuid) {
            setDeleteTestimonial([...deleteTestimonial || [], serviceData?.uuid])
        }

    };
    const testimonialsErrors = formik?.errors?.landing_page_testimonials as unknown as any[];

    return (
        <div className='flex flex-col h-full px-5 py-2'>
            <div className='flex flex-wrap mb-5 gap-x-5 gap-y-3'>
                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                    <TextInput placeholder={t('Enter Title')} label={'Title'} required={true} id='title' name='title' value={formik.values.title} onChange={formik.handleChange} error={formik.errors.title} />
                </div>

                <div className='w-full my-4'>
                    <h4 className='w-full mb-5'>{t('Author Details')}</h4>
                    {formik?.values?.landing_page_testimonials?.map((serviceData: Testimonial, index: number) => (
                        <>
                            <div className='w-full flex py-5 mt-auto justify-end'>
                                <Button
                                    className='btn-error btn-normal whitespace-nowrap md:w-[120px]'
                                    type='button'
                                    label={t('Delete')}
                                    onClick={() => handleDeleteTestimonial(index, serviceData)}
                                    title={`${t('Delete')}`}
                                />
                            </div>
                            <div key={`${index + 1}`} className='flex flex-wrap gap-x-5 gap-y-3.5'>

                                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                                    <TextInput placeholder={t('Enter Name')} label={'Name'} required={true}
                                        name={`landing_page_testimonials[${index}].name`}
                                        id={`name-${index}`}
                                        onChange={formik.handleChange}
                                        value={serviceData.name}
                                        error={testimonialsErrors?.[index]?.name}
                                    />
                                </div>
                                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                                    <TextInput placeholder={t('Enter Description')} label={'Description'} required={true}
                                        name={`landing_page_testimonials[${index}].description`}
                                        id={`description-${index}`}
                                        onChange={formik.handleChange}
                                        value={serviceData.description}
                                        error={testimonialsErrors?.[index]?.description}
                                    />
                                </div>
                                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                                    <TextInput placeholder={t('Enter Tag')} label={'Tag'} required={true}
                                        name={`landing_page_testimonials[${index}].tag`}
                                        id={`tag-${index}`}
                                        onChange={formik.handleChange}
                                        value={serviceData.tag}
                                        error={testimonialsErrors?.[index]?.tag}
                                    />
                                </div>

                                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                                    <label htmlFor={`image-${index}`}>
                                        {t('Author Image')}
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
                                                name={`landing_page_testimonials[${index}].image`}
                                                ref={fileInputRef}
                                                onChange={(e) => handleLogo(e, index)}
                                            />
                                            <div className='absolute bottom-0 p-2 text-2xl font-bold text-white rounded-full right-1 sm:right-2 bg-primary'>{<Camera />}</div>
                                        </label>
                                        {serviceData.image &&
                                            <Button className='absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-3 md:right-4 bg-error text-lg md:text-xl' type='button' label='' onClick={() => onDeleteImage(index)}>
                                                <Cross className='fill-white' />
                                            </Button>
                                        }
                                    </div>
                                    <p className='mt-2 error md:text-xs-15'>{t(testimonialsErrors?.[index]?.image)}</p>
                                </div>

                            </div>
                        </>

                    ))}

                </div>
            </div>
            <div className='flex py-5 mt-auto'>
                <Button
                    className='w-full btn btn-primary whitespace-nowrap md:w-[140px]'
                    type='button'
                    label={t('Add More')}
                    onClick={() => handleAddTestimonial()}
                    title={`${t('Add More')}`}
                />
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
        </div>
    )
}

export default Testimonials;
