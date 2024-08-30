import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, PaginationParams } from 'src/types/common';
import { PlusCircle, Question } from '@components/icons';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { sortOrder } from '@utils/helpers';
import { Loader } from '@components/index';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@config/constant';
import { DataToSubmit, DndTableItem } from 'src/types/lesson';
import { APIService } from '@framework/services/api';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import TotalRecords from '@components/totalRecords/totalRecords';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import AddEditWhyItWorksModal from './AddEditWhyItWorks';
import { OnboardingData, OnboardingDataArr } from 'src/types/onboarding';
import DndTable from '@components/dnd/DndTable';

const WhyItWorks = () => {
	useEscapeKeyPress(() => onCloseWhyItWorks()); // use to close model on Eac key.
	const [whyItWorksData, setWhyItWorksData] = useState<OnboardingData>();
	const [isDeleteWhyItWorks, setIsDeleteWhyItWorks] = useState<boolean>(false);
	const [isAddEditModelWhyItWorks, setIsAddEditModelWhyItWorks] = useState<boolean>(false);
	const [editDataWhyItWorks, setEditDataWhyItWorks] = useState<OnboardingDataArr | null>(null);
	const [disableDataWhyItWorks, setDisableDataWhyItWorks] = useState<boolean>(false);
	const [loaderWhyItWork, setLoaderWhyItWork] = useState<boolean>(false);
	const [orderChangedWhyItWorks, setOrderChangedWhyItWorks] = useState<boolean>(false);
	const [newOrderWhyItWorks, setNewOrderWhyItWorks] = useState<DndTableItem[]>();
	const dataToSubmitWhyItWorks: DataToSubmit = [];
	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrderValues.asc,
		search: '',
	});

	const COL_ARR = [
		{ name: 'Order', sortable: false },
		{ name: 'Title', sortable: true, fieldName: 'title' },
		{ name: 'Image or Video', sortable: false },
	] as ColArrType[];

	/**
	 *
	 * @param  Method used for fetching contentList
	 */
	const getWhyItWorksContentList = useCallback(() => {
		setLoaderWhyItWork(true);
		APIService.getData(`${URL_PATHS.whyItWorks}/list?resolution=1920x1080&sortOrder=${filterData.sortOrder}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setWhyItWorksData(response?.data);
				}
				setLoaderWhyItWork(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderWhyItWork(false);
			});
	}, [filterData]);

	/**
	 *
	 * @param  Method used for after sort refetching Data
	 */
	useEffect(() => {
		getWhyItWorksContentList();
	}, [filterData]);

	/**
	 * @param data Method used for show whyItWorks delete modal
	 */
	const deleteWhyItWorksDataModal = useCallback((data: OnboardingDataArr) => {
		setEditDataWhyItWorks(data);
		setIsDeleteWhyItWorks(true);
	}, []);

	/**
	 *
	 * @param id  Method used for call delete whyItWorks data api
	 */
	const deleteWhyItWorksData = () => {
		setLoaderWhyItWork(true);
		APIService.deleteData(`${URL_PATHS.whyItWorks}/${editDataWhyItWorks?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data?.message);
					getWhyItWorksContentList();
				}
				setLoaderWhyItWork(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoaderWhyItWork(false);
			});
	};

	/**
	 * Method used for delete whyItWorks data
	 */
	const deleteWhyItWorksDataById = useCallback(() => {
		deleteWhyItWorksData();
		setIsDeleteWhyItWorks(false);
		setEditDataWhyItWorks(null);
	}, [isDeleteWhyItWorks]);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortWhyItWorks = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterData.sortOrder),
		});
	};

	/**
	 *
	 * @param data Method used for Edit Current selected Record
	 */
	const editRecordWhyItWorks = useCallback((data: OnboardingDataArr) => {
		setEditDataWhyItWorks(data);
		setIsAddEditModelWhyItWorks(true);
	}, []);

	/**
	 * Method used for close modal
	 */
	const onCloseWhyItWorks = useCallback(() => {
		setIsDeleteWhyItWorks(false);
		setIsAddEditModelWhyItWorks(false);
		setEditDataWhyItWorks(null);
		setDisableDataWhyItWorks(false);
	}, []);

	/**
	 *
	 * Method used for view Current selected details
	 */
	const showDetailsWhyItWorks = useCallback((data: OnboardingDataArr) => {
		editRecordWhyItWorks(data);
		setDisableDataWhyItWorks(true);
	}, []);

	/**
	 *
	 * Method used for Submit Order change
	 */
	const submitOrder = useCallback(() => {
		setLoaderWhyItWork(true);
		const data = newOrderWhyItWorks;
		data?.map((item, index) => {
			dataToSubmitWhyItWorks.push({ order: index + 1, uuid: item.uuid });
		});
		APIService.patchData(`${URL_PATHS.whyItWorks}/order`, {
			order: dataToSubmitWhyItWorks,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					getWhyItWorksContentList();
					setOrderChangedWhyItWorks(false);
					toast.success(response?.data?.message);
				}
				setLoaderWhyItWork(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderWhyItWork(false);
			});
		setOrderChangedWhyItWorks(false);
	}, [dataToSubmitWhyItWorks]);

	/**
	 *
	 * Method used for Cancel Order change and get previous list
	 */
	const cancelOrderChange = useCallback(() => {
		getWhyItWorksContentList();
		setOrderChangedWhyItWorks(false);
		setEditDataWhyItWorks(null);
	}, []);

	const showAddEditModalWhyItWorks = useCallback(() => {
		setIsAddEditModelWhyItWorks(true);
	}, []);

	return (
		<div>
			{loaderWhyItWork && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Question className='inline-block mr-2 text-primary' /> Why it works
					</h6>
					<Button className='btn-primary btn-large' onClick={showAddEditModalWhyItWorks}>
						<PlusCircle className='mr-1' /> Add New
					</Button>
				</div>
				<div className='p-3 w-full'>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									<th scope='col' className='w-10'></th>
									{COL_ARR?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												<div className='flex items-center'>
													{colVal.name}
													{colVal.sortable && (
														<a onClick={() => onHandleSortWhyItWorks(colVal.fieldName)}>
															{(filterData.sortOrder === '' || filterData.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterData.sortOrder === sortOrderValues.asc && filterData.sortBy === colVal.fieldName && getAscIcon()}
															{filterData.sortOrder === sortOrderValues.desc && filterData.sortBy === colVal.fieldName && getDescIcon()}
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
							<tbody>{whyItWorksData && <DndTable dndItemRow={whyItWorksData.data.data} showDetails={showDetailsWhyItWorks} editRecord={editRecordWhyItWorks} deleteTopicData={deleteWhyItWorksDataModal} setDisableData={setDisableDataWhyItWorks} setOrderChanged={setOrderChangedWhyItWorks} setNewOrder={setNewOrderWhyItWorks} />}</tbody>
						</table>
						{orderChangedWhyItWorks && (
							<div className='flex justify-center mt-3'>
								<Button onClick={submitOrder} className='btn-primary btn-large'>
									Save order
								</Button>
								<Button onClick={cancelOrderChange} className='btn-default ml-3 btn-large'>
									Cancel
								</Button>
							</div>
						)}
						{!whyItWorksData?.data.record && <p className='text-center'>No Why It Works Data Found</p>}
					</div>
					<div className='flex items-center justify-between mt-8 max-md:flex-col max-md:items-start'>
						<TotalRecords length={whyItWorksData?.data.record as number} />
					</div>
				</div>
			</div>
			{isDeleteWhyItWorks && <DeleteModel onClose={onCloseWhyItWorks} deleteData={deleteWhyItWorksDataById} />}
			{isAddEditModelWhyItWorks && <AddEditWhyItWorksModal onSubmit={getWhyItWorksContentList} onClose={onCloseWhyItWorks} editData={editDataWhyItWorks} disableData={disableDataWhyItWorks} />}
		</div>
	);
};
export default WhyItWorks;
