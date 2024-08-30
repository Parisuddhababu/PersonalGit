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
import { ActivityKaraokeData, KaraokeResponse } from 'src/types/topic';
import { CHARACTERS_LIMIT, FILE_TYPE, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE, VIDEO_RESOLUTION_HEIGHT, VIDEO_RESOLUTION_WIDTH, videoNote } from '@config/constant';
import FileUpload from '@components/fileUpload/FileUpload';
import { generateUuid, translateText } from '@utils/helpers';
import { Uploader } from './utils/upload';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import DeleteButton from '@components/common/DeleteButton';
import CommonButton from '@components/common/CommonButton';

export enum FieldNames {
	topicId = 'topicId',
	karaokeTitleEnglish = 'karaokeTitleEnglish',
	karaokeTitleChineseTraditional = 'karaokeTitleChineseTraditional',
	karaokeTitleChineseSimplified = 'karaokeTitleChineseSimplified',
	karaokeTitleChinesePinyin = 'karaokeTitleChinesePinyin',
	simplifiedKaraokeLyricsFile = 'simplifiedKaraokeLyricsFile',
	traditionalKaraokeLyricsFile = 'traditionalKaraokeLyricsFile',
	duration = 'duration',
	title = 'title',
	pinyin = 'pinyin',
	traditional = 'traditional',
	simplified = 'simplified',
}

