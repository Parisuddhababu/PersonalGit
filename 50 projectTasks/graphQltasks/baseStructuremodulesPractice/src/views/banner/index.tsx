import { useMutation, useQuery } from '@apollo/client';
import { Document, Edit, GetAscIcon, GetDefaultIcon, GetDescIcon, PlusCircle, Trash } from '@components/icons';
import { ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { GET_BANNER_DETAILS } from '@framework/graphql/queries/banner';
import React, { useCallback, useEffect, useState } from 'react';
import { BannerData, BannerDataType, ColArrType, FilterDataProps, PaginationParams } from 'src/types/banner';
import ChangeStatus from './changeStatus';
import { CHANGE_BANNER_STATUS, DELETE_BANNER, GROUP_DELETE_BANNER } from '@framework/graphql/mutations/banner';
import { toast } from 'react-toastify';
import DeleteBannerModel from './deleteModel';
import FilterBannerData from './filterData';
import { useNavigate } from 'react-router-dom';
import PhotoModel from './photoModel';
import { useTranslation } from 'react-i18next';
import Pagination from '@components/pagination/pagination';
import CustomSelect from '@components/select/select';
import Button from '@components/button/button';

const Banner = () => {
	const { data, refetch: getBannerDetails, loading } = useQuery(GET_BANNER_DETAILS);
	const [changeBannerStatus] = useMutation(CHANGE_BANNER_STATUS);
	const [deleteBanner] = useMutation(DELETE_BANNER);
	const [groupDeleteBanner] = useMutation(GROUP_DELETE_BANNER);
	const [bannerData, setBannerData] = useState({} as BannerData);
	const [bannerObj, setBannerObj] = useState({} as BannerDataType);
	const [isChangeStatusModelShow, setStatusModelShow] = useState<boolean>(false);
	const [isDeleteModelShow, setDeleteModelShow] = useState<boolean>(false);
	const [isGroupDelteModelShow, setGroupDeleteModelShow] = useState<boolean>(false);
	const [selectedAllBanner, setSelectedAllBanner] = useState(false);
	const [photoPreviewModel, setPhotoPreviewModelShow] = useState<boolean>(false);
	const [selectedBanner, setSelectedBanner] = useState<Array<number>>([]);

	const { t } = useTranslation();

	const COL_ARR_banner = [
		{ name: t('Sr.No'), sortable: false },
		{ name: t('Thumb'), sortable: false, fildName: 'banner_image ' },
		{ name: t('Banner Title'), sortable: true, fildName: 'banner_title' },
		{ name: t('Created by'), sortable: true, fildName: 'created_by' },
		{ name: t('Created_At'), sortable: true, fildName: ' created_at' },
		{ name: t('Status'), sortable: true, fildName: 'status' },
	] as ColArrType[];
	const navigate = useNavigate();

	/*filter data values*/
	const [filterData, setFilterData] = useState<PaginationParams>({
		page: 1,
		limit: 10,
		bannerTitle: '',
		createdBy: '',
		status: null,
		sortBy: '',
		sortOrder: '',
	});
	//image click handler
	const imageClickHandler = () => {
		setPhotoPreviewModelShow(true);
	};

	const [img, setImg] = useState('');

	const hasPreviousPage = filterData.page > 1;
	const hasNextPage = filterData.page < Math.ceil(bannerData?.count / filterData.limit);

	//session storage
	useEffect(() => {
		const filteredBannerData: PaginationParams | null = JSON.parse(sessionStorage.getItem('bannerFilterData') ?? 'null');

		if (filteredBannerData !== null && typeof filteredBannerData === 'object') {
			setFilterData(filteredBannerData);
		}
	}, []);
	useEffect(() => {
		if (filterData) {
			getBannerDetails(filterData);
		}
		sessionStorage.setItem('bannerFilterData', JSON.stringify(filterData));
		getBannerDetails(filterData);
	}, [filterData, getBannerDetails]);

	//filter banner data on search
	const bannerSearchHandler = useCallback((value: FilterDataProps) => {
		setFilterData({
			...filterData,
			bannerTitle: value.bannerTitle,
			createdBy: value.createdBy,
			status: value.status != '' ? +value.status : null,
		});
	}, []);
	/* to sort the data asc or desc*/
	const sortHandler = (sortValue: string) => {
		setFilterData({
			...filterData,
			sortBy: sortValue,
			sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
			page: 1,
		});
	};
	/*select drop down handler*/
	const dropdownHandler = (e: string) => {
		setFilterData({ ...filterData, limit: parseInt(e), page: 1 });
	};
	/*handler for pagination*/
	const pageClickHandler = (selectedItem: { selected: number }) => {
		setSelectedBanner([]);
		setFilterData({ ...filterData, page: selectedItem.selected + 1 });
	};

	/*to show model & get id*/
	const onChangeBannerStatus = (data: BannerDataType) => {
		setStatusModelShow(true);
		setBannerObj(data);
	};
	/*to close model*/
	const onCloseHandler = () => {
		setStatusModelShow(false);
		setDeleteModelShow(false);
		setGroupDeleteModelShow(false);
		setPhotoPreviewModelShow(false);
	};

	//selected pages
	useEffect(() => {
		if (data?.fetchBanner) {
			setBannerData(data?.fetchBanner?.data);
		}

		setSelectedBanner([]);
	}, [data?.fetchBanner, filterData.page]);

	/*status change handler*/
	const changeStatusHandler = useCallback(() => {
		changeBannerStatus({
			variables: {
				updateBannerStatusId: bannerObj?.id,
				status: +(bannerObj?.status === 1 ? 0 : 1),
			},
		})
			.then((response) => {
				const data = response.data;
				if (data.updateBannerStatus.meta.statusCode === 200) {
					toast.success(data.updateBannerStatus.meta.message);
					setStatusModelShow(false);
					getBannerDetails(filterData);
				}
			})
			.catch((error) => {
				toast.error(error);
			});
	}, [filterData, getBannerDetails, bannerObj?.id, bannerObj.status, changeBannerStatus]);

	//edit banner
	const editBanner = (id: number) => {
		navigate(`/${ROUTES.app}/${ROUTES.banner}/Edit/${id}`);
	};

	//delete banner
	const onBannerDeleteHandler = useCallback(() => {
		deleteBanner({
			variables: {
				deleteBannerId: bannerObj.id,
			},
		})
			.then((response) => {
				const data = response.data;
				if (data.deleteBanner.meta.statusCode === 200) {
					toast.success(data.deleteBanner.meta.message);
					setDeleteModelShow(false);
					getBannerDetails(filterData);
				}
			})
			.catch((error) => {
				toast.error(error);
			});
	}, [isDeleteModelShow]);

	//main function for group delete
	const groupDeleteHandler = useCallback(() => {
		const selectedIds = selectedBanner.map((i) => Number(i));
		groupDeleteBanner({
			variables: { groupDeleteBannerId: selectedIds },
		})
			.then((res) => {
				const data = res?.data;
				if (data?.groupDeleteBanner?.meta?.statusCode === 200) {
					toast.success(data?.groupDeleteBanner?.meta?.message);
					setGroupDeleteModelShow(false);
					getBannerDetails(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error('failed to delete banner');
			});
		setSelectedBanner([]);
	}, [selectedBanner]);
	//to show delete model
	const deleteSelectedBanner = useCallback(() => {
		if (selectedBanner?.length > 0) {
			setGroupDeleteModelShow(true);
		} else {
			toast.error('Please select atleast one record');
		}
	}, [selectedBanner]);
	//to set all check box ids
	useEffect(() => {
		if (selectedAllBanner) {
			getBannerDetails().then((res) => {
				setSelectedBanner(res?.data?.fetchBanner.data?.BannerData?.map((i: BannerDataType) => i.id));
			});
		}
	}, [data?.fetchBanner]);

	const deleteBannerHandler = (data: BannerDataType) => {
		setDeleteModelShow(true);
		setBannerObj(data);
	};

	useEffect(() => {
		if (selectedBanner?.length === data?.fetchBanner.data?.BannerData?.length) {
			setSelectedAllBanner(true);
		} else {
			setSelectedAllBanner(false);
		}
	}, [selectedBanner]);

	const handleSelectBanner = (bannerId: number) => {
		// Check if the cupon ID is already selected
		let updateSelectedBanner = [...selectedBanner];

		const isSelected = updateSelectedBanner?.includes(bannerId);
		if (isSelected) {
			// If the cpoupon ID is already selected, remove it from the selection
			updateSelectedBanner = updateSelectedBanner.filter((id: number) => id !== bannerId);
		} else {
			// If the coupon ID is not selected, add it to the selection
			updateSelectedBanner = [...updateSelectedBanner, bannerId];
		}

		setSelectedBanner(updateSelectedBanner);
	};

	const handleSelectAllbanner = (event: React.ChangeEvent<HTMLInputElement>) => {
		let updateSelectedBanner = [...selectedBanner];
		if (!event.target.checked) {
			// Select all checkboxes
			updateSelectedBanner = [];
			setSelectedBanner(updateSelectedBanner);
		} else {
			// Deselect all checkboxes
			updateSelectedBanner = data?.fetchBanner.data?.BannerData?.map((i: BannerDataType) => {
				return i.id;
			});
			setSelectedBanner(updateSelectedBanner);
		}
	};

	useEffect(() => {
		setRecordsperpage(filterData.limit);
	}, [filterData.limit]);
	const [recordsPerPage, setRecordsperpage] = useState<number>(filterData.limit);
	const totalUsermangment = data?.fetchBanner?.data?.count || 0;
	const totalPages = Math.ceil(totalUsermangment / recordsPerPage);

	return (
		<div>
			<div className='sm:w-auto lg:w-auto mx-4 lg:mx-6 my-4'>
				<FilterBannerData filterBanner={bannerSearchHandler} />
				<div className='my-4  bg-white shadow-lg rounded-sm border border-[#c8ced3]'>
					<div className='bg-[#f0f3f5]  py-3 px-3 flex items-center justify-between border-b border-[#c8ced3]'>
						<div className='flex items-center'>
							<Document className='inline-block mr-3' fontSize='16px' />
							{t('Banner List')}
						</div>

						<div className='flex justify-end'>
							<div className='btn-group flex flex-col md:flex-row  '>
								<Button className='btn-primary btn-normal mb-2' onClick={deleteSelectedBanner} type='button' label={''}>
									<Trash className='mr-1' /> {t('Delete Selected')}
								</Button>
								<Button className='btn-primary btn-normal mb-2 ' onClick={() => navigate(`/${ROUTES.app}/${ROUTES.banner}/Add`)} type='button' label={''}>
									<PlusCircle className='mr-1' /> {t('Add New')}
								</Button>
							</div>
						</div>
					</div>
					<div className='p-3'>
						<div className='flex items-center justify-start mb-3 '>
							<span>{t('Show')}</span>
							<CustomSelect options={SHOW_PAGE_COUNT_ARR} value={filterData.limit} onChange={(e) => dropdownHandler(e)} />
							<span>{t('Entries')}</span>
						</div>
					</div>
					<div className=' p-3 overflow-auto custom-datatable '>
						<table>
							<thead className='text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
								<tr>
									<th scope='col' className='text-center'>
										<input type='checkbox' className='checkbox' checked={selectedBanner?.length === data?.fetchBanner.data?.BannerData?.length} onChange={handleSelectAllbanner} />
									</th>
									{COL_ARR_banner?.map((bannerValues: ColArrType, index: number) => {
										return (
											<th scope='col' key={`${index + 1}`}>
												<div className={`${bannerValues.name === t('Status') || bannerValues.name === t('Thumb') || bannerValues.name === t('Sr.No') ? 'flex items-center justify-center' : 'flex items-center'}`}>
													{bannerValues.name}
													{bannerValues.sortable && (
														<a onClick={() => sortHandler(bannerValues.fildName)}>
															{(filterData.sortOrder === '' || filterData.sortBy !== bannerValues.fildName) && <GetDefaultIcon />}
															{filterData.sortOrder === 'asc' && filterData.sortBy === bannerValues.fildName && <GetAscIcon />}
															{filterData.sortOrder === 'desc' && filterData.sortBy === bannerValues.fildName && <GetDescIcon />}
														</a>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col' className='text-center'>
										{t('Action')}
									</th>
								</tr>
							</thead>
							{!loading && (
								<tbody>
									{data?.fetchBanner?.data?.BannerData?.map((data: BannerDataType, index: number) => {
										return (
											<tr key={data.id}>
												<td className='text-center'>
													<input type='checkbox' className='checkbox' id={`${data?.id}`} checked={selectedBanner?.includes(data.id)} onChange={() => handleSelectBanner(data?.id)} />
												</td>
												<th scope='row' className='text-center font-normal'>
													{index + 1}
												</th>

												<td>
													<img
														src={data.banner_image}
														alt='banner_image'
														className='h-8 w-12 m-auto'
														onClick={() => {
															imageClickHandler();
															setImg(data.banner_image);
														}}
													/>
												</td>
												<td>{data?.banner_title}</td>
												<td>{data.User.first_name}</td>
												<td>{`${data?.created_at?.slice(0, 10)} ${data?.created_at?.slice(11, 19)}`}</td>
												<td className='text-center'>{data.status === 1 ? <span className='badge badge-success rounded'>Active</span> : <span className='badge badge-danger rounded'>InActive</span>}</td>
												<td>
													<div className='flex justify-center'>
														<div className='mx-2'>
															<span onClick={() => onChangeBannerStatus(data)} className='font-medium text-[#BB3F42] dark:text-[#BB3F42] hover:underline'>
																<label className='relative inline-flex items-center cursor-pointer'>
																	<input type='checkbox' value={data.status} className='sr-only peer' checked={data.status === 1} onClick={() => onChangeBannerStatus(data)} />
																	<div className={'w-7 h-4 bg-gray-200 rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-primary'}></div>
																</label>
															</span>
														</div>

														<div className='mx-2' onClick={() => editBanner(data.id)}>
															<Edit className='text-[#BB3F42]' />
														</div>
														<div className='mx-2' onClick={() => deleteBannerHandler(data)}>
															<Trash className='text-[#BB3F42]' />
														</div>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							)}
						</table>
						{loading && <p className='text-center text-lg'>Processing....</p>}
						{!data?.fetchBanner?.data?.BannerData.length && <p className='text-center '>{t('No Data')}</p>}
					</div>
					<div className='flex items-center justify-between p-3 mt-8 mb-4'>
						<span>
							{bannerData?.count} {t('Total Records')}{' '}
						</span>
						{/* <Pagination pageCount={Math.ceil(bannerData?.count / filterData.limit)} currentPage={filterData?.page} onPageChange={pageClickHandler} hasPreviousPage={hasPreviousPage} hasNextPage={hasNextPage} /> */}
						<Pagination pageCount={totalPages} currentPage={filterData?.page} onPageChange={pageClickHandler} hasPreviousPage={hasPreviousPage} hasNextPage={hasNextPage} />
					</div>
				</div>

				{isChangeStatusModelShow && <ChangeStatus onClose={onCloseHandler} changeStatus={changeStatusHandler} />}
				{isDeleteModelShow && <DeleteBannerModel onClose={onCloseHandler} deleteHandler={onBannerDeleteHandler} />}
				{isGroupDelteModelShow && <DeleteBannerModel onClose={onCloseHandler} deleteHandler={groupDeleteHandler} />}
				{photoPreviewModel && <PhotoModel onClose={onCloseHandler} data={img} />}
			</div>
		</div>
	);
};
export default Banner;
