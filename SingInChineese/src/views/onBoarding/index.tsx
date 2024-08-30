import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, PaginationParams } from 'src/types/common';
import { PlusCircle, Picture } from '@components/icons';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import AddEditOnboardingModal from './AddEditOnboarding';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { sortOrder } from '@utils/helpers';
import { Loader } from '@components/index';
import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_RESOLUTION, endPoint } from '@config/constant';
import DndTable from '@components/dnd/DndTable';
import { DataToSubmit, DndTableItem } from 'src/types/lesson';
import { APIService } from '@framework/services/api';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { OnboardingData, OnboardingDataArr } from 'src/types/onboarding';
import TotalRecords from '@components/totalRecords/totalRecords';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';
import useDisableDevTools from 'src/hooks/useDisableDevTools';

export const COL_ARR_ONBOARDING = [
	{ name: 'Order', sortable: false, fieldName: 'order' },
	{ name: 'Title', sortable: true, fieldName: 'titleInEnglish' },
	{ name: 'Image or Video', sortable: false, fieldName: 'image' },
	{ name: 'Status', sortable: true, fieldName: 'isActive' },
] as ColArrType[];

const Onboarding = () => {
	useDisableDevTools();
	useEscapeKeyPress(() => onCloseOnboarding()); // use to close model on Eac key.
	const [onboardingData, setOnboardingData] = useState<OnboardingData>();
	const [isDeleteOnboarding, setIsDeleteOnboarding] = useState<boolean>(false);
	const [isAddEditModelOnboarding, setIsAddEditModelOnboarding] = useState<boolean>(false);
	const [editDataOnboarding, setEditDataOnboarding] = useState<OnboardingDataArr | null>(null);
	const [disableDataOnboarding, setDisableDataOnboarding] = useState<boolean>(false);
	const [loaderOnboarding, setLoaderOnboarding] = useState<boolean>(false);
	const [orderChangedOnboarding, setOrderChangedOnboarding] = useState<boolean>(false);
	const [newOrderOnboarding, setNewOrderOnboarding] = useState<DndTableItem[]>();
	const dataToSubmitOnboarding: DataToSubmit = [];
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
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
	const getOnboardingContentList = useCallback(() => {
		setLoaderOnboarding(true);
		APIService.getData(`${URL_PATHS.onboarding}/${endPoint.list}?resolution=${DEFAULT_RESOLUTION}&sortOrder=${filterData.sortOrder}&isForOnboarding=true`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setOnboardingData(response?.data);
				}
				setLoaderOnboarding(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderOnboarding(false);
			});
	}, [filterData]);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortOnboarding = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterData.sortOrder),
		});
	};

	/**
	 *
	 * @param  Method used for after sort refetching Data
	 */
	useEffect(() => {
		getOnboardingContentList();
	}, [filterData]);

	/**
	 *
	 * @param id  Method used for call delete onboarding data api
	 */
	const deleteOnboardingData = (id: string) => {
		setLoaderOnboarding(true);
		APIService.deleteData(`${URL_PATHS.onboarding}/${id}?isForOnboarding=true`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getOnboardingContentList();
				}
				setLoaderOnboarding(false);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				setLoaderOnboarding(false);
			});
	};

	/**
	 * Method used for delete onboarding data
	 */
	const deleteOnboardingDataById = useCallback(() => {
		deleteOnboardingData(editDataOnboarding?.uuid as string);
		setIsDeleteOnboarding(false);
		setEditDataOnboarding(null);
	}, [isDeleteOnboarding]);

	/**
	 * Method used for close modal
	 */
	const onCloseOnboarding = useCallback(() => {
		setIsDeleteOnboarding(false);
		setIsAddEditModelOnboarding(false);
		setEditDataOnboarding(null);
		setDisableDataOnboarding(false);
		setIsStatusModelShow(false);
	}, []);

	/**
	 *
	 * @param data Method used for show onboarding delete modal
	 */
	const deleteOnboardingDataModal = useCallback((data: OnboardingDataArr) => {
		setEditDataOnboarding(data);
		setIsDeleteOnboarding(true);
	}, []);

	/**
	 *
	 * @param data Method used for Edit Current selected Record
	 */
	const editRecordOnboarding = useCallback((data: OnboardingDataArr) => {
		setEditDataOnboarding(data);
		setIsAddEditModelOnboarding(true);
	}, []);

	/**
	 *
	 * Method used for view Current selected details
	 */
	const showDetailsOnboarding = useCallback((data: OnboardingDataArr) => {
		editRecordOnboarding(data);
		setDisableDataOnboarding(true);
	}, []);

	/**
	 *
	 * Method used for Submit Order change
	 */
	const submitOrderOnboarding = useCallback(() => {
		setLoaderOnboarding(true);
		const data = newOrderOnboarding;
		data?.map((item, index) => {
			dataToSubmitOnboarding.push({ order: index + 1, uuid: item.uuid });
		});
		APIService.patchData(`${URL_PATHS.onboarding}/${endPoint.order}`, {
			order: dataToSubmitOnboarding,
			isForOnboarding: true,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					getOnboardingContentList();
					setOrderChangedOnboarding(false);
					toast.success(response?.data?.message);
				}
				setLoaderOnboarding(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoaderOnboarding(false);
			});
		setOrderChangedOnboarding(false);
	}, [dataToSubmitOnboarding]);

	/**
	 *
	 * Method used for Cancel Order change and get previous list
	 */
	const cancelOrderChangeOnboarding = useCallback(() => {
		getOnboardingContentList();
		setOrderChangedOnboarding(false);
		setEditDataOnboarding(null);
	}, []);

	const showAddEditModalOnboarding = useCallback(() => {
		setIsAddEditModelOnboarding(true);
	}, []);

	/**
	 * Method Used to send boolean true or false
	 * @param value: true or false
	 */
	const updateOnboardingStatus = (value: boolean) => {
		APIService.patchData(`${URL_PATHS.onboarding}/${editDataOnboarding?.uuid}/${endPoint.changeStatus}`, {
			isActive: value,
			isForOnboarding: true,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getOnboardingContentList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
			});
	};

	const onChangeStatus = useCallback((data: OnboardingDataArr) => {
		setEditDataOnboarding(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 * Method used for change user status with API
	 */
	const changeOnboardingStatus = useCallback(() => {
		const data = editDataOnboarding?.isActive;
		updateOnboardingStatus(!data);
		setIsStatusModelShow(false);
		setEditDataOnboarding(null);
	}, [isStatusModelShow]);

	return (
		<div>
			{loaderOnboarding && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Picture className='inline-block mr-2 text-primary' /> Onboarding List
					</h6>
					<RoleBaseGuard permissions={[permissionsArray.ONBOARDING_MANAGEMENT.AddAccess]}>
						<Button className='btn-primary btn-large' onClick={showAddEditModalOnboarding}>
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
														<button onClick={() => onHandleSortOnboarding(colVal.fieldName)}>
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
							<tbody>{onboardingData && <DndTable dndItemRow={onboardingData?.data.data} showDetails={showDetailsOnboarding} editRecord={editRecordOnboarding} deleteTopicData={deleteOnboardingDataModal} setDisableData={setDisableDataOnboarding} setOrderChanged={setOrderChangedOnboarding} setNewOrder={setNewOrderOnboarding} onChangeStatus={onChangeStatus} />}</tbody>
						</table>
						{orderChangedOnboarding && (
							<div className='flex justify-center mt-3'>
								<Button onClick={submitOrderOnboarding} className='btn-primary btn-large'>
									Save order
								</Button>
								<Button onClick={cancelOrderChangeOnboarding} className='btn-default ml-3 btn-large'>
									Cancel
								</Button>
							</div>
						)}
						{!onboardingData?.data.record && <p className='text-center'>No Onboarding Data Found</p>}
					</div>
					<div className='flex items-center justify-between mt-8 max-md:flex-col max-md:items-start'>
						<TotalRecords length={onboardingData?.data.record as number} />
					</div>
				</div>
			</div>
			{isDeleteOnboarding && <DeleteModel onClose={onCloseOnboarding} deleteData={deleteOnboardingDataById} />}
			{isAddEditModelOnboarding && <AddEditOnboardingModal onSubmit={getOnboardingContentList} onClose={onCloseOnboarding} editData={editDataOnboarding} disableData={disableDataOnboarding} />}
			{isStatusModelShow && <ChangeStatus onClose={onCloseOnboarding} changeStatus={changeOnboardingStatus} />}
		</div>
	);
};
export default Onboarding;
