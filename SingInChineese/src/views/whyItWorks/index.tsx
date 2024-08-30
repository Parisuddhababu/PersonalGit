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
import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_RESOLUTION, endPoint } from '@config/constant';
import { DataToSubmit, DndTableItem } from 'src/types/lesson';
import { APIService } from '@framework/services/api';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import TotalRecords from '@components/totalRecords/totalRecords';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import AddEditWhyItWorksModal from './AddEditWhyItWorks';
import { OnboardingData, OnboardingDataArr } from 'src/types/onboarding';
import DndTable from '@components/dnd/DndTable';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import { COL_ARR_ONBOARDING } from '@views/onBoarding';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';
import useDisableDevTools from 'src/hooks/useDisableDevTools';

const WhyItWorks = () => {
	useDisableDevTools();
	useEscapeKeyPress(() => onCloseWhyItWorks()); // use to close model on Eac key.
	const [whyItWorksData, setWhyItWorksData] = useState<OnboardingData>();
	const [isDeleteWhyItWorks, setIsDeleteWhyItWorks] = useState<boolean>(false);
	const [isAddEditModelWhyItWorks, setIsAddEditModelWhyItWorks] = useState<boolean>(false);
	const [editDataWhyItWorks, setEditDataWhyItWorks] = useState<OnboardingDataArr | null>(null);
	const [disableDataWhyItWorks, setDisableDataWhyItWorks] = useState<boolean>(false);
	const [loaderWhyItWork, setLoaderWhyItWork] = useState<boolean>(false);
	const [orderChangedWhyItWorks, setOrderChangedWhyItWorks] = useState<boolean>(false);
	const [newOrderWhyItWorks, setNewOrderWhyItWorks] = useState<DndTableItem[]>();
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const dataToSubmitWhyItWorks: DataToSubmit = [];
	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrderValues.asc,
		search: '',
	});

	/**
	 *
	 * @param  Method used for fetching contentList
	 */
	const getWhyItWorksContentList = useCallback(() => {
		setLoaderWhyItWork(true);
		APIService.getData(`${URL_PATHS.onboarding}/${endPoint.list}?resolution=${DEFAULT_RESOLUTION}&sortOrder=${filterData.sortOrder}&isForOnboarding=false`)
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
		APIService.deleteData(`${URL_PATHS.onboarding}/${editDataWhyItWorks?.uuid}?isForOnboarding=false`)
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
		setIsStatusModelShow(false);
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
		APIService.patchData(`${URL_PATHS.onboarding}/${endPoint.order}`, {
			order: dataToSubmitWhyItWorks,
			isForOnboarding: false,
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

	/**
	 * Method Used to send boolean true or false
	 * @param value: true or false
	 */
	const updateWhyItWorksStatus = (value: boolean) => {
		APIService.patchData(`${URL_PATHS.onboarding}/${editDataWhyItWorks?.uuid}/${endPoint.changeStatus}`, {
			isActive: value,
			isForOnboarding: false,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getWhyItWorksContentList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => toast.error(err.response?.data.message));
	};

	const onChangeStatus = useCallback((data: OnboardingDataArr) => {
		setEditDataWhyItWorks(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 * Method used for change user status with API
	 */
	const changeWhyItWorksStatus = useCallback(() => {
		const data = editDataWhyItWorks?.isActive;
		updateWhyItWorksStatus(!data);
		setIsStatusModelShow(false);
		setEditDataWhyItWorks(null);
	}, [isStatusModelShow]);

	return (
		<div>
			{loaderWhyItWork && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Question className='inline-block mr-2 text-primary' /> Why it works
					</h6>
					<RoleBaseGuard permissions={[permissionsArray.ONBOARDING_MANAGEMENT.AddAccess]}>
						<Button className='btn-primary btn-large' onClick={showAddEditModalWhyItWorks}>
							<PlusCircle className='mr-1' /> Add New
						</Button>
					</RoleBaseGuard>
				</div>
				<div className='p-3 w-full'>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									<th scope='col' className='w-10'></th>
									{COL_ARR_ONBOARDING?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												<div className='flex items-center'>
													{colVal.name}
													{colVal.sortable && (
														<button onClick={() => onHandleSortWhyItWorks(colVal.fieldName)}>
															{(filterData.sortOrder === '' || filterData.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterData.sortOrder === sortOrderValues.asc && filterData.sortBy === colVal.fieldName && getAscIcon()}
															{filterData.sortOrder === sortOrderValues.desc && filterData.sortBy === colVal.fieldName && getDescIcon()}
														</button>
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
							<tbody>{whyItWorksData && <DndTable dndItemRow={whyItWorksData.data.data} showDetails={showDetailsWhyItWorks} editRecord={editRecordWhyItWorks} deleteTopicData={deleteWhyItWorksDataModal} setDisableData={setDisableDataWhyItWorks} setOrderChanged={setOrderChangedWhyItWorks} setNewOrder={setNewOrderWhyItWorks} onChangeStatus={onChangeStatus} />}</tbody>
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
			{isStatusModelShow && <ChangeStatus onClose={onCloseWhyItWorks} changeStatus={changeWhyItWorksStatus} />}
		</div>
	);
};
export default WhyItWorks;
