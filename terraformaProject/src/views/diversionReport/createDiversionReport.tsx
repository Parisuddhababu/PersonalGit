import Button from '@components/button/button';
import DropDown from '@components/dropdown/dropDown';
import UpdatedHeader from '@components/header/updatedHeader';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textInput/TextInput';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_DIVERSION_CONTRACTORS_SERVICES, GET_COMPANY_CONTRACTOR_USERS } from '@framework/graphql/queries/createDiversionReport';
import { useDispatch, useSelector } from 'react-redux';
import { DiversionContractorType, setCreateDiversionReportTableViewData, setDeleteDiversionReportTableViewData, setFrequecyId, setIsOpenDiversionTemplateSelectionPopup, setLocationId, setResetCreateDiversionReportTableViewData, setResetDeleteIds, setResetSelectionIds, setSelectedTemplateIds } from 'src/redux/diversion-contractor-slice';
import { DropdownOptionType } from '@types';
import AddServiceFromTemplate from '@views/diversionContractors/addServiceFromTemplate';
import { useSearchParams } from 'react-router-dom';
import { GET_ZONES_BY_ID } from '@framework/graphql/mutations/zoneManagement';
import { toast } from 'react-toastify';
import { GET_FREQUENCIES } from '@framework/graphql/queries/frequencyManagement';
import { FrequencyDataRes } from '@views/frequencyManagement';
import { FormikErrors, FormikTouched, useFormik } from 'formik';
import useValidation from '@framework/hooks/validations';
import { CREATE_DIVERSION_CONTRACTOR_SERVICE, DELETE_DIVERSION_CONTRACTOR_SERVICE } from '@framework/graphql/mutations/createDiversionReport';
import { whiteSpaceRemover } from '@utils/helpers';
import Loader from '@components/common/loader';
import { ColArrType, DiversionReportServicesListRes, InitialValuesCreateDiversionReport, contractorsDrpDownListRes } from 'src/types/diversionContractors';
import { Trash } from '@components/icons/icons';



