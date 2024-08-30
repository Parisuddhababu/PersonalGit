import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import { AddEditUser, UserDetails, UserForm } from 'src/types/user';
import { Errors } from '@config/errors';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { Cross } from '@components/icons';
import defaultUser from '@assets/images/default-user-image.png';
import { URL_PATHS } from '@config/variables';
import Loader from '@components/icons/Loader';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { DropdownOptionType } from 'src/types/component';
import Dropdown from '@components/dropdown/Dropdown';

enum FieldData {
	firstName = 'firstName',
	lastName = 'lastName',
	email = 'email',
	dateOfBirth = 'dateOfBirth',
	phoneNumber = 'phoneNumber',
	phoneCode = 'phoneCode',
}
enum DefaultValues {
	defaultPhoneCode = 0,
}

const AddEditUserModal = ({ onClose, editData, disableData, onSubmit }: AddEditUser) => {
	const [userData, setUserData] = useState<UserDetails>();
	const [isLoading, setLoading] = useState(false);
	const [countryDropDown, setCountryDropDown] = useState<DropdownOptionType[]>([]);

	/**
	 * Method used for get user api with id
	 */
	const getUserDetails = () => {
		setLoading(true);
		APIService.getData(`${URL_PATHS.userManagement}${editData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					getCountryData();
					setUserData(response.data.data.data);
				} else {
					toast.error(response.data.message);
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				setLoading(false);
			});
	};

	/**
	 * @returns Method is used to get the country data from api
	 */
	const getCountryData = () => {
		setLoading(true);
		APIService.getData(`${URL_PATHS.country}/list`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data.data?.map((item: { phoneCode: number }) => {
						data.push({ name: item?.phoneCode, key: item?.phoneCode });
					});
					setCountryDropDown(data);
					setLoading(false);
				} else {
					toast.error(response?.data.message);
					setLoading(false);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoading(false);
			});
	};
	/**
	 * Method used for get user api with id
	 */
	useEffect(() => {
		getUserDetails();
	}, []);

	/**
	 * Method used for setValue from user data by id
	 */
	useEffect(() => {
		formik.setFieldValue(FieldData.firstName, userData?.userDetail.firstName);
		formik.setFieldValue(FieldData.lastName, userData?.userDetail.lastName);
		formik.setFieldValue(FieldData.email, userData?.userDetail.email);
		formik.setFieldValue(FieldData.dateOfBirth, `${userData?.userDetail.birthYear}`);
		formik.setFieldValue(FieldData.phoneNumber, userData?.userDetail.phoneNumber);
		formik.setFieldValue(FieldData.phoneCode, userData?.userDetail?.phoneCode === DefaultValues.defaultPhoneCode ? '' : userData?.userDetail.phoneCode);
	}, [userData]);

	const initialValues: UserForm = {
		[FieldData.dateOfBirth]: '',
		[FieldData.email]: '',
		[FieldData.firstName]: '',
		[FieldData.lastName]: '',
		[FieldData.phoneNumber]: '',
		[FieldData.phoneCode]: '',
	};

	/**
	 *
	 * Method used for get validation for add/edit user
	 *
	 */
	const getUserObj = () => {
		const obj: ObjectShape = {
			[FieldData.firstName]: Yup.string().trim().required(Errors.PLEASE_ENTER_FIRST_NAME),
			[FieldData.lastName]: Yup.string().trim().required(Errors.PLEASE_ENTER_LAST_NAME),
			[FieldData.phoneNumber]: Yup.string().trim().required(Errors.PLEASE_ENTER_CONTACT_NUMBER),
			[FieldData.phoneCode]: Yup.string().required(Errors.PLEASE_SELECT_PHONE_CODE),
			[FieldData.dateOfBirth]: Yup.mixed()
				.required(Errors.PLEASE_ENTER_DATE_OF_BIRTH)
				.test('minYear', Errors.PLEASE_ENTER_DATE_OF_BIRTH_MAX, (value) => value && value < new Date().getFullYear() - 18 && value > new Date().getFullYear() - 99),
		};

		return Yup.object<ObjectShape>(obj);
	};

	const formik = useFormik({
		initialValues,
		validationSchema: getUserObj(),
		onSubmit: (values) => {
			APIService.putData(`${URL_PATHS.userManagement}${editData?.uuid}`, {
				firstName: values.firstName.trim(),
				lastName: values.lastName.trim(),
				birthYear: values.dateOfBirth,
				phoneNumber: values.phoneNumber.trim(),
				phoneCode: values.phoneCode,
			})
				.then((response) => {
					if (response.status === ResponseCode.success) {
						toast.success(response?.data.message);
						onClose();
						onSubmit();
					} else {
						toast.error(response.data.message);
					}
				})
				.catch((err) => toast.error(err.response.data.message));
		},
	});

	const getError = (fieldName: keyof UserForm) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					{!disableData ? <h4>{editData !== null ? 'Edit' : 'Add'} User</h4> : <h4>View User</h4>}
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}
				{isLoading && <Loader />}
				<form className='w-[90vw] md:w-[75vw] lg:w-[60vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2'>
							<div className='mb-4 sm:col-span-2 lg:col-span-3'>
								<label htmlFor='image' className='block text-gray-700 text-sm font-bold mb-0.5'>
									Profile Photo <span className='text-error'>*</span>
								</label>
								<img src={userData?.userDetail.profileImage !== '' ? userData?.userDetail.profileImage : defaultUser} alt='Image Preview' className='object-contain w-40 h-40 mb-5 mr-4 p-1 rounded-md border' />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='First Name' name={FieldData.firstName} onChange={formik.handleChange} disabled={disableData} label='First Name' value={formik.values.firstName} error={getError(FieldData.firstName)} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Last Name' name={FieldData.lastName} onChange={formik.handleChange} disabled={disableData} label='Last Name' value={formik.values.lastName} error={getError(FieldData.lastName)} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Email' name={FieldData.email} onChange={formik.handleChange} disabled={true} label='Email' value={formik.values.email} error={getError(FieldData.email)} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Birth year' name={FieldData.dateOfBirth} onChange={formik.handleChange} disabled={disableData} label='Birth year' value={formik.values.dateOfBirth} error={getError(FieldData.dateOfBirth)} type='text' required />
							</div>
							<div className='mb-4'>
								<Dropdown label='Phone code' placeholder='Phone code' name={FieldData.phoneCode} onChange={formik.handleChange} value={formik.values.phoneCode} disabled={disableData} options={countryDropDown} id='phoneCode' error={getError(FieldData.phoneCode)} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Phone Number' name={FieldData.phoneNumber} onChange={formik.handleChange} disabled={disableData} label='Phone Number' value={formik.values.phoneNumber} error={getError(FieldData.phoneNumber)} required />
							</div>
						</div>
					</div>

					<div className={cn(ModelStyle['model__body'])}>
						<h5 className='mb-3'>Children</h5>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2'>
							{userData?.children.record === 0 ? (
								<div className='mb-4 sm:col-span-2 lg:col-span-3'>
									<p>No Child Record Found</p>
								</div>
							) : (
								<>
									{userData?.children.data.map((item) => {
										return (
											<>
												<TextInput placeholder='Child full name' name={'fullName'} disabled={true} label='Full name' value={item.fullName} />
												<TextInput placeholder='Gender' name={'gender'} disabled={true} label='Gender' value={item.gender} />
												<TextInput type='date' placeholder='Birth date' name={'fullName'} disabled={true} label='Date of birth' value={item.birthDate} />
											</>
										);
									})}
								</>
							)}
						</div>
					</div>
					<div className={cn(ModelStyle['model__footer'])}>
						{!disableData && (
							<Button className='btn-primary btn-large w-28 justify-center' type='submit'>
								{editData !== null ? 'Update' : 'Save'}
							</Button>
						)}
						<Button className='btn-default btn-large w-28 justify-center' onClick={onClose}>
							{disableData ? 'Close' : 'Cancel'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddEditUserModal;
