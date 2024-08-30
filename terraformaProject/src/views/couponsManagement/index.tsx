import { useMutation, useQuery } from '@apollo/client';
import { CHANGE_STATUS_WARNING_TEXT, DATE_FORMAT, DELETE_WARNING_TEXT, GROUP_DELETE_WARNING_TEXT, ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { DeleteCouponType, FetchCouponsDataArr, GroupDeleteCouponsRes, UpdateCouponStatusType } from '@framework/graphql/graphql';
import { FETCH_COUPONS } from '@framework/graphql/queries/couponManagement';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CouponColArrType, FilterCouponsProps, PaginationParamsCoupon } from 'src/types/couponManagement';
import { GetDefaultIcon, Gift, PlusCircle, Trash, AngleUp, AngleDown } from '@components/icons/icons';
import { COUPON_STATUS_CHANGE_BY_ID, DELETE_COUPON_BY_ID, GROUP_DELETE_COUPON } from '@framework/graphql/mutations/couponManagement';
import FilterCoupon from './filterCoupon';
import Button from '@components/button/button';
import CommonModel from '@components/common/commonModel';
import { getDateFormat } from '@utils/helpers';
import Pagination from '@components/Pagination/Pagination';
import filterServiceProps from '../../components/filter/filter';
import EditBtn from '../../components/common/EditButton';
import DeleteBtn from '@components/common/deleteBtn';

