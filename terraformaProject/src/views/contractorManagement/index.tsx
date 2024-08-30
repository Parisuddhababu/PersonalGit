import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TextInput from '@components/textInput/TextInput';
import Pagination from '@components/Pagination/Pagination';
import Button from '@components/button/button';
import filterServiceProps from '@components/filter/filter';
import CommonModel from '@components/common/commonModel';
import { CHANGE_STATUS_WARNING_TEXT, DELETE_WARNING_TEXT, PAGE_LIMIT, PAGE_NUMBER, ROUTES, SHOW_PAGE_COUNT_ARR, ContractorStatus } from '@config/constant';
import { ArrowSortingDown, ArrowSortingUp, Edit, Eye, GetDefaultIcon, Search, Trash } from '@components/icons/icons';
import { useMutation, useQuery } from '@apollo/client';
import { PaginationParams, ColArrType } from '@types';
import UpdatedHeader from '@components/header/updatedHeader';
import { DELETE_CONTRACTOR_COMPANY } from '@framework/graphql/mutations/employeeuser';
import { setCustomCreateNewAccountStep } from 'src/redux/courses-management-slice';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileType, UserRoles } from 'src/types/common';
import { CONTRACTOR_MANAGEMENT_LISTING } from '@framework/graphql/queries/contractorMangment';
import { setCreateNewContractor, userCompanyType } from 'src/redux/user-profile-slice';
import { CHANGE_CONTRACTOR_STATUS } from '@framework/graphql/mutations/contractorPage';

