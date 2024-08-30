import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, PaginationParams } from 'src/types/common';
import { PlusCircle, Search, Flag } from '@components/icons';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { sortOrder } from '@utils/helpers';
import Pagination from '@components/pagination/Pagination';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@config/constant';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { debounce } from 'lodash';
import TextInput from '@components/textInput/TextInput';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import { CountryArr, CountryData } from 'src/types/country';
import AddEditCountryModal from './AddEditCountry';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';

const Level = () => {
	useEscapeKeyPress(() => onCloseCountry()); // use to close model on Eac key.
	const [countryData, setCountryData] = useState<CountryData>();
	const [isDeleteCountry, setIsDeleteCountry] = useState<boolean>(false);
	const [isAddEditModel, setIsAddEditModel] = useState<boolean>(false);
	const [editData, setEditData] = useState<CountryArr | null>(null);
	const [loader, setLoader] = useState<boolean>(false);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [filterCountryData, setFilterCountryData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: '',
		search: '',
	});

	const COL_ARR = [
		{ name: 'Sr. No', sortable: false },
		{ name: 'Country Name', sortable: true, fieldName: 'countryName' },
		{ name: 'Country code', sortable: true, fieldName: 'countryCode' },
		{ name: 'phone code', sortable: true, fieldName: 'phoneCode' },
		{ name: 'Status', sortable: false, fieldName: 'status' },
	] as ColArrType[];

	/**
	 * @returns Method is used to get the country data from api
	 */
	const getCountryData = useCallback(() => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.country}/list?page=${filterCountryData.page}&limit=${filterCountryData.limit}&search=${filterCountryData.search}&sortBy=${filterCountryData.sortBy}&sortOrder=${filterCountryData.sortOrder}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setCountryData(response?.data);
					setLoader(false);
				} else {
					toast.error(response?.data.message);
					setLoader(false);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoader(false);
			});
	}, [filterCountryData]);

	/**
	 * Method is used to delete the level data from api
	 */
	const deleteCountryData = () => {
		APIService.deleteData(`${URL_PATHS.country}/${editData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getCountryData();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	};

	/**
	 * Method used to update the status of the country
	 * @param value: true or false
	 */
	const updateCountryStatus = (value: boolean) => {
		APIService.patchData(`${URL_PATHS.country}/${editData?.uuid}`, {
			isActive: value,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getCountryData();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	};

	/**
	 * Method is used to fetch the country data from API on page load.
	 */
	useEffect(() => {
		getCountryData();
	}, [filterCountryData]);

	/**
	 * Method used for on Pagination Change.
	 * @param event
	 */
	const handleCountryPageClick = useCallback(
		(event: { selected: number }) => {
			setFilterCountryData({ ...filterCountryData, page: event.selected + 1 });
		},
		[filterCountryData]
	);

	/**
	 * Method used for storing data
	 * @param sortFieldName
	 */
	const onCountryHandleSort = (sortFieldName: string) => {
		setFilterCountryData({
			...filterCountryData,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterCountryData.sortOrder),
		});
	};

	/**
	 * Method used for change dropdown for page limit
	 * @param e
	 */
	const onCountryPageDrpSelect = useCallback(
		(e: string) => {
			setFilterCountryData({ ...filterCountryData, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterCountryData]
	);

	/**
	 * Method used for delete country data
	 */
	const deleteCountry = useCallback(() => {
		deleteCountryData();
		setIsDeleteCountry(false);
		setEditData(null);
	}, [isDeleteCountry]);

	/**
	 * Method used for close model
	 */
	const onCloseCountry = useCallback(() => {
		setIsDeleteCountry(false);
		setIsAddEditModel(false);
		setIsStatusModelShow(false);
		setEditData(null);
		setDisabled(false);
	}, []);

	/**
	 * Method used for show country delete modal
	 * @param data
	 */
	const deleteCountryDataModal = useCallback((data: CountryArr) => {
		setEditData(data);
		setIsDeleteCountry(true);
	}, []);

	/**
	 * Method used for store search value
	 * @param e
	 */
	const handleSearch = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterCountryData({ ...filterCountryData, search: searchTerm });
		}, 500),
		[filterCountryData]
	);

	/**
	 * Method used for Edit Current selected Record
	 * @param data
	 */
	const editRecord = useCallback((data: CountryArr) => {
		setEditData(data);
		setIsAddEditModel(true);
	}, []);

	/**
	 * Method for handle the bubbling
	 * @param e
	 */
	const rowClickHandler = (e: { stopPropagation: () => void }) => {
		e.stopPropagation();
	};

	const onChangeStatus = useCallback((data: CountryArr) => {
		setEditData(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 * Method used for change country status
	 */
	const changeCountryStatus = useCallback(() => {
		const data = editData?.isActive;
		updateCountryStatus(!data);
		setIsStatusModelShow(false);
		setEditData(null);
	}, [isStatusModelShow]);

	const showAddEditCountryModal = useCallback(() => {
		setIsAddEditModel(true);
	}, []);

	return (
		<div>
			{loader && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Flag className='inline-block mr-2 text-primary' /> Country List
					</h6>
					<Button className='btn-primary btn-large' onClick={showAddEditCountryModal}>
						<PlusCircle className='mr-1' /> Add New
					</Button>
				</div>
				<div className='p-3 w-full'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleSearch} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onCountryPageDrpSelect} value={filterCountryData.limit} />
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
														<a onClick={() => onCountryHandleSort(colVal.fieldName)}>
															{(filterCountryData.sortOrder === '' || filterCountryData.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterCountryData.sortOrder === 'asc' && filterCountryData.sortBy === colVal.fieldName && getAscIcon()}
															{filterCountryData.sortOrder === 'desc' && filterCountryData.sortBy === colVal.fieldName && getDescIcon()}
														</a>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col' className='w-40'>
										Action
									</th>
								</tr>
							</thead>

							<tbody>
								{countryData?.data?.data?.map((data, index: number) => {
									return (
										<tr
											key={data.uuid}
											className='cursor-pointer'
											onClick={() => {
												editRecord(data);
												setDisabled(true);
											}}
										>
											<th scope='row' className='w-10 text-center'>
												{index + 1}
											</th>
											<td>{data.countryName}</td>
											<td className='w-20 text-center'>{data.countryCode}</td>
											<td className='w-20 text-center'>{data.phoneCode}</td>
											<td className='w-40 text-center'>{data.isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
											<td onClick={rowClickHandler}>
												<div className='flex items-center'>
													<EditButton data={data} editRecord={editRecord} />
													<DeleteButton data={data} isDeleteStatusModal={deleteCountryDataModal} />
													<StatusButton data={data} isChangeStatusModal={onChangeStatus} status={`${data.isActive}`} checked={data.isActive} />
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!countryData?.data?.data?.length && <p className='text-center'>No Country Found</p>}
					</div>
					<Pagination length={countryData?.data?.count as number} onSelect={handleCountryPageClick} limit={filterCountryData.limit} />
				</div>
			</div>
			{isStatusModelShow && <ChangeStatus onClose={onCloseCountry} changeStatus={changeCountryStatus} />}
			{isDeleteCountry && <DeleteModel onClose={onCloseCountry} deleteData={deleteCountry} />}
			{isAddEditModel && <AddEditCountryModal onClose={onCloseCountry} onSubmit={getCountryData} editData={editData} disabled={disabled} />}
		</div>
	);
};
export default Level;
