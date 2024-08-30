import React, { useCallback, useEffect, useState } from 'react';
import Button from '@components/button/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import { Errors } from '@config/errors';
import { AngleRight, Cross } from '@components/icons';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { ObjectShape } from 'yup/lib/object';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { IMAGE_NOTE, CHARACTERS_LIMIT, FILE_TYPE, IMAGE_SIZE } from '@config/constant';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import FileUpload from '@components/fileUpload/FileUpload';
import { AddEditSeasonalTopicData, CreateSeasonalTopic } from 'src/types/seasonalTopics';
import moment from 'moment';
import { keyDownEvent } from '@utils/helpers';

enum FieldNames {
	name = 'name',
	namePinging = 'namePinging',
	nameTraditionalChinese = 'nameTraditionalChinese',
	nameSimplifiedChinese = 'nameSimplifiedChinese',
	rewardStars = 'rewardStars',
	image = 'image',
	startDate = 'startDate',
	endDate = 'endDate',
	isForSeasonal = 'isForSeasonal',
}
const AddEditSeasonalTopic = ({ onSubmit, onClose, editData }: AddEditSeasonalTopicData) => {
	const [loaderSeasonalTopic, setLoaderSeasonalTopic] = useState<boolean>(false);
	const [image, setImage] = useState<string>('');
	const [error, setError] = useState<boolean>(false);
	const minDate = () => {
		const today = new Date().toISOString().split('T')[0];
		return today;
	};

	const getSeasonalTopicData = () => {
		if (editData) {
			setLoaderSeasonalTopic(true);
			APIService.getData(`${URL_PATHS.topic}/${editData.uuid}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						formik.setFieldValue(FieldNames.name, editData?.name);
						formik.setFieldValue(FieldNames.namePinging, editData?.namePinging);
						formik.setFieldValue(FieldNames.nameTraditionalChinese, editData?.nameTraditionalChinese);
						formik.setFieldValue(FieldNames.nameSimplifiedChinese, editData?.nameSimplifiedChinese);
						formik.setFieldValue(FieldNames.rewardStars, editData.rewardStars);
						formik.setFieldValue(FieldNames.image, editData.image);
						setImage(editData?.image);
						formik.setFieldValue(FieldNames.startDate, moment(editData.startDate).utc().format('YYYY-MM-DD'));
						formik.setFieldValue(FieldNames.endDate, moment(editData.endDate).utc().format('YYYY-MM-DD'));
					} else {
						toast.error(response?.data.message);
					}
					setLoaderSeasonalTopic(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data.message);
					setLoaderSeasonalTopic(false);
				});
		}
	};

	/**
	 * Method used for setValue from seasonal topic data by id
	 */
	useEffect(() => {
		getSeasonalTopicData();
	}, []);

	const initialValues: CreateSeasonalTopic = {
		[FieldNames.name]: '',
		[FieldNames.namePinging]: '',
		[FieldNames.nameSimplifiedChinese]: '',
		[FieldNames.nameTraditionalChinese]: '',
		[FieldNames.rewardStars]: 3,
		[FieldNames.image]: null,
		[FieldNames.startDate]: '',
		[FieldNames.endDate]: '',
		[FieldNames.isForSeasonal]: true,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit subAdmin
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.name]: Yup.string().trim().required(Errors.PLEASE_ENTER_TOPIC_NAME).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED),
			[FieldNames.namePinging]: Yup.string().trim().required(Errors.PLEASE_ENTER_TOPIC_NAME).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.nameSimplifiedChinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_TOPIC_NAME).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.nameTraditionalChinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_TOPIC_NAME).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.rewardStars]: Yup.number().required(Errors.PLEASE_ENTER_NUMBER_OF_STARS),
			[FieldNames.image]: editData
				? Yup.string().notRequired()
				: Yup.mixed()
						.required(Errors.IMAGE_IS_REQUIRED)
						.test('fileFormat', Errors.UNSUPPORTED_FILE_FORMAT, (value) => value && ['image/jpeg', 'image/png'].includes(value.type))
						.test('fileSize', Errors.FILE_SIZE, (value) => value && value.size <= IMAGE_SIZE),
			[FieldNames.startDate]: Yup.date().required(Errors.PLEASE_ENTER_START_DATE),
			[FieldNames.endDate]: Yup.date().required(Errors.PLEASE_ENTER_END_DATE),
		};
		return Yup.object<ObjectShape>(obj);
	};

	const validationSchema = getObj();
	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			setLoaderSeasonalTopic(true);
			if (editData) {
				APIService.patchData(
					`${URL_PATHS.seasonalTopics}/${editData.uuid}`,
					{ ...values, name: values.name.trim() },
					{
						'Content-Type': 'multipart/form-data',
					}
				)
					.then((response) => {
						if (response.status === ResponseCode.created || ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						} else {
							toast.error(response?.data?.message);
						}
						setLoaderSeasonalTopic(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderSeasonalTopic(false);
					});
			} else {
				APIService.postData(
					`${URL_PATHS.seasonalTopics}`,
					{ ...values, name: values.name.trim() },
					{
						'Content-Type': 'multipart/form-data',
					}
				)
					.then((response) => {
						if (response.status === ResponseCode.created || ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						} else {
							toast.error(response?.data?.message);
						}
						setLoaderSeasonalTopic(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderSeasonalTopic(false);
					});
			}
		},
	});

	const getSeasonalTopicError = (fieldName: keyof CreateSeasonalTopic) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	const imageHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (editData) {
			if (file && file.size <= IMAGE_SIZE && (file.type === FILE_TYPE.pngType || file?.type === FILE_TYPE.jpegType)) {
				formik.setFieldValue(FieldNames.image, file);
				setImage(URL.createObjectURL(file));
				setError(false);
			} else {
				setError(true);
			}
		} else if (file) {
			formik.setFieldValue(FieldNames.image, file);
			setImage(URL.createObjectURL(file));
		}
	}, []);

	const copyData = useCallback(() => {
		formik.values.nameTraditionalChinese !== '' && formik.setFieldValue(FieldNames.nameSimplifiedChinese, formik.values.nameTraditionalChinese);
	}, [formik.values]);

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					<h4>{editData !== null ? 'Edit' : 'Add'} Seasonal Topic</h4>
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{loaderSeasonalTopic && <Loader />}

				{/* <!-- Modal Header End --> */}
				<form className='w-[90vw] md:w-[75vw] lg:w-[60vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='mb-4'>
							<FileUpload labelName='Topic image' id='topicImage' imageSource={image} name={FieldNames.image} error={formik.errors.image && formik.touched.image ? formik.errors.image : ''} acceptNote={IMAGE_NOTE} accepts='image/png, image/jpeg' onChange={imageHandler} uploadType={FILE_TYPE.jpegType || FILE_TYPE.jpgType || FILE_TYPE.pngType} />
							{error && <p className='text-error mt-2 text-sm'>{Errors.FILE_FORMAT_AND_SIZE}</p>}
						</div>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-2'>
							<div className='mb-4'>
								<TextInput placeholder='Topic name' name={FieldNames.name} onChange={formik.handleChange} label='Topic name (English)' value={formik.values.name} error={getSeasonalTopicError(FieldNames.name)} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Topic name' name={FieldNames.namePinging} onChange={formik.handleChange} label='Topic name (Pinyin chinese)' value={formik.values.namePinging} error={getSeasonalTopicError(FieldNames.namePinging)} required />
							</div>
							<div className='mb-4 flex sm:flex-row flex-col items-start sm:items-end sm:col-span-2 gap-3'>
								<div className='w-full'>
									<TextInput placeholder='Topic name' name={FieldNames.nameTraditionalChinese} onChange={formik.handleChange} label='Topic name (Traditional chinese)' value={formik.values.nameTraditionalChinese} error={getSeasonalTopicError(FieldNames.nameTraditionalChinese)} required />
								</div>
								<Button className='btn-default h-[38px]' onClick={copyData}>
									<AngleRight />
								</Button>
								<div className='w-full'>
									<TextInput placeholder='Topic name' name={FieldNames.nameSimplifiedChinese} onChange={formik.handleChange} label='Topic name (Simplified chinese)' value={formik.values.nameSimplifiedChinese} error={getSeasonalTopicError(FieldNames.nameSimplifiedChinese)} required />
								</div>
							</div>
							<div className='mb-4'>
								<TextInput type='date' placeholder='' name={FieldNames.startDate} onChange={formik.handleChange} label='Start date' value={formik.values.startDate} error={getSeasonalTopicError(FieldNames.startDate)} min={formik.values.startDate < minDate() && editData ? formik.values.startDate : minDate()} max={formik.values.endDate ? formik.values.endDate : ''} keyDown={keyDownEvent} required />
							</div>
							<div className='mb-4'>
								<TextInput type='date' placeholder='' disabled={!formik.values.startDate} name={FieldNames.endDate} onChange={formik.handleChange} label='End date' value={formik.values.endDate} error={getSeasonalTopicError(FieldNames.endDate)} min={formik.values.startDate ? formik.values.startDate : minDate()} required />
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

export default AddEditSeasonalTopic;
