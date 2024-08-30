import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import Button from '@components/button/button';
import UpdatedHeader from '@components/header/updatedHeader';
import { ArrowSortingDown, ArrowSortingUp, Cross, GetDefaultIcon, ImportDoc, Search } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import { API_BASE_URL, DELETE_WARNING_TEXT, EDIT_WARNING_TEXT, Events, PAGE_LIMIT, PAGE_NUMBER, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { ColArrType } from '@types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filterServiceProps from '@components/filter/filter';
import { APIServices } from 'src/services/axiosCommon';
import { useFormik } from 'formik';
import useValidation from '@framework/hooks/validations';
import { GET_FREQUENCY_WITH_PAGINATION } from '@framework/graphql/queries/frequencyManagement';
import { CREATE_FREQUENCY, DELETE_FREQUENCY, EDIT_FREQUENCY } from '@framework/graphql/mutations/frequencyManagement';
import { whiteSpaceRemover } from '@utils/helpers';
import CommonModel from '@components/common/commonModel';
import EditBtnPopup from '@components/common/EditButtonPopup';
import DeleteBtn from '@components/common/deleteBtn';

export type FrequencyDataRes = {
    uuid: string;
    frequency_type: string;
    frequency: number;
}

const FrequencyManagement = (): ReactElement => {
    const { t } = useTranslation();
    const COL_ARR_FEQUENCY_MANAGEMENT = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Frequency Type'), sortable: true, fieldName: 'frequency_type' },
        { name: t('Frequency'), sortable: true, fieldName: 'frequency' },
    ] as ColArrType[];
    const [filterData, setFilterData] = useState({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortOrder: 'descend',
        search: '',
        sortField: 'id',
        index: 0
    });
    const { createFrequencyValidationSchema } = useValidation();
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState<boolean>(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
    const [frequencyObj, setfrequencyObj] = useState<FrequencyDataRes>();
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
    const { data, refetch: refetchFrequencyListData } = useQuery(GET_FREQUENCY_WITH_PAGINATION, {
        fetchPolicy: 'network-only',
        variables: filterData ?? {
            limit: PAGE_LIMIT,
            page: PAGE_NUMBER,
            sortOrder: 'descend',
            search: '',
            sortField: 'id',
        }
    });
    const [createFrequency, { loading: createFrequencyLoadingState }] = useMutation(CREATE_FREQUENCY);
    const [editFrequency, { loading: editFrequencyLoadingState }] = useMutation(EDIT_FREQUENCY);
    const [deleteFrequency, { loading: deleteFrequencyLoadingState }] = useMutation(DELETE_FREQUENCY);


    /**
     * Method refetchs the list data if there any change in filterData  
     */
    useEffect(() => {
        refetchFrequencyListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
    }, [filterData])

    /**
     * Method used to records per page
     */
    useEffect(() => {
        setRecordsPerPage(filterData?.limit)
    }, [filterData?.limit])

    const totalFrequencysListCount = data?.getFrequencyWithPagination?.data?.count || 0;
    const totalPages = Math.ceil(totalFrequencysListCount / recordsPerPage);

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
        filterServiceProps.saveState('filterFrequency', JSON.stringify(updatedFilterData));
    }, [filterData.limit])

    /**
     * Method used to set search value in filterData
     */
    const onSearchFrequency = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterData({ ...filterData, search: e.target.value })
    }, []);

    /**
     *
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortFrequency = (sortFieldName: string) => {
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
    const onPageDrpSelectFrequency = (e: string) => {
        const newLimit = Number(e);
        const updatedFilterData = {
            ...filterData,
            limit: newLimit,
            page: PAGE_NUMBER,
            index: 0,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterFrequency', JSON.stringify(updatedFilterData));
    };

    /**
     * Method used to open Add new popup
     */
    const onAddFrequency = useCallback(() => {
        setIsAdd(true);
        formik.setFieldValue('type',Events.add);
    }, []);

    /**
     * Method used to close add new popup
     */
    const onClose = useCallback(() => {
        formik.resetForm();
        setfrequencyObj(undefined);
        setIsAdd(false);
        setIsEditPopupOpen(false);
        setIsDeletePopupOpen(false);
    }, []);

    /**
     * Method used to download csv file of Frequency list
     */
    const onDownloadFrequencyCsv = useCallback(() => {
        APIServices.getList(`${API_BASE_URL}/export-frequency-csv`)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'frequency-list.csv');
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
                onClick={onAddFrequency}
                label={t('Add New')}
            />
        )
    };

    const initialValues: {
        type:string;
        frequencyData: {
            frequency: number,
            frequency_type: string
        }
    } = {
        type:'',
        frequencyData: {
            frequency: 0,
            frequency_type: ''
        }
    };

    /**
     * Method used to validate form 
     */
    const formik = useFormik({
        initialValues,
        validationSchema: createFrequencyValidationSchema,
        onSubmit: (values) => {
            if (values?.type===Events.add) {
                createFrequency({
                    variables:
                    {
                        frequencyData:
                        {
                            frequency: Number(values?.frequencyData?.frequency),
                            frequency_type: values?.frequencyData?.frequency_type
                        }
                    }
                })
                    .then((res) => {
                        toast.success(res?.data?.createFrequency?.message);
                        refetchFrequencyListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
                        onClose();
                    })
                    .catch((err) => toast.error(err.networkError.result.errors[0].message))
            } 
            if(values?.type===Events.edit) {
                editFrequency({
                    variables:
                    {
                        frequencyData:
                        {
                            frequency_id: frequencyObj?.uuid,
                            frequency: Number(values?.frequencyData?.frequency),
                            frequency_type: values?.frequencyData?.frequency_type
                        }
                    }
                })
                    .then((res) => {
                        toast.success(res?.data?.updateFrequency?.message);
                        refetchFrequencyListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
                        onClose();
                    })
                    .catch((err) => toast.error(err.networkError.result.errors[0].message))
            }
        }
    })

    const OnBlurFrequency = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);

    /** Method used to show edit time warining pop up */
    const onEditFrequency = useCallback(() => {
        setIsEditPopupOpen(true);
    }, []);

    /* Method used to set data to edit frequency data */
    const editFrequencyData = useCallback(() => {
        if (frequencyObj) {
            formik.setValues({
                type:Events.edit,
                frequencyData: {
                    frequency: frequencyObj?.frequency,
                    frequency_type: frequencyObj?.frequency_type
                }
            });
        }
        setIsEditPopupOpen(false)
        setIsAdd(true)
    }, [frequencyObj]);

    /**
        * Method used to open delete popup
         */
    const onDeleteFrequency = useCallback(()=>{
        setIsDeletePopupOpen(true);
    },[]);

    /**
     * Method used to delete frequency
     */
    const deleteFrequencyData =useCallback(()=>{
        if(frequencyObj?.uuid){
            deleteFrequency({variables:{frequencyId:frequencyObj?.uuid}}).then((res) => {
                toast.success(res?.data?.deleteFrequency?.message);
                refetchFrequencyListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
                setIsDeletePopupOpen(false);
            })
            .catch((err) => toast.error(err.networkError.result.errors[0].message))
        }
    },[frequencyObj]);

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            <div className='mb-3 bg-white rounded-xl overflow-auto border border-[#c8ced3] mx-7 p-3 md:p-5'>
                <div className='flex flex-col justify-between gap-3 mb-3 md:gap-5 md:mb-5 btn-group md:flex-row'>
                    <h6 className='w-full leading-7 xmd:w-auto'>{t('Frequency List')}</h6>
                    <div className='w-full flex flex-wrap gap-y-3 gap-x-4 2xl:gap-5 md:w-auto'>
                        <TextInput
                            type='text'
                            id='table-search'
                            value={filterData.search}
                            placeholder={t('Search')}
                            onChange={onSearchFrequency}
                            inputIcon={<Search fontSize='18' className='font-normal' />}
                        />
                        <button className="w-full btn btn-gray sm:w-[260px] p-3.5" onClick={() => onDownloadFrequencyCsv()}
                            title={`${t('Export')}`} >
                            Export Frequency List  <ImportDoc className='order-2 ml-auto' />
                        </button>
                    </div>
                </div>
                <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                    <table>
                        <thead key='sorting'>
                            <tr>
                                {COL_ARR_FEQUENCY_MANAGEMENT?.map((colValUser: ColArrType) => {
                                    return (
                                        <th scope='col' key={colValUser.fieldName}>
                                            <div className={`flex ${['frequency_type'].includes(colValUser.fieldName) ? 'justify-start' : 'justify-center'}`}>
                                                {colValUser.name}
                                                {colValUser.sortable && (
                                                    <button
                                                        onClick={() => onHandleSortFrequency(colValUser.fieldName)}
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
                            {data?.getFrequencyWithPagination?.data?.frequency?.map((data: FrequencyDataRes, index: number) => {
                                const displayIndex = filterData?.index + index + 1;
                                return (
                                    <tr key={data.uuid}>
                                        <td scope='row' className='text-center'>
                                            {displayIndex}
                                        </td>
                                        <td className='text-start'>{data.frequency_type}</td>
                                        <td className='text-center'>{data.frequency}</td>
                                       {data?.frequency_type!=='1'&& <td>
                                            <div className='btn-group'>
                                                <EditBtnPopup data={data} setData={setfrequencyObj} onClick={() => onEditFrequency()} />
                                                <DeleteBtn data={data} setObj={setfrequencyObj} customClick={onDeleteFrequency} />
                                            </div>
                                        </td>}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {(data?.getFrequencyWithPagination?.data?.count === 0 ||
                        data?.getFrequencyWithPagination?.data === null) && (
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
                            onChange={(e) => onPageDrpSelectFrequency(e.target.value)}
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
                                    <p className='text-lg font-bold md:text-xl text-baseColor'>{formik?.values?.type===Events.edit ? 'Edit Frequency':'Add New Frequency'}</p>
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
                                                    id='frequency_type'
                                                    name='frequencyData.frequency_type'
                                                    label={t('Frequency Type')}
                                                    value={formik?.values?.frequencyData?.frequency_type}
                                                    placeholder={t('Frequency Type')}
                                                    onChange={formik.handleChange}
                                                    required={true}
                                                    onBlur={OnBlurFrequency}
                                                    error={formik?.errors?.frequencyData?.frequency_type && formik?.touched?.frequencyData?.frequency_type && formik?.errors?.frequencyData?.frequency_type}
                                                />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    type='text'
                                                    id='frequency'
                                                    name='frequencyData.frequency'
                                                    label={t('Frequency')}
                                                    value={formik?.values?.frequencyData?.frequency}
                                                    placeholder={t('Frequency')}
                                                    onChange={formik.handleChange}
                                                    required={true}
                                                    onBlur={OnBlurFrequency}
                                                    error={formik?.errors?.frequencyData?.frequency && formik?.touched?.frequencyData?.frequency && formik?.errors?.frequencyData?.frequency}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                            {<Button className={'btn-primary btn-normal w-full md:w-auto min-w-[160px]'} type='submit'
                                                label={formik?.values?.type===Events.edit ?t('Update'):t('Create')}
                                                disabled={createFrequencyLoadingState||editFrequencyLoadingState}
                                                title={`${t('Create')}`}
                                            />}

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
                        action={editFrequencyData}
                        show={isEditPopupOpen}
                        disabled={editFrequencyLoadingState}
                    />
                )}
                {(isDeletePopupOpen) && (
                    <CommonModel
                        warningText={DELETE_WARNING_TEXT}
                        onClose={onClose}
                        action={deleteFrequencyData}
                        show={isDeletePopupOpen}
                        disabled={deleteFrequencyLoadingState}
                         />
                )}
            </div>
        </>);
}

export default FrequencyManagement;