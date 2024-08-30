import React, { useCallback, useEffect, useState } from 'react';
import { sortOrder } from '@utils/helpers';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import DeleteModel from '@views/deleteModel/DeleteModel';
import Button from '@components/button/Button';
import { ListCheck, PlusCircle, Search } from '@components/icons';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import Pagination from '@components/pagination/Pagination';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, endPoint } from '@config/constant';
import { URL_PATHS } from '@config/variables';
import { APIService } from '@framework/services/api';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { debounce } from 'lodash';
import { ColArrType, PaginationParams } from 'src/types/common';
import TextInput from '@components/textInput/TextInput';
import AddEditCategoryModal from './AddEditCategory';
import { CategoryResponse, categoryDataArr } from 'src/types/flashCardCategories';
import { useNavigate } from 'react-router-dom';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

const FlashCardCategory = () => {
	const navigate = useNavigate();
	useEscapeKeyPress(() => onCloseCategory()); // use to close model on Eac key.
	const [categoryData, setCategoryData] = useState<CategoryResponse>();
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [isDeleteCategory, setIsDeleteCategory] = useState<boolean>(false);
	const [isAddEditModel, setIsAddEditModel] = useState<boolean>(false);
	const [editData, setEditData] = useState<categoryDataArr | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [filterCategoryData, setFilterCategoryData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrderValues.asc,
		search: '',
	});

	const COL_ARR = [{ name: 'Sr.No' }, { name: 'Category Name', sortable: true, fieldName: 'categoryName' }, { name: 'Status' }] as ColArrType[];

	/**
	 * Used for get categories data from api
	 */
	const getCategoryDetails = useCallback(() => {
		setLoading(true);
		APIService.getData(`${URL_PATHS.flashCardCategories}/${endPoint.list}?page=${filterCategoryData.page}&limit=${filterCategoryData.limit}&sortBy=${filterCategoryData.sortBy}&sortOrder=${filterCategoryData.sortOrder}&search=${filterCategoryData.search}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setCategoryData(response?.data);
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoading(false);
			});
	}, [filterCategoryData]);

	/**
	 * Method used to fetch categories list
	 */
	useEffect(() => {
		getCategoryDetails();
	}, [filterCategoryData]);

	/**
	 *
	 * @param data Method used for show category change status modal
	 */
	const onChangeStatus = useCallback((data: categoryDataArr) => {
		setEditData(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 *
	 * @param value used to send boolean true or false
	 */
	const updateCategoryStatus = (value: boolean) => {
		setLoading(true);
		APIService.patchData(`${URL_PATHS.flashCardCategories}/change-status/${editData?.uuid}`, {
			isActive: value,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getCategoryDetails();
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoading(false);
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
	 * @param data Method used for show category delete modal
	 */
	const deleteCategoryDataModal = useCallback((data: categoryDataArr) => {
		setEditData(data);
		setIsDeleteCategory(true);
	}, []);

	/**
	 * Method used for delete category data api call
	 */
	const deleteCategoryData = () => {
		setLoading(true);
		APIService.deleteData(`${URL_PATHS.flashCardCategories}/${editData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getCategoryDetails();
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoading(false);
			});
	};

	/**
	 * Method used for delete category data
	 */
	const deleteCategory = useCallback(() => {
		deleteCategoryData();
		setIsDeleteCategory(false);
		setEditData(null);
	}, [isDeleteCategory]);

	/**
	 *
	 * @param event Method used for on page click
	 */
	const handleCategoryPageClick = useCallback(
		(event: { selected: number }) => {
			setFilterCategoryData({ ...filterCategoryData, page: event.selected + 1 });
		},
		[filterCategoryData]
	);

	/**
	 *
	 * @param values Method used for set filter data
	 */
	const handleCategorySearch = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterCategoryData({ ...filterCategoryData, search: searchTerm });
		}, 500),
		[filterCategoryData]
	);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onCategoryHandleSort = (sortFieldName: string) => {
		setFilterCategoryData({
			...filterCategoryData,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterCategoryData.sortOrder),
		});
	};

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onPageDrpSelect = useCallback(
		(e: string) => {
			setFilterCategoryData({ ...filterCategoryData, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterCategoryData]
	);

	/**
	 * Method used for close modal
	 */
	const onCloseCategory = useCallback(() => {
		setIsStatusModelShow(false);
		setIsDeleteCategory(false);
		setIsAddEditModel(false);
		setEditData(null);
	}, []);

	/**
	 *
	 * @param data Method used for Edit Current selected Record
	 */
	const editRecord = useCallback((data: categoryDataArr) => {
		setEditData(data);
		setIsAddEditModel(true);
	}, []);

	/**
	 * Method for handle the bubbling
	 * @param e
	 */
	const rowClickCategoryHandler = (e: { stopPropagation: () => void }) => {
		e.stopPropagation();
	};

	const showAddEditCategoryModal = useCallback(() => {
		setIsAddEditModel(true);
	}, []);

	return (
		<div>
			{loading && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<ListCheck className='mr-1 text-primary' /> Category List
					</h6>
					<RoleBaseGuard permissions={[permissionsArray.CATEGORY_MANAGEMENT.AddAccess]}>
						<Button className='btn-primary btn-large' onClick={showAddEditCategoryModal}>
							<PlusCircle className='mr-1' /> Add New
						</Button>
					</RoleBaseGuard>
				</div>
				<div className='p-3 w-full'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleCategorySearch} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onPageDrpSelect} value={filterCategoryData.limit} />
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
														<button onClick={() => onCategoryHandleSort(colVal.fieldName)}>
															{(filterCategoryData.sortOrder === '' || filterCategoryData.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterCategoryData.sortOrder === sortOrderValues.asc && filterCategoryData.sortBy === colVal.fieldName && getAscIcon()}
															{filterCategoryData.sortOrder === sortOrderValues.desc && filterCategoryData.sortBy === colVal.fieldName && getDescIcon()}
														</button>
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
								{categoryData?.data?.categories.map((data, index) => {
									return (
										<tr
											className='cursor-pointer'
											key={data.id}
											onClick={() => {
												navigate(`/${ROUTES.app}/${ROUTES.flashCardList}/${data.uuid}`);
											}}
										>
											<th scope='row' className='w-20 text-center'>
												{index + 1}
											</th>
											<td className='font-medium'>{data.categoryName}</td>
											<td className='w-40 text-center'>{data.isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
											<td className='cursor-default' onClick={rowClickCategoryHandler}>
												<div className='flex justify-center items-center'>
													<RoleBaseGuard permissions={[permissionsArray.CATEGORY_MANAGEMENT.EditAccess]}>
														<EditButton data={data} editRecord={editRecord} />
													</RoleBaseGuard>
													<RoleBaseGuard permissions={[permissionsArray.CATEGORY_MANAGEMENT.DeleteAccess]}>
														<DeleteButton data={data} isDeleteStatusModal={deleteCategoryDataModal} />
													</RoleBaseGuard>
													<RoleBaseGuard permissions={[permissionsArray.CATEGORY_MANAGEMENT.ChangeStatusAccess]}>
														<StatusButton data={data} isChangeStatusModal={onChangeStatus} status={`${data.isActive}`} checked={data.isActive} />
													</RoleBaseGuard>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!categoryData?.data?.count && <p className='text-center'>No Flashcard Category Found</p>}
					</div>
					<Pagination length={categoryData?.data?.count as number} onSelect={handleCategoryPageClick} limit={filterCategoryData.limit} />
				</div>
			</div>
			{isStatusModelShow && <ChangeStatus onClose={onCloseCategory} changeStatus={changeCategoryStatus} />}
			{isDeleteCategory && <DeleteModel onClose={onCloseCategory} deleteData={deleteCategory} />}
			{isAddEditModel && <AddEditCategoryModal onClose={onCloseCategory} editData={editData} onSubmit={getCategoryDetails} />}
		</div>
	);
};
export default FlashCardCategory;
