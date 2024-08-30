import React, { useCallback, useEffect, useState } from 'react';
import { getDateFromUTCstamp, sortOrder } from '@utils/helpers';
import { PhoneCall, Search } from '@components/icons';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import Pagination from '@components/pagination/Pagination';
import { DEFAULT_LIMIT, DEFAULT_PAGE, endPoint } from '@config/constant';
import { URL_PATHS } from '@config/variables';
import { APIService } from '@framework/services/api';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { ColArrType, PaginationParams } from 'src/types/common';
import { debounce } from 'lodash';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import StatusButton from '@components/common/StatusButton';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import TextInput from '@components/textInput/TextInput';
import ContactUsModal from './ContactUsModal';
import CommonButton from '@components/common/CommonButton';
import { ContactUsData, ContactUsResponse, ImageObj } from 'src/types/contactUs';

const ContactUsPage = () => {
	useEscapeKeyPress(() => onCloseContactUs()); // use to close model on Eac key.
	const [loadingContactUs, setLoadingContactUs] = useState<boolean>(false);
	const [contactUsData, setContactUsData] = useState<ContactUsResponse>();
	const [editData, setEditData] = useState<ContactUsData | null>(null);
	const [isStatusModalShow, setIsStatusModalShow] = useState<boolean>(false);
	const [showDescription, setShowDescription] = useState<boolean>(false);

	const [filterContactUsData, setFilterContactUsData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrderValues.asc,
		search: '',
	});

	const COL_ARR_CONTACT_US = [{ name: 'Sr.No' }, { name: 'Reason', sortable: true, fieldName: 'reasonForContact' }, { name: 'Phone Number', sortable: true, fieldName: 'phoneNumber' }, { name: 'Created At', sortable: true, fieldName: 'createdAt' }, { name: 'Description' }] as ColArrType[];

	/**
	 * ContactUs data api call
	 */
	const getContactUsDetails = useCallback(() => {
		setLoadingContactUs(true);
		APIService.getData(`${URL_PATHS.contactUs}/${endPoint.list}?page=${filterContactUsData.page}&limit=${filterContactUsData.limit}&sortBy=${filterContactUsData.sortBy}&sortOrder=${filterContactUsData.sortOrder}&search=${filterContactUsData.search}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setContactUsData(response?.data);
				}
			})
			.catch((err) => toast.error(err?.response?.data.message))
			.finally(() => setLoadingContactUs(false));
	}, [filterContactUsData]);

	/**
	 * Method used to fetch ContactUs list
	 */
	useEffect(() => {
		getContactUsDetails();
	}, [filterContactUsData]);

	/**
	 * @param data Method used for show category change status modal
	 */
	const onChangeContactUsStatus = useCallback((data: ContactUsData) => {
		setEditData(data);
		setIsStatusModalShow(true);
	}, []);

	/**
	 * @param value used to send boolean true or false
	 */
	const updateContactUsStatus = (value: boolean) => {
		setLoadingContactUs(true);
		APIService.patchData(`${URL_PATHS.contactUs}/${editData?.uuid}`, {
			isResolved: value,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getContactUsDetails();
				}
			})
			.catch((err) => toast.error(err?.response?.data.message))
			.finally(() => setLoadingContactUs(false));
	};

	/**
	 * Method used for change category status with API
	 */
	const changeContactUsStatus = useCallback(() => {
		const data = editData?.isResolved;
		updateContactUsStatus(!data);
		setIsStatusModalShow(false);
		setEditData(null);
	}, [isStatusModalShow]);

	/**
	 *
	 * @param event Method used for on page click
	 */
	const handleContactUsPageClick = useCallback(
		(event: { selected: number }) => {
			setFilterContactUsData({ ...filterContactUsData, page: event.selected + 1 });
		},
		[filterContactUsData]
	);

	/**
	 * @param sortFieldName Method used for storing sort data
	 */
	const onContactUsHandleSort = (sortFieldName: string) => {
		setFilterContactUsData({
			...filterContactUsData,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterContactUsData.sortOrder),
		});
	};

	/**
	 * @param e Method used for change dropdown for page limit
	 */
	const onContactUsPageDrpSelect = useCallback(
		(e: string) => {
			setFilterContactUsData({ ...filterContactUsData, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterContactUsData]
	);

	/**
	 * @param e Method used for store search value
	 */
	const handleSearchStars = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterContactUsData({ ...filterContactUsData, search: searchTerm });
		}, 500),
		[filterContactUsData]
	);

	/**
	 * Method used for close modal
	 */
	const onCloseContactUs = useCallback(() => {
		setIsStatusModalShow(false);
		setShowDescription(false);
		setEditData(null);
	}, []);

	const descriptionHandler = useCallback((data: ContactUsData) => {
		setEditData(data);
		setShowDescription(true);
	}, []);

	return (
		<div>
			{loadingContactUs && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<PhoneCall className='mr-1 text-primary' /> Contact Us
					</h6>
				</div>
				<div className='p-3 w-full'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleSearchStars} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onContactUsPageDrpSelect} value={filterContactUsData.limit} />
					</div>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									{COL_ARR_CONTACT_US?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												<div className='flex items-center'>
													{colVal.name}
													{colVal.sortable && (
														<button onClick={() => onContactUsHandleSort(colVal.fieldName)}>
															{(filterContactUsData.sortOrder === '' || filterContactUsData.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterContactUsData.sortOrder === sortOrderValues.asc && filterContactUsData.sortBy === colVal.fieldName && getAscIcon()}
															{filterContactUsData.sortOrder === sortOrderValues.desc && filterContactUsData.sortBy === colVal.fieldName && getDescIcon()}
														</button>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col' className='w-32'>
										Resolved
									</th>
								</tr>
							</thead>
							<tbody>
								{contactUsData?.data?.data.map((data, index) => {
									return (
										<tr key={data.uuid}>
											<th scope='row' className='w-20 text-center'>
												{index + 1}
											</th>
											<td className='font-medium'>{data.reasonForContact}</td>
											<td className='w-40'>{data.phoneNumber}</td>
											<td className='w-40 text-center'>
												<p>{getDateFromUTCstamp(data.createdAt)}</p>
											</td>
											<td className='w-40 text-center'>
												<CommonButton data={data} dataHandler={descriptionHandler} isDescription={true} title='Description' />
											</td>
											<td>
												<div className='text-center'>
													<StatusButton data={data} isChangeStatusModal={onChangeContactUsStatus} status={`${data.isResolved}`} checked={data.isResolved} />
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!contactUsData?.data?.count && <p className='text-center'>No Contact Us Data Found</p>}
					</div>
					<Pagination length={contactUsData?.data?.count as number} onSelect={handleContactUsPageClick} limit={filterContactUsData.limit} />
				</div>
			</div>
			{isStatusModalShow && <ChangeStatus onClose={onCloseContactUs} changeStatus={changeContactUsStatus} />}
			{showDescription && <ContactUsModal onClose={onCloseContactUs} description={editData?.description ?? ''} media={editData?.image as ImageObj} />}
		</div>
	);
};
export default ContactUsPage;
