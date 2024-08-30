import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { FieldArray, FormikProvider, getIn, useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import TextInput from '@components/textInput/TextInput';
import { AddEditActivitiesData, MyArrayHelpers } from 'src/types/activities';
import CheckBox from '@components/checkbox/CheckBox';
import { useParams } from 'react-router-dom';
import { FieldNames, ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { APIService } from '@framework/services/api';
import { Loader } from '@components/index';
import { AngleRight, Cross, Plus } from '@components/icons';
import { Errors } from '@config/errors';
import { IMAGE_NOTE, FILE_TYPE, fileTypeEnum, activityPaths, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE } from '@config/constant';
import FileUpload from '@components/fileUpload/FileUpload';
import { generateUuid, moveData, resetInputManually, translateText, typeValidation } from '@utils/helpers';
import { Uploader } from './utils/upload';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import DeleteButton from '@components/common/DeleteButton';
import { CreateImageActivityForm, ImageActivitySubmitData } from 'src/types/activities/image';
import { mixedNotRequired, mixedRequired, stringNoSpecialChar, stringNotRequired, stringRequired, stringTrim } from '@config/validations';

export type SetFile = Dispatch<SetStateAction<string>>;

const ActivityImage = ({ onSubmit, onClose, url, activityUuid, toggleActivity, isMoving, levelId, topicId, lessonId }: AddEditActivitiesData) => {
	const params = useParams();
	const defaultTraditionalImage = { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' };
	const defaultSimplifiedImage = { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' };
	const [loadingImage, setLoadingImage] = useState<boolean>(false);
	const [provideSkipImage, setProvideSkipImage] = useState<boolean>(false);

	const [simplifiedFileImage, setSimplifiedFileImage] = useState<string>('');
	const [simplifiedImagePercentage, setSimplifiedImagePercentage] = useState<number>(0);
	const [traditionalFileImage, setTraditionalFileImage] = useState<string>('');
	const [traditionalImagePercentage, setTraditionalImagePercentage] = useState<number>(0);

	const [simplifiedFileBackgroundAudio, setSimplifiedFileBackgroundAudio] = useState<string>('');
	const [simplifiedFileBackgroundAudioPercent, setSimplifiedFileBackgroundAudioPercent] = useState<number>(0);

	const [traditionalFileBackgroundAudio, setTraditionalFileBackgroundAudio] = useState<string>('');
	const [traditionalFileBackgroundAudioPercent, setTraditionalFileBackgroundAudioPercent] = useState<number>(0);

	const [simplifiedFileAudio, setSimplifiedFileAudio] = useState<string>('');
	const [simplifiedFileAudioPercentage, setSimplifiedFileAudioPercentage] = useState<number>(0);

	const [traditionalFileAudio, setTraditionalFileAudio] = useState<string>('');
	const [traditionalFileAudioPercentage, setTraditionalFileAudioPercentage] = useState<number>(0);

	const [simplifiedMicAllowed, setSimplifiedMicAllowed] = useState<boolean>(false);
	const [traditionalMicAllowed, setTraditionalMicAllowed] = useState<boolean>(false);

	const defaultSpeechToTextTraditional = { [FieldNames.chinese]: '' };
	const defaultSpeechToTextSimplified = { [FieldNames.chinese]: '' };

	const updatePercentageImage = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.simplifiedFile:
				setSimplifiedImagePercentage(newPercentage);
				break;
			case FieldNames.traditionalFile:
				setTraditionalImagePercentage(newPercentage);
				break;
			case FieldNames.simplifiedBackgroundAudio:
				setSimplifiedFileBackgroundAudioPercent(newPercentage);
				break;
			case FieldNames.traditionalBackgroundAudio:
				setTraditionalFileBackgroundAudioPercent(newPercentage);
				break;
			case FieldNames.traditionalAudio:
				setTraditionalFileAudioPercentage(newPercentage);
				break;
			case FieldNames.simplifiedAudio:
				setSimplifiedFileAudioPercentage(newPercentage);
				break;
			default:
				break;
		}
	};

	const disableUpdateImage = !(simplifiedImagePercentage === 0 || simplifiedImagePercentage === 100) || !(traditionalImagePercentage === 0 || traditionalImagePercentage === 100) || !(simplifiedFileBackgroundAudioPercent === 0 || simplifiedFileBackgroundAudioPercent === 100) || !(traditionalFileBackgroundAudioPercent === 0 || traditionalFileBackgroundAudioPercent === 100) || !(simplifiedFileAudioPercentage === 0 || simplifiedFileAudioPercentage === 100) || !(traditionalFileAudioPercentage === 0 || traditionalFileAudioPercentage === 100);

	/**
	 *@returns Method used for setValue from questions data and get the details of question by uuid
	 */
	useEffect(() => {
		if (params.activityId) {
			setLoadingImage(true);
			APIService.getData(`${url}/${activityPaths.image}/${params.activityId}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const { title, activityData, isSkippable, toggle } = response.data.data;
						toggleActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);

						formik.setFieldValue(FieldNames.title, title);

						formik.setFieldValue(FieldNames.simplifiedFile, activityData?.simplifiedFile);
						formik.setFieldValue(FieldNames.simplifiedBackgroundAudio, activityData?.simplifiedBackgroundAudio);
						formik.setFieldValue(FieldNames.simplifiedAudio, activityData?.simplifiedAudio);
						formik.setFieldValue(FieldNames.simplifiedIsMicAllowed, activityData?.simplifiedIsMicAllowed);
						formik.setFieldValue(FieldNames.simplifiedSpeechToTextFile, activityData?.simplifiedSpeechToTextFile);
						formik.setFieldValue(FieldNames.simplifiedSpeechToTextDataArray, activityData?.simplifiedSpeechToTextDataArray ?? [defaultSpeechToTextSimplified]);

						formik.setFieldValue(FieldNames.traditionalFile, activityData?.traditionalFile);
						formik.setFieldValue(FieldNames.traditionalBackgroundAudio, activityData?.traditionalBackgroundAudio);
						formik.setFieldValue(FieldNames.traditionalAudio, activityData?.traditionalAudio);
						formik.setFieldValue(FieldNames.traditionalIsMicAllowed, activityData?.traditionalIsMicAllowed);
						formik.setFieldValue(FieldNames.traditionalSpeechToTextFile, activityData?.traditionalSpeechToTextFile);
						formik.setFieldValue(FieldNames.traditionalSpeechToTextDataArray, activityData?.traditionalSpeechToTextDataArray ?? [defaultSpeechToTextTraditional]);

						setProvideSkipImage(isSkippable);

						setTraditionalFileImage(activityData?.traditionalFile);
						setSimplifiedFileImage(activityData?.simplifiedFile);

						setTraditionalFileAudio(activityData?.traditionalAudio);
						setSimplifiedFileAudio(activityData?.simplifiedAudio);

						setTraditionalFileBackgroundAudio(activityData?.traditionalBackgroundAudio);
						setSimplifiedFileBackgroundAudio(activityData?.simplifiedBackgroundAudio);

						formik.setFieldValue(FieldNames?.traditionalTitle, activityData?.traditionalTitle);
						formik.setFieldValue(FieldNames?.simplifiedTitle, activityData?.simplifiedTitle);
					}
					setLoadingImage(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingImage(false);
				});
		}
	}, []);

	const initialValues: CreateImageActivityForm = {
		[FieldNames.levelId]: params.levelId as string,
		[FieldNames.lessonId]: params.lessonId as string,
		[FieldNames.topicId]: params.topicId as string,
		[FieldNames.activityTypeId]: activityUuid,

		[FieldNames.title]: '',
		[FieldNames.simplifiedFile]: '',
		[FieldNames.simplifiedTitle]: [defaultSimplifiedImage],
		[FieldNames.simplifiedAudio]: '',
		[FieldNames.simplifiedBackgroundAudio]: '',
		[FieldNames.simplifiedIsMicAllowed]: false,
		[FieldNames.simplifiedSpeechToTextFile]: '',
		[FieldNames.simplifiedSpeechToTextDataArray]: [defaultSpeechToTextSimplified],

		[FieldNames.traditionalFile]: '',
		[FieldNames.traditionalTitle]: [defaultTraditionalImage],
		[FieldNames.traditionalBackgroundAudio]: '',
		[FieldNames.traditionalAudio]: '',
		[FieldNames.traditionalIsMicAllowed]: false,
		[FieldNames.traditionalSpeechToTextFile]: '',
		[FieldNames.traditionalSpeechToTextDataArray]: [defaultSpeechToTextTraditional],

		[FieldNames.isSkippable]: false,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit questions
	 */
	const getObjImage = () => {
		const objImage: ObjectShape = {
			[FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
			[FieldNames.simplifiedFile]: simplifiedFileImage ? mixedNotRequired() : mixedRequired(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.simplifiedTitle]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: stringTrim(Errors.PLEASE_ENTER_ACTIVITY_CHINESE_TITLE),
					[FieldNames.pinyin]: stringRequired(Errors.PLEASE_ENTER_ACTIVITY_PINYIN_TITLE),
				})
			),
			[FieldNames.simplifiedSpeechToTextDataArray]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: simplifiedMicAllowed ? stringTrim(Errors.PLEASE_ENTER_TEXT) : stringNotRequired(),
				})
			),
			[FieldNames.simplifiedAudio]: simplifiedMicAllowed && simplifiedFileAudio === '' ? mixedRequired(Errors.PLEASE_SELECT_AUDIO) : stringNotRequired(),

			[FieldNames.traditionalFile]: traditionalFileImage ? mixedNotRequired() : mixedRequired(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.traditionalTitle]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: stringTrim(Errors.PLEASE_ENTER_ACTIVITY_CHINESE_TITLE),
					[FieldNames.pinyin]: stringRequired(Errors.PLEASE_ENTER_ACTIVITY_PINYIN_TITLE),
				})
			),
			[FieldNames.traditionalSpeechToTextDataArray]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: traditionalMicAllowed ? stringTrim(Errors.PLEASE_ENTER_TEXT) : stringNotRequired(),
				})
			),
			[FieldNames.traditionalAudio]: traditionalMicAllowed && traditionalFileAudio === '' ? mixedRequired(Errors.PLEASE_SELECT_AUDIO) : stringNotRequired(),
		};
		return Yup.object<ObjectShape>(objImage);
	};
	const validationSchema = getObjImage();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const submitDataImage: ImageActivitySubmitData = {
				isMoving: isMoving,
				levelId: moveData(isMoving, levelId as string, values.levelId as string),
				topicId: moveData(isMoving, topicId as string, values.topicId),
				lessonId: moveData(isMoving, lessonId as string, values.lessonId),
				activityTypeId: activityUuid,
				title: values.title.trim(),
				activityData: {
					simplifiedTitle: values.simplifiedTitle,
					simplifiedFile: simplifiedFileImage.split('/').pop() as string,
					simplifiedAudio: simplifiedFileAudio.split('/').pop() as string,
					simplifiedBackgroundAudio: simplifiedFileBackgroundAudio.split('/').pop() as string,
					simplifiedIsMicAllowed: values.simplifiedIsMicAllowed,
					simplifiedSpeechToTextFile: simplifiedMicAllowed ? values.simplifiedTitle.map((item) => item.chinese)?.join(' ') : '',
					simplifiedSpeechToTextDataArray: values.simplifiedSpeechToTextDataArray,

					traditionalTitle: values.traditionalTitle,
					traditionalFile: traditionalFileImage.split('/').pop() as string,
					traditionalAudio: traditionalFileAudio.split('/').pop() as string,
					traditionalBackgroundAudio: traditionalFileBackgroundAudio.split('/').pop() as string,
					traditionalIsMicAllowed: values.traditionalIsMicAllowed,
					traditionalSpeechToTextFile: traditionalMicAllowed ? values.traditionalTitle.map((item) => item.chinese)?.join(' ') : '',
					traditionalSpeechToTextDataArray: values.traditionalSpeechToTextDataArray,
				},
				isSkippable: provideSkipImage,
			};
			if (params.activityId) {
				setLoadingImage(true);
				APIService.putData(`${url}/${activityPaths.image}/${params.activityId}`, submitDataImage)
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							onClose();
							onSubmit();
							formik.resetForm();
						}
						setLoadingImage(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingImage(false);
					});
			} else {
				setLoadingImage(true);
				APIService.postData(`${url}/${activityPaths.image}`, submitDataImage)
					.then((response) => {
						if (response.status === ResponseCode.success || ResponseCode.created) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoadingImage(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingImage(false);
					});
			}
		},
	});

	const traditionalDataImage = () => {
		if (formik.values.traditionalTitle.length === 1) {
			const traditionalImageTitle = formik.values.traditionalTitle[0];
			const simplifiedImageTitle = formik.values.simplifiedTitle[0];

			if ((traditionalImageTitle.chinese.trim() !== '', traditionalImageTitle.pinyin.trim() !== '')) {
				return formik.values.traditionalTitle.map((item, index) => ({
					...item,
					chinese: translateText(item.chinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
						formik.setFieldValue(`simplifiedTitle[${index}].chinese`, data ?? data);
					}),
				}));
			} else {
				return [{ [FieldNames.chinese]: simplifiedImageTitle.chinese, [FieldNames.pinyin]: simplifiedImageTitle.pinyin }];
			}
		} else {
			return formik.values.traditionalTitle.map((item, index) => ({
				...item,
				chinese: translateText(item.chinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
					formik.setFieldValue(`simplifiedTitle[${index}].chinese`, data ?? data);
				}),
			}));
		}
	};

	const traditionalSpeechToText = () => {
		if (formik.values.traditionalSpeechToTextDataArray.length === 1) {
			const traditionalText = formik.values.traditionalSpeechToTextDataArray[0];
			const simplifiedText = formik.values.simplifiedSpeechToTextDataArray[0];

			if (traditionalText.chinese.trim() !== '') {
				return formik.values.traditionalSpeechToTextDataArray.map((item, index) => ({
					...item,
					chinese: translateText(item.chinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
						formik.setFieldValue(`simplifiedSpeechToTextDataArray[${index}].chinese`, data ?? data);
					}),
				}));
			} else {
				return [{ [FieldNames.chinese]: simplifiedText.chinese }];
			}
		} else {
			return formik.values.traditionalSpeechToTextDataArray.map((item, index) => ({
				...item,
				chinese: translateText(item.chinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
					formik.setFieldValue(`simplifiedSpeechToTextDataArray[${index}].chinese`, data ?? data);
				}),
			}));
		}
	};

	/**
	 *
	 * @returns Method used to Copy data from left to right form
	 */
	const copyDataImage = useCallback(() => {
		formik.setFieldValue(FieldNames.simplifiedTitle, traditionalDataImage());
		formik.setFieldValue(FieldNames.simplifiedSpeechToTextDataArray, traditionalSpeechToText());
		if (traditionalFileAudio !== '') {
			formik.setFieldValue(FieldNames.simplifiedAudio, formik.values.traditionalAudio);
			setSimplifiedFileAudio(traditionalFileAudio);
		}
		if (traditionalFileBackgroundAudio !== '') {
			setSimplifiedFileBackgroundAudio(traditionalFileBackgroundAudio);
			formik.setFieldValue(FieldNames.simplifiedBackgroundAudio, formik.values.traditionalBackgroundAudio);
		}
		if (traditionalFileImage !== '') {
			formik.setFieldValue(FieldNames.simplifiedFile, formik.values.traditionalFile);
			setSimplifiedFileImage(traditionalFileImage);
		}
		formik.setFieldValue(FieldNames.simplifiedIsMicAllowed, formik.values.traditionalIsMicAllowed);

		validateFormImage();
	}, [formik, traditionalFileBackgroundAudio, traditionalFileImage, traditionalFileAudio]);

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const handleFileUploadImage = (event: React.ChangeEvent<HTMLInputElement>, type: string, fileName: string) => {
		const fileImage = event.target.files?.[0] as File;
		typeValidation(fileImage, type);
		const lastIndex = fileImage?.name?.lastIndexOf('.');
		const extension = fileImage?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileImage);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptions = {
					fileName: name,
					file: fileImage,
					isForSeasonal: false,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(imageUploaderOptions, updatePercentageImage);
				uploader.start();
				switch (fileName) {
					case FieldNames.traditionalFile:
						formik.setFieldValue(FieldNames.traditionalFile, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingImage(false);
							setTraditionalFileImage(response);
						});
						break;
					case FieldNames.simplifiedFile:
						formik.setFieldValue(FieldNames.simplifiedFile, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingImage(false);
							setSimplifiedFileImage(response);
						});
						break;
					default:
						break;
				}
			});
		}
		if (type === fileTypeEnum.audio) {
			const audio = document.createElement('audio');
			audio.preload = 'metadata';
			const blob = URL.createObjectURL(fileImage);
			audio.src = blob;
			audio.addEventListener('loadedmetadata', () => {
				const audioUploaderOptions = {
					fileName: name,
					file: fileImage,
					isForSeasonal: false,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(audioUploaderOptions, updatePercentageImage);
				uploader.start();
				switch (fileName) {
					case FieldNames.simplifiedBackgroundAudio:
						formik.setFieldValue(FieldNames.simplifiedBackgroundAudio, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingImage(false);
							setSimplifiedFileBackgroundAudio(response);
						});
						break;
					case FieldNames.simplifiedAudio:
						formik.setFieldValue(FieldNames.simplifiedAudio, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingImage(false);
							setSimplifiedFileAudio(response);
						});
						break;
					case FieldNames.traditionalBackgroundAudio:
						formik.setFieldValue(FieldNames.traditionalBackgroundAudio, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingImage(false);
							setTraditionalFileBackgroundAudio(response);
						});
						break;
					case FieldNames.traditionalAudio:
						formik.setFieldValue(FieldNames.traditionalAudio, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingImage(false);
							setTraditionalFileAudio(response);
						});
						break;
					default:
						break;
				}
			});
		}
	};

	const fileUpdateImage = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileName = event.target.name;
		handleFileUploadImage(event, type, fileName);
	}, []);

	useEffect(() => {
		formik.values.simplifiedIsMicAllowed ? setSimplifiedMicAllowed(true) : setSimplifiedMicAllowed(false);
		formik.values.traditionalIsMicAllowed ? setTraditionalMicAllowed(true) : setTraditionalMicAllowed(false);
	}, [formik.values.simplifiedIsMicAllowed, formik.values.traditionalIsMicAllowed]);

	const getErrorImage = (fieldName: keyof CreateImageActivityForm) => {
		if (fieldName !== FieldNames.traditionalTitle && fieldName !== FieldNames.simplifiedTitle) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};
	const validateFormImage = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 500);
	};

	const addMoreTraditionalPhrasesImage = useCallback(() => {
		formik.setFieldValue('traditionalTitle', [...formik.values.traditionalTitle, { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' }]);
	}, [formik]);

	const addMoreSimplifiedPhrasesImage = useCallback(() => {
		formik.setFieldValue('simplifiedTitle', [...formik.values.simplifiedTitle, { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' }]);
	}, [formik]);

	// Create a generic function that takes the state setter as a parameter
	const useResetFile = (setFile: SetFile, fileName: string) => {
		const resetFile = useCallback(() => {
			setFile('');
			formik.setFieldValue(fileName, '');
			resetInputManually([fileName]);
			validateFormImage();
		}, [setFile]);

		return resetFile;
	};

	const addMoreTraditionalSpeechToText = useCallback(() => {
		formik.setFieldValue(FieldNames.traditionalSpeechToTextDataArray, [...formik.values.traditionalSpeechToTextDataArray, { [FieldNames.chinese]: '' }]);
	}, [formik]);

	const addMoreSimplifiedSpeechToText = useCallback(() => {
		formik.setFieldValue(FieldNames.simplifiedSpeechToTextDataArray, [...formik.values.simplifiedSpeechToTextDataArray, { [FieldNames.chinese]: '' }]);
	}, [formik]);

	return (
		<FormikProvider value={formik}>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loadingImage && <Loader />}
				<div className={`${cn(ModelStyle['model__body'])}`}>
					<div className='mb-4'>
						<TextInput placeholder='English Title' name={FieldNames.title} onChange={formik.handleChange} label='English Title' value={formik.values.title} error={getErrorImage(FieldNames.title) as string} required />
					</div>
					<div className='flex flex-col md:flex-row gap-3 mb-4'>
						<div className='rounded border w-full'>
							<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Traditional Chinese</h6>
							<div className='grid grid-cols-1 gap-x-4 p-3'>
								<div>
									<div className='font-medium'>
										Title <span className='text-error'>*</span>
									</div>
									<div className='p-4 rounded border bg-gray-50 mb-4'>
										<FieldArray
											name={FieldNames.traditionalTitle}
											render={useCallback(
												(arrayHelpers: MyArrayHelpers) => (
													<div className='mb-4 col-span-2'>
														{formik.values.traditionalTitle?.map((_, index) => {
															const chineseImageTraditional = `traditionalTitle[${index}].chinese`;
															const pinyinImageTraditional = `traditionalTitle[${index}].pinyin`;
															return (
																<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
																	<div className='flex space-x-3 items-start'>
																		<div className=' w-full'>
																			<TextInput placeholder='Chinese' name={chineseImageTraditional} onChange={formik.handleChange} label='Chinese' value={formik.values.traditionalTitle[index].chinese} error={getIn(formik.touched, chineseImageTraditional) && getIn(formik.errors, chineseImageTraditional) ? getIn(formik.errors, chineseImageTraditional) : ''} required />
																		</div>
																		<div className=' w-full'>
																			<TextInput placeholder='Pinyin' name={pinyinImageTraditional} onChange={formik.handleChange} label='Pinyin' value={formik.values.traditionalTitle[index].pinyin} error={getIn(formik.touched, pinyinImageTraditional) && getIn(formik.errors, pinyinImageTraditional) ? getIn(formik.errors, pinyinImageTraditional) : ''} required />
																		</div>
																		<div className='mt-7'>
																			<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.traditionalTitle.length === 1} btnDanger={true} />
																		</div>
																	</div>
																</div>
															);
														})}
														<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalPhrasesImage}>
															<Plus className='mr-3' /> Add More
														</Button>
													</div>
												),
												[formik]
											)}
										/>
									</div>
								</div>
								<div>
									<div className='font-medium'>Speech to Text {traditionalMicAllowed && <span className='text-error'>*</span>}</div>
									<div className='p-4 rounded border bg-gray-50 mb-4'>
										<FieldArray
											name={FieldNames.traditionalSpeechToTextDataArray}
											render={useCallback(
												(arrayHelpers: MyArrayHelpers) => (
													<div className='mb-4 col-span-2'>
														{formik.values.traditionalSpeechToTextDataArray?.map((_, index) => {
															const speechToTextTraditional = `traditionalSpeechToTextDataArray[${index}].chinese`;
															return (
																<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
																	<div className='flex space-x-3 items-start'>
																		<div className=' w-full'>
																			<TextInput placeholder='Chinese' name={speechToTextTraditional} onChange={formik.handleChange} label='Chinese' value={formik.values.traditionalSpeechToTextDataArray[index].chinese} error={getIn(formik.touched, speechToTextTraditional) && getIn(formik.errors, speechToTextTraditional) ? getIn(formik.errors, speechToTextTraditional) : ''} required={traditionalMicAllowed} />
																		</div>
																		<div className='mt-7'>
																			<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.traditionalSpeechToTextDataArray.length === 1} btnDanger={true} />
																		</div>
																	</div>
																</div>
															);
														})}
														<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalSpeechToText}>
															<Plus className='mr-3' /> Add More
														</Button>
													</div>
												),
												[formik]
											)}
										/>
									</div>
								</div>
								<div className='mb-4'>
									<FileUpload
										labelName='Upload Image'
										id='traditionalFile'
										imageSource={traditionalFileImage}
										name={FieldNames.traditionalFile}
										error={getErrorImage(FieldNames.traditionalFile) as string}
										uploadType={FILE_TYPE.jpegType || FILE_TYPE.pngType}
										acceptNote={IMAGE_NOTE}
										accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}`}
										onChange={useCallback((e) => {
											fileUpdateImage(e, fileTypeEnum.image);
										}, [])}
									/>
									{traditionalImagePercentage !== 0 && traditionalImagePercentage !== 100 && <LoadingPercentage percentage={traditionalImagePercentage} />}
								</div>
								<div className='flex'>
									<div className='mb-4 w-[680px]'>
										<FileUpload
											labelName='Background Audio'
											id={FieldNames.traditionalBackgroundAudio}
											imageSource={traditionalFileBackgroundAudio}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.traditionalBackgroundAudio}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											isRequired={false}
											onChange={useCallback((e) => {
												fileUpdateImage(e, fileTypeEnum.audio);
											}, [])}
											error={getErrorImage(FieldNames.traditionalBackgroundAudio) as string}
										/>
										{traditionalFileBackgroundAudioPercent !== 0 && traditionalFileBackgroundAudioPercent !== 100 && <LoadingPercentage percentage={traditionalFileBackgroundAudioPercent} />}
									</div>
									<div className='mt-10'>
										<Button onClick={useResetFile(setTraditionalFileBackgroundAudio, FieldNames.traditionalBackgroundAudio)}>
											<Cross />
										</Button>
									</div>
								</div>
								<div className='flex'>
									<div className='mb-4 w-[680px]'>
										<FileUpload
											labelName='Upload Audio'
											id='traditionalAudio'
											imageSource={traditionalFileAudio}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.traditionalAudio}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											isRequired={traditionalMicAllowed}
											onChange={useCallback((e) => {
												fileUpdateImage(e, fileTypeEnum.audio);
											}, [])}
											error={getErrorImage(FieldNames.traditionalAudio) as string}
										/>
										{traditionalFileAudioPercentage !== 0 && traditionalFileAudioPercentage !== 100 && <LoadingPercentage percentage={traditionalFileAudioPercentage} />}
									</div>
									<div className='mt-10'>
										<Button onClick={useResetFile(setTraditionalFileAudio, FieldNames.traditionalAudio)}>
											<Cross />
										</Button>
									</div>
								</div>
								<div className='mb-4'>
									<CheckBox
										option={[
											{
												id: 'AllowAudioTraditional',
												name: 'Allow Mic?',
												value: 'Allow Mic?',
												checked: formik.values.traditionalIsMicAllowed,
												onChange: () => {
													formik.setFieldValue(FieldNames.traditionalIsMicAllowed, !formik.values.traditionalIsMicAllowed);
													validateFormImage();
												},
											},
										]}
									/>
								</div>
							</div>
						</div>

						<div className='flex flex-col justify-center items-center p-3'>
							<Button className='btn-default btn-large' title='Copy' onClick={copyDataImage} disabled={disableUpdateImage}>
								<AngleRight className='text-md' />
							</Button>
							<span className='mt-1 text-gray-500'>Copy</span>
						</div>
						<div className='rounded border w-full'>
							<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Simplified Chinese</h6>
							<div className='grid grid-cols-1 gap-x-4 p-3'>
								<div>
									<div className='font-medium'>
										Title <span className='text-error'>*</span>
									</div>
									<div className='p-4 rounded border bg-gray-50 mb-4'>
										<FieldArray
											name={FieldNames.simplifiedTitle}
											render={useCallback(
												(arrayHelpers: MyArrayHelpers) => (
													<div className='mb-4 col-span-2'>
														{formik.values.simplifiedTitle?.map((_, index) => {
															const chineseImageSimplified = `simplifiedTitle[${index}].chinese`;
															const pinyinImageSimplified = `simplifiedTitle[${index}].pinyin`;
															return (
																<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
																	<div className='flex space-x-3 items-start'>
																		<div className=' w-full'>
																			<TextInput placeholder='Chinese' name={chineseImageSimplified} onChange={formik.handleChange} label='Chinese' value={formik.values.simplifiedTitle[index].chinese} error={getIn(formik.touched, chineseImageSimplified) && getIn(formik.errors, chineseImageSimplified) ? getIn(formik.errors, chineseImageSimplified) : ''} required />
																		</div>
																		<div className=' w-full'>
																			<TextInput placeholder='Pinyin' name={pinyinImageSimplified} onChange={formik.handleChange} label='Pinyin' value={formik.values.simplifiedTitle[index].pinyin} error={getIn(formik.touched, pinyinImageSimplified) && getIn(formik.errors, pinyinImageSimplified) ? getIn(formik.errors, pinyinImageSimplified) : ''} required />
																		</div>
																		<div className='mt-7'>
																			<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.simplifiedTitle.length === 1} btnDanger={true} />
																		</div>
																	</div>
																</div>
															);
														})}
														<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedPhrasesImage}>
															<Plus className='mr-3' /> Add More
														</Button>
													</div>
												),
												[formik]
											)}
										/>
									</div>
								</div>
								<div>
									<div className='font-medium'>Speech to Text {simplifiedMicAllowed && <span className='text-error'>*</span>}</div>
									<div className='p-4 rounded border bg-gray-50 mb-4'>
										<FieldArray
											name={FieldNames.simplifiedSpeechToTextDataArray}
											render={useCallback(
												(arrayHelpers: MyArrayHelpers) => (
													<div className='mb-4 col-span-2'>
														{formik.values.simplifiedSpeechToTextDataArray?.map((_, index) => {
															const speechToTextSimplified = `simplifiedSpeechToTextDataArray[${index}].chinese`;
															return (
																<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
																	<div className='flex space-x-3 items-start'>
																		<div className=' w-full'>
																			<TextInput placeholder='Chinese' name={speechToTextSimplified} onChange={formik.handleChange} label='Chinese' value={formik.values.simplifiedSpeechToTextDataArray[index].chinese} error={getIn(formik.touched, speechToTextSimplified) && getIn(formik.errors, speechToTextSimplified) ? getIn(formik.errors, speechToTextSimplified) : ''} required={simplifiedMicAllowed} />
																		</div>
																		<div className='mt-7'>
																			<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.simplifiedSpeechToTextDataArray.length === 1} btnDanger={true} />
																		</div>
																	</div>
																</div>
															);
														})}
														<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedSpeechToText}>
															<Plus className='mr-3' /> Add More
														</Button>
													</div>
												),
												[formik]
											)}
										/>
									</div>
								</div>
								<div className='mb-4'>
									<FileUpload
										labelName='Upload Image'
										id='simplifiedFile'
										imageSource={simplifiedFileImage}
										name={FieldNames.simplifiedFile}
										acceptNote={IMAGE_NOTE}
										accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}`}
										uploadType={FILE_TYPE.jpegType || FILE_TYPE.pngType}
										onChange={useCallback((e) => {
											fileUpdateImage(e, fileTypeEnum.image);
										}, [])}
										error={getErrorImage(FieldNames.simplifiedFile) as string}
									/>
									{simplifiedImagePercentage !== 0 && simplifiedImagePercentage !== 100 && <LoadingPercentage percentage={simplifiedImagePercentage} />}
								</div>
								<div className='flex'>
									<div className='mb-4 w-[680px]'>
										<FileUpload
											labelName='Background Audio'
											id={FieldNames.simplifiedBackgroundAudio}
											imageSource={simplifiedFileBackgroundAudio}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.simplifiedBackgroundAudio}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											isRequired={false}
											onChange={useCallback((e) => {
												fileUpdateImage(e, fileTypeEnum.audio);
											}, [])}
											error={getErrorImage(FieldNames.simplifiedBackgroundAudio) as string}
										/>
										{simplifiedFileBackgroundAudioPercent !== 0 && simplifiedFileBackgroundAudioPercent !== 100 && <LoadingPercentage percentage={simplifiedFileBackgroundAudioPercent} />}
									</div>
									<div className='mt-10'>
										<Button onClick={useResetFile(setSimplifiedFileBackgroundAudio, FieldNames.simplifiedBackgroundAudio)}>
											<Cross />
										</Button>
									</div>
								</div>
								<div className='flex'>
									<div className='mb-4 w-[680px]'>
										<FileUpload
											labelName='Upload Audio'
											id='simplifiedAudio'
											imageSource={simplifiedFileAudio}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.simplifiedAudio}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											isRequired={simplifiedMicAllowed}
											onChange={useCallback((e) => {
												fileUpdateImage(e, fileTypeEnum.audio);
											}, [])}
											error={getErrorImage(FieldNames.simplifiedAudio) as string}
										/>
										{simplifiedFileAudioPercentage !== 0 && simplifiedFileAudioPercentage !== 100 && <LoadingPercentage percentage={simplifiedFileAudioPercentage} />}
									</div>
									<div className='mt-10'>
										<Button onClick={useResetFile(setSimplifiedFileAudio, FieldNames.simplifiedAudio)}>
											<Cross />
										</Button>
									</div>
								</div>
								<div className='mb-4'>
									<CheckBox
										option={[
											{
												id: 'AllowMicSimplified',
												name: 'Allow Mic?',
												value: 'Allow Mic?',
												checked: formik.values.simplifiedIsMicAllowed,
												onChange: () => {
													formik.setFieldValue(FieldNames.simplifiedIsMicAllowed, !formik.values.simplifiedIsMicAllowed);
													validateFormImage();
												},
											},
										]}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='flex justify-end gap-2 items-center mt-4'>
					<CheckBox
						option={[
							{
								id: 'provideSkipImage',
								name: 'Provide skip button for this activity',
								value: 'Provide skip button for this activity',
								checked: provideSkipImage,
								onChange: () => {
									setProvideSkipImage((prev) => !prev);
								},
							},
						]}
					/>
					<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdateImage}>
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

export default ActivityImage;
