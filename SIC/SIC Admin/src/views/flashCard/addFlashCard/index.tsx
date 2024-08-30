import React, { useCallback, useEffect, useState } from 'react';
import { sortOrder } from '@utils/helpers';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import Button from '@components/button/Button';
import { ArrowSmallLeft, CreditCard, PlusCircle, Search } from '@components/icons';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import Pagination from '@components/pagination/Pagination';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES } from '@config/constant';
import { URL_PATHS } from '@config/variables';
import { APIService } from '@framework/services/api';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { debounce } from 'lodash';
import { ColArrType, PaginationParams } from 'src/types/common';
import TextInput from '@components/textInput/TextInput';
import { FlashCardArr, FlashCardResponse } from 'src/types/flashCardCategories';
import { useNavigate, useParams } from 'react-router-dom';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import StatusButton from '@components/common/StatusButton';

const FlashCard = () => {
	useEscapeKeyPress(() => onCloseFlashcard()); // use to close model on Eac key.
	const navigate = useNavigate();
	const params = useParams();
	const [flashCardData, setFlashCardData] = useState<FlashCardResponse>();
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [editData, setEditData] = useState<FlashCardArr | null>(null);
	const [loadingFlashcard, setLoadingFlashcard] = useState<boolean>(false);
	const [filterFlashcardData, setFilterFlashcardData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: 'asc',
		search: '',
	});

	const COL_ARR = [{ name: 'Sr.No' }, { name: 'Title', sortable: true, fieldName: 'title' }, { name: 'Status' }] as ColArrType[];

	/**
	 * Used for get categories data from api
	 */
	const getFlashCardDetails = useCallback(() => {
		setLoadingFlashcard(true);
		APIService.getData(`${URL_PATHS.flashCard}/list?categoryId=${params.id}&page=${filterFlashcardData.page}&limit=${filterFlashcardData.limit}&sortBy=${filterFlashcardData.sortBy}&sortOrder=${filterFlashcardData.sortOrder}&search=${filterFlashcardData.search}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setFlashCardData(response?.data);
				}
				setLoadingFlashcard(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoadingFlashcard(false);
			});
	}, [filterFlashcardData]);

	/**
	 * Method used to fetch categories list
	 */
	useEffect(() => {
		getFlashCardDetails();
	}, [filterFlashcardData]);

	/**
	 *
	 * @param data Method used for show category change status modal
	 */
	const onChangeStatus = useCallback((data: FlashCardArr) => {
		setEditData(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 *
	 * @param value used to send boolean true or false
	 */
	const updateCategoryStatus = (value: boolean) => {
		setLoadingFlashcard(true);
		APIService.patchData(`${URL_PATHS.flashCard}/${editData?.uuid}/change-status`, {
			isActive: value,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getFlashCardDetails();
				}
				setLoadingFlashcard(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoadingFlashcard(false);
			});
	};

	/**
	 * Method used for change category status with API
	 */
	const changeCategoryStatus = useCallback(() => {
		const data = editData?.isActive;
		updateCategoryStatus(!data);
		setIsStatusModelShow(false);
		setEditData(null);
	}, [isStatusModelShow]);

	/**
	 *
	 * @param event Method used for on page click
	 */
	const handleFlashcardPageClick = useCallback(
		(event: { selected: number }) => {
			setFilterFlashcardData({ ...filterFlashcardData, page: event.selected + 1 });
		},
		[filterFlashcardData]
	);

	/**
	 *
	 * @param values Method used for set filter data
	 */
	const handleFlashcardSearch = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterFlashcardData({ ...filterFlashcardData, search: searchTerm });
		}, 500),
		[filterFlashcardData]
	);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onFlashcardHandleSort = (sortFieldName: string) => {
		setFilterFlashcardData({
			...filterFlashcardData,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterFlashcardData.sortOrder),
		});
	};

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onFlashcardPageDrpSelect = useCallback(
		(e: string) => {
			setFilterFlashcardData({ ...filterFlashcardData, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterFlashcardData]
	);

	/**
	 * Method used for close modal
	 */
	const onCloseFlashcard = useCallback(() => {
		setIsStatusModelShow(false);
		setEditData(null);
	}, []);

	const pathRedirect = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.flashCard}`);
	}, []);

	const addNewFlashcard = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.flashCardList}/${params.id}/AddEditFlashCard`);
	}, []);

	return (
		<div>
			{loadingFlashcard && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={pathRedirect} title='Back to categories'>
							<ArrowSmallLeft />
						</Button>
						<CreditCard className='inline-block mr-2 text-primary' /> Flashcard List
					</h6>
					<Button className='btn-primary btn-large' onClick={addNewFlashcard}>
						<PlusCircle className='mr-1' /> Add New
					</Button>
				</div>
				<div className='p-3 w-full'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleFlashcardSearch} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onFlashcardPageDrpSelect} value={filterFlashcardData.limit} />
					</div>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									{COL_ARR?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												<div className='flex items-center'>
													{colVal.name}
													{colVal.sortable && (
														<a onClick={() => onFlashcardHandleSort(colVal.fieldName)}>
															{(filterFlashcardData.sortOrder === '' || filterFlashcardData.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterFlashcardData.sortOrder === sortOrderValues.asc && filterFlashcardData.sortBy === colVal.fieldName && getAscIcon()}
															{filterFlashcardData.sortOrder === sortOrderValues.desc && filterFlashcardData.sortBy === colVal.fieldName && getDescIcon()}
														</a>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col' className='w-24'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{flashCardData?.data.flashcards.map((data, index) => {
									return (
										<tr key={data.uuid}>
											<th scope='row' className='w-20 text-center'>
												{index + 1}
											</th>
											<td className='font-medium'>{data.title}</td>
											<td className='w-40 text-center'>{data.isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
											<td>
												<StatusButton data={data} isChangeStatusModal={onChangeStatus} status={`${data.isActive}`} checked={data.isActive} />
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!flashCardData?.data?.count && <p className='text-center'>No Flashcard Found</p>}
					</div>
					<Pagination length={flashCardData?.data?.count as number} onSelect={handleFlashcardPageClick} limit={filterFlashcardData.limit} />
				</div>
			</div>
			{isStatusModelShow && <ChangeStatus onClose={onCloseFlashcard} changeStatus={changeCategoryStatus} />}
		</div>
	);
};
export default FlashCard;