interface ContractorDataTypes {
    branch: {
        id: number;
        uuid: string;
        status: number;
        name: string;
        user_count: number;
        location: string
    }
    company: {
        uuid: string;
        name: string;
        website_url: string
    }
    user_count: number;
    status: number
}
const ContractorManagement = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [updateContractorStatus, loading] = useMutation(CHANGE_CONTRACTOR_STATUS)
    const [deleteCompanyById, deleteCompanyLoading] = useMutation(DELETE_CONTRACTOR_COMPANY);
    const [isDeleteCompanyData, setIsDeleteCompanyData] = useState<string>('');
    const [isDeleteCompanyContractorData, setIsDeleteCompanyContractorData] = useState<string>('');
    const [isDeleteCompany, setIsDeleteCompany] = useState<boolean>(false);
    const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false)
    const dispatch = useDispatch();
    const [filterData, setFilterData] = useState<PaginationParams>({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortOrder: 'descend',
        search: '',
        sortField: 'createdAt',
        index: 0

    });
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
    const [contractorObj, setContractorObj] = useState({} as ContractorDataTypes);
    const { contractor } = useSelector(((state: { rolesManagement: { contractor: UserRoles } }) => state.rolesManagement));
    const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const COL_ARR_CONTRACTOR = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Company Name'), sortable: true, fieldName: 'createdAt' },
        { name: t('Location'), sortable: true, fieldName: 'createdAt' },
        { name: t('Number of User'), sortable: false },
        { name: t('Website Url'), sortable: true, fieldName: 'createdAt' },
        { name: t('Status'), sortable: true, fieldName: 'status' },
    ] as ColArrType[];

    const { data, refetch } = useQuery(CONTRACTOR_MANAGEMENT_LISTING, {
        variables: {
            userData: {
                company_type: 2,
                limit: filterData.limit,
                search: filterData.search,
                sortOrder: filterData.sortOrder,
                sortField: filterData.sortField,
                page: filterData.page,
            }
        }
    });

    useEffect(() => {
        refetch(filterData).catch((err) => toast.error(err))
    }, [filterData])

    /**
        * Method used for Add Subscriber sets data
    */
    function handleAddContractor() {
        dispatch(userCompanyType(2));
        dispatch(setCreateNewContractor(true))
        dispatch(setCustomCreateNewAccountStep(1))
        navigate(`/${ROUTES.app}/${ROUTES.create3rdPartyCompanyAccount}/?contractor-company-list=true`)
    }
    /**
     *
     * @param sortFieldName Method used for storing sort data
     */

    const onHandleSortContractor = (sortFieldName: string) => {
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
    const onPageDrpSelectContractor = (e: string) => {
        setRecordsPerPage(Number(e))
        const updatedFilterData = {
            ...filterData,
            limit: parseInt(e),
            page: PAGE_NUMBER,
            index: 0,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterContractorUser', JSON.stringify(updatedFilterData));
    };

    const totalUser = data?.getTenantsContractorsCompaniesWithPagination?.data?.count || 0;
    const totalPages = Math.ceil(totalUser / recordsPerPage);
    const handlePageChange = useCallback((newPage: number): void => {
        const updatedFilterData = {
            ...filterData,
            page: newPage,
            index: (newPage - 1) * filterData.limit,
        }
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterContractorUser', JSON.stringify(updatedFilterData));
    }, [filterData.limit])

    useEffect(() => {
        setRecordsPerPage(filterData.limit);
    }, [filterData.limit]);
    /**
 * Method used for delete user data
 */

    const deleteContractor = useCallback(() => {
        deleteCompanyById({
            variables: {
                contractorCompanyId: isDeleteCompanyData,
                contractorBranchId: isDeleteCompanyContractorData
            },
        })
            .then((res) => {
                const data = res.data
                toast.success(data.deleteContractorCompany.message)
                setTimeout(() => {
                    refetch(filterData).catch((error) => toast.error(error))
                }, 1000)
                setIsDeleteCompany(false)
            })
            .catch((err) => {
                toast.error(err?.networkError?.result?.errors[0].message)
            })
    }, [isDeleteCompanyData,isDeleteCompanyContractorData]);

    const onDeleteCompany = useCallback((uuid: string, branchId: string) => {
        setIsDeleteCompanyData(uuid);
        setIsDeleteCompanyContractorData(branchId)
        setIsDeleteCompany(true);
    }, [])
    /**
   *
   * @param e Method used for store search value
   */
    const onSearchContractor = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterData({ ...filterData, search: e.target.value })
    }, [])

    const subscriberUUID = userProfileData?.getProfile?.data?.subscriber_id?.uuid;


    /**
     *
     * @param obj Method Used for edit Category data
     */

    const headerActionConst = () => {
        return (
            <>
                {(subscriberUUID && contractor?.write) && <Button
                    className='ml-5 btn-normal md: btn btn-secondary'
                    onClick={handleAddContractor}
                    type='button'
                    label={t('Create New Contractor')}
                />}
            </>
        )
    }
    const onEdit = useCallback((uuid: string, branchId: string | undefined) => {
        dispatch(userCompanyType(2));
        dispatch(setCreateNewContractor(true))
        dispatch(setCustomCreateNewAccountStep(1))
        navigate(`/${ROUTES.app}/${ROUTES.create3rdPartyCompanyAccount}/?company_uuid=${uuid}&edit-contractor-company=true&branch_id=${branchId}`)
    }, []);

    const onView = useCallback((uuid: string, branchId: string | undefined) => {
        navigate(`/${ROUTES.app}/${ROUTES.vendorDetails}/?company_uuid=${uuid}&branch_id=${branchId}`)
    }, [])

    /**
 * Method used for change Category status model
 */
    const onChangeStatus = useCallback((data: ContractorDataTypes) => {
        setIsStatusModelShow(true)
        setContractorObj(data)
    }, [])

    const changeCategoryStatus = useCallback(() => {
        updateContractorStatus({
            variables: {
                companyId: contractorObj?.company?.uuid,
                branchId: contractorObj?.branch?.uuid
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
    const onCloseContractor = useCallback(() => {
        setIsStatusModelShow(false)
    }, []);

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            <div className='p-3 mb-3 bg-white border rounded-xl border-border-primary mx-7 md:p-5'>
                <div className='flex flex-col flex-wrap justify-between gap-3 mb-3 md:gap-5 md:mb-5 btn-group md:flex-row'>
                    <h6 className='w-full leading-7 xmd:w-auto'>{t('Contractor Management')}</h6>
                    <div className='w-full md:w-auto'>
                        <TextInput
                            type='text'
                            id='table-search'
                            value={filterData.search}
                            placeholder={t('Search')}
                            onChange={onSearchContractor}
                            inputIcon={<Search fontSize='18' className='font-normal' />}
                        />
                    </div>
                </div>
                <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                    <table>
                        <thead key='sorting'>
                            <tr>
                                {COL_ARR_CONTRACTOR?.map((colValUser: ColArrType, index: number) => {
                                    return (
                                        <th scope='col' key={`${index + 1}`} className={`${colValUser.name == 'Sr.No' ? 'pl-7' : ''}`}>
                                            <div className='flex items-center'>
                                                {colValUser.name}
                                                {colValUser.sortable && (
                                                    <button onClick={() => onHandleSortContractor(colValUser.fieldName)}>
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
                            {data?.getTenantsContractorsCompaniesWithPagination?.data?.data?.map((data: ContractorDataTypes , index: number) => {
                                const displayIndex = filterData?.index as number + index + 1;
                                const branchId = data?.branch?.uuid
                                return (
                                    <tr key={`${index + 1}`} >

                                        <td scope='row' className='text-left pl-7'>
                                            {displayIndex}
                                        </td>
                                        <td className='text-left'>{data?.company?.name}</td>
                                        <td className='text-left'>{data?.branch?.location}</td>
                                        <td className='text-left'>{data?.user_count}</td>
                                        <td className='text-left'>{data?.company?.website_url}</td>
                                        <td className='text-left'>
                                            <div className='flex'>
                                                {data?.status === 1 ? (
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

                                        <td className='text-left'>
                                            <div className='flex items-center gap-2.5'>
                                                {(subscriberUUID && contractor?.read) && <Button onClick={() => onView(data?.company?.uuid, branchId)} label={''}><Eye className='text-success' /> </Button>}
                                                {(subscriberUUID && contractor?.update) && <Button className='bg-transparent btn-default' onClick={() => onEdit(data?.company?.uuid, branchId)} label={''} title={`${t('Edit')}`}>
                                                    <Edit />
                                                </Button>}
                                                {(subscriberUUID && contractor?.delete) && <Button className='bg-transparent cursor-pointer btn-default' onClick={() => onDeleteCompany(data?.company?.uuid,branchId)} label={''} disabled={deleteCompanyLoading?.loading} title={`${t('Delete')}`} >
                                                    <Trash className='fill-error' />
                                                </Button>}
                                                {subscriberUUID && contractor?.update && <span
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
                            })}
                        </tbody>
                    </table>
                    {(data?.getTenantsContractorsCompaniesWithPagination?.data?.count === 0 ||
                        data?.getTenantsContractorsCompaniesWithPagination?.data === null) && (
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
                            onChange={(e) => onPageDrpSelectContractor(e.target.value)}
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
                {isDeleteCompany && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={() => setIsDeleteCompany(false)} action={deleteContractor} show={isDeleteCompany} />}
                {isStatusModelShow && (
                    <CommonModel
                        warningText={CHANGE_STATUS_WARNING_TEXT}
                        onClose={onCloseContractor}
                        action={changeCategoryStatus}
                        show={isStatusModelShow}
                        disabled={loading?.loading}
                    />
                )}
            </div>

        </>
    );
};
export default ContractorManagement;

