import React, { useCallback, useEffect, useState } from 'react';
import { FieldArray, FormikProvider, getIn, useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import TextInput from '@components/textInput/TextInput';
import CheckBox from '@components/checkbox/CheckBox';
import { APIService } from '@framework/services/api';
import { FieldNames, ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { AngleRight, Plus } from '@components/icons';
import FileUpload from '@components/fileUpload/FileUpload';
import { IMAGE_NOTE, ENGLISH_CODE, FILE_TYPE, OPTION_LIMIT, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE, fileTypeEnum, activityPaths } from '@config/constant';
import { Errors } from '@config/errors';
import { useParams } from 'react-router-dom';
import { CreateFillBlanksActivity, FillInTheBlanksActivitySubmitData, optionObject } from 'src/types/activities/fillInTheBlanks';
import { generateUuid, moveData, resetInputManually, translateText, typeValidation } from '@utils/helpers';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import { AddEditSeasonalActivityData } from 'src/types/seasonalTopics';
import { Uploader } from '@views/activities/utils/upload';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import CommonButton from '@components/common/CommonButton';
import { MyArrayHelpers } from 'src/types/activities';
import { mixedNotRequired, mixedRequired, stringNoSpecialChar, stringNotRequired, stringRequired, stringTrim } from '@config/validations';

export const SeasonalActivityFillInTheBlanks = ({ onSubmit, onClose, url, activityUuid, toggleSeasonalActivity, isMoving, topicId, lessonId }: AddEditSeasonalActivityData) => {
	const defaultTraditionalFieldBlanksSeasonal = { chinese: '', english: '', pinyin: '' };
	const defaultSimplifiedFieldBlanksSeasonal = { chinese: '', english: '', pinyin: '' };
	const params = useParams();
	const [loadingBlanksSeasonal, setLoadingBlanksSeasonal] = useState<boolean>(false);
	const [skipButtonCheckedBlanksSeasonal, setSkipButtonCheckedBlanksSeasonal] = useState<boolean>(false);

	const [imageSimplifiedBlanksSeasonal, setImageSimplifiedBlanksSeasonal] = useState<string>('');
	const [audioSimplifiedBlanksSeasonal, setAudioSimplifiedBlanksSeasonal] = useState<string>('');
	const [imageSimplifiedBlanksSeasonalPercentage, setImageSimplifiedBlanksSeasonalPercentage] = useState<number>(0);
	const [audioSimplifiedBlanksSeasonalPercentage, setAudioSimplifiedBlanksSeasonalPercentage] = useState<number>(0);
	const [optionAudioSimplifiedBlanksSeasonal, setOptionAudioSimplifiedBlanksSeasonal] = useState<string>('');
	const [optionAudioSimplifiedBlanksSeasonalPercent, setOptionAudioSimplifiedBlanksSeasonalPercent] = useState<number>(0);

	const [correctAnswerSimplifiedBlanksSeasonal, setCorrectAnswerSimplifiedBlanksSeasonal] = useState<optionObject[]>([]);
	const [simplifiedOptionalsListBlanksSeasonal, setSimplifiedOptionalsListBlanksSeasonal] = useState<optionObject[]>([]);
	const [editSimplifiedOptionBlanksSeasonal, setEditSimplifiedOptionBlanksSeasonal] = useState<optionObject | null>(null);

	const [imageTraditionalBlanksSeasonal, setImageTraditionalBlanksSeasonal] = useState<string>('');
	const [audioTraditionalBlanksSeasonal, setAudioTraditionalBlanksSeasonal] = useState<string>('');
	const [imageTraditionalBlanksSeasonalPercentage, setImageTraditionalBlanksSeasonalPercentage] = useState<number>(0);
	const [audioTraditionalBlanksSeasonalPercentage, setAudioTraditionalBlanksSeasonalPercentage] = useState<number>(0);
	const [optionAudioTraditionalBlanksSeasonal, setOptionAudioTraditionalBlanksSeasonal] = useState<string>('');
	const [optionAudioTraditionalBlanksSeasonalPercentage, setOptionAudioTraditionalBlanksSeasonalPercentage] = useState<number>(0);

	const [traditionalOptionalsListBlanksSeasonal, setTraditionalOptionalsListBlanksSeasonal] = useState<optionObject[]>([]);
	const [editTraditionalOptionBlanksSeasonal, setEditTraditionalOptionBlanksSeasonal] = useState<optionObject | null>(null);
	const [correctAnswerTraditionalBlanksSeasonal, setCorrectAnswerTraditionalBlanksSeasonal] = useState<optionObject[]>([]);
	const [traditionalCompleteActivityAudioBlanksSeasonal, setTraditionalCompleteActivityAudioBlanksSeasonal] = useState<number>(0);
	const [simplifiedCompleteActivityAudioBlanksSeasonal, setSimplifiedCompleteActivityAudioBlanksSeasonal] = useState<number>(0);

	const updatePercentageBlanksSeasonal = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.imageSimplified:
				setImageSimplifiedBlanksSeasonalPercentage(newPercentage);
				break;
			case FieldNames.imageTraditional:
				setImageTraditionalBlanksSeasonalPercentage(newPercentage);
				break;
			case FieldNames.optionAudioSimplified:
				setOptionAudioSimplifiedBlanksSeasonalPercent(newPercentage);
				break;
			case FieldNames.optionAudioTraditional:
				setOptionAudioTraditionalBlanksSeasonalPercentage(newPercentage);
				break;
			case FieldNames.audioSimplified:
				setAudioSimplifiedBlanksSeasonalPercentage(newPercentage);
				break;
			case FieldNames.audioTraditional:
				setAudioTraditionalBlanksSeasonalPercentage(newPercentage);
				break;
			case FieldNames.traditionalCompleteActivityAudio:
				setTraditionalCompleteActivityAudioBlanksSeasonal(newPercentage);
				break;
			case FieldNames.simplifiedCompleteActivityAudio:
				setSimplifiedCompleteActivityAudioBlanksSeasonal(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidBlanksSeasonal = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdate = !(isPercentageValidBlanksSeasonal(imageSimplifiedBlanksSeasonalPercentage) && isPercentageValidBlanksSeasonal(imageTraditionalBlanksSeasonalPercentage) && isPercentageValidBlanksSeasonal(audioSimplifiedBlanksSeasonalPercentage) && isPercentageValidBlanksSeasonal(audioTraditionalBlanksSeasonalPercentage) && isPercentageValidBlanksSeasonal(optionAudioSimplifiedBlanksSeasonalPercent) && isPercentageValidBlanksSeasonal(optionAudioTraditionalBlanksSeasonalPercentage) && isPercentageValidBlanksSeasonal(traditionalCompleteActivityAudioBlanksSeasonal) && isPercentageValidBlanksSeasonal(simplifiedCompleteActivityAudioBlanksSeasonal));

	/**
	 *@returns Method used for setValue from activity data and get the details of activity by uuid
	 */
	useEffect(() => {
		if (params.activityId) {
			setLoadingBlanksSeasonal(true);
			APIService.getData(`${url}/${activityPaths.fillBlanks}/${params.activityId}?${activityPaths.isForSeasonal}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const responseData = response.data.data.activityData;
						const toggle = response.data.data.toggle;
						toggleSeasonalActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);
						setImageTraditionalBlanksSeasonal(responseData.traditionalImageUrl);
						setAudioTraditionalBlanksSeasonal(responseData.traditionalQuestionAudioUrl);
						setTraditionalOptionalsListBlanksSeasonal(responseData.traditionalOptions);
						setCorrectAnswerTraditionalBlanksSeasonal(responseData.traditionalAnswer);
						formik.setFieldValue(FieldNames.traditionalQuestionChinese, responseData.traditionalQuestionsChinese);
						setImageSimplifiedBlanksSeasonal(responseData.simplifiedImageUrl);
						setAudioSimplifiedBlanksSeasonal(responseData.simplifiedQuestionAudioUrl);
						setSimplifiedOptionalsListBlanksSeasonal(responseData.simplifiedOptions);
						setCorrectAnswerSimplifiedBlanksSeasonal(responseData.simplifiedAnswer);
						formik.setFieldValue(FieldNames.simplifiedQuestionChinese, responseData.simplifiedQuestionsChinese);
						setSkipButtonCheckedBlanksSeasonal(response.data.data.isSkippable);
						formik.setFieldValue(FieldNames.title, response.data.data.title);
						formik.setFieldValue(FieldNames.traditionalCompleteActivityAudio, responseData.traditionalCompleteActivityAudio);
						formik.setFieldValue(FieldNames.simplifiedCompleteActivityAudio, responseData.simplifiedCompleteActivityAudio);
					} else {
						toast.error(response?.data?.message);
					}
					setLoadingBlanksSeasonal(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingBlanksSeasonal(false);
				});
		}
	}, []);

	useEffect(() => {
		if (editTraditionalOptionBlanksSeasonal) {
			formik.setFieldValue(FieldNames.optionTraditional, editTraditionalOptionBlanksSeasonal.optionValue);
			setOptionAudioTraditionalBlanksSeasonal(editTraditionalOptionBlanksSeasonal?.optionFileUrl);
		}
	}, [editTraditionalOptionBlanksSeasonal]);

	useEffect(() => {
		if (editSimplifiedOptionBlanksSeasonal) {
			formik.setFieldValue(FieldNames.optionSimplified, editSimplifiedOptionBlanksSeasonal?.optionValue);
			setOptionAudioSimplifiedBlanksSeasonal(editSimplifiedOptionBlanksSeasonal?.optionFileUrl);
		}
	}, [editSimplifiedOptionBlanksSeasonal]);

	const initialValues: CreateFillBlanksActivity = {
		topicId: params.topicId as string,
		lessonId: params.lessonId as string,
		activityTypeId: activityUuid,
		title: '',
		simplifiedQuestionChinese: [defaultTraditionalFieldBlanksSeasonal],
		traditionalQuestionChinese: [defaultSimplifiedFieldBlanksSeasonal],
		imageSimplified: null,
		imageTraditional: null,
		audioSimplified: null,
		audioTraditional: null,
		optionSimplified: '',
		optionTraditional: '',
		optionAudioSimplified: null,
		optionAudioTraditional: null,
		correctAnswerSimplified: '',
		correctAnswerTraditional: '',
		correctAnswerAudioSimplified: null,
		correctAnswerAudioTraditional: null,
		simplifiedCompleteActivityAudio: '',
		traditionalCompleteActivityAudio: '',
		isSkippable: false,
	};

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */

	const handleFileUploadBlanksSeasonal = (event: React.ChangeEvent<HTMLInputElement>, type: string, fileName: string) => {
		const fileBlanksSeasonal = event.target.files?.[0] as File;
		typeValidation(fileBlanksSeasonal, type);
		const lastIndex = fileBlanksSeasonal?.name?.lastIndexOf('.');
		const extension = fileBlanksSeasonal?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileBlanksSeasonal);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptions = {
					fileName: name,
					file: fileBlanksSeasonal,
					isForSeasonal: true,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(imageUploaderOptions, updatePercentageBlanksSeasonal);
				uploader.start();
				switch (fileName) {
					case FieldNames.imageSimplified:
						formik.setFieldValue(FieldNames.imageSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanksSeasonal(false);
							setImageSimplifiedBlanksSeasonal(response);
						});
						break;
					case FieldNames.imageTraditional:
						formik.setFieldValue(FieldNames.imageTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanksSeasonal(false);
							setImageTraditionalBlanksSeasonal(response);
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
			const blob = URL.createObjectURL(fileBlanksSeasonal);
			audio.src = blob;
			audio.addEventListener('loadedmetadata', () => {
				const audioUploaderOptions = {
					fileName: name,
					file: fileBlanksSeasonal,
					isForSeasonal: true,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(audioUploaderOptions, updatePercentageBlanksSeasonal);
				uploader.start();
				switch (fileName) {
					case FieldNames.audioSimplified:
						formik.setFieldValue(FieldNames.audioSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanksSeasonal(false);
							setAudioSimplifiedBlanksSeasonal(response);
						});
						break;
					case FieldNames.optionAudioSimplified:
						formik.setFieldValue(FieldNames.optionAudioSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanksSeasonal(false);
							setOptionAudioSimplifiedBlanksSeasonal(response);
						});
						break;
					case FieldNames.audioTraditional:
						formik.setFieldValue(FieldNames.audioTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanksSeasonal(false);
							setAudioTraditionalBlanksSeasonal(response);
						});
						break;
					case FieldNames.optionAudioTraditional:
						formik.setFieldValue(FieldNames.optionAudioTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanksSeasonal(false);
							setOptionAudioTraditionalBlanksSeasonal(response);
						});
						break;
					case FieldNames.traditionalCompleteActivityAudio:
						uploader.onComplete((response: string) => {
							setLoadingBlanksSeasonal(false);
							formik.setFieldValue(FieldNames.traditionalCompleteActivityAudio, response);
						});
						break;
					case FieldNames.simplifiedCompleteActivityAudio:
						uploader.onComplete((response: string) => {
							setLoadingBlanksSeasonal(false);
							formik.setFieldValue(FieldNames.simplifiedCompleteActivityAudio, response);
						});
						break;
					default:
						break;
				}
			});
		}
	};

	const fileUpdateBlanksSeasonal = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileName = event.target.name;
		handleFileUploadBlanksSeasonal(event, type, fileName);
	}, []);

	/**
	 *
	 * @returns Method used for get validation for add/edit activity
	 */
	const getObjBlanksSeasonal = () => {
		const obj: ObjectShape = {
			[FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
			[FieldNames.imageSimplified]: imageSimplifiedBlanksSeasonal ? mixedNotRequired() : mixedRequired(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.audioSimplified]: audioSimplifiedBlanksSeasonal ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.optionSimplified]: simplifiedOptionalsListBlanksSeasonal.length ? stringNotRequired() : stringTrim(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioSimplified]: simplifiedOptionalsListBlanksSeasonal.length ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.imageTraditional]: imageTraditionalBlanksSeasonal ? mixedNotRequired() : mixedRequired(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.audioTraditional]: audioTraditionalBlanksSeasonal ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.optionTraditional]: traditionalOptionalsListBlanksSeasonal.length ? stringNotRequired() : stringTrim(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioTraditional]: traditionalOptionalsListBlanksSeasonal.length ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.simplifiedQuestionChinese]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: stringTrim(Errors.PLEASE_ENTER_QUESTION),
					[FieldNames.english]: stringNoSpecialChar(Errors.PLEASE_ENTER_QUESTION),
					[FieldNames.pinyin]: stringRequired(Errors.PLEASE_ENTER_QUESTION),
				})
			),
			[FieldNames.traditionalCompleteActivityAudio]: mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.traditionalQuestionChinese]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: stringTrim(Errors.PLEASE_ENTER_QUESTION),
					[FieldNames.english]: stringNoSpecialChar(Errors.PLEASE_ENTER_QUESTION),
					[FieldNames.pinyin]: stringRequired(Errors.PLEASE_ENTER_QUESTION),
				})
			),
			[FieldNames.simplifiedCompleteActivityAudio]: mixedRequired(Errors.AUDIO_IS_REQUIRED),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObjBlanksSeasonal();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updatedData: FillInTheBlanksActivitySubmitData = {
				isMoving: isMoving,
				topicId: moveData(isMoving, topicId as string, values.topicId as string),
				lessonId: moveData(isMoving, lessonId as string, values.lessonId as string),
				title: values.title.trim(),

				traditionalQuestionsChinese: formik.values.traditionalQuestionChinese.map((item) => {
					return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim() };
				}),
				traditionalQuestionAudioUrl: audioTraditionalBlanksSeasonal.split('/').pop() as string,
				traditionalCompleteActivityAudio: values.traditionalCompleteActivityAudio?.split('/').pop() as string,
				simplifiedCompleteActivityAudio: values.simplifiedCompleteActivityAudio?.split('/').pop() as string,
				traditionalImageUrl: imageTraditionalBlanksSeasonal.split('/').pop() as string,
				traditionalAnswer: correctAnswerTraditionalBlanksSeasonal,
				traditionalCorrectAnswer: correctAnswerTraditionalBlanksSeasonal.map((item) => item.optionValue)?.join(' '),
				traditionalOptions: traditionalOptionalsListBlanksSeasonal.map(({ optionFileUrl, ...rest }) => ({
					optionFileUrl: optionFileUrl.split('/').pop() as string,
					...rest,
				})),

				simplifiedQuestionsChinese: formik.values.simplifiedQuestionChinese.map((item) => {
					return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim() };
				}),
				simplifiedQuestionAudioUrl: audioSimplifiedBlanksSeasonal.split('/').pop() as string,
				simplifiedImageUrl: imageSimplifiedBlanksSeasonal.split('/').pop() as string,
				simplifiedAnswer: correctAnswerSimplifiedBlanksSeasonal,
				simplifiedCorrectAnswer: correctAnswerSimplifiedBlanksSeasonal.map((item) => item.optionValue)?.join(' '),
				simplifiedOptions: simplifiedOptionalsListBlanksSeasonal.map(({ optionFileUrl, ...rest }) => ({
					optionFileUrl: optionFileUrl.split('/').pop() as string,
					...rest,
				})),

				isSkippable: skipButtonCheckedBlanksSeasonal,
				isForSeasonal: true,
			};
			if (correctAnswerSimplifiedBlanksSeasonal.length && correctAnswerTraditionalBlanksSeasonal.length) {
				if (params.activityId) {
					setLoadingBlanksSeasonal(true);
					APIService.putData(`${url}/${activityPaths.fillBlanks}/${params.activityId}?${activityPaths.isForSeasonal}`, {
						...updatedData,
					})
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingBlanksSeasonal(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingBlanksSeasonal(false);
						});
				} else {
					setLoadingBlanksSeasonal(true);
					APIService.postData(`${url}/${activityPaths.fillBlanks}?${activityPaths.isForSeasonal}`, {
						...updatedData,
						activityTypeId: activityUuid,
					})
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingBlanksSeasonal(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingBlanksSeasonal(false);
						});
				}
			} else {
				checkCorrectAnswerBlanksSeasonal();
			}
		},
	});

	const simplifiedOptionsDataBlanksSeasonal = () => {
		setSimplifiedOptionalsListBlanksSeasonal((prev) => {
			const updatedData = prev?.map((item) => {
				if (item.optionId === editSimplifiedOptionBlanksSeasonal?.optionId) {
					const newData = {
						optionId: editSimplifiedOptionBlanksSeasonal?.optionId,
						optionValue: formik.values.optionSimplified,
						optionFileUrl: optionAudioSimplifiedBlanksSeasonal,
					};
					return { ...item, ...newData };
				} else {
					return item;
				}
			});
			if (!editSimplifiedOptionBlanksSeasonal) {
				updatedData?.push({
					optionId: generateUuid(),
					optionValue: formik.values.optionSimplified,
					optionFileUrl: optionAudioSimplifiedBlanksSeasonal,
				});
			}
			return updatedData;
		});
	};

	const addMoreOptionSimplifiedBlanksSeasonal = useCallback(() => {
		if (simplifiedOptionalsListBlanksSeasonal.length > OPTION_LIMIT && !editSimplifiedOptionBlanksSeasonal) {
			return toast.error(Errors.MAX_OPTION);
		}
		if (formik.values.optionSimplified.trim() && optionAudioSimplifiedBlanksSeasonal) {
			simplifiedOptionsDataBlanksSeasonal();
			setOptionAudioSimplifiedBlanksSeasonal('');
			formik.setFieldValue(FieldNames.optionSimplified, '');
			formik.setFieldValue(FieldNames.optionAudioSimplified, '');
			resetInputManually([FieldNames.optionAudioSimplified]);
			setEditSimplifiedOptionBlanksSeasonal(null);
			validateFormBlanksSeasonal();
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
	}, [simplifiedOptionalsListBlanksSeasonal, editSimplifiedOptionBlanksSeasonal, formik, optionAudioSimplifiedBlanksSeasonal, correctAnswerSimplifiedBlanksSeasonal]);

	const traditionalOptionsDataBlanksSeasonal = () => {
		setTraditionalOptionalsListBlanksSeasonal((prev) => {
			const updatedData = prev?.map((item) => {
				if (item.optionId === editTraditionalOptionBlanksSeasonal?.optionId) {
					const newData = {
						optionId: editTraditionalOptionBlanksSeasonal?.optionId,
						optionValue: formik.values.optionTraditional,
						optionFileUrl: optionAudioTraditionalBlanksSeasonal,
					};
					return { ...item, ...newData };
				} else {
					return item;
				}
			});
			if (!editTraditionalOptionBlanksSeasonal) {
				updatedData?.push({
					optionId: generateUuid(),
					optionValue: formik.values.optionTraditional,
					optionFileUrl: optionAudioTraditionalBlanksSeasonal,
				});
			}
			return updatedData;
		});
	};

	const addMoreOptionTraditionalBlanksSeasonal = useCallback(() => {
		if (traditionalOptionalsListBlanksSeasonal.length > OPTION_LIMIT && !editTraditionalOptionBlanksSeasonal) {
			return toast.error(Errors.MAX_OPTION);
		}
		if (formik.values.optionTraditional.trim() && optionAudioTraditionalBlanksSeasonal) {
			traditionalOptionsDataBlanksSeasonal();
			setOptionAudioTraditionalBlanksSeasonal('');
			formik.setFieldValue(FieldNames.optionTraditional, '');
			formik.setFieldValue(FieldNames.optionAudioTraditional, '');
			resetInputManually([FieldNames.optionAudioTraditional]);
			setEditTraditionalOptionBlanksSeasonal(null);
			validateFormBlanksSeasonal();
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
	}, [traditionalOptionalsListBlanksSeasonal, editTraditionalOptionBlanksSeasonal, formik, optionAudioTraditionalBlanksSeasonal, correctAnswerTraditionalBlanksSeasonal]);

	const validateFormBlanksSeasonal = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 500);
	};
	const traditionalData = () => {
		if (formik.values.traditionalQuestionChinese.length === 1) {
			const traditional = formik.values.traditionalQuestionChinese[0];
			const simplified = formik.values.simplifiedQuestionChinese[0];

			if (traditional.chinese.trim() !== '' && traditional.english.trim() !== '' && traditional.pinyin.trim() !== '') {
				return formik.values.traditionalQuestionChinese.map((item, index) => ({
					...item,
					chinese: translateText(item.chinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
						formik.setFieldValue(`simplifiedQuestionChinese[${index}].chinese`, data ?? data);
						formik.setFieldValue(`simplifiedQuestionChinese[${index}].pinyin`, data ?? data);
					}),
				}));
			} else {
				return [{ [FieldNames.chinese]: simplified.chinese, [FieldNames.english]: simplified.english, [FieldNames.pinyin]: simplified.pinyin }];
			}
		} else {
			return formik.values.traditionalQuestionChinese.map((item, index) => ({
				...item,
				chinese: translateText(item.chinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
					formik.setFieldValue(`simplifiedQuestionChinese[${index}].chinese`, data ?? data);
					formik.setFieldValue(`simplifiedQuestionChinese[${index}].pinyin`, data ?? data);
				}),
			}));
		}
	};
	const copyDataBlanksSeasonal = useCallback(async () => {
		const traditionalBlanksOptionsTranslateSeasonal = await Promise.all(
			traditionalOptionalsListBlanksSeasonal.map(async (item) => {
				return {
					...item,
					optionValue: await translateText(item.optionValue, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data: string) => {
						return data ?? data;
					}),
				};
			})
		);
		if (imageTraditionalBlanksSeasonal !== '') {
			setImageSimplifiedBlanksSeasonal(imageTraditionalBlanksSeasonal);
			formik.setFieldValue(FieldNames.imageSimplified, formik.values.imageTraditional);
		}
		if (audioTraditionalBlanksSeasonal !== '') {
			formik.setFieldValue(FieldNames.audioSimplified, formik.values.audioTraditional);
			setAudioSimplifiedBlanksSeasonal(audioTraditionalBlanksSeasonal);
		}
		formik.values.traditionalCompleteActivityAudio && formik.setFieldValue(FieldNames.simplifiedCompleteActivityAudio, formik.values.traditionalCompleteActivityAudio);
		setCorrectAnswerSimplifiedBlanksSeasonal(correctAnswerTraditionalBlanksSeasonal);
		setSimplifiedOptionalsListBlanksSeasonal(traditionalBlanksOptionsTranslateSeasonal);
		formik.setFieldValue(FieldNames.simplifiedQuestionChinese, traditionalData());
		validateFormBlanksSeasonal();
	}, [formik]);

	const getErrorBlanksSeasonal = (fieldName: keyof CreateFillBlanksActivity) => {
		if (fieldName !== FieldNames.traditionalQuestionChinese && fieldName !== FieldNames.simplifiedQuestionChinese) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};

	const translateTraditionalFieldBlanksSeasonal = useCallback(
		(index: number) => {
			translateText(formik.values.traditionalQuestionChinese[index].chinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
				// traditional to english
				formik.setFieldValue(`traditionalQuestionChinese[${index}].english`, data ?? data);
				formik.setFieldValue(`traditionalQuestionChinese[${index}].pinyin`, formik.values.traditionalQuestionChinese[index].chinese);
			});
		},
		[formik]
	);

	const translateSimplifiedFieldBlanksSeasonal = useCallback(
		(index: number) => {
			translateText(formik.values.simplifiedQuestionChinese[index].chinese, ENGLISH_CODE, SIMPLIFIED_CHINESE_CODE).then((data) => {
				// Simplified to english
				formik.setFieldValue(`simplifiedQuestionChinese[${index}].english`, data ?? data);
				formik.setFieldValue(`simplifiedQuestionChinese[${index}].pinyin`, formik.values.simplifiedQuestionChinese[index].chinese);
			});
		},
		[formik]
	);

	const audioUploadBlanksSeasonal = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateBlanksSeasonal(e, fileTypeEnum.audio);
	}, []);

	const imageUploadBlanksSeasonal = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateBlanksSeasonal(e, fileTypeEnum.image);
	}, []);

	const addMoreTraditionalQuestionBlanksSeasonal = useCallback(() => {
		formik.setFieldValue('traditionalQuestionChinese', [...formik.values.traditionalQuestionChinese, { chinese: '', english: '', pinyin: '' }]);
	}, [formik]);

	const addMoreSimplifiedQuestionBlanksSeasonal = useCallback(() => {
		formik.setFieldValue('simplifiedQuestionChinese', [...formik.values.simplifiedQuestionChinese, { chinese: '', english: '', pinyin: '' }]);
	}, [formik]);

	const editTraditionalRecordBlanksSeasonal = useCallback((data: optionObject) => {
		setEditTraditionalOptionBlanksSeasonal(data);
	}, []);

	const deleteTraditionalRecordBlanksSeasonal = useCallback(
		(data: optionObject) => {
			setTraditionalOptionalsListBlanksSeasonal(traditionalOptionalsListBlanksSeasonal?.filter((item) => item.optionId !== data.optionId));
		},
		[traditionalOptionalsListBlanksSeasonal, correctAnswerTraditionalBlanksSeasonal]
	);

	const editSimplifiedRecordBlanksSeasonal = useCallback((data: optionObject) => {
		setEditSimplifiedOptionBlanksSeasonal(data);
	}, []);

	const deleteSimplifiedRecordBlanksSeasonal = useCallback(
		(data: optionObject) => {
			setSimplifiedOptionalsListBlanksSeasonal(simplifiedOptionalsListBlanksSeasonal?.filter((item) => item.optionId !== data.optionId));
		},
		[simplifiedOptionalsListBlanksSeasonal, correctAnswerSimplifiedBlanksSeasonal]
	);

	/**
	 * method is used to update simplified correctAnswer after edit
	 */
	useEffect(() => {
		const updatedCorrectAnswers = correctAnswerSimplifiedBlanksSeasonal?.map((item) => {
			const data = simplifiedOptionalsListBlanksSeasonal?.filter((data) => data.optionId === item.optionId);
			return { optionId: data[0].optionId, optionValue: data[0].optionValue, optionFileUrl: data[0].optionFileUrl };
		});
		setCorrectAnswerSimplifiedBlanksSeasonal(updatedCorrectAnswers);
	}, [simplifiedOptionalsListBlanksSeasonal]);

	/**
	 * method is used to update traditional correctAnswer after edit
	 */
	useEffect(() => {
		const updatedCorrectAnswers = correctAnswerTraditionalBlanksSeasonal?.map((item) => {
			const data = traditionalOptionalsListBlanksSeasonal?.filter((data) => data.optionId === item.optionId);
			return { optionId: data[0].optionId, optionValue: data[0].optionValue, optionFileUrl: data[0].optionFileUrl };
		});
		setCorrectAnswerTraditionalBlanksSeasonal(updatedCorrectAnswers);
	}, [traditionalOptionalsListBlanksSeasonal]);

	const checkCorrectAnswerBlanksSeasonal = () => {
		!correctAnswerSimplifiedBlanksSeasonal.length && toast.error(Errors.PLEASE_SELECT_CORRECT_ANSWER_SIMPLIFIED);
		!correctAnswerTraditionalBlanksSeasonal.length && toast.error(Errors.PLEASE_SELECT_CORRECT_ANSWER_TRADITIONAL);
	};

	return (
		<div>
			<FormikProvider value={formik}>
				<form className='w-full' onSubmit={formik.handleSubmit}>
					{loadingBlanksSeasonal && <Loader />}
					<div className='mb-3'>
						<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorBlanksSeasonal(FieldNames.title)} required />
					</div>
					<div className='flex flex-col md:flex-row gap-3 mb-4'>
						<div className='rounded border w-full'>
							<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Traditional Chinese</h6>
							<div className='grid grid-cols-2 gap-x-4 p-3'>
								<div className='font-medium'>
									Add Question <span className='text-error'>*</span>
								</div>
								<FieldArray
									name={FieldNames.traditionalQuestionChinese}
									render={useCallback(
										(arrayHelpers: MyArrayHelpers) => (
											<div className='mb-4 col-span-2'>
												{formik.values.traditionalQuestionChinese?.map((_, index) => {
													const chineseTraditionalBlanksSeasonal = `traditionalQuestionChinese[${index}].chinese`;
													const englishTraditionalBlanksSeasonal = `traditionalQuestionChinese[${index}].english`;
													const pinyinTraditionalBlanksSeasonal = `traditionalQuestionChinese[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-1 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseTraditionalBlanksSeasonal} onChange={formik.handleChange} label='Chinese' value={formik.values.traditionalQuestionChinese[index].chinese} error={getIn(formik.touched, chineseTraditionalBlanksSeasonal) && getIn(formik.errors, chineseTraditionalBlanksSeasonal) ? getIn(formik.errors, chineseTraditionalBlanksSeasonal) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateTraditionalFieldBlanksSeasonal} isTranslate={true} title='Translate' />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question english' name={englishTraditionalBlanksSeasonal} onChange={formik.handleChange} label='English' value={formik.values.traditionalQuestionChinese[index].english} error={getIn(formik.touched, englishTraditionalBlanksSeasonal) && getIn(formik.errors, englishTraditionalBlanksSeasonal) ? getIn(formik.errors, englishTraditionalBlanksSeasonal) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinTraditionalBlanksSeasonal} onChange={formik.handleChange} label='Pinyin' value={formik.values.traditionalQuestionChinese[index].pinyin} error={getIn(formik.touched, pinyinTraditionalBlanksSeasonal) && getIn(formik.errors, pinyinTraditionalBlanksSeasonal) ? getIn(formik.errors, pinyinTraditionalBlanksSeasonal) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.traditionalQuestionChinese.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalQuestionBlanksSeasonal}>
													<Plus className='mr-3' /> Add More
												</Button>
											</div>
										),
										[formik]
									)}
								/>
								<div className='mb-4'>
									<FileUpload labelName='Question Audio' id={FieldNames.audioTraditional} imageSource={audioTraditionalBlanksSeasonal} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.audioTraditional} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanksSeasonal} error={getErrorBlanksSeasonal(FieldNames.audioTraditional) as string} />
									{!isPercentageValidBlanksSeasonal(audioTraditionalBlanksSeasonalPercentage) && <LoadingPercentage percentage={audioTraditionalBlanksSeasonalPercentage} />}
								</div>
								<div className='mb-4'>
									<FileUpload labelName='Image' id={FieldNames.imageTraditional} imageSource={imageTraditionalBlanksSeasonal} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} name={FieldNames.imageTraditional} acceptNote={IMAGE_NOTE} uploadType={FILE_TYPE.jpegType || FILE_TYPE.jpgType || FILE_TYPE.pngType} onChange={imageUploadBlanksSeasonal} error={getErrorBlanksSeasonal(FieldNames.imageTraditional) as string} />
									{!isPercentageValidBlanksSeasonal(imageTraditionalBlanksSeasonalPercentage) && <LoadingPercentage percentage={imageTraditionalBlanksSeasonalPercentage} />}
								</div>
								<h6 className='font-medium mb-2 col-span-2 '>Options</h6>

								<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
									<div className='mb-4 col-span-2'>
										<TextInput placeholder='option' name={FieldNames.optionTraditional} onChange={formik.handleChange} label='Option' value={formik.values.optionTraditional} error={getErrorBlanksSeasonal(FieldNames.optionTraditional)} required />
									</div>
									<div className='mb-4 col-span-3'>
										<FileUpload labelName='Audio' id={FieldNames.optionAudioTraditional} imageSource={optionAudioTraditionalBlanksSeasonal} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.optionAudioTraditional} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanksSeasonal} error={getErrorBlanksSeasonal(FieldNames.optionAudioTraditional) as string} />
										{!isPercentageValidBlanksSeasonal(optionAudioTraditionalBlanksSeasonalPercentage) && <LoadingPercentage percentage={optionAudioTraditionalBlanksSeasonalPercentage} />}
									</div>
									<div className=' flex items-center'>
										<Button className='btn-primary rounded-full' onClick={addMoreOptionTraditionalBlanksSeasonal}>
											{editTraditionalOptionBlanksSeasonal ? 'Update' : 'Add'}
										</Button>
									</div>
								</div>

								<div className='mb-4 col-span-2 overflow-auto'>
									<table className='w-full col-span-full'>
										<thead>
											<tr>
												<th>SR.No</th>
												<th>Option</th>
												<th>Audio</th>
												<th>Answer</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
											{traditionalOptionalsListBlanksSeasonal.map((item, index) => (
												<tr key={item.optionId}>
													<td className='w-10 text-center'>{index + 1}</td>
													<td className='w-24 font-medium'>{item.optionValue}</td>
													<td className='w-44'>
														<audio src={item.optionFileUrl} controls className='mb-3'>
															<track kind='captions' />
														</audio>
													</td>
													<td className='w-10 text-center'>
														<CheckBox
															option={[
																{
																	value: '',
																	checked: correctAnswerTraditionalBlanksSeasonal.some((item1) => item.optionId === item1.optionId),
																	name: '',
																	onChange() {
																		const existingIndex = correctAnswerTraditionalBlanksSeasonal.findIndex((data) => item.optionId === data.optionId);
																		if (existingIndex !== -1) {
																			// If the item exists, remove it
																			const updatedItems = correctAnswerTraditionalBlanksSeasonal.filter((item1) => item.optionId !== item1.optionId);
																			setCorrectAnswerTraditionalBlanksSeasonal(updatedItems);
																		} else {
																			// If the item doesn't exist, add it
																			const updatedItems = [...correctAnswerTraditionalBlanksSeasonal, { optionId: item.optionId, optionValue: item.optionValue, optionFileUrl: item.optionFileUrl }];
																			setCorrectAnswerTraditionalBlanksSeasonal(updatedItems);
																		}
																		validateFormBlanksSeasonal();
																	},
																},
															]}
															disabled={editTraditionalOptionBlanksSeasonal?.optionId == item.optionId}
														/>
													</td>
													<td className='w-28'>
														<div className='flex gap-3'>
															<EditButton data={item} editRecord={editTraditionalRecordBlanksSeasonal} buttonSuccess={true} disable={editTraditionalOptionBlanksSeasonal?.optionId === item.optionId} />
															<DeleteButton data={item} isDeleteStatusModal={deleteTraditionalRecordBlanksSeasonal} btnDanger={true} disable={editTraditionalOptionBlanksSeasonal?.optionId === item.optionId || correctAnswerTraditionalBlanksSeasonal.some((item1) => item.optionId === item1.optionId)} />
														</div>
													</td>
												</tr>
											))}

											{!traditionalOptionalsListBlanksSeasonal.length && (
												<tr>
													<td colSpan={10} className='text-center font-medium py-5 text-gray-400'>
														No Data Added
													</td>
												</tr>
											)}
										</tbody>
									</table>
									<div>
										{correctAnswerTraditionalBlanksSeasonal?.length !== 0 && (
											<span>
												Correct Answer : <span className='font-medium'>{correctAnswerTraditionalBlanksSeasonal.map((item) => item.optionValue)?.join(' ')}</span>
											</span>
										)}
									</div>
								</div>
								<div className='mb-4 col-span-2'>
									<FileUpload labelName='Complete Activity Audio With Answers' id={FieldNames.traditionalCompleteActivityAudio} imageSource={formik.values.traditionalCompleteActivityAudio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.traditionalCompleteActivityAudio} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanksSeasonal} error={getErrorBlanksSeasonal(FieldNames.traditionalCompleteActivityAudio) as string} />
									{!isPercentageValidBlanksSeasonal(traditionalCompleteActivityAudioBlanksSeasonal) && <LoadingPercentage percentage={traditionalCompleteActivityAudioBlanksSeasonal} />}
								</div>
							</div>
						</div>

						<div className='flex flex-col justify-center items-center p-3'>
							<Button className='btn-default btn-large' title='Copy' onClick={copyDataBlanksSeasonal} disabled={disableUpdate}>
								<AngleRight className='text-md' />
							</Button>
							<span className='mt-1 text-gray-500'>Copy</span>
						</div>
						<div className='rounded border w-full'>
							<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Simplified Chinese</h6>

							<div className='grid grid-cols-2 gap-x-4 p-3'>
								<div className='font-medium'>
									Add Question <span className='text-error'>*</span>
								</div>
								<FieldArray
									name={FieldNames.simplifiedQuestionChinese}
									render={useCallback(
										(arrayHelpers: MyArrayHelpers) => (
											<div className='mb-4 col-span-2'>
												{formik.values.simplifiedQuestionChinese?.map((_, index) => {
													const chineseSimplifiedBlanksSeasonal = `simplifiedQuestionChinese[${index}].chinese`;
													const englishSimplifiedBlanksSeasonal = `simplifiedQuestionChinese[${index}].english`;
													const pinyinSimplifiedBlanksSeasonal = `simplifiedQuestionChinese[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-1 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseSimplifiedBlanksSeasonal} onChange={formik.handleChange} label='Chinese' value={formik.values.simplifiedQuestionChinese[index].chinese} error={getIn(formik.touched, chineseSimplifiedBlanksSeasonal) && getIn(formik.errors, chineseSimplifiedBlanksSeasonal) ? getIn(formik.errors, chineseSimplifiedBlanksSeasonal) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateSimplifiedFieldBlanksSeasonal} isTranslate={true} title='Translate' />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question english' name={englishSimplifiedBlanksSeasonal} onChange={formik.handleChange} label='English' value={formik.values.simplifiedQuestionChinese[index].english} error={getIn(formik.touched, englishSimplifiedBlanksSeasonal) && getIn(formik.errors, englishSimplifiedBlanksSeasonal) ? getIn(formik.errors, englishSimplifiedBlanksSeasonal) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinSimplifiedBlanksSeasonal} onChange={formik.handleChange} label='Pinyin' value={formik.values.simplifiedQuestionChinese[index].pinyin} error={getIn(formik.touched, pinyinSimplifiedBlanksSeasonal) && getIn(formik.errors, pinyinSimplifiedBlanksSeasonal) ? getIn(formik.errors, pinyinSimplifiedBlanksSeasonal) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.simplifiedQuestionChinese.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedQuestionBlanksSeasonal}>
													<Plus className='mr-3' /> Add More
												</Button>
											</div>
										),
										[formik]
									)}
								/>
								<div className='mb-4'>
									<FileUpload labelName='Question Audio' id={FieldNames.audioSimplified} imageSource={audioSimplifiedBlanksSeasonal} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.audioSimplified} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanksSeasonal} error={getErrorBlanksSeasonal(FieldNames.audioSimplified) as string} />
									{!isPercentageValidBlanksSeasonal(audioSimplifiedBlanksSeasonalPercentage) && <LoadingPercentage percentage={audioSimplifiedBlanksSeasonalPercentage} />}
								</div>
								<div className='mb-4'>
									<FileUpload labelName='Image' id={FieldNames.imageSimplified} imageSource={imageSimplifiedBlanksSeasonal} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} name={FieldNames.imageSimplified} acceptNote={IMAGE_NOTE} uploadType={FILE_TYPE.jpegType || FILE_TYPE.jpgType || FILE_TYPE.pngType} onChange={imageUploadBlanksSeasonal} error={getErrorBlanksSeasonal(FieldNames.imageSimplified) as string} />
									{!isPercentageValidBlanksSeasonal(imageSimplifiedBlanksSeasonalPercentage) && <LoadingPercentage percentage={imageSimplifiedBlanksSeasonalPercentage} />}
								</div>
								<h6 className='font-medium mb-2 col-span-2 '>Options</h6>
								<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
									<div className='mb-4 col-span-2'>
										<TextInput placeholder='option' name={FieldNames.optionSimplified} onChange={formik.handleChange} label='Option' value={formik.values.optionSimplified} error={getErrorBlanksSeasonal(FieldNames.optionSimplified)} required />
									</div>
									<div className='mb-4 col-span-3'>
										<FileUpload labelName='Audio' id={FieldNames.optionAudioSimplified} imageSource={optionAudioSimplifiedBlanksSeasonal} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.optionAudioSimplified} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanksSeasonal} error={getErrorBlanksSeasonal(FieldNames.optionAudioSimplified) as string} />
										{!isPercentageValidBlanksSeasonal(optionAudioSimplifiedBlanksSeasonalPercent) && <LoadingPercentage percentage={optionAudioSimplifiedBlanksSeasonalPercent} />}
									</div>
									<div className='flex items-center'>
										<Button className='btn-primary rounded-full' onClick={addMoreOptionSimplifiedBlanksSeasonal} disabled={!isPercentageValidBlanksSeasonal(optionAudioSimplifiedBlanksSeasonalPercent)}>
											{editSimplifiedOptionBlanksSeasonal ? 'Update' : 'Add'}
										</Button>
									</div>
								</div>

								<div className='mb-4 col-span-2 overflow-auto'>
									<table className='w-full col-span-full'>
										<thead>
											<tr>
												<th>SR.No</th>
												<th>Option</th>
												<th>Audio</th>
												<th>Answer</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
											{simplifiedOptionalsListBlanksSeasonal.map((item, index) => (
												<tr key={item.optionId}>
													<td className='w-10 text-center'>{index + 1}</td>
													<td className='w-24 font-medium'>{item.optionValue}</td>

													<td className='w-44'>
														<audio src={item.optionFileUrl} controls className='mb-3'>
															<track kind='captions' />
														</audio>
													</td>
													<td className='w-10 text-center'>
														<CheckBox
															option={[
																{
																	value: '',
																	checked: correctAnswerSimplifiedBlanksSeasonal.some((item1) => item.optionId === item1.optionId),
																	name: '',
																	onChange() {
																		const existingIndex = correctAnswerSimplifiedBlanksSeasonal.findIndex((data) => item.optionId === data.optionId);
																		if (existingIndex !== -1) {
																			// If the item exists, remove it
																			const updatedItems = correctAnswerSimplifiedBlanksSeasonal.filter((item1) => item.optionId !== item1.optionId);
																			setCorrectAnswerSimplifiedBlanksSeasonal(updatedItems);
																		} else {
																			// If the item doesn't exist, add it
																			const updatedItems = [...correctAnswerSimplifiedBlanksSeasonal, { optionId: item.optionId, optionValue: item.optionValue, optionFileUrl: item.optionFileUrl }];
																			setCorrectAnswerSimplifiedBlanksSeasonal(updatedItems);
																		}
																		validateFormBlanksSeasonal();
																	},
																},
															]}
															disabled={editSimplifiedOptionBlanksSeasonal?.optionId == item.optionId}
														/>
													</td>
													<td className='w-28'>
														<div className='flex gap-3'>
															<EditButton data={item} editRecord={editSimplifiedRecordBlanksSeasonal} buttonSuccess={true} disable={editSimplifiedOptionBlanksSeasonal?.optionId === item.optionId} />
															<DeleteButton data={item} isDeleteStatusModal={deleteSimplifiedRecordBlanksSeasonal} btnDanger={true} disable={editSimplifiedOptionBlanksSeasonal?.optionId === item.optionId || correctAnswerSimplifiedBlanksSeasonal.some((item1) => item.optionId === item1.optionId)} />
														</div>
													</td>
												</tr>
											))}

											{!simplifiedOptionalsListBlanksSeasonal.length && (
												<tr>
													<td colSpan={10} className='text-center font-medium py-5 text-gray-400'>
														No Data Added
													</td>
												</tr>
											)}
										</tbody>
									</table>
									<div>
										{correctAnswerSimplifiedBlanksSeasonal?.length !== 0 && (
											<span>
												Correct Answer : <span className='font-medium'>{correctAnswerSimplifiedBlanksSeasonal.map((item) => item.optionValue)?.join(' ')}</span>
											</span>
										)}
									</div>
								</div>
								<div className='mb-4 col-span-2'>
									<FileUpload labelName='Complete Activity Audio With Answers' id={FieldNames.simplifiedCompleteActivityAudio} imageSource={formik.values.simplifiedCompleteActivityAudio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.simplifiedCompleteActivityAudio} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanksSeasonal} error={getErrorBlanksSeasonal(FieldNames.simplifiedCompleteActivityAudio) as string} />
									{!isPercentageValidBlanksSeasonal(simplifiedCompleteActivityAudioBlanksSeasonal) && <LoadingPercentage percentage={simplifiedCompleteActivityAudioBlanksSeasonal} />}
								</div>
							</div>
						</div>
					</div>

					<div className='flex justify-end gap-2 items-center'>
						<CheckBox
							option={[
								{
									value: '',
									checked: skipButtonCheckedBlanksSeasonal,
									name: 'Provide skip button for this activity',
									onChange() {
										setSkipButtonCheckedBlanksSeasonal((prev) => !prev);
									},
								},
							]}
						/>
						<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdate}>
							{params.activityId ? 'Update' : 'Save'}
						</Button>
						<Button className='btn-default btn-large w-28 justify-center' onClick={onClose}>
							Cancel
						</Button>
					</div>
				</form>
			</FormikProvider>
		</div>
	);
};

export default SeasonalActivityFillInTheBlanks;
