import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType } from 'src/types/common';
import { PlusCircle, Document, ArrowSmallLeft, AngleRight, Trash } from '@components/icons';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@config/constant';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import { DataToSubmit } from 'src/types/lesson';
import DNDActivity from './DNDActivity';
import TotalRecords from '@components/totalRecords/totalRecords';
import { ActivityData, ActivityDataArr } from 'src/types/activities';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import CheckBox from '@components/checkbox/CheckBox';

export const COL_ARR = [{ name: 'Order' }, { name: 'Activity Name' }, { name: 'Activity type' }, { name: 'Status' }] as ColArrType[];

const Activities = () => {
	const navigate = useNavigate();
	const params = useParams();
	useEscapeKeyPress(() => onCloseActivity()); // use to close model on Eac key.
	const [activityData, setActivityData] = useState<ActivityData>();
	const [isDeleteActivity, setIsDeleteActivity] = useState<boolean>(false);
	const [editActivityData, setEditActivityData] = useState<ActivityDataArr | null>(null);
	const [isActivityStatusModelShow, setIsActivityStatusModelShow] = useState<boolean>(false);
	const [orderChangedActivity, setOrderChangedActivity] = useState<boolean>(false);
	const [newOrderActivity, setNewOrderActivity] = useState<ActivityDataArr[]>();
	const dataToSubmitActivity: DataToSubmit = [];
	const [loaderActivity, setLoaderActivity] = useState<boolean>(false);
	const [isDeleteAllActivity, setIsDeleteAllActivity] = useState<boolean>(false);
	const [dataArrayActivity, setDataArrayActivity] = useState<string[]>([]);

	const addOrRemoveElementActivity = useCallback(
		(element: string) => {
			if (dataArrayActivity.includes(element)) {
				// Remove the element
				const updatedArray = dataArrayActivity.filter((item) => item !== element);
				setDataArrayActivity(updatedArray);
			} else {
				// Add the element
				setDataArrayActivity([...dataArrayActivity, element]);
			}
		},
		[dataArrayActivity]
	);

	const onSelectAllActivity = () => {
		if (dataArrayActivity.length === activityData?.data.record) {
			setDataArrayActivity([]);
		} else {
			setDataArrayActivity(activityData?.data.data.map((item) => item.uuid) as string[]);
		}
	};

	/**
	 *
	 * @param data Method used for show exam delete model
	 */
	const deleteAllActivities = useCallback(() => {
		setIsDeleteAllActivity(true);
	}, [isDeleteAllActivity]);

	const deleteAllActivity = useCallback(() => {
		APIService.postData(`${URL_PATHS.addActivity}/group-delete`, {
			activityType: 'general',
			levelId: params.levelId,
			topicId: params.topicId,
			lessonId: params.lessonId,
			activityIds: dataArrayActivity,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getActivityList();
				}
			})
			.catch((err) => toast.error(err.response.data.message));

		setIsDeleteAllActivity(false);
		setDataArrayActivity([]);
	}, [isDeleteAllActivity, dataArrayActivity]);

	/**
	 *
	 * @param  Method used for fetching contentList
	 */
	const getActivityList = useCallback(() => {
		setEditActivityData(null);
		const { lessonId, levelId, topicId } = params;
		setLoaderActivity(true);
		APIService.getData(`${URL_PATHS.allActivityListing}?levelId=${levelId}&topicId=${topicId}&lessonId=${lessonId}`)
			.then((response) => {
				if (response.status === ResponseCode.success || ResponseCode.created) {
					setActivityData(response?.data);
				}
				setLoaderActivity(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderActivity(false);
			});
	}, []);

	useEffect(() => {
		getActivityList();
	}, []);

	/**
	 *
	 * @param e Method used for delete Activity
	 */
	const deleteActivityData = () => {
		const updatedArray = dataArrayActivity.filter((item) => item !== editActivityData?.uuid);
		setDataArrayActivity(updatedArray);
		APIService.deleteData(`${URL_PATHS.addActivity}/${editActivityData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getActivityList();
				}
			})
			.catch((err) => toast.error(err.response.data.message));
		setEditActivityData(null);
	};

	/**
	 * Method used for delete exam data by id
	 */
	const deleteActivityById = useCallback(() => {
		deleteActivityData();
		setIsDeleteActivity(false);
	}, [isDeleteActivity]);

	/**
	 * Method used for close model
	 */
	const onCloseActivity = useCallback(() => {
		setIsDeleteActivity(false);
		setEditActivityData(null);
		setIsActivityStatusModelShow(false);
	}, []);

	/**
	 *
	 * @param data Method used for show exam delete model
	 */
	const deleteActivity = useCallback((data: ActivityDataArr) => {
		setEditActivityData(data);
		setIsDeleteActivity(true);
	}, []);

	/**
	 *
	 * @param data Method used for show exam delete model
	 */
	const copyActivity = useCallback((data: string) => {
		APIService.postData(`${URL_PATHS.addActivity}/duplicate`, {
			activityId: data,
			isForSop: false,
			isForSeasonal: false,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getActivityList();
				}
			})
			.catch((err) => toast.error(err.response.data.message));
	}, []);

	/**
	 *
	 * @param data Method used for Edit Current selected Record
	 */
	const editRecordActivity = useCallback((data: ActivityDataArr) => {
		setEditActivityData(data);
	}, []);

	/**
	 *
	 * Method used Change Status
	 */
	const onChangeStatusActivity = useCallback((data: ActivityDataArr) => {
		setEditActivityData(data);
		setIsActivityStatusModelShow(true);
	}, []);

	/**
	 * Method Used to send boolean true or false
	 * @param value: true or false
	 */
	const updateActivityStatus = (editActivityData: ActivityDataArr) => {
		APIService.patchData(`${URL_PATHS.addActivity}/${editActivityData?.uuid}/status?levelId=${params?.levelId}&topicId=${params.topicId}&lessonId=${params.topicId}`, {
			isActive: !editActivityData.isActive,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getActivityList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => toast.error(err.response.data.message));
		setEditActivityData(null);
	};

	/**
	 * Method used for change user status with API
	 */
	const changeActivityStatus = useCallback(() => {
		updateActivityStatus(editActivityData as ActivityDataArr);
		setIsActivityStatusModelShow(false);
	}, [isActivityStatusModelShow]);

	/**
	 *
	 * Method used for Submit Order change
	 */
	const submitOrderActivity = useCallback(() => {
		setLoaderActivity(true);
		const data = newOrderActivity;
		data?.map((item, index) => {
			dataToSubmitActivity.push({ order: index + 1, uuid: item.uuid });
		});
		APIService.patchData(`${URL_PATHS.addActivity}/order`, {
			order: dataToSubmitActivity,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setLoaderActivity(false);
					getActivityList();
					toast.success(response.data.message);
				}
				setOrderChangedActivity(false);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				setLoaderActivity(false);
			});
		setOrderChangedActivity(false);
	}, [dataToSubmitActivity]);

	/**
	 *
	 * Method used for Cancel Order change and get previous list
	 */
	const cancelOrderChangeActivity = useCallback(() => {
		getActivityList();
		setOrderChangedActivity(false);
	}, []);

	const pageRedirectActivity = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.lessons}/${ROUTES.list}/${params.levelId}/${params.topicId}/${params.levelName}/${params.topicName}`);
	}, []);

	return (
		<div>
			{loaderActivity && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex flex-col md:flex-row items-start md:items-center justify-between'>
					<div className='mb-2 md:mb-0'>
						<h6 className='font-medium flex items-center'>
							<Button className='btn-default mr-3' onClick={pageRedirectActivity} title='Back to topic'>
								<ArrowSmallLeft />
							</Button>
							<Document className='inline-block mr-2 text-primary' />
							{params.levelName}
							<span className='px-3 text-xs opacity-50'>
								<AngleRight />
							</span>
							{params.topicName}
							<span className='px-3 text-xs opacity-50'>
								<AngleRight />
							</span>
							{params.lessonName}
							<span className='px-3 text-xs opacity-50'>
								<AngleRight />
							</span>
							<span>Activities</span>
						</h6>
					</div>
					<div>
						{dataArrayActivity.length > 0 && (
							<Button className='btn btn-danger btn-large  mx-5' title='Delete Selected' onClick={deleteAllActivities}>
								<Trash className='m-1' />
							</Button>
						)}
						<Link className='btn btn-primary btn-large' to='activity'>
							<PlusCircle className='mr-1' /> Add New
						</Link>
					</div>
				</div>
				<div className='p-3 w-full'>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									<th scope='col' className='w-14'>
										<CheckBox
											option={[
												{
													value: '',
													checked: dataArrayActivity.length === activityData?.data.record && !!activityData?.data.record,
													name: '',
													onChange() {
														onSelectAllActivity();
													},
												},
											]}
											disabled={!activityData?.data.record}
										/>
									</th>
									<th scope='col' className='w-14'></th>
									{COL_ARR?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												{colVal.name}
											</th>
										);
									})}
									<th scope='col' className='w-40'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>{activityData && <DNDActivity selectedActivities={dataArrayActivity} copyRecord={copyActivity} dndItemRow={activityData?.data.data} editRecord={editRecordActivity} onChangeStatus={onChangeStatusActivity} deleteActivityDataModal={deleteActivity} setOrderChanged={setOrderChangedActivity} onSelect={addOrRemoveElementActivity} setNewOrder={setNewOrderActivity} />}</tbody>
						</table>
						{orderChangedActivity && (
							<div className='flex justify-center mt-3'>
								<Button onClick={submitOrderActivity} className='btn-primary btn-large'>
									Save order
								</Button>
								<Button onClick={cancelOrderChangeActivity} className='btn-default ml-3 btn-large'>
									Cancel
								</Button>
							</div>
						)}
						{!activityData?.data.data.length && <p className='text-center'>No Activity Found</p>}
					</div>
					<TotalRecords length={activityData?.data.record as number} />
				</div>
			</div>
			{isActivityStatusModelShow && <ChangeStatus onClose={onCloseActivity} changeStatus={changeActivityStatus} />}
			{isDeleteActivity && <DeleteModel onClose={onCloseActivity} deleteData={deleteActivityById} />}
			{isDeleteAllActivity && <DeleteModel onClose={onCloseActivity} deleteData={deleteAllActivity} />}
		</div>
	);
};
export default Activities;
