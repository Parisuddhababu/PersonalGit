
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import TextInput from '@components/textInput/TextInput';
import Pagination from '@components/Pagination/Pagination';
import filterServiceProps from '@components/filter/filter';
import DeleteBtn from '@components/common/deleteBtn';
import CommonModel from '@components/common/commonModel';
import { DELETE_WARNING_TEXT, PAGE_LIMIT, PAGE_NUMBER, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { ArrowSortingDown, ArrowSortingUp, Cross, Eye, GetDefaultIcon, Search } from '@components/icons/icons';
import { SubscriberDatalist } from '@framework/graphql/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { PaginationParams, ColArrType } from '@types';
import UpdatedHeader from '@components/header/updatedHeader';
import { UserProfileType, UserRoles } from 'src/types/common';
import { FETCH_COMPANY_DIRECTORIES } from '@framework/graphql/queries/createCompany';
import { DELETE_NEW_COMPANY } from '@framework/graphql/mutations/createCompney';
import Button from '@components/button/button';


const RequestedCompany = () => {
	const { t } = useTranslation();
	const [deleteCompanyById] = useMutation(DELETE_NEW_COMPANY);
	const [isDeleteCompany, setIsDeleteCompany] = useState<boolean>(false);
	const [companyObj, setCompanyObj] = useState({} as SubscriberDatalist);
	const { companyDirectory } = useSelector(((state: { rolesManagement: { companyDirectory: UserRoles } }) => state.rolesManagement));
	const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
	const subscriberUUID = userProfileData?.getProfile?.data?.subscriber_id?.uuid;
	const [userPopup, setUserPopup] = useState<boolean>(false);

	const [filterData, setFilterData] = useState<PaginationParams>({
		sortOrder: 'DESC',
		limit: PAGE_LIMIT,
		page: PAGE_NUMBER,
		search: '',
		sortField: 'createdAt',
		index: 0,
		requestedCompanyApproval: true
	});

	const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
	const COL_ARR_REQUESTED_COMPANY = [
		{ name: t('Sr.No'), sortable: false },
		{ name: t('Company Name'), sortable: true, fieldName: 'name' },
		{ name: t('Email'), sortable: true, fieldName: 'email' },
		{ name: t('Phone Number'), sortable: true, fieldName: 'phone_number' },		
	] as ColArrType[];
	const { data, refetch } = useQuery(FETCH_COMPANY_DIRECTORIES, {
		variables: {
			sortOrder: filterData.sortOrder,
			limit: PAGE_LIMIT,
			page: PAGE_NUMBER,
			search: filterData.search,
			sortField: filterData.sortField,
			requestedCompanyApproval: true
		}
	});
	/**
	 * Method used for close model
	 */
	const onCloseCompany = useCallback(() => {
		setIsDeleteCompany(false);
	}, []);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */

	const onHandleSortCompany = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortField: sortFieldName,
			sortOrder: filterData.sortOrder === 'ASC' ? 'DESC' : 'ASC',
		});
	};

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */

	const onPageDrpSelectUserCompany = (e: string) => {
		const newLimit = Number(e);
		const updatedFilterData = {
			...filterData,
			limit: newLimit,
			page: PAGE_NUMBER,
			index: 0,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterCompany', JSON.stringify(updatedFilterData));
	};

	const totalCompany = data?.getCompanyDirectoriesWithPagination?.data?.count || 0;
	const totalPages = Math.ceil(totalCompany / recordsPerPage);
	const handlePageChange = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterData,
			page: newPage,
			index: (newPage - 1) * filterData.limit,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterCompany', JSON.stringify(updatedFilterData));
	}, [filterData.limit])

	useEffect(() => {
		setRecordsPerPage(filterData.limit);
	}, [filterData.limit]);
	/**
 * Method used for delete user data
 */

	const deleteCompany = useCallback(() => {
		deleteCompanyById({
			variables: {
				companyId: companyObj.uuid,
			},
		})
			.then((res) => {
				const data = res.data
				toast.success(data.deleteCompanyDirectory.message)
				setIsDeleteCompany(false)
				refetch();
			})
			.catch((err) => {
				toast.error(err.networkError.result.errors[0].message)
			})
	}, [companyObj.uuid]);

	const oncancel = () => {
		setUserPopup(false);
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [list, setList] = useState<any>('')

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onView = useCallback((data: any) => {
		setUserPopup(true);
		setList(data)
	}, []);
	/**
   *
   * @param e Method used for store search value
   */
	const onSearchCompany = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFilterData({ ...filterData, search: e.target.value })
	}, [])

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const {index, ...newObject} = filterData
		refetch(newObject).catch((err) => toast.error(err))
	}, [filterData])

	return (
		<>
			<UpdatedHeader />
			<div className='p-3 mb-3 overflow-auto bg-white border rounded-xl border-border-primary mx-7 md:p-5'>
				<div className='flex flex-col justify-between gap-3 mb-3 md:gap-5 md:mb-5 btn-group md:flex-row'>
					<h6 className='w-full leading-7 xmd:w-auto'>{t('Requested Company')}</h6>
					<TextInput
						type='text'
						id='table-search'
						value={filterData.search}
						placeholder={t('Search')}
						onChange={onSearchCompany}
						inputIcon={<Search fontSize='18' className='font-normal' />}
					/>
				</div>
				<div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
					<table className='mb-0'>
						<thead key='sorting'>
							<tr>
								{COL_ARR_REQUESTED_COMPANY?.map((colValUser: ColArrType) => {
									return (
										<th scope='col' key={colValUser.fieldName} className={`${colValUser.name == 'Sr.No' ? 'pl-7' : ''} text-white border-none  bg-accents-3 first:rounded-tl-extra-10`}>
											<div className='flex items-center'>
												{colValUser.name}
												{colValUser.sortable && (
													<button onClick={() => onHandleSortCompany(colValUser.fieldName)}>
														{(filterData.sortOrder === '' || filterData.sortField !== colValUser.fieldName) &&
															<GetDefaultIcon className='w-3 h-3 ml-1 fill-white' />}
														{filterData.sortOrder === 'ASC' && filterData.sortField === colValUser.fieldName &&
															<ArrowSortingUp className="ml-1 fill-white" />}
														{filterData.sortOrder === 'DESC' && filterData.sortField === colValUser.fieldName &&
															<ArrowSortingDown className="ml-1 fill-white" />}
													</button>
												)}
											</div>
										</th>
									);
								})}

								<th scope='col'>
									<div>{t('Action')}</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{data?.getCompanyDirectoriesWithPagination?.data?.companyDirectories?.map((data: { name: string, email: string, country_name: string, description: string, uuid: string, phone_number: string }, index: number) => {

								const displayIndex = filterData?.index as number + index + 1;
								return (
									<tr key={data.uuid}>

										<td scope='row' className='text-left pl-7 py-[11px]'>
											{displayIndex}
										</td>

										<td className='text-left border-none py-[11px]'>{data.name}</td>
										<td className='text-left border-none py-[11px]'>{data.email}</td>
										<td className='text-left border-none py-[11px]'>{data.phone_number}</td>


										<td className='border-none py-[11px]'>
											<div className='flex items-center gap-2 btn-group'>
												{!subscriberUUID && companyDirectory?.read && <Button className='mx-1 mr-2 bg-transparent btn-default' onClick={() => onView(data)} label={''}> <Eye /></Button>}
												{!subscriberUUID && companyDirectory?.delete && <DeleteBtn data={data} setObj={setCompanyObj} setIsDelete={setIsDeleteCompany} />}
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					{(data?.getCompanyDirectoriesWithPagination?.data?.count === 0 ||
						data?.getCompanyDirectoriesWithPagination?.data === null) && (
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
						<select value={filterData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white' onChange={(e) => onPageDrpSelectUserCompany(e.target.value)}>
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
				{userPopup && (
					<div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${userPopup ? '' : 'hidden'}`}>
						<div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className="flex items-center justify-center pt-10 transition-all duration-300">
							<div className='w-full mx-5 sm:max-w-[780px]'>
								{/* <!-- Modal content --> */}
								<div className='relative bg-white rounded-xl overflow-hidden'>
									{/* <!-- Modal header --> */}
									<div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
										<p className='text-lg font-bold md:text-xl text-baseColor'>{t('Requested Company Details')}</p>
										<Button onClick={() => oncancel()} label={t('')} title={`${t('Close')}`}>
											<span className='text-xl-22'><Cross className='text-error' /></span>
										</Button>
									</div>
									{/* <!-- Modal body --> */}
									<div className='w-full bg-white max-h-[calc(100vh-260px)] overflow-auto'>
										<div className='p-5 rounded-xl'>
											<div className='flex pb-3 max-sm:flex-wrap'>
												<p className='font-bold max-sm:mb-1 sm:flex-1 max-sm:w-full'>{t('Company Name')} : </p>
												<p className='break-all sm:px-3 sm:flex-1 max-sm:w-full'>
													{list?.name}
												</p>
											</div>
											<div className='flex pb-3 max-sm:flex-wrap'>
												<p className='font-bold max-sm:mb-1 sm:flex-1 max-sm:w-full'>{t('Email')} : </p>
												<p className='break-all sm:px-3 sm:flex-1 max-sm:w-full'>
													{list?.email}
												</p>
											</div>
											<div className='flex pb-3 max-sm:flex-wrap'>
												<p className='font-bold max-sm:mb-1 sm:flex-1 max-sm:w-full'>{t('Phone Number')} : </p>
												<p className='break-all sm:px-3 sm:flex-1 max-sm:w-full'>{list?.phone_number}</p>
											</div>
											<div className='flex pb-3 max-sm:flex-wrap'>
												<p className='font-bold max-sm:mb-1 sm:flex-1 max-sm:w-full'>{t('Website Url')} : </p>
												<a href={list?.website_url} target="_blank" rel="noreferrer" className='break-all sm:px-3 sm:flex-1 max-sm:w-full underline text-blue-500 cursor-pointer'>{list?.website_url}</a> 
											</div>
											<div className='flex pb-3 max-sm:flex-wrap'>
												<p className='font-bold max-sm:mb-1 sm:flex-1 max-sm:w-full'>{t('Country Name')} : </p>
												<p className='break-all sm:px-3 sm:flex-1 max-sm:w-full'>{`${list?.phoneCode} ${list?.country_name}`}</p>
											</div>
											<div className='flex pb-3 max-sm:flex-wrap'>
												<p className='font-bold max-sm:mb-1 sm:flex-1 max-sm:w-full'>{t('Description')} : </p>
												<p className='break-all sm:px-3 sm:flex-1 max-sm:w-full'>{list?.description}</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				{isDeleteCompany && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={onCloseCompany} action={deleteCompany} show={isDeleteCompany} />}

			</div>

		</>
	);
};
export default RequestedCompany;
