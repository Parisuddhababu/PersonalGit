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
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import { CHARACTERS_LIMIT } from '@config/constant';
import { AddEditCategory, CreateFlashCardCategory } from 'src/types/flashCardCategories';
enum FieldNames {
	categoryName = 'categoryName',
}

const AddEditCategoryModal = ({ onSubmit, onClose, editData }: AddEditCategory) => {
	const [loader, setLoader] = useState<boolean>(false);
	/**
	 *@returns Method used for setValue from category data and get the details of category by uuid
	 */
	useEffect(() => {
		if (editData) {
			setLoader(true);
			APIService.getData(`${URL_PATHS.flashCardCategories}/${editData?.uuid}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						formik.setFieldValue(FieldNames.categoryName, editData?.categoryName);
					} else {
						toast.error(response?.data?.message);
					}
					setLoader(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoader(false);
				});
		}
	}, []);

	const initialValues: CreateFlashCardCategory = {
		[FieldNames.categoryName]: '',
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit category
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.categoryName]: Yup.string().trim().required(Errors.PLEASE_ENTER_CATEGORY_NAME).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			if (editData) {
				setLoader(true);
				APIService.patchData(`${URL_PATHS.flashCardCategories}/${editData?.uuid}`, {
					categoryName: values.categoryName.trim(),
				})
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoader(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoader(false);
					});
			} else {
				setLoader(true);
				APIService.postData(URL_PATHS.flashCardCategories, {
					categoryName: values.categoryName.trim(),
				})
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoader(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoader(false);
					});
			}
		},
	});

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					<h4>{editData !== null ? 'Edit' : 'Add'} Category</h4>
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}
				{loader && <Loader />}
				<form className='w-[90vw] md:w-[30vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 gap-x-4 gap-y-2'>
							<div className='mb-4'>
								<TextInput placeholder='Category Name' name={FieldNames.categoryName} onChange={formik.handleChange} label='Category Name' value={formik.values.categoryName} error={formik.errors.categoryName && formik.touched.categoryName ? formik.errors.categoryName : ''} required />
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

export default AddEditCategoryModal;
