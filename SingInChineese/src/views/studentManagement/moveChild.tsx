import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
import { stringRequired } from '@config/validations';
import Dropdown from '@components/dropdown/Dropdown';
import { Class, MoveChild } from 'src/types/student';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import RadioButton from '@components/radiobutton/RadioButton';
import { DropdownOptionType } from 'src/types/component';
import { AxiosError, AxiosResponse } from 'axios';
import { IErrorResponse, ISuccessResponse } from 'src/types/common';

enum FieldNames {
	classRoomId = 'classRoomId',
	childId = 'childId',
	keepData = 'keepData',
}

const MoveChildData = ({ schoolId, onClose, classId, childId, onSubmit }: Class) => {
	const [isLoadStudent, setIsLoadStudent] = useState<boolean>(false);
	const [checkedOption, setCheckedOption] = useState<boolean>(true);
	const [classroomData, setClassroomData] = useState<DropdownOptionType[]>([]);

	const radioOptions = [
		{ name: 'Yes', key: 'true' },
		{ name: 'No', key: 'false' },
	];

	const initialValues: MoveChild = {
		[FieldNames.classRoomId]: '',
		[FieldNames.childId]: '',
		[FieldNames.keepData]: checkedOption,
	};

	/**
	 * @returns Method used for get validation for add/edit student
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.classRoomId]: stringRequired(Errors.PLEASE_SELECT_CLASSROOM_ID),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			setIsLoadStudent(true);
			APIService.putData(`${URL_PATHS.classroom}/move-child`, { ...values, childId: childId, keepData: checkedOption })
				.then((response: AxiosResponse<ISuccessResponse<object>>) => {
					if (response.status === ResponseCode.success) {
						toast.success(response.data.message);
						formik.resetForm();
						onSubmit();
						onClose();
					}
				})
				.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data?.message))
				.finally(() => setIsLoadStudent(false));
		},
	});

	/**
	 * @returns Method is used to get the classroom list data from api
	 */
	const getClassroomDataForMoveChild = useCallback(() => {
		setIsLoadStudent(true);
		APIService.getData(`${URL_PATHS.classroom}?limit=-1&isActive=true&schoolId=${schoolId}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data?.rows.map((item: { name: string; uuid: string }) => {
						data.push({ name: item?.name, key: item?.uuid });
					});
					setClassroomData(data);
				}
			})
			.catch((err) => toast.error(err?.response?.data.message))
			.finally(() => setIsLoadStudent(false));
	}, []);

	useEffect(() => {
		getClassroomDataForMoveChild();
	}, []);

	/**
	 * @returns Method used to set error for student form fields.
	 */
	const getError = (fieldName: keyof MoveChild) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					<h4>Move Child</h4>
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}
				{isLoadStudent && <Loader />}
				<form className='w-[90vw] lg:w-[50vw] xl:w-[35vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 gap-y-2'>
							<div className='mb-4'>
								<Dropdown label='Select classroom' placeholder='Select classroom' name={FieldNames.classRoomId} onChange={formik.handleChange} value={formik.values.classRoomId} options={classroomData} id={FieldNames.classRoomId} error={getError(FieldNames.classRoomId)} disableOption={classId} required />
							</div>
							<div className='mb-4'>
								<RadioButton
									id={FieldNames.keepData}
									label={'Keep previous data'}
									name={FieldNames.keepData}
									onChange={useCallback(
										(e: React.ChangeEvent<HTMLInputElement>) => {
											setCheckedOption(!checkedOption);
											formik.handleChange(e);
										},
										[checkedOption]
									)}
									checked={`${checkedOption}`}
									radioOptions={radioOptions}
									required
								/>
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

export default MoveChildData;
