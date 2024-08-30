import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, PaginationParams } from 'src/types/common';
import { PlusCircle, Search, Store } from '@components/icons';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { DEFAULT_LIMIT, DEFAULT_PAGE, endPoint } from '@config/constant';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { debounce } from 'lodash';
import TextInput from '@components/textInput/TextInput';
import { PetProductsArr, PetStoreProducts } from 'src/types/petStoreProducts';
import AddEditPetProductModal from './AddEditPet';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';
import TotalRecords from '@components/totalRecords/totalRecords';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

const PetStore = () => {
	useEscapeKeyPress(() => onCloseProducts()); // use to close model on Eac key.
	const [petStoreData, setPetStoreData] = useState<PetStoreProducts>();
	const [isDeletePetProduct, setIsDeletePetProduct] = useState<boolean>(false);
	const [isAddEditModal, setIsAddEditModal] = useState<boolean>(false);
	const [editData, setEditData] = useState<PetProductsArr | null>(null);
	const [loaderProducts, setLoaderProducts] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);

	const [filterProductsData, setFilterProductsData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrderValues.asc,
		search: '',
	});

	const COL_ARR_PRODUCTS = [{ name: 'Sr. No' }, { name: 'Product Name' }, { name: 'Product Image' }, { name: 'Unlocks At Level' }, { name: 'Unlocks At Seasonal' }, { name: 'No of Stars' }, { name: 'Status' }] as ColArrType[];

	/**
	 * @returns Method is used to get the pet Store data from api
	 */
	const getPetProductsData = useCallback(() => {
		setLoaderProducts(true);
		APIService.getData(`${URL_PATHS.petStore}/${endPoint.list}?search=${filterProductsData.search}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setPetStoreData(response?.data);
					setLoaderProducts(false);
				} else {
					toast.error(response?.data.message);
					setLoaderProducts(false);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderProducts(false);
			});
	}, [filterProductsData]);

	/**
	 * Method is used to fetch the pet  Store data from API on page load.
	 */
	useEffect(() => {
		getPetProductsData();
	}, [filterProductsData]);

	/**
	 * Method is used to delete the pet Store data from api
	 */
	const deleteProductData = () => {
		APIService.deleteData(`${URL_PATHS.petStore}/${editData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getPetProductsData();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
			});
	};

	/**
	 * Method Used to send boolean true or false
	 * @param value: true or false
	 */
	const updateProductStatus = (value: boolean) => {
		APIService.postData(`${URL_PATHS.petStore}/${endPoint.statusChange}/${editData?.uuid}`, {
			isActive: value,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getPetProductsData();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
			});
	};

	/**
	 * Method used for show  product delete modal
	 * @param data
	 */
	const deleteProductDataModal = useCallback((data: PetProductsArr) => {
		setEditData(data);
		setIsDeletePetProduct(true);
	}, []);

	/**
	 * Method used for delete product Store data
	 */
	const deleteProduct = useCallback(() => {
		deleteProductData();
		setIsDeletePetProduct(false);
		setEditData(null);
	}, [isDeletePetProduct]);

	/**
	 * Method used for store search value
	 * @param e
	 */
	const handleProductsSearch = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterProductsData({ ...filterProductsData, search: searchTerm });
		}, 500),
		[]
	);

	/**
	 * Method used for Edit Current selected Record
	 * @param data
	 */
	const editRecord = useCallback((data: PetProductsArr) => {
		setEditData(data);
		setIsAddEditModal(true);
	}, []);

	/**
	 * Method used for close modal
	 */
	const onCloseProducts = useCallback(() => {
		setIsDeletePetProduct(false);
		setIsAddEditModal(false);
		setEditData(null);
		setDisabled(false);
		setIsStatusModelShow(false);
	}, []);

	/**
	 * Method for handle the bubbling
	 * @param e
	 */
	const rowClickProductsHandler = (e: { stopPropagation: () => void }) => {
		e.stopPropagation();
	};

	/**
	 *
	 * @param data Method used for show subAdmin change status modal
	 */
	const onChangeStatus = useCallback((data: PetProductsArr) => {
		setEditData(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 * Method used for change user status with API
	 */
	const changePetProductsStatus = useCallback(() => {
		const data = editData?.isActive;
		updateProductStatus(!data);
		setIsStatusModelShow(false);
		setEditData(null);
	}, [isStatusModelShow]);

	const showAddEditProductsModal = useCallback(() => {
		setIsAddEditModal(true);
	}, []);

	return (
		<div>
			{loaderProducts && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Store className='inline-block mr-2 text-primary' /> Pet Store Products
					</h6>
					<RoleBaseGuard permissions={[permissionsArray.PET_STORE_PRODUCT_MANAGEMENT.AddAccess]}>
						<Button className='btn-primary btn-large' onClick={showAddEditProductsModal}>
							<PlusCircle className='mr-1' /> Add New
						</Button>
					</RoleBaseGuard>
				</div>
				<div className='p-3 w-full'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleProductsSearch} inputIcon={<Search />} />
						</div>
					</div>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									{COL_ARR_PRODUCTS?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												<div className='flex items-center'>{colVal.name}</div>
											</th>
										);
									})}
									<th scope='col' className='w-40'>
										Action
									</th>
								</tr>
							</thead>

							<tbody>
								{petStoreData?.data?.map((data, index: number) => {
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
											<td className='font-medium'>{data.productName}</td>
											<td className='w-40 text-center'>
												<img className='border rounded w-32 min-w-[80px] h-20 min-h-[80px]' src={data.image} alt='Product' />
											</td>
											<td className='font-medium w-28 text-center'>{data.levelName}</td>
											<td className='font-medium w-28 text-center'>{data.topicName}</td>
											<td className='font-medium w-20 text-center'>{data.stars}</td>
											<td className='w-20 text-center'>{data.isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
											<td className='cursor-default' onClick={rowClickProductsHandler}>
												<div className='flex justify-center items-center'>
													<RoleBaseGuard permissions={[permissionsArray.PET_STORE_PRODUCT_MANAGEMENT.EditAccess]}>
														<EditButton data={data} editRecord={editRecord} />
													</RoleBaseGuard>
													<RoleBaseGuard permissions={[permissionsArray.PET_STORE_PRODUCT_MANAGEMENT.DeleteAccess]}>
														<DeleteButton data={data} isDeleteStatusModal={deleteProductDataModal} disable={data.position === 3} />
													</RoleBaseGuard>
													<RoleBaseGuard permissions={[permissionsArray.PET_STORE_PRODUCT_MANAGEMENT.ChangeStatusAccess]}>
														<StatusButton data={data} isChangeStatusModal={onChangeStatus} status={`${data.isActive}`} checked={data.isActive} />
													</RoleBaseGuard>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!petStoreData?.data?.length && <p className='text-center'>No Pet Store Products Found</p>}
					</div>
					<TotalRecords length={petStoreData?.data?.length ?? 0} />
				</div>
			</div>
			{isStatusModelShow && <ChangeStatus onClose={onCloseProducts} changeStatus={changePetProductsStatus} />}
			{isDeletePetProduct && <DeleteModel onClose={onCloseProducts} deleteData={deleteProduct} />}
			{isAddEditModal && <AddEditPetProductModal onClose={onCloseProducts} onSubmit={getPetProductsData} editData={editData} disabled={disabled} />}
		</div>
	);
};
export default PetStore;
