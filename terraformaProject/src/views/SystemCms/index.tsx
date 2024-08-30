import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, PaginationParams } from 'src/types/cms';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { CHANGE_STATUS_WARNING_TEXT, ContractorStatus,  ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { toast } from 'react-toastify';
import { ArrowSortingDown, ArrowSortingUp, GetDefaultIcon, Search,  } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import CommonModel from '@components/common/commonModel';
import filterServiceProps from '../../components/filter/filter';
import Pagination from '@components/Pagination/Pagination';
import EditBtn from '@components/common/EditButton';
import UpdatedHeader from '@components/header/updatedHeader';
import { GET_SYSTEM_TEMPLATES_WITH_FILTER } from '@framework/graphql/queries/emailTemplates';
import {  EMAIL_SYSTEM_TEMPLATE_CHANGE_STATUS } from '@framework/graphql/mutations/emailTemplates';
import Loader from '@components/common/loader';

interface EmailDataTypes {
	title: string,
	description: string,
	uuid: string
	status: number
}

const CMS = () => {
	const { t } = useTranslation();
	const COL_ARR = [
		{ name: t('Sr.No'), sortable: false },
		{ name: t('Email Description'), sortable: true, fieldName: t('description'), },
		{ name: t('Email Type'), sortable: true, fieldName: t('title'), },
		{ name: t('Status'), sortable: true, fieldName: t('status'), },
	] as ColArrType[];
	const [filterData, setFilterData] = useState<PaginationParams>({
		sortOrder: 'DESC',
		limit: 10,
		page: 1,
		search: '',
		sortField: 'createdAt',
		index: 0
	});
	const { data, refetch, loading } = useQuery(GET_SYSTEM_TEMPLATES_WITH_FILTER, { variables: {filterData : { sortOrder: 'DESC', sortField: 'createdAt', limit: 10, page: 1, search: '' }}});
	const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
	const totalInvoicePage = data?.getSystemEmailTemplatesWithPagination?.data?.count || 0;
	const totalPages = Math.ceil(totalInvoicePage / recordsPerPage);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false)
	const [contractorObj, setContractorObj] = useState({} as EmailDataTypes);
    const [updateEmailStatus, statusLoading] = useMutation(EMAIL_SYSTEM_TEMPLATE_CHANGE_STATUS)

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	*/
	const onHandleSortCms = useCallback((sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortField: sortFieldName,
			sortOrder: filterData.sortOrder === 'ASC' ? 'DESC' : 'ASC',
		});
	}, [filterData]);

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	*/
	const onPageDrpSelectCms = useCallback((e: { target: { value: string }; }) => {
		const data = e.target.value
		const newLimit = Number(data);
		const updatedFilterData = {
			...filterData,
			limit: newLimit,
			page: 1,
			index: 0,
			Search: '',
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterValueEmailTemplates', JSON.stringify(updatedFilterData));
	}, []);

	const handlePageChange = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterData,
			page: newPage,
			index: (newPage - 1) * filterData.limit,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterValueEmailTemplates', JSON.stringify(updatedFilterData));
	}, [filterData.limit]);

	useEffect(() => {
		setRecordsPerPage(filterData.limit);
	}, [filterData.limit]);

	/**
	 *
	 * @param e Method used for store search value
	*/
	const onSearchCms = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFilterData({ ...filterData, search: e.target.value })
	}, [])

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { index, ...newObject } = filterData;
		refetch({ filterData: newObject }).catch((err) => toast.error(err))
	}, [filterData])


	/**
		* Method used for change Category status model
	*/
	const onChangeStatus = useCallback((data: EmailDataTypes) => {
		setIsStatusModelShow(true)
		setContractorObj(data)
	}, [])

	const onCloseContractor = useCallback(() => {
        setIsStatusModelShow(false)
    }, []);

	const changeCategoryStatus = useCallback(() => {
        updateEmailStatus({
            variables: {
                systemEmailTemplateId: contractorObj?.uuid,
            },
        })
            .then((res) => {
                const data = res.data
                toast.success(data.activateDeActivateSystemEmailTemplate.message)
                setIsStatusModelShow(false)
                refetch();
            })
            .catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message)
            })
    }, [isStatusModelShow])

	return (
		<>
			<UpdatedHeader headerTitle='System Email Template' />
			{(loading ) && <Loader />}
			<div className='p-3 mb-3 overflow-auto bg-white border shadow-lg md:p-5 rounded-xl border-border-primary'>
				<div className='flex flex-wrap items-center justify-between gap-4 mb-5'>
					<h6>{t('System Email Template List')}</h6>
					<div className='flex flex-wrap w-full gap-3 xmd:gap-4 lg:w-auto lg:flex-nowrap'>
						<div className='w-full xmd:w-[230px]'>
							<TextInput
								type='text'
								id='table-search'
								value={filterData.search}
								placeholder={t('Search')}
								onChange={onSearchCms}
								inputIcon={<Search fontSize='18' className='font-normal' />}
							/>
						</div>
					</div>
				</div>
				<div className='overflow-auto custom-dataTable'>
					<table>
						<thead>
							<tr>
								{COL_ARR?.map((cmsVal: ColArrType) => {
									return (
										<th scope='col' key={cmsVal.name} className={`whitespace-nowrap ${cmsVal.name === 'Sr.No' ? 'pl-7' : ''}`}>
											<div className='flex items-center'>
												{cmsVal.name}
												{cmsVal.sortable && (
													<button type='button' onClick={() => onHandleSortCms(cmsVal.fieldName)}>
														{(filterData.sortOrder === '' || filterData.sortField !== cmsVal.fieldName) && <GetDefaultIcon className="fill-white" />}
														{filterData.sortOrder === 'ASC' && filterData.sortField === cmsVal.fieldName && <ArrowSortingUp className="ml-1 fill-white" />}
														{filterData.sortOrder === 'DESC' && filterData.sortField === cmsVal.fieldName && <ArrowSortingDown className="ml-1 fill-white" />}
													</button>
												)}
											</div>
										</th>
									);
								})}

								<th scope='col'>
									<div>{t('Action')}</div>
								</th>
							</tr>
						</thead>
						<tbody className='border border-solid border-border-primary'>
							{data?.getSystemEmailTemplatesWithPagination?.data?.templates?.map((data: { uuid: string, description: string, title: string, status: number }, index: number) => {
								const displayIndex = filterData?.index as number + index + 1;
								return (
									<tr key={data?.uuid}>
										<td scope='row' className='text-left pl-7'>{displayIndex}</td>
										<td className='text-left break-all' dangerouslySetInnerHTML={{ __html: data?.description }} ></td>
										<td className='text-left'>{data.title}</td>
										<td className='text-left'>
											{data.status === 1 ? <span className='rounded text-success'>Active</span> : <span className='rounded text-error'>Inactive</span>}
										</td>
										<td className='flex items-center gap-4 pr-7 btn-group'>
											<EditBtn data={data} route={ROUTES.SystemCMS} />									
											<span
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
											</span>
										</td>

									</tr>
								);
							})}
						</tbody>
					</table>
					{(data?.getSystemEmailTemplatesWithPagination?.data === undefined || data?.getSystemEmailTemplatesWithPagination?.data === null || data?.getSystemEmailTemplatesWithPagination?.data?.count === 0) && (
						<div className='flex justify-center'>
							<div>No Data</div>
						</div>
					)}
				</div>
				<div className='flex flex-wrap items-center gap-3 mt-3 overflow-auto md:gap-5 text-slate-700'>
					<div className='flex items-center'>
						<span className='mr-2 text-sm whitespace-nowrap'>{t('Per page')}</span>
						<select value={filterData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white' onChange={onPageDrpSelectCms}>
							{SHOW_PAGE_COUNT_ARR?.map((data: number) => {
								return <option key={data}>{data}</option>;
							})}
						</select>
					</div>
					<Pagination currentPage={filterData.page}
						totalPages={totalPages}
						onPageChange={handlePageChange}
						recordsPerPage={recordsPerPage}
					/>
				</div>

				

				{isStatusModelShow && (
					<CommonModel
						warningText={CHANGE_STATUS_WARNING_TEXT}
						onClose={onCloseContractor}
						action={changeCategoryStatus}
						show={isStatusModelShow}
						disabled={statusLoading?.loading}
					/>
				)}

			</div>
		</>
	);
};
export default CMS;
