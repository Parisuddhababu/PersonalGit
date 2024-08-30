import React, { useCallback, useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { useDispatch, useSelector } from 'react-redux';
import { setBackCreateNewAccountStep, setCreateNewAccountStep } from 'src/redux/courses-management-slice';
import { DropdownOptionType } from '@types';
import { useQuery } from '@apollo/client';
import useValidation from '@framework/hooks/validations'
import { setCreateTenantPersonalDetails } from 'src/redux/user-profile-slice';
import { CompanyOrTenantDetailsType, UserProfileType } from 'src/types/common';
import { GET_REPORTING_MANAGERS } from '@framework/graphql/queries/role';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { AUTHORIZE_PERSON_USER_TYPE } from '@config/constant';

function AuthorizedPersonDetails() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const queryParams = new URLSearchParams(location.search);
    const companyId = queryParams.get('company_uuid');
    const branchId = queryParams.get('branch_id');
    const { authorizedPersonSchema } = useValidation();
    const { createTenantPersonalDetail, companyDetails, createTenantDetails, createContractorDetails } = useSelector((state: { userProfile: CompanyOrTenantDetailsType }) => state.userProfile);
    const branchIdArray = [] as string[];
    const editTenantCompany = queryParams.get('edit-tenant-company');
    const editContractorCompany = queryParams.get('edit-contractor-company');

    createTenantDetails?.company_branch_id?.forEach((item: { key: string }) => {
        branchIdArray.push(item.key);
    });

    const branchIdContractorArray = [] as string[];
    createContractorDetails?.company_branch_id?.forEach((item: { key: string }) => {
        branchIdContractorArray.push(item?.key);
    });

    const userContractorDataType = editContractorCompany ? AUTHORIZE_PERSON_USER_TYPE.CONTRACTOR : AUTHORIZE_PERSON_USER_TYPE.USER;
    const userDataType = editTenantCompany ? AUTHORIZE_PERSON_USER_TYPE.TENANT : userContractorDataType;
	const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));

    const { data: getReportingManagersData, refetch } = useQuery(GET_REPORTING_MANAGERS, { variables: { userData: { search: '', companyId: companyId ?? '', branchId: branchId, user_type: userDataType, userId: userProfileData?.getProfile?.data?.uuid } } });
    const [stateDrpData, setStateDrpData] = useState<DropdownOptionType[]>([]);
    const onBackPage = useCallback(() => {
        dispatch(setBackCreateNewAccountStep());
    }, [])

    useEffect(() => {
        if (getReportingManagersData) {
            refetch()
        }
    }, []);


    const initialValues = {
        authorized_person_id: [],
    };

    const formik = useFormik({
        initialValues,
        validationSchema: authorizedPersonSchema,
        onSubmit: (values) => {
            dispatch(setCreateTenantPersonalDetails(values));
            dispatch(setCreateNewAccountStep());
        },
    });

    useEffect(() => {
        if (getReportingManagersData?.getReportingManagers?.data) {
            const tempDataArr = [] as DropdownOptionType[];
            getReportingManagersData?.getReportingManagers?.data?.map((data: { first_name: string, last_name: string, uuid: string }) => {
                tempDataArr.push({ name: `${data?.first_name} ${data?.last_name}`, key: data?.uuid });
            });
            setStateDrpData(tempDataArr);
        }
    }, [getReportingManagersData]);

    useEffect(() => {
        if (stateDrpData?.length > 0) {
            const tempDataArr = [] as DropdownOptionType[];
            companyDetails?.authorize_person?.map((data: { first_name: string, last_name: string, uuid: string }) => {
                tempDataArr.push({ name: `${data?.first_name} ${data?.last_name}`, key: data?.uuid });
            });
            formik.setFieldValue('authorized_person_id', tempDataArr);
        }
    }, [companyDetails, stateDrpData])

    useEffect(() => {
        if (typeof createTenantPersonalDetail === 'object' && Object.keys(createTenantPersonalDetail).length !== 0 && stateDrpData?.length > 0) {
            formik.resetForm({ values: createTenantPersonalDetail })
        }
    }, [createTenantPersonalDetail, stateDrpData])

    const tenantLocation = (option: { name: string }) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    return (
        <>
            {typeof companyDetails === 'object' && Object.keys(companyDetails).length !== 0 && <div>
                <div className="w-full lg:w-[calc(50%-10px)] mx-auto">
                    <div className='flex'>Authorized Person<p className='error'> *</p></div>
                    <MultiSelect value={formik?.values?.authorized_person_id} disabled={!stateDrpData || stateDrpData?.length === 0} options={stateDrpData} onChange={(e: MultiSelectChangeEvent) => {
                        formik.setFieldValue('authorized_person_id', e.value);
                    }} optionLabel="name" placeholder="Authorized Person" itemTemplate={tenantLocation} className='w-full md:w-20rem' display="chip" />
                    <p className='error'>{formik?.errors?.authorized_person_id}</p>
                    {(!stateDrpData || stateDrpData?.length === 0) && <div className="p-multiselect-items-empty error">No records found</div>}
                </div>
            </div>}
            <div className='flex justify-between gap-5 mt-10'>
                <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onBackPage()} label={t('Back')} title={`${t('Back')}`} />
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => formik.handleSubmit()} label={t('Next')} title={`${t('Next')}`} />
            </div>
        </>
    )
}

export default AuthorizedPersonDetails
