import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, IErrorResponse, ISuccessResponse, PaginationParams } from 'src/types/common';
import { ListCheck, Pencil, PlusCircle, Search } from '@components/icons';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { sortOrder } from '@utils/helpers';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES } from '@config/constant';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DropdownOptionType } from 'src/types/component';
import Dropdown from '@components/dropdown/Dropdown';
import { ClassroomData, ClassroomObj } from 'src/types/classroom';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import TextInput from '@components/textInput/TextInput';
import { debounce } from 'lodash';
import Pagination from '@components/pagination/Pagination';
import AssignTeacherModal from './AssignTeacher';
import CommonButton from '@components/common/CommonButton';
import { AxiosError, AxiosResponse } from 'axios';
import { SchoolData } from 'src/types/schools';
import { TeacerData } from 'src/types/teacher';

const Classroom = () => {
	const schoolAdminData = localStorage.getItem('userDetails');
	const schoolAdmin = schoolAdminData && JSON.parse(schoolAdminData);
	useEscapeKeyPress(() => onCloseHandler()); // use to close model on Esc key.
	const navigate = useNavigate();
	const location = useLocation();
	const [isLoadClassroom, setIsLoadClassroom] = useState<boolean>(false);
	const [classroomData, setClassroomData] = useState<ClassroomData>();
	const [editData, setEditData] = useState<ClassroomObj | null>(null);
	const [isDeleteClassModal, setIsDeleteClassModal] = useState<boolean>(false);
	const [isChangeStatusModal, setIsChangeStatusModal] = useState<boolean>(false);
	const [schoolData, setSchoolData] = useState<DropdownOptionType[]>([]);
	const [schoolId, setSchoolId] = useState<string>('');
	const [teacherData, setTeacherData] = useState<DropdownOptionType[]>([]);
	const [teacherId, setTeacherId] = useState<string>('');
	const [isAssignTeacherModal, setIsAssignTeacherModal] = useState<boolean>(false);
	const [isUnAssignTeacherModal, setIsUnAssignTeacherModal] = useState<boolean>(false);
	const [filterClassData, setFilterClassData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrderValues.asc,
		search: '',
	});
	const COL_ARR = [
		{ name: 'Sr. No', sortable: false },
		{ name: 'Class Name', sortable: true, fieldName: 'name' },
		{ name: 'Teacher Name', sortable: false, fieldName: 'teacherName' },
		{ name: 'Status', sortable: false, fieldName: 'status' },
	] as ColArrType[];

	/**
	 * @returns Method is used to get the classroom list data from api
	 */
	const getClassroomData = useCallback(() => {
		setIsLoadClassroom(true);
		const teacherParam = teacherId && teacherId !== 'All' ? `&teacherId=${teacherId}` : '';
		APIService.getData(`${URL_PATHS.classroom}?page=${filterClassData.page}&limit=${filterClassData.limit}&search=${filterClassData.search}&sortBy=${filterClassData.sortBy}&sortOrder=${filterClassData.sortOrder}&schoolId=${schoolId}${teacherParam}`)
			.then((response: AxiosResponse<ISuccessResponse<ClassroomData>>) => {
				if (response.status === ResponseCode.success) {
					setClassroomData(response?.data?.data);
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setIsLoadClassroom(false));
	}, [filterClassData, schoolId, teacherId]);

	/**
	 * Method is used to delete the classroom data from api
	 */
	const deleteClassroomData = () => {
		setIsLoadClassroom(true);
		APIService.deleteData(`${URL_PATHS.classroom}/${editData?.uuid}`)
			.then((response: AxiosResponse<ISuccessResponse<object>>) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getClassroomData();
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setIsLoadClassroom(false));
	};

	/**
	 * Method used to update the status of the classroom
	 * @param value: true or false
	 */
	const changeClassroomStatus = (value: boolean) => {
		setIsLoadClassroom(true);
		APIService.patchData(`${URL_PATHS.classroom}/${editData?.uuid}`, {
			isActive: value,
		})
			.then((response: AxiosResponse<ISuccessResponse<object>>) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getClassroomData();
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setIsLoadClassroom(false));
	};

	/**
	 * Method is used to fetch the classroom data from API on page load.
	 */
	useEffect(() => {
		schoolId && getClassroomData();
	}, [filterClassData, schoolId, teacherId]);

	/**
	 * Method used for storing data
	 * @param sortFieldName
	 */
	const onClassroomHandleSort = (sortFieldName: string) => {
		setFilterClassData({
			...filterClassData,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterClassData.sortOrder),
		});
	};

	/**
	 * Method used for show classroom delete modal
	 * @param data
	 */
	const deleteClassroomModal = useCallback((data: ClassroomObj) => {
		setEditData(data);
		setIsDeleteClassModal(true);
	}, []);

	/**
	 * Method used for delete teacher data
	 */
	const deleteClassroom = useCallback(() => {
		deleteClassroomData();
		setIsDeleteClassModal(false);
		setEditData(null);
	}, [isDeleteClassModal]);

	/**
	 * Method used for close modal
	 */
	const onCloseHandler = useCallback(() => {
		setIsDeleteClassModal(false);
		setIsChangeStatusModal(false);
		setIsAssignTeacherModal(false);
		setIsUnAssignTeacherModal(false);
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
	const onChangeStatus = useCallback((data: ClassroomObj) => {
		setEditData(data);
		setIsChangeStatusModal(true);
	}, []);

	/**
	 * Method used for change classroom status
	 */
	const changeStatus = useCallback(() => {
		const data = editData?.isActive;
		changeClassroomStatus(!data);
		setIsChangeStatusModal(false);
		setEditData(null);
	}, [isChangeStatusModal]);

	/**
	 * Method used for navigate to the view page
	 * @param schoolId
	 * @param teacherId
	 * @param uuid
	 * @param className
	 */
	const navigateToViewPage = (school: string, teacher: string, uuid: string, className: string) => {
		navigate(`/${ROUTES.app}/${ROUTES.classroom}/${ROUTES.list}/${school}/${teacher}/viewClass/${uuid}/${className}`);
	};

	useEffect(() => {
		if (location.state) {
			setSchoolId(location.state?.schoolId);
			setTeacherId(location.state?.teacherId);
		}
	}, [location.state]);

	/**
	 * @returns Method is used to get the school list data from api
	 */
	const getSchoolDataForClassList = useCallback(() => {
		setIsLoadClassroom(true);
		APIService.getData(`${URL_PATHS.schools}?limit=-1`)
			.then((response: AxiosResponse<ISuccessResponse<SchoolData>>) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data?.rows.map((item: { schoolName: string; uuid: string }) => {
						data.push({ name: item?.schoolName, key: item?.uuid });
					});
					setSchoolData(data);
					if (!location.state) {
						setSchoolId(data[0]?.key as string);
					}
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setIsLoadClassroom(false));
	}, []);

	useEffect(() => {
		if (schoolAdmin?.adminData) {
			setSchoolData([{ name: schoolAdmin?.adminData.school.schoolName, key: schoolAdmin?.adminData.school.uuid }]);
			setSchoolId(schoolData[0]?.key as string);
		} else {
			getSchoolDataForClassList();
		}
	}, [schoolAdmin.adminData && schoolId]);

	/**
	 * @returns Method is used to handle the onchange of school dropdown
	 * @param e
	 */
	const handleChangeSchoolId = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			navigate(`/${ROUTES.app}/${ROUTES.classroom}/${ROUTES.list}`, { replace: true });
			setSchoolId(e.target.value);
			setTeacherId('');
		},
		[schoolId]
	);

	/**
	 * @returns Method is used to get the teacher list data from api
	 */
	const getTeacherDataForClassList = useCallback(() => {
		setIsLoadClassroom(true);
		APIService.getData(`${URL_PATHS.teacher}?limit=-1&schoolId=${schoolId}`)
			.then((response: AxiosResponse<ISuccessResponse<TeacerData>>) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data?.rows.map((item: { user: { teacherFirstName: string; teacherLastName: string }; uuid: string }) => {
						data.push({ name: `${item?.user.teacherFirstName} ${item.user.teacherLastName || ''}`, key: item?.uuid });
					});
					setTeacherData([{ name: 'Select All', key: 'All' }, ...data]);
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setIsLoadClassroom(false));
	}, [schoolId]);

	useEffect(() => {
		if (schoolAdmin.adminData?.teacherUUID) {
			setTeacherData([{ name: schoolAdmin?.adminData?.user.teacherName, key: schoolAdmin?.adminData?.teacherUUID }]);
			setTeacherId(teacherData[0]?.key as string);
		} else {
			schoolId && getTeacherDataForClassList();
		}
	}, [schoolId]);

	/**
	 * @returns Method is used to handle the onchange of school dropdown
	 * @param e
	 */
	const handleChangeTeacherId = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setTeacherId(e.target.value);
		},
		[teacherId]
	);

	/**
	 * Method used for store search value
	 * @param e
	 */
	const handleSearchClass = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterClassData({ ...filterClassData, search: searchTerm, page: DEFAULT_PAGE });
		}, 500),
		[filterClassData]
	);

	/**
	 * Method used for change dropdown for page limit
	 * @param e
	 */
	const onClassPageDrpSelect = useCallback(
		(e: string) => {
			setFilterClassData({ ...filterClassData, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterClassData]
	);

	/**
	 * Method used for on Pagination Change.
	 * @param event
	 */
	const handleClassPageClick = useCallback(
		(event: { selected: number }) => {
			setFilterClassData({ ...filterClassData, page: event.selected + 1 });
		},
		[filterClassData]
	);

	/**
	 * Method used for assign teacher to classroom
	 * @param data
	 */
	const onAssignTeacherHandler = useCallback((data: ClassroomObj) => {
		setEditData(data);
		setIsAssignTeacherModal(true);
	}, []);

	/**
	 * Method used for un-assign teacher to classroom
	 * @param data
	 */
	const onUnAssignTeacherHandler = useCallback((data: ClassroomObj) => {
		setEditData(data);
		setIsUnAssignTeacherModal(true);
	}, []);
	return (
		<div>
			{isLoadClassroom && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<ListCheck className='inline-block mr-2 text-primary' /> Classroom List
					</h6>
					<RoleBaseGuard permissions={[permissionsArray.CLASSROOM_MANAGEMENT.AddAccess]}>
						<Link className='btn btn-primary btn-large' to={`${schoolId}/addClass`}>
							<PlusCircle className='mr-1' /> Add New
						</Link>
					</RoleBaseGuard>
				</div>
				<div className='p-3 w-full'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-x-4 mb-3'>
						<Dropdown label='Select school' placeholder='Select school' name={'schoolId'} onChange={handleChangeSchoolId} value={schoolId} options={schoolData} id={'schoolId'} disabled={!!schoolAdmin?.adminData} required />
						<Dropdown label='Select teacher' placeholder='' name={'teacherId'} onChange={handleChangeTeacherId} value={teacherId} options={teacherData} id={'teacherId'} disabled={!!schoolAdmin.adminData?.teacherUUID} required />
					</div>
					<div className='flex flex-col md:flex-row md:items-center justify-between mb-3'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleSearchClass} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onClassPageDrpSelect} value={filterClassData.limit} />
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
														<button onClick={() => onClassroomHandleSort(colVal.fieldName)}>
															{(filterClassData.sortOrder === '' || filterClassData.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterClassData.sortOrder === sortOrderValues.asc && filterClassData.sortBy === colVal.fieldName && getAscIcon()}
															{filterClassData.sortOrder === sortOrderValues.desc && filterClassData.sortBy === colVal.fieldName && getDescIcon()}
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
								{classroomData?.rows?.map((data, index: number) => {
									return (
										<tr
											key={data.uuid}
											className='cursor-pointer'
											onClick={() => {
												navigateToViewPage(schoolId, teacherId || 'All', data?.uuid, data?.name);
											}}
										>
											<th scope='row' className='w-10 text-center'>
												{index + 1}
											</th>
											<td className='font-medium'>{data?.name}</td>
											<td>
												{data?.teacher?.user?.firstName} {data?.teacher?.user?.lastName}
											</td>
											<td className='w-28 text-center'>{data?.isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
											<td className='cursor-default' onClick={rowClickHandler}>
												<div className='flex justify-center items-center'>
													<RoleBaseGuard permissions={[permissionsArray.TEACHER_MANAGEMENT.ListAccess]}>{!data?.teacher ? <CommonButton data={data} dataHandler={onAssignTeacherHandler} title='Assign Teacher' isAssignTeacher={true} /> : <CommonButton data={data} dataHandler={onUnAssignTeacherHandler} title='Unassign Teacher' isUnAssignTeacher={true} />}</RoleBaseGuard>
													<RoleBaseGuard permissions={[permissionsArray.CLASSROOM_MANAGEMENT.EditAccess]}>
														<Link className='btn btn-default mx-1' to={`${schoolId}/${teacherId || 'All'}/editClass/${data?.uuid}`} title='Edit Record'>
															<Pencil />
														</Link>
													</RoleBaseGuard>
													<RoleBaseGuard permissions={[permissionsArray.CLASSROOM_MANAGEMENT.DeleteAccess]}>
														<DeleteButton data={data} isDeleteStatusModal={deleteClassroomModal} />
													</RoleBaseGuard>
													<RoleBaseGuard permissions={[permissionsArray.CLASSROOM_MANAGEMENT.ChangeStatusAccess]}>
														<StatusButton data={data} isChangeStatusModal={onChangeStatus} status={`${data?.isActive}`} checked={data?.isActive} />
													</RoleBaseGuard>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!classroomData?.count && <p className='text-center'>No Classroom Found</p>}
					</div>
					<Pagination length={classroomData?.count ?? 0} onSelect={handleClassPageClick} limit={filterClassData.limit} />
				</div>
			</div>
			{isChangeStatusModal && <ChangeStatus onClose={onCloseHandler} changeStatus={changeStatus} />}
			{isDeleteClassModal && <DeleteModel onClose={onCloseHandler} deleteData={deleteClassroom} />}
			{isAssignTeacherModal && <AssignTeacherModal onClose={onCloseHandler} onSubmit={getClassroomData} editData={editData} />}
			{isUnAssignTeacherModal && <AssignTeacherModal onClose={onCloseHandler} onSubmit={getClassroomData} editData={editData} isAssign={false} />}
		</div>
	);
};
export default Classroom;
