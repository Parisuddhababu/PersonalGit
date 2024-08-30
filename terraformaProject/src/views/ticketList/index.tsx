import React, { useCallback, useEffect, useState } from 'react';
import UpdatedHeader from '@components/header/updatedHeader';
import { useTranslation } from 'react-i18next';
import { CHANGE_STATUS_WARNING_TEXT, DELETE_WARNING_TEXT, DateTime12Format, DateYearFormat, SHOW_PAGE_COUNT_ARR, USER_TYPE } from '@config/constant';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CUSTOMER_TICKETS_WITH_PAGINATION } from '@framework/graphql/queries/customerTicket';
import { PaginationParams } from '@types';
import DeleteBtn from '@components/common/deleteBtn';
import { toast } from 'react-toastify';
import filterServiceProps from '@components/filter/filter';
import CommonModel from '@components/common/commonModel';
import Pagination from '@components/Pagination/Pagination';
import TextInput from '@components/textInput/TextInput';
import { Cross, DropdownArrowDown, Edit, Search } from '@components/icons/icons';
import { CUSTOMER_TICKET_DELETE, CUSTOMER_TICKET_STATUS_CHANGE } from '@framework/graphql/mutations/customerTicket';
import { UserProfileType } from 'src/types/common';
import { useSelector } from 'react-redux';
import DropDown from '@components/dropdown/dropDown';
import { useFormik } from 'formik';
import Button from '@components/button/button';
import Loader from '@components/common/loader';

interface CustomerData {
	attachments: string,
	email: string,
	first_name: string,
	last_name: number,
	message: string,
	phone_number: string,
	status: number,
	uuid: number,
	createdAt: string
}

