import ImportEmployeesList from '@components/tenantDetails/importEmployeesList'
import TenantUserAdd from '@components/tenantDetails/tenantUserAdd'
import TenantUserDetails from '@components/tenantDetails/tenantUserDetails'
import { useMutation, useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import { ArrowSortingDown, ArrowSortingUp, Cross, DropdownArrowDown, Edit, Eye, Filter2, GetDefaultIcon, ImportDoc, Map, Search, Trash } from '@components/icons/icons';
import { API_BASE_URL, CHANGE_STATUS_WARNING_TEXT, ContractorStatus, DELETE_WARNING_TEXT, ROUTES, SHOW_PAGE_COUNT_ARR, TenantUserDetailsDrpData, USER_TYPE, updateBranchId } from '@config/constant';
import { StateDataArr } from '@framework/graphql/graphql';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ColArrType } from 'src/types/role';
import filterServiceProps from '@components/filter/filter';
import Button from '@components/button/button';
import DropDown from '@components/dropdown/dropDown';
import TextInput from '@components/textInput/TextInput';
import { useFormik } from 'formik';
import { CREATE_NEW_BRANCH, DELETE_EMPLOYEE_USER } from '@framework/graphql/mutations/createBranch';
import { GET_COMPANY_BRANCHES, GET_COMPANY_TENANT_DETAILS, GET_COMPANY_TENANT_EMPLOYEE_LIST } from '@framework/graphql/queries/getCompanyBranches';
import { DropdownOptionType } from '@types';
import { useDispatch, useSelector } from 'react-redux';
import { setGetCompanyTenantDetails } from 'src/redux/tenant-management-slice';
import CommonModel from '@components/common/commonModel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DecryptionFunction from 'src/services/decryption';
import { setCustomCreateNewAccountStep } from 'src/redux/courses-management-slice';
import UpdatedHeader from '@components/header/updatedHeader';
import { UserProfileType, UserRoles } from 'src/types/common';
import { SUBSCRIBER_LOCATION } from '@framework/graphql/queries/createEmployeeLocation';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';
import Loader from '@components/common/loader';
import Info from '@components/tooltip/info';
import { CHANGE_EMPLOYEE_STATUS } from '@framework/graphql/mutations/contractorPage';
import { APIServices } from 'src/services/axiosCommon';
import { v4 as uuidv4 } from 'uuid';
import { importEmployeeList } from '@config/common';
import RejectedUserPopup from '@components/tenantDetails/rejectedUserPopup';
export type PaginationParams = {
    limit: number
    page: number
    sortField: string
    sortOrder: string
    search: string
    company_id: string | null
    branch_id: string
    index?: number
}

interface RejectedUserType {
    uuid: string,
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    role: string,
    reason: string
}
interface TenantDetailsData {
    getCompanyTenantDetails: {
        address: string
        authorized_person: string
        company_name: string
        email: string
        industry_type: string
        location: string
        phone_number: string
        total_employees: number
        type: string
        website: string
    }
}


