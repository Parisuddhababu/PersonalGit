/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, PaginationParams } from 'src/types/cms';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { CmsDataArr, DeleteCmsType } from '@framework/graphql/graphql';
import { CHANGE_STATUS_WARNING_TEXT, DELETE_WARNING_TEXT, GROUP_DELETE_WARNING_TEXT, ROUTES, SHOW_PAGE_COUNT_ARR, SettingsDrpData } from '@config/constant';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CHANGESTATUS_CMS, DELETE_CMS, GRP_DEL_PAGES } from '@framework/graphql/mutations/cms';
import Button from '@components/button/button';
import { ArrowSortingDown, ArrowSortingUp, File, Filter, GetDefaultIcon } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import CommonModel from '@components/common/commonModel';
import filterServiceProps from '@components/filter/filter';
import Pagination from '@components/Pagination/Pagination';
import EditBtn from '@components/common/EditButton';
import DeleteBtn from '@components/common/deleteBtn';
import DropDown from '@components/dropdown/dropDown';
import ViewBtn from '@components/common/viewButton';
import UpdatedHeader from '@components/header/updatedHeader';


const Index = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [toggleFilterOption, setToggleFilterOption] = useState(false);

	const data = {
		fetchPages: {
			data: {
				count: 1,
				ContentData: [
					{
						id: 1,
						full_name: 'Benjamin So...',
						employee_id: '93046',
						role: 'Facilities Team',
						status: 1,
					},
					{
						id: 2,
						full_name: 'Benjamin So...',
						employee_id: '93046',
						role: 'Facilities Team',
						status: 0,
					},
					{
						id: 3,
						full_name: 'Benjamin So...',
						employee_id: '93046',
						role: 'Facilities Team',
						status: 1,
					},
					{
						id: 4,
						full_name: 'Benjamin So...',
						employee_id: '93046',
						role: 'Facilities Team',
						status: 0,
					},
					{
						id: 5,
						full_name: 'Benjamin So...',
						employee_id: '93046',
						role: 'Facilities Team',
						status: 1,
					},
				]
			}
		}
	}

	const [cmsObj, setCmsObj] = useState({} as CmsDataArr);
	const [deleteCmsById] = useMutation(DELETE_CMS);
	const [isDeleteCms, setIsDeleteCms] = useState<boolean>(false);
	///Group Delete
	const [grpDeleteCms] = useMutation(GRP_DEL_PAGES);
	const [isDeleteConfirmationOpenCms, setIsDeleteConfirmationOpenCms] = useState<boolean>(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setSelectedAllCms] = useState(false);
	const [selectedCms, setSelectedCms] = useState<number[][]>([]);
	const [ChangeCmsStatus] = useMutation(CHANGESTATUS_CMS);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [value, setValue] = useState<string>('');
	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: 10,
		page: 1,
		sortBy: '',
		sortOrder: '',
		search: '',
	});

	const COL_ARR = [
		{ name: t('Sr.No'), sortable: false },
		{ name: t('Full Name'), sortable: true, fieldName: t('full_name'), },
		{ name: t('Employee ID'), sortable: true, fieldName: t('employee_id'), },
		{ name: t('Role'), sortable: true, fieldName: t('role'), },
		{ name: t('Status'), sortable: true, fieldName: 'status' },
	] as ColArrType[];

	/**
	 * Used for set rules sets data from res in local variable
	 */
	useEffect(() => {
		if (!selectedCms?.length) {
			const totalPages = Math.ceil(data?.fetchPages.data?.count / filterData?.limit);
			const pages = [];
			for (let i = 0; i < totalPages; i++) {
				pages.push([]);
			}
			setSelectedCms(pages);
		}
	}, [data?.fetchPages]);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortCms = (sortFieldName: string) => {
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

	const onPageDrpSelectCms = (e: string) => {
		setRecordsperpage(Number(e))
		const updatedFilterData = {
			...filterData,
			limit: parseInt(e),
			page: 1
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterValuecms', JSON.stringify(updatedFilterData));
	};

	useEffect(() => {
		const savedFilterDataJSON = filterServiceProps.getState('filterValuecms', JSON.stringify(filterData));
		if (savedFilterDataJSON) {
			const savedFilterData = JSON.parse(savedFilterDataJSON);
			setFilterData(savedFilterData);
		}
	}, []);

	/**
	 * Method used for delete cms data
	 */
	const deleteCms = useCallback(() => {
		deleteCmsById({
			variables: {
				deletePageId: parseInt(cmsObj.id),
			},
		})
			.then(async (res) => {
				const data = res.data as DeleteCmsType;
				if (data.deletePage.meta.statusCode === 200) {
					toast.success(data.deletePage.meta.message);
					setIsDeleteCms(false);
				}
			})
			.catch(() => {
				toast.error(t('Failed to delete'));
			});
	}, [isDeleteCms]);

	/**
	 * Method used for change cms status with API
	 */

	const changeCmsStatus = useCallback(() => {
		ChangeCmsStatus({
			variables: {
				updatePageId: parseInt(cmsObj.id),
				status: cmsObj.status === 1 ? 0 : 1,
			},
		})
			.then((res) => {
				const data = res.data;
				if (data.updatePage.meta.statusCode === 201) {
					toast.success(data.updatePage.meta.message);
					setIsStatusModelShow(false);
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	}, [isStatusModelShow]);

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsStatusModelShow(false);
		setIsDeleteCms(false);
		setIsDeleteConfirmationOpenCms(false);
	}, []);

	const confirmDeleteRules = useCallback(() => {
		// Perform the mutation to delete the selected manage rules sets

		grpDeleteCms({
			variables: { groupDeletePagesId: selectedCms[filterData.page - 1] },
		})
			.then((res) => {
				const data = res?.data;
				if (data?.groupDeletePages?.meta?.statusCode === 200) {
					toast.success(data?.groupDeletePages?.meta?.message);
					setIsDeleteConfirmationOpenCms(false);
				}
			})
			.catch(() => {
				toast.error(t('Failed to delete manage Rules sets'));
			});
		selectedCms[filterData.page - 1] = []
	}, [selectedCms]);
	useEffect(() => {
		if (selectedCms?.length === data?.fetchPages.data?.ContentData?.length) {
			setSelectedAllCms(true);
		} else {
			setSelectedAllCms(false);
		}
	}, [selectedCms]);

	const handleDeleteGrpCMs = useCallback(() => {

		if (selectedCms[filterData.page - 1]?.length > 0) {
			setIsDeleteConfirmationOpenCms(true);
		} else {
			toast.error('Please select atleast one record');
		}
	}, [selectedCms]);

	const [recordsPerPage, setRecordsperpage] = useState<number>(filterData.limit);
	const totalcmspage = data?.fetchPages?.data?.count || 0;
	const totalPages = Math.ceil(totalcmspage / recordsPerPage);
	const handlePageChange = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterData,
			page: newPage,
		};

		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterValuecms', JSON.stringify(updatedFilterData));
	}, []);

	useEffect(() => {
		setRecordsperpage(filterData.limit);
	}, [filterData.limit]);

	const handleAdd = useCallback(() => { navigate(`/${ROUTES.app}/${ROUTES.CMS}/add`) }, [])

	const handleChange = (e: any) => {
		setValue(e.target.value)
	}

	const headerActionConst = () => {
		return (
			<Button className={`${toggleFilterOption ? 'btn-primary' : 'border border-primary btn-secondary'} md:w-[50px] md:h-[50px] w-10`} label='' type='button' onClick={() => setToggleFilterOption(!toggleFilterOption)} >
				<Filter />
			</Button>
		)
	};

	return (
		<>
			<UpdatedHeader headerActionConst={headerActionConst} />
			<div>
				{toggleFilterOption &&
					<div className="flex justify-start flex-wrap 2xl:flex-nowrap p-3 md:p-5 mb-3 md:mb-5 border border-border-primary rounded-xl bg-light-blue gap-2 2xl:gap-[18px] items-start">
						<div className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>
							<TextInput placeholder={t('Full Name')} required={true} name='categoryName' />
						</div>
						<div className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>
							<TextInput placeholder={t('Employee ID')} required={true} name='categoryName' />
						</div>
						<DropDown placeholder={'Role'} className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)] -mt-2' label='' name='appLanguage' onChange={(e: string | undefined | unknown | void) => handleChange(e)} value={value} error="" options={SettingsDrpData} id='appLanguage' />
						<DropDown placeholder={'Status'} className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)] -mt-2' label='' name='appLanguage' onChange={(e: string | undefined | unknown | void) => handleChange(e)} value={value} error="" options={SettingsDrpData} id='appLanguage' />
						<Button className='btn-primary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={t('Search')} onClick={(e: string) => handleChange(e)}  title={`${t('Search')}`} />
						<Button className='btn-secondary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={t('Reset')} onClick={(e: string) => handleChange(e)}  title={`${t('Reset')}`} />
					</div>
				}
				<div className='p-3 mb-3 overflow-auto bg-white border border-solid md:p-5 rounded-xl border-border-primary'>
					<div className='flex flex-wrap items-center justify-between gap-3 mb-3 md:mb-5'>
						<h6>User List</h6>
						<div className='flex flex-wrap w-full gap-3 md:flex-nowrap xmd:w-auto md:gap-5'>
							<Button
								className='btn-normal w-full lg:min-w-[260px] gap-5 lg:w-auto whitespace-nowrap lg:h-[50px]'
								onClick={handleDeleteGrpCMs}
								type='button'
								label={t('Import CSV File')}
								title={`${t('Import CSV File')}`} 
							>
								<File className='order-2 ml-auto' />
							</Button>
							<Button
								className='btn-normal btn-secondary w-full lg:min-w-[140px] lg:w-auto whitespace-nowrap lg:h-[50px]'
								onClick={handleAdd}
								type='button'
								label={t('+ Add New')}
								title={`${t('Add New')}`} 
							/>
						</div>
					</div>

					<div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
						<table>
							<thead>
								<tr>
									{COL_ARR?.map((cmsVal: ColArrType) => {
										return (
											<th scope='col' key={cmsVal.name} className={`${cmsVal.name === 'Sr.No' ? 'pl-7' : ''}`}>
												<div className='flex items-center'>
													{cmsVal.name}
													{cmsVal.sortable && (
														<a onClick={() => onHandleSortCms(cmsVal.fieldName)}>
															{(filterData.sortOrder === '' || filterData.sortBy !== cmsVal.fieldName) && <GetDefaultIcon className='text-white' />}
															{filterData.sortOrder === 'asc' && filterData.sortBy === cmsVal.fieldName && <ArrowSortingUp className='text-white' />}
															{filterData.sortOrder === 'desc' && filterData.sortBy === cmsVal.fieldName && <ArrowSortingDown className='text-white' />}
														</a>
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
								{data?.fetchPages.data?.ContentData?.map((data: any, index: number) => {
									return (
										<tr key={data.id}>
											<td scope='row' className='text-left pl-7'>{index + 1}</td>
											<td className='text-left whitespace-nowrap'>{data.full_name}</td>
											<td className='text-left'>{data.employee_id}</td>
											<td className='text-left whitespace-nowrap'>{data.role}</td>
											<td>
												<div className='flex text-left btn-group'>{data.status === 1 ? <span className='text-success'>Active</span> : <span className='text-error'>Inactive</span>}</div>
											</td>

											<td>
												<div className='flex gap-3 text-left md:gap-5 btn-group'>
													<ViewBtn data={data} route={ROUTES.subscriber} />
													<EditBtn data={data} route={ROUTES.CMS} />
													<DeleteBtn data={data} setObj={setCmsObj} setIsDelete={setIsDeleteCms} />
												</div>
											</td>

										</tr>
									);
								})}
							</tbody>
						</table>
						{(data?.fetchPages?.data === undefined || data?.fetchPages?.data === null) && (
							<div className='flex justify-center'>
								<div>No Data</div>
							</div>
						)}
					</div>

					<div className='flex flex-wrap items-center mt-2'>
						<span className='mr-3 text-xs md:mr-7 text-slate-400'>{`${data?.fetchPages?.data?.count === null || data?.fetchPages?.data?.count === undefined ? '0' : data?.fetchPages?.data?.count}` + ' Total  Records'}</span>
						<div className='flex items-center mr-3 md:mr-7'>
							<span className='text-sm font-normal text-gray-700 whitespace-nowrap'>
								{t('Per Page')}
							</span>
							<select value={filterData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white' onChange={(e) => onPageDrpSelectCms(e.target.value)}>
								{SHOW_PAGE_COUNT_ARR?.map((data: number) => {
									return <option key={data}>{data}</option>;
								})}
							</select>
						</div>
						<Pagination currentPage={filterData.page}
							totalPages={totalPages}
							onPageChange={handlePageChange}
							recordsPerPage={recordsPerPage}
						/>
					</div>
					{isDeleteCms && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={onClose} action={deleteCms} show={isDeleteCms} />}
					{isDeleteConfirmationOpenCms && <CommonModel warningText={GROUP_DELETE_WARNING_TEXT} onClose={onClose} action={confirmDeleteRules} show={isDeleteConfirmationOpenCms} />}
					{isStatusModelShow && <CommonModel warningText={CHANGE_STATUS_WARNING_TEXT} onClose={onClose} action={changeCmsStatus} show={isStatusModelShow} />}
				</div>
			</div>
		</>
	);
};
export default Index;
