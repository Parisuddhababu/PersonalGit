/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textInput/TextInput';
import { GET_ABOUT_US } from '@framework/graphql/queries/aboutUs';
import { useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import { UPDATE_ABOUT_US, UPDATE_ABOUT_US_POINT } from '@framework/graphql/mutations/about';
import { toast } from 'react-toastify';
import useValidation from '@framework/hooks/validations';
interface About {
    order: number;
    title: string;
    uuid: string;
    __typename?: string;
}
interface InitialValues {
    title: string;
    description: string;
    order: number;
    image: string;
    uuid: string;
    about: About[];
}
function AboutUs() {
    const { t } = useTranslation();
    const { data, refetch } = useQuery(GET_ABOUT_US);
    const [updateAboutUs] = useMutation(UPDATE_ABOUT_US);
    const [updateAboutUsPoint] = useMutation(UPDATE_ABOUT_US_POINT);
    const { changeAboutUsValidationSchema } = useValidation();

    const initialValues: InitialValues = {
        title: '',
        description: '',
        order: 0,
        image: '',
        uuid: '',
        about: [
            {
                title: '',
                order: 0,
                uuid: '',
            },
        ],
    };

    useEffect(() => {
        if (data?.getAboutUsDetailsForWebsite?.data) {
            const about = data?.getAboutUsDetailsForWebsite?.data;
            const aboutDetails = data?.getAboutUsDetailsForWebsite?.data?.landing_page_points?.map((aboutDetail: { title: string, uuid: string, order: number }) => {
                return {
                    title: aboutDetail.title,
                    order: aboutDetail?.order,
                    uuid: aboutDetail.uuid,
                };
            });
            formik.resetForm({
                values: {
                    title: about?.title,
                    description: about?.description,
                    order: about?.order,
                    image: about?.image,
                    uuid: about?.uuid,
                    about: aboutDetails
                }
            });
        }
    }, [data?.getAboutUsDetailsForWebsite?.data]);

    const handleCheckPoint = async () => {
        const apiPromises = formik?.values?.about.map((service) => {
            const inputData = {
                uuid: service?.uuid,
                title: service?.title,
                order: service?.order,
                landing_page_id: '',
            };

            return updateAboutUsPoint({
                variables: {
                    inputData: inputData,
                },
            });
        });
        try {
            const responses = await Promise.all(apiPromises);
            responses.forEach((response) => {
                toast.success(response?.data?.updateTitleForWebsite?.message);
            });
            formik.resetForm();
            refetch();
        } catch (error: any) {
            toast.error(error?.networkError?.result?.errors[0]?.message);
        }
    }
    const formik = useFormik({
        validationSchema: changeAboutUsValidationSchema,
        initialValues,
        onSubmit: async (values) => {
            updateAboutUs({
                variables: {
                    inputData: {
                        uuid: values?.uuid,
                        title: values?.title,
                        description: values?.description,
                        image: values?.image,
                        order: values?.order,
                    }
                },
            })
                .then((response) => {
                    toast.success(response?.data?.updateAboutUsDetailsForWebsite?.message);
                    formik.resetForm()
                    handleCheckPoint()
                    refetch()
                })
                .catch((error) => {
                    toast.error(error.networkError.result.errors[0].message);
                });
        }
    });

    const aboutErrors = formik?.errors?.about as any[];

    return (
        <div className='flex flex-col h-full px-5 py-2'>
            <div className='flex flex-wrap mb-5 gap-x-5 gap-y-3'>
                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                    <TextInput placeholder={t('Enter Title')} label={'Title'} required={true} name='title' id='title' onChange={formik.handleChange} value={formik.values.title} error={formik?.errors?.title} />
                </div>

                <div className='w-full 2xl:w-[calc(33.3%-13px)]'>
                    <TextInput placeholder={t('Enter Description')} label={'Description'} required={true} name='description' id='description' onChange={formik.handleChange} value={formik?.values?.description} error={formik?.errors?.description}/>
                </div>
                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                    <TextInput placeholder={t('Enter Video Url')} label={'Video Url'} required={true} name='image' id='image' onChange={formik.handleChange} value={formik.values.image} error={formik?.errors?.image} />
                </div>
                <div className='w-full'>
                    <label className='w-full'>{t('Check Points')}</label><label className='error'>*</label>
                    <div className='flex flex-wrap gap-x-5 gap-y-3.5'>
                        {formik?.values?.about.map((point: { title: string, uuid: string }, index: number) => {
                            return (
                                (
                                    <div key={point?.uuid} className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                                        <TextInput
                                            placeholder={t(`Enter Check Points ${index + 1}`)}
                                            required={true}
                                            name={`about[${index}].title`}
                                            value={point?.title}
                                            onChange={formik?.handleChange}
                                            id={`title-${index}`}
                                            error={aboutErrors?.[index]?.title && formik.touched.about?.[index]?.title ? aboutErrors?.[index]?.title : ''}
                
                                        />
                                    </div>
                                )
                            )
                        })}
                    </div>
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
        </div>
    )
}

export default AboutUs;