const Index = () => {
	const { t } = useTranslation();
	const { data, refetch, loading } = useQuery(GET_CUSTOMER_TICKETS_WITH_PAGINATION, { variables: { filterData: { sortOrder: 'descend', sortField: 'createdAt', limit: 10, page: 1, search: '', ticket_type: null } } });
	const [filterTicketData, setTicketFilterData] = useState<PaginationParams>({
		sortOrder: 'descend',
		sortField: 'createdAt',
		limit: 10,
		page: 1,
		search: '',
		ticket_type: null,
		index: 0,
	});
	const [recordsTicketPerPage, setRecordsTicketPerPage] = useState<number>(filterTicketData.limit);
	const [isTicketDelete, setIsTicketDelete] = useState<boolean>(false);
	const [bannerObj, setBannerObj] = useState({} as CustomerData)
	const totalInvoicePage = data?.getCustomerTicketsWithPagination?.data?.count || 0;
	const totalPages = Math.ceil(totalInvoicePage / recordsTicketPerPage);
	const [deleteWasteAudit, deleteLoading] = useMutation(CUSTOMER_TICKET_DELETE);
	const [updateCustomerTicketStatus, editLoading] = useMutation(CUSTOMER_TICKET_STATUS_CHANGE)
	const [isStatusTicketModelShow, setIsStatusTicketModelShow] = useState<boolean>(false)
	const [ticketObj, setTicketObj] = useState({} as CustomerData);
	const [onEdit, setOnEdit] = useState<boolean>(false);

	const initialTicketValues = {
		status: ''
	}

	const formik = useFormik({
		initialValues: initialTicketValues,
		onSubmit: () => {
			//
		},
	});

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	*/
	const onPageDrpSelectTicket = (e: string) => {
		const newLimit = Number(e);
		const updatedFilterData = {
			...filterTicketData,
			limit: newLimit,
			page: 1,
			index: 0,
			search: '',
		};
		setTicketFilterData(updatedFilterData);
		filterServiceProps.saveState('filterValueCustomerTicket', JSON.stringify(updatedFilterData));
	};

	const handlePageTicketChange = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterTicketData,
			page: newPage,
			index: (newPage - 1) * filterTicketData.limit,
		};
		setTicketFilterData(updatedFilterData);
		filterServiceProps.saveState('filterValueCustomerTicket', JSON.stringify(updatedFilterData));
	}, [filterTicketData.limit]);

	useEffect(() => {
		setRecordsTicketPerPage(filterTicketData.limit);
	}, [filterTicketData.limit]);

	/**
	 *
	 * @param e Method used for store search value
	*/
	const onSearchTicketInvoice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setTicketFilterData({ ...filterTicketData, search: e.target.value })
	}, [])

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { index, ...newObject } = filterTicketData;
		refetch({ filterData: newObject }).catch((err) => toast.error(err))
	}, [filterTicketData])

	const onTicketClose = useCallback(() => {
		setIsTicketDelete(false);
	}, [])

	const onTicketRemove = useCallback(() => {
		deleteWasteAudit({
			variables: {
				reportId: bannerObj?.uuid,
			},
		})
			.then((res) => {
				const data = res.data
				toast.success(data?.deleteWasteAudit?.message)
				refetch();
				setIsTicketDelete(false);
			})
			.catch((err) => {
				toast.error(err.networkError.result.errors[0].message)
				setIsTicketDelete(false);
			})
	}, [bannerObj])

	/**
			* Method used for change Category status model
	  */
	const onChangeTicketStatus = useCallback(() => {
		setIsStatusTicketModelShow(true)
		setOnEdit(false);
	}, [])

	const onEditTicketBtn = useCallback((data: CustomerData) => {
		setOnEdit(true);
		setTicketObj(data)
	}, [])

	/**
		* Method used for close model
	*/
	const onCloseTicket = useCallback(() => {
		setIsStatusTicketModelShow(false)
	}, []);

	const changeTicketStatus = useCallback(() => {
		updateCustomerTicketStatus({
			variables: {
				ticketData: {
					ticketId: ticketObj?.uuid,
					status: +formik?.values?.status
				}
			},
		})
			.then((res) => {
				const data = res.data
				toast.success(data.changeStatusOfTicket.message)
				setIsStatusTicketModelShow(false)
				refetch()
			})
			.catch((err) => {
				toast.error(err?.networkError?.result?.errors[0]?.message)
			})
	}, [isStatusTicketModelShow, formik?.values?.status, ticketObj])

	const StatusDrpData = [
		{ name: 'Open', key: 1 },
		{ name: 'Inprogress', key: 2 },
		{ name: 'Close', key: 3 },
		{ name: 'Reject', key: 4 },
		{ name: 'Block', key: 5 },
		{ name: 'Unblock', key: 6 },
	];

	const onTicketCancel = useCallback(() => {
		setOnEdit(false);
		setTicketObj({} as CustomerData);
	}, [])

	const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
	const userType = userProfileData?.getProfile?.data?.user_type ?? ''

	return (
		<>
			<UpdatedHeader headerTitle='Tickets List' />
			{(loading || deleteLoading?.loading) && <Loader />}
			<div className='mb-5 overflow-auto border border-solid rounded-t-xl border-border-primary md:mb-7'>
				<div className='w-full flex items-center justify-end m-0 mt-5 mb-5 -ml-5'>
					<TextInput
						type='text'
						id='table-search'
						value={filterTicketData.search}
						placeholder={t('Search')}
						onChange={onSearchTicketInvoice}
						inputIcon={<Search fontSize='18' className='font-normal' />}
					/>
				</div>
				<table className='m-0 [&>tbody>tr:nth-child(even)]:bg-white [&>tbody>tr:nth-child(even):hover]:bg-gray-200 text-sm md:text-base leading-5 normal-table'>
					<thead className='text-lg md:text-xl'>
						<tr className='border-none bg-accents-2'>
							<th className='p-4 md:p-5 text-baseColor'>{t('Sr.No')}</th>
							<th className='p-4 md:p-5 text-baseColor min-w-[115px] 2xl:min-w-[156px]'>{t('Time')}</th>
							<th className='p-4 md:p-5 text-baseColor min-w-[145px] 2xl:min-w-[164px]'>{t('Date')}</th>
							<th className='p-4 md:p-5 text-baseColor min-w-[566px]'>{t('Message')}</th>
							{userType === USER_TYPE.SUPER_ADMIN && <th className='p-4 md:p-5 text-baseColor'>{t('Action')}</th>}
						</tr>
					</thead>
					<tbody className='text-baseColor'>
						{data?.getCustomerTicketsWithPagination?.data?.tickets?.map((data: CustomerData, index: number) => {
							const displayIndex = filterTicketData?.index as number + index + 1;
							return (
								<tr className='border-b border-solid border-border-primary last:border-none hover:cursor-pointer' key={data?.uuid}>
									<td className='px-4 py-3 text-left md:p-5'>
										<p>{displayIndex}</p>
									</td>
									<td className='px-4 py-3 text-left md:p-5'>
										<p>{DateTime12Format(data?.createdAt)}</p>
									</td>
									<td className='px-4 py-3 text-left md:p-5'>
										<p>{DateYearFormat(data?.createdAt)}</p>
									</td>
									<td className="px-4 py-3 md:p-5">
										<div className='text-left'>
											<p>{t(data?.message)}</p>
										</div>
									</td>
									{userType === USER_TYPE.SUPER_ADMIN && <td className="px-4 py-3 md:p-5 flex">
										<Button className='bg-transparent btn-default' onClick={() => onEditTicketBtn(data)} label={''}
										 title={`${t('Edit')}`} >
											<Edit />
										</Button>
										<DeleteBtn className='ml-2' data={data} setObj={setBannerObj} setIsDelete={setIsTicketDelete} />
									</td>}
								</tr>
							)
						})}
					</tbody>
				</table>
				{(data?.getCustomerTicketsWithPagination?.data?.count === 0) && (
					<div className='flex justify-center items-center w-full mt-2'>
						<div>No Data</div>
					</div>
				)}
				<div className='flex flex-wrap items-center gap-2 px-5 mt-2 md:gap-5 text-slate-700'>
					<div className='flex items-center'>
						<span className='mr-2 text-sm whitespace-nowrap'>{t('Per Page')}</span>
						<select value={filterTicketData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white' onChange={(e) => onPageDrpSelectTicket(e.target.value)}>
							{SHOW_PAGE_COUNT_ARR?.map((data: number) => {
								return <option key={data}>{data}</option>;
							})}
						</select>
					</div>
					<div>
						<Pagination currentPage={filterTicketData.page}
							totalPages={totalPages}
							onPageChange={handlePageTicketChange}
							recordsPerPage={recordsTicketPerPage}
						/>
					</div>
				</div>
			</div>

			{isTicketDelete && (
				<CommonModel
					warningText={DELETE_WARNING_TEXT}
					onClose={onTicketClose}
					action={onTicketRemove}
					show={isTicketDelete}
				/>
			)}

			{isStatusTicketModelShow && (
				<CommonModel
					warningText={CHANGE_STATUS_WARNING_TEXT}
					onClose={onCloseTicket}
					action={changeTicketStatus}
					show={isStatusTicketModelShow}
					disabled={editLoading?.loading}
				/>
			)}

			{onEdit && (
				<div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${onEdit ? '' : 'hidden'}`}>
					<div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${onEdit ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
						<div className='w-full mx-5 sm:max-w-[400px]'>
							<div className='relative bg-white rounded-xl'>
								{/* <!-- Modal header --> */}
								<div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
									<p className='text-lg font-bold md:text-xl text-baseColor'>{'Select customer ticket status'}</p>
									<Button onClick={() => onTicketCancel()} label=''  title={`${t('Close')}`} >
										<span className='text-xl-22'><Cross className='text-error' /></span>
									</Button>
								</div>
								{/* <!-- Modal body --> */}
								<div className='w-full flex p-5 items-center justify-center'>
									<DropDown placeholder={t('Select ticket status')} className='w-full' inputIcon={<span className='text-xs'><DropdownArrowDown className='fill-dark-grey' /></span>} onChange={formik.handleChange} value={formik.values.status} options={StatusDrpData} name='status' id='status' required={false} />
								</div>
								<div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
									<Button className='btn-primary btn-normal mb-2 md:mb-0 w-full md:w-auto min-w-[160px]' type='button' label='Save' onClick={onChangeTicketStatus} title={`${t('Save')}`}  />
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>

	);
};
export default Index;
