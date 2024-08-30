/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ColArrType } from 'src/types/cms';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { API_BASE_URL, CHANGE_STATUS_WARNING_TEXT, ContractorStatus, DELETE_WARNING_TEXT, ROUTES, SHOW_PAGE_COUNT_ARR, TenantUserDetailsDrpData, USER_TYPE, updateBranchId, token } from '@config/constant';
import { toast } from 'react-toastify';
import Button from '@components/button/button';
import { ArrowSortingDown, ArrowSortingUp, Cross, DropdownArrowDown, Edit, Eye, Filter2, GetDefaultIcon, ImportDoc, Search, Trash, Map } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import CommonModel from '@components/common/commonModel';
import filterServiceProps from '../../components/filter/filter';
import Pagination from '@components/Pagination/Pagination';
import VendorUserAdd from '@components/vendorDetails/vendorUserAdd';
import VendorUserDetails from '@components/vendorDetails/vendorUserDetails';
import ImportVendorEmployeesList from '@components/vendorDetails/importVendorEmployeesList';
import UpdatedHeader from '@components/header/updatedHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GET_COMPANY_CONTRACTOR_DETAILS, GET_COMPANY_CONTRACTOR_EMPLOYEE_LIST, GET_COMPANY_BRANCHES } from '@framework/graphql/queries/getCompanyBranches';
import { CREATE_NEW_BRANCH, DELETE_EMPLOYEE_USER } from '@framework/graphql/mutations/createBranch';
import axios from 'axios';
import DropDown from '@components/dropdown/dropDown';
import { setGetCompanyContractorDetails } from 'src/redux/tenant-management-slice';
import { setCustomCreateNewAccountStep } from 'src/redux/courses-management-slice';
import { UserProfileType, UserRoles } from 'src/types/common';
import { DropdownOptionType } from '@types';
import { useFormik } from 'formik';
import { StateDataArr } from '@framework/graphql/graphql';
import { SUBSCRIBER_LOCATION } from '@framework/graphql/queries/createEmployeeLocation';
import Loader from '@components/common/loader';
import { CHANGE_EMPLOYEE_STATUS } from '@framework/graphql/mutations/contractorPage';
import { v4 as uuidv4 } from 'uuid';
import RejectedUserPopup from '@components/tenantDetails/rejectedUserPopup';
import { importEmployeeList } from '@config/common';
export type PaginationParams = {
	limit: number
	page: number
	sortField: string
	sortOrder: string
	search: string
	company_id: string | null
	branch_id: string
	index?: number
	status?: number
}

interface RejectedUserType {
	uuid: string,
	first_name: string,
	last_name: string,
	email: string,
	phone_number: string,
	role: string,
	reason: string,
}

