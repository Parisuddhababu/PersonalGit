import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import { Errors } from '@config/errors';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { Cross } from '@components/icons';
import { AddEditLevelData, CreateLevelData } from 'src/types/exam';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { numberRequired, stringNoSpecialChar } from '@config/validations';

enum FieldNames {
	levelNumber = 'levelNumber',
	levelName = 'levelName',
	isForSop = 'isForSop',
}

const AddEditSopLevel = ({ onSubmit, onClose, editData }: AddEditLevelData) => {
	const [loaderSopLevel, setLoaderSopLevel] = useState<boolean>(false);
	/**
	 *@returns Method used for setValue from sop level data and get the details of sop level by uuid
	 */
	useEffect(() => {
		if (editData) {
			setLoaderSopLevel(true);
			APIService.getData(`${URL_PATHS.signOnPlacementLevel}/${editData?.uuid}?isForSop=true`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						formik.setFieldValue(FieldNames.levelNumber, editData?.levelNumber);
						formik.setFieldValue(FieldNames.levelName, editData?.levelName);
					} else {
						toast.error(response?.data?.message);
					}
					setLoaderSopLevel(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoaderSopLevel(false);
				});
		}
	}, []);

	const initialValues: CreateLevelData = {
		[FieldNames.levelNumber]: '',
		[FieldNames.levelName]: '',
		[FieldNames.isForSop]: true,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit sop level
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.levelNumber]: numberRequired(Errors.PLEASE_ENTER_LEVEL_NUMBER),
			[FieldNames.levelName]: stringNoSpecialChar(Errors.PLEASE_ENTER_LEVEL_NAME),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			if (editData) {
				setLoaderSopLevel(true);
				APIService.putData(`${URL_PATHS.signOnPlacementLevel}/${editData.uuid}`, {
					levelNumber: values.levelNumber,
					levelName: values.levelName.trim(),
				})
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoaderSopLevel(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderSopLevel(false);
					});
			} else {
				setLoaderSopLevel(true);
				APIService.postData(URL_PATHS.signOnPlacementLevel, {
					levelNumber: values.levelNumber,
					levelName: values.levelName.trim(),
					isForSop: values.isForSop,
				})
					.then((response) => {
						if (response.status === ResponseCode.created) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoaderSopLevel(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderSopLevel(false);
					});
			}
		},
	});

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					<h4>{editData !== null ? 'Edit' : 'Add'} Level</h4>
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}
				{loaderSopLevel && <Loader />}
				<form className='w-[90vw] md:w-[75vw] lg:w-[60vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-4 gap-y-2'>
							<div className='mb-4'>
								<TextInput type='number' placeholder='level number' name={FieldNames.levelNumber} onChange={formik.handleChange} label='Level Number' value={formik.values.levelNumber} error={formik.errors.levelNumber && formik.touched.levelNumber ? formik.errors.levelNumber : ''} min={1} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='level name' name={FieldNames.levelName} onChange={formik.handleChange} label='Level Name' value={formik.values.levelName} error={formik.errors.levelName && formik.touched.levelName ? formik.errors.levelName : ''} required />
							</div>
						</div>
					</div>
					<div className={cn(ModelStyle['model__footer'])}>
						<Button className='btn-primary btn-large w-28 justify-center' type='submit'>
							{editData !== null ? 'Update' : 'Save'}
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

export default AddEditSopLevel;
