import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import TextInput from '@components/textInput/TextInput';
import CheckBox from '@components/checkbox/CheckBox';
import { useParams } from 'react-router-dom';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { Errors } from '@config/errors';
import { AngleRight, PlusCircle } from '@components/icons';
import FileUpload from '@components/fileUpload/FileUpload';
import { IMAGE_NOTE, AUDIO_SIZE_MB, CHARACTERS_LIMIT, FILE_TYPE, IMAGE_SIZE_MB, fileTypeEnum } from '@config/constant';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import { generateUuid, resetInputManually } from '@utils/helpers';
import { URL_PATHS } from '@config/variables';
import RadioButton from '@components/radiobutton/RadioButton';
import { DropdownOptionType } from 'src/types/component';
import Dropdown from '@components/dropdown/Dropdown';
import AddEditCategoryModal from '@views/flashCard/AddEditCategory';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import { Uploader } from '@views/activities/utils/upload';
import { FieldNames } from '@views/activities/ActivityFlashCard';
import DNDFlashCard from '@views/activities/DNDFlashCard';
import { CreateFlashCardActivity, FlashCardActivitySubmitData, FlashCardTextArr, flashCardActivityList } from 'src/types/activities/flashCard';
import { AddEditSeasonalActivityData } from 'src/types/seasonalTopics';

