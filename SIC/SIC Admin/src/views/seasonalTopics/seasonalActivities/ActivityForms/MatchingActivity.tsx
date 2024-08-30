import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
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
import { AddEditSeasonalActivityData } from 'src/types/seasonalTopics';
import { FieldNames, Chinese } from '@views/activities/ActivityMatching';
import { MatchingActivityDataArr, MatchingActivitySubmitData, TileData, TileDataArr } from 'src/types/activities/matching';

const SeasonalActivityMatching = ({ onSubmit, onClose, url, activityUuid }: AddEditSeasonalActivityData) => {
	const params = useParams();
	const [loadingMatchingSeasonal, setLoadingMatchingSeasonal] = useState<boolean>(false);
	const [provideSkipMatchingSeasonal, setProvideSkipMatchingSeasonal] = useState<boolean>(false);
	const [checkedMatchingSeasonal, setCheckedMatchingSeasonal] = useState<string>(fileTypeEnum.image);
	const [tileDataMatchingSeasonal, setTileDataMatchingSeasonal] = useState<TileDataArr>();
	const [selectedItemsTraditionalMatchingSeasonal, setSelectedItemsTraditionalMatchingSeasonal] = useState<Array<string>>([]);
	const [selectedItemsSimplifiedMatchingSeasonal, setSelectedItemsSimplifiedMatchingSeasonal] = useState<Array<string>>([]);
	const [selectedCardsTraditionalMatchingSeasonal, setSelectedCardsTraditionalMatchingSeasonal] = useState<TileDataArr[]>([]);
	const [selectedCardsSimplifiedMatchingSeasonal, setSelectedCardsSimplifiedMatchingSeasonal] = useState<TileDataArr[]>([]);
	const radioOptionsMatchingSeasonal = [
		{ name: 'Image To Image', key: fileTypeEnum.image, disabled: !!params.activityId },
		{ name: 'Image To Text', key: fileTypeEnum.text, disabled: !!params.activityId },
	];

	/**
	 *@returns Method used for setValue from activity data and get the details of activity by uuid
	 */
	useEffect(() => {
		setLoadingMatchingSeasonal(true);
		APIService.getData(`${url}/flashcard/list`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const data = response.data.data.data;
					setTileDataMatchingSeasonal(data);
				} else {
					toast.error(response?.data?.message);
				}
				setLoadingMatchingSeasonal(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoadingMatchingSeasonal(false);
			});
	}, []);

	useEffect(() => {
		if (params.activityId) {
			APIService.getData(`${url}/matching/${params.activityId}?isForSeasonal=true`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const { activityData, title, isSkippable } = response.data.data;
						formik.setFieldValue(FieldNames.title, title);
						setProvideSkipMatchingSeasonal(isSkippable);
						setCheckedMatchingSeasonal(activityData[0].isImageToImage ? fileTypeEnum.image : fileTypeEnum.text);
						formik.setFieldValue(FieldNames.isSkippable, isSkippable);
						activityData?.forEach((tile: TileData) => {
							changeSelectionActivityMatchingSeasonal(tile.activityDataId, Chinese.traditional);
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
		[FieldNames.topicId]: params.topicId as string,
		[FieldNames.lessonId]: params.lessonId as string,
		[FieldNames.activityTypeId]: activityUuid,
		[FieldNames.title]: '',
		[FieldNames.activityData]: [],
		[FieldNames.isImageToImage]: false,
		[FieldNames.isSkippable]: false,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit activity
	 */
	const getObjMatchingSeasonal = () => {
		const objMatchingSeasonal: ObjectShape = {
			[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS),
		};
		return Yup.object<ObjectShape>(objMatchingSeasonal);
	};
	const validationSchema = getObjMatchingSeasonal();

	const activityDataObjMatchingSeasonal: MatchingActivityDataArr[] = [];
	if (checkedMatchingSeasonal === fileTypeEnum.text) {
		tileDataMatchingSeasonal?.filter((tile) => {
			selectedItemsTraditionalMatchingSeasonal?.filter((item) => {
				if (tile?.activityDataId === item) {
					activityDataObjMatchingSeasonal.push({
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
		tileDataMatchingSeasonal?.filter((tile) => {
			selectedItemsTraditionalMatchingSeasonal?.filter((item) => {
				if (tile?.activityDataId === item) {
					activityDataObjMatchingSeasonal.push({
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
			const submitDataMatchingSeasonal: MatchingActivitySubmitData = {
				topicId: values.topicId,
				lessonId: values.lessonId,
				activityTypeId: values.activityTypeId,
				title: values.title,
				activityData: activityDataObjMatchingSeasonal,
				isSkippable: provideSkipMatchingSeasonal,
				isForSeasonal: true,
			};
			if (params.activityId) {
				setLoadingMatchingSeasonal(true);
				APIService.putData(`${url}/matching/${params.activityId}`, submitDataMatchingSeasonal)
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoadingMatchingSeasonal(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingMatchingSeasonal(false);
					});
			} else {
				setLoadingMatchingSeasonal(true);
				APIService.postData(`${url}/matching`, submitDataMatchingSeasonal)
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoadingMatchingSeasonal(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingMatchingSeasonal(false);
					});
			}
		},
	});

	/**
	 *
	 * @returns Method used to Perform Selection.
	 */
	const changeSelectionActivityMatchingSeasonal = (activityDataId: string, chinese: string) => {
		if (chinese === Chinese.traditional) {
			if (!selectedItemsTraditionalMatchingSeasonal.includes(activityDataId)) {
				setSelectedItemsTraditionalMatchingSeasonal((prevItem) => [...prevItem, activityDataId]);
				const newData = tileDataMatchingSeasonal?.filter((item) => item.activityDataId === activityDataId);
				setSelectedCardsTraditionalMatchingSeasonal((prevCard) => [...prevCard, newData as TileDataArr]);
			} else {
				setSelectedItemsTraditionalMatchingSeasonal(selectedItemsTraditionalMatchingSeasonal?.filter((item: string) => item !== activityDataId));
				setSelectedCardsTraditionalMatchingSeasonal(selectedCardsTraditionalMatchingSeasonal?.filter((item, index) => item[index].activityDataId !== activityDataId));
			}
		}
		if (chinese === Chinese.simplified) {
			if (!selectedItemsSimplifiedMatchingSeasonal.includes(activityDataId)) {
				setSelectedItemsSimplifiedMatchingSeasonal((prevItem) => [...prevItem, activityDataId]);
				const newData = tileDataMatchingSeasonal?.filter((item) => item.activityDataId === activityDataId);
				setSelectedCardsSimplifiedMatchingSeasonal((prevCard) => [...prevCard, newData as TileDataArr]);
			} else {
				setSelectedItemsSimplifiedMatchingSeasonal(selectedItemsSimplifiedMatchingSeasonal?.filter((item: string) => item !== activityDataId));
				setSelectedCardsSimplifiedMatchingSeasonal(selectedCardsSimplifiedMatchingSeasonal?.filter((item, index) => item[index].activityDataId !== activityDataId));
			}
		}
	};

	return (
		<form className='w-full' onSubmit={formik.handleSubmit}>
			{loadingMatchingSeasonal && <Loader />}
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
							setCheckedMatchingSeasonal(e.target.value);
							formik.handleChange(e);
						},
						[checkedMatchingSeasonal]
					)}
					checked={checkedMatchingSeasonal}
					radioOptions={radioOptionsMatchingSeasonal}
					required
				/>
			</div>
			<div className='flex gap-3 mb-4'>
				<div className='rounded border w-full'>
					<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Flashcard List</h6>
					<div className='p-3'>
						{tileDataMatchingSeasonal?.length ? (
							<ul className='grid grid-cols-3 md:grid-cols-8 gap-3 media-list'>
								{tileDataMatchingSeasonal?.map((tile: TileData) => {
									return !tile?.isFlashCardText ? (
										<li id={tile.activityDataId} key={tile.activityDataId} className={`border rounded p-1 h-40 cursor-pointer relative ${selectedItemsTraditionalMatchingSeasonal?.includes(tile?.activityDataId) ? 'border-primary border-2 active' : ''}`} onClick={() => changeSelectionActivityMatchingSeasonal(tile.activityDataId, Chinese.traditional)}>
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
							id: 'provideSkipMatchingSeasonal',
							name: 'Provide skip button for this activity',
							value: 'Provide skip button for this activity',
							checked: provideSkipMatchingSeasonal,
							onChange: () => {
								setProvideSkipMatchingSeasonal((prev) => !prev);
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

export default SeasonalActivityMatching;
