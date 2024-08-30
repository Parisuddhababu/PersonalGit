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
import { AddEditCountryData, CreateCountryData } from 'src/types/country';
import { CHARACTERS_LIMIT, DEFAULT_LIMIT } from '@config/constant';
import { ONLY_ALPHABETS } from '@config/regex';
import { stringRequired } from '@config/validations';

enum FieldNames {
	countryCode = 'countryCode',
	phoneCode = 'phoneCode',
	countryName = 'countryName',
}

const AddEditCountryModal = ({ onSubmit, onClose, editData, disabled }: AddEditCountryData) => {
	const [loaderCountry, setLoaderCountry] = useState<boolean>(false);
	/**
	 *@returns Method used for setValue from exam data and get the details of country by uuid
	 */
	useEffect(() => {
		if (editData) {
			setLoaderCountry(true);
			APIService.getData(`${URL_PATHS.country}/${editData.uuid}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						formik.setFieldValue(FieldNames.countryCode, editData?.countryCode);
						formik.setFieldValue(FieldNames.phoneCode, editData?.phoneCode);
						formik.setFieldValue(FieldNames.countryName, editData?.countryName);
					} else {
						toast.error(response?.data?.message);
					}
					setLoaderCountry(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoaderCountry(false);
				});
		}
	}, []);

	const initialValues: CreateCountryData = {
		[FieldNames.countryCode]: '',
		[FieldNames.phoneCode]: '',
		[FieldNames.countryName]: '',
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit country
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.countryCode]: stringRequired(Errors.PLEASE_ENTER_COUNTRY_CODE).max(DEFAULT_LIMIT, Errors.COUNTRY_CODE_SHOULD_NOT_EXCEED).matches(ONLY_ALPHABETS, `Numbers and ${Errors.SPECIAL_CHARACTERS_NOT_ALLOWED}`),
			[FieldNames.phoneCode]: stringRequired(Errors.PLEASE_ENTER_PHONE_CODE),
			[FieldNames.countryName]: stringRequired(Errors.PLEASE_ENTER_COUNTRY_NAME).max(CHARACTERS_LIMIT.name, Errors.COUNTRY_NAME_SHOULD_NOT_EXCEED).matches(ONLY_ALPHABETS, `Numbers and ${Errors.SPECIAL_CHARACTERS_NOT_ALLOWED}`),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			if (editData) {
				setLoaderCountry(true);
				APIService.putData(`${URL_PATHS.country}/${editData?.uuid}`, { ...values, countryName: values.countryName.trim(), countryCode: values.countryCode.trim() })
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						} else {
							toast.error(response?.data?.message);
						}
						setLoaderCountry(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderCountry(false);
					});
			} else {
				setLoaderCountry(true);
				APIService.postData(URL_PATHS.country, { ...values, countryName: values.countryName.trim(), countryCode: values.countryCode.trim() })
					.then((response) => {
						if (response.status === ResponseCode.created || ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						} else {
							toast.error(response?.data?.message);
						}
						setLoaderCountry(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderCountry(false);
					});
			}
		},
	});

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					{!disabled ? <h4>{editData !== null ? 'Edit' : 'Add'} Country</h4> : <h4>Country</h4>}
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}
				{loaderCountry && <Loader />}
				<form className='w-[90vw] md:w-[60vw] lg:w-[30vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='mb-4'>
							<TextInput placeholder='Country name' name={FieldNames.countryName} disabled={disabled} onChange={formik.handleChange} label='Country name' value={formik.values.countryName} error={formik.errors.countryName && formik.touched.countryName ? formik.errors.countryName : ''} required />
						</div>
						<div className='mb-4'>
							<TextInput placeholder='Country code' name={FieldNames.countryCode} disabled={disabled} onChange={formik.handleChange} label='Country code' value={formik.values.countryCode} error={formik.errors.countryCode && formik.touched.countryCode ? formik.errors.countryCode : ''} required />
						</div>
						<div className='mb-4'>
							<TextInput type='number' placeholder='Phone code' name={FieldNames.phoneCode} disabled={disabled} onChange={formik.handleChange} label='Phone code' value={formik.values.phoneCode} error={formik.errors.phoneCode && formik.touched.phoneCode ? formik.errors.phoneCode : ''} min={1} required />
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

export default AddEditCountryModal;
