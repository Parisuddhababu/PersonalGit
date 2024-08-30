import React, { useCallback, useEffect, useState } from 'react';
import { FieldArray, FormikProvider, getIn, useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import TextInput from '@components/textInput/TextInput';
import { AddEditActivitiesData, MyArrayHelpers } from 'src/types/activities';
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
import { CreateFillBlanksActivity, FillInTheBlanksActivitySubmitData, optionObject } from 'src/types/activities/fillInTheBlanks';
import { generateUuid, resetInputManually, translateText } from '@utils/helpers';
import { Uploader } from './utils/upload';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import StatusButton from '@components/common/StatusButton';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import CommonButton from '@components/common/CommonButton';

export enum FieldNames {
	activityTypeId = 'activityTypeId',
	simplifiedQuestionChinese = 'simplifiedQuestionChinese',
	imageSimplified = 'imageSimplified',
	audioSimplified = 'audioSimplified',
	optionSimplified = 'optionSimplified',
	optionAudioSimplified = 'optionAudioSimplified',
	correctAnswerSimplified = 'correctAnswerSimplified',
	traditionalQuestionChinese = 'traditionalQuestionChinese',
	imageTraditional = 'imageTraditional',
	audioTraditional = 'audioTraditional',
	optionTraditional = 'optionTraditional',
	optionAudioTraditional = 'optionAudioTraditional',
	correctAnswerTraditional = 'correctAnswerTraditional',
	correctAnswerAudioSimplified = 'correctAnswerAudioSimplified',
	correctAnswerAudioTraditional = 'correctAnswerAudioTraditional',
	title = 'title',
	isSkippable = 'isSkippable',
	chinese = 'chinese',
	pinyin = 'pinyin',
	english = 'english',
	traditionalCompleteActivityAudio = 'traditionalCompleteActivityAudio',
	simplifiedCompleteActivityAudio = 'simplifiedCompleteActivityAudio',
}

export const ActivityFillInTheBlanks = ({ onSubmit, onClose, url, activityUuid }: AddEditActivitiesData) => {
	const defaultTraditionalFieldBlanks = { chinese: '', english: '', pinyin: '' };
	const defaultSimplifiedFieldBlanks = { chinese: '', english: '', pinyin: '' };
	const params = useParams();
	const [loadingBlanks, setLoadingBlanks] = useState<boolean>(false);
	const defaultOptionBlanks = { optionId: '', optionValue: '', optionFileUrl: '' };
	const [skipButtonCheckedBlanks, setSkipButtonCheckedBlanks] = useState<boolean>(false);

	const [imageSimplifiedBlanks, setImageSimplifiedBlanks] = useState<string>('');
	const [audioSimplifiedBlanks, setAudioSimplifiedBlanks] = useState<string>('');
	const [imageSimplifiedBlanksPercentage, setImageSimplifiedBlanksPercentage] = useState<number>(0);
	const [audioSimplifiedBlanksPercentage, setAudioSimplifiedBlanksPercentage] = useState<number>(0);
	const [optionAudioSimplifiedBlanks, setOptionAudioSimplifiedBlanks] = useState<string>('');
	const [optionAudioSimplifiedBlanksPercent, setOptionAudioSimplifiedBlanksPercent] = useState<number>(0);

	const [correctAnswerSimplifiedBlanks, setCorrectAnswerSimplifiedBlanks] = useState<optionObject>(defaultOptionBlanks);
	const [simplifiedOptionalsListBlanks, setSimplifiedOptionalsListBlanks] = useState<optionObject[]>([]);
	const [editSimplifiedOptionBlanks, setEditSimplifiedOptionBlanks] = useState<optionObject | null>(null);

	const [imageTraditionalBlanks, setImageTraditionalBlanks] = useState<string>('');
	const [audioTraditionalBlanks, setAudioTraditionalBlanks] = useState<string>('');
	const [imageTraditionalBlanksPercentage, setImageTraditionalBlanksPercentage] = useState<number>(0);
	const [audioTraditionalBlanksPercentage, setAudioTraditionalBlanksPercentage] = useState<number>(0);
	const [optionAudioTraditionalBlanks, setOptionAudioTraditionalBlanks] = useState<string>('');
	const [optionAudioTraditionalBlanksPercentage, setOptionAudioTraditionalBlanksPercentage] = useState<number>(0);

	const [traditionalOptionalsListBlanks, setTraditionalOptionalsListBlanks] = useState<optionObject[]>([]);
	const [editTraditionalOptionBlanks, setEditTraditionalOptionBlanks] = useState<optionObject | null>(null);
	const [correctAnswerTraditionalBlanks, setCorrectAnswerTraditionalBlanks] = useState<optionObject>(defaultOptionBlanks);
	const [traditionalCompleteActivityAudioBlanks, setTraditionalCompleteActivityAudioBlanks] = useState<number>(0);
	const [simplifiedCompleteActivityAudioBlanks, setSimplifiedCompleteActivityAudioBlanks] = useState<number>(0);

	const updatePercentageBlanks = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.imageSimplified:
				setImageSimplifiedBlanksPercentage(newPercentage);
				break;
			case FieldNames.imageTraditional:
				setImageTraditionalBlanksPercentage(newPercentage);
				break;
			case FieldNames.optionAudioSimplified:
				setOptionAudioSimplifiedBlanksPercent(newPercentage);
				break;
			case FieldNames.optionAudioTraditional:
				setOptionAudioTraditionalBlanksPercentage(newPercentage);
				break;
			case FieldNames.audioSimplified:
				setAudioSimplifiedBlanksPercentage(newPercentage);
				break;
			case FieldNames.audioTraditional:
				setAudioTraditionalBlanksPercentage(newPercentage);
				break;
			case FieldNames.traditionalCompleteActivityAudio:
				setTraditionalCompleteActivityAudioBlanks(newPercentage);
				break;
			case FieldNames.simplifiedCompleteActivityAudio:
				setSimplifiedCompleteActivityAudioBlanks(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidBlanks = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdate = !(isPercentageValidBlanks(imageSimplifiedBlanksPercentage) && isPercentageValidBlanks(imageTraditionalBlanksPercentage) && isPercentageValidBlanks(audioSimplifiedBlanksPercentage) && isPercentageValidBlanks(audioTraditionalBlanksPercentage) && isPercentageValidBlanks(optionAudioSimplifiedBlanksPercent) && isPercentageValidBlanks(optionAudioTraditionalBlanksPercentage) && isPercentageValidBlanks(traditionalCompleteActivityAudioBlanks) && isPercentageValidBlanks(simplifiedCompleteActivityAudioBlanks));

	/**
	 *@returns Method used for setValue from activity data and get the details of activity by uuid
	 */
	useEffect(() => {
		if (params.activityId) {
			setLoadingBlanks(true);
			APIService.getData(`${url}/blank/${params.activityId}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const responseData = response.data.data.activityData;
						setImageTraditionalBlanks(responseData.traditionalImageUrl);
						setAudioTraditionalBlanks(responseData.traditionalQuestionAudioUrl);
						setTraditionalOptionalsListBlanks(responseData.traditionalOptions);
						setCorrectAnswerTraditionalBlanks(responseData.traditionalAnswer);
						formik.setFieldValue(FieldNames.traditionalQuestionChinese, responseData.traditionalQuestionsChinese);
						setImageSimplifiedBlanks(responseData.simplifiedImageUrl);
						setAudioSimplifiedBlanks(responseData.simplifiedQuestionAudioUrl);
						setSimplifiedOptionalsListBlanks(responseData.simplifiedOptions);
						setCorrectAnswerSimplifiedBlanks(responseData.simplifiedAnswer);
						formik.setFieldValue(FieldNames.simplifiedQuestionChinese, responseData.simplifiedQuestionsChinese);
						setSkipButtonCheckedBlanks(response.data.data.isSkippable);
						formik.setFieldValue(FieldNames.title, response.data.data.title);
						formik.setFieldValue(FieldNames.traditionalCompleteActivityAudio, responseData.traditionalCompleteActivityAudio);
						formik.setFieldValue(FieldNames.simplifiedCompleteActivityAudio, responseData.simplifiedCompleteActivityAudio);
					} else {
						toast.error(response?.data?.message);
					}
					setLoadingBlanks(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingBlanks(false);
				});
		}
	}, []);

	useEffect(() => {
		if (editTraditionalOptionBlanks) {
			formik.setFieldValue(FieldNames.optionTraditional, editTraditionalOptionBlanks.optionValue);
			setOptionAudioTraditionalBlanks(editTraditionalOptionBlanks?.optionFileUrl);
		}
	}, [editTraditionalOptionBlanks]);

	useEffect(() => {
		if (editSimplifiedOptionBlanks) {
			formik.setFieldValue(FieldNames.optionSimplified, editSimplifiedOptionBlanks?.optionValue);
			setOptionAudioSimplifiedBlanks(editSimplifiedOptionBlanks?.optionFileUrl);
		}
	}, [editSimplifiedOptionBlanks]);

	const initialValues: CreateFillBlanksActivity = {
		levelId: params.levelId as string,
		topicId: params.topicId as string,
		lessonId: params.lessonId as string,
		activityTypeId: activityUuid,
		title: '',
		imageSimplified: null,
		audioSimplified: null,
		optionSimplified: '',
		optionAudioSimplified: null,
		correctAnswerSimplified: '',
		correctAnswerAudioSimplified: null,
		simplifiedQuestionChinese: [defaultTraditionalFieldBlanks],
		correctAnswerTraditional: '',
		correctAnswerAudioTraditional: null,
		imageTraditional: null,
		audioTraditional: null,
		optionTraditional: '',
		optionAudioTraditional: null,
		isSkippable: false,
		traditionalQuestionChinese: [defaultSimplifiedFieldBlanks],
		simplifiedCompleteActivityAudio: '',
		traditionalCompleteActivityAudio: '',
	};

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */

	const handleFileUploadBlanks = (event: React.ChangeEvent<HTMLInputElement>, type: string, fileName: string) => {
		const fileBlanks = event.target.files?.[0];
		if (fileBlanks === undefined) {
			return;
		}
		const fileSize = type === fileTypeEnum.image ? IMAGE_SIZE_MB : AUDIO_SIZE_MB;
		const fileTypes = type === fileTypeEnum.image ? [FILE_TYPE.pngType, FILE_TYPE.jpgType, FILE_TYPE.jpegType] : [FILE_TYPE.audioType, FILE_TYPE.wavType];

		if (!fileTypes.includes(fileBlanks.type)) {
			setLoadingBlanks(false);
			toast.error(type === fileTypeEnum.image ? Errors.PLEASE_ALLOW_JPG_PNG_JPEG_FILE : Errors.PLEASE_ALLOW_MP3_WAV_FILE);
			return;
		}
		if (fileBlanks.size / 1000 / 1024 > fileSize) {
			toast.error(`Uploaded ${type} size is greater than ${fileSize}MB, please upload ${type} size within ${fileSize}MB or max ${fileSize}MB`);
		}
		const lastIndex = fileBlanks?.name?.lastIndexOf('.');
		const extension = fileBlanks?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileBlanks);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptions = {
					fileName: name,
					file: fileBlanks,
					isForSeasonal: false,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(imageUploaderOptions, updatePercentageBlanks);
				uploader.start();
				switch (fileName) {
					case FieldNames.imageSimplified:
						formik.setFieldValue(FieldNames.imageSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanks(false);
							setImageSimplifiedBlanks(response);
						});
						break;
					case FieldNames.imageTraditional:
						formik.setFieldValue(FieldNames.imageTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanks(false);
							setImageTraditionalBlanks(response);
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
			const blob = URL.createObjectURL(fileBlanks);
			audio.src = blob;
			audio.addEventListener('loadedmetadata', () => {
				const audioUploaderOptions = {
					fileName: name,
					file: fileBlanks,
					isForSeasonal: false,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(audioUploaderOptions, updatePercentageBlanks);
				uploader.start();
				switch (fileName) {
					case FieldNames.audioSimplified:
						formik.setFieldValue(FieldNames.audioSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanks(false);
							setAudioSimplifiedBlanks(response);
						});
						break;
					case FieldNames.optionAudioSimplified:
						formik.setFieldValue(FieldNames.optionAudioSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanks(false);
							setOptionAudioSimplifiedBlanks(response);
						});
						break;
					case FieldNames.audioTraditional:
						formik.setFieldValue(FieldNames.audioTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanks(false);
							setAudioTraditionalBlanks(response);
						});
						break;
					case FieldNames.optionAudioTraditional:
						formik.setFieldValue(FieldNames.optionAudioTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingBlanks(false);
							setOptionAudioTraditionalBlanks(response);
						});
						break;
					case FieldNames.traditionalCompleteActivityAudio:
						uploader.onComplete((response: string) => {
							setLoadingBlanks(false);
							formik.setFieldValue(FieldNames.traditionalCompleteActivityAudio, response);
						});
						break;
					case FieldNames.simplifiedCompleteActivityAudio:
						uploader.onComplete((response: string) => {
							setLoadingBlanks(false);
							formik.setFieldValue(FieldNames.simplifiedCompleteActivityAudio, response);
						});
						break;
					default:
						break;
				}
			});
		}
	};

	const fileUpdateBlanks = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileName = event.target.name;
		handleFileUploadBlanks(event, type, fileName);
	}, []);

	/**
	 *
	 * @returns Method used for get validation for add/edit activity
	 */
	const getObjBlanks = () => {
		const obj: ObjectShape = {
			[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.imageSimplified]: imageSimplifiedBlanks ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.audioSimplified]: audioSimplifiedBlanks ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),

			[FieldNames.optionSimplified]: simplifiedOptionalsListBlanks.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioSimplified]: simplifiedOptionalsListBlanks.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),

			[FieldNames.correctAnswerSimplified]: correctAnswerSimplifiedBlanks?.optionValue.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_SELECT_CORRECT_OPTION),
			[FieldNames.correctAnswerAudioSimplified]: correctAnswerSimplifiedBlanks?.optionFileUrl.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_CORRECT_AUDIO),

			[FieldNames.imageTraditional]: imageTraditionalBlanks ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.IMAGE_IS_REQUIRED),
			[FieldNames.audioTraditional]: audioTraditionalBlanks ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.optionTraditional]: traditionalOptionalsListBlanks.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioTraditional]: traditionalOptionalsListBlanks.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),

			[FieldNames.correctAnswerTraditional]: correctAnswerTraditionalBlanks?.optionValue.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_SELECT_CORRECT_OPTION),
			[FieldNames.correctAnswerAudioTraditional]: correctAnswerTraditionalBlanks?.optionFileUrl.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_CORRECT_AUDIO),
			[FieldNames.simplifiedQuestionChinese]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_QUESTION),
					[FieldNames.english]: Yup.string().trim().required(Errors.PLEASE_ENTER_QUESTION).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
					[FieldNames.pinyin]: Yup.string().required(Errors.PLEASE_ENTER_QUESTION),
				})
			),
			[FieldNames.traditionalCompleteActivityAudio]: Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.traditionalQuestionChinese]: Yup.array().of(
				Yup.object().shape({
					[FieldNames.chinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_QUESTION),
					[FieldNames.english]: Yup.string().trim().required(Errors.PLEASE_ENTER_QUESTION).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
					[FieldNames.pinyin]: Yup.string().required(Errors.PLEASE_ENTER_QUESTION),
				})
			),
			[FieldNames.simplifiedCompleteActivityAudio]: Yup.mixed().required(Errors.AUDIO_IS_REQUIRED),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObjBlanks();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updatedData: FillInTheBlanksActivitySubmitData = {
				levelId: values.levelId,
				topicId: values.topicId,
				lessonId: values.lessonId,
				title: formik.values.title.trim(),

				traditionalQuestionsChinese: formik.values.traditionalQuestionChinese.map((item) => {
					return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim() };
				}),
				traditionalQuestionAudioUrl: audioTraditionalBlanks.split('/').pop() as string,
				traditionalCompleteActivityAudio: values.traditionalCompleteActivityAudio.split('/').pop() as string,
				simplifiedCompleteActivityAudio: values.simplifiedCompleteActivityAudio.split('/').pop() as string,
				traditionalImageUrl: imageTraditionalBlanks.split('/').pop() as string,
				traditionalAnswer: { ...correctAnswerTraditionalBlanks, optionFileUrl: correctAnswerTraditionalBlanks.optionFileUrl.split('/').pop() as string },
				traditionalOptions: traditionalOptionalsListBlanks.map(({ optionFileUrl, ...rest }) => ({
					optionFileUrl: optionFileUrl.split('/').pop() as string,
					...rest,
				})),

				simplifiedQuestionsChinese: formik.values.simplifiedQuestionChinese.map((item) => {
					return { [FieldNames.chinese]: item.chinese, [FieldNames.pinyin]: item.pinyin, [FieldNames.english]: item.english.trim() };
				}),
				simplifiedQuestionAudioUrl: audioSimplifiedBlanks.split('/').pop() as string,
				simplifiedImageUrl: imageSimplifiedBlanks.split('/').pop() as string,
				simplifiedAnswer: { ...correctAnswerSimplifiedBlanks, optionFileUrl: correctAnswerSimplifiedBlanks.optionFileUrl.split('/').pop() as string },
				simplifiedOptions: simplifiedOptionalsListBlanks.map(({ optionFileUrl, ...rest }) => ({
					optionFileUrl: optionFileUrl.split('/').pop() as string,
					...rest,
				})),

				isSkippable: skipButtonCheckedBlanks,
			};
			if (params.activityId) {
				setLoadingBlanks(true);
				APIService.putData(`${url}/blank/${params.activityId}`, {
					...updatedData,
				})
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoadingBlanks(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingBlanks(false);
					});
			} else {
				setLoadingBlanks(true);
				APIService.postData(`${url}/blank`, {
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
						setLoadingBlanks(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingBlanks(false);
					});
			}
		},
	});

	const simplifiedOptionsDataBlanks = () => {
		setSimplifiedOptionalsListBlanks((prev) => {
			const updatedData = prev?.map((item) => {
				if (item.optionId === editSimplifiedOptionBlanks?.optionId) {
					const newData = {
						optionId: editSimplifiedOptionBlanks?.optionId,
						optionValue: formik.values.optionSimplified,
						optionFileUrl: optionAudioSimplifiedBlanks,
					};
					if (item.optionId === correctAnswerSimplifiedBlanks.optionId) {
						setCorrectAnswerSimplifiedBlanks(newData);
					}
					return { ...item, ...newData };
				} else {
					return item;
				}
			});
			if (!editSimplifiedOptionBlanks) {
				updatedData?.push({
					optionId: generateUuid(),
					optionValue: formik.values.optionSimplified,
					optionFileUrl: optionAudioSimplifiedBlanks,
				});
			}
			return updatedData;
		});
	};

	const addMoreOptionSimplifiedBlanks = useCallback(() => {
		if (simplifiedOptionalsListBlanks.length > OPTION_LIMIT && !editSimplifiedOptionBlanks) {
			return toast.error(Errors.MAX_OPTION);
		}
		if (formik.values.optionSimplified.trim() && optionAudioSimplifiedBlanks) {
			simplifiedOptionsDataBlanks();
			setOptionAudioSimplifiedBlanks('');
			formik.setFieldValue(FieldNames.optionSimplified, '');
			formik.setFieldValue(FieldNames.optionAudioSimplified, '');
			resetInputManually([FieldNames.optionAudioSimplified]);
			setEditSimplifiedOptionBlanks(null);
			validateFormBlanks();
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
	}, [simplifiedOptionalsListBlanks, editSimplifiedOptionBlanks, formik, optionAudioSimplifiedBlanks, correctAnswerSimplifiedBlanks]);

	const traditionalOptionsDataBlanks = () => {
		setTraditionalOptionalsListBlanks((prev) => {
			const updatedData = prev?.map((item) => {
				if (item.optionId === editTraditionalOptionBlanks?.optionId) {
					const newData = {
						optionId: editTraditionalOptionBlanks?.optionId,
						optionValue: formik.values.optionTraditional,
						optionFileUrl: optionAudioTraditionalBlanks,
					};
					if (item.optionId === correctAnswerTraditionalBlanks.optionId) {
						setCorrectAnswerTraditionalBlanks(newData);
					}
					return { ...item, ...newData };
				} else {
					return item;
				}
			});
			if (!editTraditionalOptionBlanks) {
				updatedData?.push({
					optionId: generateUuid(),
					optionValue: formik.values.optionTraditional,
					optionFileUrl: optionAudioTraditionalBlanks,
				});
			}
			return updatedData;
		});
	};

	const addMoreOptionTraditionalBlanks = useCallback(() => {
		if (traditionalOptionalsListBlanks.length > OPTION_LIMIT && !editTraditionalOptionBlanks) {
			return toast.error(Errors.MAX_OPTION);
		}
		if (formik.values.optionTraditional.trim() && optionAudioTraditionalBlanks) {
			traditionalOptionsDataBlanks();
			setOptionAudioTraditionalBlanks('');
			formik.setFieldValue(FieldNames.optionTraditional, '');
			formik.setFieldValue(FieldNames.optionAudioTraditional, '');
			resetInputManually([FieldNames.optionAudioTraditional]);
			setEditTraditionalOptionBlanks(null);
			validateFormBlanks();
		} else {
			toast.error(Errors.FILL_FORM_ERROR);
		}
	}, [traditionalOptionalsListBlanks, editTraditionalOptionBlanks, formik, optionAudioTraditionalBlanks, correctAnswerTraditionalBlanks]);

	const validateFormBlanks = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 500);
	};
	const copyDataBlanks = useCallback(() => {
		const traditionalData = () => {
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
		if (imageTraditionalBlanks !== '') {
			setImageSimplifiedBlanks(imageTraditionalBlanks);
			formik.setFieldValue(FieldNames.imageSimplified, formik.values.imageTraditional);
		}
		if (audioTraditionalBlanks !== '') {
			formik.setFieldValue(FieldNames.audioSimplified, formik.values.audioTraditional);
			setAudioSimplifiedBlanks(audioTraditionalBlanks);
		}
		formik.values.traditionalCompleteActivityAudio && formik.setFieldValue(FieldNames.simplifiedCompleteActivityAudio, formik.values.traditionalCompleteActivityAudio);
		setCorrectAnswerSimplifiedBlanks(correctAnswerTraditionalBlanks);
		setSimplifiedOptionalsListBlanks(traditionalOptionalsListBlanks);
		formik.setFieldValue(FieldNames.simplifiedQuestionChinese, traditionalData());
		validateFormBlanks();
	}, [formik]);

	const getErrorBlanks = (fieldName: keyof CreateFillBlanksActivity) => {
		if (fieldName !== FieldNames.traditionalQuestionChinese && fieldName !== FieldNames.simplifiedQuestionChinese) {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		}
	};

	const translateTraditionalFieldBlanks = useCallback(
		(index: number) => {
			translateText(formik.values.traditionalQuestionChinese[index].chinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
				// traditional to english
				formik.setFieldValue(`traditionalQuestionChinese[${index}].english`, data ?? data);
				formik.setFieldValue(`traditionalQuestionChinese[${index}].pinyin`, formik.values.traditionalQuestionChinese[index].chinese);
			});
		},
		[formik]
	);

	const translateSimplifiedFieldBlanks = useCallback(
		(index: number) => {
			translateText(formik.values.simplifiedQuestionChinese[index].chinese, ENGLISH_CODE, SIMPLIFIED_CHINESE_CODE).then((data) => {
				// Simplified to english
				formik.setFieldValue(`simplifiedQuestionChinese[${index}].english`, data ?? data);
				formik.setFieldValue(`simplifiedQuestionChinese[${index}].pinyin`, formik.values.simplifiedQuestionChinese[index].chinese);
			});
		},
		[formik]
	);

	const audioUploadBlanks = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateBlanks(e, fileTypeEnum.audio);
	}, []);
	const imageUploadBlanks = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateBlanks(e, fileTypeEnum.image);
	}, []);

	const addMoreTraditionalQuestionBlanks = useCallback(() => {
		formik.setFieldValue('traditionalQuestionChinese', [...formik.values.traditionalQuestionChinese, { chinese: '', english: '', pinyin: '' }]);
	}, [formik]);

	const addMoreSimplifiedQuestionBlanks = useCallback(() => {
		formik.setFieldValue('simplifiedQuestionChinese', [...formik.values.simplifiedQuestionChinese, { chinese: '', english: '', pinyin: '' }]);
	}, [formik]);

	const editTraditionalRecordBlanks = useCallback((data: optionObject) => {
		setEditTraditionalOptionBlanks(data);
	}, []);

	const deleteTraditionalRecordBlanks = useCallback(
		(data: optionObject) => {
			setTraditionalOptionalsListBlanks(traditionalOptionalsListBlanks?.filter((item) => item.optionId !== data.optionId));
			if (data.optionId === correctAnswerTraditionalBlanks.optionId) {
				setCorrectAnswerTraditionalBlanks(defaultOptionBlanks);
			}
		},
		[traditionalOptionalsListBlanks, correctAnswerTraditionalBlanks]
	);

	const answerTraditionalBlanks = useCallback((item: optionObject) => {
		setCorrectAnswerTraditionalBlanks(item);
		validateFormBlanks();
	}, []);

	const editSimplifiedRecordBlanks = useCallback((data: optionObject) => {
		setEditSimplifiedOptionBlanks(data);
	}, []);

	const deleteSimplifiedRecordBlanks = useCallback(
		(data: optionObject) => {
			setSimplifiedOptionalsListBlanks(simplifiedOptionalsListBlanks?.filter((item) => item.optionId !== data.optionId));
			if (data.optionId === correctAnswerSimplifiedBlanks.optionId) {
				setCorrectAnswerSimplifiedBlanks(defaultOptionBlanks);
			}
		},
		[simplifiedOptionalsListBlanks, correctAnswerSimplifiedBlanks]
	);

	const answerSimplifiedBlanks = useCallback((item: optionObject) => {
		setCorrectAnswerSimplifiedBlanks(item);
		validateFormBlanks();
	}, []);

	const fileChangeHandlerBlanks = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		formik.handleChange(e);
	}, []);

	return (
		<div>
			<FormikProvider value={formik}>
				<form className='w-full' onSubmit={formik.handleSubmit}>
					{loadingBlanks && <Loader />}
					<div className='mb-3'>
						<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorBlanks(FieldNames.title)} required />
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
													const chineseTraditionalBlanks = `traditionalQuestionChinese[${index}].chinese`;
													const englishTraditionalBlanks = `traditionalQuestionChinese[${index}].english`;
													const pinyinTraditionalBlanks = `traditionalQuestionChinese[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-1 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseTraditionalBlanks} onChange={formik.handleChange} label='Chinese' value={formik.values.traditionalQuestionChinese[index].chinese} error={getIn(formik.touched, chineseTraditionalBlanks) && getIn(formik.errors, chineseTraditionalBlanks) ? getIn(formik.errors, chineseTraditionalBlanks) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateTraditionalFieldBlanks} isTranslate={true} title='Translate' />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question english' name={englishTraditionalBlanks} onChange={formik.handleChange} label='English' value={formik.values.traditionalQuestionChinese[index].english} error={getIn(formik.touched, englishTraditionalBlanks) && getIn(formik.errors, englishTraditionalBlanks) ? getIn(formik.errors, englishTraditionalBlanks) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinTraditionalBlanks} onChange={formik.handleChange} label='Pinyin' value={formik.values.traditionalQuestionChinese[index].pinyin} error={getIn(formik.touched, pinyinTraditionalBlanks) && getIn(formik.errors, pinyinTraditionalBlanks) ? getIn(formik.errors, pinyinTraditionalBlanks) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.traditionalQuestionChinese.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalQuestionBlanks}>
													<Plus className='mr-3' /> Add More
												</Button>
											</div>
										),
										[formik]
									)}
								/>
								<div className='mb-4'>
									<FileUpload labelName='Question Audio' id={FieldNames.audioTraditional} imageSource={audioTraditionalBlanks} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.audioTraditional} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanks} error={getErrorBlanks(FieldNames.audioTraditional) as string} />
									{!isPercentageValidBlanks(audioTraditionalBlanksPercentage) && <LoadingPercentage percentage={audioTraditionalBlanksPercentage} />}
								</div>
								<div className='mb-4'>
									<FileUpload labelName='Image' id={FieldNames.imageTraditional} imageSource={imageTraditionalBlanks} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} name={FieldNames.imageTraditional} acceptNote={IMAGE_NOTE} uploadType={FILE_TYPE.jpegType || FILE_TYPE.jpgType || FILE_TYPE.pngType} onChange={imageUploadBlanks} error={getErrorBlanks(FieldNames.imageTraditional) as string} />
									{!isPercentageValidBlanks(imageTraditionalBlanksPercentage) && <LoadingPercentage percentage={imageTraditionalBlanksPercentage} />}
								</div>
								<h6 className='font-medium mb-2 col-span-2 '>Options</h6>

								<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
									<div className='mb-4 col-span-2'>
										<TextInput placeholder='option' name={FieldNames.optionTraditional} onChange={formik.handleChange} label='Option' value={formik.values.optionTraditional} error={getErrorBlanks(FieldNames.optionTraditional)} required />
									</div>
									<div className='mb-4 col-span-3'>
										<FileUpload labelName='Audio' id={FieldNames.optionAudioTraditional} imageSource={optionAudioTraditionalBlanks} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.optionAudioTraditional} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanks} error={getErrorBlanks(FieldNames.optionAudioTraditional) as string} />
										{!isPercentageValidBlanks(optionAudioTraditionalBlanksPercentage) && <LoadingPercentage percentage={optionAudioTraditionalBlanksPercentage} />}
									</div>
									<div className=' flex items-center'>
										<Button className='btn-primary rounded-full' onClick={addMoreOptionTraditionalBlanks}>
											{editTraditionalOptionBlanks ? 'Update' : 'Add'}
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
											{traditionalOptionalsListBlanks.map((item, index) => (
												<tr key={item.optionId}>
													<td className='w-10 text-center'>{index + 1}</td>
													<td className='w-24 font-medium'>{item.optionValue}</td>
													<td className='w-44'>
														<audio src={item.optionFileUrl} controls className='mb-3'></audio>
													</td>
													<td className='w-10'>
														<StatusButton data={item} status='' checked={correctAnswerTraditionalBlanks?.optionId === item.optionId} isChangeStatusModal={answerTraditionalBlanks} disable={!!editTraditionalOptionBlanks} />
													</td>
													<td className='w-28'>
														<div className='flex gap-3'>
															<EditButton data={item} editRecord={editTraditionalRecordBlanks} buttonSuccess={true} disable={editTraditionalOptionBlanks?.optionId === item.optionId} />
															<DeleteButton data={item} isDeleteStatusModal={deleteTraditionalRecordBlanks} btnDanger={true} disable={editTraditionalOptionBlanks?.optionId === item.optionId} />
														</div>
													</td>
												</tr>
											))}

											{!traditionalOptionalsListBlanks.length && (
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
										<TextInput placeholder='Correct answer' label='Correct Option' value={correctAnswerTraditionalBlanks?.optionValue} error={getErrorBlanks(FieldNames.correctAnswerTraditional)} required disabled />
									</div>
									<div className='mb-4'>
										<FileUpload labelName='Correct Audio' uploadNote={false} id={FieldNames.correctAnswerAudioTraditional} imageSource={correctAnswerTraditionalBlanks?.optionFileUrl} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.correctAnswerAudioTraditional} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={fileChangeHandlerBlanks} error={getErrorBlanks(FieldNames.correctAnswerAudioTraditional) as string} disabled />
									</div>
								</div>
								<div className='mb-4 grid grid-cols-2 gap-x-4 gap-y-2 col-span-2  p-3'>
									<div className='mb-4 col-span-3'>
										<FileUpload labelName='Complete Activity Audio With Answers' id={FieldNames.traditionalCompleteActivityAudio} imageSource={formik.values.traditionalCompleteActivityAudio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.traditionalCompleteActivityAudio} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanks} error={getErrorBlanks(FieldNames.traditionalCompleteActivityAudio) as string} />
										{!isPercentageValidBlanks(traditionalCompleteActivityAudioBlanks) && <LoadingPercentage percentage={traditionalCompleteActivityAudioBlanks} />}
									</div>
								</div>
							</div>
						</div>

						<div className='flex flex-col justify-center items-center p-3'>
							<Button className='btn-default btn-large' title='Copy' onClick={copyDataBlanks} disabled={disableUpdate}>
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
													const chineseSimplifiedBlanks = `simplifiedQuestionChinese[${index}].chinese`;
													const englishSimplifiedBlanks = `simplifiedQuestionChinese[${index}].english`;
													const pinyinSimplifiedBlanks = `simplifiedQuestionChinese[${index}].pinyin`;
													return (
														<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
															<div className='flex space-x-1 items-start'>
																<div className=' w-full'>
																	<TextInput placeholder='Question chinese' name={chineseSimplifiedBlanks} onChange={formik.handleChange} label='Chinese' value={formik.values.simplifiedQuestionChinese[index].chinese} error={getIn(formik.touched, chineseSimplifiedBlanks) && getIn(formik.errors, chineseSimplifiedBlanks) ? getIn(formik.errors, chineseSimplifiedBlanks) : ''} required />
																</div>
																<div className='mt-7'>
																	<CommonButton data={index} dataHandler={translateSimplifiedFieldBlanks} isTranslate={true} title='Translate' />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question english' name={englishSimplifiedBlanks} onChange={formik.handleChange} label='English' value={formik.values.simplifiedQuestionChinese[index].english} error={getIn(formik.touched, englishSimplifiedBlanks) && getIn(formik.errors, englishSimplifiedBlanks) ? getIn(formik.errors, englishSimplifiedBlanks) : ''} required />
																</div>
																<div className=' w-full'>
																	<TextInput placeholder='Question pinyin' name={pinyinSimplifiedBlanks} onChange={formik.handleChange} label='Pinyin' value={formik.values.simplifiedQuestionChinese[index].pinyin} error={getIn(formik.touched, pinyinSimplifiedBlanks) && getIn(formik.errors, pinyinSimplifiedBlanks) ? getIn(formik.errors, pinyinSimplifiedBlanks) : ''} required />
																</div>
																<div className='mt-7'>
																	<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.simplifiedQuestionChinese.length === 1} btnDanger={true} />
																</div>
															</div>
														</div>
													);
												})}
												<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedQuestionBlanks}>
													<Plus className='mr-3' /> Add More
												</Button>
											</div>
										),
										[formik]
									)}
								/>

								<div className='mb-4'>
									<FileUpload labelName='Question Audio' id={FieldNames.audioSimplified} imageSource={audioSimplifiedBlanks} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.audioSimplified} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanks} error={getErrorBlanks(FieldNames.audioSimplified) as string} />
									{!isPercentageValidBlanks(audioSimplifiedBlanksPercentage) && <LoadingPercentage percentage={audioSimplifiedBlanksPercentage} />}
								</div>
								<div className='mb-4'>
									<FileUpload labelName='Image' id={FieldNames.imageSimplified} imageSource={imageSimplifiedBlanks} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} name={FieldNames.imageSimplified} acceptNote={IMAGE_NOTE} uploadType={FILE_TYPE.jpegType || FILE_TYPE.jpgType || FILE_TYPE.pngType} onChange={imageUploadBlanks} error={getErrorBlanks(FieldNames.imageSimplified) as string} />
									{!isPercentageValidBlanks(imageSimplifiedBlanksPercentage) && <LoadingPercentage percentage={imageSimplifiedBlanksPercentage} />}
								</div>
								<h6 className='font-medium mb-2 col-span-2 '>Options</h6>
								<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
									<div className='mb-4 col-span-2'>
										<TextInput placeholder='option' name={FieldNames.optionSimplified} onChange={formik.handleChange} label='Option' value={formik.values.optionSimplified} error={getErrorBlanks(FieldNames.optionSimplified)} required />
									</div>
									<div className='mb-4 col-span-3'>
										<FileUpload labelName='Audio' id={FieldNames.optionAudioSimplified} imageSource={optionAudioSimplifiedBlanks} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.optionAudioSimplified} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanks} error={getErrorBlanks(FieldNames.optionAudioSimplified) as string} />
										{!isPercentageValidBlanks(optionAudioSimplifiedBlanksPercent) && <LoadingPercentage percentage={optionAudioSimplifiedBlanksPercent} />}
									</div>
									<div className='flex items-center'>
										<Button className='btn-primary rounded-full' onClick={addMoreOptionSimplifiedBlanks} disabled={!isPercentageValidBlanks(optionAudioSimplifiedBlanksPercent)}>
											{editSimplifiedOptionBlanks ? 'Update' : 'Add'}
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
											{simplifiedOptionalsListBlanks.map((item, index) => (
												<tr key={item.optionId}>
													<td className='w-10 text-center'>{index + 1}</td>
													<td className='w-24 font-medium'>{item.optionValue}</td>

													<td className='w-44'>
														<audio src={item.optionFileUrl} controls className='mb-3'></audio>
													</td>
													<td className='w-10'>
														<StatusButton data={item} status='' checked={correctAnswerSimplifiedBlanks?.optionId === item.optionId} isChangeStatusModal={answerSimplifiedBlanks} disable={!!editSimplifiedOptionBlanks} />
													</td>
													<td className='w-28'>
														<div className='flex gap-3'>
															<EditButton data={item} editRecord={editSimplifiedRecordBlanks} buttonSuccess={true} disable={editSimplifiedOptionBlanks?.optionId === item.optionId} />
															<DeleteButton data={item} isDeleteStatusModal={deleteSimplifiedRecordBlanks} btnDanger={true} disable={editSimplifiedOptionBlanks?.optionId === item.optionId} />
														</div>
													</td>
												</tr>
											))}

											{!simplifiedOptionalsListBlanks.length && (
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
										<TextInput placeholder='Correct answer' label='Correct Option' value={correctAnswerSimplifiedBlanks?.optionValue} error={getErrorBlanks(FieldNames.correctAnswerSimplified)} required disabled />
									</div>
									<div className='mb-4'>
										<FileUpload labelName='Correct Audio' uploadNote={false} id={FieldNames.correctAnswerAudioSimplified} imageSource={correctAnswerSimplifiedBlanks?.optionFileUrl} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.correctAnswerAudioSimplified} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={fileChangeHandlerBlanks} error={getErrorBlanks(FieldNames.correctAnswerAudioSimplified) as string} disabled />
									</div>
								</div>
								<div className='mb-4 grid grid-cols-2 gap-x-4 gap-y-2 col-span-2  p-3'>
									<div className='mb-4 col-span-3'>
										<FileUpload labelName='Complete Activity Audio With Answers' id={FieldNames.simplifiedCompleteActivityAudio} imageSource={formik.values.simplifiedCompleteActivityAudio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.simplifiedCompleteActivityAudio} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadBlanks} error={getErrorBlanks(FieldNames.simplifiedCompleteActivityAudio) as string} />
										{!isPercentageValidBlanks(simplifiedCompleteActivityAudioBlanks) && <LoadingPercentage percentage={simplifiedCompleteActivityAudioBlanks} />}
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
									checked: skipButtonCheckedBlanks,
									name: 'Provide skip button for this activity',
									onChange() {
										setSkipButtonCheckedBlanks((prev) => !prev);
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

export default ActivityFillInTheBlanks;
