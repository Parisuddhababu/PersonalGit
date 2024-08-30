import { useQuery } from '@apollo/client'
import DropDown from '@components/dropdown/dropDown'
import TextInput from '@components/textInput/TextInput'
import { API_MEDIA_END_POINT, AXIOS_HEADERS, MAX_FILE_SIZE, PAGE_LIMIT, PAGE_NUMBER } from '@config/constant'
import { GET_COMPANY_DETAILS,  GET_TYPE_OF_TENANT } from '@framework/graphql/queries/createcompanytenent'
import useValidation from '@framework/hooks/validations'
import { DropdownOptionType } from '@types'
import { whiteSpaceRemover } from '@utils/helpers'
import { useFormik } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setBackCreateNewAccountStep, setCreateNewAccountStep } from 'src/redux/courses-management-slice'
import { setCompanyDetails, setCreateContractorDetails, setCreateNewContractor, setSelectFromExitingContractor } from 'src/redux/user-profile-slice'
import { CompanyOrTenantDetailsType } from 'src/types/common';
import axios from 'axios';
import { toast } from 'react-toastify'
import Button from '@components/button/button'
import { SUBSCRIBER_LOCATION } from '@framework/graphql/queries/createEmployeeLocation'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';

interface InitialValueType {
    name: string,
    // industry_type_id: string,
    attachments: string,
    website_url: string,
    description: string,
    contractor_type_id: string,
    contractor_type_name: string,
    company_branch_id: DropdownOptionType[],
}

