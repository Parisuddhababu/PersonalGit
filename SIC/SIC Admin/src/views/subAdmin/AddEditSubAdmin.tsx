import React, { useEffect, useState } from 'react';
import Button from '@components/button/Button';
import { AddEditSubAdmin, CreateSubAdmin } from 'src/types/subAdmin';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import { Errors } from '@config/errors';
import { Cross } from '@components/icons';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { DropdownOptionType } from 'src/types/component';
import { ObjectShape } from 'yup/lib/object';
import { PASSWORD_REGEX } from '@config/regex';
import Dropdown from '@components/dropdown/Dropdown';
import { URL_PATHS } from '@config/variables';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';

enum FieldNames {
	firstName = 'firstName',
	lastName = 'lastName',
	email = 'email',
	password = 'password',
	confirmPassword = 'confirmPassword',
	roleId = 'roleId',
}

const AddEditSubAdminModal = ({ onClose, editData, onSubmit, disabled }: AddEditSubAdmin) => {
	const [loader, setLoader] = useState<boolean>(false);
	const [roleDropdownData, setRoleDropdownData] = useState<DropdownOptionType[]>([]);

	/**
	 * Method is used to get all the  roles in drop down menu
	 */
	const getRoleDataListDropdown = () => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.role}/rolelist`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const tempDataArr: DropdownOptionType[] = [];
					response.data.data.data.map((data: { name: string; uuid: string }) => {
						tempDataArr.push({ name: data.name, key: data.uuid });
					});
					setRoleDropdownData(tempDataArr);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
				setLoader(false);
			});
	};
	/**
	 * Method used for set rol data array for dropdown
	 */
	useEffect(() => {
		getRoleDataListDropdown();
		if (editData) {
			setLoader(true);
			APIService.getData(`${URL_PATHS.subAdmin}${editData?.userData.uuid}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						formik.setFieldValue(FieldNames.firstName, editData?.userData.firstName);
						formik.setFieldValue(FieldNames.lastName, editData?.userData.lastName);
						formik.setFieldValue(FieldNames.email, editData?.userData.email);
						formik.setFieldValue(FieldNames.roleId, editData?.roleData.uuid);
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

	const initialValues: CreateSubAdmin = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		roleId: '',
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit subAdmin
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.firstName]: Yup.string().required(Errors.PLEASE_ENTER_FIRST_NAME),
			[FieldNames.lastName]: Yup.string().required(Errors.PLEASE_ENTER_LAST_NAME),
			[FieldNames.email]: Yup.string().email(Errors.PLEASE_ENTER_VALID_EMAIL).required(Errors.PLEASE_ENTER_YOUR_REGISTERED_EMAIL),
			[FieldNames.roleId]: Yup.string().required(Errors.PLEASE_SELECT_ROLE),
			[FieldNames.password]: editData ? Yup.string().notRequired() : Yup.string().required(Errors.PLEASE_ENTER_PASSWORD).matches(PASSWORD_REGEX, Errors.PASSWORD_MUST_CONTAIN_COMBINATION_CHARACTERS),
			[FieldNames.confirmPassword]: editData
				? Yup.string().notRequired()
				: Yup.string()
						.required(Errors.PLEASE_ENTER_CONFIRM_PASSWORD)
						.oneOf([Yup.ref('password'), ''], Errors.CONFIRM_PASSWORD_NOT_MATCH),
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
				APIService.patchData(`${URL_PATHS.subAdmin}${editData.userData.uuid}`, {
					[FieldNames.firstName]: values.firstName,
					[FieldNames.lastName]: values.lastName,
					[FieldNames.email]: values.email,
					[FieldNames.roleId]: values.roleId,
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
						setLoader(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoader(false);
					});
			} else {
				setLoader(true);
				APIService.postData(URL_PATHS.subAdmin, values)
					.then((response) => {
						if (response.status === ResponseCode.created || ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
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
		},
	});

	const getError = (fieldName: keyof CreateSubAdmin) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			{loader && <Loader />}
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					{!disabled ? <h4>{editData !== null ? 'Edit' : 'Add'} Sub Admin</h4> : <h4>Sub Admin Details</h4>}
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}

				<form className='w-[90vw] md:w-[75vw] lg:w-[60vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
							<TextInput placeholder='First Name' name={FieldNames.firstName} onChange={formik.handleChange} label='First Name' value={formik.values.firstName} error={formik.errors.firstName && formik.touched.firstName ? formik.errors.firstName : ''} disabled={disabled} required />
							<TextInput placeholder='Last Name' name={FieldNames.lastName} onChange={formik.handleChange} label='Last Name' value={formik.values.lastName} error={getError(FieldNames.lastName)} disabled={disabled} required />
							<TextInput placeholder='Email' name={FieldNames.email} onChange={formik.handleChange} label='Email' value={formik.values.email} error={getError(FieldNames.email)} disabled={disabled} required />
							{!editData && (
								<>
									<TextInput placeholder='Password' name={FieldNames.password} type='password' onChange={formik.handleChange} label='Password' value={formik.values.password} error={getError(FieldNames.password)} required />
									<TextInput placeholder='Confirm Password' type='password' name={FieldNames.confirmPassword} onChange={formik.handleChange} label='Confirm Password' value={formik.values.confirmPassword} error={getError(FieldNames.confirmPassword)} required />
								</>
							)}
							<Dropdown placeholder='Select role' name={FieldNames.roleId} onChange={formik.handleChange} value={formik.values.roleId} options={roleDropdownData} id='role' label='Role' error={getError(FieldNames.roleId)} disabled={disabled} required />
						</div>
					</div>
					{!disabled && (
						<div className={cn(ModelStyle['model__footer'])}>
							<Button className='btn-primary btn-large w-28 justify-center' type='submit'>
								{editData !== null ? 'Update' : 'Save'}
							</Button>
							<Button className='btn-default btn-large w-28 justify-center' onClick={onClose}>
								Cancel
							</Button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

export default AddEditSubAdminModal;
