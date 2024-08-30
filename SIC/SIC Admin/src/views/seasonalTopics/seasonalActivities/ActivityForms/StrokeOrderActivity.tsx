import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import TextInput from '@components/textInput/TextInput';
import CheckBox from '@components/checkbox/CheckBox';
import { useParams } from 'react-router-dom';
import { APIService } from '@framework/services/api';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { AngleRight, PlusCircle } from '@components/icons';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import { Errors, MESSAGES } from '@config/errors';
import FileUpload from '@components/fileUpload/FileUpload';
import { CHARACTERS_LIMIT, FILE_TYPE, MAX_GIF_DIMENSION } from '@config/constant';
import { ResponseCode } from 'src/interfaces/enum';
import { generateUuid, getGifDimensions, resetInputManually } from '@utils/helpers';
import { AddEditSeasonalActivityData } from 'src/types/seasonalTopics';
import TextArea from '@components/textArea/TextArea';
import { Uploader } from '@views/activities/utils/upload';
import { FieldNames } from '@views/activities/ActivityStrokeOrder';
import DndStrokeOrder from '@views/activities/DndStrokeOrder';
import { CreateStrokeOrderActivity, StrokeOrderSubmitData, strokeOrderSubmitList } from 'src/types/activities/strokeOrder';

const SeasonalActivityStrokeOrder = ({ onSubmit, onClose, url, activityUuid }: AddEditSeasonalActivityData) => {
	const params = useParams();

	const [loadingStrokeOrderSeasonal, setLoadingStrokeOrderSeasonal] = useState<boolean>(false);
	const [provideSkipStrokeOrderSeasonal, setProvideSkipStrokeOrderSeasonal] = useState<boolean>(false);
	const [simplifiedResponseFileUrlStrokeOrderSeasonal, setSimplifiedResponseFileUrlStrokeOrderSeasonal] = useState<string>('');
	const [addedListStrokeOrderSeasonal, setAddedListStrokeOrderSeasonal] = useState<strokeOrderSubmitList[]>([]);
	const [editRecordStrokeOrderSeasonal, setEditRecordStrokeOrderSeasonal] = useState(false);
	const [editRecordStrokeOrderSeasonalUuid, setEditRecordStrokeOrderSeasonalUuid] = useState('');
	const [percentageStrokeOrderSeasonal, setPercentageStrokeOrderSeasonal] = useState(0);
	const [newOrderStrokeOrderSeasonal, setNewOrderStrokeOrderSeasonal] = useState<strokeOrderSubmitList[]>();

	useEffect(() => {
		if (newOrderStrokeOrderSeasonal) {
			setAddedListStrokeOrderSeasonal(newOrderStrokeOrderSeasonal);
		}
	}, [newOrderStrokeOrderSeasonal]);

	const updatePercentageStrokeOrderSeasonal = (newPercentage: number) => {
		setPercentageStrokeOrderSeasonal(newPercentage);
		newPercentage === 100 && setLoadingStrokeOrderSeasonal(true);
	};
	/**
	 *@returns Method used for setValue from questions data and get the details of question by uuid
	 */
	useEffect(() => {
		if (params.activityId) {
			APIService.getData(`${url}/stroke-order/${params.activityId}?isForSeasonal=true`).then((response) => {
				if (response.status === ResponseCode.success) {
					const { activityData, isSkippable } = response.data.data;
					setAddedListStrokeOrderSeasonal(
						activityData.map((item: strokeOrderSubmitList) => {
							return { ...item, id: item.activityDataId };
						})
					);
					setProvideSkipStrokeOrderSeasonal(isSkippable);
				}
			});
		}
	}, [params.activityId]);

	const initialValues: CreateStrokeOrderActivity = {
		[FieldNames.topicId]: params.topicId as string,
		[FieldNames.lessonId]: params.lessonId as string,
		[FieldNames.activityTypeId]: '',
		[FieldNames.leftSimplifiedEnglish]: '',
		[FieldNames.leftSimplifiedPinyin]: '',
		[FieldNames.leftSimplifiedChinese]: '',
		[FieldNames.leftTraditionalEnglish]: '',
		[FieldNames.leftTraditionalPinyin]: '',
		[FieldNames.leftTraditionalChinese]: '',
		[FieldNames.simplifiedFileUrl]: '',
		[FieldNames.rightTraditionalEnglish]: '',
		[FieldNames.rightTraditionalPinyin]: '',
		[FieldNames.rightTraditionalChinese]: '',
		[FieldNames.rightSimplifiedEnglish]: '',
		[FieldNames.rightSimplifiedPinyin]: '',
		[FieldNames.rightSimplifiedChinese]: '',
		[FieldNames.htmlSourceCode]: '',
		[FieldNames.isSkippable]: provideSkipStrokeOrderSeasonal,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit questions
	 */
	const getObjStrokeOrderSeasonal = () => {
		const obj: ObjectShape = {
			[FieldNames.leftSimplifiedEnglish]: Yup.string().matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.leftTraditionalEnglish]: Yup.string().matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),

			[FieldNames.rightSimplifiedEnglish]: Yup.string().matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.rightTraditionalEnglish]: Yup.string().matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObjStrokeOrderSeasonal();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			setLoadingStrokeOrderSeasonal(true);
			const submitData: StrokeOrderSubmitData = {
				topicId: values.topicId,
				lessonId: values.lessonId,
				activityTypeId: activityUuid,
				activityData: addedListStrokeOrderSeasonal.map(({ simplifiedFileUrl, id, ...rest }) => ({
					activityDataId: id,
					simplifiedFileUrl: simplifiedFileUrl.split('/').pop() as string,
					...rest,
				})),
				isSkippable: values.isSkippable,
				isForSeasonal: true,
			};
			!params.activityId
				? APIService.postData(`${url}/stroke-order-create?isForSeasonal=true`, submitData)
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response.data.message);
							}
							setLoadingStrokeOrderSeasonal(false);
							onClose();
							onSubmit();
						})
						.catch((error) => {
							toast.error(error.message);
							setLoadingStrokeOrderSeasonal(false);
						})
				: APIService.putData(`${url}/stroke-order-update/${params.activityId}?isForSeasonal=true`, submitData)
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response.data.message);
							}
							setLoadingStrokeOrderSeasonal(false);
							onClose();
							onSubmit();
						})
						.catch((error) => {
							toast.error(error.message);
							setLoadingStrokeOrderSeasonal(false);
						});
		},
	});

	/**
	 * @return method to add data to the list
	 */
	const addDataToListStrokeOrderSeasonal = () => {
		if (formik.values.leftSimplifiedEnglish.trim() !== '' && formik.values.leftSimplifiedPinyin.trim() !== '' && formik.values.leftSimplifiedChinese.trim() !== '' && formik.values.leftTraditionalEnglish.trim() !== '' && formik.values.leftTraditionalPinyin.trim() !== '' && formik.values.leftTraditionalChinese.trim() !== '' && formik.values.simplifiedFileUrl !== '' && formik.values.rightSimplifiedEnglish.trim() !== '' && formik.values.rightSimplifiedPinyin.trim() !== '' && formik.values.rightSimplifiedChinese.trim() !== '' && formik.values.rightTraditionalEnglish.trim() !== '' && formik.values.rightTraditionalPinyin.trim() !== '' && formik.values.htmlSourceCode.trim() !== '' && formik.values.rightTraditionalChinese.trim() !== '' && simplifiedResponseFileUrlStrokeOrderSeasonal) {
			formik.setTouched({
				[FieldNames.leftSimplifiedEnglish]: true,
				[FieldNames.rightSimplifiedEnglish]: true,

				[FieldNames.leftTraditionalEnglish]: true,
				[FieldNames.rightTraditionalEnglish]: true,
				[FieldNames.htmlSourceCode]: true,
			});

			if (Object.keys(formik.errors).length === 0) {
				setAddedListStrokeOrderSeasonal([
					...addedListStrokeOrderSeasonal,
					{
						id: generateUuid(),
						rightTraditionalTitleEnglish: formik.values.rightTraditionalEnglish,
						rightTraditionalTitlePinyin: formik.values.rightTraditionalPinyin,
						rightTraditionalTitleChinese: formik.values.rightTraditionalChinese,

						simplifiedFileUrl: simplifiedResponseFileUrlStrokeOrderSeasonal,

						leftTraditionalTitleEnglish: formik.values.leftTraditionalEnglish,
						leftTraditionalTitlePinyin: formik.values.leftTraditionalPinyin,
						leftTraditionalTitleChinese: formik.values.leftTraditionalChinese,

						leftSimplifiedTitleEnglish: formik.values.leftSimplifiedEnglish,
						leftSimplifiedTitlePinyin: formik.values.leftSimplifiedPinyin,
						leftSimplifiedTitleChinese: formik.values.leftSimplifiedChinese,

						rightSimplifiedTitleEnglish: formik.values.rightSimplifiedEnglish,
						rightSimplifiedTitlePinyin: formik.values.rightSimplifiedPinyin,
						rightSimplifiedTitleChinese: formik.values.rightSimplifiedChinese,

						htmlSourceCode: formik.values.htmlSourceCode,
					},
				]);
				setSimplifiedResponseFileUrlStrokeOrderSeasonal('');
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
	const updateRecordStrokeOrderSeasonal = () => {
		if (formik.values.leftSimplifiedEnglish.trim() !== '' && formik.values.leftSimplifiedPinyin.trim() !== '' && formik.values.leftSimplifiedChinese.trim() !== '' && formik.values.leftTraditionalEnglish.trim() !== '' && formik.values.leftTraditionalPinyin.trim() !== '' && formik.values.leftTraditionalChinese.trim() !== '' && formik.values.simplifiedFileUrl !== '' && formik.values.rightSimplifiedEnglish.trim() !== '' && formik.values.rightSimplifiedPinyin.trim() !== '' && formik.values.rightSimplifiedChinese.trim() !== '' && formik.values.rightTraditionalEnglish.trim() !== '' && formik.values.rightTraditionalPinyin.trim() !== '' && formik.values.htmlSourceCode !== '' && formik.values.rightTraditionalChinese.trim() !== '' && simplifiedResponseFileUrlStrokeOrderSeasonal) {
			formik.setTouched({
				[FieldNames.leftSimplifiedEnglish]: true,
				[FieldNames.rightSimplifiedEnglish]: true,
				[FieldNames.leftTraditionalEnglish]: true,
				[FieldNames.rightTraditionalEnglish]: true,
				[FieldNames.htmlSourceCode]: true,
			});

			if (Object.keys(formik.errors).length === 0) {
				setAddedListStrokeOrderSeasonal((prev) => {
					const updatedData = prev.map((item) => {
						if (item.id === editRecordStrokeOrderSeasonalUuid) {
							const newData = {
								id: editRecordStrokeOrderSeasonalUuid,
								leftTraditionalTitleEnglish: formik.values.leftTraditionalEnglish,
								leftTraditionalTitlePinyin: formik.values.leftTraditionalPinyin,
								leftTraditionalTitleChinese: formik.values.leftTraditionalChinese,

								leftSimplifiedTitleEnglish: formik.values.leftSimplifiedEnglish,
								leftSimplifiedTitlePinyin: formik.values.leftSimplifiedPinyin,
								leftSimplifiedTitleChinese: formik.values.leftSimplifiedChinese,
								simplifiedFileUrl: simplifiedResponseFileUrlStrokeOrderSeasonal,

								rightSimplifiedTitleEnglish: formik.values.rightSimplifiedEnglish,
								rightSimplifiedTitlePinyin: formik.values.rightSimplifiedPinyin,
								rightSimplifiedTitleChinese: formik.values.rightSimplifiedChinese,

								htmlSourceCode: formik.values.htmlSourceCode,

								rightTraditionalTitleEnglish: formik.values.rightTraditionalEnglish,
								rightTraditionalTitlePinyin: formik.values.rightTraditionalPinyin,
								rightTraditionalTitleChinese: formik.values.rightTraditionalChinese,
							};
							return { ...item, ...newData };
						} else {
							return item;
						}
					});
					return updatedData;
				});
				setSimplifiedResponseFileUrlStrokeOrderSeasonal('');
				setEditRecordStrokeOrderSeasonal(false);
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
	const copyDataStrokeOrderSeasonal = useCallback(() => {
		formik.values.leftTraditionalEnglish !== '' && formik.setFieldValue(FieldNames.leftSimplifiedEnglish, formik.values.leftTraditionalEnglish);
		formik.values.leftTraditionalPinyin !== '' && formik.setFieldValue(FieldNames.leftSimplifiedPinyin, formik.values.leftTraditionalPinyin);
		formik.values.leftTraditionalChinese !== '' && formik.setFieldValue(FieldNames.leftSimplifiedChinese, formik.values.leftTraditionalChinese);

		formik.values.rightTraditionalEnglish !== '' && formik.setFieldValue(FieldNames.rightSimplifiedEnglish, formik.values.rightTraditionalEnglish);
		formik.values.rightTraditionalPinyin !== '' && formik.setFieldValue(FieldNames.rightSimplifiedPinyin, formik.values.rightTraditionalPinyin);
		formik.values.rightTraditionalChinese !== '' && formik.setFieldValue(FieldNames.rightSimplifiedChinese, formik.values.rightTraditionalChinese);
	}, [formik]);

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const fileUpdateStrokeOrderSeasonal = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const fileStrokeOrderSeasonal = event.target.files?.[0];
		if (fileStrokeOrderSeasonal === undefined) {
			return;
		}
		const fileName = event.target.name;
		const lastIndex = fileStrokeOrderSeasonal?.name?.lastIndexOf('.');
		const extension = fileStrokeOrderSeasonal?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (fileStrokeOrderSeasonal?.type !== FILE_TYPE.gifType) {
			toast.error(Errors.PLEASE_SELECT_GIF);
			return;
		}
		fileStrokeOrderSeasonal.type === FILE_TYPE.gifType &&
			getGifDimensions(fileStrokeOrderSeasonal, (dimensions) => {
				// dimensions.width
				if (dimensions.width > MAX_GIF_DIMENSION || dimensions.height > MAX_GIF_DIMENSION) {
					toast.error(`${Errors.maxGifDimensions} ${MAX_GIF_DIMENSION}X${MAX_GIF_DIMENSION}.`);
					return false;
				} else {
					const gif = document.createElement('img');
					const blob = URL.createObjectURL(fileStrokeOrderSeasonal);
					gif.src = blob;
					gif.addEventListener('load', () => {
						const gifUploaderOptions = {
							fileName: name,
							file: fileStrokeOrderSeasonal,
							isForSeasonal: true,
							isForSop: false,
						};
						if (fileName === FieldNames.simplifiedFileUrl) {
							const uploader = new Uploader(gifUploaderOptions, updatePercentageStrokeOrderSeasonal);
							uploader.start();
							formik.setFieldValue(FieldNames.simplifiedFileUrl, uploader.fileName);
							uploader.onComplete((response: string) => {
								setLoadingStrokeOrderSeasonal(false);
								setSimplifiedResponseFileUrlStrokeOrderSeasonal(response);
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
	const deleteCurrentRecordStrokeOrderSeasonal = useCallback(
		(id: string) => {
			setAddedListStrokeOrderSeasonal(addedListStrokeOrderSeasonal?.filter((item) => item.id !== id));
		},
		[addedListStrokeOrderSeasonal]
	);

	/**
	 *
	 * @returns Method used to Edit Selected record.
	 */
	const editCurrentRecordStrokeOrderSeasonal = useCallback(
		(id: string) => {
			const currentRecord = addedListStrokeOrderSeasonal.filter((item) => item.id === id);
			setEditRecordStrokeOrderSeasonal(true);
			setEditRecordStrokeOrderSeasonalUuid(id);

			formik.setFieldValue(FieldNames.leftTraditionalEnglish, currentRecord[0].leftTraditionalTitleEnglish);
			formik.setFieldValue(FieldNames.leftTraditionalPinyin, currentRecord[0].leftTraditionalTitlePinyin);
			formik.setFieldValue(FieldNames.leftTraditionalChinese, currentRecord[0].leftTraditionalTitleChinese);

			formik.setFieldValue(FieldNames.leftSimplifiedEnglish, currentRecord[0].leftSimplifiedTitleEnglish);
			formik.setFieldValue(FieldNames.leftSimplifiedPinyin, currentRecord[0].leftSimplifiedTitlePinyin);
			formik.setFieldValue(FieldNames.leftSimplifiedChinese, currentRecord[0].leftSimplifiedTitleChinese);
			formik.setFieldValue(FieldNames.simplifiedFileUrl, currentRecord[0].simplifiedFileUrl);

			formik.setFieldValue(FieldNames.rightTraditionalEnglish, currentRecord[0].rightTraditionalTitleEnglish);
			formik.setFieldValue(FieldNames.rightTraditionalPinyin, currentRecord[0].rightTraditionalTitlePinyin);
			formik.setFieldValue(FieldNames.rightTraditionalChinese, currentRecord[0].rightTraditionalTitleChinese);

			formik.setFieldValue(FieldNames.rightSimplifiedEnglish, currentRecord[0].rightSimplifiedTitleEnglish);
			formik.setFieldValue(FieldNames.rightSimplifiedPinyin, currentRecord[0].rightSimplifiedTitlePinyin);
			formik.setFieldValue(FieldNames.rightSimplifiedChinese, currentRecord[0].rightSimplifiedTitleChinese);

			formik.setFieldValue(FieldNames.htmlSourceCode, currentRecord[0].htmlSourceCode);

			setSimplifiedResponseFileUrlStrokeOrderSeasonal(currentRecord[0].simplifiedFileUrl);
		},
		[editRecordStrokeOrderSeasonal, editRecordStrokeOrderSeasonalUuid, simplifiedResponseFileUrlStrokeOrderSeasonal, formik]
	);

	const addMoreStrokeOrderSeasonal = useCallback(() => {
		!editRecordStrokeOrderSeasonal ? addDataToListStrokeOrderSeasonal() : updateRecordStrokeOrderSeasonal();
	}, [editRecordStrokeOrderSeasonal, addDataToListStrokeOrderSeasonal, updateRecordStrokeOrderSeasonal]);

	const getErrorStrokeOrderSeasonal = (fieldName: keyof CreateStrokeOrderActivity) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};
	return (
		<form className='w-full' onSubmit={formik.handleSubmit}>
			{loadingStrokeOrderSeasonal && <Loader />}
			<div className={cn(ModelStyle['model__body'])}>
				<div className='flex flex-col md:flex-row gap-3 mb-4'>
					<div className='rounded border w-full'>
						<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Traditional Chinese</h6>
						<div className='p-3'>
							<p className='block text-gray-700 text-sm font-bold mb-0.5'>Left side</p>
							<div className='grid grid-cols-3 gap-x-4 p-3 bg-gray-50 rounded border'>
								<TextInput placeholder='Title in english' name={FieldNames.leftTraditionalEnglish} onChange={formik.handleChange} label='Title (English)' value={formik.values.leftTraditionalEnglish} error={getErrorStrokeOrderSeasonal(FieldNames.leftTraditionalEnglish)} required />

								<TextInput placeholder='Title in chinese' name={FieldNames.leftTraditionalChinese} onChange={formik.handleChange} label='Title (Chinese)' value={formik.values.leftTraditionalChinese} error={getErrorStrokeOrderSeasonal(FieldNames.leftTraditionalChinese)} required />

								<TextInput placeholder='Title in pinyin' name={FieldNames.leftTraditionalPinyin} onChange={formik.handleChange} label='Title (Pinyin)' value={formik.values.leftTraditionalPinyin} error={getErrorStrokeOrderSeasonal(FieldNames.leftTraditionalPinyin)} required />
							</div>
						</div>
						<div className='p-3'>
							<p className='block text-gray-700 text-sm font-bold mb-0.5'>Right side</p>
							<div className='grid grid-cols-3 gap-x-4 p-3 bg-gray-50 rounded border'>
								<TextInput placeholder='Title in english' name={FieldNames.rightTraditionalEnglish} onChange={formik.handleChange} label='Title (English)' value={formik.values.rightTraditionalEnglish} error={getErrorStrokeOrderSeasonal(FieldNames.rightTraditionalEnglish)} required />

								<TextInput placeholder='Title in chinese' name={FieldNames.rightTraditionalChinese} onChange={formik.handleChange} label='Title (Chinese)' value={formik.values.rightTraditionalChinese} error={getErrorStrokeOrderSeasonal(FieldNames.rightTraditionalChinese)} required />

								<TextInput placeholder='Title in pinyin' name={FieldNames.rightTraditionalPinyin} onChange={formik.handleChange} label='Title (Pinyin)' value={formik.values.rightTraditionalPinyin} error={getErrorStrokeOrderSeasonal(FieldNames.rightTraditionalPinyin)} required />
							</div>
						</div>
					</div>
					<div className='flex flex-col justify-center items-center p-3'>
						<Button className='btn-default btn-large' title='Copy' onClick={copyDataStrokeOrderSeasonal}>
							<AngleRight className='text-md' />
						</Button>
						<span className='mt-1 text-gray-500'>Copy</span>
					</div>
					<div className='rounded border w-full'>
						<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Simplified Chinese</h6>
						<div className='p-3'>
							<p className='block text-gray-700 text-sm font-bold mb-0.5'>Left side</p>
							<div className='grid grid-cols-3 gap-x-4 p-3 bg-gray-50 rounded border'>
								<TextInput placeholder='Title in english' name={FieldNames.leftSimplifiedEnglish} onChange={formik.handleChange} label='Title (English)' value={formik.values.leftSimplifiedEnglish} error={getErrorStrokeOrderSeasonal(FieldNames.leftSimplifiedEnglish)} required />

								<TextInput placeholder='Title in chinese' name={FieldNames.leftSimplifiedChinese} onChange={formik.handleChange} label='Title (Chinese)' value={formik.values.leftSimplifiedChinese} error={getErrorStrokeOrderSeasonal(FieldNames.leftSimplifiedChinese)} required />

								<TextInput placeholder='Title in pinyin' name={FieldNames.leftSimplifiedPinyin} onChange={formik.handleChange} label='Title (Pinyin)' value={formik.values.leftSimplifiedPinyin} error={getErrorStrokeOrderSeasonal(FieldNames.leftSimplifiedPinyin)} required />
							</div>
						</div>
						<div className='p-3'>
							<p className='block text-gray-700 text-sm font-bold mb-0.5'>Right side</p>
							<div className='grid grid-cols-3 gap-x-4 p-3 bg-gray-50 rounded border'>
								<TextInput placeholder='Title in english' name={FieldNames.rightSimplifiedEnglish} onChange={formik.handleChange} label='Title (English)' value={formik.values.rightSimplifiedEnglish} error={getErrorStrokeOrderSeasonal(FieldNames.rightSimplifiedEnglish)} required />

								<TextInput placeholder='Title in chinese' name={FieldNames.rightSimplifiedChinese} onChange={formik.handleChange} label='Title (Chinese)' value={formik.values.rightSimplifiedChinese} error={getErrorStrokeOrderSeasonal(FieldNames.rightSimplifiedChinese)} required />

								<TextInput placeholder='Title in pinyin' name={FieldNames.rightSimplifiedPinyin} onChange={formik.handleChange} label='Title (Pinyin)' value={formik.values.rightSimplifiedPinyin} error={getErrorStrokeOrderSeasonal(FieldNames.rightSimplifiedPinyin)} required />
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
							imageSource={simplifiedResponseFileUrlStrokeOrderSeasonal}
							name={FieldNames.simplifiedFileUrl}
							error={formik.errors.simplifiedFileUrl && formik.touched.simplifiedFileUrl ? formik.errors.simplifiedFileUrl : ''}
							uploadType={FILE_TYPE.gifType}
							acceptNote='gif file only'
							accepts={FILE_TYPE.gifType}
							onChange={useCallback((e) => {
								fileUpdateStrokeOrderSeasonal(e);
							}, [])}
						/>
						{percentageStrokeOrderSeasonal !== 0 && percentageStrokeOrderSeasonal !== 100 && (
							<div className='progress bg-gray-100 flex items-center w-full rounded-lg h-2 mt-3'>
								<span className='h-full rounded-lg bg-success w-0' style={{ width: `${percentageStrokeOrderSeasonal}%` }}></span>
								<span className='ml-3 font-medium'>{percentageStrokeOrderSeasonal}%</span>
							</div>
						)}
					</div>
				</div>
				<div className='flex justify-center'>
					<Button className='btn-primary mb-5 btn-large' onClick={addMoreStrokeOrderSeasonal}>
						<PlusCircle className='mr-2' /> {editRecordStrokeOrderSeasonal ? 'Update data' : 'Add New'}
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
							{addedListStrokeOrderSeasonal && <DndStrokeOrder dndItemRow={addedListStrokeOrderSeasonal} editDisable={editRecordStrokeOrderSeasonal} editRecord={editCurrentRecordStrokeOrderSeasonal} deleteStrokeOrder={deleteCurrentRecordStrokeOrderSeasonal} setNewOrder={setNewOrderStrokeOrderSeasonal} />}
							{!addedListStrokeOrderSeasonal.length && (
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
							id: 'provideSkipStrokeOrderSeasonal',
							name: 'Provide skip button for this activity',
							value: 'Provide skip button for this activity',
							checked: provideSkipStrokeOrderSeasonal,
							onChange: (e) => {
								setProvideSkipStrokeOrderSeasonal(!provideSkipStrokeOrderSeasonal);
								formik.setFieldValue(FieldNames.isSkippable, e.target.checked);
							},
						},
					]}
				/>
				<Button className='btn-primary btn-large w-28 justify-center' disabled={!addedListStrokeOrderSeasonal.length || (percentageStrokeOrderSeasonal !== 0 && percentageStrokeOrderSeasonal !== 100)} type='submit'>
					{params.activityId ? 'Update' : 'Save'}
				</Button>
				<Button className='btn-default btn-large w-28 justify-center' onClick={onClose}>
					Cancel
				</Button>
			</div>
		</form>
	);
};

export default SeasonalActivityStrokeOrder;
