import React, { useCallback, useEffect, useState } from 'react';
import { DEFAULT_LIMIT, DEFAULT_PAGE, endPoint } from '@config/constant';
import { exportCsv, getDateFromUTCstamp, sortOrder } from '@utils/helpers';
import { ChangePasswordVariable, PaginationParams, UserData, UserListingData } from 'src/types/user';
import { ColArrType } from 'src/types/common';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import DeleteUserModal from './DeleteUserModal';
import { Document, Search, Users } from '@components/icons';
import Button from '@components/button/Button';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import AddEditUserModal from './AddEditUser';
import Pagination from '@components/pagination/Pagination';
import PasswordChange from '@views/changePassword/ChangePassword';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { debounce } from 'lodash';
import TextInput from '@components/textInput/TextInput';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import StatusButton from '@components/common/StatusButton';
import DeleteButton from '@components/common/DeleteButton';
import EditButton from '@components/common/EditButton';
import CommonButton from '@components/common/CommonButton';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

enum UserFields {
	verified = '1',
	inActive = '2',
	active = '3',
	expired = '4',
}

const UserManagement = () => {
	useEscapeKeyPress(() => onClose()); // use to close model on Eac key.
	const [userData, setUserData] = useState<UserListingData>();
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [isChangePasswordModel, setIsChangePasswordModel] = useState<boolean>(false);
	const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
	const [confirmDeleteUser, setConfirmDeleteUser] = useState<boolean>(false);
	const [isAddEditModel, setIsAddEditModel] = useState<boolean>(false);
	const [editData, setEditData] = useState<UserData | null>(null);
	const [disableData, setDisableData] = useState<boolean>(false);
	const [filterDataUserManagement, setFilterDataUserManagement] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: '',
		firstName: '',
		lastName: '',
		email: '',
		status: null,
		gender: null,
		phoneNo: '',
		search: '',
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const COL_ARR = [
		{ name: 'Sr.No', sortable: false },
		{ name: 'First Name', sortable: true, fieldName: 'firstName' },
		{ name: 'Last Name', sortable: true, fieldName: 'lastName' },
		{ name: 'Email', sortable: true, fieldName: 'email' },
		{ name: 'Date Of Birth', sortable: true, fieldName: 'birthYear' },
		{ name: 'Phone Number', sortable: false, fieldName: 'phoneNumber' },
		{ name: 'Platform', sortable: false, fieldName: 'platform' },
		{ name: 'Login Type', sortable: false, fieldName: 'loginType' },
		{ name: 'Created At', sortable: false, fieldName: 'createdAt' },
		{ name: 'Status', sortable: true, fieldName: 'status' },
	] as ColArrType[];

	/**
	 * Used for get user data from api
	 */
	const getUserDetails = useCallback(() => {
		setIsLoading(true);
		APIService.getData(`${URL_PATHS.userManagement}?page=${filterDataUserManagement.page}&limit=${filterDataUserManagement.limit}&sortOrder=${filterDataUserManagement.sortOrder}&sortBy=${filterDataUserManagement.sortBy}&search=${encodeURIComponent(filterDataUserManagement.search)}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setUserData(response?.data);
				} else {
					toast.error(response?.data.message);
				}
				setIsLoading(false);
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
				setIsLoading(false);
			});
	}, [filterDataUserManagement]);

	/**
	 *
	 * @param action Used for update user data from api for delete and update
	 * @param value used to send boolean
	 */
	const updateUserDetails = (action: string, value: boolean) => {
		setIsLoading(true);
		APIService.patchData(`${URL_PATHS.userManagement}${editData?.uuid}/${endPoint.status}`, {
			action: action,
			value: value,
		})
			.then((response) => {
				if (response.status == ResponseCode.success) {
					toast.success(response.data.message);
					getUserDetails();
				} else {
					toast.error(response.data.message);
				}
			})
			.catch((err) => toast.error(err.response.data.message));
	};

	/**
	 *
	 * @param action Used for update user data from api for delete and update
	 * @param value used to send boolean
	 */
	const deleteUserDetails = () => {
		setIsLoading(true);
		APIService.deleteData(`${URL_PATHS.userManagement}:isConfirmDelete?userId=${editData?.uuid}&isConfirmDelete=true`)
			.then((response) => {
				if (response.status == ResponseCode.success) {
					toast.success(response.data.message);
					getUserDetails();
				} else {
					toast.error(response.data.message);
				}
			})
			.catch((err) => toast.error(err.response.data.message));
		setIsLoading(false);
	};

	const updateUserPassword = (passwordChange: ChangePasswordVariable) => {
		setIsLoading(true);
		APIService.patchData(`${URL_PATHS.userManagement}${editData?.uuid}/${endPoint.changePassword}`, {
			newPassword: passwordChange.newPassword,
			confirmPassword: passwordChange.confirmPassword,
		})
			.then((response) => {
				if (response.status == ResponseCode.success) {
					toast.success(response.data.message);
					getUserDetails();
				} else {
					toast.error(response.data.message);
				}
				setIsLoading(false);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				setIsLoading(false);
			});
	};

	/**
	 *
	 *  Method used for on page click
	 */
	const handlePageClick = useCallback(
		(event: { selected: number }) => {
			setFilterDataUserManagement({ ...filterDataUserManagement, page: event.selected + 1 });
		},
		[filterDataUserManagement]
	);

	/**
	 * Used for refetch listing of user data after filter
	 */
	useEffect(() => {
		getUserDetails();
	}, [filterDataUserManagement]);

	/**
	 *
	 *  Method used for storing sort data
	 */
	const onHandleSort = (sortFieldName: string) => {
		setFilterDataUserManagement({
			...filterDataUserManagement,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterDataUserManagement.sortOrder),
		});
	};

	/**
	 *
	 *  Method used for change dropdown for page limit
	 */
	const onPageDrpSelect = useCallback(
		(e: string) => {
			setFilterDataUserManagement({ ...filterDataUserManagement, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterDataUserManagement]
	);

	/**
	 * Method used for change user status with API
	 */
	const changeUserStatus = useCallback(() => {
		const data = editData?.status === UserFields.inActive || editData?.status === UserFields.verified;
		updateUserDetails('status', data);
		setIsStatusModelShow(false);
		setEditData(null);
	}, [isStatusModelShow]);

	/**
	 * Method used for delete user data
	 */
	const deleteUser = useCallback(() => {
		setIsDeleteUser(false);
		setConfirmDeleteUser(true);
	}, []);

	const confirmDelete = useCallback(() => {
		deleteUserDetails();
		setConfirmDeleteUser(false);
		setEditData(null);
	}, [confirmDeleteUser]);
	/**
	 *
	 * @param data Method used for change user status model
	 */
	const onChangeStatus = useCallback((data: UserData) => {
		setEditData(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsStatusModelShow(false);
		setIsDeleteUser(false);
		setIsChangePasswordModel(false);
		setIsAddEditModel(false);
		setConfirmDeleteUser(false);
		setEditData(null);
		setDisableData(false);
	}, []);

	/**
	 *
	 *  Method used for show user delete model
	 */
	const deleteUserData = useCallback((data: UserData) => {
		setEditData(data);
		setIsDeleteUser(true);
	}, []);

	/**
	 *
	 *Method used for show subAdmin change password model
	 */
	const changeUserPassword = useCallback((data: UserData) => {
		setEditData(data);
		setIsChangePasswordModel(true);
	}, []);

	/**
	 *
	 * @param data Method used for Edit Current selected Record
	 */
	const editRecord = useCallback((data: UserData) => {
		setEditData(data);
		setIsAddEditModel(true);
	}, []);

	/**
	 *
	 * @param e Method for handle the bubbling
	 */
	const rowClickHandler = (e: { stopPropagation: () => void }) => {
		e.stopPropagation();
	};

	/**
	 *
	 * @param content Method is used for any Password change
	 * @returns need to implement in Api
	 */
	const onSubmitPassword = useCallback(
		(content: ChangePasswordVariable) => {
			updateUserPassword(content);
			setIsChangePasswordModel(false);
			setEditData(null);
		},
		[isChangePasswordModel]
	);

	/**
	 *
	 * @param e Method used for store search value
	 */
	const handleSearch = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterDataUserManagement({ ...filterDataUserManagement, search: searchTerm });
		}, 500),
		[]
	);

	/**
	 *
	 * Method used for Export users list
	 */
	const exportUsers = useCallback(() => {
		setIsLoading(true);
		APIService.getData(URL_PATHS.exportUserManagement)
			.then((response) => {
				if (response.status == ResponseCode.success) {
					toast.success(response.data.message);
					exportCsv(response.data, 'SIC-users');
				} else {
					toast.error(response.data.message);
				}
				setIsLoading(false);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				setIsLoading(false);
			});
	}, []);

	return (
		<div>
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Users className='inline-block mr-2 text-primary' /> Users List
					</h6>
					{userData?.data.data?.length !== 0 && (
						<Button className='btn-primary btn-large' onClick={exportUsers}>
							<Document className='mr-2' />
							Export Users
						</Button>
					)}
				</div>
				<div className='p-3 w-full'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleSearch} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onPageDrpSelect} value={filterDataUserManagement.limit} />
					</div>
					<div className='overflow-auto w-full'>
						{isLoading && <Loader />}
						<table>
							<thead>
								<tr>
									{COL_ARR?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												<div className='flex items-center'>
													{colVal.name}
													{colVal.sortable && (
														<button onClick={() => onHandleSort(colVal.fieldName)}>
															{(filterDataUserManagement.sortOrder === '' || filterDataUserManagement.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterDataUserManagement.sortOrder === 'asc' && filterDataUserManagement.sortBy === colVal.fieldName && getAscIcon()}
															{filterDataUserManagement.sortOrder === 'desc' && filterDataUserManagement.sortBy === colVal.fieldName && getDescIcon()}
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
								{userData?.data.data.map((data, index: number) => {
									return (
										<tr
											key={data.id}
											className={`cursor-pointer ${data.deletedAt !== null ? 'bg-gray-100' : ''}`}
											onClick={() => {
												editRecord(data);
												setDisableData(true);
											}}
										>
											<th scope='row' className='w-10 text-center'>
												{index + 1}
											</th>
											<td className='w-60 '>{data.firstName}</td>
											<td className='w-60 '>{data.lastName}</td>
											<td className='w-60 '>{data.email}</td>
											<td className='w-40 text-center'>{data.birthYear}</td>
											<td className='w-40 text-center '>{data.phone_number}</td>
											<td className='w-40 text-center '>{data.platform}</td>
											<td className='w-40 text-center '>{data.loginType}</td>
											<td className='w-40 text-center'>
												<p>{getDateFromUTCstamp(data.createdAt)}</p>
											</td>
											<td className='w-10 text-center'>{data.status === UserFields.active ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
											<td className='cursor-default' onClick={rowClickHandler}>
												<div className='flex justify-center items-center'>
													<RoleBaseGuard permissions={[permissionsArray.USER_MANAGEMENT.EditAccess]}>
														<EditButton data={data} editRecord={editRecord} disable={data.deletedAt !== null} />
													</RoleBaseGuard>
													<RoleBaseGuard permissions={[permissionsArray.USER_MANAGEMENT.DeleteAccess]}>
														<DeleteButton data={data} isDeleteStatusModal={deleteUserData} />
													</RoleBaseGuard>
													<CommonButton data={data} dataHandler={changeUserPassword} isPasswordChange={true} title='Change Password' disable={data.deletedAt !== null} />
													<RoleBaseGuard permissions={[permissionsArray.USER_MANAGEMENT.ChangeStatusAccess]}>{data.status !== UserFields.expired && <StatusButton data={data} isChangeStatusModal={onChangeStatus} status={data.status} checked={data.status === UserFields.active} disable={data.deletedAt !== null} />}</RoleBaseGuard>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!userData?.data.record && <p className='text-center'>No End Users Found</p>}
					</div>
					<Pagination length={userData?.data.record as number} onSelect={handlePageClick} limit={filterDataUserManagement.limit} page={filterDataUserManagement.page - 1} />
				</div>
			</div>
			{isStatusModelShow && <ChangeStatus onClose={onClose} changeStatus={changeUserStatus} />}
			{isDeleteUser && <DeleteUserModal onClose={onClose} deleteData={deleteUser} editData={editData?.firstName} />}
			{confirmDeleteUser && <DeleteUserModal onClose={onClose} deleteData={confirmDelete} />}
			{isChangePasswordModel && <PasswordChange onClose={onClose} data={editData as UserData} onSubmitPassword={onSubmitPassword} />}
			{isAddEditModel && <AddEditUserModal onClose={onClose} onSubmit={getUserDetails} editData={editData} disableData={disableData} />}
		</div>
	);
};
export default UserManagement;
