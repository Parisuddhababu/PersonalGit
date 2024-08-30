import React, { ReactElement, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import Button from '@components/button/button';
import { useMutation, useQuery } from '@apollo/client';
import { CreateCatalouge, UpdateCatalouge } from '@framework/graphql/graphql';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@config/constant';
import { CheckCircle, Cross } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import TextAreaInput from '@components/textarea/TextArea';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import 'react-image-crop/dist/ReactCrop.css';
import { Loader } from '@components/index';
import { CatalougeForm } from '@type/catalouge';
import { CREATE_CATALOGUE, UPDATE_CATALOUGE } from '@framework/graphql/mutations/catalouge';
import { GET_CATALOUGE_BY_ID } from '@framework/graphql/queries/catalogue';

const AddEditCatalogue = (): ReactElement => {
    const [createCatalouge, { loading: createLoader }] = useMutation(CREATE_CATALOGUE);
    const [updateCatalougeData, { loading: updateLoader }] = useMutation(UPDATE_CATALOUGE);
    const navigate = useNavigate();
    const params = useParams();
    const { catalougeValidationSchema } = useValidation();
    const { data: catalougeData, loading } = useQuery(GET_CATALOUGE_BY_ID, {
        variables: { uuid: params.id },
        skip: !params.id,
        fetchPolicy: 'network-only',
    });

    /**
     * Method that sets form data while edit
     */
    function convertToStringWithCommas (stringArray: string[]) {
        // Join the array elements with commas
        const commaSeparatedString = stringArray.join(', ');

        return commaSeparatedString;
    }
    useEffect(() => {
        if (catalougeData && params.id) {
            const data = catalougeData?.fetchProduct?.data;
            formik.setValues({
                name: data?.name,
                url: data?.url,
                description: data?.description,
                sku: data?.sku,
                images: convertToStringWithCommas(data?.images?.map((i: { url: string }) => i?.url)),
                color: data?.color,
                size: data?.size,
                price: data?.price,
            });
        }
    }, [catalougeData]);

    const initialValues: CatalougeForm = {
        name: '',
        url: '',
        description: '',
        sku: '',
        images: '',
        color: '',
        size: '',
        price: '',
    };
    /**
     * Handles update
     * @param values
     */
    const updateUserFunction = (values: CatalougeForm) => {
        updateCatalougeData({
            variables: {
                uuid: params.id,
                name: values.name,
                url: values.url,
                description: values.description,
                sku: values.sku,
                images: convertToUrlArray(values.images),
                color: values.color,
                size: values.size,
                price: values.price,
            },
        })
            .then((res) => {
                const data = res.data as UpdateCatalouge;
                if (data.updateProduct.meta.statusCode === 200 || data.updateProduct.meta.statusCode === 201) {
                    toast.success(data.updateProduct.meta.message);
                    formik.resetForm();
                    onCancelCataloguge();
                }
            })
            .catch(() => {
                return;
            });
    };

    function convertToUrlArray (urlString: string) {
        const urlArray = urlString.replace(/\s/g, '').split(',');
        const trimmedUrlArray = urlArray.map(url => url.trim());
        return trimmedUrlArray;
    }

    const formik = useFormik({
        initialValues,
        validationSchema: catalougeValidationSchema(),
        onSubmit: async (values) => {
            if (params.id) {
                updateUserFunction(values);
            } else {
                createCatalouge({
                    variables: {
                        name: values.name,
                        url: values.url,
                        description: values.description,
                        sku: values.sku,
                        images: convertToUrlArray(values.images),
                        color: values.color,
                        size: values.size,
                        price: values.price,
                    },
                })
                    .then((res) => {
                        const data = res.data as CreateCatalouge;
                        if (data.createProduct.meta.statusCode === 200 || data.createProduct.meta.statusCode === 201) {
                            toast.success(data.createProduct.meta.message);
                            formik.resetForm();
                            onCancelCataloguge();
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
    const onCancelCataloguge = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.catalouge}/${ROUTES.list}`);
    }, []);

    /**
     * error message handler
     * @param fieldName
     * @returns
     */
    const getErrorUserMng = (fieldName: keyof CatalougeForm) => {
        return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
    };

    /**
     * Handle blur that removes white space's
     */
    const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
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
                            <TextInput id={'name'} onBlur={OnBlur} required={true} placeholder={('Catalouge Name')} name='name' onChange={formik.handleChange} label={('Catalouge Name')} value={formik.values.name} error={getErrorUserMng('name')} />
                        </div>
                        <div>
                            <TextInput id={'url'} onBlur={OnBlur} required={true} placeholder={('Url')} name='url' onChange={formik.handleChange} label={('Url')} value={formik.values.url} error={getErrorUserMng('url')} />
                        </div>
                        <div>
                            <TextInput id={'price'} onBlur={OnBlur} required={true} placeholder={('Price')} name='price' onChange={formik.handleChange} label={('Price')} value={formik.values.price} error={getErrorUserMng('price')} />
                        </div>
                        <div>
                            <TextInput id={'sku'} onBlur={OnBlur} required={true} placeholder={('SKU')} name='sku' onChange={formik.handleChange} label={('SKU')} value={formik.values.sku} error={getErrorUserMng('sku')} />
                        </div>
                        <div>
                            <TextAreaInput id={'description'} onBlur={OnBlur} required={true} placeholder={('Description')} name='description' onChange={formik.handleChange} label={('Description')} value={formik.values.description} error={getErrorUserMng('description')} />
                        </div>
                        <div>
                            <TextAreaInput id={'images'} onBlur={OnBlur} required={true} placeholder={('Images')} name='images' onChange={formik.handleChange} label={('Images')} value={formik.values.images} error={getErrorUserMng('images')} />
                        </div>
                        <div>
                            <TextInput id={'color'} onBlur={OnBlur} required={true} placeholder={('Color')} name='color' onChange={formik.handleChange} label={('Color')} value={formik.values.color} error={getErrorUserMng('color')} />
                        </div>
                        <div>
                            <TextInput id={'size'} onBlur={OnBlur} required={true} placeholder={('Size')} name='size' onChange={formik.handleChange} label={('Size')} value={formik.values.size} error={getErrorUserMng('size')} />
                        </div>
                    </div>
                </div>
                <div className='btn-group card-footer'>
                    <Button className='btn-primary ' type='submit' label={('Save')}>
                        <span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
                            <CheckCircle />
                        </span>
                    </Button>
                    <Button className='btn-warning ' onClick={onCancelCataloguge} label={('Cancel')}>
                        <span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
                            <Cross />
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default AddEditCatalogue;
