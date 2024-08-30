import React, { useCallback, useEffect, useState } from 'react';
import { FieldArray, FormikProvider, getIn, useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import TextInput from '@components/textInput/TextInput';
import CheckBox from '@components/checkbox/CheckBox';
import { useParams } from 'react-router-dom';
import { APIService } from '@framework/services/api';
import { toast } from 'react-toastify';
import { FieldNames, ResponseCode } from 'src/interfaces/enum';
import { Loader } from '@components/index';
import FileUpload from '@components/fileUpload/FileUpload';
import { AngleRight, Drag, Plus, PlusCircle } from '@components/icons';
import { ENGLISH_CODE, FILE_TYPE, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE, activityPaths } from '@config/constant';
import { Errors } from '@config/errors';
import { generateUuid, moveData, resetInputManually, translateText, typeValidationAudio } from '@utils/helpers';
import { CreateReadingComprehensiveActivityForm, QARecords, QnATranslate, ReadingParagraphActivitySubmitData } from 'src/types/activities/readingComprehension';
import { AddEditSeasonalActivityData } from 'src/types/seasonalTopics';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import { Uploader } from '@views/activities/utils/upload';
import DNDReadingComprehensive from '@views/activities/DNDReadingComprehensive';
import CommonButton from '@components/common/CommonButton';
import DeleteButton from '@components/common/DeleteButton';
import { MyArrayHelpers } from 'src/types/activities';
import { mixedNotRequired, mixedRequired, stringNoSpecialChar, stringNotRequired, stringRequired, stringTrim } from '@config/validations';
import { fileTypesQA } from '@views/activities/ActivityReadingComprehensive';

const SeasonalActivityReadingComprehensive = ({ onSubmit, onClose, activityUuid, url, toggleSeasonalActivity, isMoving, topicId, lessonId }: AddEditSeasonalActivityData) => {
	const params = useParams();
	const [loadingQASeasonal, setLoadingQASeasonal] = useState<boolean>(false);
	const defaultTraditionalFieldQASeasonal = { chinese: '', english: '', pinyin: '', audio: '' };
	const defaultSimplifiedFieldQASeasonal = { chinese: '', english: '', pinyin: '', audio: '' };

	const [provideSkipQASeasonal, setProvideSkipQASeasonal] = useState<boolean>(false);
	const [audioSimplifiedQASeasonal, setAudioSimplifiedQASeasonal] = useState<string>('');
	const [audioSimplifiedQASeasonalPercentage, setAudioSimplifiedQASeasonalPercentage] = useState<number>(0);

	const [audioTraditionalQASeasonal, setAudioTraditionalQASeasonal] = useState<string>('');
	const [audioTraditionalQASeasonalPercentage, setAudioTraditionalQASeasonalPercentage] = useState<number>(0);

	const [recordsListQASeasonal, setRecordsListQASeasonal] = useState<QARecords[]>([]);
	const [editListDataQASeasonal, setEditListDataQASeasonal] = useState<QARecords | null>(null);
	const [newOrderQASeasonal, setNewOrderQASeasonal] = useState<QARecords[]>();

	useEffect(() => {
		if (newOrderQASeasonal) {
			setRecordsListQASeasonal(newOrderQASeasonal);
		}
	}, [newOrderQASeasonal]);

	const updatePercentageQASeasonal = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.audioSimplified:
				setAudioSimplifiedQASeasonalPercentage(newPercentage);
				break;
			case FieldNames.audioTraditional:
				setAudioTraditionalQASeasonalPercentage(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidQASeasonal = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdate = !(isPercentageValidQASeasonal(audioTraditionalQASeasonalPercentage) && isPercentageValidQASeasonal(audioSimplifiedQASeasonalPercentage));

	/**
	 * Method is used to set the fields if User click edit data
	 */
	useEffect(() => {
		if (editListDataQASeasonal) {
			formik.setFieldValue(FieldNames.phraseSimplified, editListDataQASeasonal.simplifiedPhrases);
			formik.setFieldValue(FieldNames.phraseTraditional, editListDataQASeasonal.traditionalPhrases);
		}
	}, [editListDataQASeasonal]);

	/**
	 *@returns Method used for setValue from activity data and get the details of activity by uuid
	 */
	useEffect(() => {
		if (params?.activityId) {
			setLoadingQASeasonal(true);
			APIService.getData(`${url}/${activityPaths.readingParagraph}/${params?.activityId}?${activityPaths.isForSeasonal}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const data = response?.data?.data;
						const toggle = data.toggle;
						toggleSeasonalActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);
						setRecordsListQASeasonal(
							data.activityData.map((item: QARecords) => {
								return { ...item, id: item.activityDataId };
							})
						);
						setProvideSkipQASeasonal(data.isSkippable);
						formik.setFieldValue(FieldNames.title, data.title);
						setAudioSimplifiedQASeasonal(data.simplifiedFile);
						setAudioTraditionalQASeasonal(data?.traditionalFile);
					} else {
						toast.error(response?.data?.message);
					}
					setLoadingQASeasonal(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingQASeasonal(false);
				});
		}
	}, []);

	const initialValues: CreateReadingComprehensiveActivityForm = {
		[FieldNames.topicId]: params.topicId as string,
		[FieldNames.lessonId]: params.lessonId as string,
		[FieldNames.activityTypeId]: activityUuid,

		[FieldNames.title]: '',
		[FieldNames.phraseSimplified]: [defaultSimplifiedFieldQASeasonal],
		[FieldNames.phraseTraditional]: [defaultTraditionalFieldQASeasonal],

		[FieldNames.audioSimplified]: null,
		[FieldNames.audioTraditional]: null,

		[FieldNames.isSkippable]: false,
	};

	const handleFileUploadQASeasonal = (event: React.ChangeEvent<HTMLInputElement>, fileName: string) => {
		const fileQASeasonal = event.target.files?.[0] as File;
		typeValidationAudio(fileQASeasonal, fileTypesQA, Errors.PLEASE_ALLOW_MP3_WAV_FILE);
		const lastIndex = fileQASeasonal?.name?.lastIndexOf('.');
		const extension = fileQASeasonal?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		const audio = document.createElement('audio');
		audio.preload = 'metadata';
		const blob = URL.createObjectURL(fileQASeasonal);
		audio.src = blob;
		audio.addEventListener('loadedmetadata', () => {
			const audioUploaderOptions = {
				fileName: name,
				file: fileQASeasonal,
				isForSeasonal: true,
				isForSop: false,
				fieldName: fileName,
			};
			const uploader = new Uploader(audioUploaderOptions, updatePercentageQASeasonal);
			uploader.start();
			switch (fileName) {
				case FieldNames.audioSimplified:
					formik.setFieldValue(FieldNames.audioSimplified, uploader.fileName);
					uploader.onComplete((response: string) => {
						setLoadingQASeasonal(false);
						setAudioSimplifiedQASeasonal(response);
					});
					break;
				case FieldNames.audioTraditional:
					formik.setFieldValue(FieldNames.audioTraditional, uploader.fileName);
					uploader.onComplete((response: string) => {
						setLoadingQASeasonal(false);
						setAudioTraditionalQASeasonal(response);
					});
					break;
				default:
					break;
			}
		});
		resetInputManually([fileName]);
	};

	const onChangeAudioHandlerQASeasonal = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const fileName = e.target.name;
		handleFileUploadQASeasonal(e, fileName);
	}, []);

	const onFileUploadHandlerQASeasonal = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const fileQASeasonalAudio = event.target.files?.[0] as File;
		const fileName = event.target.name;
		typeValidationAudio(fileQASeasonalAudio, fileTypesQA, Errors.PLEASE_ALLOW_MP3_WAV_FILE);
		const lastIndex = fileQASeasonalAudio?.name?.lastIndexOf('.');
		const extension = fileQASeasonalAudio?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		const audio = document.createElement('audio');
		audio.preload = 'metadata';
		const blob = URL.createObjectURL(fileQASeasonalAudio);
		audio.src = blob;
		audio.addEventListener('loadedmetadata', () => {
			setLoadingQASeasonal(true);
			const audioUploaderOptions = {
				fileName: name,
				file: fileQASeasonalAudio,
				isForSeasonal: true,
				isForSop: false,
				fieldName: fileName,
			};
			const uploader = new Uploader(audioUploaderOptions, updatePercentageQASeasonal);
			uploader.start();
			uploader.onComplete((response: string) => {
				setLoadingQASeasonal(false);
				formik.setFieldValue(fileName, response);
			});
		});
		resetInputManually([fileName]);
	}, []);

	/**
	 *
	 * @returns Method used for get validation for add/edit activity
	 */
	const getObjQASeasonal = () => {
		const obj: ObjectShape = {
			[FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
			[FieldNames.phraseSimplified]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: recordsListQASeasonal.length ? stringNotRequired() : stringTrim(Errors.PLEASE_ENTER_PHRASE),
					[FieldNames.english]: recordsListQASeasonal.length ? stringNotRequired() : stringNoSpecialChar(Errors.PLEASE_ENTER_PHRASE),
					[FieldNames.pinyin]: recordsListQASeasonal.length ? stringNotRequired() : stringRequired(Errors.PLEASE_ENTER_PHRASE),
					[FieldNames.audio]: recordsListQASeasonal.length ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
				})
			),
			[FieldNames.audioSimplified]: audioSimplifiedQASeasonal.length ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.phraseTraditional]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: recordsListQASeasonal.length ? stringNotRequired() : stringTrim(Errors.PLEASE_ENTER_PHRASE),
					[FieldNames.english]: recordsListQASeasonal.length ? stringNotRequired() : stringNoSpecialChar(Errors.PLEASE_ENTER_PHRASE),
					[FieldNames.pinyin]: recordsListQASeasonal.length ? stringNotRequired() : stringRequired(Errors.PLEASE_ENTER_PHRASE),
					[FieldNames.audio]: recordsListQASeasonal.length ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
				})
			),
			[FieldNames.audioTraditional]: audioTraditionalQASeasonal.length ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObjQASeasonal();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updatedData: ReadingParagraphActivitySubmitData = {
				isMoving: isMoving,
				topicId: moveData(isMoving, topicId as string, values.topicId as string),
				lessonId: moveData(isMoving, lessonId as string, values.lessonId as string),
				title: values.title.trim(),
				simplifiedFile: audioSimplifiedQASeasonal.split('/').pop() as string,
				traditionalFile: audioTraditionalQASeasonal.split('/').pop() as string,
				activityData: recordsListQASeasonal?.map(({ id, ...item }) => ({
					activityDataId: id,
					...item,
					simplifiedPhrases: item.simplifiedPhrases.map(({ audio, ...rest }) => ({
						audio: audio.split('/').pop() as string,
						...rest,
					})),
					traditionalPhrases: item.traditionalPhrases.map(({ audio, ...rest }) => ({
						audio: audio.split('/').pop() as string,
						...rest,
					})),
				})),
				isSkippable: provideSkipQASeasonal,
				isForSeasonal: true,
			};
			if (recordsListQASeasonal.length) {
				if (params.activityId) {
					setLoadingQASeasonal(true);
					APIService.putData(`${url}/${activityPaths.readingParagraph}/${params.activityId}?${activityPaths.isForSeasonal}`, { ...updatedData })
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingQASeasonal(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingQASeasonal(false);
						});
				} else {
					setLoadingQASeasonal(true);
					APIService.postData(`${url}/${activityPaths.readingParagraph}?${activityPaths.isForSeasonal}`, { ...updatedData, activityTypeId: values.activityTypeId, topicId: values.topicId, lessonId: values.lessonId })
						.then((response) => {
							if (response.status === ResponseCode.success || ResponseCode.created) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingQASeasonal(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingQASeasonal(false);
						});
				}
			} else {
				toast.error('Please add at least one record.');
			}
		},
	});

	/**
	 *
	 * @returns Method used to Copy data from left to right form
	 */
	const copyDataQASeasonal = useCallback(() => {
		if (audioTraditionalQASeasonal !== '') {
			formik.setFieldValue(FieldNames.audioSimplified, audioTraditionalQASeasonal);
			setAudioSimplifiedQASeasonal(audioTraditionalQASeasonal);
		}
		const traditionalDataQASeasonal = () => {
			if (formik.values.phraseTraditional.length === 1) {
				const traditionalQASeasonal = formik.values.phraseTraditional[0];
				const simplifiedQASeasonal = formik.values.phraseSimplified[0];

				if (traditionalQASeasonal.chinese.trim() !== '' && traditionalQASeasonal.english.trim() !== '' && traditionalQASeasonal.pinyin.trim() !== '') {
					return formik.values.phraseTraditional.map((item, index) => ({
						...item,
						chinese: translateText(item.chinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
							formik.setFieldValue(`phraseSimplified[${index}].chinese`, data ?? data);
							formik.setFieldValue(`phraseSimplified[${index}].pinyin`, data ?? data);
						}),
					}));
				} else {
					return [{ [FieldNames.chinese]: simplifiedQASeasonal.chinese, [FieldNames.english]: simplifiedQASeasonal.english, [FieldNames.pinyin]: simplifiedQASeasonal.pinyin, [FieldNames.audio]: simplifiedQASeasonal.audio }];
				}
			} else {
				return formik.values.phraseTraditional.map((item, index) => ({
					...item,
					chinese: translateText(item.chinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
						formik.setFieldValue(`phraseSimplified[${index}].chinese`, data ?? data);
						formik.setFieldValue(`phraseSimplified[${index}].pinyin`, data ?? data);
					}),
				}));
			}
		};
		formik.setFieldValue(FieldNames.phraseSimplified, traditionalDataQASeasonal());

		setTimeout(() => {
			formik.validateForm();
		}, 500);
	}, [formik.values]);

	const getErrorQASeasonal = (fieldName: keyof CreateReadingComprehensiveActivityForm) => {
		if (fieldName !== FieldNames.phraseSimplified && fieldName != FieldNames.phraseTraditional) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};

	/**
	 * For Add records button
	 */

	const addRecordsQASeasonal = useCallback(() => {
		if (formik.values.phraseTraditional.length && formik.values.phraseSimplified.length && formik.values.phraseTraditional.every((item) => item.english.length && item.chinese.length && item.pinyin.length && item.audio.length) && formik.values.phraseSimplified.every((item) => item.english.length && item.chinese.length && item.pinyin.length && item.audio.length)) {
			setRecordsListQASeasonal((prev) => {
				const commonData = {
					simplifiedPhrases: formik.values.phraseSimplified.map((item) => {
						return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim(), audio: item.audio };
					}),
					traditionalPhrases: formik.values.phraseTraditional.map((item) => {
						return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim(), audio: item.audio };
					}),
				};
				const updatedData = prev.map((item) => {
					if (item.id === editListDataQASeasonal?.id) {
						const newData = {
							id: editListDataQASeasonal?.id, // Use the existing  for editing
							...commonData,
						};
						return { ...item, ...newData };
					} else {
						return item;
					}
				});

				if (!editListDataQASeasonal) {
					updatedData.push({
						id: generateUuid(), // Generate a new ID for a new matching activity
						...commonData,
					});
				}
				return updatedData;
			});
			resetFieldsQASeasonal();
			setEditListDataQASeasonal(null);
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
	}, [recordsListQASeasonal, formik, editListDataQASeasonal]);

	const resetFieldsQASeasonal = () => {
		formik.setFieldValue(FieldNames.phraseTraditional, [defaultTraditionalFieldQASeasonal]);
		formik.setFieldValue(FieldNames.phraseSimplified, [defaultSimplifiedFieldQASeasonal]);
		validateForm();
	};

	const validateForm = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 100);
	};

	const translateTraditionalFieldQASeasonal = useCallback(
		(index: number) => {
			translateText(formik.values.phraseTraditional[index].chinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
				// traditional to english
				formik.setFieldValue(`phraseTraditional[${index}].english`, data ?? data);
				formik.setFieldValue(`phraseTraditional[${index}].pinyin`, formik.values.phraseTraditional[index].chinese);
			});
		},
		[formik]
	);

	const translateSimplifiedFieldQASeasonal = useCallback(
		(index: number) => {
			translateText(formik.values.phraseSimplified[index].chinese, ENGLISH_CODE, SIMPLIFIED_CHINESE_CODE).then((data) => {
				// Simplified to english
				formik.setFieldValue(`phraseSimplified[${index}].english`, data ?? data);
				formik.setFieldValue(`phraseSimplified[${index}].pinyin`, formik.values.phraseSimplified[index].chinese);
			});
		},
		[formik]
	);

	const addMoreTraditionalPhrasesQASeasonal = useCallback(() => {
		formik.setFieldValue('phraseTraditional', [...formik.values.phraseTraditional, { chinese: '', english: '', pinyin: '', audio: '' }]);
	}, [formik]);

	const addMoreSimplifiedPhrasesQASeasonal = useCallback(() => {
		formik.setFieldValue('phraseSimplified', [...formik.values.phraseSimplified, { chinese: '', english: '', pinyin: '', audio: '' }]);
	}, [formik]);

	const editRecordQASeasonal = useCallback((data: QARecords) => {
		setEditListDataQASeasonal(data);
	}, []);

	const deleteRecordQASeasonal = useCallback(
		(data: QARecords) => {
			setRecordsListQASeasonal(recordsListQASeasonal?.filter((recordListItem) => recordListItem.id !== data.id));
		},
		[recordsListQASeasonal]
	);

	const [draggedIndexQASeasonal, setDraggedIndexQASeasonal] = useState<number | null>(null);
	const [draggedIndexQASeasonalSimplified, setDraggedIndexQASeasonalSimplified] = useState<number | null>(null);

	const handleDragStartQASeasonal = (index: number, name: string) => {
		name === FieldNames.phraseTraditional ? setDraggedIndexQASeasonal(index) : setDraggedIndexQASeasonalSimplified(index);
	};

	const handleDragEndQASeasonal = () => {
		setDraggedIndexQASeasonal(null);
		setDraggedIndexQASeasonalSimplified(null);
	};

	const handleDragOverQASeasonal = (e: React.DragEvent, index: number, values: QnATranslate[], name: string) => {
		e.preventDefault();

		if (draggedIndexQASeasonal !== null && name === FieldNames.phraseTraditional) {
			const phrases = [...values];
			const draggedPhrase = phrases[draggedIndexQASeasonal];
			phrases.splice(draggedIndexQASeasonal, 1);
			phrases.splice(index, 0, draggedPhrase);
			formik.setFieldValue(name, phrases);
			setDraggedIndexQASeasonal(index);
		}
		if (draggedIndexQASeasonalSimplified !== null && name === FieldNames.phraseSimplified) {
			const phrases = [...values];
			const draggedPhrase = phrases[draggedIndexQASeasonalSimplified];
			phrases.splice(draggedIndexQASeasonalSimplified, 1);
			phrases.splice(index, 0, draggedPhrase);
			formik.setFieldValue(name, phrases);
			setDraggedIndexQASeasonalSimplified(index);
		}
	};

	return (
		<FormikProvider value={formik}>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loadingQASeasonal && <Loader />}
				<div className='mb-4'>
					<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorQASeasonal(FieldNames.title)} required />
				</div>
				<div className=' grid grid-cols-1 md:grid-cols-2 gap-x-24 mb-4'>
					<div>
						<FileUpload labelName='Audio (Traditional)' id={FieldNames.audioTraditional} imageSource={audioTraditionalQASeasonal} name={FieldNames.audioTraditional} error={getErrorQASeasonal(FieldNames.audioTraditional) as string} acceptNote='mp3, wav files only' accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} onChange={onChangeAudioHandlerQASeasonal} uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} />
						{!isPercentageValidQASeasonal(audioTraditionalQASeasonalPercentage) && <LoadingPercentage percentage={audioTraditionalQASeasonalPercentage} />}
					</div>

					<div>
						<FileUpload labelName='Audio (Simplified)' id={FieldNames.audioSimplified} imageSource={audioSimplifiedQASeasonal} name={FieldNames.audioSimplified} acceptNote='mp3, wav files only' accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} onChange={onChangeAudioHandlerQASeasonal} error={getErrorQASeasonal(FieldNames.audioSimplified) as string} uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} />
						{!isPercentageValidQASeasonal(audioSimplifiedQASeasonalPercentage) && <LoadingPercentage percentage={audioSimplifiedQASeasonalPercentage} />}
					</div>
				</div>
				<div className='flex flex-col md:flex-row gap-3 mb-4'>
					<div className='rounded border w-full'>
						<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Traditional Chinese</h6>
						<div className='p-3'>
							<div className='font-medium mb-1'>
								Add Phrases <span className='text-error'>*</span>
							</div>
							<div className='p-4 rounded border bg-gray-50 mb-4'>
								<FieldArray
									name={FieldNames.phraseTraditional}
									render={useCallback(
										(arrayHelpers: MyArrayHelpers) => (
											<div className='mb-4 col-span-2'>
												{formik.values.phraseTraditional?.map((_, index) => {
													const chineseTraditionalQASeasonal = `phraseTraditional[${index}].chinese`;
													const englishTraditionalQASeasonal = `phraseTraditional[${index}].english`;
													const pinyinTraditionalQASeasonal = `phraseTraditional[${index}].pinyin`;
													const audioTraditionalQASeasonal = `phraseTraditional[${index}].audio`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 ' draggable onDragStart={() => handleDragStartQASeasonal(index, FieldNames.phraseTraditional)} onDragEnd={handleDragEndQASeasonal} onDragOver={(e) => handleDragOverQASeasonal(e, index, formik.values.phraseTraditional, FieldNames.phraseTraditional)} onDrop={handleDragEndQASeasonal} style={draggedIndexQASeasonal === index ? { border: 'dashed ' } : {}} role='none'>
															<div className='flex space-x-1 items-start'>
																<div className='mt-7'>
																	<span className='py-1.5 px-3 border rounded  cursor-grab active:cursor-grabbing'>
																		<Drag className='opacity-50' />
																	</span>
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseTraditionalQASeasonal} onChange={formik.handleChange} label='Chinese' value={formik.values.phraseTraditional[index].chinese} error={getIn(formik.touched, chineseTraditionalQASeasonal) && getIn(formik.errors, chineseTraditionalQASeasonal) ? getIn(formik.errors, chineseTraditionalQASeasonal) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateTraditionalFieldQASeasonal} isTranslate={true} title='Translate' />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question english' name={englishTraditionalQASeasonal} onChange={formik.handleChange} label='English' value={formik.values.phraseTraditional[index].english} error={getIn(formik.touched, englishTraditionalQASeasonal) && getIn(formik.errors, englishTraditionalQASeasonal) ? getIn(formik.errors, englishTraditionalQASeasonal) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinTraditionalQASeasonal} onChange={formik.handleChange} label='Pinyin' value={formik.values.phraseTraditional[index].pinyin} error={getIn(formik.touched, pinyinTraditionalQASeasonal) && getIn(formik.errors, pinyinTraditionalQASeasonal) ? getIn(formik.errors, pinyinTraditionalQASeasonal) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.phraseTraditional.length === 1} btnDanger={true} />
																</div>
															</div>
															<div className='w-full'>
																<FileUpload labelName='Audio' id={audioTraditionalQASeasonal} imageSource={formik.values.phraseTraditional[index].audio} name={audioTraditionalQASeasonal} error={getIn(formik.touched, audioTraditionalQASeasonal) && getIn(formik.errors, audioTraditionalQASeasonal) ? getIn(formik.errors, audioTraditionalQASeasonal) : ''} acceptNote='mp3, wav files only' accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} onChange={onFileUploadHandlerQASeasonal} uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} />
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalPhrasesQASeasonal}>
													<Plus className='mr-3' /> Add More
												</Button>
											</div>
										),
										[formik]
									)}
								/>
							</div>
						</div>
					</div>
					<div className='flex flex-col justify-center items-center p-3'>
						<Button className='btn-default btn-large' title='Copy' onClick={copyDataQASeasonal} disabled={disableUpdate}>
							<AngleRight className='text-md' />
						</Button>
						<span className='mt-1 text-gray-500'>Copy</span>
					</div>
					<div className='rounded border w-full'>
						<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Simplified Chinese</h6>
						<div className='p-3'>
							<div className='mb-4'>
								<div className='font-medium mb-1'>
									Add Phrases <span className='text-error'>*</span>
								</div>
								<div className='p-4 rounded border bg-gray-50 mb-4'>
									<FieldArray
										name={FieldNames.phraseSimplified}
										render={useCallback(
											(arrayHelpers: MyArrayHelpers) => (
												<div className='mb-4 col-span-2'>
													{formik.values.phraseSimplified?.map((_, index) => {
														const chineseSimplifiedQASeasonal = `phraseSimplified[${index}].chinese`;
														const englishSimplifiedQASeasonal = `phraseSimplified[${index}].english`;
														const pinyinSimplifiedQASeasonal = `phraseSimplified[${index}].pinyin`;
														const audioSimplifiedQASeasonal = `phraseSimplified[${index}].audio`;
														return (
															<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1' draggable onDragStart={() => handleDragStartQASeasonal(index, FieldNames.phraseSimplified)} onDragEnd={handleDragEndQASeasonal} onDragOver={(e) => handleDragOverQASeasonal(e, index, formik.values.phraseSimplified, FieldNames.phraseSimplified)} onDrop={handleDragEndQASeasonal} style={draggedIndexQASeasonalSimplified === index ? { border: 'dashed ' } : {}} role='none'>
																<div className='flex space-x-1 items-start'>
																	<div className='mt-7'>
																		<span className='py-1.5 px-3 border rounded  cursor-grab active:cursor-grabbing'>
																			<Drag className='opacity-50' />
																		</span>
																	</div>
																	<div className=' w-full'>
																		<TextInput placeholder='Question chinese' name={chineseSimplifiedQASeasonal} onChange={formik.handleChange} label='Chinese' value={formik.values.phraseSimplified[index].chinese} error={getIn(formik.touched, chineseSimplifiedQASeasonal) && getIn(formik.errors, chineseSimplifiedQASeasonal) ? getIn(formik.errors, chineseSimplifiedQASeasonal) : ''} required />
																	</div>
																	<div className='mt-7'>
																		<CommonButton data={index} dataHandler={translateSimplifiedFieldQASeasonal} isTranslate={true} title='Translate' />
																	</div>
																	<div className=' w-full'>
																		<TextInput placeholder='Question english' name={englishSimplifiedQASeasonal} onChange={formik.handleChange} label='English' value={formik.values.phraseSimplified[index].english} error={getIn(formik.touched, englishSimplifiedQASeasonal) && getIn(formik.errors, englishSimplifiedQASeasonal) ? getIn(formik.errors, englishSimplifiedQASeasonal) : ''} required />
																	</div>
																	<div className=' w-full'>
																		<TextInput placeholder='Question pinyin' name={pinyinSimplifiedQASeasonal} onChange={formik.handleChange} label='Pinyin' value={formik.values.phraseSimplified[index].pinyin} error={getIn(formik.touched, pinyinSimplifiedQASeasonal) && getIn(formik.errors, pinyinSimplifiedQASeasonal) ? getIn(formik.errors, pinyinSimplifiedQASeasonal) : ''} required />
																	</div>
																	<div className='mt-7'>
																		<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.phraseSimplified.length === 1} btnDanger={true} />
																	</div>
																</div>
																<div className='w-full'>
																	<FileUpload labelName='Audio' id={audioSimplifiedQASeasonal} imageSource={formik.values.phraseSimplified[index].audio} name={audioSimplifiedQASeasonal} error={getIn(formik.touched, audioSimplifiedQASeasonal) && getIn(formik.errors, audioSimplifiedQASeasonal) ? getIn(formik.errors, audioSimplifiedQASeasonal) : ''} acceptNote='mp3, wav files only' accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} onChange={onFileUploadHandlerQASeasonal} uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} />
																</div>
															</div>
														);
													})}
													<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedPhrasesQASeasonal}>
														<Plus className='mr-3' /> Add More
													</Button>
												</div>
											),
											[formik]
										)}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='flex justify-center'>
					<Button className='btn-primary mb-3 btn-large' onClick={addRecordsQASeasonal}>
						<PlusCircle className='mr-1' /> {editListDataQASeasonal ? 'Update' : 'Add New'}
					</Button>
				</div>
				<div className='overflow-auto w-full'>
					<table>
						<thead>
							<tr>
								<th>Sr. No</th>
								<th>Traditional Audio</th>
								<th>Simplified Audio</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{recordsListQASeasonal && <DNDReadingComprehensive editDisable={editListDataQASeasonal} dndItemRow={recordsListQASeasonal} editRecord={editRecordQASeasonal} deleteRecord={deleteRecordQASeasonal} setNewOrder={setNewOrderQASeasonal} />}
							{!recordsListQASeasonal.length && (
								<tr>
									<td colSpan={7} className='text-center font-medium py-5 text-gray-400'>
										No Data Added
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<div className='flex justify-end gap-2 items-center'>
					<CheckBox
						option={[
							{
								id: 'provideSkipQASeasonal',
								name: 'Provide skip button for this activity',
								checked: provideSkipQASeasonal,
								onChange: (e) => {
									setProvideSkipQASeasonal(!provideSkipQASeasonal);
									formik.setFieldValue(FieldNames.isSkippable, e.target.checked);
								},
							},
						]}
					/>
					<Button className='btn-primary btn-large w-28 justify-center' disabled={!!editListDataQASeasonal?.id || disableUpdate} type='submit'>
						{params.activityId ? 'Update' : 'Save'}
					</Button>
					<Button className='btn-default btn-large w-28 justify-center' onClick={onClose}>
						Cancel
					</Button>
				</div>
			</form>
		</FormikProvider>
	);
};

export default SeasonalActivityReadingComprehensive;
