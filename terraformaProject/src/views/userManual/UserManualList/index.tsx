import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import { ArrowSortingDown, ArrowSortingUp, Download, GetDefaultIcon, Layout, Sorting } from '@components/icons/icons';
import { PAGE_LIMIT, PAGE_NUMBER, ROUTES, SHOW_PAGE_COUNT_ARR, getSignUrl } from '@config/constant';
import { toast } from 'react-toastify';
import { ColArrType, PaginationParams } from 'src/types/role';
import filterServiceProps from '@components/filter/filter';
import Button from '@components/button/button';
import { GET_ITEM_BY_CATEGORIES_PAGINATION } from '@framework/graphql/queries/userManual';
import UpdatedHeader from '@components/header/updatedHeader';

const UserManualsList = () => {
    const location = useLocation()
    const { id: subCategoryListId } = useParams();
    const queryParams = new URLSearchParams(location.search);
	const guideName = queryParams.get('guide_name');
    const { data, refetch } = useQuery(GET_ITEM_BY_CATEGORIES_PAGINATION, { variables: { limit: PAGE_LIMIT, page: PAGE_NUMBER, sortField: 'createdAt', sortOrder: 'descend', search: '', itemCategoryId: subCategoryListId } });
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [manualState, setManualState] = useState('')
    const [manualFilterData, setManualFilterData] = useState<PaginationParams>({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortField: 'createdAt',
        sortOrder: 'descend',
        search: '',
        index:0
    });
    const COL_MANUAL_ARR = [
        { name: t('Sr.No'), sortable: false },
        { name: t('User Manuals'), sortable: true, fieldName: 'name' },
        { name: t('Download'), sortable: false },
    ] as ColArrType[];
    /**
     *
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortManual = (sortFieldName: string) => {
        setManualFilterData({
            ...manualFilterData,
            sortField: sortFieldName,
            sortOrder: manualFilterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
        });
    };
    /**
     *
     * @param e Method used for change dropdown for page limit
     */

    const onPageDrpSelectManual = (e: string) => {
        setManualRecordsPerPage(Number(e));
        const updatedFilterData = {
            ...manualFilterData,
            limit: parseInt(e),
            page: 1,
            search: '',
            index: 0,
        };
        setManualFilterData(updatedFilterData);
        filterServiceProps.saveState(
            'filterUserManual',
            JSON.stringify(updatedFilterData)
        );
    };

    useEffect(() => {
        refetch(manualFilterData).catch((err) => toast.error(err));
    }, [manualFilterData]);

    const [manualRecordsPerPage, setManualRecordsPerPage] = useState<number>(
        manualFilterData.limit
    );
    const totalUserManual = data?.getItemByCategoriesPagination?.data?.count || 0;
    const totalManualPages = Math.ceil(totalUserManual / manualRecordsPerPage);
    const handleManualPageChange = useCallback((newPage: number): void => {
        const updatedFilterData = {
            ...manualFilterData,
            page: newPage,
            index: (newPage - 1) * manualFilterData.limit,
        };
        setManualFilterData(updatedFilterData);
        filterServiceProps.saveState(
            'filterUserManual',
            JSON.stringify(updatedFilterData)
        );
    }, []);

    useEffect(() => {
        setManualRecordsPerPage(manualFilterData.limit);
    }, [manualFilterData.limit]);

    /**
    * Method used for Add Subscriber sets data
*/

    useEffect(() => {
        const categoryValue = location?.state?.selectedUuid;
        setManualState(categoryValue)
    }, [manualState])
    function handleOpenEmployeeDetailsList() {
        navigate(`/${ROUTES.app}/${ROUTES.itemByCategory}/${ROUTES.itemByCategoryGrid}/${subCategoryListId}`);
    }

    return (
        <>
            <UpdatedHeader headerTitle='User Manuals' />
            <div className="p-5 overflow-auto border border-solid rounded-xl border-border-primary">

                <div className='flex flex-wrap items-center justify-between gap-3 mb-5 md:gap-5'>
                    <h6>{guideName}</h6>
                    <div className="flex flex-wrap w-full gap-3 md:flex-nowrap md:gap-5 md:w-auto ">
                        <Button className='w-full btn btn-primary md:w-[50px]' label={''} title=''>
                            <Layout className='order-2 fill-white' fontSize='18' />
                        </Button>
                        <Button className='w-full btn btn-secondary btn-normal md:w-[50px]' onClick={handleOpenEmployeeDetailsList} type='submit' label={''} title='Sort'>
                            <Sorting className='order-2' fontSize='18' />
                        </Button>
                    </div>
                </div>
                <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                    <table>
                        <thead>
                            <tr>
                                {COL_MANUAL_ARR?.map((colVal: ColArrType, index: number) => {
                                    return (
                                        <th
                                            scope='col'
                                            className={`items-center ${colVal.name == t('Download') && 'w-[16%]'} ${colVal.name == t('Sr.No') && 'pl-7'}`}
                                            key={`${index + 1}`}
                                        >
                                            <div className='flex items-center'>
                                                {colVal.name}
                                                {colVal.sortable && (
                                                    <a
                                                        onClick={() =>
                                                            onHandleSortManual(colVal.fieldName)
                                                        }
                                                    >
                                                        {(manualFilterData.sortOrder === '' ||
                                                            manualFilterData.sortField !== colVal.fieldName) && (
                                                                <GetDefaultIcon className="fill-white" />
                                                            )}
                                                        {manualFilterData.sortOrder === 'ascend' &&
                                                            manualFilterData.sortField === colVal.fieldName && (
                                                                <ArrowSortingUp className="ml-1 fill-white" />
                                                            )}
                                                        {manualFilterData.sortOrder === 'descend' &&
                                                            manualFilterData.sortField === colVal.fieldName && (
                                                                <ArrowSortingDown className="ml-1 fill-white" />
                                                            )}
                                                    </a>
                                                )}
                                            </div>
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.getItemByCategoriesPagination?.data?.itemByCategories?.map(
                                (data: { url: string, name: string, uuid: string }, index: number) => {                                    
                                    const displayIndex = manualFilterData?.index as number + index + 1;
                                    return (
                                        <tr key={data.uuid}>
                                            <td className="text-left pl-7" scope="row">
                                                {displayIndex}
                                            </td>
                                            <td className="text-left">{data?.name}</td>

                                            <td>

                                                <a download={true} target="_blank" rel="noreferrer" onClick={async () => {
                                                    const url = await getSignUrl(data.url)
                                                    fetch(url).then(response => {
                                                        response.blob().then(blob => {
                                                            const fileURL = window.URL.createObjectURL(blob);
                                                            const alink = document.createElement('a');
                                                            alink.href = fileURL;
                                                            alink.download = data?.name;
                                                            alink.click();
                                                        })
                                                    })
                                                }}>
                                                    <div className="flex items-center justify-start gap-2 cursor-pointer hover:underline text-primary btn-group">
                                                        <Download className='fill-primary' />
                                                        Download
                                                    </div>
                                                </a>
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
                <div className='flex flex-wrap items-center gap-5 mt-2'>
                    <span className="text-xs text-slate-400">
                        {`${data?.getItemByCategoriesPagination?.data?.count === null || data?.getItemByCategoriesPagination?.data?.count === undefined
                            ? '0'
                            : data?.getItemByCategoriesPagination?.data?.count
                            }` + t(' Total Records')}
                    </span>
                    <div className="flex items-center">
                        <span className="text-sm font-normal text-gray-700 ">
                            {t('Per Page')}
                        </span>
                        <select
                            className="border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white"
                            onChange={(e) => onPageDrpSelectManual(e.target.value)}
                            value={manualFilterData.limit}
                        >
                            {SHOW_PAGE_COUNT_ARR?.map((data: number) => {
                                return <option key={data}>{data}</option>;
                            })}
                        </select>
                    </div>
                    <Pagination
                        currentPage={manualFilterData.page}
                        totalPages={totalManualPages}
                        onPageChange={handleManualPageChange}
                        recordsPerPage={manualRecordsPerPage}
                    />
                </div>
            </div>
        </>
    );
};
export default UserManualsList;
