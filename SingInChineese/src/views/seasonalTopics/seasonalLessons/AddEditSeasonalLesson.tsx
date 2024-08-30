import React, { useCallback, useEffect, useState } from 'react';
import { FieldArray, FormikProvider, getIn, useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { ObjectShape } from 'yup/lib/object';
import { Errors } from '@config/errors';
import { CreateLesson, lessonToggleId } from 'src/types/lessons';
import { toast } from 'react-toastify';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { AngleRight, ArrowSmallLeft, Document, Plus } from '@components/icons';
import { URL_PATHS } from '@config/variables';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { Loader } from '@components/index';
import { DEFAULT_REWARD_STARS, ENGLISH_CODE, ROUTES, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE } from '@config/constant';
import { translateText } from '@utils/helpers';
import { MyArrayHelpers } from 'src/types/activities';
import CommonButton from '@components/common/CommonButton';
import DeleteButton from '@components/common/DeleteButton';
import { FieldNames } from '@views/lessons/AddEditLesson';
import { numberRequired, stringNoSpecialChar, stringTrim } from '@config/validations';

const AddEditSeasonalLessonModal = () => {
	const navigate = useNavigate();
	const params = useParams();
	const [loaderSeasonalLesson, setLoaderSeasonalLesson] = useState<boolean>(false);
	const defaultSentencesDataSeasonalLesson = {
		[FieldNames.sentences]: '',
		[FieldNames.sentencesPinging]: ' ',
		[FieldNames.sentencesTraditionalChinese]: '',
		[FieldNames.sentencesSimplifiedChinese]: '',
	};
	const defaultTitleDataSeasonalLesson = { [FieldNames.pinyin]: '', [FieldNames.traditional]: '', [FieldNames.simplified]: '' };
	const [seasonalLessonToggle, setSeasonalLessonToggle] = useState<lessonToggleId>({ previousLessonUUID: '', nextLessonUUID: '' });

	/**
	 * Method used for setValue from lesson data by id
	 */
	useEffect(() => {
		if (params.lessonId) {
			setLoaderSeasonalLesson(true);
			APIService.getData(`${URL_PATHS.seasonalLessons}/${params.lessonId}`)
				.then((response) => {
					const { name, title, sentences, rewardStars, toggle } = response.data.data;
					if (response.status === ResponseCode.created || ResponseCode.success) {
						formik.setFieldValue(FieldNames.name, name);
						formik.setFieldValue(FieldNames.rewardStars, rewardStars);

						formik.setFieldValue(FieldNames.sentencesData, sentences);
						formik.setFieldValue(FieldNames.title, title);
						setSeasonalLessonToggle({ previousLessonUUID: toggle.previousLessonUUID, nextLessonUUID: toggle.nextLessonUUID });
					} else {
						toast.error(response?.data?.message);
					}
					setLoaderSeasonalLesson(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoaderSeasonalLesson(false);
				});
		}
	}, [params]);

	const initialValues: CreateLesson = {
		[FieldNames.rewardStars]: DEFAULT_REWARD_STARS,
		[FieldNames.topicId]: params.topicId as string,
		[FieldNames.name]: '',
		[FieldNames.sentencesData]: [defaultSentencesDataSeasonalLesson],
		[FieldNames.title]: [defaultTitleDataSeasonalLesson],
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit onboarding
	 */
	const getObjSeasonalLesson = () => {
		const obj: ObjectShape = {
			[FieldNames.rewardStars]: numberRequired(Errors.PLEASE_ENTER_NUMBER_OF_STARS),
			[FieldNames.name]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
			[FieldNames.sentencesData]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.sentences]: stringNoSpecialChar(Errors.PLEASE_ENTER_SENTENCES),
					[FieldNames.sentencesTraditionalChinese]: stringTrim(Errors.PLEASE_ENTER_SENTENCES),
					[FieldNames.sentencesSimplifiedChinese]: stringTrim(Errors.PLEASE_ENTER_SENTENCES),
				})
			),
			[FieldNames.title]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.pinyin]: stringTrim(Errors.PLEASE_ENTER_LESSON_TITLE),
					[FieldNames.traditional]: stringTrim(Errors.PLEASE_ENTER_LESSON_TITLE),
					[FieldNames.simplified]: stringTrim(Errors.PLEASE_ENTER_LESSON_TITLE),
				})
			),
		};

		return Yup.object<ObjectShape>(obj);
	};

	const validationSchema = getObjSeasonalLesson();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const commonData = {
				sentences: values.sentencesData.map((item) => {
					return { sentences: item.sentence.trim(), sentencesPinging: item.sentencePinging, sentencesTraditionalChinese: item.sentenceTraditionalChinese, sentencesSimplifiedChinese: item.sentenceSimplifiedChinese };
				}),
				[FieldNames.title]: values.title,
			};
			if (params.lessonId) {
				setLoaderSeasonalLesson(true);
				const submitData = {
					name: values.name,
					...commonData,
					[FieldNames.rewardStars]: values.rewardStars,
				};
				APIService.patchData(`${URL_PATHS.seasonalLessons}/${params.lessonId}`, submitData)
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							pageRedirectToSeasonalLessons();
						}
						setLoaderSeasonalLesson(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderSeasonalLesson(false);
					});
			} else {
				setLoaderSeasonalLesson(true);
				const submitData = {
					name: values.name,
					isForSeasonal: true,
					...commonData,
					[FieldNames.rewardStars]: values.rewardStars,
					[FieldNames.topicId]: values.topicId,
				};
				APIService.postData(`${URL_PATHS.seasonalLessons}`, submitData)
					.then((response) => {
						if (response.status === ResponseCode.created) {
							toast.success(response?.data?.message);
							formik.resetForm();
							pageRedirectToSeasonalLessons();
						} else {
							toast.error(response?.data?.message);
						}
						setLoaderSeasonalLesson(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderSeasonalLesson(false);
					});
			}
		},
	});

	const getErrorSeasonalLesson = (fieldName: keyof CreateLesson) => {
		if (fieldName !== FieldNames.sentencesData && fieldName != FieldNames.title) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};
	const translateFieldSeasonalLesson = useCallback(
		async (index: number) => {
			await translateText(formik.values.sentencesData[index].sentenceTraditionalChinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
				// English to traditional
				formik.setFieldValue(`sentencesData[${index}].sentence`, data ?? data);
			});
			await translateText(formik.values.sentencesData[index].sentenceTraditionalChinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
				// English to simplified
				formik.setFieldValue(`sentencesData[${index}].sentenceSimplifiedChinese`, data ?? data);
			});
		},
		[formik]
	);

	const translateTitleFieldSeasonalLesson = useCallback(
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

	const addMoreTitleSeasonalLesson = useCallback(() => {
		formik.setFieldValue('title', [
			...formik.values.title,
			{
				[FieldNames.pinyin]: '',
				[FieldNames.traditional]: '',
				[FieldNames.simplified]: '',
			},
		]);
	}, [formik]);

	const addMoreSentencesSeasonalLesson = useCallback(() => {
		formik.setFieldValue('sentencesData', [
			...formik.values.sentencesData,
			{
				[FieldNames.sentences]: '',
				[FieldNames.sentencesPinging]: ' ',
				[FieldNames.sentencesTraditionalChinese]: '',
				[FieldNames.sentencesSimplifiedChinese]: '',
			},
		]);
	}, [formik]);

	const pageRedirectToSeasonalLessons = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.seasonalLesson}/${ROUTES.list}/${params.topicId}/${params.topicName}`);
	}, []);

	const navigateToTopics = () => {
		navigate(`/${ROUTES.app}/${ROUTES.seasonalTopic}`);
	};

	const navigateToNextLesson = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.seasonalLesson}/${ROUTES.list}/${params.topicId}/${params.topicName}/seasonalLesson/${seasonalLessonToggle?.nextLessonUUID}`);
	}, [seasonalLessonToggle]);

	const navigateToPrevLesson = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.seasonalLesson}/${ROUTES.list}/${params.topicId}/${params.topicName}/seasonalLesson/${seasonalLessonToggle?.previousLessonUUID}`);
	}, [seasonalLessonToggle]);

	return (
		<div>
			{loaderSeasonalLesson && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={pageRedirectToSeasonalLessons} title='Back to lessons'>
							<ArrowSmallLeft />
						</Button>
						<Document className='inline-block mr-2 text-primary' />
						{/* <button onClick={navigateToLevels}>{params.levelName}</button>
						<span className='px-3 text-xs opacity-50'>
							<AngleRight />
						</span> */}
						<button onClick={navigateToTopics}>{params.topicName}</button>
						<span className='px-3 text-xs opacity-50'>
							<AngleRight />
						</span>
						<span>{params.lessonId ? 'Edit' : 'Add'} Lesson</span>
					</h6>
					{params.lessonId && (
						<div>
							{seasonalLessonToggle.previousLessonUUID && (
								<Button className='btn btn-primary mr-2' onClick={navigateToPrevLesson}>
									Prev
								</Button>
							)}
							{seasonalLessonToggle.nextLessonUUID && (
								<Button className='btn btn-primary' onClick={navigateToNextLesson}>
									Next
								</Button>
							)}
						</div>
					)}
				</div>
				<FormikProvider value={formik}>
					<form className='p-3' onSubmit={formik.handleSubmit}>
						<div className={cn(ModelStyle['model__body'])}>
							<div className='w-full mb-4'>
								<TextInput placeholder='Lesson Title' name={FieldNames.name} onChange={formik.handleChange} label='Lesson Title' value={formik.values.name} error={getErrorSeasonalLesson(FieldNames.name)} required />
							</div>
							<div className='font-medium'>
								Lesson Title <span className='text-error'>*</span>
							</div>
							<FieldArray
								name={FieldNames.title}
								render={useCallback(
									(arrayHelpers: MyArrayHelpers) => (
										<div className='mb-4 col-span-2'>
											{formik.values.title?.map((_, index) => {
												const traditionalTitleSeasonalLesson = `title[${index}].traditional`;
												const simplifiedTitleSeasonalLesson = `title[${index}].simplified`;
												const pinyinTitleSeasonalLesson = `title[${index}].pinyin`;
												return (
													<div key={`${index + 1}`} className='bg-gray-50 rounded border mb-1 p-1 '>
														<div className='flex space-x-1 items-start'>
															<div className=' w-full'>
																<TextInput placeholder='Title traditional' name={traditionalTitleSeasonalLesson} onChange={formik.handleChange} label='Traditional' value={formik.values.title[index].traditional} error={getIn(formik.touched, traditionalTitleSeasonalLesson) && getIn(formik.errors, traditionalTitleSeasonalLesson) ? getIn(formik.errors, traditionalTitleSeasonalLesson) : ''} required />
															</div>
															<div className='mt-7'>
																<CommonButton data={index} dataHandler={translateTitleFieldSeasonalLesson} isTranslate={true} title='Translate' />
															</div>
															<div className=' w-full'>
																<TextInput placeholder='Title simplified' name={simplifiedTitleSeasonalLesson} onChange={formik.handleChange} label='Simplified' value={formik.values.title[index].simplified} error={getIn(formik.touched, simplifiedTitleSeasonalLesson) && getIn(formik.errors, simplifiedTitleSeasonalLesson) ? getIn(formik.errors, simplifiedTitleSeasonalLesson) : ''} required />
															</div>
															<div className=' w-full'>
																<TextInput placeholder='Title pinyin' name={pinyinTitleSeasonalLesson} onChange={formik.handleChange} label='Pinyin' value={formik.values.title[index].pinyin} error={getIn(formik.touched, pinyinTitleSeasonalLesson) && getIn(formik.errors, pinyinTitleSeasonalLesson) ? getIn(formik.errors, pinyinTitleSeasonalLesson) : ''} required />
															</div>
															<div className='mt-7'>
																<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.title.length === 1} btnDanger={true} />
															</div>
														</div>
													</div>
												);
											})}
											<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTitleSeasonalLesson}>
												<Plus className='mr-3' /> Add More
											</Button>
										</div>
									),
									[formik]
								)}
							/>

							<div className='font-medium'>
								Sentences <span className='text-error'>*</span>
							</div>
							<FieldArray
								name={FieldNames.sentencesData}
								render={useCallback(
									(arrayHelpers: MyArrayHelpers) => (
										<div className='mb-4 col-span-2'>
											{formik.values.sentencesData?.map((_, index) => {
												const englishSentencesSeasonalLesson = `sentencesData[${index}].sentence`;
												const pinyinSentencesSeasonalLesson = `sentencesData[${index}].sentencePinging`;
												const traditionalSentencesSeasonalLesson = `sentencesData[${index}].sentenceTraditionalChinese`;
												const simplifiedSentencesSeasonalLesson = `sentencesData[${index}].sentenceSimplifiedChinese`;

												return (
													<div key={`${index + 1}`} className='bg-gray-50 rounded border mb-1 p-1 '>
														<div className='flex space-x-1 items-start'>
															<div className=' w-full'>
																<TextInput placeholder='Sentences Traditional' name={traditionalSentencesSeasonalLesson} onChange={formik.handleChange} label='Traditional' value={formik.values.sentencesData[index].sentenceTraditionalChinese} error={getIn(formik.touched, traditionalSentencesSeasonalLesson) && getIn(formik.errors, traditionalSentencesSeasonalLesson) ? getIn(formik.errors, traditionalSentencesSeasonalLesson) : ''} required />
															</div>
															<div className='mt-7'>
																<CommonButton data={index} dataHandler={translateFieldSeasonalLesson} isTranslate={true} title='Translate' />
															</div>
															<div className=' w-full hidden'>
																<TextInput placeholder='Sentences pinyin' name={pinyinSentencesSeasonalLesson} onChange={formik.handleChange} label='Pinyin' value={formik.values.sentencesData[index].sentencePinging} error={getIn(formik.touched, pinyinSentencesSeasonalLesson) && getIn(formik.errors, pinyinSentencesSeasonalLesson) ? getIn(formik.errors, pinyinSentencesSeasonalLesson) : ''} required />
															</div>
															<div className=' w-full'>
																<TextInput placeholder='Sentences english' name={englishSentencesSeasonalLesson} onChange={formik.handleChange} label='English' value={formik.values.sentencesData[index].sentence} error={getIn(formik.touched, englishSentencesSeasonalLesson) && getIn(formik.errors, englishSentencesSeasonalLesson) ? getIn(formik.errors, englishSentencesSeasonalLesson) : ''} required />
															</div>
															<div className=' w-full'>
																<TextInput placeholder='Sentences Simplified' name={simplifiedSentencesSeasonalLesson} onChange={formik.handleChange} label='Simplified' value={formik.values.sentencesData[index].sentenceSimplifiedChinese} error={getIn(formik.touched, simplifiedSentencesSeasonalLesson) && getIn(formik.errors, simplifiedSentencesSeasonalLesson) ? getIn(formik.errors, simplifiedSentencesSeasonalLesson) : ''} required />
															</div>
															<div className='mt-7'>
																<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.sentencesData.length === 1} btnDanger={true} />
															</div>
														</div>
													</div>
												);
											})}
											<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSentencesSeasonalLesson}>
												<Plus className='mr-3' /> Add More
											</Button>
										</div>
									),
									[formik]
								)}
							/>
						</div>
						<div className='text-end space-x-2'>
							<Button className='btn-primary btn-large w-28 justify-center' type='submit'>
								{params.lessonId ? 'Update' : 'Save'}
							</Button>
							<Button className='btn-default btn-large w-28 justify-center' onClick={pageRedirectToSeasonalLessons}>
								Cancel
							</Button>
						</div>
					</form>
				</FormikProvider>
			</div>
		</div>
	);
};

export default AddEditSeasonalLessonModal;
