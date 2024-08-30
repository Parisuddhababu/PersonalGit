import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, PaginationParams } from 'src/types/common';
import { Result, Search } from '@components/icons';
import Pagination from '@components/pagination/Pagination';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import { ExamResultsArr, ExamResultsResponse } from '@framework/rest/rest';
import AddEditExamModal from './AddEditExamsList';
import { DEFAULT_LIMIT, DEFAULT_PAGE, endPoint } from '@config/constant';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import TextInput from '@components/textInput/TextInput';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import { debounce } from 'lodash';

const ExamResults = () => {
	useEscapeKeyPress(() => onClose()); // use to close model on Eac key.
	const [examData, setExamData] = useState<ExamResultsResponse>();
	const [isAddEditModel, setIsAddEditModel] = useState<boolean>(false);
	const [editData, setEditData] = useState<ExamResultsArr | null>(null);
	const [loader, setLoader] = useState<boolean>(false);
	const [isDisable, setIsDisable] = useState<boolean>(false);
	const [records, setRecords] = useState<number>();
	const [filterDataExamResult, setFilterDataExamResult] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrderValues.asc,
		search: '',
	});

	const COL_ARR = [
		{ name: 'Sr. No', sortable: false },
		{ name: 'Parent Name', sortable: false, fieldName: 'firstName' },
		{ name: 'Birth year', sortable: false, fieldName: 'birthYear' },
		{ name: 'Email', sortable: false, fieldName: 'email' },
		{ name: 'Mobile no.', sortable: false, fieldName: 'phoneNumber' },
	] as ColArrType[];

	/**
	 *
	 * @param  Method used for fetching exam List
	 */
	const getUserExamList = useCallback(() => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.examResultDetail}/${endPoint.result}?page=${filterDataExamResult.page}&limit=${filterDataExamResult.limit}&search=${encodeURIComponent(filterDataExamResult.search)}`)
			.then((response) => {
				if (response.status === ResponseCode.success || ResponseCode.created) {
					setExamData(response?.data?.data?.data);
					setRecords(response?.data?.data?.totalRecord);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoader(false);
			});
	}, [filterDataExamResult]);

	/**
	 *
	 * @param  Method used for fetching exam List
	 */
	useEffect(() => {
		getUserExamList();
	}, [filterDataExamResult]);

	/**
	 * Method used for on Pagination Change.
	 * @param event
	 */
	const handlePageClick = useCallback(
		(event: { selected: number }) => {
			setFilterDataExamResult({ ...filterDataExamResult, page: event.selected + 1 });
		},
		[filterDataExamResult]
	);

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onPageDrpSelectExamResult = useCallback(
		(e: string) => {
			setFilterDataExamResult({ ...filterDataExamResult, page: DEFAULT_PAGE, limit: parseInt(e) });
		},
		[filterDataExamResult]
	);

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsAddEditModel(false);
		setEditData(null);
	}, []);

	/**
	 *
	 * @param e Method used for store search value
	 */
	const handleSearch = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterDataExamResult({ ...filterDataExamResult, search: searchTerm });
		}, 500),
		[]
	);
	return (
		<div>
			{loader && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Result className='inline-block mr-2 text-primary' /> Exam Results List
					</h6>
				</div>
				<div className='p-3 w-full'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleSearch} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onPageDrpSelectExamResult} value={filterDataExamResult.limit} />
					</div>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									{COL_ARR?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												{colVal.name}
											</th>
										);
									})}
								</tr>
							</thead>
							<tbody>
								{examData?.map((data, index: number) => {
									return (
										<tr
											key={data?.id}
											className='cursor-pointer'
											onClick={() => {
												setEditData(data);
												setIsAddEditModel(true);
												setIsDisable(true);
											}}
										>
											<th scope='row' className='w-10 text-center'>
												{index + 1}
											</th>
											<td className='font-medium'>
												{data?.firstName} {data?.lastName}
											</td>
											<td className='w-16 text-center'>{data?.birthYear}</td>
											<td className='w-60'>{data?.email}</td>
											<td className='w-40'>{data?.phoneNumber}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!examData?.length && <p className='text-center'>No Exam Results Found</p>}
					</div>
					<Pagination length={records as number} onSelect={handlePageClick} limit={filterDataExamResult.limit} />
				</div>
			</div>
			{isAddEditModel && <AddEditExamModal onClose={onClose} editData={editData} disableData={isDisable} />}
		</div>
	);
};
export default ExamResults;
