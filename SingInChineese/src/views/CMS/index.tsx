import React, { useCallback, useEffect, useState } from 'react';
import { CMSData, CMSDataArr } from 'src/types/cms';
import { PlusCircle, Document, Search, Eye } from '@components/icons';
import { getAscIcon, getDefaultIcon, getDescIcon } from '@components/table/table';
import Button from '@components/button/Button';
import DeleteModel from '@views/deleteModel/DeleteModel';
import AddEditCmsModal from './AddEditCms';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import Pagination from '@components/pagination/Pagination';
import { sortOrder } from '@utils/helpers';
import { DEFAULT_LIMIT, DEFAULT_PAGE, endPoint } from '@config/constant';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { ColArrType, PaginationParams } from 'src/types/common';
import ChangeStatus from '@views/changeStatus/ChangeStatus';
import { debounce } from 'lodash';
import { Loader } from '@components/index';
import TextInput from '@components/textInput/TextInput';
import useEscapeKeyPress from 'src/hooks/useEscKeyPress';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

const CMS = () => {
	useEscapeKeyPress(() => onClose()); // use to close model on Eac key.
	const [cmsData, setCmsData] = useState<CMSData>();
	const [isDeleteCMS, setIsDeleteCMS] = useState<boolean>(false);
	const [isAddEditModal, setIsAddEditModal] = useState<boolean>(false);
	const [editData, setEditData] = useState<CMSDataArr | null>(null);
	const [isStatusModalShow, setIsStatusModalShow] = useState<boolean>(false);
	const [loader, setLoader] = useState<boolean>(false);
	const [filterCMSData, setFilterCMSData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrderValues.asc,
		search: '',
	});

	const COL_ARR = [
		{ name: 'Sr.No', sortable: false },
		{ name: 'Title', sortable: true, fieldName: 'title' },
		{ name: 'Slug', sortable: true, fieldName: 'slug' },
		{ name: 'Status', sortable: false, fieldName: 'status' },
	] as ColArrType[];

	/**
	 *
	 * @param  Method used for fetching CMS pages list
	 */
	const getCMSPagesList = useCallback(() => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.pages}/${endPoint.list}?page=${filterCMSData.page}&limit=${filterCMSData.limit}&sortBy=${filterCMSData.sortBy}&sortOrder=${filterCMSData.sortOrder}&keyword=${filterCMSData.search}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setCmsData(response?.data);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoader(false);
			});
	}, [filterCMSData]);

	/**
	 * Used for refetch listing of cms data after filter
	 */
	useEffect(() => {
		getCMSPagesList();
	}, [filterCMSData]);

	/**
	 *
	 * @param value used to send boolean true or false
	 */
	const updateCMSPageStatus = (value: boolean) => {
		APIService.patchData(`${URL_PATHS.pages}/${editData?.uuid}/${endPoint.changeStatus}`, {
			isActive: value,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response?.data.message);
					getCMSPagesList();
				} else {
					toast.error(response?.data.message);
				}
			})
			.catch((err) => toast.error(err?.response?.data.message));
	};

	const onChangeStatus = useCallback((data: CMSDataArr) => {
		setEditData(data);
		setIsStatusModalShow(true);
	}, []);

	/**
	 * Method used for change CMS isActive status
	 */
	const changeCMSPageStatus = useCallback(() => {
		const data = editData?.isActive;
		updateCMSPageStatus(!data);
		setIsStatusModalShow(false);
		setEditData(null);
	}, [isStatusModalShow]);

	/**
	 *
	 * @param e Method used for delete CMS Data
	 */
	const deleteCMSPageData = () => {
		APIService.deleteData(`${URL_PATHS.pages}/${editData?.uuid}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
					getCMSPagesList();
				} else {
					toast.error(response.data.message);
				}
			})
			.catch((err) => toast.error(err.response.data.message));
	};

	/**
	 * Method used for delete CMS data by id
	 */
	const deleteCMSPageById = useCallback(() => {
		deleteCMSPageData();
		setIsDeleteCMS(false);
		setEditData(null);
	}, [isDeleteCMS]);

	/**
	 *
	 * @param data Method used for show delete modal
	 */
	const deleteCMSDataModal = useCallback((data: CMSDataArr) => {
		setEditData(data);
		setIsDeleteCMS(true);
	}, []);

	/**
	 *
	 * @param event Method used for on page click
	 */
	const handlePageClick = useCallback(
		(event: number) => {
			setFilterCMSData({ ...filterCMSData, page: event + 1 });
		},
		[filterCMSData]
	);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSort = (sortFieldName: string) => {
		setFilterCMSData({
			...filterCMSData,
			sortBy: sortFieldName,
			sortOrder: sortOrder(filterCMSData.sortOrder),
		});
	};

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onPageDrpSelect = useCallback(
		(e: string) => {
			setFilterCMSData({ ...filterCMSData, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterCMSData]
	);

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsDeleteCMS(false);
		setIsAddEditModal(false);
		setIsStatusModalShow(false);
		setEditData(null);
	}, []);

	/**
	 *
	 * @param e Method used for store search value
	 */
	const handleSearch = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const searchTerm = e.target.value.trim();
			setFilterCMSData({ ...filterCMSData, search: searchTerm });
		}, 500),
		[filterCMSData]
	);

	/**
	 *
	 * @param data Method used for edit current selected Record
	 */
	const editRecord = useCallback((data: CMSDataArr) => {
		setEditData(data);
		setIsAddEditModal(true);
	}, []);

	const showAddEditModal = useCallback(() => {
		setIsAddEditModal(true);
	}, []);

	return (
		<div>
			{loader && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Document className='inline-block mr-2 text-primary' /> CMS Pages List
					</h6>
					<RoleBaseGuard permissions={[permissionsArray.CMS_MANAGEMENT.AddAccess]}>
						<Button className='btn-primary btn-large' onClick={showAddEditModal}>
							<PlusCircle className='mr-1' /> Add New
						</Button>
					</RoleBaseGuard>
				</div>
				<div className='p-3'>
					<div className='flex sm:items-center justify-end mb-3 flex-col sm:flex-row'>
						<div className='sm:mr-auto'>
							<TextInput label='' placeholder='Search here...' name='search' type='text' onChange={handleSearch} inputIcon={<Search />} />
						</div>
						<ShowEntries onChange={onPageDrpSelect} value={filterCMSData.limit} />
					</div>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									{COL_ARR?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												<div className='flex items-center'>
													{colVal.name}
													{colVal.sortable && (
														<button onClick={() => onHandleSort(colVal.fieldName)}>
															{(filterCMSData.sortOrder === '' || filterCMSData.sortBy !== colVal.fieldName) && getDefaultIcon()}
															{filterCMSData.sortOrder === sortOrderValues.asc && filterCMSData.sortBy === colVal.fieldName && getAscIcon()}
															{filterCMSData.sortOrder === sortOrderValues.desc && filterCMSData.sortBy === colVal.fieldName && getDescIcon()}
														</button>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col' className='w-36'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{cmsData?.data.pages.map((data, index: number) => {
									return (
										<tr key={data.id}>
											<th scope='row' className='w-8 text-center'>
												{index + 1}
											</th>
											<td className='font-medium'>{data.title}</td>
											<td>{data.slug}</td>
											<td className='w-40 text-center'>{data.isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
											<td>
												<div className='flex justify-center items-center'>
													<a href={`/pages/${data?.slug}`} target='_blank' rel='noreferrer'>
														<Button className='btn-default mx-1' title='View page'>
															<Eye />
														</Button>
													</a>
													<RoleBaseGuard permissions={[permissionsArray.CMS_MANAGEMENT.EditAccess]}>
														<EditButton data={data} editRecord={editRecord} />
													</RoleBaseGuard>
													<RoleBaseGuard permissions={[permissionsArray.CMS_MANAGEMENT.DeleteAccess]}>
														<DeleteButton data={data} isDeleteStatusModal={deleteCMSDataModal} />
													</RoleBaseGuard>
													<RoleBaseGuard permissions={[permissionsArray.CMS_MANAGEMENT.ChangeStatusAccess]}>
														<StatusButton data={data} isChangeStatusModal={onChangeStatus} status={`${data.isActive}`} checked={data.isActive} />
													</RoleBaseGuard>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{!cmsData?.data.count && <p className='text-center'>No CMS Pages Found</p>}
					</div>
					<Pagination length={cmsData?.data.count as number} onSelect={handlePageClick} limit={filterCMSData.limit} />
				</div>
			</div>
			{isDeleteCMS && <DeleteModel onClose={onClose} deleteData={deleteCMSPageById} />}
			{isAddEditModal && <AddEditCmsModal onSubmit={getCMSPagesList} onClose={onClose} editData={editData} />}
			{isStatusModalShow && <ChangeStatus onClose={onClose} changeStatus={changeCMSPageStatus} />}
		</div>
	);
};
export default CMS;
