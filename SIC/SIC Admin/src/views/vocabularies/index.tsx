import React, { useCallback, useEffect, useState } from 'react';
import { sortOrder } from '@utils/helpers';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { Info } from '@components/icons';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import Pagination from '@components/pagination/Pagination';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@config/constant';
import { URL_PATHS } from '@config/variables';
import { APIService } from '@framework/services/api';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { ColArrType, PaginationParams } from 'src/types/common';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import DeleteButton from '@components/common/DeleteButton';

type VocabularyData = {
	uuid: string;
	vocabulary: string;
	vocabularySimplifiedChinese: string;
	vocabularyTraditionalChinese: string;
	createdAt: string;
	lessonName: string;
	topicName: string;
	levelName: string;
};

type VocabularyResponse = {
	status: number;
	message: string;
	data: {
		count: number;
		rows: VocabularyData[];
	};
};

const Vocabularies = () => {
	useEscapeKeyPress(() => onCloseVocabularies()); // use to close model on Eac key.
	const [loadingVocabularies, setLoadingVocabularies] = useState<boolean>(false);
	const [vocabularyData, setVocabularyData] = useState<VocabularyResponse>();
	const [editData, setEditData] = useState<VocabularyData | null>(null);
	const [isDeleteVocabulary, setIsDeleteVocabulary] = useState<boolean>(false);
	const [filterVocabularyData, setFilterVocabularyData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: 'vocabulary',
		sortOrder: sortOrderValues.asc,
		search: '',
	});

	const COL_ARR_VOCABULARIES = [{ name: 'Sr.No' }, { name: 'English', sortable: true, fieldName: 'vocabulary' }, { name: 'Traditional', sortable: true, fieldName: 'vocabularyTraditionalChinese' }, { name: 'simplified', sortable: true, fieldName: 'vocabularySimplifiedChinese' }, { name: 'Level' }, { name: 'Topic' }, { name: 'Lesson' }] as ColArrType[];

	/**
	 * Vocabularies data api call
	 */
	const getVocabularyDetails = useCallback(() => {
		setLoadingVocabularies(true);
		APIService.getData(`${URL_PATHS.vocabularies}?page=${filterVocabularyData.page}&limit=${filterVocabularyData.limit}&sortBy=${filterVocabularyData.sortBy}&sortOrder=${filterVocabularyData.sortOrder}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setVocabularyData(response?.data);
				}
			})
			.catch((err) => toast.error(err?.response?.data.message))
			.finally(() => setLoadingVocabularies(false));
	}, [filterVocabularyData]);

	/**
	 * Method used to fetch vocabularies list
	 */
	useEffect(() => {
		getVocabularyDetails();
	}, [filterVocabularyData]);

	/**
	 *
	 * @param data Method used for show vocabulary delete modal
	 */
	const deleteVocabularyDataModal = useCallback((data: VocabularyData) => {
		setEditData(data);
		setIsDeleteVocabulary(true);
	}, []);

	/**
	 * Delete vocabulary data api call
	 */
	const deleteVocabularyData = () => {
		setLoadingVocabularies(true);
		APIService.deleteData(`${URL_PATHS.vocabularies}/${editData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getVocabularyDetails();
				}
			})
			.catch((err) => toast.error(err?.response?.data.message))
			.finally(() => setLoadingVocabularies(false));
	};

	/**
	 * Method used for delete vocabulary data
	 */
	const deleteVocabulary = useCallback(() => {
		deleteVocabularyData();
		setIsDeleteVocabulary(false);
		setEditData(null);
	}, [isDeleteVocabulary]);

	/**
	 *
	 * @param event Method used for on page click
	 */
	const handleCategoryPageClick = useCallback(
		(event: { selected: number }) => {
			setFilterVocabularyData({ ...filterVocabularyData, page: event.selected + 1 });
		},
		[filterVocabularyData]
	);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onVocabularyHandleSort = (sortFieldName: string) => {
		setFilterVocabularyData({
			...filterVocabularyData,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterVocabularyData.sortOrder),
		});
	};

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onVocabularyPageDrpSelect = useCallback(
		(e: string) => {
			setFilterVocabularyData({ ...filterVocabularyData, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterVocabularyData]
	);

	/**
	 * Method used for close modal
	 */
	const onCloseVocabularies = useCallback(() => {
		setIsDeleteVocabulary(false);
		setEditData(null);
	}, []);

	return (
		<div>
			{loadingVocabularies && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Info className='mr-1 text-primary' /> Vocabularies
					</h6>
				</div>
				<div className='p-3 w-full'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<ShowEntries onChange={onVocabularyPageDrpSelect} value={filterVocabularyData.limit} />
					</div>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									{COL_ARR_VOCABULARIES?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												<div className='flex items-center'>
													{colVal.name}
													{colVal.sortable && (
														<a onClick={() => onVocabularyHandleSort(colVal.fieldName)}>
															{(filterVocabularyData.sortOrder === '' || filterVocabularyData.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterVocabularyData.sortOrder === sortOrderValues.asc && filterVocabularyData.sortBy === colVal.fieldName && getAscIcon()}
															{filterVocabularyData.sortOrder === sortOrderValues.desc && filterVocabularyData.sortBy === colVal.fieldName && getDescIcon()}
														</a>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col' className='w-32'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{vocabularyData?.data?.rows.map((data, index) => {
									return (
										<tr key={data.uuid}>
											<th scope='row' className='w-10 text-center'>
												{index + 1}
											</th>
											<td className='font-medium'>{data.vocabulary}</td>
											<td className='font-medium'>{data.vocabularyTraditionalChinese}</td>
											<td className='font-medium'>{data.vocabularySimplifiedChinese}</td>
											<td className='font-medium'>{data.levelName || 'Seasonal'}</td>
											<td className='font-medium'>{data.topicName}</td>
											<td className='font-medium'>{data.lessonName}</td>
											<td className='text-center'>
												<DeleteButton data={data} isDeleteStatusModal={deleteVocabularyDataModal} />
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!vocabularyData?.data?.count && <p className='text-center'>No Vocabularies Found</p>}
					</div>
					<Pagination length={vocabularyData?.data?.count as number} onSelect={handleCategoryPageClick} limit={filterVocabularyData.limit} />
				</div>
			</div>
			{isDeleteVocabulary && <DeleteModel onClose={onCloseVocabularies} deleteData={deleteVocabulary} />}
		</div>
	);
};
export default Vocabularies;
