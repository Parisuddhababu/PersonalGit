import React, { useCallback, useEffect, useState } from 'react';
import { FieldArray, FormikProvider, getIn, useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import TextInput from '@components/textInput/TextInput';
import { CreateKaraokeActivity, MyArrayHelpers } from 'src/types/activities';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { Errors } from '@config/errors';
import { AngleRight, Cross, Plus } from '@components/icons';
import { URL_PATHS } from '@config/variables';
import { KaraokeResponse } from 'src/types/topic';
import { CHARACTERS_LIMIT, FILE_TYPE, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE, VIDEO_RESOLUTION_HEIGHT, VIDEO_RESOLUTION_WIDTH, videoNote } from '@config/constant';
import FileUpload from '@components/fileUpload/FileUpload';
import { generateUuid, translateText } from '@utils/helpers';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import DeleteButton from '@components/common/DeleteButton';
import CommonButton from '@components/common/CommonButton';
import { Uploader } from '@views/activities/utils/upload';
import { ActivityKaraokeSeasonalData } from 'src/types/seasonalTopics';
import { FieldNames } from '@views/activities/ActivityKaraoke';

const ActivityKaraokeSeasonal = ({ onSubmit, onClose, editData }: ActivityKaraokeSeasonalData) => {
	const [loadingKaraoke, setLoadingKaraoke] = useState<boolean>(false);
	const [editKaraokeSeasonal, setEditKaraokeSeasonal] = useState<KaraokeResponse>();
	const [simplifiedLyricsFileSeasonal, setSimplifiedLyricsFileSeasonal] = useState<string>('');
	const [traditionalLyricsFileSeasonal, setTraditionalLyricsFileSeasonal] = useState<string>('');
	const [percentageSimplifiedLyricsSeasonal, setPercentageSimplifiedLyricsSeasonal] = useState(0);
	const [percentageTraditionalLyricsSeasonal, setPercentageTraditionalLyricsSeasonal] = useState(0);
	const defaultTitleDataSeasonal = { [FieldNames.pinyin]: '', [FieldNames.traditional]: '', [FieldNames.simplified]: '' };

	const updatePercentageSimplifiedSeasonal = (newPercentage: number) => {
		setPercentageSimplifiedLyricsSeasonal(newPercentage);
		newPercentage === 100 && setLoadingKaraoke(true);
	};

	const updatePercentageTraditionalSeasonal = (newPercentage: number) => {
		setPercentageTraditionalLyricsSeasonal(newPercentage);
		newPercentage === 100 && setLoadingKaraoke(true);
	};

	const disableUpdateSeasonal = (percentageSimplifiedLyricsSeasonal !== 0 && percentageSimplifiedLyricsSeasonal !== 100) || (percentageTraditionalLyricsSeasonal !== 0 && percentageTraditionalLyricsSeasonal !== 100);

	const initialValues: CreateKaraokeActivity = {
		[FieldNames.topicId]: editData?.uuid as string,
		[FieldNames.karaokeTitleEnglish]: '',
		[FieldNames.simplifiedKaraokeLyricsFile]: '',
		[FieldNames.traditionalKaraokeLyricsFile]: '',
		[FieldNames.duration]: 0,
		[FieldNames.title]: [defaultTitleDataSeasonal],
		isForSeasonal: true,
	};

	const getKaraokeSeasonalData = () => {
		setLoadingKaraoke(true);
		APIService.getData(`${URL_PATHS.karaoke}/list?topicId=${editData?.uuid}&isForSeasonal=true`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					if (response.data) {
						setEditKaraokeSeasonal(response?.data);
					}
				}
				setLoadingKaraoke(false);
			})
			.catch(() => {
				setLoadingKaraoke(false);
			});
	};

	useEffect(() => {
		getKaraokeSeasonalData();
	}, []);

	useEffect(() => {
		if (editKaraokeSeasonal) {
			const karaoke = editKaraokeSeasonal?.data;
			formik.setFieldValue(FieldNames.karaokeTitleEnglish, karaoke.karaokeTitleEnglish);
			formik.setFieldValue(FieldNames.simplifiedKaraokeLyricsFile, karaoke.simplifiedKaraokeLyricsFile.split('/').pop());
			setSimplifiedLyricsFileSeasonal(karaoke.simplifiedKaraokeLyricsFile);
			formik.setFieldValue(FieldNames.traditionalKaraokeLyricsFile, karaoke.traditionalKaraokeLyricsFile.split('/').pop());
			setTraditionalLyricsFileSeasonal(karaoke.traditionalKaraokeLyricsFile);
			formik.setFieldValue(FieldNames.duration, karaoke?.duration);
			formik.setFieldValue(FieldNames.title, karaoke.title ?? [defaultTitleDataSeasonal]);
		}
	}, [editKaraokeSeasonal]);
	/**
	 *
	 * @returns Method used for get validation for karaoke activity
	 */
	const getObjKaraoke = () => {
		const objKaraoke: ObjectShape = {
			[FieldNames.karaokeTitleEnglish]: Yup.string().trim().required(Errors.PLEASE_ENTER_KARAOKE_ENGLISH_TITLE).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED),
			[FieldNames.title]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.traditional]: Yup.string().trim().required(Errors.PLEASE_ENTER_KARAOKE_TRADITIONAL_CHINESE_TITLE),
					[FieldNames.simplified]: Yup.string().trim().required(Errors.PLEASE_ENTER_KARAOKE_SIMPLIFIED_CHINESE_TITLE),
					[FieldNames.pinyin]: Yup.string().trim().required(Errors.PLEASE_ENTER_KARAOKE_PINYIN_TITLE),
				})
			),
			[FieldNames.traditionalKaraokeLyricsFile]: Yup.string().required(Errors.PLEASE_UPLOAD_KARAOKE_LYRICS_FILE),
			[FieldNames.simplifiedKaraokeLyricsFile]: Yup.string().required(Errors.PLEASE_UPLOAD_KARAOKE_LYRICS_FILE),
		};
		return Yup.object<ObjectShape>(objKaraoke);
	};
	const validationSchema = getObjKaraoke();

	const getKaraokeSeasonalError = (fieldName: keyof CreateKaraokeActivity) => {
		if (fieldName !== FieldNames.title) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			setLoadingKaraoke(true);
			if (editKaraokeSeasonal) {
				const karaoke = editKaraokeSeasonal?.data;
				APIService.patchData(`${URL_PATHS.karaoke}/${karaoke.uuid}`, {
					...values,
					[FieldNames.karaokeTitleEnglish]: values.karaokeTitleEnglish.trim(),
				})
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
					})
					.catch((err) => toast.error(err?.response?.data?.message))
					.finally(() => setLoadingKaraoke(false));
			} else {
				APIService.postData(`${URL_PATHS.karaoke}`, { ...values, [FieldNames.karaokeTitleEnglish]: values.karaokeTitleEnglish.trim() })
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
					})
					.catch((err) => toast.error(err?.response?.data?.message))
					.finally(() => setLoadingKaraoke(false));
			}
		},
	});

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const fileUpdateSeasonalKaraoke = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const fileKaraoke = event.target.files?.[0];
		if (fileKaraoke === undefined) {
			return;
		}
		const fileName = event.target.name;
		const lastIndex = fileKaraoke?.name?.lastIndexOf('.');
		const extension = fileKaraoke?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		const fileTypes = [FILE_TYPE.movVideoType, FILE_TYPE.videoType, FILE_TYPE.webmType];
		if (fileTypes.includes(fileKaraoke?.type) === false) {
			toast.error(Errors.UNSUPPORTED_FILE_FORMAT);
			return;
		}
		const video = document.createElement('video');
		const resolution = {
			width: 0,
			height: 0,
		};
		video.preload = 'metadata';
		const blob = URL.createObjectURL(fileKaraoke);
		video.src = blob;
		video.addEventListener('loadedmetadata', () => {
			const videoUploaderOptions = {
				fileName: name,
				file: fileKaraoke,
				isForSeasonal: false,
				isForSop: false,
			};
			resolution.width = video.videoWidth;
			resolution.height = video.videoHeight;
			if (resolution.width > VIDEO_RESOLUTION_WIDTH || resolution.height > VIDEO_RESOLUTION_HEIGHT || video.videoWidth === 0 || video.videoHeight === 0) {
				toast.error(Errors.VIDEO_MAXIMUM_RESOLUTION);
				return false;
			} else {
				if (fileName === FieldNames.simplifiedKaraokeLyricsFile) {
					const uploader = new Uploader(videoUploaderOptions, updatePercentageSimplifiedSeasonal);
					uploader.start();
					formik.setFieldValue(FieldNames.simplifiedKaraokeLyricsFile, uploader.fileName);
					uploader.onComplete((response: string) => {
						setLoadingKaraoke(false);
						setSimplifiedLyricsFileSeasonal(response);
					});
				}
				if (fileName === FieldNames.traditionalKaraokeLyricsFile) {
					const uploader = new Uploader(videoUploaderOptions, updatePercentageTraditionalSeasonal);
					uploader.start();
					formik.setFieldValue(FieldNames.traditionalKaraokeLyricsFile, uploader.fileName);
					uploader.onComplete((response: string) => {
						setLoadingKaraoke(false);
						setTraditionalLyricsFileSeasonal(response);
					});
				}
			}
		});
	}, []);

	const addMoreTitlePhrasesKaraoke = useCallback(() => {
		formik.setFieldValue('title', [
			...formik.values.title,
			{
				[FieldNames.pinyin]: '',
				[FieldNames.traditional]: '',
				[FieldNames.simplified]: '',
			},
		]);
	}, [formik]);

	const copyDataKaraoke = useCallback(() => {
		if (formik.values.traditionalKaraokeLyricsFile) {
			formik.setFieldValue(FieldNames.simplifiedKaraokeLyricsFile, formik.values.traditionalKaraokeLyricsFile);
			setSimplifiedLyricsFileSeasonal(traditionalLyricsFileSeasonal);
		}
	}, [formik]);

	const translateTitleFieldKaraoke = useCallback(
		(index: number) => {
			translateText(formik.values.title[index].traditional, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
				// Traditional to simplified
				formik.setFieldValue(`title[${index}].simplified`, data ?? data);
				formik.setFieldValue(`title[${index}].pinyin`, data ?? data);
			});
		},
		[formik]
	);

	const onChangeKaraokeFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateSeasonalKaraoke(e);
	}, []);

	return (
		<div id='changeKaraokeSeasonalModel' className={cn(ModelStyle['model-wrapper'])}>
			{loadingKaraoke && <Loader />}
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					<h4>{editKaraokeSeasonal ? 'Edit' : 'Add'} Karaoke</h4>
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				<FormikProvider value={formik}>
					<form className='w-[95vw] md:w-[75vw] lg:w-[60vw]' onSubmit={formik.handleSubmit}>
						<div className={cn(ModelStyle['model__body'])}>
							<div className='grid grid-cols-1'>
								<div className='mb-4 col-span-2'>
									<TextInput placeholder='Title in english' name={FieldNames.karaokeTitleEnglish} onChange={formik.handleChange} label='Karaoke Title (English)' value={formik.values.karaokeTitleEnglish} error={getKaraokeSeasonalError(FieldNames.karaokeTitleEnglish)} required />
								</div>
								<div className='font-medium'>
									Karaoke Title <span className='text-error'>*</span>
								</div>
								<FieldArray
									name={FieldNames.title}
									render={useCallback(
										(arrayHelpers: MyArrayHelpers) => (
											<div className='mb-4 col-span-2'>
												{formik.values.title?.map((duplicate, index) => {
													const traditionalKaraoke = `title[${index}].traditional`;
													const simplifiedKaraoke = `title[${index}].simplified`;
													const pinyinKaraoke = `title[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-50 rounded border mb-1 p-1 '>
															<div className='flex items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Title traditional' name={traditionalKaraoke} onChange={formik.handleChange} label='Traditional' value={formik.values.title[index].traditional} error={getIn(formik.touched, traditionalKaraoke) && getIn(formik.errors, traditionalKaraoke) ? getIn(formik.errors, traditionalKaraoke) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateTitleFieldKaraoke} isTranslate={true} title='Translate' />
																</div>
																<div className=' w-full mr-1'>
																	<TextInput placeholder='Title simplified' name={simplifiedKaraoke} onChange={formik.handleChange} label='Simplified' value={formik.values.title[index].simplified} error={getIn(formik.touched, simplifiedKaraoke) && getIn(formik.errors, simplifiedKaraoke) ? getIn(formik.errors, simplifiedKaraoke) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Title pinyin' name={pinyinKaraoke} onChange={formik.handleChange} label='Pinyin' value={formik.values.title[index].pinyin} error={getIn(formik.touched, pinyinKaraoke) && getIn(formik.errors, pinyinKaraoke) ? getIn(formik.errors, pinyinKaraoke) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.title.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTitlePhrasesKaraoke}>
													<Plus className='mr-3' /> Add More
												</Button>
											</div>
										),
										[formik]
									)}
								/>
								<div className='flex col-span-2'>
									<div className='mb-4 w-full'>
										<FileUpload labelName='Upload Video (Traditional)' id='TLyricsFile' imageSource={traditionalLyricsFileSeasonal} name={FieldNames.traditionalKaraokeLyricsFile} acceptNote={videoNote} accepts={`${FILE_TYPE.videoType}, ${FILE_TYPE.movVideoType},${FILE_TYPE.webmType}`} uploadType={FILE_TYPE.videoType} onChange={onChangeKaraokeFile} error={getKaraokeSeasonalError(FieldNames.traditionalKaraokeLyricsFile) ?? ''} />
										{percentageTraditionalLyricsSeasonal !== 0 && percentageTraditionalLyricsSeasonal !== 100 && (
											<div className='progress bg-gray-100 flex items-center w-full rounded-lg h-2 mt-3'>
												<span className='h-full rounded-lg bg-success w-0' style={{ width: `${percentageTraditionalLyricsSeasonal}%` }}></span>
												<span className='ml-3 font-medium'>{percentageTraditionalLyricsSeasonal}%</span>
											</div>
										)}
									</div>
									<div className='flex flex-col items-center justify-center p-3'>
										<Button className='btn-default btn-large' title='Copy' onClick={copyDataKaraoke} disabled={disableUpdateSeasonal}>
											<AngleRight className='text-md' />
										</Button>
										<span className='mt-1 text-gray-500'>Copy</span>
									</div>
									<div className='mb-4 w-full'>
										<FileUpload labelName='Upload Video (Simplified)' id='SLyricsFile' imageSource={simplifiedLyricsFileSeasonal} name={FieldNames.simplifiedKaraokeLyricsFile} acceptNote={videoNote} accepts={`${FILE_TYPE.videoType}, ${FILE_TYPE.movVideoType},${FILE_TYPE.webmType}`} uploadType={FILE_TYPE.videoType} onChange={onChangeKaraokeFile} error={getKaraokeSeasonalError(FieldNames.simplifiedKaraokeLyricsFile) ?? ''} />
										{percentageSimplifiedLyricsSeasonal !== 0 && percentageSimplifiedLyricsSeasonal !== 100 && (
											<div className='progress bg-gray-100 flex items-center w-full rounded-lg h-2 mt-3'>
												<span className='h-full rounded-lg bg-success w-0' style={{ width: `${percentageSimplifiedLyricsSeasonal}%` }}></span>
												<span className='ml-3 font-medium'>{percentageSimplifiedLyricsSeasonal}%</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className={cn(ModelStyle['model__footer'])}>
							<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdateSeasonal}>
								{editKaraokeSeasonal ? 'Update' : 'Save'}
							</Button>
							<Button className='btn-default btn-large w-28 justify-center' onClick={onClose}>
								Cancel
							</Button>
						</div>
					</form>
				</FormikProvider>
			</div>
		</div>
	);
};
export default ActivityKaraokeSeasonal;
