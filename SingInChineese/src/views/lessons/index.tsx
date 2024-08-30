import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType } from 'src/types/common';
import { ROUTES, endPoint } from '@config/constant';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PlusCircle, Document, ArrowSmallLeft, AngleRight } from '@components/icons';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { LessonsData, LessonsDataArr } from 'src/types/lessons';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import { Loader } from '@components/index';
import DNDLesson from './DNDLesson';
import { DataToSubmit } from 'src/types/lesson';
import TotalRecords from '@components/totalRecords/totalRecords';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import { permissionsArray } from '@config/permissions';
import RoleBaseGuard from '@components/roleGuard/roleGuard';

const Lessons = () => {
	const params = useParams();
	const navigate = useNavigate();
	useEscapeKeyPress(() => onClose()); // use to close model on Eac key.
	const [lessonsData, setLessonsData] = useState<LessonsData>();
	const [isDeleteLessons, setIsDeleteLessons] = useState<boolean>(false);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [editData, setEditData] = useState<LessonsDataArr | null>(null);
	const [loaderLesson, setLoaderLesson] = useState<boolean>(false);
	const [newOrder, setNewOrder] = useState<LessonsDataArr[]>();
	const dataToSubmit: DataToSubmit = [];
	const [orderChanged, setOrderChanged] = useState<boolean>(false);

	const COL_ARR = [
		{ name: 'Order', sortable: false },
		{
			name: 'Lessons',
			sortable: false,
			fieldName: 'name',
		},
		{
			name: 'Status',
			sortable: false,
			fieldName: 'sentences',
		},
	] as ColArrType[];

	const getLessonsList = useCallback(() => {
		setLoaderLesson(true);
		APIService.getData(`${URL_PATHS.lesson}?levelId=${params.levelId}&topicId=${params.topicId}`)
			.then((response) => {
				if (response.status === ResponseCode.success || ResponseCode.created) {
					setLessonsData(response?.data);
				} else {
					toast.error(response?.data.message);
				}
				setLoaderLesson(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderLesson(false);
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
	 * Method used for delete lesson data
	 */
	const deleteLessonData = () => {
		APIService.deleteData(`${URL_PATHS.lesson}/${editData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.created || ResponseCode.success) {
					toast.success(response?.data.message);
					getLessonsList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
			});
	};

	/**
	 * Method Used to send boolean true or false
	 * @param value: true or false
	 */
	const updateLessonStatus = (value: boolean) => {
		APIService.postData(`${URL_PATHS.lesson}/${endPoint.changeStatus}/${editData?.uuid}`, {
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
				toast.error(err.response?.data.message);
			});
	};

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsDeleteLessons(false);
		setIsStatusModelShow(false);
		setEditData(null);
	}, []);

	/**
	 *
	 * @param data Method used for show lesson delete model
	 */
	const deleteLessonDataModal = useCallback((data: LessonsDataArr) => {
		setEditData(data);
		setIsDeleteLessons(true);
	}, []);

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
	 * @param data Method used for Edit Current selected Record
	 */
	const editRecord = useCallback((data: LessonsDataArr) => {
		setEditData(data);
	}, []);

	const onChangeStatus = useCallback((data: LessonsDataArr) => {
		setEditData(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 * Method used for change lesson status with API
	 */
	const changeLessonStatus = useCallback(() => {
		const data = editData?.isActive;
		updateLessonStatus(!data);
		setIsStatusModelShow(false);
		setEditData(null);
	}, [isStatusModelShow]);

	const submitOrder = useCallback(() => {
		setLoaderLesson(true);
		const data = newOrder;
		data?.map((item, index) => {
			dataToSubmit.push({ order: index + 1, uuid: item.uuid });
		});

		APIService.postData(`${URL_PATHS.lesson}/${endPoint.changeOrder}`, {
			lessons: dataToSubmit,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					getLessonsList();
					setOrderChanged(false);
					setLoaderLesson(false);
					toast.success(response.data.message);
				}
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				setLoaderLesson(false);
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

	const showDetails = useCallback((data: LessonsDataArr) => {
		navigate(`/${ROUTES.app}/${ROUTES.activities}/${ROUTES.list}/${params.levelId}/${params.topicId}/${data.uuid}/${params.levelName}/${params.topicName}/${data.name}`);
	}, []);

	const pageRedirect = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.topic}/${ROUTES.list}/${params.levelId}/${params.levelName}`);
	}, []);

	const navigateToLevel = () => {
		navigate(`/${ROUTES.app}/${ROUTES.level}/${ROUTES.list}`);
	};

	return (
		<div>
			{loaderLesson && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex flex-col md:flex-row items-start md:items-center justify-between'>
					<div className='mb-2 md:mb-0'>
						<h6 className='font-medium flex items-center'>
							<Button className='btn-default mr-3' onClick={pageRedirect} title='Back to topics'>
								<ArrowSmallLeft />
							</Button>
							<Document className='inline-block mr-2 text-primary' />
							<button onClick={navigateToLevel}>{params.levelName}</button>
							<span className='px-3 text-xs opacity-50'>
								<AngleRight />
							</span>
							<button onClick={pageRedirect}>{params.topicName}</button>
							<span className='px-3 text-xs opacity-50'>
								<AngleRight />
							</span>
							<span>Lessons</span>
						</h6>
					</div>
					<div>
						<RoleBaseGuard permissions={[permissionsArray.LESSON_MANAGEMENT.AddAccess]}>
							<Link className='btn btn-primary btn-large' to='lesson'>
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
							<tbody>{lessonsData && <DNDLesson dndItemRow={lessonsData?.data.lessons} showDetails={showDetails} editRecord={editRecord} onChangeStatus={onChangeStatus} deleteLessonDataModal={deleteLessonDataModal} setOrderChanged={setOrderChanged} setNewOrder={setNewOrder} />}</tbody>
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
		</div>
	);
};
export default Lessons;
