import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { ROUTES, SHOW_PAGE_COUNT_ARR as PAGE_COUNT_RULES, CHANGE_STATUS_WARNING_TEXT, DELETE_WARNING_TEXT, GROUP_DELETE_WARNING_TEXT } from '@config/constant';
import { GetDefaultIcon, PlusCircle, Trash, ManageRulesSetsIcon, AngleUp, AngleDown } from '@components/icons/icons';
import Button from '@components/button/button';
import CommonModel from '@components/common/commonModel';
import Pagination from '@components/Pagination/Pagination';
import filterServiceProps from '@components/filter/filter';
import EditBtn from '@components/common/EditButton';
import DeleteBtn from '@components/common/deleteBtn';
import FilterManageRulesSets from './filterManageRulesSets';
import { DeleteManageRulesSetsType, GroupDeleteRulesSetsRes, ManageRulesSetsDataArr, UpdateManageRulesSetsStatusType } from '@framework/graphql/graphql';
import { DELETE_MANAGE_RULES_SETS, GROUP_DELETE_RULES_SETS, UPDATE_MANAGE_RULES_SETS_STATUS } from '@framework/graphql/mutations/manageRulesSets';
import { GET_RULES_SETS } from '@framework/graphql/queries/manageRulesSets';
import { ColArrType } from 'src/types/common';
import { FilterDataArrRulesProps, PaginationParamsRulesSets } from 'src/types/manageRulesSets';
import DescriptionModel from '@views/descriptionModel';

import { useMutation, useQuery } from '@apollo/client';

