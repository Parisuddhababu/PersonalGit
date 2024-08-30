import React, { useCallback, useEffect, useState } from 'react';
import { Megaphone, PlusCircle, Search } from '@components/icons';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import { ColArrType, PaginationParams } from 'src/types/common';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import AddEditSoundModal from './AddEditSound';
import { SoundManagementResponse, SoundTypeArr } from 'src/types/soundManagement';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@config/constant';
import { sortOrder } from '@utils/helpers';
import Pagination from '@components/pagination/Pagination';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import TextInput from '@components/textInput/TextInput';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import { debounce } from 'lodash';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';

const SoundManagement = () => {
	useEscapeKeyPress(() => onClose()); // use to close model on Eac key.
	const [soundData, setSoundData] = useState<SoundManagementResponse>();
	const [editSoundData, setEditSoundData] = useState<SoundTypeArr | null>(null);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [isDeleteSound, setIsDeleteSound] = useState<boolean>(false);
	const [isAddEditSound, setIsAddEditSound] = useState<boolean>(false);
	const [loaderSound, setLoaderSound] = useState(false);
	const [disabledSound, setDisabledSound] = useState<boolean>(false);
	const [filterSoundData, setFilterSoundData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: '',
		search: '',
	});

	const COL_ARR = [
		{ name: 'Sr. No', sortable: false },
		{
			name: 'Event Name',
			sortable: true,
			fieldName: 'eventName',
		},
		{
			name: 'Sound',
			sortable: false,
			fieldName: 'eventFile',
		},
		{
			name: 'Status',
			sortable: true,
			fieldName: 'isActive',
		},
	] as ColArrType[];

	const getSoundList = useCallback(() => {
		setLoaderSound(true);
		APIService.getData(`${URL_PATHS.sound}/list?page=${filterSoundData.page}&limit=${filterSoundData.limit}&eventName=${filterSoundData.search}&sortBy=${filterSoundData.sortBy}&sortOrder=${filterSoundData.sortOrder}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setLoaderSound(false);
					setSoundData(response?.data);
				} else {
					toast.error(response?.data.message);
					setLoaderSound(false);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderSound(false);
			});
		setEditSoundData(null);
	}, [filterSoundData]);

	/**
	 * Used for set Sound data from res in local variable
	 */
	useEffect(() => {
		getSoundList();
	}, [filterSoundData]);

	/**
	 * Method used for on Pagination Change.
	 * @param event
	 */
	const handlePageClick = useCallback(
		(event: { selected: number }) => {
			setFilterSoundData({ ...filterSoundData, page: event.selected + 1 });
		},
		[filterSoundData]
	);

	/**
	 * Method used for storing data
	 * @param sortFieldName
	 */
	const onHandleSortSound = (sortFieldName: string) => {
		setFilterSoundData({
			...filterSoundData,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterSoundData.sortOrder),
		});
	};

	/**
	 * Method used for change dropdown for page limit
	 * @param e
	 */
	const onPageDrpSelect = useCallback(
		(e: string) => {
			setFilterSoundData({ ...filterSoundData, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterSoundData]
	);

	/**
	 * Method used for store search value
	 * @param e
	 */
	const handleSearch = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterSoundData({ ...filterSoundData, search: searchTerm });
		}, 500),
		[filterSoundData]
	);

	const onChangeStatus = useCallback((data: SoundTypeArr) => {
		setEditSoundData(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 * Method Used to send boolean true or false
	 * @param value: true or false
	 */
	const updateSoundStatus = (value: boolean) => {
		APIService.patchData(`${URL_PATHS.sound}/${editSoundData?.uuid}`, {
			isActive: value,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					getSoundList();
					toast.success(response?.data.message);
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
			});
	};

	/**
	 * Method used for change user status with API
	 */
	const changeSoundStatus = useCallback(() => {
		const data = editSoundData?.isActive;
		updateSoundStatus(!data);
		setIsStatusModelShow(false);
	}, [isStatusModelShow]);

	/**
	 *
	 * @param data Method used for show Sound delete model
	 */
	const deleteSoundModal = useCallback((data: SoundTypeArr) => {
		setIsDeleteSound(true);
		setEditSoundData(data);
	}, []);

	/**
	 * Method is used to delete the level data from api
	 */
	const deleteSoundData = () => {
		APIService.deleteData(`${URL_PATHS.sound}/${editSoundData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getSoundList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	};

	/**
	 * Method used for delete Sound data
	 */
	const deleteSound = useCallback(() => {
		deleteSoundData();
		setIsDeleteSound(false);
		setEditSoundData(null);
	}, [isDeleteSound]);

	/**
	 * Method used for close modal
	 */
	const onClose = useCallback(() => {
		setIsDeleteSound(false);
		setIsAddEditSound(false);
		setEditSoundData(null);
		setIsStatusModelShow(false);
		setDisabledSound(false);
	}, []);

	/**
	 *
	 * @param data Method used for send the edit Sound data to useState
	 * @returns
	 */
	const editSoundHandler = useCallback((data: SoundTypeArr) => {
		setIsAddEditSound(true);
		setEditSoundData(data);
	}, []);

	/**
	 * Method for handle the bubbling
	 * @param e
	 */
	const rowClickHandler = (e: { stopPropagation: () => void }) => {
		e.stopPropagation();
	};

	const showAddEditSoundModal = useCallback(() => {
		setIsAddEditSound(true);
	}, []);

	return (
		<div>
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Megaphone className='inline-block mr-2 text-primary' /> Sound Management
					</h6>
					<Button className='btn-primary btn-large' onClick={showAddEditSoundModal}>
						<PlusCircle className='mr-1' /> Add New
					</Button>
				</div>
				<div className='p-3 w-full'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleSearch} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onPageDrpSelect} value={filterSoundData.limit} />
					</div>
					<div className='overflow-auto w-full'>
						{loaderSound && <Loader />}
						<table>
							<thead>
								<tr>
									{COL_ARR?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												<div className='flex items-center'>
													{colVal.name}
													{colVal.sortable && (
														<a onClick={() => onHandleSortSound(colVal.fieldName)}>
															{(filterSoundData.sortOrder === '' || filterSoundData.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterSoundData.sortOrder === 'asc' && filterSoundData.sortBy === colVal.fieldName && getAscIcon()}
															{filterSoundData.sortOrder === 'desc' && filterSoundData.sortBy === colVal.fieldName && getDescIcon()}
														</a>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col' className='w-48'>
										Action
									</th>
								</tr>
							</thead>

							<tbody>
								{soundData?.data?.data?.map((data, index: number) => {
									return (
										<tr
											key={data.uuid}
											className='cursor-pointer'
											onClick={() => {
												editSoundHandler(data);
												setDisabledSound(true);
											}}
										>
											<th scope='row' className='w-20 text-center'>
												{index + 1}
											</th>
											<td className='font-medium'>{data.eventName}</td>
											<td className='w-48'>
												<audio src={data.eventSoundFile} controls></audio>
											</td>
											<td className='w-40 text-center'>{data.isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
											<td onClick={rowClickHandler}>
												<div className='flex items-center justify-center'>
													<EditButton data={data} editRecord={editSoundHandler} />
													<div className='hidden'>
														<DeleteButton data={data} isDeleteStatusModal={deleteSoundModal} />
													</div>
													<StatusButton data={data} isChangeStatusModal={onChangeStatus} status={`${data.isActive}`} checked={data.isActive} />
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!soundData?.data.count && <p className='text-center'>No Sound File Found</p>}
					</div>
					<Pagination length={soundData?.data?.count as number} onSelect={handlePageClick} limit={filterSoundData.limit} />
				</div>
			</div>
			{isStatusModelShow && <ChangeStatus onClose={onClose} changeStatus={changeSoundStatus} />}
			{isDeleteSound && <DeleteModel onClose={onClose} deleteData={deleteSound} />}
			{isAddEditSound && <AddEditSoundModal onClose={onClose} onSubmit={getSoundList} editData={editSoundData} disableData={disabledSound} />}
		</div>
	);
};
export default SoundManagement;
