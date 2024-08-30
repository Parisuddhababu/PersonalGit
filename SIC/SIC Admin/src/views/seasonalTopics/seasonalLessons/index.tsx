import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType } from 'src/types/common';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusCircle, Document, ArrowSmallLeft, AngleRight } from '@components/icons';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import { Loader } from '@components/index';
import { DataToSubmit } from 'src/types/lesson';
import TotalRecords from '@components/totalRecords/totalRecords';
import { SeasonalLessonsData, SeasonalLessonsDataArr } from 'src/types/seasonalTopics';
import DNDSeasonalLesson from './DNDSeasonalLesson';
import AddEditSeasonalLessonModal from './AddEditSeasonalLesson';
import { ROUTES } from '@config/constant';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';

const Lessons = () => {
	const params = useParams();
	const navigate = useNavigate();
	useEscapeKeyPress(() => onClose()); // use to close model on Eac key.
	const [lessonsData, setLessonsData] = useState<SeasonalLessonsData>();
	const [isDeleteLessons, setIsDeleteLessons] = useState<boolean>(false);
	const [isAddEditModel, setIsAddEditModel] = useState<boolean>(false);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [editData, setEditData] = useState<SeasonalLessonsDataArr | null>(null);
	const [loaderSeasonalLesson, setLoaderSeasonalLesson] = useState<boolean>(false);
	const [newOrder, setNewOrder] = useState<SeasonalLessonsDataArr[]>();
	const dataToSubmit: DataToSubmit = [];
	const [orderChanged, setOrderChanged] = useState<boolean>(false);

	const COL_ARR = [{ name: 'Order' }, { name: 'Name' }, { name: 'Status' }] as ColArrType[];

	const getLessonsList = useCallback(() => {
		setLoaderSeasonalLesson(true);
		APIService.getData(`${URL_PATHS.seasonalLessons}/list?topicId=${params.topicId}`)
			.then((response) => {
				if (response.status === ResponseCode.success || ResponseCode.created) {
					setLessonsData(response?.data);
				} else {
					toast.error(response?.data.message);
				}
				setLoaderSeasonalLesson(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderSeasonalLesson(false);
			});
		setOrderChanged(false);
	}, []);

	/**
	 * Used for refetch listing of lessons data after filter
	 */
	useEffect(() => {
		getLessonsList();
	}, []);

	/**
	 *
	 * @param data Method used for show lesson delete model
	 */
	const deleteLessonDataModal = useCallback((data: SeasonalLessonsDataArr) => {
		setEditData(data);
		setIsDeleteLessons(true);
	}, []);

	/**
	 * Method used for delete lesson data
	 */
	const deleteLessonData = () => {
		APIService.deleteData(`${URL_PATHS.seasonalLessons}/${editData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.created || ResponseCode.success) {
					toast.success(response?.data.message);
					getLessonsList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	};

	/**
	 *
	 * @param data Method used for delete lesson
	 */
	const deleteLesson = useCallback(() => {
		deleteLessonData();
		setIsDeleteLessons(false);
		setEditData(null);
	}, [isDeleteLessons]);

	/**
	 *
	 * @param data Method used for show lesson change status modal
	 */
	const onChangeStatus = useCallback((data: SeasonalLessonsDataArr) => {
		setEditData(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 * Method Used to send boolean true or false
	 * @param value: true or false
	 */
	const updateLessonStatus = (value: boolean) => {
		APIService.patchData(`${URL_PATHS.seasonalLessons}/change-status/${editData?.uuid}`, {
			isActive: value,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getLessonsList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	};

	/**
	 * Method used for change lesson status with API
	 */
	const changeLessonStatus = useCallback(() => {
		const data = editData?.isActive;
		updateLessonStatus(!data);
		setIsStatusModelShow(false);
		setEditData(null);
	}, [isStatusModelShow]);

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsDeleteLessons(false);
		setIsAddEditModel(false);
		setIsStatusModelShow(false);
		setEditData(null);
	}, []);

	/**
	 *
	 * @param data Method used for Edit Current selected Record
	 */
	const editRecord = useCallback((data: SeasonalLessonsDataArr) => {
		setEditData(data);
		setIsAddEditModel(true);
	}, []);

	/**
	 * Method used for change the order of lessons
	 */
	const submitOrder = useCallback(() => {
		setLoaderSeasonalLesson(true);
		const data = newOrder;
		data?.map((item, index) => {
			dataToSubmit.push({ order: index + 1, uuid: item.uuid });
		});

		APIService.patchData(`${URL_PATHS.seasonalLessons}/change-order`, {
			lessons: dataToSubmit,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					getLessonsList();
					setOrderChanged(false);
					setLoaderSeasonalLesson(false);
					toast.success(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderSeasonalLesson(false);
			});
		setOrderChanged(false);
	}, [dataToSubmit]);

	/**
	 *
	 * Method used for Cancel Order change and get previous list
	 */
	const cancelOrderChange = useCallback(() => {
		getLessonsList();
		setOrderChanged(false);
		setEditData(null);
	}, []);

	const showDetails = useCallback((data: SeasonalLessonsDataArr) => {
		navigate(`/${ROUTES.app}/${ROUTES.seasonalActivities}/${ROUTES.list}/${params.topicId}/${data.uuid}/${params.topicName}/${data.name}`);
	}, []);

	const pageRedirect = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.seasonalTopic}`);
	}, []);

	const showAddEditModal = useCallback(() => {
		setIsAddEditModel(true);
	}, []);

	return (
		<div>
			{loaderSeasonalLesson && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={pageRedirect} title='Back to level'>
							<ArrowSmallLeft />
						</Button>
						<Document className='inline-block mr-2 text-primary' />
						{params.topicName}
						<span className='px-3 text-xs opacity-50'>
							<AngleRight />
						</span>
						<span>Lessons</span>
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
							<tbody>{lessonsData && <DNDSeasonalLesson dndItemRow={lessonsData?.data.lessons} showDetails={showDetails} editRecord={editRecord} onChangeStatus={onChangeStatus} deleteLessonDataModal={deleteLessonDataModal} setOrderChanged={setOrderChanged} setNewOrder={setNewOrder} />}</tbody>
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
						{!lessonsData?.data.count && <p className='text-center'>No Lesson Found</p>}
					</div>
					<TotalRecords length={lessonsData?.data.count as number} />
				</div>
			</div>
			{isDeleteLessons && <DeleteModel onClose={onClose} deleteData={deleteLesson} />}
			{isStatusModelShow && <ChangeStatus onClose={onClose} changeStatus={changeLessonStatus} />}
			{isAddEditModel && <AddEditSeasonalLessonModal onSubmit={getLessonsList} onClose={onClose} editData={editData} />}
		</div>
	);
};
export default Lessons;
