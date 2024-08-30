/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textInput/TextInput';
import { useMutation, useQuery } from '@apollo/client';
import { LIST_ABOUT_COURSE } from '@framework/graphql/queries/aboutCourse';
import { UPDATE_ABOUT_COURSE, UPDATE_ABOUT_COURSE_POINT } from '@framework/graphql/mutations/aboutCourse';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import useValidation from '@framework/hooks/validations';
interface About {
    order?: number;
    title?: string;
    uuid?: string;
    image?: string;
    description?: string;
    landing_page_id?: string;
    __typename?: string;
}
interface InitialValues {
    title: string;
    description: string;
    order: number;
    image: string;
    aboutCoursePoint: About[];
}
function AboutCourses() {
    const { t } = useTranslation();
    const { data, refetch } = useQuery(LIST_ABOUT_COURSE);
    const [updateAboutCourse] = useMutation(UPDATE_ABOUT_COURSE);
    const [updateAboutCoursePoint] = useMutation(UPDATE_ABOUT_COURSE_POINT)
    const { aboutCourseValidationSchema } = useValidation();
    const initialValues: InitialValues = {
        title: '',
        description: '',
        image: '',
        order: 0,
        aboutCoursePoint: [
            {
                uuid: '',
                landing_page_id: '',
                title: '',
                order: 0,
            },
        ],
    };

    useEffect(() => {
        if (data?.getLearnAboutCoursesForWebsite?.data) {
            const about = data?.getLearnAboutCoursesForWebsite?.data;
            const aboutDetails = data?.getLearnAboutCoursesForWebsite?.data?.landing_page_points?.map((aboutDetail: { title: string, uuid: string, order: number }) => {
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
                    aboutCoursePoint: aboutDetails
                }
            });
        }
    }, [data?.getLearnAboutCoursesForWebsite?.data]);

    const handleCheckPointAboutCourse = async () => {
        const apiPromises = formik?.values?.aboutCoursePoint.map((service) => {
            const inputData = {
                uuid: service?.uuid,
                title: service?.title,
                order: service?.order,
                landing_page_id: '',
            };

            return updateAboutCoursePoint({
                variables: {
                    inputData: inputData,
                },
            });
        });
        try {
            await Promise.all(apiPromises);

            formik.resetForm();
            refetch();
        } catch (error: any) {
            toast.error(error?.networkError?.result?.errors[0]?.message);
        }
    }

    const formik = useFormik({
        validationSchema: aboutCourseValidationSchema,
        initialValues,
        onSubmit: async (values) => {
            updateAboutCourse({
                variables: {
                    inputData: {
                        title: values?.title,
                        description: values?.description,
                        image: '',
                        order: values?.order,
                    }
                },
            })
                .then((response) => {
                    toast.success(response?.data?.updateAboutCourseDetailsForWebsite?.message);
                    formik.resetForm()
                    handleCheckPointAboutCourse()
                    refetch()
                })
                .catch((error) => {
                    toast.error(error.networkError.result.errors[0].message);
                });
        }
    });

    const aboutCourseErrors = formik?.errors?.aboutCoursePoint as any[];

    return (
        <div className='flex flex-col h-full px-5 py-2'>
            <div className='flex flex-wrap mb-5 gap-x-5 gap-y-3'>
                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                    <TextInput placeholder={t('Enter Title')} label={'Title'} required={true} name='title' id='title' value={formik.values.title} onChange={formik.handleChange} error={formik.errors.title} />
                </div>
                <div className='w-full 2xl:w-[calc(33.3%-13px)]'>
                    <TextInput placeholder={t('Enter Description')} label={'Description'} required={true} name='description' id='description' value={formik.values.description} onChange={formik.handleChange} error={formik.errors.description} />
                </div>
                {formik?.values?.aboutCoursePoint.map((point, index: number) => {
                    return (
                        <div className='w-full' key={`${index + 1}`}>
                            <label className='w-full'>{t('Check Points')} {index + 1}<span className='error'> *</span></label>
                            <div className='flex flex-wrap gap-x-5 gap-y-3.5'>
                                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                                    <TextInput
                                        placeholder={t('Enter Check Points 1')}
                                        required={true}
                                        name={`aboutCoursePoint[${index}].title`}
                                        value={point?.title}
                                        onChange={formik?.handleChange}
                                        id={`title-${index}`}
                                        error={aboutCourseErrors?.[index]?.title && formik.touched.aboutCoursePoint?.[index]?.title ? aboutCourseErrors?.[index]?.title : ''}

                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
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

export default AboutCourses;
