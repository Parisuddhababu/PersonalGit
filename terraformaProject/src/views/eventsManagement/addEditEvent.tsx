import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { DATE_FORMAT, ROUTES } from '@config/constant';
import Button from '@components/button/button';
import { CheckCircle, Cross } from '@components/icons/icons';
import RadioButtonNew from '@components/radiobutton/radioButtonNew';
import TextInput from '@components/textInput/TextInput';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';
import { GET_EVENT_BY_ID } from '@framework/graphql/queries/event';
import { CREATE_EVENT, UPDATE_EVENT } from '@framework/graphql/mutations/event';
import { CreateEventRes, SingleEventDataArr, UpdateEventRes } from '@framework/graphql/graphql';
import useValidation from '@framework/hooks/validations';
import { CreateEvent } from 'src/types/event';
import { getDateFormat, whiteSpaceRemover } from '@utils/helpers';

import moment from 'moment';
import { useFormik } from 'formik';
import { useMutation, useQuery } from '@apollo/client';

const EditEvent = () => {
	const { t } = useTranslation();
	const { data: EventData, refetch } = useQuery(GET_EVENT_BY_ID);
	const [createEvent] = useMutation(CREATE_EVENT);
	const [updateEvent] = useMutation(UPDATE_EVENT);
	const navigate = useNavigate();
	const updateEventId = useParams();
	const { addEventValidationSchema } = useValidation();
	/**
	 * value for send notification
	 */
	const [toggleEvents, setToggleEvents] = useState<boolean>(false);

	const initialValues: CreateEvent = updateEventId.id
		? {
				eventName: '',
				description: '',
				sendNotification: false,
				address: '',
				startDate: '',
				endDate: '',
				isRecurring: '0',
				recurrenceDate: '',
				participants: '',
				participantMailIds: '',
		  }
		: {
				eventName: '',
				description: '',
				sendNotification: false,
				address: '',
				startDate: '',
				endDate: '',
				isRecurring: '0',
				recurrenceDate: '',
		  };

	/**
	 * Method used for get event api with id
	 */
	useEffect(() => {
		if (updateEventId.id) {
			refetch({ fetchEventId: parseInt(updateEventId.id) }).catch((err) => {
				toast.error(err);
			});
		}
	}, [updateEventId.id]);
	/**
	 * Method used for set value from event data by id
	 */
	useEffect(() => {
		if (EventData && updateEventId.id) {
			const data = EventData?.fetchEvent?.data as SingleEventDataArr;
			setToggleEvents(data?.send_notification);
			formik
				.setValues({
					eventName: data?.event_name,
					description: data?.description,
					sendNotification: data?.send_notification,
					address: data?.address,
					startDate: getDateFormat(data?.start_date, DATE_FORMAT.DateHoursMinFormat),
					endDate: getDateFormat(data?.end_date, DATE_FORMAT.DateHoursMinFormat),
					isRecurring: data?.is_recurring == 'never' ? '0' : '1',
					recurrenceDate: data?.participant_mail_ids === null ? '' : getDateFormat(data?.recurrence_date, DATE_FORMAT.simpleDateFormat),
					participantMailIds: data?.participant_mail_ids === null || data?.participant_mail_ids.length === 0 ? '' : data?.participant_mail_ids.join(','),
				})
				.catch((err) => {
					toast.error(err);
				});
		}
	}, [EventData]);

	const formik = useFormik({
		initialValues,
		validationSchema: addEventValidationSchema,
		onSubmit: (values) => {
			const variables =
				values.isRecurring === '1'
					? {
							eventName: values.eventName,
							description: values.description,
							sendNotification: toggleEvents,
							address: values.address,
							startDate: values.startDate,
							endDate: values.endDate,
							isRecurring: 'daily',
							participantMailIds: values?.participantMailIds?.split(','),
							recurrenceDate: formik.values.recurrenceDate,
					  }
					: {
							eventName: values.eventName,
							description: values.description,
							sendNotification: toggleEvents,
							address: values.address,
							startDate: values.startDate,
							endDate: values.endDate,
							isRecurring: 'never',
							participantMailIds: values?.participantMailIds?.split(','),
					  };
			if (updateEventId.id) {
				updateEvent({
					variables: {
						updateEventId: parseInt(updateEventId.id),
						...variables,
					},
				})
					.then((res) => {
						const data = res.data as UpdateEventRes;
						if (data.updateEvent.meta.statusCode === 200) {
							toast.success(data.updateEvent.meta.message);
							formik.resetForm();
							onCancel();
						} else {
							toast.error(data.updateEvent.meta.message);
						}
					})
					.catch(() => {
						toast.error(t('Failed to update'));
					});
			} else {
				createEvent({
					variables: {
						...variables,
					},
				})
					.then((res) => {
						const data = res.data as CreateEventRes;
						if (data.createEvent.meta.statusCode === 200) {
							toast.success(data.createEvent.meta.message);
							navigate(`/${ROUTES.app}/${ROUTES.event}/list`);
							formik.resetForm();
						} else {
							toast.error(data.createEvent.meta.message);
						}
					})
					.catch(() => {
						toast.error(t('Failed to create'));
					});
			}
		},
	});
	/**
	 * on clicking cancel it will redirect to main events page
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.event}/list`);
	}, []);
	const getErrorEvents = (fieldName: keyof CreateEvent) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};
	const OnBlurEvent = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	return (
		<div>
			<WithTranslateFormErrors errors={formik.errors} touched={formik.touched} setFieldTouched={formik.setFieldTouched}>
				<form className='w-full bg-white shadow-md rounded pt-6 mb-4 border border-[#c8ced3]' onSubmit={formik.handleSubmit}>
					<div className='flex justify-end pr-8 pb-2'>
						<p>
							{t('Fields marked with')} <span className='text-red-500'>*</span> {t('are mandatory.')}
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2  gap-6  px-8'>
						<div>
							<TextInput required={true} placeholder={t('Event Name')} name='eventName' onChange={formik.handleChange} label={t('Event Name')} value={formik.values.eventName} error={getErrorEvents('eventName')} onBlur={OnBlurEvent} />
						</div>
						<div>
							<label className='block text-gray-700 text-sm font-normal mb-2'>{t('Send Notifications')}</label>
							<div>
								<span
									onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
										e.preventDefault();
										setToggleEvents((prev) => !prev);
									}}
									className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
								>
									<label className='relative inline-flex items-center cursor-pointer '>
										<input type='checkbox' value={toggleEvents === true ? 1 : 0} className='sr-only peer' name='sendNotification' checked={toggleEvents} />
										<div className={'w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-700 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary'}></div>
									</label>
								</span>
							</div>
						</div>
						<div>
							<label className='block text-gray-700 text-sm font-normal mb-2' htmlFor='password'>
								{t('Description')} <span className='text-red-500'>*</span>
							</label>

							<div className={'  shadow appearance-none   border rounded w-full  text-gray-700 flex items-center'}>
								<textarea className={'w-full py-2 px-3'} id='Description' placeholder={`${t('Description')}`} name='description' onChange={formik.handleChange} value={formik.values.description} rows={2} cols={50} onBlur={OnBlurEvent}></textarea>
							</div>

							{formik.errors.description != undefined && formik.touched.description && <p className='error'>{t(formik.errors.description)}</p>}
						</div>

						<div>
							<label className='block text-gray-700 text-sm font-normal mb-2' htmlFor='Address'>
								{t('Address')} <span className='text-red-500 '>*</span>
							</label>

							<div className=' shadow appearance-none   border rounded w-full  text-gray-700 flex items-center'>
								<textarea className={'w-full py-2 px-3'} id='Address' placeholder={`${t('Address')}`} name='address' onChange={formik.handleChange} value={formik.values.address} rows={2} cols={50} onBlur={OnBlurEvent}></textarea>
							</div>

							{formik.errors.address != undefined && formik.touched.address ? <p className='error'>{t(formik.errors.address)}</p> : ''}
						</div>

						<div>
							<TextInput required={true} type='datetime-local' id='startDate' placeholder={t('Start Date')} name='startDate' onChange={formik.handleChange} label={t('Start Date')} value={formik.values.startDate} error={getErrorEvents('startDate')} min={updateEventId.id ? `${formik.values.startDate}` : moment().format(DATE_FORMAT.DateHoursMinFormat)} disabled={!!updateEventId.id} />
						</div>
						<div>
							<TextInput required={true} type='datetime-local' placeholder={t('End Date')} name='endDate' id='endDate' onChange={formik.handleChange} label={t('End Date')} value={formik.values.endDate} min={formik.values.startDate} error={formik.values.startDate && getErrorEvents('endDate')} disabled={!formik.values.startDate} />
						</div>
						<div>
							<RadioButtonNew
								id='isRecurring'
								checked={formik.values.isRecurring}
								onChange={formik.handleChange}
								name={'isRecurring'}
								radioOptions={[
									{ name: t('Never'), key: 0 },
									{ name: t('Daily'), key: 1 },
								]}
								label={t('Recurrence')}
								required={true}
							/>
						</div>
						<div>{formik.values.isRecurring == '1' && <TextInput type='date' id='recurrenceDate' placeholder={t('recurrenceDate')} name='recurrenceDate' onChange={formik.handleChange} label={t('Recurrence Date')} value={formik.values.recurrenceDate} disabled={!(formik.values.startDate && formik.values.endDate)} />}</div>
						<div>
							{EventData && updateEventId.id && (
								<div className='mb-4'>
									<TextInput type='text' id='participantMailIds' placeholder={t('Email')} name='participantMailIds' onChange={formik.handleChange} onBlur={OnBlurEvent} label={t('Add Participants')} value={formik.values.participantMailIds} />
								</div>
							)}
						</div>
					</div>
					<div className='btn-group col-span-3 flex items-center py-3 px-5  justify-start bg-slate-100   border border-[#c8ced3]'>
						<Button className='btn-primary btn-normal' type='submit' label={updateEventId?.id ? t('Update') : t('Save')} 
						title={`${updateEventId?.id ? t('Update') : t('Save')}`}>
							<CheckCircle className='mr-2 text-white ' />
						</Button>
						<Button className='btn-warning btn-normal ' label={t('Cancel')} onClick={onCancel} title={`${t('Cancel')}`}>
							<Cross className='mr-1 fill-white' />
						</Button>
					</div>
				</form>
			</WithTranslateFormErrors>
		</div>
	);
};
export default EditEvent;
