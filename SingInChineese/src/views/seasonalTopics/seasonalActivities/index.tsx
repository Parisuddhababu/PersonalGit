import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType } from 'src/types/common';
import { PlusCircle, Document, ArrowSmallLeft, AngleRight, Trash } from '@components/icons';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ROUTES, endPoint } from '@config/constant';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import { DataToSubmit } from 'src/types/lesson';
import TotalRecords from '@components/totalRecords/totalRecords';
import { SeasonalActivityData, SeasonalActivityDataArr } from 'src/types/seasonalTopics';
import DNDSeasonalActivity from './DNDSeasonalActivity';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import CheckBox from '@components/checkbox/CheckBox';
import { COL_ARR } from '@views/activities';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

const SeasonalActivities = () => {
	const navigate = useNavigate();
	const params = useParams();
	useEscapeKeyPress(() => onCloseSeasonalActivity()); // use to close model on Eac key.
	const [seasonalActivityData, setSeasonalActivityData] = useState<SeasonalActivityData>();
	const [isDeleteSeasonalActivity, setIsDeleteSeasonalActivity] = useState<boolean>(false);
	const [editSeasonalActivityData, setEditSeasonalActivityData] = useState<SeasonalActivityDataArr | null>(null);
	const [isSeasonalActivityStatusModelShow, setIsSeasonalActivityStatusModelShow] = useState<boolean>(false);
	const [orderChangedSeasonalActivity, setOrderChangedSeasonalActivity] = useState<boolean>(false);
	const [newOrderSeasonalActivity, setNewOrderSeasonalActivity] = useState<SeasonalActivityDataArr[]>();
	const dataToSubmitSeasonalActivity: DataToSubmit = [];
	const [loaderSeasonalActivity, setLoaderSeasonalActivity] = useState<boolean>(false);
	const [isDeleteAllSeasonalActivity, setIsDeleteAllSeasonalActivity] = useState<boolean>(false);
	const [dataArraySeasonalActivity, setDataArraySeasonalActivity] = useState<string[]>([]);

	const addOrRemoveElement = useCallback(
		(element: string) => {
			if (dataArraySeasonalActivity.includes(element)) {
				// Remove the element
				const updatedArray = dataArraySeasonalActivity.filter((item) => item !== element);
				setDataArraySeasonalActivity(updatedArray);
			} else {
				// Add the element
				setDataArraySeasonalActivity([...dataArraySeasonalActivity, element]);
			}
		},
		[dataArraySeasonalActivity]
	);

	const onSelectAllSeasonalActivity = () => {
		if (dataArraySeasonalActivity.length === seasonalActivityData?.data.record) {
			setDataArraySeasonalActivity([]);
		} else {
			setDataArraySeasonalActivity(seasonalActivityData?.data.data.map((item) => item.uuid) as string[]);
		}
	};

	/**
	 *
	 * @param data Method used for show exam delete model
	 */
	const deleteAllSeasonalActivities = useCallback(() => {
		setIsDeleteAllSeasonalActivity(true);
	}, [isDeleteAllSeasonalActivity]);

	const deleteAllSeasonalActivity = useCallback(() => {
		APIService.postData(`${URL_PATHS.addActivity}/${endPoint.groupDelete}`, {
			activityType: 'seasonal',
			topicId: params.topicId,
			lessonId: params.lessonId,
			activityIds: dataArraySeasonalActivity,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getSeasonalActivityList();
				}
			})
			.catch((err) => toast.error(err.response.data.message));

		setIsDeleteAllSeasonalActivity(false);
		setDataArraySeasonalActivity([]);
	}, [isDeleteAllSeasonalActivity, dataArraySeasonalActivity]);

	/**
	 *
	 * @param  Method used for fetching activities list api
	 */
	const getSeasonalActivityList = () => {
		const { lessonId, topicId } = params;
		setLoaderSeasonalActivity(true);
		APIService.getData(`${URL_PATHS.seasonalActivities}/${endPoint.list}?topicId=${topicId}&lessonId=${lessonId}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setSeasonalActivityData(response?.data);
				}
				setLoaderSeasonalActivity(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderSeasonalActivity(false);
			});
	};

	useEffect(() => {
		getSeasonalActivityList();
	}, []);

	/**
	 *
	 * @param data Method used for show activity delete model
	 */
	const deleteSeasonalActivity = useCallback((data: SeasonalActivityDataArr) => {
		setEditSeasonalActivityData(data);
		setIsDeleteSeasonalActivity(true);
	}, []);

	/**
	 *
	 * @param e Method used for delete Activity
	 */
	const deleteSeasonalActivityData = () => {
		setLoaderSeasonalActivity(true);
		APIService.deleteData(`${URL_PATHS.seasonalActivities}/${editSeasonalActivityData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getSeasonalActivityList();
				}
				setLoaderSeasonalActivity(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderSeasonalActivity(false);
			});
	};

	/**
	 * Method used for delete activity data by id
	 */
	const deleteSeasonalActivityById = useCallback(() => {
		deleteSeasonalActivityData();
		setIsDeleteSeasonalActivity(false);
		setEditSeasonalActivityData(null);
	}, [isDeleteSeasonalActivity]);

	/**
	 *
	 * Method used to show the change status modal
	 */
	const onChangeStatusSeasonalActivity = useCallback((data: SeasonalActivityDataArr) => {
		setEditSeasonalActivityData(data);
		setIsSeasonalActivityStatusModelShow(true);
	}, []);

	/**
	 * Method Used to send boolean true or false
	 * @param value: true or false
	 */
	const updateSeasonalActivityStatus = (value: boolean) => {
		setLoaderSeasonalActivity(true);
		APIService.patchData(`${URL_PATHS.seasonalActivities}/${endPoint.changeStatus}/${editSeasonalActivityData?.uuid}`, {
			isActive: value,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getSeasonalActivityList();
				}
				setLoaderSeasonalActivity(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderSeasonalActivity(false);
			});
	};

	/**
	 * Method used for change user status with API
	 */
	const changeSeasonalActivityStatus = useCallback(() => {
		const data = editSeasonalActivityData?.isActive;
		updateSeasonalActivityStatus(!data);
		setIsSeasonalActivityStatusModelShow(false);
		setEditSeasonalActivityData(null);
	}, [isSeasonalActivityStatusModelShow]);

	/**
	 *
	 * Method used for Submit Order change
	 */
	const submitOrderSeasonalActivity = useCallback(() => {
		setLoaderSeasonalActivity(true);
		const data = newOrderSeasonalActivity;
		data?.map((item, index) => {
			dataToSubmitSeasonalActivity.push({ order: index + 1, uuid: item.uuid });
		});
		APIService.patchData(`${URL_PATHS.seasonalActivities}/${endPoint.changeOrder}`, {
			order: dataToSubmitSeasonalActivity,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					getSeasonalActivityList();
					setOrderChangedSeasonalActivity(false);
					toast.success(response?.data.message);
				}
				setLoaderSeasonalActivity(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderSeasonalActivity(false);
			});
		setOrderChangedSeasonalActivity(false);
	}, [dataToSubmitSeasonalActivity]);

	/**
	 *
	 * Method used for Cancel Order change and get previous list
	 */
	const cancelOrderChangeSeasonalActivity = useCallback(() => {
		getSeasonalActivityList();
		setOrderChangedSeasonalActivity(false);
		setEditSeasonalActivityData(null);
	}, [orderChangedSeasonalActivity]);

	/**
	 *
	 * @param data Method used for edit current selected Record
	 */
	const editRecordSeasonalActivity = useCallback((data: SeasonalActivityDataArr) => {
		setEditSeasonalActivityData(data);
	}, []);

	/**
	 * Method used for close model
	 */
	const onCloseSeasonalActivity = useCallback(() => {
		setIsDeleteSeasonalActivity(false);
		setIsSeasonalActivityStatusModelShow(false);
		setEditSeasonalActivityData(null);
	}, []);

	/**
	 *
	 * @param data Method used for show exam delete model
	 */
	const copySeasonalActivity = useCallback((data: string) => {
		APIService.postData(`${URL_PATHS.addActivity}/${endPoint.duplicate}`, {
			activityId: data,
			isForSop: false,
			isForSeasonal: true,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getSeasonalActivityList();
				}
			})
			.catch((err) => toast.error(err.response.data.message));
	}, []);

	const pageRedirectSeasonalActivity = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.seasonalLesson}/${ROUTES.list}/${params.topicId}/${params.topicName}`);
	}, []);

	const navigateToTopics = () => {
		navigate(`/${ROUTES.app}/${ROUTES.seasonalTopic}`);
	};

	return (
		<div>
			{loaderSeasonalActivity && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex flex-col md:flex-row items-start md:items-center justify-between'>
					<div className='mb-2 md:mb-0'>
						<h6 className='font-medium flex items-center'>
							<Button className='btn-default mr-3' onClick={pageRedirectSeasonalActivity} title='Back to topic'>
								<ArrowSmallLeft />
							</Button>
							<Document className='inline-block mr-2 text-primary' />
							<button onClick={navigateToTopics}>{params.topicName}</button>
							<span className='px-3 text-xs opacity-50'>
								<AngleRight />
							</span>
							<button onClick={pageRedirectSeasonalActivity}>{params.lessonName}</button>
							<span className='px-3 text-xs opacity-50'>
								<AngleRight />
							</span>
							<span>Activities</span>
						</h6>
					</div>
					<div>
						{dataArraySeasonalActivity.length > 0 && (
							<Button className='btn btn-danger btn-large  mx-5' title='Delete Selected' onClick={deleteAllSeasonalActivities}>
								<Trash className='m-1' />
							</Button>
						)}
						<RoleBaseGuard permissions={[permissionsArray.SEASONAL_ACTIVITY_MANAGEMENT.AddAccess]}>
							<Link className='btn btn-primary btn-large' to='seasonalActivity'>
								<PlusCircle className='mr-1' /> Add New
							</Link>
						</RoleBaseGuard>
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
													checked: dataArraySeasonalActivity.length === seasonalActivityData?.data.record && !!seasonalActivityData?.data.record,
													name: '',
													onChange() {
														onSelectAllSeasonalActivity();
													},
												},
											]}
											disabled={!seasonalActivityData?.data.record}
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
									<th scope='col' className='w-48'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>{seasonalActivityData && <DNDSeasonalActivity copyRecord={copySeasonalActivity} dndItemRow={seasonalActivityData?.data.data} editRecord={editRecordSeasonalActivity} onChangeStatus={onChangeStatusSeasonalActivity} deleteActivityDataModal={deleteSeasonalActivity} setOrderChanged={setOrderChangedSeasonalActivity} setNewOrder={setNewOrderSeasonalActivity} onSelect={addOrRemoveElement} selectedActivities={dataArraySeasonalActivity} />}</tbody>
						</table>
						{orderChangedSeasonalActivity && (
							<div className='flex justify-center mt-3'>
								<Button onClick={submitOrderSeasonalActivity} className='btn-primary btn-large'>
									Save order
								</Button>
								<Button onClick={cancelOrderChangeSeasonalActivity} className='btn-default ml-3 btn-large'>
									Cancel
								</Button>
							</div>
						)}
						{!seasonalActivityData?.data.data.length && <p className='text-center'>No Activity Found</p>}
					</div>
					<TotalRecords length={seasonalActivityData?.data.record as number} />
				</div>
			</div>
			{isSeasonalActivityStatusModelShow && <ChangeStatus onClose={onCloseSeasonalActivity} changeStatus={changeSeasonalActivityStatus} />}
			{isDeleteSeasonalActivity && <DeleteModel onClose={onCloseSeasonalActivity} deleteData={deleteSeasonalActivityById} />}
			{isDeleteAllSeasonalActivity && <DeleteModel onClose={onCloseSeasonalActivity} deleteData={deleteAllSeasonalActivity} />}
		</div>
	);
};
export default SeasonalActivities;
