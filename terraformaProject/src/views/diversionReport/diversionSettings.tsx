import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import DropDown from '@components/dropdown/dropDown';
import UpdatedHeader from '@components/header/updatedHeader';
import { Map } from '@components/icons/icons';
import { DatesDrpDown, FrequencyDropdown, MonthQuarterDrpDown, MonthYearDrpDown, USER_TYPE } from '@config/constant';
import { GET_DIVERSION_REPORT_SETTING_BY_ID, UPDATE_DIVERSION_REPORT_SETTINGS } from '@framework/graphql/queries/diversionSetting';
import { GET_ALL_LOCATIONS } from '@framework/graphql/queries/location';
import useValidation from '@framework/hooks/validations';
import { FormikErrors, FormikTouched, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { UserProfileType } from 'src/types/common';
import { DropdownOptionType } from 'src/types/component';
import { GetAllLocations } from 'src/types/diversionReporttemplate';
import {  useSearchParams } from 'react-router-dom';
import { conditionReturnFun } from '@utils/helpers';
import { DiversionSettingsData } from 'src/types/diversionReport';

const DiversionSettings = () => {
    const { t } = useTranslation();
    const [params]=useSearchParams();
    const [branchDrpData, setBranchDrpData] = useState<DropdownOptionType[]>([]);
    const { userProfileData: userData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const [upadteDiversionReportSettings, { loading: upadteDiversionReportSettingsLoadingState }] = useMutation(UPDATE_DIVERSION_REPORT_SETTINGS);
    const [getDiversionReportSettingById] = useMutation(GET_DIVERSION_REPORT_SETTING_BY_ID);
    const { data: getAllLocations, loading } = useQuery(GET_ALL_LOCATIONS, { fetchPolicy: 'network-only', skip: userData?.getProfile?.data?.user_type ===USER_TYPE.SUPER_ADMIN });
    const { diversionSettingsValidationSchema } = useValidation();
    const location= params.get('locationId');

    /**
     * Method used set dropdown data for location
     */
    useEffect(() => {
        if (getAllLocations?.getLocations?.data && location!==null) {
            setBranchDrpData(getAllLocations?.getLocations?.data?.map((data: GetAllLocations) => {
                return { name: data?.location, key: data?.uuid, uuid: data?.uuid }
            }));
            getDiversionReportSettingById({
                variables: {
                    locationId: location
                }
            }).then((res) => {
                const data = res?.data?.getDiversionReportSettingById?.data;
                formik.setValues({
                    diversionSettingsData: {
                        end_date: conditionReturnFun(data?.end_date),
                        end_month: conditionReturnFun(data?.end_month),
                        frequency: conditionReturnFun(data?.frequency),
                        location_id: conditionReturnFun(location),
                        start_date: conditionReturnFun(data?.start_date),
                        start_month: conditionReturnFun(data?.start_month)
                    }
                })
            
            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
        }
            if( getAllLocations?.getLocations?.data && location===null&&!userData?.getProfile?.data?.branch_locations?.length){

                setBranchDrpData(getAllLocations?.getLocations?.data?.map((data: GetAllLocations) => {
                    return { name: data?.location, key: data?.uuid, uuid: data?.uuid }
                }));
                if(getAllLocations?.getLocations?.data?.[0]?.uuid){
                    getDiversionReportSettingById({
                        variables: {
                            locationId: getAllLocations?.getLocations?.data?.[0]?.uuid
                        }
                    }).then((res) => {
                        const data = res?.data?.getDiversionReportSettingById?.data;
                        formik.setValues({
                            diversionSettingsData: {
                                end_date: conditionReturnFun(data?.end_date),
                                end_month: conditionReturnFun(data?.end_month),
                                frequency: conditionReturnFun(data?.frequency),
                                location_id: location??'',
                                start_date: conditionReturnFun(data?.start_date),
                                start_month: conditionReturnFun(data?.start_month)
                            }
                        })
                        formik.setFieldValue('diversionSettingsData.location_id',getAllLocations?.getLocations?.data?.[0]?.uuid);
                    
                    }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
                }
            }
            if( getAllLocations?.getLocations?.data && location===null&&userData?.getProfile?.data?.branch_locations?.length){

                setBranchDrpData(getAllLocations?.getLocations?.data?.map((data: GetAllLocations) => {
                    return { name: data?.location, key: data?.uuid, uuid: data?.uuid }
                }));
                getDiversionReportSettingById({
                    variables: {
                        locationId: userData?.getProfile?.data?.branch_locations?.[0]?.uuid
                    }
                }).then((res) => {
                    const data = res?.data?.getDiversionReportSettingById?.data;
                    formik.setValues({
                        diversionSettingsData: {
                            end_date: conditionReturnFun(data?.end_date),
                            end_month: conditionReturnFun(data?.end_month),
                            frequency: conditionReturnFun(data?.frequency),
                            location_id: location??'',
                            start_date: conditionReturnFun(data?.start_date),
                            start_month: conditionReturnFun(data?.start_month)
                        }
                    })
                    formik.setFieldValue('diversionSettingsData.location_id',userData?.getProfile?.data?.branch_locations?.[0]?.uuid);
                
                }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
            }
        
      
    }, [getAllLocations?.getLocations]);

    const initialValues = {
        diversionSettingsData: {
            end_date: '',
            end_month: '',
            frequency: '',
            location_id: '',
            start_date: '',
            start_month: ''
        }
    }

    const formik = useFormik({
        initialValues,
        validationSchema: diversionSettingsValidationSchema,
        onSubmit: (values) => {
            if (values?.diversionSettingsData?.location_id !== '') {
                upadteDiversionReportSettings({
                    variables: {
                        diversionSettingsData: {
                            end_date: values?.diversionSettingsData?.end_date,
                            end_month: values?.diversionSettingsData?.frequency !== 'Monthly' ? values?.diversionSettingsData?.end_month : '',
                            frequency: values?.diversionSettingsData?.frequency,
                            location_id: values?.diversionSettingsData?.location_id,
                            start_date: values?.diversionSettingsData?.start_date,
                            start_month: values?.diversionSettingsData?.frequency !== 'Monthly' ? values?.diversionSettingsData?.start_month : '',
                        }
                    }
                }).then((res) => {
                    toast.success(res?.data?.updateDiversionReportSettings?.message);
                }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
            } else {
                toast.error('Please select location');
            }
        }
    });

    const headerActionConst = () => {
        return (
            <>
                {
                    <div className={`flex w-full gap-3 xmd:gap-5 lg:w-auto ${loading ? 'pointer-events-none' : ''}`}>
                        <DropDown id='userLocation' className='w-[212px] -mt-2 max-md:mr-2' label='' inputIcon={<Map fontSize='18' />} name='diversionSettingsData.location_id' onChange={formik.handleChange} value={formik?.values?.diversionSettingsData?.location_id} error={formik?.errors?.diversionSettingsData?.location_id} options={branchDrpData} disabled={userData?.getProfile?.data?.user_type !== USER_TYPE.SUBSCRIBER_ADMIN} />
                    </div>
                }
            </>
        )
    }

    useEffect(() => {
        if (formik?.values?.diversionSettingsData?.location_id !== '') {
            getDiversionReportSettingById({
                variables: {
                    locationId: formik?.values?.diversionSettingsData?.location_id
                }
            }).then((res) => {
                const data = res?.data?.getDiversionReportSettingById?.data;
                    formik.setValues({
                        diversionSettingsData: {
                            end_date:conditionReturnFun(data?.end_date),
                            end_month: conditionReturnFun(data?.end_month),
                            frequency: conditionReturnFun(data?.frequency),
                            location_id: conditionReturnFun(formik?.values?.diversionSettingsData?.location_id),
                            start_date: conditionReturnFun(data?.start_date),
                            start_month: conditionReturnFun(data?.start_month),
                        }
                    })
                
            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));

        }
    }, [formik?.values?.diversionSettingsData?.location_id])

    const onClear =useCallback(()=>{
     formik.setFieldValue( 'diversionSettingsData.end_date', '');
     formik.setFieldValue(  'diversionSettingsData.end_month' ,'');
     formik.setFieldValue( 'diversionSettingsData.frequency' ,'');
     formik.setFieldValue( 'diversionSettingsData.start_date', '');
     formik.setFieldValue( 'diversionSettingsData.start_month', '');
    },[])
    
    const diversionSettingsErrors = formik?.errors?.diversionSettingsData as FormikErrors<DiversionSettingsData>;
    const diversionSettingsTounched = formik?.touched?.diversionSettingsData as FormikTouched<DiversionSettingsData>;
    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} headerTitle='Report Frequency' />

            <div>
                <div className='bg-accents-2 border border-border-primary rounded-xl p-3 md:p-5 mb-7 flex justify-between items-center gap-3 flex-wrap'>
                    <div className='w-full max-w-[360px]'>
                        <form onSubmit={formik.handleSubmit}>
                            <div className='w-full mb-3 md:mb-5'>
                                <DropDown
                                    name='diversionSettingsData.frequency'
                                    id='frequency'
                                    label={'Frequency'}
                                    value={formik?.values?.diversionSettingsData?.frequency}
                                    onChange={formik.handleChange}
                                    options={FrequencyDropdown}
                                    error={diversionSettingsErrors?.frequency&&diversionSettingsTounched?.frequency?diversionSettingsErrors?.frequency:''}
                                />
                            </div>
                            <div className='grid grid-cols-1 gap-3 items-end'>
                                <label className='mb-0' htmlFor='starting' >Starting From</label>
                                <div id='starting' className='w-full flex gap-4'>
                                    {formik?.values?.diversionSettingsData?.frequency !== 'Monthly' && <div className='w-full'>
                                        <DropDown
                                            name='diversionSettingsData.start_month'
                                            id='start_month'
                                            value={formik?.values?.diversionSettingsData?.start_month}
                                            onChange={formik.handleChange}
                                            options={formik?.values?.diversionSettingsData?.frequency !== 'Quarterly' ? MonthYearDrpDown : MonthQuarterDrpDown}
                                            error={diversionSettingsErrors?.start_month&&diversionSettingsTounched?.start_month?diversionSettingsErrors?.start_month:''}
                                        />
                                    </div>}
                                    <div className='w-full '>
                                        <DropDown
                                            name='diversionSettingsData.start_date'
                                            id='start_date'
                                            value={formik?.values?.diversionSettingsData?.start_date}
                                            onChange={formik.handleChange}
                                            options={DatesDrpDown}
                                            error={diversionSettingsErrors?.start_date&&diversionSettingsTounched?.start_date?diversionSettingsErrors?.start_date:''}
                                        />
                                    </div>
                                </div>
                                <label className='mb-0' htmlFor='closes' >Closes On</label>
                                <div id='closes' className='w-full flex gap-4'>
                                    {formik?.values?.diversionSettingsData?.frequency !== 'Monthly' && <div className='w-full'>
                                        <DropDown
                                            name='diversionSettingsData.end_month'
                                            id='close_month'
                                            value={formik?.values?.diversionSettingsData?.end_month}
                                            onChange={formik.handleChange}
                                            options={formik?.values?.diversionSettingsData?.frequency !== 'Quarterly' ? MonthYearDrpDown : MonthQuarterDrpDown}
                                            error={diversionSettingsErrors?.end_month&&diversionSettingsTounched?.end_month?diversionSettingsErrors?.end_month:''}
                                        />
                                    </div>}
                                    <div className='w-full'>
                                        <DropDown
                                            name='diversionSettingsData.end_date'
                                            id='close_date'
                                            value={formik?.values?.diversionSettingsData?.end_date}
                                            onChange={formik.handleChange}
                                            options={DatesDrpDown}
                                            error={diversionSettingsErrors?.end_date&&diversionSettingsTounched?.end_date?diversionSettingsErrors?.end_date:''}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="flex flex-wrap justify-start gap-2 mt-5 md:gap-5">
                    <button className="btn bg-default btn-primary btn-normal w-full xs:w-[160px] whitespace-nowrap " type="button" onClick={() => formik.handleSubmit()} disabled={upadteDiversionReportSettingsLoadingState} >{t('Save')}</button>
                    <button className="btn bg-default btn-secondary btn-normal w-full xs:w-[160px] whitespace-nowrap " type="button" onClick={onClear}>{t('Clear All')}</button>
                </div>
            </div>

        </>
    );
}

export default DiversionSettings;