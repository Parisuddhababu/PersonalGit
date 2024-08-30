import React, { useCallback, useEffect, useState } from 'react';
import { FieldArray, FormikProvider, getIn, useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import TextInput from '@components/textInput/TextInput';
import { AddEditActivitiesData, MyArrayHelpers } from 'src/types/activities';
import CheckBox from '@components/checkbox/CheckBox';
import { useParams } from 'react-router-dom';
import { APIService } from '@framework/services/api';
import { toast } from 'react-toastify';
import { ResponseCode } from 'src/interfaces/enum';
import { Loader } from '@components/index';
import FileUpload from '@components/fileUpload/FileUpload';
import { AngleRight, Drag, Plus, PlusCircle } from '@components/icons';
import { AUDIO_SIZE_MB, CHARACTERS_LIMIT, ENGLISH_CODE, FILE_TYPE, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE } from '@config/constant';
import { Errors } from '@config/errors';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import { generateUuid, resetInputManually, translateText } from '@utils/helpers';
import { CreateReadingComprehensiveActivityForm, QARecords, QnATranslate, ReadingParagraphActivitySubmitData } from 'src/types/activities/readingComprehension';
import { Uploader } from './utils/upload';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import DNDReadingComprehensive from './DNDReadingComprehensive';
import CommonButton from '@components/common/CommonButton';
import DeleteButton from '@components/common/DeleteButton';

export enum FieldNames {
	levelId = 'levelId',
	topicId = 'topicId',
	lessonId = 'lessonId',
	activityTypeId = 'activityTypeId',
	activityData = 'activityData',
	title = 'title',
	phraseSimplified = 'phraseSimplified',
	phraseTraditional = 'phraseTraditional',

	audioSimplified = 'audioSimplified',
	audioTraditional = 'audioTraditional',
	isSkippable = 'isSkippable',
	chinese = 'chinese',
	pinyin = 'pinyin',
	english = 'english',
	audio = 'audio',
}

const ActivityReadingComprehensive = ({ onSubmit, onClose, activityUuid, url }: AddEditActivitiesData) => {
	const params = useParams();
	const [loading, setLoading] = useState<boolean>(false);
	const defaultTraditionalField = { chinese: '', english: '', pinyin: '', audio: '' };
	const defaultSimplifiedField = { chinese: '', english: '', pinyin: '', audio: '' };

	const [provideSkip, setProvideSkip] = useState<boolean>(false);
	const [audioSimplified, setAudioSimplified] = useState<string>('');
	const [audioSimplifiedPercentage, setAudioSimplifiedPercentage] = useState<number>(0);

	const [audioTraditional, setAudioTraditional] = useState<string>('');
	const [audioTraditionalPercentage, setAudioTraditionalPercentage] = useState<number>(0);

	const [recordsList, setRecordsList] = useState<QARecords[]>([]);
	const [editListData, setEditListData] = useState<QARecords | null>(null);
	const [newOrder, setNewOrder] = useState<QARecords[]>();

	useEffect(() => {
		if (newOrder) {
			setRecordsList(newOrder);
		}
	}, [newOrder]);

	const updatePercentage = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.audioSimplified:
				setAudioSimplifiedPercentage(newPercentage);
				break;
			case FieldNames.audioTraditional:
				setAudioTraditionalPercentage(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValid = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdate = !(isPercentageValid(audioTraditionalPercentage) && isPercentageValid(audioSimplifiedPercentage));

	/**
	 * Method is used to set the fields if User click edit data
	 */
	useEffect(() => {
		if (editListData) {
			formik.setFieldValue(FieldNames.phraseSimplified, editListData.simplifiedPhrases);
			formik.setFieldValue(FieldNames.phraseTraditional, editListData.traditionalPhrases);
		}
	}, [editListData]);

	/**
	 *@returns Method used for setValue from activity data and get the details of activity by uuid
	 */
	useEffect(() => {
		if (params?.activityId) {
			setLoading(true);
			APIService.getData(`${url}/reading-paragraph/${params?.activityId}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const data = response?.data?.data;
						setRecordsList(
							data.activityData.map((item: QARecords) => {
								return { ...item, id: item.activityDataId };
							})
						);
						setProvideSkip(data.isSkippable);
						formik.setFieldValue(FieldNames.title, data.title);
						setAudioSimplified(data.simplifiedFile);
						setAudioTraditional(data?.traditionalFile);
					} else {
						toast.error(response?.data?.message);
					}
					setLoading(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoading(false);
				});
		}
	}, []);

	const initialValues: CreateReadingComprehensiveActivityForm = {
		[FieldNames.levelId]: params.levelId as string,
		[FieldNames.topicId]: params.topicId as string,
		[FieldNames.lessonId]: params.lessonId as string,
		[FieldNames.activityTypeId]: activityUuid,

		[FieldNames.title]: '',
		[FieldNames.phraseSimplified]: [defaultSimplifiedField],
		[FieldNames.phraseTraditional]: [defaultTraditionalField],

		[FieldNames.audioSimplified]: null,
		[FieldNames.audioTraditional]: null,

		[FieldNames.isSkippable]: false,
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileName: string) => {
		const fileQA = event.target.files?.[0];
		if (fileQA === undefined) {
			return;
		}
		const fileSize = AUDIO_SIZE_MB;
		const fileTypes = [FILE_TYPE.audioType, FILE_TYPE.wavType];

		if (!fileTypes.includes(fileQA.type)) {
			setLoading(false);
			toast.error(Errors.PLEASE_ALLOW_MP3_WAV_FILE);
			return;
		}
		if (fileQA.size / 1000 / 1024 > fileSize) {
			toast.error(`Uploaded audio size is greater than ${fileSize}MB, please upload audio size within ${fileSize}MB or max ${fileSize}MB.`);
			return;
		}
		const lastIndex = fileQA?.name?.lastIndexOf('.');
		const extension = fileQA?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		const audio = document.createElement('audio');
		audio.preload = 'metadata';
		const blob = URL.createObjectURL(fileQA);
		audio.src = blob;
		audio.addEventListener('loadedmetadata', () => {
			const audioUploaderOptions = {
				fileName: name,
				file: fileQA,
				isForSeasonal: false,
				isForSop: false,
				fieldName: fileName,
			};
			const uploader = new Uploader(audioUploaderOptions, updatePercentage);
			uploader.start();
			switch (fileName) {
				case FieldNames.audioSimplified:
					formik.setFieldValue(FieldNames.audioSimplified, uploader.fileName);
					uploader.onComplete((response: string) => {
						setLoading(false);
						setAudioSimplified(response);
					});
					break;
				case FieldNames.audioTraditional:
					formik.setFieldValue(FieldNames.audioTraditional, uploader.fileName);
					uploader.onComplete((response: string) => {
						setLoading(false);
						setAudioTraditional(response);
					});
					break;
				default:
					break;
			}
		});
		resetInputManually([fileName]);
	};

	const onChangeAudioHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const fileNameQA = e.target.name;
		handleFileUpload(e, fileNameQA);
	}, []);

	const onFileUploadHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const fileQAAudio = event.target.files?.[0];
		const fileName = event.target.name;

		if (fileQAAudio === undefined) {
			return;
		}
		const fileSize = AUDIO_SIZE_MB;
		const fileTypes = [FILE_TYPE.audioType, FILE_TYPE.wavType];

		if (!fileTypes.includes(fileQAAudio.type)) {
			toast.error(Errors.PLEASE_ALLOW_MP3_WAV_FILE);
			return;
		}
		if (fileQAAudio.size / 1000 / 1024 > fileSize) {
			toast.error(`Uploaded audio size is greater than ${fileSize}MB, please upload audio size within ${fileSize}MB or max ${fileSize}MB.`);
			return;
		}
		const lastIndex = fileQAAudio?.name?.lastIndexOf('.');
		const extension = fileQAAudio?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		const audio = document.createElement('audio');
		audio.preload = 'metadata';
		const blob = URL.createObjectURL(fileQAAudio);
		audio.src = blob;
		audio.addEventListener('loadedmetadata', () => {
			setLoading(true);
			const audioUploaderOptions = {
				fileName: name,
				file: fileQAAudio,
				isForSeasonal: false,
				isForSop: false,
				fieldName: fileName,
			};
			const uploader = new Uploader(audioUploaderOptions, updatePercentage);
			uploader.start();
			uploader.onComplete((response: string) => {
				setLoading(false);
				formik.setFieldValue(fileName, response);
			});
		});
		resetInputManually([fileName]);
	}, []);

	/**
	 *
	 * @returns Method used for get validation for add/edit activity
	 */
	const getObjQA = () => {
		const obj: ObjectShape = {
			[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.phraseSimplified]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: recordsList.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_PHRASE),
					[FieldNames.english]: recordsList.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_PHRASE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
					[FieldNames.pinyin]: recordsList.length ? Yup.string().notRequired() : Yup.string().required(Errors.PLEASE_ENTER_PHRASE),
					[FieldNames.audio]: recordsList.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),
				})
			),
			[FieldNames.audioSimplified]: audioSimplified.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.phraseTraditional]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: recordsList.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_PHRASE),
					[FieldNames.english]: recordsList.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_PHRASE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
					[FieldNames.pinyin]: recordsList.length ? Yup.string().notRequired() : Yup.string().required(Errors.PLEASE_ENTER_PHRASE),
					[FieldNames.audio]: recordsList.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),
				})
			),
			[FieldNames.audioTraditional]: audioTraditional.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObjQA();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updatedData: ReadingParagraphActivitySubmitData = {
				title: values.title.trim(),
				simplifiedFile: audioSimplified.split('/').pop() as string,
				traditionalFile: audioTraditional.split('/').pop() as string,
				activityData: recordsList?.map(({ id, ...item }) => ({
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
				isSkippable: provideSkip,
			};
			if (recordsList.length) {
				if (params.activityId) {
					setLoading(true);
					APIService.putData(`${url}/reading-paragraph/${params.activityId}`, { ...updatedData })
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoading(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoading(false);
						});
				} else {
					setLoading(true);
					APIService.postData(`${url}/reading-paragraph`, { ...updatedData, activityTypeId: values.activityTypeId, levelId: values.levelId, topicId: values.topicId, lessonId: values.lessonId })
						.then((response) => {
							if (response.status === ResponseCode.success || ResponseCode.created) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoading(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoading(false);
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
	const copyDataQA = useCallback(() => {
		if (audioTraditional !== '') {
			formik.setFieldValue(FieldNames.audioSimplified, audioTraditional);
			setAudioSimplified(audioTraditional);
		}
		const traditionalDataQA = () => {
			if (formik.values.phraseTraditional.length === 1) {
				const traditionalQA = formik.values.phraseTraditional[0];
				const simplifiedQA = formik.values.phraseSimplified[0];

				if (traditionalQA.chinese.trim() !== '' && traditionalQA.english.trim() !== '' && traditionalQA.pinyin.trim() !== '') {
					return formik.values.phraseTraditional.map((item) => ({ ...item }));
				} else {
					return [{ [FieldNames.chinese]: simplifiedQA.chinese, [FieldNames.english]: simplifiedQA.english, [FieldNames.pinyin]: simplifiedQA.pinyin, [FieldNames.audio]: simplifiedQA.audio }];
				}
			} else {
				return formik.values.phraseTraditional.map((item) => ({ ...item }));
			}
		};
		formik.setFieldValue(FieldNames.phraseSimplified, traditionalDataQA());

		setTimeout(() => {
			formik.validateForm();
		}, 500);
	}, [formik.values]);

	const getErrorQA = (fieldName: keyof CreateReadingComprehensiveActivityForm) => {
		if (fieldName !== FieldNames.phraseSimplified && fieldName != FieldNames.phraseTraditional) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};

	/**
	 * For Add records button
	 */

	const addRecords = useCallback(() => {
		if (formik.values.phraseTraditional.length && formik.values.phraseSimplified.length && formik.values.phraseTraditional.every((item) => item.english.length && item.chinese.length && item.pinyin.length && item.audio.length) && formik.values.phraseSimplified.every((item) => item.english.length && item.chinese.length && item.pinyin.length && item.audio.length)) {
			setRecordsList((prev) => {
				const commonData = {
					simplifiedPhrases: formik.values.phraseSimplified.map((item) => {
						return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim(), audio: item.audio };
					}),
					traditionalPhrases: formik.values.phraseTraditional.map((item) => {
						return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim(), audio: item.audio };
					}),
				};
				const updatedData = prev.map((item) => {
					if (item.id === editListData?.id) {
						const newData = {
							id: editListData?.id, // Use the existing  for editing
							...commonData,
						};
						return { ...item, ...newData };
					} else {
						return item;
					}
				});

				if (!editListData) {
					updatedData.push({
						id: generateUuid(), // Generate a new ID for a new matching activity
						...commonData,
					});
				}
				return updatedData;
			});
			resetFields();
			setEditListData(null);
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
	}, [recordsList, formik, editListData]);

	const resetFields = () => {
		formik.setFieldValue(FieldNames.phraseTraditional, [defaultTraditionalField]);
		formik.setFieldValue(FieldNames.phraseSimplified, [defaultSimplifiedField]);
		validateForm();
	};

	const validateForm = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 100);
	};

	const translateTraditionalField = useCallback(
		(index: number) => {
			translateText(formik.values.phraseTraditional[index].chinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
				// traditional to english
				formik.setFieldValue(`phraseTraditional[${index}].english`, data ?? data);
				formik.setFieldValue(`phraseTraditional[${index}].pinyin`, formik.values.phraseTraditional[index].chinese);
			});
		},
		[formik]
	);

	const translateSimplifiedField = useCallback(
		(index: number) => {
			translateText(formik.values.phraseSimplified[index].chinese, ENGLISH_CODE, SIMPLIFIED_CHINESE_CODE).then((data) => {
				// Simplified to english
				formik.setFieldValue(`phraseSimplified[${index}].english`, data ?? data);
				formik.setFieldValue(`phraseSimplified[${index}].pinyin`, formik.values.phraseSimplified[index].chinese);
			});
		},
		[formik]
	);

	const addMoreTraditionalPhrases = useCallback(() => {
		formik.setFieldValue('phraseTraditional', [...formik.values.phraseTraditional, { chinese: '', english: '', pinyin: '', audio: '' }]);
	}, [formik]);

	const addMoreSimplifiedPhrases = useCallback(() => {
		formik.setFieldValue('phraseSimplified', [...formik.values.phraseSimplified, { chinese: '', english: '', pinyin: '', audio: '' }]);
	}, [formik]);

	const editRecord = useCallback((data: QARecords) => {
		setEditListData(data);
	}, []);

	const deleteRecord = useCallback(
		(data: QARecords) => {
			setRecordsList(recordsList?.filter((recordListItem) => recordListItem.id !== data.id));
		},
		[recordsList]
	);

	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	const [draggedIndexSimplified, setDraggedIndexSimplified] = useState<number | null>(null);

	const handleDragStart = (index: number, name: string) => {
		name === FieldNames.phraseTraditional ? setDraggedIndex(index) : setDraggedIndexSimplified(index);
	};

	const handleDragEnd = () => {
		setDraggedIndex(null);
		setDraggedIndexSimplified(null);
	};

	const handleDragOver = (e: React.DragEvent, index: number, values: QnATranslate[], name: string) => {
		e.preventDefault();

		if (draggedIndex !== null && name === FieldNames.phraseTraditional) {
			const phrases = [...values];
			const draggedPhrase = phrases[draggedIndex];
			phrases.splice(draggedIndex, 1);
			phrases.splice(index, 0, draggedPhrase);
			formik.setFieldValue(name, phrases);
			setDraggedIndex(index);
		}
		if (draggedIndexSimplified !== null && name === FieldNames.phraseSimplified) {
			const phrases = [...values];
			const draggedPhrase = phrases[draggedIndexSimplified];
			phrases.splice(draggedIndexSimplified, 1);
			phrases.splice(index, 0, draggedPhrase);
			formik.setFieldValue(name, phrases);
			setDraggedIndexSimplified(index);
		}
	};

	return (
		<FormikProvider value={formik}>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loading && <Loader />}
				<div className='mb-4'>
					<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorQA(FieldNames.title)} required />
				</div>
				<div className=' grid grid-cols-1 md:grid-cols-2 gap-x-24 mb-4'>
					<div>
						<FileUpload labelName='Audio (Traditional)' id={FieldNames.audioTraditional} imageSource={audioTraditional} name={FieldNames.audioTraditional} error={getErrorQA(FieldNames.audioTraditional) as string} acceptNote='mp3, wav files only' accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} onChange={onChangeAudioHandler} uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} />
						{!isPercentageValid(audioTraditionalPercentage) && <LoadingPercentage percentage={audioTraditionalPercentage} />}
					</div>

					<div>
						<FileUpload labelName='Audio (Simplified)' id={FieldNames.audioSimplified} imageSource={audioSimplified} name={FieldNames.audioSimplified} acceptNote='mp3, wav files only' accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} onChange={onChangeAudioHandler} error={getErrorQA(FieldNames.audioSimplified) as string} uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} />
						{!isPercentageValid(audioSimplifiedPercentage) && <LoadingPercentage percentage={audioSimplifiedPercentage} />}
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
												{formik.values.phraseTraditional?.map((duplicate, index) => {
													const chineseTraditionalQA = `phraseTraditional[${index}].chinese`;
													const englishTraditionalQA = `phraseTraditional[${index}].english`;
													const pinyinTraditionalQA = `phraseTraditional[${index}].pinyin`;
													const audioTraditionalQA = `phraseTraditional[${index}].audio`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 ' draggable onDragStart={() => handleDragStart(index, FieldNames.phraseTraditional)} onDragEnd={handleDragEnd} onDragOver={(e) => handleDragOver(e, index, formik.values.phraseTraditional, FieldNames.phraseTraditional)} onDrop={handleDragEnd} style={draggedIndex === index ? { border: 'dashed ' } : {}}>
															<div className='flex space-x-1 items-start'>
																<div className='mt-7'>
																	<span className='py-1.5 px-3 border rounded  cursor-grab active:cursor-grabbing'>
																		<Drag className='opacity-50' />
																	</span>
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseTraditionalQA} onChange={formik.handleChange} label='Chinese' value={formik.values.phraseTraditional[index].chinese} error={getIn(formik.touched, chineseTraditionalQA) && getIn(formik.errors, chineseTraditionalQA) ? getIn(formik.errors, chineseTraditionalQA) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateTraditionalField} isTranslate={true} title='Translate' />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question english' name={englishTraditionalQA} onChange={formik.handleChange} label='English' value={formik.values.phraseTraditional[index].english} error={getIn(formik.touched, englishTraditionalQA) && getIn(formik.errors, englishTraditionalQA) ? getIn(formik.errors, englishTraditionalQA) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinTraditionalQA} onChange={formik.handleChange} label='Pinyin' value={formik.values.phraseTraditional[index].pinyin} error={getIn(formik.touched, pinyinTraditionalQA) && getIn(formik.errors, pinyinTraditionalQA) ? getIn(formik.errors, pinyinTraditionalQA) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.phraseTraditional.length === 1} btnDanger={true} />
																</div>
															</div>
															<div className='w-full'>
																<FileUpload labelName='Audio' id={audioTraditionalQA} imageSource={formik.values.phraseTraditional[index].audio} name={audioTraditionalQA} error={getIn(formik.touched, audioTraditionalQA) && getIn(formik.errors, audioTraditionalQA) ? getIn(formik.errors, audioTraditionalQA) : ''} acceptNote='mp3, wav files only' accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} onChange={onFileUploadHandler} uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} />
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalPhrases}>
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
						<Button className='btn-default btn-large' title='Copy' onClick={copyDataQA} disabled={disableUpdate}>
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
													{formik.values.phraseSimplified?.map((duplicate, index) => {
														const chineseSimplifiedQA = `phraseSimplified[${index}].chinese`;
														const englishSimplifiedQA = `phraseSimplified[${index}].english`;
														const pinyinSimplifiedQA = `phraseSimplified[${index}].pinyin`;
														const audioSimplifiedQA = `phraseSimplified[${index}].audio`;
														return (
															<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1' draggable onDragStart={() => handleDragStart(index, FieldNames.phraseSimplified)} onDragEnd={handleDragEnd} onDragOver={(e) => handleDragOver(e, index, formik.values.phraseSimplified, FieldNames.phraseSimplified)} onDrop={handleDragEnd} style={draggedIndexSimplified === index ? { border: 'dashed ' } : {}}>
																<div className='flex space-x-1 items-start'>
																	<div className='mt-7'>
																		<span className='py-1.5 px-3 border rounded  cursor-grab active:cursor-grabbing'>
																			<Drag className='opacity-50' />
																		</span>
																	</div>
																	<div className=' w-full'>
																		<TextInput placeholder='Question chinese' name={chineseSimplifiedQA} onChange={formik.handleChange} label='Chinese' value={formik.values.phraseSimplified[index].chinese} error={getIn(formik.touched, chineseSimplifiedQA) && getIn(formik.errors, chineseSimplifiedQA) ? getIn(formik.errors, chineseSimplifiedQA) : ''} required />
																	</div>
																	<div className='mt-7'>
																		<CommonButton data={index} dataHandler={translateSimplifiedField} isTranslate={true} title='Translate' />
																	</div>
																	<div className=' w-full'>
																		<TextInput placeholder='Question english' name={englishSimplifiedQA} onChange={formik.handleChange} label='English' value={formik.values.phraseSimplified[index].english} error={getIn(formik.touched, englishSimplifiedQA) && getIn(formik.errors, englishSimplifiedQA) ? getIn(formik.errors, englishSimplifiedQA) : ''} required />
																	</div>
																	<div className=' w-full'>
																		<TextInput placeholder='Question pinyin' name={pinyinSimplifiedQA} onChange={formik.handleChange} label='Pinyin' value={formik.values.phraseSimplified[index].pinyin} error={getIn(formik.touched, pinyinSimplifiedQA) && getIn(formik.errors, pinyinSimplifiedQA) ? getIn(formik.errors, pinyinSimplifiedQA) : ''} required />
																	</div>
																	<div className='mt-7'>
																		<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.phraseSimplified.length === 1} btnDanger={true} />
																	</div>
																</div>
																<div className='w-full'>
																	<FileUpload labelName='Audio' id={audioSimplifiedQA} imageSource={formik.values.phraseSimplified[index].audio} name={audioSimplifiedQA} error={getIn(formik.touched, audioSimplifiedQA) && getIn(formik.errors, audioSimplifiedQA) ? getIn(formik.errors, audioSimplifiedQA) : ''} acceptNote='mp3, wav files only' accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} onChange={onFileUploadHandler} uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} />
																</div>
															</div>
														);
													})}
													<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedPhrases}>
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
					<Button className='btn-primary mb-3 btn-large' onClick={addRecords}>
						<PlusCircle className='mr-1' /> {editListData ? 'Update' : 'Add New'}
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
							{recordsList && <DNDReadingComprehensive editDisable={editListData} dndItemRow={recordsList} editRecord={editRecord} deleteRecord={deleteRecord} setNewOrder={setNewOrder} />}
							{!recordsList.length && (
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
								id: 'provideSkip',
								name: 'Provide skip button for this activity',
								checked: provideSkip,
								onChange: (e) => {
									setProvideSkip(!provideSkip);
									formik.setFieldValue(FieldNames.isSkippable, e.target.checked);
								},
							},
						]}
					/>
					<Button className='btn-primary btn-large w-28 justify-center' disabled={!!editListData?.id || disableUpdate} type='submit'>
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

export default ActivityReadingComprehensive;
