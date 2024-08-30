import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import TextInput from '@components/textInput/TextInput';
import { AddEditActivitiesData } from 'src/types/activities';
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
import { CreateDragAndDropActivity, DragAndDropActivitySubmitData, optionObject } from 'src/types/activities/dragAndDrop';
import { generateUuid, resetInputManually } from '@utils/helpers';
import { Uploader } from './utils/upload';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';

export enum FieldNames {
	title = 'title',
	simplifiedQuestionChinese = 'simplifiedQuestionChinese',
	simplifiedImage = 'simplifiedImage',
	optionSimplified = 'optionSimplified',
	optionAudioSimplified = 'optionAudioSimplified',
	simplifiedCorrectAnswer = 'simplifiedCorrectAnswer',
	traditionalQuestionChinese = 'traditionalQuestionChinese',
	traditionalImage = 'traditionalImage',
	optionTraditional = 'optionTraditional',
	optionAudioTraditional = 'optionAudioTraditional',
	traditionalCorrectAnswer = 'traditionalCorrectAnswer',
	isSkippable = 'isSkippable',
	traditionalQuestionAudio = 'traditionalQuestionAudio',
	simplifiedQuestionAudio = 'simplifiedQuestionAudio',
}

export const ActivityDragAndDrop = ({ onSubmit, onClose, url, activityUuid }: AddEditActivitiesData) => {
	const params = useParams();
	const [loadingDND, setLoadingDND] = useState<boolean>(false);
	const [skipButtonCheckedDND, setSkipButtonCheckedDND] = useState<boolean>(false);
	const [imageSimplifiedPercentageDND, setImageSimplifiedPercentageDND] = useState<number>(0);
	const [audioSimplifiedPercentageDND, setAudioSimplifiedPercentageDND] = useState<number>(0);
	const [correctAnswerSimplifiedDND, setCorrectAnswerSimplifiedDND] = useState<{ optionId: string; option: string }[]>([]);

	const [simplifiedOptionalsListDND, setSimplifiedOptionalsListDND] = useState<optionObject[]>([]);
	const [editSimplifiedOptionDND, setEditSimplifiedOptionDND] = useState<optionObject | null>(null);

	const [imageTraditionalPercentageDND, setImageTraditionalPercentageDND] = useState<number>(0);
	const [audioTraditionalPercentageDND, setAudioTraditionalPercentageDND] = useState<number>(0);
	const [traditionalQuestionAudioDND, setTraditionalQuestionAudioDND] = useState<number>(0);
	const [simplifiedQuestionAudioDND, setSimplifiedQuestionAudioDND] = useState<number>(0);

	const [traditionalOptionalsListDND, setTraditionalOptionalsListDND] = useState<optionObject[]>([]);
	const [editTraditionalOptionDND, setEditTraditionalOptionDND] = useState<optionObject | null>(null);
	const [correctAnswerTraditionalDND, setCorrectAnswerTraditionalDND] = useState<{ optionId: string; option: string }[]>([]);

	const updatePercentageDND = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.optionAudioSimplified:
				setAudioSimplifiedPercentageDND(newPercentage);
				break;
			case FieldNames.optionAudioTraditional:
				setAudioTraditionalPercentageDND(newPercentage);
				break;
			case FieldNames.simplifiedImage:
				setImageSimplifiedPercentageDND(newPercentage);
				break;
			case FieldNames.traditionalImage:
				setImageTraditionalPercentageDND(newPercentage);
				break;
			case FieldNames.traditionalQuestionAudio:
				setTraditionalQuestionAudioDND(newPercentage);
				break;
			case FieldNames.simplifiedQuestionAudio:
				setSimplifiedQuestionAudioDND(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidDND = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdate = !(isPercentageValidDND(imageSimplifiedPercentageDND) && isPercentageValidDND(imageTraditionalPercentageDND) && isPercentageValidDND(audioSimplifiedPercentageDND) && isPercentageValidDND(audioTraditionalPercentageDND) && isPercentageValidDND(traditionalQuestionAudioDND) && isPercentageValidDND(simplifiedQuestionAudioDND));

	/**
	 *@returns Method used for setValue from questions data and get the details of question by uuid
	 */
	useEffect(() => {
		if (params.activityId) {
			setLoadingDND(true);
			APIService.getData(`${url}/drag-and-drop/${params.activityId}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const responseData = response.data.data.activityData;
						formik.setFieldValue(FieldNames.title, response.data.data.title);
						formik.setFieldValue(FieldNames.simplifiedQuestionChinese, responseData.simplifiedQuestion);
						formik.setFieldValue(FieldNames.simplifiedImage, responseData.simplifiedImage);
						setSimplifiedOptionalsListDND(responseData.simplifiedOptions);
						formik.setFieldValue(FieldNames.traditionalQuestionChinese, responseData.traditionalQuestion);
						formik.setFieldValue(FieldNames.traditionalImage, responseData.traditionalImage);
						setTraditionalOptionalsListDND(responseData.traditionalOptions);
						setSkipButtonCheckedDND(response.data.data.isSkippable);
						setCorrectAnswerSimplifiedDND(responseData.simplifiedAnswerOptions);
						setCorrectAnswerTraditionalDND(responseData.traditionalAnswerOptions);
						formik.setFieldValue(FieldNames.traditionalQuestionAudio, responseData.traditionalQuestionUrl);
						formik.setFieldValue(FieldNames.simplifiedQuestionAudio, responseData.simplifiedQuestionUrl);
					} else {
						toast.error(response?.data?.message);
					}
					setLoadingDND(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingDND(false);
				});
		}
	}, []);

	useEffect(() => {
		if (editTraditionalOptionDND) {
			formik.setFieldValue(FieldNames.optionTraditional, editTraditionalOptionDND.option);
			formik.setFieldValue(FieldNames.optionAudioTraditional, editTraditionalOptionDND?.optionAudio);
		}
		if (editSimplifiedOptionDND) {
			formik.setFieldValue(FieldNames.optionSimplified, editSimplifiedOptionDND?.option);
			formik.setFieldValue(FieldNames.optionAudioSimplified, editSimplifiedOptionDND?.optionAudio);
		}
	}, [editTraditionalOptionDND, editSimplifiedOptionDND]);

	const initialValues: CreateDragAndDropActivity = {
		levelId: params?.levelId as string,
		activityTypeId: activityUuid,
		topicId: params?.topicId as string,
		lessonId: params?.lessonId as string,
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
	const fileUpdateDND = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileDND = event.target.files?.[0];
		const fileName = event.target.name;
		if (fileDND === undefined) {
			return;
		}
		const fileSize = type === fileTypeEnum.image ? IMAGE_SIZE_MB : AUDIO_SIZE_MB;
		const fileTypes = type === fileTypeEnum.image ? [FILE_TYPE.pngType, FILE_TYPE.jpgType, FILE_TYPE.jpegType] : [FILE_TYPE.audioType, FILE_TYPE.wavType];
		if (!fileTypes.includes(fileDND.type)) {
			setLoadingDND(false);
			toast.error(type === fileTypeEnum.image ? Errors.PLEASE_ALLOW_JPG_PNG_JPEG_FILE : Errors.PLEASE_ALLOW_MP3_WAV_FILE);
			return;
		}
		if (fileDND.size / 1000 / 1024 >= fileSize) {
			toast.error(`Uploaded ${type} size is greater than ${fileSize}MB, please upload ${type} size within ${fileSize}MB or max ${fileSize}MB`);
		}
		const lastIndex = fileDND?.name?.lastIndexOf('.');
		const extension = fileDND?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileDND);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptionsDND = {
					fileName: name,
					file: fileDND,
					isForSeasonal: false,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(imageUploaderOptionsDND, updatePercentageDND);
				uploader.start();
				switch (fileName) {
					case FieldNames.simplifiedImage:
						uploader.onComplete((response: string) => {
							setLoadingDND(false);
							formik.setFieldValue(FieldNames.simplifiedImage, response);
						});
						break;
					case FieldNames.traditionalImage:
						uploader.onComplete((response: string) => {
							setLoadingDND(false);
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
			const blob = URL.createObjectURL(fileDND);
			audio.src = blob;
			audio.addEventListener('loadedmetadata', () => {
				const audioUploaderOptionsDND = {
					fileName: name,
					file: fileDND,
					isForSeasonal: false,
					isForSop: false,
					fieldName: fileName,
				};
				const uploader = new Uploader(audioUploaderOptionsDND, updatePercentageDND);
				uploader.start();
				switch (fileName) {
					case FieldNames.optionAudioSimplified:
						uploader.onComplete((response: string) => {
							setLoadingDND(false);
							formik.setFieldValue(FieldNames.optionAudioSimplified, response);
						});
						break;
					case FieldNames.optionAudioTraditional:
						uploader.onComplete((response: string) => {
							setLoadingDND(false);
							formik.setFieldValue(FieldNames.optionAudioTraditional, response);
						});
						break;
					case FieldNames.traditionalQuestionAudio:
						uploader.onComplete((response: string) => {
							setLoadingDND(false);
							formik.setFieldValue(FieldNames.traditionalQuestionAudio, response);
						});
						break;
					case FieldNames.simplifiedQuestionAudio:
						uploader.onComplete((response: string) => {
							setLoadingDND(false);
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
	const getObjDND = () => {
		const obj: ObjectShape = {
			[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.simplifiedQuestionChinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_QUESTION).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.simplifiedImage]: Yup.mixed().required(Errors.PLEASE_SELECT_IMAGE),
			[FieldNames.optionSimplified]: simplifiedOptionalsListDND.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioSimplified]: simplifiedOptionalsListDND.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_AUDIO),

			[FieldNames.traditionalQuestionChinese]: Yup.string().trim().required(Errors.PLEASE_ENTER_QUESTION).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
			[FieldNames.traditionalImage]: Yup.mixed().required(Errors.PLEASE_SELECT_IMAGE),

			[FieldNames.optionTraditional]: traditionalOptionalsListDND.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioTraditional]: traditionalOptionalsListDND.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_AUDIO),
			[FieldNames.traditionalQuestionAudio]: Yup.mixed().required(Errors.PLEASE_SELECT_AUDIO),
			[FieldNames.simplifiedQuestionAudio]: Yup.mixed().required(Errors.PLEASE_SELECT_AUDIO),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObjDND();

	const checkCorrectAnswerDND = () => {
		!correctAnswerSimplifiedDND.length && toast.error(Errors.PLEASE_SELECT_CORRECT_ANSWER_SIMPLIFIED);
		!correctAnswerTraditionalDND.length && toast.error(Errors.PLEASE_SELECT_CORRECT_ANSWER_TRADITIONAL);
	};

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updatedData: DragAndDropActivitySubmitData = {
				levelId: values.levelId,
				topicId: values.topicId,
				lessonId: values.lessonId,
				title: values.title.trim(),
				activityData: {
					simplifiedImage: values.simplifiedImage.split('/').pop() as string,
					simplifiedQuestion: formik.values.simplifiedQuestionChinese.trim(),
					simplifiedOptions: simplifiedOptionalsListDND.map(({ optionAudio, ...rest }) => ({
						optionAudio: optionAudio.split('/').pop() as string,
						...rest,
					})),
					simplifiedAnswerOptions: correctAnswerSimplifiedDND,
					simplifiedCorrectAnswer: correctAnswerSimplifiedDND.map((item) => item.option)?.join(' '),
					traditionalImage: values.traditionalImage.split('/').pop() as string,
					traditionalQuestion: formik.values.traditionalQuestionChinese.trim(),
					traditionalOptions: traditionalOptionalsListDND.map(({ optionAudio, ...rest }) => ({
						optionAudio: optionAudio.split('/').pop() as string,
						...rest,
					})),
					traditionalAnswerOptions: correctAnswerTraditionalDND,
					traditionalCorrectAnswer: correctAnswerTraditionalDND.map((item) => item.option)?.join(' '),
					simplifiedQuestionUrl: values.simplifiedQuestionAudio.split('/').pop() as string,
					traditionalQuestionUrl: values.traditionalQuestionAudio.split('/').pop() as string,
				},
				isSkippable: skipButtonCheckedDND,
			};
			if (correctAnswerSimplifiedDND.length && correctAnswerTraditionalDND.length) {
				if (params.activityId) {
					setLoadingDND(true);
					APIService.putData(`${url}/drag-and-drop/${params.activityId}`, {
						...updatedData,
					})
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingDND(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingDND(false);
						});
				} else {
					setLoadingDND(true);
					APIService.postData(`${url}/drag-and-drop`, {
						...updatedData,
						activityTypeId: values.activityTypeId,
					})
						.then((response) => {
							if (response.status === ResponseCode.success || ResponseCode.created) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingDND(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingDND(false);
						});
				}
			} else {
				checkCorrectAnswerDND();
			}
		},
	});

	/**
	 * method is used to add list of Options
	 */
	const addMoreOptionSimplifiedDND = useCallback(() => {
		if (formik.values.optionSimplified.trim() && formik.values.optionAudioSimplified) {
			setSimplifiedOptionalsListDND((prev) => {
				const updatedData = prev?.map((item) => {
					if (item.optionId === editSimplifiedOptionDND?.optionId) {
						const newData = {
							optionId: editSimplifiedOptionDND?.optionId,
							option: formik.values.optionSimplified,
							optionAudio: formik.values.optionAudioSimplified,
						};
						return { ...item, ...newData };
					} else {
						return item;
					}
				});
				if (!editSimplifiedOptionDND) {
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
			setEditSimplifiedOptionDND(null);
			resetInputManually([FieldNames.optionAudioSimplified]);
			formik.validateForm();
		} else {
			toast.error('Please fill all fields.');
		}
	}, [formik, editSimplifiedOptionDND, simplifiedOptionalsListDND]);

	/**
	 * method is used to update correctAnswer after edit
	 */
	useEffect(() => {
		const updatedCorrectAnswers = simplifiedOptionalsListDND.filter((item) => correctAnswerSimplifiedDND?.some((data) => item.optionId === data.optionId))?.map((item) => ({ optionId: item.optionId, option: item.option }));
		setCorrectAnswerSimplifiedDND(updatedCorrectAnswers);
	}, [simplifiedOptionalsListDND]);

	/**
	 * method is used to add Traditional Options
	 */
	const addMoreOptionTraditionalDND = useCallback(() => {
		if (formik.values.optionTraditional.trim() && formik.values.optionAudioTraditional) {
			setTraditionalOptionalsListDND((prev) => {
				const updatedData = prev?.map((item) => {
					if (item.optionId === editTraditionalOptionDND?.optionId) {
						const newData = {
							optionId: editTraditionalOptionDND?.optionId,
							option: formik.values.optionTraditional,
							optionAudio: formik.values.optionAudioTraditional,
						};
						return { ...item, ...newData };
					} else {
						return item;
					}
				});
				if (!editTraditionalOptionDND) {
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
			setEditTraditionalOptionDND(null);
			resetInputManually([FieldNames.optionAudioTraditional]);

			formik.validateForm();
		} else {
			toast.error('Please fill all fields.');
		}
	}, [traditionalOptionalsListDND, editTraditionalOptionDND, formik]);

	/**
	 * method is used to setEdited text in correctANswer
	 */
	useEffect(() => {
		const updatedCorrectAnswers = traditionalOptionalsListDND.filter((item) => correctAnswerTraditionalDND?.some((data) => item.optionId === data.optionId))?.map((item) => ({ optionId: item.optionId, option: item.option }));
		setCorrectAnswerTraditionalDND(updatedCorrectAnswers);
	}, [traditionalOptionalsListDND]);

	/**
	 * method is used to validate form after timeInterval
	 */
	const validateFormDND = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 500);
	};

	/**
	 * method is used to copyDataDND from simplified to traditional
	 */
	const copyDataDND = useCallback(() => {
		formik.values.traditionalQuestionChinese !== '' && formik.setFieldValue(FieldNames.simplifiedQuestionChinese, formik.values.traditionalQuestionChinese);
		formik.values.traditionalImage !== '' && formik.setFieldValue(FieldNames.simplifiedImage, formik.values.traditionalImage);
		setSimplifiedOptionalsListDND(traditionalOptionalsListDND);
		setCorrectAnswerSimplifiedDND(correctAnswerTraditionalDND);
		validateFormDND();
		formik.values.traditionalQuestionAudio !== '' && formik.setFieldValue(FieldNames.simplifiedQuestionAudio, formik.values.traditionalQuestionAudio);
	}, [formik, simplifiedOptionalsListDND, correctAnswerSimplifiedDND]);

	const getErrorDND = (fieldName: keyof CreateDragAndDropActivity) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	const audioUploadDND = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateDND(e, fileTypeEnum.audio);
	}, []);

	const imageUploadDND = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateDND(e, fileTypeEnum.image);
	}, []);

	const editTraditionalRecordDND = useCallback((data: optionObject) => {
		setEditTraditionalOptionDND(data);
	}, []);

	const deleteTraditionalRecordDND = useCallback(
		(data: optionObject) => {
			setTraditionalOptionalsListDND(traditionalOptionalsListDND?.filter((item) => item.optionId !== data.optionId));
		},
		[traditionalOptionalsListDND]
	);

	const editSimplifiedRecordDND = useCallback((data: optionObject) => {
		setEditSimplifiedOptionDND(data);
	}, []);

	const deleteSimplifiedRecordDND = useCallback(
		(data: optionObject) => {
			setSimplifiedOptionalsListDND(simplifiedOptionalsListDND?.filter((item) => item.optionId !== data.optionId));
		},
		[simplifiedOptionalsListDND]
	);

	return (
		<div>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loadingDND && <Loader />}
				<div className='mb-3'>
					<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorDND(FieldNames.title)} required />
				</div>
				<div className='flex flex-col md:flex-row gap-3 mb-4 w-full'>
					<div className='rounded border w-full'>
						<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Traditional Chinese</h6>
						<div className='p-3 grid grid-cols-2 gap-x-4'>
							<div className='mb-4 col-span-2'>
								<TextInput placeholder='Question' name={FieldNames.traditionalQuestionChinese} onChange={formik.handleChange} label='Add Question (English)' value={formik.values.traditionalQuestionChinese} error={getErrorDND(FieldNames.traditionalQuestionChinese)} required />
							</div>

							<div className='mb-4'>
								<FileUpload labelName='Question Audio' id={FieldNames.traditionalQuestionAudio} imageSource={formik.values.traditionalQuestionAudio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.traditionalQuestionAudio} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadDND} error={getErrorDND(FieldNames.traditionalQuestionAudio) as string} />
								{!isPercentageValidDND(traditionalQuestionAudioDND) && <LoadingPercentage percentage={traditionalQuestionAudioDND} />}
							</div>
							<div className='mb-4'>
								<FileUpload labelName='Upload Image' id={FieldNames.traditionalImage} imageSource={formik.values.traditionalImage} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType} ,${FILE_TYPE.jpgType}`} name={FieldNames.traditionalImage} acceptNote={IMAGE_NOTE} uploadType={FILE_TYPE.jpegType || FILE_TYPE.pngType || FILE_TYPE.jpgType} onChange={imageUploadDND} error={getErrorDND(FieldNames.traditionalImage) as string} />
								{!isPercentageValidDND(imageTraditionalPercentageDND) && <LoadingPercentage percentage={imageTraditionalPercentageDND} />}
							</div>
							<div className='font-medium'>Options</div>
							<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
								<div className='mb-4 col-span-2'>
									<TextInput placeholder='option' name={FieldNames.optionTraditional} onChange={formik.handleChange} label='Option' value={formik.values.optionTraditional} error={getErrorDND(FieldNames.optionTraditional)} required />
								</div>
								<div className='mb-4 col-span-3'>
									<FileUpload labelName='Upload Audio' id={FieldNames.optionAudioTraditional} imageSource={formik.values.optionAudioTraditional} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.optionAudioTraditional} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadDND} small={true} error={getErrorDND(FieldNames.optionAudioTraditional) as string} />
									{!isPercentageValidDND(audioTraditionalPercentageDND) && <LoadingPercentage percentage={audioTraditionalPercentageDND} />}
								</div>
								<div className='flex items-center'>
									<Button className='btn-primary rounded-full' onClick={addMoreOptionTraditionalDND} disabled={!(audioTraditionalPercentageDND === 0 || audioTraditionalPercentageDND === 100)}>
										{editTraditionalOptionDND ? 'Update' : 'Add'}
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
										{traditionalOptionalsListDND.map((item, index) => (
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
																checked: correctAnswerTraditionalDND.some((item1) => item.optionId === item1.optionId),
																name: '',
																onChange() {
																	const existingIndex = correctAnswerTraditionalDND.findIndex((data) => item.optionId === data.optionId);

																	if (existingIndex !== -1) {
																		// If the item exists, remove it
																		const updatedItems = correctAnswerTraditionalDND.filter((item1) => item.optionId !== item1.optionId);
																		setCorrectAnswerTraditionalDND(updatedItems);
																	} else {
																		// If the item doesn't exist, add it
																		const updatedItems = [...correctAnswerTraditionalDND, { optionId: item.optionId, option: item.option }];
																		setCorrectAnswerTraditionalDND(updatedItems);
																	}

																	validateFormDND();
																},
															},
														]}
														disabled={editTraditionalOptionDND?.optionId == item.optionId}
													/>
												</td>
												<td className='w-28'>
													<div className='flex gap-3'>
														<EditButton data={item} editRecord={editTraditionalRecordDND} buttonSuccess={true} disable={editTraditionalOptionDND?.optionId === item.optionId} />
														<DeleteButton data={item} isDeleteStatusModal={deleteTraditionalRecordDND} btnDanger={true} disable={editTraditionalOptionDND?.optionId === item.optionId} />
													</div>
												</td>
											</tr>
										))}

										{!traditionalOptionalsListDND.length && (
											<tr>
												<td colSpan={10} className='text-center font-medium py-5 text-gray-400'>
													No Data Added
												</td>
											</tr>
										)}
									</tbody>
								</table>
								<div>
									{correctAnswerTraditionalDND?.length !== 0 && (
										<span>
											Correct Answer : <span className='font-medium'>{correctAnswerTraditionalDND.map((item) => item.option)?.join(' ')}</span>
										</span>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className='flex flex-col justify-center items-center p-3'>
						<Button className='btn-default btn-large' title='Copy' disabled={disableUpdate} onClick={copyDataDND}>
							<AngleRight className='text-md' />
						</Button>
						<span className='mt-1 text-gray-500'>Copy</span>
					</div>

					<div className='rounded border w-full'>
						<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Simplified Chinese</h6>
						<div className='p-3 grid grid-cols-2 gap-x-4'>
							<div className='mb-4 col-span-2'>
								<TextInput placeholder='Question' name={FieldNames.simplifiedQuestionChinese} onChange={formik.handleChange} label='Add Question (English)' value={formik.values.simplifiedQuestionChinese} error={getErrorDND(FieldNames.simplifiedQuestionChinese)} required />
							</div>
							<div className='mb-4'>
								<FileUpload labelName='Question Audio' id={FieldNames.simplifiedQuestionAudio} imageSource={formik.values.simplifiedQuestionAudio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.simplifiedQuestionAudio} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadDND} error={getErrorDND(FieldNames.simplifiedQuestionAudio) as string} />
								{!isPercentageValidDND(simplifiedQuestionAudioDND) && <LoadingPercentage percentage={simplifiedQuestionAudioDND} />}
							</div>
							<div className='mb-4'>
								<FileUpload labelName='Upload Image' id={FieldNames.simplifiedImage} imageSource={formik.values.simplifiedImage} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType} ,${FILE_TYPE.jpgType}`} name={FieldNames.simplifiedImage} acceptNote={IMAGE_NOTE} uploadType={FILE_TYPE.jpegType || FILE_TYPE.pngType || FILE_TYPE.jpgType} onChange={imageUploadDND} error={getErrorDND(FieldNames.simplifiedImage) as string} />
								{!isPercentageValidDND(imageSimplifiedPercentageDND) && <LoadingPercentage percentage={imageSimplifiedPercentageDND} />}
							</div>
							<div className='font-medium '>Options</div>
							<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
								<div className='mb-4 col-span-2'>
									<TextInput placeholder='option' name={FieldNames.optionSimplified} onChange={formik.handleChange} label='Option' value={formik.values.optionSimplified} error={getErrorDND(FieldNames.optionSimplified)} required />
								</div>
								<div className='mb-4 col-span-3'>
									<FileUpload labelName='Upload Audio' id={FieldNames.optionAudioSimplified} imageSource={formik.values.optionAudioSimplified} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.optionAudioSimplified} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadDND} small={true} error={getErrorDND(FieldNames.optionAudioSimplified) as string} />
									{!isPercentageValidDND(audioSimplifiedPercentageDND) && <LoadingPercentage percentage={audioSimplifiedPercentageDND} />}
								</div>
								<div className='flex items-center'>
									<Button className='btn-primary rounded-full' onClick={addMoreOptionSimplifiedDND} disabled={!(audioSimplifiedPercentageDND === 0 || audioSimplifiedPercentageDND === 100)}>
										{editSimplifiedOptionDND ? 'Update' : 'Add'}
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
										{simplifiedOptionalsListDND.map((item, index) => (
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
																checked: correctAnswerSimplifiedDND.some((item1) => item.optionId === item1.optionId),
																name: '',
																onChange() {
																	const existingIndex = correctAnswerSimplifiedDND.findIndex((data) => item.optionId === data.optionId);

																	if (existingIndex !== -1) {
																		// If the item exists, remove it
																		const updatedItems = correctAnswerSimplifiedDND.filter((item1) => item.optionId !== item1.optionId);
																		setCorrectAnswerSimplifiedDND(updatedItems);
																	} else {
																		// If the item doesn't exist, add it
																		const updatedItems = [...correctAnswerSimplifiedDND, { optionId: item.optionId, option: item.option }];
																		setCorrectAnswerSimplifiedDND(updatedItems);
																	}

																	validateFormDND();
																},
															},
														]}
														disabled={editSimplifiedOptionDND?.optionId == item.optionId}
													/>
												</td>
												<td className='w-28'>
													<div className='flex gap-3'>
														<EditButton data={item} editRecord={editSimplifiedRecordDND} buttonSuccess={true} disable={editSimplifiedOptionDND?.optionId === item.optionId} />
														<DeleteButton data={item} isDeleteStatusModal={deleteSimplifiedRecordDND} btnDanger={true} disable={editSimplifiedOptionDND?.optionId === item.optionId} />
													</div>
												</td>
											</tr>
										))}

										{!simplifiedOptionalsListDND.length && (
											<tr>
												<td colSpan={10} className='text-center font-medium py-5 text-gray-400'>
													No Data Added
												</td>
											</tr>
										)}
									</tbody>
								</table>
								<div>
									{correctAnswerSimplifiedDND?.length !== 0 && (
										<span>
											Correct Answer : <span className='font-medium'>{correctAnswerSimplifiedDND.map((item) => item.option)?.join(' ')}</span>
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
								checked: skipButtonCheckedDND,
								name: 'Provide skip button for this activity',
								onChange() {
									setSkipButtonCheckedDND((prev) => !prev);
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

export default ActivityDragAndDrop;
