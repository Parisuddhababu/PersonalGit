import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textInput/TextInput';
import DropDown from '@components/dropdown/dropDown';
import { SettingsDrpData } from '@config/constant';
import Button from '@components/button/button';
import { useDispatch, useSelector } from 'react-redux';
import { setBackCreateNewAccountStep, setCreateNewAccountStep } from 'src/redux/courses-management-slice';
import { useFormik } from 'formik';
import useValidation from '@framework/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import { DropdownOptionType } from '@types';
import { useQuery } from '@apollo/client';
import { GET_COUNTRY } from '@framework/graphql/queries/subscriber';
import { userCreateEmployeeUserDetails } from 'src/redux/user-profile-slice';
import { CreateEmployeeData } from 'src/types/common';
import { GET_ACTIVE_ROLES_DATA } from '@framework/graphql/queries/role';
import { StateDataArr } from '@framework/graphql/graphql';
import { DropdownArrowDown } from '@components/icons/icons';

function UserDetails () {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { userDetails } = useValidation();
    const { data } = useQuery(GET_COUNTRY);
    const searchParams = new URLSearchParams(window.location.search);
    const employeesUserListPage = searchParams.get('employees-user-list');
    const tenantDetailsPage = searchParams.get('tenant-details-page');
    const contractorDetailsPage = searchParams.get('contractor-details-page');
    const [countryDrpData, setCountryDrpData] = useState<DropdownOptionType[]>([]);
    const { createEmployeeUserDetails } = useSelector((state: { userProfile: CreateEmployeeData }) => state.userProfile);
    const initialValues = {
        // pronounce: '',
        first_name: '',
        last_name: '',
        email: '',
        country_code: '',
        phone_number: '',
        preferred_language: '',
        role_id: '',
    };
    const [roleDrpData, setRoleDrpData] = useState<DropdownOptionType[]>([]);
    const { data: getRolesData } = useQuery(GET_ACTIVE_ROLES_DATA, { variables: { limit: 500, page: 1, search: '', sortOrder: '', sortField: 'name' } });

    useEffect(() => {
        const tempDataArr = [] as DropdownOptionType[];
        data?.getCountries?.data?.map((data: { phoneCode: number, uuid: string }) => {
            tempDataArr.push({ name: `+${data?.phoneCode}`, key: data?.uuid });
        });
        setCountryDrpData(tempDataArr);
    }, [data])

    useEffect(() => {
        const tempDataArr = [] as DropdownOptionType[];
        getRolesData?.getActiveRoles?.data?.role?.map((data: StateDataArr) => {
            tempDataArr.push({ name: data?.name, key: data?.uuid });
        });
        setRoleDrpData(tempDataArr);
    }, [getRolesData])

    const formik = useFormik({
        initialValues,
        validationSchema: userDetails,
        onSubmit: (values) => {
            dispatch(setCreateNewAccountStep());
            dispatch(userCreateEmployeeUserDetails(values));
        },
    });

    useEffect(() => {
        if (typeof createEmployeeUserDetails === 'object' && Object.keys(createEmployeeUserDetails).length !== 0) {
            formik.resetForm({ values: createEmployeeUserDetails })
        }
    }, [createEmployeeUserDetails])


    const onBackPage = useCallback(() => {
        dispatch(setBackCreateNewAccountStep());
    }, [])

    const OnBlurBanner = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);
    return (
        <>
            <div>
                <h6 className='mb-5 text-center lg:mb-7'>{t('User Details')}</h6>
                <div className='flex flex-wrap gap-3 lg:gap-5'>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                        <DropDown placeholder={t('Role')} className='w-full' label={t('Assigned Role')} inputIcon={<span className='text-xs'><DropdownArrowDown className='fill-dark-grey' /></span>} onChange={formik.handleChange} value={formik.values.role_id} options={roleDrpData} name='role_id' id='role_id' error={formik.errors.role_id && formik.touched.role_id ? formik.errors.role_id : ''} required={true} />
                    </div>
                    <div className="w-full relative lg:w-[calc(50%-10px)]">
                        {/* <label >{t('Pronouns First Name')}
                            <span className='text-red-500'> *</span>
                        </label> */}

                        <div className='flex'>
                            {/* <DropDown placeholder={t('Pronouns')} className='min-w-[116px] md:min-w-[123px]' onChange={formik.handleChange} value={formik.values.pronounce} options={PronounceDrpData} name='pronounce' id='pronounce' error={formik.errors.pronounce && formik.touched.pronounce ? formik.errors.pronounce : ''} /> */}
                            <TextInput className='w-full' label={t('First Name')} placeholder={t('Enter First Name')} type='text' id='first_name' name='first_name' value={formik.values.first_name} onChange={formik.handleChange} required={true} error={formik.errors.first_name && formik.touched.first_name && formik.errors.first_name} onBlur={OnBlurBanner} />
                        </div>
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                        <TextInput placeholder={t('Enter Last Name')} type='text' id='last_name' name='last_name' label={t('Last Name')} value={formik.values.last_name} onChange={formik.handleChange} required={true} error={formik.errors.last_name && formik.touched.last_name && formik.errors.last_name} onBlur={OnBlurBanner} />
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                        <TextInput placeholder={t('Enter Email ID')} type='text' id='email' name='email' label={t('Email ID')} value={formik.values.email} onChange={formik.handleChange} required={true} error={formik.errors.email && formik.touched.email && formik.errors.email} onBlur={OnBlurBanner} />
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                        <label >{t('Mobile Number')}

                        </label>
                        <div className='flex'>
                            <DropDown placeholder={t('Code')} className='min-w-[96px]' onChange={formik.handleChange} value={formik.values.country_code} options={countryDrpData} name='country_code' id='country_code' error={formik.errors.country_code && formik.touched.country_code ? formik.errors.country_code : ''} />
                            <TextInput placeholder={t('Enter Mobile Number')} className='w-full' type='tel' id='phone_number' name='phone_number' value={formik.values.phone_number} onChange={formik.handleChange} error={formik.errors.phone_number && formik.touched.phone_number && formik.errors.phone_number } onBlur={OnBlurBanner} />
                        </div>
                    </div>
                    <div className="w-full lg:w-[calc(50%-10px)]">
                        <DropDown placeholder={t('Language')} className='w-full' label={t('Preferred Language')} onChange={formik.handleChange} value={formik.values.preferred_language} options={SettingsDrpData} name='preferred_language' id='preferred_language' error={formik.errors.preferred_language && formik.touched.preferred_language ? formik.errors.preferred_language : ''} />

                    </div>

                </div>
            </div>
            <div className={`flex ${(employeesUserListPage || tenantDetailsPage || contractorDetailsPage) ? 'justify-end' : 'justify-between'} gap-5 mt-10`}>
                {(!employeesUserListPage && !tenantDetailsPage && !contractorDetailsPage) && <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onBackPage()} label={t('Back')} />}
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => formik.handleSubmit()} label={t('Next')}  title={`${t('Next')}`}  />
            </div>
        </>
    )
}

export default UserDetails

