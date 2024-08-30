import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType } from 'src/types/common';
import { PlusCircle, Document, ArrowSmallLeft, AngleRight, Trash } from '@components/icons';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { QuestionData, QuestionDataArr } from 'src/types/question';
import { ROUTES } from '@config/constant';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import { DataToSubmit } from 'src/types/lesson';
import TotalRecords from '@components/totalRecords/totalRecords';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import DNDSopActivity from '@views/signOnPlacement/sopActivities/DNDActivities';
import CheckBox from '@components/checkbox/CheckBox';
import { COL_ARR } from '@views/activities';

const SopActivities = () => {
	const navigate = useNavigate();
	const params = useParams();
	useEscapeKeyPress(() => onCloseSopActivity()); // use to close model on Eac key.
	const [activitySopData, setActivitySopData] = useState<QuestionData>();
	const [isDeleteSopActivity, setIsDeleteSopActivity] = useState<boolean>(false);
	const [editSopActivityData, setEditSopActivityData] = useState<QuestionDataArr | null>(null);
	const [isSopActivityStatusModelShow, setIsSopActivityStatusModelShow] = useState<boolean>(false);
	const [orderChangedSopActivity, setOrderChangedSopActivity] = useState<boolean>(false);
	const [newOrderSopActivity, setNewOrderSopActivity] = useState<QuestionDataArr[]>();
	const dataToSubmitSopActivity: DataToSubmit = [];
	const [loaderSopActivity, setLoaderSopActivity] = useState<boolean>(false);
	const [isDeleteAllSopActivity, setIsDeleteAllSopActivity] = useState<boolean>(false);
	const [dataArraySopActivity, setDataArraySopActivity] = useState<string[]>([]);

	const addOrRemoveElementSopActivity = useCallback(
		(element: string) => {
			if (dataArraySopActivity.includes(element)) {
				// Remove the element
				const updatedArray = dataArraySopActivity.filter((item) => item !== element);
				setDataArraySopActivity(updatedArray);
			} else {
				// Add the element
				setDataArraySopActivity([...dataArraySopActivity, element]);
			}
		},
		[dataArraySopActivity]
	);

	const onSelectAllSopActivity = () => {
		if (dataArraySopActivity.length === activitySopData?.data.record) {
			setDataArraySopActivity([]);
		} else {
			setDataArraySopActivity(activitySopData?.data.data.map((item) => item.uuid) as string[]);
		}
	};

	/**
	 *
	 * @param data Method used for show exam delete model
	 */
	const deleteAllSopActivities = useCallback(() => {
		setIsDeleteAllSopActivity(true);
	}, [isDeleteAllSopActivity]);

	const deleteAllSopActivity = useCallback(() => {
		APIService.postData(`${URL_PATHS.addActivity}/group-delete`, {
			activityType: 'sop',
			levelId: params.levelId,
			activityIds: dataArraySopActivity,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getSopActivitiesList();
				}
			})
			.catch((err) => toast.error(err.response.data.message));

		setIsDeleteAllSopActivity(false);
		setDataArraySopActivity([]);
	}, [isDeleteAllSopActivity, dataArraySopActivity]);

	/**
	 *
	 * @param  Method used for fetching contentList
	 */
	const getSopActivitiesList = () => {
		setEditSopActivityData(null);
		setLoaderSopActivity(true);
		APIService.getData(`${URL_PATHS.signOnPlacementAddActivity}/list?levelId=${params.levelId}`)
			.then((response) => {
				if (response.status === ResponseCode.success || ResponseCode.created) {
					setActivitySopData(response?.data);
				}
				setLoaderSopActivity(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderSopActivity(false);
			});
	};

	/**
	 *
	 * @param  Method used for fetching contentList
	 */
	useEffect(() => {
		getSopActivitiesList();
	}, []);

	/**
	 *
	 * @param e Method used for delete sop activitySopData
	 */
	const deleteSopActivitiesData = () => {
		const updatedArray = dataArraySopActivity.filter((item) => item !== editSopActivityData?.uuid);
		setDataArraySopActivity(updatedArray);
		APIService.deleteData(`${URL_PATHS.signOnPlacementAddActivity}/${editSopActivityData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getSopActivitiesList();
				}
			})
			.catch((err) => toast.error(err.response.data.message));
		setEditSopActivityData(null);
	};

	/**
	 * Method used for delete exam data by id
	 */
	const deleteSopActivityById = useCallback(() => {
		deleteSopActivitiesData();
		setIsDeleteSopActivity(false);
		setEditSopActivityData(null);
	}, [isDeleteSopActivity]);

	/**
	 * Method used for close model
	 */
	const onCloseSopActivity = useCallback(() => {
		setIsDeleteSopActivity(false);
		setEditSopActivityData(null);
		setIsSopActivityStatusModelShow(false);
		setIsDeleteAllSopActivity(false);
	}, []);

	/**
	 *
	 * @param data Method used for show exam delete model
	 */
	const deleteSopActivity = useCallback((data: QuestionDataArr) => {
		setEditSopActivityData(data);
		setIsDeleteSopActivity(true);
	}, []);

	/**
	 *
	 * @param data Method used for Edit Current selected Record
	 */
	const editRecordSopActivity = useCallback((data: QuestionDataArr) => {
		setEditSopActivityData(data);
	}, []);

	/**
	 *
	 * Method used Change Status
	 */
	const onChangeStatusSopActivity = useCallback((data: QuestionDataArr) => {
		setEditSopActivityData(data);
		setIsSopActivityStatusModelShow(true);
	}, []);

	/**
	 * Method Used to send boolean true or false
	 * @param value: true or false
	 */
	const updateSopActivityStatus = (editSopActivityData: QuestionDataArr) => {
		APIService.patchData(`${URL_PATHS.signOnPlacementAddActivity}/${editSopActivityData.uuid}`, {
			isActive: !editSopActivityData?.isActive,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getSopActivitiesList();
				}
			})
			.catch((err) => toast.error(err.response.data.message));
		setEditSopActivityData(null);
	};

	/**
	 * Method used for change user status with API
	 */
	const changeActivityStatus = useCallback(() => {
		updateSopActivityStatus(editSopActivityData as QuestionDataArr);
		setIsSopActivityStatusModelShow(false);
		setEditSopActivityData(null);
	}, [isSopActivityStatusModelShow]);

	/**
	 *
	 * Method used for Submit Order change
	 */
	const submitOrderSopActivity = useCallback(() => {
		setLoaderSopActivity(true);
		const data = newOrderSopActivity;
		data?.map((item, index) => {
			dataToSubmitSopActivity.push({ order: index + 1, uuid: item.uuid });
		});
		APIService.patchData(`${URL_PATHS.signOnPlacementAddActivity}/order?levelId:${params.levelId}`, {
			activities: dataToSubmitSopActivity,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					getSopActivitiesList();
					setOrderChangedSopActivity(false);
					toast.success(response.data.message);
				}
				setLoaderSopActivity(false);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				setLoaderSopActivity(false);
			});
		setOrderChangedSopActivity(false);
	}, [dataToSubmitSopActivity]);

	/**
	 *
	 * Method used for Cancel Order change and get previous list
	 */
	const cancelOrderChangeSopActivity = useCallback(() => {
		getSopActivitiesList();
		setOrderChangedSopActivity(false);
		setEditSopActivityData(null);
	}, []);

	/**
	 *
	 * @param data id to copy Data
	 */
	const copySopActivity = useCallback((data: string) => {
		APIService.postData(`${URL_PATHS.addActivity}/duplicate`, {
			activityId: data,
			isForSop: true,
			isForSeasonal: false,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getSopActivitiesList();
				}
			})
			.catch((err) => toast.error(err.response.data.message));
	}, []);

	const redirectPathSopActivity = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.signOnPlacement}/${ROUTES.list}`);
	}, []);
	return (
		<div>
			{loaderSopActivity && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={redirectPathSopActivity} title='Back to levels'>
							<ArrowSmallLeft />
						</Button>
						<Document className='inline-block mr-2 text-primary' /> {params.levelName}
						<span className='px-3 text-xs opacity-50'>
							<AngleRight />
						</span>
						<span>Activities</span>
					</h6>
					<div>
						{dataArraySopActivity.length > 0 && (
							<Button className='btn btn-danger btn-large  mx-5' title='Delete Selected' onClick={deleteAllSopActivities}>
								<Trash className='m-1' />
							</Button>
						)}
						<Link className='btn btn-primary btn-large' to='signOnPlacementActivity'>
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
													checked: dataArraySopActivity.length === activitySopData?.data.record && !!activitySopData?.data.record,
													name: '',
													onChange() {
														onSelectAllSopActivity();
													},
												},
											]}
											disabled={!activitySopData?.data.record}
										/>
									</th>
									<th scope='col' className='w-14'></th>
									{COL_ARR?.map((colVal: ColArrType) => {
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
							<tbody>{activitySopData && <DNDSopActivity copyRecord={copySopActivity} dndItemRow={activitySopData?.data.data} editRecord={editRecordSopActivity} onChangeStatus={onChangeStatusSopActivity} deleteQuestionDataModal={deleteSopActivity} setOrderChanged={setOrderChangedSopActivity} setNewOrder={setNewOrderSopActivity} selectedActivities={dataArraySopActivity} onSelect={addOrRemoveElementSopActivity} />}</tbody>
						</table>
						{orderChangedSopActivity && (
							<div className='flex justify-center mt-3'>
								<Button onClick={submitOrderSopActivity} className='btn-primary btn-large'>
									Save order
								</Button>
								<Button onClick={cancelOrderChangeSopActivity} className='btn-default ml-3 btn-large'>
									Cancel
								</Button>
							</div>
						)}
						{!activitySopData?.data.record && <p className='text-center'>No Activity Found</p>}
					</div>
					<TotalRecords length={activitySopData?.data.record as number} />
				</div>
			</div>
			{isSopActivityStatusModelShow && <ChangeStatus onClose={onCloseSopActivity} changeStatus={changeActivityStatus} />}
			{isDeleteSopActivity && <DeleteModel onClose={onCloseSopActivity} deleteData={deleteSopActivityById} />}
			{isDeleteAllSopActivity && <DeleteModel onClose={onCloseSopActivity} deleteData={deleteAllSopActivity} />}
		</div>
	);
};
export default SopActivities;