const CouponManagaement = () => {
	const { t } = useTranslation();
	const { data, refetch: getCoupons } = useQuery(FETCH_COUPONS);
	const [deleteCouponBYId] = useMutation(DELETE_COUPON_BY_ID);
	const [UpdateCouponStatus] = useMutation(COUPON_STATUS_CHANGE_BY_ID);
	const [deleteCoupons] = useMutation(GROUP_DELETE_COUPON);
	const navigate = useNavigate();
	const [filterData, setFilterData] = useState<PaginationParamsCoupon>({
		limit: 10,
		page: 1,
		sortBy: '',
		sortOrder: '',
		couponName: '',
		startTime: '',
		expireTime: '',
		status: null,
	});
	const [couponObj, setCouponObj] = useState({} as FetchCouponsDataArr);
	const [IsdeleteCoupon, setIsDeleteCoupon] = useState<boolean>(false);
	const [isStatusModelShowCoupon, setIsStatusModelShowCoupon] = useState(false);

	const COL_ARR_COUPONS = [
		{ name: 'Sr.No', sortable: false },
		{ name: t('Offer Name'), sortable: true, fieldName: 'coupon_name' },
		{ name: t('Offer Code'), sortable: false, fieldName: 'coupon_code' },
		{ name: t('Type'), sortable: false, fieldName: 'coupon_type' },
		{ name: t('Value'), sortable: true, fieldName: 'percentage' },
		{ name: t('Usage'), sortable: false, fieldName: 'is_reusable' },
		{ name: t('Total Usage'), sortable: false, fieldName: 'total_usage' },
		{ name: t('Start Date'), sortable: true, fieldName: 'start_time' },
		{ name: t('End Date'), sortable: true, fieldName: 'end_time' },
		{ name: t('Status'), sortable: true, fieldName: 'status' },
	] as CouponColArrType[];
	const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false);
	const [selectedAll, setSelectedAll] = useState(false);
	const [selectedCoupons, setSelectedCoupons] = useState<number[][]>([]);
	const [recordsPerPage, setRecordsperpage] = useState<number>(filterData.limit);
	const totalRuleSets = data?.fetchCoupons?.data?.count || 0;
	const totalPages = Math.ceil(totalRuleSets / recordsPerPage);
	const handlePageChangeCpn = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterData,
			page: newPage,
		};

		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterCoupon', JSON.stringify(updatedFilterData));
	}, []);
	useEffect(() => {
		const savedFilterDataJSON = filterServiceProps.getState('filterCoupon', JSON.stringify(filterData));
		if (savedFilterDataJSON) {
			const savedFilterData = JSON.parse(savedFilterDataJSON);
			setFilterData(savedFilterData);
		}
	}, []);
	/**
	 *  Used for set Coupon data from res in local variable
	 */
	useEffect(() => {
		if (!selectedCoupons?.length) {
			const totalPages = Math.ceil(data?.fetchCoupons?.data?.count / filterData?.limit);
			const pages = [];
			for (let i = 0; i < totalPages; i++) {
				pages.push([]);
			}
			setSelectedCoupons(pages);
		}
	}, [data?.fetchCoupons]);

	/**method that sets all coupons selected */
	useEffect(() => {
		if (selectedAll) {
			getCoupons().then((res) => {
				setSelectedCoupons(res?.data?.fetchCoupons?.data?.Coupondata?.map((i: FetchCouponsDataArr) => parseInt(i.id)));
			});
		}
	}, [data?.fetchCoupons]);

	/** Used for refetch listing of coupon data after filter
	 */
	useEffect(() => {
		if (filterData) {
			getCoupons(filterData).catch((err) => {
				toast.error(err);
			});
		}
	}, [filterData]);
	/**
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortCupn = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
		});
	};

	/**Method used for delete Coupon data
	 */
	const deleteCoupon = useCallback(() => {
		deleteCouponBYId({
			variables: {
				deleteCouponId: couponObj.id,
			},
		})
			.then((res) => {
				const data = res.data as DeleteCouponType;
				if (data?.deleteCoupon?.meta?.statusCode === 200) {
					toast.success(data?.deleteCoupon?.meta?.message);
					setIsDeleteCoupon(false);
					getCoupons(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	}, [IsdeleteCoupon]);

	/**Method used for close model
	 */
	const onCloseCupn = useCallback(() => {
		setIsStatusModelShowCoupon(false);
		setIsDeleteCoupon(false);
		setIsDeleteConfirmationOpen(false);
	}, []);
	/**
	 * @param e Method used for change dropdown for page limit
	 */
	const onPageDrpSelectCupn = (e: string) => {
		setRecordsperpage(Number(e));
		const updatedFilterData = {
			...filterData,
			limit: parseInt(e),
			page: 1,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterCoupon', JSON.stringify(updatedFilterData));
	};
	/** Method used for change coupon status model
	 */
	function onChangeStatusCupn(data: FetchCouponsDataArr) {
		setIsStatusModelShowCoupon(true);
		setCouponObj(data);
	}
	/** Method used for change coupon status with API
	 */
	const changeCouponStatus = useCallback(() => {
		UpdateCouponStatus({
			variables: {
				updateCouponStatusId: couponObj?.id,
				status: couponObj.status === 1 ? 0 : 1,
			},
		})
			.then((res) => {
				const data = res.data as UpdateCouponStatusType;
				if (data?.updateCouponStatus?.meta?.statusCode === 200) {
					toast.success(data?.updateCouponStatus?.meta?.message);
					setIsStatusModelShowCoupon(false);
					getCoupons(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	}, [isStatusModelShowCoupon]);
	/**
	 *
	 * @param values are used set the filter data
	 */
	const onSearchCoupon = useCallback(
		(values: FilterCouponsProps) => {
			setFilterData({
				...filterData,
				couponName: values.couponName,
				status: parseInt(values.status),
				startTime: values.startTime,
				expireTime: values.expireTime,
			});
		},
		[filterData]
	);

	const confirmDeleteCupn = useCallback(() => {
		// Perform the mutation to delete the selected coupons
		deleteCoupons({
			variables: { groupDeleteCouponsId: selectedCoupons[filterData.page - 1] },
		})
			.then((res) => {
				const data = res?.data as GroupDeleteCouponsRes;
				if (data?.groupDeleteCoupons?.meta?.statusCode === 200) {
					toast.success(data?.groupDeleteCoupons?.meta?.message);
					setIsDeleteConfirmationOpen(false);
					getCoupons(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to delete coupons'));
			});
		selectedCoupons[filterData.page - 1] = [];
	}, [selectedCoupons]);

	useEffect(() => {
		if (selectedCoupons?.length === data?.fetchCoupons?.data?.Coupondata?.length) {
			setSelectedAll(true);
		} else {
			setSelectedAll(false);
		}
	}, [selectedCoupons]);

	const handleDeleteCoupons = useCallback(() => {
		if (selectedCoupons[filterData.page - 1]?.length > 0) {
			setIsDeleteConfirmationOpen(true);
		} else {
			toast.error('Please select atleast one record');
		}
	}, [selectedCoupons]);

	const handleSelectCoupon = (couponId: number) => {
		// Check if the cupon ID is already selected
		const updateSelectedCoupon = [...selectedCoupons];

		const isSelected = updateSelectedCoupon?.[filterData.page - 1]?.includes(couponId);
		if (isSelected) {
			// If the cpoupon ID is already selected, remove it from the selection
			updateSelectedCoupon[filterData.page - 1] = updateSelectedCoupon[filterData.page - 1].filter((id: number) => id !== couponId);
		} else {
			// If the coupon ID is not selected, add it to the selection
			updateSelectedCoupon[filterData.page - 1] = [...updateSelectedCoupon[filterData.page - 1], couponId];
		}
		setSelectedCoupons(updateSelectedCoupon);
	};

	const handleSelectAllCupn = (event: React.ChangeEvent<HTMLInputElement>) => {
		const updateSelectedCoupon = [...selectedCoupons];
		if (!event.target.checked) {
			// Select all checkboxes
			updateSelectedCoupon[filterData.page - 1] = [];
			setSelectedCoupons(updateSelectedCoupon);
		} else {
			// Deselect all checkboxes
			updateSelectedCoupon[filterData.page - 1] = data?.fetchCoupons?.data?.Coupondata?.map((i: FetchCouponsDataArr) => {
				return parseInt(i.id);
			});
			setSelectedCoupons(updateSelectedCoupon);
		}
	};

	useEffect(() => {
		setRecordsperpage(filterData.limit);
	}, [filterData.limit]);

	const addRedirectionCpn = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.manageOffer}/add`);
	}, []);

	const clearSelectionCoupons = () => {
		setSelectedCoupons([]);
	  };
	return (
		<div>
			<FilterCoupon onSearchCoupon={onSearchCoupon} clearSelectionCoupons={clearSelectionCoupons} />
			<div className=' mb-3 w-full bg-white shadow-lg rounded-sm overflow-auto   border  border-[#c8ced3]'>
				<div className='bg-[#f0f3f5] py-3 px-5 flex items-center justify-between border-b border-[#c8ced3]'>
					<div className='flex items-center'>
						<Gift className='mr-2 text-gray-800' fontSize='12px' /> <span className='text-sm font-normal'>{t('Offer List')}</span>
					</div>
					<div className='btn-group col-span-3 flex items-start justify-end '>
						<Button className='btn-primary btn-normal ' onClick={handleDeleteCoupons} type='button' label={''} title={`${t('Delete')}`} >
							<Trash className='mr-1' />
							{t('Delete Selected')}
						</Button>
						<Button className='btn-primary btn-normal  ' onClick={addRedirectionCpn} type='button' label={''}  title={`${t('Add New')}`} >
							<PlusCircle className='mr-1' /> {t('Add New')}
						</Button>
					</div>
				</div>
				<div className='p-5 flex items-center justify-start '>
					<span className=' text-sm text-gray-900 font-normal '>{t('Show')}</span>
					<select className='border border-[#e4e7ea] rounded px-3 text-sm py-1.5 text-gray-500 mx-1 w-[75px] bg-white' onChange={(e) => onPageDrpSelectCupn(e.target.value)} value={filterData.limit}>
						{SHOW_PAGE_COUNT_ARR?.map((data: number) => {
							return <option key={data}>{data}</option>;
						})}
					</select>
					<span className=' text-sm text-gray-900 font-normal'>{t('entries')}</span>
				</div>
				<div className=' p-3 overflow-auto custom-dataTable '>
					<table>
						<thead>
							<tr>
								<th scope='col' className='text-center'>
									<input type='checkbox' className='checkbox' checked={selectedCoupons[filterData.page - 1]?.length === data?.fetchCoupons?.data?.Coupondata?.length} onChange={handleSelectAllCupn} />
								</th>
								{COL_ARR_COUPONS?.map((CouponVal: CouponColArrType) => {
									return (
										<th scope='col' key={CouponVal.fieldName}>
											<div className={`flex items-center ${CouponVal.name === t('Status') || CouponVal.name === 'Sr.No' ? 'justify-center' : ''}`}>
												{CouponVal.name}
												{CouponVal.sortable && (
													<a onClick={() => onHandleSortCupn(CouponVal.fieldName)}>
														{(filterData.sortOrder === '' || filterData.sortBy !== CouponVal.fieldName) && <GetDefaultIcon />}
														{filterData.sortOrder === 'asc' && filterData.sortBy === CouponVal.fieldName && <AngleUp />}
														{filterData.sortOrder === 'desc' && filterData.sortBy === CouponVal.fieldName && <AngleDown />}
													</a>
												)}
											</div>
										</th>
									);
								})}

								<th scope='col'>
									<div className='flex  justify-center'>{t('Action')}</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{data?.fetchCoupons?.data?.Coupondata?.map((data: FetchCouponsDataArr, index: number) => {
								return (
									<tr key={data.id}>
										<td className='text-center'>
											<input type='checkbox' className='checkbox' id={data.id} checked={selectedCoupons?.[filterData.page - 1]?.includes(parseInt(data.id))} onChange={() => handleSelectCoupon(parseInt(data.id))} />
										</td>
										<th scope='row' className=' text-center font-normal text-gray-700 whitespace-nowrap dark:text-white'>
											{index + 1}
										</th>
										<td> {data.coupon_name}</td>
										<td>{data.coupon_code}</td>
										<td>{data.coupon_type === 0 ? 'Percentage' : 'Amount'}</td>
										<td>{parseFloat(`${data.percentage}`).toFixed(2)}</td>
										<td>{data.is_reusable === 0 ? 'One Time' : 'Multiple Times'}</td>
										<td className='text-center'>{data.total_usage}</td>
										<td>{getDateFormat(data.start_time, DATE_FORMAT.momentDateTime24Format)}</td>
										<td>{getDateFormat(data.expire_time, DATE_FORMAT.momentDateTime24Format)}</td>
										<td>
											<div className=' flex justify-center'>{data.status === 1 ? <span className='badge badge-success rounded'>Active</span> : <span className='badge badge-danger rounded'>InActive</span>}</div>
										</td>
										<td>
											<div className='btn-group  flex justify-center'>
												<EditBtn data={data} route={ROUTES.manageOffer} />
												<div className='flex justify-center'>
													<span onClick={() => onChangeStatusCupn(data)} className='font-medium text-blue-600 mt-2 dark:text-blue-500 hover:underline'>
														<label className='relative inline-flex items-center cursor-pointer'>
															<input type='checkbox' className='sr-only peer' value={data.status} checked={data.status === 1} />
															<div className={'w-7 h-4 bg-gray-200 rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200 dark:peer-focus:ring-blue-800 dark:bg-whute peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-primary'}></div>
														</label>
													</span>
												</div>
												<DeleteBtn data={data} setObj={setCouponObj} setIsDelete={setIsDeleteCoupon} />
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					{(data?.fetchCoupons?.data === null || data?.fetchCoupons?.data === undefined) && (
						<div className='flex justify-center'>
							<div>{t('No Data')}</div>
						</div>
					)}
				</div>
				<div className='px-6 mb-4 flex items-center justify-between '>
					<span className='text-slate-400 text-xs'>
						{`${data?.fetchCoupons?.data?.count === null || data?.fetchCoupons?.data?.count === undefined ? '0' : data?.fetchCoupons?.data?.count}`}
						<span className='ml-1'>{t('Total Records')}</span>
					</span>

					<Pagination currentPage={filterData.page} totalPages={totalPages} onPageChange={handlePageChangeCpn} recordsPerPage={recordsPerPage} />
				</div>
			</div>
			{isStatusModelShowCoupon && <CommonModel warningText={CHANGE_STATUS_WARNING_TEXT} onClose={onCloseCupn} action={changeCouponStatus} show={isStatusModelShowCoupon} />}
			{IsdeleteCoupon && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={onCloseCupn} action={deleteCoupon} show={IsdeleteCoupon} />}
			{isDeleteConfirmationOpen && <CommonModel warningText={GROUP_DELETE_WARNING_TEXT} onClose={onCloseCupn} action={confirmDeleteCupn} show={isDeleteConfirmationOpen} />}
		</div>
	);
};
export default CouponManagaement;
