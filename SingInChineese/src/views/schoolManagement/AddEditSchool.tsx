import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import { Errors } from '@config/errors';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { ArrowSmallLeft, Briefcase } from '@components/icons';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { endPoint, PASSWORD_MAX_LIMIT, PAYMENT_STATUS, PAYMENT_TYPES, ROUTES } from '@config/constant';
import { stringNotRequired, stringRequired, stringTrim } from '@config/validations';
import Dropdown from '@components/dropdown/Dropdown';
import { CreateSchoolData, SchoolObj, TopicIds, UpdateSchoolData } from 'src/types/schools';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { ONLY_NUMBERS, PASSWORD_REGEX } from '@config/regex';
import GridView from '@components/gridView';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import { dateFormat } from '@utils/helpers';
import { AxiosError, AxiosResponse } from 'axios';
import { IErrorResponse, ISuccessResponse } from 'src/types/common';

enum FieldNames {
	schoolName = 'schoolName',
	addressLine1 = 'addressLine1',
	addressLine2 = 'addressLine2',
	city = 'city',
	state = 'state',
	zipCode = 'zipCode',
	country = 'country',
	contactPersonName = 'contactPersonName',
	contactPersonPhoneNumber = 'contactPersonPhoneNumber',
	contactEmail = 'contactEmail',
	schoolAdminUserPassword = 'schoolAdminUserPassword',
	paymentMode = 'paymentMode',
	paymentStartDate = 'paymentStartDate',
	paymentEndDate = 'paymentEndDate',
	topicIds = 'topicIds',
	invoiceDate = 'invoiceDate',
	invoiceUrl = 'invoiceUrl',
	invoiceNumber = 'invoiceNumber',
	paymentStatus = 'paymentStatus',
	amount = 'amount',
}

