import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType } from 'src/types/common';
import { PlusCircle, Document } from '@components/icons';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import AddEditLevelModal from './AddEditLevel';
import { LevelDataArr, LevelResponse } from 'src/types/levels';
import { ROUTES, endPoint } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import DNDLevel from './DNDLevel';
import { DataToSubmit } from 'src/types/lesson';
import TotalRecords from '@components/totalRecords/totalRecords';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

const Level = () => {
	const navigate = useNavigate();
	useEscapeKeyPress(() => onClose()); // use to close model on Eac key.
	const [levelData, setLevelData] = useState<LevelResponse>();
	const [isDeleteLevel, setIsDeleteLevel] = useState<boolean>(false);
	const [isAddEditModel, setIsAddEditModel] = useState<boolean>(false);
	const [editData, setEditData] = useState<LevelDataArr | null>(null);
	const [loader, setLoader] = useState<boolean>(false);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [newOrder, setNewOrder] = useState<LevelDataArr[]>();
	const dataToSubmit: DataToSubmit = [];
	const [orderChanged, setOrderChanged] = useState<boolean>(false);

	const COL_ARR = [
		{
			name: 'Order',
			sortable: false,
			fieldName: 'noOfTopics',
		},
		{
			name: 'Level Name',
			sortable: false,
			fieldName: 'levelName',
		},
		{
			name: 'Status',
			sortable: false,
			fieldName: 'status',
		},
	] as ColArrType[];

	/**
	 * Method is used to get the level data from api
	 */
	const getLevelData = useCallback(() => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.level}`)
			.then((response) => {
				if (response.status === ResponseCode.created) {
					setLevelData(response.data.data);
					setLoader(false);
				} else {
					toast.error(response?.data.message);
					setLoader(false);
				}
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
				setLoader(false);
			});
		setOrderChanged(false);
	}, []);

	/**
	 * Method is used to delete the level data from api
	 */
	const deleteLevelData = () => {
		APIService.deleteData(`${URL_PATHS.level}/${editData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getLevelData();
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
	const updateLevelStatus = (value: boolean) => {
		APIService.postData(`${URL_PATHS.level}/${endPoint.changeStatus}/${editData?.uuid}`, {
			isActive: value,
			isForSop: false,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getLevelData();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
			});
	};

	/**
	 * Method is used to fetch the level data from API on page load.
	 */
	useEffect(() => {
		getLevelData();
	}, []);

	/**
	 * Method used for delete Level data
	 */
	const deleteLevel = useCallback(() => {
		deleteLevelData();
		setIsDeleteLevel(false);
		setEditData(null);
	}, [isDeleteLevel]);

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsDeleteLevel(false);
		setIsAddEditModel(false);
		setIsStatusModelShow(false);
		setEditData(null);
	}, []);

	/**
	 * Method used for show lesson delete model
	 * @param data
	 */
	const deleteLevelDataModal = useCallback((data: LevelDataArr) => {
		setEditData(data);
		setIsDeleteLevel(true);
	}, []);

	/**
	 * Method used for Edit Current selected Record
	 * @param data
	 */
	const editRecord = useCallback((data: LevelDataArr) => {
		setEditData(data);
		setIsAddEditModel(true);
	}, []);

	const onChangeStatus = useCallback((data: LevelDataArr) => {
		setEditData(data);
		setIsStatusModelShow(true);
	}, []);

	/**
	 * Method used for change user status with API
	 */
	const changeLevelStatus = useCallback(() => {
		const data = editData?.isActive;
		updateLevelStatus(!data);
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
		APIService.postData(`${URL_PATHS.level}/${endPoint.changeOrder}`, {
			levels: dataToSubmit,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					getLevelData();
					setOrderChanged(false);
					toast.success(response.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				setLoader(false);
			});
		setOrderChanged(false);
	}, [dataToSubmit]);

	/**
	 *
	 * Method used for Cancel Order change and get previous list
	 */
	const cancelOrderChange = useCallback(() => {
		getLevelData();
		setOrderChanged(false);
		setEditData(null);
	}, []);

	const showDetails = useCallback((data: LevelDataArr) => {
		navigate(`/${ROUTES.app}/${ROUTES.topic}/${ROUTES.list}/${data.uuid}/${data.levelName}`);
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
						<Document className='inline-block mr-2 text-primary' /> Levels
					</h6>
					<RoleBaseGuard permissions={[permissionsArray.LEVEL_MANAGEMENT.AddAccess]}>
						<Button className='btn-primary btn-large' onClick={showAddEditModal}>
							<PlusCircle className='mr-1' /> Add New
						</Button>
					</RoleBaseGuard>
				</div>
				<div className='p-3 w-full'>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									<th scope='col' className='w-14'></th>
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
							<tbody>{levelData && <DNDLevel dndItemRow={levelData?.levels} showDetails={showDetails} editRecord={editRecord} onChangeStatus={onChangeStatus} deleteLevelDataModal={deleteLevelDataModal} setOrderChanged={setOrderChanged} setNewOrder={setNewOrder} />}</tbody>
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
						{!levelData?.count && <p className='text-center'>No Level Found</p>}
					</div>
					<TotalRecords length={levelData?.count as number} />
				</div>
			</div>
			{isStatusModelShow && <ChangeStatus onClose={onClose} changeStatus={changeLevelStatus} />}
			{isDeleteLevel && <DeleteModel onClose={onClose} deleteData={deleteLevel} />}
			{isAddEditModel && <AddEditLevelModal onClose={onClose} onSubmit={getLevelData} editData={editData} disableData={false} />}
		</div>
	);
};
export default Level;
