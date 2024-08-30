import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import { Errors } from '@config/errors';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { ArrowSmallLeft, User } from '@components/icons';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { PASSWORD_MAX_LIMIT, ROUTES } from '@config/constant';
import { stringNotRequired, stringRequired, stringTrim } from '@config/validations';
import Dropdown from '@components/dropdown/Dropdown';
import { useNavigate, useParams } from 'react-router-dom';
import { ONLY_NUMBERS, PASSWORD_REGEX } from '@config/regex';
import { CreateTeacherData, TeacherObj, UpdateTeacherData } from 'src/types/teacher';
import { DropdownOptionType } from 'src/types/component';
import { AxiosError, AxiosResponse } from 'axios';
import { IErrorResponse, ISuccessResponse } from 'src/types/common';
import { SchoolData } from 'src/types/schools';

enum FieldNames {
	teacherFirstName = 'teacherFirstName',
	teacherLastName = 'teacherLastName',
	teacherPhoneNumber = 'teacherPhoneNumber',
	schoolId = 'schoolId',
	teacherEmail = 'teacherEmail',
	teacherPassword = 'teacherPassword',
}

const AddEditTeacher = () => {
	const schoolAdminData = localStorage.getItem('userDetails');
	const schoolAdmin = schoolAdminData && JSON.parse(schoolAdminData);
	const params = useParams();
	const navigate = useNavigate();
	const [loaderTeacher, setLoaderTeacher] = useState<boolean>(false);
	const [schoolData, setSchoolData] = useState<DropdownOptionType[]>([]);

	/**
	 * @returns Method is used to get the school list data fromA api
	 */
	const getSchoolDataForTeacherAdd = useCallback(() => {
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
		if (schoolAdmin.adminData) {
			setSchoolData([{ name: schoolAdmin?.adminData.school.schoolName, key: schoolAdmin?.adminData.school.uuid }]);
			formik.setFieldValue(FieldNames.schoolId, schoolAdmin?.adminData.school.uuid);
		} else {
			getSchoolDataForTeacherAdd();
		}
	}, []);

	/**
	 *
	 *@returns Method used for setValue from teacher data and get the details of teacher by uuid
	 */
	useEffect(() => {
		if (params?.teacherId || params?.viewId) {
			setLoaderTeacher(true);
			APIService.getData(`${URL_PATHS.teacher}/${params?.teacherId ?? params?.viewId}`)
				.then((response: AxiosResponse<ISuccessResponse<TeacherObj>>) => {
					const data = response?.data.data;
					if (response.status === ResponseCode.success) {
						formik.setFieldValue(FieldNames.teacherFirstName, data?.user?.teacherFirstName);
						formik.setFieldValue(FieldNames.teacherLastName, data?.user?.teacherLastName);
						formik.setFieldValue(FieldNames.teacherPhoneNumber, data?.user?.teacherPhoneNumber);
						formik.setFieldValue(FieldNames.schoolId, data?.school.uuid);
						formik.setFieldValue(FieldNames.teacherEmail, data?.user?.teacherEmail);
					}
				})
				.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data?.message))
				.finally(() => setLoaderTeacher(false));
		}
	}, []);

	const initialValues: CreateTeacherData = {
		[FieldNames.teacherFirstName]: '',
		[FieldNames.teacherLastName]: '',
		[FieldNames.teacherPhoneNumber]: '',
		[FieldNames.schoolId]: '',
		[FieldNames.teacherEmail]: '',
		[FieldNames.teacherPassword]: '',
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit teacher
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.teacherFirstName]: stringTrim(Errors.PLEASE_ENTER_FIRST_NAME),
			[FieldNames.teacherLastName]: stringTrim(Errors.PLEASE_ENTER_LAST_NAME),
			[FieldNames.teacherPhoneNumber]: Yup.string().matches(ONLY_NUMBERS, Errors.PHONE_NUMBER_MUST_BE_NUMBERS).max(15, Errors.PHONE_NUMBER_SHOULD_NOT_EXCEED),
			[FieldNames.schoolId]: stringRequired(Errors.PLEASE_SELECT_SCHOOL_ID),
			[FieldNames.teacherEmail]: Yup.string().email(Errors.PLEASE_ENTER_VALID_EMAIL).required(Errors.PLEASE_ENTER_YOUR_REGISTERED_EMAIL),
			[FieldNames.teacherPassword]: !params.teacherId ? Yup.string().required(Errors.PLEASE_ENTER_PASSWORD).matches(PASSWORD_REGEX, Errors.PASSWORD_MUST_CONTAIN_COMBINATION_CHARACTERS).max(PASSWORD_MAX_LIMIT, Errors.PASSWORD_CHARACTERS_LIMIT) : stringNotRequired(),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updateTeacher: UpdateTeacherData = {
				teacherFirstName: values.teacherFirstName,
				teacherLastName: values.teacherLastName,
				teacherPhoneNumber: values.teacherPhoneNumber,
			};
			if (params?.teacherId) {
				setLoaderTeacher(true);
				APIService.patchData(`${URL_PATHS.teacher}/${params?.teacherId}`, updateTeacher)
					.then((response: AxiosResponse<ISuccessResponse<object>>) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							navigateToTeacherList();
						}
					})
					.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data?.message))
					.finally(() => setLoaderTeacher(false));
			} else {
				setLoaderTeacher(true);
				APIService.postData(URL_PATHS.teacher, values)
					.then((response: AxiosResponse<ISuccessResponse<object>>) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							navigateToTeacherList();
						}
					})
					.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data?.message))
					.finally(() => setLoaderTeacher(false));
			}
		},
	});

	/**
	 *
	 * @returns Method used to set error for form fields.
	 */
	const getError = (fieldName: keyof CreateTeacherData) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	/**
	 *
	 * @returns Method used to redirect the page
	 */
	const navigateToTeacherList = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.teacher}/${ROUTES.list}/${formik.values.schoolId}`);
	}, [formik]);

	/**
	 *
	 * @returns Method used to redirect the page to classroom listing
	 */
	const navigateToClassRooms = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.classroom}/${ROUTES.list}`, { state: { schoolId: formik.values.schoolId, teacherId: params?.teacherId ?? params?.viewId } });
	}, [formik.values.schoolId, params?.teacherId, params?.viewId]);

	return (
		<div>
			{loaderTeacher && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={navigateToTeacherList} title='Back to teachers'>
							<ArrowSmallLeft />
						</Button>
						<User className='inline-block mr-2 text-primary' />
						{!params.viewId ? <span>{params.teacherId ? 'Edit' : 'Add'} Teacher</span> : <span>Teacher Details</span>}
					</h6>
					{(params.teacherId || params.viewId) && (
						<div>
							<Button className='btn-primary' onClick={navigateToClassRooms}>
								View Classrooms
							</Button>
						</div>
					)}
				</div>
				<form className='p-3' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2'>
							<div className='mb-4'>
								<TextInput placeholder='First name' name={FieldNames.teacherFirstName} onChange={formik.handleChange} label='First name' value={formik.values.teacherFirstName} error={getError(FieldNames.teacherFirstName)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Last name' name={FieldNames.teacherLastName} onChange={formik.handleChange} label='Last name' value={formik.values.teacherLastName} error={getError(FieldNames.teacherLastName)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Phone number' name={FieldNames.teacherPhoneNumber} onChange={formik.handleChange} label='Phone number' value={formik.values.teacherPhoneNumber} error={getError(FieldNames.teacherPhoneNumber)} disabled={!!params.viewId} />
							</div>
							<div className='mb-4'>
								<Dropdown label='School' placeholder='Select school' name={FieldNames.schoolId} onChange={formik.handleChange} value={formik.values.schoolId} options={schoolData} id='schoolId' error={getError(FieldNames.schoolId)} disabled={!!params.viewId || !!params.teacherId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Email' name={FieldNames.teacherEmail} onChange={formik.handleChange} label='Email' value={formik.values.teacherEmail} error={getError(FieldNames.teacherEmail)} disabled={!!params.viewId || !!params.teacherId} required />
							</div>
							{!params.teacherId && !params.viewId && (
								<div className='mb-4'>
									<TextInput type='password' placeholder='Password' name={FieldNames.teacherPassword} onChange={formik.handleChange} label='Password' value={formik.values.teacherPassword} error={getError(FieldNames.teacherPassword)} disabled={!!params.viewId || !!params.teacherId} required />
								</div>
							)}
						</div>
					</div>
					{!params.viewId && (
						<div className='text-end space-x-2'>
							<Button className='btn-primary btn-large w-28 justify-center' type='submit'>
								{params.teacherId ? 'Update' : 'Save'}
							</Button>
							<Button className='btn-default btn-large w-28 justify-center' onClick={navigateToTeacherList}>
								Cancel
							</Button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

export default AddEditTeacher;
