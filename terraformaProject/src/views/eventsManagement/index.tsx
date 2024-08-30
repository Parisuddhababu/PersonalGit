import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';

import { ROUTES, SHOW_PAGE_COUNT_ARR as PAGE_COUNT_EVENTS, DELETE_WARNING_TEXT, GROUP_DELETE_WARNING_TEXT, DATE_FORMAT } from '@config/constant';
import { GetDefaultIcon, Calendar, PlusCircle, Trash, AngleUp, AngleDown } from '@components/icons/icons';
import Button from '@components/button/button';
import CommonModel from '@components/common/commonModel';
import Pagination from '@components/Pagination/Pagination';
import filterServiceProps from '@components/filter/filter';
import EditBtn from '@components/common/EditButton';
import DeleteBtn from '@components/common/deleteBtn';
import ViewBtn from '@components/common/viewButton';
import FilterEvents from './filterEvents';
import { DeleteEventType, EventsDataArr, GroupDeleteEventsRes } from '@framework/graphql/graphql';
import { GET_EVENTS } from '@framework/graphql/queries/event';
import { DELETE_EVENT, GROUP_DELETE_EVENTS } from '@framework/graphql/mutations/event';
import { FilterEventProps, PaginationParams } from 'src/types/event';
import { ColArrType } from 'src/types/common';
import DescriptionModel from '@views/descriptionModel';
import { getDateFormat } from '@utils/helpers';

import { useMutation, useQuery } from '@apollo/client';

