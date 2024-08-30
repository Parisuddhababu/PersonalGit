import React, { ReactElement, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import Button from '@components/button/button';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES, USER_STATUS } from '@config/constant';
import { CheckCircle, Cross, PlusCircle, Trash } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { whiteSpaceRemover } from '@utils/helpers';
import 'react-image-crop/dist/ReactCrop.css';
import { Loader } from '@components/index';
import { FETCH_SUBSCRIPTION_PLAN } from '@framework/graphql/queries/planManagement';
import { SubscriptionForm } from '@type/subscriptionPlan';
import { CREATE_SUBSCRIPTION_PLAN, UPDATE_SUBSCRIPTION_PLAN } from '@framework/graphql/mutations/planManagement';
import useValidation from '@src/hooks/validations';
import { NUMERIC_VALUE } from '@config/regex';

const AddEditPlanManagement = (): ReactElement => {
    const [createSubscriptionPlan, { loading: createLoader }] = useMutation(CREATE_SUBSCRIPTION_PLAN);
    const [updateSubscriptionPlan, { loading: updateLoader }] = useMutation(UPDATE_SUBSCRIPTION_PLAN);
    const navigate = useNavigate();
    const { subscriptionValidationSchema } = useValidation();
    const params = useParams();
    const { data: singleSubScriptionPlan, loading } = useQuery(FETCH_SUBSCRIPTION_PLAN, {
        variables: { uuid: params.id },
        skip: !params.id,
        fetchPolicy: 'network-only',
    });

    /**
     * Method that sets form data while edit
     */
    useEffect(() => {
        if (singleSubScriptionPlan && params.id) {
            const planData = singleSubScriptionPlan?.fetchSubscriptionPlan?.data;
            formik.setValues({
                planTitle: planData?.plan_title,
                planDescription: planData?.plan_description,
                noOfSessions: planData?.no_of_sessions,
                orderNo: planData?.order_no,
                status: planData?.status,
                planFeatures: planData?.plan_features.map((item: { isActive: boolean, name: string }) => {
                    return {
                        isActive: item.isActive,
                        name: item.name
                    }
                }),
                planPrice: planData?.plan_price,
            });
        }
    }, [singleSubScriptionPlan]);

    const initialValues: SubscriptionForm = {
        planTitle: '',
        planDescription: '',
        noOfSessions: '',
        planFeatures: [{
            isActive: true,
            name: ''
        }],
        planPrice: '',
        orderNo: '',
        status: ''
    };
    /**
     * Handles update
     * @param values
     */
    const UpdateFunction = (values: SubscriptionForm) => {
        updateSubscriptionPlan({
            variables: {
                uuid: params.id,
                planTitle: values.planTitle,
                planDescription: values.planDescription,
                noOfSessions: +values.noOfSessions,
                planFeatures: values.planFeatures,
                planPrice: +values.planPrice,
                orderNo: values.orderNo,
                status: values.status === '1' ? USER_STATUS.Active : USER_STATUS.Inctive
            },
        })
            .then((res) => {
                const data = res.data;
                if (data.updateSubscriptionPlan.meta.statusCode === 200 || data.updateSubscriptionPlan.meta.statusCode === 201) {
                    toast.success(data.updateSubscriptionPlan.meta.message);
                    formik.resetForm();
                    onSubscriptionCancel();
                }
            })
            .catch(() => {
                return;
            });
    };
    const formik = useFormik({
        initialValues,
        validationSchema: params.id ? subscriptionValidationSchema({ params: params.id }) : subscriptionValidationSchema({ params: undefined }),
        onSubmit: async (values) => {
            if (params.id) {
                UpdateFunction(values);
            } else {
                createSubscriptionPlan({
                    variables: {
                        planTitle: values.planTitle,
                        planDescription: values.planDescription,
                        noOfSessions: +values.noOfSessions,
                        planFeatures: values.planFeatures,
                        planPrice: +values.planPrice,
                    },
                })
                    .then((res) => {
                        const data = res.data;
                        if (data.createSubscriptionPlan.meta.statusCode === 200 || data.createSubscriptionPlan.meta.statusCode === 201) {
                            toast.success(data.createSubscriptionPlan.meta.message);
                            formik.resetForm();
                            onSubscriptionCancel();
                        }
                    })
                    .catch(() => {
                        return;
                    });
            }
        },
    });
    /**
     * Method that redirect to list page
     */
    const onSubscriptionCancel = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.planManagement}/${ROUTES.list}`);
    }, []);


    /**
     * error message handler
     * @param fieldName
     * @returns
     */
    const getErrorSubscription = (fieldName: keyof SubscriptionForm) => {
        const error = formik.errors[fieldName] as string | { name: string }[];
        const touched = formik.touched[fieldName];
        if (error && touched) {
            if (typeof error === 'string') {
                return error;
            } else if (Array.isArray(error)) {
                return error.map((err) => err?.name ? err?.name : '')
            } else {
                return '';
            }
        }
        return '';
    };

    /**
     * Handle blur that removes white space's
     */
    const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);
    const hnadleSessionChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const input = event.target.value;
        const numericValue = input.replace(NUMERIC_VALUE, '');
        formik.setFieldValue('noOfSessions', numericValue);
    }, []);
    return (
        <div className='card'>
            {(createLoader || updateLoader || loading) && <Loader />}
            <form onSubmit={formik.handleSubmit}>
                <div className='card-body'>
                    <div className='card-title-container'>
                        <p>
                            {('Fields marked with')} <span className='text-red-700'>*</span> {('are mandatory.')}
                        </p>
                    </div>

                    <div className='card-grid-addedit-page md:grid-cols-2'>
                        <div>
                            <TextInput id={'planTitle'} onBlur={OnBlur} required={true} placeholder={('Plan Title')} name='planTitle' onChange={formik.handleChange} label={('Plan Title')} value={formik.values.planTitle} error={getErrorSubscription('planTitle')} />
                        </div>
                        <div>
                            <TextInput id={'planDescription'} onBlur={OnBlur} required={true} placeholder={('Plan Description')} name='planDescription' onChange={formik.handleChange} label={('Plan Description')} value={formik.values.planDescription} error={getErrorSubscription('planDescription')} />
                        </div>
                        <div>
                            <TextInput id={'noOfSessions'} onBlur={OnBlur} required={true} placeholder={('Session Count')} name='noOfSessions' onChange={hnadleSessionChange} label={('Session Count')} value={formik.values.noOfSessions} error={getErrorSubscription('noOfSessions')} />
                        </div>
                        <div>
                            <TextInput id={'planPrice'} onBlur={OnBlur} required={true} placeholder={('Plan Price')} name='planPrice' onChange={formik.handleChange} label={('Plan Price')} value={formik.values.planPrice} error={getErrorSubscription('planPrice')} />
                        </div>

                        <FormikProvider value={formik}>
                            <FieldArray
                                name="friends"
                                render={useCallback(() => (
                                    <>
                                        {formik.values.planFeatures && formik.values.planFeatures.length > 0 &&
                                            <>
                                                {formik.values.planFeatures.map((_, index) => {
                                                    const planFeatures = `planFeatures[${index}].name`
                                                    return <div className='add-plan-management-control' key={`${index + 1}`}>
                                                        <TextInput addPlanClass="add-plan-management-text-input" id={'planFeatures'} onBlur={OnBlur} required={true} placeholder={('Plan Feature')} name={planFeatures} onChange={formik.handleChange} label={`Plan Feature ${' '} ${index + 1}`} value={formik.values.planFeatures[index].name} error={getErrorSubscription('planFeatures')?.[index]} />
                                                        {formik.values.planFeatures?.length > 1 &&
                                                            <Button className='btn-primary' type='button' onClick={() => formik.setFieldValue('planFeatures', formik.values.planFeatures.map((el, i) => index !== i && el).filter(Boolean))}>
                                                                <span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
                                                                    <Trash />
                                                                </span>
                                                            </Button>}
                                                    </div>
                                                })}
                                            </>
                                        }
                                    </>

                                ), [formik])}
                            />
                        </FormikProvider>
                    </div>
                    {formik.values.planFeatures?.length < 7 &&
                        <Button className='btn-primary mt-3' type='button' label={('Add More')} onClick={() => formik.setFieldValue('planFeatures', [...formik.values.planFeatures, { name: '', isActive: true }])}>
                            <span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
                                <PlusCircle />
                            </span>
                        </Button>}
                </div>
                <div className='btn-group card-footer'>
                    <Button className='btn-primary ' type='submit' label={('Save')}>
                        <span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
                            <CheckCircle />
                        </span>
                    </Button>
                    <Button className='btn-warning ' onClick={onSubscriptionCancel} label={('Cancel')}>
                        <span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
                            <Cross />
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default AddEditPlanManagement;

