import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/Button';
import { Errors } from '@config/errors';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { ObjectShape } from 'yup/lib/object';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { Cross } from '@components/icons';
import { Loader } from '@components/index';
import { CreateStarManagement, StartEditProps } from 'src/types/settings';
import { endPoint } from '@config/constant';
import { numberRequired, stringNoSpecialChar } from '@config/validations';

enum FieldNames {
	moduleName = 'moduleName',
	starCount = 'starCount',
}

const AddEditStar = ({ onSubmit, onClose, editData }: StartEditProps) => {
	const [loaderStars, setLoaderStars] = useState<boolean>(false);

	/**
	 *@returns Method used for setValue from exam data and get the details of exam by uuid
	 */
	useEffect(() => {
		if (editData) {
			setLoaderStars(true);
			APIService.getData(`${URL_PATHS.starManagement}/${endPoint.getSingle}/${editData?.uuid}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						formik.setFieldValue(FieldNames.moduleName, editData?.moduleName);
						formik.setFieldValue(FieldNames.starCount, editData?.starCount);
					} else {
						toast.error(response?.data?.message);
					}
					setLoaderStars(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoaderStars(false);
				});
		}
	}, []);

	const initialValues: CreateStarManagement = {
		[FieldNames.moduleName]: '',
		[FieldNames.starCount]: 5,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit exam
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.moduleName]: stringNoSpecialChar(Errors.PLEASE_ENTER_MODULE_NAME),
			[FieldNames.starCount]: numberRequired(Errors.PLEASE_ENTER_NUMBER_OF_STARS),
		};
		return Yup.object<ObjectShape>(obj);
	};

	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			if (editData) {
				setLoaderStars(true);
				APIService.patchData(`${URL_PATHS.starManagement}/${endPoint.update}`, {
					moduleUUID: editData.uuid,
					[FieldNames.moduleName]: values.moduleName.trim(),
					[FieldNames.starCount]: values.starCount,
				})
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						} else {
							toast.error(response?.data?.message);
						}
						setLoaderStars(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderStars(false);
					});
			} else {
				setLoaderStars(true);
				APIService.postData(`${URL_PATHS.starManagement}/${endPoint.create}`, {
					[FieldNames.moduleName]: values.moduleName.trim(),
					[FieldNames.starCount]: values.starCount,
				})
					.then((response) => {
						if (response.status === ResponseCode.created || ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						} else {
							toast.error(response?.data?.message);
						}
						setLoaderStars(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderStars(false);
					});
			}
		},
	});

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					<h4>{editData !== null ? 'Edit' : 'Add'} Advertising Star</h4>
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}
				{loaderStars && <Loader />}
				<form className='w-[90vw] md:w-[30vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1'>
							<div className='mb-4'>
								<TextInput placeholder='Module name' disabled={!!editData} name={FieldNames.moduleName} onChange={formik.handleChange} label='Module Name' value={formik.values.moduleName} error={formik.errors.moduleName && formik.touched.moduleName ? formik.errors.moduleName : ''} />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Star count' name={FieldNames.starCount} onChange={formik.handleChange} label='Star Count' value={formik.values.starCount} error={formik.errors.starCount && formik.touched.starCount ? formik.errors.starCount : ''} type='number' max={10} />
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

export default AddEditStar;
