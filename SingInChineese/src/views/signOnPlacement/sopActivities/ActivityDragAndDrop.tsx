import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import TextInput from '@components/textInput/TextInput';
import { AddEditActivitiesData } from 'src/types/activities';
import CheckBox from '@components/checkbox/CheckBox';
import { APIService } from '@framework/services/api';
import { FieldNames, ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { AngleRight } from '@components/icons';
import FileUpload from '@components/fileUpload/FileUpload';
import { IMAGE_NOTE, FILE_TYPE, fileTypeEnum, activityPaths, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE } from '@config/constant';
import { Errors } from '@config/errors';
import { useParams } from 'react-router-dom';
import { generateUuid, moveData, resetInputManually, translateText, typeValidation } from '@utils/helpers';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import { Uploader } from '@views/activities/utils/upload';
import { CreateDragAndDropActivity, DragAndDropActivitySubmitData, optionObject } from 'src/types/activities/dragAndDrop';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import { mixedNotRequired, mixedRequired, stringMaxLimit, stringNoSpecialChar, stringNotRequired, stringTrim } from '@config/validations';

export const ActivityDragAndDropSop = ({ onSubmit, onClose, url, activityUuid, toggleActivity, levelId, isMoving }: AddEditActivitiesData) => {
	const params = useParams();
	const [loadingDNDSop, setLoadingDNDSop] = useState<boolean>(false);
	const [skipButtonCheckedDNDSop, setSkipButtonCheckedDNDSop] = useState<boolean>(false);
	const [imageSimplifiedPercentageDNDSop, setImageSimplifiedPercentageDNDSop] = useState<number>(0);
	const [audioSimplifiedPercentageDNDSop, setAudioSimplifiedPercentageDNDSop] = useState<number>(0);
	const [correctAnswerSimplifiedDNDSop, setCorrectAnswerSimplifiedDNDSop] = useState<{ optionId: string; option: string }[]>([]);

	const [simplifiedOptionalsListDNDSop, setSimplifiedOptionalsListDNDSop] = useState<optionObject[]>([]);
	const [editSimplifiedOptionDNDSop, setEditSimplifiedOptionDNDSop] = useState<optionObject | null>(null);

	const [imageTraditionalPercentageDNDSop, setImageTraditionalPercentageDNDSop] = useState<number>(0);
	const [audioTraditionalPercentageDNDSop, setAudioTraditionalPercentageDNDSop] = useState<number>(0);
	const [traditionalQuestionAudioDNDSop, setTraditionalQuestionAudioDNDSop] = useState<number>(0);
	const [simplifiedQuestionAudioDNDSop, setSimplifiedQuestionAudioDNDSop] = useState<number>(0);

	const [traditionalOptionalsListDNDSop, setTraditionalOptionalsListDNDSop] = useState<optionObject[]>([]);
	const [editTraditionalOptionDNDSop, setEditTraditionalOptionDNDSop] = useState<optionObject | null>(null);
	const [correctAnswerTraditionalDNDSop, setCorrectAnswerTraditionalDNDSop] = useState<{ optionId: string; option: string }[]>([]);

	const [traditionalCompleteActivityAudioDNDSop, setTraditionalCompleteActivityAudioDNDSop] = useState<number>(0);
	const [simplifiedCompleteActivityAudioDNDSop, setSimplifiedCompleteActivityAudioDNDSop] = useState<number>(0);

	const updatePercentageDNDSop = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.optionAudioSimplified:
				setAudioSimplifiedPercentageDNDSop(newPercentage);
				break;
			case FieldNames.optionAudioTraditional:
				setAudioTraditionalPercentageDNDSop(newPercentage);
				break;
			case FieldNames.simplifiedImage:
				setImageSimplifiedPercentageDNDSop(newPercentage);
				break;
			case FieldNames.traditionalImage:
				setImageTraditionalPercentageDNDSop(newPercentage);
				break;
			case FieldNames.traditionalQuestionAudio:
				setTraditionalQuestionAudioDNDSop(newPercentage);
				break;
			case FieldNames.simplifiedQuestionAudio:
				setSimplifiedQuestionAudioDNDSop(newPercentage);
				break;
			case FieldNames.traditionalCompleteActivityAudio:
				setTraditionalCompleteActivityAudioDNDSop(newPercentage);
				break;
			case FieldNames.simplifiedCompleteActivityAudio:
				setSimplifiedCompleteActivityAudioDNDSop(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidDNDSop = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdate = !(isPercentageValidDNDSop(imageSimplifiedPercentageDNDSop) && isPercentageValidDNDSop(imageTraditionalPercentageDNDSop) && isPercentageValidDNDSop(audioSimplifiedPercentageDNDSop) && isPercentageValidDNDSop(audioTraditionalPercentageDNDSop) && isPercentageValidDNDSop(traditionalQuestionAudioDNDSop) && isPercentageValidDNDSop(simplifiedQuestionAudioDNDSop));

	/**
	 *@returns Method used for setValue from questions data and get the details of question by uuid
	 */
	useEffect(() => {
		if (params.activityId) {
			setLoadingDNDSop(true);
			APIService.getData(`${url}/${activityPaths.dragAndDrop}/${params.activityId}?${activityPaths.isForSop}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const responseData = response.data.data.activityData;
						const toggle = response.data.data.toggle;
						toggleActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);
						formik.setFieldValue(FieldNames.title, response.data.data.title);
						formik.setFieldValue(FieldNames.simplifiedQuestionChinese, responseData.simplifiedQuestion);
						formik.setFieldValue(FieldNames.simplifiedImage, responseData.simplifiedImage);
						setSimplifiedOptionalsListDNDSop(responseData.simplifiedOptions);
						formik.setFieldValue(FieldNames.traditionalQuestionChinese, responseData.traditionalQuestion);
						formik.setFieldValue(FieldNames.traditionalImage, responseData.traditionalImage);
						setTraditionalOptionalsListDNDSop(responseData.traditionalOptions);
						setSkipButtonCheckedDNDSop(response.data.data.isSkippable);
						setCorrectAnswerSimplifiedDNDSop(responseData.simplifiedAnswerOptions);
						setCorrectAnswerTraditionalDNDSop(responseData.traditionalAnswerOptions);
						formik.setFieldValue(FieldNames.traditionalQuestionAudio, responseData.traditionalQuestionUrl);
						formik.setFieldValue(FieldNames.simplifiedQuestionAudio, responseData.simplifiedQuestionUrl);
						formik.setFieldValue(FieldNames.traditionalCompleteActivityAudio, responseData.traditionalCompleteActivityAudio);
						formik.setFieldValue(FieldNames.simplifiedCompleteActivityAudio, responseData.simplifiedCompleteActivityAudio);
					} else {
						toast.error(response?.data?.message);
					}
					setLoadingDNDSop(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingDNDSop(false);
				});
		}
	}, []);

	useEffect(() => {
		if (editTraditionalOptionDNDSop) {
			formik.setFieldValue(FieldNames.optionTraditional, editTraditionalOptionDNDSop.option);
			formik.setFieldValue(FieldNames.optionAudioTraditional, editTraditionalOptionDNDSop?.optionAudio);
		}
		if (editSimplifiedOptionDNDSop) {
			formik.setFieldValue(FieldNames.optionSimplified, editSimplifiedOptionDNDSop?.option);
			formik.setFieldValue(FieldNames.optionAudioSimplified, editSimplifiedOptionDNDSop?.optionAudio);
		}
	}, [editTraditionalOptionDNDSop, editSimplifiedOptionDNDSop]);

	const initialValues: CreateDragAndDropActivity = {
		levelId: params?.levelId as string,
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
		traditionalCompleteActivityAudio: '',
		simplifiedCompleteActivityAudio: '',
	};

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const fileUpdateDNDSop = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileDNDSop = event.target.files?.[0] as File;
		const fileName = event.target.name;
		typeValidation(fileDNDSop, type);
		const lastIndex = fileDNDSop?.name?.lastIndexOf('.');
		const extension = fileDNDSop?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileDNDSop);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptionsDNDSop = {
					fileName: name,
					file: fileDNDSop,
					isForSeasonal: false,
					isForSop: true,
					fieldName: fileName,
				};
				const uploader = new Uploader(imageUploaderOptionsDNDSop, updatePercentageDNDSop);
				uploader.start();
				switch (fileName) {
					case FieldNames.simplifiedImage:
						uploader.onComplete((response: string) => {
							setLoadingDNDSop(false);
							formik.setFieldValue(FieldNames.simplifiedImage, response);
						});
						break;
					case FieldNames.traditionalImage:
						uploader.onComplete((response: string) => {
							setLoadingDNDSop(false);
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
			const blob = URL.createObjectURL(fileDNDSop);
			audio.src = blob;
			audio.addEventListener('loadedmetadata', () => {
				const audioUploaderOptionsDNDSop = {
					fileName: name,
					file: fileDNDSop,
					isForSeasonal: false,
					isForSop: true,
					fieldName: fileName,
				};
				const uploader = new Uploader(audioUploaderOptionsDNDSop, updatePercentageDNDSop);
				uploader.start();
				switch (fileName) {
					case FieldNames.optionAudioSimplified:
						uploader.onComplete((response: string) => {
							setLoadingDNDSop(false);
							formik.setFieldValue(FieldNames.optionAudioSimplified, response);
						});
						break;
					case FieldNames.optionAudioTraditional:
						uploader.onComplete((response: string) => {
							setLoadingDNDSop(false);
							formik.setFieldValue(FieldNames.optionAudioTraditional, response);
						});
						break;
					case FieldNames.traditionalQuestionAudio:
						uploader.onComplete((response: string) => {
							setLoadingDNDSop(false);
							formik.setFieldValue(FieldNames.traditionalQuestionAudio, response);
						});
						break;
					case FieldNames.simplifiedQuestionAudio:
						uploader.onComplete((response: string) => {
							setLoadingDNDSop(false);
							formik.setFieldValue(FieldNames.simplifiedQuestionAudio, response);
						});
						break;
					case FieldNames.traditionalCompleteActivityAudio:
						uploader.onComplete((response: string) => {
							setLoadingDNDSop(false);
							formik.setFieldValue(FieldNames.traditionalCompleteActivityAudio, response);
						});
						break;
					case FieldNames.simplifiedCompleteActivityAudio:
						uploader.onComplete((response: string) => {
							setLoadingDNDSop(false);
							formik.setFieldValue(FieldNames.simplifiedCompleteActivityAudio, response);
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
	const getObjDNDSop = () => {
		const obj: ObjectShape = {
			[FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
			[FieldNames.simplifiedQuestionChinese]: stringMaxLimit(Errors.PLEASE_ENTER_QUESTION),
			[FieldNames.simplifiedImage]: mixedRequired(Errors.PLEASE_SELECT_IMAGE),
			[FieldNames.optionSimplified]: simplifiedOptionalsListDNDSop.length ? stringNotRequired() : stringTrim(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioSimplified]: simplifiedOptionalsListDNDSop.length ? mixedNotRequired() : mixedRequired(Errors.PLEASE_SELECT_AUDIO),
			[FieldNames.traditionalQuestionChinese]: stringMaxLimit(Errors.PLEASE_ENTER_QUESTION),
			[FieldNames.traditionalImage]: mixedRequired(Errors.PLEASE_SELECT_IMAGE),
			[FieldNames.optionTraditional]: traditionalOptionalsListDNDSop.length ? stringNotRequired() : stringTrim(Errors.PLEASE_ENTER_OPTION),
			[FieldNames.optionAudioTraditional]: traditionalOptionalsListDNDSop.length ? mixedNotRequired() : mixedRequired(Errors.PLEASE_SELECT_AUDIO),
			[FieldNames.traditionalQuestionAudio]: mixedRequired(Errors.PLEASE_SELECT_AUDIO),
			[FieldNames.simplifiedQuestionAudio]: mixedRequired(Errors.PLEASE_SELECT_AUDIO),
			[FieldNames.traditionalCompleteActivityAudio]: mixedRequired(Errors.AUDIO_IS_REQUIRED),
			[FieldNames.simplifiedCompleteActivityAudio]: mixedRequired(Errors.AUDIO_IS_REQUIRED),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObjDNDSop();

	const checkCorrectAnswerDNDSop = () => {
		!correctAnswerSimplifiedDNDSop.length && toast.error(Errors.PLEASE_SELECT_CORRECT_ANSWER_SIMPLIFIED);
		!correctAnswerTraditionalDNDSop.length && toast.error(Errors.PLEASE_SELECT_CORRECT_ANSWER_TRADITIONAL);
	};

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const updatedData: DragAndDropActivitySubmitData = {
				isMoving: isMoving,
				levelId: moveData(isMoving, levelId as string, values.levelId as string),
				title: values.title.trim(),
				isForSop: true,
				activityData: {
					simplifiedImage: values.simplifiedImage.split('/').pop() as string,
					simplifiedQuestion: formik.values.simplifiedQuestionChinese.trim(),
					simplifiedOptions: simplifiedOptionalsListDNDSop.map(({ optionAudio, ...rest }) => ({
						optionAudio: optionAudio.split('/').pop() as string,
						...rest,
					})),
					simplifiedAnswerOptions: correctAnswerSimplifiedDNDSop,
					simplifiedCorrectAnswer: correctAnswerSimplifiedDNDSop.map((item) => item.option)?.join(' '),
					traditionalImage: values.traditionalImage.split('/').pop() as string,
					traditionalQuestion: formik.values.traditionalQuestionChinese.trim(),
					traditionalOptions: traditionalOptionalsListDNDSop.map(({ optionAudio, ...rest }) => ({
						optionAudio: optionAudio.split('/').pop() as string,
						...rest,
					})),
					traditionalAnswerOptions: correctAnswerTraditionalDNDSop,
					traditionalCorrectAnswer: correctAnswerTraditionalDNDSop.map((item) => item.option)?.join(' '),
					simplifiedQuestionUrl: values.simplifiedQuestionAudio.split('/').pop() as string,
					traditionalQuestionUrl: values.traditionalQuestionAudio.split('/').pop() as string,

					traditionalCompleteActivityAudio: values.traditionalCompleteActivityAudio.split('/').pop() as string,
					simplifiedCompleteActivityAudio: values.simplifiedCompleteActivityAudio.split('/').pop() as string,
				},
				isSkippable: skipButtonCheckedDNDSop,
			};
			if (correctAnswerSimplifiedDNDSop.length && correctAnswerTraditionalDNDSop.length) {
				if (params.activityId) {
					setLoadingDNDSop(true);
					APIService.putData(`${url}/${activityPaths.dragAndDrop}/${params.activityId}?${activityPaths.isForSop}`, {
						...updatedData,
					})
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingDNDSop(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingDNDSop(false);
						});
				} else {
					setLoadingDNDSop(true);
					APIService.postData(`${url}/${activityPaths.dragAndDrop}?${activityPaths.isForSop}`, {
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
							setLoadingDNDSop(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingDNDSop(false);
						});
				}
			} else {
				checkCorrectAnswerDNDSop();
			}
		},
	});

	/**
	 * method is used to add list of Options
	 */
	const addMoreOptionSimplifiedDNDSop = useCallback(() => {
		if (formik.values.optionSimplified.trim() && formik.values.optionAudioSimplified) {
			setSimplifiedOptionalsListDNDSop((prev) => {
				const updatedData = prev?.map((item) => {
					if (item.optionId === editSimplifiedOptionDNDSop?.optionId) {
						const newData = {
							optionId: editSimplifiedOptionDNDSop?.optionId,
							option: formik.values.optionSimplified,
							optionAudio: formik.values.optionAudioSimplified,
						};
						return { ...item, ...newData };
					} else {
						return item;
					}
				});
				if (!editSimplifiedOptionDNDSop) {
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
			setEditSimplifiedOptionDNDSop(null);
			resetInputManually([FieldNames.optionAudioSimplified]);
			formik.validateForm();
		} else {
			toast.error('Please fill all fields.');
		}
	}, [formik, editSimplifiedOptionDNDSop, simplifiedOptionalsListDNDSop]);

	/**
	 * method is used to update correctAnswer after edit
	 */
	useEffect(() => {
		const updatedCorrectAnswers = correctAnswerSimplifiedDNDSop?.map((item) => {
			const data = simplifiedOptionalsListDNDSop?.filter((data) => data.optionId === item.optionId);
			return { optionId: data[0].optionId, option: data[0].option };
		});
		setCorrectAnswerSimplifiedDNDSop(updatedCorrectAnswers);
	}, [simplifiedOptionalsListDNDSop]);

	/**
	 * method is used to add Traditional Options
	 */
	const addMoreOptionTraditionalDNDSop = useCallback(() => {
		if (formik.values.optionTraditional.trim() && formik.values.optionAudioTraditional) {
			setTraditionalOptionalsListDNDSop((prev) => {
				const updatedData = prev?.map((item) => {
					if (item.optionId === editTraditionalOptionDNDSop?.optionId) {
						const newData = {
							optionId: editTraditionalOptionDNDSop?.optionId,
							option: formik.values.optionTraditional,
							optionAudio: formik.values.optionAudioTraditional,
						};
						return { ...item, ...newData };
					} else {
						return item;
					}
				});
				if (!editTraditionalOptionDNDSop) {
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
			setEditTraditionalOptionDNDSop(null);
			resetInputManually([FieldNames.optionAudioTraditional]);

			formik.validateForm();
		} else {
			toast.error('Please fill all fields.');
		}
	}, [traditionalOptionalsListDNDSop, editTraditionalOptionDNDSop, formik]);

	/**
	 * method is used to setEdited text in correctANswer
	 */
	useEffect(() => {
		const updatedCorrectAnswers = correctAnswerTraditionalDNDSop?.map((item) => {
			const data = traditionalOptionalsListDNDSop?.filter((data) => data.optionId === item.optionId);
			return { optionId: data[0].optionId, option: data[0].option };
		});
		setCorrectAnswerTraditionalDNDSop(updatedCorrectAnswers);
	}, [traditionalOptionalsListDNDSop]);

	/**
	 * method is used to validate form after timeInterval
	 */
	const validateFormDNDSop = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 500);
	};

	/**
	 * method is used to copyDataDNDSop from simplified to traditional
	 */
	const copyDataDNDSop = useCallback(async () => {
		const traditionalDNDOptionsTranslateSop = await Promise.all(
			traditionalOptionalsListDNDSop.map(async (item) => {
				return {
					...item,
					option: await translateText(item.option, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data: string) => {
						return data ?? data;
					}),
				};
			})
		);
		formik.values.traditionalQuestionChinese !== '' && formik.setFieldValue(FieldNames.simplifiedQuestionChinese, formik.values.traditionalQuestionChinese);
		formik.values.traditionalImage !== '' && formik.setFieldValue(FieldNames.simplifiedImage, formik.values.traditionalImage);
		setSimplifiedOptionalsListDNDSop(traditionalDNDOptionsTranslateSop);
		setCorrectAnswerSimplifiedDNDSop(correctAnswerTraditionalDNDSop);
		validateFormDNDSop();
		formik.values.traditionalQuestionAudio !== '' && formik.setFieldValue(FieldNames.simplifiedQuestionAudio, formik.values.traditionalQuestionAudio);
		formik.values.traditionalCompleteActivityAudio && formik.setFieldValue(FieldNames.simplifiedCompleteActivityAudio, formik.values.traditionalCompleteActivityAudio);
	}, [formik, simplifiedOptionalsListDNDSop, correctAnswerSimplifiedDNDSop]);

	const getErrorDNDSop = (fieldName: keyof CreateDragAndDropActivity) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	const audioUploadDNDSop = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateDNDSop(e, fileTypeEnum.audio);
	}, []);

	const imageUploadDNDSop = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateDNDSop(e, fileTypeEnum.image);
	}, []);

	const editTraditionalRecordDNDSop = useCallback((data: optionObject) => {
		setEditTraditionalOptionDNDSop(data);
	}, []);

	const deleteTraditionalRecordDNDSop = useCallback(
		(data: optionObject) => {
			setTraditionalOptionalsListDNDSop(traditionalOptionalsListDNDSop?.filter((item) => item.optionId !== data.optionId));
		},
		[traditionalOptionalsListDNDSop]
	);

	const editSimplifiedRecordDNDSop = useCallback((data: optionObject) => {
		setEditSimplifiedOptionDNDSop(data);
	}, []);

	const deleteSimplifiedRecordDNDSop = useCallback(
		(data: optionObject) => {
			setSimplifiedOptionalsListDNDSop(simplifiedOptionalsListDNDSop?.filter((item) => item.optionId !== data.optionId));
		},
		[simplifiedOptionalsListDNDSop]
	);

	return (
		<div>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loadingDNDSop && <Loader />}
				<div className='mb-3'>
					<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorDNDSop(FieldNames.title)} required />
				</div>
				<div className='flex flex-col md:flex-row gap-3 mb-4 w-full'>
					<div className='rounded border w-full'>
						<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Traditional Chinese</h6>
						<div className='p-3 grid grid-cols-2 gap-x-4'>
							<div className='mb-4 col-span-2'>
								<TextInput placeholder='Question' name={FieldNames.traditionalQuestionChinese} onChange={formik.handleChange} label='Add Question (English)' value={formik.values.traditionalQuestionChinese} error={getErrorDNDSop(FieldNames.traditionalQuestionChinese)} required />
							</div>

							<div className='mb-4'>
								<FileUpload labelName='Question Audio' id={FieldNames.traditionalQuestionAudio} imageSource={formik.values.traditionalQuestionAudio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.traditionalQuestionAudio} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadDNDSop} error={getErrorDNDSop(FieldNames.traditionalQuestionAudio) as string} />
								{!isPercentageValidDNDSop(traditionalQuestionAudioDNDSop) && <LoadingPercentage percentage={traditionalQuestionAudioDNDSop} />}
							</div>
							<div className='mb-4'>
								<FileUpload labelName='Upload Image' id={FieldNames.traditionalImage} imageSource={formik.values.traditionalImage} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType} ,${FILE_TYPE.jpgType}`} name={FieldNames.traditionalImage} acceptNote={IMAGE_NOTE} uploadType={FILE_TYPE.jpegType || FILE_TYPE.pngType || FILE_TYPE.jpgType} onChange={imageUploadDNDSop} error={getErrorDNDSop(FieldNames.traditionalImage) as string} />
								{!isPercentageValidDNDSop(imageTraditionalPercentageDNDSop) && <LoadingPercentage percentage={imageTraditionalPercentageDNDSop} />}
							</div>
							<div className='font-medium'>Options</div>
							<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
								<div className='mb-4 col-span-2'>
									<TextInput placeholder='option' name={FieldNames.optionTraditional} onChange={formik.handleChange} label='Option' value={formik.values.optionTraditional} error={getErrorDNDSop(FieldNames.optionTraditional)} required />
								</div>
								<div className='mb-4 col-span-3'>
									<FileUpload labelName='Upload Audio' id={FieldNames.optionAudioTraditional} imageSource={formik.values.optionAudioTraditional} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.optionAudioTraditional} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadDNDSop} small={true} error={getErrorDNDSop(FieldNames.optionAudioTraditional) as string} />
									{!isPercentageValidDNDSop(audioTraditionalPercentageDNDSop) && <LoadingPercentage percentage={audioTraditionalPercentageDNDSop} />}
								</div>
								<div className='flex items-center'>
									<Button className='btn-primary rounded-full' onClick={addMoreOptionTraditionalDNDSop} disabled={!(audioTraditionalPercentageDNDSop === 0 || audioTraditionalPercentageDNDSop === 100)}>
										{editTraditionalOptionDNDSop ? 'Update' : 'Add'}
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
										{traditionalOptionalsListDNDSop.map((item, index) => (
											<tr key={item.optionId}>
												<td className='w-10 text-center'>{index + 1}</td>
												<td className='w-10  font-medium'>{item.option}</td>

												<td className='w-44'>
													<audio src={item.optionAudio} controls className='mb-3'>
														<track kind='captions' />
													</audio>
												</td>

												<td className='w-10 text-center'>
													<CheckBox
														option={[
															{
																value: '',
																checked: correctAnswerTraditionalDNDSop.some((item1) => item.optionId === item1.optionId),
																name: '',
																onChange() {
																	const existingIndex = correctAnswerTraditionalDNDSop.findIndex((data) => item.optionId === data.optionId);

																	if (existingIndex !== -1) {
																		// If the item exists, remove it
																		const updatedItems = correctAnswerTraditionalDNDSop.filter((item1) => item.optionId !== item1.optionId);
																		setCorrectAnswerTraditionalDNDSop(updatedItems);
																	} else {
																		// If the item doesn't exist, add it
																		const updatedItems = [...correctAnswerTraditionalDNDSop, { optionId: item.optionId, option: item.option }];
																		setCorrectAnswerTraditionalDNDSop(updatedItems);
																	}

																	validateFormDNDSop();
																},
															},
														]}
														disabled={editTraditionalOptionDNDSop?.optionId == item.optionId}
													/>
												</td>
												<td className='w-28'>
													<div className='flex gap-3'>
														<EditButton data={item} editRecord={editTraditionalRecordDNDSop} buttonSuccess={true} disable={editTraditionalOptionDNDSop?.optionId === item.optionId} />
														<DeleteButton data={item} isDeleteStatusModal={deleteTraditionalRecordDNDSop} btnDanger={true} disable={editTraditionalOptionDNDSop?.optionId === item.optionId || correctAnswerTraditionalDNDSop.some((item1) => item.optionId === item1.optionId)} />
													</div>
												</td>
											</tr>
										))}

										{!traditionalOptionalsListDNDSop.length && (
											<tr>
												<td colSpan={10} className='text-center font-medium py-5 text-gray-400'>
													No Data Added
												</td>
											</tr>
										)}
									</tbody>
								</table>
								<div>
									{correctAnswerTraditionalDNDSop?.length !== 0 && (
										<span>
											Correct Answer : <span className='font-medium'>{correctAnswerTraditionalDNDSop.map((item) => item.option)?.join(' ')}</span>
										</span>
									)}
								</div>
							</div>
							<div className='mb-4 col-span-2'>
								<FileUpload labelName='Complete Activity Audio With Answers' id={FieldNames.traditionalCompleteActivityAudio} imageSource={formik.values.traditionalCompleteActivityAudio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.traditionalCompleteActivityAudio} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadDNDSop} error={getErrorDNDSop(FieldNames.traditionalCompleteActivityAudio) as string} />
								{!isPercentageValidDNDSop(traditionalCompleteActivityAudioDNDSop) && <LoadingPercentage percentage={traditionalCompleteActivityAudioDNDSop} />}
							</div>
						</div>
					</div>

					<div className='flex flex-col justify-center items-center p-3'>
						<Button className='btn-default btn-large' title='Copy' disabled={disableUpdate} onClick={copyDataDNDSop}>
							<AngleRight className='text-md' />
						</Button>
						<span className='mt-1 text-gray-500'>Copy</span>
					</div>

					<div className='rounded border w-full'>
						<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Simplified Chinese</h6>
						<div className='p-3 grid grid-cols-2 gap-x-4'>
							<div className='mb-4 col-span-2'>
								<TextInput placeholder='Question' name={FieldNames.simplifiedQuestionChinese} onChange={formik.handleChange} label='Add Question (English)' value={formik.values.simplifiedQuestionChinese} error={getErrorDNDSop(FieldNames.simplifiedQuestionChinese)} required />
							</div>
							<div className='mb-4'>
								<FileUpload labelName='Question Audio' id={FieldNames.simplifiedQuestionAudio} imageSource={formik.values.simplifiedQuestionAudio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.simplifiedQuestionAudio} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadDNDSop} error={getErrorDNDSop(FieldNames.simplifiedQuestionAudio) as string} />
								{!isPercentageValidDNDSop(simplifiedQuestionAudioDNDSop) && <LoadingPercentage percentage={simplifiedQuestionAudioDNDSop} />}
							</div>
							<div className='mb-4'>
								<FileUpload labelName='Upload Image' id={FieldNames.simplifiedImage} imageSource={formik.values.simplifiedImage} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType} ,${FILE_TYPE.jpgType}`} name={FieldNames.simplifiedImage} acceptNote={IMAGE_NOTE} uploadType={FILE_TYPE.jpegType || FILE_TYPE.pngType || FILE_TYPE.jpgType} onChange={imageUploadDNDSop} error={getErrorDNDSop(FieldNames.simplifiedImage) as string} />
								{!isPercentageValidDNDSop(imageSimplifiedPercentageDNDSop) && <LoadingPercentage percentage={imageSimplifiedPercentageDNDSop} />}
							</div>
							<div className='font-medium '>Options</div>
							<div className='mb-4 grid grid-cols-6 gap-x-4 gap-y-2 col-span-2 rounded border bg-gray-50 p-3'>
								<div className='mb-4 col-span-2'>
									<TextInput placeholder='option' name={FieldNames.optionSimplified} onChange={formik.handleChange} label='Option' value={formik.values.optionSimplified} error={getErrorDNDSop(FieldNames.optionSimplified)} required />
								</div>
								<div className='mb-4 col-span-3'>
									<FileUpload labelName='Upload Audio' id={FieldNames.optionAudioSimplified} imageSource={formik.values.optionAudioSimplified} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.optionAudioSimplified} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadDNDSop} small={true} error={getErrorDNDSop(FieldNames.optionAudioSimplified) as string} />
									{!isPercentageValidDNDSop(audioSimplifiedPercentageDNDSop) && <LoadingPercentage percentage={audioSimplifiedPercentageDNDSop} />}
								</div>
								<div className='flex items-center'>
									<Button className='btn-primary rounded-full' onClick={addMoreOptionSimplifiedDNDSop} disabled={!(audioSimplifiedPercentageDNDSop === 0 || audioSimplifiedPercentageDNDSop === 100)}>
										{editSimplifiedOptionDNDSop ? 'Update' : 'Add'}
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
										{simplifiedOptionalsListDNDSop.map((item, index) => (
											<tr key={item.optionId}>
												<td className='w-10 text-center'>{index + 1}</td>
												<td className='w-10 font-medium'>{item.option}</td>

												<td className='w-44'>
													<audio src={item.optionAudio} controls className='mb-3'>
														<track kind='captions' />
													</audio>
												</td>
												<td className='w-10 text-center'>
													<CheckBox
														option={[
															{
																value: '',
																checked: correctAnswerSimplifiedDNDSop.some((item1) => item.optionId === item1.optionId),
																name: '',
																onChange() {
																	const existingIndex = correctAnswerSimplifiedDNDSop.findIndex((data) => item.optionId === data.optionId);

																	if (existingIndex !== -1) {
																		// If the item exists, remove it
																		const updatedItems = correctAnswerSimplifiedDNDSop.filter((item1) => item.optionId !== item1.optionId);
																		setCorrectAnswerSimplifiedDNDSop(updatedItems);
																	} else {
																		// If the item doesn't exist, add it
																		const updatedItems = [...correctAnswerSimplifiedDNDSop, { optionId: item.optionId, option: item.option }];
																		setCorrectAnswerSimplifiedDNDSop(updatedItems);
																	}

																	validateFormDNDSop();
																},
															},
														]}
														disabled={editSimplifiedOptionDNDSop?.optionId == item.optionId}
													/>
												</td>
												<td className='w-28'>
													<div className='flex gap-3'>
														<EditButton data={item} editRecord={editSimplifiedRecordDNDSop} buttonSuccess={true} disable={editSimplifiedOptionDNDSop?.optionId === item.optionId} />
														<DeleteButton data={item} isDeleteStatusModal={deleteSimplifiedRecordDNDSop} btnDanger={true} disable={editSimplifiedOptionDNDSop?.optionId === item.optionId || correctAnswerSimplifiedDNDSop.some((item1) => item.optionId === item1.optionId)} />
													</div>
												</td>
											</tr>
										))}

										{!simplifiedOptionalsListDNDSop.length && (
											<tr>
												<td colSpan={10} className='text-center font-medium py-5 text-gray-400'>
													No Data Added
												</td>
											</tr>
										)}
									</tbody>
								</table>
								<div>
									{correctAnswerSimplifiedDNDSop?.length !== 0 && (
										<span>
											Correct Answer : <span className='font-medium'>{correctAnswerSimplifiedDNDSop.map((item) => item.option)?.join(' ')}</span>
										</span>
									)}
								</div>
							</div>
							<div className='mb-4 col-span-2'>
								<FileUpload labelName='Complete Activity Audio With Answers' id={FieldNames.simplifiedCompleteActivityAudio} imageSource={formik.values.simplifiedCompleteActivityAudio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.simplifiedCompleteActivityAudio} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioUploadDNDSop} error={getErrorDNDSop(FieldNames.simplifiedCompleteActivityAudio) as string} />
								{!isPercentageValidDNDSop(simplifiedCompleteActivityAudioDNDSop) && <LoadingPercentage percentage={simplifiedCompleteActivityAudioDNDSop} />}
							</div>
						</div>
					</div>
				</div>

				<div className='flex justify-end gap-2 items-center'>
					<CheckBox
						option={[
							{
								value: '',
								checked: skipButtonCheckedDNDSop,
								name: 'Provide skip button for this activity',
								onChange() {
									setSkipButtonCheckedDNDSop((prev) => !prev);
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

export default ActivityDragAndDropSop;
