'use client'
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingState } from '@/framework/redux/reducers/commonSlice';
import { GET_PRODUCTS, SYNC_WHI_PRODUCT } from '@/framework/graphql/queries/catalog'
import DeletePopup from '@/components/Popup/DeletePopup'
import AddCatalog from '@/components/Popup/AddCatalog'
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortBy, sortOrder } from '@/constant/regex'
import "@/styles/pages/product-catalog-management.scss";
import Pagination from '@/components/Pagination';
import { PaginationParamsList } from '@/types/graphql/common';
import { Message } from '@/constant/errorMessage';
import axios from 'axios';
import { REACT_APP_API_GATEWAY_URL } from '@/config/app.config';
import { IProductRejected } from '@/types/components';
import { handleDownloadCsv, handleGraphQLErrors } from '@/utils/helpers';
import { LOCAL_STORAGE_KEY } from '@/constant/common';
import { CommonSliceTypes } from '@/framework/redux/redux';
import { usePathname } from 'next/navigation';
import SortingArrows from '@/components/common/SortingArrows';
import ChatLoader from '@/components/Loader/ChatLoader';
import { DELETE_CATALOG, GROUP_DELETE_PRODUCTS } from '@/framework/graphql/mutations/catalog';
import ShowCsvResponse from '@/components/Popup/ShowCsvResponse';
import Link from 'next/link';
import { Product } from '@/types/pages';
import Image from 'next/image';