function CompanyOrContractorDetails() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { contractorDetailsSchema } = useValidation();
    const queryParams = new URLSearchParams(location.search);
    const companyId = queryParams.get('company_uuid');
    const branchId = queryParams.get('branch_id');
    const editContractorCompany = queryParams.get('edit-contractor-company');
    const createContractorCompany = queryParams.get('contractor-company-list');
    const [tenantDrpData, setTenantDrpData] = useState<DropdownOptionType[]>([]);   
    const [stateDrpData, setStateDrpData] = useState<DropdownOptionType[]>([]);
    const { data: subscriberLocation } = useQuery(SUBSCRIBER_LOCATION, { variables: { companyId: companyId ?? '' } });
    const { data: typeofTenant } = useQuery(GET_TYPE_OF_TENANT, { variables: { limit: PAGE_LIMIT, page: PAGE_NUMBER, sortField: '', sortOrder: '', search: '', type: 2 } });    
    const { createNewContractor, selectFromExitingContractor, createContractorDetails } = useSelector((state: { userProfile: CompanyOrTenantDetailsType }) => state.userProfile);
    const { data: getCompanyDetails, refetch } = useQuery(GET_COMPANY_DETAILS, { variables: { companyId: companyId, branchId: branchId }, skip: !companyId && !editContractorCompany });
    const initialValues: InitialValueType = {
        name: '',
        attachments: '',
        website_url: '',
        description: '',
        contractor_type_id: '',
        contractor_type_name: '',
        company_branch_id: [],
    };

    const formik = useFormik({
        initialValues,
        validationSchema: createNewContractor && contractorDetailsSchema,
        onSubmit: (values) => {
            if (createNewContractor) {
                dispatch(setCreateNewContractor(true));
            }
            if (selectFromExitingContractor) {
                dispatch(setSelectFromExitingContractor(true));
            }
            if (!createNewContractor && !selectFromExitingContractor) {
                dispatch(setCreateNewContractor(true));
            } else {
                dispatch(setCreateNewAccountStep());
                dispatch(setCreateContractorDetails(values));
            }
        },
    });

    useEffect(() => {
        if (editContractorCompany) {
            refetch()
        }
    }, [editContractorCompany])

    useEffect(() => {
        if (subscriberLocation?.subscriberLocations) {
            const tempDataArr = [] as DropdownOptionType[];
            subscriberLocation?.subscriberLocations?.data?.map((data: { location: string, uuid: string }) => {
                tempDataArr.push({ name: data.location, key: data?.uuid });
            });
            setStateDrpData(tempDataArr);
        }
    }, [subscriberLocation]);

    useEffect(() => {
        if (getCompanyDetails) {
            const companyData = getCompanyDetails?.getCompanyDetails?.data
            dispatch(setCompanyDetails(companyData));
            const tempDataArr = [] as DropdownOptionType[];
            const selectedBranch = companyData?.company_branches.find((plan: { branch: { uuid: string | null } }) => plan?.branch?.uuid === branchId);
            tempDataArr.push({ name: selectedBranch?.branch?.location, key: selectedBranch?.branch?.uuid });
            if (companyData) {
                formik.resetForm({
                    values: {
                        name: companyData?.name,
                        attachments: companyData?.attachments,
                        website_url: companyData?.website_url,
                        description: companyData?.description,
                        contractor_type_id: companyData?.tenantContractorType?.uuid,
                        contractor_type_name: companyData?.tenantContractorType?.uuid,
                        company_branch_id: tempDataArr,
                    }
                })
            }
        }
    }, [getCompanyDetails])

    useEffect(() => {
        const tempDataArr = [] as DropdownOptionType[];
        typeofTenant?.getCompanyTypes?.data?.tenantContractorType?.map((data: { name: number, uuid: string }) => {
            tempDataArr.push({ name: data?.name, key: data?.uuid });
        });
        if (formik.values.contractor_type_id) {
            const companyData = typeofTenant?.getCompanyTypes?.data?.tenantContractorType?.find((company: { uuid: string; }) => company?.uuid === formik.values.contractor_type_id);
            formik.setFieldValue('contractor_type_name', companyData?.name);
        }
        setTenantDrpData(tempDataArr);
    }, [typeofTenant, formik.values.contractor_type_id]);

    useEffect(() => {
        if (typeof createContractorDetails === 'object' && Object.keys(createContractorDetails).length !== 0) {
            formik.resetForm({ values: createContractorDetails })
        }
    }, [createContractorDetails])

    const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);

    const onBackPage = () => {
        if (createNewContractor) {
            return dispatch(setCreateNewContractor(false));
        }
        if (selectFromExitingContractor) {
            return dispatch(setSelectFromExitingContractor(false));
        } else {
            return dispatch(setBackCreateNewAccountStep());
        }
    }

    const handleFileEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;
        if (files) {
            const allowedExtensions = ['pdf', 'doc', 'docx'];
            const maxFileSize = MAX_FILE_SIZE
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formData.append('file', validFiles[0] as any);

                // Attempt to upload the attachment
                axios.post(`${API_MEDIA_END_POINT}/attachment`, formData, { headers: AXIOS_HEADERS })
                    .then((response) => {
                        formik.setFieldValue('attachments', response?.data?.data?.filename);
                    })
                    .catch((err) => {
                        toast.error(err?.message);
                    });

            } else {
                formik.setFieldError('attachments', 'Invalid file type Please enter valid attachment');
            }
        }
    };

    const contractorLocation = (option: { name: string }) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    return (
        <><div>
            <h6 className='mb-5 text-center lg:mb-7'>{t('Company/Contractor Details')}</h6>
            <div className='flex flex-wrap gap-3 lg:gap-5'>
                <div className="w-full">
                    <TextInput placeholder={t('Enter Company Name')} onBlur={OnBlur} type="text" label={t('Company Name')} value={formik.values.name} onChange={formik.handleChange} name='name' error={formik.errors.name && formik.touched.name ? formik.errors.name : ''} required={true} />
                </div>
                <div className="w-full lg:w-[calc(50%-10px)] hidden">
                    <DropDown placeholder={'Contractor'} className='w-full' label={t('Type of Contractor')} onChange={formik.handleChange} name='contractor_type_id' value={formik.values.contractor_type_id} error={formik.errors.contractor_type_id && formik.touched.contractor_type_id ? formik.errors.contractor_type_id : ''} options={tenantDrpData} id='contractor_type_id' required={true} />
                </div>
                <div className="w-full">
                    <TextInput placeholder={t('Enter Description/Service Offered')} onBlur={OnBlur} type="text" label={t('Description/Service Offered')} name='description' onChange={formik.handleChange} value={formik.values.description} error={formik.errors.description && formik.touched.description ? formik.errors.description : ''} required={true} />
                </div>               
                <div className="w-full lg:w-[calc(50%-10px)]">
                    <label>{t('Location')}<span className='text-red-500'> *</span></label>
                    <MultiSelect 
                        value={formik.values.company_branch_id} 
                        options={stateDrpData} 
                        onChange={(e: MultiSelectChangeEvent) => { formik.setFieldValue('company_branch_id', e.value) }} 
                        optionLabel="name" 
                        placeholder="Location" 
                        disabled={!!editContractorCompany} 
                        itemTemplate={contractorLocation} 
                        className='w-full md:w-20rem' 
                        display="chip" />
                        {formik.errors.company_branch_id &&formik.touched.company_branch_id && <p className='text-error'>{ t(`${formik.errors.company_branch_id}`) }</p>}
                </div>
                <div className="w-full lg:w-[calc(50%-10px)]">
                    <label htmlFor="attachment">
                        {t('Attachment')}
                    </label>
                    <input
                        id='attachments'
                        type="file"
                        name='attachments'
                        multiple
                        className='focus:bg-transparent'
                        accept=".pdf, .doc, .docx"
                        onChange={(e) => handleFileEvent(e)} />
                    <p className="mt-2">{t('Note: Supported formats are .pdf, .doc and .docx Max size is 5MB')}</p>

                </div>
                <div className="w-full lg:w-[calc(50%-10px)]">
                    <TextInput placeholder={t('Enter Website URL')} onBlur={OnBlur} type="text" label={t('Website URL')} onChange={formik.handleChange} name='website_url' id='website_url' value={formik.values.website_url} />
                </div>
            </div>
        </div>
            <div className={`flex ${!createContractorCompany && !editContractorCompany ? 'justify-between' : 'justify-end'} gap-5 mt-10`}>
                {(!createContractorCompany && !editContractorCompany) && <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onBackPage()} label={t('Back')} />}
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => formik.handleSubmit()} label={t('Next')} title={`${t('Next')}`} />
            </div>
        </>
    )
}

export default CompanyOrContractorDetails
