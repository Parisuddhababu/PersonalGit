import React, { useCallback, useEffect, useState } from 'react';
import { FieldArray, FormikProvider, getIn, useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import TextInput from '@components/textInput/TextInput';
import { AddEditActivitiesData, MyArrayHelpers } from 'src/types/activities';
import CheckBox from '@components/checkbox/CheckBox';
import { useParams } from 'react-router-dom';
import { APIService } from '@framework/services/api';
import { FieldNames, ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { Errors } from '@config/errors';
import { AngleRight, Plus, PlusCircle } from '@components/icons';
import FileUpload from '@components/fileUpload/FileUpload';
import { IMAGE_NOTE, FILE_TYPE, fileTypeEnum, activityPaths, endPoint, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE, SIMPLIFIED_CHINESE_CODE, MAX_IMAGE_DIMENSION, MAX_GAME_IMAGE_SIZE, GAME_IMAGE_NOTE, MAX_AUDIO_FILE_SIZE } from '@config/constant';
import { CreateFlashCardActivity, FlashCardActivitySubmitData, FlashCardTextArr, flashCardActivityList } from 'src/types/activities/flashCard';
import { generateUuid, moveData, resetInputManually, translateText, typeValidation } from '@utils/helpers';
import RadioButton from '@components/radiobutton/RadioButton';
import { DropdownOptionType } from 'src/types/component';
import { URL_PATHS } from '@config/variables';
import Dropdown from '@components/dropdown/Dropdown';
import AddEditCategoryModal from '@views/flashCard/AddEditCategory';
import { Uploader } from './utils/upload';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import DNDFlashCard from './DNDFlashCard';
import DeleteButton from '@components/common/DeleteButton';
import { mixedNotRequired, mixedRequired, stringNoSpecialChar, stringNotRequired, stringTrim } from '@config/validations';
import CommonButton from '@components/common/CommonButton';

const ActivityFlashCard = ({ onSubmit, onClose, url, activityUuid, toggleActivity, isMoving, levelId, topicId, lessonId }: AddEditActivitiesData) => {
	const params = useParams();
	const [loadingFlashcard, setLoadingFlashcard] = useState<boolean>(false);
	const [flashcardList, setFlashcardList] = useState<flashCardActivityList[]>([]);
	const [textToSpeechCheckedFlashcard, setTextToSpeechCheckedFlashcard] = useState<boolean>(false);
	const [skipButtonCheckedFlashcard, setSkipButtonCheckedFlashcard] = useState<boolean>(false);
	const [imageSimplifiedFlashcard, setImageSimplifiedFlashcard] = useState<string>('');
	const [audioSimplifiedFlashcard, setAudioSimplifiedFlashcard] = useState<string>('');
	const [imageTraditionalFlashcard, setImageTraditionalFlashcard] = useState<string>('');
	const [audioTraditionalFlashcard, setAudioTraditionalFlashcard] = useState<string>('');
	/**  game changes start */
	const [gameImageSimplifiedFlashcard, setGameImageSimplifiedFlashcard] = useState<string>('');
	const [gameAudioSimplifiedFlashcard, setGameAudioSimplifiedFlashcard] = useState<string>('');
	const [gameAudioTraditionalFlashcard, setGameAudioTraditionalFlashcard] = useState<string>('');
	const [gameImageTraditionalFlashcard, setGameImageTraditionalFlashcard] = useState<string>('');
	/**  game changes end */

	const [imageSimplifiedFlashcardPercentage, setImageSimplifiedFlashcardPercentage] = useState<number>(0);
	const [audioSimplifiedFlashcardPercentage, setAudioSimplifiedFlashcardPercentage] = useState<number>(0);
	const [imageTraditionalFlashcardPercentage, setImageTraditionalFlashcardPercentage] = useState<number>(0);
	const [audioTraditionalFlashcardPercentage, setAudioTraditionalFlashcardPercentage] = useState<number>(0);

	/**  game changes start */
	const [gameImageSimplifiedFlashcardPercentage, setGameImageSimplifiedFlashcardPercentage] = useState<number>(0);
	const [gameAudioSimplifiedFlashcardPercentage, setGameAudioSimplifiedFlashcardPercentage] = useState<number>(0);
	const [gameAudioTraditionalFlashcardPercentage, setGameAudioTraditionalFlashcardPercentage] = useState<number>(0);
	const [gameImageTraditionalFlashcardPercentage, setGameImageTraditionalFlashcardPercentage] = useState<number>(0);
	/**  game changes end */

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

	const defaultSpeechToTextTraditional = { [FieldNames.chinese]: '' };
	const defaultSpeechToTextSimplified = { [FieldNames.chinese]: '' };

	useEffect(() => {
		if (newOrderFlashcard) {
			setFlashcardList(newOrderFlashcard);
		}
	}, [newOrderFlashcard]);

	const updatePercentageFlashcard = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.simplifiedAudioUrl:
				setAudioSimplifiedFlashcardPercentage(newPercentage);
				break;
			case FieldNames.traditionalAudioUrl:
				setAudioTraditionalFlashcardPercentage(newPercentage);
				break;
			case FieldNames.simplifiedImageUrl:
				setImageSimplifiedFlashcardPercentage(newPercentage);
				break;
			case FieldNames.traditionalImageUrl:
				setImageTraditionalFlashcardPercentage(newPercentage);
				break;
			//game changes start
			case FieldNames.simplifiedGameAudioUrl:
				setGameAudioSimplifiedFlashcardPercentage(newPercentage);
				break;
			case FieldNames.traditionalGameAudioUrl:
				setGameAudioTraditionalFlashcardPercentage(newPercentage);
				break;
			case FieldNames.simplifiedGameImageUrl:
				setGameImageSimplifiedFlashcardPercentage(newPercentage);
				break;
			case FieldNames.traditionalGameImageUrl:
				setGameImageTraditionalFlashcardPercentage(newPercentage);
				break;
			//game changes end
			default:
				break;
		}
	};

	const isPercentageValidFlashcard = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdateFlashcard = !(isPercentageValidFlashcard(imageSimplifiedFlashcardPercentage) && isPercentageValidFlashcard(imageTraditionalFlashcardPercentage) && isPercentageValidFlashcard(audioSimplifiedFlashcardPercentage) && isPercentageValidFlashcard(audioTraditionalFlashcardPercentage) && isPercentageValidFlashcard(gameAudioTraditionalFlashcardPercentage) && isPercentageValidFlashcard(gameAudioSimplifiedFlashcardPercentage) && isPercentageValidFlashcard(gameImageSimplifiedFlashcardPercentage) && isPercentageValidFlashcard(gameImageTraditionalFlashcardPercentage));

	const getCategoriesListFlashcard = useCallback(() => {
		APIService.getData(`${URL_PATHS.flashCardCategories}/${endPoint.all}/${endPoint.list}`)
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
	 * Method used to check isFlashCardText type
	 */
	const conditionFunIsFlashCardText = (editListData: flashCardActivityList) => {
		if (editListData.isFlashCardText) {
			setCheckedFlashcard(fileTypeEnum.text);
		} else {
			if (editListData.simplifiedImageUrl) {
				setImageSimplifiedFlashcard(editListData?.simplifiedImageUrl);
			}
			if (editListData.traditionalImageUrl) {
				editListData.traditionalImageUrl && setImageTraditionalFlashcard(editListData?.traditionalImageUrl);
			}
			// game changes start
			if (editListData.traditionalGameImageUrl) {
				setGameImageTraditionalFlashcard(editListData?.traditionalGameImageUrl);
			}
			if (editListData.simplifiedGameImageUrl) {
				setGameImageSimplifiedFlashcard(editListData?.simplifiedGameImageUrl);
			}
			// game changes end
			setCheckedFlashcard(fileTypeEnum.image);
		}
	};

	/**
	 * Method is used to set the fields if User click edit data
	 */
	useEffect(() => {
		if (editListDataFlashcard) {
			conditionFunIsFlashCardText(editListDataFlashcard);

			setAudioSimplifiedFlashcard(editListDataFlashcard?.simplifiedAudioUrl);
			setAudioTraditionalFlashcard(editListDataFlashcard?.traditionalAudioUrl);
			setTextToSpeechCheckedFlashcard(editListDataFlashcard?.isTextToSpeech);

			// game changes start
			setGameAudioSimplifiedFlashcard(editListDataFlashcard?.simplifiedGameAudioUrl);
			setGameAudioTraditionalFlashcard(editListDataFlashcard?.traditionalGameAudioUrl);
			// game changes end

			formik.setFieldValue(FieldNames.titleSimplified, editListDataFlashcard?.simplifiedTitleChinese);
			formik.setFieldValue(FieldNames.simplifiedTitleEnglish, editListDataFlashcard?.simplifiedTitleEnglish);
			formik.setFieldValue(FieldNames.textPronunciationSimplified, editListDataFlashcard?.simplifiedTitleChinese);
			formik.setFieldValue(FieldNames.titleTraditional, editListDataFlashcard?.traditionalTitleChinese);

			formik.setFieldValue(FieldNames.traditionalTitleEnglish, editListDataFlashcard?.traditionalTitleEnglish);
			formik.setFieldValue(FieldNames.textPronunciationTraditional, editListDataFlashcard?.traditionalTitleChinese);
			formik.setFieldValue(FieldNames.flashCardCategory, editListDataFlashcard?.categoryId);
			editListDataFlashcard?.categoryId && setShowFlashCard(true);
			formik.setFieldValue(FieldNames.simplifiedSpeechToTextDataArray, editListDataFlashcard?.simplifiedSpeechToTextDataArray ?? [defaultSpeechToTextSimplified]);
			formik.setFieldValue(FieldNames.traditionalSpeechToTextDataArray, editListDataFlashcard?.traditionalSpeechToTextDataArray ?? [defaultSpeechToTextTraditional]);
		}
	}, [editListDataFlashcard]);

	useEffect(() => {
		if (params.activityId) {
			setLoadingFlashcard(true);
			APIService.getData(`${url}/${activityPaths.flashCard}/${params.activityId}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const toggle = response.data.data.toggle;
						toggleActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);
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
		[FieldNames.simplifiedImageUrl]: null,
		[FieldNames.simplifiedAudioUrl]: null,
		[FieldNames.titleSimplified]: '',
		[FieldNames.simplifiedTitleEnglish]: '',
		[FieldNames.textPronunciationSimplified]: '',
		[FieldNames.traditionalImageUrl]: null,
		[FieldNames.traditionalAudioUrl]: null,
		[FieldNames.titleTraditional]: '',
		[FieldNames.traditionalTitleEnglish]: '',
		[FieldNames.textPronunciationTraditional]: '',
		[FieldNames.title]: '',
		[FieldNames.flashCardCategory]: '',
		[FieldNames.simplifiedSpeechToTextDataArray]: [defaultSpeechToTextSimplified],
		[FieldNames.traditionalSpeechToTextDataArray]: [defaultSpeechToTextTraditional],
		// game changes start
		[FieldNames.traditionalGameImageUrl]: null,
		[FieldNames.traditionalGameAudioUrl]: null,
		[FieldNames.simplifiedGameImageUrl]: null,
		[FieldNames.simplifiedGameAudioUrl]: null,
		// game changes end
	};

	/**
	 * method that check the condition and return validation schema
	 */
	const conditionChecker = (cardList: flashCardActivityList[], flashCard: string, errorMessage: string) => {
		return cardList?.length || flashCard.length ? mixedNotRequired() : mixedRequired(errorMessage);
	};

	/**
	 * @returns Method used for get validation for add/edit questions
	 */
	const getObjFlashcard = () => {
		const titleErrorFlashcard = flashcardList.length ? stringNotRequired() : stringTrim(Errors.PLEASE_ENTER_TITLE);
		const speechToTextError = textToSpeechCheckedFlashcard ? stringTrim(Errors.PLEASE_ENTER_TEXT) : stringNotRequired();
		const objFlashcard: ObjectShape =
			checkedFlashcard === fileTypeEnum.image
				? {
						[FieldNames.simplifiedImageUrl]: conditionChecker(flashcardList, imageSimplifiedFlashcard, Errors.PLEASE_SELECT_IMAGE),
						[FieldNames.simplifiedAudioUrl]: conditionChecker(flashcardList, audioSimplifiedFlashcard, Errors.PLEASE_SELECT_AUDIO),
						[FieldNames.titleSimplified]: titleErrorFlashcard,
						[FieldNames.traditionalImageUrl]: conditionChecker(flashcardList, imageTraditionalFlashcard, Errors.PLEASE_SELECT_IMAGE),
						[FieldNames.traditionalAudioUrl]: conditionChecker(flashcardList, audioTraditionalFlashcard, Errors.PLEASE_SELECT_AUDIO),

						// game changes start
						[FieldNames.traditionalGameImageUrl]: conditionChecker(flashcardList, gameImageTraditionalFlashcard, Errors.PLEASE_SELECT_IMAGE),
						[FieldNames.traditionalGameAudioUrl]: conditionChecker(flashcardList, gameAudioTraditionalFlashcard, Errors.PLEASE_SELECT_AUDIO),
						[FieldNames.simplifiedGameImageUrl]: conditionChecker(flashcardList, gameImageSimplifiedFlashcard, Errors.PLEASE_SELECT_IMAGE),
						[FieldNames.simplifiedGameAudioUrl]: conditionChecker(flashcardList, gameAudioSimplifiedFlashcard, Errors.PLEASE_SELECT_AUDIO),
						// game changes  end

						[FieldNames.titleTraditional]: titleErrorFlashcard,
						[FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
						[FieldNames.traditionalTitleEnglish]: titleErrorFlashcard,
						[FieldNames.simplifiedTitleEnglish]: titleErrorFlashcard,
						[FieldNames.simplifiedSpeechToTextDataArray]: Yup.array().of(
							Yup.object().shape({
								[FieldNames.chinese]: speechToTextError,
							})
						),
						[FieldNames.traditionalSpeechToTextDataArray]: Yup.array().of(
							Yup.object().shape({
								[FieldNames.chinese]: speechToTextError,
							})
						),
				  }
				: {
						[FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
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
			if (flashcardList.length) {
				const commonSubmitDataFlashcard: FlashCardActivitySubmitData = {
					isMoving: isMoving,
					levelId: moveData(isMoving, levelId as string, params.levelId as string),
					topicId: moveData(isMoving, topicId as string, params.topicId as string),
					lessonId: moveData(isMoving, lessonId as string, params.lessonId as string),
					activityTypeId: activityUuid,
					title: values.title.trim(),
					isSkippable: skipButtonCheckedFlashcard,
					activityData: flashcardList.map(({ traditionalImageUrl, id, simplifiedImageUrl, ...item }) => ({
						activityDataId: id,
						...item,
						simplifiedAudioUrl: item.simplifiedAudioUrl.split('/').pop() as string,
						traditionalAudioUrl: item.traditionalAudioUrl.split('/').pop() as string,
						// game changes start
						simplifiedGameAudioUrl: item?.simplifiedGameAudioUrl?.split('/').pop() as string,
						traditionalGameAudioUrl: item?.traditionalGameAudioUrl?.split('/').pop() as string,
						traditionalGameImageUrl: item?.traditionalGameImageUrl?.split('/').pop() as string,
						simplifiedGameImageUrl: item?.simplifiedGameImageUrl?.split('/').pop() as string,
						// game changes start

						...(traditionalImageUrl && { traditionalImageUrl: traditionalImageUrl.split('/').pop() as string }),
						...(simplifiedImageUrl && { simplifiedImageUrl: simplifiedImageUrl.split('/').pop() as string }),
					})),
				};
				if (params.activityId) {
					setLoadingFlashcard(true);
					APIService.putData(`${url}/${activityPaths.flashCardUpdate}/${params.activityId}`, {
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
					APIService.postData(`${url}/${activityPaths.flashCardCreate}`, {
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
		formik.setFieldValue(FieldNames.titleSimplified, '');
		formik.setFieldValue(FieldNames.simplifiedTitleEnglish, '');
		formik.setFieldValue(FieldNames.textPronunciationSimplified, '');
		formik.setFieldValue(FieldNames.simplifiedAudioUrl, '');
		formik.setFieldValue(FieldNames.simplifiedImageUrl, '');
		formik.setFieldValue(FieldNames.titleTraditional, '');
		formik.setFieldValue(FieldNames.traditionalTitleEnglish, '');
		formik.setFieldValue(FieldNames.textPronunciationTraditional, '');
		formik.setFieldValue(FieldNames.traditionalAudioUrl, '');
		formik.setFieldValue(FieldNames.traditionalImageUrl, '');
		formik.setFieldValue(FieldNames.flashCardCategory, '');
		formik.setFieldValue(FieldNames.simplifiedSpeechToTextDataArray, [defaultSpeechToTextSimplified]);
		formik.setFieldValue(FieldNames.traditionalSpeechToTextDataArray, [defaultSpeechToTextTraditional]);

		// game changes start
		formik.setFieldValue(FieldNames.simplifiedGameAudioUrl, '');
		formik.setFieldValue(FieldNames.simplifiedGameImageUrl, '');
		formik.setFieldValue(FieldNames.traditionalGameImageUrl, '');
		formik.setFieldValue(FieldNames.traditionalGameAudioUrl, '');
		// game changes end

		setImageSimplifiedFlashcard('');
		setAudioSimplifiedFlashcard('');
		setImageTraditionalFlashcard('');
		setAudioTraditionalFlashcard('');

		// game changes start
		setGameAudioSimplifiedFlashcard('');
		setGameAudioTraditionalFlashcard('');
		setGameImageSimplifiedFlashcard('');
		setGameImageTraditionalFlashcard('');
		// game changes end
		setTextToSpeechCheckedFlashcard(false);
		setShowFlashCard(false);
	};

	const speechToTextValidData = textToSpeechCheckedFlashcard && formik.values.traditionalSpeechToTextDataArray[0]?.chinese.trim() && formik.values.simplifiedSpeechToTextDataArray[0]?.chinese.trim();

	const formValidDataSeasonal = formik.values.traditionalTitleEnglish?.trim() && formik.values.simplifiedTitleEnglish?.trim() && formik.values.simplifiedTitleChinese?.trim() && formik.values.traditionalTitleChinese?.trim();

	const textValidDataFlashcard = textToSpeechCheckedFlashcard ? speechToTextValidData && formValidDataSeasonal : formValidDataSeasonal;

	const hasToValidDataFlashcard = textValidDataFlashcard && imageSimplifiedFlashcard && imageTraditionalFlashcard && audioSimplifiedFlashcard && audioTraditionalFlashcard && gameAudioSimplifiedFlashcard && gameAudioTraditionalFlashcard && gameImageSimplifiedFlashcard && gameImageTraditionalFlashcard;

	const categoryIdValueFlashcard = showFlashCard ? formik.values.categoryId : '';

	const addMoreForTextFlashcard = () => {
		if (editListDataFlashcard) {
			setFlashcardList((prev) => {
				const updatedDataFlashcard = prev?.map((item) => {
					if (item.id === editListDataFlashcard?.id) {
						const updatedCommonDataFlashcard = {
							id: editListDataFlashcard.id, // Use the existing id for editing
							[FieldNames.titleSimplified]: formik.values.simplifiedTitleChinese,
							[FieldNames.simplifiedTitleEnglish]: formik.values.simplifiedTitleEnglish,
							[FieldNames.simplifiedAudioUrl]: audioSimplifiedFlashcard,
							[FieldNames.titleTraditional]: formik.values.traditionalTitleChinese,
							[FieldNames.traditionalTitleEnglish]: formik.values.traditionalTitleEnglish,
							[FieldNames.traditionalAudioUrl]: audioTraditionalFlashcard,
							...(textToSpeechCheckedFlashcard && {
								[FieldNames.textPronunciationSimplified]: formik.values.simplifiedTitleChinese,
								[FieldNames.textPronunciationTraditional]: formik.values.traditionalTitleChinese,
							}),
							[FieldNames.isTextToSpeech]: textToSpeechCheckedFlashcard,
							[FieldNames.flashCardCategory]: categoryIdValueFlashcard,
							[FieldNames.isFlashCardText]: true,
							[FieldNames.simplifiedSpeechToTextDataArray]: formik.values.simplifiedSpeechToTextDataArray,
							[FieldNames.traditionalSpeechToTextDataArray]: formik.values.traditionalSpeechToTextDataArray,
							//game changes start
							[FieldNames.simplifiedGameAudioUrl]: gameAudioSimplifiedFlashcard,
							[FieldNames.simplifiedGameImageUrl]: gameImageSimplifiedFlashcard,
							[FieldNames.traditionalGameAudioUrl]: gameAudioTraditionalFlashcard,
							[FieldNames.traditionalGameImageUrl]: gameImageTraditionalFlashcard,
							// game changes end
						};
						return { ...item, ...updatedCommonDataFlashcard };
					} else {
						return item;
					}
				});
				return updatedDataFlashcard;
			});
		} else {
			const setImageCardFlashcard = selectedFlashcards?.map((item) => {
				return {
					id: generateUuid(), // Use the existing id for editing
					[FieldNames.titleSimplified]: item.simplifiedTitleChinese,
					[FieldNames.simplifiedTitleEnglish]: item.simplifiedTitleEnglish,
					[FieldNames.simplifiedAudioUrl]: item.simplifiedAudioUrl,
					[FieldNames.titleTraditional]: item.traditionalTitleChinese,
					[FieldNames.traditionalTitleEnglish]: item.traditionalTitleEnglish,
					[FieldNames.traditionalAudioUrl]: item.traditionalAudioUrl,
					[FieldNames.textPronunciationSimplified]: item.simplifiedPronunciationText,
					[FieldNames.textPronunciationTraditional]: item.traditionalPronunciationText,
					[FieldNames.isTextToSpeech]: item.isTextToSpeech,
					[FieldNames.flashCardCategory]: item.categoryId,
					[FieldNames.isFlashCardText]: true,
					[FieldNames.simplifiedSpeechToTextDataArray]: item.simplifiedSpeechToTextDataArray,
					[FieldNames.traditionalSpeechToTextDataArray]: item.traditionalSpeechToTextDataArray,
					//game changes start
					[FieldNames.simplifiedGameAudioUrl]: item.simplifiedGameAudioUrl,
					[FieldNames.simplifiedGameImageUrl]: item.simplifiedGameImageUrl,
					[FieldNames.traditionalGameAudioUrl]: item.traditionalGameAudioUrl,
					[FieldNames.traditionalGameImageUrl]: item.traditionalGameImageUrl,
					//game changes end
				};
			});
			setFlashcardList((prev) => {
				return [...prev, ...setImageCardFlashcard];
			});
		}
	};

	const addMoreForImageFlashcard = () => {
		setFlashcardList((prev) => {
			const updatedDataFlashcard = prev?.map((item) => {
				if (item.id === editListDataFlashcard?.id) {
					const updatedCommonDataFlashcard = {
						id: editListDataFlashcard?.id, // Use the existing id for editing
						[FieldNames.titleSimplified]: formik.values.simplifiedTitleChinese,
						[FieldNames.simplifiedTitleEnglish]: formik.values.simplifiedTitleEnglish,
						[FieldNames.simplifiedAudioUrl]: audioSimplifiedFlashcard,
						[FieldNames.titleTraditional]: formik.values.traditionalTitleChinese,
						[FieldNames.traditionalTitleEnglish]: formik.values.traditionalTitleEnglish,
						[FieldNames.traditionalAudioUrl]: audioTraditionalFlashcard,
						...(textToSpeechCheckedFlashcard && {
							[FieldNames.textPronunciationSimplified]: formik.values.simplifiedTitleChinese,
							[FieldNames.textPronunciationTraditional]: formik.values.traditionalTitleChinese,
						}),
						[FieldNames.isTextToSpeech]: textToSpeechCheckedFlashcard,
						[FieldNames.flashCardCategory]: categoryIdValueFlashcard,
						[FieldNames.simplifiedImageUrl]: imageSimplifiedFlashcard,
						[FieldNames.traditionalImageUrl]: imageTraditionalFlashcard,
						[FieldNames.isFlashCardText]: false,
						[FieldNames.simplifiedSpeechToTextDataArray]: formik.values.simplifiedSpeechToTextDataArray,
						[FieldNames.traditionalSpeechToTextDataArray]: formik.values.traditionalSpeechToTextDataArray,
						// game changes start
						[FieldNames.simplifiedGameAudioUrl]: gameAudioSimplifiedFlashcard,
						[FieldNames.simplifiedGameImageUrl]: gameImageSimplifiedFlashcard,
						[FieldNames.traditionalGameAudioUrl]: gameAudioTraditionalFlashcard,
						[FieldNames.traditionalGameImageUrl]: gameImageTraditionalFlashcard,
						// game changes start
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
					[FieldNames.simplifiedAudioUrl]: audioSimplifiedFlashcard,
					...(textToSpeechCheckedFlashcard && {
						[FieldNames.textPronunciationSimplified]: formik.values.simplifiedTitleChinese,
						[FieldNames.textPronunciationTraditional]: formik.values.traditionalTitleChinese,
					}),
					[FieldNames.simplifiedTitleEnglish]: formik.values.simplifiedTitleEnglish,
					[FieldNames.titleTraditional]: formik.values.traditionalTitleChinese,
					[FieldNames.traditionalAudioUrl]: audioTraditionalFlashcard,
					[FieldNames.traditionalTitleEnglish]: formik.values.traditionalTitleEnglish,
					[FieldNames.isTextToSpeech]: textToSpeechCheckedFlashcard,
					[FieldNames.flashCardCategory]: categoryIdValueFlashcard,
					[FieldNames.traditionalImageUrl]: imageTraditionalFlashcard,
					[FieldNames.simplifiedImageUrl]: imageSimplifiedFlashcard,
					[FieldNames.isFlashCardText]: false,
					[FieldNames.simplifiedSpeechToTextDataArray]: formik.values.simplifiedSpeechToTextDataArray,
					[FieldNames.traditionalSpeechToTextDataArray]: formik.values.traditionalSpeechToTextDataArray,
					// game changes start
					[FieldNames.simplifiedGameAudioUrl]: gameAudioSimplifiedFlashcard,
					[FieldNames.simplifiedGameImageUrl]: gameImageSimplifiedFlashcard,
					[FieldNames.traditionalGameAudioUrl]: gameAudioTraditionalFlashcard,
					[FieldNames.traditionalGameImageUrl]: gameImageTraditionalFlashcard,
					// game changes end
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
			editListDataFlashcard?.isFlashCardText && resetInputManually([FieldNames.traditionalAudioUrl, FieldNames.simplifiedAudioUrl, FieldNames.simplifiedGameAudioUrl, FieldNames.simplifiedGameAudioUrl]);
		} else if (hasToValidDataFlashcard && checkedFlashcard === fileTypeEnum.image) {
			addMoreForImageFlashcard();
			resetInputManually([FieldNames.traditionalAudioUrl, FieldNames.simplifiedAudioUrl, FieldNames.simplifiedImageUrl, FieldNames.traditionalImageUrl, FieldNames.simplifiedGameAudioUrl, FieldNames.simplifiedGameImageUrl, FieldNames.traditionalGameImageUrl, FieldNames.simplifiedGameAudioUrl]);
		} else {
			checkedFlashcard === fileTypeEnum.image ? toast.error(Errors.FILL_FORM_ERROR) : toast.error('Please select at least one flash card.');
			return;
		}
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

	const traditionalSpeechToTextFlashCard = () => {
		if (formik.values.traditionalSpeechToTextDataArray.length === 1) {
			const traditionalText = formik.values.traditionalSpeechToTextDataArray[0];
			const simplifiedText = formik.values.simplifiedSpeechToTextDataArray[0];

			if (traditionalText.chinese.trim() !== '') {
				return formik.values.traditionalSpeechToTextDataArray.map((item, index) => ({
					...item,
					chinese: translateText(item.chinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
						formik.setFieldValue(`simplifiedSpeechToTextDataArray[${index}].chinese`, data ?? data);
					}),
				}));
			} else {
				return [{ [FieldNames.chinese]: simplifiedText.chinese }];
			}
		} else {
			return formik.values.traditionalSpeechToTextDataArray.map((item, index) => ({
				...item,
				chinese: translateText(item.chinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
					formik.setFieldValue(`simplifiedSpeechToTextDataArray[${index}].chinese`, data ?? data);
				}),
			}));
		}
	};

	const copyDataFlashcard = useCallback(() => {
		translateText(formik.values.traditionalTitleChinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
			// traditional to english
			formik.setFieldValue(FieldNames.titleSimplified, data ?? data);
		});
		formik.setFieldValue(FieldNames.simplifiedSpeechToTextDataArray, traditionalSpeechToTextFlashCard());
		formik.values.traditionalTitleChinese && formik.setFieldValue(FieldNames.titleSimplified, formik.values.traditionalTitleChinese);
		formik.values.traditionalTitleChinese && formik.setFieldValue(FieldNames.textPronunciationSimplified, formik.values.traditionalTitleChinese);
		if (imageTraditionalFlashcard !== '') {
			setImageSimplifiedFlashcard(imageTraditionalFlashcard);
			formik.setFieldValue(FieldNames.simplifiedImageUrl, formik.values.traditionalImageUrl);
		}
		formik.values.traditionalTitleEnglish && formik.setFieldValue(FieldNames.simplifiedTitleEnglish, formik.values.traditionalTitleEnglish);
		if (audioTraditionalFlashcard !== '') {
			formik.setFieldValue(FieldNames.simplifiedAudioUrl, formik.values.traditionalAudioUrl);
			setAudioSimplifiedFlashcard(audioTraditionalFlashcard);
		}
		if (gameImageTraditionalFlashcard !== '') {
			setGameImageSimplifiedFlashcard(gameImageTraditionalFlashcard);
			formik.setFieldValue(FieldNames.simplifiedGameImageUrl, formik.values.traditionalGameImageUrl);
		}
		if (gameAudioTraditionalFlashcard !== '') {
			formik.setFieldValue(FieldNames.simplifiedGameAudioUrl, formik.values.traditionalGameAudioUrl);
			setGameAudioSimplifiedFlashcard(gameAudioTraditionalFlashcard);
		}
		validateFormFlashcard();
	}, [formik]);

	/**
	 * Method to restrict the image dimesions
	 * @param height
	 * @param width
	 * @param fileNameFlashcard
	 * @param size
	 * @returns
	 */
	const imageDimensionHandler = (height: number, width: number, fileNameFlashcard: string, size: number) => {
		return (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION || size > MAX_GAME_IMAGE_SIZE) && (FieldNames.traditionalGameImageUrl === fileNameFlashcard || FieldNames.simplifiedGameImageUrl === fileNameFlashcard);
	};

	/**
	 * Method to restrict the audio time
	 * @param duration
	 * @param fileNameFlashcard
	 * @returns
	 */
	const audioTimeHandler = (duration: number, fileNameFlashcard: string) => {
		return duration > MAX_AUDIO_FILE_SIZE && (FieldNames.traditionalGameAudioUrl === fileNameFlashcard || FieldNames.simplifiedGameAudioUrl === fileNameFlashcard);
	};

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const fileUpdateFlashcard = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileFlashcard = event.target.files?.[0] as File;
		const fileNameFlashcard = event.target.name;
		typeValidation(fileFlashcard, type);
		const lastIndex = fileFlashcard?.name?.lastIndexOf('.');
		const extension = fileFlashcard?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileFlashcard);
			image.src = blob;
			image.addEventListener('load', () => {
				const height = image.height;
				const width = image.width;
				if (imageDimensionHandler(height, width, fileNameFlashcard, fileFlashcard.size)) {
					toast.error(`${Errors.maxGifDimensions}${' ' + MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION}.`);
					return false;
				}
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
					case FieldNames.simplifiedImageUrl:
						formik.setFieldValue(FieldNames.simplifiedImageUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setImageSimplifiedFlashcard(response);
							setLoadingFlashcard(false);
						});
						break;
					case FieldNames.traditionalImageUrl:
						formik.setFieldValue(FieldNames.traditionalImageUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingFlashcard(false);
							setImageTraditionalFlashcard(response);
						});
						break;
					// game changes start
					case FieldNames.simplifiedGameImageUrl:
						formik.setFieldValue(FieldNames.simplifiedGameImageUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setGameImageSimplifiedFlashcard(response);
							setLoadingFlashcard(false);
						});
						break;
					case FieldNames.traditionalGameImageUrl:
						formik.setFieldValue(FieldNames.traditionalGameImageUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setGameImageTraditionalFlashcard(response);
							setLoadingFlashcard(false);
						});
						break;
					// game changes end
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
				if (audioTimeHandler(audio.duration, fileNameFlashcard)) {
					toast.error(Errors.AUDIO_FILE_DURATION_MUST_LESSTHAN_OR_EQUAL_TO_4_SECONDS);
					return false;
				}
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
					case FieldNames.simplifiedAudioUrl:
						formik.setFieldValue(FieldNames.simplifiedAudioUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingFlashcard(false);
							setAudioSimplifiedFlashcard(response);
						});
						break;
					case FieldNames.traditionalAudioUrl:
						formik.setFieldValue(FieldNames.traditionalAudioUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingFlashcard(false);
							setAudioTraditionalFlashcard(response);
						});
						break;

					// game changes start
					case FieldNames.simplifiedGameAudioUrl:
						formik.setFieldValue(FieldNames.simplifiedGameAudioUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setGameAudioSimplifiedFlashcard(response);
							setLoadingFlashcard(false);
						});
						break;
					case FieldNames.traditionalGameAudioUrl:
						formik.setFieldValue(FieldNames.traditionalGameAudioUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setGameAudioTraditionalFlashcard(response);
							setLoadingFlashcard(false);
						});
						break;
					// game changes end

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
		APIService.getData(`${url}/${endPoint.flashcard}/${endPoint.list}?levelId=${params.levelId}&topicId=${params.topicId}&lessonId=${params.lessonId}`)
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

	const addMoreTraditionalSpeechToTextFlashCard = useCallback(() => {
		formik.setFieldValue(FieldNames.traditionalSpeechToTextDataArray, [...formik.values.traditionalSpeechToTextDataArray, { [FieldNames.chinese]: '' }]);
	}, [formik]);

	const addMoreSimplifiedSpeechToTextFlashCard = useCallback(() => {
		formik.setFieldValue(FieldNames.simplifiedSpeechToTextDataArray, [...formik.values.simplifiedSpeechToTextDataArray, { [FieldNames.chinese]: '' }]);
	}, [formik]);

	const traditionalFlashCardSpeechToText = useCallback(
		(arrayHelpers: MyArrayHelpers) => (
			<div>
				{formik.values.traditionalSpeechToTextDataArray?.map((_, index) => {
					const flashCardSpeechToTextTraditional = `traditionalSpeechToTextDataArray[${index}].chinese`;
					return (
						<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
							<div className='flex space-x-3 items-start'>
								<div className=' w-full'>
									<TextInput placeholder='Chinese' name={flashCardSpeechToTextTraditional} onChange={formik.handleChange} label='Chinese' value={formik.values.traditionalSpeechToTextDataArray[index].chinese} error={getIn(formik.touched, flashCardSpeechToTextTraditional) && getIn(formik.errors, flashCardSpeechToTextTraditional) ? getIn(formik.errors, flashCardSpeechToTextTraditional) : ''} required={textToSpeechCheckedFlashcard} />
								</div>
								<div className='mt-7'>
									<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.traditionalSpeechToTextDataArray.length === 1} btnDanger={true} />
								</div>
							</div>
						</div>
					);
				})}
				<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalSpeechToTextFlashCard}>
					<Plus className='mr-3' /> Add More
				</Button>
			</div>
		),
		[formik]
	);

	const simplifiedFlashCardSpeechToText = useCallback(
		(arrayHelpers: MyArrayHelpers) => (
			<div className='mb-4 col-span-2'>
				{formik.values.simplifiedSpeechToTextDataArray?.map((_, index) => {
					const flashCardSpeechToTextSimplified = `simplifiedSpeechToTextDataArray[${index}].chinese`;
					return (
						<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
							<div className='flex space-x-3 items-start'>
								<div className=' w-full'>
									<TextInput placeholder='Chinese' name={flashCardSpeechToTextSimplified} onChange={formik.handleChange} label='Chinese' value={formik.values.simplifiedSpeechToTextDataArray[index].chinese} error={getIn(formik.touched, flashCardSpeechToTextSimplified) && getIn(formik.errors, flashCardSpeechToTextSimplified) ? getIn(formik.errors, flashCardSpeechToTextSimplified) : ''} required={textToSpeechCheckedFlashcard} />
								</div>
								<div className='mt-7'>
									<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.simplifiedSpeechToTextDataArray.length === 1} btnDanger={true} />
								</div>
							</div>
						</div>
					);
				})}
				<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedSpeechToTextFlashCard}>
					<Plus className='mr-3' /> Add More
				</Button>
			</div>
		),
		[formik]
	);

	const translateTraditionalChinese = useCallback(() => {
		translateText(formik.values.traditionalTitleChinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
			// traditional to english
			formik.setFieldValue(FieldNames.traditionalTitleEnglish, data ?? data);
		});
	}, [formik]);

	return (
		<FormikProvider value={formik}>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loadingFlashcard && <Loader />}
				<div className='mb-4 w-full'>
					<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorFlashcard(FieldNames.title) as string} required />
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
											<li key={tile.activityDataId} className={`border rounded p-1 h-40 cursor-pointer relative ${selectedItemsFlashcard.includes(tile.activityDataId as string) ? 'border-primary border-2 active' : ''}`} onClick={() => changeSelectionActivityFlashcard(tile.activityDataId as string)} role='none'>
												<img src={tile.simplifiedImageUrl} alt={tile.simplifiedTitleEnglish} className='h-full w-full object-cover rounded' />
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
									<div className='flex space-x-1 items-start col-span-2 mb-4'>
										<div className='w-full'>
											<TextInput placeholder='Title Chinese' name={FieldNames.titleTraditional} onChange={formik.handleChange} label='Title Chinese' value={formik.values.traditionalTitleChinese} error={getErrorFlashcard(FieldNames.titleTraditional) as string} required />
										</div>
										<div className='mt-7'>
											<CommonButton data={null} dataHandler={translateTraditionalChinese} isTranslate={true} title='Translate' />
										</div>
										<div className='w-full'>
											<TextInput placeholder='Title English' name={FieldNames.traditionalTitleEnglish} onChange={formik.handleChange} label='Title English' value={formik.values.traditionalTitleEnglish} error={getErrorFlashcard(FieldNames.traditionalTitleEnglish) as string} required />
										</div>
									</div>
									<div className='mb-4'>
										<FileUpload labelName='Upload Audio' id={FieldNames.traditionalAudioUrl} imageSource={audioTraditionalFlashcard} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.traditionalAudioUrl} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioChangeHandlerFlashcard} error={getErrorFlashcard(FieldNames.traditionalAudioUrl) as string} />
										{!isPercentageValidFlashcard(audioTraditionalFlashcardPercentage) && <LoadingPercentage percentage={audioTraditionalFlashcardPercentage} />}
									</div>
									{checkedFlashcard === fileTypeEnum.image && (
										<div className='mb-4'>
											<FileUpload labelName='Upload Image' id={FieldNames.traditionalImageUrl} imageSource={imageTraditionalFlashcard} name={FieldNames.traditionalImageUrl} error={getErrorFlashcard(FieldNames.traditionalImageUrl) as string} acceptNote={IMAGE_NOTE} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} uploadType={FILE_TYPE.pngType} onChange={imageChangeHandlerFlashcard} />
											{!isPercentageValidFlashcard(imageTraditionalFlashcardPercentage) && <LoadingPercentage percentage={imageTraditionalFlashcardPercentage} />}
										</div>
									)}
									{/* game changes start */}
									<div className='mb-4'>
										<FileUpload labelName='Game Audio' id={FieldNames.traditionalGameAudioUrl} imageSource={gameAudioTraditionalFlashcard} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.traditionalGameAudioUrl} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioChangeHandlerFlashcard} error={getErrorFlashcard(FieldNames.traditionalGameAudioUrl) as string} />
										{!isPercentageValidFlashcard(gameAudioTraditionalFlashcardPercentage) && <LoadingPercentage percentage={gameAudioTraditionalFlashcardPercentage} />}
									</div>
									{checkedFlashcard === fileTypeEnum.image && (
										<div className='mb-4'>
											<FileUpload labelName='Game Image' id={FieldNames.traditionalGameImageUrl} imageSource={gameImageTraditionalFlashcard} name={FieldNames.traditionalGameImageUrl} error={getErrorFlashcard(FieldNames.traditionalGameImageUrl) as string} acceptNote={GAME_IMAGE_NOTE} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} uploadType={FILE_TYPE.pngType} onChange={imageChangeHandlerFlashcard} />
											{!isPercentageValidFlashcard(gameImageTraditionalFlashcardPercentage) && <LoadingPercentage percentage={gameImageTraditionalFlashcardPercentage} />}
										</div>
									)}
									{/* game changes end */}
									<div className='col-span-2'>
										<div className='font-medium'>Speech to Text {textToSpeechCheckedFlashcard && <span className='text-error'>*</span>}</div>
										<div className='p-4 rounded border bg-gray-50 mb-4'>
											<FieldArray name={FieldNames.traditionalSpeechToTextDataArray} render={traditionalFlashCardSpeechToText} />
										</div>
									</div>
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
										<TextInput placeholder='Title Chinese' name={FieldNames.titleSimplified} onChange={formik.handleChange} label='Title Chinese' value={formik.values.simplifiedTitleChinese} error={getErrorFlashcard(FieldNames.titleSimplified) as string} required />
									</div>
									<div className='mb-4'>
										<TextInput placeholder='Title English' name={FieldNames.simplifiedTitleEnglish} onChange={formik.handleChange} label='Title English' value={formik.values.simplifiedTitleEnglish} error={getErrorFlashcard(FieldNames.simplifiedTitleEnglish) as string} required />
									</div>
									<div className='mb-4'>
										<FileUpload labelName='Upload Audio' id={FieldNames.simplifiedAudioUrl} imageSource={audioSimplifiedFlashcard} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.simplifiedAudioUrl} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioChangeHandlerFlashcard} error={getErrorFlashcard(FieldNames.simplifiedAudioUrl) as string} />
										{!isPercentageValidFlashcard(audioSimplifiedFlashcardPercentage) && <LoadingPercentage percentage={audioSimplifiedFlashcardPercentage} />}
									</div>
									{checkedFlashcard === fileTypeEnum.image && (
										<div className='mb-4'>
											<FileUpload labelName='Upload Image' id={FieldNames.simplifiedImageUrl} imageSource={imageSimplifiedFlashcard} name={FieldNames.simplifiedImageUrl} error={getErrorFlashcard(FieldNames.simplifiedImageUrl) as string} acceptNote={IMAGE_NOTE} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} uploadType={FILE_TYPE.pngType} onChange={imageChangeHandlerFlashcard} />
											{!isPercentageValidFlashcard(imageSimplifiedFlashcardPercentage) && <LoadingPercentage percentage={imageSimplifiedFlashcardPercentage} />}
										</div>
									)}
									{/* game changes start */}
									<div className='mb-4'>
										<FileUpload labelName='Game Audio' id={FieldNames.simplifiedGameAudioUrl} imageSource={gameAudioSimplifiedFlashcard} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.simplifiedGameAudioUrl} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioChangeHandlerFlashcard} error={getErrorFlashcard(FieldNames.simplifiedGameAudioUrl) as string} />
										{!isPercentageValidFlashcard(gameAudioSimplifiedFlashcardPercentage) && <LoadingPercentage percentage={gameAudioSimplifiedFlashcardPercentage} />}
									</div>
									{checkedFlashcard === fileTypeEnum.image && (
										<div className='mb-4'>
											<FileUpload labelName='Game Image' id={FieldNames.simplifiedGameImageUrl} imageSource={gameImageSimplifiedFlashcard} name={FieldNames.simplifiedGameImageUrl} error={getErrorFlashcard(FieldNames.simplifiedGameImageUrl) as string} acceptNote={GAME_IMAGE_NOTE} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} uploadType={FILE_TYPE.pngType} onChange={imageChangeHandlerFlashcard} />
											{!isPercentageValidFlashcard(gameImageSimplifiedFlashcardPercentage) && <LoadingPercentage percentage={gameImageSimplifiedFlashcardPercentage} />}
										</div>
									)}
									{/* game changes end */}
									<div className='col-span-2'>
										<div className='font-medium'>Speech to Text {textToSpeechCheckedFlashcard && <span className='text-error'>*</span>}</div>
										<div className='p-4 rounded border bg-gray-50 mb-4'>
											<FieldArray name={FieldNames.simplifiedSpeechToTextDataArray} render={simplifiedFlashCardSpeechToText} />
										</div>
									</div>
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
								<th>Game Audio</th>
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
		</FormikProvider>
	);
};

export default ActivityFlashCard;
