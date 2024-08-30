import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, IErrorResponse, ISuccessResponse, PaginationParams } from 'src/types/common';
import { PlusCircle, Search, Briefcase, Pencil } from '@components/icons';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { sortOrder } from '@utils/helpers';
import Pagination from '@components/pagination/Pagination';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, endPoint } from '@config/constant';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { debounce } from 'lodash';
import TextInput from '@components/textInput/TextInput';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';
import { SchoolData, SchoolObj } from 'src/types/schools';
import { Link, useNavigate } from 'react-router-dom';
import CommonButton from '@components/common/CommonButton';
import PasswordChange from '@views/changePassword/ChangePassword';
import { ChangePasswordVariable } from 'src/types/user';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';
import moment from 'moment';
import { AxiosError, AxiosResponse } from 'axios';

const School = () => {
	const userRole = localStorage.getItem('role') as string;
	useEscapeKeyPress(() => onCloseSchool()); // use to close model on Esc key.
	const navigate = useNavigate();
	const [schoolData, setSchoolData] = useState<SchoolData>();
	const [isDeleteSchool, setIsDeleteSchool] = useState<boolean>(false);
	const [editData, setEditData] = useState<SchoolObj | null>(null);
	const [loader, setLoader] = useState<boolean>(false);
	const [isStatusModalShow, setIsStatusModalShow] = useState<boolean>(false);
	const [isChangePasswordModal, setIsChangePasswordModal] = useState<boolean>(false);
	const [filterSchoolData, setFilterSchoolData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: 'name',
		sortOrder: sortOrderValues.asc,
		search: '',
	});
	const COL_ARR = [
		{ name: 'Sr. No', sortable: false },
		{ name: 'School Name', sortable: true, fieldName: 'name' },
		{ name: 'Contact person Name', sortable: false, fieldName: 'contactPersonName' },
		{ name: 'Contact person number', sortable: false, fieldName: 'contactPersonNumber' },
		{ name: 'School city', sortable: false, fieldName: 'schoolCity' },
		{ name: 'Start Date', sortable: false, fieldName: 'paymentStartDate' },
		{ name: 'End Date', sortable: false, fieldName: 'paymentEndDate' },
		{ name: 'Created At', sortable: true, fieldName: 'createdAt' },
		{ name: 'Status', sortable: false, fieldName: 'status' },
	] as ColArrType[];

	/**
	 * @returns Method is used to get the school list data from api
	 */
	const getSchoolData = useCallback(() => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.schools}?page=${filterSchoolData.page}&limit=${filterSchoolData.limit}&search=${filterSchoolData.search}&sortBy=${filterSchoolData.sortBy}&sortOrder=${filterSchoolData.sortOrder}`)
			.then((response: AxiosResponse<ISuccessResponse<SchoolData>>) => {
				if (response.status === ResponseCode.success) {
					setSchoolData(response?.data?.data);
				}
			})
			.catch((err) => toast.error(err?.response?.data.message))
			.finally(() => setLoader(false));
	}, [filterSchoolData]);

	/**
	 * Method is used to delete the school data from api
	 */
	const deleteSchoolData = () => {
		setLoader(true);
		APIService.deleteData(`${URL_PATHS.schools}/${editData?.uuid}`)
			.then((response: AxiosResponse<ISuccessResponse<string>>) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getSchoolData();
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setLoader(false));
	};

	/**
	 * Method used to update the status of the school
	 * @param value: true or false
	 */
	const updateSchoolStatus = (value: boolean) => {
		setLoader(true);
		APIService.patchData(`${URL_PATHS.schools}/${editData?.uuid}`, {
			isActive: value,
		})
			.then((response: AxiosResponse<ISuccessResponse<string>>) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getSchoolData();
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setLoader(false));
	};

	/**
	 * Method is used to fetch the school data from API on page load.
	 */
	useEffect(() => {
		getSchoolData();
	}, [filterSchoolData]);

	/**
	 * Method used for on Pagination Change.
	 * @param event
	 */
	const handleSchoolPageClick = useCallback(
		(event: { selected: number }) => {
			setFilterSchoolData({ ...filterSchoolData, page: event.selected + 1 });
		},
		[filterSchoolData]
	);

	/**
	 * Method used for storing data
	 * @param sortFieldName
	 */
	const onSchoolHandleSort = (sortFieldName: string) => {
		setFilterSchoolData({
			...filterSchoolData,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterSchoolData.sortOrder),
		});
	};

	/**
	 * Method used for change dropdown for page limit
	 * @param e
	 */
	const onSchoolPageDrpSelect = useCallback(
		(e: string) => {
			setFilterSchoolData({ ...filterSchoolData, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterSchoolData]
	);

	/**
	 * Method used for delete school data
	 */
	const deleteSchool = useCallback(() => {
		deleteSchoolData();
		setIsDeleteSchool(false);
		setEditData(null);
	}, [isDeleteSchool]);

	/**
	 * Method used for close modal
	 */
	const onCloseSchool = useCallback(() => {
		setIsDeleteSchool(false);
		setIsStatusModalShow(false);
		setIsChangePasswordModal(false);
		setEditData(null);
	}, []);

	/**
	 * Method used for show country delete modal
	 * @param data
	 */
	const deleteSchoolDataModal = useCallback((data: SchoolObj) => {
		setEditData(data);
		setIsDeleteSchool(true);
	}, []);

	/**
	 * Method used for store search value
	 * @param e
	 */
	const handleSearch = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterSchoolData({ ...filterSchoolData, search: searchTerm, page: DEFAULT_PAGE });
		}, 500),
		[filterSchoolData]
	);

	/**
	 * Method for handle the bubbling
	 * @param e
	 */
	const rowClickHandler = (e: { stopPropagation: () => void }) => {
		e.stopPropagation();
	};

	/**
	 * Method used for onchange status
	 * @param data
	 */
	const onChangeStatus = useCallback((data: SchoolObj) => {
		setEditData(data);
		setIsStatusModalShow(true);
	}, []);

	/**
	 * Method used for change school status
	 */
	const changeSchoolStatus = useCallback(() => {
		const data = editData?.isActive;
		updateSchoolStatus(!data);
		setIsStatusModalShow(false);
		setEditData(null);
	}, [isStatusModalShow]);

	/**
	 * Method used for navigate to the view page
	 * @param uuid
	 */
	const navigateToViewPage = (uuid: string) => {
		navigate(`/${ROUTES.app}/${ROUTES.school}/${ROUTES.list}/viewSchool/${uuid}`);
	};

	/**
	 * Method used for change password api call.
	 * @param passwordChange
	 */
	const updatePassword = (passwordChange: ChangePasswordVariable) => {
		setLoader(true);
		APIService.patchData(`${URL_PATHS.userManagement}${editData?.user.uuid}/${endPoint.changePassword}`, {
			newPassword: passwordChange.newPassword,
			confirmPassword: passwordChange.confirmPassword,
		})
			.then((response: AxiosResponse<ISuccessResponse<object>>) => {
				if (response.status == ResponseCode.success) {
					toast.success(response.data.message);
					getSchoolData();
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setLoader(false));
	};

	/**
	 *
	 *Method used for show change password modal
	 */
	const changePassword = useCallback((data: SchoolObj) => {
		setEditData(data);
		setIsChangePasswordModal(true);
	}, []);

	/**
	 *
	 * @param content Method is used for any Password change
	 * @returns need to implement in Api
	 */
	const onSubmitPassword = useCallback(
		(content: ChangePasswordVariable) => {
			updatePassword(content);
			setIsChangePasswordModal(false);
			setEditData(null);
		},
		[isChangePasswordModal]
	);

	return (
		<div>
			{loader && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Briefcase className='inline-block mr-2 text-primary' /> School List
					</h6>
					<RoleBaseGuard permissions={[permissionsArray.SCHOOL_MANAGEMENT.AddAccess]}>
						<Link className='btn btn-primary btn-large' to='addSchool'>
							<PlusCircle className='mr-1' /> Add New
						</Link>
					</RoleBaseGuard>
				</div>
				<div className='p-3 w-full'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleSearch} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onSchoolPageDrpSelect} value={filterSchoolData.limit} />
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
														<button onClick={() => onSchoolHandleSort(colVal.fieldName)}>
															{(filterSchoolData.sortOrder === '' || filterSchoolData.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterSchoolData.sortOrder === sortOrderValues.asc && filterSchoolData.sortBy === colVal.fieldName && getAscIcon()}
															{filterSchoolData.sortOrder === sortOrderValues.desc && filterSchoolData.sortBy === colVal.fieldName && getDescIcon()}
														</button>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col' className='w-40'>
										Action
									</th>
								</tr>
							</thead>

							<tbody>
								{schoolData?.rows?.map((data, index: number) => {
									return (
										<tr
											key={data.uuid}
											className='cursor-pointer'
											onClick={() => {
												navigateToViewPage(data?.uuid);
											}}
										>
											<th scope='row' className='w-10 text-center'>
												{index + 1}
											</th>
											<td className='font-medium'>{data.schoolName}</td>
											<td>{data.user.contactPersonName}</td>
											<td>{data.user.contactPersonPhoneNumber}</td>
											<td>{data.city}</td>
											<td className='w-28 text-center'>{data.schoolPayment ? moment(data.schoolPayment.paymentStartDate).format('MM-DD-YYYY') : ''}</td>
											<td className='w-28 text-center'>{data.schoolPayment ? moment(data.schoolPayment.paymentEndDate).format('MM-DD-YYYY') : ''}</td>
											<td className='w-28 text-center'>{moment(data.createdAt).format('MM-DD-YYYY')}</td>
											<td className='w-28 text-center'>{data.isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
											<td className='cursor-default' onClick={rowClickHandler}>
												<div className='flex items-center'>
													<RoleBaseGuard permissions={[permissionsArray.SCHOOL_MANAGEMENT.EditAccess]}>
														<Link className='btn btn-default mx-1' to={`editSchool/${data?.uuid}`} title='Edit Record'>
															<Pencil />
														</Link>
													</RoleBaseGuard>
													<div>
														<RoleBaseGuard permissions={[permissionsArray.SCHOOL_MANAGEMENT.DeleteAccess]}>
															<DeleteButton data={data} isDeleteStatusModal={deleteSchoolDataModal} />
														</RoleBaseGuard>
													</div>
													{+userRole == 1 && <CommonButton data={data} dataHandler={changePassword} isPasswordChange={true} title='Change Password' />}
													<RoleBaseGuard permissions={[permissionsArray.SCHOOL_MANAGEMENT.ChangeStatusAccess]}>
														<StatusButton data={data} isChangeStatusModal={onChangeStatus} status={`${data.isActive}`} checked={data.isActive} />
													</RoleBaseGuard>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!schoolData?.count && <p className='text-center'>No School Found</p>}
					</div>
					<Pagination length={schoolData?.count ?? 0} onSelect={handleSchoolPageClick} limit={filterSchoolData.limit} />
				</div>
			</div>
			{isStatusModalShow && <ChangeStatus onClose={onCloseSchool} changeStatus={changeSchoolStatus} />}
			{isDeleteSchool && <DeleteModel onClose={onCloseSchool} deleteData={deleteSchool} />}
			{isChangePasswordModal && <PasswordChange onClose={onCloseSchool} data={editData} onSubmitPassword={onSubmitPassword} />}
		</div>
	);
};
export default School;
