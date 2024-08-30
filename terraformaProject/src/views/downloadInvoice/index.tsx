import React, { useCallback, useEffect, useState } from 'react'
import UpdatedHeader from '@components/header/updatedHeader'
import { useTranslation } from 'react-i18next';
import { ArrowSortingDown, ArrowSortingUp, Download, GetDefaultIcon, Search, Trash } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import Pagination from '@components/Pagination/Pagination';
import { ColArrType, PaginationParams } from 'src/types/cms';
import { DELETE_WARNING_TEXT, DownloadInvoiceDrpData, SHOW_PAGE_COUNT_ARR, getSignUrl } from '@config/constant';
import filterServiceProps from '@components/filter/filter';
import { useMutation, useQuery } from '@apollo/client';
import { GET_INVOICES } from '@framework/graphql/queries/invoice';
import DropDown from '@components/dropdown/dropDown';
import { toast } from 'react-toastify';
import Button from '@components/button/button';
import CommonModel from '@components/common/commonModel';
import { DELETE_INVOICE } from '@framework/graphql/mutations/invoice';
import Loader from '@components/common/loader';

function Index() {
    const { t } = useTranslation();
    const [isDeleteData, setIsDeleteData] = useState<string>('');
    const [isDelete, setIsDelete] = useState<boolean>(false);    
    const [deleteInvoice, deleteLoading] = useMutation(DELETE_INVOICE);
    const COL_ARR_DOWNLOAD_INVOICE = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Title'), sortable: true, fieldName: t('title'), },
        { name: t('Date'), sortable: true, fieldName: t('date'), },
    ] as ColArrType[];
    const [filterData, setFilterData] = useState<PaginationParams>({
        sortOrder: 'descend',
        sortField: 'createdAt',
        limit: 10,
        page: 1,
        search: '',
        index: 0
    });
    const { data, refetch, loading } = useQuery(GET_INVOICES, { variables: { sortOrder: 'descend', sortField: 'createdAt', limit: 10, page: 1, search: '' } });
    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
    const totalInvoicePage = data?.getInvoicesWithPagination.data?.count || 0;
    const totalPages = Math.ceil(totalInvoicePage / recordsPerPage);

    /**
     *
     * @param sortFieldName Method used for storing sort data
    */
    const onHandleSortInvoice = (sortFieldName: string) => {
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
    const onPageDrpSelectInvoice = (e: string) => {
        const newLimit = Number(e);
        const updatedFilterData = {
            ...filterData,
            limit: newLimit,
            page: 1,
            index: 0,
            search: '',
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterValueInvoice', JSON.stringify(updatedFilterData));
    };

    const handlePageChange = useCallback((newPage: number): void => {
        const updatedFilterData = {
            ...filterData,
            page: newPage,
            index: (newPage - 1) * filterData.limit,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterValueInvoice', JSON.stringify(updatedFilterData));
    }, [filterData.limit]);

    useEffect(() => {
        setRecordsPerPage(filterData.limit);
    }, [filterData.limit]);

    /**
     *
     * @param e Method used for store search value
    */
    const onSearchInvoice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterData({ ...filterData, search: e.target.value })
    }, [])

    const handleInvoiceSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSortOption = event.target.value;
        const [sortField, sortOrder] = selectedSortOption.split(':');
        setFilterData({
            ...filterData,
            sortField,
            sortOrder,
        });
    }

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { index, ...newObject } = filterData;
        refetch(newObject).catch((err) => toast.error(err))
    }, [filterData])

    const onDelete = useCallback((id: string) => {
        setIsDeleteData(id);
        setIsDelete(true);
    }, []);

    const onClose = useCallback(() => {
        setIsDelete(false);
    }, [])

    const onRemove = useCallback(() => {
        deleteInvoice({
			variables: {
				invoiceId: isDeleteData,
			},
		})
			.then((res) => {
				const data = res.data
				toast.success(data?.deleteInvoice?.message)
                refetch();
				setIsDelete(false);
			})
			.catch((err) => {
				toast.error(err.networkError.result.errors[0].message)
                setIsDelete(false);
			})
    }, [isDeleteData])

    const onDownload = useCallback(async (id: string) => {
        const url = await getSignUrl(id);
        fetch(url).then(response => {
            response.blob().then(blob => {
                const fileURL = window.URL.createObjectURL(blob);
                const alink = document.createElement('a');
                alink.href = fileURL;
                alink.download = id;
                alink.click();
            })
        })
       
    }, []);

    return (
        <>
            <UpdatedHeader />
            {(loading || deleteLoading?.loading) && <Loader />}
            <div className={`p-3 border border-solid md:p-5 rounded-xl border-border-primary ${(loading || deleteLoading?.loading) ? 'pointer-events-none' : ''}`}>
                <div className='flex flex-wrap items-center justify-between gap-3 mb-5 md:gap-5'>
                    <h6 className='w-full md:w-auto'>{t('Download Invoice')}</h6>
                    <div className="flex flex-wrap w-full gap-3 md:gap-5 md:w-auto">
                        <div className='w-full md:w-[236px]'>
                            <TextInput
                                type='text'
                                id='table-search'
                                value={filterData.search}
                                placeholder={t('Search')}
                                onChange={onSearchInvoice}
                                inputIcon={<Search fontSize='18' className='font-normal' />}
                            />
                        </div>
                        <div className='flex flex-wrap items-center w-full gap-4 xmd:w-auto'>
                            <span className='leading-5.5 w-full xmd:w-auto whitespace-nowrap'>Sort By</span>
                            <div className='w-full xmd:w-[150px]'>
                                <DropDown
                                    className='w-full -mt-2'
                                    label=''
                                    name='appInvoice'
                                    onChange={handleInvoiceSortChange}
                                    value={filterData.sortField + ':' + filterData.sortOrder}
                                    error=""
                                    options={DownloadInvoiceDrpData}
                                    id='appInvoice'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='overflow-auto custom-dataTable'>
                    <table>
                        <thead>
                            <tr>
                                {COL_ARR_DOWNLOAD_INVOICE?.map((invoiceVal: ColArrType) => {
                                    return (
                                        <th scope='col' key={invoiceVal.name} className={`${invoiceVal.fieldName === 'sr_no' ? 'max-w-[90px] min-w-[90px]' : ''} ${invoiceVal.fieldName === 'title' ? 'min-w-[350px]' : ''}`}>
                                            <div className={`flex items-center ${invoiceVal.fieldName === 'sr_no' ? 'pl-2' : 'min-w-[20px]'}`}>
                                                {invoiceVal.name}
                                                {invoiceVal.sortable && (
                                                    <button onClick={() => onHandleSortInvoice(invoiceVal.fieldName)}>
                                                        {(filterData.sortOrder === '' || filterData.sortField !== invoiceVal.fieldName) && <GetDefaultIcon className="fill-white" />}
                                                        {filterData.sortOrder === 'ascend' && filterData.sortField === invoiceVal.fieldName && <ArrowSortingUp className="ml-1 fill-white" />}
                                                        {filterData.sortOrder === 'descend' && filterData.sortField === invoiceVal.fieldName && <ArrowSortingDown className="ml-1 fill-white" />}
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
                            {data?.getInvoicesWithPagination.data?.invoice?.map((data: { uuid: string, title: string, date: string, invoice: string }, index: number) => {
                                const displayIndex = filterData?.index as number + index + 1;                                
                                return (
                                    <tr key={data?.uuid}>
                                        <td scope='row' className='text-left pl-7'>{displayIndex}</td>
                                        <td className='text-left'>{data?.title}</td>
                                        <td className='text-left'>{data?.date}</td>
                                        <td>
                                            <div className='flex gap-2'>
                                                <button className="hover:underline text-primary btn-group items-center justify-start flex" type='button' onClick={() => onDownload(data.invoice)}>
                                                    <Download className='fill-primary' />
                                                    Download
                                                </button>
                                                <Button className='bg-transparent cursor-pointer btn-default' onClick={() => onDelete(data?.uuid)} label={''}>
                                                    <Trash className='fill-error' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {(data?.getInvoicesWithPagination?.data === undefined || data?.getInvoicesWithPagination?.data === null || data?.getInvoicesWithPagination.data?.count === 0) && (
                        <div className='flex justify-center'>
                            <div>No Data</div>
                        </div>
                    )}
                </div>
                <div className='flex flex-wrap items-center gap-2 px-5 mt-2 md:gap-5 text-slate-700'>
                    <div className='flex items-center'>
                        <span className='mr-2 text-sm whitespace-nowrap'>{t('Per Page')}</span>
                        <select value={filterData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white' onChange={(e) => onPageDrpSelectInvoice(e.target.value)}>
                            {SHOW_PAGE_COUNT_ARR?.map((data: number) => {
                                return <option key={data}>{data}</option>;
                            })}
                        </select>
                    </div>
                    <div>
                        <Pagination currentPage={filterData.page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            recordsPerPage={recordsPerPage}
                        />
                    </div>
                </div>
            </div>

            {isDelete && (
                <CommonModel
                    warningText={DELETE_WARNING_TEXT}
                    onClose={onClose}
                    action={onRemove}
                    show={isDelete}
                />
            )}
        </>
    )
}

export default Index
