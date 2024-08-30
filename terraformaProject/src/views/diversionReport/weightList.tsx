import React, { useCallback, useEffect, useRef, useState } from 'react';
import UpdatedHeader from '@components/header/updatedHeader';
import { Cross, FileUpload, PlusCircle, Trash } from '@components/icons/icons';
import { useTranslation } from 'react-i18next';
import { API_MEDIA_END_POINT, AXIOS_HEADERS, DELETE_WARNING_TEXT, MAX_FILE_SIZE, PAGE_LIMIT, PAGE_NUMBER, serviceTypeDrpDataWeights } from '@config/constant';
import TextInput from '@components/textInput/TextInput';
import { FormikErrors, FormikTouched, useFormik } from 'formik';
import Button from '@components/button/button';
import DropDown from '@components/dropdown/dropDown';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_DIVERSION_REPORTS_CONTRACTORS } from '@framework/graphql/queries/weights';
import { UserProfileType } from 'src/types/common';
import { useDispatch, useSelector } from 'react-redux';
import { DiversionReportContractorRes } from 'src/types/weights';
import { GET_MATERIALS, GET_MATERIAL_BY_ID } from '@framework/graphql/queries/materialManagement';
import { GET_EQUIPMENTS } from '@framework/graphql/queries/equipmentManagement';
import { GET_FREQUENCIES } from '@framework/graphql/queries/frequencyManagement';
import { GET_ZONES_BY_ID } from '@framework/graphql/mutations/zoneManagement';
import { toast } from 'react-toastify';
import { MaterialDataRes } from '@views/materialManagament';
import { DropdownOptionType } from '@types';
import { AddWeightType, setCompactorUuid, setFrequencyData, setFrequencyTime, setLiftIndex, setMaterailData, setVolumeDataForWeights } from 'src/redux/addWeights-slice';
import { FrequencyDataRes } from '@views/frequencyManagement';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { CREATE_OR_UPDATE_WEIGHTS } from '@framework/graphql/mutations/weights';
import useValidation from '@framework/hooks/validations';
import axios from 'axios';
import { GET_DIVERSION_REPORT_SETTING_BY_ID } from '@framework/graphql/queries/diversionSetting';
import { conditionReturnFun, whiteSpaceRemover } from '@utils/helpers';
import CommonModel from '@components/common/commonModel';
import { v4 as uuidv4 } from 'uuid';
import { VolumesDataRes } from '@views/volumeManagement';
import { GET_EQUIPMENT_BY_NAME } from '@framework/graphql/mutations/equipmentManagement';
import { WeightListFormikType } from 'src/types/diversionReport';

export type ColArrType = {
    name: string
    sortable: boolean
    fieldName: string
}

