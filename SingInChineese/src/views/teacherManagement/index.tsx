import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, IErrorResponse, ISuccessResponse, PaginationParams } from 'src/types/common';
import { Pencil, PlusCircle, Search, User } from '@components/icons';
import DeleteModel from '@views/deleteModel/DeleteModel';
import Pagination from '@components/pagination/Pagination';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, endPoint } from '@config/constant';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TeacerData, TeacherObj } from 'src/types/teacher';
import CommonButton from '@components/common/CommonButton';
import { ChangePasswordVariable } from 'src/types/user';
import PasswordChange from '@views/changePassword/ChangePassword';
import Dropdown from '@components/dropdown/Dropdown';
import { DropdownOptionType } from 'src/types/component';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';
import TextInput from '@components/textInput/TextInput';
import { debounce } from 'lodash';
import { AxiosError, AxiosResponse } from 'axios';
import { SchoolData } from 'src/types/schools';

const Teacher = () => {
	const userRole = localStorage.getItem('role') as string;
	const schoolAdminData = localStorage.getItem('userDetails');
	const schoolAdmin = schoolAdminData && JSON.parse(schoolAdminData);
	useEscapeKeyPress(() => onCloseHandler()); // use to close model on Esc key.
	const navigate = useNavigate();
	const params = useParams();
	const [loaderTeacher, setLoaderTeacher] = useState<boolean>(false);
	const [teacherData, setTeacherData] = useState<TeacerData>();
	const [editData, setEditData] = useState<TeacherObj | null>(null);
	const [isDeleteTeacherModal, setIsDeleteTeacherModal] = useState<boolean>(false);
	const [isChangeStatusModal, setIsChangeStatusModal] = useState<boolean>(false);
	const [isChangePasswordModal, setIsChangePasswordModal] = useState<boolean>(false);
	const [schoolData, setSchoolData] = useState<DropdownOptionType[]>([]);
	const [schoolId, setSchoolId] = useState<string>('');
	const [filterTeacherData, setFilterTeacherData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrderValues.asc,
		search: '',
	});
	const COL_ARR = [
		{ name: 'Sr. No', sortable: false },
		{ name: 'First Name', sortable: false, fieldName: 'teacherFirstName' },
		{ name: 'Last Name', sortable: false, fieldName: 'teacherLastName' },
		{ name: 'Email', sortable: false, fieldName: 'teacherEmail' },
		{ name: 'Classroom', sortable: false, fieldName: 'classroom' },
		{ name: 'Status', sortable: false, fieldName: 'status' },
	] as ColArrType[];

	/**
	 * @returns Method is used to get the teacher list data from api
	 */
	const getTeacherData = useCallback(() => {
		setLoaderTeacher(true);
		APIService.getData(`${URL_PATHS.teacher}?page=${filterTeacherData.page}&limit=${filterTeacherData.limit}&search=${filterTeacherData.search}&schoolId=${schoolId}`)
			.then((response: AxiosResponse<ISuccessResponse<TeacerData>>) => {
				if (response.status === ResponseCode.success) {
					setTeacherData(response?.data?.data);
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setLoaderTeacher(false));
	}, [filterTeacherData, schoolId]);

	/**
	 * Method is used to delete the teacher data from api
	 */
	const deleteTeacherData = () => {
		setLoaderTeacher(true);
		APIService.deleteData(`${URL_PATHS.teacher}/${editData?.uuid}`)
			.then((response: AxiosResponse<ISuccessResponse<object>>) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getTeacherData();
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setLoaderTeacher(false));
	};

	/**
	 * Method used to update the status of the teacher
	 * @param value: true or false
	 */
	const changeTeacherStatus = (value: boolean) => {
		setLoaderTeacher(true);
		APIService.patchData(`${URL_PATHS.teacher}/${editData?.uuid}/${endPoint.changeStatus}`, {
			isActive: value,
		})
			.then((response: AxiosResponse<ISuccessResponse<string>>) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getTeacherData();
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setLoaderTeacher(false));
	};

	/**
	 * Method is used to fetch the teacher data from API on page load.
	 */
	useEffect(() => {
		schoolId && getTeacherData();
	}, [filterTeacherData, schoolId]);

	/**
	 * Method used for on Pagination Change.
	 * @param event
	 */
	const handleTeacherPageClick = useCallback(
		(event: { selected: number }) => {
			setFilterTeacherData({ ...filterTeacherData, page: event.selected + 1 });
		},
		[filterTeacherData]
	);

	/**
	 * Method used for change dropdown for page limit
	 * @param e
	 */
	const onTeacherPageDrpSelect = useCallback(
		(e: string) => {
			setFilterTeacherData({ ...filterTeacherData, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterTeacherData]
	);

	/**
	 * Method used for show teacher delete modal
	 * @param data
	 */
	const deleteTeacherModal = useCallback((data: TeacherObj) => {
		setEditData(data);
		setIsDeleteTeacherModal(true);
	}, []);

	/**
	 * Method used for delete teacher data
	 */
	const deleteTeacher = useCallback(() => {
		deleteTeacherData();
		setIsDeleteTeacherModal(false);
		setEditData(null);
	}, [isDeleteTeacherModal]);

	/**
	 * Method used for close modal
	 */
	const onCloseHandler = useCallback(() => {
		setIsDeleteTeacherModal(false);
		setIsChangeStatusModal(false);
		setIsChangePasswordModal(false);
		setEditData(null);
	}, []);

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
	const onChangeStatus = useCallback((data: TeacherObj) => {
		setEditData(data);
		setIsChangeStatusModal(true);
	}, []);

	/**
	 * Method used for change teacher status
	 */
	const changeStatus = useCallback(() => {
		const data = editData?.isActive;
		changeTeacherStatus(!data);
		setIsChangeStatusModal(false);
		setEditData(null);
	}, [isChangeStatusModal]);

	/**
	 * Method used for navigate to the view page
	 * @param uuid
	 */
	const navigateToViewPage = (uuid: string) => {
		navigate(`/${ROUTES.app}/${ROUTES.teacher}/${ROUTES.list}/viewTeacher/${uuid}`);
	};

	/**
	 * Method used for change password api call.
	 * @param passwordChange
	 */
	const updateTeacherPassword = (passwordChange: ChangePasswordVariable) => {
		setLoaderTeacher(true);
		APIService.patchData(`${URL_PATHS.userManagement}${editData?.user.uuid}/${endPoint.changePassword}`, {
			newPassword: passwordChange.newPassword,
			confirmPassword: passwordChange.confirmPassword,
		})
			.then((response: AxiosResponse<ISuccessResponse<object>>) => {
				if (response.status == ResponseCode.success) {
					toast.success(response.data.message);
					getTeacherData();
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setLoaderTeacher(false));
	};

	/**
	 *
	 *Method used for show change password modal
	 */
	const changePassword = useCallback((data: TeacherObj) => {
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
			updateTeacherPassword(content);
			setIsChangePasswordModal(false);
			setEditData(null);
		},
		[isChangePasswordModal]
	);

	/**
	 * @returns Method is used to get the school list data from api
	 */
	const getSchoolDataForTeacherListing = useCallback(() => {
		setLoaderTeacher(true);
		APIService.getData(`${URL_PATHS.schools}?limit=-1`)
			.then((response: AxiosResponse<ISuccessResponse<SchoolData>>) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data?.rows.map((item: { schoolName: string; uuid: string }) => {
						data.push({ name: item?.schoolName, key: item?.uuid });
					});
					setSchoolData(data);
					setSchoolId(params.schoolId ? params.schoolId : (data[0]?.key as string));
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setLoaderTeacher(false));
	}, [params.schoolId]);

	useEffect(() => {
		if (schoolAdmin?.adminData) {
			const schoolInfo = {
				name: schoolAdmin?.adminData.school.schoolName,
				key: schoolAdmin?.adminData.school.uuid,
			};
			setSchoolData([schoolInfo]);
			setSchoolId(schoolInfo.key);
		} else {
			getSchoolDataForTeacherListing();
		}
	}, [schoolAdmin?.adminData, getSchoolDataForTeacherListing]);

	const handleChangeSchoolId = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setSchoolId(e.target.value);
		},
		[schoolId]
	);

	/**
	 * Method used for store search value
	 * @param e
	 */
	const handleSearchTeacher = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterTeacherData({ ...filterTeacherData, search: searchTerm, page: DEFAULT_PAGE });
		}, 500),
		[filterTeacherData]
	);

	return (
		<div>
			{loaderTeacher && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<User className='inline-block mr-2 text-primary' /> Teacher List
					</h6>
					<RoleBaseGuard permissions={[permissionsArray.TEACHER_MANAGEMENT.AddAccess]}>
						<Link className='btn btn-primary btn-large' to='addTeacher'>
							<PlusCircle className='mr-1' /> Add New
						</Link>
					</RoleBaseGuard>
				</div>
				<div className='p-3 w-full'>
					<div className='grid grid-cols-3 mb-3'>
						<Dropdown label='Select school' placeholder='Select school' name={'schoolId'} onChange={handleChangeSchoolId} value={schoolId} options={schoolData} id={'schoolId'} disabled={!!schoolAdmin?.adminData} required />
					</div>
					<div className='flex flex-col md:flex-row md:items-center justify-between mb-3'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleSearchTeacher} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onTeacherPageDrpSelect} value={filterTeacherData.limit} />
					</div>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									{COL_ARR?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												<div className='flex items-center'>{colVal.name}</div>
											</th>
										);
									})}
									<th scope='col' className='w-40'>
										Action
									</th>
								</tr>
							</thead>

							<tbody>
								{teacherData?.rows?.map((data, index: number) => {
									return (
										<tr
											key={data?.uuid}
											className='cursor-pointer'
											onClick={() => {
												navigateToViewPage(data?.uuid);
											}}
										>
											<th scope='row' className='w-10 text-center'>
												{index + 1}
											</th>
											<td className='w-28 font-medium'>{data?.user?.teacherFirstName}</td>
											<td className='w-28 font-medium'>{data?.user?.teacherLastName}</td>
											<td className='w-72'>{data?.user?.teacherEmail}</td>
											<td>{data?.classroom?.map((classroom) => classroom.name).join(', ')}</td>
											<td className='w-28 text-center'>{data?.isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
											<td className='cursor-default' onClick={rowClickHandler}>
												<div className='flex items-center'>
													<RoleBaseGuard permissions={[permissionsArray.TEACHER_MANAGEMENT.EditAccess]}>
														<Link className='btn btn-default mx-1' to={`editTeacher/${data?.uuid}`} title='Edit Record'>
															<Pencil />
														</Link>
													</RoleBaseGuard>
													<RoleBaseGuard permissions={[permissionsArray.TEACHER_MANAGEMENT.DeleteAccess]}>
														<DeleteButton data={data} isDeleteStatusModal={deleteTeacherModal} />
													</RoleBaseGuard>
													{+userRole == 1 && <CommonButton data={data} dataHandler={changePassword} isPasswordChange={true} title='Change Password' />}
													<RoleBaseGuard permissions={[permissionsArray.TEACHER_MANAGEMENT.ChangeStatusAccess]}>
														<StatusButton data={data} isChangeStatusModal={onChangeStatus} status={`${data?.isActive}`} checked={data?.isActive} />
													</RoleBaseGuard>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!teacherData?.count && <p className='text-center'>No Teacher Found</p>}
					</div>
					<Pagination length={teacherData?.count ?? 0} onSelect={handleTeacherPageClick} limit={filterTeacherData.limit} />
				</div>
			</div>
			{isChangeStatusModal && <ChangeStatus onClose={onCloseHandler} changeStatus={changeStatus} />}
			{isDeleteTeacherModal && <DeleteModel onClose={onCloseHandler} deleteData={deleteTeacher} message={editData?.classroom?.length ? 'This teacher is already associated with a classroom. If you delete it, the teacher will be disassociated from that classroom.' : 'Are you sure you want to delete this record?'} />}
			{isChangePasswordModal && <PasswordChange onClose={onCloseHandler} data={editData} onSubmitPassword={onSubmitPassword} />}
		</div>
	);
};
export default Teacher;
