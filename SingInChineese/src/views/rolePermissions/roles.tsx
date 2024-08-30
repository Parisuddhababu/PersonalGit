import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, PaginationParams, RoleListResponse, RoleObj } from 'src/types/role';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import { sortOrder } from '@utils/helpers';
import { DEFAULT_LIMIT, DEFAULT_PAGE, endPoint } from '@config/constant';
import Pagination from '@components/pagination/Pagination';
import { Lock, PlusCircle, Search } from '@components/icons';
import Button from '@components/button/Button';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import TextInput from '@components/textInput/TextInput';
import { debounce } from 'lodash';
import { Loader } from '@components/index';
import DeleteModel from '@views/deleteModel/DeleteModel';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import AddEditRole from './AddEditRole';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';

const Roles = (props: { onSubmitData: () => void }) => {
	useEscapeKeyPress(() => onClose()); // use to close model on Eac key.
	const [roleData, setRoleData] = useState<RoleListResponse>();
	const [editRoleData, setEditRoleData] = useState({} as RoleObj | null);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [isAddEditModel, setIsAddEditModel] = useState<boolean>(false);
	const [isDeleteRole, setIsDeleteRole] = useState<boolean>(false);
	const [loader, setLoader] = useState<boolean>(false);

	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: '',
		search: '',
	});

	const COL_ARR = [
		{ name: 'Sr.No', sortable: false },
		{ name: 'RoleName', sortable: true, fieldName: 'name' },
		{ name: 'Status', sortable: false, fieldName: 'status' },
	] as ColArrType[];

	const getRoleDataList = useCallback(() => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.role}/${endPoint.list}?page=${filterData.page}&limit=${filterData.limit}&sortBy=${filterData.sortBy}&sortOrder=${filterData.sortOrder}&roleName=${filterData.search}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setRoleData(response?.data?.data);
					props.onSubmitData();
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
				setLoader(false);
			});
	}, [filterData]);

	/**
	 *Method is used to delete the level data from api
	 */
	const deleteRoleData = () => {
		APIService.deleteData(`${URL_PATHS.role}/${editRoleData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getRoleDataList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
			});
	};

	/**
	 * Method Used to send boolean true or false
	 * @param value: true or false
	 */
	const updateRoleStatus = (value: boolean) => {
		APIService.patchData(`${URL_PATHS.role}/${editRoleData?.uuid}`, {
			isActive: value,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getRoleDataList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
			});
	};

	useEffect(() => {
		getRoleDataList();
	}, [filterData]);

	/**
	 *
	 * @param event Method used for on page click
	 */
	const handlePageClick = useCallback(
		(event: { selected: number }) => {
			setFilterData({ ...filterData, page: event.selected + 1 });
		},
		[filterData]
	);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSort = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterData.sortOrder),
		});
	};

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onPageDrpSelect = useCallback((e: string) => {
		setFilterData({ ...filterData, limit: Number(e), page: DEFAULT_PAGE });
	}, []);

	/**
	 *
	 * @param e Method used for store search value
	 */
	const handleSearch = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterData({ ...filterData, search: searchTerm });
		}, 500),
		[]
	);

	/**
	 * Method used for change subAdmin status model
	 */
	const onChangeStatus = useCallback((data: RoleObj) => {
		setIsStatusModelShow(true);
		setEditRoleData(data);
	}, []);

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsDeleteRole(false);
		setIsAddEditModel(false);
		setIsStatusModelShow(false);
		setEditRoleData(null);
	}, []);

	/**
	 *
	 * @param data Method used for Edit Current selected Record
	 */
	const editRole = useCallback((data: RoleObj) => {
		setEditRoleData(data);
		setIsAddEditModel(true);
	}, []);

	/**
	 *
	 * @param data Method used for show role delete model
	 */
	const deleteRoleDataModal = useCallback((data: RoleObj) => {
		setEditRoleData(data);
		setIsDeleteRole(true);
	}, []);

	/**
	 * Method used for delete Level data
	 */
	const deleteRole = useCallback(() => {
		deleteRoleData();
		setIsDeleteRole(false);
		setEditRoleData(null);
	}, [isDeleteRole]);

	const changeRoleStatus = useCallback(() => {
		const data = editRoleData?.isActive;
		updateRoleStatus(!data);
		setIsStatusModelShow(false);
	}, [isStatusModelShow]);

	const showAddEditModal = useCallback(() => {
		setIsAddEditModel(true);
		setEditRoleData(null);
	}, []);

	return (
		<div>
			{loader && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Lock className='inline-block mr-2 text-primary' /> Role Management
					</h6>
					<Button className='btn-primary btn-large' onClick={showAddEditModal}>
						<PlusCircle className='mr-1' /> Add New
					</Button>
				</div>
				<div className='p-3 w-full'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleSearch} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onPageDrpSelect} value={filterData.limit} />
					</div>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									{COL_ARR?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.fieldName}>
												<div className='flex items-center'>
													{colVal.name}
													{colVal.sortable && (
														<button onClick={() => onHandleSort(colVal.fieldName)}>
															{(filterData.sortOrder === '' || filterData.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterData.sortOrder === 'asc' && filterData.sortBy === colVal.fieldName && getAscIcon()}
															{filterData.sortOrder === 'desc' && filterData.sortBy === colVal.fieldName && getDescIcon()}
														</button>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col' className='w-52'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{roleData?.data.map((data, index: number) => {
									return (
										<tr key={data.id}>
											<th scope='row' className='w-10 text-center'>
												{index + 1}
											</th>
											<td className='font-medium'>{data.name}</td>
											<td className='w-32'>{data.isActive ? <span className='badge badge-success rounded'>Active</span> : <span className='badge badge-danger rounded'>Inactive</span>}</td>
											<td>
												<div className='flex items-center'>
													<EditButton data={data} editRecord={editRole} />
													<DeleteButton data={data} isDeleteStatusModal={deleteRoleDataModal} />
													<StatusButton data={data} isChangeStatusModal={onChangeStatus} status={`${data.isActive}`} checked={data.isActive} />
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!roleData?.count && <p className='text-center'>No Roles Found</p>}
					</div>
					<Pagination length={roleData?.count as number} onSelect={handlePageClick} limit={filterData.limit} page={filterData.page - 1} />
				</div>
			</div>
			{isStatusModelShow && <ChangeStatus onClose={onClose} changeStatus={changeRoleStatus} />}
			{isDeleteRole && <DeleteModel onClose={onClose} deleteData={deleteRole} />}
			{isAddEditModel && <AddEditRole onClose={onClose} onSubmit={getRoleDataList} editData={editRoleData} disableData={false} />}
		</div>
	);
};
export default Roles;
