import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import TextInput from '@components/textInput/TextInput';
import ViewBtn from '@components/common/viewButton';
import EditBtn from '@components/common/EditButton';
import Pagination from '@components/Pagination/Pagination';
import Button from '@components/button/button';
import filterServiceProps from '@components/filter/filter';
import DeleteBtn from '@components/common/deleteBtn';
import CommonModel from '@components/common/commonModel';
import { ImageUrl, CHANGE_STATUS_WARNING_TEXT, DELETE_WARNING_TEXT, PAGE_LIMIT, PAGE_NUMBER, ROUTES, SHOW_PAGE_COUNT_ARR, SubscriberStatus, USER_TYPE } from '@config/constant';
import { ArrowSortingDown, ArrowSortingUp, GetDefaultIcon, Search } from '@components/icons/icons';
import { SubscriberDatalist } from '@framework/graphql/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { FETCH_SUBSCRIBER_DETAIL_PAGINATION } from '@framework/graphql/queries/subscriber';
import { PaginationParams, ColArrType } from '@types';
import { BLOCK_SUBSCRIBER, DELETE_SUBSCRIBER } from '@framework/graphql/mutations/subscriber';
import UpdatedHeader from '@components/header/updatedHeader';
import { UserProfileType, UserRoles } from 'src/types/common';
import ChangePasswordSubscriber from './changePasswordSubscriber';
import ChangePassword from '@components/common/changePassword';

