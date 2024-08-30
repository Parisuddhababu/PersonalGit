import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import Button from '@components/button/button';
import UpdatedHeader from '@components/header/updatedHeader';
import { ArrowSortingDown, ArrowSortingUp, Cross, GetDefaultIcon, ImportDoc, Search, Trash } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import { API_BASE_URL, DELETE_WARNING_TEXT, EDIT_WARNING_TEXT, Events, PAGE_LIMIT, PAGE_NUMBER, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { ColArrType } from '@types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filterServiceProps from '@components/filter/filter';
import { APIServices } from 'src/services/axiosCommon';
import { useFormik } from 'formik';
import useValidation from '@framework/hooks/validations';
import { GET_MATERIAL_WITH_PAGINATION } from '@framework/graphql/queries/materialManagement';
import { CREATE_MATERIAL, DELETE_MATERIAL, EDIT_MATERIAL } from '@framework/graphql/mutations/materialManagement';
import { whiteSpaceRemover } from '@utils/helpers';
import EditBtnPopup from '@components/common/EditButtonPopup';
import CommonModel from '@components/common/commonModel';
import DeleteBtn from '@components/common/deleteBtn';

export type MaterialDataRes = {
    uuid: string;
    name: string;
    material_types: Array<{
        uuid: string;
        type: string;
        weight: number;
    }>
}

const MaterialManagement = () => {
    const { t } = useTranslation();
    const COL_ARR_MATERIAL_MANAGEMENT = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Material Category'), sortable: true, fieldName: 'name' },
        { name: t('Material Type'), sortable: false, fieldName: 'material_types.type' },
    ] as ColArrType[];
    const [filterData, setFilterData] = useState({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortOrder: 'descend',
        search: '',
        sortField: 'id',
        index: 0
    });
    const { createMaterialValidationSchema } = useValidation();
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState<boolean>(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
    const [materialObj, setMaterialObj] = useState<MaterialDataRes>();
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
    const { data, refetch: refetchMaterialListData } = useQuery(GET_MATERIAL_WITH_PAGINATION, {
        fetchPolicy: 'network-only',
        variables: filterData ?? {
            limit: PAGE_LIMIT,
            page: PAGE_NUMBER,
            sortOrder: 'descend',
            search: '',
            sortField: 'id',
        }
    });
    const [createMaterial, { loading: createMaterialLoadingState }] = useMutation(CREATE_MATERIAL);
    const [editMaterial, { loading: editMaterialLoadingState }] = useMutation(EDIT_MATERIAL);
    const [deleteMaterial, { loading: deleteMaterialLoadingState }] = useMutation(DELETE_MATERIAL);

    /**
     * Method refetchs the list data if there any change in filterData  
     */
    useEffect(() => {
        refetchMaterialListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
    }, [filterData])

    /**
     * Method used to records per page
     */
    useEffect(() => {
        setRecordsPerPage(filterData?.limit)
    }, [filterData?.limit])

    const totalMaterialssListCount = data?.getMaterialsWithPagination?.data?.count || 0;
    const totalPages = Math.ceil(totalMaterialssListCount / recordsPerPage);

    /**
     * Method that handles the page changes
     */
    const handlePageChange = useCallback((newPage: number): void => {
        const updatedFilterData = {
            ...filterData,
            page: newPage,
            index: (newPage - 1) * filterData.limit,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterMaterial', JSON.stringify(updatedFilterData));
    }, [filterData.limit])

    /**
     * Method used to set search value in filterData
     */
    const onSearchMaterial = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterData({ ...filterData, search: e.target.value })
    }, []);

    /**
     *
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortMaterial = (sortFieldName: string) => {
        setFilterData({
            ...filterData,
            sortField: sortFieldName,
            sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
        });
    };

    /**
     *
     * @param e Method used for change dropdown for page limit
     */
    const onPageDrpSelectMaterial = (e: string) => {
        const newLimit = Number(e);
        const updatedFilterData = {
            ...filterData,
            limit: newLimit,
            page: PAGE_NUMBER,
            index: 0,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterMaterial', JSON.stringify(updatedFilterData));
    };

    /**
     * Method used to open Add new popup
     */
    const onAddMaterial = useCallback(() => {
        setIsAdd(true);
        formik.setFieldValue('type',Events.add);
    }, []);

    /**
     * Method used to close add new popup
     */
    const onClose = useCallback(() => {
        formik.resetForm();
        setMaterialObj(undefined);
        setIsAdd(false);
        setIsEditPopupOpen(false);
        setIsDeletePopupOpen(false);
    }, []);

    /**
     * Method used to download csv file of material list
     */
    const onDownloadMaterialCsv = useCallback(() => {
        APIServices.getList(`${API_BASE_URL}/export-material-csv`)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'material-list.csv');
                document.body.appendChild(link);
                link.click();
                toast.success(response?.data?.message);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    }, []);

    /**
     * Method that provides the add new button to breadcrumb
     * @returns Add new button 
     */
    const headerActionConst = () => {
        return (
            <Button
                className='btn-normal btn-secondary w-full md:w-[140px] whitespace-nowrap lg:h-[50px]'
                type='button'
                onClick={onAddMaterial}
                label={t('Add New')}
            />
        )
    };
    const initialValues: {
        type:string;
        materialData: {
            name: string,
            materialDetails: 
                Array<{
                    uuid: string;
                    type: string;
                    weight: number;
                }>,
            
            delete_material_id: string[]
        }
    } = {
        type:'',
        materialData: {
            name: '',
            materialDetails: [
                {
                    uuid: '',
                    type: '',
                    weight: 0
                },
            ],
            delete_material_id: []
        }
    }

    /**
     * Method used to validate form 
     */
    const formik = useFormik({
        initialValues,
        validationSchema: createMaterialValidationSchema,
        onSubmit: (values) => {
            if(values?.type ===Events.add){

                createMaterial({
                    variables:
                    {
                        materialData:
                        {
                            name: values?.materialData?.name,
                            materialDetails: values.materialData.materialDetails.map((data) => { return { type: data?.type, weight: +(data?.weight) } }),
                        }
                    }
                })
                    .then((res) => {
                        toast.success(res?.data?.createMaterial?.message);
                        onClose();
                        refetchMaterialListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
    
                    })
                    .catch((err) => toast.error(err.networkError.result.errors[0].message))
            }
            if(values?.type ===Events.edit){
                editMaterial({
                    variables:
                    {
                        materialData:
                        {
                            material_id:materialObj?.uuid,
                            name: values?.materialData?.name,
                            materialDetails: values.materialData.materialDetails.map((data) => { return { uuid:data?.uuid ?? '', type: data?.type, weight: +(data?.weight) } }),
                            delete_material_id:values?.materialData?.delete_material_id
                        }
                    }
                })
                    .then((res) => {
                        toast.success(res?.data?.updateMaterial?.message);
                        onClose();
                        refetchMaterialListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
    
                    })
                    .catch((err) => toast.error(err.networkError.result.errors[0].message))
            }
        }
    });

    /**
     * Method used to add new field's
     */
    const handleAddNewMaterial = useCallback(() => {

        const addNewFileds = [...formik.values.materialData.materialDetails, { type: '', weight: 0 }];
        formik.setFieldValue('materialData.materialDetails', addNewFileds);

    }, [formik?.values?.materialData]);

    /**
     * Method that returns the errors based on index and fieldName
     * @param index number
     * @param fieldName string
     * @returns string 
     */
    const materialErrors = (index: number, fieldName: string) => {
        return (formik?.errors?.materialData?.materialDetails as Array<{ [key: string]: string | number }>)?.[`${index}`]?.[fieldName];
    };

    const materialtouched = (index: number, fieldName: string) => {
        return (formik?.touched?.materialData?.materialDetails as Array<{ [key: string]: string | number }>)?.[`${index}`]?.[fieldName];
    };

    const OnBlurMaterial = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);

    const onDeleteMaterialDetails = useCallback((index: number) => {
            const delete_lifts = formik.values.materialData?.delete_material_id ?? [];
            const deleteId: string[] = [];
            const data = formik?.values?.materialData.materialDetails?.filter((data, ind) => {
                if (ind === index && data?.uuid) {
                    deleteId.push(data?.uuid)
                }
                if (ind !== index) {
                    return data;
                }
            });
            if (data) {
                formik.setFieldValue('materialData.delete_material_id', [...delete_lifts, ...deleteId]);
                formik.setFieldValue('materialData.materialDetails', data)
            }
       
    }, [formik?.values?.materialData]);

    /** Method used to show edit time warining pop up */
    const onEditMaterial = useCallback(() => {
        setIsEditPopupOpen(true);
    }, [])

    /* Method used to set data to edit frequency data */
    const editMatetrialData = useCallback(() => {
        if (materialObj) {
            formik.setValues({
                type:Events.edit,
                materialData: {
                    name: materialObj?.name,
                    materialDetails:materialObj?.material_types,
                    delete_material_id:formik?.values?.materialData?.delete_material_id
                }

            });
        }
        setIsEditPopupOpen(false)
        setIsAdd(true)
    }, [materialObj]);

    /**
     * Method used to open delete popup
     */
       const onDeleteMaterial = useCallback(()=>{
        setIsDeletePopupOpen(true);
    },[]);

    /**
     * Method used to delete material
     */
    const deleteMaterialData =useCallback(()=>{
        if(materialObj?.uuid){
            deleteMaterial({variables:{materialId:materialObj?.uuid}}).then((res) => {
                toast.success(res?.data?.deleteMaterial?.message);
                refetchMaterialListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
                setIsDeletePopupOpen(false);
            })
            .catch((err) => toast.error(err.networkError.result.errors[0].message))
        }
     },[materialObj]);

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            <div className='mb-3 bg-white rounded-xl overflow-auto border border-[#c8ced3] mx-7 p-3 md:p-5'>
                <div className='flex flex-col justify-between gap-3 mb-3 md:gap-5 md:mb-5 btn-group md:flex-row'>
                    <h6 className='w-full leading-7 xmd:w-auto'>{t('Material List')}</h6>
                    <div className='w-full flex flex-wrap gap-y-3 gap-x-4 2xl:gap-5 md:w-auto'>
                        <TextInput
                            type='text'
                            id='table-search'
                            value={filterData.search}
                            placeholder={t('Search')}
                            onChange={onSearchMaterial}
                            inputIcon={<Search fontSize='18' className='font-normal' />}
                        />
                        <button className="w-full btn btn-gray sm:w-[260px] p-3.5" onClick={() => onDownloadMaterialCsv()} title={`${t('Export')}`} >
                            {t('Export Material List')}  <ImportDoc className='order-2 ml-auto' />
                        </button>
                    </div>
                </div>
                <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                    <table>
                        <thead key='sorting'>
                            <tr>
                                {COL_ARR_MATERIAL_MANAGEMENT?.map((colValUser: ColArrType) => {
                                    return (
                                        <th scope='col' key={colValUser.fieldName}>
                                            <div className={`flex ${['name'].includes(colValUser.fieldName) ? 'justify-start' : 'justify-center'}`}>
                                                {colValUser.name}
                                                {colValUser.sortable && (
                                                    <button
                                                        onClick={() => onHandleSortMaterial(colValUser.fieldName)}
                                                    >
                                                        {(filterData.sortOrder === '' || filterData.sortField !== colValUser.fieldName) &&
                                                            <GetDefaultIcon className='w-3 h-3 ml-1 fill-white' />}
                                                        {filterData.sortOrder === 'ascend' && filterData.sortField === colValUser.fieldName &&
                                                            <ArrowSortingUp className="ml-1 fill-white" />}
                                                        {filterData.sortOrder === 'descend' && filterData.sortField === colValUser.fieldName &&
                                                            <ArrowSortingDown className="ml-1 fill-white" />}
                                                    </button>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                                <th>
                                    <div className='flex justify-center items-center'>
                                        {t('Action')}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.getMaterialsWithPagination?.data?.materials?.map((data: MaterialDataRes, index: number) => {
                                const displayIndex = filterData?.index + index + 1;
                                return (
                                    <tr key={data.uuid}>
                                        <td scope='row' className='text-center'>
                                            {displayIndex}
                                        </td>
                                        <td className='text-start'>{data.name}</td>
                                        <td className='text-center'>{data?.material_types?.map((materialData,index:number) => {
                                            return <span key={materialData?.uuid}>{materialData?.type}&nbsp;{`(${materialData?.weight})`}{data?.material_types?.length-1!==index&&','}&nbsp;</span>
                                        })}</td>
                                        <td>
                                            <div className='btn-group'>
                                                <EditBtnPopup data={data} setData={setMaterialObj} onClick={() => onEditMaterial()} />
                                                <DeleteBtn data={data} setObj={setMaterialObj} customClick={onDeleteMaterial} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {(data?.getMaterialsWithPagination?.data?.count === 0 ||
                        data?.getMaterialsWithPagination?.data === null) && (
                            <div className='flex justify-center'>
                                <div>{t('No Data')}</div>
                            </div>
                        )}
                </div>
                <div className='flex flex-wrap items-center mt-2'>
                    <div className='flex items-center mr-3 md:mr-7'>
                        <span className='text-sm font-normal text-gray-700 whitespace-nowrap '>
                            {t('Per Page')}
                        </span>
                        <select value={filterData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white'
                            onChange={(e) => onPageDrpSelectMaterial(e.target.value)}
                        >
                            {SHOW_PAGE_COUNT_ARR?.map((item: number) => {
                                return <option key={item}>{item}</option>;
                            })}
                        </select>
                    </div>
                    <Pagination
                        currentPage={filterData.page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        recordsPerPage={recordsPerPage}
                    />
                </div>
                {isAdd && <div key="addPopUp" id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${isAdd ? '' : 'hidden'}`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className="flex items-center justify-center h-full py-5 transition-all duration-300">
                        <div className='w-full mx-5 sm:max-w-[780px]'>
                            {/* <!-- Modal content --> */}
                            <div className='relative bg-white rounded-xl'>
                                {/* <!-- Modal header --> */}
                                <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                                    <p className='text-lg font-bold md:text-xl text-baseColor'>{formik?.values?.type===Events.edit ?'Edit Material':'Add New Material'}</p>
                                    <Button onClick={() => onClose()} label={t('')} title={`${t('Close')}`} >
                                        <span className='text-xl-22'><Cross className='text-error' /></span>
                                    </Button>
                                </div>
                                {/* <!-- Modal body --> */}
                                <div className='w-full'>
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className='p-5 max-h-[calc(100vh-260px)] overflow-auto grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    type='text'
                                                    id='MaterialName'
                                                    name='materialData.name'
                                                    label={t('Material Category')}
                                                    value={formik?.values?.materialData?.name}
                                                    placeholder={t('Material Category')}
                                                    onChange={formik.handleChange}
                                                    required={true}
                                                    onBlur={OnBlurMaterial}
                                                    error={formik?.errors?.materialData?.name && formik?.touched?.materialData?.name && formik?.errors?.materialData?.name}
                                                />
                                            </div>
                                            {formik?.values?.materialData?.materialDetails?.map((data: {
                                                type: string;
                                                weight: number;
                                            }, index: number) => {
                                                const key = index;
                                                return (<div className='flex gap-4 col-span-2' key={key}>
                                                    <div className='max-sm:mb-3  sm:w-[calc(50%-10px)]'>
                                                        <TextInput
                                                            name={`materialData.materialDetails[${index}].type`}
                                                            type='text'
                                                            id={data?.type}
                                                            label={t('Material Type')}
                                                            value={formik?.values?.materialData?.materialDetails[`${index}`]?.type}
                                                            placeholder={t('Material Type')}
                                                            onChange={formik.handleChange}
                                                            onBlur={OnBlurMaterial}
                                                            error={materialErrors(index, 'type') && materialtouched(index, 'type') && formik?.touched?.materialData?.name && materialErrors(index, 'type')}
                                                            required={true}
                                                        />
                                                    </div>
                                                    <div className='max-sm:mb-3  sm:w-[calc(50%-10px)] col-span-1'>
                                                        <TextInput
                                                            name={`materialData.materialDetails[${index}].weight`}
                                                            type='text'
                                                            id={`${data?.weight}`}
                                                            label={t('Weight')}
                                                            value={formik?.values?.materialData?.materialDetails[`${index}`]?.weight}
                                                            placeholder={t('Weight')}
                                                            onChange={formik.handleChange}
                                                            onBlur={OnBlurMaterial}
                                                            error={materialErrors(index, 'weight') && materialtouched(index, 'weight') && materialErrors(index, 'weight')}
                                                            required={true}
                                                        />

                                                    </div>
                                                    <div className='flex mt-3 sm:mt-5 lg:mt-6' >
                                                            <button type="button" className='btn bg-transparent cursor-pointer btn-default' onClick={() => onDeleteMaterialDetails(index)} disabled={formik?.values?.materialData?.materialDetails.length ===1} ><Trash className='fill-error' /></button>
                                                    </div>

                                                </div>);
                                            })}
                                            <div className='col-span-2'>
                                                <button
                                                    className={'btn btn-primary btn-normal w-full md:w-auto min-w-[160px]'}
                                                    type='button'
                                                    onClick={handleAddNewMaterial}
                                                >{t('Add New Material')}</button>
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                            <Button className={'btn-primary btn-normal w-full md:w-auto min-w-[160px]'} type='submit'
                                                label={formik?.values?.type===Events.edit ?t('Update'):t('Create')}
                                                disabled={createMaterialLoadingState}
                                                title={`${t('Create')}`}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                {isEditPopupOpen && (
                    <CommonModel
                        warningText={EDIT_WARNING_TEXT}
                        onClose={onClose}
                        action={editMatetrialData}
                        show={isEditPopupOpen}
                        disabled={editMaterialLoadingState}
                    />
                )}
                {(isDeletePopupOpen) && (
                    <CommonModel
                        warningText={DELETE_WARNING_TEXT}
                        onClose={onClose}
                        action={deleteMaterialData}
                        show={isDeletePopupOpen}
                        disabled={deleteMaterialLoadingState}
                         />
                )}
            </div>
        </>);
}

export default MaterialManagement;