import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import TextInput from '@components/textInput/TextInput';
import { AddEditActivitiesData } from 'src/types/activities';
import CheckBox from '@components/checkbox/CheckBox';
import { useParams } from 'react-router-dom';
import { APIService } from '@framework/services/api';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { AngleRight, PlusCircle } from '@components/icons';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import { Errors, MESSAGES } from '@config/errors';
import FileUpload from '@components/fileUpload/FileUpload';
import { CHARACTERS_LIMIT, ENGLISH_CODE, FILE_TYPE, MAX_GIF_DIMENSION, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE, activityPaths } from '@config/constant';
import { FieldNames, ResponseCode } from 'src/interfaces/enum';
import { generateUuid, getGifDimensions, moveData, resetInputManually, translateText } from '@utils/helpers';
import TextArea from '@components/textArea/TextArea';
import { Uploader } from './utils/upload';
import DndStrokeOrder from './DndStrokeOrder';
import { CreateStrokeOrderActivity, StrokeOrderSubmitData, strokeOrderSubmitList } from 'src/types/activities/strokeOrder';
import CommonButton from '@components/common/CommonButton';

const ActivityStrokeOrder = ({ onSubmit, onClose, url, activityUuid, toggleActivity, isMoving, levelId, topicId, lessonId }: AddEditActivitiesData) => {
	const params = useParams();

	const [loadingStrokeOrder, setLoadingStrokeOrder] = useState<boolean>(false);
	const [provideSkipStrokeOrder, setProvideSkipStrokeOrder] = useState<boolean>(false);
	const [simplifiedResponseFileUrlStrokeOrder, setSimplifiedResponseFileUrlStrokeOrder] = useState('');
	const [addedListStrokeOrder, setAddedListStrokeOrder] = useState<strokeOrderSubmitList[]>([]);
	const [editRecordStrokeOrder, setEditRecordStrokeOrder] = useState(false);
	const [editRecordStrokeOrderUuid, setEditRecordStrokeOrderUuid] = useState('');
	const [percentageStrokeOrder, setPercentageStrokeOrder] = useState(0);
	const [newOrderStrokeOrder, setNewOrderStrokeOrder] = useState<strokeOrderSubmitList[]>();

	useEffect(() => {
		if (newOrderStrokeOrder) {
			setAddedListStrokeOrder(newOrderStrokeOrder);
		}
	}, [newOrderStrokeOrder]);

	const updatePercentageStrokeOrder = (newPercentage: number) => {
		setPercentageStrokeOrder(newPercentage);
		newPercentage === 100 && setLoadingStrokeOrder(true);
	};

	/**
	 *@returns Method used for setValue from questions data and get the details of question by uuid
	 */
	useEffect(() => {
		if (params.activityId) {
			APIService.getData(`${url}/${activityPaths.strokeOrder}/${params.activityId}`).then((response) => {
				if (response.status === ResponseCode.success) {
					const { activityData, isSkippable, toggle } = response.data.data;
					toggleActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);
					setAddedListStrokeOrder(
						activityData.map((item: strokeOrderSubmitList) => {
							return { ...item, id: item.activityDataId };
						})
					);
					setProvideSkipStrokeOrder(isSkippable);
				}
			});
		}
	}, []);

	const initialValues: CreateStrokeOrderActivity = {
		[FieldNames.levelId]: params.levelId as string,
		[FieldNames.topicId]: params.topicId as string,
		[FieldNames.lessonId]: params.lessonId as string,
		[FieldNames.activityTypeId]: '',
		[FieldNames.leftTraditionalEnglish]: '',
		[FieldNames.leftTraditionalPinyin]: '',
		[FieldNames.leftTraditionalChinese]: '',
		[FieldNames.rightTraditionalEnglish]: '',
		[FieldNames.rightTraditionalPinyin]: '',
		[FieldNames.rightTraditionalChinese]: '',
		[FieldNames.leftSimplifiedEnglish]: '',
		[FieldNames.leftSimplifiedPinyin]: '',
		[FieldNames.leftSimplifiedChinese]: '',
		[FieldNames.simplifiedFileUrl]: '',
		[FieldNames.rightSimplifiedEnglish]: '',
		[FieldNames.rightSimplifiedPinyin]: '',
		[FieldNames.rightSimplifiedChinese]: '',
		[FieldNames.htmlSourceCode]: '',
		[FieldNames.isSkippable]: provideSkipStrokeOrder,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit questions
	 */
	const getObjStrokeOrder = () => {
		const errorStrokeOrder = Yup.string().matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS);
		const obj: ObjectShape = {
			[FieldNames.leftSimplifiedEnglish]: errorStrokeOrder,
			[FieldNames.leftTraditionalEnglish]: errorStrokeOrder,
			[FieldNames.rightSimplifiedEnglish]: errorStrokeOrder,
			[FieldNames.rightTraditionalEnglish]: errorStrokeOrder,
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObjStrokeOrder();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			setLoadingStrokeOrder(true);
			const submitData: StrokeOrderSubmitData = {
				isMoving: isMoving,
				levelId: moveData(isMoving, levelId as string, values.levelId as string),
				topicId: moveData(isMoving, topicId as string, values.topicId),
				lessonId: moveData(isMoving, lessonId as string, values.lessonId),
				activityTypeId: activityUuid,
				activityData: addedListStrokeOrder.map(({ simplifiedFileUrl, id, ...rest }) => ({
					activityDataId: id,
					simplifiedFileUrl: simplifiedFileUrl.split('/').pop() as string,
					...rest,
				})),
				isSkippable: provideSkipStrokeOrder,
			};

			!params.activityId
				? APIService.postData(`${url}/${activityPaths.strokeOrderCreate}`, submitData)
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response.data.message);
							}
							setLoadingStrokeOrder(false);
							onClose();
							onSubmit();
						})
						.catch((error) => {
							toast.error(error.message);
							setLoadingStrokeOrder(false);
						})
				: APIService.putData(`${url}/${activityPaths.strokeOrderUpdate}/${params.activityId}`, submitData)
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response.data.message);
							}
							setLoadingStrokeOrder(false);
							onClose();
							onSubmit();
						})
						.catch((error) => {
							toast.error(error.message);
							setLoadingStrokeOrder(false);
						});
		},
	});

	/**
	 * @return method to add data to the list
	 */
	const addDataToListStrokeOrder = () => {
		if (formik.values.leftSimplifiedEnglish.trim() !== '' && formik.values.leftSimplifiedPinyin.trim() !== '' && formik.values.leftSimplifiedChinese.trim() !== '' && formik.values.leftTraditionalEnglish.trim() !== '' && formik.values.leftTraditionalPinyin.trim() !== '' && formik.values.leftTraditionalChinese.trim() !== '' && formik.values.simplifiedFileUrl !== '' && formik.values.rightSimplifiedEnglish.trim() !== '' && formik.values.rightSimplifiedPinyin.trim() !== '' && formik.values.rightSimplifiedChinese.trim() !== '' && formik.values.rightTraditionalEnglish.trim() !== '' && formik.values.rightTraditionalPinyin.trim() !== '' && formik.values.htmlSourceCode.trim() !== '' && formik.values.rightTraditionalChinese.trim() !== '' && simplifiedResponseFileUrlStrokeOrder) {
			formik.setTouched({
				[FieldNames.leftSimplifiedEnglish]: true,
				[FieldNames.rightSimplifiedEnglish]: true,

				[FieldNames.leftTraditionalEnglish]: true,
				[FieldNames.rightTraditionalEnglish]: true,
				[FieldNames.htmlSourceCode]: true,
			});

			if (Object.keys(formik.errors).length === 0) {
				setAddedListStrokeOrder([
					...addedListStrokeOrder,
					{
						id: generateUuid(),
						leftTraditionalTitleEnglish: formik.values.leftTraditionalEnglish,
						leftTraditionalTitlePinyin: formik.values.leftTraditionalPinyin,
						leftTraditionalTitleChinese: formik.values.leftTraditionalChinese,

						leftSimplifiedTitleEnglish: formik.values.leftSimplifiedEnglish,
						leftSimplifiedTitlePinyin: formik.values.leftSimplifiedPinyin,
						leftSimplifiedTitleChinese: formik.values.leftSimplifiedChinese,
						simplifiedFileUrl: simplifiedResponseFileUrlStrokeOrder,

						rightTraditionalTitleEnglish: formik.values.rightTraditionalEnglish,
						rightTraditionalTitlePinyin: formik.values.rightTraditionalPinyin,
						rightTraditionalTitleChinese: formik.values.rightTraditionalChinese,

						rightSimplifiedTitleEnglish: formik.values.rightSimplifiedEnglish,
						rightSimplifiedTitlePinyin: formik.values.rightSimplifiedPinyin,
						rightSimplifiedTitleChinese: formik.values.rightSimplifiedChinese,

						htmlSourceCode: formik.values.htmlSourceCode,
					},
				]);
				setSimplifiedResponseFileUrlStrokeOrder('');
				formik.resetForm();
				resetInputManually(['strokeOrderGif']);
			} else {
				formik.validateForm();
			}
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
	};

	/**
	 * @return method to Update data to the list
	 */
	const updateRecordStrokeOrder = () => {
		if (formik.values.leftSimplifiedEnglish.trim() !== '' && formik.values.leftSimplifiedPinyin.trim() !== '' && formik.values.leftSimplifiedChinese.trim() !== '' && formik.values.leftTraditionalEnglish.trim() !== '' && formik.values.leftTraditionalPinyin.trim() !== '' && formik.values.leftTraditionalChinese.trim() !== '' && formik.values.simplifiedFileUrl !== '' && formik.values.rightSimplifiedEnglish.trim() !== '' && formik.values.rightSimplifiedPinyin.trim() !== '' && formik.values.rightSimplifiedChinese.trim() !== '' && formik.values.rightTraditionalEnglish.trim() !== '' && formik.values.rightTraditionalPinyin.trim() !== '' && formik.values.htmlSourceCode !== '' && formik.values.rightTraditionalChinese.trim() !== '' && simplifiedResponseFileUrlStrokeOrder) {
			formik.setTouched({
				[FieldNames.leftSimplifiedEnglish]: true,
				[FieldNames.rightSimplifiedEnglish]: true,

				[FieldNames.leftTraditionalEnglish]: true,
				[FieldNames.rightTraditionalEnglish]: true,
				[FieldNames.htmlSourceCode]: true,
			});

			if (Object.keys(formik.errors).length === 0) {
				setAddedListStrokeOrder((prev) => {
					const updatedData = prev.map((item) => {
						if (item.id === editRecordStrokeOrderUuid) {
							const newData = {
								id: editRecordStrokeOrderUuid,
								leftTraditionalTitleEnglish: formik.values.leftTraditionalEnglish,
								leftTraditionalTitlePinyin: formik.values.leftTraditionalPinyin,
								leftTraditionalTitleChinese: formik.values.leftTraditionalChinese,

								leftSimplifiedTitleEnglish: formik.values.leftSimplifiedEnglish,
								leftSimplifiedTitlePinyin: formik.values.leftSimplifiedPinyin,
								leftSimplifiedTitleChinese: formik.values.leftSimplifiedChinese,
								simplifiedFileUrl: simplifiedResponseFileUrlStrokeOrder,

								rightSimplifiedTitleEnglish: formik.values.rightSimplifiedEnglish,
								rightSimplifiedTitlePinyin: formik.values.rightSimplifiedPinyin,
								rightSimplifiedTitleChinese: formik.values.rightSimplifiedChinese,

								rightTraditionalTitleEnglish: formik.values.rightTraditionalEnglish,
								rightTraditionalTitlePinyin: formik.values.rightTraditionalPinyin,
								rightTraditionalTitleChinese: formik.values.rightTraditionalChinese,

								htmlSourceCode: formik.values.htmlSourceCode,
							};
							return { ...item, ...newData };
						} else {
							return item;
						}
					});
					return updatedData;
				});
				setSimplifiedResponseFileUrlStrokeOrder('');
				setEditRecordStrokeOrder(false);
				formik.resetForm();
				resetInputManually(['strokeOrderGif']);
			} else {
				formik.validateForm();
			}
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
	};

	/**
	 *
	 * @returns Method used to Copy data from left to right form
	 */
	const copyDataStrokeOrder = useCallback(() => {
		translateText(formik.values.leftTraditionalChinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
			// traditional to simplified
			formik.setFieldValue(FieldNames.leftSimplifiedChinese, data ?? data);
			formik.setFieldValue(FieldNames.leftSimplifiedPinyin, data ?? data);
		});
		translateText(formik.values.rightTraditionalChinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
			// traditional to simplified
			formik.setFieldValue(FieldNames.rightSimplifiedChinese, data ?? data);
			formik.setFieldValue(FieldNames.rightSimplifiedPinyin, data ?? data);
		});
		formik.values.leftTraditionalEnglish !== '' && formik.setFieldValue(FieldNames.leftSimplifiedEnglish, formik.values.leftTraditionalEnglish);
		formik.values.rightTraditionalEnglish !== '' && formik.setFieldValue(FieldNames.rightSimplifiedEnglish, formik.values.rightTraditionalEnglish);
	}, [formik]);

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const fileUpdateStrokeOrder = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const fileStrokeOrder = event.target.files?.[0];
		if (fileStrokeOrder === undefined) {
			return;
		}
		const fileName = event.target.name;
		const lastIndex = fileStrokeOrder?.name?.lastIndexOf('.');
		const extension = fileStrokeOrder?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (fileStrokeOrder?.type !== FILE_TYPE.gifType) {
			toast.error(Errors.PLEASE_SELECT_GIF);
			return;
		}
		fileStrokeOrder.type === FILE_TYPE.gifType &&
			getGifDimensions(fileStrokeOrder, (dimensions) => {
				// dimensions.width
				if (dimensions.width > MAX_GIF_DIMENSION || dimensions.height > MAX_GIF_DIMENSION) {
					toast.error(`${Errors.maxGifDimensions} ${MAX_GIF_DIMENSION}X${MAX_GIF_DIMENSION}.`);
					return false;
				} else {
					const gif = document.createElement('img');
					const blob = URL.createObjectURL(fileStrokeOrder);
					gif.src = blob;
					gif.addEventListener('load', () => {
						const gifUploaderOptions = {
							fileName: name,
							file: fileStrokeOrder,
							isForSeasonal: false,
							isForSop: false,
						};
						if (fileName === FieldNames.simplifiedFileUrl) {
							const uploader = new Uploader(gifUploaderOptions, updatePercentageStrokeOrder);
							uploader.start();
							formik.setFieldValue(FieldNames.simplifiedFileUrl, uploader.fileName);
							uploader.onComplete((response: string) => {
								setLoadingStrokeOrder(false);
								setSimplifiedResponseFileUrlStrokeOrder(response);
							});
						}
					});
				}
			});
	}, []);

	/**
	 *
	 * @returns Method used to Delete Selected record.
	 */
	const deleteCurrentRecordStrokeOrder = useCallback(
		(id: string) => {
			setAddedListStrokeOrder(addedListStrokeOrder?.filter((item) => item.id !== id));
		},
		[addedListStrokeOrder]
	);

	/**
	 *
	 * @returns Method used to Edit Selected record.
	 */
	const editCurrentRecordStrokeOrder = useCallback(
		(id: string) => {
			const currentRecord = addedListStrokeOrder.filter((item) => item.id === id);
			setEditRecordStrokeOrder(true);
			setEditRecordStrokeOrderUuid(id);

			formik.setFieldValue(FieldNames.leftSimplifiedEnglish, currentRecord[0].leftSimplifiedTitleEnglish);
			formik.setFieldValue(FieldNames.leftSimplifiedPinyin, currentRecord[0].leftSimplifiedTitlePinyin);
			formik.setFieldValue(FieldNames.leftSimplifiedChinese, currentRecord[0].leftSimplifiedTitleChinese);

			formik.setFieldValue(FieldNames.rightTraditionalEnglish, currentRecord[0].rightTraditionalTitleEnglish);
			formik.setFieldValue(FieldNames.rightTraditionalPinyin, currentRecord[0].rightTraditionalTitlePinyin);
			formik.setFieldValue(FieldNames.rightTraditionalChinese, currentRecord[0].rightTraditionalTitleChinese);

			formik.setFieldValue(FieldNames.simplifiedFileUrl, currentRecord[0].simplifiedFileUrl);

			formik.setFieldValue(FieldNames.leftTraditionalEnglish, currentRecord[0].leftTraditionalTitleEnglish);
			formik.setFieldValue(FieldNames.leftTraditionalPinyin, currentRecord[0].leftTraditionalTitlePinyin);
			formik.setFieldValue(FieldNames.leftTraditionalChinese, currentRecord[0].leftTraditionalTitleChinese);

			formik.setFieldValue(FieldNames.rightSimplifiedEnglish, currentRecord[0].rightSimplifiedTitleEnglish);
			formik.setFieldValue(FieldNames.rightSimplifiedPinyin, currentRecord[0].rightSimplifiedTitlePinyin);
			formik.setFieldValue(FieldNames.rightSimplifiedChinese, currentRecord[0].rightSimplifiedTitleChinese);

			formik.setFieldValue(FieldNames.htmlSourceCode, currentRecord[0].htmlSourceCode);

			setSimplifiedResponseFileUrlStrokeOrder(currentRecord[0].simplifiedFileUrl);
		},
		[editRecordStrokeOrder, editRecordStrokeOrderUuid, simplifiedResponseFileUrlStrokeOrder, formik]
	);

	const addMoreStrokeOrder = useCallback(() => {
		!editRecordStrokeOrder ? addDataToListStrokeOrder() : updateRecordStrokeOrder();
	}, [editRecordStrokeOrder, addDataToListStrokeOrder, updateRecordStrokeOrder]);

	const getErrorStrokeOrder = (fieldName: keyof CreateStrokeOrderActivity) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	const translateLeftTraditionalChinese = useCallback(() => {
		translateText(formik.values.leftTraditionalChinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
			// traditional to english
			formik.setFieldValue(FieldNames.leftTraditionalEnglish, data ?? data);
			formik.setFieldValue(FieldNames.leftTraditionalPinyin, formik.values.leftTraditionalChinese);
		});
	}, [formik]);

	const translateRightTraditionalChinese = useCallback(() => {
		translateText(formik.values.rightTraditionalChinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
			// traditional to english
			formik.setFieldValue(FieldNames.rightTraditionalEnglish, data ?? data);
			formik.setFieldValue(FieldNames.rightTraditionalPinyin, formik.values.rightTraditionalChinese);
		});
	}, [formik]);

	return (
		<form className='w-full' onSubmit={formik.handleSubmit}>
			{loadingStrokeOrder && <Loader />}
			<div className={cn(ModelStyle['model__body'])}>
				<div className='flex flex-col md:flex-row gap-3 mb-4'>
					<div className='rounded border w-full'>
						<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Traditional Chinese</h6>
						<div className='p-3'>
							<p className='block text-gray-700 text-sm font-bold mb-0.5'>Left side</p>
							<div className='grid grid-cols-1 gap-x-4 p-3 bg-gray-50 rounded border'>
								<div className='flex space-x-1 items-start'>
									<div className='w-full'>
										<TextInput placeholder='Title in chinese' name={FieldNames.leftTraditionalChinese} onChange={formik.handleChange} label='Title (Chinese)' value={formik.values.leftTraditionalChinese} error={getErrorStrokeOrder(FieldNames.leftTraditionalChinese)} required />
									</div>

									<div className='mt-7'>
										<CommonButton data={null} dataHandler={translateLeftTraditionalChinese} isTranslate={true} title='Translate' />
									</div>

									<div className='w-full'>
										<TextInput placeholder='Title in english' name={FieldNames.leftTraditionalEnglish} onChange={formik.handleChange} label='Title (English)' value={formik.values.leftTraditionalEnglish} error={getErrorStrokeOrder(FieldNames.leftTraditionalEnglish)} required />
									</div>
									<div className='w-full'>
										<TextInput placeholder='Title in pinyin' name={FieldNames.leftTraditionalPinyin} onChange={formik.handleChange} label='Title (Pinyin)' value={formik.values.leftTraditionalPinyin} error={getErrorStrokeOrder(FieldNames.leftTraditionalPinyin)} required />
									</div>
								</div>
							</div>
						</div>
						<div className='p-3'>
							<p className='block text-gray-700 text-sm font-bold mb-0.5'>Right side</p>
							<div className='grid grid-cols-1 gap-x-4 p-3 bg-gray-50 rounded border'>
								<div className='flex space-x-1 items-start'>
									<div className='w-full'>
										<TextInput placeholder='Title in chinese' name={FieldNames.rightTraditionalChinese} onChange={formik.handleChange} label='Title (Chinese)' value={formik.values.rightTraditionalChinese} error={getErrorStrokeOrder(FieldNames.rightTraditionalChinese)} required />
									</div>

									<div className='mt-7'>
										<CommonButton data={null} dataHandler={translateRightTraditionalChinese} isTranslate={true} title='Translate' />
									</div>

									<div className='w-full'>
										<TextInput placeholder='Title in english' name={FieldNames.rightTraditionalEnglish} onChange={formik.handleChange} label='Title (English)' value={formik.values.rightTraditionalEnglish} error={getErrorStrokeOrder(FieldNames.rightTraditionalEnglish)} required />
									</div>

									<div className='w-full'>
										<TextInput placeholder='Title in pinyin' name={FieldNames.rightTraditionalPinyin} onChange={formik.handleChange} label='Title (Pinyin)' value={formik.values.rightTraditionalPinyin} error={getErrorStrokeOrder(FieldNames.rightTraditionalPinyin)} required />
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='flex flex-col justify-center items-center p-3'>
						<Button className='btn-default btn-large' title='Copy' onClick={copyDataStrokeOrder}>
							<AngleRight className='text-md' />
						</Button>
						<span className='mt-1 text-gray-500'>Copy</span>
					</div>
					<div className='rounded border w-full'>
						<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Simplified Chinese</h6>
						<div className='p-3'>
							<p className='block text-gray-700 text-sm font-bold mb-0.5'>Left side</p>
							<div className='grid grid-cols-3 gap-x-4 p-3 bg-gray-50 rounded border'>
								<TextInput placeholder='Title in chinese' name={FieldNames.leftSimplifiedChinese} onChange={formik.handleChange} label='Title (Chinese)' value={formik.values.leftSimplifiedChinese} error={getErrorStrokeOrder(FieldNames.leftSimplifiedChinese)} required />

								<TextInput placeholder='Title in english' name={FieldNames.leftSimplifiedEnglish} onChange={formik.handleChange} label='Title (English)' value={formik.values.leftSimplifiedEnglish} error={getErrorStrokeOrder(FieldNames.leftSimplifiedEnglish)} required />

								<TextInput placeholder='Title in pinyin' name={FieldNames.leftSimplifiedPinyin} onChange={formik.handleChange} label='Title (Pinyin)' value={formik.values.leftSimplifiedPinyin} error={getErrorStrokeOrder(FieldNames.leftSimplifiedPinyin)} required />
							</div>
						</div>
						<div className='p-3'>
							<p className='block text-gray-700 text-sm font-bold mb-0.5'>Right side</p>
							<div className='grid grid-cols-3 gap-x-4 p-3 bg-gray-50 rounded border'>
								<TextInput placeholder='Title in chinese' name={FieldNames.rightSimplifiedChinese} onChange={formik.handleChange} label='Title (Chinese)' value={formik.values.rightSimplifiedChinese} error={getErrorStrokeOrder(FieldNames.rightSimplifiedChinese)} required />

								<TextInput placeholder='Title in english' name={FieldNames.rightSimplifiedEnglish} onChange={formik.handleChange} label='Title (English)' value={formik.values.rightSimplifiedEnglish} error={getErrorStrokeOrder(FieldNames.rightSimplifiedEnglish)} required />

								<TextInput placeholder='Title in pinyin' name={FieldNames.rightSimplifiedPinyin} onChange={formik.handleChange} label='Title (Pinyin)' value={formik.values.rightSimplifiedPinyin} error={getErrorStrokeOrder(FieldNames.rightSimplifiedPinyin)} required />
							</div>
						</div>
					</div>
				</div>
				<div className=' grid grid-cols-1 md:grid-cols-2 gap-x-24'>
					<div className='mb-4'>
						<TextArea id={FieldNames.htmlSourceCode} label='HTML Source Code' placeholder='HTML Source Code' name={FieldNames.htmlSourceCode} onChange={formik.handleChange} value={formik.values.htmlSourceCode} error={formik.errors.htmlSourceCode && formik.touched.htmlSourceCode ? formik.errors.htmlSourceCode : ''} note={MESSAGES.HTML_CODE_NOTE} required />
					</div>
					<div className='mb-4'>
						<FileUpload
							labelName='Upload gif file (Simplified)'
							id='strokeOrderGif'
							imageSource={simplifiedResponseFileUrlStrokeOrder}
							name={FieldNames.simplifiedFileUrl}
							error={formik.errors.simplifiedFileUrl && formik.touched.simplifiedFileUrl ? formik.errors.simplifiedFileUrl : ''}
							uploadType={FILE_TYPE.gifType}
							acceptNote='gif file only'
							accepts={FILE_TYPE.gifType}
							onChange={useCallback((e) => {
								fileUpdateStrokeOrder(e);
							}, [])}
						/>
						{percentageStrokeOrder !== 0 && percentageStrokeOrder !== 100 && (
							<div className='progress bg-gray-100 flex items-center w-full rounded-lg h-2 mt-3'>
								<span className='h-full rounded-lg bg-success w-0' style={{ width: `${percentageStrokeOrder}%` }}></span>
								<span className='ml-3 font-medium'>{percentageStrokeOrder}%</span>
							</div>
						)}
					</div>
				</div>
				<div className='flex justify-center'>
					<Button className='btn-primary mb-5 btn-large' onClick={addMoreStrokeOrder}>
						<PlusCircle className='mr-2' /> {editRecordStrokeOrder ? 'Update data' : 'Add New'}
					</Button>
				</div>
				<div className='overflow-auto w-full'>
					<table>
						<thead>
							<tr>
								<th></th>
								<th>Title English</th>
								<th>Title Pinyin</th>
								<th>Title Chinese</th>
								<th>Traditional File</th>
								<th>Simplified File</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{addedListStrokeOrder && <DndStrokeOrder editDisable={editRecordStrokeOrder} dndItemRow={addedListStrokeOrder} editRecord={editCurrentRecordStrokeOrder} deleteStrokeOrder={deleteCurrentRecordStrokeOrder} setNewOrder={setNewOrderStrokeOrder} />}
							{!addedListStrokeOrder.length && (
								<tr>
									<td colSpan={7} className='text-center font-medium py-5 text-gray-400'>
										No Data Added
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
			<div className='flex justify-end gap-2 items-center'>
				<CheckBox
					option={[
						{
							id: 'provideSkipStrokeOrder',
							name: 'Provide skip button for this activity',
							value: 'Provide skip button for this activity',
							checked: provideSkipStrokeOrder,
							onChange: () => {
								setProvideSkipStrokeOrder((prev) => !prev);
							},
						},
					]}
				/>
				<Button className='btn-primary btn-large w-28 justify-center' disabled={!addedListStrokeOrder.length || (percentageStrokeOrder !== 0 && percentageStrokeOrder !== 100)} type='submit'>
					{params.activityId ? 'Update' : 'Save'}
				</Button>
				<Button className='btn-default btn-large w-28 justify-center' onClick={onClose}>
					Cancel
				</Button>
			</div>
		</form>
	);
};

export default ActivityStrokeOrder;