const Events = () => {
	const { data, refetch: getEvents } = useQuery(GET_EVENTS);
	const navigate = useNavigate();
	const [isDeleteEventShow, setIsDeleteEventShow] = useState<boolean>(false);
	const [eventObj, setEventObj] = useState({} as EventsDataArr);
	const [deleteEventMutation] = useMutation(DELETE_EVENT);
	const [deleteEvents] = useMutation(GROUP_DELETE_EVENTS);
	const COL_ARR_EVENTS = [
		{ name: 'Sr.No', sortable: false },
		{ name: t('Event Name'), sortable: true, fieldName: 'event_name' },
		{ name: t('Description'), sortable: false, fieldName: 'description' },
		{ name: t('Recurrence'), sortable: true, fieldName: 'is_recurring' },
		{ name: t('Start Date Time'), sortable: true, fieldName: 'start_date' },
		{ name: t('End Date Time'), sortable: true, fieldName: 'end_date' },
		{ name: t('Created by'), sortable: true, fieldName: 'created_by' },
	] as ColArrType[];
	const [filterData, setFilterData] = useState<PaginationParams>({
		page: 1,
		limit: 10,
		sortBy: '',
		sortOrder: '',
		eventName: '',
		startDate: '',
		endDate: '',
		createdBy: 1,
	});
	const [isDeleteConfirmationOpenEvents, setIsDeleteConfirmationOpenEvents] = useState<boolean>(false);
	const [selectedAllEvents, setSelectedAllEvents] = useState(false);
	const [selectedEvents, setSelectedEvents] = useState<number[][]>([]);
	const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
	const totalRuleSets = data?.fetchEvents?.data?.count || 0;
	const totalPages = Math.ceil(totalRuleSets / recordsPerPage);
	const handlePageChangeEvent = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterData,
			page: newPage,
		};

		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterEvent', JSON.stringify(updatedFilterData));
	}, []);
	useEffect(() => {
		const savedFilterDataJSON = filterServiceProps.getState('filterEvent', JSON.stringify(filterData));
		if (savedFilterDataJSON) {
			const savedFilterData = JSON.parse(savedFilterDataJSON);
			setFilterData(savedFilterData);
		}
	}, []);
	/**
	 * Used for set subAdmin data from res in local variable
	 */
	useEffect(() => {
		if (!selectedEvents?.length) {
			const totalPages = Math.ceil(data?.fetchEvents?.data?.count / filterData?.limit);
			const pages = [];
			for (let i = 0; i < totalPages; i++) {
				pages.push([]);
			}
			setSelectedEvents(pages);
		}
	}, [data?.fetchEvents]);

	/**method that sets all events selected */
	useEffect(() => {
		if (selectedAllEvents) {
			getEvents().then((res) => {
				setSelectedEvents(res?.data?.fetchEvents?.data?.FetchEventData?.map((i: EventsDataArr) => i.id));
			});
		}
	}, [data?.fetchEvents]);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortEvent = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
		});
	};

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onPageDrpSelectEvent = (e: string) => {
		setRecordsPerPage(Number(e));
		const updatedFilterData = {
			...filterData,
			limit: parseInt(e),
			page: 1,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterEvent', JSON.stringify(updatedFilterData));
	};
	/**
	 * Method used for delete subAdmin data
	 */
	const deleteEvent = useCallback(() => {
		deleteEventMutation({
			variables: { deleteEventId: eventObj?.id },
		})
			.then((res) => {
				const data = res?.data?.deleteEvent as DeleteEventType;
				if (data?.meta?.statusCode === 200) {
					toast.success(data?.meta?.message);
					setIsDeleteEventShow(false);
					getEvents(filterData).catch((e) => toast.error(e));
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	}, [isDeleteEventShow]);

	/**
	 * Method used for close model
	 */
	const onCloseEvent = useCallback(() => {
		setIsDeleteEventShow(false);
		setIsDeleteConfirmationOpenEvents(false);
		setShowDescriptionModelShow(false);
	}, []);

	/**
	 * Used for refetch listing of subAdmin data after filter
	 */
	useEffect(() => {
		if (filterData) {
			getEvents(filterData).catch((err) => {
				toast.error(err);
			});
		}
	}, [filterData]);

	/**
	 *
	 * @param values Method used for set filter data
	 */
	const onSearchEvent = useCallback((values: FilterEventProps) => {
		setFilterData({
			...filterData,
			eventName: values.eventName,
			startDate: values.startDate,
			endDate: values.endDate,
			createdBy: values.createdBy,
		});
	}, []);
	const confirmDeleteEvents = useCallback(() => {
		// Perform the mutation to delete the selected coupons
		deleteEvents({
			variables: { groupDeleteEventsId: selectedEvents[filterData.page - 1] },
		})
			.then((res) => {
				const data = res?.data as GroupDeleteEventsRes;
				if (data?.groupDeleteEvents?.meta?.statusCode === 200) {
					toast.success(data?.groupDeleteEvents?.meta?.message);
					setIsDeleteConfirmationOpenEvents(false);
					getEvents(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to delete coupons'));
			});
		selectedEvents[filterData.page - 1] = [];
	}, [selectedEvents]);
	useEffect(() => {
		if (selectedEvents?.length === data?.fetchEvents?.data?.FetchEventData?.length) {
			setSelectedAllEvents(true);
		} else {
			setSelectedAllEvents(false);
		}
	}, [selectedEvents]);

	const handleDeleteEvents = useCallback(() => {
		if (selectedEvents[filterData.page - 1]?.length > 0) {
			setIsDeleteConfirmationOpenEvents(true);
		} else {
			toast.error('Please select at least one record');
		}
	}, [selectedEvents]);
	const handleSelectEvent = (couponId: number) => {
		// Check if the coupon ID is already selected
		const updateSelectedEvents = [...selectedEvents];

		const isSelected = updateSelectedEvents?.[filterData.page - 1]?.includes(couponId);
		if (isSelected) {
			// If the coupon ID is already selected, remove it from the selection
			updateSelectedEvents[filterData.page - 1] = updateSelectedEvents[filterData.page - 1].filter((id: number) => id !== couponId);
		} else {
			// If the coupon ID is not selected, add it to the selection
			updateSelectedEvents[filterData.page - 1] = [...updateSelectedEvents[filterData.page - 1], couponId];
		}
		setSelectedEvents(updateSelectedEvents);
	};

	const handleSelectAllEvents = (event: React.ChangeEvent<HTMLInputElement>) => {
		const updateSelectedEvents = [...selectedEvents];
		if (!event.target.checked) {
			// Select all checkboxes
			updateSelectedEvents[filterData.page - 1] = [];
			setSelectedEvents(updateSelectedEvents);
		} else {
			// Deselect all checkboxes
			updateSelectedEvents[filterData.page - 1] = data?.fetchEvents?.data?.FetchEventData?.map((i: EventsDataArr) => {
				return i.id;
			});
			setSelectedEvents(updateSelectedEvents);
		}
	};
	const [description, setDescription] = useState<string>('');
	const [isDescriptionModelShow, setShowDescriptionModelShow] = useState<boolean>(false);
	const descriptionHandler = (value: string) => {
		setDescription(value);
		setShowDescriptionModelShow((prev) => !prev);
	};
	useEffect(() => {
		setRecordsPerPage(filterData.limit);
	}, [filterData.limit]);
	const addRedirectionEvent = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.event}/add`);
	}, []);

	const clearSelectionEvents = () => {
		setSelectedEvents([]);
	  };

	return (
		<div>
			<FilterEvents onSearchEvent={onSearchEvent}  clearSelectionEvents={clearSelectionEvents}/>
			<div className='mb-3 w-full bg-white shadow-lg rounded-sm overflow-auto border border-[#c8ced3]'>
				<div className='bg-[#f0f3f5] py-3 px-5 flex items-center justify-between border-b border-[#c8ced3]'>
					<div className='flex items-center'>
						<Calendar className='mr-2' fontSize='12px' /> <span className='text-sm font-normal'> {t('Event List')}</span>
					</div>
					<div className='btn-group  '>
						<Button className='btn-primary btn-normal ' onClick={handleDeleteEvents} type='button' label={t('Delete Selected')}  title={`${t('Delete')}`}>
							<Trash className='mr-1 ' />
						</Button>
						<Button className='btn-primary btn-normal ' onClick={addRedirectionEvent} type='button' label={t('Add New')} 
						 title={`${t('Add New')}`}>
							<PlusCircle className='mr-1 fill-white' />
						</Button>
					</div>
				</div>
				<div className='p-3 flex items-center justify-start mb-3'>
					<span className=' text-sm text-gray-900 font-normal '>{t('Show')}</span>
					<select className='border border-[#e4e7ea] rounded px-3 text-sm py-1.5 text-gray-500 mx-1 w-[75px] bg-white' onChange={(e) => onPageDrpSelectEvent(e.target.value)} value={filterData.limit}>
						{PAGE_COUNT_EVENTS?.map((item: number) => {
							return <option key={item}>{item}</option>;
						})}
					</select>
					<span className=' text-sm text-gray-900 font-normal'>{t('entries')}</span>
				</div>
				<div className='p-3 overflow-auto custom-dataTable'>
					<table>
						<thead>
							<tr>
								<th scope='col' className='text-center'>
									<input type='checkbox' className='checkbox' checked={selectedEvents[filterData.page - 1]?.length === data?.fetchEvents?.data?.FetchEventData?.length} onChange={handleSelectAllEvents} />
								</th>
								{COL_ARR_EVENTS?.map((eventVal: ColArrType) => {
									return (
										<th scope='col' key={eventVal.fieldName}>
											<div className={`flex items-center ${eventVal.name === 'Sr.No' || eventVal.name === t('Description') ? 'justify-center' : ''} `}>
												{eventVal.name}
												{eventVal.sortable && (
													<a onClick={() => onHandleSortEvent(eventVal.fieldName)}>
														{(filterData.sortOrder === '' || filterData.sortBy !== eventVal.fieldName) && <GetDefaultIcon />}
														{filterData.sortOrder === 'asc' && filterData.sortBy === eventVal.fieldName && <AngleUp />}
														{filterData.sortOrder === 'desc' && filterData.sortBy === eventVal.fieldName && <AngleDown />}
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
							{data?.fetchEvents?.data?.FetchEventData?.map((data: EventsDataArr, index: number) => {
								return (
									<tr key={data.id}>
										<td className='text-center'>
											<input type='checkbox' className='checkbox' id={`${data.id}`} checked={selectedEvents?.[filterData.page - 1]?.includes(data.id)} onChange={() => handleSelectEvent(data.id)} />
										</td>
										<th scope='row' className=' font-normal text-gray-700 whitespace-nowrap dark:text-white text-center'>
											{index + 1}
										</th>
										<td>{data.event_name}</td>
										<td className='text-center'>
											{data.description.length > 20 ? data.description.slice(0, 20) : data.description}
											{data.description.length > 20 ? (
												<a className='text-red-500 hover:underline hover:cursor-pointer' onClick={() => descriptionHandler(data.description)}>
													show more...
												</a>
											) : (
												''
											)}
										</td>
										<td>{data.is_recurring}</td>
										<td>{getDateFormat(data.start_date, DATE_FORMAT.momentDateTime24Format)}</td>
										<td>{getDateFormat(data.end_date, DATE_FORMAT.momentDateTime24Format)}</td>
										<td>{data.User.user_name}</td>
										<td>
											<div className='  flex justify-center'>
												<ViewBtn data={data} route={ROUTES.event} />
												<EditBtn data={data} route={ROUTES.event} />
												<DeleteBtn data={data} setObj={setEventObj} setIsDelete={setIsDeleteEventShow} />
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					{(data?.fetchEvents?.data === null || data?.fetchEvents?.data === undefined) && (
						<div className='flex justify-center'>
							<div>{t('No Data')}</div>
						</div>
					)}
				</div>
				<div className='px-6 mb-4 flex items-center justify-between'>
					<span className='text-slate-400 text-xs'>
						{`${data?.fetchEvents?.data?.count === null || data?.fetchEvents?.data?.count === undefined ? '0' : data?.fetchEvents?.data?.count}`}
						<span className='ml-1'>{t('Total Records')}</span>
					</span>
					<Pagination currentPage={filterData.page} totalPages={totalPages} onPageChange={handlePageChangeEvent} recordsPerPage={recordsPerPage} />
				</div>
			</div>
			{isDescriptionModelShow && <DescriptionModel onClose={onCloseEvent} data={description} show={isDescriptionModelShow} />}
			{isDeleteEventShow && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={onCloseEvent} action={deleteEvent} show={isDeleteEventShow} />}
			{isDeleteConfirmationOpenEvents && <CommonModel warningText={GROUP_DELETE_WARNING_TEXT} onClose={onCloseEvent} action={confirmDeleteEvents} show={isDeleteConfirmationOpenEvents} />}
		</div>
	);
};
export default Events;
