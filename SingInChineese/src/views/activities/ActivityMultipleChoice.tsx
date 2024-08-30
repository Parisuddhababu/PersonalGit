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
import { CreateMultipleActivity, MultipleChoiceActivitySubmitData, optionObject } from 'src/types/activities/multipleChoice';
import { Errors } from '@config/errors';
import { useParams } from 'react-router-dom';
import { generateUuid, moveData, resetInputManually, translateText, typeValidation } from '@utils/helpers';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import { Uploader } from '@views/activities/utils/upload';
import StatusButton from '@components/common/StatusButton';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import CommonButton from '@components/common/CommonButton';
import { mixedNotRequired, mixedRequired, stringNoSpecialChar, stringNotRequired, stringRequired, stringTrim } from '@config/validations';
import { URL_PATHS } from '@config/variables';
import { DropdownOptionType } from 'src/types/component';
import Dropdown from '@components/dropdown/Dropdown';

export const ActivityMultipleChoice = ({ onSubmit, onClose, url, activityUuid, toggleActivity, isMoving, levelId, topicId, lessonId }: AddEditActivitiesData) => {
	const defaultTraditionalFieldMCQ = { chinese: '', english: '', pinyin: '' };
	const defaultSimplifiedFieldMCQ = { chinese: '', english: '', pinyin: '' };
	const params = useParams();
	const [loadingMCQ, setLoadingMCQ] = useState<boolean>(false);
	const defaultOptionMCQ = { optionId: '', optionValue: '', optionFileUrl: '' };
	const [skipButtonCheckedMCQ, setSkipButtonCheckedMCQ] = useState<boolean>(false);

	const [imageSimplifiedMCQ, setImageSimplifiedMCQ] = useState<string>('');
	const [audioSimplifiedMCQ, setAudioSimplifiedMCQ] = useState<string>('');
	const [imageSimplifiedPercentageMCQ, setImageSimplifiedPercentageMCQ] = useState<number>(0);
	const [audioSimplifiedPercentageMCQ, setAudioSimplifiedPercentageMCQ] = useState<number>(0);
	const [optionAudioSimplifiedMCQ, setOptionAudioSimplifiedMCQ] = useState<string>('');
	const [optionAudioSimplifiedPercentMCQ, setOptionAudioSimplifiedPercentMCQ] = useState<number>(0);

	const [correctAnswerSimplifiedMCQ, setCorrectAnswerSimplifiedMCQ] = useState<optionObject>(defaultOptionMCQ);
	const [simplifiedOptionalsListMCQ, setSimplifiedOptionalsListMCQ] = useState<optionObject[]>([]);
	const [editSimplifiedOptionMCQ, setEditSimplifiedOptionMCQ] = useState<optionObject | null>(null);

	const [imageTraditionalMCQ, setImageTraditionalMCQ] = useState<string>('');
	const [audioTraditionalMCQ, setAudioTraditionalMCQ] = useState<string>('');
	const [imageTraditionalPercentageMCQ, setImageTraditionalPercentageMCQ] = useState<number>(0);
	const [audioTraditionalPercentageMCQ, setAudioTraditionalPercentageMCQ] = useState<number>(0);
	const [optionAudioTraditionalMCQ, setOptionAudioTraditionalMCQ] = useState<string>('');
	const [optionAudioTraditionalPercentageMCQ, setOptionAudioTraditionalPercentageMCQ] = useState<number>(0);

	const [traditionalOptionalsListMCQ, setTraditionalOptionalsListMCQ] = useState<optionObject[]>([]);
	const [editTraditionalOptionMCQ, setEditTraditionalOptionMCQ] = useState<optionObject | null>(null);
	const [correctAnswerTraditionalMCQ, setCorrectAnswerTraditionalMCQ] = useState<optionObject>(defaultOptionMCQ);

	const [levelOptionsMCQ, setLevelOptionsMCQ] = useState<DropdownOptionType[]>([]);
	const [copyCheckedMCQ, setCopyCheckedMCQ] = useState<boolean>(false);

	const updatePercentageMCQ = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.imageSimplified:
				setImageSimplifiedPercentageMCQ(newPercentage);
				break;
			case FieldNames.imageTraditional:
				setImageTraditionalPercentageMCQ(newPercentage);
				break;
			case FieldNames.optionAudioSimplified:
				setOptionAudioSimplifiedPercentMCQ(newPercentage);
				break;
			case FieldNames.optionAudioTraditional:
				setOptionAudioTraditionalPercentageMCQ(newPercentage);
				break;
			case FieldNames.audioSimplified:
				setAudioSimplifiedPercentageMCQ(newPercentage);
				break;
			case FieldNames.audioTraditional:
				setAudioTraditionalPercentageMCQ(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidMCQ = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdateMCQ = !(isPercentageValidMCQ(imageSimplifiedPercentageMCQ) && isPercentageValidMCQ(imageTraditionalPercentageMCQ) && isPercentageValidMCQ(audioSimplifiedPercentageMCQ) && isPercentageValidMCQ(audioTraditionalPercentageMCQ) && isPercentageValidMCQ(optionAudioSimplifiedPercentMCQ) && isPercentageValidMCQ(optionAudioTraditionalPercentageMCQ));

	/**
	 *@returns Method used for setValue from questions data and get the details of question by uuid
	 */
	useEffect(() => {
		if (params.activityId) {
			setLoadingMCQ(true);
			APIService.getData(`${url}/${activityPaths.mcq}/${params.activityId}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const responseData = response.data.data.activityData;
						const toggle = response.data.data.toggle;
						toggleActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);
						formik.setFieldValue(FieldNames.title, responseData.title);
						setImageTraditionalMCQ(responseData.traditionalImageUrl);
						setAudioTraditionalMCQ(responseData.traditionalQuestionUrl);
						setTraditionalOptionalsListMCQ(responseData.traditionalOptions);
						setCorrectAnswerTraditionalMCQ(responseData.traditionalAnswer);
						formik.setFieldValue(FieldNames.traditionalQuestionChinese, responseData.traditionalQuestion);
						formik.setFieldValue(FieldNames.simplifiedQuestionChinese, responseData.simplifiedQuestion);

						setImageSimplifiedMCQ(responseData.simplifiedImageUrl);
						setAudioSimplifiedMCQ(responseData.simplifiedQuestionUrl);
						setSimplifiedOptionalsListMCQ(responseData.simplifiedOptions);
						setCorrectAnswerSimplifiedMCQ(responseData.simplifiedAnswer);
						setSkipButtonCheckedMCQ(responseData.isSkippable);
					} else {
						toast.error(response?.data?.message);
					}
					setLoadingMCQ(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingMCQ(false);
				});
		}
	}, []);

	useEffect(() => {
		if (editTraditionalOptionMCQ) {
			formik.setFieldValue(FieldNames.optionTraditional, editTraditionalOptionMCQ.optionValue);
			setOptionAudioTraditionalMCQ(editTraditionalOptionMCQ?.optionFileUrl);
		}
	}, [editTraditionalOptionMCQ]);

	useEffect(() => {
		if (editSimplifiedOptionMCQ) {
			formik.setFieldValue(FieldNames.optionSimplified, editSimplifiedOptionMCQ?.optionValue);
			setOptionAudioSimplifiedMCQ(editSimplifiedOptionMCQ?.optionFileUrl);
		}
	}, [editSimplifiedOptionMCQ]);

	const initialValues: CreateMultipleActivity = {
		levelId: params?.levelId as string,
		topicId: params?.topicId as string,
		lessonId: params?.lessonId as string,
		activityTypeId: activityUuid,
		title: '',

		simplifiedQuestionChinese: [defaultSimplifiedFieldMCQ],
		imageSimplified: null,
		audioSimplified: null,
		optionSimplified: '',
		optionAudioSimplified: null,
		correctAnswerSimplified: '',
		correctAnswerAudioSimplified: null,

		[FieldNames.traditionalQuestionChinese]: [defaultTraditionalFieldMCQ],
		[FieldNames.correctAnswerAudioTraditional]: null,
		[FieldNames.imageTraditional]: null,
		[FieldNames.audioTraditional]: null,
		[FieldNames.optionTraditional]: '',
		[FieldNames.optionAudioTraditional]: null,
		[FieldNames.correctAnswerTraditional]: '',
		isSkippable: false,
		sopLevelId: '',
	};

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const handleFileUploadMCQ = (event: React.ChangeEvent<HTMLInputElement>, type: string, fileName: string) => {
		const fileMCQ = event.target.files?.[0] as File;
		typeValidation(fileMCQ, type);
		const lastIndex = fileMCQ?.name?.lastIndexOf('.');
		const extension = fileMCQ?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileMCQ);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptions = {
					fileName: name,
					file: fileMCQ,
					isForSeasonal: false,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(imageUploaderOptions, updatePercentageMCQ);
				uploader.start();
				switch (fileName) {
					case FieldNames.imageSimplified:
						formik.setFieldValue(FieldNames.imageSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQ(false);
							setImageSimplifiedMCQ(response);
						});
						break;
					case FieldNames.imageTraditional:
						formik.setFieldValue(FieldNames.imageTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQ(false);
							setImageTraditionalMCQ(response);
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
			const blob = URL.createObjectURL(fileMCQ);
			audio.src = blob;
			audio.addEventListener('loadedmetadata', () => {
				const audioUploaderOptions = {
					fileName: name,
					file: fileMCQ,
					isForSeasonal: false,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(audioUploaderOptions, updatePercentageMCQ);
				uploader.start();
				switch (fileName) {
					case FieldNames.audioSimplified:
						formik.setFieldValue(FieldNames.audioSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQ(false);
							setAudioSimplifiedMCQ(response);
						});
						break;
					case FieldNames.optionAudioSimplified:
						formik.setFieldValue(FieldNames.optionAudioSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQ(false);
							setOptionAudioSimplifiedMCQ(response);
						});
						break;
					case FieldNames.audioTraditional:
						formik.setFieldValue(FieldNames.audioTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQ(false);
							setAudioTraditionalMCQ(response);
						});
						break;
					case FieldNames.optionAudioTraditional:
						formik.setFieldValue(FieldNames.optionAudioTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQ(false);
							setOptionAudioTraditionalMCQ(response);
						});
						break;
					default:
						break;
				}
			});
		}
	};

	const fileUpdateMCQ = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileName = event.target.name;
		handleFileUploadMCQ(event, type, fileName);
	}, []);

	/**
	 *
	 * @returns Method used for get validation for add/edit activity
	 */
	const getObjMCQ = () => {
		const objMCQ: ObjectShape = {
			[FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
			[FieldNames.imageSimplified]: imageSimplifiedMCQ ? mixedNotRequired() : mixedRequired(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.audioSimplified]: audioSimplifiedMCQ ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.optionSimplified]: simplifiedOptionalsListMCQ.length ? stringNotRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioSimplified]: simplifiedOptionalsListMCQ.length ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.correctAnswerSimplified]: correctAnswerSimplifiedMCQ?.optionValue.length ? stringNotRequired() : stringTrim(Errors.PLEASE_SELECT_CORRECT_OPTION),
			[FieldNames.correctAnswerAudioSimplified]: correctAnswerSimplifiedMCQ?.optionFileUrl.length ? mixedNotRequired() : mixedRequired(Errors.PLEASE_SELECT_CORRECT_AUDIO),
			[FieldNames.imageTraditional]: imageTraditionalMCQ ? mixedNotRequired() : mixedRequired(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.audioTraditional]: audioTraditionalMCQ ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.optionTraditional]: traditionalOptionalsListMCQ.length ? stringNotRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioTraditional]: traditionalOptionalsListMCQ.length ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.correctAnswerTraditional]: correctAnswerTraditionalMCQ?.optionValue.length ? stringNotRequired() : stringTrim(Errors.PLEASE_SELECT_CORRECT_OPTION),
			[FieldNames.correctAnswerAudioTraditional]: correctAnswerTraditionalMCQ?.optionFileUrl.length ? mixedNotRequired() : mixedRequired(Errors.PLEASE_SELECT_CORRECT_AUDIO),
			[FieldNames.traditionalQuestionChinese]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.english]: stringNoSpecialChar(Errors.PLEASE_ENTER_QUESTION),
					[FieldNames.chinese]: stringTrim(Errors.PLEASE_ENTER_QUESTION),
					[FieldNames.pinyin]: stringRequired(Errors.PLEASE_ENTER_QUESTION),
				})
			),
			[FieldNames.simplifiedQuestionChinese]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: stringTrim(Errors.PLEASE_ENTER_QUESTION),
					[FieldNames.pinyin]: stringRequired(Errors.PLEASE_ENTER_QUESTION),
					[FieldNames.english]: stringNoSpecialChar(Errors.PLEASE_ENTER_QUESTION),
				})
			),
		};
		return Yup.object<ObjectShape>(objMCQ);
	};
	const validationSchema = getObjMCQ();
	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updatedData: MultipleChoiceActivitySubmitData = {
				isMoving: isMoving,
				levelId: moveData(isMoving, levelId as string, values.levelId as string),
				topicId: moveData(isMoving, topicId as string, values.topicId as string),
				lessonId: moveData(isMoving, lessonId as string, values.lessonId as string),
				sopLevelId: copyCheckedMCQ ? values.sopLevelId : '',
				title: values.title.trim(),
				traditionalQuestion: values.traditionalQuestionChinese?.map((item) => {
					return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim() };
				}),
				traditionalQuestionUrl: audioTraditionalMCQ.split('/').pop() as string,
				traditionalImageUrl: imageTraditionalMCQ.split('/').pop() as string,

				traditionalAnswer: { ...correctAnswerTraditionalMCQ, optionFileUrl: correctAnswerTraditionalMCQ.optionFileUrl.split('/').pop() as string },
				traditionalOptions: traditionalOptionalsListMCQ?.map(({ optionFileUrl, ...rest }) => ({
					optionFileUrl: optionFileUrl.split('/').pop() as string,
					...rest,
				})),
				simplifiedAnswer: { ...correctAnswerSimplifiedMCQ, optionFileUrl: correctAnswerSimplifiedMCQ.optionFileUrl.split('/').pop() as string },
				simplifiedQuestion: values.simplifiedQuestionChinese?.map((item) => {
					return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim() };
				}),
				simplifiedImageUrl: imageSimplifiedMCQ.split('/').pop() as string,
				simplifiedOptions: simplifiedOptionalsListMCQ?.map(({ optionFileUrl, ...rest }) => ({
					optionFileUrl: optionFileUrl.split('/').pop() as string,
					...rest,
				})),
				simplifiedQuestionUrl: audioSimplifiedMCQ.split('/').pop() as string,
				isSkippable: skipButtonCheckedMCQ,
			};
			if (params.activityId) {
				setLoadingMCQ(true);
				APIService.putData(`${url}/${activityPaths.mcqUpdate}/${params.activityId}`, {
					...updatedData,
				})
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoadingMCQ(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingMCQ(false);
					});
			} else {
				setLoadingMCQ(true);
				APIService.postData(`${url}/${activityPaths.mcqCreate}`, {
					activityTypeId: values.activityTypeId,
					...updatedData,
				})
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoadingMCQ(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingMCQ(false);
					});
			}
		},
	});

	const simplifiedOptionsDataMCQ = () => {
		setSimplifiedOptionalsListMCQ((prev) => {
			const updatedData = prev?.map((item) => {
				if (item.optionId === editSimplifiedOptionMCQ?.optionId) {
					const newData = {
						optionId: editSimplifiedOptionMCQ?.optionId,
						optionValue: formik.values.optionSimplified,
						optionFileUrl: optionAudioSimplifiedMCQ,
					};
					if (item.optionId === correctAnswerSimplifiedMCQ.optionId) {
						setCorrectAnswerSimplifiedMCQ(newData);
					}
					return { ...item, ...newData };
				} else {
					return item;
				}
			});
			if (!editSimplifiedOptionMCQ) {
				updatedData?.push({
					optionId: generateUuid(),
					optionValue: formik.values.optionSimplified,
					optionFileUrl: optionAudioSimplifiedMCQ,
				});
			}
			return updatedData;
		});
	};

	const addMoreOptionSimplified = useCallback(() => {
		if (simplifiedOptionalsListMCQ.length > OPTION_LIMIT && !editSimplifiedOptionMCQ) {
			return toast.error(Errors.MAX_OPTION);
		}
		if (formik.values.optionSimplified.trim() && optionAudioSimplifiedMCQ) {
			simplifiedOptionsDataMCQ();
			setOptionAudioSimplifiedMCQ('');
			formik.setFieldValue(FieldNames.optionSimplified, '');
			formik.setFieldValue(FieldNames.optionAudioSimplified, '');
			resetInputManually([FieldNames.optionAudioSimplified]);
			setEditSimplifiedOptionMCQ(null);
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
		validateFormMCQ();
	}, [simplifiedOptionalsListMCQ, editSimplifiedOptionMCQ, correctAnswerSimplifiedMCQ, formik]);

	const traditionalOptionsData = () => {
		setTraditionalOptionalsListMCQ((prev) => {
			const updatedData = prev?.map((item) => {
				if (item.optionId === editTraditionalOptionMCQ?.optionId) {
					const newData = {
						optionId: editTraditionalOptionMCQ?.optionId,
						optionValue: formik.values.optionTraditional,
						optionFileUrl: optionAudioTraditionalMCQ,
					};
					if (item.optionId === correctAnswerTraditionalMCQ.optionId) {
						setCorrectAnswerTraditionalMCQ(newData);
					}
					return { ...item, ...newData };
				} else {
					return item;
				}
			});
			if (!editTraditionalOptionMCQ) {
				updatedData?.push({
					optionId: generateUuid(),
					optionValue: formik.values.optionTraditional,
					optionFileUrl: optionAudioTraditionalMCQ,
				});
			}
			return updatedData;
		});
	};

	const addMoreOptionTraditional = useCallback(() => {
		if (traditionalOptionalsListMCQ.length > OPTION_LIMIT && !editTraditionalOptionMCQ) {
			return toast.error(Errors.MAX_OPTION);
		}
		if (formik.values.optionTraditional.trim() && optionAudioTraditionalMCQ) {
			traditionalOptionsData();
			setOptionAudioTraditionalMCQ('');
			formik.setFieldValue(FieldNames.optionTraditional, '');
			formik.setFieldValue(FieldNames.optionAudioTraditional, '');
			resetInputManually([FieldNames.optionAudioTraditional]);
			setEditTraditionalOptionMCQ(null);
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
		validateFormMCQ();
	}, [traditionalOptionalsListMCQ, editTraditionalOptionMCQ, correctAnswerTraditionalMCQ, formik]);

	const validateFormMCQ = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 500);
	};
	const traditionalDataMCQ = () => {
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
	const copyDataMCQ = useCallback(async () => {
		const traditionalMCQOptionsTranslate = await Promise.all(
			traditionalOptionalsListMCQ.map(async (item) => {
				return {
					...item,
					optionValue: await translateText(item.optionValue, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data: string) => {
						return data ?? data;
					}),
				};
			})
		);

		if (imageTraditionalMCQ !== '') {
			setImageSimplifiedMCQ(imageTraditionalMCQ);
			formik.setFieldValue(FieldNames.imageSimplified, formik.values.imageTraditional);
		}
		if (audioTraditionalMCQ !== '') {
			formik.setFieldValue(FieldNames.audioSimplified, formik.values.audioTraditional);
			setAudioSimplifiedMCQ(audioTraditionalMCQ);
		}

		setCorrectAnswerSimplifiedMCQ({
			...correctAnswerTraditionalMCQ,
			optionValue: await translateText(correctAnswerTraditionalMCQ.optionValue, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data: string) => {
				return data ?? data;
			}),
		});
		setSimplifiedOptionalsListMCQ(traditionalMCQOptionsTranslate);

		formik.setFieldValue(FieldNames.simplifiedQuestionChinese, traditionalDataMCQ());
		validateFormMCQ();
	}, [formik]);

	const getErrorMCQ = (fieldName: keyof CreateMultipleActivity) => {
		if (fieldName !== FieldNames.traditionalQuestionChinese && fieldName !== FieldNames.simplifiedQuestionChinese) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};

	const translateTraditionalFieldMCQ = useCallback(
		(index: number) => {
			translateText(formik.values.traditionalQuestionChinese[index].chinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
				// traditional to english
				formik.setFieldValue(`traditionalQuestionChinese[${index}].english`, data ?? data);
				formik.setFieldValue(`traditionalQuestionChinese[${index}].pinyin`, formik.values.traditionalQuestionChinese[index].chinese);
			});
		},
		[formik]
	);

	const translateSimplifiedFieldMCQ = useCallback(
		(index: number) => {
			translateText(formik.values.simplifiedQuestionChinese[index].chinese, ENGLISH_CODE, SIMPLIFIED_CHINESE_CODE).then((data) => {
				// Simplified to english
				formik.setFieldValue(`simplifiedQuestionChinese[${index}].english`, data ?? data);
				formik.setFieldValue(`simplifiedQuestionChinese[${index}].pinyin`, formik.values.simplifiedQuestionChinese[index].chinese);
			});
		},
		[formik]
	);

	const addMoreSimplifiedQuestionMCQ = useCallback(() => {
		formik.setFieldValue('simplifiedQuestionChinese', [...formik.values.simplifiedQuestionChinese, { chinese: '', english: '', pinyin: '' }]);
	}, [formik]);

	const addMoreTraditionalQuestionMCQ = useCallback(() => {
		formik.setFieldValue('traditionalQuestionChinese', [...formik.values.traditionalQuestionChinese, { chinese: '', english: '', pinyin: '' }]);
	}, [formik]);

	const editTraditionalRecordMCQ = useCallback((data: optionObject) => {
		setEditTraditionalOptionMCQ(data);
	}, []);

	const deleteTraditionalRecordMCQ = useCallback(
		(data: optionObject) => {
			setTraditionalOptionalsListMCQ(traditionalOptionalsListMCQ?.filter((item) => item.optionId !== data.optionId));
			if (data.optionId === correctAnswerTraditionalMCQ.optionId) {
				setCorrectAnswerTraditionalMCQ(defaultOptionMCQ);
			}
		},
		[traditionalOptionalsListMCQ, correctAnswerTraditionalMCQ]
	);

	const answerTraditionalMCQ = useCallback((item: optionObject) => {
		setCorrectAnswerTraditionalMCQ(item);
		validateFormMCQ();
	}, []);

	const editSimplifiedRecordMCQ = useCallback((data: optionObject) => {
		setEditSimplifiedOptionMCQ(data);
	}, []);

	const deleteSimplifiedRecordMCQ = useCallback(
		(data: optionObject) => {
			setSimplifiedOptionalsListMCQ(simplifiedOptionalsListMCQ?.filter((item) => item.optionId !== data.optionId));
			if (data.optionId === correctAnswerSimplifiedMCQ.optionId) {
				setCorrectAnswerSimplifiedMCQ(defaultOptionMCQ);
			}
		},
		[simplifiedOptionalsListMCQ, correctAnswerSimplifiedMCQ]
	);

	const answerSimplifiedMCQ = useCallback((item: optionObject) => {
		setCorrectAnswerSimplifiedMCQ(item);
		validateFormMCQ();
	}, []);

	const getLevelDataMCQ = () => {
		APIService.getData(`${URL_PATHS.signOnPlacementLevel}?isForSop=true`)
			.then((response) => {
				if (response.status === ResponseCode.created || ResponseCode.created) {
					const data: DropdownOptionType[] = [];
					response?.data?.data.levels.map((item: { levelName: string; uuid: string }) => {
						data.push({ name: item?.levelName, key: item?.uuid });
					});
					setLevelOptionsMCQ(data);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	};

	useEffect(() => {
		getLevelDataMCQ();
	}, []);

	return (
		<div>
			<FormikProvider value={formik}>
				<form className='w-full' onSubmit={formik.handleSubmit}>
					{loadingMCQ && <Loader />}
					<div className='mb-3'>
						<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorMCQ(FieldNames.title)} required />
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
													const chineseMCQTraditional = `traditionalQuestionChinese[${index}].chinese`;
													const englishMCQTraditional = `traditionalQuestionChinese[${index}].english`;
													const pinyinMCQTraditional = `traditionalQuestionChinese[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-1 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseMCQTraditional} onChange={formik.handleChange} label='Chinese' value={formik.values.traditionalQuestionChinese[index].chinese} error={getIn(formik.touched, chineseMCQTraditional) && getIn(formik.errors, chineseMCQTraditional) ? getIn(formik.errors, chineseMCQTraditional) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateTraditionalFieldMCQ} isTranslate={true} title='Translate' />
																</div>
																<div className='w-full'>
																	<TextInput placeholder='Question english' name={englishMCQTraditional} onChange={formik.handleChange} label='English' value={formik.values.traditionalQuestionChinese[index].english} error={getIn(formik.touched, englishMCQTraditional) && getIn(formik.errors, englishMCQTraditional) ? getIn(formik.errors, englishMCQTraditional) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinMCQTraditional} onChange={formik.handleChange} label='Pinyin' value={formik.values.traditionalQuestionChinese[index].pinyin} error={getIn(formik.touched, pinyinMCQTraditional) && getIn(formik.errors, pinyinMCQTraditional) ? getIn(formik.errors, pinyinMCQTraditional) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.traditionalQuestionChinese.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalQuestionMCQ}>
													<Plus className='mr-3' /> Add More
												</Button>
											</div>
										),
										[formik]
									)}
								/>
								<div className='mb-4'>
									<FileUpload
										labelName='Question Audio'
										id={FieldNames.audioTraditional}
										imageSource={audioTraditionalMCQ}
										accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
										name={FieldNames.audioTraditional}
										acceptNote='mp3, wav files only'
										uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
										onChange={useCallback((e) => {
											fileUpdateMCQ(e, fileTypeEnum.audio);
										}, [])}
										error={getErrorMCQ(FieldNames.audioTraditional) as string}
									/>
									{!isPercentageValidMCQ(audioTraditionalPercentageMCQ) && <LoadingPercentage percentage={audioTraditionalPercentageMCQ} />}
								</div>
								<div className='mb-4'>
									<FileUpload
										labelName='Image'
										id={FieldNames.imageTraditional}
										imageSource={imageTraditionalMCQ}
										accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`}
										name={FieldNames.imageTraditional}
										acceptNote={IMAGE_NOTE}
										uploadType={FILE_TYPE.jpegType || FILE_TYPE.jpgType || FILE_TYPE.pngType}
										onChange={useCallback((e) => {
											fileUpdateMCQ(e, fileTypeEnum.image);
										}, [])}
										error={getErrorMCQ(FieldNames.imageTraditional) as string}
									/>
									{!isPercentageValidMCQ(imageTraditionalPercentageMCQ) && <LoadingPercentage percentage={imageTraditionalPercentageMCQ} />}
								</div>
								<h6 className='font-medium mb-2 col-span-2 '>Options</h6>

								<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
									<div className='mb-4 col-span-2'>
										<TextInput placeholder='option' name={FieldNames.optionTraditional} onChange={formik.handleChange} label='Option' value={formik.values.optionTraditional} error={getErrorMCQ(FieldNames.optionTraditional)} required />
									</div>
									<div className='mb-4 col-span-3'>
										<FileUpload
											labelName='Audio'
											id={FieldNames.optionAudioTraditional}
											imageSource={optionAudioTraditionalMCQ}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.optionAudioTraditional}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											onChange={useCallback((e) => {
												fileUpdateMCQ(e, fileTypeEnum.audio);
											}, [])}
											error={getErrorMCQ(FieldNames.optionAudioTraditional) as string}
										/>
										{!isPercentageValidMCQ(optionAudioTraditionalPercentageMCQ) && <LoadingPercentage percentage={optionAudioTraditionalPercentageMCQ} />}
									</div>
									<div className=' flex items-center'>
										<Button className='btn-primary rounded-full' onClick={addMoreOptionTraditional}>
											{editTraditionalOptionMCQ ? 'Update' : 'Add'}
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
											{traditionalOptionalsListMCQ.map((item, index) => (
												<tr key={item.optionId}>
													<td className='w-10 text-center'>{index + 1}</td>
													<td className='w-24 font-medium'>{item.optionValue}</td>
													<td className='w-44'>
														<audio src={item.optionFileUrl} controls className='mb-3'>
															<track kind='captions' />
														</audio>
													</td>
													<td className='w-10'>
														<StatusButton data={item} status='' checked={correctAnswerTraditionalMCQ?.optionId === item.optionId} isChangeStatusModal={answerTraditionalMCQ} disable={!!editTraditionalOptionMCQ} />
													</td>
													<td className='w-28'>
														<div className='flex gap-3'>
															<EditButton data={item} editRecord={editTraditionalRecordMCQ} buttonSuccess={true} disable={editTraditionalOptionMCQ?.optionId === item.optionId} />
															<DeleteButton data={item} isDeleteStatusModal={deleteTraditionalRecordMCQ} btnDanger={true} disable={editTraditionalOptionMCQ?.optionId === item.optionId} />
														</div>
													</td>
												</tr>
											))}

											{!traditionalOptionalsListMCQ.length && (
												<tr>
													<td colSpan={10} className='text-center font-medium py-5 text-gray-400'>
														No Data Added
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>

								<h6 className='font-medium mb-2 col-span-2 '>Correct Answer</h6>
								<div className='mb-4 grid grid-cols-2 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
									<div className='mb-4'>
										<TextInput placeholder='Correct answer' label='Correct Option' value={correctAnswerTraditionalMCQ?.optionValue} error={getErrorMCQ(FieldNames.correctAnswerTraditional)} required disabled />
									</div>
									<div className='mb-4'>
										<FileUpload
											labelName='Correct Audio'
											uploadNote={false}
											id={FieldNames.correctAnswerAudioTraditional}
											imageSource={correctAnswerTraditionalMCQ?.optionFileUrl}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.correctAnswerAudioTraditional}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											onChange={useCallback((e) => {
												formik.handleChange(e);
											}, [])}
											error={getErrorMCQ(FieldNames.correctAnswerAudioTraditional) as string}
											disabled
										/>
									</div>
								</div>
							</div>
						</div>
						<div className='flex flex-col justify-center items-center p-3'>
							<Button className='btn-default btn-large' title='Copy' onClick={copyDataMCQ} disabled={disableUpdateMCQ}>
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
													const chineseMCQSimplified = `simplifiedQuestionChinese[${index}].chinese`;
													const englishMCQSimplified = `simplifiedQuestionChinese[${index}].english`;
													const pinyinMCQSimplified = `simplifiedQuestionChinese[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-1 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseMCQSimplified} onChange={formik.handleChange} label='Chinese' value={formik.values.simplifiedQuestionChinese[index].chinese} error={getIn(formik.touched, chineseMCQSimplified) && getIn(formik.errors, chineseMCQSimplified) ? getIn(formik.errors, chineseMCQSimplified) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateSimplifiedFieldMCQ} isTranslate={true} title='Translate' />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question english' name={englishMCQSimplified} onChange={formik.handleChange} label='English' value={formik.values.simplifiedQuestionChinese[index].english} error={getIn(formik.touched, englishMCQSimplified) && getIn(formik.errors, englishMCQSimplified) ? getIn(formik.errors, englishMCQSimplified) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinMCQSimplified} onChange={formik.handleChange} label='Pinyin' value={formik.values.simplifiedQuestionChinese[index].pinyin} error={getIn(formik.touched, pinyinMCQSimplified) && getIn(formik.errors, pinyinMCQSimplified) ? getIn(formik.errors, pinyinMCQSimplified) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.simplifiedQuestionChinese.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedQuestionMCQ}>
													<Plus className='mr-3' /> Add More
												</Button>
											</div>
										),
										[formik]
									)}
								/>
								<div className='mb-4'>
									<FileUpload
										labelName='Question Audio'
										id={FieldNames.audioSimplified}
										imageSource={audioSimplifiedMCQ}
										accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
										name={FieldNames.audioSimplified}
										acceptNote='mp3, wav files only'
										uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
										onChange={useCallback((e) => {
											fileUpdateMCQ(e, fileTypeEnum.audio);
										}, [])}
										error={getErrorMCQ(FieldNames.audioSimplified) as string}
									/>
									{!isPercentageValidMCQ(audioSimplifiedPercentageMCQ) && <LoadingPercentage percentage={audioSimplifiedPercentageMCQ} />}
								</div>
								<div className='mb-4'>
									<FileUpload
										labelName='Image'
										id={FieldNames.imageSimplified}
										imageSource={imageSimplifiedMCQ}
										accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`}
										name={FieldNames.imageSimplified}
										acceptNote={IMAGE_NOTE}
										uploadType={FILE_TYPE.jpegType || FILE_TYPE.jpgType || FILE_TYPE.pngType}
										onChange={useCallback((e) => {
											fileUpdateMCQ(e, fileTypeEnum.image);
										}, [])}
										error={getErrorMCQ(FieldNames.imageSimplified) as string}
									/>
									{!isPercentageValidMCQ(imageSimplifiedPercentageMCQ) && <LoadingPercentage percentage={imageSimplifiedPercentageMCQ} />}
								</div>
								<h6 className='font-medium mb-2 col-span-2 '>Options</h6>
								<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
									<div className='mb-4 col-span-2'>
										<TextInput placeholder='option' name={FieldNames.optionSimplified} onChange={formik.handleChange} label='Option' value={formik.values.optionSimplified} error={getErrorMCQ(FieldNames.optionSimplified)} required />
									</div>
									<div className='mb-4 col-span-3'>
										<FileUpload
											labelName='Audio'
											id={FieldNames.optionAudioSimplified}
											imageSource={optionAudioSimplifiedMCQ}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.optionAudioSimplified}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											onChange={useCallback((e) => {
												fileUpdateMCQ(e, fileTypeEnum.audio);
											}, [])}
											error={getErrorMCQ(FieldNames.optionAudioSimplified) as string}
										/>
										{!isPercentageValidMCQ(optionAudioSimplifiedPercentMCQ) && <LoadingPercentage percentage={optionAudioSimplifiedPercentMCQ} />}
									</div>
									<div className='flex items-center'>
										<Button className='btn-primary rounded-full' onClick={addMoreOptionSimplified} disabled={!isPercentageValidMCQ(optionAudioSimplifiedPercentMCQ)}>
											{editSimplifiedOptionMCQ ? 'Update' : 'Add'}
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
											{simplifiedOptionalsListMCQ.map((item, index) => (
												<tr key={item.optionId}>
													<td className='w-10 text-center'>{index + 1}</td>
													<td className='w-24 font-medium'>{item.optionValue}</td>

													<td className='w-44'>
														<audio src={item.optionFileUrl} controls className='mb-3'>
															<track kind='captions' />
														</audio>
													</td>
													<td className='w-10'>
														<StatusButton data={item} status='' checked={correctAnswerSimplifiedMCQ?.optionId === item.optionId} isChangeStatusModal={answerSimplifiedMCQ} disable={!!editSimplifiedOptionMCQ} />
													</td>
													<td className='w-28'>
														<div className='flex gap-3'>
															<EditButton data={item} editRecord={editSimplifiedRecordMCQ} buttonSuccess={true} disable={editSimplifiedOptionMCQ?.optionId === item.optionId} />
															<DeleteButton data={item} isDeleteStatusModal={deleteSimplifiedRecordMCQ} btnDanger={true} disable={editSimplifiedOptionMCQ?.optionId === item.optionId} />
														</div>
													</td>
												</tr>
											))}

											{!simplifiedOptionalsListMCQ.length && (
												<tr>
													<td colSpan={10} className='text-center font-medium py-5 text-gray-400'>
														No Data Added
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>

								<h6 className='font-medium mb-2 col-span-2 '>Correct Answer</h6>
								<div className='mb-4 grid grid-cols-2 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
									<div className='mb-4'>
										<TextInput placeholder='Correct answer' label='Correct Option' value={correctAnswerSimplifiedMCQ?.optionValue} error={getErrorMCQ(FieldNames.correctAnswerSimplified)} required disabled />
									</div>
									<div className='mb-4'>
										<FileUpload
											labelName='Correct Audio'
											uploadNote={false}
											id={FieldNames.correctAnswerAudioSimplified}
											imageSource={correctAnswerSimplifiedMCQ?.optionFileUrl}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.correctAnswerAudioSimplified}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											onChange={useCallback((e) => {
												formik.handleChange(e);
											}, [])}
											error={getErrorMCQ(FieldNames.correctAnswerAudioSimplified) as string}
											disabled
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='mb-4 w-96'>
						<CheckBox
							option={[
								{
									value: '',
									checked: copyCheckedMCQ,
									name: 'Copy this activity to SOP',
									onChange() {
										setCopyCheckedMCQ((prev) => !prev);
									},
								},
							]}
						/>
						{copyCheckedMCQ && <Dropdown label='Sop Level' placeholder='Select' name={'sopLevelId'} onChange={formik.handleChange} value={formik.values.sopLevelId} options={levelOptionsMCQ} id={'sopLevelId'} error={getErrorMCQ('sopLevelId')} required />}
					</div>

					<div className='flex justify-end gap-2 items-center'>
						<CheckBox
							option={[
								{
									value: '',
									checked: skipButtonCheckedMCQ,

									name: 'Provide skip button for this activity',
									onChange() {
										setSkipButtonCheckedMCQ((prev) => !prev);
									},
								},
							]}
						/>
						<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdateMCQ}>
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

export default ActivityMultipleChoice;
