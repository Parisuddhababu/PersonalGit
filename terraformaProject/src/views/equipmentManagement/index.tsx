import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import Button from '@components/button/button';
import UpdatedHeader from '@components/header/updatedHeader';
import { ArrowSortingDown, ArrowSortingUp, Cross, GetDefaultIcon, ImportDoc, Search, Trash } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import { API_BASE_URL, DELETE_WARNING_TEXT, EDIT_WARNING_TEXT, Events, PAGE_LIMIT, PAGE_NUMBER, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { ColArrType, DropdownOptionType } from '@types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filterServiceProps from '@components/filter/filter';
import { APIServices } from 'src/services/axiosCommon';
import { FormikErrors, FormikTouched, useFormik } from 'formik';
import useValidation from '@framework/hooks/validations';
import { VolumesDataRes } from '@views/volumeManagement';
import { GET_EQUIPMENT_WITH_PAGINATION } from '@framework/graphql/queries/equipmentManagement';
import { CREATE_EQUIPMENT, DELETE_EQUIPMENT, EDIT_EQUIPMENT, GET_EQUIPMENT_BY_NAME } from '@framework/graphql/mutations/equipmentManagement';
import { GET_VOLUMES } from '@framework/graphql/queries/volumeManagement';
import { useDispatch, useSelector } from 'react-redux';
import { EquipmentSliceType, setVolumeData } from 'src/redux/equipment-slice';
import DropDown from '@components/dropdown/dropDown';
import { whiteSpaceRemover } from '@utils/helpers';
import DeleteBtn from '@components/common/deleteBtn';
import CommonModel from '@components/common/commonModel';
import EditBtnPopup from '@components/common/EditButtonPopup';
import { Loader } from '@components/index';

export type EquipmentDataRes = {
    uuid: string;
    name: string;
    volume: VolumesDataRes[];
}

const EquipmentManagement = () => {
    const { t } = useTranslation();
    const COL_ARR_EQUIPMENT_MANAGEMENT = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Equipment'), sortable: true, fieldName: 'name' },
        { name: t('Volume'), sortable: false, fieldName: 'volume.volume' },
        { name: t('Volume (Cubic Yard)'), sortable: false, fieldName: 'volume.volume_cubic_yard' },
    ] as ColArrType[];
    const [filterData, setFilterData] = useState({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortOrder: 'descend',
        search: '',
        sortField: 'id',
        index: 0
    });
    const dispatch = useDispatch();
    const equipmentDetails = useSelector(((state: { equipmentManagement: EquipmentSliceType }) => state.equipmentManagement))
    const { createEquipmentValidationSchema } = useValidation();
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState<boolean>(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
    const [equipmentObj, setEquipmentObj] = useState<EquipmentDataRes>();
    const [volumesDrpData, setVolumesDrpData] = useState<DropdownOptionType[]>([]);
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
    const { data, refetch: refetchEquipmentListData } = useQuery(GET_EQUIPMENT_WITH_PAGINATION, {
        fetchPolicy: 'network-only',
        variables: filterData ?? {
            limit: PAGE_LIMIT,
            page: PAGE_NUMBER,
            sortOrder: 'descend',
            search: '',
            sortField: 'id',
        }
    });
    const { refetch: getAllVolumes } = useQuery(GET_VOLUMES, { fetchPolicy: 'network-only', skip: true });
    const [createEquipment, { loading: createEquipmentLoadingState }] = useMutation(CREATE_EQUIPMENT);
    const [editEquipment, { loading: editEquipmentLoadingState }] = useMutation(EDIT_EQUIPMENT);
    const [deleteEquipment, { loading: deleteEquipmentLoadingState }] = useMutation(DELETE_EQUIPMENT);
    const [getEquipmentbyName, { loading: getEquipmentbyNameLoadingState }] = useMutation(GET_EQUIPMENT_BY_NAME);

    /**
     * Method refetchs the list data if there any change in filterData  
     */
    useEffect(() => {
        refetchEquipmentListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
    }, [filterData])

    /**
     * Method used to records per page
     */
    useEffect(() => {
        setRecordsPerPage(filterData?.limit)
    }, [filterData?.limit])

    const totalEquipmentsListCount = data?.getEquipmentsWithPagination?.data?.count || 0;
    const totalPages = Math.ceil(totalEquipmentsListCount / recordsPerPage);

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
        filterServiceProps.saveState('filterEquipment', JSON.stringify(updatedFilterData));
    }, [filterData.limit])

    /**
     * Method used to set search value in filterData
     */
    const onSearchEquipment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterData({ ...filterData, search: e.target.value })
    }, []);

    /**
     *
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortEquipment = (sortFieldName: string) => {
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
    const onPageDrpSelectEquipment = (e: string) => {
        const newLimit = Number(e);
        const updatedFilterData = {
            ...filterData,
            limit: newLimit,
            page: PAGE_NUMBER,
            index: 0,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterEquipment', JSON.stringify(updatedFilterData));
    };

    const setVolumeDrpDataFun=()=>{
        getAllVolumes().then((res) => {
            const volumeCubicData: { [key: string]: number } = {};
            const volumeDrpData = res?.data?.getVolumes?.data?.map((data: VolumesDataRes) => {
                volumeCubicData[`${data?.uuid}`] = data?.volume_cubic_yard;
                return { name: data?.volume, key: data?.uuid }
            });
            if (volumeDrpData) {
                dispatch(setVolumeData(volumeCubicData));
                setVolumesDrpData(volumeDrpData);
            }
        }).catch((err) => toast.error(err.networkError.result.errors[0].message));
    };

    /**
     * Method used to open Add new popup
     */
    const onAddEquipment = useCallback(() => {
        setIsAdd(true);
        setVolumeDrpDataFun();
        formik?.setFieldValue('type', Events.add);
    }, []);

    /**
     * Method used to close add new popup
     */
    const onClose = useCallback(() => {
        formik.resetForm();
        setIsAdd(false);
        setIsEditPopupOpen(false)
        refetchEquipmentListData(filterData).catch((err) => toast.error(err.networkError.result.errors[0].message));
        setIsDeletePopupOpen(false);
    }, [filterData]);

    /**
     * Method used to download csv file of Equipment list
     */
    const onDownloadEquipmentCsv = useCallback(() => {
        APIServices.getList(`${API_BASE_URL}/export-equipment-csv`)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'equipment-list.csv');
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
                onClick={onAddEquipment}
                label={t('Add New')}
            />
        )
    };

    const initialValues = {
        type: '',
        equipmentData: {
            name: '',
            volumeId: [{ uuid: '', equipmentId: '' }],
            delete_equipment_id: []
        }
    }

    const createEquipmentFun = (values: {
        type: string;
        equipmentData: {
            name: string;
            volumeId: {
                uuid: string;
                equipmentId: string;
            }[];
            delete_equipment_id: string[];
        };
    }) => {
        const volumeId: string[] = values?.equipmentData?.volumeId?.map((data) => data?.uuid);
        if (volumeId) {
            createEquipment({
                variables:
                {
                    equipmentData:
                    {
                        volume_id: volumeId,
                        name: values?.equipmentData?.name
                    }
                }
            }).then((res) => {
                toast.success(res?.data?.createEquipment?.message);
                onClose();
            })
                .catch((err) =>
                    toast.error(err.networkError.result.errors[0].message)
                   )
        }
    };

    const updateEquipmentFun = (values: {
        type: string;
        equipmentData: {
            name: string;
            volumeId: {
                uuid: string;
                equipmentId: string;
            }[];
            delete_equipment_id: string[];
        };
    }) => {
        const equipment = values?.equipmentData?.volumeId?.map((data) => {
            return { equipment_id: data?.equipmentId??'', name: values?.equipmentData?.name, volume_id: data?.uuid }
        })
        if (equipment) {
            editEquipment({
                variables: {
                    equipmentData: {
                        equipment: equipment,
                        delete_equipment_id: values?.equipmentData?.delete_equipment_id
                    }
                }
            }).then((res) => {
                toast.success(res?.data?.updateEquipment?.message);
                onClose();
            })
                .catch((err) => 
                    toast.error(err.networkError.result.errors[0].message))
        }
    };

    /**
     * Method used to validate form 
     */
    const formik = useFormik({
        initialValues,
        validationSchema: createEquipmentValidationSchema,
        onSubmit: (values) => {
            if (values?.type === Events.add) {
                createEquipmentFun(values)
            }
            if (values?.type === Events.edit) {
                updateEquipmentFun(values)
            }
        }
    });

    const OnBlurEquip = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);

    /** Method used to show edit time warining pop up */
    const onEditEquipment = useCallback(() => {
        setIsEditPopupOpen(true);
    }, []);

    /* Method used to set data to edit frequency data */
    const editEquipmentData = useCallback(() => {
        setVolumeDrpDataFun();
        if (equipmentObj) {
            getEquipmentbyName({ variables: { equipmentName: equipmentObj?.name } }).then((res) => {
                const volumeData = res?.data?.getEquipmentByName?.data?.map((data: {
                    uuid: string;
                    name: string;
                    volume: VolumesDataRes;
                }) => {
                    return { equipmentId: data?.uuid, uuid: data?.volume?.uuid }
                });
                if (volumeData) {
                    formik.setValues({
                        type: Events.edit,
                        equipmentData: {
                            name: res?.data?.getEquipmentByName?.data?.[0]?.name,
                            volumeId: volumeData,
                            delete_equipment_id: []
                        }

                    });
                }
            })
                .catch((err) => toast.error(err.networkError.result.errors[0].message))

        }
        setIsEditPopupOpen(false)
        setIsAdd(true)
    }, [equipmentObj]);

    /**
      * Method used to open delete popup
     */
    const onDeleteEquipment = useCallback(() => {
        setIsDeletePopupOpen(true);
    }, []);

    /**
     * Method used to delete equipment
     */
    const deleteEquipmentData = useCallback(() => {
        if (equipmentObj?.uuid) {
            deleteEquipment({ variables: { equipmentId: equipmentObj?.uuid } }).then((res) => {
                toast.success(res?.data?.deleteEquipment?.message);
                onClose();
            })
                .catch((err) =>
                    toast.error(err.networkError.result.errors[0].message)
                )
        }
    }, [equipmentObj]);

    /**
    * Method used to add new field's
    */
    const handleAddNewEquipment = useCallback(() => {

        const addNewFileds = [...formik.values.equipmentData.volumeId, { uuid: '' }];
        formik.setFieldValue('equipmentData.volumeId', addNewFileds);

    }, [formik?.values?.equipmentData?.volumeId]);

    const onDeleteEquipmentDetails = useCallback((index: number) => {
        const delete_lifts = formik.values.equipmentData?.delete_equipment_id ?? [];
        const deleteId: string[] = [];
        const data = formik?.values?.equipmentData.volumeId?.filter((data, ind) => {
            if (ind === index && data?.equipmentId) {
                deleteId.push(data?.equipmentId)
            }
            if (ind !== index) {
                return data;
            }
        });
        if (data) {
            formik.setFieldValue('equipmentData.delete_equipment_id', [...delete_lifts, ...deleteId]);
            formik.setFieldValue('equipmentData.volumeId', data)
        }

    }, [formik?.values?.equipmentData?.volumeId]);

    const equipmentErrors = formik?.errors?.equipmentData?.volumeId as FormikErrors<Array<{ uuid: string }>>;
    const equipmentTounched = formik?.touched?.equipmentData as FormikTouched<{ name: string, volumeId: { uuid: string }[] }>;

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            <div className='mb-3 bg-white rounded-xl overflow-auto border border-[#c8ced3] mx-7 p-3 md:p-5'>
                <div className='flex flex-col justify-between gap-3 mb-3 md:gap-5 md:mb-5 btn-group md:flex-row'>
                    <h6 className='w-full leading-7 xmd:w-auto'>{t('Equipment List')}</h6>
                    <div className='w-full flex flex-wrap gap-y-3 gap-x-4 2xl:gap-5 md:w-auto'>
                        <TextInput
                            type='text'
                            id='table-search'
                            value={filterData.search}
                            placeholder={t('Search')}
                            onChange={onSearchEquipment}
                            inputIcon={<Search fontSize='18' className='font-normal' />}
                        />
                        <button className="w-full btn btn-gray sm:w-[260px] p-3.5" onClick={() => onDownloadEquipmentCsv()} title={`${t('Export')}`}>
                            Export Equipment List  <ImportDoc className='order-2 ml-auto' />
                        </button>
                    </div>
                </div>
                <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                    <table>
                        <thead key='sorting'>
                            <tr>
                                {COL_ARR_EQUIPMENT_MANAGEMENT?.map((colValUser: ColArrType) => {
                                    return (
                                        <th scope='col' key={colValUser.fieldName}>
                                            <div className={`flex ${['name'].includes(colValUser.fieldName) ? 'justify-start' : 'justify-center'}`}>
                                                {colValUser.name}
                                                {colValUser.sortable && (
                                                    <button
                                                        onClick={() => onHandleSortEquipment(colValUser.fieldName)}
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
                            {data?.getEquipmentsWithPagination?.data?.equipments?.map((data: {
                                uuid: string;
                                name: string;
                                volume: VolumesDataRes[];
                            }, index: number) => {
                                const displayIndex = filterData?.index + index + 1;
                                return (
                                    <tr key={data.uuid}>
                                        <td scope='row' className='text-center'>
                                            {displayIndex}
                                        </td>
                                        <td className='text-start'>{data.name}</td>
                                        <td className='text-center'><div className='flex justify-center '><ul>{data?.volume?.map((data) => {
                                            return <li className='mb-1 last:mb-0' key={data?.volume}>{data?.volume}</li>
                                        })}</ul></div></td>
                                        <td><div className='flex justify-center'><ul>{data?.volume?.map((data) => {
                                            return <li className='mb-1 last:mb-0' key={data?.volume_cubic_yard}>{data?.volume_cubic_yard}</li>
                                        })}</ul></div></td>
                                        <td>
                                            <div className='btn-group'>
                                                <EditBtnPopup data={data} setData={setEquipmentObj} onClick={() => onEditEquipment()} />
                                                <DeleteBtn data={data} setObj={setEquipmentObj} customClick={onDeleteEquipment} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {(data?.getEquipmentsWithPagination?.data?.count === 0 ||
                        data?.getEquipmentsWithPagination?.data === null) && (
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
                            onChange={(e) => onPageDrpSelectEquipment(e.target.value)}
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
                                    <p className='text-lg font-bold md:text-xl text-baseColor'>{formik?.values?.type === Events.edit ?'Edit Equipment': 'Add New Equipment'}</p>
                                    <Button onClick={() => onClose()} label={t('')} title={`${t('Close')}`}>
                                        <span className='text-xl-22'><Cross className='text-error' /></span>
                                    </Button>
                                </div>
                                {/* <!-- Modal body --> */}
                                <div className='w-full'>
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className='p-5 max-h-[calc(100vh-260px)] overflow-auto grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-2'>
                                                <TextInput
                                                    type='text'
                                                    id='equipmentName'
                                                    name='equipmentData.name'
                                                    label={t('Equipment Title')}
                                                    value={formik.values.equipmentData.name}
                                                    placeholder={t('Equipment Title')}
                                                    onChange={formik.handleChange}
                                                    required={true}
                                                    onBlur={OnBlurEquip}
                                                    error={formik?.errors?.equipmentData?.name && formik?.touched?.equipmentData?.name && formik?.errors?.equipmentData?.name}
                                                />
                                            </div>
                                            {getEquipmentbyNameLoadingState&&<div className='relative col-span-2 flex justify-center'><Loader/></div>}
                                            {!getEquipmentbyNameLoadingState&&formik?.values?.equipmentData?.volumeId?.map((data: {
                                                uuid: string; equipmentId: string;
                                            }, index: number) => {
                                                const key = index;
                                                return (
                                                    <div className='flex gap-4 col-span-2' key={data?.uuid+key}>
                                                        <div className='max-sm:mb-3  sm:w-[calc(50%-10px)] col-span-1'>
                                                            <DropDown
                                                                placeholder={t('Select Volume')}
                                                                name={`equipmentData.volumeId.[${index}].uuid`}
                                                                onChange={formik.handleChange}
                                                                value={formik?.values?.equipmentData?.volumeId?.[index]?.uuid}
                                                                options={volumesDrpData}
                                                                id='volume_id'
                                                                label={t('Volume')}
                                                                required={true}
                                                                error={(equipmentErrors?.[index]?.uuid && equipmentTounched?.volumeId?.[index]?.uuid) ? equipmentErrors?.[index]?.uuid : ''}
                                                            />

                                                        </div>
                                                        <div className='max-sm:mb-3  sm:w-[calc(50%-10px)] col-span-1'>
                                                            <TextInput
                                                                type='text'
                                                                id='volumeCubicYard'
                                                                label={t('Add Volume (Cubic Yard)')}
                                                                value={equipmentDetails?.volumeData[formik?.values?.equipmentData?.volumeId?.[index]?.uuid]}
                                                                placeholder={t('Volume (Cubic Yard)')}
                                                                onChange={formik.handleChange}
                                                                required={true}
                                                                disabled={true}
                                                            />
                                                        </div>
                                                        <div className='flex mt-3 sm:mt-5 lg:mt-6' >
                                                            <button type="button" className='btn bg-transparent cursor-pointer btn-default' onClick={() => onDeleteEquipmentDetails(index)} disabled={formik?.values?.equipmentData?.volumeId?.length === 1} ><Trash className='fill-error' /></button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div className='col-span-2'>
                                                <button
                                                    className={'btn btn-primary btn-normal w-full md:w-auto min-w-[160px]'}
                                                    type='button'
                                                    onClick={handleAddNewEquipment}
                                                >{t('Add New Volume')}</button>
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                            <Button className={'btn-primary btn-normal w-full md:w-auto min-w-[160px]'} type='submit'
                                                label={formik?.values?.type === Events.edit?t('Update'):t('Create')}
                                                disabled={createEquipmentLoadingState}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >}
                {isEditPopupOpen && (
                    <CommonModel
                        warningText={EDIT_WARNING_TEXT}
                        onClose={onClose}
                        action={editEquipmentData}
                        show={isEditPopupOpen}
                        disabled={editEquipmentLoadingState}
                    />
                )}
                {
                    (isDeletePopupOpen) && (
                        <CommonModel
                            warningText={DELETE_WARNING_TEXT}
                            onClose={onClose}
                            action={deleteEquipmentData}
                            show={isDeletePopupOpen}
                            disabled={deleteEquipmentLoadingState}
                        />
                    )
                }
            </div >
        </>);
}

export default EquipmentManagement;