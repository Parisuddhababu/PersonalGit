import React, { useCallback, useEffect, useState } from 'react';
import { FieldArray, FormikProvider, getIn, useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import TextInput from '@components/textInput/TextInput';
import { AddEditActivitiesData, MyArrayHelpers } from 'src/types/activities';
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
import { generateUuid, moveData, resetInputManually, translateText, typeValidation } from '@utils/helpers';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import { Uploader } from '@views/activities/utils/upload';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import CommonButton from '@components/common/CommonButton';
import { CreateFillBlanksActivity, FillInTheBlanksActivitySubmitData, optionObject } from 'src/types/activities/fillInTheBlanks';
import { mixedNotRequired, mixedRequired, stringNoSpecialChar, stringNotRequired, stringRequired, stringTrim } from '@config/validations';

export const ActivityFillInTheBlanksSop = ({ onSubmit, onClose, url, activityUuid, toggleActivity, isMoving, levelId }: AddEditActivitiesData) => {
	const defaultTraditionalFieldBlanksSop = { chinese: '', english: '', pinyin: '' };
	const defaultSimplifiedFieldBlanksSop = { chinese: '', english: '', pinyin: '' };
	const params = useParams();
	const [loadingBlanksSop, setLoadingBlanksSop] = useState<boolean>(false);
	const [skipButtonCheckedBlanksSop, setSkipButtonCheckedBlanksSop] = useState<boolean>(false);

	const [imageSimplifiedBlanksSop, setImageSimplifiedBlanksSop] = useState<string>('');
	const [audioSimplifiedBlanksSop, setAudioSimplifiedBlanksSop] = useState<string>('');
	const [imageSimplifiedBlanksSopPercentage, setImageSimplifiedBlanksSopPercentage] = useState<number>(0);
	const [audioSimplifiedBlanksSopPercentage, setAudioSimplifiedBlanksSopPercentage] = useState<number>(0);
	const [optionAudioSimplifiedBlanksSop, setOptionAudioSimplifiedBlanksSop] = useState<string>('');
	const [optionAudioSimplifiedBlanksSopPercent, setOptionAudioSimplifiedBlanksSopPercent] = useState<number>(0);

	const [correctAnswerSimplifiedBlanksSop, setCorrectAnswerSimplifiedBlanksSop] = useState<optionObject[]>([]);
	const [simplifiedOptionalsListBlanksSop, setSimplifiedOptionalsListBlanksSop] = useState<optionObject[]>([]);
	const [editSimplifiedOptionBlanksSop, setEditSimplifiedOptionBlanksSop] = useState<optionObject | null>(null);

	const [imageTraditionalBlanksSop, setImageTraditionalBlanksSop] = useState<string>('');
	const [audioTraditionalBlanksSop, setAudioTraditionalBlanksSop] = useState<string>('');
	const [imageTraditionalBlanksSopPercentage, setImageTraditionalBlanksSopPercentage] = useState<number>(0);
	const [audioTraditionalBlanksSopPercentage, setAudioTraditionalBlanksSopPercentage] = useState<number>(0);
	const [optionAudioTraditionalBlanksSop, setOptionAudioTraditionalBlanksSop] = useState<string>('');
	const [optionAudioTraditionalBlanksSopPercentage, setOptionAudioTraditionalBlanksSopPercentage] = useState<number>(0);

	const [traditionalOptionalsListBlanksSop, setTraditionalOptionalsListBlanksSop] = useState<optionObject[]>([]);
	const [editTraditionalOptionBlanksSop, setEditTraditionalOptionBlanksSop] = useState<optionObject | null>(null);
	const [correctAnswerTraditionalBlanksSop, setCorrectAnswerTraditionalBlanksSop] = useState<optionObject[]>([]);
	const [traditionalCompleteActivityAudioBlanksSop, setTraditionalCompleteActivityAudioBlanksSop] = useState<number>(0);
	const [simplifiedCompleteActivityAudioBlanksSop, setSimplifiedCompleteActivityAudioBlanksSop] = useState<number>(0);

	const updatePercentageBlanksSop = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.imageSimplified:
				setImageSimplifiedBlanksSopPercentage(newPercentage);
				break;
			case FieldNames.imageTraditional:
				setImageTraditionalBlanksSopPercentage(newPercentage);
				break;
			case FieldNames.optionAudioSimplified:
				setOptionAudioSimplifiedBlanksSopPercent(newPercentage);
				break;
			case FieldNames.optionAudioTraditional:
				setOptionAudioTraditionalBlanksSopPercentage(newPercentage);
				break;
			case FieldNames.audioSimplified:
				setAudioSimplifiedBlanksSopPercentage(newPercentage);
				break;
			case FieldNames.audioTraditional:
				setAudioTraditionalBlanksSopPercentage(newPercentage);
				break;
			case FieldNames.traditionalCompleteActivityAudio:
				setTraditionalCompleteActivityAudioBlanksSop(newPercentage);
				break;
			case FieldNames.simplifiedCompleteActivityAudio:
				setSimplifiedCompleteActivityAudioBlanksSop(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidBlanksSop = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdateBlanksSop = !(isPercentageValidBlanksSop(imageSimplifiedBlanksSopPercentage) && isPercentageValidBlanksSop(imageTraditionalBlanksSopPercentage) && isPercentageValidBlanksSop(audioSimplifiedBlanksSopPercentage) && isPercentageValidBlanksSop(audioTraditionalBlanksSopPercentage) && isPercentageValidBlanksSop(optionAudioSimplifiedBlanksSopPercent) && isPercentageValidBlanksSop(optionAudioTraditionalBlanksSopPercentage) && isPercentageValidBlanksSop(traditionalCompleteActivityAudioBlanksSop) && isPercentageValidBlanksSop(simplifiedCompleteActivityAudioBlanksSop));

	/**
	 *@returns Method used for setValue from activity data and get the details of activity by uuid
	 */
	useEffect(() => {
		if (params.activityId) {
			setLoadingBlanksSop(true);
			APIService.getData(`${url}/${activityPaths.fillBlanks}/${params.activityId}?${activityPaths.isForSop}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const responseData = response.data.data.activityData;
						const toggle = response.data.data.toggle;
						toggleActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);
						setImageTraditionalBlanksSop(responseData.traditionalImageUrl);
						setAudioTraditionalBlanksSop(responseData.traditionalQuestionAudioUrl);
						setTraditionalOptionalsListBlanksSop(responseData.traditionalOptions);
						setCorrectAnswerTraditionalBlanksSop(responseData.traditionalAnswer);
						formik.setFieldValue(FieldNames.traditionalQuestionChinese, responseData.traditionalQuestionsChinese);
						setImageSimplifiedBlanksSop(responseData.simplifiedImageUrl);
						setAudioSimplifiedBlanksSop(responseData.simplifiedQuestionAudioUrl);
						setSimplifiedOptionalsListBlanksSop(responseData.simplifiedOptions);
						setCorrectAnswerSimplifiedBlanksSop(responseData.simplifiedAnswer);
						formik.setFieldValue(FieldNames.simplifiedQuestionChinese, responseData.simplifiedQuestionsChinese);
						setSkipButtonCheckedBlanksSop(response.data.data.isSkippable);
						formik.setFieldValue(FieldNames.title, response.data.data.title);
						formik.setFieldValue(FieldNames.traditionalCompleteActivityAudio, responseData.traditionalCompleteActivityAudio);
						formik.setFieldValue(FieldNames.simplifiedCompleteActivityAudio, responseData.simplifiedCompleteActivityAudio);
					} else {
						toast.error(response?.data?.message);
					}
					setLoadingBlanksSop(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingBlanksSop(false);
				});
		}
	}, []);

	useEffect(() => {
		if (editTraditionalOptionBlanksSop) {
			formik.setFieldValue(FieldNames.optionTraditional, editTraditionalOptionBlanksSop.optionValue);
			setOptionAudioTraditionalBlanksSop(editTraditionalOptionBlanksSop?.optionFileUrl);
		}
	}, [editTraditionalOptionBlanksSop]);

	useEffect(() => {
		if (editSimplifiedOptionBlanksSop) {
			formik.setFieldValue(FieldNames.optionSimplified, editSimplifiedOptionBlanksSop?.optionValue);
			setOptionAudioSimplifiedBlanksSop(editSimplifiedOptionBlanksSop?.optionFileUrl);
		}
	}, [editSimplifiedOptionBlanksSop]);

	const initialValues: CreateFillBlanksActivity = {
		levelId: params.levelId as string,
		activityTypeId: activityUuid,
		title: '',
		simplifiedQuestionChinese: [defaultTraditionalFieldBlanksSop],
		imageSimplified: null,
		audioSimplified: null,
		optionSimplified: '',
		optionAudioSimplified: null,
		correctAnswerSimplified: '',
		correctAnswerAudioSimplified: null,
		simplifiedCompleteActivityAudio: '',
		traditionalQuestionChinese: [defaultSimplifiedFieldBlanksSop],
		imageTraditional: null,
		audioTraditional: null,
		optionTraditional: '',
		optionAudioTraditional: null,
		correctAnswerTraditional: '',
		correctAnswerAudioTraditional: null,
		traditionalCompleteActivityAudio: '',
		isSkippable: false,
	};

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */

	const handleFileUploadBlanksSop = (event: React.ChangeEvent<HTMLInputElement>, type: string, fileName: string) => {
		const fileBlanksSop = event.target.files?.[0] as File;
		typeValidation(fileBlanksSop, type);
		const lastIndex = fileBlanksSop?.name?.lastIndexOf('.');
		const extension = fileBlanksSop?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileBlanksSop);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptions = {
					fileName: name,
					file: fileBlanksSop,
					isForSeasonal: false,
					isForSop: true,
					fieldName: fileName,
				};
				const uploader = new Uploader(imageUploaderOptions, updatePercentageBlanksSop);
				uploader.start();
				switch (fileName) {
					case FieldNames.imageSimplified:
						formik.setFieldValue(FieldNames.imageSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanksSop(false);
							setImageSimplifiedBlanksSop(response);
						});
						break;
					case FieldNames.imageTraditional:
						formik.setFieldValue(FieldNames.imageTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanksSop(false);
							setImageTraditionalBlanksSop(response);
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
			const blob = URL.createObjectURL(fileBlanksSop);
			audio.src = blob;
			audio.addEventListener('loadedmetadata', () => {
				const audioUploaderOptions = {
					fileName: name,
					file: fileBlanksSop,
					isForSeasonal: false,
					isForSop: true,
					fieldName: fileName,
				};
				const uploader = new Uploader(audioUploaderOptions, updatePercentageBlanksSop);
				uploader.start();
				switch (fileName) {
					case FieldNames.audioSimplified:
						formik.setFieldValue(FieldNames.audioSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanksSop(false);
							setAudioSimplifiedBlanksSop(response);
						});
						break;
					case FieldNames.optionAudioSimplified:
						formik.setFieldValue(FieldNames.optionAudioSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanksSop(false);
							setOptionAudioSimplifiedBlanksSop(response);
						});
						break;
					case FieldNames.audioTraditional:
						formik.setFieldValue(FieldNames.audioTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanksSop(false);
							setAudioTraditionalBlanksSop(response);
						});
						break;
					case FieldNames.optionAudioTraditional:
						formik.setFieldValue(FieldNames.optionAudioTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanksSop(false);
							setOptionAudioTraditionalBlanksSop(response);
						});
						break;
					case FieldNames.traditionalCompleteActivityAudio:
						uploader.onComplete((response: string) => {
							setLoadingBlanksSop(false);
							formik.setFieldValue(FieldNames.traditionalCompleteActivityAudio, response);
						});
						break;
					case FieldNames.simplifiedCompleteActivityAudio:
						uploader.onComplete((response: string) => {
							setLoadingBlanksSop(false);
							formik.setFieldValue(FieldNames.simplifiedCompleteActivityAudio, response);
						});
						break;
					default:
						break;
				}
			});
		}
	};

	const fileUpdateBlanksSop = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileName = event.target.name;
		handleFileUploadBlanksSop(event, type, fileName);
	}, []);

	/**
	 *
	 * @returns Method used for get validation for add/edit activity
	 */
	const getObjBlanksSop = () => {
		const obj: ObjectShape = {
			[FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
			[FieldNames.imageSimplified]: imageSimplifiedBlanksSop ? mixedNotRequired() : mixedRequired(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.audioSimplified]: audioSimplifiedBlanksSop ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.optionSimplified]: simplifiedOptionalsListBlanksSop.length ? stringNotRequired() : stringTrim(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioSimplified]: simplifiedOptionalsListBlanksSop.length ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.imageTraditional]: imageTraditionalBlanksSop ? mixedNotRequired() : mixedRequired(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.audioTraditional]: audioTraditionalBlanksSop ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.optionTraditional]: traditionalOptionalsListBlanksSop.length ? stringNotRequired() : stringTrim(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioTraditional]: traditionalOptionalsListBlanksSop.length ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
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
	const validationSchema = getObjBlanksSop();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updatedData: FillInTheBlanksActivitySubmitData = {
				isMoving: isMoving,
				levelId: moveData(isMoving, levelId as string, values.levelId as string),
				isForSop: true,
				title: formik.values.title.trim(),
				traditionalQuestionsChinese: formik.values.traditionalQuestionChinese.map((item) => {
					return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim() };
				}),
				traditionalQuestionAudioUrl: audioTraditionalBlanksSop.split('/').pop() as string,
				traditionalCompleteActivityAudio: values.traditionalCompleteActivityAudio.split('/').pop() as string,
				simplifiedCompleteActivityAudio: values.simplifiedCompleteActivityAudio.split('/').pop() as string,
				traditionalImageUrl: imageTraditionalBlanksSop.split('/').pop() as string,
				traditionalAnswer: correctAnswerTraditionalBlanksSop,
				traditionalCorrectAnswer: correctAnswerTraditionalBlanksSop.map((item) => item.optionValue)?.join(' '),
				traditionalOptions: traditionalOptionalsListBlanksSop.map(({ optionFileUrl, ...rest }) => ({
					optionFileUrl: optionFileUrl.split('/').pop() as string,
					...rest,
				})),

				simplifiedQuestionsChinese: formik.values.simplifiedQuestionChinese.map((item) => {
					return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim() };
				}),
				simplifiedQuestionAudioUrl: audioSimplifiedBlanksSop.split('/').pop() as string,
				simplifiedImageUrl: imageSimplifiedBlanksSop.split('/').pop() as string,
				simplifiedAnswer: correctAnswerSimplifiedBlanksSop,
				simplifiedCorrectAnswer: correctAnswerSimplifiedBlanksSop.map((item) => item.optionValue)?.join(' '),
				simplifiedOptions: simplifiedOptionalsListBlanksSop.map(({ optionFileUrl, ...rest }) => ({
					optionFileUrl: optionFileUrl.split('/').pop() as string,
					...rest,
				})),

				isSkippable: skipButtonCheckedBlanksSop,
			};
			if (correctAnswerSimplifiedBlanksSop.length && correctAnswerTraditionalBlanksSop.length) {
				if (params.activityId) {
					setLoadingBlanksSop(true);
					APIService.putData(`${url}/${activityPaths.fillBlanks}/${params.activityId}`, {
						...updatedData,
					})
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingBlanksSop(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingBlanksSop(false);
						});
				} else {
					setLoadingBlanksSop(true);
					APIService.postData(`${url}/${activityPaths.fillBlanks}`, {
						...updatedData,
						activityTypeId: values.activityTypeId,
					})
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingBlanksSop(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingBlanksSop(false);
						});
				}
			} else {
				checkCorrectAnswerBlanksSop();
			}
		},
	});

	const simplifiedOptionsDataBlanksSop = () => {
		setSimplifiedOptionalsListBlanksSop((prev) => {
			const updatedData = prev?.map((item) => {
				if (item.optionId === editSimplifiedOptionBlanksSop?.optionId) {
					const newData = {
						optionId: editSimplifiedOptionBlanksSop?.optionId,
						optionValue: formik.values.optionSimplified,
						optionFileUrl: optionAudioSimplifiedBlanksSop,
					};
					return { ...item, ...newData };
				} else {
					return item;
				}
			});
			if (!editSimplifiedOptionBlanksSop) {
				updatedData?.push({
					optionId: generateUuid(),
					optionValue: formik.values.optionSimplified,
					optionFileUrl: optionAudioSimplifiedBlanksSop,
				});
			}
			return updatedData;
		});
	};

	const addMoreOptionSimplifiedBlanksSop = useCallback(() => {
		if (simplifiedOptionalsListBlanksSop.length > OPTION_LIMIT && !editSimplifiedOptionBlanksSop) {
			return toast.error(Errors.MAX_OPTION);
		}
		if (formik.values.optionSimplified.trim() && optionAudioSimplifiedBlanksSop) {
			simplifiedOptionsDataBlanksSop();
			setOptionAudioSimplifiedBlanksSop('');
			formik.setFieldValue(FieldNames.optionSimplified, '');
			formik.setFieldValue(FieldNames.optionAudioSimplified, '');
			resetInputManually([FieldNames.optionAudioSimplified]);
			setEditSimplifiedOptionBlanksSop(null);
			validateFormBlanksSop();
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
	}, [simplifiedOptionalsListBlanksSop, editSimplifiedOptionBlanksSop, formik, optionAudioSimplifiedBlanksSop, correctAnswerSimplifiedBlanksSop]);

	const traditionalOptionsDataBlanksSop = () => {
		setTraditionalOptionalsListBlanksSop((prev) => {
			const updatedData = prev?.map((item) => {
				if (item.optionId === editTraditionalOptionBlanksSop?.optionId) {
					const newData = {
						optionId: editTraditionalOptionBlanksSop?.optionId,
						optionValue: formik.values.optionTraditional,
						optionFileUrl: optionAudioTraditionalBlanksSop,
					};
					return { ...item, ...newData };
				} else {
					return item;
				}
			});
			if (!editTraditionalOptionBlanksSop) {
				updatedData?.push({
					optionId: generateUuid(),
					optionValue: formik.values.optionTraditional,
					optionFileUrl: optionAudioTraditionalBlanksSop,
				});
			}
			return updatedData;
		});
	};

	const addMoreOptionTraditionalBlanksSOp = useCallback(() => {
		if (traditionalOptionalsListBlanksSop.length > OPTION_LIMIT && !editTraditionalOptionBlanksSop) {
			return toast.error(Errors.MAX_OPTION);
		}
		if (formik.values.optionTraditional.trim() && optionAudioTraditionalBlanksSop) {
			traditionalOptionsDataBlanksSop();
			setOptionAudioTraditionalBlanksSop('');
			formik.setFieldValue(FieldNames.optionTraditional, '');
			formik.setFieldValue(FieldNames.optionAudioTraditional, '');
			resetInputManually([FieldNames.optionAudioTraditional]);
			setEditTraditionalOptionBlanksSop(null);
			validateFormBlanksSop();
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
	}, [traditionalOptionalsListBlanksSop, editTraditionalOptionBlanksSop, formik, optionAudioTraditionalBlanksSop, correctAnswerTraditionalBlanksSop]);

	const validateFormBlanksSop = () => {
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
	const copyDataBlanksSop = useCallback(async () => {
		const traditionalBlanksOptionsTranslateSop = await Promise.all(
			traditionalOptionalsListBlanksSop.map(async (item) => {
				return {
					...item,
					optionValue: await translateText(item.optionValue, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data: string) => {
						return data ?? data;
					}),
				};
			})
		);
		if (imageTraditionalBlanksSop !== '') {
			setImageSimplifiedBlanksSop(imageTraditionalBlanksSop);
			formik.setFieldValue(FieldNames.imageSimplified, formik.values.imageTraditional);
		}
		if (audioTraditionalBlanksSop !== '') {
			formik.setFieldValue(FieldNames.audioSimplified, formik.values.audioTraditional);
			setAudioSimplifiedBlanksSop(audioTraditionalBlanksSop);
		}
		formik.values.traditionalCompleteActivityAudio && formik.setFieldValue(FieldNames.simplifiedCompleteActivityAudio, formik.values.traditionalCompleteActivityAudio);
		setCorrectAnswerSimplifiedBlanksSop(correctAnswerTraditionalBlanksSop);
		setSimplifiedOptionalsListBlanksSop(traditionalBlanksOptionsTranslateSop);
		formik.setFieldValue(FieldNames.simplifiedQuestionChinese, traditionalData());
		validateFormBlanksSop();
	}, [formik]);

	const getErrorBlanksSOp = (fieldName: keyof CreateFillBlanksActivity) => {
		if (fieldName !== FieldNames.traditionalQuestionChinese && fieldName !== FieldNames.simplifiedQuestionChinese) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};

	const translateTraditionalFieldBlanksSop = useCallback(
		(index: number) => {
			translateText(formik.values.traditionalQuestionChinese[index].chinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
				// traditional to english
				formik.setFieldValue(`traditionalQuestionChinese[${index}].english`, data ?? data);
				formik.setFieldValue(`traditionalQuestionChinese[${index}].pinyin`, formik.values.traditionalQuestionChinese[index].chinese);
			});
		},
		[formik]
	);

	const translateSimplifiedFieldBlanksSop = useCallback(
		(index: number) => {
			translateText(formik.values.simplifiedQuestionChinese[index].chinese, ENGLISH_CODE, SIMPLIFIED_CHINESE_CODE).then((data) => {
				// Simplified to english
				formik.setFieldValue(`simplifiedQuestionChinese[${index}].english`, data ?? data);
				formik.setFieldValue(`simplifiedQuestionChinese[${index}].pinyin`, formik.values.simplifiedQuestionChinese[index].chinese);
			});
		},
		[formik]
	);

	const audioUploadBlanksSop = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateBlanksSop(e, fileTypeEnum.audio);
	}, []);

	const imageUploadBlanksSop = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateBlanksSop(e, fileTypeEnum.image);
	}, []);

	const addMoreTraditionalQuestionBlanksSop = useCallback(() => {
		formik.setFieldValue('traditionalQuestionChinese', [...formik.values.traditionalQuestionChinese, { chinese: '', english: '', pinyin: '' }]);
	}, [formik]);

	const addMoreSimplifiedQuestionBlanksSop = useCallback(() => {
		formik.setFieldValue('simplifiedQuestionChinese', [...formik.values.simplifiedQuestionChinese, { chinese: '', english: '', pinyin: '' }]);
	}, [formik]);

	const editTraditionalRecordBlanksSop = useCallback((data: optionObject) => {
		setEditTraditionalOptionBlanksSop(data);
	}, []);

	const deleteTraditionalRecordBlanksSop = useCallback(
		(data: optionObject) => {
			setTraditionalOptionalsListBlanksSop(traditionalOptionalsListBlanksSop?.filter((item) => item.optionId !== data.optionId));
		},
		[traditionalOptionalsListBlanksSop, correctAnswerTraditionalBlanksSop]
	);

	const editSimplifiedRecordBlanksSop = useCallback((data: optionObject) => {
		setEditSimplifiedOptionBlanksSop(data);
	}, []);

	const deleteSimplifiedRecordBlanksSop = useCallback(
		(data: optionObject) => {
			setSimplifiedOptionalsListBlanksSop(simplifiedOptionalsListBlanksSop?.filter((item) => item.optionId !== data.optionId));
		},
		[simplifiedOptionalsListBlanksSop, correctAnswerSimplifiedBlanksSop]
	);

	/**
	 * method is used to update simplified correctAnswer after edit
	 */
	useEffect(() => {
		const updatedCorrectAnswers = correctAnswerSimplifiedBlanksSop?.map((item) => {
			const data = simplifiedOptionalsListBlanksSop?.filter((data) => data.optionId === item.optionId);
			return { optionId: data[0].optionId, optionValue: data[0].optionValue, optionFileUrl: data[0].optionFileUrl };
		});
		setCorrectAnswerSimplifiedBlanksSop(updatedCorrectAnswers);
	}, [simplifiedOptionalsListBlanksSop]);

	/**
	 * method is used to update traditional correctAnswer after edit
	 */
	useEffect(() => {
		const updatedCorrectAnswers = correctAnswerTraditionalBlanksSop?.map((item) => {
			const data = traditionalOptionalsListBlanksSop?.filter((data) => data.optionId === item.optionId);
			return { optionId: data[0].optionId, optionValue: data[0].optionValue, optionFileUrl: data[0].optionFileUrl };
		});
		setCorrectAnswerTraditionalBlanksSop(updatedCorrectAnswers);
	}, [traditionalOptionalsListBlanksSop]);

	const checkCorrectAnswerBlanksSop = () => {
		!correctAnswerSimplifiedBlanksSop.length && toast.error(Errors.PLEASE_SELECT_CORRECT_ANSWER_SIMPLIFIED);
		!correctAnswerTraditionalBlanksSop.length && toast.error(Errors.PLEASE_SELECT_CORRECT_ANSWER_TRADITIONAL);
	};

	return (
		<div>
			<FormikProvider value={formik}>
				<form className='w-full' onSubmit={formik.handleSubmit}>
					{loadingBlanksSop && <Loader />}
					<div className='mb-3'>
						<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorBlanksSOp(FieldNames.title)} required />
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
													const chineseTraditionalBlanksSop = `traditionalQuestionChinese[${index}].chinese`;
													const englishTraditionalBlanksSop = `traditionalQuestionChinese[${index}].english`;
													const pinyinTraditionalBlanksSop = `traditionalQuestionChinese[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-1 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseTraditionalBlanksSop} onChange={formik.handleChange} label='Chinese' value={formik.values.traditionalQuestionChinese[index].chinese} error={getIn(formik.touched, chineseTraditionalBlanksSop) && getIn(formik.errors, chineseTraditionalBlanksSop) ? getIn(formik.errors, chineseTraditionalBlanksSop) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateTraditionalFieldBlanksSop} isTranslate={true} title='Translate' />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question english' name={englishTraditionalBlanksSop} onChange={formik.handleChange} label='English' value={formik.values.traditionalQuestionChinese[index].english} error={getIn(formik.touched, englishTraditionalBlanksSop) && getIn(formik.errors, englishTraditionalBlanksSop) ? getIn(formik.errors, englishTraditionalBlanksSop) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinTraditionalBlanksSop} onChange={formik.handleChange} label='Pinyin' value={formik.values.traditionalQuestionChinese[index].pinyin} error={getIn(formik.touched, pinyinTraditionalBlanksSop) && getIn(formik.errors, pinyinTraditionalBlanksSop) ? getIn(formik.errors, pinyinTraditionalBlanksSop) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.traditionalQuestionChinese.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalQuestionBlanksSop}>
													<Plus className='mr-3' /> Add More
												</Button>
											</div>
										),
										[formik]
									)}
								/>
								<div className='mb-4'>
									<FileUpload labelName='Question Audio' id={FieldNames.audioTraditional} imageSource={audioTraditionalBlanksSop} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.audioTraditional} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanksSop} error={getErrorBlanksSOp(FieldNames.audioTraditional) as string} />
									{!isPercentageValidBlanksSop(audioTraditionalBlanksSopPercentage) && <LoadingPercentage percentage={audioTraditionalBlanksSopPercentage} />}
								</div>
								<div className='mb-4'>
									<FileUpload labelName='Image' id={FieldNames.imageTraditional} imageSource={imageTraditionalBlanksSop} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} name={FieldNames.imageTraditional} acceptNote={IMAGE_NOTE} uploadType={FILE_TYPE.jpegType || FILE_TYPE.jpgType || FILE_TYPE.pngType} onChange={imageUploadBlanksSop} error={getErrorBlanksSOp(FieldNames.imageTraditional) as string} />
									{!isPercentageValidBlanksSop(imageTraditionalBlanksSopPercentage) && <LoadingPercentage percentage={imageTraditionalBlanksSopPercentage} />}
								</div>
								<h6 className='font-medium mb-2 col-span-2 '>Options</h6>

								<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
									<div className='mb-4 col-span-2'>
										<TextInput placeholder='option' name={FieldNames.optionTraditional} onChange={formik.handleChange} label='Option' value={formik.values.optionTraditional} error={getErrorBlanksSOp(FieldNames.optionTraditional)} required />
									</div>
									<div className='mb-4 col-span-3'>
										<FileUpload labelName='Audio' id={FieldNames.optionAudioTraditional} imageSource={optionAudioTraditionalBlanksSop} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.optionAudioTraditional} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanksSop} error={getErrorBlanksSOp(FieldNames.optionAudioTraditional) as string} />
										{!isPercentageValidBlanksSop(optionAudioTraditionalBlanksSopPercentage) && <LoadingPercentage percentage={optionAudioTraditionalBlanksSopPercentage} />}
									</div>
									<div className=' flex items-center'>
										<Button className='btn-primary rounded-full' onClick={addMoreOptionTraditionalBlanksSOp}>
											{editTraditionalOptionBlanksSop ? 'Update' : 'Add'}
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
											{traditionalOptionalsListBlanksSop.map((item, index) => (
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
																	checked: correctAnswerTraditionalBlanksSop.some((item1) => item.optionId === item1.optionId),
																	name: '',
																	onChange() {
																		const existingIndex = correctAnswerTraditionalBlanksSop.findIndex((data) => item.optionId === data.optionId);
																		if (existingIndex !== -1) {
																			// If the item exists, remove it
																			const updatedItems = correctAnswerTraditionalBlanksSop.filter((item1) => item.optionId !== item1.optionId);
																			setCorrectAnswerTraditionalBlanksSop(updatedItems);
																		} else {
																			// If the item doesn't exist, add it
																			const updatedItems = [...correctAnswerTraditionalBlanksSop, { optionId: item.optionId, optionValue: item.optionValue, optionFileUrl: item.optionFileUrl }];
																			setCorrectAnswerTraditionalBlanksSop(updatedItems);
																		}
																		validateFormBlanksSop();
																	},
																},
															]}
															disabled={editTraditionalOptionBlanksSop?.optionId == item.optionId}
														/>
													</td>
													<td className='w-28'>
														<div className='flex gap-3'>
															<EditButton data={item} editRecord={editTraditionalRecordBlanksSop} buttonSuccess={true} disable={editTraditionalOptionBlanksSop?.optionId === item.optionId} />
															<DeleteButton data={item} isDeleteStatusModal={deleteTraditionalRecordBlanksSop} btnDanger={true} disable={editTraditionalOptionBlanksSop?.optionId === item.optionId || correctAnswerTraditionalBlanksSop.some((item1) => item.optionId === item1.optionId)} />
														</div>
													</td>
												</tr>
											))}

											{!traditionalOptionalsListBlanksSop.length && (
												<tr>
													<td colSpan={10} className='text-center font-medium py-5 text-gray-400'>
														No Data Added
													</td>
												</tr>
											)}
										</tbody>
									</table>
									<div>
										{correctAnswerTraditionalBlanksSop?.length !== 0 && (
											<span>
												Correct Answer : <span className='font-medium'>{correctAnswerTraditionalBlanksSop.map((item) => item.optionValue)?.join(' ')}</span>
											</span>
										)}
									</div>
								</div>
								<div className='mb-4 grid grid-cols-2 gap-x-4 gap-y-2 col-span-2  p-3'>
									<div className='mb-4 col-span-3'>
										<FileUpload labelName='Complete Activity Audio With Answers' id={FieldNames.traditionalCompleteActivityAudio} imageSource={formik.values.traditionalCompleteActivityAudio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.traditionalCompleteActivityAudio} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanksSop} error={getErrorBlanksSOp(FieldNames.traditionalCompleteActivityAudio) as string} />
										{!isPercentageValidBlanksSop(traditionalCompleteActivityAudioBlanksSop) && <LoadingPercentage percentage={traditionalCompleteActivityAudioBlanksSop} />}
									</div>
								</div>
							</div>
						</div>

						<div className='flex flex-col justify-center items-center p-3'>
							<Button className='btn-default btn-large' title='Copy' onClick={copyDataBlanksSop} disabled={disableUpdateBlanksSop}>
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
													const chineseSimplifiedBlanksSop = `simplifiedQuestionChinese[${index}].chinese`;
													const englishSimplifiedBlanksSop = `simplifiedQuestionChinese[${index}].english`;
													const pinyinSimplifiedBlanksSop = `simplifiedQuestionChinese[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-1 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseSimplifiedBlanksSop} onChange={formik.handleChange} label='Chinese' value={formik.values.simplifiedQuestionChinese[index].chinese} error={getIn(formik.touched, chineseSimplifiedBlanksSop) && getIn(formik.errors, chineseSimplifiedBlanksSop) ? getIn(formik.errors, chineseSimplifiedBlanksSop) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateSimplifiedFieldBlanksSop} isTranslate={true} title='Translate' />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question english' name={englishSimplifiedBlanksSop} onChange={formik.handleChange} label='English' value={formik.values.simplifiedQuestionChinese[index].english} error={getIn(formik.touched, englishSimplifiedBlanksSop) && getIn(formik.errors, englishSimplifiedBlanksSop) ? getIn(formik.errors, englishSimplifiedBlanksSop) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinSimplifiedBlanksSop} onChange={formik.handleChange} label='Pinyin' value={formik.values.simplifiedQuestionChinese[index].pinyin} error={getIn(formik.touched, pinyinSimplifiedBlanksSop) && getIn(formik.errors, pinyinSimplifiedBlanksSop) ? getIn(formik.errors, pinyinSimplifiedBlanksSop) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.simplifiedQuestionChinese.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedQuestionBlanksSop}>
													<Plus className='mr-3' /> Add More
												</Button>
											</div>
										),
										[formik]
									)}
								/>

								<div className='mb-4'>
									<FileUpload labelName='Question Audio' id={FieldNames.audioSimplified} imageSource={audioSimplifiedBlanksSop} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.audioSimplified} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanksSop} error={getErrorBlanksSOp(FieldNames.audioSimplified) as string} />
									{!isPercentageValidBlanksSop(audioSimplifiedBlanksSopPercentage) && <LoadingPercentage percentage={audioSimplifiedBlanksSopPercentage} />}
								</div>
								<div className='mb-4'>
									<FileUpload labelName='Image' id={FieldNames.imageSimplified} imageSource={imageSimplifiedBlanksSop} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} name={FieldNames.imageSimplified} acceptNote={IMAGE_NOTE} uploadType={FILE_TYPE.jpegType || FILE_TYPE.jpgType || FILE_TYPE.pngType} onChange={imageUploadBlanksSop} error={getErrorBlanksSOp(FieldNames.imageSimplified) as string} />
									{!isPercentageValidBlanksSop(imageSimplifiedBlanksSopPercentage) && <LoadingPercentage percentage={imageSimplifiedBlanksSopPercentage} />}
								</div>
								<h6 className='font-medium mb-2 col-span-2 '>Options</h6>
								<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
									<div className='mb-4 col-span-2'>
										<TextInput placeholder='option' name={FieldNames.optionSimplified} onChange={formik.handleChange} label='Option' value={formik.values.optionSimplified} error={getErrorBlanksSOp(FieldNames.optionSimplified)} required />
									</div>
									<div className='mb-4 col-span-3'>
										<FileUpload labelName='Audio' id={FieldNames.optionAudioSimplified} imageSource={optionAudioSimplifiedBlanksSop} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.optionAudioSimplified} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanksSop} error={getErrorBlanksSOp(FieldNames.optionAudioSimplified) as string} />
										{!isPercentageValidBlanksSop(optionAudioSimplifiedBlanksSopPercent) && <LoadingPercentage percentage={optionAudioSimplifiedBlanksSopPercent} />}
									</div>
									<div className='flex items-center'>
										<Button className='btn-primary rounded-full' onClick={addMoreOptionSimplifiedBlanksSop} disabled={!isPercentageValidBlanksSop(optionAudioSimplifiedBlanksSopPercent)}>
											{editSimplifiedOptionBlanksSop ? 'Update' : 'Add'}
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
											{simplifiedOptionalsListBlanksSop.map((item, index) => (
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
																	checked: correctAnswerSimplifiedBlanksSop.some((item1) => item.optionId === item1.optionId),
																	name: '',
																	onChange() {
																		const existingIndex = correctAnswerSimplifiedBlanksSop.findIndex((data) => item.optionId === data.optionId);
																		if (existingIndex !== -1) {
																			// If the item exists, remove it
																			const updatedItems = correctAnswerSimplifiedBlanksSop.filter((item1) => item.optionId !== item1.optionId);
																			setCorrectAnswerSimplifiedBlanksSop(updatedItems);
																		} else {
																			// If the item doesn't exist, add it
																			const updatedItems = [...correctAnswerSimplifiedBlanksSop, { optionId: item.optionId, optionValue: item.optionValue, optionFileUrl: item.optionFileUrl }];
																			setCorrectAnswerSimplifiedBlanksSop(updatedItems);
																		}
																		validateFormBlanksSop();
																	},
																},
															]}
															disabled={editSimplifiedOptionBlanksSop?.optionId == item.optionId}
														/>
													</td>
													<td className='w-28'>
														<div className='flex gap-3'>
															<EditButton data={item} editRecord={editSimplifiedRecordBlanksSop} buttonSuccess={true} disable={editSimplifiedOptionBlanksSop?.optionId === item.optionId} />
															<DeleteButton data={item} isDeleteStatusModal={deleteSimplifiedRecordBlanksSop} btnDanger={true} disable={editSimplifiedOptionBlanksSop?.optionId === item.optionId || correctAnswerSimplifiedBlanksSop.some((item1) => item.optionId === item1.optionId)} />
														</div>
													</td>
												</tr>
											))}

											{!simplifiedOptionalsListBlanksSop.length && (
												<tr>
													<td colSpan={10} className='text-center font-medium py-5 text-gray-400'>
														No Data Added
													</td>
												</tr>
											)}
										</tbody>
									</table>
									<div>
										{correctAnswerSimplifiedBlanksSop?.length !== 0 && (
											<span>
												Correct Answer : <span className='font-medium'>{correctAnswerSimplifiedBlanksSop.map((item) => item.optionValue)?.join(' ')}</span>
											</span>
										)}
									</div>
								</div>
								<div className='mb-4 grid grid-cols-2 gap-x-4 gap-y-2 col-span-2  p-3'>
									<div className='mb-4 col-span-3'>
										<FileUpload labelName='Complete Activity Audio With Answers' id={FieldNames.simplifiedCompleteActivityAudio} imageSource={formik.values.simplifiedCompleteActivityAudio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.simplifiedCompleteActivityAudio} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanksSop} error={getErrorBlanksSOp(FieldNames.simplifiedCompleteActivityAudio) as string} />
										{!isPercentageValidBlanksSop(simplifiedCompleteActivityAudioBlanksSop) && <LoadingPercentage percentage={simplifiedCompleteActivityAudioBlanksSop} />}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='flex justify-end gap-2 items-center'>
						<CheckBox
							option={[
								{
									value: '',
									checked: skipButtonCheckedBlanksSop,
									name: 'Provide skip button for this activity',
									onChange() {
										setSkipButtonCheckedBlanksSop((prev) => !prev);
									},
								},
							]}
						/>
						<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdateBlanksSop}>
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

export default ActivityFillInTheBlanksSop;
