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
import { AddEditTopicData, CreateTopic } from 'src/types/topic';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Loader } from '@components/index';
import { CHARACTERS_LIMIT } from '@config/constant';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';

enum FieldNames {
	levelId = 'levelId',
	name = 'name',
	namePinging = 'namePinging',
	nameTraditionalChinese = 'nameTraditionalChinese',
	nameSimplifiedChinese = 'nameSimplifiedChinese',
	rewardStars = 'rewardStars',
}
const AddEditTopic = ({ onSubmit, onClose, editData }: AddEditTopicData) => {
	const params = useParams();
	const [loaderTopic, setLoaderTopic] = useState(false);

	const getTopicData = () => {
		if (editData) {
			setLoaderTopic(true);
			APIService.getData(`${URL_PATHS.topic}/${editData.uuid}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						formik.setFieldValue(FieldNames.name, editData?.name);
						formik.setFieldValue(FieldNames.namePinging, editData?.namePinging);
						formik.setFieldValue(FieldNames.nameTraditionalChinese, editData?.nameTraditionalChinese);
						formik.setFieldValue(FieldNames.nameSimplifiedChinese, editData?.nameSimplifiedChinese);
						formik.setFieldValue(FieldNames.rewardStars, response.data.data.rewardStars);
					} else {
						toast.error(response.data.message);
					}
					setLoaderTopic(false);
				})
				.catch((err) => {
					toast.error(err.response.data.message);
					setLoaderTopic(false);
				});
		}
	};

	/**
	 * Method used for setValue from subAdmin data by id
	 */
	useEffect(() => {
		getTopicData();
	}, []);

	const initialValues: CreateTopic = {
		[FieldNames.levelId]: params.levelId as string,
		[FieldNames.name]: '',
		[FieldNames.namePinging]: '',
		[FieldNames.nameSimplifiedChinese]: '',
		[FieldNames.nameTraditionalChinese]: '',
		[FieldNames.rewardStars]: 3,
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
		};
		return Yup.object<ObjectShape>(obj);
	};

	const validationSchema = getObj();
	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			setLoaderTopic(true);
			if (editData) {
				APIService.putData(`${URL_PATHS.topic}/${editData.uuid}`, { ...values, name: values.name.trim() })
					.then((response) => {
						if (response.status === ResponseCode.created || ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						} else {
							toast.error(response?.data?.message);
						}
						setLoaderTopic(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderTopic(false);
					});
			} else {
				APIService.postData(`${URL_PATHS.topic}`, { ...values, name: values.name.trim() })
					.then((response) => {
						if (response.status === ResponseCode.created || ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						} else {
							toast.error(response?.data?.message);
						}
						setLoaderTopic(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderTopic(false);
					});
			}
		},
	});

	const getTopicError = (fieldName: keyof CreateTopic) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	const copyData = useCallback(() => {
		formik.values.nameTraditionalChinese !== '' && formik.setFieldValue(FieldNames.nameSimplifiedChinese, formik.values.nameTraditionalChinese);
	}, [formik]);

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					<h4>{editData !== null ? 'Edit' : 'Add'} Topic</h4>
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{loaderTopic && <Loader />}

				{/* <!-- Modal Header End --> */}
				<form className='w-[90vw] md:w-[75vw] lg:w-[40vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2'>
							<div className='mb-4'>
								<TextInput placeholder='Topic name' name={FieldNames.name} onChange={formik.handleChange} label='Topic name (English)' value={formik.values.name} error={getTopicError(FieldNames.name)} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Topic name' name={FieldNames.namePinging} onChange={formik.handleChange} label='Topic name (Pinyin chinese)' value={formik.values.namePinging} error={getTopicError(FieldNames.namePinging)} required />
							</div>
							<div className='mb-4 flex sm:flex-row flex-col items-start sm:items-end sm:col-span-2 gap-3'>
								<div className='w-full'>
									<TextInput placeholder='Topic name' name={FieldNames.nameTraditionalChinese} onChange={formik.handleChange} label='Topic name (Traditional chinese)' value={formik.values.nameTraditionalChinese} error={getTopicError(FieldNames.nameTraditionalChinese)} required />
								</div>
								<Button className='btn-default h-[38px]' onClick={copyData}>
									<AngleRight />
								</Button>
								<div className='w-full'>
									<TextInput placeholder='Topic name' name={FieldNames.nameSimplifiedChinese} onChange={formik.handleChange} label='Topic name (Simplified chinese)' value={formik.values.nameSimplifiedChinese} error={getTopicError(FieldNames.nameSimplifiedChinese)} required />
								</div>
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

export default AddEditTopic;
