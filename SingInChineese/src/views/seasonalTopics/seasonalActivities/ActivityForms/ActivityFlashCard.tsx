import React, { useCallback, useEffect, useState } from 'react';
import { FieldArray, getIn, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import TextInput from '@components/textInput/TextInput';
import CheckBox from '@components/checkbox/CheckBox';
import { useParams } from 'react-router-dom';
import { APIService } from '@framework/services/api';
import { FieldNames, ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { Errors } from '@config/errors';
import { AngleRight, Plus, PlusCircle } from '@components/icons';
import FileUpload from '@components/fileUpload/FileUpload';
import { IMAGE_NOTE, FILE_TYPE, fileTypeEnum, activityPaths, endPoint, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE, ENGLISH_CODE, MAX_IMAGE_DIMENSION, MAX_GAME_IMAGE_SIZE, GAME_IMAGE_NOTE, MAX_AUDIO_FILE_SIZE } from '@config/constant';
import { generateUuid, moveData, resetInputManually, translateText, typeValidation } from '@utils/helpers';
import { URL_PATHS } from '@config/variables';
import RadioButton from '@components/radiobutton/RadioButton';
import { DropdownOptionType } from 'src/types/component';
import Dropdown from '@components/dropdown/Dropdown';
import AddEditCategoryModal from '@views/flashCard/AddEditCategory';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import { Uploader } from '@views/activities/utils/upload';
import DNDFlashCard from '@views/activities/DNDFlashCard';
import { CreateFlashCardActivity, FlashCardActivitySubmitData, FlashCardTextArr, flashCardActivityList } from 'src/types/activities/flashCard';
import { AddEditSeasonalActivityData } from 'src/types/seasonalTopics';
import { MyArrayHelpers } from 'src/types/activities';
import DeleteButton from '@components/common/DeleteButton';
import { mixedNotRequired, mixedRequired, stringNoSpecialChar, stringNotRequired, stringTrim } from '@config/validations';
import CommonButton from '@components/common/CommonButton';

const SeasonalActivityFlashcard = ({ onSubmit, onClose, url, activityUuid, toggleSeasonalActivity, isMoving, topicId, lessonId }: AddEditSeasonalActivityData) => {
	const params = useParams();
	const [loadingFlashcardSeasonal, setLoadingFlashcardSeasonal] = useState<boolean>(false);
	const [flashcardSeasonalList, setFlashcardSeasonalList] = useState<flashCardActivityList[]>([]);
	const [textToSpeechCheckedFlashcardSeasonal, setTextToSpeechCheckedFlashcardSeasonal] = useState<boolean>(false);
	const [skipButtonCheckedFlashcardSeasonal, setSkipButtonCheckedFlashcardSeasonal] = useState<boolean>(false);
	const [imageSimplifiedFlashcardSeasonal, setImageSimplifiedFlashcardSeasonal] = useState<string>('');
	const [audioSimplifiedFlashcardSeasonal, setAudioSimplifiedFlashcardSeasonal] = useState<string>('');
	const [imageTraditionalFlashcardSeasonal, setImageTraditionalFlashcardSeasonal] = useState<string>('');
	const [audioTraditionalFlashcardSeasonal, setAudioTraditionalFlashcardSeasonal] = useState<string>('');
	/**  game changes start */
	const [gameImageSimplifiedFlashcardSeasonal, setGameImageSimplifiedFlashcardSeasonal] = useState<string>('');
	const [gameAudioSimplifiedFlashcardSeasonal, setGameAudioSimplifiedFlashcardSeasonal] = useState<string>('');
	const [gameAudioTraditionalFlashcardSeasonal, setGameAudioTraditionalFlashcardSeasonal] = useState<string>('');
	const [gameImageTraditionalFlashcardSeasonal, setGameImageTraditionalFlashcardSeasonal] = useState<string>('');
	/**  game changes end */
	const [imageSimplifiedFlashcardSeasonalPercentage, setImageSimplifiedFlashcardSeasonalPercentage] = useState<number>(0);
	const [audioSimplifiedFlashcardSeasonalPercentage, setAudioSimplifiedFlashcardSeasonalPercentage] = useState<number>(0);
	const [imageTraditionalFlashcardSeasonalPercentage, setImageTraditionalFlashcardSeasonalPercentage] = useState<number>(0);
	const [audioTraditionalFlashcardSeasonalPercentage, setAudioTraditionalFlashcardSeasonalPercentage] = useState<number>(0);
	/**  game changes start */
	const [gameImageSimplifiedFlashcardSeasonalPercentage, setGameImageSimplifiedFlashcardSeasonalPercentage] = useState<number>(0);
	const [gameAudioSimplifiedFlashcardSeasonalPercentage, setGameAudioSimplifiedFlashcardSeasonalPercentage] = useState<number>(0);
	const [gameAudioTraditionalFlashcardSeasonalPercentage, setGameAudioTraditionalFlashcardSeasonalPercentage] = useState<number>(0);
	const [gameImageTraditionalFlashcardSeasonalPercentage, setGameImageTraditionalFlashcardSeasonalPercentage] = useState<number>(0);
	/**  game changes end */
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

	const defaultSpeechToTextTraditional = { [FieldNames.chinese]: '' };
	const defaultSpeechToTextSimplified = { [FieldNames.chinese]: '' };

	useEffect(() => {
		if (newOrderFlashcardSeasonal) {
			setFlashcardSeasonalList(newOrderFlashcardSeasonal);
		}
	}, [newOrderFlashcardSeasonal]);

	const updatePercentage = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.simplifiedAudioUrl:
				setAudioSimplifiedFlashcardSeasonalPercentage(newPercentage);
				break;
			case FieldNames.traditionalAudioUrl:
				setAudioTraditionalFlashcardSeasonalPercentage(newPercentage);
				break;
			case FieldNames.simplifiedImageUrl:
				setImageSimplifiedFlashcardSeasonalPercentage(newPercentage);
				break;
			case FieldNames.traditionalImageUrl:
				setImageTraditionalFlashcardSeasonalPercentage(newPercentage);
				break;
			//game changes start
			case FieldNames.simplifiedGameAudioUrl:
				setGameAudioSimplifiedFlashcardSeasonalPercentage(newPercentage);
				break;
			case FieldNames.traditionalGameAudioUrl:
				setGameAudioTraditionalFlashcardSeasonalPercentage(newPercentage);
				break;
			case FieldNames.simplifiedGameImageUrl:
				setGameImageSimplifiedFlashcardSeasonalPercentage(newPercentage);
				break;
			case FieldNames.traditionalGameImageUrl:
				setGameImageTraditionalFlashcardSeasonalPercentage(newPercentage);
				break;
			//game changes end
			default:
				break;
		}
	};

	const isPercentageValidFlashcardSeasonal = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdateFlashcardSeasonal = !(isPercentageValidFlashcardSeasonal(imageSimplifiedFlashcardSeasonalPercentage) && isPercentageValidFlashcardSeasonal(imageTraditionalFlashcardSeasonalPercentage) && isPercentageValidFlashcardSeasonal(audioSimplifiedFlashcardSeasonalPercentage) && isPercentageValidFlashcardSeasonal(audioTraditionalFlashcardSeasonalPercentage));

	const getCategoriesListFlashcardSeasonal = useCallback(() => {
		APIService.getData(`${URL_PATHS.flashCardCategories}/all/${endPoint.list}`)
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

	/** Method used to check isFlashCardText type  */
	const conditionFunIsFlashCardText = (editListData: flashCardActivityList) => {
		if (editListData.isFlashCardText) {
			setCheckedFlashcardSeasonal(fileTypeEnum.text);
		} else {
			if (editListData.simplifiedImageUrl) {
				setImageSimplifiedFlashcardSeasonal(editListData?.simplifiedImageUrl);
			}
			if (editListData.traditionalImageUrl) {
				editListData.traditionalImageUrl && setImageTraditionalFlashcardSeasonal(editListData?.traditionalImageUrl);
			}
			// game changes start
			if (editListData.traditionalGameImageUrl) {
				setGameImageTraditionalFlashcardSeasonal(editListData?.traditionalGameImageUrl);
			}
			if (editListData.simplifiedGameImageUrl) {
				setGameImageSimplifiedFlashcardSeasonal(editListData?.simplifiedGameImageUrl);
			}
			// game changes end
			setCheckedFlashcardSeasonal(fileTypeEnum.image);
		}
	};

	/**
	 * Method is used to set the fields if User click edit data
	 */
	useEffect(() => {
		if (editListDataFlashcardSeasonal) {
			conditionFunIsFlashCardText(editListDataFlashcardSeasonal);

			setAudioSimplifiedFlashcardSeasonal(editListDataFlashcardSeasonal?.simplifiedAudioUrl);
			setAudioTraditionalFlashcardSeasonal(editListDataFlashcardSeasonal?.traditionalAudioUrl);
			setTextToSpeechCheckedFlashcardSeasonal(editListDataFlashcardSeasonal?.isTextToSpeech);

			// game changes start
			setGameAudioSimplifiedFlashcardSeasonal(editListDataFlashcardSeasonal?.simplifiedGameAudioUrl);
			setGameAudioTraditionalFlashcardSeasonal(editListDataFlashcardSeasonal?.traditionalGameAudioUrl);
			// game changes end

			formik.setFieldValue(FieldNames.titleSimplified, editListDataFlashcardSeasonal?.simplifiedTitleChinese);
			formik.setFieldValue(FieldNames.simplifiedTitleEnglish, editListDataFlashcardSeasonal?.simplifiedTitleEnglish);
			formik.setFieldValue(FieldNames.textPronunciationSimplified, editListDataFlashcardSeasonal?.simplifiedTitleChinese);
			formik.setFieldValue(FieldNames.titleTraditional, editListDataFlashcardSeasonal?.traditionalTitleChinese);

			formik.setFieldValue(FieldNames.traditionalTitleEnglish, editListDataFlashcardSeasonal?.traditionalTitleEnglish);
			formik.setFieldValue(FieldNames.textPronunciationTraditional, editListDataFlashcardSeasonal?.traditionalTitleChinese);
			formik.setFieldValue(FieldNames.flashCardCategory, editListDataFlashcardSeasonal?.categoryId);
			editListDataFlashcardSeasonal?.categoryId && setShowFlashCardSeasonal(true);
			formik.setFieldValue(FieldNames.simplifiedSpeechToTextDataArray, editListDataFlashcardSeasonal?.simplifiedSpeechToTextDataArray ?? [defaultSpeechToTextSimplified]);
			formik.setFieldValue(FieldNames.traditionalSpeechToTextDataArray, editListDataFlashcardSeasonal?.traditionalSpeechToTextDataArray ?? [defaultSpeechToTextTraditional]);
		}
	}, [editListDataFlashcardSeasonal]);

	useEffect(() => {
		if (params.activityId) {
			setLoadingFlashcardSeasonal(true);
			APIService.getData(`${url}/${activityPaths.flashCard}/${params.activityId}?${activityPaths.isForSeasonal}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const toggle = response.data.data.toggle;
						toggleSeasonalActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);
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
		[FieldNames.simplifiedImageUrl]: null,
		[FieldNames.traditionalImageUrl]: null,
		[FieldNames.simplifiedAudioUrl]: null,
		[FieldNames.traditionalAudioUrl]: null,
		[FieldNames.titleSimplified]: '',
		[FieldNames.titleTraditional]: '',
		[FieldNames.simplifiedTitleEnglish]: '',
		[FieldNames.traditionalTitleEnglish]: '',
		[FieldNames.textPronunciationSimplified]: '',
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
	/** method that check the condition and return validation schema */
	const conditionCheckerSeasonal = (cardList: flashCardActivityList[], flashCard: string, errorMessage: string) => {
		return cardList?.length || flashCard.length ? mixedNotRequired() : mixedRequired(errorMessage);
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit questions
	 */
	const getObjFlashcardSeasonal = () => {
		const titleError = flashcardSeasonalList.length ? stringNotRequired() : stringTrim(Errors.PLEASE_ENTER_TITLE);
		const speechToTextError = textToSpeechCheckedFlashcardSeasonal ? stringTrim(Errors.PLEASE_ENTER_TEXT) : stringNotRequired();
		const objFlashcardSeasonal: ObjectShape =
			checkedFlashcardSeasonal === fileTypeEnum.image
				? {
						[FieldNames.simplifiedImageUrl]: conditionCheckerSeasonal(flashcardSeasonalList, imageSimplifiedFlashcardSeasonal, Errors.PLEASE_SELECT_IMAGE),
						[FieldNames.simplifiedAudioUrl]: conditionCheckerSeasonal(flashcardSeasonalList, audioSimplifiedFlashcardSeasonal, Errors.PLEASE_SELECT_AUDIO),
						[FieldNames.titleSimplified]: titleError,
						[FieldNames.traditionalImageUrl]: conditionCheckerSeasonal(flashcardSeasonalList, imageTraditionalFlashcardSeasonal, Errors.PLEASE_SELECT_IMAGE),
						[FieldNames.traditionalAudioUrl]: conditionCheckerSeasonal(flashcardSeasonalList, audioTraditionalFlashcardSeasonal, Errors.PLEASE_SELECT_AUDIO),

						// game changes start
						[FieldNames.traditionalGameImageUrl]: conditionCheckerSeasonal(flashcardSeasonalList, gameImageTraditionalFlashcardSeasonal, Errors.PLEASE_SELECT_IMAGE),
						[FieldNames.traditionalGameAudioUrl]: conditionCheckerSeasonal(flashcardSeasonalList, gameAudioTraditionalFlashcardSeasonal, Errors.PLEASE_SELECT_AUDIO),
						[FieldNames.simplifiedGameImageUrl]: conditionCheckerSeasonal(flashcardSeasonalList, gameImageSimplifiedFlashcardSeasonal, Errors.PLEASE_SELECT_IMAGE),
						[FieldNames.simplifiedGameAudioUrl]: conditionCheckerSeasonal(flashcardSeasonalList, gameAudioSimplifiedFlashcardSeasonal, Errors.PLEASE_SELECT_AUDIO),
						// game changes  end

						[FieldNames.titleTraditional]: titleError,
						[FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
						[FieldNames.traditionalTitleEnglish]: titleError,
						[FieldNames.simplifiedTitleEnglish]: titleError,
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
			if (flashcardSeasonalList.length) {
				const commonSubmitDataFlashcardSeasonal: FlashCardActivitySubmitData = {
					isMoving: isMoving,
					topicId: moveData(isMoving, topicId as string, params.topicId as string),
					lessonId: moveData(isMoving, lessonId as string, params.lessonId as string),
					activityTypeId: activityUuid,
					title: values.title.trim(),
					isSkippable: skipButtonCheckedFlashcardSeasonal,
					activityData: flashcardSeasonalList.map(({ traditionalImageUrl, id, simplifiedImageUrl, ...item }) => ({
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
					isForSeasonal: true,
				};
				if (params.activityId) {
					setLoadingFlashcardSeasonal(true);
					APIService.putData(`${url}/${activityPaths.flashCard}/${params.activityId}`, {
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
					APIService.postData(`${url}/${activityPaths.flashCard}`, {
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
		formik.setFieldValue(FieldNames.titleTraditional, '');
		formik.setFieldValue(FieldNames.titleSimplified, '');
		formik.setFieldValue(FieldNames.traditionalTitleEnglish, '');
		formik.setFieldValue(FieldNames.simplifiedTitleEnglish, '');
		formik.setFieldValue(FieldNames.textPronunciationTraditional, '');
		formik.setFieldValue(FieldNames.textPronunciationSimplified, '');
		formik.setFieldValue(FieldNames.traditionalAudioUrl, '');
		formik.setFieldValue(FieldNames.simplifiedAudioUrl, '');
		formik.setFieldValue(FieldNames.traditionalImageUrl, '');
		formik.setFieldValue(FieldNames.simplifiedImageUrl, '');

		// game changes start
		formik.setFieldValue(FieldNames.simplifiedGameAudioUrl, '');
		formik.setFieldValue(FieldNames.simplifiedGameImageUrl, '');
		formik.setFieldValue(FieldNames.traditionalGameImageUrl, '');
		formik.setFieldValue(FieldNames.traditionalGameAudioUrl, '');
		// game changes end

		formik.setFieldValue(FieldNames.flashCardCategory, '');
		formik.setFieldValue(FieldNames.traditionalSpeechToTextDataArray, [defaultSpeechToTextTraditional]);
		formik.setFieldValue(FieldNames.simplifiedSpeechToTextDataArray, [defaultSpeechToTextSimplified]);
		setImageTraditionalFlashcardSeasonal('');
		setImageSimplifiedFlashcardSeasonal('');
		setAudioTraditionalFlashcardSeasonal('');
		setAudioSimplifiedFlashcardSeasonal('');
		setTextToSpeechCheckedFlashcardSeasonal(false);
		setShowFlashCardSeasonal(false);

		// game changes start
		setGameAudioSimplifiedFlashcardSeasonal('');
		setGameAudioTraditionalFlashcardSeasonal('');
		setGameImageSimplifiedFlashcardSeasonal('');
		setGameImageTraditionalFlashcardSeasonal('');
		// game changes end
	};

	const speechToTextValidData = textToSpeechCheckedFlashcardSeasonal && formik.values.traditionalSpeechToTextDataArray[0]?.chinese.trim() && formik.values.simplifiedSpeechToTextDataArray[0]?.chinese.trim();

	const formValidData = formik.values.traditionalTitleEnglish?.trim() && formik.values.simplifiedTitleEnglish?.trim() && formik.values.simplifiedTitleChinese?.trim() && formik.values.traditionalTitleChinese?.trim();

	const textValidDataFlashcardSeasonal = textToSpeechCheckedFlashcardSeasonal ? speechToTextValidData && formValidData : formValidData;

	const hasToValidDataFlashcardSeasonal = textValidDataFlashcardSeasonal && imageSimplifiedFlashcardSeasonal && imageTraditionalFlashcardSeasonal && audioSimplifiedFlashcardSeasonal && audioTraditionalFlashcardSeasonal && gameAudioSimplifiedFlashcardSeasonal && gameAudioTraditionalFlashcardSeasonal && gameImageSimplifiedFlashcardSeasonal && gameImageTraditionalFlashcardSeasonal;

	const categoryIdValueFlashcardSeasonal = showFlashCardSeasonal ? formik.values.categoryId : '';

	const addMoreForTextFlashcardSeasonal = () => {
		if (editListDataFlashcardSeasonal) {
			setFlashcardSeasonalList((prev) => {
				const updatedDataFlashcardSeasonal = prev?.map((item) => {
					if (item.id === editListDataFlashcardSeasonal?.id) {
						const updatedCommonDataFlashcardSeasonal = {
							id: editListDataFlashcardSeasonal.id, // Use the existing id for editing
							[FieldNames.titleSimplified]: formik.values.simplifiedTitleChinese,
							[FieldNames.simplifiedTitleEnglish]: formik.values.simplifiedTitleEnglish,
							[FieldNames.simplifiedAudioUrl]: audioSimplifiedFlashcardSeasonal,
							[FieldNames.titleTraditional]: formik.values.traditionalTitleChinese,
							[FieldNames.traditionalTitleEnglish]: formik.values.traditionalTitleEnglish,
							[FieldNames.traditionalAudioUrl]: audioTraditionalFlashcardSeasonal,
							...(textToSpeechCheckedFlashcardSeasonal && {
								[FieldNames.textPronunciationSimplified]: formik.values.simplifiedTitleChinese,
								[FieldNames.textPronunciationTraditional]: formik.values.traditionalTitleChinese,
							}),
							[FieldNames.isTextToSpeech]: textToSpeechCheckedFlashcardSeasonal,
							[FieldNames.flashCardCategory]: categoryIdValueFlashcardSeasonal,
							[FieldNames.isFlashCardText]: true,
							[FieldNames.simplifiedSpeechToTextDataArray]: formik.values.simplifiedSpeechToTextDataArray,
							[FieldNames.traditionalSpeechToTextDataArray]: formik.values.traditionalSpeechToTextDataArray,
							//game changes start
							[FieldNames.simplifiedGameAudioUrl]: gameAudioSimplifiedFlashcardSeasonal,
							[FieldNames.simplifiedGameImageUrl]: gameImageSimplifiedFlashcardSeasonal,
							[FieldNames.traditionalGameAudioUrl]: gameAudioTraditionalFlashcardSeasonal,
							[FieldNames.traditionalGameImageUrl]: gameImageTraditionalFlashcardSeasonal,
							//game changes end
						};
						return { ...item, ...updatedCommonDataFlashcardSeasonal };
					} else {
						return item;
					}
				});
				return updatedDataFlashcardSeasonal;
			});
		} else {
			const setImageCardFlashcardSeasonal = selectedFlashcardSeasonal?.map((item) => {
				return {
					id: generateUuid(),
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
			setFlashcardSeasonalList((prev) => {
				return [...prev, ...setImageCardFlashcardSeasonal];
			});
		}
	};

	const addMoreForImageFlashcardSeasonal = () => {
		setFlashcardSeasonalList((prev) => {
			const updatedDataFlashcardSeasonal = prev?.map((item) => {
				if (item.id === editListDataFlashcardSeasonal?.id) {
					const updatedCommonDataFlashcardSeasonal = {
						id: editListDataFlashcardSeasonal?.id, // Use the existing id for editing
						[FieldNames.titleSimplified]: formik.values.simplifiedTitleChinese,
						[FieldNames.simplifiedTitleEnglish]: formik.values.simplifiedTitleEnglish,
						[FieldNames.simplifiedAudioUrl]: audioSimplifiedFlashcardSeasonal,
						[FieldNames.titleTraditional]: formik.values.traditionalTitleChinese,
						[FieldNames.traditionalTitleEnglish]: formik.values.traditionalTitleEnglish,
						[FieldNames.traditionalAudioUrl]: audioTraditionalFlashcardSeasonal,
						...(textToSpeechCheckedFlashcardSeasonal && {
							[FieldNames.textPronunciationSimplified]: formik.values.simplifiedTitleChinese,
							[FieldNames.textPronunciationTraditional]: formik.values.traditionalTitleChinese,
						}),
						[FieldNames.isTextToSpeech]: textToSpeechCheckedFlashcardSeasonal,
						[FieldNames.flashCardCategory]: categoryIdValueFlashcardSeasonal,
						[FieldNames.simplifiedImageUrl]: imageSimplifiedFlashcardSeasonal,
						[FieldNames.traditionalImageUrl]: imageTraditionalFlashcardSeasonal,
						[FieldNames.isFlashCardText]: false,
						[FieldNames.simplifiedSpeechToTextDataArray]: formik.values.simplifiedSpeechToTextDataArray,
						[FieldNames.traditionalSpeechToTextDataArray]: formik.values.traditionalSpeechToTextDataArray,
						// game changes start
						[FieldNames.simplifiedGameAudioUrl]: gameAudioSimplifiedFlashcardSeasonal,
						[FieldNames.simplifiedGameImageUrl]: gameImageSimplifiedFlashcardSeasonal,
						[FieldNames.traditionalGameAudioUrl]: gameAudioTraditionalFlashcardSeasonal,
						[FieldNames.traditionalGameImageUrl]: gameImageTraditionalFlashcardSeasonal,
						// game changes start
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
					[FieldNames.simplifiedAudioUrl]: audioSimplifiedFlashcardSeasonal,
					...(textToSpeechCheckedFlashcardSeasonal && {
						[FieldNames.textPronunciationSimplified]: formik.values.simplifiedTitleChinese,
						[FieldNames.textPronunciationTraditional]: formik.values.traditionalTitleChinese,
					}),
					[FieldNames.simplifiedTitleEnglish]: formik.values.simplifiedTitleEnglish,
					[FieldNames.titleTraditional]: formik.values.traditionalTitleChinese,
					[FieldNames.traditionalAudioUrl]: audioTraditionalFlashcardSeasonal,
					[FieldNames.traditionalTitleEnglish]: formik.values.traditionalTitleEnglish,
					[FieldNames.isTextToSpeech]: textToSpeechCheckedFlashcardSeasonal,
					[FieldNames.flashCardCategory]: categoryIdValueFlashcardSeasonal,
					[FieldNames.traditionalImageUrl]: imageTraditionalFlashcardSeasonal,
					[FieldNames.simplifiedImageUrl]: imageSimplifiedFlashcardSeasonal,
					[FieldNames.isFlashCardText]: false,
					[FieldNames.simplifiedSpeechToTextDataArray]: formik.values.simplifiedSpeechToTextDataArray,
					[FieldNames.traditionalSpeechToTextDataArray]: formik.values.traditionalSpeechToTextDataArray,
					// game changes start
					[FieldNames.simplifiedGameAudioUrl]: gameAudioSimplifiedFlashcardSeasonal,
					[FieldNames.simplifiedGameImageUrl]: gameImageSimplifiedFlashcardSeasonal,
					[FieldNames.traditionalGameAudioUrl]: gameAudioTraditionalFlashcardSeasonal,
					[FieldNames.traditionalGameImageUrl]: gameImageTraditionalFlashcardSeasonal,
					// game changes end
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
			editListDataFlashcardSeasonal?.isFlashCardText && resetInputManually([FieldNames.traditionalAudioUrl, FieldNames.simplifiedAudioUrl, FieldNames.simplifiedGameAudioUrl, FieldNames.simplifiedGameAudioUrl]);
		} else if (hasToValidDataFlashcardSeasonal && checkedFlashcardSeasonal === fileTypeEnum.image) {
			addMoreForImageFlashcardSeasonal();
			resetInputManually([FieldNames.traditionalAudioUrl, FieldNames.simplifiedAudioUrl, FieldNames.simplifiedImageUrl, FieldNames.traditionalImageUrl, FieldNames.simplifiedGameAudioUrl, FieldNames.simplifiedGameImageUrl, FieldNames.traditionalGameImageUrl, FieldNames.simplifiedGameAudioUrl]);
		} else {
			checkedFlashcardSeasonal === fileTypeEnum.image ? toast.error(Errors.FILL_FORM_ERROR) : toast.error('Please select at least one flash card.');
			return;
		}
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

	const traditionalSpeechToTextFlashCardSeasonal = () => {
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

	const copyDataFlashcardSeasonal = useCallback(() => {
		translateText(formik.values.traditionalTitleChinese, SIMPLIFIED_CHINESE_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
			// traditional to english
			formik.setFieldValue(FieldNames.titleSimplified, data ?? data);
		});
		formik.setFieldValue(FieldNames.simplifiedSpeechToTextDataArray, traditionalSpeechToTextFlashCardSeasonal());
		formik.values.traditionalTitleChinese && formik.setFieldValue(FieldNames.titleSimplified, formik.values.traditionalTitleChinese);
		formik.values.traditionalTitleChinese && formik.setFieldValue(FieldNames.textPronunciationSimplified, formik.values.traditionalTitleChinese);
		if (imageTraditionalFlashcardSeasonal !== '') {
			setImageSimplifiedFlashcardSeasonal(imageTraditionalFlashcardSeasonal);
			formik.setFieldValue(FieldNames.simplifiedImageUrl, formik.values.traditionalImageUrl);
		}
		formik.values.traditionalTitleEnglish && formik.setFieldValue(FieldNames.simplifiedTitleEnglish, formik.values.traditionalTitleEnglish);
		if (audioTraditionalFlashcardSeasonal !== '') {
			formik.setFieldValue(FieldNames.simplifiedAudioUrl, formik.values.traditionalAudioUrl);
			setAudioSimplifiedFlashcardSeasonal(audioTraditionalFlashcardSeasonal);
		}
		// game changes start
		if (gameImageTraditionalFlashcardSeasonal !== '') {
			setGameImageSimplifiedFlashcardSeasonal(gameImageTraditionalFlashcardSeasonal);
			formik.setFieldValue(FieldNames.simplifiedGameImageUrl, formik.values.traditionalGameImageUrl);
		}
		if (gameAudioTraditionalFlashcardSeasonal !== '') {
			formik.setFieldValue(FieldNames.simplifiedGameAudioUrl, formik.values.traditionalGameAudioUrl);
			setGameAudioSimplifiedFlashcardSeasonal(gameAudioTraditionalFlashcardSeasonal);
		}
		// game changes end
		validateFormFlashcardSeasonal();
	}, [formik]);

	/**
	 * Method to restrict the image dimesions
	 * @param height
	 * @param width
	 * @param fileNameFlashcard
	 * @param size
	 * @returns
	 */
	const imageDimensionHandlerSeasonal = (height: number, width: number, fileNameFlashcardSeasonal: string, size: number) => {
		return (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION || size > MAX_GAME_IMAGE_SIZE) && (FieldNames.traditionalGameImageUrl === fileNameFlashcardSeasonal || FieldNames.simplifiedGameImageUrl === fileNameFlashcardSeasonal);
	};

	/**
	 * Method to restrict the audio time
	 * @param duration
	 * @param fileNameFlashcardSeasonal
	 * @returns
	 */
	const audioTimeHandlerSeasonal = (duration: number, fileNameFlashcardSeasonal: string) => {
		return duration > MAX_AUDIO_FILE_SIZE && (FieldNames.traditionalGameAudioUrl === fileNameFlashcardSeasonal || FieldNames.simplifiedGameAudioUrl === fileNameFlashcardSeasonal);
	};
	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const fileUpdateFlashcardSeasonal = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const fileFlashcardSeasonal = event.target.files?.[0] as File;
		const fileNameFlashcardSeasonal = event.target.name;
		typeValidation(fileFlashcardSeasonal, type);
		const lastIndex = fileFlashcardSeasonal?.name?.lastIndexOf('.');
		const extension = fileFlashcardSeasonal?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (type === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileFlashcardSeasonal);
			image.src = blob;
			image.addEventListener('load', () => {
				const height = image.height;
				const width = image.width;
				if (imageDimensionHandlerSeasonal(height, width, fileNameFlashcardSeasonal, fileFlashcardSeasonal.size)) {
					toast.error(`${Errors.maxGifDimensions}${' ' + MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION}.`);
					return false;
				}
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
					case FieldNames.simplifiedImageUrl:
						formik.setFieldValue(FieldNames.simplifiedImageUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setImageSimplifiedFlashcardSeasonal(response);
							setLoadingFlashcardSeasonal(false);
						});
						break;
					case FieldNames.traditionalImageUrl:
						formik.setFieldValue(FieldNames.traditionalImageUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingFlashcardSeasonal(false);
							setImageTraditionalFlashcardSeasonal(response);
						});
						break;
					// game changes start
					case FieldNames.simplifiedGameImageUrl:
						formik.setFieldValue(FieldNames.simplifiedGameImageUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setGameImageSimplifiedFlashcardSeasonal(response);
							setLoadingFlashcardSeasonal(false);
						});
						break;
					case FieldNames.traditionalGameImageUrl:
						formik.setFieldValue(FieldNames.traditionalGameImageUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setGameImageTraditionalFlashcardSeasonal(response);
							setLoadingFlashcardSeasonal(false);
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
			const blob = URL.createObjectURL(fileFlashcardSeasonal);
			audio.src = blob;
			audio.addEventListener('loadedmetadata', () => {
				if (audioTimeHandlerSeasonal(audio.duration, fileNameFlashcardSeasonal)) {
					toast.error(Errors.AUDIO_FILE_DURATION_MUST_LESSTHAN_OR_EQUAL_TO_4_SECONDS);
					return false;
				}
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
					case FieldNames.simplifiedAudioUrl:
						formik.setFieldValue(FieldNames.simplifiedAudioUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingFlashcardSeasonal(false);
							setAudioSimplifiedFlashcardSeasonal(response);
						});
						break;
					case FieldNames.traditionalAudioUrl:
						formik.setFieldValue(FieldNames.traditionalAudioUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setLoadingFlashcardSeasonal(false);
							setAudioTraditionalFlashcardSeasonal(response);
						});
						break;

					// game changes start
					case FieldNames.simplifiedGameAudioUrl:
						formik.setFieldValue(FieldNames.simplifiedGameAudioUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setGameAudioSimplifiedFlashcardSeasonal(response);
							setLoadingFlashcardSeasonal(false);
						});
						break;
					case FieldNames.traditionalGameAudioUrl:
						formik.setFieldValue(FieldNames.traditionalGameAudioUrl, uploader.fileName);
						uploader.onComplete((response: string) => {
							setGameAudioTraditionalFlashcardSeasonal(response);
							setLoadingFlashcardSeasonal(false);
						});
						break;
					// game changes end
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
		APIService.getData(`${url}/${endPoint.flashcard}/${endPoint.list}?topicId=${params.topicId}&lessonId=${params.lessonId}`)
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

	const addMoreTraditionalSpeechToTextFlashCardSeasonal = useCallback(() => {
		formik.setFieldValue(FieldNames.traditionalSpeechToTextDataArray, [...formik.values.traditionalSpeechToTextDataArray, { [FieldNames.chinese]: '' }]);
	}, [formik]);

	const addMoreSimplifiedSpeechToTextFlashCardSeasonal = useCallback(() => {
		formik.setFieldValue(FieldNames.simplifiedSpeechToTextDataArray, [...formik.values.simplifiedSpeechToTextDataArray, { [FieldNames.chinese]: '' }]);
	}, [formik]);

	const traditionalFlashCardSpeechToTextSeasonal = useCallback(
		(arrayHelpers: MyArrayHelpers) => (
			<div>
				{formik.values.traditionalSpeechToTextDataArray?.map((_, index) => {
					const flashCardSpeechToTextTraditional = `traditionalSpeechToTextDataArray[${index}].chinese`;
					return (
						<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
							<div className='flex space-x-3 items-start'>
								<div className=' w-full'>
									<TextInput placeholder='Chinese' name={flashCardSpeechToTextTraditional} onChange={formik.handleChange} label='Chinese' value={formik.values.traditionalSpeechToTextDataArray[index].chinese} error={getIn(formik.touched, flashCardSpeechToTextTraditional) && getIn(formik.errors, flashCardSpeechToTextTraditional) ? getIn(formik.errors, flashCardSpeechToTextTraditional) : ''} required={textToSpeechCheckedFlashcardSeasonal} />
								</div>
								<div className='mt-7'>
									<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.traditionalSpeechToTextDataArray.length === 1} btnDanger={true} />
								</div>
							</div>
						</div>
					);
				})}
				<Button className='btn-primary h-[38px] mt-3' onClick={addMoreTraditionalSpeechToTextFlashCardSeasonal}>
					<Plus className='mr-3' /> Add More
				</Button>
			</div>
		),
		[formik]
	);

	const simplifiedFlashCardSpeechToTextSeasonal = useCallback(
		(arrayHelpers: MyArrayHelpers) => (
			<div className='mb-4 col-span-2'>
				{formik.values.simplifiedSpeechToTextDataArray?.map((_, index) => {
					const flashCardSpeechToTextSimplified = `simplifiedSpeechToTextDataArray[${index}].chinese`;
					return (
						<div key={`${index + 1}`} className='bg-gray-100 rounded border mb-1 p-1 '>
							<div className='flex space-x-3 items-start'>
								<div className=' w-full'>
									<TextInput placeholder='Chinese' name={flashCardSpeechToTextSimplified} onChange={formik.handleChange} label='Chinese' value={formik.values.simplifiedSpeechToTextDataArray[index].chinese} error={getIn(formik.touched, flashCardSpeechToTextSimplified) && getIn(formik.errors, flashCardSpeechToTextSimplified) ? getIn(formik.errors, flashCardSpeechToTextSimplified) : ''} required={textToSpeechCheckedFlashcardSeasonal} />
								</div>
								<div className='mt-7'>
									<DeleteButton data={index} isDeleteStatusModal={arrayHelpers.remove} disable={formik.values.simplifiedSpeechToTextDataArray.length === 1} btnDanger={true} />
								</div>
							</div>
						</div>
					);
				})}
				<Button className='btn-primary h-[38px] mt-3' onClick={addMoreSimplifiedSpeechToTextFlashCardSeasonal}>
					<Plus className='mr-3' /> Add More
				</Button>
			</div>
		),
		[formik]
	);

	const translateTraditionalChineseSeasonal = useCallback(() => {
		translateText(formik.values.traditionalTitleChinese, ENGLISH_CODE, TRADITIONAL_CHINESE_CODE).then((data) => {
			// traditional to english
			formik.setFieldValue(FieldNames.traditionalTitleEnglish, data ?? data);
		});
	}, [formik]);

	return (
		<FormikProvider value={formik}>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loadingFlashcardSeasonal && <Loader />}
				<div className='mb-4 w-full'>
					<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={getErrorFlashcardSeasonal(FieldNames.title) as string} required />
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
											<li key={tile.activityDataId} className={`border rounded p-1 h-40 cursor-pointer relative ${selectedItemsFlashcardSeasonal.includes(tile.activityDataId as string) ? 'border-primary border-2 active' : ''}`} onClick={() => changeSelectionActivityFlashcardSeasonal(tile.activityDataId as string)} role='none'>
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
				{showFormFlashcardSeasonal && (
					<>
						<div className='flex flex-col md:flex-row gap-3 mb-4'>
							<div className='rounded border w-full'>
								<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Traditional Chinese</h6>
								<div className='grid grid-cols-2 gap-x-4 p-3'>
									<div className='flex space-x-1 items-start col-span-2'>
										<div className='w-full'>
											<TextInput placeholder='Title Chinese' name={FieldNames.titleTraditional} onChange={formik.handleChange} label='Title Chinese' value={formik.values.traditionalTitleChinese} error={getErrorFlashcardSeasonal(FieldNames.titleTraditional) as string} required />
										</div>
										<div className='mt-7'>
											<CommonButton data={null} dataHandler={translateTraditionalChineseSeasonal} isTranslate={true} title='Translate' />
										</div>
										<div className='w-full'>
											<TextInput placeholder='Title English' name={FieldNames.traditionalTitleEnglish} onChange={formik.handleChange} label='Title English' value={formik.values.traditionalTitleEnglish} error={getErrorFlashcardSeasonal(FieldNames.traditionalTitleEnglish) as string} required />
										</div>
									</div>
									<div className='mb-4'>
										<FileUpload labelName='Upload Audio' id={FieldNames.traditionalAudioUrl} imageSource={audioTraditionalFlashcardSeasonal} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.traditionalAudioUrl} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioChangeHandlerFlashcardSeasonal} error={getErrorFlashcardSeasonal(FieldNames.traditionalAudioUrl) as string} />
										{!isPercentageValidFlashcardSeasonal(audioTraditionalFlashcardSeasonalPercentage) && <LoadingPercentage percentage={audioTraditionalFlashcardSeasonalPercentage} />}
									</div>
									{checkedFlashcardSeasonal === fileTypeEnum.image && (
										<div className='mb-4'>
											<FileUpload labelName='Upload Image' id={FieldNames.traditionalImageUrl} imageSource={imageTraditionalFlashcardSeasonal} name={FieldNames.traditionalImageUrl} error={getErrorFlashcardSeasonal(FieldNames.traditionalImageUrl) as string} acceptNote={IMAGE_NOTE} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} uploadType={FILE_TYPE.pngType} onChange={imageChangeHandlerFlashcardSeasonal} />
											{!isPercentageValidFlashcardSeasonal(imageTraditionalFlashcardSeasonalPercentage) && <LoadingPercentage percentage={imageTraditionalFlashcardSeasonalPercentage} />}
										</div>
									)}
									{/* game changes start */}
									<div className='mb-4'>
										<FileUpload labelName='Game Audio' id={FieldNames.traditionalGameAudioUrl} imageSource={gameAudioTraditionalFlashcardSeasonal} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.traditionalGameAudioUrl} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioChangeHandlerFlashcardSeasonal} error={getErrorFlashcardSeasonal(FieldNames.traditionalGameAudioUrl) as string} />
										{!isPercentageValidFlashcardSeasonal(gameAudioTraditionalFlashcardSeasonalPercentage) && <LoadingPercentage percentage={gameAudioTraditionalFlashcardSeasonalPercentage} />}
									</div>
									{checkedFlashcardSeasonal === fileTypeEnum.image && (
										<div className='mb-4'>
											<FileUpload labelName='Game Image' id={FieldNames.traditionalGameImageUrl} imageSource={gameImageTraditionalFlashcardSeasonal} name={FieldNames.traditionalGameImageUrl} error={getErrorFlashcardSeasonal(FieldNames.traditionalGameImageUrl) as string} acceptNote={GAME_IMAGE_NOTE} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} uploadType={FILE_TYPE.pngType} onChange={imageChangeHandlerFlashcardSeasonal} />
											{!isPercentageValidFlashcardSeasonal(gameImageTraditionalFlashcardSeasonalPercentage) && <LoadingPercentage percentage={gameImageTraditionalFlashcardSeasonalPercentage} />}
										</div>
									)}
									{/* game changes end */}
									<div className='col-span-2'>
										<div className='font-medium'>Speech to Text {textToSpeechCheckedFlashcardSeasonal && <span className='text-error'>*</span>}</div>
										<div className='p-4 rounded border bg-gray-50 mb-4'>
											<FieldArray name={FieldNames.traditionalSpeechToTextDataArray} render={traditionalFlashCardSpeechToTextSeasonal} />
										</div>
									</div>
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
										<TextInput placeholder='Title Chinese' name={FieldNames.titleSimplified} onChange={formik.handleChange} label='Title Chinese' value={formik.values.simplifiedTitleChinese} error={getErrorFlashcardSeasonal(FieldNames.titleSimplified) as string} required />
									</div>
									<div className='mb-4'>
										<TextInput placeholder='Title English' name={FieldNames.simplifiedTitleEnglish} onChange={formik.handleChange} label='Title English' value={formik.values.simplifiedTitleEnglish} error={getErrorFlashcardSeasonal(FieldNames.simplifiedTitleEnglish) as string} required />
									</div>
									<div className='mb-4'>
										<FileUpload labelName='Upload Audio' id={FieldNames.simplifiedAudioUrl} imageSource={audioSimplifiedFlashcardSeasonal} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.simplifiedAudioUrl} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioChangeHandlerFlashcardSeasonal} error={getErrorFlashcardSeasonal(FieldNames.simplifiedAudioUrl) as string} />
										{!isPercentageValidFlashcardSeasonal(audioSimplifiedFlashcardSeasonalPercentage) && <LoadingPercentage percentage={audioSimplifiedFlashcardSeasonalPercentage} />}
									</div>
									{checkedFlashcardSeasonal === fileTypeEnum.image && (
										<div className='mb-4'>
											<FileUpload labelName='Upload Image' id={FieldNames.simplifiedImageUrl} imageSource={imageSimplifiedFlashcardSeasonal} name={FieldNames.simplifiedImageUrl} error={getErrorFlashcardSeasonal(FieldNames.simplifiedImageUrl) as string} acceptNote={IMAGE_NOTE} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} uploadType={FILE_TYPE.pngType} onChange={imageChangeHandlerFlashcardSeasonal} />
											{!isPercentageValidFlashcardSeasonal(imageSimplifiedFlashcardSeasonalPercentage) && <LoadingPercentage percentage={imageSimplifiedFlashcardSeasonalPercentage} />}
										</div>
									)}
									{/* game changes start */}
									<div className='mb-4'>
										<FileUpload labelName='Game Audio' id={FieldNames.simplifiedGameAudioUrl} imageSource={gameAudioSimplifiedFlashcardSeasonal} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.simplifiedGameAudioUrl} acceptNote='mp3, wav files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioChangeHandlerFlashcardSeasonal} error={getErrorFlashcardSeasonal(FieldNames.simplifiedGameAudioUrl) as string} />
										{!isPercentageValidFlashcardSeasonal(gameAudioSimplifiedFlashcardSeasonalPercentage) && <LoadingPercentage percentage={gameAudioSimplifiedFlashcardSeasonalPercentage} />}
									</div>
									{checkedFlashcardSeasonal === fileTypeEnum.image && (
										<div className='mb-4'>
											<FileUpload labelName='Game Image' id={FieldNames.simplifiedGameImageUrl} imageSource={gameImageSimplifiedFlashcardSeasonal} name={FieldNames.simplifiedGameImageUrl} error={getErrorFlashcardSeasonal(FieldNames.simplifiedGameImageUrl) as string} acceptNote={GAME_IMAGE_NOTE} accepts={`${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}, ${FILE_TYPE.jpgType}`} uploadType={FILE_TYPE.pngType} onChange={imageChangeHandlerFlashcardSeasonal} />
											{!isPercentageValidFlashcardSeasonal(gameImageSimplifiedFlashcardSeasonalPercentage) && <LoadingPercentage percentage={gameImageSimplifiedFlashcardSeasonalPercentage} />}
										</div>
									)}
									{/* game changes end */}
									<div className='col-span-2'>
										<div className='font-medium'>Speech to Text {textToSpeechCheckedFlashcardSeasonal && <span className='text-error'>*</span>}</div>
										<div className='p-4 rounded border bg-gray-50 mb-4'>
											<FieldArray name={FieldNames.simplifiedSpeechToTextDataArray} render={simplifiedFlashCardSpeechToTextSeasonal} />
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
								<th>Game Audio</th>
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
		</FormikProvider>
	);
};

export default SeasonalActivityFlashcard;
