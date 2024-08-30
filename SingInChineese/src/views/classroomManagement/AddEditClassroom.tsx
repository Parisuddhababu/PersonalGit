import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import { Errors } from '@config/errors';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { ArrowSmallLeft, ListCheck } from '@components/icons';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { endPoint, ROUTES } from '@config/constant';
import { stringRequired, stringTrim } from '@config/validations';
import Dropdown from '@components/dropdown/Dropdown';
import { useNavigate, useParams } from 'react-router-dom';
import { DropdownOptionType } from 'src/types/component';
import { ClassroomGetData, CreateClassroomrData } from 'src/types/classroom';
import GridView from '@components/gridView';
import { SchoolData, TopicIds } from 'src/types/schools';
import moment from 'moment';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import { dateFormat } from '@utils/helpers';
import { AxiosError, AxiosResponse } from 'axios';
import { IErrorResponse, ISuccessResponse } from 'src/types/common';
import { TeacerData } from 'src/types/teacher';

enum FieldNames {
	schoolId = 'schoolId',
	teacherId = 'teacherId',
	topicIds = 'topicIds',
	name = 'name',
	startDate = 'startDate',
	endDate = 'endDate',
}

const AddEditClassroom = () => {
	const schoolAdminData = localStorage.getItem('userDetails');
	const schoolAdmin = schoolAdminData && JSON.parse(schoolAdminData);
	const params = useParams();
	const navigate = useNavigate();
	const [isLoadClassroom, setIsLoadClassroom] = useState<boolean>(false);
	const [schoolData, setSchoolData] = useState<DropdownOptionType[]>([]);
	const [teacherData, setTeacherData] = useState<DropdownOptionType[]>([]);
	const [topicIds, setTopicIds] = useState<TopicIds>([]);
	const [checked, setChecked] = useState<string[]>([]);
	const [assignedTopics, setAssignedTopics] = useState<string[]>([]);
	const minDate = () => {
		const today = new Date();
		return today;
	};

	const initialValues: CreateClassroomrData = {
		[FieldNames.schoolId]: '',
		[FieldNames.teacherId]: '',
		[FieldNames.topicIds]: [],
		[FieldNames.name]: '',
		[FieldNames.startDate]: '',
		[FieldNames.endDate]: '',
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit classroom
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.schoolId]: stringRequired(Errors.PLEASE_SELECT_SCHOOL_ID),
			[FieldNames.teacherId]: stringRequired(Errors.PLEASE_SELECT_TEACHER_ID),
			[FieldNames.name]: stringTrim(Errors.PLEASE_ENTER_NAME),
			[FieldNames.startDate]: stringRequired(Errors.PLEASE_ENTER_START_DATE).nullable(),
			[FieldNames.endDate]: stringRequired(Errors.PLEASE_ENTER_END_DATE).nullable(),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			if (params?.classId) {
				setIsLoadClassroom(true);
				APIService.putData(`${URL_PATHS.classroom}/${params?.classId}`, { ...values, startDate: dateFormat(values.startDate), endDate: dateFormat(values.endDate) })
					.then((response: AxiosResponse<ISuccessResponse<object>>) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							navigateToClassroomList();
						}
					})
					.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data?.message))
					.finally(() => setIsLoadClassroom(false));
			} else {
				setIsLoadClassroom(true);
				APIService.postData(URL_PATHS.classroom, { ...values, startDate: dateFormat(values.startDate), endDate: dateFormat(values.endDate) })
					.then((response: AxiosResponse<ISuccessResponse<object>>) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							navigate(`/${ROUTES.app}/${ROUTES.classroom}/${ROUTES.list}`, { state: { schoolId: values.schoolId, teacherId: values.teacherId } });
						}
					})
					.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data?.message))
					.finally(() => setIsLoadClassroom(false));
			}
		},
	});

	/**
	 * Method used for setValue from classroom data and get the details of classroom by uuid
	 */
	const fetchClassroomData = () => {
		setIsLoadClassroom(true);
		APIService.getData(`${URL_PATHS.classroom}/${params.classId}`)
			.then((response: AxiosResponse<ISuccessResponse<ClassroomGetData>>) => {
				const data = response?.data.data;
				if (response.status === ResponseCode.success) {
					formik.setFieldValue(FieldNames.schoolId, data?.schoolId);
					formik.setFieldValue(FieldNames.teacherId, data?.teacherId);
					formik.setFieldValue(FieldNames.name, data?.name);
					formik.setFieldValue(FieldNames.startDate, moment(data?.startDate).toDate());
					formik.setFieldValue(FieldNames.endDate, moment(data?.endDate).toDate());
					const topicData: string[] = [];
					data?.topics.map((data: { uuid: string }) => {
						topicData.push(data.uuid);
					});
					setChecked(topicData);
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data?.message))
			.finally(() => setIsLoadClassroom(false));
	};

	/**
	 * Method used to fetch the topics data for class
	 */
	const fetchTopicsForClass = () => {
		setIsLoadClassroom(true);
		APIService.getData(`${URL_PATHS.classroom}/${endPoint.topics}?schoolId=${params.classId ? params.schoolId : formik.values.schoolId}`)
			.then((response: AxiosResponse<ISuccessResponse<TopicIds>>) => {
				if (response.status === ResponseCode.success) {
					setTopicIds(response?.data.data);
					setIsLoadClassroom(false);
					if (params.classId) {
						fetchClassroomData();
					}
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => {
				toast.error(err?.response?.data.message);
				setIsLoadClassroom(false);
			});
	};

	/**
	 *
	 *@returns Method used for setValue from classroom data and get the details of classroom by uuid
	 */
	useEffect(() => {
		if (!params.classId && !params.viewId ? formik.values.schoolId : params.classId) {
			fetchTopicsForClass();
		}
	}, [!params.classId && !params.viewId && formik.values.schoolId]);

	/**
	 *
	 * @returns Method used to set error for form fields.
	 */
	const getError = (fieldName: keyof CreateClassroomrData) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	/**
	 *
	 * @returns Method used to redirect the page
	 */
	const navigateToClassroomList = useCallback(() => {
		if (params.classId || params.viewId) {
			if (params?.schoolId && params?.teacherId) {
				navigate(`/${ROUTES.app}/${ROUTES.classroom}/${ROUTES.list}`, { state: { schoolId: params?.schoolId, teacherId: params?.teacherId } });
			}
		} else {
			navigate(`/${ROUTES.app}/${ROUTES.classroom}/${ROUTES.list}`);
		}
	}, [params?.schoolId, params?.teacherId]);

	/**
	 * structure for grid view
	 */
	const classroomTopicNodes = topicIds.map((i) => {
		return {
			value: i.uuid,
			label: i.levelName,
			id: `${i.id}`,
			children: i.topics.map((j) => {
				return { value: j.uuid, label: j.topicName };
			}) as { value: string; label: string }[],
		};
	});

	/**
	 *
	 * @param event  to set the topic ids to the api
	 */
	const onChangeClassroomTopicHandler = useCallback(
		(event: string[]) => {
			formik.setFieldValue(FieldNames.topicIds, [...event]);
			setAssignedTopics(event);
		},
		[assignedTopics]
	);

	/**
	 * @returns Method is used to get the school list data from api
	 */
	const getSchoolDataForClassAdd = useCallback(() => {
		APIService.getData(`${URL_PATHS.schools}?limit=-1&isActive=true`)
			.then((response: AxiosResponse<ISuccessResponse<SchoolData>>) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data?.rows.map((item: { schoolName: string; uuid: string }) => {
						data.push({ name: item?.schoolName, key: item?.uuid });
					});
					setSchoolData(data);
					params.schoolId && formik.setFieldValue(FieldNames.schoolId, params.schoolId);
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message));
	}, []);

	/**
	 * @returns Method is used to get the teacher list data from api
	 */
	const getTeacherDataForClassAdd = useCallback(() => {
		APIService.getData(`${URL_PATHS.teacher}?limit=-1&isActive=true&schoolId=${formik.values.schoolId}`)
			.then((response: AxiosResponse<ISuccessResponse<TeacerData>>) => {
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
		if (schoolAdmin?.adminData) {
			setSchoolData([{ name: schoolAdmin?.adminData.school.schoolName, key: schoolAdmin?.adminData.school.uuid }]);
			params.schoolId && formik.setFieldValue(FieldNames.schoolId, params.schoolId);
		} else {
			getSchoolDataForClassAdd();
		}
	}, []);

	useEffect(() => {
		if (schoolAdmin.adminData?.teacherUUID) {
			setTeacherData([{ name: schoolAdmin?.adminData?.user.teacherName, key: schoolAdmin?.adminData?.teacherUUID }]);
			formik.setFieldValue(FieldNames.teacherId, schoolAdmin?.adminData?.teacherUUID);
		} else {
			formik.values.schoolId && getTeacherDataForClassAdd();
		}
	}, [formik.values.schoolId]);

	useEffect(() => {
		!params.classId && !schoolAdmin.adminData && formik.setFieldValue(FieldNames.teacherId, '');
	}, [formik.values.schoolId]);

	return (
		<div>
			{isLoadClassroom && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={navigateToClassroomList} title='Back to classroom'>
							<ArrowSmallLeft />
						</Button>
						<ListCheck className='inline-block mr-2 text-primary' />
						{!params.viewId ? <span>{params.classId ? 'Edit' : 'Add'} Classroom</span> : <span>Classroom Details</span>}
					</h6>
				</div>
				<form className='p-3' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2'>
							<div className='mb-4'>
								<Dropdown label='School' placeholder='Select school' name={FieldNames.schoolId} onChange={formik.handleChange} value={formik.values.schoolId} options={schoolData} id={FieldNames.schoolId} error={getError(FieldNames.schoolId)} disabled={!!params.viewId || !!params.classId} required />
							</div>
							<div className='mb-4'>
								<Dropdown label='Teacher' placeholder='Select teacher' name={FieldNames.teacherId} onChange={formik.handleChange} value={formik.values.teacherId} options={teacherData} id={FieldNames.teacherId} error={getError(FieldNames.teacherId)} disabled={!!params.viewId || !!params.classId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Name' name={FieldNames.name} onChange={formik.handleChange} label='Name' value={formik.values.name} error={getError(FieldNames.name)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<label htmlFor={FieldNames.startDate} className='font-bold text-gray-700'>
									Start date <span className='text-error'>*</span>
								</label>
								<Calendar className={`p-inputtext p-component ${formik.touched.startDate && formik.errors.startDate ? 'border-error' : ''}`} name={FieldNames.startDate} value={formik.values.startDate ? moment(formik.values.startDate).toDate() : null} onChange={formik.handleChange} placeholder='MM/DD/YYYY' showIcon minDate={moment(formik.values.startDate).toDate() < minDate() && params?.classId ? moment(formik.values.startDate).toDate() : minDate()} maxDate={moment(formik.values.endDate).toDate()} disabled={!!params.viewId} />
								{<p className='text-error mt-2 text-sm'>{getError(FieldNames.startDate)}</p>}
							</div>
							<div className='mb-4'>
								<label htmlFor={FieldNames.endDate} className='font-bold text-gray-700'>
									End date <span className='text-error'>*</span>
								</label>
								<Calendar className={`p-inputtext p-component ${formik.touched.endDate && formik.errors.endDate ? 'border-error' : ''}`} name={FieldNames.endDate} value={formik.values.endDate ? moment(formik.values.endDate).toDate() : null} onChange={formik.handleChange} placeholder='MM/DD/YYYY' showIcon minDate={moment(formik.values.startDate).toDate() ? moment(formik.values.startDate).toDate() : minDate()} disabled={!!params.viewId} />
								{<p className='text-error mt-2 text-sm'>{getError(FieldNames.endDate)}</p>}
							</div>
						</div>
						<div className='mb-4'>
							<label htmlFor={FieldNames.topicIds} className='block text-gray-700 text-sm font-bold mb-0.5'>
								Assign topics
							</label>
							<GridView nodes={classroomTopicNodes} checkedChild={checked} onChangeCheckedChildHandler={onChangeClassroomTopicHandler} columns={6} disable={!!params.viewId} />
						</div>
					</div>
					{!params.viewId && (
						<div className='text-end space-x-2'>
							<Button className='btn-primary btn-large w-28 justify-center' type='submit'>
								{params.classId ? 'Update' : 'Save'}
							</Button>
							<Button className='btn-default btn-large w-28 justify-center' onClick={navigateToClassroomList}>
								Cancel
							</Button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

export default AddEditClassroom;
