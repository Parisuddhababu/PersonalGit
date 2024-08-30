import { useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import { ArrowSortingDown, ArrowSortingUp, Download, GetDefaultIcon, Layout, Sorting } from '@components/icons/icons';
import { SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { CategoryData, CategoryDataArr } from '@framework/graphql/graphql';
import { FETCH_CATEGORY } from '@framework/graphql/queries/category';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ColArrType, PaginationParams } from 'src/types/role';
import filterServiceProps from '@components/filter/filter';
import Button from '@components/button/button';

const UserManuals = () => {
    const { data, refetch } = useQuery(FETCH_CATEGORY, { variables: { limit: 10, page: 1, sortField: 'name', sortOrder: '', search: '' } });
    const [categoryData, setCategoryData] = useState({} as CategoryData);
    const [selectedAllCategory, setSelectedAllCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<number[][]>([]);
    const { t } = useTranslation();
    const [filterData, setFilterData] = useState<PaginationParams>({ limit: 10, page: 1, sortField: 'name', sortOrder: '', search: '' });
    const COL_ARR = [
        { name: t('Sr.No'), sortable: false },
        { name: t('User Manuals'), sortable: true, fieldName: 'userManuals' },
        { name: t('Download'), sortable: false },
    ] as ColArrType[];

    /**
     * Used for refetch listing of category data after filter
     */
    useEffect(() => {
        if (data?.getCategories) {
            setCategoryData(data?.getCategories?.data);
        }
        if (!selectedCategory?.length) {
            const totalPages = Math.ceil(
                data?.getCategories?.data?.count / filterData?.limit
            );
            const pages = [];
            for (let i = 0; i < totalPages; i++) {
                pages.push([]);
            }
            setSelectedCategory(pages);
        }
    }, [data?.getCategories]);

    /**method that sets all rules sets s selected */
    useEffect(() => {
        if (selectedAllCategory) {
            refetch().then((res) => {
                setSelectedCategory(
                    res?.data?.getCategories?.data?.categories?.map(
                        (i: CategoryDataArr) => i.id
                    )
                );
            });
        }
    }, [data?.getCategories]);

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
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState(
            'filterCategoryManagement',
            JSON.stringify(updatedFilterData)
        );
    };

    useEffect(() => {
        const savedFilterDataJSON = filterServiceProps.getState(
            'filterCategoryManagement',
            JSON.stringify(filterData)
        );
        if (savedFilterDataJSON) {
            const savedFilterData = JSON.parse(savedFilterDataJSON);
            setFilterData(savedFilterData);
        }
    }, []);

    useEffect(() => {
        refetch(filterData).catch((err) => toast.error(err));
    }, [filterData]);

    useEffect(() => {
        if (
            selectedCategory?.length === data?.getCategories?.data?.categories?.length
        ) {
            setSelectedAllCategory(true);
        } else {
            setSelectedAllCategory(false);
        }
    }, [selectedCategory]);

    const [recordsPerPage, setRecordsPerPage] = useState<number>(
        filterData.limit
    );
    const totalUserManagement = data?.getCategories?.data?.count || 0;
    const totalPages = Math.ceil(totalUserManagement / recordsPerPage);
    const handlePageChange = useCallback((newPage: number): void => {
        const updatedFilterData = {
            ...filterData,
            page: newPage,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState(
            'filterCategoryManagement',
            JSON.stringify(updatedFilterData)
        );
    }, []);

    useEffect(() => {
        setRecordsPerPage(filterData.limit);
    }, [filterData.limit]);

    return (
        <div className="p-5 overflow-auto border border-solid rounded-xl border-border-primary">
            <div className='flex flex-wrap items-center justify-between gap-3 mb-5 md:gap-5'>
                <h6 className='w-full md:w-auto'>{t('User Manuals')}</h6>
                <div className="flex flex-wrap w-full gap-3 md:flex-nowrap md:gap-5 md:w-auto">
                    <Button className='w-full btn btn-primary md:w-[50px]' type='submit' label={''} title=''>
                        <Layout className='order-2 fill-white' fontSize='18' />
                    </Button>
                    <Button className='w-full btn btn-gray md:w-[50px]' type='submit' label={''} title='Sort'>
                        <Sorting className='order-2' fontSize='18' />
                    </Button>
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
                                        className={`whitespace-nowrap ${colVal.name == t('Sr.No') ? 'justify-start pl-7 w-[13%]' : ''} ${colVal.name == t('Download') ? 'w-[15%] pr-7' : ''}`}
                                        key={`${index + 1}`}
                                    >
                                        <div
                                            className='flex items-center'
                                        >
                                            {colVal.name}
                                            {colVal.sortable && (
                                                <a
                                                    onClick={() =>
                                                        onHandleSortCategory(colVal.fieldName)
                                                    }
                                                >
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
                                                </a>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.getCategories?.data?.categories?.map(
                            (data: CategoryDataArr, index: number) => {
                                return (
                                    <tr key={data.uuid}>
                                        <td className="text-left pl-7" scope="row">
                                            {index + 1}
                                        </td>
                                        <td className="text-left">{data?.name}</td>
                                        <td>
                                            <div className="flex items-center justify-start gap-2 hover:underline text-primary btn-group">
                                                <Download className='fill-primary' />
                                                Download
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
                {(data?.getCategories?.data?.count === 0 ||
                    data?.getCategories?.data === null) && (
                        <div className="flex justify-center">
                            <div>{t('No Data')}</div>
                        </div>
                    )}
            </div>
            <div className="flex flex-wrap items-center px-6 mt-3 gap-y-3 gap-x-6">
                <span className="text-xs text-slate-400">
                    {`${categoryData?.count === null || categoryData?.count === undefined
                        ? '0'
                        : categoryData?.count
                        }` + t(' Total Records')}
                </span>
                <div className="flex items-center">
                    <span className="text-sm font-normal text-gray-700 ">
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
        </div>
    );
};
export default UserManuals;
