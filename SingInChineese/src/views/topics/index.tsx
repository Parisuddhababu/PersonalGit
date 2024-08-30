import React, { useCallback, useEffect, useState } from 'react';
import { ROUTES, endPoint } from '@config/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { AngleRight, ArrowSmallLeft, Document, PlusCircle } from '@components/icons';
import Button from '@components/button/Button';
import { TopicData, TopicDataArr } from 'src/types/topic';
import AddEditTopic from './AddEditTopic';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import DNDTopic from './DNDTopic';
import { DataToSubmit } from 'src/types/lesson';
import { ColArrType } from 'src/types/common';
import TotalRecords from '@components/totalRecords/totalRecords';
import ActivityKaraoke from '@views/activities/ActivityKaraoke';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

const Topic = () => {
	const navigate = useNavigate();
	const params = useParams();
	useEscapeKeyPress(() => onClose()); // use to close model on Eac key.
	const [topicData, setTopicData] = useState<TopicData>();
	const [editTopicData, setEditTopicData] = useState<TopicDataArr | null>(null);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [isDeleteTopic, setIsDeleteTopic] = useState<boolean>(false);
	const [isAddEditTopic, setIsAddEditTopic] = useState<boolean>(false);
	const [isActivityKaraoke, setIsActivityKaraoke] = useState<boolean>(false);
	const [loaderTopic, setLoaderTopic] = useState(false);
	const [orderChanged, setOrderChanged] = useState<boolean>(false);
	const [newOrder, setNewOrder] = useState<TopicDataArr[]>();
	const dataToSubmit: DataToSubmit = [];

	const getTopicList = useCallback(() => {
		setLoaderTopic(true);
		APIService.getData(`${URL_PATHS.topic}?levelId=${params.levelId}`)
			.then((response) => {
				if (response.status === ResponseCode.created) {
					setLoaderTopic(false);
					setTopicData(response?.data);
				} else {
					toast.error(response?.data.message);
					setLoaderTopic(false);
				}
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
				setLoaderTopic(false);
			});
		setOrderChanged(false);
	}, []);

	/**
	 * Method Used to send boolean true or false
	 * @param value: true or false
	 */
	const updateTopicStatus = (value: boolean) => {
		APIService.postData(`${URL_PATHS.topic}/${endPoint.changeStatus}/${editTopicData?.uuid}`, {
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
	 * Method is used to delete the level data from api
	 */
	const deleteTopicData = () => {
		APIService.deleteData(`${URL_PATHS.topic}/${editTopicData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getTopicList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
			});
	};
	/**
	 *
	 * Method used for Submit Order change
	 */
	const submitOrder = useCallback(() => {
		setLoaderTopic(true);
		const data = newOrder;
		data?.map((item, index) => {
			dataToSubmit.push({ order: index + 1, uuid: item.uuid });
		});
		APIService.postData(`${URL_PATHS.topic}/${endPoint.changeOrder}/${params.levelId}`, {
			order: dataToSubmit,
			levelId: params.levelId,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					getTopicList();
					setOrderChanged(false);
					setLoaderTopic(false);
					toast.success(response?.data?.message);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderTopic(false);
			});

		setOrderChanged(false);
	}, [dataToSubmit]);

	const COL_ARR = [
		{ name: 'Order', sortable: false },
		{ name: 'Name', sortable: false, fieldName: 'name' },
		{ name: 'Status', sortable: false, fieldName: 'status' },
	] as ColArrType[];

	/**
	 * Used for set topic data from res in local variable
	 */

	useEffect(() => {
		getTopicList();
	}, []);

	/**
	 * Method used for delete topic data
	 */
	const deleteTopic = useCallback(() => {
		deleteTopicData();
		setIsDeleteTopic(false);
		setEditTopicData(null);
	}, [isDeleteTopic]);

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsDeleteTopic(false);
		setIsAddEditTopic(false);
		setEditTopicData(null);
		setIsStatusModelShow(false);
		setIsActivityKaraoke(false);
	}, []);

	/**
	 *
	 * @param data Method used for show topic delete model
	 */
	const deleteTopicModal = useCallback((data: TopicDataArr) => {
		setIsDeleteTopic(true);
		setEditTopicData(data);
	}, []);

	/**
	 *
	 * @param data Method used for send the edit topi data to useState
	 * @returns
	 */
	const editTopicHandler = useCallback((data: TopicDataArr) => {
		setIsAddEditTopic(true);
		setEditTopicData(data);
	}, []);

	const onChangeStatus = useCallback((data: TopicDataArr) => {
		setEditTopicData(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 * Method used for change user status with API
	 */
	const changeTopicStatus = useCallback(() => {
		const data = editTopicData?.isActive;
		updateTopicStatus(!data);
		setIsStatusModelShow(false);
	}, [isStatusModelShow]);

	/**
	 *
	 * Method used for Cancel Order change and get previous list
	 */
	const cancelOrderChange = useCallback(() => {
		getTopicList();
		setOrderChanged(false);
	}, []);

	const showDetails = useCallback((data: TopicDataArr) => {
		navigate(`/${ROUTES.app}/${ROUTES.lessons}/${ROUTES.list}/${params.levelId}/${data.uuid}/${params.levelName}/${data.name}`);
	}, []);

	/**
	 *
	 */
	const onAddKaraoke = useCallback((data: TopicDataArr) => {
		setEditTopicData(data);
		setIsActivityKaraoke(true);
	}, []);

	const showAddEditModal = useCallback(() => {
		setIsAddEditTopic(true);
	}, []);

	const pathRedirect = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.level}/${ROUTES.list}`);
	}, []);

	return (
		<div>
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={pathRedirect} title='Back to levels'>
							<ArrowSmallLeft />
						</Button>
						<Document className='inline-block mr-2 text-primary' />
						<button onClick={pathRedirect}>{params.levelName}</button>
						<span className='px-3 text-xs opacity-50'>
							<AngleRight />
						</span>
						<span>Topics</span>
					</h6>
					<RoleBaseGuard permissions={[permissionsArray.TOPIC_MANAGEMENT.AddAccess]}>
						<Button className='btn-primary btn-large' onClick={showAddEditModal}>
							<PlusCircle className='mr-1' /> Add New
						</Button>
					</RoleBaseGuard>
				</div>
				<div className='p-3 w-full'>
					<div className='overflow-auto w-full'>
						{loaderTopic && <Loader />}
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
									<th scope='col' className='w-32'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>{topicData && <DNDTopic dndItemRow={topicData?.data?.topics} showDetails={showDetails} editRecord={editTopicHandler} onChangeStatus={onChangeStatus} deleteLevelDataModal={deleteTopicModal} setOrderChanged={setOrderChanged} setNewOrder={setNewOrder} addEditKaraoke={onAddKaraoke} />}</tbody>
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
						{topicData?.data.topics.length == 0 && <p className='text-center'>No Topic Found</p>}
					</div>
					<TotalRecords length={topicData?.data.topics.length as number} />
				</div>
			</div>
			{isStatusModelShow && <ChangeStatus onClose={onClose} changeStatus={changeTopicStatus} />}
			{isDeleteTopic && <DeleteModel onClose={onClose} deleteData={deleteTopic} />}
			{isAddEditTopic && <AddEditTopic onClose={onClose} onSubmit={getTopicList} editData={editTopicData} disableData={false} />}
			{isActivityKaraoke && <ActivityKaraoke onClose={onClose} onSubmit={getTopicList} editData={editTopicData} />}
		</div>
	);
};
export default Topic;
