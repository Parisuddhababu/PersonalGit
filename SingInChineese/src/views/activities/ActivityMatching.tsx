import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import { AddEditActivitiesData } from 'src/types/activities';
import CheckBox from '@components/checkbox/CheckBox';
import { useParams } from 'react-router-dom';
import { APIService } from '@framework/services/api';
import { toast } from 'react-toastify';
import { FieldNames, ResponseCode } from 'src/interfaces/enum';
import { Loader } from '@components/index';
import { activityPaths, endPoint, fileTypeEnum } from '@config/constant';
import { Errors } from '@config/errors';
import TextInput from '@components/textInput/TextInput';
import RadioButton from '@components/radiobutton/RadioButton';
import { MatchingActivityDataArr, MatchingActivitySubmitData, TileData, TileDataArr } from 'src/types/activities/matching';
import { stringNoSpecialChar } from '@config/validations';
import { moveData } from '@utils/helpers';

const ActivityMatching = ({ onSubmit, onClose, url, activityUuid, toggleActivity, isMoving, levelId, topicId, lessonId }: AddEditActivitiesData) => {
	const params = useParams();
	const [loadingMatching, setLoadingMatching] = useState<boolean>(false);
	const [provideSkipMatching, setProvideSkipMatching] = useState<boolean>(false);
	const [checkedMatching, setCheckedMatching] = useState<string>(fileTypeEnum.image);
	const [tileDataMatching, setTileDataMatching] = useState<TileDataArr>();
	const [selectedItemsTraditionalMatching, setSelectedItemsTraditionalMatching] = useState<Array<string>>([]);
	const [selectedItemsSimplifiedMatching, setSelectedItemsSimplifiedMatching] = useState<Array<string>>([]);
	const [selectedCardsTraditionalMatching, setSelectedCardsTraditionalMatching] = useState<TileDataArr[]>([]);
	const [selectedCardsSimplifiedMatching, setSelectedCardsSimplifiedMatching] = useState<TileDataArr[]>([]);
	const radioOptionsMatching = [
		{ name: 'Image To Image', key: fileTypeEnum.image, disabled: !!params.activityId },
		{ name: 'Image To Text', key: fileTypeEnum.text, disabled: !!params.activityId },
	];

	/**
	 *@returns Method used for setValue from activity data and get the details of activity by uuid
	 */
	useEffect(() => {
		setLoadingMatching(true);
		APIService.getData(`${url}/${endPoint.flashcard}/${endPoint.list}?levelId=${params.levelId}&topicId=${params.topicId}&lessonId=${params.lessonId}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const data = response.data.data.data.allActivityArr;
					setTileDataMatching(data);
				}
				setLoadingMatching(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoadingMatching(false);
			});
	}, []);

	useEffect(() => {
		if (params.activityId) {
			APIService.getData(`${url}/${activityPaths.matching}/${params.activityId}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const { activityData, title, isSkippable, toggle } = response.data.data;
						toggleActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);
						formik.setFieldValue(FieldNames.title, title);
						setProvideSkipMatching(isSkippable);
						setCheckedMatching(activityData[0].isImageToImage ? fileTypeEnum.image : fileTypeEnum.text);
						formik.setFieldValue(FieldNames.isSkippable, isSkippable);
						activityData?.forEach((tile: TileData) => {
							changeSelectionActivityMatching(tile.activityDataId, FieldNames.traditional);
						});
					}
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
				});
		}
	}, []);

	const initialValues: MatchingActivitySubmitData = {
		[FieldNames.levelId]: params.levelId as string,
		[FieldNames.topicId]: params.topicId as string,
		[FieldNames.lessonId]: params.lessonId as string,
		[FieldNames.activityTypeId]: activityUuid,
		[FieldNames.title]: '',
		[FieldNames.activityData]: [],
		[FieldNames.isSkippable]: false,
		[FieldNames.isImageToImage]: false,
		isMoving: isMoving,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit activity
	 */
	const getObjMatching = () => {
		const objMatching: ObjectShape = {
			[FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
		};
		return Yup.object<ObjectShape>(objMatching);
	};
	const validationSchema = getObjMatching();

	const activityDataObjMatching: MatchingActivityDataArr[] = [];
	if (checkedMatching === fileTypeEnum.text) {
		tileDataMatching?.filter((tile) => {
			selectedItemsTraditionalMatching?.filter((item) => {
				if (tile?.activityDataId === item) {
					activityDataObjMatching.push({
						activityDataId: tile.activityDataId,
						simplifiedImage: tile.simplifiedImageUrl,
						simplifiedAudio: tile.simplifiedAudioUrl,
						simplifiedText: tile.simplifiedTitleChinese,
						traditionalImage: tile.traditionalImageUrl,
						traditionalAudio: tile.traditionalAudioUrl,
						traditionalText: tile.traditionalTitleChinese,
						isImageToImage: false,
					});
				}
			});
		});
	} else {
		tileDataMatching?.filter((tile) => {
			selectedItemsTraditionalMatching?.filter((item) => {
				if (tile?.activityDataId === item) {
					activityDataObjMatching.push({
						activityDataId: tile.activityDataId,
						simplifiedImage: tile.simplifiedImageUrl,
						simplifiedAudio: tile.simplifiedAudioUrl,
						simplifiedMatchingImage: tile.simplifiedImageUrl,
						simplifiedMatchingAudio: tile.simplifiedAudioUrl,
						traditionalImage: tile.traditionalImageUrl,
						traditionalAudio: tile.traditionalAudioUrl,
						traditionalMatchingImage: tile.traditionalImageUrl,
						traditionalMatchingAudio: tile.traditionalAudioUrl,
						isImageToImage: true,
					});
				}
			});
		});
	}

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const submitDataMatching: MatchingActivitySubmitData = {
				isMoving: isMoving,
				levelId: moveData(isMoving, levelId as string, values.levelId as string),
				topicId: moveData(isMoving, topicId as string, values.topicId),
				lessonId: moveData(isMoving, lessonId as string, values.lessonId),
				activityTypeId: values.activityTypeId,
				title: values.title,
				activityData: activityDataObjMatching,
				isSkippable: provideSkipMatching,
			};
			if (params.activityId) {
				setLoadingMatching(true);
				APIService.putData(`${url}/${activityPaths.matching}/${params.activityId}`, submitDataMatching)
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoadingMatching(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingMatching(false);
					});
			} else {
				setLoadingMatching(true);
				APIService.postData(`${url}/${activityPaths.matching}`, submitDataMatching, isMoving)
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoadingMatching(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingMatching(false);
					});
			}
		},
	});

	/**
	 *
	 * @returns Method used to Perform Selection.
	 */
	const changeSelectionActivityMatching = (activityDataId: string, chinese: string) => {
		if (chinese === FieldNames.traditional) {
			if (!selectedItemsTraditionalMatching.includes(activityDataId)) {
				setSelectedItemsTraditionalMatching((prevItem) => [...prevItem, activityDataId]);
				const newData = tileDataMatching?.filter((item) => item.activityDataId === activityDataId);
				setSelectedCardsTraditionalMatching((prevCard) => [...prevCard, newData as TileDataArr]);
			} else {
				setSelectedItemsTraditionalMatching(selectedItemsTraditionalMatching?.filter((item: string) => item !== activityDataId));
				setSelectedCardsTraditionalMatching(selectedCardsTraditionalMatching?.filter((item, index) => item[index].activityDataId !== activityDataId));
			}
		}
		if (chinese === FieldNames.simplified) {
			if (!selectedItemsSimplifiedMatching.includes(activityDataId)) {
				setSelectedItemsSimplifiedMatching((prevItem) => [...prevItem, activityDataId]);
				const newData = tileDataMatching?.filter((item) => item.activityDataId === activityDataId);
				setSelectedCardsSimplifiedMatching((prevCard) => [...prevCard, newData as TileDataArr]);
			} else {
				setSelectedItemsSimplifiedMatching(selectedItemsSimplifiedMatching?.filter((item: string) => item !== activityDataId));
				setSelectedCardsSimplifiedMatching(selectedCardsSimplifiedMatching?.filter((item, index) => item[index].activityDataId !== activityDataId));
			}
		}
	};

	return (
		<form className='w-full' onSubmit={formik.handleSubmit}>
			{loadingMatching && <Loader />}
			<div className='mb-4'>
				<TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={formik.errors.title && formik.touched.title ? formik.errors.title : ''} required />
			</div>
			<div className='mb-4'>
				<RadioButton
					id='matchingType'
					label={'Matching Type'}
					name='isImageToImage'
					onChange={useCallback(
						(e: React.ChangeEvent<HTMLInputElement>) => {
							setCheckedMatching(e.target.value);
							formik.handleChange(e);
						},
						[checkedMatching]
					)}
					checked={checkedMatching}
					radioOptions={radioOptionsMatching}
					required
				/>
			</div>
			<div className='flex gap-3 mb-4'>
				<div className='rounded border w-full'>
					<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Flashcard List</h6>
					<div className='p-3'>
						{tileDataMatching?.length ? (
							<ul className='grid grid-cols-3 md:grid-cols-8 gap-3 media-list'>
								{tileDataMatching?.map((tile: TileData) => {
									return !tile?.isFlashCardText ? (
										<li id={tile.activityDataId} key={tile.activityDataId} className={`border rounded p-1 h-40 cursor-pointer relative ${selectedItemsTraditionalMatching.includes(tile.activityDataId) ? 'border-primary border-2 active' : ''}`} >
											<button type='button' className='w-full h-full cursor-pointer' onClick={() => changeSelectionActivityMatching(tile.activityDataId, FieldNames.traditional)}>
												<img src={tile.traditionalImageUrl} alt='Img preview' className='h-full w-full object-cover rounded' /></button>
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
			</div>
			<div className='flex justify-end gap-2 items-center'>
				<CheckBox
					option={[
						{
							id: 'provideSkipMatching',
							name: 'Provide skip button for this activity',
							value: 'Provide skip button for this activity',
							checked: provideSkipMatching,
							onChange: () => {
								setProvideSkipMatching((prev) => !prev);
							},
						},
					]}
				/>
				<Button className='btn-primary btn-large w-28 justify-center' type='submit'>
					{params.activityId ? 'Update' : 'Save'}
				</Button>
				<Button className='btn-default btn-large w-28 justify-center' onClick={onClose}>
					Cancel
				</Button>
			</div>
		</form>
	);
};

export default ActivityMatching;
