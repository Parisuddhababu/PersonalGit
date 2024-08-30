import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import { Errors } from '@config/errors';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { ArrowSmallLeft, UsersAlt } from '@components/icons';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { CHARACTERS_LIMIT, CHILD_GENDER, CHILD_LANGUAGE, ROUTES } from '@config/constant';
import { stringNotRequired, stringRequired, stringTrim } from '@config/validations';
import Dropdown from '@components/dropdown/Dropdown';
import { useNavigate, useParams } from 'react-router-dom';
import { DropdownOptionType } from 'src/types/component';
import { CreateStudentData, StudentGetData, UpdateStudentData } from 'src/types/student';
import { dateFormat, downloadCSVFile } from '@utils/helpers';
import CheckBox from '@components/checkbox/CheckBox';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import moment from 'moment';
import ImportChildData from './importChild';
import { AxiosError, AxiosResponse } from 'axios';
import { IErrorResponse, ISuccessResponse } from 'src/types/common';
import { SchoolData } from 'src/types/schools';

enum FieldNames {
	schoolId = 'schoolId',
	teacherId = 'teacherId',
	classRoomId = 'classRoomId',
	parentEmail = 'parentEmail',
	parentFirstName = 'parentFirstName',
	parentLastName = 'parentLastName',
	childFirstName = 'childFirstName',
	childLastName = 'childLastName',
	childDOB = 'childDOB',
	childGender = 'childGender',
	childLanguage = 'childLanguage',
}