function TenantDetailsPage() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const encryptedToken = localStorage.getItem('authToken') as string;
    const token = encryptedToken && DecryptionFunction(encryptedToken);
    const queryParams = new URLSearchParams(location.search);
    const companyId = queryParams.get('company_uuid');
    const branchId = queryParams.get('branch_id');
    const [createNewBranch, branchLoading] = useMutation(CREATE_NEW_BRANCH);
    const [deleteEmployeeUser, deleteLoading] = useMutation(DELETE_EMPLOYEE_USER);
    const { data: getCompanyBranchesData, refetch: refetchGetCompanyBranchesData } = useQuery(GET_COMPANY_BRANCHES, { variables: { limit: 10, page: 1, sortField: 'createdAt', sortOrder: 'descend', search: '', companyId: companyId } });
    const { refetch: refetchFGetCompanyTenantDetailsData } = useQuery(GET_COMPANY_TENANT_DETAILS, { skip: true });
    const [branchDrpData, setBranchDrpData] = useState<DropdownOptionType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [rejectedUserPopup, setRejectedUserPopup] = useState<boolean>(false);
    const { tenant } = useSelector(((state: { rolesManagement: { tenant: UserRoles } }) => state.rolesManagement));
    const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const [rejectedUsersData, setRejectedUsersData] = useState<{ successCount: number; rejectCount: number; totalCount: number; rejectedUsers: RejectedUserType[] }>({ successCount: 0, rejectCount: 0, totalCount: 0, rejectedUsers: [] });
    const [isDeleteData, setIsDeleteData] = useState<{ uuid: string, userType: string | number }>({ uuid: '', userType: '' });
    const [toShowData, setToShowData] = useState<boolean>(false);
    const { data: subscriberLocation, refetch: subscriberLocationRefetch } = useQuery(SUBSCRIBER_LOCATION, { variables: { companyId: '' } });
    const [stateDrpData, setStateDrpData] = useState<DropdownOptionType[]>([]);
    const [isDisable, setIsDisable] = useState<boolean>(false);
    const [updateStateDrpData, setUpdateStateDrpData] = useState<DropdownOptionType[]>([]);
    const [updateEmployeeStatus, statusLoading] = useMutation(CHANGE_EMPLOYEE_STATUS)
    const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false)
    const [tenantObj, setTenantObj] = useState({} as { first_name: string, uuid: string, last_name: string, department: string, email: string, phone_number: string, user_type: number, status: number });

    const COL_ARR = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Employee First Name'), sortable: true, fieldName: 'first_name' },
        { name: t('Employee Last Name'), sortable: true, fieldName: 'last_name' },
        { name: t('Department'), sortable: true, fieldName: 'department' },
        { name: t('User Type'), sortable: true, fieldName: 'user.user_type' },
        { name: t('email'), sortable: true, fieldName: 'email' },
        { name: t('Phone Number'), sortable: true, fieldName: 'phone_number' },
        { name: t('Status'), sortable: true, fieldName: 'user.status' },
    ] as ColArrType[];
   
    const [isAddNewBranchModelShow, setIsAddNewBranchModelShow] = useState<boolean>(false)
    const [addClass, setAddClass] = useState<boolean>(false);
    const [isImportFiles, setIsImportFiles] = useState<boolean>(false);
    const { getCompanyTenantDetails } = useSelector((state: { tenantDetails: TenantDetailsData }) => state.tenantDetails);
    const initialValues = {
        locationName: '',
        userLocation: '',
    }

    const formik = useFormik({
        initialValues,
        onSubmit: () => {
            setIsAddNewBranchModelShow(false);
            setAddClass(false);
        }
    });

    useEffect(() => {
        if (getCompanyBranchesData) {
            refetchGetCompanyBranchesData();
        }
    }, [])

    useEffect(() => {
        if (subscriberLocation) {
            subscriberLocationRefetch();
        }
    }, [])

    useEffect(() => {
        const tempDataArr = [] as DropdownOptionType[];
        let userLocationData = '' as string;
        if (branchId) {
            userLocationData = branchId
        } else if (getCompanyBranchesData?.getCompanyBranches?.data?.branches?.[0]?.branch?.uuid) {
            userLocationData = getCompanyBranchesData?.getCompanyBranches?.data?.branches?.[0]?.branch?.uuid
        }
        getCompanyBranchesData?.getCompanyBranches?.data?.branches?.map((data: StateDataArr) => {
            tempDataArr.push({ name: data?.branch?.location, key: data?.branch?.uuid });
        });
        setBranchDrpData(tempDataArr);
        formik.setFieldValue('userLocation', userLocationData)
    }, [getCompanyBranchesData, branchId])

    const branchName = getCompanyBranchesData?.getCompanyBranches?.data?.branches.map((data: { branch: { uuid: string } }) => {
        return (
            data?.branch?.uuid
        )
    })

    const { data, refetch: getCompanyEmployeeListRefetch } = useQuery(GET_COMPANY_TENANT_EMPLOYEE_LIST, {
        skip: !formik.values.userLocation,
        fetchPolicy: 'no-cache',
        variables: {
            userData: {
                limit: 10,
                page: 1,
                sortField: 'createdAt',
                sortOrder: 'descend',
                search: '',
                company_id: companyId,
                branch_id: formik.values.userLocation
            }
        }
    });

    const [filterData, setFilterData] = useState<PaginationParams>({
        limit: 10,
        page: 1,
        sortField: 'createdAt',
        sortOrder: 'descend',
        search: '',
        company_id: companyId,
        branch_id: branchName,
        index: 0
    });

    useEffect(() => {
        if (formik.values.userLocation) {
            updateBranchId(formik.values.userLocation);
            refetchFGetCompanyTenantDetailsData({
                companyId: companyId,
                branchId: formik.values.userLocation,
            }).then((res) => {
                dispatch(setGetCompanyTenantDetails(res?.data?.getCompanyTenantDetails?.data))
            }).catch((err) => {
                toast.error(err.networkError.result.errors[0].message);
            })
        }
    }, [formik.values.userLocation])

    const onCancelCategory = useCallback(() => {
        setIsAddNewBranchModelShow(false);
        formik.setFieldValue('locationName', '');
        setAddClass(false);
    }, [])

    const handleClick = useCallback(() => {
        setIsAddNewBranchModelShow(true);
        setAddClass(true);
    }, []);

    /**
     *
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortCategory = (sortFieldName: string) => {
        setFilterData({
            ...filterData,
            sortField: sortFieldName,
            sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
        });
    };
    /**
     *
     * @param e Method used for change dropdown for page limit
     */

    const onPageDrpSelectCategory = (e: string) => {
        setRecordsPerPage(Number(e));
        const updatedFilterData = {
            ...filterData,
            limit: parseInt(e),
            page: 1,
            search: '',
            index: 0,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState(
            'filterTenantUserManagement',
            JSON.stringify(updatedFilterData)
        );
    };

    useEffect(() => {
        if (formik.values.userLocation) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { index, ...newObject } = filterData;
            getCompanyEmployeeListRefetch({ userData: { ...newObject, branch_id: formik.values.userLocation } }).catch((err) => toast.error(err));
        }
    }, [filterData, formik.values.userLocation]);

    const [recordsPerPage, setRecordsPerPage] = useState<number>(
        filterData.limit
    );
    const totalUserManagement = data?.getCompanyTenantEmployeeList?.data?.count || 0;
    const totalPages = Math.ceil(totalUserManagement / recordsPerPage);
    const handlePageChange = useCallback((newPage: number): void => {
        const updatedFilterData = {
            ...filterData,
            page: newPage,
            index: (newPage - 1) * filterData.limit,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState(
            'filterTenantUserManagement',
            JSON.stringify(updatedFilterData)
        );
    }, []);

    useEffect(() => {
        setRecordsPerPage(filterData.limit);
    }, [filterData.limit]);

    const onLocationAdd = useCallback(() => {
        createNewBranch({
            variables: {
                companyBranchData: {
                    // name: formik.values.locationName,
                    company_id: companyId,
                    branch_id: formik.values.locationName,
                }
            },
        }).then((res) => {
            const data = res.data.courseData
            toast.success(data?.message);
            refetchGetCompanyBranchesData();
            setIsAddNewBranchModelShow(false);
            formik.resetForm();
        })
            .catch((err) => {
                toast.error(err?.networkError?.result?.errors?.[0]?.message);
                setIsAddNewBranchModelShow(false);
            });
    }, [formik.values.locationName])

    const onDelete = useCallback((id: string, userType: number) => {
        setIsDelete(true);
        setIsDeleteData({ uuid: id, userType: userType });
    }, []);

    const onEdit = useCallback((id: string, userType: number) => {
        navigate(`/${ROUTES.app}/${ROUTES.userDetails}/?uuid=${id}&branchId=${formik.values.userLocation}&company_id=${companyId}&userCompanyType=1&Is_subAdmin=${userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN}`)
    }, [formik.values.userLocation]);

    const onView = useCallback((id: string, userType: number) => {
        navigate(`/${ROUTES.app}/${ROUTES.userDetails}/?uuid=${id}&read_Data=true&company_id=${companyId}&branchId=${formik?.values?.userLocation}&userCompanyType=1&Is_subAdmin=${userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN}`)
    }, [formik.values.userLocation]);

    const onClose = useCallback(() => {
        setIsDelete(false);
    }, []);

    useEffect(() => {
        if (data?.getCompanyTenantEmployeeList?.data?.count > 0) {
            setToShowData(true);
        }
    }, [data?.getCompanyTenantEmployeeList?.data?.count]);

    const onRemove = useCallback(() => {
        deleteEmployeeUser({
            variables: {
                subscriberUserId: isDeleteData?.uuid,
                userData: {
                    user_type: isDeleteData?.userType,
                }
            },
        }).then((res) => {
            getCompanyEmployeeListRefetch();
            refetchFGetCompanyTenantDetailsData({
                companyId: companyId,
                branchId: formik.values.userLocation,
            }).then((res) => {
                dispatch(setGetCompanyTenantDetails(res?.data?.getCompanyTenantDetails?.data))
            }).catch((err) => {
                toast.error(err.networkError.result.errors[0].message);
            })
            const data = res.data.courseData
            toast.success(data?.message);
            refetchGetCompanyBranchesData();
            setIsDelete(false);
            if (data?.getCompanyTenantEmployeeList?.data?.count === 0) {
                setToShowData(true);
            }
        })
            .catch((err) => {
                toast.error(err?.networkError?.result?.errors?.[0]?.message);
            });
    }, [isDeleteData, data?.getCompanyTenantEmployeeList?.data?.count]);

    /***
        * @param e Method used for store search value
    */
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterData({ ...filterData, search: e.target.value })
    }, [])

    const onDownloadCsv = useCallback(() => {
        axios.get(`${API_BASE_URL}users/export-company-tenant-users-csv/?company_id=${companyId}&branch_id=${formik.values.userLocation}`, { headers: { authorization: token ? `Bearer ${token}` : '' }, responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Tenant-Users.csv');
                document.body.appendChild(link);
                link.click();
                toast.success(response?.data?.message);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    }, [formik.values.userLocation]);

    const onDownloadSampleCsv = useCallback(() => {
        APIServices.getList(`${API_BASE_URL}media/download-csv/tenant`)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Tenant-Sample.csv');
                document.body.appendChild(link);
                link.click();
                toast.success(response?.data?.message);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    }, []);

    const onImportCallBack = useCallback((data: boolean) => {
        setLoading(data)
        if (!loading) {
            getCompanyEmployeeListRefetch();
        }
    }, [data]);

    const onImportEmployeeList = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsImportFiles(false);
        const files = event.currentTarget.files;
        await importEmployeeList({
            files,
            companyId,
            branchId,
            onImportCallBack: getCompanyEmployeeListRefetch,
            setRejectedUserPopup,
            setRejectedUsersData
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [companyId, formik.values.userLocation]);

    const oncancel = () => {
        setRejectedUserPopup(false);
        setIsImportFiles(false);
    }

    const onFilterDrpHandleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSortOption = event.target.value;
        const [sortField, sortOrder] = selectedSortOption.split(':');
        setFilterData({
            ...filterData,
            sortField,
            sortOrder,
        });
    }

    const addNewUser = () => {
        dispatch(setCustomCreateNewAccountStep(1));
        navigate(`/${ROUTES.app}/${ROUTES.createNewAccount}/?company_uuid=${companyId}&branch_id=${formik.values.userLocation}&tenant-details-page=true`);
    }

    const userType = userProfileData?.getProfile?.data?.user_type ?? ''

    const headerActionConst = () => {
        return (
            <>
                {(userType === USER_TYPE.SUBSCRIBER_ADMIN && tenant?.write) &&
                    <div className={`flex w-full gap-3 xmd:gap-5 lg:w-auto ${loading ? 'pointer-events-none' : ''}`}>
                        <Button className='btn-normal btn-secondary whitespace-nowrap' label={t('+ Add new location')} onClick={handleClick} />
                        <DropDown placeholder={'Select Location'} className='w-[212px] -mt-2 max-md:mr-2' label='' inputIcon={<Map fontSize='18' />} name='userLocation' onChange={formik.handleChange} value={formik.values.userLocation} error={formik?.errors?.userLocation} options={branchDrpData} id='userLocation' />
                    </div>}
            </>
        )
    }

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
        if (branchDrpData?.length > 0 && stateDrpData?.length > 0) {
            const updatedArray = stateDrpData?.filter(item1 => !branchDrpData.some(item2 => item2.key === item1.key));
            setUpdateStateDrpData(updatedArray);
            setIsDisable(updatedArray?.length === 0);
        }
    }, [branchDrpData, stateDrpData])

    const onChangeStatus = useCallback((data: { first_name: string, uuid: string, last_name: string, department: string, email: string, phone_number: string, user_type: number, status: number }) => {
        setIsStatusModelShow(true)
        setTenantObj(data)
    }, [])

    const changeCategoryStatus = useCallback(() => {
        updateEmployeeStatus({
            variables: {
                subscriberUserId: tenantObj.uuid,
            },
        })
            .then((res) => {
                const data = res.data
                toast.success(data.activeInactiveEmployee.message)
                setIsStatusModelShow(false)
                getCompanyEmployeeListRefetch()
            })
            .catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message)
            })
    }, [isStatusModelShow])

    const onCloseSubscriber = useCallback(() => {
        setIsStatusModelShow(false)
    }, []);

    const onImport = useCallback(() => {
        setIsImportFiles((prev) => !prev)
    }, [isImportFiles])
   
    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            {loading && <Loader />}
            <TenantUserDetails />
            {(!toShowData && (userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN ? userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN : tenant?.write)) && <div className="flex gap-5 md:gap-[30px] flex-wrap">
                <div className='w-full lg:w-[calc(50%-15px)]'>
                    <TenantUserAdd companyId={companyId} branchId={formik.values.userLocation} />
                </div>
                <div className='w-full lg:w-[calc(50%-15px)]'>
                    <ImportEmployeesList companyId={companyId} branchId={formik.values.userLocation} onImportCallBack={onImportCallBack} />
                </div>
            </div>}
            <div className="flex justify-end pb-5 md:pb-7">
                <Info toolTipPosition="left" infoTipText='i Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit quaerat iste, neque alias natus praesentium cum magnam ut beatae suscipit et nemo, earum autem, eligendi temporibus deserunt aspernatur asperiores corporis.' />
                <button className="btn bg-default btn-secondary btn-normal w-full md:w-[220px] " type="button" onClick={() => onDownloadSampleCsv()} title='Download'>Download Sample CSV</button>
            </div>
            {toShowData && <div className="p-5 border border-solid rounded-xl border-border-primary">
                <div className='flex flex-wrap items-center justify-between mb-5'>
                    <h6 className='w-full mb-5 md:w-auto'>{getCompanyTenantDetails?.company_name} {t('Employee Details')}</h6>
                    <div className="flex flex-wrap w-full gap-y-3 gap-x-4 2xl:gap-5 md:w-auto">
                        {(userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN ? userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN : tenant?.write) && <button className="btn btn-primary text-white whitespace-nowrap w-full sm:w-[160px] " type="button" onClick={() => addNewUser()}>Add New</button>}

                        {(userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN ? userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN : tenant?.write) &&<button className="w-full btn btn-gray sm:w-[260px] p-3.5" onClick={() => onImport()}>
                        Import Employees List  <ImportDoc className='order-2 ml-auto' />
                        </button>}

                        <button className="w-full btn btn-gray sm:w-[260px] p-3.5" onClick={() => onDownloadCsv()}>
                            Export Employees List  <ImportDoc className='order-2 ml-auto' />
                        </button>

                        <TextInput placeholder={t('Search Employee')} className='max-sm:w-full' type='text' id='table-search' value={filterData.search} onChange={handleChange} inputIcon={<Search fontSize='18' />} />

                        <div className='w-full sm:w-[150px]'>
                            <DropDown
                                className='w-full -mt-2'
                                label=''
                                inputIcon={<Filter2 className='order-2' />}
                                name='filterDrpData'
                                onChange={onFilterDrpHandleChange}
                                value={filterData.sortField + ':' + filterData.sortOrder}
                                error=""
                                options={TenantUserDetailsDrpData}
                                id='filterDrpData' />
                        </div>
                    </div>
                </div>
                <div className="overflow-auto custom-dataTable">
                    <table>
                        <thead>
                            <tr>
                                {COL_ARR?.map((colVal: ColArrType, index: number) => {
                                    return (
                                        <th
                                            scope="col"
                                            className={`whitespace-nowrap ${colVal.name == t('Sr.No') ? 'justify-start pl-7' : ''}`}
                                            key={`${index + 1}`}
                                        >
                                            <div
                                                className='flex items-center'
                                            >
                                                {colVal.name}
                                                {colVal.sortable && (
                                                    <button className='cursor-pointer' onClick={() => onHandleSortCategory(colVal.fieldName)} type="button">
                                                        {(filterData.sortOrder === '' ||
                                                            filterData.sortField !== colVal.fieldName) && (
                                                                <GetDefaultIcon className="fill-white" />
                                                            )}
                                                        {filterData.sortOrder === 'ascend' &&
                                                            filterData.sortField === colVal.fieldName && (
                                                                <ArrowSortingUp className="ml-1 fill-white" />
                                                            )}
                                                        {filterData.sortOrder === 'descend' &&
                                                            filterData.sortField === colVal.fieldName && (
                                                                <ArrowSortingDown className="ml-1 fill-white" />
                                                            )}
                                                    </button>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                                <th scope='col'>
                                    <div className='flex items-center'>
                                        {t('Action')}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.getCompanyTenantEmployeeList?.data?.employee?.map(
                                (data: { first_name: string, uuid: string, last_name: string, department: string, email: string, phone_number: string, user_type: number, status: number }, index: number) => {
                                    const displayIndex = filterData?.index as number + index + 1;
                                    return (
                                        <tr key={data.uuid}>
                                            <td className="text-left pl-7" scope="row">
                                                {displayIndex}
                                            </td>
                                            <td className="text-left">{data?.first_name}</td>
                                            <td className="text-left">{data?.last_name}</td>
                                            <td className="text-left">{data?.department}</td>
                                            <td className="text-left border-none">
                                                <div className='flex'>
                                                    {data?.user_type !== USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN ? (
                                                        <span className='text-bright-green-shade'>
                                                            User
                                                        </span>
                                                    ) : (
                                                        <span className='text-error'>
                                                            Sub Admin
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-left">{data?.email}</td>
                                            <td className="text-left">{data?.phone_number}</td>
                                            <td className='text-left border-none'>
                                                <div className='flex'>
                                                    {data?.status === ContractorStatus.ACTIVE ? (
                                                        <span className='text-bright-green-shade'>
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className='text-error'>
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className='flex gap-2 text-left'>
                                                {(userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN ? userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN : tenant?.read) && <Button className='mx-1 mr-2 bg-transparent btn-default' onClick={() => onView(data?.uuid, data?.user_type)} label={''} title=''>
                                                    <Eye className='text-success' />
                                                </Button>}
                                                {(userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN ? userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN : tenant?.update) && <Button className='mr-2 bg-transparent btn-default' onClick={() => onEdit(data?.uuid, data?.user_type)} label={''} title=''>
                                                    <Edit />
                                                </Button>}
                                                {(userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN ? userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN : tenant?.delete) && <Button className='mr-2 bg-transparent cursor-pointer btn-default' onClick={() => onDelete(data?.uuid, data?.user_type)} label={''} disabled={deleteLoading?.loading} title=''>
                                                    <Trash className='fill-error' />
                                                </Button>}
                                                <div className='flex justify-center'>
                                                    {(userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN ? userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN : tenant?.update) && <span
                                                        className='font-medium text-blue-600 hover:underline'
                                                    >
                                                        <label className='relative inline-flex items-center mb-0 cursor-pointer'>
                                                            <input
                                                                type='checkbox'
                                                                className='sr-only peer'
                                                                value={data?.status}
                                                                onChange={() => onChangeStatus(data)}
                                                                checked={data?.status === ContractorStatus.ACTIVE}
                                                            />
                                                            <div
                                                                className={
                                                                    'w-[30px] h-[14px] bg-secondary rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-[-1px] after:left-0 after:bg-white after:drop-shadow-outline-2 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary'
                                                                }
                                                            ></div>
                                                        </label>
                                                    </span>}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                    {(data?.getCompanyTenantEmployeeList?.data?.count === 0 ||
                        data?.getCompanyTenantEmployeeList?.data === null) && (
                            <div className="flex justify-center">
                                <div>{t('No Data')}</div>
                            </div>
                        )}
                </div>
                <div className="flex flex-wrap items-center mt-2">
                    <div className="flex items-center mr-3 md:mr-7">
                        <span className="text-sm font-normal text-gray-700 whitespace-nowrap">
                            {t('Per Page')}
                        </span>
                        <select
                            className="border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white"
                            onChange={(e) => onPageDrpSelectCategory(e.target.value)}
                            value={filterData.limit}
                        >
                            {SHOW_PAGE_COUNT_ARR?.map((data: number) => {
                                return <option key={data}>{data}</option>;
                            })}
                        </select>
                    </div>
                    <Pagination
                        currentPage={filterData.page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        recordsPerPage={recordsPerPage}
                    />
                </div>
            </div>}

            {isAddNewBranchModelShow && (
                <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${isAddNewBranchModelShow ? '' : 'hidden'}`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${addClass ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
                        <div className='w-full mx-5 sm:max-w-[400px]'>
                            {/* <!-- Modal content --> */}
                            <div className='relative bg-white rounded-xl'>
                                {/* <!-- Modal header --> */}
                                <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                                    <p className='text-lg font-bold md:text-xl text-baseColor'>{'Add New Location'}</p>
                                    <Button onClick={onCancelCategory} label={t('')} title={`${t('Close')}`} >
                                        <span className='text-xl-22'><Cross className='text-error' /></span>
                                    </Button>
                                </div>
                                {/* <!-- Modal body --> */}
                                {!isDisable && <div className='w-full'>
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className='p-5 max-h-[calc(100vh-260px)] overflow-auto'>
                                            <div className='mb-4'>
                                                <DropDown placeholder={t('Select Location')} className='w-full' label={t('Location')} inputIcon={<span className='text-xs'><DropdownArrowDown className='fill-dark-grey' /></span>} onChange={formik.handleChange} value={formik.values.locationName} error={formik?.errors?.locationName} options={updateStateDrpData} name='locationName' id='locationName' required={true} />
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                            <Button className='btn-primary btn-normal mb-2 md:mb-0 w-full md:w-auto min-w-[90px]' type='button' label={t('Add')} onClick={() => onLocationAdd()} disabled={branchLoading.loading} />
                                        </div>
                                    </form>
                                </div>}
                                {isDisable && <div className='mx-5 py-5'>
                                    <h6 className='error'>This user has been chosen for all locations.</h6>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}  
            <RejectedUserPopup
                rejectedUserPopup={rejectedUserPopup}
                rejectedUsersData={rejectedUsersData}
                oncancel={oncancel} 
            />
          
            {isImportFiles && (
                <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${isImportFiles ? '' : 'hidden'}`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${isImportFiles ? '' : 'opacity-0 transform -translate-y-full scale-150 '}  transition-all duration-300 `}>
                        <div className='w-full mx-5 sm:max-w-[640px]'>
                            <div className='relative p-5 text-center bg-white shadow rounded-xl md:p-7'>
                                
                                <h6 className='mb-6 font-bold leading-normal text-center md:mb-10'>{t('Before you upload the list, the roles should be created')}</h6>
                                <div className='flex items-center justify-center space-x-5 md:flex-row'>
                                    <label id='importCsv' className="btn btn-primary btn-normal w-full md:w-auto md:min-w-[160px] mb-0">
                                        Okay
                                        <input
                                            id='importCsv'
                                            type="file"
                                            name='importCsv'
                                            multiple
                                            ref={fileInputRef}
                                            className='hidden focus:bg-transparent'
                                            accept=".csv"
                                            onChange={(e) => onImportEmployeeList(e)}
                                            key={uuidv4()}
                                        />
                                    </label>
                                    
                                    <Button className='btn-secondary btn-normal w-full md:w-auto md:min-w-[160px]' label={t('Cancel')} onClick={oncancel}  title={`${t('Cancel')}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}  
            {isDelete && (
                <CommonModel
                    warningText={DELETE_WARNING_TEXT}
                    onClose={onClose}
                    action={() => onRemove()}
                    show={isDelete}
                />
            )}

            {isStatusModelShow && (
                <CommonModel
                    warningText={CHANGE_STATUS_WARNING_TEXT}
                    onClose={onCloseSubscriber}
                    action={changeCategoryStatus}
                    show={isStatusModelShow}
                    disabled={statusLoading?.loading}
                    isLoading={statusLoading?.loading}
                />
            )}
        </>
    )
}

export default TenantDetailsPage
