import React, { useCallback, useEffect, useState } from 'react';
import { FieldArray, FormikProvider, getIn, useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import TextInput from '@components/textInput/TextInput';
import { MyArrayHelpers } from 'src/types/activities';
import CheckBox from '@components/checkbox/CheckBox';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { AngleRight, Plus } from '@components/icons';
import FileUpload from '@components/fileUpload/FileUpload';
import { IMAGE_NOTE, AUDIO_SIZE_MB, CHARACTERS_LIMIT, ENGLISH_CODE, FILE_TYPE, IMAGE_SIZE_MB, OPTION_LIMIT, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE, fileTypeEnum } from '@config/constant';
import { Errors } from '@config/errors';
import { useParams } from 'react-router-dom';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import { generateUuid, resetInputManually, translateText } from '@utils/helpers';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import { CreateMultipleActivity, MultipleChoiceActivitySubmitData, optionObject } from 'src/types/activities/multipleChoice';
import { Uploader } from '@views/activities/utils/upload';
import StatusButton from '@components/common/StatusButton';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import CommonButton from '@components/common/CommonButton';
import { FieldNames } from '@views/activities/ActivityMultipleChoice';
import { AddEditSeasonalActivityData } from 'src/types/seasonalTopics';

export const SeasonalActivityMultipleChoice = ({ onSubmit, onClose, url, activityUuid }: AddEditSeasonalActivityData) => {
	const defaultTraditionalFieldMCQSeasonal = { chinese: '', english: '', pinyin: '' };
	const defaultSimplifiedFieldMCQSeasonal = { chinese: '', english: '', pinyin: '' };
	const params = useParams();
	const [loadingMCQSeasonal, setLoadingMCQSeasonal] = useState<boolean>(false);
	const defaultOptionMCQSeasonal = { optionId: '', optionValue: '', optionFileUrl: '' };
	const [skipButtonCheckedMCQSeasonal, setSkipButtonCheckedMCQSeasonal] = useState<boolean>(false);

	const [imageSimplifiedMCQSeasonal, setImageSimplifiedMCQSeasonal] = useState<string>('');
	const [audioSimplifiedMCQSeasonal, setAudioSimplifiedMCQSeasonal] = useState<string>('');
	const [imageSimplifiedPercentageMCQSeasonal, setImageSimplifiedPercentageMCQSeasonal] = useState<number>(0);
	const [audioSimplifiedPercentageMCQSeasonal, setAudioSimplifiedPercentageMCQSeasonal] = useState<number>(0);
	const [optionAudioSimplifiedMCQSeasonal, setOptionAudioSimplifiedMCQSeasonal] = useState<string>('');
	const [optionAudioSimplifiedPercentMCQSeasonal, setOptionAudioSimplifiedPercentMCQSeasonal] = useState<number>(0);

	const [correctAnswerSimplifiedMCQSeasonal, setCorrectAnswerSimplifiedMCQSeasonal] = useState<optionObject>(defaultOptionMCQSeasonal);
	const [simplifiedOptionalsListMCQSeasonal, setSimplifiedOptionalsListMCQSeasonal] = useState<optionObject[]>([]);
	const [editSimplifiedOptionMCQSeasonal, setEditSimplifiedOptionMCQSeasonal] = useState<optionObject | null>(null);

	const [imageTraditionalMCQSeasonal, setImageTraditionalMCQSeasonal] = useState<string>('');
	const [audioTraditionalMCQSeasonal, setAudioTraditionalMCQSeasonal] = useState<string>('');
	const [imageTraditionalPercentageMCQSeasonal, setImageTraditionalPercentageMCQSeasonal] = useState<number>(0);
	const [audioTraditionalPercentageMCQSeasonal, setAudioTraditionalPercentageMCQSeasonal] = useState<number>(0);
	const [optionAudioTraditionalMCQSeasonal, setOptionAudioTraditionalMCQSeasonal] = useState<string>('');
	const [optionAudioTraditionalPercentageMCQSeasonal, setOptionAudioTraditionalPercentageMCQSeasonal] = useState<number>(0);

	const [traditionalOptionalsListMCQSeasonal, setTraditionalOptionalsListMCQSeasonal] = useState<optionObject[]>([]);
	const [editTraditionalOptionMCQSeasonal, setEditTraditionalOptionMCQSeasonal] = useState<optionObject | null>(null);
	const [correctAnswerTraditionalMCQSeasonal, setCorrectAnswerTraditionalMCQSeasonal] = useState<optionObject>(defaultOptionMCQSeasonal);

	const updatePercentageMCQSeasonal = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.imageSimplified:
				setImageSimplifiedPercentageMCQSeasonal(newPercentage);
				break;
			case FieldNames.imageTraditional:
				setImageTraditionalPercentageMCQSeasonal(newPercentage);
				break;
			case FieldNames.optionAudioSimplified:
				setOptionAudioSimplifiedPercentMCQSeasonal(newPercentage);
				break;
			case FieldNames.optionAudioTraditional:
				setOptionAudioTraditionalPercentageMCQSeasonal(newPercentage);
				break;
			case FieldNames.audioSimplified:
				setAudioSimplifiedPercentageMCQSeasonal(newPercentage);
				break;
			case FieldNames.audioTraditional:
				setAudioTraditionalPercentageMCQSeasonal(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidMCQSeasonal = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdateMCQSeasonal = !(isPercentageValidMCQSeasonal(imageSimplifiedPercentageMCQSeasonal) && isPercentageValidMCQSeasonal(imageTraditionalPercentageMCQSeasonal) && isPercentageValidMCQSeasonal(audioSimplifiedPercentageMCQSeasonal) && isPercentageValidMCQSeasonal(audioTraditionalPercentageMCQSeasonal) && isPercentageValidMCQSeasonal(optionAudioSimplifiedPercentMCQSeasonal) && isPercentageValidMCQSeasonal(optionAudioTraditionalPercentageMCQSeasonal));

	/**
	 *@returns Method used for setValue from questions data and get the details of question by uuid
	 */
	useEffect(() => {
		if (params.activityId) {
			setLoadingMCQSeasonal(true);
			APIService.getData(`${url}/mcq/${params.activityId}?isForSeasonal=true`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const responseData = response.data.data.activityData;
						formik.setFieldValue(FieldNames.title, responseData.title);
						setImageTraditionalMCQSeasonal(responseData.traditionalImageUrl);
						setAudioTraditionalMCQSeasonal(responseData.traditionalQuestionUrl);
						setTraditionalOptionalsListMCQSeasonal(responseData.traditionalOptions);
						setCorrectAnswerTraditionalMCQSeasonal(responseData.traditionalAnswer);
						formik.setFieldValue(FieldNames.traditionalQuestionChinese, responseData.traditionalQuestion);
						formik.setFieldValue(FieldNames.simplifiedQuestionChinese, responseData.simplifiedQuestion);

						setImageSimplifiedMCQSeasonal(responseData.simplifiedImageUrl);
						setAudioSimplifiedMCQSeasonal(responseData.simplifiedQuestionUrl);
						setSimplifiedOptionalsListMCQSeasonal(responseData.simplifiedOptions);
						setCorrectAnswerSimplifiedMCQSeasonal(responseData.simplifiedAnswer);
						setSkipButtonCheckedMCQSeasonal(responseData.isSkippable);
					} else {
						toast.error(response?.data?.message);
					}
					setLoadingMCQSeasonal(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingMCQSeasonal(false);
				});
		}
	}, []);

	useEffect(() => {
		if (editTraditionalOptionMCQSeasonal) {
			formik.setFieldValue(FieldNames.optionTraditional, editTraditionalOptionMCQSeasonal.optionValue);
			setOptionAudioTraditionalMCQSeasonal(editTraditionalOptionMCQSeasonal?.optionFileUrl);
		}
	}, [editTraditionalOptionMCQSeasonal]);

	useEffect(() => {
		if (editSimplifiedOptionMCQSeasonal) {
			formik.setFieldValue(FieldNames.optionSimplified, editSimplifiedOptionMCQSeasonal?.optionValue);
			setOptionAudioSimplifiedMCQSeasonal(editSimplifiedOptionMCQSeasonal?.optionFileUrl);
		}
	}, [editSimplifiedOptionMCQSeasonal]);

	const initialValues: CreateMultipleActivity = {
		lessonId: params?.lessonId as string,
		topicId: params?.topicId as string,
		activityTypeId: activityUuid,
		title: '',

		[FieldNames.traditionalQuestionChinese]: [defaultTraditionalFieldMCQSeasonal],
		[FieldNames.correctAnswerTraditional]: '',
		[FieldNames.correctAnswerAudioTraditional]: null,
		[FieldNames.imageTraditional]: null,
		[FieldNames.audioTraditional]: null,
		[FieldNames.optionTraditional]: '',
		[FieldNames.optionAudioTraditional]: null,

		simplifiedQuestionChinese: [defaultSimplifiedFieldMCQSeasonal],
		imageSimplified: null,
		audioSimplified: null,
		optionAudioSimplified: null,
		correctAnswerAudioSimplified: null,
		optionSimplified: '',
		correctAnswerSimplified: '',
		isSkippable: false,
	};

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const handleFileUploadMCQSeasonal = (event: React.ChangeEvent<HTMLInputElement>, type: string, fileName: string) => {
		const fileMCQSeasonal = event.target.files?.[0];
		if (fileMCQSeasonal === undefined) {
			return;
		}
		const fileSizeMCQSeasonal = type === fileTypeEnum.image ? IMAGE_SIZE_MB : AUDIO_SIZE_MB;
		const fileTypesMCQSeasonal = type === fileTypeEnum.image ? [FILE_TYPE.pngType, FILE_TYPE.jpgType, FILE_TYPE.jpegType] : [FILE_TYPE.audioType, FILE_TYPE.wavType];

		if (!fileTypesMCQSeasonal.includes(fileMCQSeasonal.type)) {
			setLoadingMCQSeasonal(false);
			toast.error(type === fileTypeEnum.image ? Errors.PLEASE_ALLOW_JPG_PNG_JPEG_FILE : Errors.PLEASE_ALLOW_MP3_WAV_FILE);
			return;
		}
		if (fileMCQSeasonal.size / 1000 / 1024 > fileSizeMCQSeasonal) {
			toast.error(`Uploaded ${type} size is greater than ${fileSizeMCQSeasonal}MB, please upload ${type} size within ${fileSizeMCQSeasonal}MB or max ${fileSizeMCQSeasonal}MB`);
		}
		const lastIndex = fileMCQSeasonal?.name?.lastIndexOf('.');
		const extension = fileMCQSeasonal?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileMCQSeasonal);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptions = {
					fileName: name,
					file: fileMCQSeasonal,
					isForSeasonal: true,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(imageUploaderOptions, updatePercentageMCQSeasonal);
				uploader.start();
				switch (fileName) {
					case FieldNames.imageSimplified:
						formik.setFieldValue(FieldNames.imageSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQSeasonal(false);
							setImageSimplifiedMCQSeasonal(response);
						});
						break;
					case FieldNames.imageTraditional:
						formik.setFieldValue(FieldNames.imageTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQSeasonal(false);
							setImageTraditionalMCQSeasonal(response);
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
			const blob = URL.createObjectURL(fileMCQSeasonal);
			audio.src = blob;
			audio.addEventListener('loadedmetadata', () => {
				const audioUploaderOptions = {
					fileName: name,
					file: fileMCQSeasonal,
					isForSeasonal: true,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(audioUploaderOptions, updatePercentageMCQSeasonal);
				uploader.start();
				switch (fileName) {
					case FieldNames.audioSimplified:
						formik.setFieldValue(FieldNames.audioSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQSeasonal(false);
							setAudioSimplifiedMCQSeasonal(response);
						});
						break;
					case FieldNames.optionAudioSimplified:
						formik.setFieldValue(FieldNames.optionAudioSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQSeasonal(false);
							setOptionAudioSimplifiedMCQSeasonal(response);
						});
						break;
					case FieldNames.audioTraditional:
						formik.setFieldValue(FieldNames.audioTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQSeasonal(false);
							setAudioTraditionalMCQSeasonal(response);
						});
						break;
					case FieldNames.optionAudioTraditional:
						formik.setFieldValue(FieldNames.optionAudioTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingMCQSeasonal(false);
							setOptionAudioTraditionalMCQSeasonal(response);
						});
						break;
					default:
						break;
				}
			});
		}
	};

	const fileUpdateMCQSeasonal = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileName = event.target.name;
		handleFileUploadMCQSeasonal(event, type, fileName);
	}, []);

	/**
	 *
	 * @returns Method used for get validation for add/edit activity
	 */
	const getObjMCQSeasonal = () => {
		const objMCQSeasonal: ObjectShape = {
			[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.simplifiedQuestionChinese]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.english]: Yup.string().trim().required(Errors.PLEASE_ENTER_QUESTION).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
					[FieldNames.chinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_QUESTION),
					[FieldNames.pinyin]: Yup.string().required(Errors.PLEASE_ENTER_QUESTION),
				})
			),
			[FieldNames.imageSimplified]: imageSimplifiedMCQSeasonal ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.audioSimplified]: audioSimplifiedMCQSeasonal ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),

			[FieldNames.optionSimplified]: simplifiedOptionalsListMCQSeasonal.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioSimplified]: simplifiedOptionalsListMCQSeasonal.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),

			[FieldNames.correctAnswerSimplified]: correctAnswerSimplifiedMCQSeasonal?.optionValue.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_SELECT_CORRECT_OPTION),
			[FieldNames.correctAnswerAudioSimplified]: correctAnswerSimplifiedMCQSeasonal?.optionFileUrl.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_CORRECT_AUDIO),

			[FieldNames.traditionalQuestionChinese]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_QUESTION),
					[FieldNames.pinyin]: Yup.string().required(Errors.PLEASE_ENTER_QUESTION),
					[FieldNames.english]: Yup.string().trim().required(Errors.PLEASE_ENTER_QUESTION).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
				})
			),
			[FieldNames.imageTraditional]: imageTraditionalMCQSeasonal ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.audioTraditional]: audioTraditionalMCQSeasonal ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),

			[FieldNames.optionTraditional]: traditionalOptionalsListMCQSeasonal.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioTraditional]: traditionalOptionalsListMCQSeasonal.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),

			[FieldNames.correctAnswerTraditional]: correctAnswerTraditionalMCQSeasonal?.optionValue.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_SELECT_CORRECT_OPTION),
			[FieldNames.correctAnswerAudioTraditional]: correctAnswerTraditionalMCQSeasonal?.optionFileUrl.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_CORRECT_AUDIO),
		};
		return Yup.object<ObjectShape>(objMCQSeasonal);
	};
	const validationSchema = getObjMCQSeasonal();
	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updatedData: MultipleChoiceActivitySubmitData = {
				title: values.title.trim(),
				isForSeasonal: true,
				traditionalQuestion: values.traditionalQuestionChinese?.map((item) => {
					return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim() };
				}),
				traditionalQuestionUrl: audioTraditionalMCQSeasonal.split('/').pop() as string,
				traditionalImageUrl: imageTraditionalMCQSeasonal.split('/').pop() as string,

				traditionalAnswer: { ...correctAnswerTraditionalMCQSeasonal, optionFileUrl: correctAnswerTraditionalMCQSeasonal.optionFileUrl.split('/').pop() as string },
				traditionalOptions: traditionalOptionalsListMCQSeasonal?.map(({ optionFileUrl, ...rest }) => ({
					optionFileUrl: optionFileUrl.split('/').pop() as string,
					...rest,
				})),
				simplifiedAnswer: { ...correctAnswerSimplifiedMCQSeasonal, optionFileUrl: correctAnswerSimplifiedMCQSeasonal.optionFileUrl.split('/').pop() as string },
				simplifiedQuestion: values.simplifiedQuestionChinese?.map((item) => {
					return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim() };
				}),
				simplifiedImageUrl: imageSimplifiedMCQSeasonal.split('/').pop() as string,
				simplifiedOptions: simplifiedOptionalsListMCQSeasonal?.map(({ optionFileUrl, ...rest }) => ({
					optionFileUrl: optionFileUrl.split('/').pop() as string,
					...rest,
				})),
				simplifiedQuestionUrl: audioSimplifiedMCQSeasonal.split('/').pop() as string,
				isSkippable: skipButtonCheckedMCQSeasonal,
			};
			if (params.activityId) {
				setLoadingMCQSeasonal(true);
				APIService.postData(`${url}/mcq-update/${params.activityId}?isForSeasonal=true`, {
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
						setLoadingMCQSeasonal(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingMCQSeasonal(false);
					});
			} else {
				setLoadingMCQSeasonal(true);
				APIService.postData(`${url}/mcq?isForSeasonal=true`, {
					topicId: values.topicId,
					lessonId: values.lessonId,
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
						setLoadingMCQSeasonal(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingMCQSeasonal(false);
					});
			}
		},
	});

	const simplifiedOptionsDataMCQSeasonal = () => {
		setSimplifiedOptionalsListMCQSeasonal((prev) => {
			const updatedData = prev?.map((item) => {
				if (item.optionId === editSimplifiedOptionMCQSeasonal?.optionId) {
					const newData = {
						optionId: editSimplifiedOptionMCQSeasonal?.optionId,
						optionValue: formik.values.optionSimplified,
						optionFileUrl: optionAudioSimplifiedMCQSeasonal,
					};
					if (item.optionId === correctAnswerSimplifiedMCQSeasonal.optionId) {
						setCorrectAnswerSimplifiedMCQSeasonal(newData);
					}
					return { ...item, ...newData };
				} else {
					return item;
				}
			});
			if (!editSimplifiedOptionMCQSeasonal) {
				updatedData?.push({
					optionId: generateUuid(),
					optionValue: formik.values.optionSimplified,
					optionFileUrl: optionAudioSimplifiedMCQSeasonal,
				});
			}
			return updatedData;
		});
	};

	const addMoreOptionSimplified = useCallback(() => {
		if (simplifiedOptionalsListMCQSeasonal.length > OPTION_LIMIT && !editSimplifiedOptionMCQSeasonal) {
			return toast.error(Errors.MAX_OPTION);
		}
		if (formik.values.optionSimplified.trim() && optionAudioSimplifiedMCQSeasonal) {
			simplifiedOptionsDataMCQSeasonal();
			setOptionAudioSimplifiedMCQSeasonal('');
			formik.setFieldValue(FieldNames.optionSimplified, '');
			formik.setFieldValue(FieldNames.optionAudioSimplified, '');
			resetInputManually([FieldNames.optionAudioSimplified]);
			setEditSimplifiedOptionMCQSeasonal(null);
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
		validateFormMCQSeasonal();
	}, [simplifiedOptionalsListMCQSeasonal, editSimplifiedOptionMCQSeasonal, correctAnswerSimplifiedMCQSeasonal, formik]);

	const traditionalOptionsData = () => {
		setTraditionalOptionalsListMCQSeasonal((prev) => {
			const updatedData = prev?.map((item) => {
				if (item.optionId === editTraditionalOptionMCQSeasonal?.optionId) {
					const newData = {
						optionId: editTraditionalOptionMCQSeasonal?.optionId,
						optionValue: formik.values.optionTraditional,
						optionFileUrl: optionAudioTraditionalMCQSeasonal,
					};
					if (item.optionId === correctAnswerTraditionalMCQSeasonal.optionId) {
						setCorrectAnswerTraditionalMCQSeasonal(newData);
					}
					return { ...item, ...newData };
				} else {
					return item;
				}
			});
			if (!editTraditionalOptionMCQSeasonal) {
				updatedData?.push({
					optionId: generateUuid(),
					optionValue: formik.values.optionTraditional,
					optionFileUrl: optionAudioTraditionalMCQSeasonal,
				});
			}
			return updatedData;
		});
	};

	const addMoreOptionTraditional = useCallback(() => {
		if (traditionalOptionalsListMCQSeasonal.length > OPTION_LIMIT && !editTraditionalOptionMCQSeasonal) {
			return toast.error(Errors.MAX_OPTION);
		}
		if (formik.values.optionTraditional.trim() && optionAudioTraditionalMCQSeasonal) {
			traditionalOptionsData();
			setOptionAudioTraditionalMCQSeasonal('');
			formik.setFieldValue(FieldNames.optionTraditional, '');
			formik.setFieldValue(FieldNames.optionAudioTraditional, '');
			resetInputManually([FieldNames.optionAudioTraditional]);
			setEditTraditionalOptionMCQSeasonal(null);
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
		validateFormMCQSeasonal();
	}, [traditionalOptionalsListMCQSeasonal, editTraditionalOptionMCQSeasonal, correctAnswerTraditionalMCQSeasonal, formik]);

	const validateFormMCQSeasonal = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 500);
	};
	const copyDataMCQSeasonal = useCallback(() => {
		const traditionalDataMCQSeasonal = () => {
			if (formik.values.traditionalQuestionChinese.length === 1) {
				const traditional = formik.values.traditionalQuestionChinese[0];
				const simplified = formik.values.simplifiedQuestionChinese[0];

				if (traditional.chinese.trim() !== '' && traditional.english.trim() !== '' && traditional.pinyin.trim() !== '') {
					return formik.values.traditionalQuestionChinese.map((item) => ({ ...item }));
				} else {
					return [{ [FieldNames.chinese]: simplified.chinese, [FieldNames.english]: simplified.english, [FieldNames.pinyin]: simplified.pinyin }];
				}
			} else {
				return formik.values.traditionalQuestionChinese.map((item) => ({ ...item }));
			}
		};
		if (imageTraditionalMCQSeasonal !== '') {
			setImageSimplifiedMCQSeasonal(imageTraditionalMCQSeasonal);
			formik.setFieldValue(FieldNames.imageSimplified, formik.values.imageTraditional);
		}
		if (audioTraditionalMCQSeasonal !== '') {
			formik.setFieldValue(FieldNames.audioSimplified, formik.values.audioTraditional);
			setAudioSimplifiedMCQSeasonal(audioTraditionalMCQSeasonal);
		}
		setCorrectAnswerSimplifiedMCQSeasonal(correctAnswerTraditionalMCQSeasonal);
		setSimplifiedOptionalsListMCQSeasonal(traditionalOptionalsListMCQSeasonal);
		formik.setFieldValue(FieldNames.simplifiedQuestionChinese, traditionalDataMCQSeasonal());
		validateFormMCQSeasonal();
	}, [formik]);

	const getErrorMCQSeasonal = (fieldName: keyof CreateMultipleActivity) => {
		if (fieldName !== FieldNames.traditionalQuestionChinese && fieldName !== FieldNames.simplifiedQuestionChinese) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};

	const translateTraditionalFieldMCQSeasonal = useCallback(
		(index: number) => {
			translateText(formik.values.traditionalQuestionChinese[index].chinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
				// traditional to english
				formik.setFieldValue(`traditionalQuestionChinese[${index}].english`, data ?? data);
				formik.setFieldValue(`traditionalQuestionChinese[${index}].pinyin`, formik.values.traditionalQuestionChinese[index].chinese);
			});
		},
		[formik]
	);

	const translateSimplifiedFieldMCQSeasonal = useCallback(
		(index: number) => {
			translateText(formik.values.simplifiedQuestionChinese[index].chinese, ENGLISH_CODE, SIMPLIFIED_CHINESE_CODE).then((data) => {
				// Simplified to english
				formik.setFieldValue(`simplifiedQuestionChinese[${index}].english`, data ?? data);
				formik.setFieldValue(`simplifiedQuestionChinese[${index}].pinyin`, formik.values.simplifiedQuestionChinese[index].chinese);
			});
		},
		[formik]
	);

	const addMoreSimplifiedQuestionMCQSeasonal = useCallback(() => {
		formik.setFieldValue('simplifiedQuestionChinese', [...formik.values.simplifiedQuestionChinese, { chinese: '', english: '', pinyin: '' }]);
	}, [formik]);

	const addMoreTraditionalQuestionMCQSeasonal = useCallback(() => {
		formik.setFieldValue('traditionalQuestionChinese', [...formik.values.traditionalQuestionChinese, { chinese: '', english: '', pinyin: '' }]);
	}, [formik]);

	const editTraditionalRecordMCQSeasonal = useCallback((data: optionObject) => {
		setEditTraditionalOptionMCQSeasonal(data);
	}, []);

	const deleteTraditionalRecordMCQSeasonal = useCallback(
		(data: optionObject) => {
			setTraditionalOptionalsListMCQSeasonal(traditionalOptionalsListMCQSeasonal?.filter((item) => item.optionId !== data.optionId));
			if (data.optionId === correctAnswerTraditionalMCQSeasonal.optionId) {
				setCorrectAnswerTraditionalMCQSeasonal(defaultOptionMCQSeasonal);
			}
		},
		[traditionalOptionalsListMCQSeasonal, correctAnswerTraditionalMCQSeasonal]
	);

	const answerTraditional = useCallback((item: optionObject) => {
		setCorrectAnswerTraditionalMCQSeasonal(item);
		validateFormMCQSeasonal();
	}, []);

	const editSimplifiedRecord = useCallback((data: optionObject) => {
		setEditSimplifiedOptionMCQSeasonal(data);
	}, []);

	const deleteSimplifiedRecord = useCallback(
		(data: optionObject) => {
			setSimplifiedOptionalsListMCQSeasonal(simplifiedOptionalsListMCQSeasonal?.filter((item) => item.optionId !== data.optionId));
			if (data.optionId === correctAnswerSimplifiedMCQSeasonal.optionId) {
				setCorrectAnswerSimplifiedMCQSeasonal(defaultOptionMCQSeasonal);
			}
		},
		[simplifiedOptionalsListMCQSeasonal, correctAnswerSimplifiedMCQSeasonal]
	);

	const answerSimplified = useCallback((item: optionObject) => {
		setCorrectAnswerSimplifiedMCQSeasonal(item);
		validateFormMCQSeasonal();
	}, []);

	return (
		<div>
			<FormikProvider value={formik}>
				<form className='w-full' onSubmit={formik.handleSubmit}>
					{loadingMCQSeasonal && <Loader />}
					<div className='mb-3'>
						<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorMCQSeasonal(FieldNames.title)} required />
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
												{formik.values.traditionalQuestionChinese?.map((duplicate, index) => {
													const chineseMCQSeasonalTraditional = `traditionalQuestionChinese[${index}].chinese`;
													const englishMCQSeasonalTraditional = `traditionalQuestionChinese[${index}].english`;
													const pinyinMCQSeasonalTraditional = `traditionalQuestionChinese[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-1 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseMCQSeasonalTraditional} onChange={formik.handleChange} label='Chinese' value={formik.values.traditionalQuestionChinese[index].chinese} error={getIn(formik.touched, chineseMCQSeasonalTraditional) && getIn(formik.errors, chineseMCQSeasonalTraditional) ? getIn(formik.errors, chineseMCQSeasonalTraditional) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateTraditionalFieldMCQSeasonal} isTranslate={true} title='Translate' />
																</div>
																<div className='w-full'>
																	<TextInput placeholder='Question english' name={englishMCQSeasonalTraditional} onChange={formik.handleChange} label='English' value={formik.values.traditionalQuestionChinese[index].english} error={getIn(formik.touched, englishMCQSeasonalTraditional) && getIn(formik.errors, englishMCQSeasonalTraditional) ? getIn(formik.errors, englishMCQSeasonalTraditional) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinMCQSeasonalTraditional} onChange={formik.handleChange} label='Pinyin' value={formik.values.traditionalQuestionChinese[index].pinyin} error={getIn(formik.touched, pinyinMCQSeasonalTraditional) && getIn(formik.errors, pinyinMCQSeasonalTraditional) ? getIn(formik.errors, pinyinMCQSeasonalTraditional) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.traditionalQuestionChinese.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalQuestionMCQSeasonal}>
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
										imageSource={audioTraditionalMCQSeasonal}
										accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
										name={FieldNames.audioTraditional}
										acceptNote='mp3, wav files only'
										uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
										onChange={useCallback((e) => {
											fileUpdateMCQSeasonal(e, fileTypeEnum.audio);
										}, [])}
										error={getErrorMCQSeasonal(FieldNames.audioTraditional) as string}
									/>
									{!isPercentageValidMCQSeasonal(audioTraditionalPercentageMCQSeasonal) && <LoadingPercentage percentage={audioTraditionalPercentageMCQSeasonal} />}
								</div>
								<div className='mb-4'>
									<FileUpload
										labelName='Image'
										id={FieldNames.imageTraditional}
										imageSource={imageTraditionalMCQSeasonal}
										accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`}
										name={FieldNames.imageTraditional}
										acceptNote={IMAGE_NOTE}
										uploadType={FILE_TYPE.jpegType || FILE_TYPE.jpgType || FILE_TYPE.pngType}
										onChange={useCallback((e) => {
											fileUpdateMCQSeasonal(e, fileTypeEnum.image);
										}, [])}
										error={getErrorMCQSeasonal(FieldNames.imageTraditional) as string}
									/>
									{!isPercentageValidMCQSeasonal(imageTraditionalPercentageMCQSeasonal) && <LoadingPercentage percentage={imageTraditionalPercentageMCQSeasonal} />}
								</div>
								<h6 className='font-medium mb-2 col-span-2 '>Options</h6>

								<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
									<div className='mb-4 col-span-2'>
										<TextInput placeholder='option' name={FieldNames.optionTraditional} onChange={formik.handleChange} label='Option' value={formik.values.optionTraditional} error={getErrorMCQSeasonal(FieldNames.optionTraditional)} required />
									</div>
									<div className='mb-4 col-span-3'>
										<FileUpload
											labelName='Audio'
											id={FieldNames.optionAudioTraditional}
											imageSource={optionAudioTraditionalMCQSeasonal}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.optionAudioTraditional}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											onChange={useCallback((e) => {
												fileUpdateMCQSeasonal(e, fileTypeEnum.audio);
											}, [])}
											error={getErrorMCQSeasonal(FieldNames.optionAudioTraditional) as string}
										/>
										{!isPercentageValidMCQSeasonal(optionAudioTraditionalPercentageMCQSeasonal) && <LoadingPercentage percentage={optionAudioTraditionalPercentageMCQSeasonal} />}
									</div>
									<div className=' flex items-center'>
										<Button className='btn-primary rounded-full' onClick={addMoreOptionTraditional}>
											{editTraditionalOptionMCQSeasonal ? 'Update' : 'Add'}
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
											{traditionalOptionalsListMCQSeasonal.map((item, index) => (
												<tr key={item.optionId}>
													<td className='w-10 text-center'>{index + 1}</td>
													<td className='w-24 font-medium'>{item.optionValue}</td>
													<td className='w-44'>
														<audio src={item.optionFileUrl} controls className='mb-3'></audio>
													</td>
													<td className='w-10'>
														<StatusButton data={item} status='' checked={correctAnswerTraditionalMCQSeasonal?.optionId === item.optionId} isChangeStatusModal={answerTraditional} disable={!!editTraditionalOptionMCQSeasonal} />
													</td>
													<td className='w-28'>
														<div className='flex gap-3'>
															<EditButton data={item} editRecord={editTraditionalRecordMCQSeasonal} buttonSuccess={true} disable={editTraditionalOptionMCQSeasonal?.optionId === item.optionId} />
															<DeleteButton data={item} isDeleteStatusModal={deleteTraditionalRecordMCQSeasonal} btnDanger={true} disable={editTraditionalOptionMCQSeasonal?.optionId === item.optionId} />
														</div>
													</td>
												</tr>
											))}

											{!traditionalOptionalsListMCQSeasonal.length && (
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
										<TextInput placeholder='Correct answer' label='Correct Option' value={correctAnswerTraditionalMCQSeasonal?.optionValue} error={getErrorMCQSeasonal(FieldNames.correctAnswerTraditional)} required disabled />
									</div>
									<div className='mb-4'>
										<FileUpload
											labelName='Correct Audio'
											uploadNote={false}
											id={FieldNames.correctAnswerAudioTraditional}
											imageSource={correctAnswerTraditionalMCQSeasonal?.optionFileUrl}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.correctAnswerAudioTraditional}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											onChange={useCallback((e) => {
												formik.handleChange(e);
											}, [])}
											error={getErrorMCQSeasonal(FieldNames.correctAnswerAudioTraditional) as string}
											disabled
										/>
									</div>
								</div>
							</div>
						</div>
						<div className='flex flex-col justify-center items-center p-3'>
							<Button className='btn-default btn-large' title='Copy' onClick={copyDataMCQSeasonal} disabled={disableUpdateMCQSeasonal}>
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
												{formik.values.simplifiedQuestionChinese?.map((duplicate, index) => {
													const chineseMCQSeasonalSimplified = `simplifiedQuestionChinese[${index}].chinese`;
													const englishMCQSeasonalSimplified = `simplifiedQuestionChinese[${index}].english`;
													const pinyinMCQSeasonalSimplified = `simplifiedQuestionChinese[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-1 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseMCQSeasonalSimplified} onChange={formik.handleChange} label='Chinese' value={formik.values.simplifiedQuestionChinese[index].chinese} error={getIn(formik.touched, chineseMCQSeasonalSimplified) && getIn(formik.errors, chineseMCQSeasonalSimplified) ? getIn(formik.errors, chineseMCQSeasonalSimplified) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateSimplifiedFieldMCQSeasonal} isTranslate={true} title='Translate' />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question english' name={englishMCQSeasonalSimplified} onChange={formik.handleChange} label='English' value={formik.values.simplifiedQuestionChinese[index].english} error={getIn(formik.touched, englishMCQSeasonalSimplified) && getIn(formik.errors, englishMCQSeasonalSimplified) ? getIn(formik.errors, englishMCQSeasonalSimplified) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinMCQSeasonalSimplified} onChange={formik.handleChange} label='Pinyin' value={formik.values.simplifiedQuestionChinese[index].pinyin} error={getIn(formik.touched, pinyinMCQSeasonalSimplified) && getIn(formik.errors, pinyinMCQSeasonalSimplified) ? getIn(formik.errors, pinyinMCQSeasonalSimplified) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.simplifiedQuestionChinese.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedQuestionMCQSeasonal}>
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
										imageSource={audioSimplifiedMCQSeasonal}
										accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
										name={FieldNames.audioSimplified}
										acceptNote='mp3, wav files only'
										uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
										onChange={useCallback((e) => {
											fileUpdateMCQSeasonal(e, fileTypeEnum.audio);
										}, [])}
										error={getErrorMCQSeasonal(FieldNames.audioSimplified) as string}
									/>
									{!isPercentageValidMCQSeasonal(audioSimplifiedPercentageMCQSeasonal) && <LoadingPercentage percentage={audioSimplifiedPercentageMCQSeasonal} />}
								</div>
								<div className='mb-4'>
									<FileUpload
										labelName='Image'
										id={FieldNames.imageSimplified}
										imageSource={imageSimplifiedMCQSeasonal}
										accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`}
										name={FieldNames.imageSimplified}
										acceptNote={IMAGE_NOTE}
										uploadType={FILE_TYPE.jpegType || FILE_TYPE.jpgType || FILE_TYPE.pngType}
										onChange={useCallback((e) => {
											fileUpdateMCQSeasonal(e, fileTypeEnum.image);
										}, [])}
										error={getErrorMCQSeasonal(FieldNames.imageSimplified) as string}
									/>
									{!isPercentageValidMCQSeasonal(imageSimplifiedPercentageMCQSeasonal) && <LoadingPercentage percentage={imageSimplifiedPercentageMCQSeasonal} />}
								</div>
								<h6 className='font-medium mb-2 col-span-2 '>Options</h6>
								<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
									<div className='mb-4 col-span-2'>
										<TextInput placeholder='option' name={FieldNames.optionSimplified} onChange={formik.handleChange} label='Option' value={formik.values.optionSimplified} error={getErrorMCQSeasonal(FieldNames.optionSimplified)} required />
									</div>
									<div className='mb-4 col-span-3'>
										<FileUpload
											labelName='Audio'
											id={FieldNames.optionAudioSimplified}
											imageSource={optionAudioSimplifiedMCQSeasonal}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.optionAudioSimplified}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											onChange={useCallback((e) => {
												fileUpdateMCQSeasonal(e, fileTypeEnum.audio);
											}, [])}
											error={getErrorMCQSeasonal(FieldNames.optionAudioSimplified) as string}
										/>
										{!isPercentageValidMCQSeasonal(optionAudioSimplifiedPercentMCQSeasonal) && <LoadingPercentage percentage={optionAudioSimplifiedPercentMCQSeasonal} />}
									</div>
									<div className='flex items-center'>
										<Button className='btn-primary rounded-full' onClick={addMoreOptionSimplified} disabled={!isPercentageValidMCQSeasonal(optionAudioSimplifiedPercentMCQSeasonal)}>
											{editSimplifiedOptionMCQSeasonal ? 'Update' : 'Add'}
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
											{simplifiedOptionalsListMCQSeasonal.map((item, index) => (
												<tr key={item.optionId}>
													<td className='w-10 text-center'>{index + 1}</td>
													<td className='w-24 font-medium'>{item.optionValue}</td>

													<td className='w-44'>
														<audio src={item.optionFileUrl} controls className='mb-3'></audio>
													</td>
													<td className='w-10'>
														<StatusButton data={item} status='' checked={correctAnswerSimplifiedMCQSeasonal?.optionId === item.optionId} isChangeStatusModal={answerSimplified} disable={!!editSimplifiedOptionMCQSeasonal} />
													</td>
													<td className='w-28'>
														<div className='flex gap-3'>
															<EditButton data={item} editRecord={editSimplifiedRecord} buttonSuccess={true} disable={editSimplifiedOptionMCQSeasonal?.optionId === item.optionId} />
															<DeleteButton data={item} isDeleteStatusModal={deleteSimplifiedRecord} btnDanger={true} disable={editSimplifiedOptionMCQSeasonal?.optionId === item.optionId} />
														</div>
													</td>
												</tr>
											))}

											{!simplifiedOptionalsListMCQSeasonal.length && (
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
										<TextInput placeholder='Correct answer' label='Correct Option' value={correctAnswerSimplifiedMCQSeasonal?.optionValue} error={getErrorMCQSeasonal(FieldNames.correctAnswerSimplified)} required disabled />
									</div>
									<div className='mb-4'>
										<FileUpload
											labelName='Correct Audio'
											uploadNote={false}
											id={FieldNames.correctAnswerAudioSimplified}
											imageSource={correctAnswerSimplifiedMCQSeasonal?.optionFileUrl}
											accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`}
											name={FieldNames.correctAnswerAudioSimplified}
											acceptNote='mp3, wav files only'
											uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType}
											onChange={useCallback((e) => {
												formik.handleChange(e);
											}, [])}
											error={getErrorMCQSeasonal(FieldNames.correctAnswerAudioSimplified) as string}
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
									checked: skipButtonCheckedMCQSeasonal,

									name: 'Provide skip button for this activity',
									onChange() {
										setSkipButtonCheckedMCQSeasonal((prev) => !prev);
									},
								},
							]}
						/>
						<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdateMCQSeasonal}>
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

export default SeasonalActivityMultipleChoice;
