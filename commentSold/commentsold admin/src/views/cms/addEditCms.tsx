import React, { ReactElement, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@config/constant';
import { CheckCircle, Cross } from '@components/icons/icons';
import CKEditorComponent from '@components/ckEditor/ckEditor';
import { whiteSpaceRemover } from '@utils/helpers';
import { Loader } from '@components/index';
import useValidation from '@src/hooks/validations';
import { CreateCms } from '@type/cms';
import { FETCH_CMS } from '@framework/graphql/queries/cms';
import { UPDATE_CMS } from '@framework/graphql/mutations/cms';

const AddEditCms = (): ReactElement => {
    const { t } = useTranslation();
    const params = useParams();
    const { data: fetchPolicy, loading } = useQuery(FETCH_CMS, {
        fetchPolicy: 'network-only',
    });
    const [updatePolicy, { loading: updateLoader }] = useMutation(UPDATE_CMS);
    const navigate = useNavigate();
    const { addEditCmsValidationSchema } = useValidation();
    const initialValues: CreateCms = {
        key: '',
        value: '',
        isActive: ''
    };
    const formik = useFormik({
        initialValues,
        validationSchema: addEditCmsValidationSchema,
        onSubmit: (values) => {
            if (values.value == '<p><br></p>' || values.value == '<p></p>') {
                toast.error('please enter description');
            } else if (params.id) {
                updatePolicy({
                    variables: {
                        key: values.key,
                        value: values.value,
                        isActive: true
                    },
                })
                    .then((res) => {
                        const data = res?.data;
                        if (data?.updatePolicy?.meta?.statusCode === 200 || data?.updatePolicy?.meta?.statusCode === 201) {
                            toast.success(data.updatePolicy.meta.message);
                            formik.resetForm();
                            onCancelCms();
                        }
                    })
                    .catch(() => {
                        return;
                    });
            }
        },
    });
    const handleCkeditor = useCallback((e: string) => {
        formik.setFieldValue('value', e);
    }, []);
    /**
     * On cancle redirect to list view
     */
    const onCancelCms = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.cms}/${ROUTES.list}`);
    }, []);
    /**
     * Handle blur that removes white space's
     */
    const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);

    /**
     * Method that sets form data while edit
     */
    useEffect(() => {
        if (fetchPolicy && params?.id) {
            const PolicyData = fetchPolicy?.fetchPolicyDetails?.data;
            PolicyData.map((i: { key: string, value: string, is_active: boolean, uuid: string }) => {
                if (i?.uuid === params?.id) {
                    formik.setFieldValue('key', i?.key);
                    formik.setFieldValue('value', i?.value)
                }
            })
        }
    }, [params?.id, fetchPolicy]);

    return (
        <div className='card'>
            {(updateLoader || loading) && <Loader />}
            <form onSubmit={formik.handleSubmit}>
                <div className='card-body'>
                    <div className='card-title-container'>
                        <p>
                            {t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
                        </p>
                    </div>
                    <div className='card-grid-addedit-page'>
                        <div>
                            <TextInput id={'key'} onBlur={OnBlur} required={true} placeholder={t('Content Page Title')} name='key' onChange={formik.handleChange} label={t('Content Page Title (English)')} value={formik.values.key} error={formik.errors.key && formik.touched.key ? formik.errors.key : ''} disabled />
                        </div>

                        <CKEditorComponent id='cmsCkEditorDescription' value={formik.values.value} onChange={handleCkeditor} label={`${t('Description')} ${t('English')}`} error={formik.errors.value && formik.touched.value ? formik.errors.value : ''} required={true} />
                    </div>
                </div>
                <div className='card-footer btn-group'>
                    <Button className='btn-primary ' type='submit' label={t('Save')}>
                        <span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
                            <CheckCircle />
                        </span>
                    </Button>
                    <Button className='btn-warning ' label={t('Cancel')} onClick={onCancelCms}>
                        <span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
                            <Cross />
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddEditCms;
