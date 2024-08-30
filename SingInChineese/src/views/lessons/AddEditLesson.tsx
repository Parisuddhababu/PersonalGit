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
import { ENGLISH_CODE, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE, DEFAULT_REWARD_STARS, ROUTES } from '@config/constant';
import { translateText } from '@utils/helpers';
import { MyArrayHelpers } from 'src/types/activities';
import CommonButton from '@components/common/CommonButton';
import DeleteButton from '@components/common/DeleteButton';
import { numberRequired, stringNoSpecialChar, stringTrim } from '@config/validations';

export enum FieldNames {
	lessonTitle = 'lessonTitle',
	name = 'name',
	rewardStars = 'rewardStars',
	levelId = 'levelId',
	topicId = 'topicId',
	sentencesData = 'sentencesData',
	sentences = 'sentence',
	sentencesPinging = 'sentencePinging',
	sentencesTraditionalChinese = 'sentenceTraditionalChinese',
	sentencesSimplifiedChinese = 'sentenceSimplifiedChinese',
	title = 'title',
	pinyin = 'pinyin',
	traditional = 'traditional',
	simplified = 'simplified',
}

const AddEditLessonModal = () => {
	const navigate = useNavigate();
	const params = useParams();
	const [loaderLesson, setLoaderLesson] = useState<boolean>(false);
	const defaultSentencesData = {
		[FieldNames.sentences]: '',
		[FieldNames.sentencesPinging]: ' ',
		[FieldNames.sentencesTraditionalChinese]: '',
		[FieldNames.sentencesSimplifiedChinese]: '',
	};
	const defaultTitleData = { [FieldNames.pinyin]: '', [FieldNames.traditional]: '', [FieldNames.simplified]: '' };
	const [lessonToggle, setLessonToggle] = useState<lessonToggleId>({ previousLessonUUID: '', nextLessonUUID: '' });

	/**
	 * Method used for setValue from lesson data by id
	 */
	useEffect(() => {
		if (params.lessonId) {
			setLoaderLesson(true);
			APIService.getData(`${URL_PATHS.lesson}/${params.lessonId}`)
				.then((response) => {
					const { name, title, sentences, rewardStars, toggle } = response.data.data;
					if (response.status === ResponseCode.created || ResponseCode.success) {
						formik.setFieldValue(FieldNames.name, name);
						formik.setFieldValue(FieldNames.rewardStars, rewardStars);

						formik.setFieldValue(FieldNames.sentencesData, sentences ?? [defaultSentencesData]);
						formik.setFieldValue(FieldNames.title, title ?? [defaultTitleData]);
						setLessonToggle({ previousLessonUUID: toggle.previousLessonUUID, nextLessonUUID: toggle.nextLessonUUID });
					} else {
						toast.error(response?.data?.message);
					}
					setLoaderLesson(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoaderLesson(false);
				});
		}
	}, [params]);

	const initialValues: CreateLesson = {
		[FieldNames.rewardStars]: DEFAULT_REWARD_STARS,
		[FieldNames.levelId]: params.levelId as string,
		[FieldNames.topicId]: params.topicId as string,
		[FieldNames.name]: '',
		[FieldNames.sentencesData]: [defaultSentencesData],
		[FieldNames.title]: [defaultTitleData],
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit onboarding
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.name]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
			[FieldNames.title]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.traditional]: stringTrim(Errors.PLEASE_ENTER_LESSON_TITLE),
					[FieldNames.simplified]: stringTrim(Errors.PLEASE_ENTER_LESSON_TITLE),
					[FieldNames.pinyin]: stringTrim(Errors.PLEASE_ENTER_LESSON_TITLE),
				})
			),
			[FieldNames.sentencesData]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.sentences]: stringNoSpecialChar(Errors.PLEASE_ENTER_SENTENCES),
					[FieldNames.sentencesTraditionalChinese]: stringTrim(Errors.PLEASE_ENTER_SENTENCES),
					[FieldNames.sentencesSimplifiedChinese]: stringTrim(Errors.PLEASE_ENTER_SENTENCES),
				})
			),
			[FieldNames.rewardStars]: numberRequired(Errors.PLEASE_ENTER_NUMBER_OF_STARS),
		};

		return Yup.object<ObjectShape>(obj);
	};

	const validationSchema = getObj();

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
				setLoaderLesson(true);
				const submitData = {
					name: values.name.trim(),
					[FieldNames.rewardStars]: values.rewardStars,
					...commonData,
				};
				APIService.putData(`${URL_PATHS.lesson}/${params.lessonId}`, submitData)
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							pageRedirectToLessons();
						}
						setLoaderLesson(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderLesson(false);
					});
			} else {
				setLoaderLesson(true);
				const submitData = {
					name: values.name.trim(),
					[FieldNames.rewardStars]: values.rewardStars,
					[FieldNames.levelId]: values.levelId,
					[FieldNames.topicId]: values.topicId,
					...commonData,
				};
				APIService.postData(`${URL_PATHS.lesson}`, submitData)
					.then((response) => {
						if (response.status === ResponseCode.created) {
							toast.success(response?.data?.message);
							formik.resetForm();
							pageRedirectToLessons();
						} else {
							toast.error(response?.data?.message);
						}
						setLoaderLesson(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderLesson(false);
					});
			}
		},
	});

	const getError = (fieldName: keyof CreateLesson) => {
		if (fieldName !== FieldNames.sentencesData && fieldName != FieldNames.title) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};
	const translateField = useCallback(
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

	const addMoreTitle = useCallback(() => {
		formik.setFieldValue('title', [
			...formik.values.title,
			{
				[FieldNames.pinyin]: '',
				[FieldNames.traditional]: '',
				[FieldNames.simplified]: '',
			},
		]);
	}, [formik]);

	const addMoreSentences = useCallback(() => {
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

	const pageRedirectToLessons = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.lessons}/${ROUTES.list}/${params.levelId}/${params.topicId}/${params.levelName}/${params.topicName}`);
	}, []);

	const navigateToTopics = () => {
		navigate(`/${ROUTES.app}/${ROUTES.topic}/${ROUTES.list}/${params.levelId}/${params.levelName}`);
	};

	const navigateToLevels = () => {
		navigate(`/${ROUTES.app}/${ROUTES.level}/${ROUTES.list}`);
	};

	const navigateToNextLesson = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.lessons}/${ROUTES.list}/${params.levelId}/${params.topicId}/${params.levelName}/${params.topicName}/lesson/${lessonToggle?.nextLessonUUID}`);
	}, [lessonToggle]);

	const navigateToPrevLesson = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.lessons}/${ROUTES.list}/${params.levelId}/${params.topicId}/${params.levelName}/${params.topicName}/lesson/${lessonToggle?.previousLessonUUID}`);
	}, [lessonToggle]);

	return (
		<div>
			{loaderLesson && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={pageRedirectToLessons} title='Back to lessons'>
							<ArrowSmallLeft />
						</Button>
						<Document className='inline-block mr-2 text-primary' />
						<button onClick={navigateToLevels}>{params.levelName}</button>
						<span className='px-3 text-xs opacity-50'>
							<AngleRight />
						</span>
						<button onClick={navigateToTopics}>{params.topicName}</button>
						<span className='px-3 text-xs opacity-50'>
							<AngleRight />
						</span>
						<span>{params.lessonId ? 'Edit' : 'Add'} Lesson</span>
					</h6>
					{params.lessonId && (
						<div>
							{lessonToggle.previousLessonUUID && (
								<Button className='btn btn-primary mr-2' onClick={navigateToPrevLesson}>
									Prev
								</Button>
							)}
							{lessonToggle.nextLessonUUID && (
								<Button className='btn btn-primary' onClick={navigateToNextLesson}>
									Next
								</Button>
							)}
						</div>
					)}
				</div>
				<FormikProvider value={formik}>
					<form onSubmit={formik.handleSubmit} className='p-3'>
						<div className={cn(ModelStyle['model__body'])}>
							<div className='w-full mb-4'>
								<TextInput placeholder='Lesson Title' name={FieldNames.name} onChange={formik.handleChange} label='Lesson Title' value={formik.values.name} error={getError(FieldNames.name)} required />
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
												const traditionalLessonTitle = `title[${index}].traditional`;
												const simplifiedLessonTitle = `title[${index}].simplified`;
												const pinyinLessonTitle = `title[${index}].pinyin`;
												return (
													<div key={`${index + 1}`} className='bg-gray-50 rounded border mb-1 p-1 '>
														<div className='flex space-x-1 items-start'>
															<div className=' w-full'>
																<TextInput placeholder='Title traditional' name={traditionalLessonTitle} onChange={formik.handleChange} label='Traditional' value={formik.values.title[index].traditional} error={getIn(formik.touched, traditionalLessonTitle) && getIn(formik.errors, traditionalLessonTitle) ? getIn(formik.errors, traditionalLessonTitle) : ''} required />
															</div>
															<div className='mt-7'>
																<CommonButton data={index} dataHandler={translateTitleField} isTranslate={true} title='Translate' />
															</div>
															<div className=' w-full'>
																<TextInput placeholder='Title simplified' name={simplifiedLessonTitle} onChange={formik.handleChange} label='Simplified' value={formik.values.title[index].simplified} error={getIn(formik.touched, simplifiedLessonTitle) && getIn(formik.errors, simplifiedLessonTitle) ? getIn(formik.errors, simplifiedLessonTitle) : ''} required />
															</div>
															<div className=' w-full'>
																<TextInput placeholder='Title pinyin' name={pinyinLessonTitle} onChange={formik.handleChange} label='Pinyin' value={formik.values.title[index].pinyin} error={getIn(formik.touched, pinyinLessonTitle) && getIn(formik.errors, pinyinLessonTitle) ? getIn(formik.errors, pinyinLessonTitle) : ''} required />
															</div>
															<div className='mt-7'>
																<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.title.length === 1} btnDanger={true} />
															</div>
														</div>
													</div>
												);
											})}
											<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTitle}>
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
												const english = `sentencesData[${index}].sentence`;
												const pinyin = `sentencesData[${index}].sentencePinging`;
												const traditional = `sentencesData[${index}].sentenceTraditionalChinese`;
												const simplified = `sentencesData[${index}].sentenceSimplifiedChinese`;

												return (
													<div key={`${index + 1}`} className='bg-gray-50 rounded border mb-1 p-1 '>
														<div className='flex space-x-1 items-start'>
															<div className=' w-full'>
																<TextInput placeholder='Sentences Traditional' name={traditional} onChange={formik.handleChange} label='Traditional' value={formik.values.sentencesData[index].sentenceTraditionalChinese} error={getIn(formik.touched, traditional) && getIn(formik.errors, traditional) ? getIn(formik.errors, traditional) : ''} required />
															</div>
															<div className='mt-7'>
																<CommonButton data={index} dataHandler={translateField} isTranslate={true} title='Translate' />
															</div>
															<div className=' w-full hidden'>
																<TextInput placeholder='Sentences pinyin' name={pinyin} onChange={formik.handleChange} label='Pinyin' value={formik.values.sentencesData[index].sentencePinging} error={getIn(formik.touched, pinyin) && getIn(formik.errors, pinyin) ? getIn(formik.errors, pinyin) : ''} required />
															</div>
															<div className=' w-full'>
																<TextInput placeholder='Sentences english' name={english} onChange={formik.handleChange} label='English' value={formik.values.sentencesData[index].sentence} error={getIn(formik.touched, english) && getIn(formik.errors, english) ? getIn(formik.errors, english) : ''} required />
															</div>
															<div className=' w-full'>
																<TextInput placeholder='Sentences Simplified' name={simplified} onChange={formik.handleChange} label='Simplified' value={formik.values.sentencesData[index].sentenceSimplifiedChinese} error={getIn(formik.touched, simplified) && getIn(formik.errors, simplified) ? getIn(formik.errors, simplified) : ''} required />
															</div>
															<div className='mt-7'>
																<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.sentencesData.length === 1} btnDanger={true} />
															</div>
														</div>
													</div>
												);
											})}
											<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSentences}>
												<Plus className='mr-3' /> Add More
											</Button>
										</div>
									),
									[formik]
								)}
							/>
						</div>
						<div className='text-end space-x-2'>
							<Button className='btn-primary btn-large w-24 justify-center' type='submit'>
								{params.lessonId ? 'Update' : 'Save'}
							</Button>
							<Button className='btn-default btn-large w-24 justify-center' onClick={pageRedirectToLessons}>
								Cancel
							</Button>
						</div>
					</form>
				</FormikProvider>
			</div>
		</div>
	);
};

export default AddEditLessonModal;
