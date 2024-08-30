import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TextInput from '@components/textInput/TextInput';
import Pagination from '@components/Pagination/Pagination';
import Button from '@components/button/button';
import filterServiceProps from '@components/filter/filter';
import CommonModel from '@components/common/commonModel';
import { CHANGE_STATUS_WARNING_TEXT, ContractorStatus, DELETE_WARNING_TEXT, PAGE_LIMIT, PAGE_NUMBER, ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { ArrowSortingDown, ArrowSortingUp, Cross, Edit, Eye, GetDefaultIcon, Search, Trash } from '@components/icons/icons';
import { useMutation, useQuery } from '@apollo/client';
import { PaginationParams, ColArrType } from '@types';
import UpdatedHeader from '@components/header/updatedHeader';
import { FETCH_TENANT_COMPANY_LIST } from '@framework/graphql/queries/employeeuser';
import { DELETE_TENANT_COMPANY } from '@framework/graphql/mutations/employeeuser';
import { setCustomCreateNewAccountStep } from 'src/redux/courses-management-slice';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileType, UserRoles } from 'src/types/common';
import { setCreateNewCompany, userCompanyType } from 'src/redux/user-profile-slice';
import { CHANGE_CONTRACTOR_STATUS } from '@framework/graphql/mutations/contractorPage';
interface TenantDataTypes {
    id: number;
    uuid: string;
    status: number;
    name: string;
    description: string;
    website_url: string;
    user_count: number;
    address: string;
    company?:{
        name?: string;
        website_url?: string;
        uuid:string;
    }
    branch?:{
        uuid:string;
        location?: string;
        status?: number;
    }
}
const TenantManagement = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { tenant } = useSelector(((state: { rolesManagement: { tenant: UserRoles } }) => state.rolesManagement));
    const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const [deleteTenantCompany, deleteCompanyLoading] = useMutation(DELETE_TENANT_COMPANY);
    const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false)
    const [tenantObj, setTenantObj] = useState({} as TenantDataTypes);
    const [updateContractorStatus, loading] = useMutation(CHANGE_CONTRACTOR_STATUS)
    const COL_ARR_TENANT_COMPANY = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Name'), sortable: true, fieldName: 'createdAt' },
        { name: t('Location'), sortable: true , fieldName: 'createdAt'},
        { name: t('Number of User'), sortable: false },
        { name: t('Website Url'), sortable: true, fieldName: 'createdAt' },
        { name: t('Status'), sortable: true, fieldName: 'status' },
    ] as ColArrType[];
    const [isDeleteCompanyData, setIsDeleteCompanyData] = useState<string>('');
    const [isDeleteCompanyBranchData, setIsDeleteCompanyBranchData] = useState<string>('');
    const [isDeleteCompany, setIsDeleteCompany] = useState<boolean>(false);
    const [isUserCountDelete, setIsUserCountDelete] = useState<boolean>(false);
    const [filterData, setFilterData] = useState<PaginationParams>({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortOrder: 'descend',
        search: '',
        sortField: 'createdAt',
        index: 0
    });
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
    const { data: getTenantCompanyData, refetch } = useQuery(FETCH_TENANT_COMPANY_LIST, {
        variables: {
            userData: {
                company_type: 1,
                limit: filterData.limit,
                search: filterData.search,
                sortOrder: filterData.sortOrder,
                sortField: filterData.sortField,
                page: filterData.page,
            },
        },
    });

    /**
        * Method used for Add Subscriber sets data
    */
    function handleAddUser() {
        dispatch(userCompanyType(1));
        dispatch(setCreateNewCompany(true))
        dispatch(setCustomCreateNewAccountStep(1))
        navigate(`/${ROUTES.app}/${ROUTES.create3rdPartyCompanyAccount}/?tenant-company-list=true`)
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

    const totalUser = getTenantCompanyData?.getTenantsContractorsCompaniesWithPagination?.data?.count || 0; // Need to changes
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

    const deleteUser = useCallback(() => {
        deleteTenantCompany({
            variables: {
                tenantCompanyId: isDeleteCompanyData,
                tenantBranchId: isDeleteCompanyBranchData
            },
        })
            .then((res) => {
                const data = res.data
                toast.success(data.deleteTenantCompany.message)
                setTimeout(() => {
                    refetch(filterData).catch((error) => toast.error(error))
                }, 1000)
                setIsDeleteCompany(false)
            })
            .catch((err) => {
                toast.error(err?.networkError?.result?.errors[0].message)
            })
    }, [isDeleteCompanyData,isDeleteCompanyBranchData]);

    const onSearchUser = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterData({ ...filterData, search: e.target.value })
    }, [])

    const subscriberUUID = userProfileData?.getProfile?.data?.subscriber_id?.uuid;
    
    useEffect(() => {
        refetch(filterData).catch((err) => toast.error(err))
    }, [filterData])

    const headerActionConst = () => {
        return (
            <>
                {(subscriberUUID && tenant?.write) && <Button
                    className='ml-5 btn-normal md: btn btn-secondary'
                    onClick={handleAddUser}
                    type='button'
                    label={t('Create New Tenant')}
                />}
            </>
        )
    }
    const onEdit = useCallback((uuid: string | undefined,branchId:string |undefined) => {
        dispatch(userCompanyType(1));
        dispatch(setCreateNewCompany(true))
        dispatch(setCustomCreateNewAccountStep(1))
        navigate(`/${ROUTES.app}/${ROUTES.create3rdPartyCompanyAccount}/?company_uuid=${uuid}&edit-tenant-company=true&branch_id=${branchId}`)
    }, []);

    const onView = useCallback((uuid: string|undefined,branchId:string |undefined) => {
        navigate(`/${ROUTES.app}/${ROUTES.tenantDetailsPage}/?company_uuid=${uuid}&branch_id=${branchId}`)
    }, [])

    const onDeleteCompany = useCallback((uuid: string | undefined,branchId:string|undefined ,userCount: number) => {
        if (userCount > 0) {
            setIsUserCountDelete(true);
        } else {
            setIsDeleteCompanyData(uuid ?? '');
            setIsDeleteCompanyBranchData(branchId ?? '')
            setIsDeleteCompany(true);
        }
    }, [])
    /**
* Method used for change Category status model
*/
    const onChangeStatus = useCallback((data: TenantDataTypes) => {
        setIsStatusModelShow(true)
        setTenantObj(data)
    }, [])

    const changeCategoryStatus = useCallback(() => {
        updateContractorStatus({
            variables: {
                companyId: tenantObj.company?.uuid,
                branchId: tenantObj?.branch?.uuid
            },
        })
            .then((res) => {
                const data = res.data
                toast.success(data.activeInActiveCompany.message)
                setIsStatusModelShow(false)
                setTimeout(() => {
                    refetch(filterData)
                }, 1000)
            })
            .catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message)
            })
    }, [isStatusModelShow])
    /**
* Method used for close model
*/
    const onCloseSubscriber = useCallback(() => {
        setIsStatusModelShow(false)
    }, []);

    const onCancel = useCallback(() => {
        setIsUserCountDelete(false);
    }, [])
    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            <div className='p-3 mb-3 bg-white border rounded-xl border-border-primary mx-7 md:p-5'>
                <div className='flex flex-col flex-wrap justify-between gap-3 mb-3 md:gap-5 md:mb-5 btn-group md:flex-row'>
                    <h6 className='w-full leading-7 xmd:w-auto'>{t('Tenant Company List')}</h6>
                    <div className='w-full md:w-auto'>
                        <TextInput
                            type='text'
                            id='table-search'
                            value={filterData.search}
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
                                {COL_ARR_TENANT_COMPANY?.map((colValUser: ColArrType, index: number) => {
                                    return (
                                        <th scope='col' key={`tenant-management${index + 1}`} className={`${colValUser.name == 'Sr.No' ? 'pl-7' : ''}`}>
                                            <div className='flex items-center'>
                                                {colValUser.name}
                                                {colValUser.sortable && (
                                                    <button onClick={() => onHandleSortUser(colValUser.fieldName)} title=''>
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
                            {getTenantCompanyData?.getTenantsContractorsCompaniesWithPagination?.data?.data?.map((data: TenantDataTypes, index: number) => {
                                const displayIndex = filterData?.index as number + index + 1;
                                const branchId=data?.branch?.uuid
                                return (
                                    <tr key={`${index + 1}`}>

                                        <td scope='row' className='text-left pl-7'>
                                            {displayIndex}
                                        </td>
                                        <td className='text-left'>{data?.company?.name}</td>
                                        <td className='text-left'>{data?.branch?.location}</td>
                                        <td className='text-left'>{data?.user_count}</td>
                                        <td className='text-left'>{data?.company?.website_url}</td>
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
                                        <td>
                                            <div className='flex'>
                                                {(subscriberUUID && tenant?.read) && <Button className='mr-2.5 bg-transparent btn-default' onClick={() => onView(data?.company?.uuid,branchId)} label={''}>
                                                    <Eye className='text-success' />
                                                </Button>}
                                                {(subscriberUUID && tenant?.update) && <Button className='mr-2.5 bg-transparent btn-default' onClick={() => onEdit(data?.company?.uuid, branchId)} label={''}>
                                                    <Edit />
                                                </Button>}
                                                {(subscriberUUID && tenant?.delete) && <Button className='mr-2.5 bg-transparent cursor-pointer btn-default' onClick={() => onDeleteCompany(data?.company?.uuid, branchId, data?.user_count)} label={''} disabled={deleteCompanyLoading?.loading} >
                                                    <Trash className='fill-error' />
                                                </Button>}
                                                <div className='flex justify-center'>
                                                    {subscriberUUID && tenant?.update && <span
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
                    {(getTenantCompanyData?.getTenantsContractorsCompaniesWithPagination?.data?.count === 0 ||
                        getTenantCompanyData?.getTenantsContractorsCompaniesWithPagination?.data?.data === null) && (
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
                {isDeleteCompany && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={() => setIsDeleteCompany(false)} action={deleteUser} show={isDeleteCompany} />}
                {isStatusModelShow && (
                    <CommonModel
                        warningText={CHANGE_STATUS_WARNING_TEXT}
                        onClose={onCloseSubscriber}
                        action={changeCategoryStatus}
                        show={isStatusModelShow}
                        disabled={loading?.loading}
                    />
                )}
            </div>
            {isUserCountDelete && (
                <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${isUserCountDelete ? '' : 'hidden'}`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${isUserCountDelete ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
                        <div className='w-full mx-5 max-w-[700px]'>
                            <div className='relative bg-white rounded-xl'>
                                <div className='flex flex-wrap items-center justify-between gap-4 p-5 border-b bg-accents-2 rounded-t-xl'>
                                    <p className='text-lg font-bold md:text-xl text-error'>{''}</p>
                                    <Button onClick={onCancel} label={t('')}  title={`${t('Close')}`} >
                                        <span className='text-xl-22'><Cross className='text-error' /></span>
                                    </Button>
                                </div>
                                <div className='w-full'>
                                    <p className='flex items-center justify-center m-5 text-lg font-bold text-center md:text-xl text-error'>{'To delete this company, First delete the associated users then delete this company.'}</p>
                                    <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                        <Button className='btn-secondary btn-normal w-full md:w-[90px]' label={t('Close')} onClick={onCancel} type='button'  title={`${t('Close')}`}  />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default TenantManagement;

