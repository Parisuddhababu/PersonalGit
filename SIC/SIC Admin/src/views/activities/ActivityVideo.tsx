import React, { useCallback, useEffect, useState } from 'react';
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
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { APIService } from '@framework/services/api';
import { Loader } from '@components/index';
import { AngleRight, Plus } from '@components/icons';
import { Errors } from '@config/errors';
import { CHARACTERS_LIMIT, FILE_TYPE, VIDEO_RESOLUTION_HEIGHT, VIDEO_RESOLUTION_WIDTH, videoNote } from '@config/constant';
import FileUpload from '@components/fileUpload/FileUpload';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import { generateUuid, resetInputManually } from '@utils/helpers';
import { Uploader } from './utils/upload';
import DeleteButton from '@components/common/DeleteButton';
import { CreateVideoActivityForm, VideoActivitySubmitData } from 'src/types/activities/video';

export enum FieldNames {
	levelId = 'levelId',
	lessonId = 'lessonId',
	topicId = 'topicId',
	activityTypeId = 'activityTypeId',
	title = 'title',

	simplifiedTitle = 'simplifiedTitle',

	simplifiedFile = 'simplifiedFile',

	traditionalTitle = 'traditionalTitle',

	traditionalFile = 'traditionalFile',
	isSkippable = 'isSkippable',
	image = 'image',
	chinese = 'chinese',
	pinyin = 'pinyin',
	isForSeasonal = 'isForSeasonal',
}