const AddEditStudent = () => {
	const schoolAdminData = localStorage.getItem('userDetails');
	const schoolAdmin = schoolAdminData && JSON.parse(schoolAdminData);
	const params = useParams();
	const navigate = useNavigate();
	const [isLoadStudent, setIsLoadStudent] = useState<boolean>(false);
	const [schoolData, setSchoolData] = useState<DropdownOptionType[]>([]);
	const [teacherData, setTeacherData] = useState<DropdownOptionType[]>([]);
	const [classroomData, setClassroomData] = useState<DropdownOptionType[]>([]);
	const [exportChild, setExportChild] = useState<boolean>(true);
	const [isShownImportModal, setIsShownImportModal] = useState<boolean>(false);
	const [schoolId, setSchoolId] = useState<string>('');
	const [teacherId, setTeacherId] = useState<string>('');
	const [classId, setClassId] = useState<string>('');

	const maxDate = () => {
		const today = new Date();
		return today;
	};

	const initialValues: CreateStudentData = {
		[FieldNames.schoolId]: '',
		[FieldNames.teacherId]: '',
		[FieldNames.classRoomId]: '',
		[FieldNames.parentEmail]: '',
		[FieldNames.parentFirstName]: '',
		[FieldNames.parentLastName]: '',
		[FieldNames.childFirstName]: '',
		[FieldNames.childLastName]: '',
		[FieldNames.childDOB]: '',
		[FieldNames.childGender]: '',
		[FieldNames.childLanguage]: '',
	};

	/**
	 * Method is used to fetch the student details by id
	 */
	const getStudentDataById = () => {
		if (params?.studentId || params?.viewId) {
			setIsLoadStudent(true);
			APIService.getData(`${URL_PATHS.student}/${params?.studentId ?? params?.viewId}`)
				.then((response: AxiosResponse<ISuccessResponse<StudentGetData>>) => {
					if (response.status === ResponseCode.success) {
						const { data } = response.data;
						formik.setFieldValue(FieldNames.parentEmail, data?.parent?.email);
						formik.setFieldValue(FieldNames.parentFirstName, data?.parent?.firstName);
						formik.setFieldValue(FieldNames.parentLastName, data?.parent?.lastName);
						formik.setFieldValue(FieldNames.childFirstName, data?.firstName);
						formik.setFieldValue(FieldNames.childLastName, data?.lastName);
						formik.setFieldValue(FieldNames.childDOB, moment(data?.birthDate).toDate());
						formik.setFieldValue(FieldNames.childLanguage, data?.language);
						formik.setFieldValue(FieldNames.childGender, data?.gender);
						setSchoolId(data?.school?.uuid);
						setTeacherId(data?.teacher?.uuid);
						setClassId(data?.classroom?.uuid);
					}
				})
				.catch((err: AxiosError<IErrorResponse>) => {
					toast.error(err?.response?.data.message);
				})
				.finally(() => setIsLoadStudent(false));
		}
	};

	useEffect(() => {
		getStudentDataById();
	}, []);

	/**
	 * @returns Method used for get validation for add/edit student
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.schoolId]: params?.studentId ? stringNotRequired() : stringRequired(Errors.PLEASE_SELECT_SCHOOL_ID),
			[FieldNames.teacherId]: params?.studentId ? stringNotRequired() : stringRequired(Errors.PLEASE_SELECT_TEACHER_ID),
			[FieldNames.classRoomId]: params?.studentId ? stringNotRequired() : stringRequired(Errors.PLEASE_SELECT_CLASSROOM_ID),
			[FieldNames.parentEmail]: Yup.string().trim().email(Errors.PLEASE_ENTER_VALID_EMAIL).required(Errors.PLEASE_ENTER_PARENT_EMAIL),
			[FieldNames.parentFirstName]: stringTrim(Errors.PLEASE_ENTER_PARENT_FIRST_NAME).max(CHARACTERS_LIMIT.limit, Errors.MAXIMUM_LIMIT_UPTO_20_CHARACTERS),
			[FieldNames.parentLastName]: stringTrim(Errors.PLEASE_ENTER_PARENT_LAST_NAME).max(CHARACTERS_LIMIT.limit, Errors.MAXIMUM_LIMIT_UPTO_20_CHARACTERS),
			[FieldNames.childFirstName]: stringTrim(Errors.PLEASE_ENTER_CHILD_FIRST_NAME).max(CHARACTERS_LIMIT.limit, Errors.MAXIMUM_LIMIT_UPTO_20_CHARACTERS),
			[FieldNames.childLastName]: stringTrim(Errors.PLEASE_ENTER_CHILD_LAST_NAME).max(CHARACTERS_LIMIT.limit, Errors.MAXIMUM_LIMIT_UPTO_20_CHARACTERS),
			[FieldNames.childDOB]: stringRequired(Errors.PLEASE_ENTER_CHILD_DOB).nullable(),
			[FieldNames.childGender]: stringRequired(Errors.PLEASE_SELECT_GENDER),
			[FieldNames.childLanguage]: stringRequired(Errors.PLEASE_SELECT_LANGUAGE),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updateStudent: UpdateStudentData = {
				[FieldNames.parentFirstName]: values.parentFirstName,
				[FieldNames.parentLastName]: values.parentLastName,
				[FieldNames.childFirstName]: values.childFirstName,
				[FieldNames.childLastName]: values.childLastName,
				[FieldNames.childDOB]: dateFormat(values.childDOB),
				[FieldNames.childGender]: values.childGender,
				[FieldNames.childLanguage]: values.childLanguage,
			};
			if (params?.studentId) {
				setIsLoadStudent(true);
				APIService.patchData(`${URL_PATHS.student}/${params?.studentId}`, updateStudent)
					.then((response: AxiosResponse<ISuccessResponse<object>>) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							navigateToStudentList();
						}
					})
					.catch((err: AxiosError<IErrorResponse>) => {
						toast.error(err?.response?.data?.message);
					})
					.finally(() => setIsLoadStudent(false));
			} else {
				setIsLoadStudent(true);
				APIService.postData(URL_PATHS.parent, { ...values, childDOB: dateFormat(values.childDOB) })
					.then((response: AxiosResponse<ISuccessResponse<string>>) => {
						if (response.status === ResponseCode.success) {
							exportChild && downloadCSVFile(response.data.data);
							toast.success(response?.data?.message);
							formik.resetForm();
							navigate(`/${ROUTES.app}/${ROUTES.student}/${ROUTES.list}`, { state: { schoolId: values.schoolId, teacherId: values.teacherId, classId: values.classRoomId } });
						}
					})
					.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data?.message))
					.finally(() => setIsLoadStudent(false));
			}
		},
	});

	/**
	 * @returns Method used to set error for student form fields.
	 */
	const getError = (fieldName: keyof CreateStudentData) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	/**
	 * @returns Method used to redirect to the student listing page
	 */
	const navigateToStudentList = useCallback(() => {
		if (params.studentId || params.viewId) {
			if (schoolId && teacherId && classId) {
				navigate(`/${ROUTES.app}/${ROUTES.student}/${ROUTES.list}`, { state: { schoolId, teacherId, classId } });
			}
		} else {
			navigate(`/${ROUTES.app}/${ROUTES.student}/${ROUTES.list}`);
		}
	}, [params.studentId, params.viewId, schoolId, teacherId, classId]);

	/**
	 * @returns Method is used to get the school list data from api
	 */
	const getSchoolDataForStudentAdd = useCallback(() => {
		APIService.getData(`${URL_PATHS.schools}?limit=-1&isActive=true`)
			.then((response: AxiosResponse<ISuccessResponse<SchoolData>>) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data?.rows.map((item: { schoolName: string; uuid: string }) => {
						data.push({ name: item?.schoolName, key: item?.uuid });
					});
					setSchoolData(data);
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message));
	}, []);

	useEffect(() => {
		if (schoolAdmin?.adminData) {
			setSchoolData([{ name: schoolAdmin?.adminData.school.schoolName, key: schoolAdmin?.adminData.school.uuid }]);
			formik.setFieldValue(FieldNames.schoolId, schoolAdmin?.adminData.school.uuid);
		} else {
			getSchoolDataForStudentAdd();
		}
	}, []);

	/**
	 * @returns Method is used to get the teacher list data from api
	 */
	const getTeacherDataForStudentAdd = useCallback(() => {
		APIService.getData(`${URL_PATHS.teacher}?limit=-1&isActive=true&schoolId=${formik.values.schoolId}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data?.rows.map((item: { user: { teacherFirstName: string; teacherLastName: string }; uuid: string }) => {
						data.push({ name: `${item?.user.teacherFirstName} ${item.user.teacherLastName || ''}`, key: item?.uuid });
					});
					setTeacherData(data);
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message));
	}, [formik.values.schoolId]);

	useEffect(() => {
		if (schoolAdmin.adminData?.teacherUUID) {
			setTeacherData([{ name: schoolAdmin?.adminData?.user.teacherName, key: schoolAdmin?.adminData?.teacherUUID }]);
			formik.setFieldValue(FieldNames.teacherId, schoolAdmin?.adminData?.teacherUUID);
		} else {
			formik.values.schoolId && getTeacherDataForStudentAdd();
		}
	}, [formik.values.schoolId]);

	/**
	 * @returns Method is used to get the classroom list data from api
	 */
	const getClassroomDataForStudentAdd = useCallback(() => {
		APIService.getData(`${URL_PATHS.classroom}?limit=-1&isActive=true&teacherId=${formik.values.teacherId}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data?.rows.map((item: { name: string; uuid: string }) => {
						data.push({ name: item?.name, key: item?.uuid });
					});
					setClassroomData(data);
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message));
	}, [formik.values.teacherId]);

	useEffect(() => {
		formik.values.teacherId && getClassroomDataForStudentAdd();
	}, [formik.values.teacherId]);

	useEffect(() => {
		!params.studentId && !schoolAdmin.adminData && formik.setFieldValue(FieldNames.teacherId, '');
	}, [formik.values.schoolId]);

	useEffect(() => {
		!params.studentId && formik.setFieldValue(FieldNames.classRoomId, '');
	}, [formik.values.schoolId, formik.values.teacherId]);

	/**
	 * Methos is used to dowwnload csv file
	 */
	const downloadTemplate = useCallback(() => {
		window.location.href = process.env.REACT_APP_IMPORT_SAMPLE_FILE ?? '';
	}, []);

	/**
	 * Methos is used to open the import modal
	 */
	const importDataModalHandler = useCallback(() => {
		setIsShownImportModal(true);
	}, []);

	/**
	 * Methos is used to close the import modal
	 */
	const onCloseImportHandler = useCallback(() => {
		setIsShownImportModal(false);
	}, []);

	return (
		<div>
			{isLoadStudent && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={navigateToStudentList} title='Back to students'>
							<ArrowSmallLeft />
						</Button>
						<UsersAlt className='inline-block mr-2 text-primary' />
						{!params.viewId ? <span>{params.studentId ? 'Edit' : 'Add'} Student</span> : <span>Student Details</span>}
					</h6>
					{!params.studentId && !params.viewId && (
						<div>
							<Button className='btn-default mr-2' onClick={downloadTemplate}>
								Download Template
							</Button>
							<Button className='btn-primary' onClick={importDataModalHandler}>
								Import Data
							</Button>
						</div>
					)}
				</div>
				<form className='p-3' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-2'>
							{!params.studentId && !params.viewId && (
								<div className='mb-4'>
									<Dropdown label='School' placeholder='Select school' name={FieldNames.schoolId} onChange={formik.handleChange} value={formik.values.schoolId} options={schoolData} id={FieldNames.schoolId} error={getError(FieldNames.schoolId)} required />
								</div>
							)}
							{!params.studentId && !params.viewId && (
								<div className='mb-4'>
									<Dropdown label='Teacher' placeholder='Select teacher' name={FieldNames.teacherId} onChange={formik.handleChange} value={formik.values.teacherId} options={teacherData} id={FieldNames.teacherId} error={getError(FieldNames.teacherId)} required />
								</div>
							)}
							{!params.studentId && !params.viewId && (
								<div className='mb-4'>
									<Dropdown label='Classroom' placeholder='Select classroom' name={FieldNames.classRoomId} onChange={formik.handleChange} value={formik.values.classRoomId} options={classroomData} id={FieldNames.classRoomId} error={getError(FieldNames.classRoomId)} required />
								</div>
							)}
							<div className='mb-4'>
								<TextInput placeholder='Parent email' name={FieldNames.parentEmail} onChange={formik.handleChange} label='Parent email' value={formik.values.parentEmail} error={getError(FieldNames.parentEmail)} disabled={!!params.viewId || !!params.studentId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Parent first name' name={FieldNames.parentFirstName} onChange={formik.handleChange} label='Parent first name' value={formik.values.parentFirstName} error={getError(FieldNames.parentFirstName)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Parent last name' name={FieldNames.parentLastName} onChange={formik.handleChange} label='Parent last name' value={formik.values.parentLastName} error={getError(FieldNames.parentLastName)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Child first name' name={FieldNames.childFirstName} onChange={formik.handleChange} label='Child first name' value={formik.values.childFirstName} error={getError(FieldNames.childFirstName)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Child last name' name={FieldNames.childLastName} onChange={formik.handleChange} label='Child last name' value={formik.values.childLastName} error={getError(FieldNames.childLastName)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<label htmlFor={FieldNames.childDOB} className='font-bold text-gray-700'>
									Child date of birth <span className='text-error'>*</span>
								</label>
								<Calendar className={`p-inputtext p-component ${formik.touched.childDOB && formik.errors.childDOB ? 'border-error' : ''}`} name={FieldNames.childDOB} value={formik.values.childDOB ? moment(formik.values.childDOB).toDate() : null} onChange={formik.handleChange} placeholder='MM/DD/YYYY' showIcon maxDate={maxDate()} disabled={!!params.viewId} />
								{<p className='text-error mt-2 text-sm'>{getError(FieldNames.childDOB)}</p>}
							</div>
							<div className='mb-4'>
								<Dropdown label='Gender' placeholder='Select gender' name={FieldNames.childGender} onChange={formik.handleChange} value={formik.values.childGender} options={CHILD_GENDER} id={FieldNames.childGender} error={getError(FieldNames.childGender)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<Dropdown label='Child language' placeholder='Select child language' name={FieldNames.childLanguage} onChange={formik.handleChange} value={formik.values.childLanguage} options={CHILD_LANGUAGE} id={FieldNames.childLanguage} error={getError(FieldNames.childLanguage)} disabled={!!params.viewId} required />
							</div>
						</div>
						{!params.studentId && !params.viewId && (
							<CheckBox
								option={[
									{
										value: '',
										checked: exportChild,
										name: 'Export details in CSV',
										onChange() {
											setExportChild((prev) => !prev);
										},
									},
								]}
							/>
						)}
					</div>
					{!params.viewId && (
						<div className='text-end space-x-2'>
							<Button className='btn-primary btn-large w-28 justify-center' type='submit'>
								{params?.studentId ? 'Update' : 'Save'}
							</Button>
							<Button className='btn-default btn-large w-28 justify-center' onClick={navigateToStudentList}>
								Cancel
							</Button>
						</div>
					)}
				</form>
			</div>
			{isShownImportModal && <ImportChildData schoolList={schoolData} onClose={onCloseImportHandler} />}
		</div>
	);
};

export default AddEditStudent;
