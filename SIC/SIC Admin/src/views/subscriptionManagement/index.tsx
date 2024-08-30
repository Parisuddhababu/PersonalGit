import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType } from 'src/types/common';
import { PlusCircle, Subscribe } from '@components/icons';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { DataToSubmit, SubscriptionArr, SubscriptionData } from 'src/types/subscription';
import AddEditSubscriptionModal from './AddEditSubscription';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import TotalRecords from '@components/totalRecords/totalRecords';
import DNDSubscription from './DNDSubscription';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';

const Subscription = () => {
	useEscapeKeyPress(() => onClose()); // use to close model on Eac key.
	const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>();
	const [isDeleteSubscription, setIsDeleteSubscription] = useState<boolean>(false);
	const [isAddEditModel, setIsAddEditModel] = useState<boolean>(false);
	const [editData, setEditData] = useState<SubscriptionArr | null>(null);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [loader, setLoader] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [newOrder, setNewOrder] = useState<SubscriptionArr[]>();
	const dataToSubmit: DataToSubmit = [];
	const [orderChanged, setOrderChanged] = useState<boolean>(false);

	/**
	 *
	 * @param  Method used for fetching subscription List
	 */
	const getSubscriptionList = useCallback(() => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.subscription}/list`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setSubscriptionData(response?.data);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoader(false);
			});
	}, []);

	/**
	 *
	 * @param  Method used for fetching subscription List
	 */
	useEffect(() => {
		getSubscriptionList();
	}, []);

	const COL_ARR = [
		{ name: 'Order', sortable: false },
		{
			name: 'Plan name',
			sortable: false,
			fieldName: 'planName',
		},
		{
			name: 'Plan description',
			sortable: false,
			fieldName: 'planDescription',
		},
		{
			name: 'Plan price',
			sortable: false,
			fieldName: 'planPrice',
		},
		{
			name: 'allowed child count',
			sortable: false,
			fieldName: 'allowedChidCount',
		},

		{
			name: 'Trial duration',
			sortable: false,
			fieldName: 'freeTrailDuration',
		},
		{
			name: 'Status',
			sortable: false,
			fieldName: 'isActive',
		},
	] as ColArrType[];

	/**
	 *
	 * @param value used to send boolean true or false
	 */
	const updateSubscriptionStatus = (value: boolean) => {
		APIService.patchData(`${URL_PATHS.subscription}/${editData?.uuid}`, {
			status: value,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getSubscriptionList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => toast.error(err?.response?.data.message));
	};

	/**
	 *
	 * @param e Method used for delete subscription Data
	 */
	const deleteSubscriptionData = () => {
		APIService.deleteData(`${URL_PATHS.subscription}/${editData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getSubscriptionList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => toast.error(err?.response?.data.message));
	};

	/**
	 * Method used for delete subscription data by id
	 */
	const deleteSubscriptionById = useCallback(() => {
		deleteSubscriptionData();
		setIsDeleteSubscription(false);
		setEditData(null);
	}, [isDeleteSubscription]);

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsDeleteSubscription(false);
		setIsAddEditModel(false);
		setEditData(null);
		setDisabled(false);
		setIsStatusModelShow(false);
	}, []);

	/**
	 *
	 * @param data Method used for show delete model
	 */
	const deleteSubscription = useCallback((data: SubscriptionArr) => {
		setEditData(data);
		setIsDeleteSubscription(true);
	}, []);

	/**
	 *
	 * @param data Method used for Edit Current selected Record
	 */
	const editRecord = useCallback((data: SubscriptionArr) => {
		setEditData(data);
		setIsAddEditModel(true);
	}, []);

	const onChangeStatus = useCallback((data: SubscriptionArr) => {
		setEditData(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 * Method used for change subscription status with API
	 */
	const changeSubscriptionStatus = useCallback(() => {
		const data = editData?.isActive === true;
		updateSubscriptionStatus(data);
		setIsStatusModelShow(false);
		setEditData(null);
	}, [isStatusModelShow]);

	/**
	 *
	 * Method used for Submit Order change
	 */
	const submitOrder = useCallback(() => {
		setLoader(true);
		const data = newOrder;
		data?.map((item, index) => {
			dataToSubmit.push({ order: index + 1, uuid: item.uuid });
		});

		APIService.postData(`${URL_PATHS.subscription}/order`, {
			order: dataToSubmit,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					getSubscriptionList();
					setOrderChanged(false);
					setLoader(false);
					toast.success(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoader(false);
			});

		setOrderChanged(false);
	}, [dataToSubmit]);

	/**
	 *
	 * Method used for Cancel Order change and get previous list
	 */
	const cancelOrderChange = useCallback(() => {
		getSubscriptionList();
		setOrderChanged(false);
	}, []);

	const showDetails = useCallback((data: SubscriptionArr) => {
		editRecord(data);
		setDisabled(true);
	}, []);

	const showAddEditModal = useCallback(() => {
		setIsAddEditModel(true);
	}, []);

	return (
		<div>
			{loader && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Subscribe className='inline-block mr-2 text-primary' /> Subscription list
					</h6>
					<Button className='btn-primary btn-large' onClick={showAddEditModal}>
						<PlusCircle className='mr-1' /> Add New
					</Button>
				</div>
				<div className='p-3 w-full'>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									<th className='w-10'></th>
									{COL_ARR?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												{colVal.name}
											</th>
										);
									})}
									<th scope='col' className='w-36'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>{subscriptionData && <DNDSubscription dndItemRow={subscriptionData?.data.data} showDetails={showDetails} editRecord={editRecord} onChangeStatus={onChangeStatus} deleteSubscription={deleteSubscription} setOrderChanged={setOrderChanged} setNewOrder={setNewOrder} setDisabled={setDisabled} />}</tbody>
						</table>
						{orderChanged && (
							<div className='flex justify-center mt-3'>
								<Button onClick={submitOrder} className='btn-primary btn-large'>
									Save order
								</Button>
								<Button onClick={cancelOrderChange} className='btn-default ml-3 btn-large'>
									Cancel
								</Button>
							</div>
						)}
						{!subscriptionData?.data.record && <p className='text-center'>No Subscription Found</p>}
					</div>
					<div className='flex items-center justify-between mt-8 max-md:flex-col'>
						<TotalRecords length={subscriptionData?.data.record as number} />
					</div>
				</div>
			</div>

			{isAddEditModel && <AddEditSubscriptionModal onSubmit={getSubscriptionList} onClose={onClose} editData={editData} disableFields={disabled} />}
			{isStatusModelShow && <ChangeStatus onClose={onClose} changeStatus={changeSubscriptionStatus} />}
			{isDeleteSubscription && <DeleteModel onClose={onClose} deleteData={deleteSubscriptionById} />}
		</div>
	);
};
export default Subscription;
