import React, { ReactElement, useCallback, useState } from 'react';
import { ColArrType, FilterSubadminProps, PaginationParams } from '@type/subAdmin';
import { GET_SUBADMIN } from '@framework/graphql/queries/subAdmin';
import { SubAdminDataArr } from '@framework/graphql/graphql';
import { ROUTES } from '@config/constant';
import { CHANGE_SUBADMIN_STATUS, DELETE_SUBADMIN } from '@framework/graphql/mutations/subAdmin';
import { useNavigate } from 'react-router-dom';
import Button from '@components/button/button';
import { PlusCircle, ProfileIcon } from '@components/icons/icons';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IListData } from '@components/BVDatatable/DataTable';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import filterServiceProps from '@components/filter/filter';
import FilterSubAdminSearch from '@views/subAdmin/filterSubAdmin';

const SubAdmin = (): ReactElement => {
	const navigate = useNavigate();
	const { localFilterData } = useSaveFilterData();
	const [subAdminObj, setSubAdminObj] = useState<SubAdminDataArr>({} as SubAdminDataArr);
	const [filterData, setFilterData] = useState<PaginationParams>(
		localFilterData('filtersubadmin') ?? {
			search: ''
		}
	);
	const COL_ARR_SUB_ADMIN = [
		{ name: 'First Name', sortable: true, fieldName: 'first_name', type: 'text' },
		{ name: 'Last Name', sortable: true, fieldName: 'last_name', type: 'text' },
		{ name: 'Email', sortable: true, fieldName: 'email', type: 'number' },
		{ name: 'Role', sortable: false, fieldName: 'RoleData.role_name', type: 'text' },
		{ name: 'Created At', sortable: true, fieldName: 'created_at', type: 'date' },
		{ name: 'Updated At', sortable: true, fieldName: 'updated_at', type: 'date' },
		{ name: 'Status', sortable: true, fieldName: 'status', type: 'status', headerCenter: true },
	] as ColArrType[];

	/**
	 *
	 * @param values Method used for set filter data
	 */
	const onSearchSubAdmin = useCallback((values: FilterSubadminProps) => {
		const updatedFilterData = {
			...filterData,
			search: values.search
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filtersubadmin', JSON.stringify(updatedFilterData));

	}, []);

	/**
	 * Method redirects to add page
	 */
	const handleAddsubadmin = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.subAdmin}/${ROUTES.add}`);
	}, []);

	/**
	 * Get data from ref
	 */
	const handleRowRef = useCallback(
		(data: IListData) => {
			setSubAdminObj(data as SubAdminDataArr);
		},
		[subAdminObj]
	);
	return (
		<div>
			<FilterSubAdminSearch onSearchSubAdmin={onSearchSubAdmin} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header flex-wrap gap-2'>
					<div className='flex items-center'>
						<span className='w-3.5 h-3.5 mr-2 text-md leading-4 inline-block svg-icon'>
							<ProfileIcon />
						</span>
						{('Sub Admin List')}
					</div>
					<div className='btn-group flex gap-y-2 flex-wrap'>
						<RoleBaseGuard permissions={[PERMISSION_LIST.SubAdmin.AddAccess]}>
							<Button className='btn-primary ' onClick={handleAddsubadmin} type='button' label={('Add New')}>
								<span className='inline-block w-4 h-4 mr-1 svg-icon'>
									<PlusCircle />
								</span>
							</Button>
						</RoleBaseGuard>
					</div>
				</div>
				<div className='card-body'>
					<BVDataTable
						defaultActions={['edit', 'delete', 'change_status']}
						columns={COL_ARR_SUB_ADMIN}
						queryName={GET_SUBADMIN}
						sessionFilterName='filtersubadmin'
						singleDeleteMutation={DELETE_SUBADMIN}
						updateStatusMutation={CHANGE_SUBADMIN_STATUS}
						actionWisePermissions={{
							edit: PERMISSION_LIST.SubAdmin.EditAccess,
							delete: PERMISSION_LIST.SubAdmin.DeleteAccess,
							changeStatus: PERMISSION_LIST.SubAdmin.ChangeStatusAccess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.subAdmin,
							},
						}}
						statusKey={'status'}
						idKey={'uuid'}
						singleDeleteApiId={'uuid'}
						statusChangeApiId={'uuid'}
						statusChangeApiKeyTitle={'status'}
						rowRefData={handleRowRef}
					/>
				</div>
			</div>
		</div>
	);
};
export default SubAdmin;
