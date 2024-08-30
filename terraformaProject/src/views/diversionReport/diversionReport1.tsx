import React, { useCallback, useEffect, useState } from 'react';
import UpdatedHeader from '@components/header/updatedHeader';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import DropDown from '@components/dropdown/dropDown';
import { DELETE_WARNING_TEXT, USER_TYPE, allServiceTypes, getSignUrl, serviceTypeDrpDataHistory } from '@config/constant';
import { Check, Cross, PlusCircle, Trash } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import DeleteBtn from '@components/common/deleteBtn';
import { FormikErrors, FormikTouched, useFormik } from 'formik';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CONTRACTOR_COMPANY_LIST, GET_DIVERSION_HISTORY_BY_HISTORY_ID, GET_DIVERSION_HISTORY_BY_ID } from '@framework/graphql/queries/diversionReportHistoryList';
import useValidation from '@framework/hooks/validations';
import { CREATE_OR_UPDATE_WEIGHTS } from '@framework/graphql/mutations/weights';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileType } from 'src/types/common';
import moment from 'moment';
import { conditionReturnFun, getDateFromTimestamp } from '@utils/helpers';
import { toast } from 'react-toastify';
import { DropdownOptionType } from '@types';
import { GET_MATERIALS, GET_MATERIAL_BY_ID } from '@framework/graphql/queries/materialManagement';
import { GET_EQUIPMENTS } from '@framework/graphql/queries/equipmentManagement';
import { GET_FREQUENCIES } from '@framework/graphql/queries/frequencyManagement';
import { GET_ZONES_BY_ID } from '@framework/graphql/mutations/zoneManagement';
import { MaterialDataRes } from '@views/materialManagament';
import { FrequencyDataRes } from '@views/frequencyManagement';
import { AddWeightType, setCompactorUuid, setFrequencyData, setMaterailData, setVolumeDataForWeights } from 'src/redux/addWeights-slice';
import { DiversionReportContractorRes } from 'src/types/weights';
import EditBtnPopup from '@components/common/EditButtonPopup';
import { DELETE_DIVERSION_REPORT } from '@framework/graphql/mutations/diversionReportHistoryList';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CommonModel from '@components/common/commonModel';
import Loader from '@components/common/loader';
import { GET_EQUIPMENT_BY_NAME } from '@framework/graphql/mutations/equipmentManagement';
import { VolumesDataRes } from '@views/volumeManagement';
import { AddNewOneOffsDiversionReport1, ColArrType, DiversionHistoryRes, DiversionReport1FormikTypes } from 'src/types/diversionReport';

