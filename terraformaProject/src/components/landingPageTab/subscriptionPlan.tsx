/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textInput/TextInput';
import { useMutation, useQuery } from '@apollo/client';
import { LIST_PLAN } from '@framework/graphql/queries/plan';
import { useFormik } from 'formik';
import { UPDATE_SUBSCRIPTION_PLAN } from '@framework/graphql/mutations/plan';
import { toast } from 'react-toastify';
import useValidation from '@framework/hooks/validations';

interface SubscriptionPlanPoint {
    title: string;
    uuid?: string;
    description?: string;
  }
  
  interface SubscriptionPlanData {
    uuid?: string;
    name: string;
    price: string;
    description?: string;
    subscription_plan_points: SubscriptionPlanPoint[];
  }
  
  interface SubscriptionPlanValues {
    uuid?: string;
    title: string;
    description?: string;
    subscription_plans: SubscriptionPlanData[];
  }

  
function SubscriptionPlan() {
    const { t } = useTranslation();
    const { data, refetch } = useQuery(LIST_PLAN);
    const [changeSubscription] = useMutation(UPDATE_SUBSCRIPTION_PLAN);
    const { planValidationSchema } = useValidation();

    const initialValues: SubscriptionPlanValues = {
        uuid: '',
        title: '',
        subscription_plans: [
            {
                uuid: '',
                name: '',
                price: '',
                subscription_plan_points: [
                    {
                        title: '',
                        uuid: ''
                    }
                ]
            },
        ],
    };

    const formik = useFormik({
        validationSchema: planValidationSchema,
        initialValues,
        onSubmit: async (values) => {
            const { title } = values;
            const apiPromises = values?.subscription_plans?.map((service) => {
                const { name, price, subscription_plan_points } = service;
    
                const updatedSubscriptionPlanPoints = subscription_plan_points?.map((point: SubscriptionPlanPoint) => ({
                    ...point,
                    uuid: point?.uuid ,
                    title: point?.title ,
                    description: point?.description,
                }));
    
                return changeSubscription({
                    variables: {
                        inputData: {
                            uuid: data?.getSubscriptionPlansForWebsite?.data?.uuid,
                            title: title,
                            subscription_plans: [
                                {
                                    uuid: service.uuid,
                                    name: name,
                                    price: price,
                                    subscription_plan_points: updatedSubscriptionPlanPoints,
                                },
                            ],
                            description: values.description,
                        },
                    },
                });
            });
    
            try {
                const responses = await Promise.all(apiPromises);
                toast.success(responses[0]?.data?.updateSubscriptionPlanDetailsForWebsite?.message);

                formik.resetForm();
                refetch();
            } catch (error: any) {
                toast.error(error?.networkError?.result?.errors[0]?.message);
            }
        },
    });

    useEffect(() => {
        if (data?.getSubscriptionPlansForWebsite?.data) {
            const title = data?.getSubscriptionPlansForWebsite?.data?.title;
            const subscriptionPlans = data?.getSubscriptionPlansForWebsite?.data?.subscription_plans?.map((plan: { subscription_plan_points: SubscriptionPlanPoint[]; name: string; price: string; uuid: string; }) => {
                const subscriptionPoint = plan.subscription_plan_points?.map((point) => {
                    return {
                        title: point.title,
                        uuid: point.uuid,
                    };
                });

                return {
                    name: plan.name,
                    price: plan.price,
                    uuid: plan.uuid,
                    subscription_plan_points: subscriptionPoint,
                };
            });

            formik.resetForm({
                values: {
                    title: title,   
                    subscription_plans: subscriptionPlans,
                },
            });
        }
    }, [data?.getSubscriptionPlansForWebsite?.data]);

    const planErrors = formik?.errors?.subscription_plans as any[];
    return (
        <div className='flex flex-col h-full px-5 py-2'>
            <div className='flex flex-wrap mb-5 gap-x-5 gap-y-3'>
                <div className='w-full 2lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-13px)]'>
                    <TextInput placeholder={t('Enter Title')} label={'Title'} required={true} name='title' id='title' value={formik.values.title} onChange={formik.handleChange} />
                </div>
                <div className='w-full'>
                    <div className='my-5 '>
                        {formik?.values?.subscription_plans?.map((serviceData: { name: string, price: string, subscription_plan_points: SubscriptionPlanPoint[] }, index: number) => (
                          <div key={`serviceData-${index + 1}`}>
                            <h4 key={`${index + 1}`} className='w-full mb-4'>{t('Plan')} {index + 1} :</h4>
                            <div className='w-full grid grid-cols-2 gap-x-5 gap-y-3.5 '>
                                <div className='w-full '>
                                    <TextInput placeholder={t('Enter Plan')} label={'Plan'} required={true}
                                        name={`subscription_plans[${index}].name`}
                                        id={`name-${index}`}
                                        onChange={formik.handleChange}
                                        value={serviceData?.name}
                                        error={planErrors?.[index]?.name}

                                    />
                                </div>
                                <div className='w-full '>
                                    <TextInput placeholder={t('Enter Price')} label={'Price'} required={true}
                                        name={`subscription_plans[${index}].price`}
                                        id={`price-${index}`}
                                        onChange={formik.handleChange}
                                        value={serviceData?.price}
                                        error={planErrors?.[index]?.price}
                                    />
                                </div>
                                {serviceData?.subscription_plan_points?.map((points: {title:string},subindex:number) => {
                                  return(
                                    <div key={`${index + 1}`} className='w-full mt-3'>
                                    <label className='w-full'>{t('Key Points')} {subindex + 1} <span className='error'> *</span></label>
                                    <div className='flex flex-wrap gap-x-5 gap-y-3.5'>
                                        <div className='w-full '>
                                            <TextInput placeholder={t('Enter Key Points')} required={true} 
                                             name={`subscription_plans[${index}]subscription_plan_points[${subindex}]title`}
                                             id={`title-[${subindex}]`}
                                             onChange={formik.handleChange}
                                             value={points?.title}
                                             error={planErrors?.[index]?.subscription_plan_points?.[subindex]?.title}
                                            />
                                        </div>
                                    </div>
                                </div>)})}
                            </div>
                            </div>
                        ))}

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

export default SubscriptionPlan;
