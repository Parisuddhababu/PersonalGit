import React, { useCallback, useEffect, useState } from 'react';
import { GetDefaultIcon, GetAscIcon, GetDescIcon } from '@components/icons/index';
import { ColArrType } from 'src/types/country';
import { useQuery } from '@apollo/client';
import { AnnouncementDataArr, AnnouncementData } from '@framework/graphql/graphql';
import { ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { GET_ANNOUNCEMENTS } from '@framework/graphql/queries/announcement';
import { FilterAnnouncementProps, PaginationParamsList } from 'src/types/announcement';
import FilterAnnouncement from './Filterannouncement';
import { Eye, Megaphone, PlusCircle } from '@components/icons';
import { useTranslation } from 'react-i18next';
import Pagination from '@components/pagination/pagination';
import CustomSelect from '@components/select/select';
import Button from '@components/button/button';

const Announcement = () => {
	const navigate = useNavigate();
	const { data, refetch: getAnnouncement, loading } = useQuery(GET_ANNOUNCEMENTS);
	const { t } = useTranslation();

	const [announcementData, setAnnouncementData] = useState({} as AnnouncementData);

	/*filter data*/
	const [filterData, setFilterData] = useState<PaginationParamsList>({
		limit: 10,
		page: 1,
		sortBy: '',
		sortOrder: '',
		title: '',
		created_at: '',
		annoucemntType: '',
		platform: '',
		startDate: '',
		endDate: '',
		status: null,
	});
	//session storage
	useEffect(() => {
		const filteredAnnouncemntData: PaginationParamsList | null = JSON.parse(sessionStorage.getItem('announcemntFilterData') ?? 'null');

		if (filteredAnnouncemntData !== null && typeof filteredAnnouncemntData === 'object') {
			setFilterData(filteredAnnouncemntData);
		}
	}, []);

	useEffect(() => {
		if (filterData) {
			sessionStorage.setItem('announcemntFilterData', JSON.stringify(filterData));
			getAnnouncement(filterData);
		}
	}, [filterData, getAnnouncement]);

	//column headings to sort
	const COL_ARR = [
		{ name: t('Title'), sortable: true, fildName: 'title' },
		{ name: t('Type'), sortable: true, fildName: 'annoucemnt_type' },
		{ name: t('Target Platform'), sortable: true, fildName: 'platform' },
		{ name: t('Status'), sortable: true, fildName: 'status' },
		{ name: t('Created_At'), sortable: true, fildName: 'created_at' },
	] as ColArrType[];

	//storing announcement data in local variable
	useEffect(() => {
		if (data?.fetchAnnoucementsWithFilters) {
			setAnnouncementData(data?.fetchAnnoucementsWithFilters?.data);
		}
	}, [data?.fetchAnnoucementsWithFilters]);

	/* Handler for page click*/
	const pageClickHandler = useCallback(
		(event: { selected: number }) => {
			setFilterData({ ...filterData, page: event.selected + 1 });
		},
		[filterData]
	);

	/* handler to store sort data*/
	const announcementSortHandler = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
			page: 1,
		});
	};

	/* dropdown for page limit*/
	const dropdownSelectHandler = (e: string) => {
		setFilterData({ ...filterData, limit: parseInt(e), page: 1 });
	};

	/* Used for refetch after filter the data*/
	useEffect(() => {
		if (filterData) {
			getAnnouncement(filterData).catch((err) => {
				toast.error(err);
			});
		}
	}, [filterData, getAnnouncement]);

	/*search handler to filter data*/

	const searchAnnouncement = useCallback(
		(values: FilterAnnouncementProps) => {
			setFilterData({
				...filterData,
				title: values?.title,
				annoucemntType: values?.annoucemntType,
				platform: values?.platform,
				startDate: values?.startDate,
				endDate: values?.endDate,
				status: values.status !== undefined && values.status !== '' ? (typeof values.status === 'string' ? +values.status : values.status) : null,
				page: 1,
			});
		},
		[filterData]
	);

	const hasPreviousPage = filterData.page > 1;
	const hasNextPage = filterData.page < Math.ceil(announcementData?.count / filterData.limit);

	return (
		<div className='mx-4 my-4 lg:mx-6'>
			<FilterAnnouncement onSearchAnnouncement={searchAnnouncement} />
			<div className='bg-white shadow-lg rounded-sm  border border-[#c8ced3] mt-4 '>
				<div className='bg-[#f0f3f5] py-3 px-5 flex items-center justify-between border-b border-[#c8ced3]'>
					<div className='flex items-center'>
						<Megaphone className='inline-block mr-3' fontSize='16px' />
						{t('Announcement List')}
					</div>
					<div>
						<Button className='btn-primary btn-normal ' onClick={() => navigate(`/${ROUTES.app}/${ROUTES.announcements}/Add`)} type='button' label={t('Add New')}>
							<PlusCircle className='mr-1' />
						</Button>
					</div>
				</div>
				<div className='p-3 flex items-center justify-start mb-3'>
					<span className=' text-sm text-gray-900 font-normal '>{t('Show')}</span>
					<CustomSelect options={SHOW_PAGE_COUNT_ARR} value={filterData.limit} onChange={(e) => dropdownSelectHandler(e)} />
					<span className=' text-sm text-gray-900 font-normal'>{t('Entries')}</span>
				</div>
				<div className='p-3 overflow-auto custom-datatable '>
					<table>
						<thead>
							<tr>
								{COL_ARR?.map((colVal: ColArrType) => {
									return (
										<th scope='col' key={colVal.fildName}>
											<div className={`${colVal.name === t('Status') ? 'flex items-center justify-center' : 'flex items-center'} `}>
												{colVal.name}
												{colVal.sortable && (
													<p onClick={() => announcementSortHandler(colVal.fildName)}>
														{(filterData.sortOrder === '' || filterData.sortBy !== colVal.fildName) && GetDefaultIcon()}
														{filterData.sortOrder === 'asc' && filterData.sortBy === colVal.fildName && GetAscIcon()}
														{filterData.sortOrder === 'desc' && filterData.sortBy === colVal.fildName && GetDescIcon()}
													</p>
												)}
											</div>
										</th>
									);
								})}

								<th scope='col' className=' text-center'>
									{t('Action')}
								</th>
							</tr>
						</thead>

						{!loading && (
							<tbody>
								{data?.fetchAnnoucementsWithFilters?.data?.announcementData?.map((data: AnnouncementDataArr, index: number) => {
									return (
										<tr key={`${index + 1}`}>
											<td>{data.title}</td>
											<td>{data.annoucemnt_type ?? '-'}</td>
											<td>{data.platform}</td>

											<td className='text-center'>{data.status === 1 ? <span className='badge badge-default'>In-Progress</span> : <span className='bg-red-500 text-white px-1 text-xs rounded-sm'>Announced</span>}</td>
											<td> {`${data?.created_at?.slice(0, 10)} ${data?.created_at?.slice(11, 19)}`}</td>
											<td>
												<div className='flex justify-center'>
													<Link to={`/${ROUTES.app}/${ROUTES.announcements}/view/${data.id}`} className='font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer text-center '>
														<Eye />
													</Link>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						)}
					</table>
					{loading && <p className='text-center text-lg'>Processing....</p>}
					{!data?.fetchAnnoucementsWithFilters?.data?.announcementData?.length && <p className='text-center '>No Data</p>}
					
				</div>
				<div className='px-6 mb-4 flex items-center justify-between '>
						<span className='text-slate-400'>
							{' '}
							{announcementData?.count} {t('Total Records')}
						</span>
						<Pagination pageCount={Math.ceil(announcementData?.count / filterData.limit)} currentPage={filterData?.page} onPageChange={pageClickHandler} hasPreviousPage={hasPreviousPage} hasNextPage={hasNextPage} />
					</div>
			</div>
		</div>
	);
};
export default Announcement;