const DiversionReport1 = () => {
    const { userProfileData: userData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const weightDetails = useSelector(((state: { addWeightsManagement: AddWeightType }) => state.addWeightsManagement));
    const [searchParams] = useSearchParams();
    const historyId = searchParams.get('historyId');
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [isAddNewOneOffs, setIsAddNewOneOffs] = useState<boolean>(false)
    const [diversionReportHistoryObj, setDiversionReportHistoryObj] = useState<DiversionReportContractorRes>();
    const [isAddOneOffs, setIsAddOneOffs] = useState<boolean>(false);
    const [materialDrpData, setMaterialDrpData] = useState<DropdownOptionType[]>([{ name: 'Select Material Catergory', key: '' }]);
    const [frequencyDrpData, setFrequencyDrpData] = useState<DropdownOptionType[]>([{ name: 'Select Frequency', key: '' }]);
    const [materialTypeDrpData, setMaterialTypeDrpData] = useState<DropdownOptionType[]>([{ name: 'Select Material Type' }]);
    const [equipmentDrpData, setEquipmentDrpData] = useState<DropdownOptionType[]>([{ name: 'Select Equipment', key: '' }]);
    const [zoneDrpDown, setZoneDrpDown] = useState<DropdownOptionType[]>([{ name: 'Select Zone', key: '' }]);
    const [contractorDropdownData, setContractorDropdownData] = useState<DropdownOptionType[]>([{ name: 'Select Contractor', key: '' }]);
    const [volumeDrpData, setVolumeDrpData] = useState<DropdownOptionType[]>([{ name: 'Select Volume Type', key: '' }]);
    const [isShowlifts, setIsShowlifts] = useState<boolean>(false);
    const { data, refetch: refetchHistoryReports, loading: historyLoader } = useQuery(GET_DIVERSION_HISTORY_BY_HISTORY_ID, { fetchPolicy: 'network-only', skip: !historyId, variables: { historyId: historyId } });
    const { data: historyData } = useQuery(GET_DIVERSION_HISTORY_BY_ID, { fetchPolicy: 'network-only', skip: !historyId, variables: { 'historyId': historyId } })
    const [createorUpdateWeights, { loading: createLoader }] = useMutation(CREATE_OR_UPDATE_WEIGHTS);
    const [zones] = useMutation(GET_ZONES_BY_ID);
    const [deleteDiversionReport, { loading: deleteDerviceLoader }] = useMutation(DELETE_DIVERSION_REPORT);
    const { refetch: getMaterialTypes } = useQuery(GET_MATERIAL_BY_ID, { fetchPolicy: 'network-only', skip: true });
    const { refetch: getAllMaterials } = useQuery(GET_MATERIALS, { fetchPolicy: 'network-only', skip: true });
    const { refetch: getAllEquipments } = useQuery(GET_EQUIPMENTS, { fetchPolicy: 'network-only', skip: true });
    const { refetch: getAllFrequencies } = useQuery(GET_FREQUENCIES, { fetchPolicy: 'network-only', skip: true });
    const { refetch: getContractorsCompanies } = useQuery(GET_CONTRACTOR_COMPANY_LIST, { fetchPolicy: 'network-only', skip: true, variables: { companyType: 2, locationId: historyData?.getDiversionHistoryById?.data?.location?.uuid } });
    const [getEquipmentbyName] = useMutation(GET_EQUIPMENT_BY_NAME);


    const COL_ARR_SERVICE4 = [
        { name: t('Lifts'), sortable: false, fieldName: 'Lifts' },
        { name: t('Insert Date'), sortable: false, fieldName: 'Insert Date' },
        { name: t('Input Weight'), sortable: false, fieldName: 'Input Weight' },

    ] as ColArrType[];

    const COL_ARR_SERVICE3 = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Zone'), sortable: false },
        { name: t('Service Type'), sortable: false },
        { name: t('Material Category'), sortable: false, fieldName: 'Material Category' },
        { name: t('Material Type'), sortable: false, fieldName: 'Material Type' },
        { name: t('Equipment'), sortable: false, fieldName: 'Equipment' },
        { name: t('Volume'), sortable: false, fieldName: 'Volume' },
        { name: t('Add Unit'), sortable: false, fieldName: 'Add Unit' },
        { name: t('Frequency'), sortable: false, fieldName: 'Frequency' },
        { name: t('Lifts'), sortable: false, fieldName: 'Lifts' },
        { name: t('Approx Weight Per Unit'), sortable: false, fieldName: 'Approx Weight Per Unit' },
        { name: t('Weight Per Month'), sortable: false, fieldName: 'Weight Per Month' },

    ] as ColArrType[];

    const { historydiversionReport, historyNewdiversionReport } = useValidation();

    const AddWeightsInitialValues: {
        zone_id: string;
        service_type: string;
        material_id: string;
        material_type_id: string;
        equipment_id: string;
        volume_id: string;
        equipment: string;
        frequency_id: string;
        add_units: number;
        lifts: number;
        volume: string;
        approx_weight_per_unit: number;
        approx_weight_per_month: number;
        company_id: string;
        report_id: string;
        user_id: string;
        compactor_lifts: { name: string, uuid: string, weight: number, date?: Date | null }[],
        delete_lifts: string[],
        document: string;
        invocie?: string;
        volume_name?: string;
    } = {
        zone_id: '',
        service_type: '',
        material_id: '',
        material_type_id: '',
        equipment_id: '',
        volume_id: '',
        equipment: '',
        frequency_id: '',
        add_units: 0,
        lifts: 0,
        volume: '',
        approx_weight_per_unit: 0,
        approx_weight_per_month: 0,
        company_id: '',
        report_id: '',
        user_id: '',
        compactor_lifts: [],
        delete_lifts: [],
        document: '',
        invocie: '',
        volume_name: '',
    }
    const formikAddWeights = useFormik({
        initialValues: AddWeightsInitialValues,
        validationSchema: historydiversionReport,
        onSubmit: (values) => {
            if (historyId) {
                createorUpdateWeights({
                    variables: {
                        isSubmitted: true,
                        reportData: [{
                            zone_id: (values?.zone_id === 'full_site' || !values?.zone_id) ? '' : values?.zone_id,
                            service_type: values?.service_type,
                            material_id: values?.material_id,
                            material_type_id: values?.material_type_id,
                            equipment_id: values?.equipment_id,
                            volume_id: values?.volume_id,
                            frequency_id: values?.frequency_id,
                            add_units: (+values?.add_units),
                            lifts: values?.compactor_lifts.length ? values?.compactor_lifts.length : +values?.lifts,
                            approx_weight_per_unit: +values?.approx_weight_per_unit,
                            approx_weight_per_month: +values?.approx_weight_per_month,
                            report_id: conditionReturnFun(values?.report_id),
                            user_id: values?.user_id,
                            compactor_lifts: values?.compactor_lifts?.map((data) => {
                                return { ...data, weight: +data.weight, date: data?.date }
                            }) ?? [],
                            delete_lifts: values?.delete_lifts ?? [],
                            company_id: values?.company_id,
                            document: conditionReturnFun(values?.document),
                            invoice: values?.invocie ?? '',
                            location_id: historyData?.getDiversionHistoryById?.data?.location?.uuid,
                            start_date: moment(getDateFromTimestamp(historyData?.getDiversionHistoryById?.data?.start_date)).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                            end_date: moment(getDateFromTimestamp(historyData?.getDiversionHistoryById?.data?.end_date)).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                            frequency_time: historyData?.getDiversionHistoryById?.data?.frequency,
                            diversion_history_id: [USER_TYPE.DIVERSION_ADMIN, USER_TYPE.SUBSCRIBER_ADMIN].includes(userData?.getProfile?.data?.user_type) ? historyId : ''
                        }],
                    }
                }).then((res) => {
                    toast.success(res?.data?.createDiversionReport?.message);
                    setIsAddOneOffs(false);
                    setIsShowlifts(false);
                    setDiversionReportHistoryObj(undefined);
                    refetchHistoryReports().catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
                    formikAddWeights.resetForm();
                }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message))
            }
        }
    });
    /** add one off's with contractor dropdown start */
    const AddNewOneOffsInitialValues : AddNewOneOffsDiversionReport1 = {
        company_id: '',
        zone_id: '',
        service_type: '',
        material_id: '',
        material_type_id: '',
        equipment_id: '',
        volume_id: '',
        equipment: '',
        frequency_id: '',
        add_units: 0,
        lifts: 0,
        volume: '',
        approx_weight_per_unit: 0,
        approx_weight_per_month: 0,
        volume_name: ''
    }

    const formik = useFormik({
        initialValues: AddNewOneOffsInitialValues,
        validationSchema: historyNewdiversionReport,
        onSubmit: (values) => {
            if (historyId) {
                createorUpdateWeights({
                    variables: {
                        isSubmitted: false,
                        reportData: [{
                            zone_id: (values?.zone_id === 'full_site' || !values?.zone_id) ? '' : values?.zone_id,
                            service_type: values?.service_type,
                            material_id: values?.material_id,
                            material_type_id: values?.material_type_id,
                            equipment_id: values?.equipment_id,
                            volume_id: values?.volume_id,
                            frequency_id: values?.frequency_id,
                            add_units: (+values?.add_units),
                            lifts: +values?.lifts,
                            approx_weight_per_unit: +values?.approx_weight_per_unit,
                            approx_weight_per_month: +values?.approx_weight_per_month,
                            report_id: '',
                            user_id: userData?.getProfile?.data?.uuid,
                            compactor_lifts: [],
                            delete_lifts: [],
                            company_id: values?.company_id,
                            document: '',
                            invoice: '',
                            location_id: historyData?.getDiversionHistoryById?.data?.location?.uuid,
                            start_date: moment(getDateFromTimestamp(historyData?.getDiversionHistoryById?.data?.start_date)).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                            end_date: moment(getDateFromTimestamp(historyData?.getDiversionHistoryById?.data?.end_date)).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                            frequency_time: historyData?.getDiversionHistoryById?.data?.frequency,
                            diversion_history_id: historyId
                        }],
                    }
                }).then((res) => {
                    toast.success(res?.data?.createDiversionReport?.message);
                    setIsAddNewOneOffs(false);
                    setDiversionReportHistoryObj(undefined);
                    refetchHistoryReports().catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
                    formik.resetForm();
                }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message))
            }
        }
    });

    /**  Method that sets dropdown data for add one off's start */
    const addOneOfDropDownApiCallingFunction = (siteId: string) => {
        zones({ variables: { siteId: siteId } }).then((res) => {
            const data = res?.data?.getZoneBySiteId?.data?.map((data: { uuid: string; location: string }) => {
                return { name: data?.location, key: data?.uuid }
            });
            if (data) {
                setZoneDrpDown([{ name: 'Select Zone', key: '' }, { name: 'Full Site', key: 'full_site' }, ...data])
            }
        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message))
        getAllMaterials().then((res) => {
            const data = res?.data?.getMaterials?.data?.map((data: MaterialDataRes) => {
                return { name: data?.name, key: data?.uuid, uuid: data?.uuid };
            })
            if (data) {
                setMaterialDrpData([{ name: 'Select Material Catergory', key: '' }, ...data])
            }
        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
        getAllEquipments().then((res) => {
            const volumeCubicData: { [key: string]: { volume: string; uuid: string; cubic: number, equipment: string } } = {};
            const volumeData = res?.data?.getEquipments?.data?.map((data: {
                uuid: string;
                name: string;
                volume: VolumesDataRes;
            }) => {
                volumeCubicData[`${data?.uuid}`] = { volume: data?.volume?.volume, uuid: data?.volume?.uuid, cubic: data?.volume?.volume_cubic_yard, equipment: data?.name };
                return { name: data?.volume, key: data?.uuid, uuid: data?.uuid }
            });
            const equipData = res?.data?.getEquipments?.data?.map((data: {
                uuid: string;
                name: string;
                volume: VolumesDataRes;
            }) => {
                if (data?.name.toLocaleLowerCase() === 'compactor') {
                    dispatch(setCompactorUuid(data?.uuid));
                }
                return { name: data?.name, key: data?.name };
            })
            if (volumeData) {
                dispatch(setVolumeDataForWeights(volumeCubicData));

            }
            if (equipData) {
                setEquipmentDrpData([{ name: 'Select Equipment', key: '' }, ...equipData])
            }

        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message))

        getAllFrequencies().then((res) => {
            const data = res?.data?.getFrequencies?.data?.map((data: FrequencyDataRes) => {
                return { name: data?.frequency_type, key: data?.uuid, code: data?.uuid };
            });
            if (data) {
                setFrequencyDrpData([{ name: 'Select Frequency', key: '' }, ...data]);
            }
            const frequencyData: { [key: string]: number } = {};
            const reqdata = res?.data?.getFrequencies?.data?.map((data: FrequencyDataRes) => {
                frequencyData[data?.uuid] = data?.frequency;
                return data;
            })
            if (reqdata) {
                dispatch(setFrequencyData(frequencyData));
            }

        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
    }
    /** Method that sets dropdown data for add one off's end */

    const onAddNewOneOffs = useCallback(() => {
        getContractorsCompanies().then((res) => {
            const data = res?.data?.getCompaniesByLocationId?.data?.map((data: { name: string, uuid: string }) => {
                return { name: data?.name, key: data?.uuid }
            });
            setContractorDropdownData([{ name: 'Select Contractor', key: '' }, ...data])
        }).catch(err => toast.error(err?.networkError?.result?.errors[0]?.message))
        if (historyData?.getDiversionHistoryById?.data?.location?.uuid) {
            addOneOfDropDownApiCallingFunction(historyData?.getDiversionHistoryById?.data?.location?.uuid);
        }
        setIsAddNewOneOffs(true);
    }, [historyData?.getDiversionHistoryById?.data?.location?.uuid])

    useEffect(() => {
        if (formik?.values?.material_id) {
            getMaterialTypes({
                materialId: formik?.values?.material_id
            }).then((res) => {
                formik.setFieldValue('material_type_id', '');
                formik.setFieldValue('approx_weight_per_unit', '');
                const data = res?.data?.getMaterialById?.data?.material_types?.map((data: {
                    uuid: string;
                    type: string;
                    weight: number;
                }) => { return { name: data?.type, key: data?.uuid, uuid: data?.uuid }; });
                if (data) {
                    setMaterialTypeDrpData([{ name: 'Select Material Type', key: '' }, ...data])
                }
                const materialData: { [key: string]: number } = {}
                const reqdata = res?.data?.getMaterialById?.data?.material_types.map((data: {
                    uuid: string;
                    type: string;
                    weight: number;
                }) => {
                    materialData[data?.uuid] = data?.weight;
                    return data;
                })
                if (reqdata) {
                    dispatch(setMaterailData(materialData));
                }

            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message))
        }
    }, [formik?.values?.material_id])

    useEffect(() => {
        if (formik?.values?.frequency_id && formik?.values?.add_units) {
            formik.setFieldValue('lifts', ((weightDetails.frequencyData[formik?.values?.frequency_id]) * formik?.values?.add_units).toFixed(2))
        }
    }, [formik?.values?.frequency_id, formik?.values?.add_units])


    useEffect(() => {
        if (formik?.values?.material_type_id && formik?.values?.volume_name) {
            formik.setFieldValue('approx_weight_per_unit', ((weightDetails.materialData[formik?.values?.material_type_id]) * +formik?.values?.volume_name?.split('_')?.[2]).toFixed(2))
        }
    }, [formik?.values?.material_type_id, formik?.values?.volume_name])

    useEffect(() => {
        if (formik?.values?.approx_weight_per_unit && formik?.values?.lifts) {
            formik.setFieldValue('approx_weight_per_month', (formik?.values?.approx_weight_per_unit * formik?.values?.lifts).toFixed(2))
        }
    }, [formik?.values?.approx_weight_per_unit, formik?.values?.lifts])

    /** add one off's with contractor dropdown end */

    const onAddOneOffs = useCallback((data: DiversionHistoryRes) => {
        if (historyData?.getDiversionHistoryById?.data?.location?.uuid) {
            addOneOfDropDownApiCallingFunction(historyData?.getDiversionHistoryById?.data?.location?.uuid);
        }
        formikAddWeights.setFieldValue('company_id', data?.contractor_company?.uuid);
        formikAddWeights.setFieldValue('user_id', data?.user?.uuid);
        setIsAddOneOffs(true);
    }, [historyData?.getDiversionHistoryById?.data?.location?.uuid])

    const onSinglePdfDownload = useCallback(async (fileName: string) => {
        const getSignUrlData = await getSignUrl(fileName);
        if (fileName) {
            window.open(getSignUrlData)
        } else {
            toast.error('No file is present to view')
        }
    }, []);

    const headerActionConst = () => {
        return (
            <>
                {
                    <div className={`flex w-full gap-3 xmd:gap-5 lg:w-auto ${historyLoader ? 'pointer-events-none' : ''}`}>
                        <div className='flex items-center gap-3 md:gap-5 flex-wrap'>
                            <p>
                                <span>Reporting Frequency : </span>
                                <span className='font-bold'>{historyData?.getDiversionHistoryById?.data?.frequency}</span>
                            </p>
                            <p>
                                <span>Start Date : </span>
                                <span className='font-bold'>{moment(getDateFromTimestamp(historyData?.getDiversionHistoryById?.data?.start_date)).format('DD/MM/YYYY')}
                                </span>
                            </p>
                            <p>
                                <span>Due Date : </span>
                                <span className='font-bold'>{moment(getDateFromTimestamp(historyData?.getDiversionHistoryById?.data?.end_date)).format('DD/MM/YYYY')}</span>
                            </p>
                            <Button
                                className='btn-normal btn btn-secondary whitespace-nowrap'
                                type='button'
                                label={t('+ Add New One Offs')}
                                title={`${t('Add New One Offs')}`}
                                onClick={onAddNewOneOffs}
                            />
                        </div>
                    </div>
                }
            </>
        )
    }

    const onEditDiversionReportHistory = useCallback((user_id: string, contractor_company: string, serviceData: DiversionReportContractorRes) => {
        getEquipmentbyName({ variables: { equipmentName: serviceData?.equipment?.name } }).then((res) => {
            const volumeData = res?.data?.getEquipmentByName?.data?.map((data: {
                uuid: string;
                name: string;
                volume: VolumesDataRes;
            }) => {
                return { name: data?.volume?.volume, key: `${data?.volume?.uuid}_${data?.uuid}_${data?.volume?.volume_cubic_yard}` }
            });
            if (volumeData) {
                setVolumeDrpData([{ name: 'Select Volume Type', key: '' }, ...volumeData]);
            }

        }).catch((err) => toast.error(err.networkError.result.errors[0].message));
        formikAddWeights.setValues({
            zone_id: serviceData?.zone?.uuid ?? 'full_site',
            service_type: serviceData?.service_type,
            material_id: serviceData?.material?.uuid,
            material_type_id: serviceData?.material_type?.uuid,
            equipment_id: serviceData?.equipment?.uuid,
            volume_id: serviceData?.volume?.uuid,
            equipment: serviceData?.equipment?.name,
            frequency_id: serviceData?.frequency?.uuid,
            add_units: serviceData?.add_units,
            lifts: serviceData?.lifts,
            volume: serviceData?.volume?.volume,
            approx_weight_per_unit: serviceData?.approx_weight_per_unit,
            approx_weight_per_month: serviceData?.approx_weight_per_month,
            company_id: contractor_company,
            user_id: user_id,
            report_id: serviceData?.uuid,
            compactor_lifts: serviceData?.lift?.map((data) => {
                return { name: data?.name, uuid: data?.uuid, weight: data?.weight, date: new Date(data?.date) }
            }),
            delete_lifts: [],
            invocie: serviceData?.invoice,
            document: serviceData?.document,
            volume_name:`${serviceData?.volume?.uuid}_${serviceData?.equipment?.uuid}_${serviceData?.volume?.volume_cubic_yard}`
        })

        if (historyData?.getDiversionHistoryById?.data?.location?.uuid) {
            addOneOfDropDownApiCallingFunction(historyData?.getDiversionHistoryById?.data?.location?.uuid);
        }

        setIsAddOneOffs(true)
    }, [formikAddWeights?.values, historyData?.getDiversionHistoryById?.data?.location?.uuid]);

    const onClose = useCallback(() => {
        setIsAddNewOneOffs(false);
        setIsAddOneOffs(false);
        setIsDeleteModel(false);
        setDiversionReportHistoryObj(undefined);
        formikAddWeights.resetForm();
        formik.resetForm();
    }, []);
    const onAddLifts = useCallback((user_id: string, contractor_company: string, serviceData: DiversionReportContractorRes) => {
        if (serviceData) {
            formikAddWeights.setValues({
                zone_id: serviceData?.zone?.uuid ?? 'full_site',
                service_type: serviceData?.service_type,
                material_id: serviceData?.material?.uuid,
                material_type_id: serviceData?.material_type?.uuid,
                equipment_id: serviceData?.equipment?.uuid,
                volume_id: serviceData?.volume?.uuid,
                equipment: serviceData?.equipment?.name,
                frequency_id: serviceData?.frequency?.uuid,
                add_units: serviceData?.add_units,
                lifts: serviceData?.lifts,
                volume: serviceData?.volume?.volume,
                approx_weight_per_unit: serviceData?.approx_weight_per_unit,
                approx_weight_per_month: serviceData?.approx_weight_per_month,
                company_id: contractor_company,
                user_id: user_id,
                report_id: serviceData?.uuid,
                compactor_lifts: serviceData?.lift?.map((data) => {
                    return { name: data?.name, uuid: data?.uuid, weight: data?.weight, date: new Date(data?.date) }
                }),
                delete_lifts: [],
                invocie: serviceData?.invoice,
                document: serviceData?.document,
                volume_name:`${serviceData?.volume?.uuid}_${serviceData?.equipment?.uuid}_${serviceData?.volume?.volume_cubic_yard}`
            })
            setIsShowlifts(true);
        }
    }, [])

    useEffect(() => {
        if (formikAddWeights?.values?.material_id) {
            getMaterialTypes({
                materialId: formikAddWeights?.values?.material_id
            }).then((res) => {

                const data = res?.data?.getMaterialById?.data?.material_types?.map((data: {
                    uuid: string;
                    type: string;
                    weight: number;
                }) => { return { name: data?.type, key: data?.uuid, uuid: data?.uuid }; })
                if (data) {
                    setMaterialTypeDrpData([{ name: 'Select Material Type' }, ...data])
                }
                const materialData: { [key: string]: number } = {}
                const reqdata = res?.data?.getMaterialById?.data?.material_types.map((data: {
                    uuid: string;
                    type: string;
                    weight: number;
                }) => {
                    materialData[data?.uuid] = data?.weight;
                    return data;
                })
                if (reqdata) {
                    dispatch(setMaterailData(materialData));
                }

            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message))
        }
    }, [formikAddWeights?.values?.material_id])

    const onMaterialChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e?.target?.value) {
            formikAddWeights.setFieldValue('material_id', e?.target?.value);
            getMaterialTypes({
                materialId: e?.target?.value
            }).then((res) => {
                formikAddWeights.setFieldValue('material_type_id', '');
                formikAddWeights.setFieldValue('approx_weight_per_unit', '');
                const data = res?.data?.getMaterialById?.data?.material_types?.map((data: {
                    uuid: string;
                    type: string;
                    weight: number;
                }) => { return { name: data?.type, key: data?.uuid, uuid: data?.uuid }; })
                if (data) {
                    setMaterialTypeDrpData([{ name: 'Select Material Type' }, ...data])
                }
                const materialData: { [key: string]: number } = {}
                const reqdata = res?.data?.getMaterialById?.data?.material_types.map((data: {
                    uuid: string;
                    type: string;
                    weight: number;
                }) => {
                    materialData[data?.uuid] = data?.weight;
                    return data;
                })
                if (reqdata) {
                    dispatch(setMaterailData(materialData));
                }

            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message))
        }
    }, [])

    const onUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = +(e?.target as HTMLInputElement)?.value;
        if (isAddOneOffs) {
            formikAddWeights.setFieldValue('add_units', target)
            formikAddWeights.setFieldValue('lifts', ((weightDetails.frequencyData[formikAddWeights?.values?.frequency_id]) * target).toFixed(2))
            formikAddWeights.setFieldValue('approx_weight_per_month', (formikAddWeights?.values?.approx_weight_per_unit * (weightDetails.frequencyData[formikAddWeights?.values?.frequency_id]) * target).toFixed(2))

        }
    };

    const onLiftsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = +(e?.target as HTMLInputElement)?.value;
        if (isAddOneOffs) {
            formikAddWeights.setFieldValue('lifts', target.toFixed(2))
            formikAddWeights.setFieldValue('approx_weight_per_month', (formikAddWeights?.values?.approx_weight_per_unit * target).toFixed(2))
        }
    };
    const onMaterialTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (isAddOneOffs) {
            formikAddWeights.setFieldValue('material_type_id', e?.target?.value);
            if (e?.target?.value && formikAddWeights?.values?.volume_name) {
                formikAddWeights.setFieldValue('approx_weight_per_unit', ((weightDetails.materialData[e?.target?.value]) * +formikAddWeights?.values?.volume_name?.split('_')?.[2]).toFixed(2))
            }
        }
    };

    const onEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (isAddOneOffs) {
            getEquipmentbyName({ variables: { equipmentName: e?.target?.value } }).then((res) => {
                const volumeData = res?.data?.getEquipmentByName?.data?.map((data: {
                    uuid: string;
                    name: string;
                    volume: VolumesDataRes;
                }) => {
                    return { name: data?.volume?.volume, key: `${data?.volume?.uuid}_${data?.uuid}_${data?.volume?.volume_cubic_yard}` }
                });
                if (volumeData) {
                    setVolumeDrpData([{ name: 'Select Volume Type', key: '' }, ...volumeData]);
                }

            })
                .catch((err) => toast.error(err.networkError.result.errors[0].message));
            formikAddWeights.setFieldValue('equipment', e?.target?.value);
        }
    };

    const onVolumeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e?.target?.value) {
            formikAddWeights.setFieldValue('volume_name', e?.target?.value);
            const value = e?.target?.value?.split('_');
            formikAddWeights.setFieldValue('volume_id', value[0]);
            formikAddWeights.setFieldValue('equipment_id', value[1]);
            if (formikAddWeights?.values?.material_type_id) {
                formikAddWeights.setFieldValue('approx_weight_per_unit', ((weightDetails.materialData[formikAddWeights?.values?.material_type_id]) * +value[2]).toFixed(2))
            }
        }
    }, [formikAddWeights?.values]);

    const onFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (isAddOneOffs) {
            formikAddWeights.setFieldValue('frequency_id', e?.target?.value);
            if (e?.target?.value && formikAddWeights?.values?.add_units) {
                formikAddWeights.setFieldValue('lifts', (weightDetails.frequencyData[e?.target?.value] * formikAddWeights?.values?.add_units).toFixed(2))
                formikAddWeights.setFieldValue('approx_weight_per_month', (formikAddWeights?.values?.approx_weight_per_unit * (weightDetails.frequencyData[e?.target?.value] * formikAddWeights?.values?.add_units)).toFixed(2))
            }
        }
    };
    const [isDeleteModel, setIsDeleteModel] = useState(false);
    const onDeleteService = useCallback(() => {
        setIsDeleteModel(true);

    }, []);

    const DeleteServieData = useCallback(() => {
        deleteDiversionReport({ variables: { reportId: [diversionReportHistoryObj?.uuid] } }).then((res) => {
            toast.success(res?.data?.deleteDiversionReport?.message);
            refetchHistoryReports().catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message))
            onClose()
        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message))

    }, [diversionReportHistoryObj])
    const addOneOffsErrors = formikAddWeights?.errors?.compactor_lifts as unknown as FormikErrors<{ name: string, uuid: string, weight: number, date: Date | null | undefined }[]>;
    const addOneOffsTouched = formikAddWeights?.touched?.compactor_lifts as unknown as FormikTouched<{ name: string, uuid: string, weight: number, date: Date | null | undefined }[]>;

    const onDelete = useCallback((index: number) => {
        const delete_lifts = formikAddWeights.values.delete_lifts ?? [];
        const deleteId: string[] = [];
        const data = formikAddWeights?.values?.compactor_lifts?.filter((data, ind) => {
            if (ind === index && data?.uuid) {
                deleteId.push(data?.uuid)
            }
            if (ind !== index) {
                return data;
            }
        });
        if (data) {
            formikAddWeights.setFieldValue('delete_lifts', [...delete_lifts, ...deleteId]);
            formikAddWeights.setFieldValue('compactor_lifts', data)
        }

    }, [formikAddWeights?.values?.delete_lifts, formikAddWeights?.values?.compactor_lifts]);

    const addNewLift = useCallback(() => {
        const updatedPopupData = [...formikAddWeights.values.compactor_lifts];
        const newPopupData = {
            name: `Lift-${formikAddWeights?.values?.compactor_lifts?.length + 1}`,
            uuid: '',
            date: new Date(),
            weight: 0,
        };
        updatedPopupData.push(newPopupData);
        formikAddWeights.setFieldValue('compactor_lifts', updatedPopupData);
    }, [formikAddWeights?.values?.compactor_lifts]);

    const onAddTotalLifts = useCallback(() => {
        const totalWeight = formikAddWeights.values.compactor_lifts.reduce((acc, data) => {
            const weight = +data.weight;
            return acc + weight;
        }, 0);
        if (totalWeight !== undefined) {
            formikAddWeights.setFieldValue('lifts', formikAddWeights.values.compactor_lifts.length);
            formikAddWeights.setFieldValue('approx_weight_per_month', totalWeight.toFixed(2));
        }
        formikAddWeights.handleSubmit();
    }, [formikAddWeights.values.compactor_lifts]);

    const onEquipmentChangeNew = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        getEquipmentbyName({ variables: { equipmentName: e?.target?.value } }).then((res) => {
            const volumeData = res?.data?.getEquipmentByName?.data?.map((data: {
                uuid: string;
                name: string;
                volume: VolumesDataRes;
            }) => {
                return { name: data?.volume?.volume, key: `${data?.volume?.uuid}_${data?.uuid}_${data?.volume?.volume_cubic_yard}` }
            });
            if (volumeData) {
                setVolumeDrpData([{ name: 'Select Volume Type', key: '' }, ...volumeData]);
            }

        })
            .catch((err) => toast.error(err.networkError.result.errors[0].message));
        formik.setFieldValue('equipment', e?.target?.value);
        
    }, [])

    const onVolumeChangeNew = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e?.target?.value) {
            formik.setFieldValue('volume_name', e?.target?.value);
            const value = e?.target?.value.split('_');
            formik.setFieldValue('volume_id', value[0]);
            formik.setFieldValue('equipment_id', value[1]);
            if(formik?.values?.material_type_id){
            formik.setFieldValue('approx_weight_per_unit', ((weightDetails.materialData[formik?.values?.material_type_id]) * +formik?.values?.volume_name?.split('_')?.[2]).toFixed(2))
            }
        }
    }, [formik?.values]);
    
    const errorReturnFunction = (fieldName: keyof DiversionReport1FormikTypes)=>{
        if(fieldName){
            return formikAddWeights?.errors?.[fieldName] && formikAddWeights?.touched?.[fieldName] ? formikAddWeights?.errors?.[fieldName] as string : '';
        }
    }
    const returnValueDiversionReport=(cond:boolean,suc:string|boolean|number,err:string|boolean|number)=>{
        return cond ? suc :err;
    }

    const getErrorNewOneOff = (fieldName: keyof AddNewOneOffsDiversionReport1 )=>{
        return formik?.errors?.[fieldName] && formik?.touched?.[fieldName] ? formik?.errors?.[fieldName] as string : '';
    }
    return (
        <>
            <UpdatedHeader headerTitle={conditionReturnFun(historyData?.getDiversionHistoryById?.data?.title )} headerActionConst={headerActionConst} />
            {historyLoader && <Loader />}
            <div>
                <div className='space-y-7'>
                    {data?.getDiversionReportsByHistoryId?.data?.map((data: DiversionHistoryRes, index: number) => {
                        return (<div key={data?.contractor_company?.uuid} className='w-full overflow-hidden bg-accents-2 border border-border-primary rounded-xl'>
                            <div className='px-3 py-5 border-b border-solid md:px-5 border-border-primary '>
                                <h6>{index + 1}.{data?.contractor_company?.name}</h6>
                            </div>
                            <div className='px-3 py-2.5 md:px-5' >
                                <div className='flex items-center flex-wrap justify-between w-full gap-3'>
                                    <p className='whitespace-nowrap'>
                                        <span>Report Owner: </span>
                                        <span className='font-bold'>{data?.user?.first_name}&nbsp;{data?.user?.last_name}</span>
                                    </p>
                                    <div className="flex flex-wrap gap-3 sm:gap-5 xmd:gap-7 flex-grow xs:flex-grow-0">
                                        <Button className='btn-secondary btn-normal whitespace-nowrap w-full xs:w-auto' label={''}
                                            title={`${t('Add One Offs')}`} onClick={() => onAddOneOffs(data)}>
                                            {t('+ Add One Offs')}
                                        </Button>
                                        <Button className='btn-secondary btn-normal whitespace-nowrap w-full xs:w-auto' label={''}
                                            title={`${t('View Invoice')}`} onClick={() => onSinglePdfDownload(data?.invoice)} >
                                            {t('View Invoice')}
                                        </Button>
                                        <Button className='btn-secondary btn-normal whitespace-nowrap w-full xs:w-auto' label={''}
                                            title={`${t('View Attachment')}`} onClick={() => onSinglePdfDownload(data?.document)}>
                                            {t('View Attachment')}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className='px-3 py-2.5 md:px-5' >
                                <h6 className='mb-3 md:mb-5'>Service List</h6>

                                <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                                    <table>
                                        <thead >
                                            <tr>
                                                {COL_ARR_SERVICE3?.map((colValUser: ColArrType, index: number) => {
                                                    const key = colValUser.fieldName + index + 1;
                                                    return (
                                                        <th scope='col'key={key}>
                                                            <div className={`flex items-center ${colValUser.name == 'Status' ? 'justify-center' : ''}`}>
                                                                {colValUser.name}

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
                                            {data?.services?.map((serviceData, ind: number) => {
                                                return (<tr key={serviceData?.uuid}>
                                                    <td className='text-left whitespace-nowrap'>{ind + 1}</td>
                                                    <td className='text-left'>{serviceData.is_full_site ? 'Full Site' : serviceData?.zone?.location}</td>
                                                    <td className='text-left'>{serviceData?.service_type}</td>
                                                    <td className='text-left'>{serviceData?.material?.name}</td>
                                                    <td className='text-left'>{serviceData?.material_type?.type}</td>
                                                    <td className='text-left'>{serviceData?.equipment?.name}</td>
                                                    <td className='text-left'>{serviceData?.volume?.volume}</td>
                                                    <td className='text-left'>{(serviceData?.equipment?.name.toLocaleLowerCase() === 'compactor' || serviceData?.service_type === 'Regular on call') ? 'NA' : serviceData?.add_units}</td>
                                                    <td className='text-left'>{serviceData?.frequency?.frequency_type}</td>
                                                    <td className='text-left'><p className='flex items-center space-x-2.5'>
                                                        <span>{((serviceData?.equipment?.name.toLocaleLowerCase() === 'compactor' && serviceData?.service_type === 'Regular on call') || serviceData?.service_type !== 'Regular on call') ? serviceData?.lifts : 'NA'}</span>
                                                        {serviceData?.equipment?.name.toLocaleLowerCase() === 'compactor' && <button type='button'
                                                            onClick={() => onAddLifts(data?.user?.uuid, data?.contractor_company?.uuid, serviceData)}
                                                        ><span className='text-primary'><PlusCircle /></span></button>}
                                                    </p></td>
                                                    <td className='text-left'>{(serviceData?.equipment?.name.toLocaleLowerCase() === 'compactor') ? 'NA' : serviceData?.approx_weight_per_unit}</td>
                                                    <td className='text-left'>
                                                        <p className='flex items-center space-x-2.5'>
                                                            <span>{serviceData?.approx_weight_per_month}</span>
                                                            {serviceData?.is_approx_weight_per_month_updated && <span className='text-bright-green-shade'><Check /></span>}
                                                        </p>
                                                    </td>
                                                    <td className='text-left'>
                                                        <div className='btn-group'>
                                                            <EditBtnPopup data={serviceData} setData={setDiversionReportHistoryObj} onClick={() => onEditDiversionReportHistory(data?.user?.uuid, data?.contractor_company?.uuid, serviceData)} />
                                                            <DeleteBtn data={serviceData} setObj={setDiversionReportHistoryObj} customClick={onDeleteService} />
                                                        </div>
                                                    </td>
                                                </tr>)
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>)
                    })}
                </div>
                {(data?.getDiversionReportsByHistoryId?.data.length === null || !data?.getDiversionReportsByHistoryId?.data?.length) && <div className='flex justify-center'>
                    <div>{t('No Data')}</div>
                </div>}
                {isAddOneOffs && <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`${returnValueDiversionReport(isAddOneOffs , '' , 'hidden')} fixed top-0 left-0 right-0 z-50 h-full bg-modal modal`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className="flex items-center justify-center h-full py-5 transition-all duration-300">
                        <div className='w-full mx-5 sm:max-w-[780px]'>
                            {/* <!-- Modal content --> */}
                            <div className='relative bg-white rounded-xl'>
                                {/* <!-- Modal header --> */}
                                <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                                    <p className='text-lg font-bold md:text-xl text-baseColor'>{diversionReportHistoryObj?.uuid ? 'Edit one offs' : 'Add One Offs'}</p>
                                    <Button onClick={() => { setIsAddOneOffs(false); formikAddWeights.resetForm(); setDiversionReportHistoryObj(undefined) }} label={t('')} title={`${t('Close')}`}>
                                        <span className='text-xl-22'><Cross className='text-error' /></span>
                                    </Button>
                                </div>
                                {/* <!-- Modal body --> */}
                                <div className='w-full'>
                                    <form onSubmit={formikAddWeights.handleSubmit}>
                                        <div className='p-5 max-h-[calc(100vh-260px)] overflow-auto grid grid-cols-1 sm:grid-cols-2 sm:gap-4'>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formikAddWeights?.values?.zone_id}
                                                    name='zone_id'
                                                    onChange={formikAddWeights?.handleChange}
                                                    id='zone_id'
                                                    label={t('Zone')}
                                                    required={true} options={zoneDrpDown} error={errorReturnFunction('zone_id')} />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    // placeholder={t('Select Service Type')}
                                                    value={formikAddWeights?.values?.service_type}
                                                    name='service_type'
                                                    onChange={(e) => {
                                                        formikAddWeights.setFieldValue('service_type', e?.target?.value)
                                                        if (e.target.value === 'Regular on call') {
                                                            frequencyDrpData?.map((data: {
                                                                name?: string | number;
                                                                key?: string | number;
                                                            }) => {
                                                                if (data?.name == '1') {
                                                                    formikAddWeights.setFieldValue('frequency_id', data?.key);
                                                                }
                                                            })
                                                        }
                                                    }}
                                                    id='service_type'
                                                    label={t('Service Type')}
                                                    required={true} options={diversionReportHistoryObj?.uuid ? allServiceTypes : serviceTypeDrpDataHistory} error={errorReturnFunction('service_type')} />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formikAddWeights?.values?.material_id}
                                                    name='material_id'
                                                    onChange={ (e) => onMaterialChange(e)}
                                                    id='material_id'
                                                    label={t('Material Category')}
                                                    required={true} options={materialDrpData} error={errorReturnFunction('material_id')} />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formikAddWeights?.values?.material_type_id}
                                                    name='material_type_id'
                                                    onChange={ (e) => onMaterialTypeChange(e) }
                                                    id='materail_type_id'
                                                    label={t('Material Type')}
                                                    required={true} options={materialTypeDrpData} error={errorReturnFunction('material_type_id')} />
                                            </div>

                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formikAddWeights?.values?.equipment}
                                                    name='equipment'
                                                    onChange={ (e) => onEquipmentChange(e)}
                                                    id='equipment'
                                                    label={t('Equipment')}
                                                    required={true} options={equipmentDrpData} error={errorReturnFunction('equipment')} />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formikAddWeights?.values?.frequency_id}
                                                    name='frequency_id'
                                                    onChange={ (e) => onFrequencyChange(e)}
                                                    id='frequency_id'
                                                    label={t('Frequency')}
                                                    required={true} options={formikAddWeights?.values?.service_type ==='Regular on call' ?frequencyDrpData:frequencyDrpData?.filter((data) => data?.name !== '1')} error={errorReturnFunction('frequency_id')} />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formikAddWeights?.values?.volume_name}
                                                    name='volume_name'
                                                    onChange={onVolumeChange}
                                                    id='volume_name'
                                                    label={t('Volume')}
                                                    required={true} options={volumeDrpData} error={errorReturnFunction('volume_name')} />
                                            </div>
                                            {/* <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    placeholder={t('Volume')}
                                                    name='volume'
                                                    value={formikAddWeights?.values?.volume}
                                                    onChange={formikAddWeights.handleChange}
                                                    id='volume'
                                                    label={t('Volume')}
                                                    required={true} disabled={true} error={formikAddWeights?.errors?.volume && formikAddWeights?.touched?.volume ? formikAddWeights?.errors?.volume : ''} />
                                            </div> */}

                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    placeholder={t('Add Units')}
                                                    value={formikAddWeights?.values?.add_units}
                                                    name='add_units'
                                                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onUnitChange(e)}
                                                    label={t('Unit')}
                                                    required={true}
                                                    error={errorReturnFunction('add_units')}
                                                    disabled={formikAddWeights?.values?.equipment.toLocaleLowerCase() === 'compactor' || formikAddWeights?.values?.service_type === 'Regular on call'}
                                                />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    placeholder={t('Add lifts')}
                                                    value={formikAddWeights?.values?.lifts}
                                                    name='lifts'
                                                    onChange={(e) => onLiftsChange(e)}
                                                    label={t('Lifts')}
                                                    required={true}
                                                    error={errorReturnFunction('lifts')}
                                                    disabled={formikAddWeights?.values?.equipment.toLocaleLowerCase() === 'compactor' || formikAddWeights?.values?.service_type === 'Regular on call'}
                                                />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    placeholder={t('Add Weight')}
                                                    value={formikAddWeights?.values?.approx_weight_per_unit}
                                                    name='approx_weight_per_unit'
                                                    onChange={formikAddWeights.handleChange}
                                                    label={t('Approx Weight Per Unit (Autofill)')}
                                                    required={true} disabled={true}
                                                // error={formikAddWeights?.errors?.approx_weight_per_unit && formikAddWeights?.touched?.approx_weight_per_unit ? formikAddWeights?.errors?.approx_weight_per_unit : ''}
                                                />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    placeholder={t('Add Weight')}
                                                    value={formikAddWeights?.values?.approx_weight_per_month}
                                                    name='approx_weight_per_month'
                                                    onChange={formikAddWeights.handleChange}
                                                    label={t('Weight Per month (Autofill)')}
                                                    required={true} disabled={formikAddWeights?.values?.equipment.toLocaleLowerCase() === 'compactor'}
                                                error={formikAddWeights?.errors?.approx_weight_per_month && formikAddWeights?.values?.equipment.toLocaleLowerCase() !== 'compactor'&&formikAddWeights?.touched?.approx_weight_per_month ? formikAddWeights?.errors?.approx_weight_per_month : ''}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                            {<Button className={'btn-primary btn-normal w-full md:w-auto min-w-[160px]'} type='submit' label={diversionReportHistoryObj?.uuid ? t('Update') : t('Add')} title={`${t('Add')}`} disabled={createLoader} />}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                {isAddNewOneOffs && <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`${returnValueDiversionReport(isAddNewOneOffs , '' , 'hidden')}fixed top-0 left-0 right-0 z-50 h-full bg-modal modal'`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className="flex items-center justify-center h-full py-5 transition-all duration-300">
                        <div className='w-full mx-5 sm:max-w-[780px]'>
                            {/* <!-- Modal content --> */}
                            <div className='relative bg-white rounded-xl'>
                                {/* <!-- Modal header --> */}
                                <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                                    <p className='text-lg font-bold md:text-xl text-baseColor'>Add New One Offs</p>
                                    <Button onClick={() => { setIsAddNewOneOffs(false); formik.resetForm() }} label={t('')} title={`${t('Close')}`} >
                                        <span className='text-xl-22'><Cross className='text-error' /></span>
                                    </Button>
                                </div>
                                {/* <!-- Modal body --> */}
                                <div className='w-full'>
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className='p-5 max-h-[calc(100vh-260px)] overflow-auto grid grid-cols-1 sm:grid-cols-2 sm:gap-4'>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    name='company_id'
                                                    onChange={formik.handleChange}
                                                    id='company_id'
                                                    label={t('Contractor')}
                                                    required={true} options={contractorDropdownData} error={getErrorNewOneOff('company_id')} />
                                            </div>

                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    name='zone_id'
                                                    onChange={formik.handleChange}
                                                    id='zone_id'
                                                    label={t('Zone')}
                                                    required={true} options={zoneDrpDown} error={getErrorNewOneOff('zone_id')} />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    // placeholder={t('Select Service Type')}
                                                    value={formik?.values?.service_type}
                                                    name='service_type'
                                                    onChange={(e) => {
                                                        formik.setFieldValue('service_type', e?.target?.value)
                                                        if (e.target.value === 'Regular on call') {
                                                            serviceTypeDrpDataHistory?.map((data: {
                                                                name?: string | number;
                                                                key?: string | number;
                                                            }) => {
                                                                if (data?.name == '1') {
                                                                    formik.setFieldValue('frequency_id', data?.key);
                                                                }
                                                            })
                                                        }
                                                    }}
                                                    id='service_type'
                                                    label={t('Service Type')}
                                                    required={true} options={serviceTypeDrpDataHistory} error={getErrorNewOneOff('service_type')} />
                                            </div>

                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formik?.values?.material_id}
                                                    name='material_id'
                                                    onChange={formik.handleChange}
                                                    id='material_id'
                                                    label={t('Material Category')}
                                                    required={true} options={materialDrpData} error={getErrorNewOneOff('material_id')} />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formik?.values?.material_type_id}
                                                    name='material_type_id'
                                                    onChange={formik.handleChange}
                                                    id='materail_type_id'
                                                    label={t('Material Type')}
                                                    required={true} options={materialTypeDrpData} error={getErrorNewOneOff('material_type_id')} />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formik?.values?.frequency_id}
                                                    name='frequency_id'
                                                    onChange={formik.handleChange}
                                                    id='frequency_id'
                                                    label={t('Frequency')}
                                                    required={true} options={formik?.values?.service_type ==='Regular on call' ?frequencyDrpData:frequencyDrpData?.filter((data) => data?.name !== '1')} error={getErrorNewOneOff('frequency_id')} />
                                            </div>

                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formik?.values?.equipment}
                                                    name='equipment'
                                                    onChange={onEquipmentChangeNew}
                                                    id='equipment'
                                                    label={t('Equipment')}
                                                    required={true} options={equipmentDrpData} error={getErrorNewOneOff('equipment')} />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formik?.values?.volume_name}
                                                    name='volume_name'
                                                    onChange={onVolumeChangeNew}
                                                    id='volume_name'
                                                    label={t('Volume')}
                                                    required={true} options={volumeDrpData} error={getErrorNewOneOff('volume_name')} />
                                            </div>

                                            {/* <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    placeholder={t('Volume')}
                                                    name='volume'
                                                    value={formik?.values?.volume}
                                                    onChange={formik.handleChange}
                                                    id='volume_id'
                                                    label={t('Volume')}
                                                    required={true} disabled={true} error={formik?.errors?.volume_id && formik?.touched?.volume_id ? formik?.errors?.volume_id : ''} />
                                            </div> */}

                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    placeholder={t('Add Units')}
                                                    value={formik?.values?.add_units}
                                                    name='add_units'
                                                    onChange={formik.handleChange}
                                                    label={t('Unit')}
                                                    required={true}
                                                    error={getErrorNewOneOff('add_units')}
                                                    disabled={formik?.values?.equipment.toLocaleLowerCase() === 'compactor' || formik?.values?.service_type === 'Regular on call'}
                                                />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    placeholder={t('Add lifts')}
                                                    value={formik?.values?.lifts}
                                                    name='lifts'
                                                    onChange={formik.handleChange}
                                                    label={t('Lifts')}
                                                    required={true}
                                                    error={getErrorNewOneOff('lifts')}
                                                    disabled={formik?.values?.equipment.toLocaleLowerCase() === 'compactor' || formik?.values?.service_type === 'Regular on call'}
                                                />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    placeholder={t('Add Weight')}
                                                    value={formik?.values?.approx_weight_per_unit}
                                                    name='approx_weight_per_unit'
                                                    onChange={formik.handleChange}
                                                    label={t('Approx Weight Per Unit (Autofill)')}
                                                    required={true} disabled={true}
                                                // error={formik?.errors?.approx_weight_per_unit && formik?.touched?.approx_weight_per_unit ? formik?.errors?.approx_weight_per_unit : ''}
                                                />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    placeholder={t('Add Weight')}
                                                    value={formik?.values?.approx_weight_per_month}
                                                    name='approx_weight_per_month'
                                                    onChange={formik.handleChange}
                                                    label={t('Weight Per month (Autofill)')}
                                                    required={true} disabled={formik?.values?.equipment.toLocaleLowerCase() === 'compactor'}
                                                error={formik?.values?.equipment.toLocaleLowerCase() !== 'compactor'&&formik?.errors?.approx_weight_per_month && formik?.touched?.approx_weight_per_month ? formik?.errors?.approx_weight_per_month : ''}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                            {<Button className={'btn-primary btn-normal w-full md:w-auto min-w-[160px]'} type='submit' label={t('Add')} title={`${t('Add')}`} disabled={createLoader} />}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                {isShowlifts && <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`${returnValueDiversionReport(isShowlifts , '' , 'hidden')} fixed top-0 left-0 right-0 z-50 h-full bg-modal modal`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className="flex items-center justify-center h-full py-5 transition-all duration-300">
                        <div className='w-full mx-5 sm:max-w-[780px]'>
                            <div className='relative bg-white rounded-xl'>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                                        <p className='text-lg font-bold md:text-xl text-baseColor'>Add Lifts</p>
                                        <Button label={t('')} title={`${t('Close')}`} onClick={() => setIsShowlifts(false)}>
                                            <span className='text-xl-22'><Cross className='text-error' /></span>
                                        </Button>
                                    </div>
                                    <div className='w-full max-h-[500px] p-5 mb-3 overflow-auto bg-white sm:w-auto custom-dataTable '>
                                        <table>
                                            <thead key='sorting'>
                                                <tr>
                                                    {COL_ARR_SERVICE4?.map((colValUser: ColArrType) => {
                                                        return (
                                                            <th scope='col' key={colValUser.fieldName}>
                                                                <div className={`flex items-center ${colValUser.name == 'Status' ? 'justify-center' : ''}`}>
                                                                    {colValUser.name}
                                                                </div>
                                                            </th>
                                                        );
                                                    })}
                                                    <th>
                                                        <div className='flex justify-center'>
                                                            {t('Action')}
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody >
                                                {formikAddWeights?.values?.compactor_lifts?.length ? formikAddWeights?.values?.compactor_lifts?.map((popData: { name: string, weight: number, date?: Date | null, uuid: string }, index: number) => {
                                                    return (<tr key={`popupData-${index + 1}`}>
                                                        <td className='text-left whitespace-nowrap'>{popData?.name}</td>
                                                        <td className='text-left'>
                                                            <div className='flex items-center space-x-2.5'>
                                                                <div className='w-32 md:w-[8.75rem] table-input'>
                                                                    <DatePicker
                                                                        id={`compactor_lifts?.[${index}]?.date`}
                                                                        selected={formikAddWeights?.values?.compactor_lifts?.[index]?.date}
                                                                        onChange={(date?: Date | null) => {
                                                                            formikAddWeights.setFieldValue(`compactor_lifts.[${index}].date`, date)
                                                                        }}
                                                                        dateFormat="dd/MM/yyyy"
                                                                        placeholderText="dd/MM/yyyy"
                                                                        className='customInput disabled:cursor-not-allowed'
                                                                        maxDate={new Date()}
                                                                    />
                                                                    {addOneOffsErrors?.[index]?.date && addOneOffsTouched?.[index]?.date ? <p className='error'>{addOneOffsErrors?.[index]?.date as string}</p> : ''}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className='text-left'>
                                                            <div className='w-24 md:w-[7.5rem] table-input'>
                                                                <TextInput
                                                                    placeholder={t('')}
                                                                    required={true}
                                                                    id={`weight-${index}`}
                                                                    name={`compactor_lifts.[${index}].weight`}
                                                                    onChange={formikAddWeights.handleChange}
                                                                    value={formikAddWeights?.values?.compactor_lifts?.[index]?.weight}
                                                                    error={(addOneOffsErrors?.[index]?.weight && addOneOffsTouched?.[index]?.weight) ? addOneOffsErrors?.[index]?.weight : ''}

                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button type="button" className='btn bg-transparent cursor-pointer btn-default' onClick={() => onDelete(index)}  ><Trash className='fill-error' /></button>
                                                        </td>
                                                    </tr>);
                                                }
                                                ) : null}
                                            </tbody>

                                        </table>
                                        {(formikAddWeights?.values?.compactor_lifts?.length === 0 ||
                                            formikAddWeights?.values?.compactor_lifts?.length === null) && (
                                                <div className='flex justify-center'>
                                                    <div>{t('No Data')}</div>
                                                </div>
                                            )}
                                    </div>

                                    <p className='p-5 pt-0 flex items-center space-x-2.5'>
                                        <button onClick={() => addNewLift()} type='button'><span className='text-primary cursor-pointer'><PlusCircle /></span></button>
                                        <span>Add New</span>
                                    </p>

                                    <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                        <Button className={'btn-primary btn-normal w-full md:w-auto min-w-[160px]'} label={t('Add')} title={`${t('Add')}`} type='submit'
                                            onClick={() => onAddTotalLifts()} disabled={createLoader}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>}
                {isDeleteModel && (
                    <CommonModel
                        warningText={DELETE_WARNING_TEXT}
                        onClose={onClose}
                        action={DeleteServieData}
                        show={isDeleteModel}
                        disabled={deleteDerviceLoader} />
                )}
            </div>
        </>
    );
}

export default DiversionReport1;