const ManageRulesSets = () => {
	const { t } = useTranslation();
	const { data, refetch: getRulesSets } = useQuery(GET_RULES_SETS);
	const [updateManageRulesSetsStatus] = useMutation(UPDATE_MANAGE_RULES_SETS_STATUS);
	const [deleteManageRulesSetById] = useMutation(DELETE_MANAGE_RULES_SETS);
	const [deleteRules] = useMutation(GROUP_DELETE_RULES_SETS);
	const navigate = useNavigate();
	const [RulesSetsObj, setRulesSetsObj] = useState({} as ManageRulesSetsDataArr);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [isDeleteRuleSets, setIsDeleteRuleSets] = useState<boolean>(false);
	const [description, setDescription] = useState<string>('');
	const [isDescriptionModelShow, setShowDescriptionModelShow] = useState<boolean>(false);
	const COL_ARR_RULES = [
		{ name: 'Sr.No', sortable: false },
		{ name: t('Rule Name'), sortable: true, fieldName: 'rule_name' },
		{ name: t('Description'), sortable: false, fieldName: 'description' },
		{ name: t('Times Triggered'), sortable: false, fieldName: 'times_triggered' },
		{ name: t('Status'), sortable: true, fieldName: 'status' },
	] as ColArrType[];
	const [isDeleteConfirmationOpenRules, setIsDeleteConfirmationOpenRules] = useState<boolean>(false);
	const [selectedAllRules, setSelectedAllRules] = useState(false);
	const [selectedRules, setSelectedRules] = useState<number[][]>([]);
	const [filterData, setFilterData] = useState<PaginationParamsRulesSets>({
		page: 1,
		ruleName: '',
		status: null,
		limit: 10,
		sortOrder: '',
		sortBy: '',
	});
	const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
	const totalRuleSets = data?.fetchSetRules.data?.count || 0;
	const totalPages = Math.ceil(totalRuleSets / recordsPerPage);
	const handlePageChangeRules = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterData,
			page: newPage,
		};

		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterRuleSets', JSON.stringify(updatedFilterData));
	}, []);
	useEffect(() => {
		const savedFilterDataJSON = filterServiceProps.getState('filterRuleSets', JSON.stringify(filterData));
		if (savedFilterDataJSON) {
			const savedFilterData = JSON.parse(savedFilterDataJSON);
			setFilterData(savedFilterData);
		}
	}, []);
	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onPageDrpSelectRules = (e: string) => {
		setRecordsPerPage(Number(e));
		const updatedFilterData = {
			...filterData,
			limit: parseInt(e),
			page: 1,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterRuleSets', JSON.stringify(updatedFilterData));
	};

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortRules = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
		});
	};
	/**
	 * Used for set rules sets data from res in local variable
	 */
	useEffect(() => {
		if (!selectedRules?.length) {
			const totalPages = Math.ceil(data?.fetchSetRules.data?.count / filterData?.limit);
			const pages = [];
			for (let i = 0; i < totalPages; i++) {
				pages.push([]);
			}
			setSelectedRules(pages);
		}
	}, [data?.fetchSetRules]);
	/**method that sets all rules sets s selected */
	useEffect(() => {
		if (selectedAllRules) {
			getRulesSets().then((res) => {
				setSelectedRules(res?.data?.fetchSetRules.data?.ruleData?.map((i: ManageRulesSetsDataArr) => i.id));
			});
		}
	}, [data?.fetchSetRules]);
	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsStatusModelShow(false);
		setIsDeleteRuleSets(false);
		setIsDeleteConfirmationOpenRules(false);
		setShowDescriptionModelShow(false);
	}, []);

	/**
	 * Method used for change rules sets  status with API
	 */
	const changeRulesSetsStatus = useCallback(() => {
		updateManageRulesSetsStatus({
			variables: {
				updateRuleStatusId: RulesSetsObj?.id,
				status: RulesSetsObj.status === 1 ? 0 : 1,
			},
		})
			.then((res) => {
				const data = res.data as UpdateManageRulesSetsStatusType;
				if (data?.updateRuleStatus?.meta?.statusCode === 200) {
					toast.success(data?.updateRuleStatus?.meta?.message);
					setIsStatusModelShow(false);
					getRulesSets(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	}, [isStatusModelShow]);
	/**
	 * Method used for change manage rules status model
	 */
	function onChangeStatusRules(data: ManageRulesSetsDataArr) {
		setIsStatusModelShow(true);
		setRulesSetsObj(data);
	}

	/**
	 * Method used for delete rules sets data
	 */
	const deleteRulesSets = useCallback(() => {
		deleteManageRulesSetById({
			variables: {
				deleteSetRuleId: RulesSetsObj.id,
			},
		})
			.then((res) => {
				const data = res?.data as DeleteManageRulesSetsType;
				if (data?.deleteSetRule?.meta?.statusCode === 200) {
					toast.success(data?.deleteSetRule?.meta?.message);
					setIsDeleteRuleSets(false);
					getRulesSets(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	}, [isDeleteRuleSets]);

	/**
	 *
	 * @param values Method used for set filter data
	 */
	const onSearchManageRulesSets = useCallback((values: FilterDataArrRulesProps) => {
		setFilterData({
			...filterData,
			ruleName: values.ruleName,

			status: parseInt(values.RulesStatus),
		});
	}, []);
	/**
	 * if filter data changes then retch the data as per the filterData
	 */
	useEffect(() => {
		getRulesSets(filterData).catch((err) => toast.error(err));
	}, [filterData]);

	const confirmDeleteRules = useCallback(() => {
		// Perform the mutation to delete the selected manage rules sets
		deleteRules({
			variables: { groupDeleteSetRulesId: selectedRules[filterData.page - 1] },
		})
			.then((res) => {
				const data = res?.data as GroupDeleteRulesSetsRes;
				if (data?.groupDeleteSetRules?.meta?.statusCode === 200) {
					toast.success(data?.groupDeleteSetRules?.meta?.message);
					setIsDeleteConfirmationOpenRules(false);
					getRulesSets(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to delete manage Rules sets'));
			});
		selectedRules[filterData.page - 1] = [];
	}, [selectedRules]);
	// method used to set all check box based on length
	useEffect(() => {
		if (selectedRules?.length === data?.fetchSetRules?.data?.ruleData?.length) {
			setSelectedAllRules(true);
		} else {
			setSelectedAllRules(false);
		}
	}, [selectedRules]);
	// method used to show model for group deletion
	const handleDeleteRulesSets = useCallback(() => {
		if (selectedRules[filterData.page - 1]?.length > 0) {
			setIsDeleteConfirmationOpenRules(true);
		} else {
			toast.error('Please select at least one record');
		}
	}, [selectedRules]);
	// method used to set individual checkboxes to checked or unchecked
	const handleSelectRuleSet = (rulesId: number) => {
		// Check if the rules sets  ID is already selected
		const updateSelectedRulesSets = [...selectedRules];

		const isSelected = updateSelectedRulesSets?.[filterData.page - 1]?.includes(rulesId);
		if (isSelected) {
			// If the rules sets  ID is already selected, remove it from the selection
			updateSelectedRulesSets[filterData.page - 1] = updateSelectedRulesSets[filterData.page - 1].filter((id: number) => id !== rulesId);
		} else {
			// If the rules sets  ID is not selected, add it to the selection
			updateSelectedRulesSets[filterData.page - 1] = [...updateSelectedRulesSets[filterData.page - 1], rulesId];
		}
		setSelectedRules(updateSelectedRulesSets);
	};
	// method used set all checkboxes  checked or unchecked
	const handleSelectAllRules = (event: React.ChangeEvent<HTMLInputElement>) => {
		const updateSelectedRulesSets = [...selectedRules];
		if (!event?.target?.checked) {
			// Select all checkboxes
			updateSelectedRulesSets[filterData?.page - 1] = [];
			setSelectedRules(updateSelectedRulesSets);
		} else {
			// Deselect all checkboxes
			updateSelectedRulesSets[filterData.page - 1] = data?.fetchSetRules.data?.ruleData?.map((i: ManageRulesSetsDataArr) => {
				return i.id;
			});
			setSelectedRules(updateSelectedRulesSets);
		}
	};

	// method used set description model visible
	const descriptionHandler = (value: string) => {
		setDescription(value);
		setShowDescriptionModelShow((prev) => !prev);
	};
	useEffect(() => {
		setRecordsPerPage(filterData.limit);
	}, [filterData.limit]);
	const addRedirectionRules = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.manageRulesSets}/add`);
	}, []);
	const clearSelectionRuleSets = () => {
		setSelectedRules([]);
	  };
	return (
		<>
			<div>
				<FilterManageRulesSets onSearchManageRulesSets={onSearchManageRulesSets} clearSelectionRuleSets={clearSelectionRuleSets} />
				<div className='mb-3 w-full  bg-white shadow-lg rounded-sm overflow-auto border  border-slate-300'>
					<div className='bg-[#f0f3f5] py-3 px-5 flex items-center justify-between border-b border-[#c8ced3]'>
						<div className='flex items-center '>
							<ManageRulesSetsIcon className='mr-2 fill-gray-700' fontSize='12px' />
							<span className='text-sm font-normal'>{t('Rule Sets List')} </span>
						</div>
						<div className='btn-group col-span-3 flex items-start justify-end '>
							<Button className='btn-primary btn-normal ' onClick={handleDeleteRulesSets} type='button' label={t('Delete Selected')}  title={`${t('Delete')}`} >
								<Trash className='mr-1' />
							</Button>
							<Button className='btn-primary btn-normal ' onClick={addRedirectionRules} type='button' label={t('Add New')}
							 title={`${t('Add New')}`} >
								<PlusCircle className='mr-1' />
							</Button>
						</div>
					</div>
					<div className='p-3 flex items-center justify-start '>
						<span className=' text-sm text-gray-900 font-normal '>{t('Show')}</span>
						<select className='border border-[#e4e7ea] rounded px-3 text-sm py-1.5 text-gray-500 mx-1 w-[75px] bg-white' onChange={(e) => onPageDrpSelectRules(e.target.value)} value={filterData.limit}>
							{PAGE_COUNT_RULES?.map((item: number) => {
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
										<input type='checkbox' className='checkbox' checked={selectedRules[filterData.page - 1]?.length === data?.fetchSetRules.data?.ruleData?.length} onChange={handleSelectAllRules} />
									</th>
									{COL_ARR_RULES?.map((rulesVal: ColArrType) => {
										return (
											<th scope='col' key={rulesVal.fieldName}>
												<div className={`flex items-center ${rulesVal.name === t('Description') || rulesVal.name === 'Sr.No' || rulesVal.name == t('Status') ? 'justify-center' : ''}`}>
													{rulesVal.name}
													{rulesVal.sortable && (
														<a onClick={() => onHandleSortRules(rulesVal.fieldName)}>
															{(filterData.sortOrder === '' || filterData.sortBy !== rulesVal.fieldName) && <GetDefaultIcon />}
															{filterData.sortOrder === 'asc' && filterData.sortBy === rulesVal.fieldName && <AngleUp />}
															{filterData.sortOrder === 'desc' && filterData.sortBy === rulesVal.fieldName && <AngleDown />}
														</a>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col'>
										<div className='flex items-center justify-center'>{t('Action')}</div>
									</th>
								</tr>
							</thead>
							<tbody>
								{data?.fetchSetRules.data?.ruleData?.map((data: ManageRulesSetsDataArr, index: number) => {
									return (
										<tr key={data.id}>
											<td className='text-center'>
												<input type='checkbox' className='checkbox' id={`${data.id}`} checked={selectedRules?.[filterData.page - 1]?.includes(data.id)} onChange={() => handleSelectRuleSet(data.id)} />
											</td>
											<th scope='row' className=' font-normal text-gray-700 text-center whitespace-nowrap dark:text-white'>
												{index + 1}
											</th>
											<td>{data.rule_name} </td>
											<td className='text-center'>
												{data.description.length > 20 ? data.description.slice(0, 20) : data.description}
												{data.description.length > 20 ? (
													<a className='text-red-500 hover:underline cursor-pointer' onClick={() => descriptionHandler(data.description)}>
														show more...
													</a>
												) : (
													''
												)}
											</td>
											<td>{data.times_triggered ?? 0}</td>
											<td>
												<div className=' flex justify-center'>{data.status === 1 ? <span className='badge badge-success rounded'>Active</span> : <span className='badge badge-danger rounded'>InActive</span>}</div>
											</td>
											<td>
												<div className=' btn-group flex justify-center '>
													<EditBtn data={data} route={ROUTES.manageRulesSets} />
													<div className='flex justify-center'>
														<span onClick={() => onChangeStatusRules(data)} className='font-medium text-blue-600 mt-2 dark:text-blue-500 hover:underline'>
															<label className='relative inline-flex items-center cursor-pointer'>
																<input type='checkbox' className='sr-only peer' value={data.status} checked={data.status === 1} />
																<div className={'w-7 h-4 bg-gray-200 rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-primary'}></div>
															</label>
														</span>
													</div>
													<DeleteBtn data={data} setObj={setRulesSetsObj} setIsDelete={setIsDeleteRuleSets} />
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{(data?.fetchSetRules?.data === null || data?.fetchSetRules?.data === undefined) && (
							<div className='flex justify-center'>
								<div>{t('No Data')}</div>
							</div>
						)}
					</div>
					<div className='px-6 mb-4 flex items-center justify-between '>
						<span className='text-slate-400 text-xs'>
							{`${data?.fetchSetRules.data?.count === null || data?.fetchSetRules.data?.count === undefined ? '0' : data?.fetchSetRules.data?.count}`}
							<span className='ml-1'>{t('Total Records')}</span>
						</span>
						<Pagination currentPage={filterData.page} totalPages={totalPages} onPageChange={handlePageChangeRules} recordsPerPage={recordsPerPage} />
					</div>
				</div>
				{isDescriptionModelShow && <DescriptionModel onClose={onClose} data={description} show={isDescriptionModelShow} />}
				{isStatusModelShow && <CommonModel warningText={CHANGE_STATUS_WARNING_TEXT} onClose={onClose} action={changeRulesSetsStatus} show={isStatusModelShow} />}
				{isDeleteRuleSets && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={onClose} action={deleteRulesSets} show={isDeleteRuleSets} />}
				{isDeleteConfirmationOpenRules && <CommonModel warningText={GROUP_DELETE_WARNING_TEXT} onClose={onClose} action={confirmDeleteRules} show={isDeleteConfirmationOpenRules} />}
			</div>
		</>
	);
};
export default ManageRulesSets;