const Subscriber = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [deleteSubscriberById] = useMutation(DELETE_SUBSCRIBER);
	const [isDeleteSubscriber, setIsDeleteSubscriber] = useState<boolean>(false);
	const [subscriberObj, setSubscriberObj] = useState({} as SubscriberDatalist);
	const [updateSubscriberStatus, loading] = useMutation(BLOCK_SUBSCRIBER)
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false)
	const { subscriberManagement } = useSelector(((state: { rolesManagement: { subscriberManagement: UserRoles } }) => state.rolesManagement));
	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: PAGE_LIMIT,
		page: PAGE_NUMBER,
		sortOrder: 'descend',
		search: '',
		sortField: 'createdAt',
		index: 0
	});
	const { userProfileData} = useSelector(
		(state: { userProfile: { userProfileData: UserProfileType} }) => state.userProfile,
	  );
  	const userType = userProfileData?.getProfile?.data?.user_type ?? '';
	const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
	const COL_ARR_SUBSCRIBER = [
		{ name: t('Sr.No'), sortable: false },
		{ name: t('Logo'), sortable: false, fieldName: 'logo' },
		{ name: t('Company Name'), sortable: true, fieldName: 'company_name' },
		{ name: t('First Name'), sortable: true, fieldName: 'subscriber_users.first_name' },
		{ name: t('Last Name'), sortable: true, fieldName: 'subscriber_users.last_name' },
		{ name: t('Country Code'), sortable: false },
		{ name: t('Phone Number'), sortable: false },
		{ name: t('Email'), sortable: false, fieldName: 'email' },
		{ name: t('Subscribe Start'), sortable: true, fieldName: 'subscribe_start' },
		{ name: t('Subscribe End'), sortable: true, fieldName: 'subscribe_end' },

	] as ColArrType[];
	const [isPasswordChange,setIsPasswordChange]= useState<boolean>(false);
	const { data, refetch: getSubscribeData } = useQuery(FETCH_SUBSCRIBER_DETAIL_PAGINATION, {
		variables: {
			limit: PAGE_LIMIT,
			page: PAGE_NUMBER,
			sortOrder: 'descend',
			search: '',
			sortField: 'createdAt',
		},
	});

	/**
	 * Method used for close model
	 */
	const onCloseSubscriber = useCallback(() => {
		setIsDeleteSubscriber(false);
		setIsStatusModelShow(false);
		setIsPasswordChange(false);
	}, []);


	/**
		* Method used for Add Subscriber sets data
	*/
	function handleAddSubscriber() {
		navigate(`/${ROUTES.app}/${ROUTES.subscriber}/add`);
	}

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */

	const onHandleSortSubscriber = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortField: sortFieldName,
			sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
		});
	};

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */

	const onPageDrpSelectUserSubscriber = (e: string) => {
		const newLimit = Number(e);
		const updatedFilterData = {
			...filterData,
			limit: newLimit,
			page: PAGE_NUMBER,
			index: 0,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterSubscriber', JSON.stringify(updatedFilterData));
	};

	const changeCategoryStatus = useCallback(() => {
		updateSubscriberStatus({
			variables: {
				subscribersId: subscriberObj?.uuid,
				status: subscriberObj.status === SubscriberStatus.ACTIVE ? SubscriberStatus.INACTIVE : SubscriberStatus.ACTIVE,
			},
		})
			.then((res) => {
				const data = res.data
				toast.success(data.blockSubscriber.message)
				setIsStatusModelShow(false)
				getSubscribeData(filterData).catch((error) => toast.error(error))
			})
			.catch((err) => {
				toast.error(err?.networkError?.result?.errors[0]?.message)
			})
	}, [isStatusModelShow])

	const totalSubscriber = data?.getSubscribers?.data?.count || 0;
	const totalPages = Math.ceil(totalSubscriber / recordsPerPage);
	const handlePageChange = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterData,
			page: newPage,
			index: (newPage - 1) * filterData.limit,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterSubscriber', JSON.stringify(updatedFilterData));
	}, [filterData.limit])

	useEffect(() => {
		setRecordsPerPage(filterData.limit);
	}, [filterData.limit]);
	/**
 * Method used for delete user data
 */

	const deleteSubscriber = useCallback(() => {
		deleteSubscriberById({
			variables: {
				subscribersId: subscriberObj.uuid,
			},
		})
			.then((res) => {
				const data = res.data
				toast.success(data.deleteSubscriber.message)
				setIsDeleteSubscriber(false)
				getSubscribeData(filterData).catch((error) => toast.error(error))
			})
			.catch((err) => {
				toast.error(err.networkError.result.errors[0].message)
			})
	}, [subscriberObj.uuid]);

	/**
   *
   * @param e Method used for store search value
   */
	const onSearchSubscriber = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFilterData({ ...filterData, search: e.target.value })
	}, [])
	useEffect(() => {
		getSubscribeData(filterData).catch((err) => toast.error(err))
	}, [filterData])
	/**
	 *
	 * @param obj Method Used for edit Category data
	 */

	/**
	 * Method used for change Category status model
	 */
	const onChangeStatus = useCallback((data: React.SetStateAction<SubscriberDatalist>) => {
		setIsStatusModelShow(true)
		setSubscriberObj(data)
	}, [])
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const viewSubScriberPage = useCallback((route: any, data: any) => {
		navigate(`/${ROUTES.app}/${route}/view/${data.uuid}`);
	}, [])

	const headerActionConst = () => {
		return (
			<>
				{subscriberManagement?.write && <Button
					className='btn-normal md: btn btn-secondary'
					onClick={handleAddSubscriber}
					type='button'
					label={t('Add New Subscriber')}
					title='Add New Subscriber'
				/>}
			</>
		)
	}
	
	return (
		<>
			<UpdatedHeader headerActionConst={headerActionConst} />
			<div className='mb-3 bg-white rounded-xl overflow-auto border border-[#c8ced3] mx-7 p-3 md:p-5'>
				<div className='flex flex-col justify-between gap-3 mb-3 md:gap-5 md:mb-5 btn-group md:flex-row'>
					<h6 className='w-full leading-7 xmd:w-auto'>{t('Subscriber')}</h6>
					<TextInput
						type='text'
						id='table-search'
						value={filterData.search}
						placeholder={t('Search')}
						onChange={onSearchSubscriber}
						inputIcon={<Search fontSize='18' className='font-normal' />}
					/>
				</div>
				<div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
					<table>
						<thead key='sorting'>
							<tr>
								{COL_ARR_SUBSCRIBER?.map((colValUser: ColArrType) => {
									return (
										<th scope='col' key={colValUser.fieldName}>
											<div className={`flex items-center ${colValUser.name == 'Status' ? 'justify-center' : ''}`}>
												{colValUser.name}
												{colValUser.sortable && (
													<button onClick={() => onHandleSortSubscriber(colValUser.fieldName)}>
														{(filterData.sortOrder === '' || filterData.sortField !== colValUser.fieldName) &&
															<GetDefaultIcon className='w-3 h-3 ml-1 fill-white' />}
														{filterData.sortOrder === 'ascend' && filterData.sortField === colValUser.fieldName &&
															<ArrowSortingUp className="ml-1 fill-white" />}
														{filterData.sortOrder === 'descend' && filterData.sortField === colValUser.fieldName &&
															<ArrowSortingDown className="ml-1 fill-white" />}
													</button>
												)}
											</div>
										</th>
									);
								})}

								<th scope='col'>
									<div className='flex items-center'>{t('Action')}</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{data?.getSubscribers?.data?.Subscriber?.map((data: SubscriberDatalist, index: number) => {
								
								const imageUrl = data.logo.startsWith(ImageUrl)
									? data.logo
									: `${ImageUrl}/${data.logo}`;
								const displayIndex = filterData?.index as number + index + 1;
								return (
									<tr key={data.uuid}>

										<td scope='row' className='text-center'>
											{displayIndex}
										</td>
										<td className='text-left truncate text-ellipsis max-w-[360px]'>
											<button className='w-[60px] h-[60px] rounded-md overflow-hidden inline-block font-medium cursor-pointer text-primary hover:underline aspect-square' onClick={() => viewSubScriberPage(ROUTES.subscriber, data)}>
												<picture>
													<img src={imageUrl} />
												</picture>
											</button>
										</td>
										<td className='text-left'>{data.company_name}</td>
										<td className='text-left'>{data.first_name}</td>
										<td className='text-left'>{data.last_name}</td>
										<td className='text-left'>{`${data.country_code.phoneCode} ${data?.country_code?.name}`}</td>
										<td className='text-left'>{data.phone_number}</td>
										<td className='text-left'>{data.email}</td>
										<td className='text-left'>{data.subscribe_start}</td>
										<td className='text-left'>{data.subscribe_end}</td>
										<td>
											<div className='flex justify-center btn-group'>
												{subscriberManagement?.read && <ViewBtn data={data} route={ROUTES.subscriber} />}
												{subscriberManagement?.update && <EditBtn data={data} route={ROUTES.subscriber} />}
												{userType === USER_TYPE?.SUPER_ADMIN &&subscriberManagement?.delete && <DeleteBtn data={data} setObj={setSubscriberObj} setIsDelete={setIsDeleteSubscriber} />}
												{userType === USER_TYPE?.SUPER_ADMIN &&subscriberManagement?.update  && <ChangePassword data={data} setObj={setSubscriberObj} setIsDelete={setIsPasswordChange} />}
												<div className='flex justify-center'>
													{subscriberManagement?.update && <span
														className='mt-2 font-medium text-blue-600 hover:underline'
													>
														<label className='relative inline-flex items-center cursor-pointer'>
															<input
																type='checkbox'
																className='sr-only peer'
																value={data.status}
																onChange={() => onChangeStatus(data)}
																checked={data.status === SubscriberStatus.ACTIVE}
															/>
															<div
																className={
																	'w-[30px] h-[14px] bg-secondary rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-[-1px] after:left-0 after:bg-white after:drop-shadow-outline-2 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary'
																}
															></div>
														</label>
													</span>}
												</div>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					{(data?.getSubscribers?.data?.count === 0 ||
						data?.getSubscribers?.data === null) && (
							<div className='flex justify-center'>
								<div>{t('No Data')}</div>
							</div>
						)}
				</div>
				<div className='flex flex-wrap items-center mt-2'>
					<div className='flex items-center mr-3 md:mr-7'>
						<span className='text-sm font-normal text-gray-700 whitespace-nowrap '>
							{t('Per Page')}
						</span>
						<select value={filterData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white' onChange={(e) => onPageDrpSelectUserSubscriber(e.target.value)}>
							{SHOW_PAGE_COUNT_ARR?.map((item: number) => {
								return <option key={item}>{item}</option>;
							})}
						</select>
					</div>
					<Pagination currentPage={filterData.page}
						totalPages={totalPages}
						onPageChange={handlePageChange}
						recordsPerPage={recordsPerPage}
					/>
				</div>
				{isDeleteSubscriber && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={onCloseSubscriber} action={deleteSubscriber} show={isDeleteSubscriber} />}
				{isStatusModelShow && (
					<CommonModel
						warningText={CHANGE_STATUS_WARNING_TEXT}
						onClose={onCloseSubscriber}
						action={changeCategoryStatus}
						show={isStatusModelShow}
						disabled={loading?.loading}
					/>
				)}
				{isPasswordChange&& <ChangePasswordSubscriber openPopUp={isPasswordChange} data={subscriberObj} onClose={onCloseSubscriber} /> }
	

			</div>

		</>
	);
};
export default Subscriber;
