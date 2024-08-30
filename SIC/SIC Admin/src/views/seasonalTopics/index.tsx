import React, { useCallback, useEffect, useState } from 'react';
import { ROUTES } from '@config/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { Globe, PlusCircle } from '@components/icons';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import { DataToSubmit } from 'src/types/lesson';
import { ColArrType } from 'src/types/common';
import TotalRecords from '@components/totalRecords/totalRecords';
import AddEditSeasonalTopic from './AddEditSeasonalTopic';
import { SeasonalTopicDataArr, SeasonalTopicResponse } from 'src/types/seasonalTopics';
import DNDSeasonalTopic from './DNDSeasonalTopic';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import ActivityKaraokeSeasonal from './seasonalActivities/ActivityForms/KaraokeActivity';

const SeasonalTopic = () => {
	const navigate = useNavigate();
	const params = useParams();
	useEscapeKeyPress(() => onClose()); // use to close model on Eac key.
	const [topicData, setTopicData] = useState<SeasonalTopicResponse>();
	const [editTopicData, setEditTopicData] = useState<SeasonalTopicDataArr | null>(null);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [isDeleteTopic, setIsDeleteTopic] = useState<boolean>(false);
	const [isAddEditTopic, setIsAddEditTopic] = useState<boolean>(false);
	const [loader, setLoader] = useState(false);
	const [orderChanged, setOrderChanged] = useState<boolean>(false);
	const [newOrder, setNewOrder] = useState<SeasonalTopicDataArr[]>();
	const [isActivityKaraokeSeasonal, setIsActivityKaraokeSeasonal] = useState<boolean>(false);
	const dataToSubmit: DataToSubmit = [];

	const COL_ARR = [{ name: 'Order' }, { name: 'Name' }, { name: 'Start Date' }, { name: 'End Date' }, { name: 'Image' }, { name: 'Status' }] as ColArrType[];

	const getTopicList = useCallback(() => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.seasonalTopics}/list`)
			.then((response) => {
				if (response.status === ResponseCode.created) {
					setLoader(false);
					setTopicData(response?.data);
				} else {
					toast.error(response?.data.message);
					setLoader(false);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoader(false);
			});
		setOrderChanged(false);
	}, []);

	/**
	 * Used for set topic data from res in local variable
	 */
	useEffect(() => {
		getTopicList();
	}, []);

	const onChangeStatus = useCallback((data: SeasonalTopicDataArr) => {
		setEditTopicData(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 * Method Used to send boolean true or false
	 * @param value: true or false
	 */
	const updateTopicStatus = (value: boolean) => {
		APIService.patchData(`${URL_PATHS.seasonalTopics}/change-status/${editTopicData?.uuid}`, {
			isActive: value,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					getTopicList();
					toast.success(response?.data.message);
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
			});
	};

	/**
	 * Method used for change user status with API
	 */
	const changeTopicStatus = useCallback(() => {
		const data = editTopicData?.isActive;
		updateTopicStatus(!data);
		setIsStatusModelShow(false);
		setEditTopicData(null);
	}, [isStatusModelShow]);

	/**
	 *
	 * @param data Method used for show topic delete model
	 */
	const deleteTopicModal = useCallback((data: SeasonalTopicDataArr) => {
		setIsDeleteTopic(true);
		setEditTopicData(data);
	}, []);

	/**
	 * Method is used to delete the level data from api
	 */
	const deleteTopicData = () => {
		APIService.deleteData(`${URL_PATHS.seasonalTopics}/${editTopicData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getTopicList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	};

	/**
	 * Method used for delete topic data
	 */
	const deleteTopic = useCallback(() => {
		deleteTopicData();
		setIsDeleteTopic(false);
		setEditTopicData(null);
	}, [isDeleteTopic]);

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
		APIService.postData(`${URL_PATHS.seasonalTopics}/change-order`, {
			order: dataToSubmit,
			levelId: params.levelId,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					getTopicList();
					setOrderChanged(false);
					setLoader(false);
					toast.success(response?.data?.message);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoader(false);
			});

		setOrderChanged(false);
	}, [dataToSubmit]);

	/**
	 * Method used for close modal
	 */
	const onClose = useCallback(() => {
		setIsDeleteTopic(false);
		setIsAddEditTopic(false);
		setEditTopicData(null);
		setIsStatusModelShow(false);
		setIsActivityKaraokeSeasonal(false);
	}, []);

	/**
	 *
	 * @param data Method used for send the edit topic data to useState
	 * @returns
	 */
	const editTopicHandler = useCallback((data: SeasonalTopicDataArr) => {
		setIsAddEditTopic(true);
		setEditTopicData(data);
	}, []);

	/**
	 *
	 * Method used for Cancel Order change and get previous list
	 */
	const cancelOrderChange = useCallback(() => {
		getTopicList();
		setOrderChanged(false);
	}, []);

	const showDetails = useCallback((data: SeasonalTopicDataArr) => {
		navigate(`/${ROUTES.app}/${ROUTES.seasonalLesson}/${ROUTES.list}/${data.uuid}/${data.name}`);
	}, []);

	const showAddEditModal = useCallback(() => {
		setIsAddEditTopic(true);
	}, []);

	/**
	 * Karaoke modal for add edit data
	 */
	const onAddKaraokeSeasonal = useCallback((data: SeasonalTopicDataArr) => {
		setEditTopicData(data);
		setIsActivityKaraokeSeasonal(true);
	}, []);

	return (
		<div>
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Globe className='inline-block mr-2 text-primary' /> Seasonal Topics
					</h6>
					<Button className='btn-primary btn-large' onClick={showAddEditModal}>
						<PlusCircle className='mr-1' /> Add New
					</Button>
				</div>
				<div className='p-3 w-full'>
					<div className='overflow-auto w-full'>
						{loader && <Loader />}
						<table>
							<thead>
								<tr>
									<th className='w-20'></th>
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
							<tbody>{topicData && <DNDSeasonalTopic dndItemRow={topicData?.data?.topicsList} showDetails={showDetails} editRecord={editTopicHandler} onChangeStatus={onChangeStatus} deleteLevelDataModal={deleteTopicModal} setOrderChanged={setOrderChanged} setNewOrder={setNewOrder} addEditKaraokeSeasonal={onAddKaraokeSeasonal} />}</tbody>
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
						{!topicData?.data.count && <p className='text-center'>No Topic Found</p>}
					</div>
					<TotalRecords length={topicData?.data?.count as number} />
				</div>
			</div>
			{isStatusModelShow && <ChangeStatus onClose={onClose} changeStatus={changeTopicStatus} />}
			{isDeleteTopic && <DeleteModel onClose={onClose} deleteData={deleteTopic} />}
			{isAddEditTopic && <AddEditSeasonalTopic onClose={onClose} onSubmit={getTopicList} editData={editTopicData} disableData={false} />}
			{isActivityKaraokeSeasonal && <ActivityKaraokeSeasonal onClose={onClose} onSubmit={getTopicList} editData={editTopicData} />}
		</div>
	);
};
export default SeasonalTopic;
