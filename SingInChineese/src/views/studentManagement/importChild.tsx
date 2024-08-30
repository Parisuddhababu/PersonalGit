import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import { Errors } from '@config/errors';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { Cross } from '@components/icons';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { mixedRequired, stringRequired } from '@config/validations';
import Dropdown from '@components/dropdown/Dropdown';
import { useParams } from 'react-router-dom';
import { DropdownOptionType } from 'src/types/component';
import { ImportChild } from 'src/types/student';
import { exportCsv } from '@utils/helpers';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import { endPoint } from '@config/constant';

enum FieldNames {
	schoolId = 'schoolId',
	teacherId = 'teacherId',
	classRoomId = 'classRoomId',
	file = 'file',
}

type Schools = {
	schoolList: DropdownOptionType[];
	onClose: () => void;
};

const ImportChildData = ({ schoolList, onClose }: Schools) => {
	const schoolAdminData = localStorage.getItem('userDetails');
	const schoolAdmin = schoolAdminData && JSON.parse(schoolAdminData);
	const params = useParams();
	const [isLoadStudent, setIsLoadStudent] = useState<boolean>(false);
	const [teacherData, setTeacherData] = useState<DropdownOptionType[]>([]);
	const [classroomData, setClassroomData] = useState<DropdownOptionType[]>([]);

	const initialValues: ImportChild = {
		[FieldNames.schoolId]: '',
		[FieldNames.teacherId]: '',
		[FieldNames.classRoomId]: '',
		[FieldNames.file]: null,
	};

	/**
	 * @returns Method used for get validation for add/edit student
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.schoolId]: stringRequired(Errors.PLEASE_SELECT_SCHOOL_ID),
			[FieldNames.teacherId]: stringRequired(Errors.PLEASE_SELECT_TEACHER_ID),
			[FieldNames.classRoomId]: stringRequired(Errors.PLEASE_SELECT_CLASSROOM_ID),
			[FieldNames.file]: mixedRequired(Errors.PLEASE_SELECT_CSV_FILE),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			setIsLoadStudent(true);
			const formData = new FormData();
			formData.append('file', values.file as File);
			formData.append('schoolId', values.schoolId);
			formData.append('teacherId', values.teacherId);
			formData.append('classRoomId', values.classRoomId);
			await APIService.postData(`${URL_PATHS.parent}/${endPoint.imports}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
				.then((response) => {
					if (response.status === ResponseCode.success) {
						exportCsv(response.data, 'Student-bulk-import-data');
						toast.success('Data imported successfully.');
						formik.resetForm();
						onClose();
					}
				})
				.catch((err) => {
					if (err?.response.status === 400) {
						exportCsv(err?.response?.data, 'Student-bulk-import-data');
						toast.error('Data imported successfully with some errors. Please check downloaded sheet for errors and student details.');
						formik.resetForm();
						onClose();
					} else {
						toast.error('The uploaded file is not a valid XLS file. Please upload a file in the correct XLS format and try again.');
					}
				})
				.finally(() => setIsLoadStudent(false));
		},
	});

	/**
	 * @returns Method used to set error for student form fields.
	 */
	const getError = (fieldName: keyof ImportChild) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	/**
	 * @returns Method is used to get the teacher list data from api
	 */
	const getTeacherData = useCallback(() => {
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
			.catch((err) => toast.error(err?.response?.data.message));
	}, [formik.values.schoolId]);

	useEffect(() => {
		if (schoolAdmin.adminData?.teacherUUID) {
			setTeacherData([{ name: schoolAdmin?.adminData?.user.teacherName, key: schoolAdmin?.adminData?.teacherUUID }]);
			formik.setFieldValue(FieldNames.teacherId, schoolAdmin?.adminData?.teacherUUID);
		} else {
			formik.values.schoolId && getTeacherData();
		}
	}, [formik.values.schoolId]);

	/**
	 * @returns Method is used to get the classroom list data from api
	 */
	const getClassroomData = useCallback(() => {
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
			.catch((err) => toast.error(err?.response?.data.message));
	}, [formik.values.teacherId]);

	useEffect(() => {
		formik.values.teacherId && getClassroomData();
	}, [formik.values.teacherId]);

	useEffect(() => {
		!params.studentId && !schoolAdmin.adminData && formik.setFieldValue(FieldNames.teacherId, '');
	}, [formik.values.schoolId]);

	useEffect(() => {
		!params.studentId && formik.setFieldValue(FieldNames.classRoomId, '');
	}, [formik.values.schoolId, formik.values.teacherId]);

	const handleFileChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file) {
				formik.setFieldValue(FieldNames.file, file);
			}
		},
		[formik]
	);

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					<h4>Import Data</h4>
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}
				{isLoadStudent && <Loader />}
				<form className='w-[90vw] lg:w-[60vw] xl:w-[50vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-2'>
							<div className='mb-4'>
								<Dropdown label='School' placeholder='Select school' name={FieldNames.schoolId} onChange={formik.handleChange} value={formik.values.schoolId} options={schoolList} id={FieldNames.schoolId} error={getError(FieldNames.schoolId)} required />
							</div>
							<div className='mb-4'>
								<Dropdown label='Teacher' placeholder='Select teacher' name={FieldNames.teacherId} onChange={formik.handleChange} value={formik.values.teacherId} options={teacherData} id={FieldNames.teacherId} error={getError(FieldNames.teacherId)} required />
							</div>
							<div className='mb-4'>
								<Dropdown label='Classroom' placeholder='Select classroom' name={FieldNames.classRoomId} onChange={formik.handleChange} value={formik.values.classRoomId} options={classroomData} id={FieldNames.classRoomId} error={getError(FieldNames.classRoomId)} required />
							</div>
							<div className='mb-4 md:col-span-3'>
								<TextInput type='file' accept='.csv' placeholder='File' name={FieldNames.file} onChange={handleFileChange} label='CSV file' error={getError(FieldNames.file)} disabled={!!params.viewId} required />
							</div>
						</div>
					</div>
					<div className={cn(ModelStyle['model__footer'])}>
						<Button className='btn-primary btn-large w-28 justify-center' type='submit'>
							Save
						</Button>
						<Button className='btn-default btn-large w-28 justify-center' onClick={onClose}>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ImportChildData;
