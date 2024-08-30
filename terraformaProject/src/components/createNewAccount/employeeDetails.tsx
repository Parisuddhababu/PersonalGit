import React, { useCallback, useEffect, useState } from 'react'
import DropDown from '@components/dropdown/dropDown'
import TextInput from '@components/textInput/TextInput'
import { useTranslation } from 'react-i18next';
import { DropdownArrowDown, Mail } from '@components/icons/icons';
import Button from '@components/button/button';
import { useDispatch, useSelector } from 'react-redux';
import { setBackCreateNewAccountStep, setCreateNewAccountStepReset } from 'src/redux/courses-management-slice';
import { whiteSpaceRemover } from '@utils/helpers';
import { useFormik } from 'formik';
import { DropdownOptionType } from '@types';
import { GET_REPORTING_MANAGERS,  } from '@framework/graphql/queries/role';
import { useMutation, useQuery } from '@apollo/client';
import useValidation from '@framework/hooks/validations';
import { CREATE_EMPLOYEE_ACCOUNT } from '@framework/graphql/mutations/createEmployeeAccount';
import { toast } from 'react-toastify';
import { setEmployeeDetails, userCreateEmployeeUserDetailsReset } from 'src/redux/user-profile-slice';
import { CreateEmployeeData, UserProfileType } from 'src/types/common';
import { AUTHORIZE_PERSON_USER_TYPE, ROUTES } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import { SUBSCRIBER_LOCATION } from '@framework/graphql/queries/createEmployeeLocation';

interface QueryVariables {
  user_type: number;
  search: string;
  companyId: string;
  branchId: string;
  userId?: string;
}

