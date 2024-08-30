import FormValidationError from "@/components/FormValidationError/FormValidationError";
import { GET_PRODUCTS, SYNC_WHI_PRODUCT } from "@/framework/graphql/queries/catalog";
import useValidation from "@/framework/hooks/validations";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";
import { CommonSliceTypes } from "@/framework/redux/redux";
import { GoLiveStep2 } from "@/types/components"
import { GoLiveStep2Form, Product, SelectedOption } from "@/types/pages";
import { useLazyQuery, useQuery } from "@apollo/client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';

const Step2 = ({ active, onPrev, onSubmitStep2, accordionHandle, completed, hidePrev }: GoLiveStep2) => {
    const [syncProduct, { loading: syncLoading, refetch : refetchSyncProducts }] = useLazyQuery(SYNC_WHI_PRODUCT)
    const { data, refetch, loading } = useQuery(GET_PRODUCTS);
    const dispatch = useDispatch();
    const [selectedProduct, setSelectedProduct] = useState('')
    const [type, setType] = useState('grid')
    const { isWhiInfluencer } = useSelector((state: CommonSliceTypes) => state.common)
    const path = usePathname()
    const router = useRouter();

    useEffect(() => {
        dispatch(setLoadingState(loading || syncLoading))
    }, [loading,syncLoading])

    useEffect(() => {
        refetch()
    }, [])

    useEffect(()=>{
        if(isWhiInfluencer) {
            syncProductHandler()
        }
    },[path, isWhiInfluencer])

    const syncProductHandler = async() => {
        refetchSyncProducts().then(() => {
            refetch()
        })
        syncProduct().then(() => {
            refetch()
        })
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
    } = useForm<GoLiveStep2Form>({
        defaultValues: {
            productId: '',
        },
    });
    const {goLiveStep2Validations} = useValidation()

    const onSubmit: SubmitHandler<GoLiveStep2Form> = (values) => {
        const selectedProduct = data?.fetchProducts?.data?.productData?.filter((i: Product) => i?.uuid === values?.productId)
        onSubmitStep2(values, selectedProduct?.[0])
    };

    const onSelect = (event: SelectedOption) => {
        setValue('productId', event?.value)
        setSelectedProduct(event?.value)
    }

    useEffect(() => {
        if (selectedProduct || !data?.fetchProducts?.data?.productData?.length) {
            return
        }
        setValue('productId', data?.fetchProducts?.data?.productData?.[0]?.uuid as string)
        setSelectedProduct(data?.fetchProducts?.data?.productData?.[0]?.uuid as string)
    }, [data])

    return (
        <li className={`golive-list-item ${active ? 'active' : ''} ${completed ? 'completed' : ''}`}>
            <div className="golive-item-header">
                <span className="icon-check"></span>
                <span className="golive-item-number h3">2</span>
                <div className="golive-item-title-wrap">
                    <h3>Add products and Live Notes</h3>
                    <p>Manually add products into your catalog to complete</p>
                </div>
                <span className="golive-item-icon" onClick={() => accordionHandle('step2')}></span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="golive-item-content">
                    <div className="golive-card spacing-40">
                        <div className="nav scrollbar-sm">
                            <ul className="list-unstyled">
                                <li className={type === 'grid' ? 'acitve' : ''} onClick={() => setType('grid')}>Select in Grid</li>
                                <li className={type === 'list' ? 'acitve' : ''} onClick={() => setType('list')}>Select in Dropdown</li>
                            </ul>
                        </div>
                        {
                            type === 'grid' && <div className="select-in-grid-list">
                                <ul className="list-unstyled"
                                    {...register("productId", goLiveStep2Validations.productId)}
                                >
                                    {
                                        data?.fetchProducts?.data?.productData?.map((i: Product) => (
                                            <li className={`select-in-grid-list-item ${selectedProduct === i?.uuid ? 'active' : ''}`} key={i?.uuid}
                                                onClick={() => {
                                                    setValue('productId', i?.uuid as string)
                                                    setSelectedProduct(i?.uuid as string)
                                                }}>
                                                <span className="check"><i className="round-check"></i></span>
                                                <Image className="select-in-grid-list-item-image" src={i?.images?.[0].url ?? ""}  alt={`Product: ${i?.name ?? 'No name'}`} width={150} height={150} style={{objectFit:"contain"}}/>
                                                <p className="select-in-grid-list-item-title">{i?.name}</p>
                                            </li>
                                        ))
                                    }

                                </ul>
                                {
                                    !getValues('productId') && !selectedProduct &&
                                    <FormValidationError errors={errors} name="productId" />
                                }
                            </div>
                        }
                        {
                            type === 'list' &&
                            <div className="select-in-dropdown-list">
                                <div className="dropdown-box spacing-20">
                                    <p className="title">Select Products from Catalog List</p>
                                    <p className="sub-title spacing-20">You can select product from the list</p>
                                    <div className="select-field react-select-design">
                                        <Select
                                            {...register("productId", goLiveStep2Validations.productId)}
                                            name="Select Products from Catalog List"
                                            onChange={(event) => onSelect(event as SelectedOption)}
                                            value={{label : data?.fetchProducts?.data?.productData?.find((el : Product) => el!.uuid === selectedProduct)?.name}}
                                            options={data?.fetchProducts?.data?.productData?.map((product : Product) => ({
                                                value: product!.uuid,
                                                label: product!.name,
                                            }))}
                                        />
                                    </div>
                                    {
                                        !getValues('productId') && !selectedProduct &&
                                        <FormValidationError errors={errors} name="productId" />
                                    }
                                </div>
                            </div>
                        }
                        {errors.productId && !data?.fetchProducts?.data?.productData?.length && <button className="btn btn-secondary btn-prev add-prodct-for-go-live" onClick={() => router.push('/catalog')}><span className="icon icon-add-file"></span>Add Product</button>}

                    </div>
                    <div className="step-btn-group">
                        {
                            !hidePrev &&
                            <button type="button" className="btn btn-secondary btn-prev btn-icon" onClick={onPrev}><span className="icon-left-long icon"></span> Previous</button>
                        }
                        <button type="submit" className="btn btn-primary btn-next btn-icon">Next <span className="icon-right-long icon"></span></button>
                    </div>
                </div>
            </form>
        </li>
    )
}

export default Step2