export default function Catalog() {
    const [syncProduct, { loading: syncLoading,refetch : refetchSyncProducts }] = useLazyQuery(SYNC_WHI_PRODUCT)
    const [deleteCatalog, { error: dError, loading: dLoading }] = useMutation(DELETE_CATALOG);
    const [deleteSelectedCatalog, { error: groupDeleteError, loading: groupDeleteLoading }] = useMutation(GROUP_DELETE_PRODUCTS);
    const [deleteItemData, setDeleteItemData] = useState<string | null>("");
    const [filterData, setFilterData] = useState<PaginationParamsList>(
        {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sortBy: sortBy,
            sortOrder: sortOrder,
            name: ''
        }
    );
    const { data, refetch: getProducts, error, loading } = useLazyQuery(GET_PRODUCTS, {variables: filterData})[1];
    const [editMode, setEditMode] = useState(false);
    const [modal, setModal] = useState<boolean>(false);
    const [idOfProduct, setIdOfProduct] = useState("");
    const dispatch = useDispatch();
    const totalInfluencersCount = data?.fetchProducts?.data?.count;
    const totalPages = Math.ceil(totalInfluencersCount / filterData?.limit);
    // const [showFullDescription, setShowFullDescription] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [fetchProducts, setFetchProducts] = useState([]);
    const [deletePopupStates, setDeletePopupStates] = useState({ isShow: false, message: '', operation: '', title: '' });
    const [productLoader, setProductLoader] = useState(false)
    const [showCsvResPopup, setShowCsvResPopup] = useState(false);
    const [unUploadedData, setUnUploadedData] = useState<IProductRejected[]>(
        []
    );
    const [isShortForName, setIsShortForName] = useState(false)
    const { brandName, isWhiInfluencer } = useSelector((state: CommonSliceTypes) => state.common)
    const path = usePathname()

    useEffect(() => {
        dispatch(setLoadingState(dLoading || groupDeleteLoading || syncLoading))
        setProductLoader(loading)
        if (error) {
            handleGraphQLErrors(error)
        }
        if (dError) {
            handleGraphQLErrors(dError)
        }
        if (groupDeleteError) {
            handleGraphQLErrors(groupDeleteError)
        }
    }, [loading,error, dError, dLoading, groupDeleteError, groupDeleteLoading, syncLoading])

    // delete product
    const deleteCatalogById = (id: string) => {
        deleteCatalog({
            variables: {
                uuid: id,
            },
        }).then((response) => {
            if (response?.data?.deleteProduct?.meta?.statusCode === 200) {
                refetchData();
                toast.success(response?.data?.deleteProduct?.meta?.message)
                getProducts()
            }
        })
    };

    const handleDeleteData = useCallback((isDelete: boolean) => {
        if (!isDelete) {
            onCloseDeleteModal();
            setDeleteItemData(null);
            setSelectedProducts([])
            return;
        }

        if (deleteItemData && deletePopupStates.operation === 'singleDelete') {
            deleteCatalogById(deleteItemData);
            if (fetchProducts?.length === 1 && filterData?.page > 1) {
                setFilterData({
                    ...filterData,
                    page: filterData.page - 1,
                });
            }
        } else if (deletePopupStates.operation === 'groupDelete') {
            deleteSelectedProductsApiHandler();
            if (fetchProducts?.length === selectedProducts?.length && filterData?.page > 1) {
                setFilterData({
                    ...filterData,
                    page: filterData.page - 1,
                });
            }
        }
        setDeleteItemData(null);
        setSelectedProducts([])
        onCloseDeleteModal();
    }, [deleteItemData, selectedProducts, deletePopupStates]);

    const onCloseDeleteModal = useCallback(() => {
        setDeletePopupStates((pre) => ({ ...pre, isShow: false }))
    }, [deletePopupStates, selectedProducts]);

    const toggleModal = useCallback(() => {
        setModal(!modal);
    }, [modal]);

    const onCloseModal = useCallback(() => {
        setModal(false);
        setEditMode(false);
    }, []);

    useEffect(() => {
        setFetchProducts(data?.fetchProducts?.data?.productData)
    }, [data, getProducts])

    const handleFilterProduct = () => {
        if (filterData) {
            setProductLoader(true)
            getProducts(filterData).then(() => {
                setProductLoader(false)
            }).catch(() => {
                setProductLoader(false)
            })
        }
    }

    /*refetching filtered data*/
    useEffect(() => {
        if (isShortForName) {
            const filterTimeout = setTimeout(() => {
                handleFilterProduct()
            }, 600)
            return () => clearTimeout(filterTimeout);
        }
        handleFilterProduct()
    }, [filterData, getProducts, isShortForName]);

    //product search
    const userSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterData({
            ...filterData, name: e.target.value, page: 1
        })
        setIsShortForName(true)
        setProductLoader(true)
    }

    //edit catalog
    const editCatalog = useCallback((id: string) => {
        if (id) {
            setIdOfProduct(id);
            setEditMode(true);
            toggleModal();
        }
    }, [data]);

    //add catalog
    const addCatalog = useCallback(() => {
        setIdOfProduct('');
        setEditMode(false);
        toggleModal();
    }, [data]);


    //pagination
    const pageClickHandler = useCallback((page: number) => {
        setFilterData({
            ...filterData,
            page: page,
        });
    }, [filterData]);

    //refetch

    const refetchData = useCallback(() => {
        getProducts();
    }, [])

    // page select
    const pageSelectHandler = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setFilterData({
            ...filterData, limit: +e.target.value,
            page: DEFAULT_PAGE
        })
    }, [filterData])

    //sort handler
    const handleSort = useCallback((field: string) => {
        const sortOrder = filterData.sortOrder === 'asc' ? 'desc' : 'asc';
        setFilterData({
            ...filterData,
            sortBy: field,
            sortOrder: sortOrder
        });
        setIsShortForName(false)
    }, [filterData]);

    // const toggleDescription = (uuid: string) => {
    //     if (showFullDescription === uuid) {
    //         setShowFullDescription('')
    //         return
    //     }
    //     setShowFullDescription(uuid);
    // };

    const handleShortingIcons = useCallback((field: string, icon: string) => {
        let showIcon = true
        if (filterData?.sortBy === field) {
            showIcon = filterData.sortOrder === icon
        }
        return showIcon
    }, [filterData])

    const handleProductSelection = useCallback((type: string, isChecked: boolean, uuid?: string) => {
        let productsToDelete: string[] = [];

        if (type === 'all' && fetchProducts) {
            productsToDelete = isChecked ? fetchProducts.map(({ uuid }) => uuid).filter(Boolean) : []
            setSelectedProducts(productsToDelete)
            return;
        }

        if (type === 'single') {
            isChecked && uuid ? setSelectedProducts((pre) => [...pre, uuid]) : setSelectedProducts((pre) => pre.filter((id) => id !== uuid))
        }

    }, [selectedProducts, fetchProducts])

    // delete Selected products
    const deleteSelectedProductsApiHandler = () => {
        deleteSelectedCatalog({
            variables: {
                uuid: selectedProducts,
            },
        }).then((response) => {
            if (response?.data?.groupDeleteProducts?.meta?.statusCode === 200) {
                refetchData();
                toast.success(response?.data?.groupDeleteProducts?.meta?.message)
                getProducts()
            }
        })
    };

    const handleCsvUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.name.toLowerCase().endsWith(".csv")) {
            alert(Message.UPLOAD_VALID_CSV);
            return;
        }
        setProductLoader(true);
        try {
            const formData = new FormData();

            formData.append("csv-file", file);
            const { data } = await axios.post(
                `${REACT_APP_API_GATEWAY_URL}/api/v1/product/product-csv`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.authToken)}`,
                    },
                }
            );

            if (!data?.data?.not_uploaded_products) {
                if (data?.meta?.statusCode === 200) toast.success(data?.meta?.message);
                if (data?.meta?.statusCode === 400) toast.error(data?.meta?.message);
                return;
            }
            setUnUploadedData(data?.data?.not_uploaded_products);
            setShowCsvResPopup(true);
        } catch (error) {
            toast.error(Message.FILE_NOT_UPLOADED);
        } finally {
            event.target.value = '';
            getProducts();
            setProductLoader(false);
        }
    };
   
    useEffect(()=>{
        if(isWhiInfluencer) {
            syncProductHandler()
        }
    },[path, isWhiInfluencer])
    
    const syncProductHandler = () => {
        refetchSyncProducts().then(()=>{
            getProducts()
        })
        syncProduct().then(()=>{
            getProducts()
        })
    }

    const handleDeleteProduct = () => {
      selectedProducts?.length > 0
        ? setDeletePopupStates({ message: Message.CONFIRM_CATALOGS_TO_DELETE, isShow: true, operation: "groupDelete", title: "Delete Product's" })
        : toast.error(Message.PRODUCTS_NOT_SELECTED_FOR_DELETE);
    };

    const DeleteBtnElement = (
        !(isWhiInfluencer || brandName === 'whi') ?  <button className="btn btn-secondary btn-prev" onClick={handleDeleteProduct}>
          <span className="icon icon-trash"></span>Delete Products
        </button> : <></>
    );

    return (
        <div>
            <div className="product-catalog-wrapper">
                <div className="container-lg">
                    <div className="product-catalog-inner">
                        <div className="row spacing-30 modalButton-row">
                            {!(isWhiInfluencer || brandName === 'whi') &&
                                <>
                                    <div className='btn btn-secondary btn-secondary-white upload-csv-btn btn-prev'><span className="icon icon-csv"></span>Upload CSV file<input type="file" aria-label="Upload CSV" onChange={(e) => handleCsvUpload(e)} /></div>
                                    <button className="btn btn-secondary btn-secondary-white btn-prev" onClick={handleDownloadCsv}
                                    ><span className="icon icon-csv"></span>Download Sample CSV file</button>
                                    <button className="btn btn-secondary btn-prev" onClick={addCatalog}><span className="icon icon-add-file"></span>Add Product</button>
                                </> }
                        </div>
                        <div className="product-catalog card">
                            <div className="row spacing-30">
                                <div className="l-col">
                                    <h3 className="card-title">Products</h3>
                                </div>
                                <div className="r-col">
                                    <form action="">
                                        <div className="search-form-group">
                                            <div className="form-group-password">
                                                <input aria-label="Search Catalog" className="form-control" type="text" placeholder="Search Products" name="search" onChange={userSearch} />
                                                <span className="icon-search password-icon"></span>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="table-responsive spacing-40">
                                <table className="checkTable">
                                    <thead>
                                        <tr>
                                            {!(isWhiInfluencer || brandName === 'whi') ?
                                                <th aria-label="Checkboxes">
                                                    {fetchProducts?.length > 0 && <div className='checkAll-col'>
                                                        <div className="custom-checkbox">
                                                            <input aria-label="Select All Product" type="checkbox" id="checkAll" name="checkAll" value="checkAll" onChange={(e) => handleProductSelection('all', e.target.checked)} checked={fetchProducts?.length > 0 ? selectedProducts?.length === fetchProducts?.length : false} />
                                                            <span className="checkbox-tick icon-check"></span>
                                                        </div>
                                                    </div>}
                                                </th> : <th></th>}
                                            <th>
                                                Name
                                                <span
                                                    className="sorting"
                                                    onClick={() => handleSort("name")}
                                                >
                                                    <SortingArrows handleShortingIcons={handleShortingIcons} field='name'/>
                                                </span>
                                            </th>
                                            {/* <th className='catalog-description-thead'>
                                                Description
                                                <span
                                                    className="sorting"
                                                    onClick={() => handleSort("description")}
                                                >
                                                    <SortingArrows handleShortingIcons={handleShortingIcons} field='description'/>
                                                </span>
                                            </th> */}
                                            <th className='catalog-description-thead'>
                                                sku
                                                <span
                                                    className="sorting"
                                                    onClick={() => handleSort("sku")}
                                                >
                                                    <SortingArrows handleShortingIcons={handleShortingIcons} field='sku'/>
                                                </span>
                                            </th>
                                            <th className='catalog-description-thead'>
                                                price ($)
                                                <span
                                                    className="sorting"
                                                    onClick={() => handleSort("price")}
                                                >
                                                    <SortingArrows handleShortingIcons={handleShortingIcons} field='price'/>
                                                </span>
                                            </th>
                                            <th className='th-specifications'>
                                             Specifications
                                                <span
                                                    className="sorting"
                                                    onClick={() => handleSort("color")}
                                                >
                                                    <SortingArrows handleShortingIcons={handleShortingIcons} field='color'/>
                                                </span>
                                            </th>
                                            {!(isWhiInfluencer || brandName === 'whi') && <th>
                                                Action
                                            </th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        fetchProducts?.length > 0 ? fetchProducts?.map((data: Product) => {
                                            return (
                                                <tr key={data?.uuid}>
                                                    {!(isWhiInfluencer || brandName === 'whi') ?
                                                        <td>
                                                            <div className="custom-checkbox">
                                                                <input aria-label='Select Product' type="checkbox" id={data?.uuid} name="check" value="check" onChange={(e) => handleProductSelection('single', e.target.checked, data?.uuid)} checked={selectedProducts.includes(data?.uuid!)} />
                                                                <span className="checkbox-tick icon-check"></span>
                                                            </div>
                                                        </td> : <td></td>}
                                                    <td>
                                                        <div className='nameCol'>
                                                            <div className='namecol-img'>
                                                            <Image src={data?.images?.[0]?.url ? data?.images?.[0]?.url : ""}  alt={`Product :${data?.name ?? "Product Image"}`} width={120} height={120} style={{objectFit:"contain"}}/>
                                                            </div>
                                                            <div className='namecol-desc'>
                                                                {data?.name ? data?.name : "-"}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {/* <td>
                                                        <div className='prodDesc'>
                                                            <p>
                                                                <span>{showFullDescription === data?.uuid ? data?.description : `${data?.description?.substring(0, 200)}`}</span>
                                                                {data?.description?.length! > 200 && (
                                                                    <span>
                                                                        <span className="dots">...</span>
                                                                        <Link href="" className='moreLink' onClick={() => toggleDescription(data?.uuid as string)}>
                                                                            <span className='moreText'>{showFullDescription === data?.uuid ? 'Less' : 'more'}
                                                                                <span className={showFullDescription === data?.uuid ? "icon-arrow-up icon" : "icon-down icon"}>
                                                                                </span>
                                                                            </span>
                                                                        </Link>
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </td> */}
                                                    <td>{data?.sku ?? "-"}</td>
                                                    <td>{data?.price ?? "-"}</td>
                                                    <td>Size: {data?.size ?? "-"}<br></br>Color: {data?.color ?? "-"}</td>
                                                    {!(isWhiInfluencer || brandName === 'whi') &&
                                                        <td>
                                                            <div className="action-row">
                                                                <Link 
                                                                    href=""
                                                                    aria-label="edit icon"
                                                                    onClick={() => {
                                                                        editCatalog(data?.uuid!);
                                                                        setEditMode(true);
                                                                    }}
                                                                    className="actionIcon"><span className="icon-pen"></span></Link>
                                                                <Link
                                                                    href=""
                                                                    aria-label="delete icon"
                                                                    onClick={() => {
                                                                        setDeletePopupStates({ message: Message.CONFIRM_DELETE, isShow: true, operation: 'singleDelete', title: 'Delete Product' })
                                                                        setDeleteItemData(data?.uuid!);
                                                                    }}
                                                                    className="actionIcon"><span className="icon-trash"></span></Link>
                                                            </div>
                                                        </td>}
                                                </tr>
                                            )
                                        }) : 
                                        <tr>
                                            <td></td>
                                            <td colSpan={4} className='text-center'>No Products Found</td>
                                        </tr>
                                     }
                                     {
                                        productLoader &&
                                        <ChatLoader isText={false}/>
                                    }
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                totalPages={totalPages}
                                onPageChange={pageClickHandler}
                                filterPage={filterData.page}
                                pageSelectHandler={pageSelectHandler}
                                totalIteamCount={totalInfluencersCount}
                                htmlElements = {DeleteBtnElement}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <AddCatalog
                modal={modal}
                onClose={onCloseModal}
                editMode={editMode}
                idOfProduct={idOfProduct}
                refetchData={refetchData}
                setProductLoader={setProductLoader}
            />

            <DeletePopup
                onClose={onCloseDeleteModal}
                isDelete={handleDeleteData}
                message={deletePopupStates?.message}
                isShow={deletePopupStates?.isShow}
                title={deletePopupStates.title}
            />
            <ShowCsvResponse open={showCsvResPopup} onClose={() => setShowCsvResPopup(false)} data={unUploadedData} />
        </div >
    );
}
