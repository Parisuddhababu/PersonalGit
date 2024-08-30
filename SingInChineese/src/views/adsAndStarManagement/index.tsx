import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, PaginationParams } from 'src/types/role';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@config/constant';
import Pagination from '@components/pagination/Pagination';
import { PlusCircle, Search, Star } from '@components/icons';
import Button from '@components/button/Button';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import TextInput from '@components/textInput/TextInput';
import { debounce } from 'lodash';
import { Loader } from '@components/index';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import AddEditStar from './AddEditStar';
import { AdAndStarResponse, StarObj } from 'src/types/settings';
import EditButton from '@components/common/EditButton';
import StatusButton from '@components/common/StatusButton';

const AdAndStarManagement = () => {
	useEscapeKeyPress(() => onClose()); // use to close model on Eac key.
	const [starData, setStarData] = useState<AdAndStarResponse>();
	const [editStarData, setEditStarData] = useState({} as StarObj | null);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [isAddEditModel, setIsAddEditModel] = useState<boolean>(false);
	const [loader, setLoader] = useState<boolean>(false);

	const [filterDataStarManagement, setFilterDataStarManagement] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: '',
		search: '',
	});

	const COL_ARR = [
		{ name: 'Sr.No', sortable: false },
		{ name: 'Module Name', sortable: false, fieldName: 'name' },
		{ name: 'Module Key', sortable: false, fieldName: 'key' },
		{ name: 'Star Count', sortable: false },
		{ name: 'Status', sortable: false, fieldName: 'status' },
	] as ColArrType[];

	const getStarDataList = useCallback(() => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.starManagement}/get-all?page=${filterDataStarManagement.page}&limit=${filterDataStarManagement.limit}&search=${filterDataStarManagement.search}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setStarData(response?.data?.data);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
				setLoader(false);
			});
	}, [filterDataStarManagement]);

	/**
	 * Method Used to send boolean true or false
	 * @param value: true or false
	 */
	const updateStarStatus = (value: boolean) => {
		APIService.patchData(`${URL_PATHS.starManagement}/change-status`, {
			moduleUUID: editStarData?.uuid,
			isActive: value,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getStarDataList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
			});
	};

	useEffect(() => {
		getStarDataList();
	}, [filterDataStarManagement]);

	/**
	 *
	 * @param event Method used for on page click
	 */
	const handlePageClickStars = useCallback(
		(event: { selected: number }) => {
			setFilterDataStarManagement({ ...filterDataStarManagement, page: event.selected + 1 });
		},
		[filterDataStarManagement]
	);

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onPageDrpSelectStars = useCallback(
		(e: string) => {
			setFilterDataStarManagement({ ...filterDataStarManagement, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterDataStarManagement]
	);

	/**
	 *
	 * @param e Method used for store search value
	 */
	const handleSearchStars = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterDataStarManagement({ ...filterDataStarManagement, search: searchTerm });
		}, 500),
		[filterDataStarManagement]
	);

	/**
	 * Method used for change subAdmin status model
	 */
	const onChangeStatusStars = useCallback((data: StarObj) => {
		setIsStatusModelShow(true);
		setEditStarData(data);
	}, []);

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsAddEditModel(false);
		setIsStatusModelShow(false);
		setEditStarData(null);
	}, []);

	/**
	 *
	 * @param data Method used for Edit Current selected Record
	 */
	const editStar = useCallback((data: StarObj) => {
		setEditStarData(data);
		setIsAddEditModel(true);
	}, []);

	const changeStarStatus = useCallback(() => {
		const data = editStarData?.isActive;
		updateStarStatus(!data);
		setIsStatusModelShow(false);
	}, [isStatusModelShow]);

	const showAddEditStarsModal = useCallback(() => {
		setIsAddEditModel(true);
		setEditStarData(null);
	}, []);

	return (
		<div>
			{loader && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Star className='inline-block mr-2 text-primary' /> Advertising Star Management
					</h6>
					<Button className='btn-primary btn-large' onClick={showAddEditStarsModal}>
						<PlusCircle className='mr-1' /> Add New
					</Button>
				</div>
				<div className='p-3 w-full'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleSearchStars} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onPageDrpSelectStars} value={filterDataStarManagement.limit} />
					</div>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									{COL_ARR?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.fieldName}>
												{colVal.name}
											</th>
										);
									})}
									<th scope='col' className='w-48'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{starData?.moduleList.map((data, index: number) => {
									return (
										<tr key={data.uuid}>
											<th scope='row' className='w-10 text-center'>
												{index + 1}
											</th>
											<td className='w-54'>{data.moduleName}</td>
											<td className='w-54'>{data.moduleKey}</td>
											<td className='w-54'>{data.starCount}</td>
											<td className='w-40 text-center'>{data.isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
											<td>
												<div className='flex items-center justify-center'>
													<EditButton data={data} editRecord={editStar} />
													<StatusButton data={data} isChangeStatusModal={onChangeStatusStars} status={`${data.isActive}`} checked={data.isActive} />
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!starData?.count && <p className='text-center'>No Stars Found</p>}
					</div>
					<Pagination length={starData?.count as number} onSelect={handlePageClickStars} limit={filterDataStarManagement.limit} page={filterDataStarManagement.page - 1} />
				</div>
			</div>
			{isStatusModelShow && <ChangeStatus onClose={onClose} changeStatus={changeStarStatus} />}
			{isAddEditModel && <AddEditStar onClose={onClose} onSubmit={getStarDataList} editData={editStarData} disableData={false} />}
		</div>
	);
};
export default AdAndStarManagement;
