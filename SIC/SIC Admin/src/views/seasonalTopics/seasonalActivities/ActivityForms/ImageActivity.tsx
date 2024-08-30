import React, { useCallback, useEffect, useState } from 'react';
import { FieldArray, FormikProvider, getIn, useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import TextInput from '@components/textInput/TextInput';
import CheckBox from '@components/checkbox/CheckBox';
import { useParams } from 'react-router-dom';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { APIService } from '@framework/services/api';
import { Loader } from '@components/index';
import { AngleRight, Cross, Plus } from '@components/icons';
import { Errors } from '@config/errors';
import { IMAGE_NOTE, AUDIO_SIZE_MB, CHARACTERS_LIMIT, FILE_TYPE, IMAGE_SIZE_MB, fileTypeEnum } from '@config/constant';
import FileUpload from '@components/fileUpload/FileUpload';
import { AddEditSeasonalActivityData } from 'src/types/seasonalTopics';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import { generateUuid, resetInputManually } from '@utils/helpers';
import { Uploader } from '@views/activities/utils/upload';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import { FieldNames, SetFile } from '@views/activities/ActivityImage';
import DeleteButton from '@components/common/DeleteButton';
import { MyArrayHelpers } from 'src/types/activities';
import { CreateImageActivityForm, ImageActivitySubmitData } from 'src/types/activities/image';

const SeasonalActivityImage = ({ onSubmit, onClose, url, activityUuid }: AddEditSeasonalActivityData) => {
	const params = useParams();
	const defaultTraditionalImageSeasonal = { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' };
	const defaultSimplifiedImageSeasonal = { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' };
	const [loadingImageSeasonal, setLoadingImageSeasonal] = useState<boolean>(false);
	const [provideSkipImageSeasonal, setProvideSkipImageSeasonal] = useState<boolean>(false);

	const [simplifiedFileImageSeasonal, setSimplifiedFileImageSeasonal] = useState<string>('');
	const [simplifiedImagePercentageSeasonal, setSimplifiedImagePercentageSeasonal] = useState<number>(0);
	const [traditionalFileImageSeasonal, setTraditionalFileImageSeasonal] = useState<string>('');
	const [traditionalImagePercentageSeasonal, setTraditionalImagePercentageSeasonal] = useState<number>(0);

	const [simplifiedFileBackgroundAudioSeasonal, setSimplifiedFileBackgroundAudioSeasonal] = useState<string>('');
	const [simplifiedFileBackgroundAudioSeasonalPercent, setSimplifiedFileBackgroundAudioSeasonalPercent] = useState<number>(0);

	const [traditionalFileBackgroundAudioSeasonal, setTraditionalFileBackgroundAudioSeasonal] = useState<string>('');
	const [traditionalFileBackgroundAudioSeasonalPercent, setTraditionalFileBackgroundAudioSeasonalPercent] = useState<number>(0);

	const [simplifiedFileAudioSeasonal, setSimplifiedFileAudioSeasonal] = useState<string>('');
	const [simplifiedFileAudioSeasonalPercentage, setSimplifiedFileAudioSeasonalPercentage] = useState<number>(0);

	const [traditionalFileAudioSeasonal, setTraditionalFileAudioSeasonal] = useState<string>('');
	const [traditionalFileAudioSeasonalPercentage, setTraditionalFileAudioSeasonalPercentage] = useState<number>(0);

	const [simplifiedMicAllowedSeasonal, setSimplifiedMicAllowedSeasonal] = useState<boolean>(false);
	const [traditionalMicAllowedSeasonal, setTraditionalMicAllowedSeasonal] = useState<boolean>(false);

	const updatePercentageImageSeasonal = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.simplifiedFile:
				setSimplifiedImagePercentageSeasonal(newPercentage);
				break;
			case FieldNames.traditionalFile:
				setTraditionalImagePercentageSeasonal(newPercentage);
				break;
			case FieldNames.simplifiedBackgroundAudio:
				setSimplifiedFileBackgroundAudioSeasonalPercent(newPercentage);
				break;
			case FieldNames.traditionalBackgroundAudio:
				setTraditionalFileBackgroundAudioSeasonalPercent(newPercentage);
				break;
			case FieldNames.traditionalAudio:
				setTraditionalFileAudioSeasonalPercentage(newPercentage);
				break;
			case FieldNames.simplifiedAudio:
				setSimplifiedFileAudioSeasonalPercentage(newPercentage);
				break;
			default:
				break;
		}
	};

	const disableUpdateImageSeasonal = !(simplifiedImagePercentageSeasonal === 0 || simplifiedImagePercentageSeasonal === 100) || !(traditionalImagePercentageSeasonal === 0 || traditionalImagePercentageSeasonal === 100) || !(simplifiedFileBackgroundAudioSeasonalPercent === 0 || simplifiedFileBackgroundAudioSeasonalPercent === 100) || !(traditionalFileBackgroundAudioSeasonalPercent === 0 || traditionalFileBackgroundAudioSeasonalPercent === 100) || !(simplifiedFileAudioSeasonalPercentage === 0 || simplifiedFileAudioSeasonalPercentage === 100) || !(traditionalFileAudioSeasonalPercentage === 0 || traditionalFileAudioSeasonalPercentage === 100);

	/**
	 *@returns Method used for setValue from questions data and get the details of question by uuid
	 */
	useEffect(() => {
		if (params?.activityId) {
			setLoadingImageSeasonal(true);
			APIService.getData(`${url}/images/${params?.activityId}?isForSeasonal=true`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const { title, activityData, isSkippable } = response.data.data;

						formik.setFieldValue(FieldNames.title, title);

						formik.setFieldValue(FieldNames.simplifiedFile, activityData?.simplifiedFile);
						formik.setFieldValue(FieldNames.simplifiedAudio, activityData?.simplifiedAudio);
						formik.setFieldValue(FieldNames.simplifiedBackgroundAudio, activityData?.simplifiedBackgroundAudio);
						formik.setFieldValue(FieldNames.simplifiedIsMicAllowed, activityData?.simplifiedIsMicAllowed);
						formik.setFieldValue(FieldNames.simplifiedSpeechToTextFile, activityData?.simplifiedSpeechToTextFile);

						formik.setFieldValue(FieldNames.traditionalFile, activityData?.traditionalFile);
						formik.setFieldValue(FieldNames.traditionalAudio, activityData?.traditionalAudio);
						formik.setFieldValue(FieldNames.traditionalBackgroundAudio, activityData?.traditionalBackgroundAudio);
						formik.setFieldValue(FieldNames.traditionalIsMicAllowed, activityData?.traditionalIsMicAllowed);
						formik.setFieldValue(FieldNames.traditionalSpeechToTextFile, activityData?.traditionalSpeechToTextFile);

						setProvideSkipImageSeasonal(isSkippable);

						setTraditionalFileImageSeasonal(activityData?.traditionalFile);
						setSimplifiedFileImageSeasonal(activityData?.simplifiedFile);

						setTraditionalFileAudioSeasonal(activityData?.traditionalAudio);
						setSimplifiedFileAudioSeasonal(activityData?.simplifiedAudio);

						setTraditionalFileBackgroundAudioSeasonal(activityData?.traditionalBackgroundAudio);
						setSimplifiedFileBackgroundAudioSeasonal(activityData?.simplifiedBackgroundAudio);
						formik.setFieldValue(FieldNames.traditionalTitle, activityData?.traditionalTitle);
						formik.setFieldValue(FieldNames.simplifiedTitle, activityData?.simplifiedTitle);
					}
					setLoadingImageSeasonal(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingImageSeasonal(false);
				});
		}
	}, [params.activityId]);

	const initialValues: CreateImageActivityForm = {
		[FieldNames.lessonId]: params.lessonId as string,
		[FieldNames.topicId]: params.topicId as string,
		[FieldNames.activityTypeId]: activityUuid,

		[FieldNames.title]: '',
		[FieldNames.simplifiedTitle]: [defaultSimplifiedImageSeasonal],
		[FieldNames.simplifiedFile]: '',
		[FieldNames.simplifiedAudio]: '',
		[FieldNames.simplifiedBackgroundAudio]: '',
		[FieldNames.simplifiedSpeechToTextFile]: '',
		[FieldNames.simplifiedIsMicAllowed]: false,

		[FieldNames.traditionalTitle]: [defaultTraditionalImageSeasonal],
		[FieldNames.traditionalFile]: '',
		[FieldNames.traditionalAudio]: '',
		[FieldNames.traditionalBackgroundAudio]: '',
		[FieldNames.traditionalSpeechToTextFile]: '',
		[FieldNames.traditionalIsMicAllowed]: false,

		[FieldNames.isSkippable]: false,
		[FieldNames.isForSeasonal]: true,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit questions
	 */
	const getObjImageSeasonal = () => {
		const objImageSeasonal: ObjectShape = {
			[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_ACTIVITY_ENGLISH_TITLE).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED),
			[FieldNames.simplifiedFile]: simplifiedFileImageSeasonal ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.simplifiedTitle]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_ACTIVITY_CHINESE_TITLE),
					[FieldNames.pinyin]: Yup.string().required(Errors.PLEASE_ENTER_ACTIVITY_PINYIN_TITLE),
				})
			),
			[FieldNames.simplifiedAudio]: simplifiedMicAllowedSeasonal && simplifiedFileAudioSeasonal === '' ? Yup.mixed().required(Errors.PLEASE_SELECT_AUDIO) : Yup.string().notRequired(),

			[FieldNames.traditionalFile]: traditionalFileImageSeasonal ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.traditionalTitle]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_ACTIVITY_CHINESE_TITLE),
					[FieldNames.pinyin]: Yup.string().required(Errors.PLEASE_ENTER_ACTIVITY_PINYIN_TITLE),
				})
			),
			[FieldNames.traditionalAudio]: traditionalMicAllowedSeasonal && traditionalFileAudioSeasonal === '' ? Yup.mixed().required(Errors.PLEASE_SELECT_AUDIO) : Yup.string().notRequired(),
		};
		return Yup.object<ObjectShape>(objImageSeasonal);
	};
	const validationSchema = getObjImageSeasonal();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const submitDataImageSeasonal: ImageActivitySubmitData = {
				topicId: values.topicId,
				lessonId: values.lessonId,
				activityTypeId: values.activityTypeId,
				title: values.title.trim(),
				activityData: {
					simplifiedTitle: values.simplifiedTitle,
					simplifiedFile: simplifiedFileImageSeasonal.split('/').pop() as string,
					simplifiedAudio: simplifiedFileAudioSeasonal.split('/').pop() as string,
					simplifiedBackgroundAudio: simplifiedFileBackgroundAudioSeasonal.split('/').pop() as string,
					simplifiedIsMicAllowed: values.simplifiedIsMicAllowed,
					simplifiedSpeechToTextFile: simplifiedMicAllowedSeasonal ? values.simplifiedTitle.map((item) => item.chinese)?.join(' ') : '',

					traditionalTitle: values.traditionalTitle,
					traditionalFile: traditionalFileImageSeasonal.split('/').pop() as string,
					traditionalAudio: traditionalFileAudioSeasonal.split('/').pop() as string,
					traditionalBackgroundAudio: traditionalFileBackgroundAudioSeasonal.split('/').pop() as string,
					traditionalIsMicAllowed: values.traditionalIsMicAllowed,
					traditionalSpeechToTextFile: traditionalMicAllowedSeasonal ? values.traditionalTitle.map((item) => item.chinese)?.join(' ') : '',
				},
				isSkippable: values.isSkippable,
				isForSeasonal: values.isForSeasonal,
			};
			if (params?.activityId) {
				setLoadingImageSeasonal(true);
				APIService.putData(`${url}/images/${params?.activityId}`, submitDataImageSeasonal)
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							onClose();
							onSubmit();
							formik.resetForm();
						}
						setLoadingImageSeasonal(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingImageSeasonal(false);
					});
			} else {
				setLoadingImageSeasonal(true);
				APIService.postData(`${url}/images`, submitDataImageSeasonal)
					.then((response) => {
						if (response.status === ResponseCode.success || ResponseCode.created) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoadingImageSeasonal(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingImageSeasonal(false);
					});
			}
		},
	});

	/**
	 *
	 * @returns Method used to Copy data from left to right form
	 */
	const copyDataImageSeasonal = useCallback(() => {
		const traditionalData = () => {
			if (formik.values.traditionalTitle.length === 1) {
				const traditionalSeasonalImageTitle = formik.values.traditionalTitle[0];
				const simplifiedSeasonalImageTitle = formik.values.simplifiedTitle[0];

				if ((traditionalSeasonalImageTitle.chinese.trim() !== '', traditionalSeasonalImageTitle.pinyin.trim() !== '')) {
					return formik.values.traditionalTitle.map((item) => ({ ...item }));
				} else {
					return [{ [FieldNames.chinese]: simplifiedSeasonalImageTitle.chinese, [FieldNames.pinyin]: simplifiedSeasonalImageTitle.pinyin }];
				}
			} else {
				return formik.values.traditionalTitle.map((item) => ({ ...item }));
			}
		};
		formik.setFieldValue(FieldNames.simplifiedTitle, traditionalData());
		if (traditionalFileImageSeasonal !== '') {
			formik.setFieldValue(FieldNames.simplifiedFile, formik.values.traditionalFile);
			setSimplifiedFileImageSeasonal(traditionalFileImageSeasonal);
		}
		if (traditionalFileAudioSeasonal !== '') {
			formik.setFieldValue(FieldNames.simplifiedAudio, formik.values.traditionalAudio);
			setSimplifiedFileAudioSeasonal(traditionalFileAudioSeasonal);
		}
		if (traditionalFileBackgroundAudioSeasonal !== '') {
			setSimplifiedFileBackgroundAudioSeasonal(traditionalFileBackgroundAudioSeasonal);
			formik.setFieldValue(FieldNames.simplifiedBackgroundAudio, formik.values.traditionalBackgroundAudio);
		}
		formik.setFieldValue(FieldNames.simplifiedIsMicAllowed, formik.values.traditionalIsMicAllowed);

		validateFormImageSeasonal();
	}, [formik.values, traditionalFileAudioSeasonal, traditionalFileImageSeasonal, traditionalFileBackgroundAudioSeasonal]);

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const handleFileUploadImageSeasonal = (event: React.ChangeEvent<HTMLInputElement>, type: string, fileName: string) => {
		const fileImageSeasonal = event.target.files?.[0];
		if (fileImageSeasonal === undefined) {
			return;
		}
		const fileSizeImageSeasonal = type === fileTypeEnum.image ? IMAGE_SIZE_MB : AUDIO_SIZE_MB;
		const fileTypesImageSeasonal = type === fileTypeEnum.image ? [FILE_TYPE.pngType, FILE_TYPE.jpgType, FILE_TYPE.jpegType] : [FILE_TYPE.audioType, FILE_TYPE.wavType];

		if (!fileTypesImageSeasonal.includes(fileImageSeasonal.type)) {
			setLoadingImageSeasonal(false);
			toast.error(type === fileTypeEnum.image ? Errors.PLEASE_ALLOW_JPG_PNG_JPEG_FILE : Errors.PLEASE_ALLOW_MP3_WAV_FILE);
			return;
		}
		if (fileImageSeasonal.size / 1000 / 1024 > fileSizeImageSeasonal) {
			toast.error(`Uploaded ${type} size is greater than ${fileSizeImageSeasonal}MB, please upload ${type} size within ${fileSizeImageSeasonal}MB or max ${fileSizeImageSeasonal}MB`);
		}
		const lastIndex = fileImageSeasonal?.name?.lastIndexOf('.');
		const extension = fileImageSeasonal?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileImageSeasonal);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptions = {
					fileName: name,
					file: fileImageSeasonal,
					isForSeasonal: true,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(imageUploaderOptions, updatePercentageImageSeasonal);
				uploader.start();
				switch (fileName) {
					case FieldNames.traditionalFile:
						formik.setFieldValue(FieldNames.traditionalFile, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingImageSeasonal(false);
							setTraditionalFileImageSeasonal(response);
						});
						break;
					case FieldNames.simplifiedFile:
						formik.setFieldValue(FieldNames.simplifiedFile, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingImageSeasonal(false);
							setSimplifiedFileImageSeasonal(response);
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
			const blob = URL.createObjectURL(fileImageSeasonal);
			audio.src = blob;
			audio.addEventListener('loadedmetadata', () => {
				const audioUploaderOptions = {
					fileName: name,
					file: fileImageSeasonal,
					isForSeasonal: true,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(audioUploaderOptions, updatePercentageImageSeasonal);
				uploader.start();
				switch (fileName) {
					case FieldNames.simplifiedBackgroundAudio:
						formik.setFieldValue(FieldNames.simplifiedBackgroundAudio, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingImageSeasonal(false);
							setSimplifiedFileBackgroundAudioSeasonal(response);
						});
						break;
					case FieldNames.simplifiedAudio:
						formik.setFieldValue(FieldNames.simplifiedAudio, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingImageSeasonal(false);
							setSimplifiedFileAudioSeasonal(response);
						});
						break;
					case FieldNames.traditionalBackgroundAudio:
						formik.setFieldValue(FieldNames.traditionalBackgroundAudio, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingImageSeasonal(false);
							setTraditionalFileBackgroundAudioSeasonal(response);
						});
						break;
					case FieldNames.traditionalAudio:
						formik.setFieldValue(FieldNames.traditionalAudio, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingImageSeasonal(false);
							setTraditionalFileAudioSeasonal(response);
						});
						break;
					default:
						break;
				}
			});
		}
	};

	const fileUpdateImageSeasonal = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileName = event.target.name;
		handleFileUploadImageSeasonal(event, type, fileName);
	}, []);

	useEffect(() => {
		formik.values.simplifiedIsMicAllowed ? setSimplifiedMicAllowedSeasonal(true) : setSimplifiedMicAllowedSeasonal(false);
		formik.values.traditionalIsMicAllowed ? setTraditionalMicAllowedSeasonal(true) : setTraditionalMicAllowedSeasonal(false);
	}, [formik.values.simplifiedIsMicAllowed, formik.values.traditionalIsMicAllowed]);

	const getErrorImageSeasonal = (fieldName: keyof CreateImageActivityForm) => {
		if (fieldName != FieldNames.traditionalTitle && fieldName != FieldNames.simplifiedTitle) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};
	const validateFormImageSeasonal = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 500);
	};

	const addMoreTraditionalPhrasesImageSeasonal = useCallback(() => {
		formik.setFieldValue('traditionalTitle', [...formik.values.traditionalTitle, { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' }]);
	}, [formik]);

	const addMoreSimplifiedPhrasesImageSeasonal = useCallback(() => {
		formik.setFieldValue('simplifiedTitle', [...formik.values.simplifiedTitle, { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' }]);
	}, [formik]);

	// Create a generic function that takes the state setter as a parameter
	const useResetFileImageSeasonal = (setFile: SetFile, fileName: string) => {
		const resetFile = useCallback(() => {
			setFile('');
			formik.setFieldValue(fileName, '');
			resetInputManually([fileName]);
			validateFormImageSeasonal();
		}, [setFile]);

		return resetFile;
	};

	return (
		<FormikProvider value={formik}>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loadingImageSeasonal && <Loader />}
				<div className={`${cn(ModelStyle['model__body'])}`}>
					<div className='mb-4'>
						<TextInput placeholder='English Title' name={FieldNames.title} onChange={formik.handleChange} label='English Title' value={formik.values.title} error={getErrorImageSeasonal(FieldNames.title)} required />
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
														{formik.values.traditionalTitle?.map((duplicate, index) => {
															const chineseImageTraditionalSeasonal = `traditionalTitle[${index}].chinese`;
															const pinyinImageTraditionalSeasonal = `traditionalTitle[${index}].pinyin`;
															return (
																<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
																	<div className='flex space-x-3 items-start'>
																		<div className=' w-full'>
																			<TextInput placeholder='Chinese' name={chineseImageTraditionalSeasonal} onChange={formik.handleChange} label='Chinese' value={formik.values.traditionalTitle[index].chinese} error={getIn(formik.touched, chineseImageTraditionalSeasonal) && getIn(formik.errors, chineseImageTraditionalSeasonal) ? getIn(formik.errors, chineseImageTraditionalSeasonal) : ''} required />
																		</div>
																		<div className=' w-full'>
																			<TextInput placeholder='Pinyin' name={pinyinImageTraditionalSeasonal} onChange={formik.handleChange} label='Pinyin' value={formik.values.traditionalTitle[index].pinyin} error={getIn(formik.touched, pinyinImageTraditionalSeasonal) && getIn(formik.errors, pinyinImageTraditionalSeasonal) ? getIn(formik.errors, pinyinImageTraditionalSeasonal) : ''} required />
																		</div>
																		<div className='mt-7'>
																			<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.traditionalTitle.length === 1} btnDanger={true} />
																		</div>
																	</div>
																</div>
															);
														})}
														<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalPhrasesImageSeasonal}>
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
										imageSource={traditionalFileImageSeasonal}
										name={FieldNames.traditionalFile}
										error={getErrorImageSeasonal(FieldNames.traditionalFile) as string}
										uploadType={FILE_TYPE.jpegType || FILE_TYPE.pngType}
										acceptNote={IMAGE_NOTE}
										accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}`}
										onChange={useCallback((e) => {
											fileUpdateImageSeasonal(e, fileTypeEnum.image);
										}, [])}
									/>
									{traditionalImagePercentageSeasonal !== 0 && traditionalImagePercentageSeasonal !== 100 && <LoadingPercentage percentage={traditionalImagePercentageSeasonal} />}
								</div>
								<div className='flex'>
									<div className='mb-4 w-[680px]'>
										<FileUpload
											labelName='Background Audio'
											id={FieldNames.traditionalBackgroundAudio}
											imageSource={traditionalFileBackgroundAudioSeasonal}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.traditionalBackgroundAudio}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											isRequired={false}
											onChange={useCallback((e) => {
												fileUpdateImageSeasonal(e, fileTypeEnum.audio);
											}, [])}
											error={getErrorImageSeasonal(FieldNames.traditionalBackgroundAudio) as string}
										/>
										{traditionalFileBackgroundAudioSeasonalPercent !== 0 && traditionalFileBackgroundAudioSeasonalPercent !== 100 && <LoadingPercentage percentage={traditionalFileBackgroundAudioSeasonalPercent} />}
									</div>
									<div className='mt-10'>
										<Button onClick={useResetFileImageSeasonal(setTraditionalFileBackgroundAudioSeasonal, FieldNames.traditionalBackgroundAudio)}>
											<Cross />
										</Button>
									</div>
								</div>
								<div className='flex'>
									<div className='mb-4 w-[680px]'>
										<FileUpload
											labelName='Upload Audio'
											id='traditionalAudio'
											imageSource={traditionalFileAudioSeasonal}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.traditionalAudio}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											isRequired={traditionalMicAllowedSeasonal}
											onChange={useCallback((e) => {
												fileUpdateImageSeasonal(e, fileTypeEnum.audio);
											}, [])}
											error={getErrorImageSeasonal(FieldNames.traditionalAudio) as string}
										/>
										{traditionalFileAudioSeasonalPercentage !== 0 && traditionalFileAudioSeasonalPercentage !== 100 && <LoadingPercentage percentage={traditionalFileAudioSeasonalPercentage} />}
									</div>
									<div className='mt-10'>
										<Button onClick={useResetFileImageSeasonal(setTraditionalFileAudioSeasonal, FieldNames.traditionalAudio)}>
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
													validateFormImageSeasonal();
												},
											},
										]}
									/>
								</div>
							</div>
						</div>

						<div className='flex flex-col justify-center items-center p-3'>
							<Button className='btn-default btn-large' title='Copy' onClick={copyDataImageSeasonal} disabled={disableUpdateImageSeasonal}>
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
														{formik.values.simplifiedTitle?.map((duplicate, index) => {
															const chineseImageSimplifiedSeasonal = `simplifiedTitle[${index}].chinese`;
															const pinyinImageSimplifiedSeasonal = `simplifiedTitle[${index}].pinyin`;
															return (
																<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
																	<div className='flex space-x-3 items-start'>
																		<div className=' w-full'>
																			<TextInput placeholder='Chinese' name={chineseImageSimplifiedSeasonal} onChange={formik.handleChange} label='Chinese' value={formik.values.simplifiedTitle[index].chinese} error={getIn(formik.touched, chineseImageSimplifiedSeasonal) && getIn(formik.errors, chineseImageSimplifiedSeasonal) ? getIn(formik.errors, chineseImageSimplifiedSeasonal) : ''} required />
																		</div>
																		<div className=' w-full'>
																			<TextInput placeholder='Pinyin' name={pinyinImageSimplifiedSeasonal} onChange={formik.handleChange} label='Pinyin' value={formik.values.simplifiedTitle[index].pinyin} error={getIn(formik.touched, pinyinImageSimplifiedSeasonal) && getIn(formik.errors, pinyinImageSimplifiedSeasonal) ? getIn(formik.errors, pinyinImageSimplifiedSeasonal) : ''} required />
																		</div>
																		<div className='mt-7'>
																			<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.simplifiedTitle.length === 1} btnDanger={true} />
																		</div>
																	</div>
																</div>
															);
														})}
														<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedPhrasesImageSeasonal}>
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
										imageSource={simplifiedFileImageSeasonal}
										name={FieldNames.simplifiedFile}
										acceptNote={IMAGE_NOTE}
										accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}`}
										uploadType={FILE_TYPE.jpegType || FILE_TYPE.pngType}
										onChange={useCallback((e) => {
											fileUpdateImageSeasonal(e, fileTypeEnum.image);
										}, [])}
										error={getErrorImageSeasonal(FieldNames.simplifiedFile) as string}
									/>
									{simplifiedImagePercentageSeasonal !== 0 && simplifiedImagePercentageSeasonal !== 100 && <LoadingPercentage percentage={simplifiedImagePercentageSeasonal} />}
								</div>
								<div className='flex'>
									<div className='mb-4 w-[680px]'>
										<FileUpload
											labelName='Background Audio'
											id={FieldNames.simplifiedBackgroundAudio}
											imageSource={simplifiedFileBackgroundAudioSeasonal}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.simplifiedBackgroundAudio}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											isRequired={false}
											onChange={useCallback((e) => {
												fileUpdateImageSeasonal(e, fileTypeEnum.audio);
											}, [])}
											error={getErrorImageSeasonal(FieldNames.simplifiedBackgroundAudio) as string}
										/>
										{simplifiedFileBackgroundAudioSeasonalPercent !== 0 && simplifiedFileBackgroundAudioSeasonalPercent !== 100 && <LoadingPercentage percentage={simplifiedFileBackgroundAudioSeasonalPercent} />}
									</div>
									<div className='mt-10'>
										<Button onClick={useResetFileImageSeasonal(setSimplifiedFileBackgroundAudioSeasonal, FieldNames.simplifiedBackgroundAudio)}>
											<Cross />
										</Button>
									</div>
								</div>
								<div className='flex'>
									<div className='mb-4 w-[680px]'>
										<FileUpload
											labelName='Upload Audio'
											id='simplifiedAudio'
											imageSource={simplifiedFileAudioSeasonal}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.simplifiedAudio}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											isRequired={simplifiedMicAllowedSeasonal}
											onChange={useCallback((e) => {
												fileUpdateImageSeasonal(e, fileTypeEnum.audio);
											}, [])}
											error={getErrorImageSeasonal(FieldNames.simplifiedAudio) as string}
										/>
										{simplifiedFileAudioSeasonalPercentage !== 0 && simplifiedFileAudioSeasonalPercentage !== 100 && <LoadingPercentage percentage={simplifiedFileAudioSeasonalPercentage} />}
									</div>
									<div className='mt-10'>
										<Button onClick={useResetFileImageSeasonal(setSimplifiedFileAudioSeasonal, FieldNames.simplifiedAudio)}>
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
													validateFormImageSeasonal();
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
								id: 'provideSkipImageSeasonal',
								name: 'Provide skip button for this activity',
								value: 'Provide skip button for this activity',
								checked: provideSkipImageSeasonal,
								onChange: (e) => {
									setProvideSkipImageSeasonal(!provideSkipImageSeasonal);
									formik.setFieldValue(FieldNames.isSkippable, e.target.checked);
								},
							},
						]}
					/>
					<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdateImageSeasonal}>
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

export default SeasonalActivityImage;
