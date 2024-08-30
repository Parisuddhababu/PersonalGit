import React, { useCallback, useEffect, useState } from 'react';
import { sortOrder } from '@utils/helpers';
import { Play } from '@components/icons';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import Pagination from '@components/pagination/Pagination';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES } from '@config/constant';
import { URL_PATHS } from '@config/variables';
import { APIService } from '@framework/services/api';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { ColArrType, PaginationParams } from 'src/types/common';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

type VideoObj = {
	id: number;
	uuid: string;
	title: {
		isForKaraoke: boolean;
		isForSeasonal: boolean;
		level: string;
		topic: string;
		lesson: string;
		activity: string;
		karaoke: string;
		traditional: boolean;
		simplified: boolean;
	};
	fileUrl: string;
	is_active: boolean;
	createdAt: string;
};

type VideoData = {
	status: number;
	message: string;
	data: {
		count: number;
		rows: VideoObj[];
	};
};

const Videos = () => {
	const schoolAdminData = localStorage.getItem('userDetails');
	const schoolAdmin = schoolAdminData && JSON.parse(schoolAdminData);
	const [loadingVideos, setLoadingVideos] = useState<boolean>(false);
	const [videoData, setVideoData] = useState<VideoData>();
	const [filterVideoData, setFilterVideoData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrderValues.asc,
		search: '',
	});

	const COL_ARR_VOCABULARIES = [{ name: 'Sr.No' }, { name: 'Name', sortable: false, fieldName: 'title' }] as ColArrType[];

	/**
	 * Mwethid used to fecth Videos data
	 */
	const getVideoDetails = useCallback(() => {
		setLoadingVideos(true);
		const teacherParam = schoolAdmin?.adminData?.teacherUUID ? `&teacherId=${schoolAdmin.adminData?.teacherUUID}` : '';
		APIService.getData(`${URL_PATHS.teacher}/videos?page=${filterVideoData.page}&limit=${filterVideoData.limit}${teacherParam}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setVideoData(response?.data);
				}
			})
			.catch((err) => toast.error(err?.response?.data.message))
			.finally(() => setLoadingVideos(false));
	}, [filterVideoData]);

	useEffect(() => {
		getVideoDetails();
	}, [filterVideoData]);

	/**
	 *
	 * @param event Method used for on page click
	 */
	const handleVideoPageClick = useCallback(
		(event: { selected: number }) => {
			setFilterVideoData({ ...filterVideoData, page: event.selected + 1 });
		},
		[filterVideoData]
	);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onVideoHandleSort = (sortFieldName: string) => {
		setFilterVideoData({
			...filterVideoData,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterVideoData.sortOrder),
		});
	};

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onVideoPageDrpSelect = useCallback(
		(e: string) => {
			setFilterVideoData({ ...filterVideoData, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterVideoData]
	);

	/**
	 * This will open the VideoPage in a new tab
	 */
	const handleViewClick = useCallback(async (data: VideoObj) => {
		window.open(`${ROUTES.view}/${data?.uuid}`, '_blank');
	}, []);

	return (
		<div>
			{loadingVideos && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Play className='mr-1 text-primary' /> Video List
					</h6>
				</div>
				<div className='p-3 w-full'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<ShowEntries onChange={onVideoPageDrpSelect} value={filterVideoData.limit} />
					</div>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									{COL_ARR_VOCABULARIES?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												<div className='flex items-center'>
													{colVal.name}
													{colVal.sortable && (
														<button onClick={() => onVideoHandleSort(colVal.fieldName)}>
															{(filterVideoData.sortOrder === '' || filterVideoData.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterVideoData.sortOrder === sortOrderValues.asc && filterVideoData.sortBy === colVal.fieldName && getAscIcon()}
															{filterVideoData.sortOrder === sortOrderValues.desc && filterVideoData.sortBy === colVal.fieldName && getDescIcon()}
														</button>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col' className='w-32'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{videoData?.data?.rows.map((data, index) => {
									const { title } = data;
									return (
										<tr key={data.uuid}>
											<th scope='row' className='w-10 text-center'>
												{index + 1}
											</th>
											{title.isForKaraoke ? (
												<td className='font-medium'>
													{title.isForSeasonal ? 'Seasonal' : title.level} - {title.topic} - {title.karaoke} - {title.traditional ? 'Traditional' : 'Simplified'}
												</td>
											) : (
												<td className='font-medium'>
													{title.isForSeasonal ? 'Seasonal' : title.level} - {title.topic} - {title.lesson} - {title.activity} - {title.traditional ? 'Traditional' : 'Simplified'}
												</td>
											)}
											<td className='text-center'>
												<RoleBaseGuard permissions={[permissionsArray.VIDEO_MANAGEMENT.ViewAccess]}>
													<button className='btn btn-default' title='View Video' onClick={() => handleViewClick(data)}>
														<Play />
													</button>
												</RoleBaseGuard>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!videoData?.data?.count && <p className='text-center'>No Video Found</p>}
						<Pagination length={videoData?.data?.count as number} onSelect={handleVideoPageClick} limit={filterVideoData.limit} />
					</div>
				</div>
			</div>
		</div>
	);
};
export default Videos;