const VendorDetailsPage = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const fileVendorDetailsInputRef = useRef<HTMLInputElement | null>(null);	
	const queryParams = new URLSearchParams(location.search);
	const companyId = queryParams.get('company_uuid');
	const branchId = queryParams.get('branch_id');
	const [deleteEmployeeUser, deleteLoading] = useMutation(DELETE_EMPLOYEE_USER);
	const [isVendorDelete, setIsVendorDelete] = useState<boolean>(false);
	const [vendorLoading, setVendorLoading] = useState<boolean>(false);
	const [rejectedVendorUserPopup, setRejectedVendorUserPopup] = useState<boolean>(false);
	const { contractor } = useSelector(((state: { rolesManagement: { contractor: UserRoles } }) => state.rolesManagement));
	const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
	const [rejectedVendorUsersData, setRejectedVendorUsersData] = useState<{ successCount: number; rejectCount: number; totalCount: number; rejectedUsers: RejectedUserType[] }>({ successCount: 0, rejectCount: 0, totalCount: 0, rejectedUsers: [] });
	const [isDeleteVendorData, setIsDeleteVendorData] = useState<{ uuid: string, userType: string | number }>({ uuid: '', userType: '' });
	const [toShowVendorData, setToShowVendorData] = useState<boolean>(false);
	const [isAddNewBranchVendorModelShow, setIsAddNewBranchVendorModelShow] = useState<boolean>(false)
	const [vendorAddClass, setVendorAddClass] = useState<boolean>(false);
	const [isVendorDisable, setIsVendorDisable] = useState(false)
	const [branchVendorDrpData, setBranchVendorDrpData] = useState<DropdownOptionType[]>([]);
	const [createNewBranch, branchLoading] = useMutation(CREATE_NEW_BRANCH);
	const { data: getCompanyBranchesData, refetch: refetchGetCompanyBranchesData } = useQuery(GET_COMPANY_BRANCHES, { variables: { limit: 10, page: 1, sortField: 'createdAt', sortOrder: 'descend', search: '', companyId: companyId } });
	const [stateVendorDrpData, setStateVendorDrpData] = useState<DropdownOptionType[]>([]);
	const { data: subscriberLocation, refetch: subscriberLocationRefetch } = useQuery(SUBSCRIBER_LOCATION, { variables: { companyId: '' } });
	const [updateEmployeeStatus, statusLoading] = useMutation(CHANGE_EMPLOYEE_STATUS)
	const [isStatusVendorModelShow, setIsStatusVendorModelShow] = useState<boolean>(false)
	const [VendorObj, setVendorObj] = useState({} as { first_name: string, uuid: string, last_name: string, department: string, email: string, phone_number: string, user_type: number, status: number });
	const [isImportVendorFiles,setIsImportVendorFiles] = useState<boolean>(false);
	const COL_VENDOR_ARR = [
		{ name: t('Sr.No'), sortable: false },
		{ name: t('Employee First Name'), sortable: true, fieldName: 'first_name' },
		{ name: t('Employee Last Name'), sortable: true, fieldName: 'last_name' },
		{ name: t('Department'), sortable: true, fieldName: 'department' },
		{ name: t('User Type'), sortable: true, fieldName: 'user.user_type' },
		{ name: t('email'), sortable: true, fieldName: 'email' },
		{ name: t('Phone Number'), sortable: true, fieldName: 'phone_number' },
		{ name: t('Status'), sortable: true, fieldName: 'user.status' },
	] as ColArrType[];
	
	const [updateStateVendorDrpData, setUpdateStateVendorDrpData] = useState<DropdownOptionType[]>([]);

	const initialVendorValues = {
		locationName: '',
		userLocation: '',
	}

	const formik = useFormik({
		initialValues: initialVendorValues,
		onSubmit: () => {
			setIsAddNewBranchVendorModelShow(false);
			setVendorAddClass(false);
		}
	});

	useEffect(() => {
		if (subscriberLocation) {
			subscriberLocationRefetch();
		}
	}, [])

	const { data: getCompanyContractorDetails, refetch: getCompanyContractorDetailsRefetch } = useQuery(GET_COMPANY_CONTRACTOR_DETAILS, {
		skip: !formik.values.userLocation,
		fetchPolicy: 'no-cache', variables: { companyId: companyId, branchId: formik?.values?.userLocation }
	});

	const { data, refetch: getCompanyEmployeeListRefetch } = useQuery(GET_COMPANY_CONTRACTOR_EMPLOYEE_LIST, {
		skip: !formik.values.userLocation,
		fetchPolicy: 'no-cache',
		variables: {
			userData: {
				limit: 10,
				page: 1,
				sortField: 'createdAt',
				sortOrder: 'descend',
				search: '',
				company_id: companyId,
				branch_id: formik?.values?.userLocation
			}
		}
	});

	const [filterVendorData, setFilterVendorData] = useState<PaginationParams>({
		limit: 10,
		page: 1,
		sortField: 'createdAt',
		sortOrder: 'descend',
		search: '',
		company_id: companyId,
		branch_id: formik?.values?.userLocation,
		index: 0
	});

	useEffect(() => {
		if (getCompanyContractorDetails?.getCompanyContractorDetails?.data) {
			dispatch(setGetCompanyContractorDetails(getCompanyContractorDetails?.getCompanyContractorDetails))
		}
	}, [getCompanyContractorDetails?.getCompanyContractorDetails?.data])

	useEffect(() => {
		if (formik?.values?.userLocation) {
			updateBranchId(formik.values.userLocation);
			setFilterVendorData({
				...filterVendorData,
				branch_id: formik?.values?.userLocation
			});
		}
	}, [formik.values.userLocation])

	useEffect(() => {
		if (filterVendorData?.branch_id) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { index, ...newObject } = filterVendorData;
			getCompanyEmployeeListRefetch({ userData: { ...newObject } }).catch((err) => toast.error(err));
		}
	}, [filterVendorData, formik.values.userLocation]);

	useEffect(() => {
		if (data?.getCompanyContractorsList?.data?.count > 0) {
			setToShowVendorData(true);
		}
	}, [data?.getCompanyContractorsList?.data?.count]);


	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortVendor = (sortFieldName: string) => {
		setFilterVendorData({
			...filterVendorData,
			sortField: sortFieldName,
			sortOrder: filterVendorData.sortOrder === 'ascend' ? 'descend' : 'ascend',
		});
	};
	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */

	const onPageDrpSelectVendor = (e: string) => {
		setRecordsPerPageVendor(Number(e));
		const updatedFilterData = {
			...filterVendorData,
			limit: parseInt(e),
			page: 1,
			search: '',
			index: 0,
		};
		setFilterVendorData(updatedFilterData);
		filterServiceProps.saveState(
			'filterContractorUserManagement',
			JSON.stringify(updatedFilterData)
		);
	};

	const [recordsPerPageVendor, setRecordsPerPageVendor] = useState<number>(
		filterVendorData.limit
	);
	const totalVendorManagement = data?.getCompanyContractorsList?.data?.count || 0;
	const totalVendorPages = Math.ceil(totalVendorManagement / recordsPerPageVendor);
	const handleVendorPageChange = useCallback((newPage: number): void => {
		const updatedVendorFilterData = {
			...filterVendorData,
			page: newPage,
			index: (newPage - 1) * filterVendorData.limit,
		};
		setFilterVendorData(updatedVendorFilterData);
		filterServiceProps.saveState(
			'filterContractorUserManagement',
			JSON.stringify(updatedVendorFilterData)
		);
	}, []);

	useEffect(() => {
		setRecordsPerPageVendor(filterVendorData.limit);
	}, [filterVendorData.limit]);

	const onVendorDelete = useCallback((id: string, userType: number) => {
		setIsVendorDelete(true);
		setIsDeleteVendorData({ uuid: id, userType: userType });
	}, []);

	const onVendorEdit = useCallback((id: string, userType: number) => {
		navigate(`/${ROUTES.app}/${ROUTES.userDetails}/?uuid=${id}&company_id=${companyId}&branchId=${formik?.values?.userLocation}&userCompanyType=2&Is_subAdmin=${userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR}`)
	}, [formik.values.userLocation]);

	const onVendorView = useCallback((id: string, userType: number) => {
		navigate(`/${ROUTES.app}/${ROUTES.userDetails}/?uuid=${id}&read_Data=true&company_id=${companyId}&branchId=${formik?.values?.userLocation}&userCompanyType=2&Is_subAdmin=${userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR}`)
	}, [formik.values.userLocation]);

	const onVendorClose = useCallback(() => {
		setIsVendorDelete(false);
	}, []);

	const onVendorRemove = useCallback(() => {
		deleteEmployeeUser({
			variables: {
				subscriberUserId: isDeleteVendorData?.uuid,
				userData: {
					user_type: isDeleteVendorData?.userType,
				}
			},
		}).then((res) => {
			const data = res.data.courseData
			toast.success(data?.message);
			setIsVendorDelete(false);
			getCompanyEmployeeListRefetch();
			getCompanyContractorDetailsRefetch();
		})
			.catch((err) => {
				toast.error(err?.networkError?.result?.errors?.[0]?.message);
			});
	}, [isDeleteVendorData]);

	/***
		* @param e Method used for store search value
	*/
	const handleVendorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFilterVendorData({ ...filterVendorData, search: e.target.value })
	}, [])

	const onDownloadVendorCsv = useCallback(() => {
		axios.get(`${API_BASE_URL}users/export-company-contractor-users-csv/?company_id=${companyId}`, { headers: { authorization: token ? `Bearer ${token}` : '' }, responseType: 'blob' })
			.then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', 'Contractor-Users.csv');
				document.body.appendChild(link);
				link.click();
				toast.success(response?.data?.message);
			})
			.catch((err) => {
				toast.error(err.message);
			});
	}, []);

	const onImportVendorEmployeeList = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsImportVendorFiles(false)
		const files = event.currentTarget.files;
		

		await importEmployeeList({
            files,
            companyId,
            branchId,
            onImportCallBack: onImportCallBack,
            setRejectedVendorUserPopup,
            setRejectedVendorUsersData,
			employeeType: '2'
        }) 
        
		if (fileVendorDetailsInputRef.current) {
			fileVendorDetailsInputRef.current.value = '';
		}
	}, [companyId, formik?.values?.userLocation]);

	const onVendorCancel = () => {
		setRejectedVendorUserPopup(false);
		setIsImportVendorFiles(false);
	}

	const onFilterVendorDrpHandleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedSortOption = event.target.value;
		const [sortField, sortOrder] = selectedSortOption.split(':');
		setFilterVendorData({
			...filterVendorData,
			sortField,
			sortOrder,
		});
	}
	const handleVendorClick = useCallback(() => {
		setIsAddNewBranchVendorModelShow(true);
		setVendorAddClass(true);
	}, []);

	const headerVendorActionConst = () => {
		return (
			<>
				{(userType === USER_TYPE.SUBSCRIBER_ADMIN && contractor?.write) &&
					<div className={`flex w-full gap-3 xmd:gap-5 lg:w-auto ${vendorLoading ? 'pointer-events-none' : ''}`}>
						<Button className='btn-normal btn-secondary whitespace-nowrap' label={t('+ Add New Location')} onClick={handleVendorClick} />
						<DropDown placeholder={'Select Location'} className='w-[212px] -mt-2 max-md:mr-2' label='' inputIcon={<Map fontSize='18' />} name='userLocation' onChange={formik.handleChange} value={formik.values.userLocation} error={formik?.errors?.userLocation} options={branchVendorDrpData} id='userLocation' />
					</div>}
			</>
		)
	}

	const onDownloadVendorSampleCsv = useCallback(() => {
		axios.get(`${API_BASE_URL}media/download-csv/contractor`, { headers: { authorization: token ? `Bearer ${token}` : '' }, responseType: 'blob' })
			.then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', 'Contractor-Sample.csv');
				document.body.appendChild(link);
				link.click();
				toast.success(response?.data?.message);
			})
			.catch((err) => {
				toast.error(err.message);
			});
	}, []);

	const userType = userProfileData?.getProfile?.data?.user_type ?? ''

	const addNewVendorBtn = () => {
		dispatch(setCustomCreateNewAccountStep(1));
		navigate(`/${ROUTES.app}/${ROUTES.createNewAccount}/?company_uuid=${companyId}&branch_id=${formik?.values?.userLocation}&contractor-details-page=true`);
	}

	useEffect(() => {
		const tempDataArr = [] as DropdownOptionType[];
		if (getCompanyBranchesData?.getCompanyBranches) {
			let userLocationData = '' as string;
			if (branchId) {
				userLocationData = branchId
			} else if (getCompanyBranchesData?.getCompanyBranches?.data?.branches?.[0]?.branch?.uuid) {
				userLocationData = getCompanyBranchesData?.getCompanyBranches?.data?.branches?.[0]?.branch?.uuid
			}
			getCompanyBranchesData?.getCompanyBranches?.data?.branches?.map((data: StateDataArr) => {
				tempDataArr.push({ name: data?.branch?.location, key: data?.branch?.uuid });
			});
			setBranchVendorDrpData(tempDataArr);
			formik.setFieldValue('userLocation', userLocationData)
		}
	}, [getCompanyBranchesData, branchId])

	const onCancelVendor = useCallback(() => {
		setIsAddNewBranchVendorModelShow(false);
		formik.setFieldValue('locationName', '');
		setVendorAddClass(false);
	}, [])

	const onVendorLocationAdd = useCallback(() => {
		createNewBranch({
			variables: {
				companyBranchData: {
					// name: formik.values.locationName,
					company_id: companyId,
					branch_id: formik.values.locationName,
				}
			},
		}).then((res) => {
			const data = res.data.courseData
			toast.success(data?.message);
			refetchGetCompanyBranchesData();
			setIsAddNewBranchVendorModelShow(false);
			formik.resetForm();
		})
			.catch((err) => {
				toast.error(err?.networkError?.result?.errors?.[0]?.message);
				setIsAddNewBranchVendorModelShow(false);
			});
	}, [formik.values.locationName])

	useEffect(() => {
		if (subscriberLocation?.subscriberLocations) {
			const tempDataArr = [] as DropdownOptionType[];
			subscriberLocation?.subscriberLocations?.data?.map((data: { location: string, uuid: string }) => {
				tempDataArr.push({ name: data.location, key: data?.uuid });
			});
			setStateVendorDrpData(tempDataArr);
		}
	}, [subscriberLocation]);

	useEffect(() => {
		if (branchVendorDrpData?.length > 0 && stateVendorDrpData?.length > 0) {
			const updatedArray = stateVendorDrpData?.filter(item1 => !branchVendorDrpData.some(item2 => item2.key === item1.key));
			setUpdateStateVendorDrpData(updatedArray);
			setIsVendorDisable(updatedArray?.length === 0);
		}
	}, [branchVendorDrpData, stateVendorDrpData])


	const onChangeVendorStatus = useCallback((data: { first_name: string, uuid: string, last_name: string, department: string, email: string, phone_number: string, user_type: number, status: number }) => {
		setIsStatusVendorModelShow(true)
		setVendorObj(data)
	}, [])

	const changeVendorStatus = useCallback(() => {
		updateEmployeeStatus({
			variables: {
				subscriberUserId: VendorObj.uuid,
			},
		})
			.then((res) => {
				const data = res.data
				toast.success(data.activeInactiveEmployee.message)
				setIsStatusVendorModelShow(false)
				getCompanyEmployeeListRefetch()
			})
			.catch((err) => {
				toast.error(err?.networkError?.result?.errors[0]?.message)
			})
	}, [isStatusVendorModelShow])

	const onCloseVendorSubscriber = useCallback(() => {
		setIsStatusVendorModelShow(false)
	}, []);
	const onClickVendorImport = useCallback(()=>{
		setIsImportVendorFiles(true);
	},[isImportVendorFiles])

	const onImportCallBack = useCallback((data: boolean) => {
        setVendorLoading(data)
        if (!vendorLoading) {
            getCompanyEmployeeListRefetch();
        }
    }, [data]);


	return (
		<>
			{vendorLoading && <Loader />}
			<UpdatedHeader headerActionConst={headerVendorActionConst} />
			<div>
				<VendorUserDetails />
				{(!toShowVendorData && (userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR ? userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR : contractor?.write)) && <div className='flex flex-wrap gap-3 mb-5 md:mb-7'>
					<VendorUserAdd companyId={companyId} locationId={formik?.values?.userLocation} />
					<ImportVendorEmployeesList companyId={companyId} locationId={formik?.values?.userLocation} onImportCallBack={onImportCallBack} />
				</div>}
				<div className="flex justify-end pb-5 md:pb-7">
					<button className="btn bg-default btn-secondary btn-normal w-full md:w-[220px] " type="button" onClick={() => onDownloadVendorSampleCsv()}  title={`${t('Download Sample CSV')}`} >Download Sample CSV</button>
				</div>
				{toShowVendorData && <div className="p-5 overflow-auto border border-solid rounded-xl border-border-primary">
					<div className='flex flex-wrap items-center justify-between gap-3 mb-5 md:gap-5'>
						<h6 className='w-full md:w-auto'>{t(`${getCompanyContractorDetails?.getCompanyContractorDetails?.data?.company_name} Employee Details`)}</h6>
						<div className="flex flex-wrap w-full gap-3 md:flex-nowrap md:gap-5 md:w-auto">

							{(userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR ? userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR : contractor?.write) && <Button className="btn btn-primary text-white whitespace-nowrap w-[160px]" label={t('Add New')} type="button" onClick={() => addNewVendorBtn()}  title={`${t('Add New')}`}  />}

							{(userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR ? userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR : contractor?.write) && 
							<Button className='w-full btn btn-gray sm:w-[260px] p-3.5 text-xs-14 md:text-base' label={t('Import Employees List')} onClick={onClickVendorImport}  title={`${t('Import Employee List')}`}  >
							<ImportDoc className='order-2 ml-auto ' />
						</Button>
							
						}

							<button className="w-full btn btn-gray md:w-[260px] p-3.5" onClick={() => onDownloadVendorCsv()}  title={`${t('Export Employee List')}`} >
								Export Employees List  <ImportDoc className='order-2 ml-auto ' />
							</button>

							<TextInput placeholder={t('Search Employee')} type='text' id='table-search' value={filterVendorData.search} onChange={handleVendorChange} inputIcon={<Search fontSize='18' />} />

							<div className='w-full xmd:w-[150px]'>
								<DropDown
									className='w-full -mt-2'
									label=''
									inputIcon={<Filter2 className='order-2' />}
									name='filterDrpData'
									onChange={onFilterVendorDrpHandleChange}
									value={filterVendorData.sortField + ':' + filterVendorData.sortOrder}
									error=""
									options={TenantUserDetailsDrpData}
									id='filterDrpData' />

							</div>
						</div>
					</div>
					<div className="overflow-auto custom-dataTable">
						<table>
							<thead>
								<tr>
									{COL_VENDOR_ARR?.map((colVal: ColArrType, index: number) => {
										return (
											<th
												scope="col"
												className={`whitespace-nowrap ${colVal.name == t('Sr.No') ? 'justify-start pl-7 w-[13%]' : ''}`}
												key={`${index + 1}`}
											>
												<div
													className='flex items-center'
												>
													{colVal.name}
													{colVal.sortable && (
														<button className='cursor-pointer' onClick={() => onHandleSortVendor(colVal.fieldName)} type="button">
															{(filterVendorData.sortOrder === '' ||
																filterVendorData.sortField !== colVal.fieldName) && (
																	<GetDefaultIcon className="fill-white" />
																)}
															{filterVendorData.sortOrder === 'ascend' &&
																filterVendorData.sortField === colVal.fieldName && (
																	<ArrowSortingUp className="ml-1 fill-white" />
																)}
															{filterVendorData.sortOrder === 'descend' &&
																filterVendorData.sortField === colVal.fieldName && (
																	<ArrowSortingDown className="ml-1 fill-white" />
																)}
														</button>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col'>
										<div className='flex items-center'>
											{t('Action')}
										</div>
									</th>
								</tr>
							</thead>
							<tbody>
								{data?.getCompanyContractorsList?.data?.employee?.map(
									(data: { first_name: string, uuid: string, last_name: string, department: string, email: string, phone_number: string, user_type: number, status: number }, index: number) => {
										const displayIndex = filterVendorData?.index as number + index + 1;
										return (
											<tr key={data.uuid}>
												<td className="text-left pl-7" scope="row">
													{displayIndex}
												</td>
												<td className="text-left">{data?.first_name}</td>
												<td className="text-left">{data?.last_name}</td>
												<td className="text-left">{data?.department}</td>
												<td className="text-left border-none">
													<div className='flex'>
														{data?.user_type !== USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR ? (
															<span className='text-bright-green-shade'>
																User
															</span>
														) : (
															<span className='text-error'>
																Sub Admin
															</span>
														)}
													</div>
												</td>
												<td className="text-left">{data?.email}</td>
												<td className="text-left">{data?.phone_number}</td>
												<td className='text-left border-none'>
													<div className='flex'>
														{data?.status === ContractorStatus.ACTIVE ? (
															<span className='text-bright-green-shade'>
																Active
															</span>
														) : (
															<span className='text-error'>
																Inactive
															</span>
														)}
													</div>
												</td>
												<td>
													<div className='flex'>
														{(userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR ? userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR : contractor?.read) && <Button className='mx-1 mr-2 bg-transparent btn-default' onClick={() => onVendorView(data?.uuid, data?.user_type)} label={''}>
															<Eye className='text-success' />
														</Button>}
														{(userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR ? userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR : contractor?.update) && <Button className='mr-2 bg-transparent btn-default' onClick={() => onVendorEdit(data?.uuid, data?.user_type)} label={''}>
															<Edit />
														</Button>}
														{(userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR ? userType === USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR : contractor?.delete) && <Button className='mr-2 bg-transparent cursor-pointer btn-default' onClick={() => onVendorDelete(data?.uuid, data?.user_type)} label={''} disabled={deleteLoading?.loading} >
															<Trash className='fill-error' />
														</Button>}

														<div className='flex justify-center'>
															{(userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN ? userType === USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN : contractor?.update) && <span
																className='font-medium text-blue-600 hover:underline'
															>
																<label className='relative inline-flex items-center mb-0 cursor-pointer'>
																	<input
																		type='checkbox'
																		className='sr-only peer'
																		value={data?.status}
																		onChange={() => onChangeVendorStatus(data)}
																		checked={data?.status === ContractorStatus.ACTIVE}
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
									}
								)}
							</tbody>
						</table>
						{(data?.getCompanyContractorsList?.data?.count === 0 ||
							data?.getCompanyContractorsList?.data === null) && (
								<div className="flex justify-center">
									<div>{t('No Data')}</div>
								</div>
							)}
					</div>
					<div className="flex flex-wrap items-center px-6 mt-3 gap-y-3 gap-x-6">
						<div className="flex items-center">
							<span className="text-sm font-normal text-gray-700 ">
								{t('Per Page')}
							</span>
							<select
								className="border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white"
								onChange={(e) => onPageDrpSelectVendor(e.target.value)}
								value={filterVendorData.limit}
							>
								{SHOW_PAGE_COUNT_ARR?.map((data: number) => {
									return <option key={data}>{data}</option>;
								})}
							</select>
						</div>
						<Pagination
							currentPage={filterVendorData.page}
							totalPages={totalVendorPages}
							onPageChange={handleVendorPageChange}
							recordsPerPage={recordsPerPageVendor}
						/>
					</div>
				</div>}
			</div>

			{isAddNewBranchVendorModelShow && (
				<div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${isAddNewBranchVendorModelShow ? '' : 'hidden'}`}>
					<div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${vendorAddClass ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
						<div className='w-full mx-5 sm:max-w-[400px]'>
							{/* <!-- Modal content --> */}
							<div className='relative bg-white rounded-xl'>
								{/* <!-- Modal header --> */}
								<div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
									<p className='text-lg font-bold md:text-xl text-baseColor'>{'Add New Location'}</p>
									<Button onClick={onCancelVendor} label={t('')} title={`${t('Close')}`} >
										<span className='text-xl-22'><Cross className='text-error' /></span>
									</Button>
								</div>
								{/* <!-- Modal body --> */}
								{!isVendorDisable && <div className='w-full'>
									<form onSubmit={formik.handleSubmit}>
										<div className='p-5 max-h-[calc(100vh-260px)] overflow-auto'>
											<div className='mb-4'>
												<DropDown placeholder={t('Select Location')} className='w-full' label={t('Location')} inputIcon={<span className='text-xs'><DropdownArrowDown className='fill-dark-grey' /></span>} onChange={formik.handleChange} value={formik.values.locationName} error={formik?.errors?.locationName} options={updateStateVendorDrpData} name='locationName' id='locationName' required={true} />
											</div>
										</div>
										<div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
											<Button className='btn-primary btn-normal mb-2 md:mb-0 w-full md:w-auto min-w-[90px]' type='button' label={t('Add')} onClick={() => onVendorLocationAdd()} disabled={branchLoading.loading} />
										</div>
									</form>
								</div>}
								{isVendorDisable && <div className='mx-5 py-5'>
									<h6 className='error'>This user has been chosen for all locations.</h6>
								</div>}
							</div>
						</div>
					</div>
				</div>
			)}
			<RejectedUserPopup
                rejectedUserPopup={rejectedVendorUserPopup}
                rejectedUsersData={rejectedVendorUsersData}
                oncancel={onVendorCancel} 
            />		

			{isVendorDelete && (
				<CommonModel
					warningText={DELETE_WARNING_TEXT}
					onClose={onVendorClose}
					action={() => onVendorRemove()}
					show={isVendorDelete}
				/>
			)}
			{isImportVendorFiles && (
                <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${isImportVendorFiles ? '' : 'hidden'}`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${isImportVendorFiles ? '' : 'opacity-0 transform -translate-y-full scale-150 '}  transition-all duration-300 `}>
                        <div className='w-full mx-5 sm:max-w-[640px]'>
                            <div className='relative p-5 text-center bg-white shadow rounded-xl md:p-7'>
                                
                                <h6 className='mb-6 font-bold leading-normal text-center md:mb-10'>{t('Before you upload the list, the roles should be created')}</h6>
                                <div className='flex items-center justify-center space-x-5 md:flex-row'>
                                    <label id='importCsv' className="btn btn-primary btn-normal w-full md:w-auto md:min-w-[160px] mb-0">
                                        Okay
                                        <input
                                            id='importCsv'
                                            type="file"
                                            name='importCsv'
                                            multiple
                                            ref={fileVendorDetailsInputRef}
                                            className='hidden focus:bg-transparent'
                                            accept=".csv"
                                            onChange={(e) => onImportVendorEmployeeList(e)}
                                            key={uuidv4()}
                                        />
                                    </label>
                                    
                                    <Button className='btn-secondary btn-normal w-full md:w-auto md:min-w-[160px]' label={t('Cancel')} onClick={onVendorCancel}  title={`${t('Cancel')}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

			{isStatusVendorModelShow && (
				<CommonModel
					warningText={CHANGE_STATUS_WARNING_TEXT}
					onClose={onCloseVendorSubscriber}
					action={changeVendorStatus}
					show={isStatusVendorModelShow}
					disabled={statusLoading?.loading}
					isLoading={statusLoading?.loading}
				/>
			)}
		</>
	);
};
export default VendorDetailsPage;