const CreateDiversionReport = () => {
    const { t } = useTranslation();
    const contractorsDetails = useSelector(((state: { diversionContractors: DiversionContractorType }) => state.diversionContractors));
    const [zonesDrpDown, setZonesDrpDown] = useState<DropdownOptionType[]>([]);
    const dispatch = useDispatch();
    const [params] = useSearchParams();
    const companyId = params.get('companyId');
    const locationId = params.get('locationId');
    const companyName= params.get('companyName');
    const COL_ARR_SERVICE = [
        { name: t('Select Zone'), sortable: false },
        { name: t('Service Type'), sortable: false },
        { name: t('Material Category'), sortable: false, fieldName: 'Material Category' },
        { name: t('Material Type'), sortable: true, fieldName: 'Material Type' },
        { name: t('Equipment'), sortable: true, fieldName: 'Equipment' },
        { name: t('Volume'), sortable: true, fieldName: 'Volume' },
        { name: t('Add Unit'), sortable: true, fieldName: 'Add Unit' },
        { name: t('Select Frequency'), sortable: true, fieldName: 'Select Frequency' },

    ] as ColArrType[];
    const { data } = useQuery(GET_COMPANY_CONTRACTOR_USERS, {
        fetchPolicy: 'network-only', skip: (!companyId || !locationId), variables: {
            companyId: companyId,
            locationId: locationId
        }
    });
    const { data: getAllDiversionContractorServices } = useQuery(GET_ALL_DIVERSION_CONTRACTORS_SERVICES, {
        fetchPolicy: 'network-only', skip: !companyId, variables: {
            companyId: companyId,
            locationId: locationId,
            limit: 10,
            page: 1,
        }
    });
    const [createDiversionServiceMutation, { loading: createLoader }] = useMutation(CREATE_DIVERSION_CONTRACTOR_SERVICE);
    const [deleteDiversionServiceMuatation, { loading: deleteLoader }] = useMutation(DELETE_DIVERSION_CONTRACTOR_SERVICE);
    const { data: frequencies } = useQuery(GET_FREQUENCIES, { fetchPolicy: 'network-only' });
    const [zones] = useMutation(GET_ZONES_BY_ID);
    const [contractorDropDownData, setContractorDropDownData] = useState<DropdownOptionType[]>([{ name: 'Select Report Owner', key: '' }]);
    const [frequecyDropDownData, setFrequecyDropDownData] = useState<DropdownOptionType[]>([{ name: 'Select Frequency', key: '' }]);
    const { createDiversionReportValidationSchema } = useValidation();
    const initialValues: { user_id: string; serviceData: InitialValuesCreateDiversionReport[] } = {
        user_id: '',
        serviceData: []
    }

    const formik = useFormik({
        initialValues,
        validationSchema: createDiversionReportValidationSchema,
        onSubmit: async (values) => {
            const reqData = contractorsDetails?.createDiversionReportTableViewData?.map((data, index: number) => {
                if (!contractorsDetails?.deleteServiceIds.includes(data?.uuid) || data?.uuid == '') {
                    return {
                        add_units: +values?.serviceData?.[index]?.add_units,
                        user_id: values?.user_id,
                        company_id: companyId,
                        frequency_id: values?.serviceData?.[index]?.frequency_id,
                        location_id: locationId,
                        template_id: data?.diversion_report_template?.uuid,
                        zone_id: values?.serviceData?.[index]?.zone_id !== 'full_site' ? values?.serviceData?.[index]?.zone_id : '',
                        service_id: data?.uuid ?? ''
                    }
                }
            })
            if (reqData) {
                try {
                    const response = await deleteDiversionServiceMuatation({ variables: { serviceId: contractorsDetails?.deleteServiceIds } });
                    dispatch(setResetDeleteIds([]));
                    if (response?.data?.deleteDiversionContractorService?.message) {
                        const response = await createDiversionServiceMutation({ variables: { serviceData: reqData } });
                        toast.success(response?.data?.createDiversionContractorService?.message);
                    }
                }
                catch (err  ) {
                    toast.error((err as {networkError:{result:{errors:[{message:string}]}}}).networkError.result.errors[0].message);
                }
            }
        }
    })

    useEffect(() => {
        dispatch(setResetCreateDiversionReportTableViewData([]))
        if (locationId) {
            dispatch(setLocationId(locationId));
            zones({
                variables: {
                    siteId: locationId,
                }
            }).then((res) => {
                setZonesDrpDown(() => {
                    const dropDownValues = res?.data?.getZoneBySiteId?.data?.map((zone: { location: string, diversion_percentage: number, uuid: string },) => {
                        return {
                            name: zone?.location,
                            key: zone?.uuid,
                        };
                    })
                        return [{name:'Select Zone'},{ name: 'Full Site', key: 'full_site' }, ...dropDownValues];
                    
                })
            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message))
        }
    }, []);

    useEffect(() => {
        if (getAllDiversionContractorServices?.getAllDiversionContractorServices) {
            const frequency_id = frequencies?.getFrequencies?.data?.filter((frequency: FrequencyDataRes) => frequency?.frequency_type=='1');
            const response = getAllDiversionContractorServices?.getAllDiversionContractorServices?.data?.contractorServices as DiversionReportServicesListRes[];
            getAllDiversionContractorServices?.getAllDiversionContractorServices?.data?.contractorServices?.forEach((data: DiversionReportServicesListRes, index: number) => {
                formik.setFieldValue('user_id', data?.user?.uuid)
                if (data?.is_full_site) {
                    formik.setFieldValue(`serviceData.[${index}].zone_id`, 'full_site')
                } else {
                    formik.setFieldValue(`serviceData.[${index}].zone_id`, data?.zone?.uuid)
                }
                if(data?.diversion_report_template?.service_type==='Regular on call'){
                    formik.setFieldValue(`serviceData.[${index}].frequency_id`,frequency_id?.[0]?.uuid)
                }else{
                    formik.setFieldValue(`serviceData.[${index}].frequency_id`, data?.frequency?.uuid)
                }
                formik.setFieldValue(`serviceData.[${index}].add_units`, data?.add_units)
            })
            if(getAllDiversionContractorServices?.getAllDiversionContractorServices?.data?.contractorServices?.length){

                dispatch(setSelectedTemplateIds(getAllDiversionContractorServices?.getAllDiversionContractorServices?.data?.contractorServices?.map((data: DiversionReportServicesListRes) => {
                    return data?.diversion_report_template?.uuid;
                })))
            }else{
                dispatch(setResetSelectionIds([]));
            }
            dispatch(setCreateDiversionReportTableViewData(response));
        }
    }, [getAllDiversionContractorServices?.getAllDiversionContractorServices])
    
    useEffect(() => {
        if (data?.getCompanyContractorUsers) {
            setContractorDropDownData(() => {
                const dropdownValues = data?.getCompanyContractorUsers?.data?.map((data: contractorsDrpDownListRes) => {
                    return { name: `${data?.first_name} ${data?.last_name}`, key: data?.uuid, uuid: data?.uuid };
                });
                return [{ name: 'Select Report Owner', key: '' }, ...dropdownValues];
            });
        }
        if (frequencies?.getFrequencies) {
            setFrequecyDropDownData(() => {
                const dropdownValues = frequencies?.getFrequencies?.data?.map((data: FrequencyDataRes) => {
                    if(data?.frequency_type=='1'){
                        dispatch(setFrequecyId(data?.uuid));
                    }
                    return { name: data?.frequency_type, key: data?.uuid, uuid: data?.uuid };
                });
                return [{ name: 'Select Frequency', key: '' }, ...dropdownValues];
            })
        }
    }, [data?.getCompanyContractorUsers, frequencies])

    const onAddNewSeviceTemplate = useCallback(() => {
        dispatch(setIsOpenDiversionTemplateSelectionPopup(true));
    }, [formik?.values]);

    const onDelete = useCallback((data: DiversionReportServicesListRes,index:number) => {
        dispatch(setDeleteDiversionReportTableViewData({ templateId: data?.diversion_report_template?.uuid, serviceId: data?.uuid ,index:index}));
        const serviceData = formik?.values?.serviceData?.filter((_,dataIndex)=>dataIndex!==index);
        if(serviceData){
            formik.setFieldValue('serviceData',serviceData);
        }
    }, [contractorsDetails]);   

    const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);

    useEffect(() => {
        if (contractorsDetails?.createDiversionReportTableViewData) {
            const frequency_id = frequencies?.getFrequencies?.data?.filter((frequency: FrequencyDataRes) => frequency?.frequency_type=='1');
            formik.setFieldValue('serviceData', contractorsDetails?.createDiversionReportTableViewData?.map((data,index) => {
                return { zone_id: formik?.values?.serviceData?.[index]?.zone_id , add_units: formik?.values?.serviceData?.[index]?.add_units??0, frequency_id:data?.diversion_report_template?.service_type==='Regular on call'?frequency_id?.[0]?.uuid: formik?.values?.serviceData?.[index]?.frequency_id };
            }))
        }

    }, [contractorsDetails?.createDiversionReportTableViewData])

    const createReportErrors = formik?.errors?.serviceData as FormikErrors<InitialValuesCreateDiversionReport>[];
    const createReportTounched = formik?.touched?.serviceData as FormikTouched<InitialValuesCreateDiversionReport>[];
    return (
        <>
            <UpdatedHeader headerTitle='Create Diversion Report' />
            {(createLoader || deleteLoader) && <Loader />}
            <div>
                <div className='w-full overflow-hidden bg-accents-2 border border-border-primary rounded-xl'>
                    <div className='px-3 py-5 border-b border-solid md:px-5 border-border-primary '>
                        <h6>{companyName}</h6>
                    </div>
                    <div className='px-3 py-2.5 md:px-5' >
                        <div className='flex items-end flex-wrap sm:flex-nowrap justify-between w-full space-y-3'>
                            <div className='w-full xs:w-64 sm:max-w-[360px]'>
                                <DropDown
                                    name='user_id'
                                    id='user_id'
                                    label={t('Report Owner')}
                                    value={formik?.values?.user_id}
                                    onChange={formik.handleChange}
                                    options={contractorDropDownData} error={formik?.errors?.user_id && formik?.touched?.user_id ? formik?.errors?.user_id : ''} disabled={!locationId} />
                            </div>
                            <Button type='button' className='btn-secondary btn-normal whitespace-nowrap w-full xs:w-auto' onClick={onAddNewSeviceTemplate} label={''} disabled={!locationId}>
                                {t('+ Add Services from Template')}
                            </Button>
                        </div>
                    </div>
                    <div className='px-3 py-2.5 md:px-5' >
                        <h6 className='mb-3 md:mb-5'>Service List</h6>
                        <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                            <table>
                                <thead >
                                    <tr>
                                        {COL_ARR_SERVICE?.map((colValUser: ColArrType,index:number) => {
                                            const key = index;
                                            return (

                                                <th scope='col' key={key}>
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
                                    {contractorsDetails?.createDiversionReportTableViewData?.map((data: DiversionReportServicesListRes, index: number) => {
                                        const keyProp = index;
                                        return (<tr key={keyProp}>
                                            <td>
                                                <div className='w-[7.875rem]'>
                                                    <DropDown
                                                        name={`serviceData.[${index}].zone_id`}
                                                        id='reportOwner'
                                                        value={formik?.values?.serviceData?.[index]?.zone_id}
                                                        onChange={formik.handleChange}
                                                        options={zonesDrpDown} error={createReportErrors?.[index]?.zone_id && createReportTounched?.[index]?.zone_id ? createReportErrors?.[index]?.zone_id : ''} />
                                                </div>
                                            </td>
                                            <td className='text-left'>{data?.diversion_report_template?.service_type}</td>
                                            <td className='text-left'>{data?.diversion_report_template?.material?.name}</td>
                                            <td className='text-left'>{data?.diversion_report_template?.material_type?.type}</td>
                                            <td className='text-left'>{data?.diversion_report_template?.equipment?.name}</td>
                                            <td className='text-left'>{data?.diversion_report_template?.volume?.volume}</td>
                                            <td>
                                                <div className='w-[7.875rem]'>
                                                    <TextInput
                                                        name={`serviceData.[${index}].add_units`}
                                                        value={formik?.values?.serviceData?.[index]?.add_units}
                                                        onChange={formik.handleChange}
                                                        onBlur={onBlur}
                                                        placeholder={t('Unit')}
                                                        required={true}
                                                        disabled={data?.diversion_report_template?.service_type === 'Regular on call'||data?.diversion_report_template?.equipment?.name.toLocaleLowerCase()==='compactor'}
                                                        error={createReportErrors?.[index]?.add_units && createReportTounched?.[index]?.add_units ? createReportErrors?.[index]?.add_units : ''}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className='w-[7.875rem]'>
                                                    <DropDown
                                                        name={`serviceData.[${index}].frequency_id`}
                                                        id='reportOwner'
                                                        value={formik?.values?.serviceData?.[index]?.frequency_id}
                                                        onChange={formik.handleChange}
                                                        disabled={data?.diversion_report_template?.service_type==='Regular on call'}
                                                        options={frequecyDropDownData} error={createReportErrors?.[index]?.frequency_id && createReportTounched?.[index]?.frequency_id ? createReportErrors?.[index]?.frequency_id : ''} />
                                                </div>
                                            </td>
                                            <td className='text-left'>
                                                <div className='btn-group'>
                                                <button type="button" className='btn bg-transparent cursor-pointer btn-default' onClick={() => onDelete(data,index)}  ><Trash className='fill-error' /></button>
                                                </div>
                                            </td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                            {(contractorsDetails?.createDiversionReportTableViewData?.length === 0 ||
                                contractorsDetails?.createDiversionReportTableViewData?.length === null) && (
                                    <div className='flex justify-center'>
                                        <div>{t('No Data')}</div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-end'>
                    <div className="flex flex-wrap justify-start gap-2 mt-4 md:gap-5">
                        <button className="btn bg-default btn-secondary btn-normal w-full xs:w-[160px] whitespace-nowrap " type="submit"
                            title={`${t('Confirm')}`} onClick={() =>  formik?.handleSubmit()} disabled={createLoader || deleteLoader || !locationId} >Confirm</button>
                    </div>
                </div>
            </div>
            {contractorsDetails.isOpenDiversionTemplateSelectionPopup && <AddServiceFromTemplate />}
        </>
    );
}

export default CreateDiversionReport;