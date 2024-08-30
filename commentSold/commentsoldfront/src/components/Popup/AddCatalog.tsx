'use client'
import React, { useCallback, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IAddCatalog, IAddEditCatalogForm } from "@/types/components";
import FormValidationError from "../FormValidationError/FormValidationError";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { GET_CATALOG_BY_ID } from "@/framework/graphql/queries/catalog";
import { useDispatch } from "react-redux";
import Modal from 'react-modal';
import { checkCORSForImages, convertToUrlArray, handleGraphQLErrors } from "@/utils/helpers";
import useValidation from "@/framework/hooks/validations";
import { Message } from "@/constant/errorMessage";
import { CREATE_CATALOG, UPDATE_CATALOG } from "@/framework/graphql/mutations/catalog";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";

const AddCatalog = ({
    onClose,
    editMode,
    idOfProduct,
    modal,
    refetchData,
    setProductLoader
}: IAddCatalog) => {

    const [createProduct] = useMutation(CREATE_CATALOG);
    const [updateProduct] = useMutation(UPDATE_CATALOG);
    const { refetch: getSingleProduct, data, error, loading } = useQuery(GET_CATALOG_BY_ID, { variables: { uuid: idOfProduct }, skip: !editMode });
    const dispatch = useDispatch();
    const defaultValues = {
        name: '',
        url: '',
        description: '',
        sku: '',
        images: '',
        color: '',
        size: '',
        price: '',
    }
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset
    } = useForm<IAddEditCatalogForm>({ defaultValues });

    useEffect(() => {
        dispatch(setLoadingState(loading))
        if (error?.message) {
            toast.error(error?.message)
        }
    }, [loading, error])

    const toggleModal = useCallback(() => {
        onClose();
        reset();
    }, []);

    const {addCatalogValidations} = useValidation()

    //create catalog
    const createCatalog = async (data: IAddEditCatalogForm) => {
        dispatch(setLoadingState(true))
        checkCORSForImages(convertToUrlArray(data.images))
            .then(corsIssues => {
                dispatch(setLoadingState(false))
                if (corsIssues.length > 0) {
                    toast.error(Message.IMG_DOMAIN_RESTRICTED)
                } else {
                    createProduct({
                        variables: {
                            name: data.name,
                            url: data.url,
                            description: data.description,
                            sku: data.sku,
                            images: data.images,
                            color: data.color,
                            size: data.size,
                            price: data.price,
                        },
                    })
                        .then((res) => {
                            const data = res.data;
                            if (data?.createProduct?.meta?.statusCode === 200 || data?.createProduct?.meta?.statusCode === 201) {
                                toast.success(data?.createProduct?.meta?.message);
                                refetchData();
                                toggleModal();
                            }
                            setProductLoader(false)
                        }).catch((error) => {
                            handleGraphQLErrors(error);
                            setProductLoader(false)
                        })
                    // Proceed with calling your API for uploading
                }
            })
            .catch(() => {
                toast.error(Message.IMG_DOMAIN_RESTRICTED)
                dispatch(setLoadingState(false))
                setProductLoader(false)
            });
    }
    
    //update catalog
    const updateCatalog = async (idOfProduct: string, data: IAddEditCatalogForm) => {
        dispatch(setLoadingState(true))
        checkCORSForImages(convertToUrlArray(data.images))
            .then(corsIssues => {
                dispatch(setLoadingState(false))
                if (corsIssues.length > 0) {
                    toast.error(Message.IMG_DOMAIN_RESTRICTED)
                } else {
                    updateProduct({
                        variables: {
                            uuid: idOfProduct,
                            name: data.name,
                            url: data.url,
                            description: data.description,
                            sku: data.sku,
                            images: data.images,
                            color: data.color,
                            size: data.size,
                            price: data.price,
                        },
                    }).then((res) => {
                        const data = res.data;
                        if (data?.updateProduct?.meta?.statusCode === 200 || data?.updateProduct?.meta?.statusCode === 201) {
                            toast.success(data?.updateProduct?.meta?.message);
                            refetchData();
                            toggleModal();
                        }
                        setProductLoader(false);
                    }).catch((error) => {
                        handleGraphQLErrors(error);
                        setProductLoader(false)
                    })
                }
            })
            .catch(() => {
                setProductLoader(false)
                dispatch(setLoadingState(false))
                toast.error(Message.IMG_DOMAIN_RESTRICTED)
            });
    }

    //submit handler for add edit
    const onSubmit: SubmitHandler<IAddEditCatalogForm> = async (data) => {
        setProductLoader(true)
        if (editMode) {
            updateCatalog(idOfProduct, data);
        }
        else {
            createCatalog(data)
        }
    };

    //initialise data for edit
    const initializeData = () => {
        setValue('name', data?.fetchProduct?.data?.name || '');
        setValue('url', data?.fetchProduct?.data?.url || '');
        setValue('description', data?.fetchProduct?.data?.description || '');
        setValue('sku', data?.fetchProduct?.data?.sku || '');
        setValue('color', data?.fetchProduct?.data?.color || '');
        setValue('size', data?.fetchProduct?.data?.size || '');
        setValue('price', data?.fetchProduct?.data?.price || '');
        setValue('images', convertToStringWithCommas(data?.fetchProduct?.data?.images?.map((i: { url: string }) => i?.url)) || '');
    };

    function convertToStringWithCommas(stringArray: string[]) {
        if (!stringArray?.length) {
            return ''
        }
        // Join the array elements with commas
        const commaSeparatedString = stringArray.join(', ');

        return commaSeparatedString;
    }

    useEffect(() => {
        initializeData();
        if (editMode) {
            getSingleProduct()
        }
    }, [editMode,data?.fetchProduct,modal]);

    return (
        <Modal
            isOpen={modal}
            contentLabel="Example Modal"

        >
            <button onClick={() => {
                onClose()
                reset()
                }} className='modal-close' aria-label="Close Model"><i className='icon-close'></i></button>
            <div className='modal-body scrollbar-sm'>

                <p className='h3 spacing-10'>  {editMode ? "Edit Product" : "Add a New Product"}</p>
                <p className='font-300 spacing-30 label-color'>Filling up below details</p>
                <div className='divider spacing-30'></div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='add-product-row'>
                        <div className="form-group">
                            <label htmlFor="product-name">Product Name*</label>
                            <input className="form-control" type="text" placeholder="Enter product name here" {...register("name", addCatalogValidations.name)} name="name" id="product-name" />
                            <FormValidationError errors={errors} name="name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="product-url">Product URL*</label>
                            <input className="form-control" type="text" placeholder="Enter product URL here"  {...register("url", addCatalogValidations.url)} name="url"
                                id="product-url" />
                            <FormValidationError errors={errors} name="url" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="product-sku">SKU*</label>
                            <input className="form-control" type="text" placeholder="Enter product SKU" {...register("sku", addCatalogValidations.sku)} name="sku" id="product-sku" />
                            <FormValidationError errors={errors} name="sku" />
                        </div>
                    </div>
                    <div className='add-product-three-row'>
                        <div className="form-group">
                            <label htmlFor="product-images">Image URL*</label>
                            <input className="form-control" type="text" placeholder="Enter Image URL"
                                {...register("images", addCatalogValidations.images)} name="images" id="product-images" />
                            <FormValidationError errors={errors} name="images" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="product-description">Product Description*</label>
                            <textarea  {...register("description", addCatalogValidations.description)} id="product-description" name="description" className="form-control" placeholder='Enter Product Description*'></textarea>
                            <FormValidationError errors={errors} name="description" />
                        </div>
                    </div>
                    <p className='product-variants-title spacing-30'>Product Variants*</p>
                    <div className='add-product-row spacing-10'>
                        <div className="form-group">
                            <label htmlFor="product-color">Color*</label>
                            <input className="form-control" type="text" placeholder="Enter color name here" {...register("color", addCatalogValidations.color)} name="color" id="product-color" />
                            <FormValidationError errors={errors} name="color" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="product-size">Size*</label>
                            <input className="form-control" type="text" placeholder="Enter size here" {...register("size", addCatalogValidations.size)} name="size" id="product-size" />
                            <FormValidationError errors={errors} name="size" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="product-price">Price ($)*</label>
                            <input className="form-control" type="text" placeholder="Enter price here" {...register("price", addCatalogValidations.price)} name="price" id="product-price" />
                            <FormValidationError errors={errors} name="price" />
                        </div>
                    </div>
                    <button className='btn btn-primary'>Submit</button>
                </form>
            </div>
        </Modal>
    );
};
export default AddCatalog;

