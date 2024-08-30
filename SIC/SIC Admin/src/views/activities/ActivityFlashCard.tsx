import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import TextInput from '@components/textInput/TextInput';
import { AddEditActivitiesData } from 'src/types/activities';
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
import { CreateFlashCardActivity, FlashCardActivitySubmitData, FlashCardTextArr, flashCardActivityList } from 'src/types/activities/flashCard';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import { generateUuid, resetInputManually } from '@utils/helpers';
import RadioButton from '@components/radiobutton/RadioButton';
import { DropdownOptionType } from 'src/types/component';
import { URL_PATHS } from '@config/variables';
import Dropdown from '@components/dropdown/Dropdown';
import AddEditCategoryModal from '@views/flashCard/AddEditCategory';
import { Uploader } from './utils/upload';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import DNDFlashCard from './DNDFlashCard';

export enum FieldNames {
	title = 'title',
	titleTraditional = 'traditionalTitleChinese',
	traditionalTitleEnglish = 'traditionalTitleEnglish',
	titleSimplified = 'simplifiedTitleChinese',
	simplifiedTitleEnglish = 'simplifiedTitleEnglish',
	imageSimplified = 'simplifiedImageUrl',
	audioSimplified = 'simplifiedAudioUrl',
	textPronunciationSimplified = 'simplifiedPronunciationText',
	imageTraditional = 'traditionalImageUrl',
	audioTraditional = 'traditionalAudioUrl',
	textPronunciationTraditional = 'traditionalPronunciationText',
	isTextToSpeech = 'isTextToSpeech',
	isSkippable = 'isSkippable',

	isFlashCardText = 'isFlashCardText',
	flashCardCategory = 'categoryId',
}

