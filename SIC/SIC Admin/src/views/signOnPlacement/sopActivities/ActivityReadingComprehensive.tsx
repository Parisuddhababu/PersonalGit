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
import { QARecords, CreateReadingComprehensiveActivityForm, QnATranslate, ReadingParagraphActivitySubmitData } from 'src/types/activities/readingComprehension';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import { Uploader } from '@views/activities/utils/upload';
import { FieldNames } from '@views/activities/ActivityReadingComprehensive';
import DNDReadingComprehensive from '@views/activities/DNDReadingComprehensive';
import CommonButton from '@components/common/CommonButton';
import DeleteButton from '@components/common/DeleteButton';

const ActivityReadingComprehensiveSop = ({ onSubmit, onClose, activityUuid, url }: AddEditActivitiesData) => {
	const params = useParams();
	const [loadingQASop, setLoadingQASop] = useState<boolean>(false);
	const defaultTraditionalFieldQASop = { chinese: '', english: '', pinyin: '', audio: '' };
	const defaultSimplifiedFieldQASop = { chinese: '', english: '', pinyin: '', audio: '' };

	const [provideSkipQASop, setProvideSkipQASop] = useState<boolean>(false);
	const [audioSimplifiedQASop, setAudioSimplifiedQASop] = useState<string>('');
	const [audioSimplifiedQASopPercentage, setAudioSimplifiedQASopPercentage] = useState<number>(0);

	const [audioTraditionalQASop, setAudioTraditionalQASop] = useState<string>('');
	const [audioTraditionalQASopPercentage, setAudioTraditionalQASopPercentage] = useState<number>(0);

	const [recordsListQASop, setRecordsListQASop] = useState<QARecords[]>([]);
	const [editListDataQASop, setEditListDataQASop] = useState<QARecords | null>(null);
	const [newOrderQASop, setNewOrderQASop] = useState<QARecords[]>();

	useEffect(() => {
		if (newOrderQASop) {
			setRecordsListQASop(newOrderQASop);
		}
	}, [newOrderQASop]);

	const updatePercentageQASop = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.audioSimplified:
				setAudioSimplifiedQASopPercentage(newPercentage);
				break;
			case FieldNames.audioTraditional:
				setAudioTraditionalQASopPercentage(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidQASop = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdate = !(isPercentageValidQASop(audioTraditionalQASopPercentage) && isPercentageValidQASop(audioSimplifiedQASopPercentage));

	/**
	 * Method is used to set the fields if User click edit data
	 */
	useEffect(() => {
		if (editListDataQASop) {
			formik.setFieldValue(FieldNames.phraseSimplified, editListDataQASop.simplifiedPhrases);
			formik.setFieldValue(FieldNames.phraseTraditional, editListDataQASop.traditionalPhrases);
		}
	}, [editListDataQASop]);

	/**
	 *@returns Method used for setValue from activity data and get the details of activity by uuid
	 */
	useEffect(() => {
		if (params?.activityId) {
			setLoadingQASop(true);
			APIService.getData(`${url}/reading-paragraph/${params?.activityId}?isForSop=true`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const data = response?.data?.data;
						setRecordsListQASop(
							data.activityData.map((item: QARecords) => {
								return { ...item, id: item.activityDataId };
							})
						);
						setProvideSkipQASop(data.isSkippable);
						formik.setFieldValue(FieldNames.title, data.title);
						setAudioSimplifiedQASop(data.simplifiedFile);
						setAudioTraditionalQASop(data?.traditionalFile);
					} else {
						toast.error(response?.data?.message);
					}
					setLoadingQASop(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingQASop(false);
				});
		}
	}, []);

	const initialValues: CreateReadingComprehensiveActivityForm = {
		[FieldNames.levelId]: params.levelId as string,
		[FieldNames.activityTypeId]: activityUuid,

		[FieldNames.title]: '',
		[FieldNames.phraseSimplified]: [defaultSimplifiedFieldQASop],
		[FieldNames.phraseTraditional]: [defaultTraditionalFieldQASop],

		[FieldNames.audioSimplified]: null,
		[FieldNames.audioTraditional]: null,

		[FieldNames.isSkippable]: false,
	};

	const handleFileUploadQASop = (event: React.ChangeEvent<HTMLInputElement>, fileName: string) => {
		const fileQASop = event.target.files?.[0];
		if (fileQASop === undefined) {
			return;
		}
		const fileSize = AUDIO_SIZE_MB;
		const fileTypes = [FILE_TYPE.audioType, FILE_TYPE.wavType];

		if (!fileTypes.includes(fileQASop.type)) {
			setLoadingQASop(false);
			toast.error(Errors.PLEASE_ALLOW_MP3_WAV_FILE);
			return;
		}
		if (fileQASop.size / 1000 / 1024 > fileSize) {
			toast.error(`Uploaded audio size is greater than ${fileSize}MB, please upload audio size within ${fileSize}MB or max ${fileSize}MB.`);
			return;
		}
		const lastIndex = fileQASop?.name?.lastIndexOf('.');
		const extension = fileQASop?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		const audio = document.createElement('audio');
		audio.preload = 'metadata';
		const blob = URL.createObjectURL(fileQASop);
		audio.src = blob;
		audio.addEventListener('loadedmetadata', () => {
			const audioUploaderOptions = {
				fileName: name,
				file: fileQASop,
				isForSeasonal: false,
				isForSop: true,
				fieldName: fileName,
			};
			const uploader = new Uploader(audioUploaderOptions, updatePercentageQASop);
			uploader.start();
			switch (fileName) {
				case FieldNames.audioSimplified:
					formik.setFieldValue(FieldNames.audioSimplified, uploader.fileName);
					uploader.onComplete((response: string) => {
						setLoadingQASop(false);
						setAudioSimplifiedQASop(response);
					});
					break;
				case FieldNames.audioTraditional:
					formik.setFieldValue(FieldNames.audioTraditional, uploader.fileName);
					uploader.onComplete((response: string) => {
						setLoadingQASop(false);
						setAudioTraditionalQASop(response);
					});
					break;
				default:
					break;
			}
		});
		resetInputManually([fileName]);
	};

	const onChangeAudioHandlerQASop = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const fileName = e.target.name;
		handleFileUploadQASop(e, fileName);
	}, []);

	const onFileUploadHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const fileQASopAudio = event.target.files?.[0];
		const fileName = event.target.name;

		if (fileQASopAudio === undefined) {
			return;
		}
		const fileSize = AUDIO_SIZE_MB;
		const fileTypes = [FILE_TYPE.audioType, FILE_TYPE.wavType];

		if (!fileTypes.includes(fileQASopAudio.type)) {
			toast.error(Errors.PLEASE_ALLOW_MP3_WAV_FILE);
			return;
		}
		if (fileQASopAudio.size / 1000 / 1024 > fileSize) {
			toast.error(`Uploaded audio size is greater than ${fileSize}MB, please upload audio size within ${fileSize}MB or max ${fileSize}MB.`);
			return;
		}
		const lastIndex = fileQASopAudio?.name?.lastIndexOf('.');
		const extension = fileQASopAudio?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		const audio = document.createElement('audio');
		audio.preload = 'metadata';
		const blob = URL.createObjectURL(fileQASopAudio);
		audio.src = blob;
		audio.addEventListener('loadedmetadata', () => {
			setLoadingQASop(true);
			const audioUploaderOptions = {
				fileName: name,
				file: fileQASopAudio,
				isForSeasonal: false,
				isForSop: true,
				fieldName: fileName,
			};
			const uploader = new Uploader(audioUploaderOptions, updatePercentageQASop);
			uploader.start();
			uploader.onComplete((response: string) => {
				setLoadingQASop(false);
				formik.setFieldValue(fileName, response);
			});
		});
		resetInputManually([fileName]);
	}, []);

	/**
	 *
	 * @returns Method used for get validation for add/edit activity
	 */
	const getObjQASop = () => {
		const obj: ObjectShape = {
			[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.phraseSimplified]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: recordsListQASop.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_PHRASE),
					[FieldNames.english]: recordsListQASop.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_PHRASE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
					[FieldNames.pinyin]: recordsListQASop.length ? Yup.string().notRequired() : Yup.string().required(Errors.PLEASE_ENTER_PHRASE),
					[FieldNames.audio]: recordsListQASop.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),
				})
			),
			[FieldNames.audioSimplified]: audioSimplifiedQASop.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.phraseTraditional]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: recordsListQASop.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_PHRASE),
					[FieldNames.english]: recordsListQASop.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_PHRASE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
					[FieldNames.pinyin]: recordsListQASop.length ? Yup.string().notRequired() : Yup.string().required(Errors.PLEASE_ENTER_PHRASE),
					[FieldNames.audio]: recordsListQASop.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),
				})
			),
			[FieldNames.audioTraditional]: audioTraditionalQASop.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObjQASop();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updatedData: ReadingParagraphActivitySubmitData = {
				title: values.title.trim(),
				simplifiedFile: audioSimplifiedQASop.split('/').pop() as string,
				traditionalFile: audioTraditionalQASop.split('/').pop() as string,
				activityData: recordsListQASop?.map(({ id, ...item }) => ({
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
				isSkippable: provideSkipQASop,
				isForSop: true,
			};
			if (recordsListQASop.length) {
				if (params.activityId) {
					setLoadingQASop(true);
					APIService.putData(`${url}/reading-paragraph/${params.activityId}?isForSop=true`, { ...updatedData })
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingQASop(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingQASop(false);
						});
				} else {
					setLoadingQASop(true);
					APIService.postData(`${url}/reading-paragraph?isForSop=true`, { ...updatedData, activityTypeId: values.activityTypeId, levelId: values.levelId })
						.then((response) => {
							if (response.status === ResponseCode.success || ResponseCode.created) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingQASop(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingQASop(false);
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
	const copyDataQASop = useCallback(() => {
		if (audioTraditionalQASop !== '') {
			formik.setFieldValue(FieldNames.audioSimplified, audioTraditionalQASop);
			setAudioSimplifiedQASop(audioTraditionalQASop);
		}
		const traditionalData = () => {
			if (formik.values.phraseTraditional.length === 1) {
				const traditionalQASop = formik.values.phraseTraditional[0];
				const simplifiedQASop = formik.values.phraseSimplified[0];

				if (traditionalQASop.chinese.trim() !== '' && traditionalQASop.english.trim() !== '' && traditionalQASop.pinyin.trim() !== '') {
					return formik.values.phraseTraditional.map((item) => ({ ...item }));
				} else {
					return [{ [FieldNames.chinese]: simplifiedQASop.chinese, [FieldNames.english]: simplifiedQASop.english, [FieldNames.pinyin]: simplifiedQASop.pinyin, [FieldNames.audio]: simplifiedQASop.audio }];
				}
			} else {
				return formik.values.phraseTraditional.map((item) => ({ ...item }));
			}
		};
		formik.setFieldValue(FieldNames.phraseSimplified, traditionalData());

		setTimeout(() => {
			formik.validateForm();
		}, 500);
	}, [formik.values]);

	const getErrorQASop = (fieldName: keyof CreateReadingComprehensiveActivityForm) => {
		if (fieldName !== FieldNames.phraseSimplified && fieldName != FieldNames.phraseTraditional) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};

	/**
	 * For Add records button
	 */

	const addRecordsQASop = useCallback(() => {
		if (formik.values.phraseTraditional.length && formik.values.phraseSimplified.length && formik.values.phraseTraditional.every((item) => item.english.length && item.chinese.length && item.pinyin.length && item.audio.length) && formik.values.phraseSimplified.every((item) => item.english.length && item.chinese.length && item.pinyin.length && item.audio.length)) {
			setRecordsListQASop((prev) => {
				const commonData = {
					simplifiedPhrases: formik.values.phraseSimplified.map((item) => {
						return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim(), audio: item.audio };
					}),
					traditionalPhrases: formik.values.phraseTraditional.map((item) => {
						return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim(), audio: item.audio };
					}),
				};
				const updatedData = prev.map((item) => {
					if (item.id === editListDataQASop?.id) {
						const newData = {
							id: editListDataQASop?.id, // Use the existing  for editing
							...commonData,
						};
						return { ...item, ...newData };
					} else {
						return item;
					}
				});

				if (!editListDataQASop) {
					updatedData.push({
						id: generateUuid(), // Generate a new ID for a new matching activity
						...commonData,
					});
				}
				return updatedData;
			});
			resetFieldsQASop();
			setEditListDataQASop(null);
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
	}, [recordsListQASop, formik, editListDataQASop]);

	const resetFieldsQASop = () => {
		formik.setFieldValue(FieldNames.phraseTraditional, [defaultTraditionalFieldQASop]);
		formik.setFieldValue(FieldNames.phraseSimplified, [defaultSimplifiedFieldQASop]);
		validateForm();
	};

	const validateForm = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 100);
	};

	const translateTraditionalFieldQASop = useCallback(
		(index: number) => {
			translateText(formik.values.phraseTraditional[index].chinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
				// traditional to english
				formik.setFieldValue(`phraseTraditional[${index}].english`, data ?? data);
				formik.setFieldValue(`phraseTraditional[${index}].pinyin`, formik.values.phraseTraditional[index].chinese);
			});
		},
		[formik]
	);

	const translateSimplifiedFieldQASop = useCallback(
		(index: number) => {
			translateText(formik.values.phraseSimplified[index].chinese, ENGLISH_CODE, SIMPLIFIED_CHINESE_CODE).then((data) => {
				// Simplified to english
				formik.setFieldValue(`phraseSimplified[${index}].english`, data ?? data);
				formik.setFieldValue(`phraseSimplified[${index}].pinyin`, formik.values.phraseSimplified[index].chinese);
			});
		},
		[formik]
	);

	const addMoreTraditionalPhrasesQASop = useCallback(() => {
		formik.setFieldValue('phraseTraditional', [...formik.values.phraseTraditional, { chinese: '', english: '', pinyin: '', audio: '' }]);
	}, [formik]);

	const addMoreSimplifiedPhrasesQASop = useCallback(() => {
		formik.setFieldValue('phraseSimplified', [...formik.values.phraseSimplified, { chinese: '', english: '', pinyin: '', audio: '' }]);
	}, [formik]);

	const editRecordQASop = useCallback((data: QARecords) => {
		setEditListDataQASop(data);
	}, []);

	const deleteRecordQASop = useCallback(
		(data: QARecords) => {
			setRecordsListQASop(recordsListQASop?.filter((recordListItem) => recordListItem.id !== data.id));
		},
		[recordsListQASop]
	);

	const [draggedIndexQASop, setDraggedIndexQASop] = useState<number | null>(null);
	const [draggedIndexQASopSimplified, setDraggedIndexQASopSimplified] = useState<number | null>(null);

	const handleDragStartQASop = (index: number, name: string) => {
		name === FieldNames.phraseTraditional ? setDraggedIndexQASop(index) : setDraggedIndexQASopSimplified(index);
	};

	const handleDragEndQASop = () => {
		setDraggedIndexQASop(null);
		setDraggedIndexQASopSimplified(null);
	};

	const handleDragOverQASop = (e: React.DragEvent, index: number, values: QnATranslate[], name: string) => {
		e.preventDefault();

		if (draggedIndexQASop !== null && name === FieldNames.phraseTraditional) {
			const phrases = [...values];
			const draggedPhrase = phrases[draggedIndexQASop];
			phrases.splice(draggedIndexQASop, 1);
			phrases.splice(index, 0, draggedPhrase);
			formik.setFieldValue(name, phrases);
			setDraggedIndexQASop(index);
		}
		if (draggedIndexQASopSimplified !== null && name === FieldNames.phraseSimplified) {
			const phrases = [...values];
			const draggedPhrase = phrases[draggedIndexQASopSimplified];
			phrases.splice(draggedIndexQASopSimplified, 1);
			phrases.splice(index, 0, draggedPhrase);
			formik.setFieldValue(name, phrases);
			setDraggedIndexQASopSimplified(index);
		}
	};

	return (
		<FormikProvider value={formik}>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loadingQASop && <Loader />}
				<div className='mb-4'>
					<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorQASop(FieldNames.title)} required />
				</div>
				<div className=' grid grid-cols-1 md:grid-cols-2 gap-x-24 mb-4'>
					<div>
						<FileUpload labelName='Audio (Traditional)' id={FieldNames.audioTraditional} imageSource={audioTraditionalQASop} name={FieldNames.audioTraditional} error={getErrorQASop(FieldNames.audioTraditional) as string} acceptNote='mp3, wav files only' accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} onChange={onChangeAudioHandlerQASop} uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} />
						{!isPercentageValidQASop(audioTraditionalQASopPercentage) && <LoadingPercentage percentage={audioTraditionalQASopPercentage} />}
					</div>

					<div>
						<FileUpload labelName='Audio (Simplified)' id={FieldNames.audioSimplified} imageSource={audioSimplifiedQASop} name={FieldNames.audioSimplified} acceptNote='mp3, wav files only' accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} onChange={onChangeAudioHandlerQASop} error={getErrorQASop(FieldNames.audioSimplified) as string} uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} />
						{!isPercentageValidQASop(audioSimplifiedQASopPercentage) && <LoadingPercentage percentage={audioSimplifiedQASopPercentage} />}
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
													const chineseTraditionalQASop = `phraseTraditional[${index}].chinese`;
													const englishTraditionalQASop = `phraseTraditional[${index}].english`;
													const pinyinTraditionalQASop = `phraseTraditional[${index}].pinyin`;
													const audioTraditionalQASop = `phraseTraditional[${index}].audio`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 ' draggable onDragStart={() => handleDragStartQASop(index, FieldNames.phraseTraditional)} onDragEnd={handleDragEndQASop} onDragOver={(e) => handleDragOverQASop(e, index, formik.values.phraseTraditional, FieldNames.phraseTraditional)} onDrop={handleDragEndQASop} style={draggedIndexQASop === index ? { border: 'dashed ' } : {}}>
															<div className='flex space-x-1 items-start'>
																<div className='mt-7'>
																	<span className='py-1.5 px-3 border rounded  cursor-grab active:cursor-grabbing'>
																		<Drag className='opacity-50' />
																	</span>
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseTraditionalQASop} onChange={formik.handleChange} label='Chinese' value={formik.values.phraseTraditional[index].chinese} error={getIn(formik.touched, chineseTraditionalQASop) && getIn(formik.errors, chineseTraditionalQASop) ? getIn(formik.errors, chineseTraditionalQASop) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateTraditionalFieldQASop} isTranslate={true} title='Translate' />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question english' name={englishTraditionalQASop} onChange={formik.handleChange} label='English' value={formik.values.phraseTraditional[index].english} error={getIn(formik.touched, englishTraditionalQASop) && getIn(formik.errors, englishTraditionalQASop) ? getIn(formik.errors, englishTraditionalQASop) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinTraditionalQASop} onChange={formik.handleChange} label='Pinyin' value={formik.values.phraseTraditional[index].pinyin} error={getIn(formik.touched, pinyinTraditionalQASop) && getIn(formik.errors, pinyinTraditionalQASop) ? getIn(formik.errors, pinyinTraditionalQASop) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.phraseTraditional.length === 1} btnDanger={true} />
																</div>
															</div>
															<div className='w-full'>
																<FileUpload labelName='Audio' id={audioTraditionalQASop} imageSource={formik.values.phraseTraditional[index].audio} name={audioTraditionalQASop} error={getIn(formik.touched, audioTraditionalQASop) && getIn(formik.errors, audioTraditionalQASop) ? getIn(formik.errors, audioTraditionalQASop) : ''} acceptNote='mp3, wav files only' accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} onChange={onFileUploadHandler} uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} />
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalPhrasesQASop}>
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
						<Button className='btn-default btn-large' title='Copy' onClick={copyDataQASop} disabled={disableUpdate}>
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
														const chineseSimplifiedQASop = `phraseSimplified[${index}].chinese`;
														const englishSimplifiedQASop = `phraseSimplified[${index}].english`;
														const pinyinSimplifiedQASop = `phraseSimplified[${index}].pinyin`;
														const audioSimplifiedQASop = `phraseSimplified[${index}].audio`;
														return (
															<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1' draggable onDragStart={() => handleDragStartQASop(index, FieldNames.phraseSimplified)} onDragEnd={handleDragEndQASop} onDragOver={(e) => handleDragOverQASop(e, index, formik.values.phraseSimplified, FieldNames.phraseSimplified)} onDrop={handleDragEndQASop} style={draggedIndexQASopSimplified === index ? { border: 'dashed ' } : {}}>
																<div className='flex space-x-1 items-start w-full'>
																	<div className='mt-7'>
																		<span className='py-1.5 px-3 border rounded  cursor-grab active:cursor-grabbing'>
																			<Drag className='opacity-50' />
																		</span>
																	</div>
																	<div className=' w-full'>
																		<TextInput placeholder='Question chinese' name={chineseSimplifiedQASop} onChange={formik.handleChange} label='Chinese' value={formik.values.phraseSimplified[index].chinese} error={getIn(formik.touched, chineseSimplifiedQASop) && getIn(formik.errors, chineseSimplifiedQASop) ? getIn(formik.errors, chineseSimplifiedQASop) : ''} required />
																	</div>
																	<div className='mt-7'>
																		<CommonButton data={index} dataHandler={translateSimplifiedFieldQASop} isTranslate={true} title='Translate' />
																	</div>
																	<div className=' w-full'>
																		<TextInput placeholder='Question english' name={englishSimplifiedQASop} onChange={formik.handleChange} label='English' value={formik.values.phraseSimplified[index].english} error={getIn(formik.touched, englishSimplifiedQASop) && getIn(formik.errors, englishSimplifiedQASop) ? getIn(formik.errors, englishSimplifiedQASop) : ''} required />
																	</div>
																	<div className=' w-full'>
																		<TextInput placeholder='Question pinyin' name={pinyinSimplifiedQASop} onChange={formik.handleChange} label='Pinyin' value={formik.values.phraseSimplified[index].pinyin} error={getIn(formik.touched, pinyinSimplifiedQASop) && getIn(formik.errors, pinyinSimplifiedQASop) ? getIn(formik.errors, pinyinSimplifiedQASop) : ''} required />
																	</div>
																	<div className='mt-7'>
																		<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.phraseSimplified.length === 1} btnDanger={true} />
																	</div>
																</div>
																<div className='w-full'>
																	<FileUpload labelName='Audio' id={audioSimplifiedQASop} imageSource={formik.values.phraseSimplified[index].audio} name={audioSimplifiedQASop} error={getIn(formik.touched, audioSimplifiedQASop) && getIn(formik.errors, audioSimplifiedQASop) ? getIn(formik.errors, audioSimplifiedQASop) : ''} acceptNote='mp3, wav files only' accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} onChange={onFileUploadHandler} uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} />
																</div>
															</div>
														);
													})}
													<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedPhrasesQASop}>
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
					<Button className='btn-primary mb-3 btn-large' onClick={addRecordsQASop}>
						<PlusCircle className='mr-1' /> {editListDataQASop ? 'Update' : 'Add New'}
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
							{recordsListQASop && <DNDReadingComprehensive editDisable={editListDataQASop} dndItemRow={recordsListQASop} editRecord={editRecordQASop} deleteRecord={deleteRecordQASop} setNewOrder={setNewOrderQASop} />}
							{!recordsListQASop.length && (
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
								id: 'provideSkipQASop',
								name: 'Provide skip button for this activity',
								checked: provideSkipQASop,
								onChange: (e) => {
									setProvideSkipQASop(!provideSkipQASop);
									formik.setFieldValue(FieldNames.isSkippable, e.target.checked);
								},
							},
						]}
					/>
					<Button className='btn-primary btn-large w-28 justify-center' disabled={!!editListDataQASop?.id || disableUpdate} type='submit'>
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

export default ActivityReadingComprehensiveSop;