function EmployeeDetails() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const companyUUID = searchParams.get('company_uuid');
  const tenantDetails = searchParams.get('tenant-details-page');
  const contractorDetails = searchParams.get('contractor-details-page')
  const employeeListPage = searchParams.get('employees-user-list')
  const branchId = searchParams.get('branch_id');
  const { employeeDetails } = useValidation();
  const { data: subscriberLocation, refetch: subScriberLocationRefetch } = useQuery(SUBSCRIBER_LOCATION, { variables: { companyId: companyUUID ?? '' } });
  const [createEmployeeAccount, loading] = useMutation(CREATE_EMPLOYEE_ACCOUNT);
  const [createEmployeeSuccess, setCreateEmployeeSuccess] = useState<boolean>(false);
  const [reportingManagerDrpData, setReportingManagerDrpData] = useState<DropdownOptionType[]>([]);
  const { createEmployeeUserDetails, employeeDetailsData } = useSelector((state: { userProfile: CreateEmployeeData }) => state.userProfile);
  const [stateDrpData, setStateDrpData] = useState<DropdownOptionType[]>([]);

  const initialValues = {
    department: '',
    reporting_manager_id: '',
    branchId: '',
    position: '',
    isSubAdmin: false,
  };


  const userType = () => {
    if (tenantDetails) {
      return 2;
    } else if (contractorDetails) {
      return 3;
    } else {
      return 1;
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: employeeDetails,
    onSubmit: (values) => {
      createEmployeeAccount({
        variables: {
          employeeData: {
            email: createEmployeeUserDetails?.email,
            // pronounce: createEmployeeUserDetails?.pronounce,
            last_name: createEmployeeUserDetails?.last_name,
            first_name: createEmployeeUserDetails?.first_name,
            phone_number: createEmployeeUserDetails?.phone_number,
            country_code: createEmployeeUserDetails?.country_code,
            preferred_language: createEmployeeUserDetails?.preferred_language,
            role_id: createEmployeeUserDetails?.role_id,
            department: values.department,
            reporting_manager_id: formik?.values?.isSubAdmin ? '' : values.reporting_manager_id,
            branch_id: [values.branchId],
            company_id: companyUUID ?? '',
            isSubAdmin: values.isSubAdmin,
            user_type: userType(),
            position: values?.position
          }
        },
      })
        .then(() => {
          setCreateEmployeeSuccess(!createEmployeeSuccess);
        })
        .catch((err) => {
          toast.error(err?.networkError?.result?.errors?.[0]?.message)
        })
    },
  });

  const userContractorDataType = contractorDetails ? AUTHORIZE_PERSON_USER_TYPE.CONTRACTOR : AUTHORIZE_PERSON_USER_TYPE.USER
  const userDataType = tenantDetails ? AUTHORIZE_PERSON_USER_TYPE.TENANT : userContractorDataType
  const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));

  const queryVariables: QueryVariables = {
    user_type: userDataType,
    search: '',
    companyId: companyUUID ?? '',
    branchId: formik.values.branchId
  };

  if (contractorDetails || tenantDetails) {
    queryVariables.userId = userProfileData?.getProfile?.data?.uuid;
  }

  const { data: getReportingManagersData, refetch } = useQuery(GET_REPORTING_MANAGERS,
    {
      variables:
      {
        userData: queryVariables,
      }, skip: !formik.values.branchId,
    }
  )

  useEffect(() => {
    if (formik?.values?.branchId) {
      refetch()
    }
  }, [formik?.values?.branchId])

  useEffect(() => {
    if (getReportingManagersData) {
      refetch()
    }
  }, []);


  useEffect(() => {
    if (subscriberLocation) {
      subScriberLocationRefetch();
    }
  }, [])

  /*// useEffect(() => {
  //   if (getRolesData) {
  //     getRolesRefetch();
  //   }
  // }, [])*/

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
    const tempDataArr = [] as DropdownOptionType[];
    getReportingManagersData?.getReportingManagers?.data?.map((data: { first_name: string, last_name: string, uuid: string }) => {
      tempDataArr.push({ name: `${data?.first_name} ${data?.last_name}`, key: data?.uuid });
    });
    setReportingManagerDrpData(tempDataArr);
  }, [getReportingManagersData])

  /*// useEffect(() => {
  //   const tempDataArr = [] as DropdownOptionType[];
  //   getRolesData?.getActiveRoles?.data?.role?.map((data: StateDataArr) => {
  //     tempDataArr.push({ name: data?.name, key: data?.uuid });
  //   });
  //   setRoleDrpData(tempDataArr);
  // }, [getRolesData])*/

  const onClose = useCallback(() => {
    setCreateEmployeeSuccess(!createEmployeeSuccess);
    dispatch(setCreateNewAccountStepReset())
    dispatch(userCreateEmployeeUserDetailsReset());
    formik.resetForm();
    if (companyUUID && tenantDetails) {
      dispatch(setCreateNewAccountStepReset());
      dispatch(userCreateEmployeeUserDetailsReset());
      dispatch(setEmployeeDetails([]));
      return navigate(`/${ROUTES.app}/${ROUTES.tenantDetailsPage}/?company_uuid=${companyUUID}&branch_id=${branchId ?? formik.values.branchId}`);
    }
    if (companyUUID && contractorDetails) {
      dispatch(setCreateNewAccountStepReset());
      dispatch(userCreateEmployeeUserDetailsReset());
      dispatch(setEmployeeDetails([]));
      return navigate(`/${ROUTES.app}/${ROUTES.vendorDetails}/?company_uuid=${companyUUID}&branch_id=${branchId ?? formik.values.branchId}`);
    }
    if (employeeListPage) {
      navigate(-1);
    } else {
      return window.location.replace(`/${ROUTES.app}/${ROUTES.dashboard}`)
    }
  }, [formik.values.branchId, branchId]);

  const onBackPage = useCallback(() => {
    dispatch(setEmployeeDetails(formik.values));
    dispatch(setBackCreateNewAccountStep());
  }, [formik.values])

  useEffect(() => {
    if (typeof employeeDetailsData === 'object' && Object.keys(employeeDetailsData).length !== 0) {
      formik.resetForm({ values: employeeDetailsData })
    }
  }, [employeeDetailsData])

  const OnBlurBanner = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
  }, []);

  const handleCompanySubAdminChange = (event: { target: { checked: boolean }; }) => {
    const isChecked = event.target.checked;
    formik.setFieldValue('isSubAdmin', isChecked);
  };
  
  return (
    <>
      <div>
        <h6 className='mb-5 text-center lg:mb-7'>{t('Employee Details')}</h6>
        <div className='flex flex-wrap gap-3 lg:gap-5'>
          <div className="w-full lg:w-[calc(50%-10px)]">
            <TextInput placeholder={t('Enter Department')} type='text' id='department' name='department' label={t('Department')} value={formik.values.department} onChange={formik.handleChange}  error={formik.errors.department && formik.touched.department && formik.errors.department} onBlur={OnBlurBanner} />
          </div>
          {/* <div className="w-full lg:w-[calc(50%-10px)]">
            <DropDown placeholder={t('Role')} className='w-full' label={t('Assigned Role')} inputIcon={<span className='text-xs'><DropdownArrowDown className='fill-dark-grey' /></span>} onChange={formik.handleChange} value={formik.values.role_id} options={roleDrpData} name='role_id' id='role_id' error={formik.errors.role_id && formik.touched.role_id ? formik.errors.role_id : ''} required={true} />
          </div> */}
          <div className="w-full lg:w-[calc(50%-10px)]">
            <TextInput placeholder={t('Enter Title/Position')} type="text" label={t('Title/Position')} name='position' id='position' value={formik.values.position} onChange={formik.handleChange} error={formik.errors.position && formik.touched.position && formik.errors.position }  />
          </div>
          <div className="w-full lg:w-[calc(50%-10px)]">
            <DropDown placeholder={t('Select Location')} className='w-full' label={t('Location')} inputIcon={<span className='text-xs'><DropdownArrowDown className='fill-dark-grey' /></span>} onChange={formik.handleChange} value={formik.values.branchId} options={stateDrpData} name='branchId' id='branchId' error={formik.errors.branchId && formik.touched.branchId ? formik.errors.branchId : ''} required={true} />
          </div>
          {formik?.values?.branchId && !formik?.values?.isSubAdmin && <div className="w-full lg:w-[calc(50%-10px)]">
            <DropDown placeholder={t('Enter Reporting Manager')} className='w-full' label={t('Reporting Manager')} inputIcon={<span className='text-xs'><DropdownArrowDown className='fill-dark-grey' /></span>} onChange={formik.handleChange} value={formik.values.reporting_manager_id} options={reportingManagerDrpData} name='reporting_manager_id' id='reporting_manager_id' error={formik.errors.reporting_manager_id && formik.touched.reporting_manager_id ? formik.errors.reporting_manager_id : ''} required={true} />
          </div>}
          {(contractorDetails || tenantDetails) && <div className='w-full'>
            <label className='flex'>
              <input className='mr-2 cursor-pointer' type="checkbox" name='assessmentCertification'
                checked={formik?.values?.isSubAdmin}
                onChange={handleCompanySubAdminChange}
              />
              <span className='font-normal cursor-pointer'>{t('Create as a sub admin')}</span>
            </label>
          </div>}
        </div>
        {createEmployeeSuccess && (
          <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${!createEmployeeSuccess && 'hidden'}`}>
            <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${!createEmployeeSuccess && 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
              <div className='w-full mx-5 max-w-[640px]'>
                <div className='relative p-5 bg-white rounded-xl md:p-7'>
                  <div className='text-center rounded-full bg-success text-xxl-60 max-w-[60px] md:text-xxl-80 md:max-w-[80px] mx-auto mb-3'>
                    <Mail className='fill-white' />
                  </div>
                  <h6 className='mb-5 text-center max-w-[340px] md:leading-7 mx-auto'>{t('Login credentials have been generated and email sent to user.')}</h6>
                  <div className='w-full text-center'>
                    <Button className='btn-primary btn-normal w-[160px]' label={t('Ok')} onClick={() => onClose()}  title={`${t('Ok')}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='flex justify-between gap-5 mt-10'>
        <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onBackPage()} label={t('Back')} disabled={loading?.loading}  title={`${t('Back')}`} />
        <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => formik.handleSubmit()} label={t('Submit')} disabled={loading?.loading}  title={`${t('Submit')}`} />
      </div>
    </>
  )
}

export default EmployeeDetails