const ActivityFlashCard = ({ onSubmit, onClose, url, activityUuid }: AddEditActivitiesData) => {
	const params = useParams();
	const [loadingFlashcard, setLoadingFlashcard] = useState<boolean>(false);
	const [flashcardList, setFlashcardList] = useState<flashCardActivityList[]>([]);
	const [textToSpeechCheckedFlashcard, setTextToSpeechCheckedFlashcard] = useState<boolean>(false);
	const [skipButtonCheckedFlashcard, setSkipButtonCheckedFlashcard] = useState<boolean>(false);
	const [imageSimplifiedFlashcard, setImageSimplifiedFlashcard] = useState<string>('');
	const [audioSimplifiedFlashcard, setAudioSimplifiedFlashcard] = useState<string>('');
	const [imageTraditionalFlashcard, setImageTraditionalFlashcard] = useState<string>('');
	const [audioTraditionalFlashcard, setAudioTraditionalFlashcard] = useState<string>('');
	const [imageSimplifiedFlashcardPercentage, setImageSimplifiedFlashcardPercentage] = useState<number>(0);
	const [audioSimplifiedFlashcardPercentage, setAudioSimplifiedFlashcardPercentage] = useState<number>(0);
	const [imageTraditionalFlashcardPercentage, setImageTraditionalFlashcardPercentage] = useState<number>(0);
	const [audioTraditionalFlashcardPercentage, setAudioTraditionalFlashcardPercentage] = useState<number>(0);
	const [editListDataFlashcard, setEditListDataFlashcard] = useState<flashCardActivityList | null>(null);
	const [checkedFlashcard, setCheckedFlashcard] = useState<string>(fileTypeEnum.image);
	const radioOptionsFlashcard = [
		{ name: 'Flash Card With Image', key: fileTypeEnum.image, disabled: editListDataFlashcard?.isFlashCardText },
		{ name: 'Flash Card With Text', key: fileTypeEnum.text, disabled: editListDataFlashcard?.isFlashCardText === false },
	];
	const [isAddEditModelFlashcard, setIsAddEditModelFlashcard] = useState<boolean>(false);
	const [showFlashCard, setShowFlashCard] = useState<boolean>(false);
	const [flashCardCategories, setFlashCardCategories] = useState<DropdownOptionType[]>([]);
	const [newOrderFlashcard, setNewOrderFlashcard] = useState<flashCardActivityList[]>();

	const [tileDataFlashcard, setTileDataFlashcard] = useState<FlashCardTextArr>();
	const [selectedItemsFlashcard, setSelectedItemsFlashcard] = useState<Array<string>>([]);
	const [selectedFlashcards, setSelectedFlashcards] = useState<FlashCardTextArr>([]);
	const [showFormFlashcard, setShowFormFlashcard] = useState<boolean>(true);

	useEffect(() => {
		if (newOrderFlashcard) {
			setFlashcardList(newOrderFlashcard);
		}
	}, [newOrderFlashcard]);

	const updatePercentageFlashcard = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.audioSimplified:
				setAudioSimplifiedFlashcardPercentage(newPercentage);
				break;
			case FieldNames.audioTraditional:
				setAudioTraditionalFlashcardPercentage(newPercentage);
				break;
			case FieldNames.imageSimplified:
				setImageSimplifiedFlashcardPercentage(newPercentage);
				break;
			case FieldNames.imageTraditional:
				setImageTraditionalFlashcardPercentage(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidFlashcard = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdateFlashcard = !(isPercentageValidFlashcard(imageSimplifiedFlashcardPercentage) && isPercentageValidFlashcard(imageTraditionalFlashcardPercentage) && isPercentageValidFlashcard(audioSimplifiedFlashcardPercentage) && isPercentageValidFlashcard(audioTraditionalFlashcardPercentage));

	const getCategoriesListFlashcard = useCallback(() => {
		APIService.getData(`${URL_PATHS.flashCardCategories}/all/list`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data.categories.map((item: { categoryName: string; uuid: string }) => {
						data.push({ name: item?.categoryName, key: item?.uuid });
					});
					setFlashCardCategories(data);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	}, []);

	useEffect(() => {
		getCategoriesListFlashcard();
	}, []);

	/**
	 * Method is used to set the fields if User click edit data
	 */
	useEffect(() => {
		if (editListDataFlashcard) {
			if (editListDataFlashcard.isFlashCardText) {
				setCheckedFlashcard(fileTypeEnum.text);
			} else {
				if (editListDataFlashcard.simplifiedImageUrl) {
					setImageSimplifiedFlashcard(editListDataFlashcard?.simplifiedImageUrl);
				}
				if (editListDataFlashcard.traditionalImageUrl) {
					editListDataFlashcard.traditionalImageUrl && setImageTraditionalFlashcard(editListDataFlashcard?.traditionalImageUrl);
				}
				setCheckedFlashcard(fileTypeEnum.image);
			}

			setAudioSimplifiedFlashcard(editListDataFlashcard?.simplifiedAudioUrl);
			setAudioTraditionalFlashcard(editListDataFlashcard?.traditionalAudioUrl);
			setTextToSpeechCheckedFlashcard(editListDataFlashcard?.isTextToSpeech);

			formik.setFieldValue(FieldNames.titleSimplified, editListDataFlashcard?.simplifiedTitleChinese);
			formik.setFieldValue(FieldNames.simplifiedTitleEnglish, editListDataFlashcard?.simplifiedTitleEnglish);
			formik.setFieldValue(FieldNames.textPronunciationSimplified, editListDataFlashcard?.simplifiedTitleChinese);
			formik.setFieldValue(FieldNames.titleTraditional, editListDataFlashcard?.traditionalTitleChinese);

			formik.setFieldValue(FieldNames.traditionalTitleEnglish, editListDataFlashcard?.traditionalTitleEnglish);
			formik.setFieldValue(FieldNames.textPronunciationTraditional, editListDataFlashcard?.traditionalTitleChinese);
			formik.setFieldValue(FieldNames.flashCardCategory, editListDataFlashcard?.categoryId);
			editListDataFlashcard?.categoryId && setShowFlashCard(true);
		}
	}, [editListDataFlashcard]);

	useEffect(() => {
		if (params.activityId) {
			setLoadingFlashcard(true);
			APIService.getData(`${url}/flash-card/${params.activityId}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						setFlashcardList(
							response.data.data.activityData?.map((item: flashCardActivityList) => {
								return { ...item, id: item.activityDataId };
							})
						);
						setSkipButtonCheckedFlashcard(response.data.data.isSkippable);
						formik.setFieldValue(FieldNames.title, response.data.data.title);
					}
					setLoadingFlashcard(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingFlashcard(false);
				});
		}
	}, []);

	const initialValues: CreateFlashCardActivity = {
		[FieldNames.imageSimplified]: null,
		[FieldNames.audioSimplified]: null,
		[FieldNames.titleSimplified]: '',
		[FieldNames.simplifiedTitleEnglish]: '',
		[FieldNames.textPronunciationSimplified]: '',
		[FieldNames.imageTraditional]: null,
		[FieldNames.audioTraditional]: null,
		[FieldNames.titleTraditional]: '',
		[FieldNames.traditionalTitleEnglish]: '',
		[FieldNames.textPronunciationTraditional]: '',
		[FieldNames.title]: '',
		[FieldNames.flashCardCategory]: '',
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit questions
	 */
	const getObjFlashcard = () => {
		const titleErrorFlashcard = flashcardList.length ? Yup.string().notRequired() : Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE);
		const objFlashcard: ObjectShape =
			checkedFlashcard === fileTypeEnum.image
				? {
						[FieldNames.imageSimplified]: flashcardList.length || imageSimplifiedFlashcard.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_IMAGE),
						[FieldNames.audioSimplified]: flashcardList.length || audioSimplifiedFlashcard.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_AUDIO),
						[FieldNames.titleSimplified]: titleErrorFlashcard,
						[FieldNames.imageTraditional]: flashcardList.length || imageTraditionalFlashcard.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_IMAGE),
						[FieldNames.audioTraditional]: flashcardList.length || audioTraditionalFlashcard.length ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_AUDIO),
						[FieldNames.titleTraditional]: titleErrorFlashcard,
						[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
						[FieldNames.traditionalTitleEnglish]: titleErrorFlashcard,
						[FieldNames.simplifiedTitleEnglish]: titleErrorFlashcard,
				  }
				: {
						[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
				  };
		return Yup.object<ObjectShape>(objFlashcard);
	};
	const validationSchema = getObjFlashcard();
	const formToastMessageFlashcard = () => {
		checkedFlashcard === fileTypeEnum.image ? toast.error(Errors.FILL_FORM_ERROR) : toast.error('Please select at least one flash card.');
	};

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const { levelId, topicId, lessonId } = params;
			if (flashcardList.length) {
				const commonSubmitDataFlashcard: FlashCardActivitySubmitData = {
					levelId: levelId as string,
					topicId: topicId as string,
					lessonId: lessonId as string,
					activityTypeId: activityUuid,
					title: values.title.trim(),
					isSkippable: skipButtonCheckedFlashcard,
					activityData: flashcardList.map(({ traditionalImageUrl, id, simplifiedImageUrl, ...item }) => ({
						activityDataId: id,
						...item,
						simplifiedAudioUrl: item.simplifiedAudioUrl.split('/').pop() as string,
						traditionalAudioUrl: item.traditionalAudioUrl.split('/').pop() as string,
						...(traditionalImageUrl && { traditionalImageUrl: traditionalImageUrl.split('/').pop() as string }),
						...(simplifiedImageUrl && { simplifiedImageUrl: simplifiedImageUrl.split('/').pop() as string }),
					})),
				};
				if (params.activityId) {
					setLoadingFlashcard(true);
					APIService.putData(`${url}/flash-card-update/${params.activityId}`, {
						...commonSubmitDataFlashcard,
					})
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingFlashcard(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingFlashcard(false);
						});
				} else {
					setLoadingFlashcard(true);
					APIService.postData(`${url}/flash-card-create`, {
						...commonSubmitDataFlashcard,
					})
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoadingFlashcard(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoadingFlashcard(false);
						});
				}
			} else {
				formToastMessageFlashcard();
			}
		},
	});

	const resetFieldsFlashcard = () => {
		setImageSimplifiedFlashcard('');
		setAudioSimplifiedFlashcard('');
		setImageTraditionalFlashcard('');
		setAudioTraditionalFlashcard('');
		setTextToSpeechCheckedFlashcard(false);
	};

	const textValidDataFlashcard = formik.values.traditionalTitleEnglish?.trim() && formik.values.simplifiedTitleEnglish?.trim() && formik.values.simplifiedTitleChinese?.trim() && formik.values.traditionalTitleChinese?.trim();
	const hasToValidDataFlashcard = textValidDataFlashcard && imageSimplifiedFlashcard && imageTraditionalFlashcard && audioSimplifiedFlashcard && audioTraditionalFlashcard;
	const categoryIdValueFlashcard = showFlashCard ? formik.values.categoryId : '';

	const addMoreForTextFlashcard = () => {
		if (editListDataFlashcard) {
			setFlashcardList((prev) => {
				const updatedDataFlashcard = prev.map((item) => {
					if (item.id === editListDataFlashcard?.id) {
						const updatedCommonDataFlashcard = {
							id: editListDataFlashcard.id, // Use the existing id for editing
							[FieldNames.titleSimplified]: formik.values.simplifiedTitleChinese,
							[FieldNames.simplifiedTitleEnglish]: formik.values.simplifiedTitleEnglish,
							[FieldNames.audioSimplified]: audioSimplifiedFlashcard,
							[FieldNames.titleTraditional]: formik.values.traditionalTitleChinese,
							[FieldNames.traditionalTitleEnglish]: formik.values.traditionalTitleEnglish,
							[FieldNames.audioTraditional]: audioTraditionalFlashcard,
							...(textToSpeechCheckedFlashcard && {
								[FieldNames.textPronunciationSimplified]: formik.values.simplifiedTitleChinese,
								[FieldNames.textPronunciationTraditional]: formik.values.traditionalTitleChinese,
							}),
							[FieldNames.isTextToSpeech]: textToSpeechCheckedFlashcard,
							[FieldNames.flashCardCategory]: categoryIdValueFlashcard,
							[FieldNames.isFlashCardText]: true,
						};
						return { ...item, ...updatedCommonDataFlashcard };
					} else {
						return item;
					}
				});
				return updatedDataFlashcard;
			});
		} else {
			const setImageCardFlashcard = selectedFlashcards.map((item) => {
				return {
					id: generateUuid(), // Use the existing id for editing
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
			setFlashcardList((prev) => {
				return [...prev, ...setImageCardFlashcard];
			});
		}
	};

	const addMoreForImageFlashcard = () => {
		setFlashcardList((prev) => {
			const updatedDataFlashcard = prev.map((item) => {
				if (item.id === editListDataFlashcard?.id) {
					const updatedCommonDataFlashcard = {
						id: editListDataFlashcard?.id, // Use the existing id for editing
						[FieldNames.titleSimplified]: formik.values.simplifiedTitleChinese,
						[FieldNames.simplifiedTitleEnglish]: formik.values.simplifiedTitleEnglish,
						[FieldNames.audioSimplified]: audioSimplifiedFlashcard,
						[FieldNames.titleTraditional]: formik.values.traditionalTitleChinese,
						[FieldNames.traditionalTitleEnglish]: formik.values.traditionalTitleEnglish,
						[FieldNames.audioTraditional]: audioTraditionalFlashcard,
						...(textToSpeechCheckedFlashcard && {
							[FieldNames.textPronunciationSimplified]: formik.values.simplifiedTitleChinese,
							[FieldNames.textPronunciationTraditional]: formik.values.traditionalTitleChinese,
						}),
						[FieldNames.isTextToSpeech]: textToSpeechCheckedFlashcard,
						[FieldNames.flashCardCategory]: categoryIdValueFlashcard,
						[FieldNames.imageSimplified]: imageSimplifiedFlashcard,
						[FieldNames.imageTraditional]: imageTraditionalFlashcard,
						[FieldNames.isFlashCardText]: false,
					};

					return { ...item, ...updatedCommonDataFlashcard };
				} else {
					return item;
				}
			});
			if (!editListDataFlashcard) {
				const updateDataFlashcard = {
					id: generateUuid(), // Use the existing id for editing
					[FieldNames.titleSimplified]: formik.values.simplifiedTitleChinese,
					[FieldNames.audioSimplified]: audioSimplifiedFlashcard,
					...(textToSpeechCheckedFlashcard && {
						[FieldNames.textPronunciationSimplified]: formik.values.simplifiedTitleChinese,
						[FieldNames.textPronunciationTraditional]: formik.values.traditionalTitleChinese,
					}),
					[FieldNames.simplifiedTitleEnglish]: formik.values.simplifiedTitleEnglish,
					[FieldNames.titleTraditional]: formik.values.traditionalTitleChinese,
					[FieldNames.audioTraditional]: audioTraditionalFlashcard,
					[FieldNames.traditionalTitleEnglish]: formik.values.traditionalTitleEnglish,
					[FieldNames.isTextToSpeech]: textToSpeechCheckedFlashcard,
					[FieldNames.flashCardCategory]: categoryIdValueFlashcard,
					[FieldNames.imageTraditional]: imageTraditionalFlashcard,
					[FieldNames.imageSimplified]: imageSimplifiedFlashcard,
					[FieldNames.isFlashCardText]: false,
				};
				updatedDataFlashcard.push({
					...updateDataFlashcard,
				});
			}

			return updatedDataFlashcard;
		});
	};

	const addMoreFlashCard = useCallback(() => {
		if (checkedFlashcard === fileTypeEnum.text && selectedFlashcards.length) {
			if (editListDataFlashcard && !textValidDataFlashcard) {
				toast.error(Errors.FILL_FORM_ERROR);
				return;
			}
			addMoreForTextFlashcard();
			setSelectedFlashcards([]);
			setSelectedItemsFlashcard([]);
			editListDataFlashcard?.isFlashCardText && resetInputManually([FieldNames.audioTraditional, FieldNames.audioSimplified]);
		} else if (hasToValidDataFlashcard && checkedFlashcard === fileTypeEnum.image) {
			addMoreForImageFlashcard();
			resetInputManually([FieldNames.audioTraditional, FieldNames.audioSimplified, FieldNames.imageSimplified, FieldNames.imageTraditional]);
		} else {
			checkedFlashcard === fileTypeEnum.image ? toast.error(Errors.FILL_FORM_ERROR) : toast.error('Please select at least one flash card.');
		}
		formik.setFieldValue(FieldNames.titleSimplified, '');
		formik.setFieldValue(FieldNames.simplifiedTitleEnglish, '');
		formik.setFieldValue(FieldNames.textPronunciationSimplified, '');
		formik.setFieldValue(FieldNames.audioSimplified, '');
		formik.setFieldValue(FieldNames.imageSimplified, '');
		formik.setFieldValue(FieldNames.titleTraditional, '');
		formik.setFieldValue(FieldNames.traditionalTitleEnglish, '');
		formik.setFieldValue(FieldNames.textPronunciationTraditional, '');
		formik.setFieldValue(FieldNames.audioTraditional, '');
		formik.setFieldValue(FieldNames.imageTraditional, '');
		formik.setFieldValue(FieldNames.flashCardCategory, '');
		setShowFlashCard(false);
		resetFieldsFlashcard();
		validateFormFlashcard();
		setEditListDataFlashcard(null);
	}, [flashcardList, editListDataFlashcard, formik]);

	/**
	 *
	 * @returns Method used for remove activity
	 */
	const removeItemFlashcard = useCallback(
		(id: string) => {
			setFlashcardList(flashcardList?.filter((item) => item.id !== id));
		},
		[flashcardList]
	);

	const setEditItemFlashcard = useCallback(
		(data: flashCardActivityList) => {
			setEditListDataFlashcard(data);
			if (data.isFlashCardText) {
				setSelectedItemsFlashcard([data.id]);
				setSelectedFlashcards([{ activityDataId: data.id, ...data }]);
			}
		},
		[editListDataFlashcard]
	);
	const copyDataFlashcard = useCallback(() => {
		formik.values.traditionalTitleChinese && formik.setFieldValue(FieldNames.titleSimplified, formik.values.traditionalTitleChinese);
		formik.values.traditionalTitleChinese && formik.setFieldValue(FieldNames.textPronunciationSimplified, formik.values.traditionalTitleChinese);
		if (imageTraditionalFlashcard !== '') {
			setImageSimplifiedFlashcard(imageTraditionalFlashcard);
			formik.setFieldValue(FieldNames.imageSimplified, formik.values.traditionalImageUrl);
		}
		formik.values.traditionalTitleEnglish && formik.setFieldValue(FieldNames.simplifiedTitleEnglish, formik.values.traditionalTitleEnglish);
		if (audioTraditionalFlashcard !== '') {
			formik.setFieldValue(FieldNames.audioSimplified, formik.values.traditionalAudioUrl);
			setAudioSimplifiedFlashcard(audioTraditionalFlashcard);
		}
		validateFormFlashcard();
	}, [formik]);

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const fileUpdateFlashcard = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileFlashcard = event.target.files?.[0];
		const fileNameFlashcard = event.target.name;
		if (fileFlashcard === undefined) {
			return;
		}
		const fileSizeFlashcard = type === fileTypeEnum.image ? IMAGE_SIZE_MB : AUDIO_SIZE_MB;
		const fileTypesFlashcard = type === fileTypeEnum.image ? [FILE_TYPE.pngType, FILE_TYPE.jpgType, FILE_TYPE.jpegType] : [FILE_TYPE.audioType, FILE_TYPE.wavType];
		if (!fileTypesFlashcard.includes(fileFlashcard.type)) {
			setLoadingFlashcard(false);
			toast.error(type === fileTypeEnum.image ? Errors.PLEASE_ALLOW_JPG_PNG_JPEG_FILE : Errors.PLEASE_ALLOW_MP3_WAV_FILE);
			return;
		}
		if (fileFlashcard.size / 1000 / 1024 >= fileSizeFlashcard) {
			toast.error(`Uploaded ${type} size is greater than ${fileSizeFlashcard}MB, please upload ${type} size within ${fileSizeFlashcard}MB or max ${fileSizeFlashcard}MB`);
		}
		const lastIndex = fileFlashcard?.name?.lastIndexOf('.');
		const extension = fileFlashcard?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileFlashcard);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptions = {
					fileName: name,
					file: fileFlashcard,
					isForSeasonal: false,
					isForSop: false,
					fieldName: fileNameFlashcard,
				};
				const uploader = new Uploader(imageUploaderOptions, updatePercentageFlashcard);
				uploader.start();
				switch (fileNameFlashcard) {
					case FieldNames.imageSimplified:
						formik.setFieldValue(FieldNames.imageSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setImageSimplifiedFlashcard(response);
							setLoadingFlashcard(false);
						});
						break;
					case FieldNames.imageTraditional:
						formik.setFieldValue(FieldNames.imageTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingFlashcard(false);
							setImageTraditionalFlashcard(response);
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
			const blob = URL.createObjectURL(fileFlashcard);
			audio.src = blob;
			audio.addEventListener('loadedmetadata', () => {
				const audioUploaderOptions = {
					fileName: name,
					file: fileFlashcard,
					isForSeasonal: false,
					isForSop: false,
					fieldName: fileNameFlashcard,
				};
				const uploader = new Uploader(audioUploaderOptions, updatePercentageFlashcard);
				uploader.start();
				switch (fileNameFlashcard) {
					case FieldNames.audioSimplified:
						formik.setFieldValue(FieldNames.audioSimplified, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingFlashcard(false);
							setAudioSimplifiedFlashcard(response);
						});
						break;
					case FieldNames.audioTraditional:
						formik.setFieldValue(FieldNames.audioTraditional, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingFlashcard(false);
							setAudioTraditionalFlashcard(response);
						});
						break;
					default:
						break;
				}
			});
		}
	}, []);

	const validateFormFlashcard = () => {
		setTimeout(() => {
			formik.validateForm();
		}, 500);
	};

	useEffect(() => {
		setLoadingFlashcard(true);
		APIService.getData(`${url}/flashcard/list?levelId=${params.levelId}&topicId=${params.topicId}&lessonId=${params.lessonId}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const data = response?.data?.data?.data?.allActivityArr;
					setTileDataFlashcard(data);
				}
				setLoadingFlashcard(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoadingFlashcard(false);
			});
	}, []);

	const changeSelectionActivityFlashcard = (activityDataId: string) => {
		if (!selectedItemsFlashcard.includes(activityDataId)) {
			setSelectedItemsFlashcard((prevItem) => [...prevItem, activityDataId]);
			const newData = tileDataFlashcard?.filter((item) => item.activityDataId === activityDataId);
			setSelectedFlashcards((prevCard) => [...(newData as FlashCardTextArr), ...prevCard]);
		} else {
			setSelectedItemsFlashcard(selectedItemsFlashcard.filter((item: string) => item !== activityDataId));
			setSelectedFlashcards(selectedFlashcards.filter((item) => item.activityDataId !== activityDataId));
		}
	};

	const getErrorFlashcard = (fieldName: keyof CreateFlashCardActivity) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	const imageChangeHandlerFlashcard = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateFlashcard(e, fileTypeEnum.image);
	}, []);

	const audioChangeHandlerFlashcard = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateFlashcard(e, fileTypeEnum.audio);
	}, []);

	const addCategoryModalFlashcard = useCallback(() => {
		setIsAddEditModelFlashcard(true);
	}, []);

	const onCloseModalFlashcard = useCallback(() => {
		setIsAddEditModelFlashcard(false);
	}, []);

	useEffect(() => {
		if (checkedFlashcard === fileTypeEnum.text && !editListDataFlashcard) {
			setShowFormFlashcard(false);
		} else {
			setShowFormFlashcard(true);
		}
	}, [checkedFlashcard, editListDataFlashcard]);

	return (
		<div>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loadingFlashcard && <Loader />}
				<div className='mb-4 w-full'>
					<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorFlashcard(FieldNames.title)} required />
				</div>
				<div className='mb-4'>
					<RadioButton id='flashCard' label={'Flash Card Type'} name={'isFlashCardWithImage'} onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setCheckedFlashcard(e.target.value), [])} checked={checkedFlashcard} radioOptions={radioOptionsFlashcard} required />
				</div>
				{checkedFlashcard === fileTypeEnum.text && !editListDataFlashcard && (
					<div className='rounded border w-full mb-4'>
						<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Flashcard List</h6>
						<div className='p-3'>
							{tileDataFlashcard?.length ? (
								<ul className='grid grid-cols-3 md:grid-cols-8 gap-3 media-list'>
									{tileDataFlashcard?.map((tile: flashCardActivityList) => {
										return !tile?.isFlashCardText ? (
											<li key={tile.activityDataId} className={`border rounded p-1 h-40 cursor-pointer relative ${selectedItemsFlashcard.includes(tile.activityDataId as string) ? 'border-primary border-2 active' : ''}`} onClick={() => changeSelectionActivityFlashcard(tile.activityDataId as string)}>
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
				{showFormFlashcard && (
					<>
						<div className='flex flex-col md:flex-row gap-3 mb-4'>
							<div className='rounded border w-full'>
								<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Traditional Chinese</h6>
								<div className='grid grid-cols-2 gap-x-4 p-3'>
									<div className='mb-4'>
										<TextInput placeholder='Title Chinese' name={FieldNames.titleTraditional} onChange={formik.handleChange} label='Title Chinese' value={formik.values.traditionalTitleChinese} error={getErrorFlashcard(FieldNames.titleTraditional)} required />
									</div>
									<div className='mb-4'>
										<TextInput placeholder='Title English' name={FieldNames.traditionalTitleEnglish} onChange={formik.handleChange} label='Title English' value={formik.values.traditionalTitleEnglish} error={getErrorFlashcard(FieldNames.traditionalTitleEnglish)} required />
									</div>
									<div className='mb-4'>
										<FileUpload labelName='Upload Audio' id={FieldNames.audioTraditional} imageSource={audioTraditionalFlashcard} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.audioTraditional} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioChangeHandlerFlashcard} error={getErrorFlashcard(FieldNames.audioTraditional) ?? ''} />
										{!isPercentageValidFlashcard(audioTraditionalFlashcardPercentage) && <LoadingPercentage percentage={audioTraditionalFlashcardPercentage} />}
									</div>
									{checkedFlashcard === fileTypeEnum.image && (
										<div className='mb-4'>
											<FileUpload labelName='Upload Image' id={FieldNames.imageTraditional} imageSource={imageTraditionalFlashcard} name={FieldNames.imageTraditional} error={getErrorFlashcard(FieldNames.imageTraditional) ?? ''} acceptNote={IMAGE_NOTE} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} uploadType={FILE_TYPE.pngType} onChange={imageChangeHandlerFlashcard} />
											{!isPercentageValidFlashcard(imageTraditionalFlashcardPercentage) && <LoadingPercentage percentage={imageTraditionalFlashcardPercentage} />}
										</div>
									)}
								</div>
							</div>
							<div className='flex flex-col justify-center items-center p-3'>
								<Button className='btn-default btn-large' title='Copy' onClick={copyDataFlashcard} disabled={disableUpdateFlashcard}>
									<AngleRight className='text-md' />
								</Button>
								<span className='mt-1 text-gray-500'>Copy</span>
							</div>
							<div className='rounded border w-full'>
								<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Simplified Chinese</h6>
								<div className='grid grid-cols-2 gap-x-4 p-3'>
									<div className='mb-4'>
										<TextInput placeholder='Title Chinese' name={FieldNames.titleSimplified} onChange={formik.handleChange} label='Title Chinese' value={formik.values.simplifiedTitleChinese} error={getErrorFlashcard(FieldNames.titleSimplified)} required />
									</div>
									<div className='mb-4'>
										<TextInput placeholder='Title English' name={FieldNames.simplifiedTitleEnglish} onChange={formik.handleChange} label='Title English' value={formik.values.simplifiedTitleEnglish} error={getErrorFlashcard(FieldNames.simplifiedTitleEnglish)} required />
									</div>
									<div className='mb-4'>
										<FileUpload labelName='Upload Audio' id={FieldNames.audioSimplified} imageSource={audioSimplifiedFlashcard} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.audioSimplified} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioChangeHandlerFlashcard} error={getErrorFlashcard(FieldNames.audioSimplified) ?? ''} />
										{!isPercentageValidFlashcard(audioSimplifiedFlashcardPercentage) && <LoadingPercentage percentage={audioSimplifiedFlashcardPercentage} />}
									</div>
									{checkedFlashcard === fileTypeEnum.image && (
										<div className='mb-4'>
											<FileUpload labelName='Upload Image' id={FieldNames.imageSimplified} imageSource={imageSimplifiedFlashcard} name={FieldNames.imageSimplified} error={getErrorFlashcard(FieldNames.imageSimplified) ?? ''} acceptNote={IMAGE_NOTE} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} uploadType={FILE_TYPE.pngType} onChange={imageChangeHandlerFlashcard} />
											{!isPercentageValidFlashcard(imageSimplifiedFlashcardPercentage) && <LoadingPercentage percentage={imageSimplifiedFlashcardPercentage} />}
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
										checked: showFlashCard,
										name: 'Add this to flashcard category',
										onChange() {
											setShowFlashCard((prev) => !prev);
										},
									},
								]}
							/>
							{showFlashCard && (
								<div className='flex justify-start'>
									<div>
										<Dropdown placeholder={'Select category'} value={formik.values.categoryId} name={FieldNames.flashCardCategory} onChange={formik.handleChange} options={flashCardCategories} id='categories' error={formik.errors.categoryId && formik.touched.categoryId ? formik.errors.categoryId : ''} />
									</div>
									<div>
										<Button className='btn-primary btn-normal ml-4' onClick={addCategoryModalFlashcard}>
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
									checked: textToSpeechCheckedFlashcard,
									name: 'Provide text to speech detection function',
									onChange() {
										setTextToSpeechCheckedFlashcard((prev) => !prev);
										validateFormFlashcard();
									},
								},
							]}
						/>
					</>
				)}
				<div className='flex justify-center'>
					<Button className='btn-primary mb-5 btn-large' onClick={addMoreFlashCard}>
						<PlusCircle className='mr-2' /> {editListDataFlashcard ? 'Update Record' : 'Add Record'}
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
							{flashcardList && <DNDFlashCard editDisable={editListDataFlashcard} dndItemRow={flashcardList} editRecord={setEditItemFlashcard} deleteRecord={removeItemFlashcard} setNewOrder={setNewOrderFlashcard} />}
							{!flashcardList.length && (
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
								checked: skipButtonCheckedFlashcard,
								name: 'Provide skip button for this activity',
								onChange() {
									setSkipButtonCheckedFlashcard((prev) => !prev);
								},
							},
						]}
					/>
					<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdateFlashcard || !!editListDataFlashcard}>
						{params.activityId ? 'Update' : 'Save'}
					</Button>
					<Button className='btn-default btn-large w-28 justify-center' onClick={onClose}>
						Cancel
					</Button>
				</div>
			</form>
			{isAddEditModelFlashcard && <AddEditCategoryModal onClose={onCloseModalFlashcard} editData={null} onSubmit={getCategoriesListFlashcard} />}
		</div>
	);
};

export default ActivityFlashCard;