const WeightList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const weightDetails = useSelector(((state: { addWeightsManagement: AddWeightType }) => state.addWeightsManagement));
    const { userProfileData: userData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const { data, refetch } = useQuery(GET_ALL_DIVERSION_REPORTS_CONTRACTORS, {
        fetchPolicy: 'network-only', skip: !userData?.getProfile?.data?.company_id?.uuid, variables: {
            companyId: userData?.getProfile?.data?.company_id?.uuid,
            limit: 10,
            page: 1

        }
    });
    const [zones] = useMutation(GET_ZONES_BY_ID);
    const [getDiversionReportSettingById] = useMutation(GET_DIVERSION_REPORT_SETTING_BY_ID);
    const { createOrUpdateWeightsValidationSchema, weightsTableValidationschema } = useValidation();
    const [createorUpdateWeights, { loading: createLoader }] = useMutation(CREATE_OR_UPDATE_WEIGHTS);
    const { refetch: getMaterialTypes } = useQuery(GET_MATERIAL_BY_ID, { fetchPolicy: 'network-only', skip: true });
    const { refetch: getAllMaterials } = useQuery(GET_MATERIALS, { fetchPolicy: 'network-only', skip: true });
    const { refetch: getAllEquipments } = useQuery(GET_EQUIPMENTS, { fetchPolicy: 'network-only', skip: true });
    const { refetch: getAllFrequencies } = useQuery(GET_FREQUENCIES, { fetchPolicy: 'network-only', skip: true });
    const [getEquipmentbyName] = useMutation(GET_EQUIPMENT_BY_NAME);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [isDeleteDoc, setIsDeleteDoc] = useState<boolean>(false);
    const [isShowlifts, setIsShowlifts] = useState<boolean>(false);
    const [volumeDrpData, setVolumeDrpData] = useState<DropdownOptionType[]>([{ name: 'Select Volume Type', key: '' }]);
    const [filterData] = useState({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortOrder: 'descend',
        search: '',
        sortField: 'createdAt',
        index: 0
    });

    const COL_ARR_SERVICE3 = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Zone'), sortable: false },
        { name: t('Service Type'), sortable: false },
        { name: t('Material Category'), sortable: false, fieldName: 'Material Category' },
        { name: t('Material Type'), sortable: false, fieldName: 'Material Type' },
        { name: t('Equipment'), sortable: false, fieldName: 'Equipment' },
        { name: t('Volume'), sortable: false, fieldName: 'Volume' },
        { name: t('Frequency'), sortable: false, fieldName: 'Frequency' },
        { name: t('Unit'), sortable: false, fieldName: 'Unit' },
        { name: t('Lifts'), sortable: false, fieldName: 'Lifts' },
        { name: t('Approx Weight Per Unit'), sortable: false, fieldName: 'Approx Weight Per Unit' },
        { name: t('Weight Per Month'), sortable: false, fieldName: 'Weight Per Month' },

    ] as ColArrType[];

    const COL_ARR_SERVICE4 = [
        { name: t('Lifts'), sortable: false, fieldName: 'Lifts' },
        { name: t('Insert Date'), sortable: false, fieldName: 'Insert Date' },
        { name: t('Input Weight'), sortable: false, fieldName: 'Input Weight' },

    ] as ColArrType[];

    useEffect(() => {
        if (userData?.getProfile?.data?.company_id?.uuid) {
            getDiversionReportSettingById({
                variables: {
                    locationId: userData?.getProfile?.data?.branch_locations?.[0]?.uuid
                }
            }).then((res) => {
                dispatch(setFrequencyTime(res?.data?.getDiversionReportSettingById?.data?.frequency));
            }).catch(err => toast.error(err?.networkError?.result?.errors[0]?.message))
        }
    }, [userData?.getProfile?.data?.company_id?.uuid])

    useEffect(() => {
        if (data?.getAllDiversionReports) {
            data?.getAllDiversionReports?.data?.diversionReports?.map((data: DiversionReportContractorRes, index: number) => {
                formik.setFieldValue(`reportData.[${index}].equipment`, data?.equipment?.name);
                formik.setFieldValue(`reportData.[${index}].service_type`, data?.service_type);
                formik.setFieldValue(`reportData[${index}].approx_weight_per_month`, data?.approx_weight_per_month)
                formik.setFieldValue('docFileName', data?.document);
                formik.setFieldValue('fileName', data?.invoice);
                formik.setFieldValue('attachments', data?.invoice);
                formik.setFieldValue('documents', data?.document);
                if (data?.lift.length) {
                    formik.setFieldValue(`compactor_lifts[${index}]`, data?.lift.map((data) => {
                        return { name: data?.name, uuid: data?.uuid, weight: data?.weight, date: new Date(data?.date) }
                    }));
                    formik.setFieldValue(`reportData[${index}].lifts`, data?.lift.length);

                } else {
                    formik.setFieldValue(`reportData[${index}].lifts`, data?.lifts);
                    formik.setFieldValue(`compactor_lifts[${index}]`, data?.lift);
                }

            })
        }
    }, [data?.getAllDiversionReports, userData?.getProfile])


    const initialValues: { reportData: { lifts: number, approx_weight_per_month: number, service_type: string }[], compactor_lifts: Array<{ name: string, uuid: string, weight: number, date: Date | null | undefined }[]>, attachments: string; fileName: string; docFileName: string; documents: string; delete_lifts: string[][], popupData: { name: string, uuid: string, weight: number, date: Date | null }[], isSubmitted: boolean, validationArray: [] } = {
        reportData: [],
        compactor_lifts: [],
        attachments: '',
        fileName: '',
        documents: '',
        docFileName: '',
        delete_lifts: [],
        popupData: [],
        isSubmitted: false,
        validationArray: [],
    }

    const formik = useFormik({
        initialValues,
        validationSchema: weightsTableValidationschema,
        onSubmit: (values) => {
            const reportData = data?.getAllDiversionReports?.data?.diversionReports.map((data: DiversionReportContractorRes, index: number) => {
                const approxWeightPerUnit = (data?.material_type?.weight * data?.volume?.volume_cubic_yard).toFixed(2);
                return {
                    zone_id: conditionReturnFun(data?.zone?.uuid),
                    service_type: data?.service_type,
                    material_id: data?.material?.uuid,
                    material_type_id: data?.material_type?.uuid,
                    equipment_id: data?.equipment?.uuid,
                    frequency_id: data?.frequency?.uuid,
                    volume_id: data?.volume?.uuid,
                    add_units: (+data?.add_units),
                    lifts: Number(values?.reportData?.[index]?.lifts) ?? +data?.lifts,
                    approx_weight_per_unit: +approxWeightPerUnit,
                    approx_weight_per_month: Number(values?.reportData?.[index]?.approx_weight_per_month) ?? +data?.approx_weight_per_month,
                    user_id: userData?.getProfile?.data?.uuid,
                    report_id: conditionReturnFun(data?.uuid),
                    compactor_lifts: values.compactor_lifts?.[index] ?? [],
                    company_id: userData?.getProfile?.data?.company_id?.uuid,
                    delete_lifts: values.delete_lifts?.[index] ?? [],
                    document: conditionReturnFun(values.documents),
                    invoice: conditionReturnFun(values.attachments),
                    location_id: userData?.getProfile?.data?.branch_locations[0]?.uuid,
                    start_date: moment(data?.start_date).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                    end_date: moment(data?.end_date).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                    frequency_time: data?.frequency_time ?? weightDetails?.frequencyTime,
                    diversion_history_id: '',
                }
            })
            if (reportData) {
                createorUpdateWeights({
                    variables: {
                        reportData: reportData,
                        isSubmitted: values?.isSubmitted
                    }
                }).then((res) => {
                    toast.success(res?.data?.createDiversionReport?.message);
                    formik.resetForm();
                    formikAddWeights.resetForm();
                    refetch().then((res) => {
                        res?.data?.getAllDiversionReports?.data?.diversionReports?.map((data: DiversionReportContractorRes, index: number) => {
                            formik.setFieldValue(`reportData.[${index}].equipment`, data?.equipment?.name);
                            formik.setFieldValue(`reportData.[${index}].service_type`, data?.service_type);
                            formik.setFieldValue(`reportData[${index}].approx_weight_per_month`, +data?.approx_weight_per_month.toFixed(2))
                            formik.setFieldValue('documents', data?.document);
                            formik.setFieldValue('fileName', data?.invoice);
                            formik.setFieldValue('docFileName', data?.document);
                            formik.setFieldValue('attachments', data?.invoice);


                            if (data?.lift.length) {
                                formik.setFieldValue(`reportData[${index}].lifts`, data?.lift.length);
                                formik.setFieldValue(`compactor_lifts[${index}]`, data?.lift.map((data) => {
                                    return { name: data?.name, uuid: data?.uuid, weight: data?.weight, date: new Date(data?.date) }
                                }));

                            } else {
                                formik.setFieldValue(`reportData[${index}].lifts`, +data?.lifts.toFixed(2));
                                formik.setFieldValue(`compactor_lifts[${index}]`, data?.lift);
                            }

                        })
                    }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));

                }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message))
            }


        }

    });


    const onAddLifts = useCallback((data?: DiversionReportContractorRes, index?: number) => {
        if (data && index !== undefined) {
            formik.setFieldValue('popupData', formik?.values?.compactor_lifts?.[index]);
            dispatch(setLiftIndex(index))
        }
        setIsShowlifts(true);
    }, [formik.values]);

    const [isAddMaterial, setIsAddMaterial] = useState<boolean>(false);
    const [materialDrpData, setMaterialDrpData] = useState<DropdownOptionType[]>([{ name: 'Select Material Catergory', key: '' }]);
    const [frequencyDrpData, setFrequencyDrpData] = useState<DropdownOptionType[]>([{ name: 'Select Frequency', key: '' }]);
    const [materialTypeDrpData, setMaterialTypeDrpData] = useState<DropdownOptionType[]>([{ name: 'Select Material Type' }]);
    const [equipmentDrpData, setEquipmentDrpData] = useState<DropdownOptionType[]>([{ name: 'Select Equipment', key: '' }]);
    const [zoneDrpDown, setZoneDrpDown] = useState<DropdownOptionType[]>([{ name: 'Select Zone', key: '' }]);

    const onAddOtherMaterial = useCallback(() => {

        zones({ variables: { siteId: userData?.getProfile?.data?.branch_locations?.[0]?.uuid } }).then((res) => {
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
                    dispatch(setCompactorUuid(data?.uuid))
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

        setIsAddMaterial(true);
    }, [userData?.getProfile?.data])

    const AddWeightsInitialValues :WeightListFormikType = {
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
    const formikAddWeights = useFormik({
        initialValues: AddWeightsInitialValues,
        validationSchema: createOrUpdateWeightsValidationSchema,
        onSubmit: (values) => {
            if (userData?.getProfile?.data?.uuid && userData?.getProfile?.data?.company_id?.uuid && userData?.getProfile?.data?.branch_locations.length) {
                createorUpdateWeights({
                    variables: {
                        isSubmitted: false,
                        reportData: [{
                            zone_id: (values?.zone_id === 'full_site') ? '' : values?.zone_id,
                            service_type: values?.service_type,
                            material_id: values?.material_id,
                            material_type_id: values?.material_type_id,
                            equipment_id: values?.equipment_id,
                            volume_id: values?.volume_id,
                            frequency_id: values?.frequency_id,
                            add_units: +values?.add_units,
                            lifts: +values?.lifts,
                            approx_weight_per_unit: +values?.approx_weight_per_unit,
                            approx_weight_per_month: +values?.approx_weight_per_month,
                            report_id: '',
                            user_id: userData?.getProfile?.data?.uuid,
                            compactor_lifts: [],
                            delete_lifts: [],
                            company_id: userData?.getProfile?.data?.company_id?.uuid,
                            document: '',
                            invoice: '',
                            location_id: userData?.getProfile?.data?.branch_locations[0]?.uuid,
                            start_date: moment(data?.getAllDiversionReports?.data?.diversionReports?.[0]?.start_date).format('YYYY-MM-DD HH:mm:ss'),
                            end_date: moment(data?.getAllDiversionReports?.data?.diversionReports?.[0]?.end_date).format('YYYY-MM-DD HH:mm:ss'),
                            frequency_time: data?.getAllDiversionReports?.data?.diversionReports?.[0]?.frequency_time ?? weightDetails?.frequencyTime,
                            diversion_history_id: ''
                        }],
                        // moment('2024-03-13 11:47:37').format('YYYY-MM-DD HH:mm:ss'),

                    }
                }).then((res) => {
                    toast.success(res?.data?.createDiversionReport?.message);
                    setIsAddMaterial(false);
                    refetch().catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
                    formikAddWeights.resetForm();
                }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message))
            }
        }
    });


    useEffect(() => {
        if (formikAddWeights?.values?.material_id) {
            getMaterialTypes({
                materialId: formikAddWeights?.values?.material_id
            }).then((res) => {
                formikAddWeights.setFieldValue('approx_weight_per_unit', '');
                formikAddWeights.setFieldValue('material_type_id', '');
                const data = res?.data?.getMaterialById?.data?.material_types?.map((data: {
                    uuid: string;
                    type: string;
                    weight: number;
                }) => { return { name: data?.type, key: data?.uuid, uuid: data?.uuid }; });
                const materialData: { [key: string]: number } = {}
                if (data) {
                    setMaterialTypeDrpData([{ name: 'Select Material Type', key: '' }, ...data])
                }
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
            }).catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message)
            })
        }
    }, [formikAddWeights?.values?.material_id])

    useEffect(() => {
        if (formikAddWeights?.values?.frequency_id && formikAddWeights?.values?.add_units) {
            formikAddWeights.setFieldValue('lifts', ((weightDetails.frequencyData[formikAddWeights?.values?.frequency_id]) * formikAddWeights?.values?.add_units).toFixed(2))
        }
    }, [formikAddWeights?.values?.frequency_id, formikAddWeights?.values?.add_units])


    useEffect(() => {
        if (formikAddWeights?.values?.material_type_id && formikAddWeights?.values?.volume_name) {
            formikAddWeights.setFieldValue('approx_weight_per_unit', ((weightDetails.materialData[formikAddWeights?.values?.material_type_id]) * +formikAddWeights?.values?.volume_name?.split('_')?.[2]).toFixed(2))
        }
    }, [formikAddWeights?.values?.material_type_id, formikAddWeights?.values?.volume_name])

    useEffect(() => {
        if (formikAddWeights?.values?.approx_weight_per_unit && formikAddWeights?.values?.lifts) {
            formikAddWeights.setFieldValue('approx_weight_per_month', (formikAddWeights?.values?.approx_weight_per_unit * formikAddWeights?.values?.lifts).toFixed(2))
        }
    }, [formikAddWeights?.values?.approx_weight_per_unit, formikAddWeights?.values?.lifts])

    const onDelete = useCallback((index: number) => {
        if (weightDetails?.liftIndex !== undefined) {
            const delete_lifts = formik.values.delete_lifts?.[weightDetails?.liftIndex] ?? [];
            const deleteId: string[] = [];
            const data = formik?.values?.popupData.filter((data, ind) => {
                if (ind === index && data?.uuid) {
                    deleteId.push(data?.uuid)
                }
                if (ind !== index) {
                    return data;
                }
            });
            if (data) {
                formik.setFieldValue(`delete_lifts.[${weightDetails?.liftIndex}]`, [...delete_lifts, ...deleteId]);
                formik.setFieldValue('popupData', data)
                formik.setFieldValue(`compactor_lifts.[${weightDetails?.liftIndex}]`, data.length)
            }
        }
    }, [formik?.values?.delete_lifts, formik?.values?.popupData, weightDetails?.liftIndex])

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const docInputRef = useRef<HTMLInputElement | null>(null);
    const handleTextInputClick = () => {
        fileInputRef?.current?.click();
    };
    const handleInputClick = () => {
        docInputRef?.current?.click();
    }

    /** method to upload pdf file */
    const handleFileEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;
        if (files) {
            const maxFileSize = MAX_FILE_SIZE;
            const allowedExtensions = ['pdf'];
            const selectedFiles = Array.from(files);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validFiles = selectedFiles.filter((file: any) => {
                const fileSize = file.size;
                const extension = file.name.split('.').pop()?.toLowerCase();
                if (!allowedExtensions.includes(extension)) {
                    toast.error(`Invalid file type: ${file.name}`);
                    return false;
                }
                if (fileSize > maxFileSize) {
                    toast.error('Please make sure your file is must be less than 5MB.');
                    return false;
                }
                return true;
            });
            if (validFiles.length > 0) {
                const formData = new FormData();
                formik.setFieldValue('fileName', validFiles?.[0]?.name);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formData.append('file', validFiles[0] as any);

                // Attempt to upload the attachment
                axios.post(`${API_MEDIA_END_POINT}/attachment`, formData, { headers: AXIOS_HEADERS })
                    .then((response) => {
                        formik.setFieldValue('attachments', response?.data?.data?.key);
                    })
                    .catch((err) => {
                        toast.error(err?.message);
                    });

            } else {
                formik.setFieldError('attachments', 'Invalid file type Please enter valid attachment');
            }
        }
    };
    /** method to upload doc file */
    const handleDocFileEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;
        if (files) {
            const maxFileSize = MAX_FILE_SIZE;
            const allowedExtensions = ['doc', 'docx', 'application/msword'];
            const selectedFiles = Array.from(files);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validFiles = selectedFiles.filter((file: any) => {
                const extension = file.name.split('.').pop()?.toLowerCase();
                const fileSize = file.size;
                if (!allowedExtensions.includes(extension)) {
                    toast.error(`Invalid file type: ${file.name}`);
                    return false;
                }
                if (fileSize > maxFileSize) {
                    toast.error('Please make sure your file is must be less than 5MB.');
                    return false;
                }
                return true;
            });
            if (validFiles.length > 0) {
                const formData = new FormData();
                formik.setFieldValue('docFileName', validFiles?.[0]?.name);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formData.append('file', validFiles[0] as any);

                axios.post(`${API_MEDIA_END_POINT}/attachment`, formData, { headers: AXIOS_HEADERS })
                    .then((response) => {
                        formik.setFieldValue('documents', response?.data?.data?.key);
                    })
                    .catch((err) => toast.error(err?.message));

            } else {
                formik.setFieldError('documents', 'Invalid file type Please enter valid attachment');
            }
        }
    };

    const onSaveDraft = useCallback(() => {
        formik.setFieldValue('isSubmitted', false);
        formik.handleSubmit();
    }, [data?.getAllDiversionReports, formik?.values, formikAddWeights?.values, weightDetails?.frequencyTime, formik.errors.compactor_lifts])

    const onConfirm = useCallback(() => {
        formik.setFieldValue('isSubmitted', true);
        formik.handleSubmit();
    }, [data?.getAllDiversionReports, formik?.values, formikAddWeights?.values, weightDetails?.frequencyTime])

    const addNewLift = useCallback(() => {
        const updatedPopupData = [...formik.values.popupData];
        const newPopupData = {
            name: `Lift-${formik?.values?.popupData?.length + 1}`,
            uuid: '',
            date: new Date(),
            weight: 0,
        };
        updatedPopupData.push(newPopupData);
        formik.setFieldValue('popupData', updatedPopupData);
    }, [formik?.values?.popupData])

    const liftsErrors = formik?.errors?.popupData as FormikErrors<{
        name: string;
        uuid: string;
        weight: number;
        date: Date | null;
    }>[];
    const liftsTouched = formik?.touched?.popupData as FormikTouched<{
        name: string;
        uuid: string;
        weight: number;
        date: Date | null;
    }>[];
    const tableErrors = formik?.errors?.reportData as FormikErrors<{
        lifts: number;
        approx_weight_per_month: number;
    }>[];
    const tableTouched = formik?.touched?.reportData as FormikTouched<{
        lifts: number;
        approx_weight_per_month: number;
    }>[];
    const onAddTotalLifts = useCallback(() => {
        const updatedCompactorLifts: {
            name: string;
            uuid: string;
            weight: number;
            date: Date | null;
        }[] = [];
        const totalWeight = formik.values.popupData.reduce((acc, data) => {
            const weight = +data.weight;
            updatedCompactorLifts.push({ ...data, weight, date: data.date });
            return acc + weight;
        }, 0);
        if (totalWeight !== undefined) {
            formik.setFieldValue(`compactor_lifts.[${weightDetails?.liftIndex}]`, updatedCompactorLifts);
            formik.setFieldValue(`reportData.[${weightDetails?.liftIndex}].lifts`, formik.values.popupData.length);
            formik.setFieldValue(`reportData.[${weightDetails?.liftIndex}].approx_weight_per_month`, totalWeight);
        }
        setIsShowlifts(false);
    }, [formik.values.popupData])

    const OnBlurWeights = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);


    const onDeleteUploads = useCallback(() => {
        setIsDelete(true);
    }, []);
    const onDeleteUploadsDoc = useCallback(() => {
        setIsDeleteDoc(true);
    }, []);

    const onEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e?.target?.value) {
            getEquipmentbyName({ variables: { equipmentName: e?.target?.value } }).then((res) => {
                const volumeData = res?.data?.getEquipmentByName?.data?.map((data: {
                    name: string;
                    uuid: string;
                    volume: VolumesDataRes;
                }) => {
                    return { name: data?.volume?.volume, key: `${data?.volume?.uuid}_${data?.uuid}_${data?.volume?.volume_cubic_yard}` }
                });
                if (volumeData) {
                    setVolumeDrpData([{ name: 'Select Volume Type', key: '' }, ...volumeData]);
                }
            })
                .catch((err) => { toast.error(err.networkError.result.errors[0].message) });
            formikAddWeights.setFieldValue('equipment', e?.target?.value);
        }

    };

    const onVolumeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e?.target?.value) {
            formikAddWeights.setFieldValue('volume_name', e?.target?.value);
            const value = e?.target?.value.split('_');
            formikAddWeights.setFieldValue('equipment_id', value[1]);
            formikAddWeights.setFieldValue('volume_id', value[0]);
            if (formikAddWeights?.values?.material_type_id) {
                formikAddWeights.setFieldValue('approx_weight_per_unit', ((weightDetails.materialData[formikAddWeights?.values?.material_type_id]) * +value[2]).toFixed(2))
            }
        }
    }, [formikAddWeights?.values]);

    const onRemove = useCallback(() => {
        const data = { fileName: formik.values.fileName };
        axios.delete(`${API_MEDIA_END_POINT}/remove`, { data })
            .then(() => {
                setIsDelete(false)
                formik.setFieldValue('attachments', '');
                formik.setFieldValue('fileName', '');
            })
            .catch((error) => {
                setIsDelete(false)
                toast.error(error?.response?.data?.message)
            });
    }, [formik.values.fileName])

    const onRemovedoc = useCallback(() => {
        const data = { fileName: formik.values.docFileName };
        axios.delete(`${API_MEDIA_END_POINT}/remove`, { data })
            .then(() => {
                setIsDeleteDoc(false)
                formik.setFieldValue('documents', '');
                formik.setFieldValue('docFileName', '');
            })
            .catch((error) => {
                setIsDeleteDoc(false)
                toast.error(error?.response?.data?.message)
            });
    }, [formik.values.docFileName])

    const onClose = useCallback(() => {
        setIsDelete(false)
        setIsDeleteDoc(false)

    }, []);

    const getErrorWeights=(fieldName: keyof( WeightListFormikType))=>{
        return formikAddWeights?.errors?.[fieldName]&&formikAddWeights?.touched?.[fieldName]? formikAddWeights?.errors?.[fieldName]:'';
    }

    const returnTrueValueWeights=(condi:boolean,succ:string|boolean,err:string|boolean)=>{
        return condi ? succ : err;
    }
    return (
        <>
            <UpdatedHeader headerTitle='Add Weights' />
            {data?.getAllDiversionReports?.data?.diversionReports?.length ? <div>
                <div className='bg-accents-2 border border-border-primary rounded-xl p-3 md:p-5 mb-5 md:mb-7 flex justify-between items-center gap-3 flex-wrap'>
                    <div className="flex items-center gap-x-20 xmd:gap-x-48 flex-wrap gap-y-3">
                        <p className='whitespace-nowrap'>
                            <span>Start Date: </span>
                            <span className='font-bold'>{moment(data?.getAllDiversionReports?.data?.diversionReports?.[0]?.start_date).format('DD/MM/YYYY') ?? ''}</span>
                        </p>
                        <p className='whitespace-nowrap'>
                            <span>Due Date: </span>
                            <span className='font-bold'>{moment(data?.getAllDiversionReports?.data?.diversionReports?.[0]?.end_date).format('DD/MM/YYYY') ?? ''}</span>
                        </p>
                    </div>
                    {!data?.getAllDiversionReports?.data?.diversionReports[0].is_submitted && <Button
                        className='btn-normal btn btn-secondary whitespace-nowrap w-full sm:w-auto'
                        type='button'
                        label={t('+ Add Other Material')}
                        title={`${t('Add Other Material')}`}
                        onClick={onAddOtherMaterial}
                    />}
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className='px-3 py-5 md:px-5 border rounded-xl' >
                        <div className='flex flex-col justify-between gap-3 mb-3 sm:gap-5 md:mb-5 btn-group sm:flex-row'>
                            <h6 className='w-full leading-7 xmd:w-auto whitespace-nowrap'>{t('Service List')}</h6>
                            {!data?.getAllDiversionReports?.data?.diversionReports[0].is_submitted && <div className='flex items-center flex-wrap sm:flex-nowrap gap-3'>
                                <Button className='btn btn-secondary btn-normal relative !pr-12 min-w-[210px] w-full md:w-[260px] !justify-start' label={t('Upload Invoice')} onClick={handleTextInputClick}  >
                                    <input
                                        id="attachments"
                                        type="file"
                                        name="attachments"
                                        multiple
                                        className="focus:bg-transparent hidden"
                                        accept=".pdf"
                                        onChange={(e) => handleFileEvent(e)}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        key={uuidv4()}
                                    />
                                    <span className='w-5 h-5 absolute top-1/2 right-5 transform -translate-y-1/2'>
                                        <FileUpload fontSize='20' className='w-5 h-5' />
                                    </span>
                                </Button>

                                <Button className='btn btn-secondary btn-normal relative !pr-16 min-w-[210px] w-full md:w-[260px] !justify-start' label={t('Upload Document')} onClick={handleInputClick}>
                                    <input
                                        id="documents"
                                        type="file"
                                        name="documents"
                                        multiple
                                        className="focus:bg-transparent hidden"
                                        accept=".doc, .docx,application/msword"
                                        onChange={(e) => handleDocFileEvent(e)}
                                        ref={docInputRef}
                                        style={{ display: 'none' }}
                                        key={uuidv4()}
                                    />
                                    <span className='w-5 h-5 absolute top-1/2 right-5 transform -translate-y-1/2'>
                                        <FileUpload fontSize='20' className='w-5 h-5' />
                                    </span>
                                </Button>
                            </div>}
                        </div>
                        <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                            <table>
                                <thead>
                                    <tr>
                                        {COL_ARR_SERVICE3?.map((colValUser: ColArrType, index: number) => {
                                            const key = colValUser.fieldName + index + 1
                                            return (
                                                <th scope='col' key={key}>
                                                    <div className={`flex items-center ${colValUser.name == 'Status' ? 'justify-center' : ''}`}>
                                                        {colValUser.name}

                                                    </div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.getAllDiversionReports?.data?.diversionReports?.map((data: DiversionReportContractorRes, index: number) => {
                                        const displayIndex = filterData?.index + index + 1;
                                        const approxWeightPerUnit = data?.material_type?.weight * data?.volume?.volume_cubic_yard;
                                        const key = data?.uuid + index
                                        return (
                                            <tr key={key}>
                                                <td className='text-left'>{displayIndex}</td>
                                                <td className='text-left whitespace-nowrap'>{data?.is_full_site ? 'Full Site' : data?.zone?.location}</td>
                                                <td className='text-left'>{data?.service_type}</td>
                                                <td className='text-left'><div className='relative'>
                                                    <span>{data?.material?.name}</span>
                                                    {data?.is_material_updated && <span className='absolute -top-3 -right-2 bg-green-badge-bg px-1 py-0.5 text-bright-green-shade text-[10px] leading-4 inline-block rounded'>Updated</span>}
                                                </div></td>
                                                <td className='text-left'>
                                                    <div className='relative'>
                                                        <span>{data?.material_type?.type}</span>
                                                        {data?.is_material_type_updated && <span className='absolute -top-3 -right-2 bg-green-badge-bg px-1 py-0.5 text-bright-green-shade text-[10px] leading-4 inline-block rounded'>Updated</span>}</div></td>
                                                <td className='text-left'><div className='relative'>
                                                    <span>{data?.equipment?.name}</span>
                                                    {data?.is_equipment_updated && <span className='absolute -top-3 -right-2 bg-green-badge-bg px-1 py-0.5 text-bright-green-shade text-[10px] leading-4 inline-block rounded'>Updated</span>}</div></td>
                                                <td className='text-left'><div className='relative'>
                                                    <span>{data?.volume?.volume}</span>
                                                    {data?.is_volume_updated && <span className='absolute -top-3 -right-2 bg-green-badge-bg px-1 py-0.5 text-bright-green-shade text-[10px] leading-4 inline-block rounded'>Updated</span>}</div></td>
                                                <td className='text-left'>
                                                    {data?.frequency?.frequency_type}
                                                </td>
                                                <td className='text-left'>{(data?.equipment?.name.toLocaleLowerCase() === 'compactor' || data?.service_type === 'Regular on call') ? 'NA' : data?.add_units}</td>
                                                <td className='text-left'>
                                                    <div className='flex items-center space-x-2.5'>
                                                        <div className='w-[4.125rem] table-input'>
                                                            {data?.equipment?.name.toLocaleLowerCase() !== 'compactor' && data?.service_type === 'Regular on call'}
                                                            <TextInput
                                                                placeholder={t('')}
                                                                name={`reportData.[${index}].lifts`}
                                                                onBlur={OnBlurWeights}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue(`reportData.[${index}].lifts`, (e.target.value))
                                                                    formik.setFieldValue(`reportData.[${index}].approx_weight_per_month`, ((+e.target.value) * approxWeightPerUnit).toFixed(2))
                                                                }}
                                                                required={true}
                                                                value={
                                                                    // (data?.equipment?.name.toLocaleLowerCase() !== 'compactor' || data?.service_type == 'Regular on call') ? 'NA' :

                                                                    formik?.values?.reportData?.[index]?.lifts ?? 'NA'}
                                                                disabled={(data?.equipment?.name.toLocaleLowerCase() === 'compactor') || data?.is_submitted}
                                                                error={(tableErrors?.[index]?.lifts && tableTouched?.[index]?.lifts) ? tableErrors?.[index]?.lifts : ''}
                                                            />
                                                        </div>
                                                        {data?.equipment?.name === 'Compactor' && <button type='button' onClick={() => onAddLifts(data, index)}><span className='text-primary cursor-pointer'><PlusCircle /></span></button>}
                                                    </div>
                                                </td>
                                                <td className='text-left'>{(data?.equipment?.name.toLocaleLowerCase() === 'compactor') ? 'NA' : approxWeightPerUnit.toFixed(2)}</td>
                                                <td className='text-left'>
                                                    <div className='w-28 table-input'>
                                                        <TextInput
                                                            placeholder={t('')}
                                                            name={`reportData.[${index}].approx_weight_per_month`}
                                                            onBlur={OnBlurWeights}
                                                            onChange={formik.handleChange}
                                                            required={true}
                                                            value={formik?.values?.reportData?.[index]?.approx_weight_per_month}
                                                            disabled={(data?.equipment?.name.toLocaleLowerCase() === 'compactor') || data?.is_submitted}
                                                            error={(tableErrors?.[index]?.approx_weight_per_month && tableTouched?.[index]?.approx_weight_per_month) ? tableErrors?.[index]?.approx_weight_per_month : ''}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {(returnTrueValueWeights((data?.getAllDiversionReports?.data?.count === 0 ||
                                data?.getAllDiversionReports?.data?.data === null),true,false)) && (
                                    <div className='flex justify-center'>
                                        <div>{t('No Data')}</div>
                                    </div>
                                )}
                        </div>
                    </div>
                    <div className='flex justify-between flex-wrap '>

                        {!data?.getAllDiversionReports?.data?.diversionReports[0].is_submitted && <div className="flex flex-wrap justify-start gap-2 mt-5 md:gap-5">
                            <button className="btn bg-default btn-primary btn-normal w-full xs:w-[160px] whitespace-nowrap "
                                title={`${t('Save as Draft')}`}
                                type='button'
                                onClick={onSaveDraft}
                                disabled={createLoader}
                            >Save as Draft</button>
                            <button className="btn bg-default btn-secondary btn-normal w-full xs:w-[160px] whitespace-nowrap " type="button" disabled={createLoader}
                                title={`${t('Confirm')}`} onClick={onConfirm}>Confirm</button>
                        </div>}
                        <div className='p-4 w-1/2 '>
                            {formik?.values?.fileName ? <div className='flex justify-between text-lg font-bold mb-4 truncate'>
                                <div className='break-words truncate'><span className='text-primary'>Invoice : </span>{formik?.values?.fileName}</div>  <Button className='bg-transparent cursor-pointer btn-default' onClick={onDeleteUploads} label={''} title={`${t('Delete')}`} disabled={data?.getAllDiversionReports?.data?.diversionReports[0].is_submitted} >
                                    <Trash className='fill-error' />
                                </Button>
                            </div> : ''}
                            {formik?.values?.docFileName ? <div className='flex justify-between text-lg font-bold truncate '>
                                <div className='break-words truncate '><span className='text-primary'>Document : </span>{formik?.values?.docFileName}</div> <Button className='bg-transparent cursor-pointer btn-default' onClick={onDeleteUploadsDoc} label={''} title={`${t('Delete')}`} disabled={data?.getAllDiversionReports?.data?.diversionReports[0].is_submitted} >
                                    <Trash className='fill-error' />
                                </Button>
                            </div> : ''}
                        </div>
                    </div>
                </form>

                {isAddMaterial && <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`${returnTrueValueWeights(isAddMaterial , '' , 'hidden')} fixed top-0 left-0 right-0 z-50 h-full bg-modal modal`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className="flex items-center justify-center h-full py-5 transition-all duration-300">
                        <div className='w-full mx-5 sm:max-w-[780px]'>
                            {/* <!-- Modal content --> */}
                            <div className='relative bg-white rounded-xl'>
                                {/* <!-- Modal header --> */}
                                <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                                    <p className='text-lg font-bold md:text-xl text-baseColor'>Add Other Material</p>
                                    <Button onClick={() => { setIsAddMaterial(false); formikAddWeights.resetForm() }} label={t('')} title={`${t('Close')}`}>
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
                                                    required={true} options={zoneDrpDown} error={getErrorWeights('zone_id')} />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    placeholder={t('Select Service Type')}
                                                    name='service_type'
                                                    id='service_type'
                                                    value={formikAddWeights?.values?.service_type}
                                                    label={t('Service Type')}
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
                                                    required={true} options={serviceTypeDrpDataWeights} error={getErrorWeights('service_type')} />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formikAddWeights?.values?.material_id}
                                                    name='material_id'
                                                    onChange={formikAddWeights.handleChange}
                                                    id='material_id'
                                                    label={t('Material Category')}
                                                    required={true} options={materialDrpData} error={getErrorWeights('material_id')} />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formikAddWeights?.values?.material_type_id}
                                                    name='material_type_id'
                                                    onChange={formikAddWeights.handleChange}
                                                    id='materail_type_id'
                                                    label={t('Material Type')}
                                                    required={true} options={materialTypeDrpData} error={getErrorWeights('material_type_id')} />
                                            </div>

                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formikAddWeights?.values?.equipment}
                                                    name='equipment'
                                                    onChange={onEquipmentChange}
                                                    id='equipment'
                                                    label={t('Equipment')}
                                                    required={true} options={equipmentDrpData} error={getErrorWeights('equipment')} />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formikAddWeights?.values?.frequency_id}
                                                    name='frequency_id'
                                                    onChange={formikAddWeights.handleChange}
                                                    id='frequency_id'
                                                    label={t('Frequency')}
                                                    required={true} disabled={formikAddWeights?.values?.service_type === 'Regular on call'} options={formikAddWeights?.values?.service_type === 'Regular on call' ? frequencyDrpData : frequencyDrpData?.filter((data) => data?.name !== '1')} error={getErrorWeights('frequency_id')} />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <DropDown
                                                    value={formikAddWeights?.values?.volume_name}
                                                    name='volume_name'
                                                    onChange={onVolumeChange}
                                                    id='volume_name'
                                                    label={t('Volume')}
                                                    required={true} options={volumeDrpData} error={getErrorWeights('volume_name')} />
                                            </div>

                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    placeholder={t('Add Units')}
                                                    value={formikAddWeights?.values?.add_units}
                                                    name='add_units'
                                                    onChange={formikAddWeights.handleChange}
                                                    label={t('Unit')}
                                                    required={true}
                                                    error={getErrorWeights('add_units')}
                                                    disabled={formikAddWeights?.values?.equipment.toLocaleLowerCase() === 'compactor' || formikAddWeights?.values?.service_type === 'Regular on call'}
                                                />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    placeholder={t('Add lifts')}
                                                    value={formikAddWeights?.values?.lifts}
                                                    name='lifts'
                                                    onChange={formikAddWeights.handleChange}
                                                    label={t('Lifts')}
                                                    required={true}
                                                    error={getErrorWeights('lifts')}
                                                    disabled={formikAddWeights?.values?.equipment.toLocaleLowerCase() === 'compactor' || formikAddWeights?.values?.service_type === 'Regular on call'}
                                                />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    value={formikAddWeights?.values?.approx_weight_per_unit}
                                                    placeholder={t('Add Weight')}
                                                    name='approx_weight_per_unit'
                                                    onChange={formikAddWeights.handleChange}
                                                    label={t('Approx Weight Per Unit (Autofill)')}
                                                    disabled={true}
                                                    required={true} 
                                                // error={formikAddWeights?.errors?.approx_weight_per_unit && formikAddWeights?.touched?.approx_weight_per_unit ? formikAddWeights?.errors?.approx_weight_per_unit : ''}
                                                />
                                            </div>
                                            <div className='max-sm:mb-3  sm:inline-block col-span-1'>
                                                <TextInput
                                                    value={formikAddWeights?.values?.approx_weight_per_month}
                                                    placeholder={t('Add Weight')}
                                                    onChange={formikAddWeights.handleChange}
                                                    name='approx_weight_per_month'
                                                    label={t('Weight Per month (Autofill)')}
                                                    required={true} disabled={formikAddWeights?.values?.equipment.toLocaleLowerCase() === 'compactor'}
                                                    error={formikAddWeights?.errors?.approx_weight_per_month && formikAddWeights?.values?.equipment.toLocaleLowerCase() !== 'compactor' && formikAddWeights?.touched?.approx_weight_per_month ? formikAddWeights?.errors?.approx_weight_per_month : ''}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                            <Button className={'btn-primary btn-normal w-full md:w-auto min-w-[160px]'} type='submit' label={t('Add')} title={`${t('Add')}`} />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

                {isShowlifts && <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`${returnTrueValueWeights(isShowlifts , '' , 'hidden')} fixed top-0 left-0 right-0 z-50 h-full bg-modal modal`}>
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
                                            <thead >
                                                <tr>
                                                    {COL_ARR_SERVICE4?.map((colValUser: ColArrType, index: number) => {
                                                        const key = colValUser.fieldName + index + 1;
                                                        return (
                                                            <th scope='col' key={key}>
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
                                                {formik?.values?.popupData?.length ? formik?.values?.popupData?.map((popData: { name: string, uuid: string, weight: number, date: Date | null }, index: number) => {
                                                    return (<tr key={`popupData-${index + 1}`}>
                                                        <td className='text-left whitespace-nowrap'>{popData?.name}</td>
                                                        <td className='text-left'>
                                                            <div className='flex items-center space-x-2.5'>
                                                                <div className='w-32 md:w-[8.75rem] table-input'>
                                                                    <DatePicker

                                                                        id={`formik?.values?.popupData?.[${index}]?.date`}
                                                                        selected={formik?.values?.popupData?.[index]?.date}
                                                                        onChange={(date: Date | null) => {
                                                                            formik.setFieldValue(`popupData.[${index}].date`, date)
                                                                        }}
                                                                        dateFormat="dd/MM/yyyy"
                                                                        placeholderText="dd/MM/yyyy"
                                                                        className='customInput disabled:cursor-not-allowed'
                                                                        disabled={data?.getAllDiversionReports?.data?.diversionReports[0].is_submitted}
                                                                        maxDate={new Date()}
                                                                    />
                                                                    {liftsErrors?.[index]?.date && liftsTouched?.[index]?.date ? <p className='error'>{liftsErrors?.[index]?.date as string}</p> : ''}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className='text-left'>
                                                            <div className='w-24 md:w-[7.5rem] table-input'>
                                                                <TextInput
                                                                    placeholder={t('')}
                                                                    required={true}
                                                                    id={`weight-${index}`}
                                                                    name={`popupData[${index}].weight`}
                                                                    onChange={formik.handleChange}
                                                                    value={formik?.values?.popupData?.[index]?.weight}
                                                                    error={(liftsErrors?.[index]?.weight && liftsTouched?.[index]?.weight) ? liftsErrors?.[index]?.weight : ''}
                                                                    disabled={data?.getAllDiversionReports?.data?.diversionReports[0].is_submitted}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button type="button" className='btn bg-transparent cursor-pointer btn-default' onClick={() => onDelete(index)} disabled={data?.getAllDiversionReports?.data?.diversionReports[0].is_submitted} ><Trash className='fill-error' /></button>
                                                        </td>
                                                    </tr>);
                                                }
                                                ) : null}
                                            </tbody>

                                        </table>
                                        {(returnTrueValueWeights((formik?.values?.popupData?.length === 0 ||
                                            formik?.values?.popupData === null),true,false)) && (
                                                <div className='flex justify-center'>
                                                    <div>{t('No Data')}</div>
                                                </div>
                                            )}
                                    </div>

                                    {!data?.getAllDiversionReports?.data?.diversionReports[0].is_submitted && <p className='p-5 pt-0 flex items-center space-x-2.5'>
                                        <button onClick={() => addNewLift()} type='button'><span className='text-primary cursor-pointer'><PlusCircle /></span></button>
                                        <span>Add New</span>
                                    </p>}

                                    <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                        {!data?.getAllDiversionReports?.data?.diversionReports[0].is_submitted && <Button className={'btn-primary btn-normal w-full md:w-auto min-w-[160px]'} label={t('Add')} title={`${t('Add')}`} type='submit'
                                            onClick={onAddTotalLifts}
                                        // disabled={!formik.values.popupData.length}
                                        />}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>}

                {isDelete && <CommonModel
                    warningText={DELETE_WARNING_TEXT}
                    onClose={onClose}
                    action={onRemove}
                    show={isDelete}
                />}
                {isDeleteDoc && <CommonModel
                    warningText={DELETE_WARNING_TEXT}
                    onClose={onClose}
                    action={onRemovedoc}
                    show={isDeleteDoc}
                />}
            </div > : <div className='flex justify-center items-center'>
                <p className='text-lg font-bold'><span className='error'>Note : </span>No records found</p>
            </div>}
        </>
    )
}

export default WeightList;