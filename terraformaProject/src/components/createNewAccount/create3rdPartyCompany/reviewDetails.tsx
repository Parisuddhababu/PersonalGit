import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next';
import { Edit } from '@components/icons/icons'
import Button from '@components/button/button';
import { setBackCreateNewAccountStep, setCustomCreateNewAccountStep, setCreateNewAccountStepReset } from 'src/redux/courses-management-slice';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateContractorDetails, setCreateNewCompany, setCreateNewContractor, setCreateTenantDetails, setCreateTenantPersonalDetails, setSelectFromExitingCompany, setSelectFromExitingContractor, userCreateEmployeeUserDetailsReset } from 'src/redux/user-profile-slice';
import { CompanyOrTenantDetailsType } from 'src/types/common';
import { useMutation } from '@apollo/client';
import { CREATE_COMPANY_CONTRACTOR, CREATE_COMPANY_TENANT, UPDATE_COMPANY_TENANT } from '@framework/graphql/mutations/tenantcreate';
import { toast } from 'react-toastify';
import { ROUTES } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import { UPDATE_CONTRACTOR } from '@framework/graphql/mutations/contractorPage';

function ReviewDetails() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const companyId = queryParams.get('company_uuid');
    const editTenantCompany = queryParams.get('edit-tenant-company');
    const editContractorCompany = queryParams.get('edit-contractor-company');
    const { selectFromExitingCompany, createTenantPersonalDetail, createTenantDetails, companyType, createContractorDetails, selectFromExitingContractor } = useSelector((state: { userProfile: CompanyOrTenantDetailsType }) => state.userProfile);
    const [createTenant, loading] = useMutation(CREATE_COMPANY_TENANT);
    const [updateTenant, updateTenantLoading] = useMutation(UPDATE_COMPANY_TENANT);
    const [updateContractor, updateContractorLoading] = useMutation(UPDATE_CONTRACTOR);
    const [createContractor, contractorLoading] = useMutation(CREATE_COMPANY_CONTRACTOR);

    const onSubmit = useCallback(() => {
        if (companyType === 1 && !editTenantCompany && !editContractorCompany) {
            createTenant({
                variables: {
                    userData: {
                        company_data: {
                            attachments: createTenantDetails?.attachments,
                            company_branch_id: createTenantDetails?.company_branch_id?.map((country: { key: string }) => country.key),
                            description: createTenantDetails?.description,
                            industry_type_id: createTenantDetails?.industry_type_id,
                            name: createTenantDetails?.name,
                            type: 1,
                            website_url: createTenantDetails?.website_url,
                        }
                    }
                },
            })
                .then((res) => {
                    const data = res.data
                    toast.success(data?.createCompanyTenantUser?.message)
                    dispatch(setCreateNewAccountStepReset())
                    dispatch(userCreateEmployeeUserDetailsReset());
                    dispatch(setCreateTenantPersonalDetails([]));
                    dispatch(setCreateTenantDetails([]));
                    navigate(`/${ROUTES.app}/${ROUTES.tenantDetailsPage}/?company_uuid=${data?.createCompanyTenantUser?.data?.uuid}`)
                })
                .catch((err) => {
                    toast.error(err?.networkError?.result?.errors?.[0]?.message)
                })
        }
        if (companyType === 2 && !editTenantCompany && !editContractorCompany) {
            createContractor({
                variables: {
                    userData: {
                        company_data: {
                            attachments: createContractorDetails?.attachments,
                            company_branch_id: createContractorDetails?.company_branch_id?.map((country: { key: string }) => country.key),
                            description: createContractorDetails?.description,
                            name: createContractorDetails?.name,
                            industry_type_id: createContractorDetails?.industry_type_id,
                            type: 2,
                            website_url: createContractorDetails?.website_url,

                        },
                        // user_type: 5
                    }
                },
            })
                .then((res) => {
                    const data = res.data
                    toast.success(data?.createCompanyContractorUser?.message)
                    dispatch(setCreateNewAccountStepReset())
                    dispatch(userCreateEmployeeUserDetailsReset());
                    dispatch(setCreateTenantPersonalDetails([]));
                    dispatch(setCreateTenantDetails([]));
                    dispatch(setCreateContractorDetails([]));
                    navigate(`/${ROUTES.app}/${ROUTES.vendorDetails}/?company_uuid=${data?.createCompanyContractorUser?.data?.uuid}`)
                })
                .catch((err) => {
                    toast.error(err?.networkError?.result?.errors?.[0]?.message)
                })
        }
        if (companyType === 2 && editContractorCompany) {
            const authorizedPersonArray = [] as string[]
            createTenantPersonalDetail?.authorized_person_id?.forEach((item: { key: string }) => {
                authorizedPersonArray?.push(item?.key);
            });

            const branchIdArray = [] as string[]
            createContractorDetails?.company_branch_id?.forEach((item: { key: string }) => {
                branchIdArray?.push(item?.key);
            });

            updateContractor({
                variables: {
                    contractorCompanyData: {
                        attachments: createContractorDetails?.attachments,
                        authorize_person:authorizedPersonArray,
                        company_branch_id: branchIdArray,
                        delete_company_branch_id: [''],
                        description: createContractorDetails?.description,
                        industry_type_id: createContractorDetails?.industry_type_id,
                        name: createContractorDetails?.name,
                        website_url: createContractorDetails?.website_url,
                    },
                    contractorCompanyId: companyId,
                },
            })
                .then((res) => {
                    const data = res.data
                    toast.success(data?.updateContractorCompany?.message)
                    dispatch(setCreateNewAccountStepReset())
                    dispatch(userCreateEmployeeUserDetailsReset());
                    dispatch(setCreateTenantPersonalDetails([]));
                    dispatch(setCreateTenantDetails([]));
                    dispatch(setCreateContractorDetails([]));
                    navigate(-1);
                })
                .catch((err) => {
                    toast.error(err?.networkError?.result?.errors?.[0]?.message)
                })
        }
        if (companyType === 1 && editTenantCompany) {

            const authorizedPersonArray = [] as string[]
            createTenantPersonalDetail?.authorized_person_id?.forEach((item: { key: string }) => {
                authorizedPersonArray?.push(item?.key);
            });

            const branchIdArray = [] as string[]
            createTenantDetails?.company_branch_id?.forEach((item: { key: string }) => {
                branchIdArray?.push(item?.key);
            });
            updateTenant({
                variables: {
                    tenantCompanyData: {
                        attachments: createTenantDetails?.attachments,
                        authorize_person: authorizedPersonArray,
                        company_branch_id: branchIdArray,
                        delete_company_branch_id: [''],
                        description: createTenantDetails?.description,
                        industry_type_id: createTenantDetails?.industry_type_id,
                        name: createTenantDetails?.name,
                        website_url: createTenantDetails?.website_url,
                    },
                    tenantCompanyId: companyId,
                },
            })
                .then((res) => {
                    const data = res.data
                    toast.success(data?.updateTenantCompany?.message)
                    dispatch(setCreateNewAccountStepReset())
                    dispatch(userCreateEmployeeUserDetailsReset());
                    dispatch(setCreateTenantPersonalDetails([]));
                    dispatch(setCreateTenantDetails([]));
                    dispatch(setCreateContractorDetails([]));
                    navigate(-1);
                })
                .catch((err) => {
                    toast.error(err?.networkError?.result?.errors?.[0]?.message)
                })
        }
    }, []);

    const onEdit = useCallback(() => {
        if (selectFromExitingCompany) {
            dispatch(setSelectFromExitingCompany(false));
            dispatch(setCreateNewCompany(true))
            dispatch(setCustomCreateNewAccountStep(1));
        }
        if (selectFromExitingContractor) {
            dispatch(setSelectFromExitingContractor(false));
            dispatch(setCreateNewContractor(true))
            dispatch(setCustomCreateNewAccountStep(1));
        } else {
            dispatch(setCustomCreateNewAccountStep(1));
        }
    }, [selectFromExitingCompany]);

    const onBackPage = useCallback(() => {
        dispatch(setBackCreateNewAccountStep());
    }, []);

    return (
        <>
            <div className='p-5 border border-solid border-border-primary rounded-xl'>
                <div className='relative flex justify-center mb-5 md:mb-7'>
                    <h6 className='text-center'>{t('Review Details')}</h6>
                    <button className='absolute right-0 cursor-pointer text-primary' onClick={() => onEdit()} title='Edit'><Edit /></button>
                </div>
                {companyType === 1 && <div className='flex flex-wrap gap-5 lg:min-h-[365px]'>
                    <div className='w-full xl:w-[calc(50%-10px)] space-y-5'>
                        <p>{t('Company Name: ')}<span className='font-bold break-words'>{createTenantDetails?.name}</span></p>
                        <p>{t('Description/Service Offered: ')}<span className='font-bold break-words'>{createTenantDetails?.description}</span></p>
                        {createTenantDetails?.attachments && <p>{t('Attachment: ')}<span className='font-bold break-words'>{createTenantDetails?.attachments}</span></p>}
                    </div>
                    {/* <div className='w-full xl:w-[calc(50%-10px)] space-y-5'>
                        <p>{t('Type of Industry: ')}<span className='font-bold break-words'>{createTenantDetails?.company_type_name}</span></p>
                    </div> */}
                </div>}
                {companyType === 2 && <div className='flex flex-wrap gap-5 lg:min-h-[365px]'>
                    <div className='w-full xl:w-[calc(50%-10px)] space-y-5'>
                        <p>{t('Company Name: ')}<span className='font-bold break-words'>{createContractorDetails?.name}</span></p>
                        <p>{t('Description/Service Offered: ')}<span className='font-bold break-words'>{createContractorDetails?.description}</span></p>
                        {createContractorDetails?.attachments && <p>{t('Attachment: ')}<span className='font-bold break-words'>{createContractorDetails?.attachments}</span></p>}
                    </div>
                    {/* <div className='w-full xl:w-[calc(50%-10px)] space-y-5'>
                        <p>{t('Type of Industry: ')}<span className='font-bold break-words'>{createContractorDetails?.contractor_type_name}</span></p>
                    </div> */}
                </div>}
            </div>
            <div className='flex justify-between gap-5 mt-10'>
                <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onBackPage()} label={t('Back')}  title={`${t('Back')}`} />
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onSubmit()} label={t('Submit')} disabled={loading?.loading || contractorLoading?.loading || updateTenantLoading?.loading || updateContractorLoading?.loading}  title={`${t('Submit')}`} />
            </div>
        </>
    )
}

export default ReviewDetails
