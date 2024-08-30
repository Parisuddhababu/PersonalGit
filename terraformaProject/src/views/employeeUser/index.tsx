import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import TextInput from '@components/textInput/TextInput';
import Pagination from '@components/Pagination/Pagination';
import Button from '@components/button/button';
import filterServiceProps from '@components/filter/filter';
import DeleteBtn from '@components/common/deleteBtn';
import CommonModel from '@components/common/commonModel';
import { API_BASE_URL, CHANGE_STATUS_WARNING_TEXT, ContractorStatus, DELETE_WARNING_TEXT, PAGE_LIMIT, PAGE_NUMBER, ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { ArrowSortingDown, ArrowSortingUp, Cross, DropdownArrowDown, Edit, Eye, GetDefaultIcon, ImportDoc, Search } from '@components/icons/icons';
import { SubscriberDatalist } from '@framework/graphql/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { PaginationParams, ColArrType, DropdownOptionType } from '@types';
import UpdatedHeader from '@components/header/updatedHeader';
import { FETCH_EMPLOYEE_USER_LIST } from '@framework/graphql/queries/employeeuser';
import { DELETE_EMPLOYEE_USER } from '@framework/graphql/mutations/employeeuser';
import axios from 'axios'
import DecryptionFunction from 'src/services/decryption';
import { setCreateNewAccountStep } from 'src/redux/courses-management-slice';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileType, UserRoles } from 'src/types/common';
import DropDown from '@components/dropdown/dropDown';
import { SUBSCRIBER_LOCATION } from '@framework/graphql/queries/createEmployeeLocation';
import Loader from '@components/common/loader';
import { CHANGE_EMPLOYEE_STATUS } from '@framework/graphql/mutations/contractorPage';
import RejectedUserPopup from '@components/tenantDetails/rejectedUserPopup';
import { importEmployeeList } from '@config/common';

interface RejectedUserType {    
    uuid: string,
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    role: string,
    reason: string
}

interface EmployeeData {
    first_name: string,
    last_name: string,
    email: string,
    phone_number: number,
    department: string,
    user_roles: [],
    uuid: string,
    status: number,
    user_branches: [{ branch: { uuid: string } }],
}

