import React, { useCallback, useEffect, useState } from 'react';
import { FormikProvider, useFormik } from 'formik';
import Button from '@components/button/Button';
import TextInput from '@components/textInput/TextInput';
import { useNavigate, useParams } from 'react-router-dom';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { APIService } from '@framework/services/api';
import { Loader } from '@components/index';
import { ArrowSmallLeft } from '@components/icons';
import { ROUTES } from '@config/constant';
import { AddFlashCard, FlashCardEdit } from 'src/types/flashCardCategories';
import { URL_PATHS } from '@config/variables';
import { TileData, TileDataArr } from 'src/types/activities/matching';

enum FieldNames {
	categoryId = 'categoryId',
	title = 'title',
	activityData = 'activityData',
}

const AddEditFlashCardModal = () => {
	const params = useParams();
	const [loading, setLoading] = useState<boolean>(false);
	const [editData, setEditData] = useState<FlashCardEdit | null>(null);
	const [tileData, setTileData] = useState<TileDataArr>();
	const [selectedItems, setSelectedItems] = useState<Array<string>>([]);

	const [selectedCards, setSelectedCards] = useState<TileDataArr>([]);

	const navigate = useNavigate();

	/**
	 *@returns Method used for setValue from activity data and get the details of activity by uuid
	 */
	useEffect(() => {
		setLoading(true);
		APIService.getData(`${URL_PATHS.seasonalActivities}/flashcard/list`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const data = response?.data?.data?.data;
					setTileData(data);
				} else {
					toast.error(response?.data?.message);
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoading(false);
			});
	}, []);

	/**
	 *@returns Method used for setValue from flashCard data and get the details of flashCard by uuid
	 */
	useEffect(() => {
		if (params.flashcardId) {
			setLoading(true);
			APIService.getData(`${URL_PATHS.flashCard}/${params.flashcardId}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						setEditData(response.data.data);
						formik.setFieldValue(FieldNames.title, response.data.data.title);
						setSelectedItems([response.data.data.activityDataId]);
					}
					setLoading(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoading(false);
				});
		}
	}, [params.flashcardId]);

	const initialValues: AddFlashCard = {
		[FieldNames.categoryId]: params.id as string,
		[FieldNames.title]: '',
		[FieldNames.activityData]: [],
	};

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			if (editData) {
				setLoading(true);
				APIService.patchData(`${URL_PATHS.flashCard}/${editData?.uuid}`, {
					title: selectedCards[0]?.traditionalTitleEnglish,
					activityData: {
						activityDataId: selectedItems[0],
						traditionalImageUrl: selectedCards[0]?.traditionalImageUrl,
						simplifiedImageUrl: selectedCards[0]?.simplifiedImageUrl,
						traditionalAudioUrl: selectedCards[0]?.traditionalAudioUrl,
						simplifiedAudioUrl: selectedCards[0]?.simplifiedAudioUrl,
						traditionalTitleChinese: selectedCards[0]?.traditionalTitleChinese,
						simplifiedTitleChinese: selectedCards[0]?.simplifiedTitleChinese,
						isTextToSpeech: selectedCards[0]?.isTextToSpeech,
						simplifiedTitleEnglish: selectedCards[0]?.simplifiedTitleEnglish,
						traditionalTitleEnglish: selectedCards[0]?.traditionalTitleEnglish,
						traditionalPronunciationText: selectedCards[0]?.traditionalPronunciationText,
						simplifiedPronunciationText: selectedCards[0]?.simplifiedPronunciationText,
					},
				})
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							navigate(`/${ROUTES.app}/${ROUTES.flashCardList}/${params.id}`);
						}
						setLoading(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoading(false);
					});
			} else {
				setLoading(true);
				APIService.postData(URL_PATHS.flashCard, { ...values, activityData: selectedCards })
					.then((response) => {
						if (response.status === ResponseCode.success || ResponseCode.created) {
							toast.success(response?.data?.message);
							formik.resetForm();
							navigate(`/${ROUTES.app}/${ROUTES.flashCardList}/${params.id}`);
						}
						setLoading(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoading(false);
					});
			}
		},
	});

	/**
	 *
	 * @returns Method used to Perform Selection.
	 */
	const changeSelectionActivity = (activityDataId: string) => {
		if (editData) {
			setSelectedItems([activityDataId]);
			const newData = tileData?.filter((item) => item.activityDataId === activityDataId);
			setSelectedCards(newData as TileDataArr);
			return;
		}
		if (!selectedItems.includes(activityDataId)) {
			setSelectedItems((prevItem) => [...prevItem, activityDataId]);
			const newData = tileData?.filter((item) => item.activityDataId === activityDataId);
			setSelectedCards((prevCard) => [...(newData as TileDataArr), ...prevCard]);
		} else {
			setSelectedItems(selectedItems.filter((item: string) => item !== activityDataId));
			setSelectedCards(selectedCards.filter((item) => item.activityDataId !== activityDataId));
		}
	};

	useEffect(() => {
		if (editData) {
			const newData = tileData?.filter((item) => item.activityDataId === editData?.activityDataId);
			setSelectedCards(newData as TileDataArr);
		}
	}, [editData, tileData]);

	return (
		<FormikProvider value={formik}>
			<form className='w-full' onSubmit={formik.handleSubmit}>
				{loading && <Loader />}
				<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
					<div className='border-b p-3 flex items-center justify-between'>
						<h4 className='flex items-center'>
							<Button className='btn-default mr-3' onClick={useCallback(() => navigate(`/${ROUTES.app}/${ROUTES.flashCardList}/${params.id}`), [])} title='Back to categories'>
								<ArrowSmallLeft />
							</Button>
							{editData !== null ? 'Edit' : 'Add'} Flash card
						</h4>
					</div>
					<div className='p-3 w-full'>
						{editData && (
							<div className='mb-4'>
								<TextInput placeholder='Activity Title' name={FieldNames.title} onChange={formik.handleChange} label='Activity Title' value={formik.values.title} disabled={!!editData} />
							</div>
						)}
						<div className='rounded border w-full mb-4'>
							<h6 className='font-medium bg-gray-100 p-3 rounded-t'>Flashcard List</h6>
							<div className='p-3'>
								{tileData?.length ? (
									<ul className='grid grid-cols-3 md:grid-cols-8 gap-3 media-list'>
										{tileData?.map((tile: TileData) => {
											return !tile?.isFlashCardText ? (
												<li key={tile.activityDataId} className={`border rounded p-1 h-40 cursor-pointer relative ${selectedItems.includes(tile.activityDataId) ? 'border-primary border-2 active' : ''}`} onClick={() => changeSelectionActivity(tile.activityDataId)}>
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
						<div className='flex items-center justify-end gap-2'>
							<Button className='btn-primary btn-large w-28 justify-center' type='submit'>
								{editData ? 'Update' : 'Save'}
							</Button>
							<Button className='btn-default btn-large w-28 justify-center' onClick={useCallback(() => navigate(`/${ROUTES.app}/${ROUTES.flashCardList}/${params.id}`), [])}>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			</form>
		</FormikProvider>
	);
};

export default AddEditFlashCardModal;
