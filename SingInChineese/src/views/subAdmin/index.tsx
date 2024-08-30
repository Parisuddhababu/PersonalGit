import React, { useCallback, useEffect, useState } from 'react';
import { SubAdminArr, SubAdminData } from 'src/types/subAdmin';
import { getDateFromUTCstamp, sortOrder } from '@utils/helpers';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import DeleteModel from '@views/deleteModel/DeleteModel';
import Button from '@components/button/Button';
import { PlusCircle, Search, User } from '@components/icons';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import AddEditSubAdminModal from './AddEditSubAdmin';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import Pagination from '@components/pagination/Pagination';
import { DEFAULT_LIMIT, DEFAULT_PAGE, endPoint } from '@config/constant';
import { URL_PATHS } from '@config/variables';
import { APIService } from '@framework/services/api';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { debounce } from 'lodash';
import { ColArrType, PaginationParams } from 'src/types/common';
import TextInput from '@components/textInput/TextInput';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';

const SubAdmin = () => {
	useEscapeKeyPress(() => onCloseSubAdmin()); // use to close model on Eac key.
	const [subAdminData, setSubAdminData] = useState<SubAdminData>();
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [isDeleteSubAdmin, setIsDeleteSubAdmin] = useState<boolean>(false);
	const [isAddEditModel, setIsAddEditModel] = useState<boolean>(false);
	const [editData, setEditData] = useState<SubAdminArr | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [filterSubAdminData, setFilterSubAdminData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrderValues.asc,
		search: '',
	});

	const COL_ARR = [
		{ name: 'Sr.No', sortable: false },
		{ name: 'First Name', sortable: true, fieldName: 'first_name' },
		{ name: 'Last Name', sortable: true, fieldName: 'last_name' },
		{ name: 'Email', sortable: true, fieldName: 'email' },
		{ name: 'Role', sortable: false },
		{ name: 'Created At', sortable: true, fieldName: 'created_at' },
		{ name: 'Status', sortable: false },
	] as ColArrType[];

	/**
	 * Used for get admin user data from api
	 */
	const getAdminUserDetails = useCallback(() => {
		setLoading(true);
		APIService.getData(`${URL_PATHS.subAdmin}${endPoint.list}?page=${filterSubAdminData.page}&limit=${filterSubAdminData.limit}&sortOrder=${filterSubAdminData.sortOrder}&sortBy=${filterSubAdminData.sortBy}&search=${encodeURIComponent(filterSubAdminData.search)}`)
			.then((response) => {
				if (response.status === ResponseCode.success || ResponseCode.created) {
					setSubAdminData(response?.data);
				} else {
					toast.error(response?.data.message);
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoading(false);
			});
	}, [filterSubAdminData]);

	/**
	 * Method used to fetch admin users list
	 */
	useEffect(() => {
		getAdminUserDetails();
	}, [filterSubAdminData]);

	/**
	 *
	 * @param event Method used for on page click
	 */
	const handleSubAdminPageClick = useCallback(
		(event: { selected: number }) => {
			setFilterSubAdminData({ ...filterSubAdminData, page: event.selected + 1 });
		},
		[filterSubAdminData]
	);

	/**
	 *
	 * @param values Method used for search data
	 */
	const handleSubAdminSearch = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterSubAdminData({ ...filterSubAdminData, search: searchTerm });
		}, 500),
		[filterSubAdminData]
	);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onSubAdminHandleSort = (sortFieldName: string) => {
		setFilterSubAdminData({
			...filterSubAdminData,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterSubAdminData.sortOrder),
		});
	};

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onSubAdminPageDrpSelect = useCallback(
		(e: string) => {
			setFilterSubAdminData({ ...filterSubAdminData, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterSubAdminData]
	);

	/**
	 * Method used for close model
	 */
	const onCloseSubAdmin = useCallback(() => {
		setIsStatusModelShow(false);
		setIsDeleteSubAdmin(false);
		setIsAddEditModel(false);
		setDisabled(false);
		setEditData(null);
	}, []);

	/**
	 *
	 * @param data Method used for show subAdmin change status modal
	 */
	const onChangeStatus = useCallback((data: SubAdminArr) => {
		setEditData(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 *
	 * @param value used to send boolean true or false
	 */
	const updateSubAdminStatus = (value: boolean) => {
		APIService.patchData(`${URL_PATHS.subAdmin}${endPoint.changeStatus}/${editData?.userData.uuid}`, {
			isActive: value,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getAdminUserDetails();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => toast.error(err?.response?.data.message));
	};

	/**
	 * Method used for change subAdmin status with API
	 */
	const changeSubAdminStatus = useCallback(() => {
		const data = editData?.userData.isActive;
		updateSubAdminStatus(!data);
		setIsStatusModelShow(false);
		setEditData(null);
	}, [isStatusModelShow]);

	/**
	 *
	 * @param data Method used for show subAdmin delete modal
	 */
	const deleteSubAdminDataModal = useCallback((data: SubAdminArr) => {
		setEditData(data);
		setIsDeleteSubAdmin(true);
	}, []);

	/**
	 * Method used for delete subAdmin data api call
	 */
	const deleteSubAdminData = () => {
		APIService.deleteData(`${URL_PATHS.subAdmin}${editData?.userData.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getAdminUserDetails();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => toast.error(err?.response?.data.message));
	};

	/**
	 * Method used for delete sub admin data
	 */
	const deleteSubAdmin = useCallback(() => {
		deleteSubAdminData();
		setIsDeleteSubAdmin(false);
		setEditData(null);
	}, [isDeleteSubAdmin]);

	/**
	 *
	 * @param data Method used for Edit Current selected Record
	 */
	const editRecord = useCallback((data: SubAdminArr) => {
		setEditData(data);
		setIsAddEditModel(true);
	}, []);

	/**
	 * Method for handle the bubbling
	 * @param e
	 */
	const rowClickSubAdminHandler = (e: { stopPropagation: () => void }) => {
		e.stopPropagation();
	};

	const showAddEditSubAdminModal = useCallback(() => {
		setIsAddEditModel(true);
	}, []);

	return (
		<div>
			{loading && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<User className='mr-1 text-primary' /> Sub Admin List
					</h6>
					<Button className='btn-primary btn-large' onClick={showAddEditSubAdminModal}>
						<PlusCircle className='mr-1' /> Add New
					</Button>
				</div>
				<div className='p-3 w-full'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleSubAdminSearch} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onSubAdminPageDrpSelect} value={filterSubAdminData.limit} />
					</div>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									{COL_ARR?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												<div className='flex items-center'>
													{colVal.name}
													{colVal.sortable && (
														<button onClick={() => onSubAdminHandleSort(colVal.fieldName)}>
															{(filterSubAdminData.sortOrder === '' || filterSubAdminData.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterSubAdminData.sortOrder === sortOrderValues.asc && filterSubAdminData.sortBy === colVal.fieldName && getAscIcon()}
															{filterSubAdminData.sortOrder === sortOrderValues.desc && filterSubAdminData.sortBy === colVal.fieldName && getDescIcon()}
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
								{subAdminData?.data?.subAdminList.map((data, index) => {
									return (
										<tr
											className='cursor-pointer'
											key={data.userData.id}
											onClick={() => {
												editRecord(data);
												setDisabled(true);
											}}
										>
											<th scope='row' className='w-20 text-center'>
												{index + 1}
											</th>
											<td className='font-medium w-40'>{data.userData.firstName}</td>
											<td className='font-medium w-40'>{data.userData.lastName}</td>
											<td>{data.userData.email}</td>
											<td className='w-32'>{data?.roleData?.name}</td>
											<td className='w-40 text-center'>
												<p>{getDateFromUTCstamp(data?.userData.createdAt)}</p>
											</td>
											<td className='w-20 text-center'>{data.userData.isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
											<td className='cursor-default' onClick={rowClickSubAdminHandler}>
												<div className='flex items-center'>
													<EditButton data={data} editRecord={editRecord} />
													<DeleteButton data={data} isDeleteStatusModal={deleteSubAdminDataModal} />
													<StatusButton data={data} isChangeStatusModal={onChangeStatus} status={`${data.userData.isActive}`} checked={data.userData.isActive} />
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!subAdminData?.data?.count && <p className='text-center'>No Sub Admin Found</p>}
					</div>
					<Pagination length={subAdminData?.data?.count as number} onSelect={handleSubAdminPageClick} limit={filterSubAdminData.limit} />
				</div>
			</div>
			{isStatusModelShow && <ChangeStatus onClose={onCloseSubAdmin} changeStatus={changeSubAdminStatus} />}
			{isDeleteSubAdmin && <DeleteModel onClose={onCloseSubAdmin} deleteData={deleteSubAdmin} />}
			{isAddEditModel && <AddEditSubAdminModal onClose={onCloseSubAdmin} editData={editData} disabled={disabled} onSubmit={getAdminUserDetails} />}
		</div>
	);
};
export default SubAdmin;
