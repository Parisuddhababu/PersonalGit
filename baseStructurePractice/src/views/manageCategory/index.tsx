import React, { useCallback, useEffect, useState } from 'react';
import { FETCH_CATEGORIES } from '@framework/graphql/queries/category';
import { useMutation, useQuery } from '@apollo/client';
import { CategoryDataArr, categoryData, categoryDataArr } from '@framework/graphql/graphql';
import { ColArrType, PaginationParams } from 'src/types/category';
import { GetDefaultIcon, GetAscIcon, GetDescIcon, TreeViewIcon } from '@components/icons/index';
import { Edit, MenuBurger, PlusCircle, Trash } from '@components/icons';
import ChangeStatusModel from './changeStatusModel';
import { ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import TextInput from '@components/input/TextInput';
import { CATEGORY_STATUS_UPDATE, DELETE_CATEGORY_ID, GROUP_DELETE_CATEGORY } from '@framework/graphql/mutations/category';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DeleteModel from './deleteCategory';
import { useTranslation } from 'react-i18next';
import Pagination from '@components/pagination/pagination';
import CustomSelect from '@components/select/select';
import Button from '@components/button/button';

const Category = () => {
	const { data, refetch: fetchCategoryDetails } = useQuery(FETCH_CATEGORIES);
	const [updateCategoryStatus] = useMutation(CATEGORY_STATUS_UPDATE);
	const [deleteCategoryById] = useMutation(DELETE_CATEGORY_ID);
	const [groupDeleteCategory] = useMutation(GROUP_DELETE_CATEGORY);
	const [categoryData, setCategoryData] = useState({} as categoryData); //all category data
	const [categoryObj, setCategoryObj] = useState({} as categoryDataArr);
	const [isDeleteCategory, setIsDeleteCategory] = useState(false); //to show model for delete
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false); //To show model for status change
	const [isGroupDeleteModelShow, setGroupDeleteModelShow] = useState<boolean>(false);
	const [selectedAllCategory, setSelectedAllCategory] = useState(false);
	const [selectedCategoryValues, setSelectedCategoryValues] = useState<number[][]>([]);
	const navigate = useNavigate();
	const { t } = useTranslation();

	//filter data
	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: 10,
		page: 1,
		search: '',
		sortBy: '',
		sortOrder: '',
	});
	//col data
	const COL_ARR = [
		{ name: t('Sr.No'), sortable: false },
		{ name: t('Category Name'), sortable: true, feildName: 'category_name' },
		{
			name: t('Parent Category'),
			sortable: true,
			feildName: 'parent_category',
		},
		{ name: t('Status'), sortable: true, feildName: 'status' },
	] as ColArrType[];

	//session storage data
	useEffect(() => {
		const filteredCategoryData: PaginationParams | null = JSON.parse(sessionStorage.getItem('categoryFilterData') || 'null');

		if (filteredCategoryData !== null && typeof filteredCategoryData === 'object') {
			setFilterData(filteredCategoryData);
		}
	}, []);

	useEffect(() => {
		sessionStorage.setItem('categoryFilterData', JSON.stringify(filterData));
		fetchCategoryDetails(filterData);
	}, [filterData, fetchCategoryDetails]);

	/* handler to store sort data*/
	const categorySortHandler = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
		});
	};

	/* Handler for page click*/
	const pageClickHandler = useCallback(
		(event: { selected: number }) => {
			setFilterData({ ...filterData, page: event.selected + 1 });
		},
		[filterData]
	);

	/* dropdown for page limit*/
	const dropdownSelectHandler = (e: string) => {
		setFilterData({ ...filterData, limit: parseInt(e), page: 1 });
	};

	/* Used for setcategory data from res in local variable*/
	useEffect(() => {
		if (data?.fetchCategory) {
			setCategoryData(data?.fetchCategory?.data);
		}
		if (!selectedCategoryValues?.length && data?.fetchCategory !== undefined) {
			const totalPages = Math.ceil(data?.fetchCategory?.data?.Categorydata.length / filterData?.limit);
			const pages = [];
			for (let i = 0; i < totalPages; i++) {
				pages.push([]);
			}
			setSelectedCategoryValues(pages);
		}
	}, [data?.fetchCategory, filterData?.limit, selectedCategoryValues?.length]);

	//for status updating model
	const onChangeStatus = (data: categoryDataArr) => {
		setIsStatusModelShow(true);
		setCategoryObj(data);
	};
	//model for close
	const onClose = () => {
		setIsStatusModelShow(false);
	};
	//function to change status
	const changecategoryStatus = () => {
		updateCategoryStatus({
			variables: {
				categoryStatusUpdateId: categoryObj?.id,
				status: categoryObj.status === 1 ? 0 : 1,
			},
		})
			.then((res) => {
				const data = res.data;
				if (data.categoryStatusUpdate.meta.statusCode === 200) {
					toast.success(data.categoryStatusUpdate.meta.message);
					setIsStatusModelShow(false);
					fetchCategoryDetails(filterData);
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	};
	//to select all ids
	useEffect(() => {
		if (selectedAllCategory) {
			fetchCategoryDetails().then((res) => {
				setSelectedCategoryValues(res?.data?.fetchCategory?.data?.Categorydata?.map((i: CategoryDataArr) => i.id));
			});
		}
	}, [data?.fetchCategory]);

	//Function to return the selected category
	const SelCategoryFun = () => {
		return selectedCategoryValues[filterData.page - 1];
	};
	///group delete category function
	const groupDeleteHandler = useCallback(() => {
		groupDeleteCategory({
			variables: {
				categoryIds: selectedCategoryValues[filterData.page - 1],
			},
		})
			.then((res) => {
				const data = res?.data;
				if (data?.groupDeleteCategories?.meta?.statusCode === 200) {
					toast.success(data?.groupDeleteCategories?.meta?.message);
					setGroupDeleteModelShow(false);
					fetchCategoryDetails(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to delete category'));
			});
		SelCategoryFun();
	}, [selectedCategoryValues]);

	//delete category
	const onCloseDeleteModel = () => {
		setIsDeleteCategory(false);
		setGroupDeleteModelShow(false);
	};
	//delete handler
	const deleteCategory = (data: CategoryDataArr) => {
		setCategoryObj(data);
		setIsDeleteCategory(true);
	};
	//function to delete data
	const deleteCategoryData = useCallback(() => {
		console.log(categoryObj);
		deleteCategoryById({
			variables: {
				deleteCategoryId: categoryObj.id,
			},
		})
			.then((res) => {
				const data = res.data;
				if (data.deleteCategory.meta.statusCode === 200) {
					toast.success(data.deleteCategory.meta.message);
					setIsDeleteCategory(false);
				} else if (data.deleteCategory.meta.status === 'ERROR') {
					toast.error(data.deleteCategory.meta.message);
					fetchCategoryDetails(filterData).catch((e) => toast.error(e));
					setIsDeleteCategory(false);
				}
			})
			.catch(() => {
				toast.error(data.deleteCategory.meta.message);
			});
	}, [categoryObj, data?.deleteCategory?.meta.message, deleteCategoryById, filterData, fetchCategoryDetails]);

	useEffect(() => {
		if (selectedCategoryValues?.length === data?.fetchCategory?.data?.Categorydata?.length) {
			setSelectedAllCategory(true);
		} else {
			setSelectedAllCategory(false);
		}
	}, [selectedCategoryValues]);

	const handleDeleteCategory = useCallback(() => {
		if (selectedCategoryValues[filterData.page - 1]?.length > 0) {
			setGroupDeleteModelShow(true);
		} else {
			toast.error('Please select atleast one record');
		}
	}, [selectedCategoryValues]);

	// ...
	const categorySelectHandler = (CategoryId: number) => {
		const selectedCategoryIds = [...selectedCategoryValues];

		if (!Array.isArray(selectedCategoryIds[filterData.page - 1])) {
			selectedCategoryIds[filterData.page - 1] = []; // Initialize as an empty array
		}

		const isSelected = selectedCategoryIds?.[filterData.page - 1]?.includes(CategoryId);
		if (isSelected) {
			selectedCategoryIds[filterData.page - 1] = selectedCategoryIds?.[filterData.page - 1]?.filter((id: number) => id !== CategoryId);
		} else {
			selectedCategoryIds[filterData.page - 1] = [...selectedCategoryIds[filterData.page - 1], CategoryId];
		}
		setSelectedCategoryValues(selectedCategoryIds);
	};

	// ...

	// to select and deselect all checkboxes
	const selectAllHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedCategoryIds = [...selectedCategoryValues];
		if (!event.target.checked) {
			selectedCategoryIds[filterData.page - 1] = [];
			setSelectedCategoryValues(selectedCategoryIds);
		} else {
			selectedCategoryIds[filterData.page - 1] = data?.fetchCategory?.data?.Categorydata?.map((i: CategoryDataArr) => {
				return i.id;
			});
			setSelectedCategoryValues(selectedCategoryIds);
		}
	};

	const [recordsPerPage, setRecordsperpage] = useState<number>(filterData.limit);
	const totalUsermangment = data?.fetchCategory?.data?.count || 0;
	const totalPages = Math.ceil(totalUsermangment / recordsPerPage);

	useEffect(() => {
		setRecordsperpage(filterData.limit);
	}, [filterData.limit]);

	const onSearchcategory = (e: string) => {
		setFilterData({ ...filterData, search: e, page: 1 });
	};

	const hasPreviousPage = filterData.page > 1;
	const hasNextPage = filterData.page < Math.ceil(categoryData?.count / filterData?.limit);

	return (
		<div>
			{/* main div  */}
			<div className=' bg-white shadow-lg rounded-sm overflow-auto  border border-[#c8ced3] mx-8 my-4 mb-16'>
				<div className='bg-[#f0f3f5] py-3 px-3 flex items-center justify-between border-b border-[#c8ced3]'>
					<div className='flex '>
						<MenuBurger className='mr-2' fontSize='18px' />
						{t('Category List')}
					</div>
					<div className='btn-group flex flex-col md:flex-row  '>
						<div className='btn-group flex flex-col md:flex-row  '>
							<Button className='btn-primary btn-normal mb-2' onClick={handleDeleteCategory} type='button' label={t('Delete Selected')}>
								<Trash className='mr-1' />
							</Button>
							<Button className='btn-primary btn-normal mb-2' onClick={() => navigate(`/${ROUTES.app}/${ROUTES.category}/addTreeView`)} type='button' label={t('Category TreeView')}>
								<TreeViewIcon className='mr-1' />
							</Button>
							<Button className='btn-primary btn-normal mb-2' onClick={() => navigate(`/${ROUTES.app}/${ROUTES.category}/add`)} type='button' label={t('Add New')}>
								<PlusCircle className='mr-1 text-white' />
							</Button>
						</div>
					</div>
				</div>
				<div>
					<div className='p-3 flex flex-col justify-start   mb-3 text-slate-700 md:flex-row md:justify-between'>
						<div className='mb-4'>
							<span className=' text-sm text-gray-700 font-normal '>{t('Show')}</span>
							<CustomSelect options={SHOW_PAGE_COUNT_ARR} value={filterData.limit} onChange={(e) => dropdownSelectHandler(e)} />
							<span className=' text-sm text-gray-700 font-normal'>{t('entries')}</span>
						</div>
						<div>
							<TextInput placeholder={t('Search')!} value={filterData?.search} type='text' onChange={(e) => onSearchcategory(e.target.value)} />
						</div>
					</div>
				</div>
				{/* table */}
				<div className=' p-3 overflow-auto custom-datatable '>
					<table>
						<thead>
							<tr>
								<th scope='col' className='text-center'>
									<input type='checkbox' checked={selectedCategoryValues[filterData?.page - 1]?.length === data?.fetchCategory?.data?.Categorydata?.length} onChange={selectAllHandler} />
								</th>

								{COL_ARR?.map((colVal: ColArrType) => {
									return (
										<th scope='col' key={colVal.feildName}>
											<div className={`${colVal.name === t('Sr.No') || colVal.name === t('Status') ? 'flex items-center justify-center' : 'flex items-center'}`}>
												{colVal.name}
												{colVal.sortable && (
													<p onClick={() => categorySortHandler(colVal.feildName)}>
														{(filterData.sortOrder === '' || filterData.sortBy !== colVal.feildName) && GetDefaultIcon()}
														{filterData.sortOrder === 'asc' && filterData.sortBy === colVal.feildName && GetAscIcon()}
														{filterData.sortOrder === 'desc' && filterData.sortBy === colVal.feildName && GetDescIcon()}
													</p>
												)}
											</div>
										</th>
									);
								})}
								<th scope='col' className=' text-center'>
									{t('Action')}
								</th>
							</tr>
						</thead>
						<tbody>
							{data?.fetchCategory?.data?.Categorydata?.map((data: categoryDataArr, index: number) => {
								return (
									<tr key={`${index + 1}`}>
										<td className='text-center'>
											<input type='checkbox' id={`${data.id}`} checked={selectedCategoryValues[filterData?.page - 1]?.includes(data.id)} onChange={() => categorySelectHandler(data.id)} />
										</td>
										<th scope='row' className='text-center font-normal'>
											{index + 1}
										</th>
										<td>{data.category_name}</td>
										<td>{data?.parentData?.category_name}</td>
										<td className='text-center'>{data.status === 1 ? <span className='badge badge-success rounded'>Active </span> : <span className='badge badge-danger rounded'>InActive</span>}</td>
										<td>
											<div className='flex justify-center'>
												<div className='mx-2'>
													<span onClick={() => onChangeStatus(data)} className='font-medium text-[#BB3F42] dark:text-[#BB3F42] hover:underline'>
														<label className='relative inline-flex items-center cursor-pointer'>
															<input type='checkbox' value={data.status} className='sr-only peer' checked={data.status === 1} onClick={() => onChangeStatus(data)} />
															<div className={'w-7 h-4 bg-gray-200 rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-primary'}></div>
														</label>
													</span>
												</div>

												<div className='mx-2' onClick={() => navigate(`/${ROUTES.app}/${ROUTES.category}/edit/${data.id}`)}>
													<Edit className='text-[#BB3F42]' />
												</div>
												<div className='mx-2' onClick={() => deleteCategory(data)}>
													<Trash className='text-[#BB3F42]' />
												</div>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					{!data?.fetchCategory?.data?.Categorydata.length && <p className='text-center text-red-500'>No Data</p>}
				</div>
				<div className='px-6 mb-4 flex items-center justify-between '>
					<span className='text-slate-400'>
						{' '}
						{categoryData?.count} {t('Total Records')}
					</span>
					<Pagination pageCount={totalPages} currentPage={filterData?.page} onPageChange={pageClickHandler} hasPreviousPage={hasPreviousPage} hasNextPage={hasNextPage} />
				</div>
				{/* changing status model */}
				{isStatusModelShow && <ChangeStatusModel onClose={onClose} changeCategoryStatus={changecategoryStatus} />}
				{isDeleteCategory && <DeleteModel onClose={onCloseDeleteModel} deleteCategoryData={deleteCategoryData} />}
				{isGroupDeleteModelShow && <DeleteModel onClose={onCloseDeleteModel} deleteCategoryData={groupDeleteHandler} />}
			</div>
			{/* main div end  */}
		</div>
	);
};
export default Category;
