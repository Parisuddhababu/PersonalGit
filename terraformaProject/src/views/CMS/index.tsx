import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, PaginationParams } from 'src/types/cms';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { CHANGE_STATUS_WARNING_TEXT, ContractorStatus, DELETE_WARNING_TEXT, ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '@components/button/button';
import { ArrowSortingDown, ArrowSortingUp, GetDefaultIcon, Plus, Search, Trash } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import CommonModel from '@components/common/commonModel';
import filterServiceProps from '../../components/filter/filter';
import Pagination from '@components/Pagination/Pagination';
import EditBtn from '@components/common/EditButton';
import UpdatedHeader from '@components/header/updatedHeader';
import { GET_TEMPLATES_WITH_FILTER } from '@framework/graphql/queries/emailTemplates';
import { DELETE_EMAIL_TEMPLATE, EMAIL_TEMPLATE_CHANGE_STATUS } from '@framework/graphql/mutations/emailTemplates';
import Loader from '@components/common/loader';

interface EmailDataTypes {
	title: string,
	description: string,
	uuid: string
	status: number
}

const CMS = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [isEmailTemplateDeleteData, setIsEmailTemplateDeleteData] = useState<string>('');
	const [isEmailTemplateDelete, setIsTemplateDelete] = useState<boolean>(false);
	const COL_ARR_EMAIL_TEMPLATE = [
		{ name: t('Sr.No'), sortable: false },
		{ name: t('Email Description'), sortable: true, fieldName: t('description'), },
		{ name: t('Email Type'), sortable: true, fieldName: t('title'), },
		{ name: t('Status'), sortable: true, fieldName: t('status'), },
	] as ColArrType[];
	const [emailTemplateFilterData, setEmailTemplateFilterData] = useState<PaginationParams>({
		sortOrder: 'DESC',
		limit: 10,
		page: 1,
		search: '',
		sortField: 'createdAt',
		index: 0
	});
	const { data, refetch, loading } = useQuery(GET_TEMPLATES_WITH_FILTER, { variables: { sortOrder: 'DESC', sortField: 'createdAt', limit: 10, page: 1, search: '' } });
	const [recordsPerPage, setRecordsPerPage] = useState<number>(emailTemplateFilterData.limit);
	const totalEmailTemplatePage = data?.getTemplatesWithFilterAndPagination?.data?.count || 0;
	const totalEmailTemplatePages = Math.ceil(totalEmailTemplatePage / recordsPerPage);
	const [deleteEmailTemplate, deleteEmailTemplateLoading] = useMutation(DELETE_EMAIL_TEMPLATE);
	const [isStatusEmailTemplateModelShow, setIsStatusEmailTemplateModelShow] = useState<boolean>(false)
	const [emailTemplateObj, setEmailTemplateObj] = useState({} as EmailDataTypes);
    const [updateEmailStatus, statusLoading] = useMutation(EMAIL_TEMPLATE_CHANGE_STATUS)

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	*/
	const onHandleSortEmailTemplate = useCallback((sortFieldName: string) => {
		setEmailTemplateFilterData({
			...emailTemplateFilterData,
			sortField: sortFieldName,
			sortOrder: emailTemplateFilterData.sortOrder === 'ASC' ? 'DESC' : 'ASC',
		});
	}, [emailTemplateFilterData]);

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	*/
	const onPageDrpSelectEmailTemplate = useCallback((e: { target: { value: string }; }) => {
		const data = e.target.value
		const newLimit = Number(data);
		const updatedFilterData = {
			...emailTemplateFilterData,
			limit: newLimit,
			page: 1,
			index: 0,
			Search: '',
		};
		setEmailTemplateFilterData(updatedFilterData);
		filterServiceProps.saveState('filterValueEmailTemplates', JSON.stringify(updatedFilterData));
	}, []);

	const handlePageChangeEmailTemplate = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...emailTemplateFilterData,
			page: newPage,
			index: (newPage - 1) * emailTemplateFilterData.limit,
		};
		setEmailTemplateFilterData(updatedFilterData);
		filterServiceProps.saveState('filterValueEmailTemplates', JSON.stringify(updatedFilterData));
	}, [emailTemplateFilterData.limit]);

	useEffect(() => {
		setRecordsPerPage(emailTemplateFilterData.limit);
	}, [emailTemplateFilterData.limit]);

	/**
	 *
	 * @param e Method used for store search value
	*/
	const onSearchEmailTemplate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setEmailTemplateFilterData({ ...emailTemplateFilterData, search: e.target.value })
	}, [])

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { index, ...newObject } = emailTemplateFilterData;
		refetch(newObject).catch((err) => toast.error(err))
	}, [emailTemplateFilterData])

	const onDeleteEmailTemplate = useCallback((id: string) => {
		setIsEmailTemplateDeleteData(id);
		setIsTemplateDelete(true);
	}, []);

	const onCloseEmailTemplate = useCallback(() => {
		setIsTemplateDelete(false);
	}, [])

	const onRemoveEmailTemplate = useCallback(() => {
		deleteEmailTemplate({
			variables: {
				templateId: isEmailTemplateDeleteData,
			},
		})
			.then((res) => {
				const data = res.data
				toast.success(data?.deleteTemplate?.message)
				refetch();
				setIsTemplateDelete(false);
			})
			.catch((err) => {
				toast.error(err.networkError.result.errors[0].message)
				setIsTemplateDelete(false);
			})
	}, [isEmailTemplateDeleteData])

	const handleAdd = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.CMS}/add`)
	}, [])

	/**
		* Method used for change Category status model
	*/
	const onChangeStatusEmailTemplate = useCallback((data: EmailDataTypes) => {
		setIsStatusEmailTemplateModelShow(true)
		setEmailTemplateObj(data)
	}, [])

	const onCloseEmailTemplateCallBack = useCallback(() => {
        setIsStatusEmailTemplateModelShow(false)
    }, []);

	const changeEmailTemplateStatus = useCallback(() => {
        updateEmailStatus({
            variables: {
                templateId: emailTemplateObj?.uuid,
            },
        })
            .then((res) => {
                const data = res.data
                toast.success(data.activateDeActivateTemplate.message)
                setIsStatusEmailTemplateModelShow(false)
                refetch();
            })
            .catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message)
            })
    }, [isStatusEmailTemplateModelShow])

	return (
		<>
			<UpdatedHeader headerTitle='Announcement Templates' />
			{(loading || deleteEmailTemplateLoading?.loading) && <Loader />}
			<div className='p-3 mb-3 overflow-auto bg-white border shadow-lg md:p-5 rounded-xl border-border-primary'>
				<div className='flex flex-wrap items-center justify-between gap-4 mb-5'>
					<h6>{t('Announcement Template List')}</h6>
					<div className='flex flex-wrap w-full gap-3 xmd:gap-4 lg:w-auto lg:flex-nowrap'>
						<div className='w-full xmd:w-[230px]'>
							<TextInput
								type='text'
								id='table-search'
								value={emailTemplateFilterData.search}
								placeholder={t('Search')}
								onChange={onSearchEmailTemplate}
								inputIcon={<Search fontSize='18' className='font-normal' />}
							/>
						</div>
						<Button
							className='btn-normal w-full xmd:w-[140px] md:h-[50px] whitespace-nowrap '
							onClick={handleAdd}
							type='button'
							label={t('Add New')}
							title={`${t('Add New')}`}
						>
							<Plus className='mr-2 ' />
						</Button>
					</div>
				</div>
				<div className='overflow-auto custom-dataTable'>
					<table>
						<thead>
							<tr>
								{COL_ARR_EMAIL_TEMPLATE?.map((cmsVal: ColArrType) => {
									return (
										<th scope='col' key={cmsVal.name} className={`whitespace-nowrap ${cmsVal.name === 'Sr.No' ? 'pl-7' : ''}`}>
											<div className='flex items-center'>
												{cmsVal.name}
												{cmsVal.sortable && (
													<button type='button' onClick={() => onHandleSortEmailTemplate(cmsVal.fieldName)}>
														{(emailTemplateFilterData.sortOrder === '' || emailTemplateFilterData.sortField !== cmsVal.fieldName) && <GetDefaultIcon className="fill-white" />}
														{emailTemplateFilterData.sortOrder === 'ASC' && emailTemplateFilterData.sortField === cmsVal.fieldName && <ArrowSortingUp className="ml-1 fill-white" />}
														{emailTemplateFilterData.sortOrder === 'DESC' && emailTemplateFilterData.sortField === cmsVal.fieldName && <ArrowSortingDown className="ml-1 fill-white" />}
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
						<tbody className='border border-solid border-border-primary'>
							{data?.getTemplatesWithFilterAndPagination?.data?.templates?.map((data: { uuid: string, description: string, title: string, status: number }, index: number) => {
								const displayIndex = emailTemplateFilterData?.index as number + index + 1;
								return (
									<tr key={data?.uuid}>
										<td scope='row' className='text-left pl-7'>{displayIndex}</td>
										<td className='text-left break-all' dangerouslySetInnerHTML={{ __html: data?.description }} ></td>
										<td className='text-left'>{data.title}</td>
										<td className='text-left'>
											{data.status === 1 ? <span className='rounded text-success'>Active</span> : <span className='rounded text-error'>Inactive</span>}
										</td>
										<td className='flex items-center gap-4 pr-7 btn-group'>
											<EditBtn data={data} route={ROUTES.CMS} />

											<Button className='bg-transparent cursor-pointer btn-default' onClick={() => onDeleteEmailTemplate(data?.uuid)} label={''}>
												<Trash className='fill-error' />
											</Button>

											<span
												className='font-medium text-blue-600 hover:underline'
											>
												<label className='relative inline-flex items-center mb-0 cursor-pointer'>
													<input
														type='checkbox'
														className='sr-only peer'
														value={data?.status}
														onChange={() => onChangeStatusEmailTemplate(data)}
														checked={data?.status === ContractorStatus.ACTIVE}
													/>
													<div
														className={
															'w-[30px] h-[14px] bg-secondary rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-[-1px] after:left-0 after:bg-white after:drop-shadow-outline-2 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary'
														}
													></div>
												</label>
											</span>
										</td>

									</tr>
								);
							})}
						</tbody>
					</table>
					{(data?.getTemplatesWithFilterAndPagination?.data === undefined || data?.getTemplatesWithFilterAndPagination?.data === null || data?.getTemplatesWithFilterAndPagination?.data?.count === 0) && (
						<div className='flex justify-center'>
							<div>No Data</div>
						</div>
					)}
				</div>
				<div className='flex flex-wrap items-center gap-3 mt-3 overflow-auto md:gap-5 text-slate-700'>
					<div className='flex items-center'>
						<span className='mr-2 text-sm whitespace-nowrap'>{t('Per page')}</span>
						<select value={emailTemplateFilterData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white' onChange={onPageDrpSelectEmailTemplate}>
							{SHOW_PAGE_COUNT_ARR?.map((data: number) => {
								return <option key={data}>{data}</option>;
							})}
						</select>
					</div>
					<Pagination currentPage={emailTemplateFilterData.page}
						totalPages={totalEmailTemplatePages}
						onPageChange={handlePageChangeEmailTemplate}
						recordsPerPage={recordsPerPage}
					/>
				</div>

				{isEmailTemplateDelete && (
					<CommonModel
						warningText={DELETE_WARNING_TEXT}
						onClose={onCloseEmailTemplate}
						action={onRemoveEmailTemplate}
						show={isEmailTemplateDelete}
					/>
				)}

				{isStatusEmailTemplateModelShow && (
					<CommonModel
						warningText={CHANGE_STATUS_WARNING_TEXT}
						onClose={onCloseEmailTemplateCallBack}
						action={changeEmailTemplateStatus}
						show={isStatusEmailTemplateModelShow}
						disabled={statusLoading?.loading}
					/>
				)}

			</div>
		</>
	);
};
export default CMS;
