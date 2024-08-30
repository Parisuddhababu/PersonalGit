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
import StatusButton from '@components/common/StatusButton';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import CommonButton from '@components/common/CommonButton';
import { CreateMultipleActivity, MultipleChoiceActivitySubmitData, optionObject } from 'src/types/activities/multipleChoice';
import { mixedNotRequired, mixedRequired, stringNoSpecialChar, stringNotRequired, stringRequired, stringTrim } from '@config/validations';

export const ActivityMultipleChoiceSop = ({ onSubmit, onClose, url, activityUuid, toggleActivity, isMoving, levelId }: AddEditActivitiesData) => {
	const defaultTraditionalFieldMCQSop = { chinese: '', english: '', pinyin: '' };
	const defaultSimplifiedFieldMCQSop = { chinese: '', english: '', pinyin: '' };
	const params = useParams();
	const [loadingMCQSop, setLoadingMCQSop] = useState<boolean>(false);
	const defaultOptionMCQSop = { optionId: '', optionValue: '', optionFileUrl: '' };
	const [skipButtonCheckedMCQSop, setSkipButtonCheckedMCQSop] = useState<boolean>(false);

	const [imageSimplifiedMCQSop, setImageSimplifiedMCQSop] = useState<string>('');
	const [audioSimplifiedMCQSop, setAudioSimplifiedMCQSop] = useState<string>('');
	const [imageSimplifiedPercentageMCQSop, setImageSimplifiedPercentageMCQSop] = useState<number>(0);
	const [audioSimplifiedPercentageMCQSop, setAudioSimplifiedPercentageMCQSop] = useState<number>(0);
	const [optionAudioSimplifiedMCQSop, setOptionAudioSimplifiedMCQSop] = useState<string>('');
	const [optionAudioSimplifiedPercentMCQSop, setOptionAudioSimplifiedPercentMCQSop] = useState<number>(0);

	const [correctAnswerSimplifiedMCQSop, setCorrectAnswerSimplifiedMCQSop] = useState<optionObject>(defaultOptionMCQSop);
	const [simplifiedOptionalsListMCQSop, setSimplifiedOptionalsListMCQSop] = useState<optionObject[]>([]);
	const [editSimplifiedOptionMCQSop, setEditSimplifiedOptionMCQSop] = useState<optionObject | null>(null);

	const [imageTraditionalMCQSop, setImageTraditionalMCQSop] = useState<string>('');
	const [audioTraditionalMCQSop, setAudioTraditionalMCQSop] = useState<string>('');
	const [imageTraditionalPercentageMCQSop, setImageTraditionalPercentageMCQSop] = useState<number>(0);
	const [audioTraditionalPercentageMCQSop, setAudioTraditionalPercentageMCQSop] = useState<number>(0);
	const [optionAudioTraditionalMCQSop, setOptionAudioTraditionalMCQSop] = useState<string>('');
	const [optionAudioTraditionalPercentageMCQSop, setOptionAudioTraditionalPercentageMCQSop] = useState<number>(0);

	const [traditionalOptionalsListMCQSop, setTraditionalOptionalsListMCQSop] = useState<optionObject[]>([]);
	const [editTraditionalOptionMCQSop, setEditTraditionalOptionMCQSop] = useState<optionObject | null>(null);
	const [correctAnswerTraditionalMCQSop, setCorrectAnswerTraditionalMCQSop] = useState<optionObject>(defaultOptionMCQSop);

	const updatePercentageMCQSop = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.imageSimplified:
				setImageSimplifiedPercentageMCQSop(newPercentage);
				break;
			case FieldNames.imageTraditional:
				setImageTraditionalPercentageMCQSop(newPercentage);
				break;
			case FieldNames.optionAudioSimplified:
				setOptionAudioSimplifiedPercentMCQSop(newPercentage);
				break;
			case FieldNames.optionAudioTraditional:
				setOptionAudioTraditionalPercentageMCQSop(newPercentage);
				break;
			case FieldNames.audioSimplified:
				setAudioSimplifiedPercentageMCQSop(newPercentage);
				break;
			case FieldNames.audioTraditional:
				setAudioTraditionalPercentageMCQSop(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidMCQSop = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdateMCQSop = !(isPercentageValidMCQSop(imageSimplifiedPercentageMCQSop) && isPercentageValidMCQSop(imageTraditionalPercentageMCQSop) && isPercentageValidMCQSop(audioSimplifiedPercentageMCQSop) && isPercentageValidMCQSop(audioTraditionalPercentageMCQSop) && isPercentageValidMCQSop(optionAudioSimplifiedPercentMCQSop) && isPercentageValidMCQSop(optionAudioTraditionalPercentageMCQSop));

	/**
	 *@returns Method used for setValue from questions data and get the details of question by uuid
	 */
	useEffect(() => {
		if (params.activityId) {
			setLoadingMCQSop(true);
			APIService.getData(`${url}/${activityPaths.mcq}/${params.activityId}?${activityPaths.isForSop}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const responseData = response.data.data.activityData;
						const toggle = response.data.data.toggle;
						toggleActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);
						formik.setFieldValue(FieldNames.title, responseData.title);
						setImageTraditionalMCQSop(responseData.traditionalImageUrl);
						setAudioTraditionalMCQSop(responseData.traditionalQuestionUrl);
						setTraditionalOptionalsListMCQSop(responseData.traditionalOptions);
						setCorrectAnswerTraditionalMCQSop(responseData.traditionalAnswer);
						formik.setFieldValue(FieldNames.traditionalQuestionChinese, responseData.traditionalQuestion);
						formik.setFieldValue(FieldNames.simplifiedQuestionChinese, responseData.simplifiedQuestion);

						setImageSimplifiedMCQSop(responseData.simplifiedImageUrl);
						setAudioSimplifiedMCQSop(responseData.simplifiedQuestionUrl);
						setSimplifiedOptionalsListMCQSop(responseData.simplifiedOptions);
						setCorrectAnswerSimplifiedMCQSop(responseData.simplifiedAnswer);
						setSkipButtonCheckedMCQSop(responseData.isSkippable);
					} else {
						toast.error(response?.data?.message);
					}
					setLoadingMCQSop(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingMCQSop(false);
				});
		}
	}, []);

	useEffect(() => {
		if (editTraditionalOptionMCQSop) {
			formik.setFieldValue(FieldNames.optionTraditional, editTraditionalOptionMCQSop.optionValue);
			setOptionAudioTraditionalMCQSop(editTraditionalOptionMCQSop?.optionFileUrl);
		}
	}, [editTraditionalOptionMCQSop]);

	useEffect(() => {
		if (editSimplifiedOptionMCQSop) {
			formik.setFieldValue(FieldNames.optionSimplified, editSimplifiedOptionMCQSop?.optionValue);
			setOptionAudioSimplifiedMCQSop(editSimplifiedOptionMCQSop?.optionFileUrl);
		}
	}, [editSimplifiedOptionMCQSop]);

	const initialValues: CreateMultipleActivity = {
		levelId: params?.levelId as string,
		activityTypeId: activityUuid,
		title: '',
		simplifiedQuestionChinese: [defaultSimplifiedFieldMCQSop],
		[FieldNames.traditionalQuestionChinese]: [defaultTraditionalFieldMCQSop],
		imageSimplified: null,
		[FieldNames.imageTraditional]: null,
		audioSimplified: null,
		[FieldNames.audioTraditional]: null,
		optionSimplified: '',
		[FieldNames.optionTraditional]: '',
		optionAudioSimplified: null,
		[FieldNames.optionAudioTraditional]: null,
		correctAnswerSimplified: '',
		[FieldNames.correctAnswerTraditional]: '',
		correctAnswerAudioSimplified: null,
		[FieldNames.correctAnswerAudioTraditional]: null,
		isSkippable: false,
	};

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const handleFileUploadMCQSop = (event: React.ChangeEvent<HTMLInputElement>, type: string, fileName: string) => {
		const fileMCQSop = event.target.files?.[0] as File;
		typeValidation(fileMCQSop, type);
		const lastIndex = fileMCQSop?.name?.lastIndexOf('.');
		const extension = fileMCQSop?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileMCQSop);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptions = {
					fileName: name,
					file: fileMCQSop,
					isForSeasonal: false,
					isForSop: true,
					fieldName: fileName,
				};
				const uploader = new Uploader(imageUploaderOptions, updatePercentageMCQSop);
				uploader.start();
				switch (fileName) {
					case FieldNames.imageSimplified:
						formik.setFieldValue(FieldNames.imageSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQSop(false);
							setImageSimplifiedMCQSop(response);
						});
						break;
					case FieldNames.imageTraditional:
						formik.setFieldValue(FieldNames.imageTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQSop(false);
							setImageTraditionalMCQSop(response);
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
			const blob = URL.createObjectURL(fileMCQSop);
			audio.src = blob;
			audio.addEventListener('loadedmetadata', () => {
				const audioUploaderOptions = {
					fileName: name,
					file: fileMCQSop,
					isForSeasonal: false,
					isForSop: true,
					fieldName: fileName,
				};
				const uploader = new Uploader(audioUploaderOptions, updatePercentageMCQSop);
				uploader.start();
				switch (fileName) {
					case FieldNames.audioSimplified:
						formik.setFieldValue(FieldNames.audioSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQSop(false);
							setAudioSimplifiedMCQSop(response);
						});
						break;
					case FieldNames.optionAudioSimplified:
						formik.setFieldValue(FieldNames.optionAudioSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQSop(false);
							setOptionAudioSimplifiedMCQSop(response);
						});
						break;
					case FieldNames.audioTraditional:
						formik.setFieldValue(FieldNames.audioTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQSop(false);
							setAudioTraditionalMCQSop(response);
						});
						break;
					case FieldNames.optionAudioTraditional:
						formik.setFieldValue(FieldNames.optionAudioTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQSop(false);
							setOptionAudioTraditionalMCQSop(response);
						});
						break;
					default:
						break;
				}
			});
		}
	};

	const fileUpdateMCQSop = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileName = event.target.name;
		handleFileUploadMCQSop(event, type, fileName);
	}, []);

	/**
	 *
	 * @returns Method used for get validation for add/edit activity
	 */
	const getObjMCQSop = () => {
		const objMCQSop: ObjectShape = {
			[FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
			[FieldNames.imageSimplified]: imageSimplifiedMCQSop ? mixedNotRequired() : mixedRequired(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.audioSimplified]: audioSimplifiedMCQSop ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.optionSimplified]: simplifiedOptionalsListMCQSop.length ? stringNotRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioSimplified]: simplifiedOptionalsListMCQSop.length ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.correctAnswerSimplified]: correctAnswerSimplifiedMCQSop?.optionValue.length ? stringNotRequired() : stringTrim(Errors.PLEASE_SELECT_CORRECT_OPTION),
			[FieldNames.correctAnswerAudioSimplified]: correctAnswerSimplifiedMCQSop?.optionFileUrl.length ? mixedNotRequired() : mixedRequired(Errors.PLEASE_SELECT_CORRECT_AUDIO),
			[FieldNames.imageTraditional]: imageTraditionalMCQSop ? mixedNotRequired() : mixedRequired(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.audioTraditional]: audioTraditionalMCQSop ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.optionTraditional]: traditionalOptionalsListMCQSop.length ? stringNotRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioTraditional]: traditionalOptionalsListMCQSop.length ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.correctAnswerTraditional]: correctAnswerTraditionalMCQSop?.optionValue.length ? stringNotRequired() : stringTrim(Errors.PLEASE_SELECT_CORRECT_OPTION),
			[FieldNames.correctAnswerAudioTraditional]: correctAnswerTraditionalMCQSop?.optionFileUrl.length ? mixedNotRequired() : mixedRequired(Errors.PLEASE_SELECT_CORRECT_AUDIO),
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
		return Yup.object<ObjectShape>(objMCQSop);
	};
	const validationSchema = getObjMCQSop();
	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updatedData: MultipleChoiceActivitySubmitData = {
				isMoving: isMoving,
				levelId: moveData(isMoving, levelId as string, values.levelId as string),
				title: values.title.trim(),
				isForSop: true,
				traditionalQuestion: values.traditionalQuestionChinese?.map((item) => {
					return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim() };
				}),
				traditionalQuestionUrl: audioTraditionalMCQSop.split('/').pop() as string,
				traditionalImageUrl: imageTraditionalMCQSop.split('/').pop() as string,

				traditionalAnswer: { ...correctAnswerTraditionalMCQSop, optionFileUrl: correctAnswerTraditionalMCQSop.optionFileUrl.split('/').pop() as string },
				traditionalOptions: traditionalOptionalsListMCQSop?.map(({ optionFileUrl, ...rest }) => ({
					optionFileUrl: optionFileUrl.split('/').pop() as string,
					...rest,
				})),
				simplifiedAnswer: { ...correctAnswerSimplifiedMCQSop, optionFileUrl: correctAnswerSimplifiedMCQSop.optionFileUrl.split('/').pop() as string },
				simplifiedQuestion: values.simplifiedQuestionChinese?.map((item) => {
					return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim() };
				}),
				simplifiedImageUrl: imageSimplifiedMCQSop.split('/').pop() as string,
				simplifiedOptions: simplifiedOptionalsListMCQSop?.map(({ optionFileUrl, ...rest }) => ({
					optionFileUrl: optionFileUrl.split('/').pop() as string,
					...rest,
				})),
				simplifiedQuestionUrl: audioSimplifiedMCQSop.split('/').pop() as string,
				isSkippable: skipButtonCheckedMCQSop,
			};
			if (params.activityId) {
				setLoadingMCQSop(true);
				APIService.postData(`${url}/${activityPaths.mcqUpdate}/${params.activityId}?${activityPaths.isForSop}`, {
					activityId: params.activityId,
					...updatedData,
				})
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoadingMCQSop(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingMCQSop(false);
					});
			} else {
				setLoadingMCQSop(true);
				APIService.postData(`${url}/${activityPaths.mcq}?${activityPaths.isForSop}`, {
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
						setLoadingMCQSop(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingMCQSop(false);
					});
			}
		},
	});

	const simplifiedOptionsData = () => {
		setSimplifiedOptionalsListMCQSop((prev) => {
			const updatedData = prev?.map((item) => {
				if (item.optionId === editSimplifiedOptionMCQSop?.optionId) {
					const newData = {
						optionId: editSimplifiedOptionMCQSop?.optionId,
						optionValue: formik.values.optionSimplified,
						optionFileUrl: optionAudioSimplifiedMCQSop,
					};
					if (item.optionId === correctAnswerSimplifiedMCQSop.optionId) {
						setCorrectAnswerSimplifiedMCQSop(newData);
					}
					return { ...item, ...newData };
				} else {
					return item;
				}
			});
			if (!editSimplifiedOptionMCQSop) {
				updatedData?.push({
					optionId: generateUuid(),
					optionValue: formik.values.optionSimplified,
					optionFileUrl: optionAudioSimplifiedMCQSop,
				});
			}
			return updatedData;
		});
	};

	const addMoreOptionSimplified = useCallback(() => {
		if (simplifiedOptionalsListMCQSop.length > OPTION_LIMIT && !editSimplifiedOptionMCQSop) {
			return toast.error(Errors.MAX_OPTION);
		}
		if (formik.values.optionSimplified.trim() && optionAudioSimplifiedMCQSop) {
			simplifiedOptionsData();
			setOptionAudioSimplifiedMCQSop('');
			formik.setFieldValue(FieldNames.optionSimplified, '');
			formik.setFieldValue(FieldNames.optionAudioSimplified, '');
			resetInputManually([FieldNames.optionAudioSimplified]);
			setEditSimplifiedOptionMCQSop(null);
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
		validateFormMCQSop();
	}, [simplifiedOptionalsListMCQSop, editSimplifiedOptionMCQSop, correctAnswerSimplifiedMCQSop, formik]);

	const traditionalOptionsData = () => {
		setTraditionalOptionalsListMCQSop((prev) => {
			const updatedData = prev?.map((item) => {
				if (item.optionId === editTraditionalOptionMCQSop?.optionId) {
					const newData = {
						optionId: editTraditionalOptionMCQSop?.optionId,
						optionValue: formik.values.optionTraditional,
						optionFileUrl: optionAudioTraditionalMCQSop,
					};
					if (item.optionId === correctAnswerTraditionalMCQSop.optionId) {
						setCorrectAnswerTraditionalMCQSop(newData);
					}
					return { ...item, ...newData };
				} else {
					return item;
				}
			});
			if (!editTraditionalOptionMCQSop) {
				updatedData?.push({
					optionId: generateUuid(),
					optionValue: formik.values.optionTraditional,
					optionFileUrl: optionAudioTraditionalMCQSop,
				});
			}
			return updatedData;
		});
	};

	const addMoreOptionTraditional = useCallback(() => {
		if (traditionalOptionalsListMCQSop.length > OPTION_LIMIT && !editTraditionalOptionMCQSop) {
			return toast.error(Errors.MAX_OPTION);
		}
		if (formik.values.optionTraditional.trim() && optionAudioTraditionalMCQSop) {
			traditionalOptionsData();
			setOptionAudioTraditionalMCQSop('');
			formik.setFieldValue(FieldNames.optionTraditional, '');
			formik.setFieldValue(FieldNames.optionAudioTraditional, '');
			resetInputManually([FieldNames.optionAudioTraditional]);
			setEditTraditionalOptionMCQSop(null);
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
		validateFormMCQSop();
	}, [traditionalOptionalsListMCQSop, editTraditionalOptionMCQSop, correctAnswerTraditionalMCQSop, formik]);

	const validateFormMCQSop = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 500);
	};
	const traditionalDataMCQSop = () => {
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
	const copyDataMCQSop = useCallback(async () => {
		const traditionalMCQOptionsTranslateSop = await Promise.all(
			traditionalOptionalsListMCQSop.map(async (item) => {
				return {
					...item,
					optionValue: await translateText(item.optionValue, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data: string) => {
						return data ?? data;
					}),
				};
			})
		);

		if (imageTraditionalMCQSop !== '') {
			setImageSimplifiedMCQSop(imageTraditionalMCQSop);
			formik.setFieldValue(FieldNames.imageSimplified, formik.values.imageTraditional);
		}
		if (audioTraditionalMCQSop !== '') {
			formik.setFieldValue(FieldNames.audioSimplified, formik.values.audioTraditional);
			setAudioSimplifiedMCQSop(audioTraditionalMCQSop);
		}

		setCorrectAnswerSimplifiedMCQSop({
			...correctAnswerTraditionalMCQSop,
			optionValue: await translateText(correctAnswerTraditionalMCQSop.optionValue, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data: string) => {
				return data ?? data;
			}),
		});
		setSimplifiedOptionalsListMCQSop(traditionalMCQOptionsTranslateSop);

		formik.setFieldValue(FieldNames.simplifiedQuestionChinese, traditionalDataMCQSop());
		validateFormMCQSop();
	}, [formik]);

	const getErrorMCQSop = (fieldName: keyof CreateMultipleActivity) => {
		if (fieldName !== FieldNames.traditionalQuestionChinese && fieldName !== FieldNames.simplifiedQuestionChinese) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};

	const translateTraditionalFieldMCQSop = useCallback(
		(index: number) => {
			translateText(formik.values.traditionalQuestionChinese[index].chinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
				// traditional to english
				formik.setFieldValue(`traditionalQuestionChinese[${index}].english`, data ?? data);
				formik.setFieldValue(`traditionalQuestionChinese[${index}].pinyin`, formik.values.traditionalQuestionChinese[index].chinese);
			});
		},
		[formik]
	);

	const translateSimplifiedFieldMCQSop = useCallback(
		(index: number) => {
			translateText(formik.values.simplifiedQuestionChinese[index].chinese, ENGLISH_CODE, SIMPLIFIED_CHINESE_CODE).then((data) => {
				// Simplified to english
				formik.setFieldValue(`simplifiedQuestionChinese[${index}].english`, data ?? data);
				formik.setFieldValue(`simplifiedQuestionChinese[${index}].pinyin`, formik.values.simplifiedQuestionChinese[index].chinese);
			});
		},
		[formik]
	);

	const addMoreSimplifiedQuestionMCQSop = useCallback(() => {
		formik.setFieldValue('simplifiedQuestionChinese', [...formik.values.simplifiedQuestionChinese, { chinese: '', english: '', pinyin: '' }]);
	}, [formik]);

	const addMoreTraditionalQuestionMCQSop = useCallback(() => {
		formik.setFieldValue('traditionalQuestionChinese', [...formik.values.traditionalQuestionChinese, { chinese: '', english: '', pinyin: '' }]);
	}, [formik]);

	const editTraditionalRecordMCQSop = useCallback((data: optionObject) => {
		setEditTraditionalOptionMCQSop(data);
	}, []);

	const deleteTraditionalRecordMCQSop = useCallback(
		(data: optionObject) => {
			setTraditionalOptionalsListMCQSop(traditionalOptionalsListMCQSop?.filter((item) => item.optionId !== data.optionId));
			if (data.optionId === correctAnswerTraditionalMCQSop.optionId) {
				setCorrectAnswerTraditionalMCQSop(defaultOptionMCQSop);
			}
		},
		[traditionalOptionalsListMCQSop, correctAnswerTraditionalMCQSop]
	);

	const answerTraditionalMCQSop = useCallback((item: optionObject) => {
		setCorrectAnswerTraditionalMCQSop(item);
		validateFormMCQSop();
	}, []);

	const editSimplifiedRecordMCQSop = useCallback((data: optionObject) => {
		setEditSimplifiedOptionMCQSop(data);
	}, []);

	const deleteSimplifiedRecordMCQSop = useCallback(
		(data: optionObject) => {
			setSimplifiedOptionalsListMCQSop(simplifiedOptionalsListMCQSop?.filter((item) => item.optionId !== data.optionId));
			if (data.optionId === correctAnswerSimplifiedMCQSop.optionId) {
				setCorrectAnswerSimplifiedMCQSop(defaultOptionMCQSop);
			}
		},
		[simplifiedOptionalsListMCQSop, correctAnswerSimplifiedMCQSop]
	);

	const answerSimplifiedMCQSop = useCallback((item: optionObject) => {
		setCorrectAnswerSimplifiedMCQSop(item);
		validateFormMCQSop();
	}, []);

	return (
		<div>
			<FormikProvider value={formik}>
				<form className='w-full' onSubmit={formik.handleSubmit}>
					{loadingMCQSop && <Loader />}
					<div className='mb-3'>
						<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorMCQSop(FieldNames.title)} required />
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
													const chineseMCQSopTraditional = `traditionalQuestionChinese[${index}].chinese`;
													const englishMCQSopTraditional = `traditionalQuestionChinese[${index}].english`;
													const pinyinMCQSopTraditional = `traditionalQuestionChinese[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-1 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseMCQSopTraditional} onChange={formik.handleChange} label='Chinese' value={formik.values.traditionalQuestionChinese[index].chinese} error={getIn(formik.touched, chineseMCQSopTraditional) && getIn(formik.errors, chineseMCQSopTraditional) ? getIn(formik.errors, chineseMCQSopTraditional) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateTraditionalFieldMCQSop} isTranslate={true} title='Translate' />
																</div>
																<div className='w-full'>
																	<TextInput placeholder='Question english' name={englishMCQSopTraditional} onChange={formik.handleChange} label='English' value={formik.values.traditionalQuestionChinese[index].english} error={getIn(formik.touched, englishMCQSopTraditional) && getIn(formik.errors, englishMCQSopTraditional) ? getIn(formik.errors, englishMCQSopTraditional) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinMCQSopTraditional} onChange={formik.handleChange} label='Pinyin' value={formik.values.traditionalQuestionChinese[index].pinyin} error={getIn(formik.touched, pinyinMCQSopTraditional) && getIn(formik.errors, pinyinMCQSopTraditional) ? getIn(formik.errors, pinyinMCQSopTraditional) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.traditionalQuestionChinese.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalQuestionMCQSop}>
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
										imageSource={audioTraditionalMCQSop}
										accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
										name={FieldNames.audioTraditional}
										acceptNote='mp3, wav files only'
										uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
										onChange={useCallback((e) => {
											fileUpdateMCQSop(e, fileTypeEnum.audio);
										}, [])}
										error={getErrorMCQSop(FieldNames.audioTraditional) as string}
									/>
									{!isPercentageValidMCQSop(audioTraditionalPercentageMCQSop) && <LoadingPercentage percentage={audioTraditionalPercentageMCQSop} />}
								</div>
								<div className='mb-4'>
									<FileUpload
										labelName='Image'
										id={FieldNames.imageTraditional}
										imageSource={imageTraditionalMCQSop}
										accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`}
										name={FieldNames.imageTraditional}
										acceptNote={IMAGE_NOTE}
										uploadType={FILE_TYPE.jpegType || FILE_TYPE.jpgType || FILE_TYPE.pngType}
										onChange={useCallback((e) => {
											fileUpdateMCQSop(e, fileTypeEnum.image);
										}, [])}
										error={getErrorMCQSop(FieldNames.imageTraditional) as string}
									/>
									{!isPercentageValidMCQSop(imageTraditionalPercentageMCQSop) && <LoadingPercentage percentage={imageTraditionalPercentageMCQSop} />}
								</div>
								<h6 className='font-medium mb-2 col-span-2 '>Options</h6>

								<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
									<div className='mb-4 col-span-2'>
										<TextInput placeholder='option' name={FieldNames.optionTraditional} onChange={formik.handleChange} label='Option' value={formik.values.optionTraditional} error={getErrorMCQSop(FieldNames.optionTraditional)} required />
									</div>
									<div className='mb-4 col-span-3'>
										<FileUpload
											labelName='Audio'
											id={FieldNames.optionAudioTraditional}
											imageSource={optionAudioTraditionalMCQSop}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.optionAudioTraditional}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											onChange={useCallback((e) => {
												fileUpdateMCQSop(e, fileTypeEnum.audio);
											}, [])}
											error={getErrorMCQSop(FieldNames.optionAudioTraditional) as string}
										/>
										{!isPercentageValidMCQSop(optionAudioTraditionalPercentageMCQSop) && <LoadingPercentage percentage={optionAudioTraditionalPercentageMCQSop} />}
									</div>
									<div className=' flex items-center'>
										<Button className='btn-primary rounded-full' onClick={addMoreOptionTraditional}>
											{editTraditionalOptionMCQSop ? 'Update' : 'Add'}
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
											{traditionalOptionalsListMCQSop.map((item, index) => (
												<tr key={item.optionId}>
													<td className='w-10 text-center'>{index + 1}</td>
													<td className='w-24 font-medium'>{item.optionValue}</td>
													<td className='w-44'>
														<audio src={item.optionFileUrl} controls className='mb-3'>
															<track kind='captions' />
														</audio>
													</td>
													<td className='w-10'>
														<StatusButton data={item} status='' checked={correctAnswerTraditionalMCQSop?.optionId === item.optionId} isChangeStatusModal={answerTraditionalMCQSop} disable={!!editTraditionalOptionMCQSop} />
													</td>
													<td className='w-28'>
														<div className='flex gap-3'>
															<EditButton data={item} editRecord={editTraditionalRecordMCQSop} buttonSuccess={true} disable={editTraditionalOptionMCQSop?.optionId === item.optionId} />
															<DeleteButton data={item} isDeleteStatusModal={deleteTraditionalRecordMCQSop} btnDanger={true} disable={editTraditionalOptionMCQSop?.optionId === item.optionId} />
														</div>
													</td>
												</tr>
											))}

											{!traditionalOptionalsListMCQSop.length && (
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
										<TextInput placeholder='Correct answer' label='Correct Option' value={correctAnswerTraditionalMCQSop?.optionValue} error={getErrorMCQSop(FieldNames.correctAnswerTraditional)} required disabled />
									</div>
									<div className='mb-4'>
										<FileUpload
											labelName='Correct Audio'
											uploadNote={false}
											id={FieldNames.correctAnswerAudioTraditional}
											imageSource={correctAnswerTraditionalMCQSop?.optionFileUrl}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.correctAnswerAudioTraditional}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											onChange={useCallback((e) => {
												formik.handleChange(e);
											}, [])}
											error={getErrorMCQSop(FieldNames.correctAnswerAudioTraditional) as string}
											disabled
										/>
									</div>
								</div>
							</div>
						</div>
						<div className='flex flex-col justify-center items-center p-3'>
							<Button className='btn-default btn-large' title='Copy' onClick={copyDataMCQSop} disabled={disableUpdateMCQSop}>
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
													const chineseMCQSopSimplified = `simplifiedQuestionChinese[${index}].chinese`;
													const englishMCQSopSimplified = `simplifiedQuestionChinese[${index}].english`;
													const pinyinMCQSopSimplified = `simplifiedQuestionChinese[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-1 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseMCQSopSimplified} onChange={formik.handleChange} label='Chinese' value={formik.values.simplifiedQuestionChinese[index].chinese} error={getIn(formik.touched, chineseMCQSopSimplified) && getIn(formik.errors, chineseMCQSopSimplified) ? getIn(formik.errors, chineseMCQSopSimplified) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateSimplifiedFieldMCQSop} isTranslate={true} title='Translate' />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question english' name={englishMCQSopSimplified} onChange={formik.handleChange} label='English' value={formik.values.simplifiedQuestionChinese[index].english} error={getIn(formik.touched, englishMCQSopSimplified) && getIn(formik.errors, englishMCQSopSimplified) ? getIn(formik.errors, englishMCQSopSimplified) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinMCQSopSimplified} onChange={formik.handleChange} label='Pinyin' value={formik.values.simplifiedQuestionChinese[index].pinyin} error={getIn(formik.touched, pinyinMCQSopSimplified) && getIn(formik.errors, pinyinMCQSopSimplified) ? getIn(formik.errors, pinyinMCQSopSimplified) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.simplifiedQuestionChinese.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedQuestionMCQSop}>
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
										imageSource={audioSimplifiedMCQSop}
										accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
										name={FieldNames.audioSimplified}
										acceptNote='mp3, wav files only'
										uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
										onChange={useCallback((e) => {
											fileUpdateMCQSop(e, fileTypeEnum.audio);
										}, [])}
										error={getErrorMCQSop(FieldNames.audioSimplified) as string}
									/>
									{!isPercentageValidMCQSop(audioSimplifiedPercentageMCQSop) && <LoadingPercentage percentage={audioSimplifiedPercentageMCQSop} />}
								</div>
								<div className='mb-4'>
									<FileUpload
										labelName='Image'
										id={FieldNames.imageSimplified}
										imageSource={imageSimplifiedMCQSop}
										accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`}
										name={FieldNames.imageSimplified}
										acceptNote={IMAGE_NOTE}
										uploadType={FILE_TYPE.jpegType || FILE_TYPE.jpgType || FILE_TYPE.pngType}
										onChange={useCallback((e) => {
											fileUpdateMCQSop(e, fileTypeEnum.image);
										}, [])}
										error={getErrorMCQSop(FieldNames.imageSimplified) as string}
									/>
									{!isPercentageValidMCQSop(imageSimplifiedPercentageMCQSop) && <LoadingPercentage percentage={imageSimplifiedPercentageMCQSop} />}
								</div>
								<h6 className='font-medium mb-2 col-span-2 '>Options</h6>
								<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
									<div className='mb-4 col-span-2'>
										<TextInput placeholder='option' name={FieldNames.optionSimplified} onChange={formik.handleChange} label='Option' value={formik.values.optionSimplified} error={getErrorMCQSop(FieldNames.optionSimplified)} required />
									</div>
									<div className='mb-4 col-span-3'>
										<FileUpload
											labelName='Audio'
											id={FieldNames.optionAudioSimplified}
											imageSource={optionAudioSimplifiedMCQSop}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.optionAudioSimplified}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											onChange={useCallback((e) => {
												fileUpdateMCQSop(e, fileTypeEnum.audio);
											}, [])}
											error={getErrorMCQSop(FieldNames.optionAudioSimplified) as string}
										/>
										{!isPercentageValidMCQSop(optionAudioSimplifiedPercentMCQSop) && <LoadingPercentage percentage={optionAudioSimplifiedPercentMCQSop} />}
									</div>
									<div className='flex items-center'>
										<Button className='btn-primary rounded-full' onClick={addMoreOptionSimplified} disabled={!isPercentageValidMCQSop(optionAudioSimplifiedPercentMCQSop)}>
											{editSimplifiedOptionMCQSop ? 'Update' : 'Add'}
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
											{simplifiedOptionalsListMCQSop.map((item, index) => (
												<tr key={item.optionId}>
													<td className='w-10 text-center'>{index + 1}</td>
													<td className='w-24 font-medium'>{item.optionValue}</td>

													<td className='w-44'>
														<audio src={item.optionFileUrl} controls className='mb-3'>
															<track kind='captions' />
														</audio>
													</td>
													<td className='w-10'>
														<StatusButton data={item} status='' checked={correctAnswerSimplifiedMCQSop?.optionId === item.optionId} isChangeStatusModal={answerSimplifiedMCQSop} disable={!!editSimplifiedOptionMCQSop} />
													</td>
													<td className='w-28'>
														<div className='flex gap-3'>
															<EditButton data={item} editRecord={editSimplifiedRecordMCQSop} buttonSuccess={true} disable={editSimplifiedOptionMCQSop?.optionId === item.optionId} />
															<DeleteButton data={item} isDeleteStatusModal={deleteSimplifiedRecordMCQSop} btnDanger={true} disable={editSimplifiedOptionMCQSop?.optionId === item.optionId} />
														</div>
													</td>
												</tr>
											))}

											{!simplifiedOptionalsListMCQSop.length && (
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
										<TextInput placeholder='Correct answer' label='Correct Option' value={correctAnswerSimplifiedMCQSop?.optionValue} error={getErrorMCQSop(FieldNames.correctAnswerSimplified)} required disabled />
									</div>
									<div className='mb-4'>
										<FileUpload
											labelName='Correct Audio'
											uploadNote={false}
											id={FieldNames.correctAnswerAudioSimplified}
											imageSource={correctAnswerSimplifiedMCQSop?.optionFileUrl}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.correctAnswerAudioSimplified}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											onChange={useCallback((e) => {
												formik.handleChange(e);
											}, [])}
											error={getErrorMCQSop(FieldNames.correctAnswerAudioSimplified) as string}
											disabled
										/>
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
									checked: skipButtonCheckedMCQSop,

									name: 'Provide skip button for this activity',
									onChange() {
										setSkipButtonCheckedMCQSop((prev) => !prev);
									},
								},
							]}
						/>
						<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdateMCQSop}>
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

export default ActivityMultipleChoiceSop;
