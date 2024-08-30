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
import { AngleRight, Plus } from '@components/icons';
import { Errors } from '@config/errors';
import { CHARACTERS_LIMIT, FILE_TYPE, VIDEO_RESOLUTION_HEIGHT, VIDEO_RESOLUTION_WIDTH, videoNote } from '@config/constant';
import FileUpload from '@components/fileUpload/FileUpload';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import { AddEditSeasonalActivityData } from 'src/types/seasonalTopics';
import { generateUuid, resetInputManually } from '@utils/helpers';
import { Uploader } from '@views/activities/utils/upload';
import { FieldNames } from '@views/activities/ActivityVideo';
import DeleteButton from '@components/common/DeleteButton';
import { MyArrayHelpers } from 'src/types/activities';
import { CreateVideoActivityForm, VideoActivitySubmitData } from 'src/types/activities/video';

const SeasonalActivityVideo = ({ onSubmit, onClose, url, activityUuid }: AddEditSeasonalActivityData) => {
	const params = useParams();
	const defaultTraditionalVideoSeasonal = { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' };
	const defaultSimplifiedVideoSeasonal = { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' };
	const [loadingVideoSeasonal, setLoadingVideoSeasonal] = useState<boolean>(false);
	const [provideSkipVideoSeasonal, setProvideSkipVideoSeasonal] = useState<boolean>(false);
	const [simplifiedFileVideoSeasonal, setSimplifiedFileVideoSeasonal] = useState<string>('');
	const [traditionalFileVideoSeasonal, setTraditionalFileVideoSeasonal] = useState<string>('');
	const [percentageVideoSeasonal, setPercentageVideoSeasonal] = useState(0);
	const [percentageVideoSeasonalSimplified, setPercentageVideoSeasonalSimplified] = useState(0);

	const updatePercentageVideoSeasonal = (newPercentage: number) => {
		setPercentageVideoSeasonal(newPercentage);
		newPercentage === 100 && setLoadingVideoSeasonal(true);
	};

	const updatePercentageVideoSeasonalSimplified = (newPercentage: number) => {
		setPercentageVideoSeasonalSimplified(newPercentage);
		newPercentage === 100 && setLoadingVideoSeasonal(true);
	};

	const disableUpdateVideoSeasonal = (percentageVideoSeasonalSimplified !== 0 && percentageVideoSeasonalSimplified !== 100) || (percentageVideoSeasonal !== 0 && percentageVideoSeasonal !== 100);

	/**
	 *@returns Method used for setValue from activity data and get the details of activity by uuid
	 */
	useEffect(() => {
		if (params.activityId) {
			setLoadingVideoSeasonal(true);
			APIService.getData(`${url}/${params.activityId}?isForSeasonal=true`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const { activityData, title, isSkippable } = response.data.data;

						formik.setFieldValue(FieldNames.title, title);

						formik.setFieldValue(FieldNames.simplifiedFile, activityData?.simplifiedFile);

						formik.setFieldValue(FieldNames.traditionalFile, activityData?.traditionalFile);

						formik.setFieldValue(FieldNames.traditionalTitle, activityData?.traditionalTitle);
						formik.setFieldValue(FieldNames.simplifiedTitle, activityData?.simplifiedTitle);

						setProvideSkipVideoSeasonal(isSkippable);

						setTraditionalFileVideoSeasonal(activityData?.traditionalFile);
						setSimplifiedFileVideoSeasonal(activityData?.simplifiedFile);
					}
					setLoadingVideoSeasonal(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingVideoSeasonal(false);
				});
		}
	}, [params.activityId]);

	const initialValues: CreateVideoActivityForm = {
		[FieldNames.lessonId]: params.lessonId as string,
		[FieldNames.topicId]: params.topicId as string,
		[FieldNames.activityTypeId]: activityUuid,
		[FieldNames.title]: '',
		[FieldNames.simplifiedFile]: '',
		[FieldNames.traditionalFile]: '',
		[FieldNames.simplifiedTitle]: [defaultSimplifiedVideoSeasonal],
		[FieldNames.traditionalTitle]: [defaultTraditionalVideoSeasonal],
		[FieldNames.isSkippable]: false,
		[FieldNames.isForSeasonal]: true,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit Activity
	 */
	const getObjVideoSeasonal = () => {
		const obj: ObjectShape = {
			[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_ACTIVITY_ENGLISH_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.traditionalTitle]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_ACTIVITY_CHINESE_TITLE),
					[FieldNames.pinyin]: Yup.string().required(Errors.PLEASE_ENTER_ACTIVITY_PINYIN_TITLE),
				})
			),
			[FieldNames.traditionalFile]: params.activityId ? Yup.string().notRequired() : Yup.string().required(Errors.PLEASE_SELECT_VIDEO_SIMPLIFIED),
			[FieldNames.simplifiedFile]: params.activityId ? Yup.string().notRequired() : Yup.string().required(Errors.PLEASE_SELECT_VIDEO_SIMPLIFIED),
			[FieldNames.simplifiedTitle]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_ACTIVITY_CHINESE_TITLE),
					[FieldNames.pinyin]: Yup.string().required(Errors.PLEASE_ENTER_ACTIVITY_PINYIN_TITLE),
				})
			),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObjVideoSeasonal();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const submitData: VideoActivitySubmitData = {
				activityTypeId: values.activityTypeId,
				topicId: values.topicId,
				lessonId: values.lessonId,
				title: values.title,
				activityData: {
					traditionalTitle: values.traditionalTitle,
					traditionalFile: values?.traditionalFile?.split('/').pop() as string,
					simplifiedTitle: values.simplifiedTitle,
					simplifiedFile: values?.simplifiedFile?.split('/').pop() as string,
				},
				isSkippable: values.isSkippable,
				isForSeasonal: true,
			};

			if (params.activityId) {
				setLoadingVideoSeasonal(true);
				APIService.patchData(`${url}/${params.activityId}`, submitData)
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							onClose();
							onSubmit();
							formik.resetForm();
						} else {
							toast.error(response?.data?.message);
						}
						setLoadingVideoSeasonal(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingVideoSeasonal(false);
					});
			} else {
				setLoadingVideoSeasonal(true);
				APIService.postData(url, submitData)
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						} else {
							toast.error(response?.data?.message);
						}
						setLoadingVideoSeasonal(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingVideoSeasonal(false);
					});
			}
		},
	});

	/**
	 *
	 * @returns Method used to Copy data from left to right form
	 */
	const copyDataVideoSeasonal = useCallback(() => {
		const traditionalDataVideoSeasonal = () => {
			if (formik.values.traditionalTitle.length === 1) {
				const traditionalVideoSeasonal = formik.values.traditionalTitle[0];
				const simplifiedVideoSeasonal = formik.values.simplifiedTitle[0];

				if ((traditionalVideoSeasonal.chinese.trim() !== '', traditionalVideoSeasonal.pinyin.trim() !== '')) {
					return formik.values.traditionalTitle.map((item) => ({ ...item }));
				} else {
					return [{ [FieldNames.chinese]: simplifiedVideoSeasonal.chinese, [FieldNames.pinyin]: simplifiedVideoSeasonal.pinyin }];
				}
			} else {
				return formik.values.traditionalTitle.map((item) => ({ ...item }));
			}
		};
		formik.setFieldValue(FieldNames.simplifiedTitle, traditionalDataVideoSeasonal());

		if (traditionalFileVideoSeasonal !== '') {
			setSimplifiedFileVideoSeasonal(traditionalFileVideoSeasonal);
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
	const fileUpdateVideoSeasonal = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const fileVideoSeasonal = event.target.files?.[0];
		if (fileVideoSeasonal === undefined) {
			return;
		}
		const fileName = event.target.name;
		const lastIndex = fileVideoSeasonal?.name?.lastIndexOf('.');
		const extension = fileVideoSeasonal?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		const fileTypes = [FILE_TYPE.movVideoType, FILE_TYPE.videoType, FILE_TYPE.webmType];
		if (fileTypes.includes(fileVideoSeasonal?.type) === false) {
			toast.error(Errors.UNSUPPORTED_FILE_FORMAT);
			return;
		}
		const video = document.createElement('video');
		const resolution = {
			width: 0,
			height: 0,
		};
		video.preload = 'metadata';
		const blob = URL.createObjectURL(fileVideoSeasonal);
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
					file: fileVideoSeasonal,
					isForSeasonal: true,
					isForSop: false,
				};

				if (fileName === FieldNames.traditionalFile) {
					const uploader = new Uploader(videoUploaderOptions, updatePercentageVideoSeasonal);
					uploader.start();
					formik.setFieldValue(FieldNames.traditionalFile, uploader.fileName);
					uploader.onComplete((response: string) => {
						setLoadingVideoSeasonal(false);
						setTraditionalFileVideoSeasonal(response);
					});
				}
				if (fileName === FieldNames.simplifiedFile) {
					const uploader = new Uploader(videoUploaderOptions, updatePercentageVideoSeasonalSimplified);
					uploader.start();
					formik.setFieldValue(FieldNames.simplifiedFile, uploader.fileName);
					uploader.onComplete((response: string) => {
						setLoadingVideoSeasonal(false);
						setSimplifiedFileVideoSeasonal(response);
					});
				}
			}
		});
	}, []);

	const addMoreTraditionalPhrasesVideoSeasonal = useCallback(() => {
		formik.setFieldValue('traditionalTitle', [...formik.values.traditionalTitle, { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' }]);
	}, [formik]);

	const addMoreSimplifiedPhrasesVideoSeasonal = useCallback(() => {
		formik.setFieldValue('simplifiedTitle', [...formik.values.simplifiedTitle, { [FieldNames.chinese]: '', [FieldNames.pinyin]: '' }]);
	}, [formik]);

	return (
		<FormikProvider value={formik}>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loadingVideoSeasonal && <Loader />}
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
													const chineseTraditionalVideoSeasonal = `traditionalTitle[${index}].chinese`;
													const pinyinTraditionalVideoSeasonal = `traditionalTitle[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-3 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Chinese' name={chineseTraditionalVideoSeasonal} onChange={formik.handleChange} label='Chinese' value={formik.values.traditionalTitle[index].chinese} error={getIn(formik.touched, chineseTraditionalVideoSeasonal) && getIn(formik.errors, chineseTraditionalVideoSeasonal) ? getIn(formik.errors, chineseTraditionalVideoSeasonal) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Pinyin' name={pinyinTraditionalVideoSeasonal} onChange={formik.handleChange} label='Pinyin' value={formik.values.traditionalTitle[index].pinyin} error={getIn(formik.touched, pinyinTraditionalVideoSeasonal) && getIn(formik.errors, pinyinTraditionalVideoSeasonal) ? getIn(formik.errors, pinyinTraditionalVideoSeasonal) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.traditionalTitle.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalPhrasesVideoSeasonal}>
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
									imageSource={traditionalFileVideoSeasonal}
									name={FieldNames.traditionalFile}
									error={formik.errors.traditionalFile && formik.touched.traditionalFile ? formik.errors.traditionalFile : ''}
									uploadType={FILE_TYPE.videoType || FILE_TYPE.movVideoType}
									acceptNote={videoNote}
									accepts={`${FILE_TYPE.videoType}, ${FILE_TYPE.movVideoType},${FILE_TYPE.webmType}`}
									onChange={useCallback((e) => {
										fileUpdateVideoSeasonal(e);
									}, [])}
								/>
								{percentageVideoSeasonal !== 0 && percentageVideoSeasonal !== 100 && (
									<div className='progress bg-gray-100 flex items-center w-full rounded-lg h-2 mt-3'>
										<span className='h-full rounded-lg bg-success w-0' style={{ width: `${percentageVideoSeasonal}%` }}></span>
										<span className='ml-3 font-medium'>{percentageVideoSeasonal}%</span>
									</div>
								)}
							</div>
						</div>
						<div className='flex flex-col justify-center items-center p-3'>
							<Button className='btn-default btn-large' title='Copy' onClick={copyDataVideoSeasonal}>
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
													const chineseSimplifiedVideoSeasonal = `simplifiedTitle[${index}].chinese`;
													const pinyinSimplifiedVideoSeasonal = `simplifiedTitle[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-3 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Chinese' name={chineseSimplifiedVideoSeasonal} onChange={formik.handleChange} label='Chinese' value={formik.values.simplifiedTitle[index].chinese} error={getIn(formik.touched, chineseSimplifiedVideoSeasonal) && getIn(formik.errors, chineseSimplifiedVideoSeasonal) ? getIn(formik.errors, chineseSimplifiedVideoSeasonal) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Pinyin' name={pinyinSimplifiedVideoSeasonal} onChange={formik.handleChange} label='Pinyin' value={formik.values.simplifiedTitle[index].pinyin} error={getIn(formik.touched, pinyinSimplifiedVideoSeasonal) && getIn(formik.errors, pinyinSimplifiedVideoSeasonal) ? getIn(formik.errors, pinyinSimplifiedVideoSeasonal) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.simplifiedTitle.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedPhrasesVideoSeasonal}>
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
									imageSource={simplifiedFileVideoSeasonal}
									name={FieldNames.simplifiedFile}
									acceptNote={videoNote}
									accepts={`${FILE_TYPE.videoType}, ${FILE_TYPE.movVideoType},${FILE_TYPE.webmType}`}
									error={formik.errors.simplifiedFile && formik.touched.simplifiedFile ? formik.errors.simplifiedFile : ''}
									uploadType={FILE_TYPE.videoType || FILE_TYPE.movVideoType}
									onChange={useCallback((e) => {
										fileUpdateVideoSeasonal(e);
									}, [])}
								/>
								{percentageVideoSeasonalSimplified !== 0 && percentageVideoSeasonalSimplified !== 100 && (
									<div className='progress bg-gray-100 flex items-center w-full rounded-lg h-2 mt-3'>
										<span className='h-full rounded-lg bg-success w-0' style={{ width: `${percentageVideoSeasonalSimplified}%` }}></span>
										<span className='ml-3 font-medium'>{percentageVideoSeasonalSimplified}%</span>
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
								id: 'provideSkipVideoSeasonal',
								name: 'Provide skip button for this activity',
								value: 'Provide skip button for this activity',
								checked: provideSkipVideoSeasonal,
								onChange: (e) => {
									setProvideSkipVideoSeasonal(!provideSkipVideoSeasonal);
									formik.setFieldValue(FieldNames.isSkippable, e.target.checked);
								},
							},
						]}
					/>
					<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdateVideoSeasonal}>
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

export default SeasonalActivityVideo;