const ActivityVideo = ({ onSubmit, onClose, url, activityUuid }: AddEditActivitiesData) => {
	const defaultTraditionalVideo = { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' };
	const defaultSimplifiedVideo = { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' };
	const params = useParams();
	const [loadingVideo, setLoadingVideo] = useState<boolean>(false);
	const [provideSkipVideo, setProvideSkipVideo] = useState<boolean>(false);
	const [simplifiedFileVideo, setSimplifiedFileVideo] = useState<string>('');
	const [traditionalFileVideo, setTraditionalFileVideo] = useState<string>('');
	const [percentageVideo, setPercentageVideo] = useState(0);
	const [percentageVideoSimplified, setPercentageVideoSimplified] = useState(0);

	const updatePercentageVideo = (newPercentage: number) => {
		setPercentageVideo(newPercentage);
		newPercentage === 100 && setLoadingVideo(true);
	};

	const updatePercentageVideoSimplified = (newPercentage: number) => {
		setPercentageVideoSimplified(newPercentage);
		newPercentage === 100 && setLoadingVideo(true);
	};

	const disableUpdateVideo = (percentageVideoSimplified !== 0 && percentageVideoSimplified !== 100) || (percentageVideo !== 0 && percentageVideo !== 100);

	/**
	 *@returns Method used for setValue from Activities data and get the details of Activity by uuid
	 */
	useEffect(() => {
		if (params.activityId) {
			setLoadingVideo(true);
			APIService.getData(`${url}/${params.activityId}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const { activityData, title, isSkippable } = response.data.data;

						formik.setFieldValue(FieldNames.title, title);

						formik.setFieldValue(FieldNames.simplifiedFile, activityData?.simplifiedFile);

						formik.setFieldValue(FieldNames.traditionalFile, activityData?.traditionalFile);

						formik.setFieldValue(FieldNames.traditionalTitle, activityData?.traditionalTitle);
						formik.setFieldValue(FieldNames.simplifiedTitle, activityData?.simplifiedTitle);

						setProvideSkipVideo(isSkippable);

						setTraditionalFileVideo(activityData?.traditionalFile);
						setSimplifiedFileVideo(activityData?.simplifiedFile);
					}
					setLoadingVideo(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingVideo(false);
				});
		}
	}, [params.activityId]);

	const initialValues: CreateVideoActivityForm = {
		[FieldNames.levelId]: params.levelId as string,
		[FieldNames.lessonId]: params.lessonId as string,
		[FieldNames.topicId]: params.topicId as string,
		[FieldNames.activityTypeId]: activityUuid,

		[FieldNames.title]: '',
		[FieldNames.simplifiedFile]: '',
		[FieldNames.simplifiedTitle]: [defaultSimplifiedVideo],
		[FieldNames.traditionalFile]: '',
		[FieldNames.traditionalTitle]: [defaultTraditionalVideo],
		[FieldNames.isSkippable]: false,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit Activity
	 */
	const getObjVideo = () => {
		const obj: ObjectShape = {
			[FieldNames.traditionalTitle]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_ACTIVITY_CHINESE_TITLE),
					[FieldNames.pinyin]: Yup.string().required(Errors.PLEASE_ENTER_ACTIVITY_PINYIN_TITLE),
				})
			),
			[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_ACTIVITY_ENGLISH_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),

			[FieldNames.simplifiedFile]: params.activityId ? Yup.string().notRequired() : Yup.string().required(Errors.PLEASE_SELECT_VIDEO_SIMPLIFIED),
			[FieldNames.traditionalFile]: params.activityId ? Yup.string().notRequired() : Yup.string().required(Errors.PLEASE_SELECT_VIDEO_SIMPLIFIED),

			[FieldNames.simplifiedTitle]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_ACTIVITY_CHINESE_TITLE),
					[FieldNames.pinyin]: Yup.string().required(Errors.PLEASE_ENTER_ACTIVITY_PINYIN_TITLE),
				})
			),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObjVideo();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const submitData: VideoActivitySubmitData = {
				activityTypeId: values.activityTypeId,
				levelId: values.levelId,
				topicId: values.topicId,
				lessonId: values.lessonId,
				title: values.title,
				activityData: {
					traditionalTitle: values.traditionalTitle,
					traditionalFile: values.traditionalFile.split('/').pop() as string,
					simplifiedTitle: values.simplifiedTitle,
					simplifiedFile: values.simplifiedFile.split('/').pop() as string,
				},
				isSkippable: values.isSkippable,
			};

			if (params.activityId) {
				setLoadingVideo(true);
				APIService.putData(`${url}/${params.activityId}`, submitData)
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							onClose();
							onSubmit();
							formik.resetForm();
						} else {
							toast.error(response?.data?.message);
						}
						setLoadingVideo(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingVideo(false);
					});
			} else {
				setLoadingVideo(true);
				APIService.postData(url, submitData)
					.then((response) => {
						if (response.status === ResponseCode.success || ResponseCode.created) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						} else {
							toast.error(response?.data?.message);
						}
						setLoadingVideo(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingVideo(false);
					});
			}
		},
	});

	/**
	 *
	 * @returns Method used to Copy data from left to right form
	 */
	const copyDataVideo = useCallback(() => {
		const traditionalDataVideo = () => {
			if (formik.values.traditionalTitle.length === 1) {
				const traditionalVideo = formik.values.traditionalTitle[0];
				const simplifiedVideo = formik.values.simplifiedTitle[0];

				if ((traditionalVideo.chinese.trim() !== '', traditionalVideo.pinyin.trim() !== '')) {
					return formik.values.traditionalTitle.map((item) => ({ ...item }));
				} else {
					return [{ [FieldNames.chinese]: simplifiedVideo.chinese, [FieldNames.pinyin]: simplifiedVideo.pinyin }];
				}
			} else {
				return formik.values.traditionalTitle.map((item) => ({ ...item }));
			}
		};
		formik.setFieldValue(FieldNames.simplifiedTitle, traditionalDataVideo());

		if (traditionalFileVideo !== '') {
			setSimplifiedFileVideo(traditionalFileVideo);
			formik.setFieldValue(FieldNames.simplifiedFile, formik.values.traditionalFile);
		}

		setTimeout(() => {
			formik.validateForm();
		}, 500);
	}, [formik]);
	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const fileUpdateVideo = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const fileVideo = event.target.files?.[0];
		if (fileVideo === undefined) {
			return;
		}
		const fileName = event.target.name;
		const lastIndex = fileVideo?.name?.lastIndexOf('.');
		const extension = fileVideo?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		const fileTypes = [FILE_TYPE.movVideoType, FILE_TYPE.videoType, FILE_TYPE.webmType];
		if (fileTypes.includes(fileVideo?.type) === false) {
			toast.error(Errors.UNSUPPORTED_FILE_FORMAT);
			return;
		}
		const video = document.createElement('video');
		const resolution = {
			width: 0,
			height: 0,
		};
		video.preload = 'metadata';
		const blob = URL.createObjectURL(fileVideo);
		video.src = blob;
		video.addEventListener('loadedmetadata', () => {
			resolution.width = video.videoWidth;
			resolution.height = video.videoHeight;
			if (resolution.width > VIDEO_RESOLUTION_WIDTH || resolution.height > VIDEO_RESOLUTION_HEIGHT || video.videoWidth === 0 || video.videoHeight === 0) {
				resetInputManually([event.target.name]);
				toast.error(Errors.VIDEO_MAXIMUM_RESOLUTION);
				return false;
			} else {
				const videoUploaderOptions = {
					fileName: name,
					file: fileVideo,
					isForSeasonal: false,
					isForSop: false,
				};

				if (fileName === FieldNames.traditionalFile) {
					const uploader = new Uploader(videoUploaderOptions, updatePercentageVideo);
					uploader.start();
					formik.setFieldValue(FieldNames.traditionalFile, uploader.fileName);
					uploader.onComplete((response: string) => {
						setLoadingVideo(false);
						setTraditionalFileVideo(response);
					});
				}
				if (fileName === FieldNames.simplifiedFile) {
					const uploader = new Uploader(videoUploaderOptions, updatePercentageVideoSimplified);
					uploader.start();
					formik.setFieldValue(FieldNames.simplifiedFile, uploader.fileName);
					uploader.onComplete((response: string) => {
						setLoadingVideo(false);
						setSimplifiedFileVideo(response);
					});
				}
			}
		});
	}, []);

	const addMoreTraditionalPhrasesVideo = useCallback(() => {
		formik.setFieldValue('traditionalTitle', [...formik.values.traditionalTitle, { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' }]);
	}, [formik]);

	const addMoreSimplifiedPhrasesVideo = useCallback(() => {
		formik.setFieldValue('simplifiedTitle', [...formik.values.simplifiedTitle, { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' }]);
	}, [formik]);

	return (
		<FormikProvider value={formik}>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loadingVideo && <Loader />}
				<div className={`${cn(ModelStyle['model__body'])}`}>
					<div className='mb-4'>
						<TextInput placeholder='English Title' name={FieldNames.title} onChange={formik.handleChange} label='English Title' value={formik.values.title} error={formik.errors.title && formik.touched.title ? formik.errors.title : ''} required />
					</div>
					<div className='flex flex-col md:flex-row gap-3 mb-4'>
						<div className='w-full'>
							<div className='font-medium'>
								Traditional Title <span className='text-error'>*</span>
							</div>
							<div className='p-4 rounded border bg-gray-50 mb-4'>
								<FieldArray
									name={FieldNames.traditionalTitle}
									render={useCallback(
										(arrayHelpers: MyArrayHelpers) => (
											<div className='mb-4 col-span-2'>
												{formik.values.traditionalTitle?.map((duplicate, index) => {
													const chineseVideoTraditional = `traditionalTitle[${index}].chinese`;
													const pinyinVideoTraditional = `traditionalTitle[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-3 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Chinese' name={chineseVideoTraditional} onChange={formik.handleChange} label='Chinese' value={formik.values.traditionalTitle[index].chinese} error={getIn(formik.touched, chineseVideoTraditional) && getIn(formik.errors, chineseVideoTraditional) ? getIn(formik.errors, chineseVideoTraditional) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Pinyin' name={pinyinVideoTraditional} onChange={formik.handleChange} label='Pinyin' value={formik.values.traditionalTitle[index].pinyin} error={getIn(formik.touched, pinyinVideoTraditional) && getIn(formik.errors, pinyinVideoTraditional) ? getIn(formik.errors, pinyinVideoTraditional) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.traditionalTitle.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalPhrasesVideo}>
													<Plus className='mr-3' /> Add More
												</Button>
											</div>
										),
										[formik]
									)}
								/>
							</div>
							<div>
								<FileUpload
									labelName='Upload Video (Traditional)'
									id={FieldNames.traditionalFile}
									imageSource={traditionalFileVideo}
									name={FieldNames.traditionalFile}
									error={formik.errors.traditionalFile && formik.touched.traditionalFile ? formik.errors.traditionalFile : ''}
									uploadType={FILE_TYPE.videoType || FILE_TYPE.movVideoType}
									acceptNote={videoNote}
									accepts={`${FILE_TYPE.videoType}, ${FILE_TYPE.movVideoType},${FILE_TYPE.webmType}`}
									onChange={useCallback((e) => {
										fileUpdateVideo(e);
									}, [])}
								/>
								{percentageVideo !== 0 && percentageVideo !== 100 && (
									<div className='progress bg-gray-100 flex items-center w-full rounded-lg h-2 mt-3'>
										<span className='h-full rounded-lg bg-success w-0' style={{ width: `${percentageVideo}%` }}></span>
										<span className='ml-3 font-medium'>{percentageVideo}%</span>
									</div>
								)}
							</div>
						</div>
						<div className='flex flex-col justify-center items-center p-3'>
							<Button className='btn-default btn-large' title='Copy' onClick={copyDataVideo}>
								<AngleRight className='text-md' />
							</Button>
							<span className='mt-1 text-gray-500'>Copy</span>
						</div>
						<div className='w-full'>
							<div className='font-medium'>
								Simplified Title <span className='text-error'>*</span>
							</div>
							<div className='p-4 rounded border bg-gray-50 mb-4'>
								<FieldArray
									name={FieldNames.simplifiedTitle}
									render={useCallback(
										(arrayHelpers: MyArrayHelpers) => (
											<div className='mb-4 col-span-2'>
												{formik.values.simplifiedTitle?.map((duplicate, index) => {
													const chineseVideoSimplified = `simplifiedTitle[${index}].chinese`;
													const pinyinVideoSimplified = `simplifiedTitle[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-3 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Chinese' name={chineseVideoSimplified} onChange={formik.handleChange} label='Chinese' value={formik.values.simplifiedTitle[index].chinese} error={getIn(formik.touched, chineseVideoSimplified) && getIn(formik.errors, chineseVideoSimplified) ? getIn(formik.errors, chineseVideoSimplified) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Pinyin' name={pinyinVideoSimplified} onChange={formik.handleChange} label='Pinyin' value={formik.values.simplifiedTitle[index].pinyin} error={getIn(formik.touched, pinyinVideoSimplified) && getIn(formik.errors, pinyinVideoSimplified) ? getIn(formik.errors, pinyinVideoSimplified) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.simplifiedTitle.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedPhrasesVideo}>
													<Plus className='mr-3' /> Add More
												</Button>
											</div>
										),
										[formik]
									)}
								/>
							</div>
							<div>
								<FileUpload
									labelName='Upload Video (Simplified)'
									id={FieldNames.simplifiedFile}
									imageSource={simplifiedFileVideo}
									name={FieldNames.simplifiedFile}
									acceptNote={videoNote}
									accepts={`${FILE_TYPE.videoType}, ${FILE_TYPE.movVideoType},${FILE_TYPE.webmType}`}
									error={formik.errors.simplifiedFile && formik.touched.simplifiedFile ? formik.errors.simplifiedFile : ''}
									uploadType={FILE_TYPE.videoType || FILE_TYPE.movVideoType}
									onChange={useCallback((e) => {
										fileUpdateVideo(e);
									}, [])}
								/>
								{percentageVideoSimplified !== 0 && percentageVideoSimplified !== 100 && (
									<div className='progress bg-gray-100 flex items-center w-full rounded-lg h-2 mt-3'>
										<span className='h-full rounded-lg bg-success w-0' style={{ width: `${percentageVideoSimplified}%` }}></span>
										<span className='ml-3 font-medium'>{percentageVideoSimplified}%</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className='flex justify-end gap-2 items-center mt-4'>
					<CheckBox
						option={[
							{
								id: 'provideSkipVideo',
								name: 'Provide skip button for this activity',
								value: 'Provide skip button for this activity',
								checked: provideSkipVideo,
								onChange: (e) => {
									setProvideSkipVideo(!provideSkipVideo);
									formik.setFieldValue(FieldNames.isSkippable, e.target.checked);
								},
							},
						]}
					/>
					<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdateVideo}>
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

export default ActivityVideo;
