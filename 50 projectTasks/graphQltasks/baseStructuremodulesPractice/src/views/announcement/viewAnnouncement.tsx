import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ArrowSmallLeft, Group, Megaphone, Refresh } from '@components/icons/index';
import { ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { ExculdeDataArr } from '@framework/graphql/graphql';
import { GET_ANNOUNCEMENT_BY_ID } from '@framework/graphql/queries/announcement';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PaginationParams } from 'src/types/announcement';
import { ColArrType } from 'src/types/country';
import TextInput from '@components/input/TextInput';
import { t } from 'i18next';
import CustomSelect from '@components/select/select';
import Button from '@components/button/button';
import Pagination from '@components/pagination/pagination';

const ViewAnnouncementDetails = () => {
	const { data, refetch, loading } = useQuery(GET_ANNOUNCEMENT_BY_ID);
	const announcementId = useParams(); //to get element id
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	//filter data
	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: 10,
		page: 1,
		sortBy: '',
		sortOrder: '',
		startDate: '',
		endDate: '',
	});
	//col array to sort data
	const COL_ARR = [
		{ name: t('Name'), sortable: true, fildName: 'first_name' },
		{ name: t('Email'), sortable: true, fildName: 'email' },
		{ name: t('Device Type'), sortable: true, fildName: 'device_type' },
		{ name: t('Role'), sortable: true, fildName: 'role' },
		{ name: t('Created At'), sortable: true, fildName: 'created_at' },
	] as ColArrType[];

	/*refetching data based on announcement id */
	useEffect(() => {
		if (announcementId?.id) {
			refetch({ fetchSingleAnnouncementId: parseInt(announcementId.id) }).catch((err) => toast.error(err));
		}
	}, [announcementId.id, refetch]);

	const Refreshdata = useCallback(() => {
		data?.fetchSingleAnnouncement?.data?.usersList?.filter((c: { first_name: string }) => c.first_name.toLowerCase().includes(searchTerm.toLowerCase()));
	}, [refetch]);

	/*back handler for view details page*/
	const cancelHandler = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.announcements}/List`);
	}, [navigate]);

	/*dropdown for page limit*/
	const pageDropdownHandler = (e: string) => {
		setFilterData({ ...filterData, limit: parseInt(e) });
	};
	//role handler
	const roleHandler = (role: number) => {
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
	const handlePageChangeViewAnnouncement = useCallback((event: { selected: number }) => {
		setFilterData({ ...filterData, page: event.selected + 1 });
	}, []);

	return (
		<div className='mx-4 my-4 lg:mx-6'>
			<div className='w-full bg-[#E4E5E6]'>
				{/* main div  */}
				<div className='mb-6 bg-white shadow-lg rounded  md:w-full'>
					{/* heading div  */}
					<div className='border-b border-[#c8ced3] bg-[#F0F3F5] py-3 px-5 flex items-center justify-between'>
						<div className='flex items-center'>
							<Megaphone className='mr-2 text-black' fontSize='12px' />
							<span>{t('Announcement')}</span>
						</div>
						<Button className='btn-primary btn-normal' label={t('Back')} onClick={cancelHandler}>
							<ArrowSmallLeft />
						</Button>
					</div>
					{/* heading div end  */}
					<div className='grid grid-cols-1 md:grid-cols-2 m-4'>
						<div className='flex pb-2'>
							<p className='font-bold'>{t('Title')}:</p>
							<span className='font-bold'>{data?.fetchSingleAnnouncement?.data?.announcement.title}</span>
						</div>
						<div className='flex pb-2'>
							<p className='font-bold'>{t('Description')}:</p>
							<span className='px-3  '>{data?.fetchSingleAnnouncement?.data?.announcement.description}</span>
						</div>
						<div className='flex pb-2'>
							<p className='font-bold '>{t('Type')}: </p>
							<span className='px-3'>{data?.fetchSingleAnnouncement?.data?.announcement.annoucemnt_type === null ? 'No data' : data?.fetchSingleAnnouncement?.data?.announcement.annoucemnt_type}</span>
						</div>
						<div className='flex pb-2'>
							<p className='font-bold'>{t('Platform')}: </p>
							<span>{data?.fetchSingleAnnouncement?.data?.announcement?.platform}</span>
						</div>
						<div className='flex pb-2'>
							<p className='font-bold'>{t('Status')}:</p>
							<span>{data?.fetchSingleAnnouncement?.data?.announcement?.status === 1 ? <span className='badge badge-default'>In-Progress</span> : <span className='bg-red-500 text-white p-1 rounded-md'>Announced</span>}</span>
						</div>
						<div className='flex pb-2'>
							<p className='font-bold'>{t('Advanced Filters')}:</p>
							<span>{data?.fetchSingleAnnouncement?.data?.announcement.userFilter}</span>
						</div>
					</div>
				</div>
				{/* main div close  */}

				{/* excluded users div */}
				{data?.fetchSingleAnnouncement?.data?.announcement.userFilter === 'userToExclude' ? (
					<div className='mb-3 bg-white shadow-lg rounded-sm '>
						{/* heding div  */}
						<div className='bg-[#F0F3F5] p-3 flex items-center justify-between'>
							<div className='flex mb-2 mr-2'>
								<Group fontSize='20px' />
								{t('Excluded Users')}
							</div>
							<Button className='btn-primary btn-normal' label={t('Refresh')} onClick={Refreshdata}>
								<div className='mr-4'>
									<Refresh />
								</div>
							</Button>
						</div>
						{/* heding div  close */}
						<div className='flex items-center justify-between mx-4 my-3'>
							<div>
								<span>{t('Show')}</span>
								<CustomSelect options={SHOW_PAGE_COUNT_ARR} value={filterData.limit} onChange={(e) => pageDropdownHandler(e)} />
								<span>{t('Entries')}</span>
							</div>
							<div>
								<TextInput type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search Users' />
							</div>
						</div>
						<div className='p-3 overflow-auto custom-datatable '>
							<table>
								<thead>
									<tr>
										{COL_ARR?.map((viewAnnouncementData: ColArrType, index: number) => {
											return (
												<th scope='col' className='px-6 py-3' key={`${index + 1}`}>
													<div className='flex items-center'>{viewAnnouncementData.name}</div>
												</th>
											);
										})}
									</tr>
								</thead>
								{!loading && (
									<tbody>
										{data?.fetchSingleAnnouncement?.data?.usersList
											?.filter((i: { first_name: string }) => i.first_name.toLowerCase().includes(searchTerm.toLowerCase()))
											.map((data: ExculdeDataArr, index: number) => {
												return (
													<tr key={`${index + 1}`}>
														<td>{data.first_name + data.last_name}</td>
														<td>{data.email}</td>
														<td>{data.device_type ?? 'null'}</td>
														<td>
															<div className=' w-20'> {roleHandler(data?.role)}</div>
														</td>
														<td>{`${data.created_at.slice(0, 10)} ${data.created_at.slice(11, 19)}`}</td>
													</tr>
												);
											})}
									</tbody>
								)}
							</table>
							{loading && <p className='text-center text-lg'>Processing....</p>}
							{data?.fetchSingleAnnouncement?.data?.usersList?.length === 0 && <p className='text-center text-[#BB3F42]'>{t('No Data')}</p>}
						</div>
						<div className='p-3 flex items-center justify-between mt-8'>
							<span className='text-slate-400'>
								{`${data?.fetchSingleAnnouncement?.data?.usersList?.length} `}
								<span className='ml-1'>{t('Total Records')}</span>
							</span>
							<Pagination pageCount={Math.ceil(data?.fetchSingleAnnouncement?.data?.usersList.length / filterData.limit)} currentPage={filterData?.page} onPageChange={handlePageChangeViewAnnouncement} />
						</div>
					</div>
				) : (
					''
				)}
			</div>
		</div>
	);
};
export default ViewAnnouncementDetails;
