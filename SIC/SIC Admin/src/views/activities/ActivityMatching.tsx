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
import { ResponseCode } from 'src/interfaces/enum';
import { Loader } from '@components/index';
import { CHARACTERS_LIMIT, fileTypeEnum } from '@config/constant';
import { Errors } from '@config/errors';
import TextInput from '@components/textInput/TextInput';
import RadioButton from '@components/radiobutton/RadioButton';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import { MatchingActivityDataArr, MatchingActivitySubmitData, TileData, TileDataArr } from 'src/types/activities/matching';

export enum FieldNames {
	levelId = 'levelId',
	topicId = 'topicId',
	lessonId = 'lessonId',
	activityTypeId = 'activityTypeId',
	title = 'title',
	activityData = 'activityData',
	isSkippable = 'isSkippable',
	isImageToImage = 'isImageToImage',
}

export enum Chinese {
	traditional = 'traditional',
	simplified = 'simplified',
}

const ActivityMatching = ({ onSubmit, onClose, url, activityUuid }: AddEditActivitiesData) => {
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
		APIService.getData(`${url}/flashcard/list?levelId=${params.levelId}&topicId=${params.topicId}&lessonId=${params.lessonId}`)
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
			APIService.getData(`${url}/matching/${params.activityId}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const { activityData, title, isSkippable } = response.data.data;
						formik.setFieldValue(FieldNames.title, title);
						setProvideSkipMatching(isSkippable);
						setCheckedMatching(activityData[0].isImageToImage ? fileTypeEnum.image : fileTypeEnum.text);
						formik.setFieldValue(FieldNames.isSkippable, isSkippable);
						activityData?.forEach((tile: TileData) => {
							changeSelectionActivityMatching(tile.activityDataId, Chinese.traditional);
						});
					} else {
						toast.error(response?.data?.message);
					}
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
				});
		}
	}, [params.activityId]);

	const initialValues: MatchingActivitySubmitData = {
		[FieldNames.levelId]: params.levelId as string,
		[FieldNames.topicId]: params.topicId as string,
		[FieldNames.lessonId]: params.lessonId as string,
		[FieldNames.activityTypeId]: activityUuid,
		[FieldNames.title]: '',
		[FieldNames.activityData]: [],
		[FieldNames.isSkippable]: false,
		[FieldNames.isImageToImage]: false,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit activity
	 */
	const getObjMatching = () => {
		const objMatching: ObjectShape = {
			[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
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
				levelId: values.levelId,
				topicId: values.topicId,
				lessonId: values.lessonId,
				activityTypeId: values.activityTypeId,
				title: values.title,
				activityData: activityDataObjMatching,
				isSkippable: provideSkipMatching,
			};
			if (params.activityId) {
				setLoadingMatching(true);
				APIService.putData(`${url}/matching/${params.activityId}`, submitDataMatching)
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
				APIService.postData(`${url}/matching`, submitDataMatching)
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
		if (chinese === Chinese.traditional) {
			if (!selectedItemsTraditionalMatching.includes(activityDataId)) {
				setSelectedItemsTraditionalMatching((prevItem) => [...prevItem, activityDataId]);
				const newData = tileDataMatching?.filter((item) => item.activityDataId === activityDataId);
				setSelectedCardsTraditionalMatching((prevCard) => [...prevCard, newData as TileDataArr]);
			} else {
				setSelectedItemsTraditionalMatching(selectedItemsTraditionalMatching?.filter((item: string) => item !== activityDataId));
				setSelectedCardsTraditionalMatching(selectedCardsTraditionalMatching?.filter((item, index) => item[index].activityDataId !== activityDataId));
			}
		}
		if (chinese === Chinese.simplified) {
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
										<li id={tile.activityDataId} key={tile.activityDataId} className={`border rounded p-1 h-40 cursor-pointer relative ${selectedItemsTraditionalMatching.includes(tile.activityDataId) ? 'border-primary border-2 active' : ''}`} onClick={() => changeSelectionActivityMatching(tile.activityDataId, Chinese.traditional)}>
											<img src={tile.traditionalImageUrl} className='h-full w-full object-cover rounded' />
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