const ActivityKaraoke = ({ onSubmit, onClose, editData, disabled }: ActivityKaraokeData) => {
	const [loader, setLoader] = useState<boolean>(false);
	const [editKaraoke, setEditKaraoke] = useState<KaraokeResponse>();
	const [simplifiedLyricsFile, setSimplifiedLyricsFile] = useState<string>('');
	const [traditionalLyricsFile, setTraditionalLyricsFile] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [percentageSimplifiedLyrics, setPercentageSimplifiedLyrics] = useState(0);
	const [percentageTraditionalLyrics, setPercentageTraditionalLyrics] = useState(0);
	const defaultTitleData = { [FieldNames.pinyin]: '', [FieldNames.traditional]: '', [FieldNames.simplified]: '' };

	const updatePercentageSimplified = (newPercentage: number) => {
		setPercentageSimplifiedLyrics(newPercentage);
		newPercentage === 100 && setLoading(true);
	};

	const updatePercentageTraditional = (newPercentage: number) => {
		setPercentageTraditionalLyrics(newPercentage);
		newPercentage === 100 && setLoading(true);
	};

	const disableUpdate = (percentageSimplifiedLyrics !== 0 && percentageSimplifiedLyrics !== 100) || (percentageTraditionalLyrics !== 0 && percentageTraditionalLyrics !== 100);

	const initialValues: CreateKaraokeActivity = {
		[FieldNames.topicId]: editData?.uuid as string,
		[FieldNames.karaokeTitleEnglish]: '',
		[FieldNames.simplifiedKaraokeLyricsFile]: '',
		[FieldNames.traditionalKaraokeLyricsFile]: '',
		[FieldNames.duration]: 0,
		[FieldNames.title]: [defaultTitleData],
	};

	const getKaraokeData = (topicId: string) => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.karaoke}/list?topicId=${topicId}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					if (response.data) {
						setEditKaraoke(response?.data);
					}
				}
				setLoader(false);
			})
			.catch(() => {
				setLoader(false);
			});
	};

	useEffect(() => {
		getKaraokeData(editData?.uuid as string);
	}, []);

	useEffect(() => {
		if (editKaraoke) {
			const karaoke = editKaraoke?.data;

			formik.setFieldValue(FieldNames.karaokeTitleEnglish, karaoke.karaokeTitleEnglish);
			formik.setFieldValue(FieldNames.simplifiedKaraokeLyricsFile, karaoke.simplifiedKaraokeLyricsFile.split('/').pop());
			setSimplifiedLyricsFile(karaoke.simplifiedKaraokeLyricsFile);
			formik.setFieldValue(FieldNames.traditionalKaraokeLyricsFile, karaoke.traditionalKaraokeLyricsFile.split('/').pop());
			setTraditionalLyricsFile(karaoke.traditionalKaraokeLyricsFile);
			formik.setFieldValue(FieldNames.duration, karaoke?.duration);
			formik.setFieldValue(FieldNames.title, karaoke.title ?? [defaultTitleData]);
		}
	}, [editKaraoke]);
	/**
	 *
	 * @returns Method used for get validation for add/edit questions
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.karaokeTitleEnglish]: Yup.string().trim().required(Errors.PLEASE_ENTER_KARAOKE_ENGLISH_TITLE).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED),

			[FieldNames.simplifiedKaraokeLyricsFile]: Yup.string().required(Errors.PLEASE_UPLOAD_KARAOKE_LYRICS_FILE),
			[FieldNames.traditionalKaraokeLyricsFile]: Yup.string().required(Errors.PLEASE_UPLOAD_KARAOKE_LYRICS_FILE),
			[FieldNames.title]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.pinyin]: Yup.string().trim().required(Errors.PLEASE_ENTER_KARAOKE_PINYIN_TITLE),
					[FieldNames.traditional]: Yup.string().trim().required(Errors.PLEASE_ENTER_KARAOKE_TRADITIONAL_CHINESE_TITLE),
					[FieldNames.simplified]: Yup.string().trim().required(Errors.PLEASE_ENTER_KARAOKE_SIMPLIFIED_CHINESE_TITLE),
				})
			),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObj();

	const getKaraokeError = (fieldName: keyof CreateKaraokeActivity) => {
		if (fieldName !== FieldNames.title) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			if (editKaraoke) {
				const karaoke = editKaraoke?.data;

				setLoader(true);
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
						setLoader(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoader(false);
					});
			} else {
				setLoader(true);
				APIService.postData(`${URL_PATHS.karaoke}`, { ...values, [FieldNames.karaokeTitleEnglish]: values.karaokeTitleEnglish.trim() })
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoader(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoader(false);
					});
			}
		},
	});

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const fileUpdate = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file === undefined) {
			return;
		}
		const fileName = event.target.name;
		const lastIndex = file?.name?.lastIndexOf('.');
		const extension = file?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		const fileTypes = [FILE_TYPE.movVideoType, FILE_TYPE.videoType, FILE_TYPE.webmType];
		if (fileTypes.includes(file?.type) === false) {
			toast.error(Errors.UNSUPPORTED_FILE_FORMAT);
			return;
		}
		const video = document.createElement('video');
		const resolution = {
			width: 0,
			height: 0,
		};
		video.preload = 'metadata';
		const blob = URL.createObjectURL(file);
		video.src = blob;
		video.addEventListener('loadedmetadata', () => {
			const videoUploaderOptions = {
				fileName: name,
				file: file,
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
					const uploader = new Uploader(videoUploaderOptions, updatePercentageSimplified);
					uploader.start();
					formik.setFieldValue(FieldNames.simplifiedKaraokeLyricsFile, uploader.fileName);
					uploader.onComplete((response: string) => {
						setLoading(false);
						setSimplifiedLyricsFile(response);
					});
				}
				if (fileName === FieldNames.traditionalKaraokeLyricsFile) {
					const uploader = new Uploader(videoUploaderOptions, updatePercentageTraditional);
					uploader.start();
					formik.setFieldValue(FieldNames.traditionalKaraokeLyricsFile, uploader.fileName);
					uploader.onComplete((response: string) => {
						setLoading(false);
						setTraditionalLyricsFile(response);
					});
				}
			}
		});
	}, []);

	const addMoreTitlePhrases = useCallback(() => {
		formik.setFieldValue('title', [
			...formik.values.title,
			{
				[FieldNames.pinyin]: '',
				[FieldNames.traditional]: '',
				[FieldNames.simplified]: '',
			},
		]);
	}, [formik]);

	const copyData = useCallback(() => {
		if (formik.values.traditionalKaraokeLyricsFile) {
			formik.setFieldValue(FieldNames.simplifiedKaraokeLyricsFile, formik.values.traditionalKaraokeLyricsFile);
			setSimplifiedLyricsFile(traditionalLyricsFile);
		}
	}, [formik]);

	const translateTitleField = useCallback(
		(index: number) => {
			translateText(formik.values.title[index].traditional, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
				// Traditional to simplified
				formik.setFieldValue(`title[${index}].simplified`, data ?? data);
				// Traditional to pinyin (Traditional text)
				formik.setFieldValue(`title[${index}].pinyin`, data ?? data);
			});
		},
		[formik]
	);

	return (
		<div id='changeKaraokeModel' className={cn(ModelStyle['model-wrapper'])}>
			{loading && <Loader />}
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					<h4>{editKaraoke ? 'Edit' : 'Add'} Karaoke</h4>
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{loader && <Loader />}
				<FormikProvider value={formik}>
					<form className='w-[90vw] md:w-[75vw] lg:w-[60vw]' onSubmit={formik.handleSubmit}>
						{loader && <Loader />}
						<div className={cn(ModelStyle['model__body'])}>
							<div>
								<div className='grid grid-cols-1 gap-x-4 gap-y-2'>
									<div className='mb-4 col-span-2'>
										<TextInput placeholder='Title in english' name={FieldNames.karaokeTitleEnglish} onChange={formik.handleChange} label='Karaoke Title (English)' value={formik.values.karaokeTitleEnglish} error={getKaraokeError(FieldNames.karaokeTitleEnglish)} required />
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
														const traditional = `title[${index}].traditional`;
														const simplified = `title[${index}].simplified`;
														const pinyin = `title[${index}].pinyin`;
														return (
															<div key={`${index + 1}`} className='bg-gray-50 rounded border mb-1 p-1 '>
																<div className='flex items-start'>
																	<div className='w-full'>
																		<TextInput placeholder='Title traditional' name={traditional} onChange={formik.handleChange} label='Traditional' value={formik.values.title[index].traditional} error={getIn(formik.touched, traditional) && getIn(formik.errors, traditional) ? getIn(formik.errors, traditional) : ''} required />
																	</div>
																	<div className='mt-7'>
																		<CommonButton data={index} dataHandler={translateTitleField} isTranslate={true} title='Translate' />
																	</div>
																	<div className='w-full mr-1'>
																		<TextInput placeholder='Title simplified' name={simplified} onChange={formik.handleChange} label='Simplified' value={formik.values.title[index].simplified} error={getIn(formik.touched, simplified) && getIn(formik.errors, simplified) ? getIn(formik.errors, simplified) : ''} required />
																	</div>
																	<div className='w-full'>
																		<TextInput placeholder='Title pinyin' name={pinyin} onChange={formik.handleChange} label='Pinyin' value={formik.values.title[index].pinyin} error={getIn(formik.touched, pinyin) && getIn(formik.errors, pinyin) ? getIn(formik.errors, pinyin) : ''} required />
																	</div>
																	<div className='mt-7'>
																		<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.title.length === 1} btnDanger={true} />
																	</div>
																</div>
															</div>
														);
													})}
													<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTitlePhrases}>
														<Plus className='mr-3' /> Add More
													</Button>
												</div>
											),
											[formik]
										)}
									/>
									<div className='flex col-span-2'>
										<div className='mb-4 w-full'>
											<FileUpload
												disabled={false}
												labelName='Upload Video (Traditional)'
												id='TLyricsFile'
												imageSource={traditionalLyricsFile}
												name={FieldNames.traditionalKaraokeLyricsFile}
												acceptNote={videoNote}
												accepts={`${FILE_TYPE.videoType}, ${FILE_TYPE.movVideoType},${FILE_TYPE.webmType}`}
												uploadType={FILE_TYPE.videoType}
												onChange={useCallback((e) => {
													fileUpdate(e);
												}, [])}
												error={getKaraokeError(FieldNames.traditionalKaraokeLyricsFile) ?? ''}
											/>
											{percentageTraditionalLyrics !== 0 && percentageTraditionalLyrics !== 100 && (
												<div className='progress bg-gray-100 flex items-center w-full rounded-lg h-2 mt-3'>
													<span className='h-full rounded-lg bg-success w-0' style={{ width: `${percentageTraditionalLyrics}%` }}></span>
													<span className='ml-3 font-medium'>{percentageTraditionalLyrics}%</span>
												</div>
											)}
										</div>
										<div className='flex flex-col justify-center items-center p-3'>
											<Button className='btn-default btn-large' title='Copy' onClick={copyData} disabled={disableUpdate}>
												<AngleRight className='text-md' />
											</Button>
											<span className='mt-1 text-gray-500'>Copy</span>
										</div>
										<div className='mb-4 w-full'>
											<FileUpload
												disabled={false}
												labelName='Upload Video (Simplified)'
												id='SLyricsFile'
												imageSource={simplifiedLyricsFile}
												name={FieldNames.simplifiedKaraokeLyricsFile}
												acceptNote={videoNote}
												accepts={`${FILE_TYPE.videoType}, ${FILE_TYPE.movVideoType},${FILE_TYPE.webmType}`}
												uploadType={FILE_TYPE.videoType}
												onChange={useCallback((e) => {
													fileUpdate(e);
												}, [])}
												error={getKaraokeError(FieldNames.simplifiedKaraokeLyricsFile) ?? ''}
											/>
											{percentageSimplifiedLyrics !== 0 && percentageSimplifiedLyrics !== 100 && (
												<div className='progress bg-gray-100 flex items-center w-full rounded-lg h-2 mt-3'>
													<span className='h-full rounded-lg bg-success w-0' style={{ width: `${percentageSimplifiedLyrics}%` }}></span>
													<span className='ml-3 font-medium'>{percentageSimplifiedLyrics}%</span>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
						{!disabled && (
							<div className={cn(ModelStyle['model__footer'])}>
								<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdate}>
									{editKaraoke ? 'Update' : 'Save'}
								</Button>
								<Button className='btn-default btn-large w-28 justify-center' onClick={onClose}>
									Cancel
								</Button>
							</div>
						)}
					</form>
				</FormikProvider>
			</div>
		</div>
	);
};

export default ActivityKaraoke;
