import React, { useCallback, useEffect, useState } from 'react';
import DropDown from '@components/dropdown/dropDown';
import UpdatedHeader from '@components/header/updatedHeader';
import { ArrowSortingDown, ArrowSortingUp, Cross, GetDefaultIcon, Map, Settings } from '@components/icons/icons';
import { FormikErrors, FormikTouched, useFormik } from 'formik';
import { DropdownOptionType } from '@types';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { DELETE_WARNING_TEXT, PAGE_LIMIT, PAGE_NUMBER, ROUTES, SHOW_PAGE_COUNT_ARR, USER_TYPE, serviceTypeDrpDataTemplate } from '@config/constant';
import DeleteBtn from '@components/common/deleteBtn';
import Pagination from '@components/Pagination/Pagination';
import filterServiceProps from '@components/filter/filter';
import { GET_ALL_LOCATIONS } from '@framework/graphql/queries/location';
import { useMutation, useQuery } from '@apollo/client';
import { GET_DIVERSION_REPORT_TEMPLATE_WITH_PAGINATION } from '@framework/graphql/queries/diversionReportTemplate';
import { GET_MATERIALS, GET_MATERIAL_BY_ID } from '@framework/graphql/queries/materialManagement';
import { GET_EQUIPMENTS } from '@framework/graphql/queries/equipmentManagement';
import { toast } from 'react-toastify';
import { MaterialDataRes } from '@views/materialManagament';
import { useDispatch, useSelector } from 'react-redux';
import { setVolumeDataForDiversionReport } from 'src/redux/equipment-slice';
import useValidation from '@framework/hooks/validations';
import { CREATE_DIVERSION_REPORT_TEMPLATE, DELETE_DIVERSION_REPORT_TEMPLATE, GET_DIVERSION_REPORT_TRMPLATE_BY_ID, UPDATE_DIVERSION_REPORT_TEMPLATE } from '@framework/graphql/mutations/diversionReportTemplate';
import CommonModel from '@components/common/commonModel';
import EditBtnPopup from '@components/common/EditButtonPopup';
import { DiversionReportTemplateSliceType, setDiversionTemplateData, setPopupType } from 'src/redux/diversion-report-template-slice';
import { ColArrType, DiversionReportTemplateData, DiversionReportTemplateGetByIdRes, DiversionReportTemplateRes, GetAllLocations, InitialValues } from 'src/types/diversionReporttemplate';
import { UserProfileType } from 'src/types/common';
import { Link } from 'react-router-dom';
import { GET_EQUIPMENT_BY_NAME } from '@framework/graphql/mutations/equipmentManagement';
import { VolumesDataRes } from '@views/volumeManagement';


export enum diversionReportEnum {
    Update = 'Update',
    Create = 'Create',

}

export const DiversionReportPopUpcontent: { [key: string]: string } = {
    'Update': 'Update Service',
    'Create': 'Add New Service'
}


