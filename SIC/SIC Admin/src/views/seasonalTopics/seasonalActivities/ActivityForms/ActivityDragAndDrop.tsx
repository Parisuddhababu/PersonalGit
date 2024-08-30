import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import TextInput from '@components/textInput/TextInput';
import CheckBox from '@components/checkbox/CheckBox';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { AngleRight } from '@components/icons';
import FileUpload from '@components/fileUpload/FileUpload';
import { IMAGE_NOTE, AUDIO_SIZE_MB, CHARACTERS_LIMIT, FILE_TYPE, IMAGE_SIZE_MB, fileTypeEnum } from '@config/constant';
import { Errors } from '@config/errors';
import { useParams } from 'react-router-dom';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import { generateUuid, resetInputManually } from '@utils/helpers';
import { CreateDragAndDropActivity, DragAndDropActivitySubmitData, optionObject } from 'src/types/activities/dragAndDrop';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import { Uploader } from '@views/activities/utils/upload';
import { FieldNames } from '@views/activities/ActivityDragAndDrop';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import { AddEditSeasonalActivityData } from 'src/types/seasonalTopics';

export const SeasonalActivityDragAndDrop = ({ onSubmit, onClose, url, activityUuid }: AddEditSeasonalActivityData) => {
	const params = useParams();
	const [loadingDNDSeasonal, setLoadingDNDSeasonal] = useState<boolean>(false);
	const [skipButtonCheckedDNDSeasonal, setSkipButtonCheckedDNDSeasonal] = useState<boolean>(false);
	const [imageSimplifiedPercentageDNDSeasonal, setImageSimplifiedPercentageDNDSeasonal] = useState<number>(0);
	const [audioSimplifiedPercentageDNDSeasonal, setAudioSimplifiedPercentageDNDSeasonal] = useState<number>(0);
	const [correctAnswerSimplifiedDNDSeasonal, setCorrectAnswerSimplifiedDNDSeasonal] = useState<{ optionId: string; option: string }[]>([]);

	const [simplifiedOptionalsListDNDSeasonal, setSimplifiedOptionalsListDNDSeasonal] = useState<optionObject[]>([]);
	const [editSimplifiedOptionDNDSeasonal, setEditSimplifiedOptionDNDSeasonal] = useState<optionObject | null>(null);
	const [imageTraditionalPercentageDNDSeasonal, setImageTraditionalPercentageDNDSeasonal] = useState<number>(0);
	const [audioTraditionalPercentageDNDSeasonal, setAudioTraditionalPercentageDNDSeasonal] = useState<number>(0);
	const [traditionalQuestionAudioDNDSeasonal, setTraditionalQuestionAudioDNDSeasonal] = useState<number>(0);
	const [simplifiedQuestionAudioDNDSeasonal, setSimplifiedQuestionAudioDNDSeasonal] = useState<number>(0);

	const [traditionalOptionalsListDNDSeasonal, setTraditionalOptionalsListDNDSeasonal] = useState<optionObject[]>([]);
	const [editTraditionalOptionDNDSeasonal, setEditTraditionalOptionDNDSeasonal] = useState<optionObject | null>(null);
	const [correctAnswerTraditionalDNDSeasonal, setCorrectAnswerTraditionalDNDSeasonal] = useState<{ optionId: string; option: string }[]>([]);

	const updatePercentageDNDSeasonal = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.optionAudioSimplified:
				setAudioSimplifiedPercentageDNDSeasonal(newPercentage);
				break;
			case FieldNames.optionAudioTraditional:
				setAudioTraditionalPercentageDNDSeasonal(newPercentage);
				break;
			case FieldNames.simplifiedImage:
				setImageSimplifiedPercentageDNDSeasonal(newPercentage);
				break;
			case FieldNames.traditionalImage:
				setImageTraditionalPercentageDNDSeasonal(newPercentage);
				break;
			case FieldNames.traditionalQuestionAudio:
				setTraditionalQuestionAudioDNDSeasonal(newPercentage);
				break;
			case FieldNames.simplifiedQuestionAudio:
				setSimplifiedQuestionAudioDNDSeasonal(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidDNDSeasonal = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdate = !(isPercentageValidDNDSeasonal(imageSimplifiedPercentageDNDSeasonal) && isPercentageValidDNDSeasonal(imageTraditionalPercentageDNDSeasonal) && isPercentageValidDNDSeasonal(audioSimplifiedPercentageDNDSeasonal) && isPercentageValidDNDSeasonal(audioTraditionalPercentageDNDSeasonal) && isPercentageValidDNDSeasonal(traditionalQuestionAudioDNDSeasonal) && isPercentageValidDNDSeasonal(simplifiedQuestionAudioDNDSeasonal));

	/**
	 *@returns Method used for setValue from questions data and get the details of question by uuid
	 */
	useEffect(() => {
		if (params.activityId) {
			setLoadingDNDSeasonal(true);
			APIService.getData(`${url}/drag-and-drop/${params.activityId}?isForSeasonal=true`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const responseData = response.data.data.activityData;
						formik.setFieldValue(FieldNames.title, response.data.data.title);
						formik.setFieldValue(FieldNames.simplifiedQuestionChinese, responseData.simplifiedQuestion);
						formik.setFieldValue(FieldNames.simplifiedImage, responseData.simplifiedImage);
						setSimplifiedOptionalsListDNDSeasonal(responseData.simplifiedOptions);
						formik.setFieldValue(FieldNames.traditionalQuestionChinese, responseData.traditionalQuestion);
						formik.setFieldValue(FieldNames.traditionalImage, responseData.traditionalImage);
						setTraditionalOptionalsListDNDSeasonal(responseData.traditionalOptions);
						setSkipButtonCheckedDNDSeasonal(response.data.data.isSkippable);
						setCorrectAnswerSimplifiedDNDSeasonal(responseData.simplifiedAnswerOptions);
						setCorrectAnswerTraditionalDNDSeasonal(responseData.traditionalAnswerOptions);
						formik.setFieldValue(FieldNames.traditionalQuestionAudio, responseData.traditionalQuestionUrl);
						formik.setFieldValue(FieldNames.simplifiedQuestionAudio, responseData.simplifiedQuestionUrl);
					} else {
						toast.error(response?.data?.message);
					}
					setLoadingDNDSeasonal(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingDNDSeasonal(false);
				});
		}
	}, []);

	useEffect(() => {
		if (editTraditionalOptionDNDSeasonal) {
			formik.setFieldValue(FieldNames.optionTraditional, editTraditionalOptionDNDSeasonal?.option);
			formik.setFieldValue(FieldNames.optionAudioTraditional, editTraditionalOptionDNDSeasonal?.optionAudio);
		}
		if (editSimplifiedOptionDNDSeasonal) {
			formik.setFieldValue(FieldNames.optionSimplified, editSimplifiedOptionDNDSeasonal?.option);
			formik.setFieldValue(FieldNames.optionAudioSimplified, editSimplifiedOptionDNDSeasonal?.optionAudio);
		}
	}, [editTraditionalOptionDNDSeasonal, editSimplifiedOptionDNDSeasonal]);

	const initialValues: CreateDragAndDropActivity = {
		lessonId: params?.lessonId as string,
		topicId: params?.topicId as string,
		activityTypeId: activityUuid,
		title: '',
		simplifiedQuestionChinese: '',
		simplifiedImage: '',
		optionSimplified: '',
		optionAudioSimplified: '',
		simplifiedCorrectAnswer: '',
		traditionalQuestionChinese: '',
		traditionalImage: '',
		optionTraditional: '',
		optionAudioTraditional: '',
		traditionalCorrectAnswer: '',
		isSkippable: false,
		traditionalQuestionAudio: '',
		simplifiedQuestionAudio: '',
	};

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const fileUpdateDNDSeasonal = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileDNDSeasonal = event.target.files?.[0];
		const fileName = event.target.name;
		if (fileDNDSeasonal === undefined) {
			return;
		}
		const fileSize = type === fileTypeEnum.image ? IMAGE_SIZE_MB : AUDIO_SIZE_MB;
		const fileTypes = type === fileTypeEnum.image ? [FILE_TYPE.pngType, FILE_TYPE.jpgType, FILE_TYPE.jpegType] : [FILE_TYPE.audioType, FILE_TYPE.wavType];
		if (!fileTypes.includes(fileDNDSeasonal.type)) {
			setLoadingDNDSeasonal(false);
			toast.error(type === fileTypeEnum.image ? Errors.PLEASE_ALLOW_JPG_PNG_JPEG_FILE : Errors.PLEASE_ALLOW_MP3_WAV_FILE);
			return;
		}
		if (fileDNDSeasonal.size / 1000 / 1024 >= fileSize) {
			toast.error(`Uploaded ${type} size is greater than ${fileSize}MB, please upload ${type} size within ${fileSize}MB or max ${fileSize}MB`);
		}
		const lastIndex = fileDNDSeasonal?.name?.lastIndexOf('.');
		const extension = fileDNDSeasonal?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileDNDSeasonal);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptionsDNDSeasonal = {
					fileName: name,
					file: fileDNDSeasonal,
					isForSeasonal: true,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(imageUploaderOptionsDNDSeasonal, updatePercentageDNDSeasonal);
				uploader.start();
				switch (fileName) {
					case FieldNames.simplifiedImage:
						uploader.onComplete((response: string) => {
							setLoadingDNDSeasonal(false);
							formik.setFieldValue(FieldNames.simplifiedImage, response);
						});
						break;
					case FieldNames.traditionalImage:
						uploader.onComplete((response: string) => {
							setLoadingDNDSeasonal(false);
							formik.setFieldValue(FieldNames.traditionalImage, response);
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
			const blob = URL.createObjectURL(fileDNDSeasonal);
			audio.src = blob;
			audio.addEventListener('loadedmetadata', () => {
				const audioUploaderOptionsDNDSeasonal = {
					fileName: name,
					file: fileDNDSeasonal,
					isForSeasonal: true,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(audioUploaderOptionsDNDSeasonal, updatePercentageDNDSeasonal);
				uploader.start();
				switch (fileName) {
					case FieldNames.optionAudioSimplified:
						uploader.onComplete((response: string) => {
							setLoadingDNDSeasonal(false);
							formik.setFieldValue(FieldNames.optionAudioSimplified, response);
						});
						break;
					case FieldNames.optionAudioTraditional:
						uploader.onComplete((response: string) => {
							setLoadingDNDSeasonal(false);
							formik.setFieldValue(FieldNames.optionAudioTraditional, response);
						});
						break;
					case FieldNames.traditionalQuestionAudio:
						uploader.onComplete((response: string) => {
							setLoadingDNDSeasonal(false);
							formik.setFieldValue(FieldNames.traditionalQuestionAudio, response);
						});
						break;
					case FieldNames.simplifiedQuestionAudio:
						uploader.onComplete((response: string) => {
							setLoadingDNDSeasonal(false);
							formik.setFieldValue(FieldNames.simplifiedQuestionAudio, response);
						});
						break;
					default:
						break;
				}
			});
		}
	}, []);

	/**
	 *
	 * @returns Method used for get validation for add/edit questions
	 */
	const getObjDNDSeasonal = () => {
		const obj: ObjectShape = {
			[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.simplifiedQuestionChinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_QUESTION).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.simplifiedImage]: Yup.mixed().required(Errors.PLEASE_SELECT_IMAGE),
			[FieldNames.optionSimplified]: simplifiedOptionalsListDNDSeasonal.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioSimplified]: simplifiedOptionalsListDNDSeasonal.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_AUDIO),
			[FieldNames.traditionalQuestionChinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_QUESTION).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.traditionalImage]: Yup.mixed().required(Errors.PLEASE_SELECT_IMAGE),

			[FieldNames.optionTraditional]: traditionalOptionalsListDNDSeasonal.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioTraditional]: traditionalOptionalsListDNDSeasonal.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_AUDIO),
			[FieldNames.traditionalQuestionAudio]: Yup.mixed().required(Errors.PLEASE_SELECT_AUDIO),
			[FieldNames.simplifiedQuestionAudio]: Yup.mixed().required(Errors.PLEASE_SELECT_AUDIO),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObjDNDSeasonal();

	const checkCorrectAnswerDNDSeasonal = () => {
		!correctAnswerSimplifiedDNDSeasonal.length && toast.error(Errors.PLEASE_SELECT_CORRECT_ANSWER_SIMPLIFIED);
		!correctAnswerTraditionalDNDSeasonal.length && toast.error(Errors.PLEASE_SELECT_CORRECT_ANSWER_TRADITIONAL);
	};

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updatedData: DragAndDropActivitySubmitData = {
				title: values.title.trim(),
				isForSeasonal: true,
				activityData: {
					simplifiedImage: values.simplifiedImage.split('/').pop() as string,
					simplifiedQuestion: formik.values.simplifiedQuestionChinese.trim(),
					simplifiedOptions: simplifiedOptionalsListDNDSeasonal.map(({ optionAudio, ...rest }) => ({
						optionAudio: optionAudio.split('/').pop() as string,
						...rest,
					})),
					simplifiedAnswerOptions: correctAnswerSimplifiedDNDSeasonal,
					simplifiedCorrectAnswer: correctAnswerSimplifiedDNDSeasonal.map((item) => item.option)?.join(' '),
					traditionalImage: values.traditionalImage.split('/').pop() as string,
					traditionalQuestion: formik.values.traditionalQuestionChinese.trim(),
					traditionalOptions: traditionalOptionalsListDNDSeasonal.map(({ optionAudio, ...rest }) => ({
						optionAudio: optionAudio.split('/').pop() as string,
						...rest,
					})),
					traditionalAnswerOptions: correctAnswerTraditionalDNDSeasonal,
					traditionalCorrectAnswer: correctAnswerTraditionalDNDSeasonal.map((item) => item.option)?.join(' '),
					simplifiedQuestionUrl: values.simplifiedQuestionAudio.split('/').pop() as string,
					traditionalQuestionUrl: values.traditionalQuestionAudio.split('/').pop() as string,
				},
				isSkippable: skipButtonCheckedDNDSeasonal,
			};
			if (correctAnswerSimplifiedDNDSeasonal.length && correctAnswerTraditionalDNDSeasonal.length) {
				if (params.activityId) {
					setLoadingDNDSeasonal(true);
					APIService.putData(`${url}/drag-and-drop/${params.activityId}?isForSeasonal=true`, {
						...updatedData,
					})
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingDNDSeasonal(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingDNDSeasonal(false);
						});
				} else {
					setLoadingDNDSeasonal(true);
					APIService.postData(`${url}/drag-and-drop?isForSeasonal=true`, {
						...updatedData,
						activityTypeId: values.activityTypeId,
						lessonId: values.lessonId,
						topicId: values.topicId,
					})
						.then((response) => {
							if (response.status === ResponseCode.success || ResponseCode.created) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingDNDSeasonal(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingDNDSeasonal(false);
						});
				}
			} else {
				checkCorrectAnswerDNDSeasonal();
			}
		},
	});

	/**
	 * method is used to add list of Options
	 */
	const addMoreOptionSimplifiedDNDSeasonal = useCallback(() => {
		if (formik.values.optionSimplified.trim() && formik.values.optionAudioSimplified) {
			setSimplifiedOptionalsListDNDSeasonal((prev) => {
				const updatedData = prev?.map((item) => {
					if (item.optionId === editSimplifiedOptionDNDSeasonal?.optionId) {
						const newData = {
							optionId: editSimplifiedOptionDNDSeasonal?.optionId,
							option: formik.values.optionSimplified,
							optionAudio: formik.values.optionAudioSimplified,
						};
						return { ...item, ...newData };
					} else {
						return item;
					}
				});
				if (!editSimplifiedOptionDNDSeasonal) {
					updatedData?.push({
						optionId: generateUuid(),
						option: formik.values.optionSimplified,
						optionAudio: formik.values.optionAudioSimplified,
					});
				}
				return updatedData;
			});
			formik.setFieldValue(FieldNames.optionSimplified, '');
			formik.setFieldValue(FieldNames.optionAudioSimplified, '');
			setEditSimplifiedOptionDNDSeasonal(null);
			resetInputManually([FieldNames.optionAudioSimplified]);
			formik.validateForm();
		} else {
			toast.error('Please fill all fields.');
		}
	}, [formik, editSimplifiedOptionDNDSeasonal, simplifiedOptionalsListDNDSeasonal]);

	/**
	 * method is used to update correctAnswer after edit
	 */
	useEffect(() => {
		const updatedCorrectAnswers = simplifiedOptionalsListDNDSeasonal.filter((item) => correctAnswerSimplifiedDNDSeasonal?.some((data) => item.optionId === data.optionId))?.map((item) => ({ optionId: item.optionId, option: item.option }));
		setCorrectAnswerSimplifiedDNDSeasonal(updatedCorrectAnswers);
	}, [simplifiedOptionalsListDNDSeasonal]);

	/**
	 * method is used to add Traditional Options
	 */
	const addMoreOptionTraditionalDNDSeasonal = useCallback(() => {
		if (formik.values.optionTraditional.trim() && formik.values.optionAudioTraditional) {
			setTraditionalOptionalsListDNDSeasonal((prev) => {
				const updatedData = prev?.map((item) => {
					if (item.optionId === editTraditionalOptionDNDSeasonal?.optionId) {
						const newData = {
							optionId: editTraditionalOptionDNDSeasonal?.optionId,
							option: formik.values.optionTraditional,
							optionAudio: formik.values.optionAudioTraditional,
						};
						return { ...item, ...newData };
					} else {
						return item;
					}
				});
				if (!editTraditionalOptionDNDSeasonal) {
					updatedData?.push({
						optionId: generateUuid(),
						option: formik.values.optionTraditional,
						optionAudio: formik.values.optionAudioTraditional,
					});
				}
				return updatedData;
			});
			formik.setFieldValue(FieldNames.optionAudioTraditional, '');
			formik.setFieldValue(FieldNames.optionTraditional, '');
			setEditTraditionalOptionDNDSeasonal(null);
			resetInputManually([FieldNames.optionAudioTraditional]);

			formik.validateForm();
		} else {
			toast.error('Please fill all fields.');
		}
	}, [traditionalOptionalsListDNDSeasonal, editTraditionalOptionDNDSeasonal, formik]);

	/**
	 * method is used to setEdited text in correctANswer
	 */
	useEffect(() => {
		const updatedCorrectAnswers = traditionalOptionalsListDNDSeasonal.filter((item) => correctAnswerTraditionalDNDSeasonal?.some((data) => item.optionId === data.optionId))?.map((item) => ({ optionId: item.optionId, option: item.option }));
		setCorrectAnswerTraditionalDNDSeasonal(updatedCorrectAnswers);
	}, [traditionalOptionalsListDNDSeasonal]);

	/**
	 * method is used to validate form after timeInterval
	 */
	const validateFormDNDSeasonal = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 500);
	};

	/**
	 * method is used to copyDataDNDSeasonal from simplified to traditional
	 */
	const copyDataDNDSeasonal = useCallback(() => {
		formik.values.traditionalQuestionChinese !== '' && formik.setFieldValue(FieldNames.simplifiedQuestionChinese, formik.values.traditionalQuestionChinese);
		formik.values.traditionalImage !== '' && formik.setFieldValue(FieldNames.simplifiedImage, formik.values.traditionalImage);
		setSimplifiedOptionalsListDNDSeasonal(traditionalOptionalsListDNDSeasonal);
		setCorrectAnswerSimplifiedDNDSeasonal(correctAnswerTraditionalDNDSeasonal);
		validateFormDNDSeasonal();
		formik.values.traditionalQuestionAudio !== '' && formik.setFieldValue(FieldNames.simplifiedQuestionAudio, formik.values.traditionalQuestionAudio);
	}, [formik, simplifiedOptionalsListDNDSeasonal, correctAnswerSimplifiedDNDSeasonal]);

	const getErrorDNDSeasonal = (fieldName: keyof CreateDragAndDropActivity) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	const audioUploadDNDSeasonal = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateDNDSeasonal(e, fileTypeEnum.audio);
	}, []);

	const imageUploadDNDSeasonal = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateDNDSeasonal(e, fileTypeEnum.image);
	}, []);

	const editTraditionalRecordDNDSeasonal = useCallback((data: optionObject) => {
		setEditTraditionalOptionDNDSeasonal(data);
	}, []);

	const deleteTraditionalRecordDNDSeasonal = useCallback(
		(data: optionObject) => {
			setTraditionalOptionalsListDNDSeasonal(traditionalOptionalsListDNDSeasonal?.filter((item) => item.optionId !== data.optionId));
		},
		[traditionalOptionalsListDNDSeasonal]
	);

	const editSimplifiedRecordDNDSeasonal = useCallback((data: optionObject) => {
		setEditSimplifiedOptionDNDSeasonal(data);
	}, []);

	const deleteSimplifiedRecordDNDSeasonal = useCallback(
		(data: optionObject) => {
			setSimplifiedOptionalsListDNDSeasonal(simplifiedOptionalsListDNDSeasonal?.filter((item) => item.optionId !== data.optionId));
		},
		[simplifiedOptionalsListDNDSeasonal]
	);

	return (
		<div>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loadingDNDSeasonal && <Loader />}
				<div className='mb-3'>
					<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorDNDSeasonal(FieldNames.title)} required />
				</div>
				<div className='flex flex-col md:flex-row gap-3 mb-4 w-full'>
					<div className='rounded border w-full'>
						<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Traditional Chinese</h6>
						<div className='p-3 grid grid-cols-2 gap-x-4'>
							<div className='mb-4 col-span-2'>
								<TextInput placeholder='Question' name={FieldNames.traditionalQuestionChinese} onChange={formik.handleChange} label='Add Question (English)' value={formik.values.traditionalQuestionChinese} error={getErrorDNDSeasonal(FieldNames.traditionalQuestionChinese)} required />
							</div>

							<div className='mb-4'>
								<FileUpload labelName='Question Audio' id={FieldNames.traditionalQuestionAudio} imageSource={formik.values.traditionalQuestionAudio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.traditionalQuestionAudio} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadDNDSeasonal} error={getErrorDNDSeasonal(FieldNames.traditionalQuestionAudio) as string} />
								{!isPercentageValidDNDSeasonal(traditionalQuestionAudioDNDSeasonal) && <LoadingPercentage percentage={traditionalQuestionAudioDNDSeasonal} />}
							</div>
							<div className='mb-4'>
								<FileUpload labelName='Upload Image' id={FieldNames.traditionalImage} imageSource={formik.values.traditionalImage} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType} ,${FILE_TYPE.jpgType}`} name={FieldNames.traditionalImage} acceptNote={IMAGE_NOTE} uploadType={FILE_TYPE.jpegType || FILE_TYPE.pngType || FILE_TYPE.jpgType} onChange={imageUploadDNDSeasonal} error={getErrorDNDSeasonal(FieldNames.traditionalImage) as string} />
								{!isPercentageValidDNDSeasonal(imageTraditionalPercentageDNDSeasonal) && <LoadingPercentage percentage={imageTraditionalPercentageDNDSeasonal} />}
							</div>
							<div className='font-medium'>Options</div>
							<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
								<div className='mb-4 col-span-2'>
									<TextInput placeholder='option' name={FieldNames.optionTraditional} onChange={formik.handleChange} label='Option' value={formik.values.optionTraditional} error={getErrorDNDSeasonal(FieldNames.optionTraditional)} required />
								</div>
								<div className='mb-4 col-span-3'>
									<FileUpload labelName='Upload Audio' id={FieldNames.optionAudioTraditional} imageSource={formik.values.optionAudioTraditional} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.optionAudioTraditional} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadDNDSeasonal} small={true} error={getErrorDNDSeasonal(FieldNames.optionAudioTraditional) as string} />
									{!isPercentageValidDNDSeasonal(audioTraditionalPercentageDNDSeasonal) && <LoadingPercentage percentage={audioTraditionalPercentageDNDSeasonal} />}
								</div>
								<div className='flex items-center'>
									<Button className='btn-primary rounded-full' onClick={addMoreOptionTraditionalDNDSeasonal} disabled={!(audioTraditionalPercentageDNDSeasonal === 0 || audioTraditionalPercentageDNDSeasonal === 100)}>
										{editTraditionalOptionDNDSeasonal ? 'Update' : 'Add'}
									</Button>
								</div>
							</div>

							<div className='mb-4 col-span-2 overflow-auto w-full'>
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
										{traditionalOptionalsListDNDSeasonal.map((item, index) => (
											<tr key={item.optionId}>
												<td className='w-10 text-center'>{index + 1}</td>
												<td className='w-10  font-medium'>{item.option}</td>

												<td className='w-44'>
													<audio src={item.optionAudio} controls className='mb-3'></audio>
												</td>

												<td className='w-10 text-center'>
													<CheckBox
														option={[
															{
																value: '',
																checked: correctAnswerTraditionalDNDSeasonal.some((item1) => item.optionId === item1.optionId),
																name: '',
																onChange() {
																	const existingIndex = correctAnswerTraditionalDNDSeasonal.findIndex((data) => item.optionId === data.optionId);

																	if (existingIndex !== -1) {
																		// If the item exists, remove it
																		const updatedItems = correctAnswerTraditionalDNDSeasonal.filter((item1) => item.optionId !== item1.optionId);
																		setCorrectAnswerTraditionalDNDSeasonal(updatedItems);
																	} else {
																		// If the item doesn't exist, add it
																		const updatedItems = [...correctAnswerTraditionalDNDSeasonal, { optionId: item.optionId, option: item.option }];
																		setCorrectAnswerTraditionalDNDSeasonal(updatedItems);
																	}

																	validateFormDNDSeasonal();
																},
															},
														]}
														disabled={editTraditionalOptionDNDSeasonal?.optionId == item.optionId}
													/>
												</td>
												<td className='w-28'>
													<div className='flex gap-3'>
														<EditButton data={item} editRecord={editTraditionalRecordDNDSeasonal} buttonSuccess={true} disable={editTraditionalOptionDNDSeasonal?.optionId === item.optionId} />
														<DeleteButton data={item} isDeleteStatusModal={deleteTraditionalRecordDNDSeasonal} btnDanger={true} disable={editTraditionalOptionDNDSeasonal?.optionId === item.optionId} />
													</div>
												</td>
											</tr>
										))}

										{!traditionalOptionalsListDNDSeasonal.length && (
											<tr>
												<td colSpan={10} className='text-center font-medium py-5 text-gray-400'>
													No Data Added
												</td>
											</tr>
										)}
									</tbody>
								</table>
								<div>
									{correctAnswerTraditionalDNDSeasonal?.length !== 0 && (
										<span>
											Correct Answer : <span className='font-medium'>{correctAnswerTraditionalDNDSeasonal.map((item) => item.option)?.join(' ')}</span>
										</span>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className='flex flex-col justify-center items-center p-3'>
						<Button className='btn-default btn-large' title='Copy' disabled={disableUpdate} onClick={copyDataDNDSeasonal}>
							<AngleRight className='text-md' />
						</Button>
						<span className='mt-1 text-gray-500'>Copy</span>
					</div>

					<div className='rounded border w-full'>
						<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Simplified Chinese</h6>
						<div className='p-3 grid grid-cols-2 gap-x-4'>
							<div className='mb-4 col-span-2'>
								<TextInput placeholder='Question' name={FieldNames.simplifiedQuestionChinese} onChange={formik.handleChange} label='Add Question (English)' value={formik.values.simplifiedQuestionChinese} error={getErrorDNDSeasonal(FieldNames.simplifiedQuestionChinese)} required />
							</div>
							<div className='mb-4'>
								<FileUpload labelName='Question Audio' id={FieldNames.simplifiedQuestionAudio} imageSource={formik.values.simplifiedQuestionAudio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.simplifiedQuestionAudio} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadDNDSeasonal} error={getErrorDNDSeasonal(FieldNames.simplifiedQuestionAudio) as string} />
								{!isPercentageValidDNDSeasonal(simplifiedQuestionAudioDNDSeasonal) && <LoadingPercentage percentage={simplifiedQuestionAudioDNDSeasonal} />}
							</div>
							<div className='mb-4'>
								<FileUpload labelName='Upload Image' id={FieldNames.simplifiedImage} imageSource={formik.values.simplifiedImage} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType} ,${FILE_TYPE.jpgType}`} name={FieldNames.simplifiedImage} acceptNote={IMAGE_NOTE} uploadType={FILE_TYPE.jpegType || FILE_TYPE.pngType || FILE_TYPE.jpgType} onChange={imageUploadDNDSeasonal} error={getErrorDNDSeasonal(FieldNames.simplifiedImage) as string} />
								{!isPercentageValidDNDSeasonal(imageSimplifiedPercentageDNDSeasonal) && <LoadingPercentage percentage={imageSimplifiedPercentageDNDSeasonal} />}
							</div>
							<div className='font-medium '>Options</div>
							<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
								<div className='mb-4 col-span-2'>
									<TextInput placeholder='option' name={FieldNames.optionSimplified} onChange={formik.handleChange} label='Option' value={formik.values.optionSimplified} error={getErrorDNDSeasonal(FieldNames.optionSimplified)} required />
								</div>
								<div className='mb-4 col-span-3'>
									<FileUpload labelName='Upload Audio' id={FieldNames.optionAudioSimplified} imageSource={formik.values.optionAudioSimplified} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.optionAudioSimplified} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadDNDSeasonal} small={true} error={getErrorDNDSeasonal(FieldNames.optionAudioSimplified) as string} />
									{!isPercentageValidDNDSeasonal(audioSimplifiedPercentageDNDSeasonal) && <LoadingPercentage percentage={audioSimplifiedPercentageDNDSeasonal} />}
								</div>
								<div className='flex items-center'>
									<Button className='btn-primary rounded-full' onClick={addMoreOptionSimplifiedDNDSeasonal} disabled={!(audioSimplifiedPercentageDNDSeasonal === 0 || audioSimplifiedPercentageDNDSeasonal === 100)}>
										{editSimplifiedOptionDNDSeasonal ? 'Update' : 'Add'}
									</Button>
								</div>
							</div>

							<div className='mb-4 col-span-2 overflow-auto w-full'>
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
										{simplifiedOptionalsListDNDSeasonal.map((item, index) => (
											<tr key={item.optionId}>
												<td className='w-10 text-center'>{index + 1}</td>
												<td className='w-10 font-medium'>{item.option}</td>

												<td className='w-44'>
													<audio src={item.optionAudio} controls className='mb-3'></audio>
												</td>
												<td className='w-10 text-center'>
													<CheckBox
														option={[
															{
																value: '',
																checked: correctAnswerSimplifiedDNDSeasonal.some((item1) => item.optionId === item1.optionId),
																name: '',
																onChange() {
																	const existingIndex = correctAnswerSimplifiedDNDSeasonal.findIndex((data) => item.optionId === data.optionId);

																	if (existingIndex !== -1) {
																		// If the item exists, remove it
																		const updatedItems = correctAnswerSimplifiedDNDSeasonal.filter((item1) => item.optionId !== item1.optionId);
																		setCorrectAnswerSimplifiedDNDSeasonal(updatedItems);
																	} else {
																		// If the item doesn't exist, add it
																		const updatedItems = [...correctAnswerSimplifiedDNDSeasonal, { optionId: item.optionId, option: item.option }];
																		setCorrectAnswerSimplifiedDNDSeasonal(updatedItems);
																	}

																	validateFormDNDSeasonal();
																},
															},
														]}
														disabled={editSimplifiedOptionDNDSeasonal?.optionId == item.optionId}
													/>
												</td>
												<td className='w-28'>
													<div className='flex gap-3'>
														<EditButton data={item} editRecord={editSimplifiedRecordDNDSeasonal} buttonSuccess={true} disable={editSimplifiedOptionDNDSeasonal?.optionId === item.optionId} />
														<DeleteButton data={item} isDeleteStatusModal={deleteSimplifiedRecordDNDSeasonal} btnDanger={true} disable={editSimplifiedOptionDNDSeasonal?.optionId === item.optionId} />
													</div>
												</td>
											</tr>
										))}

										{!simplifiedOptionalsListDNDSeasonal.length && (
											<tr>
												<td colSpan={10} className='text-center font-medium py-5 text-gray-400'>
													No Data Added
												</td>
											</tr>
										)}
									</tbody>
								</table>
								<div>
									{correctAnswerSimplifiedDNDSeasonal?.length !== 0 && (
										<span>
											Correct Answer : <span className='font-medium'>{correctAnswerSimplifiedDNDSeasonal.map((item) => item.option)?.join(' ')}</span>
										</span>
									)}
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
								checked: skipButtonCheckedDNDSeasonal,
								name: 'Provide skip button for this activity',
								onChange() {
									setSkipButtonCheckedDNDSeasonal((prev) => !prev);
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
		</div>
	);
};

export default SeasonalActivityDragAndDrop;
