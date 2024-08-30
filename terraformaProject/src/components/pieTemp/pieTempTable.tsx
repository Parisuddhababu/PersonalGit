/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, PaginationParams } from 'src/types/cms';
import { useTranslation } from 'react-i18next';
import { SHOW_PAGE_COUNT_ARR } from '@config/constant';
import Button from '@components/button/button';
import { ArrowSortingDown, ArrowSortingUp, Filter2, GetDefaultIcon } from '@components/icons/icons';
import filterServiceProps from '@components/filter/filter';
import Pagination from '@components/Pagination/Pagination';


const PieTempTable = () => {
	const { t } = useTranslation();

	const data = {
		fetchPages: {
			data: {
				count: 1,
				ContentData: [
					{
						day: '24th July,2023',
						max_temp: '57.90',
						min_temp: '40.30',
						average_temp: '51.58',
						total_usage: '100%',
					},
					{
						day: '24th July,2023',
						max_temp: '57.90',
						min_temp: '40.30',
						average_temp: '51.58',
						total_usage: '100%',
					},
					{
						day: '24th July,2023',
						max_temp: '57.90',
						min_temp: '40.30',
						average_temp: '51.58',
						total_usage: '100%',
					},
					{
						day: '24th July,2023',
						max_temp: '57.90',
						min_temp: '40.30',
						average_temp: '51.58',
						total_usage: '100%',
					},
					{
						day: '24th July,2023',
						max_temp: '57.90',
						min_temp: '40.30',
						average_temp: '51.58',
						total_usage: '100%',
					},
				]
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setSelectedAllPieTemp] = useState(false);
	const [selectedPieTem] = useState<number[][]>([]);
	const [filterPieTempData, setPieTempFilterData] = useState<PaginationParams>({
		limit: 10,
		page: 1,
		sortBy: '',
		sortOrder: '',
		search: '',
	});

	const COL_ARR = [
		{ name: t('Days'), sortable: true, fieldName: t('day'), },
		{ name: t('Max Temp'), sortable: true, fieldName: t('max_temp'), },
		{ name: t('Min Temp'), sortable: true, fieldName: t('min_temp'), },
		{ name: t('Average Temp'), sortable: true, fieldName: t('average_temp'), },
		{ name: t('% of Total Usage'), sortable: true, fieldName: 'total_usage' },
	] as ColArrType[];

	
	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortPieTem = (sortFieldName: string) => {
		setPieTempFilterData({
			...filterPieTempData,
			sortBy: sortFieldName,
			sortOrder: filterPieTempData.sortOrder === 'asc' ? 'desc' : 'asc',
		});
	};

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */

	const onPageDrpPieTempSelect = (e: string) => {
		setRecordsperpage(Number(e))
		const updatedFilterData = {
			...filterPieTempData,
			limit: parseInt(e),
			page: 1
		};
		setPieTempFilterData(updatedFilterData);
		filterServiceProps.saveState('filterValuePieTemp', JSON.stringify(updatedFilterData));
	};

	useEffect(() => {
		const savedFilterDataJSON = filterServiceProps.getState('filterValuePieTemp', JSON.stringify(filterPieTempData));
		if (savedFilterDataJSON) {
			const savedFilterData = JSON.parse(savedFilterDataJSON);
			setPieTempFilterData(savedFilterData);
		}
	}, []);

	useEffect(() => {
		if (selectedPieTem?.length === data?.fetchPages.data?.ContentData?.length) {
			setSelectedAllPieTemp(true);
		} else {
			setSelectedAllPieTemp(false);
		}
	}, [selectedPieTem]);

	const [recordsPerPage, setRecordsperpage] = useState<number>(filterPieTempData.limit);
	const totalPieTempPage = data?.fetchPages?.data?.count || 0;
	const totalPages = Math.ceil(totalPieTempPage / recordsPerPage);
	const handlePageChange = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterPieTempData,
			page: newPage,
		};

		setPieTempFilterData(updatedFilterData);
		filterServiceProps.saveState('filterValuePieTemp', JSON.stringify(updatedFilterData));
	}, []);

	useEffect(() => {
		setRecordsperpage(filterPieTempData.limit);
	}, [filterPieTempData.limit]);

	return (
		<div className='overflow-auto border border-solid border-border-primary rounded-xl'>
			<h6 className='w-full p-5'>{t('Composter Temperature and Usage Metrics')}</h6>
			<div className='flex flex-wrap gap-2.5 px-5'>
				<Button className='btn-primary btn-normal w-full whitespace-nowrap md:w-[87px]' label={t('Overall')}  title={`${t('Overall')}`}/>
				<Button className='btn-gray btn-normal w-full whitespace-nowrap md:w-[189px]' label={t('No Operation Mode')} 
				title={`${t('No Operation Mode')}`}/>
				<Button className='btn-gray btn-normal w-full whitespace-nowrap md:w-[343px]' label={t('Waste Input & Compost Offloaded Mode')} 
				title={`${t('Waste Input & Compost Offloaded Mode')}`}/>
				<Button className='btn-gray btn-normal w-full whitespace-nowrap md:w-[165px]' label={t('Waste Offloading')} 
				 title={`${t('Waste Offloading')}`} />
				<Button className='btn-gray btn-normal w-full whitespace-nowrap md:w-[221px]' label={t('Normal Operation Mode')} 
				 title={`${t('Normal Operation Mode')}`} />
				<Button className='btn-gray btn-normal gap-3 md:gap-0 w-full whitespace-nowrap 3xl:ml-auto md:w-[150px]' label={t('Filter By')}
				 title={`${t('Filter')}`} >
					<Filter2 className='order-2 md:ml-auto' />
				</Button>
			</div>
			<div className='p-5 overflow-auto custom-dataTable'>
				<table>
					<thead>
						<tr>
							{COL_ARR?.map((col_name: ColArrType) => {
								return (
									<th scope='col' key={col_name.name}>
										<div className={`flex items-center whitespace-nowrap ${col_name.name === 'Days' && 'pl-1'}`}>
											{col_name.name}
											{col_name.sortable && (
												<a onClick={() => onHandleSortPieTem(col_name.fieldName)}>
													{(filterPieTempData.sortOrder === '' || filterPieTempData.sortBy !== col_name.fieldName) && <GetDefaultIcon className="fill-white" />}
													{filterPieTempData.sortOrder === 'asc' && filterPieTempData.sortBy === col_name.fieldName && <ArrowSortingUp className="ml-1 fill-white" />}
													{filterPieTempData.sortOrder === 'desc' && filterPieTempData.sortBy === col_name.fieldName && <ArrowSortingDown className="ml-1 fill-white" />}
												</a>
											)}
										</div>
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody className='border border-solid border-border-primary'>
						{data?.fetchPages.data?.ContentData?.map((data: any) => {
							return (
								<tr key={data.id}>
									<td scope='row' className='text-left whitespace-nowrap'>{data.day}</td>
									<td className='text-left'>{data.max_temp}</td>
									<td className='text-left'>{data.min_temp}</td>
									<td className='text-left'>{data.average_temp}</td>
									<td className='text-left'>{data.total_usage}</td>
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
			<div className='flex items-center gap-3 px-5 md:gap-7 text-slate-700'>
				<div className='flex items-center mb-3'>
					<span className='mr-2 text-sm whitespace-nowrap'>{t('Per Page')}</span>
					<select value={filterPieTempData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white' onChange={(e) => onPageDrpPieTempSelect(e.target.value)}>
						{SHOW_PAGE_COUNT_ARR?.map((data: number) => {
							return <option key={data}>{data}</option>;
						})}
					</select>
				</div>
				<div className='mb-3'>
					<Pagination currentPage={filterPieTempData.page}
						totalPages={totalPages}
						onPageChange={handlePageChange}
						recordsPerPage={recordsPerPage}
					/>
				</div>
			</div>
			
		</div>
	);
};
export default PieTempTable;
