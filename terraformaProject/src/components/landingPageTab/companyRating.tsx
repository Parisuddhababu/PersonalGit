/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textInput/TextInput';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_COUNT } from '@framework/graphql/mutations/count';
import { GET_COUNT } from '@framework/graphql/queries/count';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import useValidation from '@framework/hooks/validations';
interface Rating {
    description: string;
    image?: string;
    order: number;
    title: string;
    uuid?: string;
    __typename?: string;
    type?:string
}

function CompanyRating() {
    const { t } = useTranslation();
    const [changeCount] = useMutation(UPDATE_COUNT);
    const { data, refetch } = useQuery(GET_COUNT);
    const { ratingValidationSchema } = useValidation();
    const initialValues: { rating: Rating[] } = {
        rating: [
            {
                description: '',
                order: 0,
                title: '',
                image:''
            },
        ],
    };

    useEffect(() => {
        if (data?.getStatisticsForWebsite?.data?.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const cleanedServices: Rating[] = data?.getStatisticsForWebsite?.data.map(({ __typename,type, ...rest }: Rating) => rest);
            formik.setFieldValue('rating', cleanedServices);
        }
    }, [data]);

    const formik = useFormik({
        validationSchema: ratingValidationSchema,
        initialValues,
        onSubmit: async (values) => {
            const apiPromises = values.rating.map((service) => {
                return changeCount({
                    variables: {
                        inputData:  service
                    },
                });
            });
            try {
                const responses = await Promise.all(apiPromises);
                toast.success(responses[0]?.data?.updateStatisticDetailsForWebsite?.message);
                refetch();
            } catch (error: any) {
                toast.error(error?.networkError?.result?.errors[0]?.message);
            }
        },
    });

    const ratingErrors = formik?.errors?.rating as any[];

    return (
        <div className='flex flex-col h-full px-5 py-2'>
            {formik?.values?.rating?.map((serviceData: { title: string, description: string}, index: number) => (
                <div key={`${index + 1}`} className='flex flex-wrap mb-5 gap-x-5 gap-y-3'>
                    <h4 className='w-full mb-2'>{t('Rating')} {index + 1} :</h4>
                    <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                        <TextInput placeholder={t('Enter Rating')} label={'Rating'} required={true}
                            name={`rating[${index}].title`}
                            id={`title-${index}`}
                            onChange={formik.handleChange}
                            value={serviceData.title}
                            error={ratingErrors?.[index]?.title && formik.touched.rating?.[index]?.title ? ratingErrors?.[index]?.title : ''}
                        />
                    </div>
                    <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                        <TextInput placeholder={t('Enter Description')} label={'Description'} required={true}
                            name={`rating[${index}].description`}
                            id={`description-${index}`}
                            onChange={formik.handleChange}
                            value={serviceData.description}
                            error={ratingErrors?.[index]?.description && formik.touched.rating?.[index]?.description ? ratingErrors?.[index]?.description : ''}
                        />
                    </div>
                </div>))}
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

export default CompanyRating;
