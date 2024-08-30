import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ROUTES } from '@config/constant';
import Button from '@components/button/button';
import { GetDefaultIcon, GetAscIcon, GetDescIcon, AnnouncementIco, ArrowSmallLeft, Group, Reset } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import filterServiceProps from '@components/filter/filter';
import Pagination from '@components/Pagination/Pagination';
import { ExcludeDataArr } from '@framework/graphql/graphql';
import { GET_ANNOUNCEMENT_BY_ID } from '@framework/graphql/queries/announcement';
import { PaginationParams } from 'src/types/announcement';
import { ColArrType } from 'src/types/country';

import { useQuery } from '@apollo/client';

const AnnouncementDetails = () => {
	const { t } = useTranslation();
	const announcementId = useParams();
	const navigate = useNavigate();
	const { data, refetch } = useQuery(GET_ANNOUNCEMENT_BY_ID);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: 10,
		page: 1,
		sortBy: '',
		sortOrder: '',
	});
	const COL_ARR = [
		{ name: 'Sr.No', sortable: false },
		{ name: 'Name', sortable: true, fieldName: 'first_name' },
		{ name: 'Email', sortable: true, fieldName: 'email' },
		{ name: 'Device Type', sortable: true, fieldName: 'device_type' },
		{ name: 'Role', sortable: true, fieldName: 'role' },
		{ name: 'Created At', sortable: true, fieldName: 'created_at' },
	] as ColArrType[];

	/**
	 * IF WE GET ID BASED ON THAT WE WILL GET Announcement DATA
	 */
	useEffect(() => {
		if (announcementId?.id) {
			refetch({ fetchSingleAnnouncementId: parseInt(announcementId.id) }).catch((err) => toast.error(err));
		}
	}, [announcementId.id]);
	/**
	 * on clicking cancel it will redirect to main events page
	 */
	const onCancelAnnouncement = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.announcement}/list`);
	}, []);
	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortAnnouncement = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
		});
	};

	const startIndex = (filterData.page - 1) * 10;
	const endIndex = startIndex + filterData.page;

	const searchedComments = data?.fetchSingleAnnouncement?.data?.usersList?.filter((c: { first_name: string }) => c.first_name.toLowerCase().includes(searchTerm.toLowerCase())).slice(startIndex, endIndex);

	const renderRole = (role: number) => {
		if (role === 0) {
			return 'Customer';
		} else if (role === 1) {
			return 'Admin';
		} else if (role === 2) {
			return 'SuperAdmin';
		} else {
			return '-';
		}
	};

	const RefreshData = useCallback(() => {
		data?.fetchSingleAnnouncement?.data?.usersList?.filter((c: { first_name: string }) => c.first_name.toLowerCase().includes(searchTerm.toLowerCase()));
	}, []);

	const [recordsPerPage] = useState<number>(filterData.limit);
	const totalAnnouncement = data?.fetchAnnouncementsWithFilters?.data?.count || 1;
	const totalPages = Math.ceil(totalAnnouncement / recordsPerPage);
	const handlePageChangeViewAnnouncement = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterData,
			page: newPage,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('viewAnnouncement', JSON.stringify(updatedFilterData));
	}, []);
	useEffect(() => {
		const savedFilterDataJSON = filterServiceProps.getState('viewAnnouncement', JSON.stringify(filterData));
		if (savedFilterDataJSON) {
			const savedFilterData = JSON.parse(savedFilterDataJSON);
			setFilterData(savedFilterData);
		}
	}, []);
	const onSearchTerm = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	}, []);

	return (
		<>
			<div className='mb-6 bg-white shadow-lg rounded overflow-auto md:w-full '>
				<div className='border-b border-[#c8ced3] bg-[#f0f3f5] py-3 px-5 flex items-center justify-between'>
					<div className='flex items-center'>
						<AnnouncementIco className='mr-2' fontSize='12px' />
						<span>{t('Announcement')}</span>
					</div>
					<Button className='btn-primary btn-normal' label={t('Back')} onClick={onCancelAnnouncement}>
						<ArrowSmallLeft />
					</Button>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 m-4'>
					<div className='flex pb-2'>
						<p className='font-bold'>{t('Title')} : </p>
						<p className='px-3'>{data?.fetchSingleAnnouncement?.data?.announcement.title}</p>
					</div>
					<div className='flex  pb-2 '>
						<p className='font-bold'>{t('Type')} : </p>
						<p className='px-3'> {data?.fetchSingleAnnouncement?.data?.announcement.annoucemnt_type === null ? '-' : data?.fetchSingleAnnouncement?.data?.announcement.annoucemnt_type}</p>
					</div>
					<div className='flex  pb-2 '>
						<p className='font-bold'>{t('Platform')} : </p>
						<p className='px-3'> {data?.fetchSingleAnnouncement?.data?.announcement.platform}</p>
					</div>
					<div className='flex  pb-2 '>
						<p className='font-bold'>{t('Status')} : </p>
						<p className='px-3 ml-2  w-20'>{data?.fetchSingleAnnouncement?.data?.announcement.status === 1 ? <span className='badge badge-success rounded'>Active</span> : <span className='badge badge-danger rounded'>InActive</span>} </p>
					</div>
					<div className='flex  pb-2 '>
						<p className='font-bold'>{t('Advanced Filter')} : </p>
						<p className='px-3'> {data?.fetchSingleAnnouncement?.data?.announcement.userFilter}</p>
					</div>
					<div className='flex pb-2 '>
						<p className='font-bold'>{t('Description')} : </p>
						<p className='px-3'>
							{' '}
							{
								<p
									dangerouslySetInnerHTML={{
										__html: data?.fetchSingleAnnouncement?.data?.announcement.description,
									}}
								></p>
							}
						</p>
					</div>
				</div>
			</div>
			{data?.fetchSingleAnnouncement?.data?.announcement.userFilter === 'userToExclude' ? (
				<div className='mb-3 bg-white shadow-lg rounded-sm overflow-auto '>
					<div className='bg-gray-200 p-3 flex items-center justify-between'>
						<div className='flex mb-2 mr-2'>
							<Group />
							{t('Excluded Users')}
						</div>
						<Button className='btn-primary btn-normal' label={t('Refresh')} onClick={RefreshData}  title={`${t('Reset')}`} >
							<div className='mr-4'>
								<Reset />
							</div>
						</Button>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 l:grid-cols-4 gap-6'>
						<div className='flex mb-4'></div>
						<div className='btn-group mt-6 mr-4 flex items-start justify-end '>
							<TextInput type='text' value={searchTerm} onChange={onSearchTerm} placeholder='Search Users' />
						</div>
					</div>
					<div className='p-3 overflow-auto custom-dataTable '>
						<table>
							<thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
								<tr>
									{COL_ARR?.map((viewAnnounceData: ColArrType, index: number) => {
										return (
											<th scope='col' className='px-6 py-3   border border-slate-500' key={`${index + 1}`}>
												<div className='flex items-center'>
													{viewAnnounceData.name}
													{viewAnnounceData.sortable && (
														<a onClick={() => onHandleSortAnnouncement(viewAnnounceData.fieldName)}>
															{(filterData.sortOrder === '' || filterData.sortBy !== viewAnnounceData.fieldName) && <GetDefaultIcon />}
															{filterData.sortOrder === 'asc' && filterData.sortBy === viewAnnounceData.fieldName && <GetAscIcon />}
															{filterData.sortOrder === 'desc' && filterData.sortBy === viewAnnounceData.fieldName && <GetDescIcon />}
														</a>
													)}
												</div>
											</th>
										);
									})}
								</tr>
							</thead>
							<tbody>
								{searchedComments.map((data: ExcludeDataArr, index: number) => {
									return (
										<tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700   border border-slate-500' key={`${index + 1}`}>
											<th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white   border border-slate-500'>
												{index + 1}
											</th>
											<td className='px-6 py-4   border border-slate-500'>{data.first_name + data.last_name}</td>
											<td className='px-6 py-4   border border-slate-500'>{data.email}</td>
											<td className='px-6 py-4   border border-slate-500'>{data.device_type ?? 'null'}</td>
											<td className='px-6 py-4   border border-slate-500'>
												<div className=' w-20'> {renderRole(data?.role)}</div>
											</td>
											<td className='px-6 py-4   border border-slate-500'>{`${data.created_at.slice(0, 10)} ${data.created_at.slice(11, 19)}`}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{searchedComments === null && (
							<div className='flex justify-center'>
								<div>No Data</div>
							</div>
						)}
					</div>
					<div className='p-3 flex items-center justify-between mt-8'>
						<span className='text-slate-400'>
							{`${searchedComments.length} `}
							<span className='ml-1'>{t('Total Records')}</span>
						</span>
						<Pagination currentPage={filterData.page} totalPages={totalPages} onPageChange={handlePageChangeViewAnnouncement} recordsPerPage={recordsPerPage} />
					</div>
				</div>
			) : (
				''
			)}
		</>
	);
};
export default AnnouncementDetails;
