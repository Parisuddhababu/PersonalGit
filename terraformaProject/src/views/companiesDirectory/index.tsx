import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { CREATE_NEW_COMPANY_LOAD_DATA, DELETE_WARNING_TEXT, PAGE_LIMIT, PAGE_NUMBER, CompaniesDirectoryDrpData } from '@config/constant';
import AddNewCompany from './addNewCompany';
import Button from '@components/button/button';
import ButtonWithoutLoader from '@components/button/buttonWithoutLoader';
import DropDown from '@components/dropdown/dropDown';
import { Location, Search } from '@components/icons/icons';
import { useMutation, useQuery } from '@apollo/client';
import { PaginationParams } from '@types';
import { FETCH_COMPANY_DIRECTORIES } from '@framework/graphql/queries/createCompany';
import EditBtnPopup from '@components/common/EditButtonPopup';
import DeleteBtn from '@components/common/deleteBtn';
import { AddNewCompanyArr } from '@framework/graphql/graphql';
import { COMPANY_DIRECTORY_VOTE, DELETE_NEW_COMPANY } from '@framework/graphql/mutations/createCompney';
import CommonModel from '@components/common/commonModel';
import TextInput from '@components/textInput/TextInput'
import UpdatedHeader from '@components/header/updatedHeader';
import { UserProfileType, UserRoles } from 'src/types/common';
import { useSelector } from 'react-redux';
import AddNewCompanySubscriber from './addNewCompanySubscriber';

