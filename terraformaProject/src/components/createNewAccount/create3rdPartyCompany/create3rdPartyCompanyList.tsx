import { useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import { ArrowSortingDown, ArrowSortingUp, Filter2, GetDefaultIcon, Search } from '@components/icons/icons';
import { ROUTES, SHOW_PAGE_COUNT_ARR, SelectFromExistingDrpData } from '@config/constant';
import { ColArrType } from '@types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import filterServiceProps from '@components/filter/filter'
import Button from '@components/button/button';
import { setCreateNewCompany, setCreateNewContractor, setCreateTenantDetails, setCreateTenantPersonalDetails, setEmployeeDetails, setSelectFromExitingCompany, setSelectFromExitingContractor, userCreateEmployeeUserDetailsReset } from 'src/redux/user-profile-slice';
import { setBackCreateNewAccountStep, setCustomCreateNewAccountStep } from 'src/redux/courses-management-slice';
import { useDispatch, useSelector } from 'react-redux';
import { CompanyOrTenantDetailsType } from 'src/types/common';
import { GET_COMPANIES_WITH_PAGINATION_DATA } from '@framework/graphql/queries/getCompanies';
import TextInput from '@components/textInput/TextInput';
import DropDown from '@components/dropdown/dropDown';
import { useNavigate } from 'react-router-dom';

interface PaginationParams {
    limit: number,
    page: number,
    sortField: string,
    sortOrder: string,
    search: string,
    company_type: number,
}

function Create3rdPartyCompanyList() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { createNewCompany, selectFromExitingCompany, companyType, createNewContractor, selectFromExitingContractor } = useSelector((state: { userProfile: CompanyOrTenantDetailsType }) => state.userProfile);
    const { data: getCompaniesData, refetch } = useQuery(GET_COMPANIES_WITH_PAGINATION_DATA, { variables: { filterData: { company_type: companyType, limit: 10, page: 1, search: '', sortOrder: 'DESC', sortField: 'c."createdAt"' } } })
    const [filterData, setFilterData] = useState<PaginationParams>({ limit: 10, page: 1, sortField: 'createdAt', sortOrder: '', search: '', company_type: companyType })
    const COL_ARR_ROLE = companyType !== 2 ? [
        { name: 'Sr.No', sortable: false, fieldName: 'id' },
        { name: t('Company Name'), sortable: true, fieldName: 'cb.name' },
        { name: t('Branch Name'), sortable: true, fieldName: 'sb.location' },
        { name: t('Total Users'), sortable: false, fieldName: 'user_count' },
    ] as ColArrType[] : [
        { name: 'Sr.No', sortable: false, fieldName: 'id' },
        { name: t('Company Name'), sortable: true, fieldName: 'cb.name' },
        { name: t('Total Users'), sortable: false, fieldName: 'user_count' },
    ] as ColArrType[]
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit)
    const totalRuleSets = getCompaniesData?.getCompaniesWithPagination?.data?.count || 0
    const totalPages = Math.ceil(totalRuleSets / recordsPerPage);

    /**
    *
    * @param sortFieldName Method used for storing sort data
    */
    const onHandleSortRole = (sortFieldName: string) => {
        // refetch({ filterData: { ...filterData, sortField: sortFieldName, sortOrder: filterData.sortOrder === 'ASC' ? 'DESC' : 'ASC' } })
        setFilterData({
            ...filterData,
            sortField: sortFieldName,
            sortOrder: filterData.sortOrder === 'ASC' ? 'DESC' : 'ASC',
        })
    }

    useEffect(() => {
        if (getCompaniesData) {
            refetch();
        }
    }, [])

    /**
   * Used for refetch listing of role data after filter
   */
    useEffect(() => {
        if (filterData) {
            if (filterData.sortField.includes('.')) {
                refetch({ filterData: { ...filterData } })
            } else {
                refetch({ filterData: { ...filterData, sortField: `c."${filterData.sortField}"` } })
            }
        }
    }, [filterData])

    /**
     *
     * @param e Method used for change dropdown for page limit
    */
    const onPageDrpSelectRole = (e: string) => {
        setRecordsPerPage(Number(e))
        const updatedFilterData = {
            ...filterData,
            limit: parseInt(e),
            page: 1,
            search: ''
        }
        setFilterData(updatedFilterData)
        filterServiceProps.saveState(
            'filterCompanyListSets',
            JSON.stringify(updatedFilterData)
        )
    }

    const handlePageChangeRole = useCallback((newPage: number): void => {
        const updatedFilterData = {
            ...filterData,
            page: newPage,
        }

        setFilterData(updatedFilterData)
        filterServiceProps.saveState(
            'filterCompanyListSets',
            JSON.stringify(updatedFilterData)
        )
    }, [])

    const onBackPage = () => {
        if (createNewCompany) {
            return dispatch(setCreateNewCompany(false));
        }
        if (selectFromExitingCompany) {
            return dispatch(setSelectFromExitingCompany(false));
        }
        if (createNewContractor) {
            return dispatch(setCreateNewContractor(false));
        }
        if (selectFromExitingContractor) {
            return dispatch(setSelectFromExitingContractor(false));
        }
        else {
            return dispatch(setBackCreateNewAccountStep());
        }
    }

    /***
        * @param e Method used for store search value
    */
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterData({ ...filterData, search: e.target.value })
    }, [])

    const onAddNew = useCallback((companyId: string) => {
        dispatch(userCreateEmployeeUserDetailsReset());
        dispatch(setEmployeeDetails([]));
        dispatch(setCreateNewCompany(false));
        dispatch(setSelectFromExitingCompany(false));
        dispatch(setCreateTenantDetails([]));
        dispatch(setCreateTenantPersonalDetails([]));
        dispatch(setCustomCreateNewAccountStep(1));
        if (companyType !== 2) {
            navigate(`/${ROUTES.app}/${ROUTES.createNewAccount}/?company_uuid=${companyId}&tenant-details-page=true`)
        } else {
            navigate(`/${ROUTES.app}/${ROUTES.createNewAccount}/?company_uuid=${companyId}&contractor-details-page=true`)
        }
    }, [])

    const onFilterDrpHandleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSortOption = event.target.value;
        const [sortField, sortOrder] = selectedSortOption.split(':');
        setFilterData({
            ...filterData,
            sortField,
            sortOrder,
        });
    }

    return (
        <>
            <div className="p-5 overflow-auto border border-solid rounded-xl border-border-primary">
                <div className='flex flex-wrap items-center justify-between gap-3 mb-5 md:gap-5'>
                    <h6 className='w-full md:w-auto'>{companyType === 1 ? t('Select Tenant') : t('Select Contractor')}</h6>
                    <div className="flex flex-wrap w-full gap-3 md:flex-nowrap md:gap-5 md:w-auto">
                        <div className='w-full md:w-[236px]'>
                            <TextInput placeholder={t('Search Employee')} type='text' id='table-search' value={filterData.search} onChange={handleChange} inputIcon={<Search fontSize='18' />} />
                        </div>
                        <div className='w-full xmd:w-[150px]'>
                            <DropDown
                                className='w-full -mt-2'
                                label=''
                                inputIcon={<Filter2 className='order-2' />}
                                name='filterDrpData'
                                onChange={onFilterDrpHandleChange}
                                value={filterData.sortField + ':' + filterData.sortOrder}
                                error=""
                                options={SelectFromExistingDrpData}
                                id='filterDrpData' />
                        </div>
                    </div>
                </div>
                <div className="overflow-auto custom-dataTable">
                    <table>
                        <thead>
                            <tr>
                                {COL_ARR_ROLE?.map((colVal: ColArrType, index: number) => {
                                    return (
                                        <th
                                            scope="col"
                                            className={`whitespace-nowrap ${colVal.name == t('Sr.No') ? 'justify-start pl-7 w-[13%]' : ''}`}
                                            key={`${index + 1}`}
                                        >
                                            <div
                                                className='flex items-center'
                                            >
                                                {colVal.name}
                                                {colVal.sortable && (
                                                    <button className='cursor-pointer' onClick={() => onHandleSortRole(colVal.fieldName)} type="button">
                                                        {(filterData.sortOrder === '' ||
                                                            filterData.sortField !== colVal.fieldName) && (
                                                                <GetDefaultIcon className="fill-white" />
                                                            )}
                                                        {filterData.sortOrder === 'ASC' &&
                                                            filterData.sortField === colVal.fieldName && (
                                                                <ArrowSortingUp className="ml-1 fill-white" />
                                                            )}
                                                        {filterData.sortOrder === 'DESC' &&
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
                            {getCompaniesData?.getCompaniesWithPagination?.data?.companies?.map(
                                (data: { name: string, uuid: string, branch_name: string, branch_uuid: string, user_count: number }, index: number) => {
                                    return (
                                        //onClick={() => onDetailsPage(data?.uuid)}
                                        <tr key={`company-data-${index + 1}`}>
                                            <td className="text-left pl-7" scope="row">
                                                {index + 1}
                                            </td>
                                            <td className="text-left">{data?.name}</td>
                                            {companyType !== 2 && <td className="text-left">{data?.branch_name}</td>}
                                            <td className={`${companyType !== 2 ? 'text-center' : 'text-left'}`}>{data?.user_count}</td>
                                            <td className='text-left whitespace-nowrap'>
                                                <Button className='btn-primary' onClick={() => onAddNew(data?.uuid)} label={''}>
                                                    Add New
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                    {(getCompaniesData?.getCompaniesWithPagination?.data?.count === 0 ||
                        getCompaniesData?.getCompaniesWithPagination?.data === null) && (
                            <div className="flex justify-center">
                                <div>{t('No Data')}</div>
                            </div>
                        )}
                </div>
                <div className="flex flex-wrap items-center px-6 mt-3 gap-y-3 gap-x-6">
                    <div className="flex items-center">
                        <span className="text-sm font-normal text-gray-700 ">
                            {t('Per Page')}
                        </span>
                        <select
                            className="border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white"
                            onChange={(e) => onPageDrpSelectRole(e.target.value)}
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
                        onPageChange={handlePageChangeRole}
                        recordsPerPage={recordsPerPage}
                    />
                </div>
            </div>
            <div className='flex justify-between gap-5 mt-10'>
                <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onBackPage()} label={t('Back')}  title={`${t('Back')}`}  />
            </div>
        </>
    )
}

export default Create3rdPartyCompanyList
