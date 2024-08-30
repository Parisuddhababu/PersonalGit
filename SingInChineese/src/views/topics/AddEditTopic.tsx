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
import { AddEditTopicData, CreateTopic } from 'src/types/topic';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Loader } from '@components/index';
import { numberRequired, stringMaxLimit, stringNoSpecialChar } from '@config/validations';
import CommonButton from '@components/common/CommonButton';
import { translateText } from '@utils/helpers';
import { ENGLISH_CODE, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE } from '@config/constant';

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
		const nameValidate = stringMaxLimit(Errors.PLEASE_ENTER_TOPIC_NAME);
		const obj: ObjectShape = {
			[FieldNames.name]: stringNoSpecialChar(Errors.PLEASE_ENTER_TOPIC_NAME),
			[FieldNames.namePinging]: nameValidate,
			[FieldNames.nameSimplifiedChinese]: nameValidate,
			[FieldNames.nameTraditionalChinese]: nameValidate,
			[FieldNames.rewardStars]: numberRequired(Errors.PLEASE_ENTER_NUMBER_OF_STARS),
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

	const translateTopiName = useCallback(async () => {
		await translateText(formik.values.nameTraditionalChinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
			// traditional to english
			formik.setFieldValue(FieldNames.name, data ?? data);
		});
		await translateText(formik.values.nameTraditionalChinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
			// traditional to simplified
			formik.setFieldValue(FieldNames.nameSimplifiedChinese, data ?? data);
			formik.setFieldValue(FieldNames.namePinging, formik.values.nameTraditionalChinese);
		});
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
						<div className='mb-4 flex space-x-1 col-span-2'>
							<div className='w-full'>
								<TextInput placeholder='Topic name' name={FieldNames.nameTraditionalChinese} onChange={formik.handleChange} label='Traditional Chinese' value={formik.values.nameTraditionalChinese} error={getTopicError(FieldNames.nameTraditionalChinese)} required />
							</div>
							<div className='mt-7'>
								<CommonButton data={null} dataHandler={translateTopiName} isTranslate={true} title='Translate' />
							</div>
							<div className='w-full'>
								<TextInput placeholder='Topic name' name={FieldNames.nameSimplifiedChinese} onChange={formik.handleChange} label='Simplified Chinese' value={formik.values.nameSimplifiedChinese} error={getTopicError(FieldNames.nameSimplifiedChinese)} required />
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-x-2'>
							<div className='mb-4'>
								<TextInput placeholder='Topic name' name={FieldNames.name} onChange={formik.handleChange} label='English' value={formik.values.name} error={getTopicError(FieldNames.name)} required />
							</div>
							<div className='mb-4'>
								<TextInput placeholder='Topic name' name={FieldNames.namePinging} onChange={formik.handleChange} label='Pinyin' value={formik.values.namePinging} error={getTopicError(FieldNames.namePinging)} required />
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
