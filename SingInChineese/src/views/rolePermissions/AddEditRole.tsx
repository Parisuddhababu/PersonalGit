import React, { useEffect, useState } from 'react';
import { RoleEditProps, RoleInput } from 'src/types/role';
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
import { stringRequired } from '@config/validations';

enum FieldNames {
	roleName = 'name',
	roleDescription = 'description',
}

const AddEditRole = ({ onSubmit, onClose, editData }: RoleEditProps) => {
	const [loaderRole, setLoaderRole] = useState<boolean>(false);

	/**
	 *@returns Method used for setValue from exam data and get the details of exam by uuid
	 */
	useEffect(() => {
		if (editData) {
			setLoaderRole(true);
			APIService.getData(`${URL_PATHS.role}/${editData?.uuid}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						formik.setFieldValue(FieldNames.roleName, editData?.name);
						formik.setFieldValue(FieldNames.roleDescription, editData?.description);
					} else {
						toast.error(response?.data?.message);
					}
					setLoaderRole(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoaderRole(false);
				});
		}
	}, []);

	const initialValues: RoleInput = {
		[FieldNames.roleName]: '',
		[FieldNames.roleDescription]: '',
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit exam
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.roleName]: stringRequired(Errors.PLEASE_ENTER_ROLE),
			[FieldNames.roleDescription]: stringRequired(Errors.PLEASE_ENTER_DESCRIPTION),
		};
		return Yup.object<ObjectShape>(obj);
	};

	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			if (editData) {
				setLoaderRole(true);
				APIService.putData(`${URL_PATHS.role}/${editData?.uuid}`, {
					name: values.name,
					description: values.description,
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
						setLoaderRole(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderRole(false);
					});
			} else {
				setLoaderRole(true);
				APIService.postData(`${URL_PATHS.role}`, {
					name: values.name,
					description: values.description,
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
						setLoaderRole(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderRole(false);
					});
			}
		},
	});

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					<h4>{editData !== null ? 'Edit' : 'Add'} Role</h4>
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}
				{loaderRole && <Loader />}
				<form className='w-[90vw] md:w-[75vw] lg:w-[60vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2'>
							<div className='mb-4'>
								<TextInput placeholder='Role name' name={FieldNames.roleName} onChange={formik.handleChange} label='Role Name' value={formik.values.name} error={formik.errors.name && formik.touched.name ? formik.errors.name : ''} />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Role description' name={FieldNames.roleDescription} onChange={formik.handleChange} label='Role description' value={formik.values.description} error={formik.errors.description && formik.touched.description ? formik.errors.description : ''} />
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

export default AddEditRole;
