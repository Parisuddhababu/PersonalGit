import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { DeleteUserType, UpdateUserStatusType, UserData } from '@framework/graphql/graphql';
import { CHANGE_STATUS_WARNING_TEXT, DATE_FORMAT, DELETE_WARNING_TEXT, GENDER_DRP, GROUP_DELETE_WARNING_TEXT, ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FilterUserManagement from './filterUserManagment';
import { FilterUserProps, PaginationParams } from 'src/types/user';
import { ColArrType } from 'src/types/common';
import { GET_USER } from '@framework/graphql/queries/user';
import { CHANGE_USER_STATUS, DELETE_USER, GRP_DEL_USER } from '@framework/graphql/mutations/user';
import { GetDefaultIcon, Trash, PlusCircle, AngleUp, AngleDown, ProfileIcon } from '@components/icons/icons';
import PassWordChange from './changePassword';
import Button from '@components/button/button';
import CommonModel from '@components/common/commonModel';
import { getDateFormat } from '@utils/helpers';
import filterServiceProps from '../../components/filter/filter';
import Pagination from '@components/Pagination/Pagination';
import DeleteBtn from '@components/common/deleteBtn';
import EditBtn from '@components/common/EditButton';
import PasswordBtn from '@components/common/passwordChangeButton';
import ViewBtn from '@components/common/viewButton';
const UserManagement = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { data, refetch: getUserData } = useQuery(GET_USER);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [userObj, setUserObj] = useState({} as UserData);
	const [updateUserStatus] = useMutation(CHANGE_USER_STATUS);
	const [deleteUserById] = useMutation(DELETE_USER);
	const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
	const [isChangeUserpassword, setIschangeUserPassword] = useState<boolean>(false);
	const [isDeleteConfirmationOpenUser, setIsDeleteConfirmationOpenUser] = useState<boolean>(false);
	const [selectedAllUsers, setSelectedAllUsers] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState<number[][]>([]);
	const [deleteGroupUser] = useMutation(GRP_DEL_USER);
	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: 10,
		page: 1,
		sortBy: '',
		sortOrder: '',
		firstName: '',
		lastName: '',
		email: '',
		status: null,
		gender: null,
		phoneNo: '',
		index: 0
	});

	const COL_ARR_USER_MNGT = [
		{ name: t('Sr.No'), sortable: false },
		{ name: t('Full Name'), sortable: true, fieldName: 'first_name' },
		{ name: t('User Name'), sortable: true, fieldName: 'last_name' },
		{ name: t('Email'), sortable: true, fieldName: 'email' },
		{ name: t('Gender'), sortable: true, fieldName: 'gender' },
		{ name: t('Date of Birth'), sortable: true, fieldName: 'date_of_birth' },
		{ name: t('Phone Number'), sortable: true, fieldName: 'phone_no' },
		{ name: t('Registration At'), sortable: true, fieldName: 'created_at' },
		{ name: t('Last Updated At'), sortable: true, fieldName: 'updated_at' },
		{ name: t('Status'), sortable: true, fieldName: 'status' },
	] as ColArrType[];

	/**
	 * Used for set user data from res in local variable
	 */
	useEffect(() => {

		if (!selectedUsers?.length) {
			const totalPages = Math.ceil(data?.getUsersWithPagination.data?.count / filterData?.limit);
			const pages = [];
			for (let i = 0; i < totalPages; i++) {
				pages.push([]);
			}
			setSelectedUsers(pages);
		}
	}, [data?.getUsersWithPagination]);

	/**method that sets all rules sets s selected */
	useEffect(() => {
		if (selectedAllUsers) {
			getUserData().then((res) => {
				setSelectedUsers(res?.data?.getUsersWithPagination?.data?.userList?.map((i: { id: number }) => i.id));
			});
		}
	}, [data?.getUsersWithPagination]);



	/**
	 * Used for refetch listing of user data after filter
	 */
	useEffect(() => {
		if (filterData) {
			getUserData(filterData).catch((err) => {
				toast.error(err);
			});
		}
	}, [filterData]);

	/**
	 *
	 * @param values Method used for set filter data
	 */
	const onSearchUser = useCallback((values: FilterUserProps) => {
		setFilterData({
			...filterData,
			firstName: values.firstName,
			lastName: values.lastName,
			email: values.email,
			status: parseInt(values.status),
			gender: parseInt(values.gender),
			phoneNo: values.phoneNo,
		});
	}, []);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortUserMngt = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
		});
	};

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onPageDrpSelectUserMngt = (e: string) => {	
		setRecordsperpage(Number(e))
		const updatedFilterData = {
		  ...filterData,
		  limit: parseInt(e),
		  page:1,
		  index: 0,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterusermangment', JSON.stringify(updatedFilterData));
	  };

	/**
	 * Method used for change user status with API
	 */
	const changeUserStatus = useCallback(() => {
		updateUserStatus({
			variables: {
				changeUserStatusId: userObj?.id,
				status: userObj.status === 1 ? 0 : 1,
			},
		})
			.then((res) => {
				const data = res.data as UpdateUserStatusType;
				if (data.changeUserStatus.meta.statusCode === 200) {
					toast.success(data.changeUserStatus.meta.message);
					setIsStatusModelShow(false);
					getUserData(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	}, [isStatusModelShow]);

	/**
	 * Method used for delete user data
	 */
	const deleteUser = useCallback(() => {
		deleteUserById({
			variables: {
				deleteUserId: userObj.id,
			},
		})
			.then((res) => {
				const data = res.data as DeleteUserType;
				if (data.deleteUser.meta.statusCode === 200) {
					toast.success(data.deleteUser.meta.message);
					setIsDeleteUser(false);
					getUserData(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	}, [isDeleteUser]);

	/**
	 * Method used for change user status model
	 */
	const onChangeStatusUserMngt = (data: UserData) => {
		setIsStatusModelShow(true);
		setUserObj(data);
	};

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsStatusModelShow(false);
		setIsDeleteUser(false);
		setIschangeUserPassword(false);
		setIsDeleteConfirmationOpenUser(false);
	}, []);



	/**
	 *
	 * @param gender Method used for getting gender name
	 * @returns
	 */
	const getGenderName = (gender: number) => {
		const result = GENDER_DRP.filter((a) => a.key === gender);
		return result[0]?.name;
	};

	const confirmDeleteRules = useCallback(() => {
		deleteGroupUser({
			variables: { groupDeleteUsersId: selectedUsers[filterData.page - 1] },
		})
			.then((res) => {
				const data = res?.data;
				if (data?.groupDeleteUsers?.meta?.statusCode === 200) {
					toast.success(data?.groupDeleteUsers?.meta?.message);
					setIsDeleteConfirmationOpenUser(false);
					getUserData(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to delete manage Rules sets'));
			});
		selectedUsers[filterData.page - 1] = []
	}, [selectedUsers]);

	useEffect(() => {
		if (selectedUsers?.length === data?.getUsersWithPagination?.data?.userList?.length) {
			setSelectedAllUsers(true);
		} else {
			setSelectedAllUsers(false);
		}
	}, [selectedUsers]);

	const handleDeleteRulesSets = useCallback(() => {

		if (selectedUsers[filterData.page - 1]?.length > 0) {
			setIsDeleteConfirmationOpenUser(true);
		} else {
			toast.error('Please select atleast one record');
		}
	}, [selectedUsers]);

	const handleSelectRuleSet = (rulesId: number) => {
		// Check if the rules sets  ID is already selected
		const updateSelectedRulesSets = [...selectedUsers];

		const isSelected = updateSelectedRulesSets?.[filterData.page - 1]?.includes(rulesId);
		if (isSelected) {
			// If the rules sets  ID is already selected, remove it from the selection
			updateSelectedRulesSets[filterData.page - 1] = updateSelectedRulesSets[filterData.page - 1].filter((id: number) => id !== rulesId);
		} else {
			// If the rules sets  ID is not selected, add it to the selection
			updateSelectedRulesSets[filterData.page - 1] = [...updateSelectedRulesSets[filterData.page - 1], rulesId];
		}
		setSelectedUsers(updateSelectedRulesSets);
	};

	const handleSelectAllRules = (event: React.ChangeEvent<HTMLInputElement>) => {
		const updateSelectedRulesSets = [...selectedUsers];
		if (!event?.target?.checked) {
			// Select all checkboxes
			updateSelectedRulesSets[filterData?.page - 1] = [];
			setSelectedUsers(updateSelectedRulesSets);
		} else {
			// Deselect all checkboxes
			updateSelectedRulesSets[filterData.page - 1] = data?.getUsersWithPagination.data?.userList?.map((i: { id: number }) => {
				return i.id;
			});
			setSelectedUsers(updateSelectedRulesSets);
		}
	};
	const [recordsPerPage, setRecordsperpage] = useState<number>(filterData.limit);
	const totalUsermangment = data?.getUsersWithPagination?.data?.count || 0;
	const totalPages = Math.ceil(totalUsermangment / recordsPerPage);
	const handlePageChange = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterData,
			page: newPage,
			index: (newPage - 1) * filterData.limit,
		}		
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterusermangment', JSON.stringify(updatedFilterData));
	},[])

	useEffect(() => {
		setRecordsperpage(filterData.limit);
	}, [filterData.limit]);
	const handleAddusermangment=useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.user}/add`)
	},[])
	const clearSelectionUserMng = () => {
		setSelectedUsers([]);
	};
	return (
		<div>
			<FilterUserManagement onSearchUser={onSearchUser} clearSelectionUserMng={clearSelectionUserMng}/>
			<div className='mb-3 bg-white shadow-lg rounded-sm overflow-auto border border-[#c8ced3]'>

				<div className='bg-[#f0f3f5] py-3 px-5 flex items-center justify-between border-b border-[#c8ced3]'>
					<div className='flex'>
						<ProfileIcon className='mr-2' fontSize='18px' />
						{t('User List')}
					</div>

					<div className='btn-group flex flex-col md:flex-row  '>
						<Button
							className=' button-small btn-normal mb-2 md:btn btn-primary btn-normal '
							onClick={handleDeleteRulesSets}
							type='button'
							label={t('Delete Selected')}
							title={`${t('Delete')}`} 
						>
							<Trash className='mr-2 ' />
						</Button>
						<Button
							className='btn-small btn-normal mb-2 md: btn btn-primary btn-normal  '
							onClick={handleAddusermangment}
							type='button'
							label={t('Add New')} title={`${t('Add New')}`} 
						>
							<PlusCircle className='mr-2 ' />
						</Button>
					</div>
				</div>
				<div className='p-3 flex items-center justify-start mb-3'>
					<span className=' text-sm text-gray-700 font-normal '>{t('Show')}</span>
					<select value={filterData.limit} className='border border-[#e4e7ea] rounded px-3 text-sm py-1.5 text-gray-500 mx-1 w-[75px] bg-white' onChange={(e) => onPageDrpSelectUserMngt(e.target.value)}>
						{SHOW_PAGE_COUNT_ARR?.map((item: number) => {
							return <option key={item}>{item}</option>;
						})}
					</select>
					<span className=' text-sm text-gray-700 font-normal'>{t('entries')}</span>
				</div>

				<div className='p-3 overflow-auto custom-dataTable'>
					<table>
						<thead>
							<tr>
								<th scope='col'>
									<input type='checkbox' className='checkbox items-center' checked={selectedUsers[filterData.page - 1]?.length === data?.getUsersWithPagination.data?.userList?.length} onChange={handleSelectAllRules} />
								</th>
								{COL_ARR_USER_MNGT?.map((colValuser: ColArrType) => {
									return (
										<th scope='col' key={colValuser.fieldName}>
											<div className={`flex items-center ${colValuser.name == 'Status' ? 'justify-center' : ''}`}>
												{colValuser.name}
												{colValuser.sortable && (
													<a onClick={() => onHandleSortUserMngt(colValuser.fieldName)}>
														{(filterData.sortOrder === '' || filterData.sortBy !== colValuser.fieldName) && <GetDefaultIcon />}
														{filterData.sortOrder === 'asc' && filterData.sortBy === colValuser.fieldName && <AngleUp />}
														{filterData.sortOrder === 'desc' && filterData.sortBy === colValuser.fieldName && <AngleDown />}
													</a>
												)}
											</div>
										</th>
									);
								})}

								<th scope='col'>
									<div className='flex items-center justify-center'>{t('Action')}</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{data?.getUsersWithPagination.data?.userList?.map((data: UserData, index: number) => {
								const displayIndex = filterData?.index as number + index + 1;
								return (
									<tr key={data.id}>
										<td>
											<input type='checkbox' className='checkbox' id={`${data.id}`} checked={selectedUsers?.[filterData.page - 1]?.includes(data.id)} onChange={() => handleSelectRuleSet(data.id)} />
										</td>
										<td scope='row' className=' text-center text-gray-900 font-medium whitespace-nowrap dark:text-white'>
											{displayIndex}
										</td>
										<td className='text-left'>
											<a className='font-medium text-primary dark:text-primary hover:underline cursor-pointer' onClick={() => navigate(`/${ROUTES.app}/${ROUTES.user}/view/${data.id}`)}>
												{data.first_name + ' ' + data.last_name}
											</a>
										

										</td>
										<td className='text-left'>{data.user_name}</td>
										<td className='text-left'>{data.email}</td>
										<td>{getGenderName(data.gender)}</td>


										<td className='text-left'>{`${data.date_of_birth.slice(8, 10)}/${data.date_of_birth.slice(5, 7)}/${data.date_of_birth.slice(0, 4)}`}</td>

										<td className='text-left'>{data.phone_no}</td>

										<td className='text-center'>{getDateFormat(data.created_at, DATE_FORMAT.momentDateTime24Format)}</td>
										<td className='text-center'>{getDateFormat(data.updated_at, DATE_FORMAT.momentDateTime24Format)}</td>


										<td>
											<div className=' flex justify-center'>{data.status === 1 ? <span className='badge badge-success rounded'>Active</span> : <span className='badge badge-danger rounded'>InActive</span>}</div>
										</td>

										<td>
											<div className='btn-group flex justify-center'>
										
												<ViewBtn data={data} route={ROUTES.user} />
												<EditBtn data={data} route={ROUTES.user} />
												<div className='flex justify-center'>
													<span onClick={() => onChangeStatusUserMngt(data)} className='font-medium text-blue-600 mt-2 dark:text-blue-500 hover:underline'>
														<label className='relative inline-flex items-center cursor-pointer'>
															<input type='checkbox' value={data.status} className='sr-only peer' checked={data.status === 1} />
															<div className={'w-7 h-4 bg-gray-200 rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-primary'}></div>
														</label>
													</span>
												</div>
												
												<DeleteBtn data={data} setObj={setUserObj} setIsDelete={setIsDeleteUser} />
												
												<PasswordBtn data={data} setObj={setUserObj} setIsChangePassword={setIschangeUserPassword} />
												
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					{(data?.getUsersWithPagination?.data === undefined || data?.getUsersWithPagination?.data === null) && (
						<div className='flex justify-center'>
							<div>No Data</div>
						</div>
					)}
				</div>
				<div className='px-6 mb-4 flex items-center justify-between'>
					<span className='text-slate-400 text-xs'>{`${data?.getUsersWithPagination?.data?.count === null || data?.getUsersWithPagination?.data?.count === undefined ? '0' : data?.getUsersWithPagination?.data?.count}` + ' Total  Records'}</span>
					<Pagination currentPage={filterData.page}
						totalPages={totalPages}
						onPageChange={handlePageChange}
						recordsPerPage={recordsPerPage}
					/>
				</div>
			</div>

			{isStatusModelShow && <CommonModel warningText={CHANGE_STATUS_WARNING_TEXT} onClose={onClose} action={changeUserStatus} show={isStatusModelShow} />}
			{isDeleteUser && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={onClose} action={deleteUser} show={isDeleteUser} />}
			{isChangeUserpassword && <PassWordChange onClose={onClose} UserObj={userObj} show={isChangeUserpassword} />}
			{isDeleteConfirmationOpenUser && <CommonModel warningText={GROUP_DELETE_WARNING_TEXT} onClose={onClose} action={confirmDeleteRules} show={isDeleteConfirmationOpenUser} />}
		</div>
	);
};
export default UserManagement;
