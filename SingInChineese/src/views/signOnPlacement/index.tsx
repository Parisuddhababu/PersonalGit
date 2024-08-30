import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType } from 'src/types/common';
import { PlusCircle, Document } from '@components/icons';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import AddEditSopLevel from './AddEditLevel';
import { useNavigate } from 'react-router-dom';
import { LevelData, LevelArr } from 'src/types/exam';
import { ROUTES } from '@config/constant';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { DataToSubmit } from 'src/types/lesson';
import DNDSignOnPlacement from '@views/signOnPlacement/DNDSignOnPlacement';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import TotalRecords from '@components/totalRecords/totalRecords';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

const SopLevel = () => {
	const navigate = useNavigate();
	useEscapeKeyPress(() => onClose()); // use to close model on Eac key.
	const [levelData, setLevelData] = useState<LevelData>();
	const [isDeleteLevel, setIsDeleteLevel] = useState<boolean>(false);
	const [isAddEditModel, setIsAddEditModel] = useState<boolean>(false);
	const [editData, setEditData] = useState<LevelArr | null>(null);
	const [loader, setLoader] = useState<boolean>(false);
	const [newOrder, setNewOrder] = useState<LevelArr[]>();
	const dataToSubmit: DataToSubmit = [];
	const [orderChanged, setOrderChanged] = useState<boolean>(false);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);

	/**
	 *
	 * @param  Method used for fetching Sop Level List
	 */
	const getLevelList = useCallback(() => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.signOnPlacementLevel}?isForSop=true`)
			.then((response) => {
				if (response.status === ResponseCode.success || ResponseCode.created) {
					setLevelData(response?.data);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoader(false);
			});
		setOrderChanged(false);
	}, []);

	/**
	 *
	 * @param  Method used for fetching Sop Level List
	 */
	useEffect(() => {
		getLevelList();
	}, []);

	const COL_ARR = [
		{ name: 'Order', sortable: false, fieldName: 'order' },
		{
			name: 'Level name',
			sortable: false,
			fieldName: 'levelName',
		},
		{
			name: 'Status',
			sortable: false,
			fieldName: 'isActive',
		},
	] as ColArrType[];

	/**
	 *
	 * @param e Method used for delete sop Level Data
	 */
	const deleteLevelData = () => {
		APIService.deleteData(`${URL_PATHS.signOnPlacementLevel}/${editData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getLevelList();
				} else {
					toast.error(response.data.message);
				}
			})
			.catch((err) => toast.error(err.response.data.message));
	};

	/**
	 * Method used for delete sop level data by id
	 */
	const deleteLevelById = useCallback(() => {
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
	 *
	 * @param data Method used for Edit Current selected Record
	 */
	const editRecord = useCallback((data: LevelArr) => {
		setEditData(data);
		setIsAddEditModel(true);
	}, []);

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

		APIService.postData(`${URL_PATHS.signOnPlacementLevel}/change-order`, {
			levels: dataToSubmit,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					getLevelList();
					setOrderChanged(false);
					setLoader(false);
					toast.success(response.data.message);
				}
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
		getLevelList();
		setOrderChanged(false);
		setEditData(null);
	}, []);

	/**
	 *
	 * Method used for view Current selected details
	 */
	const showDetails = useCallback((data: LevelArr) => {
		navigate(`/${ROUTES.app}/${ROUTES.sopActivities}/${ROUTES.list}/${data.uuid}/${data.levelName}`);
	}, []);

	/**
	 *
	 * @param data Method used for show sop level delete modal
	 */
	const deleteSopLevelData = useCallback((data: LevelArr) => {
		setEditData(data);
		setIsDeleteLevel(true);
	}, []);

	/**
	 *
	 * Method used for show status modal
	 */
	const onChangeStatus = useCallback((data: LevelArr) => {
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
	 * Method Used to send boolean true or false
	 * @param value: true or false
	 */
	const updateLevelStatus = (value: boolean) => {
		APIService.patchData(`${URL_PATHS.signOnPlacementLevel}/${editData?.uuid}/status`, {
			isActive: value,
			isForSop: true,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getLevelList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => {
				toast.error(err.response.data.message);
			});
	};

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
					<RoleBaseGuard permissions={[permissionsArray.SOP_LEVEL_MANAGEMENT.AddAccess]}>
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
									<th scope='col' className='w-40'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>{levelData && <DNDSignOnPlacement dndItemRow={levelData?.data.levels} showDetails={showDetails} editRecord={editRecord} deleteExamData={deleteSopLevelData} setOrderChanged={setOrderChanged} setNewOrder={setNewOrder} onChangeStatus={onChangeStatus} />}</tbody>
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
						{!levelData?.data.count && <p className='text-center'>No Level Found</p>}
					</div>
					<TotalRecords length={levelData?.data.count as number} />
				</div>
			</div>
			{isStatusModelShow && <ChangeStatus onClose={onClose} changeStatus={changeLevelStatus} />}
			{isDeleteLevel && <DeleteModel onClose={onClose} deleteData={deleteLevelById} />}
			{isAddEditModel && <AddEditSopLevel onSubmit={getLevelList} onClose={onClose} editData={editData} />}
		</div>
	);
};
export default SopLevel;
