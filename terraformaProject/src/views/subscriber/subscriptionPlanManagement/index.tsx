/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react'
import UpdatedHeader from '@components/header/updatedHeader'
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { ArrowSortingDown, ArrowSortingUp, Download, GetDefaultIcon, ImportDoc, Search } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import Pagination from '@components/Pagination/Pagination';
import { ColArrType, PaginationParams } from 'src/types/cms';
import { SHOW_PAGE_COUNT_ARR } from '@config/constant';
import filterServiceProps from '@components/filter/filter';

function Index() {
    const { t } = useTranslation();

    const data = {
        fetchPages: {
            data: {
                count: 1,
                ContentData: [
                    {
                        sr_no: 1,
                        plan: 'Silver',
                        price: '$599',
                        date_of_renewal: '22/02/2023',
                        status: 1,
                    },
                    {
                        sr_no: 2,
                        plan: 'Basic',
                        price: '$899',
                        date_of_renewal: '22/02/2023',
                        status: 0,
                    },
                    {
                        sr_no: 3,
                        plan: 'Silver',
                        price: '$899',
                        date_of_renewal: '22/02/2023',
                        status: 1,
                    },
                    {
                        sr_no: 4,
                        plan: 'Basic',
                        price: '$599',
                        date_of_renewal: '22/02/2023',
                        status: 1,
                    },
                    {
                        sr_no: 5,
                        plan: 'Silver',
                        price: '$899',
                        date_of_renewal: '22/02/2023',
                        status: 0,
                    },
                ]
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_selectedAllCms, setSelectedAllPlan] = useState(false);
    const [selectedSubscriberPlan, setSelectedSubscriberPlan] = useState<number[][]>([]);
    const [filterSubscriberPlanData, setFilterSubscriberPlanData] = useState<PaginationParams>({
        limit: 10,
        page: 1,
        sortBy: '',
        sortOrder: '',
        search: '',
    });

    const COL_SUBSCRIBER_PLAN_ARR = [
        { name: t('Sr.No'), sortable: true, fieldName: t('sr_no'), },
        { name: t('Plan'), sortable: true, fieldName: t('plan'), },
        { name: t('Price'), sortable: true, fieldName: t('price'), },
        { name: t('Date of Renewal'), sortable: true, fieldName: t('date_of_renewal'), },
        { name: t('Status'), sortable: true, fieldName: 'status' },
    ] as ColArrType[];

    /**
     * Used for set rules sets data from res in local variable
     */
    useEffect(() => {
        if (!selectedSubscriberPlan?.length) {
            const totalPages = Math.ceil(data?.fetchPages.data?.count / filterSubscriberPlanData?.limit);
            const pages = [];
            for (let i = 0; i < totalPages; i++) {
                pages.push([]);
            }
            setSelectedSubscriberPlan(pages);
        }
    }, [data?.fetchPages]);

    /**
     *
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortSubscriberPlan = (sortFieldName: string) => {
        setFilterSubscriberPlanData({
            ...filterSubscriberPlanData,
            sortBy: sortFieldName,
            sortOrder: filterSubscriberPlanData.sortOrder === 'asc' ? 'desc' : 'asc',
        });
    };

    /**
     *
     * @param e Method used for change dropdown for page limit
     */

    const onPageDrpSelectSubscriberPlan = (e: string) => {
        setRecordSubscriberPlanPage(Number(e))
        const updatedFilterData = {
            ...filterSubscriberPlanData,
            limit: parseInt(e),
            page: 1
        };
        setFilterSubscriberPlanData(updatedFilterData);
        filterServiceProps.saveState('filterValuecms', JSON.stringify(updatedFilterData));
    };

    useEffect(() => {
        const savedFilterDataJSON = filterServiceProps.getState('filterValuecms', JSON.stringify(filterSubscriberPlanData));
        if (savedFilterDataJSON) {
            const savedFilterData = JSON.parse(savedFilterDataJSON);
            setFilterSubscriberPlanData(savedFilterData);
        }
    }, []);

    useEffect(() => {
        if (selectedSubscriberPlan?.length === data?.fetchPages.data?.ContentData?.length) {
            setSelectedAllPlan(true);
        } else {
            setSelectedAllPlan(false);
        }
    }, [selectedSubscriberPlan]);

    const [recordsSubscriberPlanPerPage, setRecordSubscriberPlanPage] = useState<number>(filterSubscriberPlanData.limit);
    const totalSubscriberPlanPage = data?.fetchPages?.data?.count || 0;
    const totalPages = Math.ceil(totalSubscriberPlanPage / recordsSubscriberPlanPerPage);
    const handlePageSubscriberPlanChange = useCallback((newPage: number): void => {
        const updatedFilterData = {
            ...filterSubscriberPlanData,
            page: newPage,
        };

        setFilterSubscriberPlanData(updatedFilterData);
        filterServiceProps.saveState('filterValuecms', JSON.stringify(updatedFilterData));
    }, []);

    useEffect(() => {
        setRecordSubscriberPlanPage(filterSubscriberPlanData.limit);
    }, [filterSubscriberPlanData.limit]);

    return (
        <>
            <UpdatedHeader />
            <div>
                <div className='p-5 mb-5 border border-border-primary rounded-xl bg-light-blue md:mb-7'>
                    <h6 className='mb-5 leading-7'>{t('Subscription Plan Details')}</h6>
                    <div className="flex flex-wrap justify-between gap-3 lg:gap-5">
                        <p className='break-words w-full md:w-[calc(50%-10px)]'>{t('Plan : ')}<span className='block font-bold lg:inline-block'>{t('Premium')}</span></p>
                        <p className='break-words w-full md:w-[calc(50%-10px)]'>{t('Modules Access : ')}<span className='block font-bold lg:inline-block'>{t('NA')}</span></p>
                        <p className='break-words w-full md:w-[calc(50%-10px)]'>{t('Price : ')}<span className='block font-bold lg:inline-block'>{t('$599')}</span></p>
                        <p className='break-words w-full md:w-[calc(50%-10px)]'>{t('Date of Renewal : ')}<span className='block font-bold lg:inline-block'>{t('22/09/2023')}</span></p>
                        <p className='break-words w-full md:w-[calc(50%-10px)]'>{t('Number of Users Allowed : ')}<span className='block font-bold lg:inline-block'>{t('200')}</span></p>
                        <p className='break-words w-full md:w-[calc(50%-10px)]'>{t('Status : ')}<span className='block font-bold lg:inline-block'>{t('Active')}</span></p>
                    </div>
                </div>
                <div className='flex justify-end mb-5 max-sm:space-y-2.5 sm:space-x-3 max-sm:flex-wrap lg:space-x-5 md:mb-7'>
                    <Button className='btn-secondary btn-normal w-full md:w-[160px]' type='submit' label={'Renew'} title='Renew'/>
                    <Button className='btn-secondary btn-normal w-full md:w-[160px]' type='submit' label={'Auto Renew'} title='Add Renew' />
                    <Button className='w-full btn btn-primary md:w-[160px]' type='submit' label={'Pay Now'} title='Pay Now' />
                </div>
                <div className='p-5 border border-solid rounded-xl border-border-primary'>
                    <div className='flex flex-wrap items-center justify-between gap-3 mb-5 md:gap-5'>
                        <h6 className='w-full md:w-auto'>{t('Transactions History')}</h6>
                        <div className="flex flex-wrap w-full gap-3 md:gap-5 md:w-auto">
                            <Button className='w-full btn btn-gray md:w-[260px] p-3.5' type='submit' label={'Import Employees List'} title='Import Employees List'>
                                <ImportDoc className='order-2 ml-auto ' />
                            </Button>
                            <div className='w-full md:w-[236px]'>
                                <TextInput
                                    type='text'
                                    id='table-search'
                                    value={filterSubscriberPlanData.search}
                                    placeholder={t('Search')}
                                    inputIcon={<Search fontSize='18' className='font-normal' />}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='overflow-auto custom-dataTable'>
                        <table>
                            <thead>
                                <tr>
                                    {COL_SUBSCRIBER_PLAN_ARR?.map((cmsVal: ColArrType) => {
                                        return (
                                            <th scope='col' key={cmsVal.name}>
                                                <div className={`flex items-center ${cmsVal.fieldName === 'sr_no' ? 'pl-2' : 'min-w-[20px]'}`}>
                                                    {cmsVal.name}
                                                    {cmsVal.sortable && (
                                                        <button onClick={() => onHandleSortSubscriberPlan(cmsVal.fieldName)}>
                                                            {(filterSubscriberPlanData.sortOrder === '' || filterSubscriberPlanData.sortBy !== cmsVal.fieldName) && <GetDefaultIcon className="fill-white" />}
                                                            {filterSubscriberPlanData.sortOrder === 'asc' && filterSubscriberPlanData.sortBy === cmsVal.fieldName && <ArrowSortingUp className="ml-1 fill-white" />}
                                                            {filterSubscriberPlanData.sortOrder === 'desc' && filterSubscriberPlanData.sortBy === cmsVal.fieldName && <ArrowSortingDown className="ml-1 fill-white" />}
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
                            <tbody className='border border-solid border-border-primary'>
                                {data?.fetchPages.data?.ContentData?.map((data: any) => {
                                    return (
                                        <tr key={data.id}>
                                            <td scope='row' className='text-left pl-7'>{data.sr_no}</td>
                                            <td className='text-left'>{data.plan}</td>
                                            <td className='text-left'>{data.price}</td>
                                            <td className='text-left'>{data.date_of_renewal}</td>
                                            <td>
                                                <div className='flex btn-group'>{data.status === 1 ? <span className='text-success'>Active</span> : <span className='text-error'>Inactive</span>}</div>
                                            </td>
                                            <td>
                                                <div className="flex items-center justify-start gap-2 hover:underline text-primary btn-group">
                                                    <Download className='fill-primary' />
                                                    Download
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {(data?.fetchPages?.data === undefined || data?.fetchPages?.data === null) && (
                            <div className='flex justify-center'>
                                <div>No Data</div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-wrap items-center gap-3 px-5 mt-2 overflow-auto md:gap-5 text-slate-700'>
                        <div className='flex items-center'>
                            <span className='mr-2 text-sm whitespace-nowrap'>{t('Per Page')}</span>
                            <select value={filterSubscriberPlanData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white' onChange={(e) => onPageDrpSelectSubscriberPlan(e.target.value)}>
                                {SHOW_PAGE_COUNT_ARR?.map((data: number) => {
                                    return <option key={data}>{data}</option>;
                                })}
                            </select>
                        </div>
                        <div>
                            <Pagination currentPage={filterSubscriberPlanData.page}
                                totalPages={totalPages}
                                onPageChange={handlePageSubscriberPlanChange}
                                recordsPerPage={recordsSubscriberPlanPerPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index