const EmployeeUser = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [deleteEmployeeById] = useMutation(DELETE_EMPLOYEE_USER);
    const [isDeleteUserEmployee, setIsDeleteUserEmployee] = useState<boolean>(false);
    const [userObj, setUserObj] = useState({} as SubscriberDatalist);
    const [loading, setLoading] = useState<boolean>(false);
    const encryptedToken = localStorage.getItem('authToken') as string;
    const token = encryptedToken && DecryptionFunction(encryptedToken);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [rejectedUserPopup, setRejectedUserPopup] = useState<boolean>(false);
    const dispatch = useDispatch();
    const [rejectedUsersData, setRejectedUsersData] = useState<{ successCount: number; rejectCount: number; totalCount: number; rejectedUsers: RejectedUserType[] }>({ successCount: 0, rejectCount: 0, totalCount: 0, rejectedUsers: [] });
    const [filterData, setFilterData] = useState<PaginationParams>({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortOrder: 'descend',
        search: '',
        sortField: 'createdAt',
        index: 0

    });
    const [locationSelection, setLocationSelection] = useState<string>('')
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
    const { employee } = useSelector(((state: { rolesManagement: { employee: UserRoles } }) => state.rolesManagement));
    const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const [stateDrpData, setStateDrpData] = useState<DropdownOptionType[]>([]);
    const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false)
    const [tenantObj, setTenantObj] = useState({} as EmployeeData);
    const [updateEmployeeStatus, statusLoading] = useMutation(CHANGE_EMPLOYEE_STATUS);
    const COL_ARR_SUBSCRIBER = [
        { name: t('Sr.No'), sortable: false },
        { name: t('First Name'), sortable: true, fieldName: 'first_name' },
        { name: t('Last Name'), sortable: true, fieldName: 'last_name' },
        { name: t('Email'), sortable: true, fieldName: 'email' },
        { name: t('Phone Number'), sortable: true, fieldName: 'phone_number' },
        { name: t('Department'), sortable: true, fieldName: 'department' },
        { name: t('Status'), sortable: true, fieldName: 'status' },
        { name: t('Role'), sortable: true, fieldName: 'user_roles.role_id.name' },
    ] as ColArrType[];
    const { data: subscriberLocation } = useQuery(SUBSCRIBER_LOCATION, { variables: { companyId: '' } });

    const { data, refetch: getEmployeeData } = useQuery(FETCH_EMPLOYEE_USER_LIST, {
        variables: {
            sortOrder: filterData.sortOrder,
            limit: filterData.limit,
            page: filterData.page,
            search: filterData.search,
            sortField: filterData.sortField,
        },
    });

    /**
     * Method used for close model
     */
    const onCloseUserEmployee = useCallback(() => {
        setIsDeleteUserEmployee(false);
    }, []);


    /**
        * Method used for Add Subscriber sets data
    */
    function handleAddUser () {
        dispatch(setCreateNewAccountStep());
        navigate(`/${ROUTES.app}/${ROUTES.createNewAccount}/?employees-user-list=true`)
    }
    /**
     *
     * @param sortFieldName Method used for storing sort data
     */

    const onHandleSortUser = (sortFieldName: string) => {
        setFilterData({
            ...filterData,
            sortField: sortFieldName,
            sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
        });
    };

    useEffect(() => {
        if (subscriberLocation?.subscriberLocations) {
            const tempDataArr = [] as DropdownOptionType[];
            subscriberLocation?.subscriberLocations?.data?.map((data: { location: string, uuid: string }) => {
                tempDataArr.push({ name: data.location, key: data?.uuid });
            });
            setStateDrpData(tempDataArr);
        }
    }, [subscriberLocation]);
    /**
     *
     * @param e Method used for change dropdown for page limit
     */
    const onPageDrpSelectUser = (e: string) => {
        setRecordsPerPage(Number(e))
        const updatedFilterData = {
            ...filterData,
            limit: parseInt(e),
            page: PAGE_NUMBER,
            index: 0,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterEmployeeUser', JSON.stringify(updatedFilterData));
    };

    const totalUser = data?.getSubscriberEmployeesUserListWithPagination?.data?.count || 0;
    const totalPages = Math.ceil(totalUser / recordsPerPage);
    const handlePageChange = useCallback((newPage: number): void => {
        const updatedFilterData = {
            ...filterData,
            page: newPage,
            index: (newPage - 1) * filterData.limit,
        }
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterEmployeeUser', JSON.stringify(updatedFilterData));
    }, [filterData.limit])

    useEffect(() => {
        setRecordsPerPage(filterData.limit);
    }, [filterData.limit]);
    /**
 * Method used for delete user data
 */

    const deleteUser = useCallback(() => {
        deleteEmployeeById({
            variables: {
                subscriberUserId: userObj.uuid,
                userData: {
                    user_type: 3
                }
            },
        })
            .then((res) => {
                const data = res.data
                toast.success(data.deleteSubscriberEmployeeUser.message)
                setIsDeleteUserEmployee(false)
                getEmployeeData(filterData).catch((error) => toast.error(error))
            })
            .catch((err) => {
                toast.error(err?.networkError?.result?.errors[0].message)
            })
    }, [userObj.uuid]);

    /**
   *
   * @param e Method used for store search value
   */
    const onSearchUser = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterData({ ...filterData, search: e.target.value })
    }, [])

    const subscriberUUID = userProfileData?.getProfile?.data?.subscriber_id?.uuid;

    useEffect(() => {
        getEmployeeData(filterData).catch((err) => toast.error(err))
    }, [filterData])
    /**
     *
     * @param obj Method Used for edit Category data
     */

    const headerActionConst = () => {
        return (
            <>
                {(subscriberUUID && employee?.write) && <Button
                    className='ml-5 btn-normal md: btn btn-secondary'
                    onClick={handleAddUser}
                    type='button'
                    label={t('Create New Employee')}
                />}
            </>
        )
    }
    const onEdit = useCallback((uuid: string, branchIdName: string[], userType: number) => {
        navigate(`/${ROUTES.app}/${ROUTES.userDetails}/?uuid=${uuid}&branchId=${branchIdName}&userTypeId=true&userTypeValue=${userType}`)
    }, []);

    const onView = useCallback((uuid: string, branchIdName: string[]) => {
        navigate(`/${ROUTES.app}/${ROUTES.userDetails}/?uuid=${uuid}&branchId=${branchIdName}&read_Data=true&userTypeId=true`)
    }, [])

    const [userPopup, setUserPopup] = useState(false)

    const oncancel = () => {
        setRejectedUserPopup(false);
        setUserPopup(false);
    }
    const onDownloadCsv = useCallback(() => {
        axios.get(`${API_BASE_URL}users/export-employee-user-csv/`, { headers: { authorization: token ? `Bearer ${token}` : '' }, responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Employee-Users.csv');
                document.body.appendChild(link);
                link.click();
                toast.success(response?.data?.message);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    }, []);

    const onImportEmployeeList = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserPopup(false)
        const files = event.currentTarget.files;      
        await importEmployeeList({
            files,
            companyId: '',
            branchId: locationSelection,
            onImportCallBack: ()=>{getEmployeeData(filterData).catch((error) => toast.error(error));},
            setRejectedUserPopup,
            setRejectedUsersData,
			employeeType: '3'
        }) 
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [locationSelection]);

    const onDownloadSampleCsv = useCallback(() => {
        axios.get(`${API_BASE_URL}media/download-csv/employee`, { headers: { authorization: `Bearer ${token}`}, responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Employee-Sample.csv');
                document.body.appendChild(link);
                link.click();
                toast.success(response?.data?.message);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    }, []);
    const handleOpenImportList = () => {
        setUserPopup(true)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onHandleLocation = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setLocationSelection(e.target.value)
    }

    const onChangeStatus = useCallback((data: EmployeeData) => {
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
                getEmployeeData()
            })
            .catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message)
            })
    }, [isStatusModelShow])

    const onCloseSubscriber = useCallback(() => {
        setIsStatusModelShow(false)
    }, []);
  
    

    return (
        <>
            {loading && <Loader />}
            <UpdatedHeader headerActionConst={headerActionConst} />
            <div className='p-3 mb-3 bg-white border rounded-xl border-border-primary mx-7 md:p-5'>
                <div className='flex flex-col flex-wrap justify-between gap-3 mb-5 md:gap-5 md:flex-row'>
                    <h6 className='w-full leading-7 xmd:w-auto'>{t('Employee User')}</h6>
                    <div className='flex flex-wrap gap-y-3 gap-x-4'>
                        <button className="w-full btn btn-gray md:w-[260px] p-3.5" onClick={handleOpenImportList} title={`${t('Import')}`} >Import Employees List <ImportDoc className='order-2 ml-auto ' /></button>

                        <button className="w-full btn btn-gray md:w-[260px] p-3.5" onClick={()=>onDownloadCsv()} title={`${t('Export')}`}>
                            Export Employees List  <ImportDoc className='order-2 ml-auto ' />
                        </button>

                        <button className="btn bg-default btn-secondary btn-normal w-full md:w-[220px] " type="button" onClick={() => onDownloadSampleCsv()} title={`${t('Download')}`}>Download Sample CSV</button>

                        <TextInput
                            type='text'
                            id='table-search'
                            value={filterData.search}
                            className='w-full md:w-[230px]'
                            placeholder={t('Search')}
                            onChange={onSearchUser}
                            inputIcon={<Search fontSize='18' className='font-normal' />}
                        />
                    </div>
                </div>
                <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                    <table>
                        <thead key='sorting'>
                            <tr>
                                {COL_ARR_SUBSCRIBER?.map((colValUser: ColArrType, index: number) => {
                                    return (
                                        <th scope='col' key={`sub-${index + 1}`} className={`${colValUser.name == 'Sr.No' ? 'pl-7' : ''}`}>
                                            <div className='flex items-center'>
                                                {colValUser.name}
                                                {colValUser.sortable && (
                                                    <button onClick={() => onHandleSortUser(colValUser.fieldName)}>
                                                        {(filterData.sortOrder === '' || filterData.sortField !== colValUser.fieldName) &&
                                                            <GetDefaultIcon className='w-3 h-3 ml-1 fill-white' />}
                                                        {filterData.sortOrder === 'ascend' && filterData.sortField === colValUser.fieldName &&
                                                            <ArrowSortingUp className="ml-1 fill-white" />}
                                                        {filterData.sortOrder === 'descend' && filterData.sortField === colValUser.fieldName &&
                                                            <ArrowSortingDown className="ml-1 fill-white" />}
                                                    </button>
                                                )}
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
                            {data?.getSubscriberEmployeesUserListWithPagination?.data?.employee?.map((data: { first_name: string, last_name: string, email: string, phone_number: number, department: string, user_roles: [], uuid: string, status: number, user_branches: [{ branch: { uuid: string } }], user_type: number }, index: number) => {
                                const displayIndex = filterData?.index as number + index + 1;
                                const branchIdName = data?.user_branches?.map((branch: { branch: { uuid: string } }) => {
                                    return branch?.branch?.uuid;
                                })
                                return (
                                    <tr key={data?.uuid}>

                                        <td scope='row' className='text-left pl-7'>
                                            {displayIndex}
                                        </td>
                                        <td className='text-left'>{data.first_name}</td>
                                        <td className='text-left'>{data.last_name}</td>
                                        <td className='text-left'>{data.email}</td>
                                        <td className='text-left'>{data.phone_number}</td>
                                        <td className='text-left'>{data.department}</td>
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
                                        {data?.user_roles?.map((userRole: { role_id: { name: string, uuid: string } }) => (
                                            <td key={userRole?.role_id?.uuid} className='text-left'>{userRole?.role_id?.name}</td>
                                        ))}
                                        <td>
                                            <div className='flex gap-2.5'>
                                                {(subscriberUUID && employee?.read) && <Button onClick={() => onView(data.uuid, branchIdName)} label={''}><Eye className='bg-transparent text-success' /> </Button>}
                                                {(subscriberUUID && employee?.update) && <Button className='bg-transparent btn-default' onClick={() => onEdit(data?.uuid, branchIdName, data?.user_type)} label={''}>
                                                    <Edit />
                                                </Button>}
                                                {(subscriberUUID && employee?.delete) && <DeleteBtn data={data} setObj={setUserObj} setIsDelete={setIsDeleteUserEmployee} />}

                                                <div className='flex justify-center'>
                                                    {subscriberUUID && employee?.update && <span
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
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {(data?.getSubscriberEmployeesUserListWithPagination?.data?.count === 0 ||
                        data?.getSubscriberEmployeesUserListWithPagination?.data === null) && (
                            <div className='flex justify-center'>
                                <div>{t('No Data')}</div>
                            </div>
                        )}
                </div>

                <div className='flex flex-wrap items-center mt-2 overflow-auto gap-x-5 md:gap-x-7'>
                    <div className='flex items-center'>
                        <span className='text-sm font-normal text-gray-700 '>
                            {t('Per Page')}
                        </span>
                        <select
                            className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white'
                            value={filterData.limit}
                            onChange={(e) => onPageDrpSelectUser(e.target.value)}
                        >
                            {SHOW_PAGE_COUNT_ARR?.map((item: number, index: number) => {
                                return <option key={`${index + 1}`}>{item}</option>
                            })}
                        </select>
                    </div>
                    <Pagination currentPage={filterData.page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        recordsPerPage={recordsPerPage}
                    />
                </div>
                {isDeleteUserEmployee && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={onCloseUserEmployee} action={deleteUser} show={isDeleteUserEmployee} />}

            </div>
            <RejectedUserPopup
                rejectedUserPopup={rejectedUserPopup}
                rejectedUsersData={rejectedUsersData}
                oncancel={oncancel} 
            />
           
            {userPopup && (
                <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${userPopup ? '' : 'hidden'}`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${userPopup ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
                        <div className='w-full mx-5 sm:max-w-[400px]'>
                            {/* <!-- Modal content --> */}
                            <div className='relative bg-white rounded-xl'>
                                {/* <!-- Modal header --> */}
                                <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                                    <p className='text-lg font-bold md:text-xl text-baseColor'>{'Import Employees List'}</p>
                                    <Button onClick={() => oncancel()} label='' title={`${t('Close')}`}>
                                        <span className='text-xl-22'><Cross className='text-error' /></span>
                                    </Button>
                                </div>
                                {/* <!-- Modal body --> */}

                                <div className='w-full p-5'>
                                <p className='mb-4'><b className='text-error'>Note : </b>Before you upload the list, the roles should be created</p>
                                    <div className="w-full mb-5">
                                        <DropDown placeholder={t('Select Location')} className='w-full' label={t('Location')} inputIcon={<span className='text-xs'><DropdownArrowDown className='fill-dark-grey' /></span>} onChange={onHandleLocation} value={locationSelection} options={stateDrpData} name='branchId' id='branchId' required={true} />
                                    </div>
                                    
                                    <label id='importCsv' className="w-full mb-0 btn btn-gray p-3.5">
                                        Import Employees List  <ImportDoc className='order-2 ml-auto ' /> {''}
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
                                            disabled={!locationSelection}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
    );
};
export default EmployeeUser;

