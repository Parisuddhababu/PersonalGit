import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { FETCH_ROLES_DATA } from '@framework/graphql/queries/role';
import { UpdateRoleStatusType, RoleDataArr, RoleData } from '@framework/graphql/graphql';
import { UPDATE_ROLE_STATUS } from '@framework/graphql/mutations/role';
import { toast } from 'react-toastify';
import { ColArrType, PaginationParams } from 'src/types/role';
import { SHOW_PAGE_COUNT_ARR } from '@config/constant';
import AddEditRole from './AddEditRole';
import ChangeStatus from '@views/role/ChangeStatus';
import { GetDefaultIcon, GetAscIcon, GetDescIcon } from '@components/icons/index';
import { Edit, MenuBurger, PlusCircle } from '@components/icons';
import { useTranslation } from 'react-i18next';
import Pagination from '@components/pagination/pagination';
import CustomSelect from '@components/select/select';
import TextInput from '@components/input/TextInput';
import Button from '@components/button/button';

const Role = () => {
	const { data, refetch } = useQuery(FETCH_ROLES_DATA);
	const { t } = useTranslation();
	const [roleData, setRoleData] = useState({} as RoleData);
	const [isRoleModelShow, setIsRoleModelShow] = useState<boolean>(false);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [roleObj, setRoleObj] = useState({} as RoleDataArr);
	const [updateRoleStatus] = useMutation(UPDATE_ROLE_STATUS);
	const [roleVal, setRoleVal] = useState<string>('');
	const [isRoleEditable, setIsRoleEditable] = useState<boolean>(false);
	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: 10,
		page: 1,
		sortBy: '',
		sortOrder: '',
		search: '',
	});

	const COL_ARR_ROLE = [
		{ name: t('Sr.No'), sortable: false },
		{ name: t('Title'), sortable: true, fildName: 'role_name' },
		{ name: t('Status'), sortable: true, fildName: 'status' },
	] as ColArrType[];

	useEffect(() => {
		const filteredRoleData: PaginationParams | null = JSON.parse(sessionStorage.getItem('roleFilterData') || 'null');
		if (filteredRoleData !== null && typeof filteredRoleData === 'object') {
			setFilterData(filteredRoleData);
		}
	}, []);
	/*storing data in local  variable*/

	useEffect(() => {
		if (data?.fetchRoles) {
			setRoleData(data?.fetchRoles.data);
		}
	}, [data?.fetchRoles]);

	useEffect(() => {
		sessionStorage.setItem('roleFilterData', JSON.stringify(filterData));
		refetch(filterData);
	}, [filterData, refetch]);

	/*to show model for edit*/
	const editRole = (obj: RoleDataArr) => {
		setRoleObj(obj);
		setIsRoleModelShow(true);
		setRoleVal(obj.role_name);
		setIsRoleEditable(true);
	};
	/*to close model*/
	const onClose = useCallback(() => {
		setIsRoleModelShow(false);
		setIsStatusModelShow(false);
	}, []);
	/*submit handler for Role*/
	const onSubmitRole = useCallback(() => {
		setIsRoleModelShow(false);
		refetch(filterData);
	}, [filterData, refetch]);

	/*model for add & edit role*/
	const createNewRole = () => {
		setIsRoleModelShow(true);
		setIsRoleEditable(false);
		setRoleVal('');
	};
	/*model for status model*/
	const onChangeRoleStatus = (data: RoleDataArr) => {
		setIsStatusModelShow(true);
		setRoleObj(data);
	};

	/*function for change status*/
	const changeRoleStatus = useCallback(() => {
		updateRoleStatus({
			variables: {
				updateStatusRoleId: roleObj?.id,
				status: roleObj.status === 1 ? 0 : 1,
			},
		})
			.then((res) => {
				const data = res.data as UpdateRoleStatusType;
				if (data.updateStatusRole.meta.statusCode === 200) {
					toast.success(data.updateStatusRole.meta.message);
					setIsStatusModelShow(false);
					refetch(filterData);
				}
			})
			.catch(() => {
				toast.error('Failed to update');
			});
	}, [filterData, refetch, roleObj?.id, roleObj.status, updateRoleStatus]);

	/*to search data*/

	const onSearchRole = (e: string) => {
		setFilterData({ ...filterData, search: e, page: 1 });
	};

	/*to sort data*/

	const sortDataHandler = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: filterData?.sortOrder === 'asc' ? 'desc' : 'asc',
		});
	};
	/*for drop down select role*/
	const pageDropDownSelect = (e: string) => {
		setFilterData({ ...filterData, limit: parseInt(e), page: 1 });
	};
	/*handler for page click*/
	const pageClickHandler = (selectedItem: { selected: number }) => {
		setFilterData({ ...filterData, page: selectedItem.selected + 1 });
	};
	const hasPreviousPage = filterData.page > 1;
	const hasNextPage = filterData.page < Math.ceil(roleData?.count / filterData?.limit);
	return (
		<>
			{/* main div  */}
			<div className='w-full sm:w-auto mb-3 bg-white shadow-lg rounded-sm overflow-auto border border-[#c8ced3] ml-1'>
				<div className='bg-[#f0f3f5] py-3 px-5 flex items-center justify-between border-b border-[#c8ced3]'>
					<div className='flex items-center'>
						<MenuBurger className='inline-block mr-3' fontSize='16px' />
						{t('Role List')}
					</div>
					<div>
						<Button className='btn-primary btn-normal ' onClick={createNewRole} type='button' label={t('Add New')}>
							<PlusCircle className='mr-1' />
						</Button>
					</div>
				</div>
				{/* sub div  */}
				<div className='p-3 flex items-center justify-start md:justify-between  '>
					<div className='p-3 flex items-center justify-start '>
						<span className=' text-sm text-gray-900 font-normal '>{t('Show')}</span>
						<CustomSelect options={SHOW_PAGE_COUNT_ARR} value={filterData.limit} onChange={(e) => pageDropDownSelect(e)} />
						<span className=' text-sm text-gray-900 font-normal'>{t('Entries')}</span>
					</div>
					<div className='flex items-center justify-between pb-2'>
						<TextInput type='text' value={filterData?.search} onChange={(e) => onSearchRole(e.target.value)} placeholder={t('Search') as string} />
					</div>
				</div>
				<div className=' p-3 overflow-auto custom-datatable '>
					<table>
						<thead>
							<tr>
								{COL_ARR_ROLE?.map((roleVal: ColArrType, index: number) => {
									return (
										<th scope='col' key={`${index + 1}`}>
											<div className={`${roleVal.name !== 'Title' ? 'flex items-center justify-center' : 'flex items-center'} `}>
												{roleVal.name}
												{roleVal.sortable && (
													<p onClick={() => sortDataHandler(roleVal.fildName)}>
														{(filterData.sortOrder === '' || filterData.sortBy !== roleVal.fildName) && <GetDefaultIcon />}
														{filterData.sortOrder === 'asc' && filterData.sortBy === roleVal.fildName && <GetAscIcon />}
														{filterData.sortOrder === 'desc' && filterData.sortBy === roleVal.fildName && <GetDescIcon />}
													</p>
												)}
											</div>
										</th>
									);
								})}

								<th scope='col' className='text-center'>
									{t('Action')}
								</th>
							</tr>
						</thead>
						<tbody>
							{data?.fetchRoles.data?.Roledata?.map((data: RoleDataArr, index: number) => {
								return (
									<tr key={data.id}>
										<th scope='row' className='text-center font-normal'>
											{index + 1}
										</th>
										<td>{data.role_name}</td>
										<td className='text-center'>{data.status === 1 ? <span className='badge badge-success rounded'>Active</span> : <span className='badge badge-danger rounded'>InActive</span>}</td>
										<td>
											<div className='flex justify-center'>
												<div className='mx-2'>
													<span onClick={() => onChangeRoleStatus(data)} className='font-medium text-[#BB3F42] dark:text-[#BB3F42] hover:underline'>
														<label className='relative inline-flex items-center cursor-pointer'>
															<input type='checkbox' value={data.status} className='sr-only peer' checked={data.status === 1} onClick={() => onChangeRoleStatus(data)} />
															<div className={'w-7 h-4 bg-gray-200 rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-primary'}></div>
														</label>
													</span>
												</div>

												<div className='mx-2' onClick={() => editRole(data)}>
													<Edit className='text-[#BB3F42]' />
												</div>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					{!data?.fetchRoles.data?.Roledata.length && <p className='text-center text-[#BB3F42]'>{t('No Data')}</p>}
				</div>
				<div className='px-6 mb-4 flex items-center justify-between '>
					<span>
						{' '}
						{roleData?.count} {t('Total Records')}{' '}
					</span>
					<Pagination pageCount={Math.ceil(roleData?.count / filterData?.limit)} currentPage={filterData?.page} onPageChange={pageClickHandler} hasPreviousPage={hasPreviousPage} hasNextPage={hasNextPage} />
				</div>

				{isRoleModelShow && <AddEditRole isRoleModelShow={isRoleModelShow} isRoleEditable={isRoleEditable} onSubmitRole={onSubmitRole} onClose={onClose} roleVal={roleVal} roleObj={roleObj} />}

				{isStatusModelShow && <ChangeStatus onClose={onClose} changeStatus={changeRoleStatus} />}
				{/* main div end  */}
			</div>
		</>
	);
};
export default Role;
