import React, { useCallback, useEffect, useState } from 'react';
import Button from '@components/button/Button';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { Cross, Exclamation } from '@components/icons';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { DropdownOptionType } from 'src/types/component';
import { AssignTeacherData } from 'src/types/classroom';
import { AxiosError, AxiosResponse } from 'axios';
import { IErrorResponse, ISuccessResponse } from 'src/types/common';
import { TeacerData } from 'src/types/teacher';
import { endPoint } from '@config/constant';

const AssignTeacherModal = ({ onSubmit, onClose, editData, isAssign = true }: AssignTeacherData) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [teacherData, setTeacherData] = useState<DropdownOptionType[]>([]);

	/**
	 * @returns Method is used to get the teacher list data from api
	 */
	const getTeacherDataForAssign = () => {
		setIsLoading(true);
		APIService.getData(`${URL_PATHS.teacher}?limit=-1&isActive=true&schoolId=${editData?.school.uuid}`)
			.then((response: AxiosResponse<ISuccessResponse<TeacerData>>) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data?.rows.map((item: { user: { teacherFirstName: string; teacherLastName: string }; uuid: string }) => {
						data.push({ name: `${item?.user.teacherFirstName} ${item.user.teacherLastName || ''}`, key: item?.uuid });
					});
					setTeacherData(data);
				}
			})
			.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data.message))
			.finally(() => setIsLoading(false));
	};

	useEffect(() => {
		if (editData) {
			getTeacherDataForAssign();
		}
	}, []);

	/**
	 * Method used to call assign teacher to classroom api
	 */
	const assignTeacherHandler = (teacherId: string) => {
		if (editData) {
			setIsLoading(true);
			APIService.patchData(`${URL_PATHS.classroom}/${editData?.uuid}/${endPoint.assignTeacher}`, {
				schoolId: editData?.school.uuid,
				teacherId: teacherId,
			})
				.then((response: AxiosResponse<ISuccessResponse<object>>) => {
					if (response.status === ResponseCode.success) {
						toast.success(response?.data?.message);
						onClose();
						onSubmit();
					}
				})
				.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data?.message))
				.finally(() => setIsLoading(false));
		}
	};

	/**
	 * Method used to call un-assign teacher to classroom api
	 */
	const unAssignTeacherHandler = useCallback(() => {
		if (editData) {
			setIsLoading(true);
			APIService.patchData(`${URL_PATHS.classroom}/${editData?.uuid}/${endPoint.unAssignTeacher}`, {
				schoolId: editData?.school?.uuid,
				teacherId: editData?.teacher?.uuid,
			})
				.then((response: AxiosResponse<ISuccessResponse<object>>) => {
					if (response.status === ResponseCode.success) {
						toast.success(response?.data?.message);
						onClose();
						onSubmit();
					}
				})
				.catch((err: AxiosError<IErrorResponse>) => toast.error(err?.response?.data?.message))
				.finally(() => setIsLoading(false));
		}
	}, []);

	return (
		<>
			{isAssign ? (
				<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
					<div className={cn(ModelStyle['model'])}>
						{/* <!-- Modal Header --> */}
						<div className={cn(ModelStyle['model__header'])}>
							<h4>Assign Teacher</h4>
							<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
								<Cross />
							</Button>
						</div>
						{/* <!-- Modal Header End --> */}
						{isLoading && <Loader />}
						<div className={cn(ModelStyle['model__body'])}>
							<table className='w-[80vw] md:w-[60vw] lg:w-[40vw]'>
								<thead>
									<tr>
										<th>SR. No</th>
										<th>Teacher Name</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{teacherData?.map((item, index: number) => {
										return (
											<tr key={item.key}>
												<th scope='row' className='w-10 text-center'>
													{index + 1}
												</th>
												<td>{item.name}</td>
												<td className='w-10 text-center'>
													<button className='btn-primary p-1 rounded-md w-16' onClick={() => assignTeacherHandler(item.key as string)}>
														Assign
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
							{!teacherData?.length && <p className='text-center'>No Teacher Found</p>}
						</div>
					</div>
				</div>
			) : (
				<div id='deleteDataModel' className={'fixed top-0 left-0 right-0 z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full grid place-content-center bg-black bg-opacity-30'}>
					<div className='relative w-full min-w-[30vw] max-w-2xl max-h-full shadow-lg'></div>
					<div className='relative bg-white rounded-lg shadow'>
						<Button className='btn btn-large absolute right-0 top-2' onClick={onClose}>
							<Cross />
						</Button>
						<h3 className='text-xxl font-semibold text-gray-900 text-center pt-8'>Confirm</h3>
						<div className='p-6 space-y-2 text-xl text-gray-500 text-center'>
							<Exclamation className='text-5xl text-error' />
							<p>{'Are you sure you want to unassign this teacher?'}</p>
						</div>
						{/* <!-- Modal footer --> */}
						<div className='flex items-center justify-center p-4 pb-8 space-x-4 rounded-b'>
							<Button className='btn btn-danger btn-large min-w-[100px] justify-center' onClick={unAssignTeacherHandler}>
								Yes
							</Button>
							<Button className='btn btn-default btn-large min-w-[100px] justify-center' onClick={onClose}>
								No
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default AssignTeacherModal;