export default function CompaniesDirectoryPage() {
	const { t } = useTranslation();
	const [categoryObj, setCategoryObj] = useState({} as AddNewCompanyArr)
	const [categoryUpdateData, setCategoryUpdateData] = useState<AddNewCompanyArr | string>('')
	const [isOpenAddForm, setIsOpenAddForm] = useState(false);
	const [isOpenAddFormEdit, setIsOpenAddFormEdit] = useState(false);
	const [isOpenAddFormSubscriber, setIsOpenAddFormSubscriber] = useState(false);
	const [companyId, deleteLoading] = useMutation(DELETE_NEW_COMPANY)
	const [companyVote] = useMutation(COMPANY_DIRECTORY_VOTE)
	const [isDeleteCategory, setIsDeleteCategory] = useState<boolean>(false)
	const [companyData, setCompanyData] = useState<AddNewCompanyArr[]>([]);
	const [totalCompany, setTotalCompany] = useState<number>(0);
	const { companyDirectory } = useSelector(((state: { rolesManagement: { companyDirectory: UserRoles } }) => state.rolesManagement));
	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: PAGE_LIMIT,
		page: PAGE_NUMBER,
		sortField: 'name',
		sortOrder: 'ASC',
		search: '',
	});
	const [perPage, setPerPage] = useState(PAGE_NUMBER);
	const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));

	const { data, refetch } = useQuery(FETCH_COMPANY_DIRECTORIES, {
		variables: {
			sortOrder: filterData.sortOrder,
			limit: CREATE_NEW_COMPANY_LOAD_DATA,
			page: perPage,
			search: filterData.search,
			sortField: filterData.sortField,
			requestedCompanyApproval: false
		}
	});

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedSortOption = event.target.value;
		const [sortField, sortOrder] = selectedSortOption.split(':');
		setPerPage(1);
		setCompanyData([]);
		setFilterData({
			...filterData,
			sortField,
			sortOrder,
		});
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function getCategoryData(category: any) {
		setCategoryUpdateData(category);
		setIsOpenAddFormEdit(true)
	}


	useEffect(() => {
		if (data?.getCompanyDirectoriesWithPagination?.data?.companyDirectories) {
			setCompanyData((companyData: AddNewCompanyArr[]) => [...companyData, ...data?.getCompanyDirectoriesWithPagination?.data?.companyDirectories])
		}
		if (data?.getCompanyDirectoriesWithPagination?.data?.count) {
			setTotalCompany(data?.getCompanyDirectoriesWithPagination?.data?.count)
		}
	}, [data?.getCompanyDirectoriesWithPagination?.data])

	/**
 *
 * @param obj Method Used for edit Category data
 */
	/**
	 * Method used for close model
	 */
	const onCloseCategory = useCallback(() => {
		setIsDeleteCategory(false)

	}, [])

	/**
   *
   * @param data Method used for delete Category
   */
	const deleteCategoryData = useCallback(() => {
		companyId({
			variables: {
				companyId: categoryObj.uuid,
			},
		})
			.then((res) => {
				const data = res.data
				setPerPage(1);
				setCompanyData([]);
				toast.success(data.deleteCompanyDirectory.message)
				refetch(filterData).catch((err) => toast.error(err))
				setIsDeleteCategory(false)
			})
			.catch((err) => {
				if (err.networkError.statusCode === 400) {
					toast.error(err.networkError.result.errors[0].message)
					setIsDeleteCategory(false)
				} else {
					toast.error(err.networkError.result.errors[0].message)
				}
			})
	}, [isDeleteCategory])
	/**
 *
 * @param e Method used for store search value
 */
	const onSearchCategory = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setPerPage(1);
		setCompanyData([]);
		setFilterData({ ...filterData, search: e.target.value })
	}, [])

	const loadMoreRecords = () => {
		const newPerPage = perPage + 1;
		refetch({
			variables: {
				limit: CREATE_NEW_COMPANY_LOAD_DATA,
				page: newPerPage
			},
		}).then(() => setPerPage(newPerPage));
	};

	const subscriberUUID = userProfileData?.getProfile?.data?.subscriber_id?.uuid;

	const headerActionConst = () => {
		return (
			<>
				{!subscriberUUID && companyDirectory?.write && <div className='flex gap-5'>
					<Button className='w-full btn-primary btn-normal whitespace-nowrap' label={t('New Company')} onClick={() => setIsOpenAddForm(true)} />
				</div>}

				{subscriberUUID && companyDirectory?.write && <div className='flex gap-5'>
					<Button className='w-full btn-primary btn-normal whitespace-nowrap' label={t('Request a New Company')} onClick={() => setIsOpenAddFormSubscriber(true)} />
				</div>}
			</>
		)
	}

	const handleVendorRequest = (category: AddNewCompanyArr) => {
		companyVote({
			variables: {
				companyDirectoryId: category.uuid,
			},
		})
			.then((res) => {
				const data = res.data
				toast.success(data?.createCompanyDirectoryVote?.message)
				refetch(filterData).then((res) => {
					const data = res.data
					setCompanyData(data?.getCompanyDirectoriesWithPagination?.data?.companyDirectories)
				})
			})
			.catch((err) => {
				toast.error(err?.networkError?.result?.errors[0]?.message)
			})
	}

	return (
		<><UpdatedHeader headerActionConst={headerActionConst} /><div>

			<div className='w-full p-3 mb-5 border border-solid md:p-5 border-border-primary rounded-xl md:mb-7'>
				<div key='company-directory' className="flex flex-wrap items-baseline justify-between gap-3 mb-3 md:gap-5 md:mb-5">
					<h6 className='w-full leading-7 xmd:w-auto'>{t('Companies Directory')}</h6>

					<div key='sorting-field' className="flex flex-wrap w-full gap-3 xmd:gap-4 lg:w-auto lg:flex-nowrap">
						<div className='flex flex-wrap items-center w-full gap-4 xmd:w-auto'>
							<span className='leading-5.5 w-full xmd:w-auto whitespace-nowrap'>Sort By</span>
							<div className='w-full xmd:w-[150px]'>
								<DropDown
									className='w-full -mt-2'
									label=''
									name='appLanguage'
									onChange={handleChange}
									value={filterData.sortField + ':' + filterData.sortOrder}
									error=""
									options={CompaniesDirectoryDrpData}
									id='appLanguage' />

							</div>
						</div>
						<div className='w-full xmd:w-auto'>
							<TextInput
								placeholder={t('Search...')}
								name='search'
								type='text'
								onChange={onSearchCategory}
								inputIcon={<Search fontSize='18' className='font-normal' />} />
						</div>
					</div>
				</div>
				<tbody className='flex flex-wrap gap-4 mb-5 md:mb-8 last:mb-0' key='company-data'>
					{companyData
						?.map((category: AddNewCompanyArr) => (
							<div className="flex flex-wrap w-full lg:w-[calc(50%-15px)]  2xl:w-[calc(33.3%-13px)]" key={category.name}>
								<div className='relative flex flex-col justify-between w-full p-3 border md:p-5 border-border-primary rounded-xl'>
									<div className='absolute flex gap-3 md:gap-5 top-3 right-4'>
										{!subscriberUUID && companyDirectory?.update && <EditBtnPopup className='z-1' data={category} onClick={() => getCategoryData(category)} />}
										{!subscriberUUID && companyDirectory?.delete && <DeleteBtn className='z-1' data={category} setObj={setCategoryObj} setIsDelete={setIsDeleteCategory} />}
									</div>
									<div className='flex flex-col gap-3 mb-3 md:gap-5 md:mb-5'>
										<picture className='w-full h-[100px] md:h-[120px] lg:h-[130px] xl:h-[140px] 3xl:h-[160px] block relative'>
											<img src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${category?.image_url}`} alt="Companies-directory" className='rounded-xl' />
										</picture>
										<div>
											<h6 className='mb-2 leading-5'>{category.name}</h6>
											<div className="flex gap-2.5 items-center mb-2.5">
												<span className='text-lg'><Location /></span>
												<span className='text-light-grey'>{category.location}</span>
											</div>
											<p className='break-all text-ellipsis line-clamp-2'>{category.description}</p>
										</div>
									</div>
									{!subscriberUUID && <span>{`Company vote count:- ${category?.vote_count}`}</span>}
									{subscriberUUID && <ButtonWithoutLoader disabled={category?.is_vote} className={`whitespace-nowrap btn-normal ${category?.is_vote ? 'bg-primary h-10 md:h-[50px] text-white after:content-[""] after:inline-block after:px-1 after:py-0.5 after:-rotate-45 after:border-white after:border-t-0 after:border-r-0 after:border-l-2 after:border-b-2 w-[186px] after:ml-2.5' : 'btn-secondary w-[160px]'}`} label={t('Request a Vendor')} onClick={() => handleVendorRequest(category)} title={`${t('Request a Vendor')}`} />}
								</div>
							</div>
						))}
				</tbody>
				{(data?.getCompanyDirectoriesWithPagination?.data?.count === 0 ||
					data?.getCompanyDirectoriesWithPagination?.data?.companyDirectories === null) && (
						<div className='flex justify-center'>
							<div>{t('No Data')}</div>
						</div>
					)}
				{isOpenAddFormEdit && (
					<AddNewCompany
						onCloseAddForm={() => setIsOpenAddFormEdit(false)}
						onData={categoryUpdateData}
						onDataRefetch={() => {
							setCompanyData([]);
							refetch({
								variables: {
									limit: CREATE_NEW_COMPANY_LOAD_DATA,
									page: 1
								},
							}).then((res) => {
								const data = res?.data
								setCompanyData(data?.getCompanyDirectoriesWithPagination?.data?.companyDirectories);
							})
						}} />
				)}
				{isDeleteCategory && (
					<CommonModel
						warningText={DELETE_WARNING_TEXT}
						onClose={onCloseCategory}
						action={deleteCategoryData}
						show={isDeleteCategory}
						disabled={deleteLoading?.loading} />
				)}

				{companyData.length < totalCompany
					&&
					<div className="flex items-center justify-center">
						<Button className='btn-primary btn-normal w-[160px] whitespace-nowrap' label={t('Load More')} onClick={loadMoreRecords} 
						title={`${t('Load More')}`}>
						</Button>
					</div>}

			</div>

			{isOpenAddForm &&
				<AddNewCompany onCloseAddForm={() => setIsOpenAddForm(false)} onData={() => {
					refetch({
						variables: {
							limit: CREATE_NEW_COMPANY_LOAD_DATA,
							page: 1
						},
					}).then((res) => {
						const data = res?.data
						setCompanyData(data?.getCompanyDirectoriesWithPagination?.data?.companyDirectories);
					})
				}} />}
			{isOpenAddFormSubscriber &&
				<AddNewCompanySubscriber onCloseAddForm={() => setIsOpenAddFormSubscriber(false)} onData={() => {
					setCompanyData([]);
					refetch({
						variables: {
							limit: CREATE_NEW_COMPANY_LOAD_DATA,
							page: 1
						},
					}).then((res) => {
						const data = res?.data
						setCompanyData(data?.getCompanyDirectoriesWithPagination?.data?.companyDirectories);
					})
				}} />}

		</div></>


	)
}

