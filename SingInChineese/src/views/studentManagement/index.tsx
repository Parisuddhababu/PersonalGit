import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, IErrorResponse, ISuccessResponse, PaginationParams } from 'src/types/common';
import { PlusCircle, Search, ArrowRight, UsersAlt, Pencil } from '@components/icons';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { DEFAULT_LIMIT, DEFAULT_PAGE, endPoint, ROUTES } from '@config/constant';
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
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';
import { StudentData, StudentObj } from 'src/types/student';
import Pagination from '@components/pagination/Pagination';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import TextInput from '@components/textInput/TextInput';
import { debounce } from 'lodash';
import MoveChildData from './moveChild';
import { AxiosError, AxiosResponse } from 'axios';
import { SchoolData } from 'src/types/schools';
import { TeacerData } from 'src/types/teacher';
import { ClassroomData } from 'src/types/classroom';

const Student = () => {
	const schoolAdminData = localStorage.getItem('userDetails');
	const schoolAdmin = schoolAdminData && JSON.parse(schoolAdminData);
	useEscapeKeyPress(() => onCloseHandler()); // use to close modal on Esc key.
	const navigate = useNavigate();
	const location = useLocation();
	const [isLoadStudent, setIsLoadStudent] = useState<boolean>(false);
	const [studentData, setStudentData] = useState<StudentData>();
	const [editData, setEditData] = useState<StudentObj | null>(null);
	const [isDeleteStudentModal, setIsDeleteStudentModal] = useState<boolean>(false);
	const [isChangeStatusModal, setIsChangeStatusModal] = useState<boolean>(false);
	const [schoolData, setSchoolData] = useState<DropdownOptionType[]>([]);
	const [schoolId, setSchoolId] = useState<string>('');
	const [teacherData, setTeacherData] = useState<DropdownOptionType[]>([]);
	const [teacherId, setTeacherId] = useState<string>('');
	const [classroomData, setClassroomData] = useState<DropdownOptionType[]>([]);
	const [classroomId, setClassroomId] = useState<string>('');
	const [isShownMoveModal, setIsShownMoveModal] = useState<boolean>(false);
	const [filterStudentData, setFilterStudentData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrderValues.asc,
		search: '',
	});
	const COL_ARR = [
		{ name: 'Sr. No', sortable: false },
		{ name: 'Child First Name', sortable: false, fieldName: 'childFirstName' },
		{ name: 'Child Last Name', sortable: false, fieldName: 'childLastName' },
		{ name: 'Child Id', sortable: false, fieldName: 'childId' },
		{ name: 'Parent Name', sortable: false, fieldName: 'parentFirstName' },
		{ name: 'Status', sortable: false, fieldName: 'status' },
	] as ColArrType[];

	/**
	 * @returns Method is used to get the student list data from api
	 */
	const getStudentData = useCallback(() => {
		setIsLoadStudent(true);
		APIService.getData(`${URL_PATHS.student}?page=${filterStudentData.page}&limit=${filterStudentData.limit}&search=${filterStudentData.search}&classRoomId=${classroomId}`)
			.then((response: AxiosResponse<ISuccessResponse<StudentData>>) => {
				if (response.status === ResponseCode.success) {
					setStudentData(response?.data?.data);
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setIsLoadStudent(false));
	}, [filterStudentData, classroomId]);

	useEffect(() => {
		classroomId && getStudentData();
	}, [filterStudentData, classroomId]);

	/**
	 * Method used for show student delete modal
	 * @param data
	 */
	const deleteStudentModal = useCallback((data: StudentObj) => {
		setEditData(data);
		setIsDeleteStudentModal(true);
	}, []);

	/**
	 * Function for Student delete API call
	 */
	const deleteStudentAPI = () => {
		setIsLoadStudent(true);
		APIService.deleteData(`${URL_PATHS.student}/${editData?.uuid}`)
			.then((response: AxiosResponse<ISuccessResponse<object>>) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getStudentData();
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setIsLoadStudent(false));
	};

	/**
	 * Method used for delete student data
	 */
	const deleteStudentData = useCallback(() => {
		deleteStudentAPI();
		setIsDeleteStudentModal(false);
		setEditData(null);
	}, [isDeleteStudentModal]);

	/**
	 * Method used for show student change status modal
	 * @param data
	 */
	const changeStudentStatusModal = useCallback((data: StudentObj) => {
		setEditData(data);
		setIsChangeStatusModal(true);
	}, []);

	/**
	 * Function for Student chnage status API call
	 * @param value: true or false
	 */
	const changeStudentStatusAPI = (value: boolean) => {
		setIsLoadStudent(true);
		APIService.patchData(`${URL_PATHS.student}/${endPoint.status}`, {
			childId: editData?.uuid,
			isActive: value,
		})
			.then((response: AxiosResponse<ISuccessResponse<object>>) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getStudentData();
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setIsLoadStudent(false));
	};

	/**
	 * Method used for change status of student
	 */
	const changeStudentStatus = useCallback(() => {
		const data = editData?.isActive;
		changeStudentStatusAPI(!data);
		setIsChangeStatusModal(false);
		setEditData(null);
	}, [isChangeStatusModal]);

	/**
	 * Method used for close modal
	 */
	const onCloseHandler = useCallback(() => {
		setIsDeleteStudentModal(false);
		setIsChangeStatusModal(false);
		setIsShownMoveModal(false);
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
	 * Method used for on Pagination Change.
	 * @param event
	 */
	const handleStudentPageClick = useCallback(
		(event: { selected: number }) => {
			setFilterStudentData({ ...filterStudentData, page: event.selected + 1 });
		},
		[filterStudentData]
	);

	useEffect(() => {
		if (location.state) {
			setSchoolId(location.state?.schoolId);
			setTeacherId(location.state?.teacherId);
			setClassroomId(location.state?.classId);
		}
	}, [location.state]);

	/**
	 * @returns Method is used to get the school list data from api
	 */
	const getSchoolDataForStudentList = useCallback(() => {
		setIsLoadStudent(true);
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
			.finally(() => setIsLoadStudent(false));
	}, []);

	useEffect(() => {
		if (schoolAdmin?.adminData) {
			setSchoolData([{ name: schoolAdmin?.adminData.school.schoolName, key: schoolAdmin?.adminData.school.uuid }]);
			setSchoolId(schoolData[0]?.key as string);
		} else {
			getSchoolDataForStudentList();
		}
	}, [schoolAdmin?.adminData && schoolId]);

	/**
	 * @returns Method is used to get the school list data from api
	 */
	const getTeacherDataForStudentList = useCallback(() => {
		setIsLoadStudent(true);
		APIService.getData(`${URL_PATHS.teacher}?limit=-1&schoolId=${schoolId}`)
			.then((response: AxiosResponse<ISuccessResponse<TeacerData>>) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data?.rows.map((item: { user: { teacherFirstName: string; teacherLastName: string }; uuid: string }) => {
						data.push({ name: `${item?.user.teacherFirstName} ${item.user.teacherLastName || ''}`, key: item?.uuid });
					});
					setTeacherData(data);
					if (!location.state) {
						setTeacherId(data[0]?.key as string);
					}
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setIsLoadStudent(false));
	}, [schoolId]);

	useEffect(() => {
		if (schoolAdmin.adminData?.teacherUUID) {
			setTeacherData([{ name: schoolAdmin?.adminData?.user.teacherName, key: schoolAdmin?.adminData?.teacherUUID }]);
			setTeacherId(teacherData[0]?.key as string);
		} else {
			schoolId && getTeacherDataForStudentList();
			setClassroomData([]);
		}
	}, [schoolId]);

	/**
	 * @returns Method is used to get the school list data from api
	 */
	const getClassroomDataForStudentList = useCallback(() => {
		setIsLoadStudent(true);
		APIService.getData(`${URL_PATHS.classroom}?limit=-1&teacherId=${teacherId}`)
			.then((response: AxiosResponse<ISuccessResponse<ClassroomData>>) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data?.rows.map((item: { name: string; uuid: string }) => {
						data.push({ name: item?.name, key: item?.uuid });
					});
					setClassroomData(data);
					if (!location.state) {
						setClassroomId(data[0]?.key as string);
					}
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setIsLoadStudent(false));
	}, [teacherId]);

	useEffect(() => {
		teacherId && getClassroomDataForStudentList();
	}, [teacherId]);

	/**
	 * Method used for change dropdown for page limit
	 * @param e
	 */
	const onStudentPageDrpSelect = useCallback(
		(e: string) => {
			setFilterStudentData({ ...filterStudentData, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterStudentData]
	);

	/**
	 * @returns Method is used to handle the onchange of school dropdown
	 * @param e
	 */
	const handleChangeSchoolId = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			navigate(`/${ROUTES.app}/${ROUTES.student}/${ROUTES.list}`, { replace: true });
			setSchoolId(e.target.value);
			setTeacherId('');
			setClassroomId('');
		},
		[schoolId]
	);

	/**
	 * @returns Method is used to handle the onchange of school dropdown
	 * @param e
	 */
	const handleChangeTeacherId = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setTeacherId(e.target.value);
			setClassroomId('');
		},
		[teacherId]
	);

	/**
	 * @returns Method is used to handle the onchange of school dropdown
	 * @param e
	 */
	const handleChangeClassroomId = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setClassroomId(e.target.value);
		},
		[classroomId]
	);

	/**
	 * Method used for store search value
	 * @param e
	 */
	const handleSearchStudent = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterStudentData({ ...filterStudentData, search: searchTerm, page: DEFAULT_PAGE });
		}, 500),
		[filterStudentData]
	);

	/**
	 * Methos is used to open the move child modal
	 */
	const moveDataModalHandler = useCallback((data: StudentObj) => {
		setEditData(data);
		setIsShownMoveModal(true);
	}, []);

	/**
	 * Method used for navigate to the view page
	 * @param uuid
	 */
	const navigateToViewPage = (uuid: string) => {
		navigate(`/${ROUTES.app}/${ROUTES.student}/${ROUTES.list}/viewStudent/${uuid}`);
	};
	return (
		<div>
			{isLoadStudent && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<UsersAlt className='inline-block mr-2 text-primary' /> Student List
					</h6>
					<RoleBaseGuard permissions={[permissionsArray.CHILD_MANAGEMENT.AddAccess]}>
						<Link className='btn btn-primary btn-large' to='addStudent'>
							<PlusCircle className='mr-1' /> Add New
						</Link>
					</RoleBaseGuard>
				</div>
				<div className='p-3 w-full'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-x-4 mb-3'>
						<Dropdown label='Select school' placeholder='Select school' name={'schoolId'} onChange={handleChangeSchoolId} value={schoolId} options={schoolData} id={'schoolId'} disabled={!!schoolAdmin?.adminData} required />
						<Dropdown label='Select teacher' placeholder='Select teacher' name={'teacherId'} onChange={handleChangeTeacherId} value={teacherId} options={teacherData} id={'teacherId'} disabled={!!schoolAdmin.adminData?.teacherUUID} required />
						<Dropdown label='Select classroom' placeholder='Select classroom' name={'classroomId'} onChange={handleChangeClassroomId} value={classroomId} options={classroomData} id={'classroomId'} required />
					</div>
					<div className='flex flex-col md:flex-row md:items-center justify-between mb-3'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleSearchStudent} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onStudentPageDrpSelect} value={filterStudentData.limit} />
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
								{studentData?.rows?.map((data, index: number) => {
									return (
										<tr
											key={data.uuid}
											className='cursor-pointer'
											onClick={() => {
												navigateToViewPage(data?.children?.uuid);
											}}
										>
											<th scope='row' className='w-10 text-center'>
												{index + 1}
											</th>
											<td className='font-medium'>{data?.children?.childFirstName || ''}</td>
											<td className='font-medium'>{data?.children?.childLastName || ''}</td>
											<td>{data?.children?.childId}</td>
											<td>
												{data?.children?.parent?.firstName} {data?.children?.parent?.lastName}
											</td>
											<td className='w-28 text-center'>{data.children.isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
											<td className='cursor-default' onClick={rowClickHandler}>
												<div className='flex justify-center items-center'>
													<button className='btn btn-default mx-1' title='Move Record' onClick={() => moveDataModalHandler(data.children)} disabled={!classroomId}>
														<ArrowRight />
													</button>
													<RoleBaseGuard permissions={[permissionsArray.CHILD_MANAGEMENT.EditAccess]}>
														<Link className='btn btn-default mx-1' to={`editStudent/${data?.children?.uuid}`} title='Edit Record'>
															<Pencil />
														</Link>
													</RoleBaseGuard>
													<RoleBaseGuard permissions={[permissionsArray.CHILD_MANAGEMENT.DeleteAccess]}>
														<DeleteButton data={data.children} isDeleteStatusModal={deleteStudentModal} />
													</RoleBaseGuard>
													<RoleBaseGuard permissions={[permissionsArray.CHILD_MANAGEMENT.ChangeStatusAccess]}>
														<StatusButton data={data.children} isChangeStatusModal={changeStudentStatusModal} status={`${data.children.isActive}`} checked={data.children.isActive} />
													</RoleBaseGuard>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!studentData?.count && <p className='text-center'>No Student Found</p>}
					</div>
					<Pagination length={studentData?.count ?? 0} onSelect={handleStudentPageClick} limit={filterStudentData.limit} />
				</div>
			</div>
			{isChangeStatusModal && <ChangeStatus onClose={onCloseHandler} changeStatus={changeStudentStatus} />}
			{isDeleteStudentModal && <DeleteModel onClose={onCloseHandler} deleteData={deleteStudentData} />}
			{isShownMoveModal && <MoveChildData schoolId={schoolId} onSubmit={getStudentData} onClose={onCloseHandler} classId={classroomId} childId={`${editData?.uuid}`} />}
		</div>
	);
};
export default Student;
