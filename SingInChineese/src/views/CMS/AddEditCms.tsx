import React, { useCallback, useEffect, useState } from 'react';
import Button from '@components/button/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import { Errors } from '@config/errors';
import { Cross } from '@components/icons';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { ObjectShape } from 'yup/lib/object';
import JoditEditor from '@components/joditEditor/JoditEditor';
import { AddEditCMSData, CreateCMSPage } from 'src/types/cms';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { stringTrim } from '@config/validations';

enum FieldNames {
	title = 'title',
	description = 'description',
}

const AddEditCmsModal = ({ onClose, editData, onSubmit }: AddEditCMSData) => {
	const [loaderCMS, setLoaderCMS] = useState<boolean>(false);

	/**
	 * Method used to get CMS page data by uuid
	 */
	useEffect(() => {
		if (editData) {
			setLoaderCMS(true);
			APIService.getData(`${URL_PATHS.pages}/${editData.slug}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						formik.setFieldValue(FieldNames.title, editData?.title);
						formik.setFieldValue(FieldNames.description, editData?.description);
					} else {
						toast.error(response?.data?.message);
					}
					setLoaderCMS(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoaderCMS(false);
				});
		}
	}, []);

	const onChangeEditorData = useCallback((data: string) => {
		formik.setFieldValue(FieldNames.description, data);
	}, []);

	const initialValues: CreateCMSPage = {
		[FieldNames.title]: '',
		[FieldNames.description]: '',
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit CMS page
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.title]: stringTrim(Errors.PLEASE_ENTER_TITLE),
		};
		return Yup.object<ObjectShape>(obj);
	};

	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			if (editData) {
				setLoaderCMS(true);
				APIService.patchData(`${URL_PATHS.pages}/${editData?.uuid}`, values)
					.then((response) => {
						if (response.status === ResponseCode.success || ResponseCode.created) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						} else {
							toast.error(response?.data?.message);
						}
						setLoaderCMS(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderCMS(false);
					});
			} else {
				setLoaderCMS(true);
				APIService.postData(`${URL_PATHS.pages}`, values)
					.then((response) => {
						if (response.status === ResponseCode.success || ResponseCode.created) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						} else {
							toast.error(response?.data?.message);
						}
						setLoaderCMS(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderCMS(false);
					});
			}
		},
	});

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			{loaderCMS && <Loader />}
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					<h4>{editData !== null ? 'Edit' : 'Add'} CMS Page</h4>
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}

				<form className='w-[90vw] md:w-[75vw] lg:w-[60vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 gap-x-4 gap-y-2'>
							<div className='mb-4'>
								<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title' value={formik.values.title} error={formik.errors.title && formik.touched.title ? formik.errors.title : ''} required />
							</div>
							<div className='mb-4'>
								<label htmlFor='description' className='block text-gray-700 text-sm font-bold mb-0.5'>
									Description
								</label>
								<JoditEditor onChange={onChangeEditorData} value={editData?.description as string} />
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

export default AddEditCmsModal;