const AddEditSchoolModal = () => {
	const [loaderSchool, setLoaderSchool] = useState<boolean>(false);
	const params = useParams();
	const navigate = useNavigate();
	const [topicIds, setTopicIds] = useState<TopicIds>([]);
	const [checked, setChecked] = useState<string[]>([]);
	const [assignedTopics, setAssignedTopics] = useState<string[]>([]);
	const [schoolId, setSchoolId] = useState<string>('');
	const minDate = () => {
		const today = new Date();
		return today;
	};

	/**
	 * Method used for setValue from school data and get the details of school by uuid
	 */
	const fetchSchoolData = () => {
		setLoaderSchool(true);
		APIService.getData(`${URL_PATHS.schools}/${params?.schoolId ?? params?.viewId}`)
			.then((response: AxiosResponse<ISuccessResponse<SchoolObj>>) => {
				const data = response?.data?.data;
				if (response.status === ResponseCode.success) {
					formik.setFieldValue(FieldNames.schoolName, data?.schoolName);
					formik.setFieldValue(FieldNames.addressLine1, data?.addressLine1);
					formik.setFieldValue(FieldNames.addressLine2, data?.addressLine2);
					formik.setFieldValue(FieldNames.city, data?.city);
					formik.setFieldValue(FieldNames.state, data?.state);
					formik.setFieldValue(FieldNames.zipCode, data?.zipCode);
					formik.setFieldValue(FieldNames.country, data?.country);
					formik.setFieldValue(FieldNames.contactPersonName, data?.user.contactPersonName);
					formik.setFieldValue(FieldNames.contactPersonPhoneNumber, data?.user.contactPersonPhoneNumber);
					formik.setFieldValue(FieldNames.contactEmail, data?.user.contactEmail);
					formik.setFieldValue(FieldNames.paymentMode, data?.schoolPayment?.paymentMode);
					formik.setFieldValue(FieldNames.paymentStartDate, moment(data?.schoolPayment?.paymentStartDate).toDate());
					formik.setFieldValue(FieldNames.paymentEndDate, moment(data?.schoolPayment?.paymentEndDate).toDate());
					formik.setFieldValue(FieldNames.amount, data?.schoolPayment?.amount);
					formik.setFieldValue(FieldNames.invoiceDate, data?.schoolPayment?.invoiceDate ? moment(data?.schoolPayment?.invoiceDate).toDate() : null);
					formik.setFieldValue(FieldNames.invoiceUrl, data?.schoolPayment?.invoiceUrl ? data?.schoolPayment?.invoiceUrl : '');
					formik.setFieldValue(FieldNames.invoiceNumber, data?.schoolPayment?.invoiceNumber ? data?.schoolPayment?.invoiceNumber : '');
					formik.setFieldValue(FieldNames.paymentStatus, data?.schoolPayment?.paymentStatus);

					const topicData: string[] = [];
					data?.topics?.map((data: { uuid: string }) => {
						topicData.push(data?.uuid);
					});
					setChecked(topicData);
					setSchoolId(data?.uuid);
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data?.message))
			.finally(() => setLoaderSchool(false));
	};

	/**
	 * Method used to fetch the topics data for school
	 */
	const fetchTopicsForSchool = () => {
		setLoaderSchool(true);
		APIService.getData(URL_PATHS.topics)
			.then((response: AxiosResponse<ISuccessResponse<TopicIds>>) => {
				if (response.status === ResponseCode.success) {
					setTopicIds(response?.data.data);
					setLoaderSchool(false);
					if (params?.schoolId || params?.viewId) {
						fetchSchoolData();
					}
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => {
				toast.error(err?.response?.data.message);
				setLoaderSchool(false);
			});
	};

	useEffect(() => {
		fetchTopicsForSchool();
	}, []);

	const initialValues: CreateSchoolData = {
		[FieldNames.schoolName]: '',
		[FieldNames.addressLine1]: '',
		[FieldNames.addressLine2]: '',
		[FieldNames.city]: '',
		[FieldNames.state]: '',
		[FieldNames.zipCode]: '',
		[FieldNames.country]: '',
		[FieldNames.contactPersonName]: '',
		[FieldNames.contactPersonPhoneNumber]: '',
		[FieldNames.contactEmail]: '',
		[FieldNames.schoolAdminUserPassword]: '',
		[FieldNames.paymentMode]: 2,
		[FieldNames.paymentStartDate]: '',
		[FieldNames.paymentEndDate]: '',
		[FieldNames.topicIds]: [],
		[FieldNames.invoiceDate]: null,
		[FieldNames.invoiceUrl]: '',
		[FieldNames.invoiceNumber]: '',
		[FieldNames.paymentStatus]: '',
		[FieldNames.amount]: 0,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit school
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.schoolName]: stringTrim(Errors.PLEASE_ENTER_SCHOOL_NAME),
			[FieldNames.city]: stringTrim(Errors.PLEASE_ENTER_CITY),
			[FieldNames.state]: stringTrim(Errors.PLEASE_ENTER_STATE),
			[FieldNames.zipCode]: stringTrim(Errors.PLEASE_ENTER_ZIPCODE),
			[FieldNames.country]: stringTrim(Errors.PLEASE_ENTER_COUNTRY),
			[FieldNames.contactPersonName]: stringTrim(Errors.PLEASE_ENTER_CONTACT_PERSON_NAME),
			[FieldNames.contactPersonPhoneNumber]: stringTrim(Errors.PLEASE_ENTER_CONTACT_PERSON_NUMBER).matches(ONLY_NUMBERS, Errors.PHONE_NUMBER_MUST_BE_NUMBERS).max(15, Errors.PHONE_NUMBER_SHOULD_NOT_EXCEED),
			[FieldNames.contactEmail]: Yup.string().email(Errors.PLEASE_ENTER_VALID_EMAIL).required(Errors.PLEASE_ENTER_CONTACT_EMAIL),
			[FieldNames.schoolAdminUserPassword]: !params.schoolId ? Yup.string().required(Errors.PLEASE_ENTER_SCHOOL_ADMIN_USER_PASSWORD).matches(PASSWORD_REGEX, Errors.PASSWORD_MUST_CONTAIN_COMBINATION_CHARACTERS).max(PASSWORD_MAX_LIMIT, Errors.PASSWORD_CHARACTERS_LIMIT) : stringNotRequired(),
			[FieldNames.paymentMode]: stringRequired(Errors.PLEASE_SELECT_PAYMENT_TYPE),
			[FieldNames.paymentStartDate]: stringRequired(Errors.PLEASE_ENTER_START_DATE).nullable(),
			[FieldNames.paymentEndDate]: stringRequired(Errors.PLEASE_ENTER_END_DATE).nullable(),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updateSchool: UpdateSchoolData = {
				schoolName: values.schoolName,
				addressLine1: values.addressLine1,
				addressLine2: values.addressLine2,
				city: values.city,
				state: values.state,
				zipCode: values.zipCode,
				country: values.country,
				contactPersonName: values.contactPersonName,
				contactPersonPhoneNumber: values.contactPersonPhoneNumber,
				contactEmail: values.contactEmail,
				paymentMode: +values.paymentMode,
				paymentStartDate: dateFormat(values.paymentStartDate),
				paymentEndDate: dateFormat(values.paymentEndDate),
				amount: values.amount,
				invoiceDate: values.invoiceDate ? dateFormat(values.invoiceDate) : null,
				invoiceUrl: values.invoiceUrl,
				invoiceNumber: values.invoiceNumber,
				paymentStatus: values.paymentStatus,
				topicIds: assignedTopics,
			};
			if (params?.schoolId) {
				setLoaderSchool(true);
				APIService.patchData(`${URL_PATHS.schools}/${params?.schoolId}/${endPoint.edit}`, updateSchool)
					.then((response: AxiosResponse<ISuccessResponse<string>>) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							navigateToSchools();
						}
					})
					.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data?.message))
					.finally(() => setLoaderSchool(false));
			} else {
				setLoaderSchool(true);
				APIService.postData(URL_PATHS.schools, { ...values, paymentMode: +values.paymentMode, paymentStartDate: dateFormat(values.paymentStartDate), paymentEndDate: dateFormat(values.paymentEndDate), invoiceDate: values.invoiceDate ? dateFormat(values.invoiceDate) : null })
					.then((response: AxiosResponse<ISuccessResponse<object>>) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							navigateToSchools();
						}
					})
					.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data?.message))
					.finally(() => setLoaderSchool(false));
			}
		},
	});

	/**
	 *
	 * @returns Method used to set error for form fields.
	 */
	const getError = (fieldName: keyof CreateSchoolData) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	/**
	 *
	 * @returns Method used to redirect the page
	 */
	const navigateToSchools = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.school}/${ROUTES.list}`);
	}, []);

	/**
	 *
	 * @returns Method used to redirect the page to teachers listing
	 */
	const navigateToTeachers = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.teacher}/${ROUTES.list}/${schoolId}`);
	}, [schoolId]);

	/**
	 *
	 * @returns Method used to redirect the page to classroom listing
	 */
	const navigateToClassRooms = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.classroom}/${ROUTES.list}`, { state: { schoolId: schoolId, teacherId: 'All' } });
	}, [schoolId]);

	/**
	 * structure for grid view
	 */
	const topicNodes = topicIds.map((i) => {
		return {
			value: i.uuid,
			label: i.levelName,
			id: `${i.id}`,
			children: i.topics.map((j) => {
				return { value: j.uuid, label: j.topicName };
			}) as { value: string; label: string }[],
		};
	});

	/**
	 *
	 * @param event  to set the topic ids to the api
	 */
	const onChangeTopicHandler = useCallback(
		(event: string[]) => {
			formik.setFieldValue(FieldNames.topicIds, [...event]);
			setAssignedTopics(event);
		},
		[assignedTopics]
	);

	/**
	 *
	 * @returns Method is used to return the title
	 */
	const getTitle = () => {
		if (params.viewId) {
			return 'School';
		} else if (params.schoolId) {
			return 'Edit School';
		} else {
			return 'Add School';
		}
	};

	return (
		<div>
			{loaderSchool && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={navigateToSchools} title='Back to schools'>
							<ArrowSmallLeft />
						</Button>
						<Briefcase className='inline-block mr-2 text-primary' />
						<span>{getTitle()}</span>
					</h6>
					{(params.schoolId || params.viewId) && (
						<div>
							<Button className='btn-primary mr-2' onClick={navigateToTeachers}>
								View Teachers
							</Button>
							<Button className='btn-primary' onClick={navigateToClassRooms}>
								View Class Rooms
							</Button>
						</div>
					)}
				</div>
				<form className='p-3' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2'>
							<div className='mb-4'>
								<TextInput placeholder='School name' name={FieldNames.schoolName} onChange={formik.handleChange} label='School name' value={formik.values.schoolName} error={getError(FieldNames.schoolName)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Address Line 1' name={FieldNames.addressLine1} onChange={formik.handleChange} label='Address Line 1' value={formik.values.addressLine1} error={getError(FieldNames.addressLine1)} disabled={!!params.viewId} />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Address Line 2' name={FieldNames.addressLine2} onChange={formik.handleChange} label='Address Line 2' value={formik.values.addressLine2} error={getError(FieldNames.addressLine2)} disabled={!!params.viewId} />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='City' name={FieldNames.city} onChange={formik.handleChange} label='City' value={formik.values.city} error={getError(FieldNames.city)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='State' name={FieldNames.state} onChange={formik.handleChange} label='State' value={formik.values.state} error={getError(FieldNames.state)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Zipcode' name={FieldNames.zipCode} onChange={formik.handleChange} label='Zipcode' value={formik.values.zipCode} error={getError(FieldNames.zipCode)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Country' name={FieldNames.country} onChange={formik.handleChange} label='Country' value={formik.values.country} error={getError(FieldNames.country)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Contact person name' name={FieldNames.contactPersonName} onChange={formik.handleChange} label='Contact person name' value={formik.values.contactPersonName} error={getError(FieldNames.contactPersonName)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Contact person number' name={FieldNames.contactPersonPhoneNumber} onChange={formik.handleChange} label='Contact person number' value={formik.values.contactPersonPhoneNumber} error={getError(FieldNames.contactPersonPhoneNumber)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Contact email' name={FieldNames.contactEmail} onChange={formik.handleChange} label='Contact email' value={formik.values.contactEmail} error={getError(FieldNames.contactEmail)} disabled={!!params.viewId} required />
							</div>
							{!params.schoolId && !params.viewId && (
								<div className='mb-4'>
									<TextInput type='password' placeholder='School admin user password' name={FieldNames.schoolAdminUserPassword} onChange={formik.handleChange} label='School admin user password' value={formik.values.schoolAdminUserPassword} error={getError(FieldNames.schoolAdminUserPassword)} disabled={!!params.viewId} required />
								</div>
							)}
							<div className='mb-4 hidden'>
								<Dropdown label='Payment mode' placeholder='Payment mode' name={FieldNames.paymentMode} onChange={formik.handleChange} value={formik.values.paymentMode} options={PAYMENT_TYPES} id={FieldNames.paymentMode} error={getError(FieldNames.paymentMode)} disabled={!!params.viewId} required />
							</div>
							<div className='mb-4'>
								<label htmlFor={FieldNames.paymentStartDate} className='font-bold text-gray-700'>
									Start date <span className='text-error'>*</span>
								</label>
								<Calendar className={`p-inputtext p-component ${formik.touched.paymentStartDate && formik.errors.paymentStartDate ? 'border-error' : ''}`} name={FieldNames.paymentStartDate} value={formik.values.paymentStartDate ? moment(formik.values.paymentStartDate).toDate() : null} onChange={formik.handleChange} placeholder='MM/DD/YYYY' showIcon minDate={moment(formik.values.paymentStartDate).toDate() < minDate() && params?.schoolId ? moment(formik.values.paymentStartDate).toDate() : minDate()} maxDate={moment(formik.values.paymentEndDate).toDate()} disabled={!!params.viewId} />
								{<p className='text-error mt-2 text-sm'>{getError(FieldNames.paymentStartDate)}</p>}
							</div>
							<div className='mb-4'>
								<label htmlFor={FieldNames.paymentEndDate} className='font-bold text-gray-700'>
									End date <span className='text-error'>*</span>
								</label>
								<Calendar className={`p-inputtext p-component ${formik.touched.paymentEndDate && formik.errors.paymentEndDate ? 'border-error' : ''}`} name={FieldNames.paymentEndDate} value={formik.values.paymentEndDate ? moment(formik.values.paymentEndDate).toDate() : null} onChange={formik.handleChange} placeholder='MM/DD/YYYY' showIcon minDate={moment(formik.values.paymentStartDate).toDate() ? moment(formik.values.paymentStartDate).toDate() : minDate()} disabled={!!params.viewId} />
								{<p className='text-error mt-2 text-sm'>{getError(FieldNames.paymentEndDate)}</p>}
							</div>
							<div className='mb-4'>
								<label htmlFor={FieldNames.invoiceDate} className='font-bold text-gray-700'>
									Invoice date
								</label>
								<Calendar name={FieldNames.invoiceDate} value={formik.values.invoiceDate ? moment(formik.values.invoiceDate).toDate() : null} onChange={formik.handleChange} placeholder='MM/DD/YYYY' showIcon disabled={!!params.viewId} />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Invoice url' name={FieldNames.invoiceUrl} onChange={formik.handleChange} label='Invoice url' value={formik.values.invoiceUrl} error={getError(FieldNames.invoiceUrl)} disabled={!!params.viewId} />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Invoice number' name={FieldNames.invoiceNumber} onChange={formik.handleChange} label='Invoice number' value={formik.values.invoiceNumber} error={getError(FieldNames.invoiceNumber)} disabled={!!params.viewId} />
							</div>
							<div className='mb-4'>
								<Dropdown label='Payment status' placeholder='Payment status' name={FieldNames.paymentStatus} onChange={formik.handleChange} value={formik.values.paymentStatus} options={PAYMENT_STATUS} id={FieldNames.paymentStatus} error={getError(FieldNames.paymentStatus)} disabled={!!params.viewId} />
							</div>
							<div className='mb-4'>
								<TextInput type='number' placeholder='Amount' name={FieldNames.amount} onChange={formik.handleChange} label='Amount' value={formik.values.amount} error={getError(FieldNames.amount)} disabled={!!params.viewId} />
							</div>
						</div>
						<div className='mb-4'>
							<label htmlFor={FieldNames.topicIds} className='font-bold text-gray-700'>
								Assign topics <span className='text-error'>*</span>
							</label>
							<GridView nodes={topicNodes} checkedChild={checked} onChangeCheckedChildHandler={onChangeTopicHandler} columns={6} disable={!!params.viewId} />
						</div>
					</div>
					{!params.viewId && (
						<div className='text-end space-x-2'>
							<Button className='btn-primary btn-large w-28 justify-center' type='submit'>
								{params.schoolId ? 'Update' : 'Save'}
							</Button>
							<Button className='btn-default btn-large w-28 justify-center' onClick={navigateToSchools}>
								Cancel
							</Button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

export default AddEditSchoolModal;
