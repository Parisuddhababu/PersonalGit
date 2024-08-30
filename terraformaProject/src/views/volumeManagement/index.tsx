import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import Button from '@components/button/button';
import UpdatedHeader from '@components/header/updatedHeader';
import { ArrowSortingDown, ArrowSortingUp, Cross, GetDefaultIcon, ImportDoc, Search } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import { API_BASE_URL,  DELETE_WARNING_TEXT,  EDIT_WARNING_TEXT, Events, PAGE_LIMIT, PAGE_NUMBER, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { GET_VOLUME_WITH_PAGINATION } from '@framework/graphql/queries/volumeManagement';
import { ColArrType } from '@types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filterServiceProps from '@components/filter/filter';
import { APIServices } from 'src/services/axiosCommon';
import { useFormik } from 'formik';
import useValidation from '@framework/hooks/validations';
import { CREATE_VOLUME, DELETE_VOLUME, EDIT_VOLUME } from '@framework/graphql/mutations/volumeManagement';
import { whiteSpaceRemover } from '@utils/helpers';
import EditBtnPopup from '@components/common/EditButtonPopup';
import CommonModel from '@components/common/commonModel';
import DeleteBtn from '@components/common/deleteBtn';

export type VolumesDataRes = {
    uuid: string;
    volume: string;
    volume_cubic_yard: number;
}

const VolumeManagement = (): ReactElement => {
    const { t } = useTranslation();
    const COL_ARR_VOLUME_MANAGEMENT = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Volume'), sortable: true, fieldName: 'volume' },
        { name: t('Volume (Cubic Yard)'), sortable: true, fieldName: 'volume_cubic_yard' },
        { name: t('Action'), sortable: false, fieldName: 'action' }
    ] as ColArrType[];
    const [filterData, setFilterData] = useState({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortOrder: 'descend',
        search: '',
        sortField: 'id',
        index: 0
    });
    const { createVolumeValidationSchema } = useValidation();
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState<boolean>(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
    const [volumeObj,setVolumeObj]= useState<VolumesDataRes>();
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
    const { data, refetch: refetchVolumeListData } = useQuery(GET_VOLUME_WITH_PAGINATION, {
        fetchPolicy: 'network-only',
        variables: filterData ?? {
            limit: PAGE_LIMIT,
            page: PAGE_NUMBER,
            sortOrder: 'descend',
            search: '',
            sortField: 'id',
        }
    });
    const [createVolume, { loading: createVolumeLoadingState }] = useMutation(CREATE_VOLUME);
    const [editVolume, { loading: editVolumeLoadingState }] = useMutation(EDIT_VOLUME);  
    const [deleteVolume, { loading: deleteVolumeLoadingState }] = useMutation(DELETE_VOLUME);  


    /**
     * Method refetchs the list data if there any change in filterData  
     */
    useEffect(() => {
        refetchVolumeListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
    }, [filterData])

    /**
     * Method used to records per page
     */
    useEffect(() => {
        setRecordsPerPage(filterData?.limit)
    }, [filterData?.limit])

    const totalVolumesListCount = data?.getVolumesWithPagination?.data?.count || 0;
    const totalPages = Math.ceil(totalVolumesListCount / recordsPerPage);

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
        filterServiceProps.saveState('filterVolume', JSON.stringify(updatedFilterData));
    }, [filterData.limit])

    /**
     * Method used to set search value in filterData
     */
    const onSearchVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterData({ ...filterData, search: e.target.value })
    }, []);

    /**
     *
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortVolume = (sortFieldName: string) => {
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
    const onPageDrpSelectVolume = (e: string) => {
        const newLimit = Number(e);
        const updatedFilterData = {
            ...filterData,
            limit: newLimit,
            page: PAGE_NUMBER,
            index: 0,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterVolume', JSON.stringify(updatedFilterData));
    };

    /**
     * Method used to open Add new popup
     */
    const onAddVolume = useCallback(() => {
        setIsAdd(true);
        formik.setFieldValue('type',Events.add);
    }, []);

    /**
     * Method used to close popup
     */
    const onClose = useCallback(() => {
        formik.resetForm();
        setVolumeObj(undefined);
        setIsEditPopupOpen(false);
        setIsDeletePopupOpen(false);
        setIsAdd(false);
    }, []);

    /**
     * Method used to download csv file of volume list
     */
    const onDownloadVolumeCsv = useCallback(() => {
        APIServices.getList(`${API_BASE_URL}/export-volume-csv`)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'volume-list.csv');
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
                onClick={onAddVolume}
                label={t('Add New')}
            />
        )
    };
    const initialValues = {
        type:'',
        volumeData: {
            volume: '',
            volume_cubic_yard: ''
        }
    }

    /**
     * Method used to validate form 
     */
    const formik = useFormik({
        initialValues,
        validationSchema: createVolumeValidationSchema,
        onSubmit: (values) => {
            if(values?.type===Events.add){
                createVolume({
                    variables:
                    {
                        volumeData:
                        {
                            volume: values?.volumeData?.volume,
                            volume_cubic_yard: Number(values?.volumeData?.volume_cubic_yard)
                        }
                    }
                })
                    .then((res) => {
                        toast.success(res?.data?.createVolume?.message);
                        refetchVolumeListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
                        onClose();
                    })
                    .catch((err) => toast.error(err.networkError.result.errors[0].message))
            }
            if(values?.type===Events.edit){
                editVolume({
                    variables:
                    {
                        volumeData:
                        {
                            volume_id:volumeObj?.uuid,
                            volume: values?.volumeData?.volume,
                            volume_cubic_yard: Number(values?.volumeData?.volume_cubic_yard)
                        }
                    }
                })
                    .then((res) => {
                        toast.success(res?.data?.updateVolume?.message);
                        refetchVolumeListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
                        onClose();
                    })
                    .catch((err) => toast.error(err.networkError.result.errors[0].message))
            }
        }
    })

    const OnBlurVolume = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);
    
    /**
     * Method used to open edit warning popup
     */
    const onEditVolume = useCallback(()=>{
        setIsEditPopupOpen(true);
    },[]);

    /**
     * Method used to open delete popup
     */
    const onDeleteVolume = useCallback(()=>{
        setIsDeletePopupOpen(true);
    },[]);

    /**
     * Method used to open edit popup
     */
    const editVolumeData =useCallback(()=>{
       if(volumeObj){
        formik.setValues({type:Events.edit,volumeData: {
            volume: volumeObj?.volume,
            volume_cubic_yard: volumeObj?.volume_cubic_yard.toString() 
        }});
       }
       setIsEditPopupOpen(false);
       setIsAdd(true);
    },[volumeObj]);

    /**
     * Method used to delete volume
     */
    const deleteVolumeData =useCallback(()=>{
        if(volumeObj?.uuid){
            deleteVolume({variables:{volumeId:volumeObj?.uuid}}).then((res) => {
                toast.success(res?.data?.deleteVolume?.message);
                refetchVolumeListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
                setIsDeletePopupOpen(false);
            })
            .catch((err) => toast.error(err.networkError.result.errors[0].message))
        }
     },[volumeObj]);

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            <div className='mb-3 bg-white rounded-xl overflow-auto border border-[#c8ced3] mx-7 p-3 md:p-5'>
                <div className='flex flex-col justify-between gap-3 mb-3 md:gap-5 md:mb-5 btn-group md:flex-row'>
                    <h6 className='w-full leading-7 xmd:w-auto'>{t('Volume List')}</h6>
                    <div className='w-full flex flex-wrap gap-y-3 gap-x-4 2xl:gap-5 md:w-auto'>
                        <TextInput
                            type='text'
                            id='table-search'
                            value={filterData.search}
                            placeholder={t('Search')}
                            onChange={onSearchVolume}
                            inputIcon={<Search fontSize='18' className='font-normal' />}
                        />
                        <button className="w-full btn btn-gray sm:w-[260px] p-3.5" onClick={() => onDownloadVolumeCsv()} title={`${t('Export')}`} >
                            Export Volume List  <ImportDoc className='order-2 ml-auto' />
                        </button>
                    </div>
                </div>
                <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                    <table>
                        <thead key='sorting'>
                            <tr>
                                {COL_ARR_VOLUME_MANAGEMENT?.map((colValUser: ColArrType) => {
                                    return (
                                        <th scope='col' key={colValUser.name}>
                                            <div className={'flex justify-center'}>
                                                {colValUser.name}
                                                {colValUser.sortable && (
                                                    <button
                                                        onClick={() => onHandleSortVolume(colValUser.fieldName)}
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
                            </tr>
                        </thead>
                        <tbody>
                            {data?.getVolumesWithPagination?.data?.volumes?.map((data: VolumesDataRes, index: number) => {
                                const displayIndex = filterData?.index + index + 1;
                                return (
                                    <tr key={data.uuid}>
                                        <td scope='row' className='text-center'>
                                            {displayIndex}
                                        </td>
                                        <td className='text-center'>{data.volume}</td>
                                        <td className='text-center'>{data.volume_cubic_yard}</td>
                                        <td>
                                            <div className='btn-group'>
                                                <EditBtnPopup data={data} setData={setVolumeObj} onClick={() => onEditVolume()} />
                                                <DeleteBtn data={data} setObj={setVolumeObj} customClick={onDeleteVolume} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {(data?.getVolumesWithPagination?.data?.count === 0 ||
                        data?.getVolumesWithPagination?.data === null) && (
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
                            onChange={(e) => onPageDrpSelectVolume(e.target.value)}
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
                                    <p className='text-lg font-bold md:text-xl text-baseColor'>{formik?.values?.type===Events.edit ?'Edit Volume':'Add New Volume'}</p>
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
                                                    id='volume'
                                                    name='volumeData.volume'
                                                    label={t('Volume Title')}
                                                    value={formik.values.volumeData.volume}
                                                    placeholder={t('Volume Title')}
                                                    onChange={formik.handleChange}
                                                    onBlur={OnBlurVolume}
                                                    required={true}
                                                    error={formik?.errors?.volumeData?.volume && formik?.touched?.volumeData?.volume && formik?.errors?.volumeData?.volume}
                                                />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    type='text'
                                                    id='volume'
                                                    name='volumeData.volume_cubic_yard'
                                                    label={t('Add Volume (Cubic Yard)')}
                                                    value={formik.values.volumeData.volume_cubic_yard}
                                                    placeholder={t('Volume (Cubic Yard)')}
                                                    onChange={formik.handleChange}
                                                    required={true}
                                                    onBlur={OnBlurVolume}
                                                    error={formik?.errors?.volumeData?.volume_cubic_yard && formik?.touched?.volumeData?.volume_cubic_yard && formik?.errors?.volumeData?.volume_cubic_yard}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                            {<Button className={'btn-primary btn-normal w-full md:w-auto min-w-[160px]'} type='submit'
                                                label={formik?.values?.type===Events.edit?t('Update'): t('Create')}
                                                disabled={createVolumeLoadingState||editVolumeLoadingState}
                                                title={`${t('Create')}`}
                                            />}

                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                {(isEditPopupOpen) && (
                    <CommonModel
                        warningText={EDIT_WARNING_TEXT}
                        onClose={onClose}
                        action={editVolumeData}
                        show={isEditPopupOpen}
                        disabled={editVolumeLoadingState}
                         />
                )}
                 {(isDeletePopupOpen) && (
                    <CommonModel
                        warningText={DELETE_WARNING_TEXT}
                        onClose={onClose}
                        action={deleteVolumeData}
                        show={isDeletePopupOpen}
                        disabled={deleteVolumeLoadingState}
                         />
                )}
            </div>
        </>);
}

export default VolumeManagement