const SeasonalActivityFlashcard = ({ onSubmit, onClose, url, activityUuid }: AddEditSeasonalActivityData) => {
	const params = useParams();
	const [loadingFlashcardSeasonal, setLoadingFlashcardSeasonal] = useState<boolean>(false);
	const [flashcardSeasonalList, setFlashcardSeasonalList] = useState<flashCardActivityList[]>([]);
	const [textToSpeechCheckedFlashcardSeasonal, setTextToSpeechCheckedFlashcardSeasonal] = useState<boolean>(false);
	const [skipButtonCheckedFlashcardSeasonal, setSkipButtonCheckedFlashcardSeasonal] = useState<boolean>(false);
	const [imageSimplifiedFlashcardSeasonal, setImageSimplifiedFlashcardSeasonal] = useState<string>('');
	const [audioSimplifiedFlashcardSeasonal, setAudioSimplifiedFlashcardSeasonal] = useState<string>('');
	const [imageTraditionalFlashcardSeasonal, setImageTraditionalFlashcardSeasonal] = useState<string>('');
	const [audioTraditionalFlashcardSeasonal, setAudioTraditionalFlashcardSeasonal] = useState<string>('');
	const [imageSimplifiedFlashcardSeasonalPercentage, setImageSimplifiedFlashcardSeasonalPercentage] = useState<number>(0);
	const [audioSimplifiedFlashcardSeasonalPercentage, setAudioSimplifiedFlashcardSeasonalPercentage] = useState<number>(0);
	const [imageTraditionalFlashcardSeasonalPercentage, setImageTraditionalFlashcardSeasonalPercentage] = useState<number>(0);
	const [audioTraditionalFlashcardSeasonalPercentage, setAudioTraditionalFlashcardSeasonalPercentage] = useState<number>(0);
	const [editListDataFlashcardSeasonal, setEditListDataFlashcardSeasonal] = useState<flashCardActivityList | null>(null);
	const [checkedFlashcardSeasonal, setCheckedFlashcardSeasonal] = useState<string>(fileTypeEnum.image);
	const radioOptionsFlashcardSeasonal = [
		{ name: 'Flash Card With Image', key: fileTypeEnum.image, disabled: editListDataFlashcardSeasonal?.isFlashCardText },
		{ name: 'Flash Card With Text', key: fileTypeEnum.text, disabled: editListDataFlashcardSeasonal?.isFlashCardText === false },
	];
	const [isAddEditModelFlashcardSeasonal, setIsAddEditModelFlashcardSeasonal] = useState<boolean>(false);
	const [showFlashCardSeasonal, setShowFlashCardSeasonal] = useState<boolean>(false);
	const [flashCardSeasonalCategories, setFlashCardSeasonalCategories] = useState<DropdownOptionType[]>([]);
	const [newOrderFlashcardSeasonal, setNewOrderFlashcardSeasonal] = useState<flashCardActivityList[]>();

	const [tileDataFlashcardSeasonal, setTileDataFlashcardSeasonal] = useState<FlashCardTextArr>();
	const [selectedItemsFlashcardSeasonal, setSelectedItemsFlashcardSeasonal] = useState<Array<string>>([]);
	const [selectedFlashcardSeasonal, setSelectedFlashcardSeasonal] = useState<FlashCardTextArr>([]);
	const [showFormFlashcardSeasonal, setShowFormFlashcardSeasonal] = useState<boolean>(true);

	useEffect(() => {
		if (newOrderFlashcardSeasonal) {
			setFlashcardSeasonalList(newOrderFlashcardSeasonal);
		}
	}, [newOrderFlashcardSeasonal]);

	const updatePercentage = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.audioSimplified:
				setAudioSimplifiedFlashcardSeasonalPercentage(newPercentage);
				break;
			case FieldNames.audioTraditional:
				setAudioTraditionalFlashcardSeasonalPercentage(newPercentage);
				break;
			case FieldNames.imageSimplified:
				setImageSimplifiedFlashcardSeasonalPercentage(newPercentage);
				break;
			case FieldNames.imageTraditional:
				setImageTraditionalFlashcardSeasonalPercentage(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidFlashcardSeasonal = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdateFlashcardSeasonal = !(isPercentageValidFlashcardSeasonal(imageSimplifiedFlashcardSeasonalPercentage) && isPercentageValidFlashcardSeasonal(imageTraditionalFlashcardSeasonalPercentage) && isPercentageValidFlashcardSeasonal(audioSimplifiedFlashcardSeasonalPercentage) && isPercentageValidFlashcardSeasonal(audioTraditionalFlashcardSeasonalPercentage));

	const getCategoriesListFlashcardSeasonal = useCallback(() => {
		APIService.getData(`${URL_PATHS.flashCardCategories}/all/list`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data.categories.map((item: { categoryName: string; uuid: string }) => {
						data.push({ name: item?.categoryName, key: item?.uuid });
					});
					setFlashCardSeasonalCategories(data);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	}, []);

	useEffect(() => {
		getCategoriesListFlashcardSeasonal();
	}, []);

	/**
	 * Method is used to set the fields if User click edit data
	 */
	useEffect(() => {
		if (editListDataFlashcardSeasonal) {
			if (editListDataFlashcardSeasonal.isFlashCardText) {
				setCheckedFlashcardSeasonal(fileTypeEnum.text);
			} else {
				if (editListDataFlashcardSeasonal.simplifiedImageUrl) {
					setImageSimplifiedFlashcardSeasonal(editListDataFlashcardSeasonal?.simplifiedImageUrl);
				}
				if (editListDataFlashcardSeasonal.traditionalImageUrl) {
					editListDataFlashcardSeasonal.traditionalImageUrl && setImageTraditionalFlashcardSeasonal(editListDataFlashcardSeasonal?.traditionalImageUrl);
				}
				setCheckedFlashcardSeasonal(fileTypeEnum.image);
			}

			setAudioSimplifiedFlashcardSeasonal(editListDataFlashcardSeasonal?.simplifiedAudioUrl);
			setAudioTraditionalFlashcardSeasonal(editListDataFlashcardSeasonal?.traditionalAudioUrl);
			setTextToSpeechCheckedFlashcardSeasonal(editListDataFlashcardSeasonal?.isTextToSpeech);

			formik.setFieldValue(FieldNames.titleSimplified, editListDataFlashcardSeasonal?.simplifiedTitleChinese);
			formik.setFieldValue(FieldNames.simplifiedTitleEnglish, editListDataFlashcardSeasonal?.simplifiedTitleEnglish);
			formik.setFieldValue(FieldNames.textPronunciationSimplified, editListDataFlashcardSeasonal?.simplifiedTitleChinese);
			formik.setFieldValue(FieldNames.titleTraditional, editListDataFlashcardSeasonal?.traditionalTitleChinese);

			formik.setFieldValue(FieldNames.traditionalTitleEnglish, editListDataFlashcardSeasonal?.traditionalTitleEnglish);
			formik.setFieldValue(FieldNames.textPronunciationTraditional, editListDataFlashcardSeasonal?.traditionalTitleChinese);
			formik.setFieldValue(FieldNames.flashCardCategory, editListDataFlashcardSeasonal?.categoryId);
			editListDataFlashcardSeasonal?.categoryId && setShowFlashCardSeasonal(true);
		}
	}, [editListDataFlashcardSeasonal]);

	useEffect(() => {
		if (params.activityId) {
			setLoadingFlashcardSeasonal(true);
			APIService.getData(`${url}/flash-card/${params.activityId}?isForSeasonal=true`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						setFlashcardSeasonalList(
							response.data.data.activityData?.map((item: flashCardActivityList) => {
								return { ...item, id: item.activityDataId };
							})
						);
						setSkipButtonCheckedFlashcardSeasonal(response.data.data.isSkippable);
						formik.setFieldValue(FieldNames.title, response.data.data.title);
					}
					setLoadingFlashcardSeasonal(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingFlashcardSeasonal(false);
				});
		}
	}, []);

	const initialValues: CreateFlashCardActivity = {
		[FieldNames.imageSimplified]: null,
		[FieldNames.imageTraditional]: null,
		[FieldNames.audioSimplified]: null,
		[FieldNames.audioTraditional]: null,
		[FieldNames.titleSimplified]: '',
		[FieldNames.titleTraditional]: '',
		[FieldNames.simplifiedTitleEnglish]: '',
		[FieldNames.traditionalTitleEnglish]: '',
		[FieldNames.textPronunciationSimplified]: '',
		[FieldNames.textPronunciationTraditional]: '',
		[FieldNames.title]: '',
		[FieldNames.flashCardCategory]: '',
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit questions
	 */
	const getObjFlashcardSeasonal = () => {
		const titleError = flashcardSeasonalList.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE);
		const objFlashcardSeasonal: ObjectShape =
			checkedFlashcardSeasonal === fileTypeEnum.image
				? {
						[FieldNames.imageSimplified]: flashcardSeasonalList.length || imageSimplifiedFlashcardSeasonal.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_IMAGE),
						[FieldNames.audioSimplified]: flashcardSeasonalList.length || audioSimplifiedFlashcardSeasonal.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_AUDIO),
						[FieldNames.titleSimplified]: titleError,
						[FieldNames.imageTraditional]: flashcardSeasonalList.length || imageTraditionalFlashcardSeasonal.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_IMAGE),
						[FieldNames.audioTraditional]: flashcardSeasonalList.length || audioTraditionalFlashcardSeasonal.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_AUDIO),
						[FieldNames.titleTraditional]: titleError,
						[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
						[FieldNames.traditionalTitleEnglish]: titleError,
						[FieldNames.simplifiedTitleEnglish]: titleError,
				  }
				: {
						[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
				  };
		return Yup.object<ObjectShape>(objFlashcardSeasonal);
	};
	const validationSchema = getObjFlashcardSeasonal();
	const formToastMessageFlashcardSeasonal = () => {
		checkedFlashcardSeasonal === fileTypeEnum.image ? toast.error(Errors.FILL_FORM_ERROR) : toast.error('Please select at least one flash card.');
	};

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const { topicId, lessonId } = params;
			if (flashcardSeasonalList.length) {
				const commonSubmitDataFlashcardSeasonal: FlashCardActivitySubmitData = {
					topicId: topicId as string,
					lessonId: lessonId as string,
					activityTypeId: activityUuid,
					title: values.title.trim(),
					isSkippable: skipButtonCheckedFlashcardSeasonal,
					activityData: flashcardSeasonalList.map(({ traditionalImageUrl, id, simplifiedImageUrl, ...item }) => ({
						activityDataId: id,
						...item,
						simplifiedAudioUrl: item.simplifiedAudioUrl.split('/').pop() as string,
						traditionalAudioUrl: item.traditionalAudioUrl.split('/').pop() as string,
						...(traditionalImageUrl && { traditionalImageUrl: traditionalImageUrl.split('/').pop() as string }),
						...(simplifiedImageUrl && { simplifiedImageUrl: simplifiedImageUrl.split('/').pop() as string }),
					})),
					isForSeasonal: true,
				};
				if (params.activityId) {
					setLoadingFlashcardSeasonal(true);
					APIService.putData(`${url}/flash-card/${params.activityId}`, {
						...commonSubmitDataFlashcardSeasonal,
					})
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingFlashcardSeasonal(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingFlashcardSeasonal(false);
						});
				} else {
					setLoadingFlashcardSeasonal(true);
					APIService.postData(`${url}/flash-card`, {
						...commonSubmitDataFlashcardSeasonal,
					})
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingFlashcardSeasonal(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingFlashcardSeasonal(false);
						});
				}
			} else {
				formToastMessageFlashcardSeasonal();
			}
		},
	});

	const resetFieldsFlashcardSeasonal = () => {
		setImageSimplifiedFlashcardSeasonal('');
		setAudioSimplifiedFlashcardSeasonal('');
		setImageTraditionalFlashcardSeasonal('');
		setAudioTraditionalFlashcardSeasonal('');
		setTextToSpeechCheckedFlashcardSeasonal(false);
	};

	const textValidDataFlashcardSeasonal = formik.values.traditionalTitleEnglish?.trim() && formik.values.simplifiedTitleEnglish?.trim() && formik.values.simplifiedTitleChinese?.trim() && formik.values.traditionalTitleChinese?.trim();
	const hasToValidDataFlashcardSeasonal = textValidDataFlashcardSeasonal && imageSimplifiedFlashcardSeasonal && imageTraditionalFlashcardSeasonal && audioSimplifiedFlashcardSeasonal && audioTraditionalFlashcardSeasonal;
	const categoryIdValueFlashcardSeasonal = showFlashCardSeasonal ? formik.values.categoryId : '';

	const addMoreForTextFlashcardSeasonal = () => {
		if (editListDataFlashcardSeasonal) {
			setFlashcardSeasonalList((prev) => {
				const updatedDataFlashcardSeasonal = prev.map((item) => {
					if (item.id === editListDataFlashcardSeasonal?.id) {
						const updatedCommonDataFlashcardSeasonal = {
							id: editListDataFlashcardSeasonal.id, // Use the existing id for editing
							[FieldNames.titleSimplified]: formik.values.simplifiedTitleChinese,
							[FieldNames.simplifiedTitleEnglish]: formik.values.simplifiedTitleEnglish,
							[FieldNames.audioSimplified]: audioSimplifiedFlashcardSeasonal,
							[FieldNames.titleTraditional]: formik.values.traditionalTitleChinese,
							[FieldNames.traditionalTitleEnglish]: formik.values.traditionalTitleEnglish,
							[FieldNames.audioTraditional]: audioTraditionalFlashcardSeasonal,
							...(textToSpeechCheckedFlashcardSeasonal && {
								[FieldNames.textPronunciationSimplified]: formik.values.simplifiedTitleChinese,
								[FieldNames.textPronunciationTraditional]: formik.values.traditionalTitleChinese,
							}),
							[FieldNames.isTextToSpeech]: textToSpeechCheckedFlashcardSeasonal,
							[FieldNames.flashCardCategory]: categoryIdValueFlashcardSeasonal,
							[FieldNames.isFlashCardText]: true,
						};
						return { ...item, ...updatedCommonDataFlashcardSeasonal };
					} else {
						return item;
					}
				});
				return updatedDataFlashcardSeasonal;
			});
		} else {
			const setImageCardFlashcardSeasonal = selectedFlashcardSeasonal.map((item) => {
				return {
					id: generateUuid(),
					[FieldNames.titleSimplified]: item.simplifiedTitleChinese,
					[FieldNames.simplifiedTitleEnglish]: item.simplifiedTitleEnglish,
					[FieldNames.audioSimplified]: item.simplifiedAudioUrl,
					[FieldNames.titleTraditional]: item.traditionalTitleChinese,
					[FieldNames.traditionalTitleEnglish]: item.traditionalTitleEnglish,
					[FieldNames.audioTraditional]: item.traditionalAudioUrl,
					[FieldNames.textPronunciationSimplified]: item.simplifiedPronunciationText,
					[FieldNames.textPronunciationTraditional]: item.traditionalPronunciationText,
					[FieldNames.isTextToSpeech]: item.isTextToSpeech,
					[FieldNames.flashCardCategory]: item.categoryId,
					[FieldNames.isFlashCardText]: true,
				};
			});
			setFlashcardSeasonalList((prev) => {
				return [...prev, ...setImageCardFlashcardSeasonal];
			});
		}
	};

	const addMoreForImageFlashcardSeasonal = () => {
		setFlashcardSeasonalList((prev) => {
			const updatedDataFlashcardSeasonal = prev.map((item) => {
				if (item.id === editListDataFlashcardSeasonal?.id) {
					const updatedCommonDataFlashcardSeasonal = {
						id: editListDataFlashcardSeasonal?.id, // Use the existing id for editing
						[FieldNames.titleSimplified]: formik.values.simplifiedTitleChinese,
						[FieldNames.simplifiedTitleEnglish]: formik.values.simplifiedTitleEnglish,
						[FieldNames.audioSimplified]: audioSimplifiedFlashcardSeasonal,
						[FieldNames.titleTraditional]: formik.values.traditionalTitleChinese,
						[FieldNames.traditionalTitleEnglish]: formik.values.traditionalTitleEnglish,
						[FieldNames.audioTraditional]: audioTraditionalFlashcardSeasonal,
						...(textToSpeechCheckedFlashcardSeasonal && {
							[FieldNames.textPronunciationSimplified]: formik.values.simplifiedTitleChinese,
							[FieldNames.textPronunciationTraditional]: formik.values.traditionalTitleChinese,
						}),
						[FieldNames.isTextToSpeech]: textToSpeechCheckedFlashcardSeasonal,
						[FieldNames.flashCardCategory]: categoryIdValueFlashcardSeasonal,
						[FieldNames.imageSimplified]: imageSimplifiedFlashcardSeasonal,
						[FieldNames.imageTraditional]: imageTraditionalFlashcardSeasonal,
						[FieldNames.isFlashCardText]: false,
					};

					return { ...item, ...updatedCommonDataFlashcardSeasonal };
				} else {
					return item;
				}
			});
			if (!editListDataFlashcardSeasonal) {
				const updateDataFlashcardSeasonal = {
					id: generateUuid(),
					[FieldNames.titleSimplified]: formik.values.simplifiedTitleChinese,
					[FieldNames.audioSimplified]: audioSimplifiedFlashcardSeasonal,
					...(textToSpeechCheckedFlashcardSeasonal && {
						[FieldNames.textPronunciationSimplified]: formik.values.simplifiedTitleChinese,
						[FieldNames.textPronunciationTraditional]: formik.values.traditionalTitleChinese,
					}),
					[FieldNames.simplifiedTitleEnglish]: formik.values.simplifiedTitleEnglish,
					[FieldNames.titleTraditional]: formik.values.traditionalTitleChinese,
					[FieldNames.audioTraditional]: audioTraditionalFlashcardSeasonal,
					[FieldNames.traditionalTitleEnglish]: formik.values.traditionalTitleEnglish,
					[FieldNames.isTextToSpeech]: textToSpeechCheckedFlashcardSeasonal,
					[FieldNames.flashCardCategory]: categoryIdValueFlashcardSeasonal,
					[FieldNames.imageTraditional]: imageTraditionalFlashcardSeasonal,
					[FieldNames.imageSimplified]: imageSimplifiedFlashcardSeasonal,
					[FieldNames.isFlashCardText]: false,
				};
				updatedDataFlashcardSeasonal.push({
					...updateDataFlashcardSeasonal,
				});
			}

			return updatedDataFlashcardSeasonal;
		});
	};

	const addMoreFlashCardSeasonal = useCallback(() => {
		if (checkedFlashcardSeasonal === fileTypeEnum.text && selectedFlashcardSeasonal.length) {
			if (editListDataFlashcardSeasonal && !textValidDataFlashcardSeasonal) {
				toast.error(Errors.FILL_FORM_ERROR);
				return;
			}
			addMoreForTextFlashcardSeasonal();
			setSelectedFlashcardSeasonal([]);
			setSelectedItemsFlashcardSeasonal([]);
			editListDataFlashcardSeasonal?.isFlashCardText && resetInputManually([FieldNames.audioTraditional, FieldNames.audioSimplified]);
		} else if (hasToValidDataFlashcardSeasonal && checkedFlashcardSeasonal === fileTypeEnum.image) {
			addMoreForImageFlashcardSeasonal();
			resetInputManually([FieldNames.audioTraditional, FieldNames.audioSimplified, FieldNames.imageSimplified, FieldNames.imageTraditional]);
		} else {
			checkedFlashcardSeasonal === fileTypeEnum.image ? toast.error(Errors.FILL_FORM_ERROR) : toast.error('Please select at least one flash card.');
		}
		formik.setFieldValue(FieldNames.titleTraditional, '');
		formik.setFieldValue(FieldNames.traditionalTitleEnglish, '');
		formik.setFieldValue(FieldNames.textPronunciationTraditional, '');
		formik.setFieldValue(FieldNames.audioTraditional, '');
		formik.setFieldValue(FieldNames.imageTraditional, '');
		formik.setFieldValue(FieldNames.titleSimplified, '');
		formik.setFieldValue(FieldNames.simplifiedTitleEnglish, '');
		formik.setFieldValue(FieldNames.textPronunciationSimplified, '');
		formik.setFieldValue(FieldNames.audioSimplified, '');
		formik.setFieldValue(FieldNames.imageSimplified, '');
		formik.setFieldValue(FieldNames.flashCardCategory, '');
		setShowFlashCardSeasonal(false);
		resetFieldsFlashcardSeasonal();
		validateFormFlashcardSeasonal();
		setEditListDataFlashcardSeasonal(null);
	}, [flashcardSeasonalList, editListDataFlashcardSeasonal, formik]);
	/**
	 *
	 * @returns Method used for remove activity
	 */
	const removeItemFlashcardSeasonal = useCallback(
		(id: string) => {
			setFlashcardSeasonalList(flashcardSeasonalList?.filter((item) => item.id !== id));
		},
		[flashcardSeasonalList]
	);

	const setEditItemFlashcardSeasonal = useCallback(
		(data: flashCardActivityList) => {
			setEditListDataFlashcardSeasonal(data);
			if (data.isFlashCardText) {
				setSelectedItemsFlashcardSeasonal([data.id]);
				setSelectedFlashcardSeasonal([{ activityDataId: data.id, ...data }]);
			}
		},
		[editListDataFlashcardSeasonal]
	);

	const copyDataFlashcardSeasonal = useCallback(() => {
		formik.values.traditionalTitleChinese && formik.setFieldValue(FieldNames.titleSimplified, formik.values.traditionalTitleChinese);
		formik.values.traditionalTitleChinese && formik.setFieldValue(FieldNames.textPronunciationSimplified, formik.values.traditionalTitleChinese);
		if (imageTraditionalFlashcardSeasonal !== '') {
			setImageSimplifiedFlashcardSeasonal(imageTraditionalFlashcardSeasonal);
			formik.setFieldValue(FieldNames.imageSimplified, formik.values.traditionalImageUrl);
		}
		formik.values.traditionalTitleEnglish && formik.setFieldValue(FieldNames.simplifiedTitleEnglish, formik.values.traditionalTitleEnglish);
		if (audioTraditionalFlashcardSeasonal !== '') {
			formik.setFieldValue(FieldNames.audioSimplified, formik.values.traditionalAudioUrl);
			setAudioSimplifiedFlashcardSeasonal(audioTraditionalFlashcardSeasonal);
		}
		validateFormFlashcardSeasonal();
	}, [formik]);

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const fileUpdateFlashcardSeasonal = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileFlashcardSeasonal = event.target.files?.[0];
		const fileNameFlashcardSeasonal = event.target.name;
		if (fileFlashcardSeasonal === undefined) {
			return;
		}
		const fileSizeFlashcardSeasonal = type === fileTypeEnum.image ? IMAGE_SIZE_MB : AUDIO_SIZE_MB;
		const fileTypesFlashcardSeasonal = type === fileTypeEnum.image ? [FILE_TYPE.pngType, FILE_TYPE.jpgType, FILE_TYPE.jpegType] : [FILE_TYPE.audioType, FILE_TYPE.wavType];
		if (!fileTypesFlashcardSeasonal.includes(fileFlashcardSeasonal.type)) {
			setLoadingFlashcardSeasonal(false);
			toast.error(type === fileTypeEnum.image ? Errors.PLEASE_ALLOW_JPG_PNG_JPEG_FILE : Errors.PLEASE_ALLOW_MP3_WAV_FILE);
			return;
		}
		if (fileFlashcardSeasonal.size / 1000 / 1024 >= fileSizeFlashcardSeasonal) {
			toast.error(`Uploaded ${type} size is greater than ${fileSizeFlashcardSeasonal}MB, please upload ${type} size within ${fileSizeFlashcardSeasonal}MB or max ${fileSizeFlashcardSeasonal}MB`);
		}
		const lastIndex = fileFlashcardSeasonal?.name?.lastIndexOf('.');
		const extension = fileFlashcardSeasonal?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileFlashcardSeasonal);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptions = {
					fileName: name,
					file: fileFlashcardSeasonal,
					isForSeasonal: true,
					isForSop: false,
					fieldName: fileNameFlashcardSeasonal,
				};
				const uploader = new Uploader(imageUploaderOptions, updatePercentage);
				uploader.start();
				switch (fileNameFlashcardSeasonal) {
					case FieldNames.imageSimplified:
						formik.setFieldValue(FieldNames.imageSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setImageSimplifiedFlashcardSeasonal(response);
							setLoadingFlashcardSeasonal(false);
						});
						break;
					case FieldNames.imageTraditional:
						formik.setFieldValue(FieldNames.imageTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingFlashcardSeasonal(false);
							setImageTraditionalFlashcardSeasonal(response);
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
			const blob = URL.createObjectURL(fileFlashcardSeasonal);
			audio.src = blob;
			audio.addEventListener('loadedmetadata', () => {
				const audioUploaderOptions = {
					fileName: name,
					file: fileFlashcardSeasonal,
					isForSeasonal: true,
					isForSop: false,
					fieldName: fileNameFlashcardSeasonal,
				};
				const uploader = new Uploader(audioUploaderOptions, updatePercentage);
				uploader.start();
				switch (fileNameFlashcardSeasonal) {
					case FieldNames.audioSimplified:
						formik.setFieldValue(FieldNames.audioSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingFlashcardSeasonal(false);
							setAudioSimplifiedFlashcardSeasonal(response);
						});
						break;
					case FieldNames.audioTraditional:
						formik.setFieldValue(FieldNames.audioTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingFlashcardSeasonal(false);
							setAudioTraditionalFlashcardSeasonal(response);
						});
						break;
					default:
						break;
				}
			});
		}
	}, []);

	const validateFormFlashcardSeasonal = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 500);
	};

	useEffect(() => {
		setLoadingFlashcardSeasonal(true);
		APIService.getData(`${url}/flashcard/list`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const data = response?.data?.data?.data;
					setTileDataFlashcardSeasonal(data);
				}
				setLoadingFlashcardSeasonal(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoadingFlashcardSeasonal(false);
			});
	}, []);

	const changeSelectionActivityFlashcardSeasonal = (activityDataId: string) => {
		if (!selectedItemsFlashcardSeasonal.includes(activityDataId)) {
			setSelectedItemsFlashcardSeasonal((prevItem) => [...prevItem, activityDataId]);
			const newData = tileDataFlashcardSeasonal?.filter((item) => item.activityDataId === activityDataId);
			setSelectedFlashcardSeasonal((prevCard) => [...(newData as FlashCardTextArr), ...prevCard]);
		} else {
			setSelectedItemsFlashcardSeasonal(selectedItemsFlashcardSeasonal.filter((item: string) => item !== activityDataId));
			setSelectedFlashcardSeasonal(selectedFlashcardSeasonal.filter((item) => item.activityDataId !== activityDataId));
		}
	};

	const getErrorFlashcardSeasonal = (fieldName: keyof CreateFlashCardActivity) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	const imageChangeHandlerFlashcardSeasonal = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateFlashcardSeasonal(e, fileTypeEnum.image);
	}, []);

	const audioChangeHandlerFlashcardSeasonal = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateFlashcardSeasonal(e, fileTypeEnum.audio);
	}, []);

	const addCategoryModalFlashcardSeasonal = useCallback(() => {
		setIsAddEditModelFlashcardSeasonal(true);
	}, []);

	const onCloseModalFlashcardSeasonal = useCallback(() => {
		setIsAddEditModelFlashcardSeasonal(false);
	}, []);

	useEffect(() => {
		if (checkedFlashcardSeasonal === fileTypeEnum.text && !editListDataFlashcardSeasonal) {
			setShowFormFlashcardSeasonal(false);
		} else {
			setShowFormFlashcardSeasonal(true);
		}
	}, [checkedFlashcardSeasonal, editListDataFlashcardSeasonal]);

	return (
		<div>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loadingFlashcardSeasonal && <Loader />}
				<div className='mb-4 w-full'>
					<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorFlashcardSeasonal(FieldNames.title)} required />
				</div>
				<div className='mb-4'>
					<RadioButton id='flashCard' label={'Flash Card Type'} name={'isFlashCardWithImage'} onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setCheckedFlashcardSeasonal(e.target.value), [])} checked={checkedFlashcardSeasonal} radioOptions={radioOptionsFlashcardSeasonal} required />
				</div>
				{checkedFlashcardSeasonal === fileTypeEnum.text && !editListDataFlashcardSeasonal && (
					<div className='rounded border w-full mb-4'>
						<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Flashcard List</h6>
						<div className='p-3'>
							{tileDataFlashcardSeasonal?.length ? (
								<ul className='grid grid-cols-3 md:grid-cols-8 gap-3 media-list'>
									{tileDataFlashcardSeasonal?.map((tile: flashCardActivityList) => {
										return !tile?.isFlashCardText ? (
											<li key={tile.activityDataId} className={`border rounded p-1 h-40 cursor-pointer relative ${selectedItemsFlashcardSeasonal.includes(tile.activityDataId as string) ? 'border-primary border-2 active' : ''}`} onClick={() => changeSelectionActivityFlashcardSeasonal(tile.activityDataId as string)}>
												<img src={tile.simplifiedImageUrl} className='h-full w-full object-cover rounded' />
											</li>
										) : (
											''
										);
									})}
								</ul>
							) : (
								<div className='text-center font-medium py-5 text-gray-400'>No Flashcard Available.</div>
							)}
						</div>
					</div>
				)}
				{showFormFlashcardSeasonal && (
					<>
						<div className='flex flex-col md:flex-row gap-3 mb-4'>
							<div className='rounded border w-full'>
								<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Traditional Chinese</h6>
								<div className='grid grid-cols-2 gap-x-4 p-3'>
									<div className='mb-4'>
										<TextInput placeholder='Title Chinese' name={FieldNames.titleTraditional} onChange={formik.handleChange} label='Title Chinese' value={formik.values.traditionalTitleChinese} error={getErrorFlashcardSeasonal(FieldNames.titleTraditional)} required />
									</div>
									<div className='mb-4'>
										<TextInput placeholder='Title English' name={FieldNames.traditionalTitleEnglish} onChange={formik.handleChange} label='Title English' value={formik.values.traditionalTitleEnglish} error={getErrorFlashcardSeasonal(FieldNames.traditionalTitleEnglish)} required />
									</div>
									<div className='mb-4'>
										<FileUpload labelName='Upload Audio' id={FieldNames.audioTraditional} imageSource={audioTraditionalFlashcardSeasonal} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.audioTraditional} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioChangeHandlerFlashcardSeasonal} error={getErrorFlashcardSeasonal(FieldNames.audioTraditional) ?? ''} />
										{!isPercentageValidFlashcardSeasonal(audioTraditionalFlashcardSeasonalPercentage) && <LoadingPercentage percentage={audioTraditionalFlashcardSeasonalPercentage} />}
									</div>
									{checkedFlashcardSeasonal === fileTypeEnum.image && (
										<div className='mb-4'>
											<FileUpload labelName='Upload Image' id={FieldNames.imageTraditional} imageSource={imageTraditionalFlashcardSeasonal} name={FieldNames.imageTraditional} error={getErrorFlashcardSeasonal(FieldNames.imageTraditional) ?? ''} acceptNote={IMAGE_NOTE} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} uploadType={FILE_TYPE.pngType} onChange={imageChangeHandlerFlashcardSeasonal} />
											{!isPercentageValidFlashcardSeasonal(imageTraditionalFlashcardSeasonalPercentage) && <LoadingPercentage percentage={imageTraditionalFlashcardSeasonalPercentage} />}
										</div>
									)}
								</div>
							</div>
							<div className='flex flex-col justify-center items-center p-3'>
								<Button className='btn-default btn-large' title='Copy' onClick={copyDataFlashcardSeasonal} disabled={disableUpdateFlashcardSeasonal}>
									<AngleRight className='text-md' />
								</Button>
								<span className='mt-1 text-gray-500'>Copy</span>
							</div>
							<div className='rounded border w-full'>
								<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Simplified Chinese</h6>
								<div className='grid grid-cols-2 gap-x-4 p-3'>
									<div className='mb-4'>
										<TextInput placeholder='Title Chinese' name={FieldNames.titleSimplified} onChange={formik.handleChange} label='Title Chinese' value={formik.values.simplifiedTitleChinese} error={getErrorFlashcardSeasonal(FieldNames.titleSimplified)} required />
									</div>
									<div className='mb-4'>
										<TextInput placeholder='Title English' name={FieldNames.simplifiedTitleEnglish} onChange={formik.handleChange} label='Title English' value={formik.values.simplifiedTitleEnglish} error={getErrorFlashcardSeasonal(FieldNames.simplifiedTitleEnglish)} required />
									</div>
									<div className='mb-4'>
										<FileUpload labelName='Upload Audio' id={FieldNames.audioSimplified} imageSource={audioSimplifiedFlashcardSeasonal} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.audioSimplified} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioChangeHandlerFlashcardSeasonal} error={getErrorFlashcardSeasonal(FieldNames.audioSimplified) ?? ''} />
										{!isPercentageValidFlashcardSeasonal(audioSimplifiedFlashcardSeasonalPercentage) && <LoadingPercentage percentage={audioSimplifiedFlashcardSeasonalPercentage} />}
									</div>
									{checkedFlashcardSeasonal === fileTypeEnum.image && (
										<div className='mb-4'>
											<FileUpload labelName='Upload Image' id={FieldNames.imageSimplified} imageSource={imageSimplifiedFlashcardSeasonal} name={FieldNames.imageSimplified} error={getErrorFlashcardSeasonal(FieldNames.imageSimplified) ?? ''} acceptNote={IMAGE_NOTE} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} uploadType={FILE_TYPE.pngType} onChange={imageChangeHandlerFlashcardSeasonal} />
											{!isPercentageValidFlashcardSeasonal(imageSimplifiedFlashcardSeasonalPercentage) && <LoadingPercentage percentage={imageSimplifiedFlashcardSeasonalPercentage} />}
										</div>
									)}
								</div>
							</div>
						</div>
						<div className='w-full mb-4'>
							<CheckBox
								option={[
									{
										value: '',
										checked: showFlashCardSeasonal,
										name: 'Add this to flashcard category',
										onChange() {
											setShowFlashCardSeasonal((prev) => !prev);
										},
									},
								]}
							/>
							{showFlashCardSeasonal && (
								<div className='flex justify-start'>
									<div>
										<Dropdown placeholder={'Select category'} value={formik.values.categoryId} name={FieldNames.flashCardCategory} onChange={formik.handleChange} options={flashCardSeasonalCategories} id='categories' error={formik.errors.categoryId && formik.touched.categoryId ? formik.errors.categoryId : ''} />
									</div>
									<div>
										<Button className='btn-primary btn-normal ml-4' onClick={addCategoryModalFlashcardSeasonal}>
											Add New Category
										</Button>
									</div>
								</div>
							)}
						</div>
						<CheckBox
							option={[
								{
									value: '',
									checked: textToSpeechCheckedFlashcardSeasonal,
									name: 'Provide text to speech detection function',
									onChange() {
										setTextToSpeechCheckedFlashcardSeasonal((prev) => !prev);
										validateFormFlashcardSeasonal();
									},
								},
							]}
						/>
					</>
				)}
				<div className='flex justify-center'>
					<Button className='btn-primary mb-5 btn-large' onClick={addMoreFlashCardSeasonal}>
						<PlusCircle className='mr-2' /> {editListDataFlashcardSeasonal ? 'Update Record' : 'Add Record'}
					</Button>
				</div>

				<div className='overflow-auto w-full mb-4'>
					<table className='no-hover'>
						<thead>
							<tr>
								<th></th>
								<th>Chinese</th>
								<th>Title Chinese</th>
								<th>Title English</th>
								<th>Audio</th>
								<th>Text to Speech</th>
								<th>Add to Category</th>
								<th>Flash card Type</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{flashcardSeasonalList && <DNDFlashCard editDisable={editListDataFlashcardSeasonal} dndItemRow={flashcardSeasonalList} editRecord={setEditItemFlashcardSeasonal} deleteRecord={removeItemFlashcardSeasonal} setNewOrder={setNewOrderFlashcardSeasonal} />}
							{!flashcardSeasonalList.length && (
								<tr>
									<td colSpan={10} className='text-center font-medium py-5 text-gray-400'>
										No Data Added
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<div className='flex justify-end gap-2 items-center'>
					<CheckBox
						option={[
							{
								value: '',
								checked: skipButtonCheckedFlashcardSeasonal,
								name: 'Provide skip button for this activity',
								onChange() {
									setSkipButtonCheckedFlashcardSeasonal((prev) => !prev);
								},
							},
						]}
					/>
					<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdateFlashcardSeasonal || !!editListDataFlashcardSeasonal}>
						{params.activityId ? 'Update' : 'Save'}
					</Button>
					<Button className='btn-default btn-large w-28 justify-center' onClick={onClose}>
						Cancel
					</Button>
				</div>
			</form>
			{isAddEditModelFlashcardSeasonal && <AddEditCategoryModal onClose={onCloseModalFlashcardSeasonal} editData={null} onSubmit={getCategoriesListFlashcardSeasonal} />}
		</div>
	);
};

export default SeasonalActivityFlashcard;
