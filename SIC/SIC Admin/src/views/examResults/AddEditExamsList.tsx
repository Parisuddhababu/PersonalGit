import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import { Errors } from '@config/errors';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { Cross, Eye } from '@components/icons';
import { AddEditExamResults, ExamResultsArr, ExamResultsForm, childDetailArr } from '@framework/rest/rest';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { Loader } from '@components/index';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

enum FieldNames {
	firstName = 'firstName',
	lastName = 'lastName',
	email = 'email',
	birthYear = 'birthYear',
	phoneNumber = 'phoneNumber',
}
const AddEditExamModal = ({ onClose, editData, disableData }: AddEditExamResults) => {
	const [loader, setLoader] = useState<boolean>(false);
	const [userDetail, setUserDetail] = useState<ExamResultsArr>();
	const [childDetail, setChildDetail] = useState<childDetailArr[]>();
	/**
	 *
	 * @param  Method used for fetching exam List
	 */
	const getUserExamDetail = (uuid: string) => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.examResultDetail}/${uuid}/result`)
			.then((response) => {
				if (response.status === ResponseCode.success || ResponseCode.created) {
					setUserDetail(response?.data?.data?.data?.user);
					setChildDetail(response?.data?.data?.data?.children);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoader(false);
			});
	};

	/**
	 * Method used for setValue from user data by id
	 */
	useEffect(() => {
		if (editData?.uuid) {
			getUserExamDetail(editData.uuid);
		}
	}, []);

	useEffect(() => {
		if (userDetail) {
			formik.setFieldValue(FieldNames.firstName, userDetail?.firstName);
			formik.setFieldValue(FieldNames.lastName, userDetail?.lastName);
			formik.setFieldValue(FieldNames.email, userDetail?.email);
			formik.setFieldValue(FieldNames.birthYear, userDetail?.birthYear);
			formik.setFieldValue(FieldNames.phoneNumber, userDetail?.phoneNumber);
		}
	}, [userDetail]);

	const initialValues: ExamResultsForm = {
		[FieldNames.firstName]: '',
		[FieldNames.lastName]: '',
		[FieldNames.email]: '',
		[FieldNames.birthYear]: 0,
		[FieldNames.phoneNumber]: '',
	};

	/**
	 *@params
	 * @returns Method used for get validation for add/edit user
	 */

	const getUserObj = () => {
		const obj: ObjectShape = {
			[FieldNames.firstName]: Yup.string().required(Errors.PLEASE_ENTER_FIRST_NAME),
			[FieldNames.lastName]: Yup.string().required(Errors.PLEASE_ENTER_LAST_NAME),
			[FieldNames.email]: Yup.string().email(Errors.INVALID_EMAIL).required(Errors.PLEASE_ENTER_YOUR_REGISTERED_EMAIL),
			[FieldNames.birthYear]: Yup.number().required(Errors.PLEASE_ENTER_FIRST_NAME),
		};

		return Yup.object<ObjectShape>(obj);
	};

	const formik = useFormik({
		initialValues,
		validationSchema: getUserObj(),
		onSubmit: () => {
			return;
		},
	});

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			{loader && <Loader />}
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					{!disableData && <h4>{editData !== null ? 'Edit' : 'Add'} Exam</h4>}
					{disableData && <h4> View Exam Results</h4>}

					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}

				<form className='w-[90vw] md:w-[75vw] lg:w-[60vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2'>
							<TextInput placeholder='First Name' name='firstName' onChange={formik.handleChange} disabled={disableData} label='First Name' value={formik.values.firstName} error={formik.errors.firstName && formik.touched.firstName ? formik.errors.firstName : ''} required />
							<TextInput placeholder='Last Name' name='lastName' onChange={formik.handleChange} disabled={disableData} label='Last Name' value={formik.values.lastName} error={formik.errors.lastName && formik.touched.lastName ? formik.errors.lastName : ''} required />
							<TextInput placeholder='Email' name='email' onChange={formik.handleChange} disabled={disableData} label='Email' value={formik.values.email} error={formik.errors.email && formik.touched.email ? formik.errors.email : ''} required />
							<TextInput placeholder='Birth Year' name='birthYear' onChange={formik.handleChange} disabled={disableData} label='Birth Year' value={formik.values.birthYear} error={formik.errors.birthYear && formik.touched.birthYear ? formik.errors.birthYear : ''} required />
							<TextInput placeholder='Phone Number' name='phoneNumber' onChange={formik.handleChange} disabled={disableData} label='Phone Number' value={formik.values.phoneNumber} error={formik.errors.phoneNumber && formik.touched.phoneNumber ? formik.errors.phoneNumber : ''} required />
						</div>
						{childDetail ? (
							<div className='mt-5'>
								<p className='text-xl mb-1'>Child List</p>
								<ul>
									{childDetail?.map((child) => {
										return (
											<li key={child.uuid} className='mb-1 bg-gray-50 rounded p-3 flex justify-between items-center'>
												<label htmlFor='child-name'>{child.fullName}</label>
												<Link to={`${userDetail?.uuid}/${child.uuid}`} className='btn btn-default ml-3'>
													<Eye className='mr-2' /> View Result
												</Link>
											</li>
										);
									})}
								</ul>
							</div>
						) : (
							''
						)}
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

export default AddEditExamModal;