const DiversionReportList = () => {
    const { t } = useTranslation();
    const [diversionReportObj, setDiversionReportObj] = useState<DiversionReportTemplateRes>();
    const [isDeleteDiversionReport, setIsDeleteDiversionReport] = useState<boolean>(false)
    const [branchDrpData, setBranchDrpData] = useState<DropdownOptionType[]>([]);
    const [materialDrpData, setMaterialDrpData] = useState<DropdownOptionType[]>([]);
    const [materialTypeDrpData, setMaterialTypeDrpData] = useState<DropdownOptionType[]>([{ name: 'Select Material Type', key: '' }]);
    const [equipmentDrpData, setEquipmentDrpData] = useState<DropdownOptionType[]>([]);
    const [volumeDrpData, setVolumeDrpData] = useState<DropdownOptionType[]>([{ name: 'Select Volume Type', key: '' }]);
    const { userProfileData: userData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const [deleteDiversionReport, { loading: deleteDiversionReportLoadingState }] = useMutation(DELETE_DIVERSION_REPORT_TEMPLATE);
    const [createDiversionReport, { loading: createDiversionReportLoadingState }] = useMutation(CREATE_DIVERSION_REPORT_TEMPLATE);
    const [updateDiversionReport, { loading: updateDiversonReportTemplateLoadingState }] = useMutation(UPDATE_DIVERSION_REPORT_TEMPLATE);
    const [getDiversionReportTemplateById] = useMutation(GET_DIVERSION_REPORT_TRMPLATE_BY_ID);
    const { data: getAllLocations, loading } = useQuery(GET_ALL_LOCATIONS, { fetchPolicy: 'network-only', skip: (userData?.getProfile?.data?.user_type === USER_TYPE.SUPER_ADMIN) });
    const { refetch: getMaterialTypes } = useQuery(GET_MATERIAL_BY_ID, { fetchPolicy: 'network-only', skip: true });
    const { refetch: getAllMaterials } = useQuery(GET_MATERIALS, { fetchPolicy: 'network-only', skip: true });
    const { refetch: getAllEquipments } = useQuery(GET_EQUIPMENTS, { fetchPolicy: 'network-only', skip: true });
    const [getEquipmentbyName] = useMutation(GET_EQUIPMENT_BY_NAME);
    const diversionReportTemplateDetails = useSelector(((state: { diversionReportTemplate: DiversionReportTemplateSliceType }) => state.diversionReportTemplate));
    const dispatch = useDispatch();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { diversionReportValidationSchema } = useValidation();

    const initialValues: InitialValues = {
        diversionReportTemplateData: {
            equipment_id: '',
            location_id: '',
            material_id: '',
            material_type_id: '',
            service_type: '',
            volume_id: '',
            equipment: '',
            volume_name: ''
        }
    }

    /**
     * method used to handle form and validations
     */
    const formik = useFormik({
        initialValues,
        validationSchema: diversionReportValidationSchema,
        onSubmit: (values) => {
            onSubmitUpdateDiversionReport(values);
        }
    });

    const [filterData, setFilterData] = useState({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortOrder: 'descend',
        search: '',
        sortField: 'createdAt',
        locationId: '',
        index: 0
    });

    /**
     * Method used set dropdown data for location
     */
    useEffect(() => {
        if (getAllLocations?.getLocations?.data && userData?.getProfile?.data?.user_type && userData?.getProfile?.data?.user_type === USER_TYPE.SUBSCRIBER_ADMIN) {
            setBranchDrpData(getAllLocations?.getLocations?.data?.map((data: GetAllLocations) => {
                return { name: data?.location, key: data?.uuid, uuid: data?.uuid }
            }));
            refetchDiversionReports({
                limit: PAGE_LIMIT,
                page: PAGE_NUMBER,
                sortOrder: 'descend',
                search: '',
                sortField: 'createdAt',
                locationId: getAllLocations?.getLocations?.data[0]?.uuid,
            }).then((res) => {

                dispatch(setDiversionTemplateData(res?.data?.getDiversionReportTemplateWithPagination?.data));
            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
            formik.setFieldValue('diversionReportTemplateData.location_id', getAllLocations?.getLocations?.data[0]?.uuid);

        }
        if (getAllLocations?.getLocations?.data && userData?.getProfile?.data?.user_type && userData?.getProfile?.data?.user_type === USER_TYPE.DIVERSION_ADMIN) {
            setBranchDrpData(getAllLocations?.getLocations?.data?.map((data: GetAllLocations) => {
                return { name: data?.location, key: data?.uuid, uuid: data?.uuid }
            }));
            refetchDiversionReports({
                limit: PAGE_LIMIT,
                page: PAGE_NUMBER,
                sortOrder: 'descend',
                search: '',
                sortField: 'createdAt',
                locationId: userData?.getProfile?.data?.branch_locations[0]?.uuid,
            }).then((res) => {

                dispatch(setDiversionTemplateData(res?.data?.getDiversionReportTemplateWithPagination?.data));
            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
            formik.setFieldValue('diversionReportTemplateData.location_id', userData?.getProfile?.data?.branch_locations[0]?.uuid);

        }
    }, [getAllLocations?.getLocations, userData]);

    const { refetch: refetchDiversionReports } = useQuery(GET_DIVERSION_REPORT_TEMPLATE_WITH_PAGINATION, {
        fetchPolicy: 'network-only', skip: true,
    });
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
    const totalService = diversionReportTemplateDetails?.diversionTemplateData?.count ?? 0;
    const totalPages = Math.ceil(totalService / recordsPerPage);

    /**
     * Method used to change the page 
     */
    const handlePageChange = useCallback((newPage: number): void => {
        const updatedFilterData = {
            ...filterData,
            page: newPage,
            index: (newPage - 1) * filterData.limit,
        };
        setFilterData(updatedFilterData);
        refetchDiversionReports({
            limit: filterData?.limit,
            page: newPage,
            sortOrder: filterData?.sortOrder,
            sortField: filterData?.sortField,
            locationId: filterData?.locationId,
        }).then((res) => {
            dispatch(setDiversionTemplateData(res?.data?.getDiversionReportTemplateWithPagination?.data));
        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
        filterServiceProps.saveState('filterDiversionReport', JSON.stringify(updatedFilterData));
    }, [filterData.limit]);


    /**
     * Method sets records per page in filter data when ever it changes
     */
    useEffect(() => {
        setRecordsPerPage(filterData.limit);
    }, [filterData.limit]);

    const COL_ARR_SERVICE = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Service Type'), sortable: true, fieldName: 'service_type' },
        { name: t('Material Category'), sortable: true, fieldName: 'material.name' },
        { name: t('Material Type'), sortable: true, fieldName: 'material_type.type' },
        { name: t('Equipment'), sortable: true, fieldName: 'equipment.name' },
        { name: t('Volume'), sortable: true, fieldName: 'volume.volume' },
    ] as ColArrType[];

    /**
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortDiversionReport = (sortFieldName: string) => {
        setFilterData({
            ...filterData,
            sortField: sortFieldName,
            sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
        });
        refetchDiversionReports({
            limit: filterData?.limit,
            page: filterData?.page,
            sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
            sortField: sortFieldName,
            locationId: filterData?.locationId,
        }).then((res) => {
            dispatch(setDiversionTemplateData(res?.data?.getDiversionReportTemplateWithPagination?.data));
        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
    };

    /**
    * @param e Method used for change dropdown for page limit
    */
    const onPageDrpSelectCategory = (e: string) => {
        setRecordsPerPage(Number(e))
        const updatedFilterData = {
            ...filterData,
            limit: parseInt(e),
            page: 1,
            search: '',
            index: 0,
        };

        refetchDiversionReports({
            limit: parseInt(e),
            page: 1,
            sortOrder: filterData.sortOrder,
            sortField: filterData?.sortField,
            locationId: filterData?.locationId,
        }).then((res) => {
            dispatch(setDiversionTemplateData(res?.data?.getDiversionReportTemplateWithPagination?.data));
        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));

        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterDiversionReport', JSON.stringify(updatedFilterData));
    };

    /**
     * Method used to reset form and close Add new service model
     */
    const onClose = useCallback(() => {
        const LocationId = formik.values?.diversionReportTemplateData?.location_id;
        formik.resetForm();
        formik.setFieldValue('diversionReportTemplateData.location_id', LocationId);
        setIsPopupOpen(false);
        setIsDeleteDiversionReport(false);
    }, [formik?.values]);

    /**
     * Method used to set dropdown values while add and edit time
     */
    const setAddAndEditTimeDropdownValues = () => {
        getAllMaterials().then((res) => {
            setMaterialDrpData(res?.data?.getMaterials?.data?.map((data: MaterialDataRes) => {
                return { name: data?.name, key: data?.uuid, uuid: data?.uuid };
            }))
        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
        getAllEquipments().then((res) => {
            const volumeCubicData: { [key: string]: { [key: string]: string } } = {};
            const volumeDrpData = res?.data?.getEquipments?.data?.map((data: {
                uuid: string;
                name: string;
                volume: VolumesDataRes;
            }) => {
                volumeCubicData[`${data?.uuid}`] = { volume: data?.volume?.volume, uuid: data?.volume?.uuid };
                return { name: data?.volume, key: data?.uuid, uuid: data?.uuid, }
            });
            if (volumeDrpData) {
                dispatch(setVolumeDataForDiversionReport(volumeCubicData));
            }
            setEquipmentDrpData(res?.data?.getEquipments?.data?.map((data: {
                uuid: string;
                name: string;
                volume: VolumesDataRes;
            }) => {
                return { name: data?.name, key: data?.name };
            }))
        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message))
        setIsPopupOpen(true);
    }

    /**
     * Method used to update the diversion report 
     */
    const onEditDiversionReport = useCallback((data: DiversionReportTemplateRes) => {
        setDiversionReportObj(data);
        dispatch(setPopupType(diversionReportEnum?.Update));
        setAddAndEditTimeDropdownValues();
        getEquipmentbyName({ variables: { equipmentName: data?.equipment?.name } }).then((res) => {
            const volumeData = res?.data?.getEquipmentByName?.data?.map((data: {
                uuid: string;
                name: string;
                volume: VolumesDataRes;
            }) => {
                return { name: data?.volume?.volume, key: `${data?.volume?.uuid}_${data?.uuid}` }
            });
            if (volumeData) {
                setVolumeDrpData([{ name: 'Select Volume Type', key: '' }, ...volumeData]);
            }

        })
            .catch((err) => toast.error(err.networkError.result.errors[0].message));
        getDiversionReportTemplateById({ variables: { templateId: data?.uuid } }).then((res) => {
            const data = res?.data?.getDiversionTemplateById?.data as DiversionReportTemplateGetByIdRes;
            formik.setValues({
                diversionReportTemplateData: {
                    equipment_id: data?.equipment?.uuid,
                    location_id: data?.location?.uuid,
                    material_id: data?.material?.uuid,
                    material_type_id: data?.material_type?.uuid,
                    service_type: data?.service_type,
                    volume_id: data?.volume?.uuid,
                    equipment: data?.equipment?.name,
                    volume_name: `${data?.volume?.uuid}_${data?.equipment?.uuid}`
                }
            })
        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
        getMaterialTypes({
            materialId: data?.material?.uuid
        }).then((res) => {
            const data = res?.data?.getMaterialById?.data?.material_types?.map((data: {
                uuid: string;
                type: string;
                weight: number;
            }) => { return { name: data?.type, key: data?.uuid, uuid: data?.uuid }; })
            if (data) {
                setMaterialTypeDrpData([{ name: 'Select Material Type' }, ...data])
            }
        }).catch((err) => toast.error(err));
    }, []);

    /**
     * Method used to delete diversion report template
     */
    const deleteDiversionReportData = useCallback(() => {
        deleteDiversionReport({ variables: { diversionReportTemplateId: diversionReportObj?.uuid } }).then((res) => {
            toast.success(res?.data?.deleteDiversionReportTemplate?.message);
            setIsDeleteDiversionReport(false);
            refetchDiversionReports({
                limit: filterData?.limit,
                page: filterData?.page,
                sortOrder: filterData?.sortOrder,
                search: filterData?.search,
                sortField: filterData?.sortField,
                locationId: filterData?.locationId,
            }).then((res) => {
                dispatch(setDiversionTemplateData(res?.data?.getDiversionReportTemplateWithPagination?.data));
            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message))
    }, [diversionReportObj])


    /**
     * Method used to create or update diversion template
     * @param values form values after submit data
     * @param volumeId 
     */
    const onSubmitUpdateDiversionReport = (values: InitialValues) => {

        if (diversionReportTemplateDetails.popupType === diversionReportEnum?.Create) {
            createDiversionReport({
                variables: {
                    diversionReportTemplateData: {
                        equipment_id: values.diversionReportTemplateData.equipment_id,
                        material_id: values.diversionReportTemplateData.material_id,
                        material_type_id: values.diversionReportTemplateData.material_type_id,
                        service_type: values.diversionReportTemplateData.service_type,
                        volume_id: values.diversionReportTemplateData.volume_id,
                        location_id: values?.diversionReportTemplateData?.location_id,
                    }
                }
            }).then((res) => {
                toast.success(res?.data?.createDiversionReportTemplate?.message);
                refetchDiversionReports({
                    limit: filterData?.limit,
                    page: filterData?.page,
                    sortOrder: filterData?.sortOrder,
                    search: filterData?.search,
                    sortField: filterData?.sortField,
                    locationId: values?.diversionReportTemplateData?.location_id,
                }).then((res) => {
                    dispatch(setDiversionTemplateData(res?.data?.getDiversionReportTemplateWithPagination?.data));
                }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
                onClose();
            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));


        } else {
            updateDiversionReport({
                variables: {
                    diversionReportTemplateData: {
                        equipment_id: values.diversionReportTemplateData.equipment_id,
                        material_id: values.diversionReportTemplateData.material_id,
                        material_type_id: values.diversionReportTemplateData.material_type_id,
                        service_type: values.diversionReportTemplateData.service_type,
                        volume_id: values.diversionReportTemplateData.volume_id,
                        location_id: values?.diversionReportTemplateData?.location_id,
                        diversion_report_template_id: diversionReportObj?.uuid
                    }
                }
            }).then((res) => {
                toast.success(res?.data?.updateDiversionReportTemplate?.message);
                refetchDiversionReports({
                    limit: filterData?.limit,
                    page: filterData?.page,
                    sortOrder: filterData?.sortOrder,
                    search: filterData?.search,
                    sortField: filterData?.sortField,
                    locationId: filterData?.locationId,
                }).then((res) => {
                    dispatch(setDiversionTemplateData(res?.data?.getDiversionReportTemplateWithPagination?.data));
                }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
                onClose();
            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));

        }
    }

    /**
     * Method that provides the data to list view when location changes
     */
    useEffect(() => {
        if (formik?.values?.diversionReportTemplateData?.location_id !== '') {
            refetchDiversionReports({
                limit: filterData?.limit,
                page: filterData?.page,
                sortOrder: filterData?.sortOrder,
                search: filterData?.search,
                sortField: filterData?.sortField,
                locationId: formik?.values?.diversionReportTemplateData?.location_id,
            }).then((res) => {
                dispatch(setDiversionTemplateData(res?.data?.getDiversionReportTemplateWithPagination?.data));
            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
            setFilterData((prev) => {
                return {
                    ...prev,
                    locationId: formik?.values?.diversionReportTemplateData?.location_id
                }
            })
        }
    }, [formik?.values?.diversionReportTemplateData?.location_id]);

    /**
     * Method that provides header content
     * @returns React Element
     */
    const headerActionConst = () => {
        return (
            <>
                {
                    <div className={`flex w-full gap-3 xmd:gap-5 lg:w-auto ${loading ? 'pointer-events-none' : ''}`}>
                        <DropDown className='w-[212px] -mt-2 max-md:mr-2' label='' inputIcon={<Map fontSize='18' />} name='diversionReportTemplateData.location_id' onChange={(e) => {
                            formik?.setFieldValue('diversionReportTemplateData.location_id', e.target.value);
                        }} value={formik?.values?.diversionReportTemplateData?.location_id} error={formik?.errors?.diversionReportTemplateData?.location_id} options={branchDrpData} id='userLocation' disabled={userData?.getProfile?.data?.user_type !== USER_TYPE.SUBSCRIBER_ADMIN} />
                    </div>
                }
            </>
        )
    }

    /**
     * Method used to add new diversion report template
     */
    const onAddNewDiversionReport = useCallback(() => {
        dispatch(setPopupType(diversionReportEnum?.Create));
        if (formik?.values?.diversionReportTemplateData?.location_id !== '') {
            setAddAndEditTimeDropdownValues();
        } else if (userData?.getProfile?.data?.branch_locations[0]?.uuid != '') {
            setAddAndEditTimeDropdownValues();
        } else {
            toast.error('Please Select location');

        }
    }, [formik?.values?.diversionReportTemplateData?.location_id]);

    const onMaterialChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e?.target?.value) {
            formik.setFieldValue('diversionReportTemplateData.material_id', e?.target?.value);
            getMaterialTypes({
                materialId: e?.target?.value
            }).then((res) => {
                formik.setFieldValue('diversionReportTemplateData.material_type_id', '');
                const data = res?.data?.getMaterialById?.data?.material_types?.map((data: {
                    uuid: string;
                    type: string;
                    weight: number;
                }) => { return { name: data?.type, key: data?.uuid, uuid: data?.uuid }; })
                if (data) {
                    setMaterialTypeDrpData([{ name: 'Select Material Type' }, ...data])
                }
            }).catch((err) => toast.error(err))

        }
    }, []);

    const onChangeEquipment = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e?.target?.value) {
            formik.setFieldValue('diversionReportTemplateData.equipment', e?.target?.value);
            getEquipmentbyName({ variables: { equipmentName: e?.target?.value } }).then((res) => {
                const volumeData = res?.data?.getEquipmentByName?.data?.map((data: {
                    uuid: string;
                    name: string;
                    volume: VolumesDataRes;
                }) => {
                    return { name: data?.volume?.volume, key: `${data?.volume?.uuid}_${data?.uuid}` }
                });
                if (volumeData) {
                    setVolumeDrpData([{ name: 'Select Volume Type', key: '' }, ...volumeData]);
                }
            }).catch((err) => toast.error(err.networkError.result.errors[0].message))
        }

    }, []);

    const onChangeVolume = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e?.target?.value) {
            const value = e?.target?.value.split('_');
            formik.setFieldValue('diversionReportTemplateData.volume_name', e?.target?.value);
            formik.setFieldValue('diversionReportTemplateData.volume_id', value[0]);
            formik.setFieldValue('diversionReportTemplateData.equipment_id', value[1]);
        }
    }, []);


    const diversionReportErrors = formik?.errors?.diversionReportTemplateData as FormikErrors<DiversionReportTemplateData>;
    const diversionReportTounched = formik?.touched?.diversionReportTemplateData as FormikTouched<DiversionReportTemplateData>;

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            <div className='mb-3 bg-white rounded-xl overflow-auto border border-[#c8ced3] mx-7 p-3 md:p-5'>
                <div className='flex flex-col justify-between gap-3 mb-3 sm:gap-5 md:mb-5 btn-group sm:flex-row'>
                    <h6 className='w-full leading-7 xmd:w-auto'>{t('Service List')}</h6>
                    <div className='flex items-center gap-3'>
                        <Link className='btn btn-secondary btn-normal md:max-w-[3.125rem] !px-2.5 md:!px-4' to={`/${ROUTES.app}/${ROUTES.diversionSettings}/?locationId=${formik?.values?.diversionReportTemplateData?.location_id}`} >
                            <span className='w-5 h-5'>
                                <Settings fontSize='20' className='w-5 h-5' />
                            </span>
                        </Link>
                        <Button
                            className='btn-normal btn btn-secondary whitespace-nowrap'
                            type='button'
                            label={t('+ Add New Service')}
                            onClick={onAddNewDiversionReport}
                        />
                    </div>
                </div>
                <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                    <table>
                        <thead >
                            <tr>
                                {COL_ARR_SERVICE?.map((colValUser: ColArrType) => {
                                    return (
                                        <th scope='col' key={colValUser.name}>
                                            <div className={`flex items-center ${colValUser.name == 'Status' ? 'justify-center' : ''}`}>
                                                {colValUser.name}
                                                {colValUser.sortable && (
                                                    <button onClick={() => onHandleSortDiversionReport(colValUser.fieldName)}>
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

                                <th scope='col'>
                                    <div className='flex items-center'>{t('Action')}</div>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {diversionReportTemplateDetails?.diversionTemplateData?.diversionReport?.map((data: DiversionReportTemplateRes, index: number) => {
                                const displayIndex = filterData?.index + index + 1;
                                return (<tr key={data?.uuid}>
                                    <td className='text-left'>{displayIndex}</td>
                                    <td className='text-left'>{data?.service_type}</td>
                                    <td className='text-left'>{data?.material?.name}</td>
                                    <td className='text-left'>{data?.material_type?.type}</td>
                                    <td className='text-left'>{data?.equipment?.name}</td>
                                    <td className='text-left'>{data?.volume?.volume}</td>
                                    <td className='text-left'>
                                        <div className='btn-group'>
                                            <EditBtnPopup data={data} setData={setDiversionReportObj} onClick={() => onEditDiversionReport(data)} />
                                            <DeleteBtn data={data} setObj={setDiversionReportObj} setIsDelete={setIsDeleteDiversionReport} />
                                        </div>
                                    </td>
                                </tr>);
                            })}

                        </tbody>
                    </table>
                    {(diversionReportTemplateDetails?.diversionTemplateData?.count === 0 ||
                        diversionReportTemplateDetails?.diversionTemplateData?.count === null) && (
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
                        <select value={filterData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white' onChange={(e) => onPageDrpSelectCategory(e.target.value)} >
                            {SHOW_PAGE_COUNT_ARR?.map((item: number) => {
                                return <option key={item}>{item}</option>;
                            })}
                        </select>
                    </div>
                    <Pagination currentPage={filterData.page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        recordsPerPage={recordsPerPage}
                    />
                </div>

                {isPopupOpen && <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${isPopupOpen ? '' : 'hidden'}`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className="flex items-center justify-center h-full py-5 transition-all duration-300">
                        <div className='w-full mx-5 sm:max-w-[780px]'>
                            {/* <!-- Modal content --> */}
                            <div className='relative bg-white rounded-xl'>
                                {/* <!-- Modal header --> */}
                                <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                                    <p className='text-lg font-bold md:text-xl text-baseColor'>{t(DiversionReportPopUpcontent[diversionReportTemplateDetails?.popupType])}</p>
                                    <Button onClick={() => onClose()} label={t('')}>
                                        <span className='text-xl-22'><Cross className='text-error' /></span>
                                    </Button>
                                </div>
                                {/* <!-- Modal body --> */}
                                <div className='w-full'>
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className='p-5 max-h-[calc(100vh-260px)] overflow-auto grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    placeholder={t('Select Service Type')}
                                                    name='diversionReportTemplateData.service_type'
                                                    onChange={formik.handleChange}
                                                    id='service_id'
                                                    label={t('Service Type')}
                                                    required={true}
                                                    options={serviceTypeDrpDataTemplate}
                                                    value={formik?.values?.diversionReportTemplateData?.service_type}
                                                    error={(diversionReportErrors?.service_type && diversionReportTounched?.service_type) ? diversionReportErrors?.service_type : ''}
                                                />
                                            </div>

                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    placeholder={t('Select Material Category')}
                                                    name='diversionReportTemplateData.material_id'
                                                    onChange={onMaterialChange}
                                                    id='material_id'
                                                    label={t('Material Category')}
                                                    required={true}
                                                    options={materialDrpData}
                                                    value={formik?.values?.diversionReportTemplateData?.material_id}
                                                    error={(diversionReportErrors?.material_id && diversionReportTounched?.material_id) ? diversionReportErrors?.material_id : ''}
                                                />
                                            </div>

                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    // placeholder={t('Select Material Type')}
                                                    name='diversionReportTemplateData.material_type_id'
                                                    onChange={formik.handleChange}
                                                    id='material_type_id'
                                                    label={t('Material Type')}
                                                    required={true}
                                                    options={materialTypeDrpData}
                                                    value={formik?.values?.diversionReportTemplateData?.material_type_id}
                                                    error={(diversionReportErrors?.material_type_id && diversionReportTounched?.material_type_id) ? diversionReportErrors?.material_type_id : ''}
                                                />
                                            </div>

                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    placeholder={t('Select Equipment')}
                                                    name='diversionReportTemplateData.equipment'
                                                    onChange={onChangeEquipment}
                                                    id='equipment'
                                                    label={t('Equipment')}
                                                    required={true}
                                                    options={equipmentDrpData}
                                                    value={formik?.values?.diversionReportTemplateData?.equipment}
                                                    error={(diversionReportErrors?.equipment && diversionReportTounched?.equipment) ? diversionReportErrors?.equipment : ''}
                                                />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    name='diversionReportTemplateData.volume_name'
                                                    onChange={onChangeVolume}
                                                    id='volume'
                                                    label={t('Volume')}
                                                    required={true}
                                                    options={volumeDrpData}
                                                    value={formik?.values?.diversionReportTemplateData?.volume_name}
                                                    error={(diversionReportErrors?.volume_name && diversionReportTounched?.volume_name) ? diversionReportErrors?.volume_name : ''}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                            {<Button className={'btn-primary btn-normal w-full md:w-auto min-w-[160px]'} type='submit' label={t(diversionReportTemplateDetails?.popupType)} disabled={createDiversionReportLoadingState || updateDiversonReportTemplateLoadingState} />}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                {isDeleteDiversionReport && (
                    <CommonModel
                        warningText={DELETE_WARNING_TEXT}
                        onClose={onClose}
                        action={deleteDiversionReportData}
                        show={isDeleteDiversionReport}
                        disabled={deleteDiversionReportLoadingState} />
                )}
            </div>
        </>
    );
}

export default DiversionReportList;
