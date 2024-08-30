
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
import { PlanManagementIcon, PlusCircle } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortBy, sortOrder } from '@config/constant';
import { PERMISSION_LIST } from '@config/permission';
import { PaginationParamsList } from '@type/influencer';
import React, { useCallback, useState } from 'react';
import Button from '@components/button/button';
import { useNavigate } from 'react-router-dom';
import RoleBaseGuard from '@components/roleGuard';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import { FETCH_PLANS } from '@framework/graphql/queries/planManagement';
import { DELETE_SUBSCRIPTION_PLAN, UPDATE_SUBSCRIPTION_PLAN } from '@framework/graphql/mutations/planManagement';


const PlanManagement = () => {
    const navigate = useNavigate();
    const { localFilterData } = useSaveFilterData();
    const [filterPlanData] = useState<PaginationParamsList>(
        localFilterData('planManagement') ?? {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sortBy: sortBy,
            sortOrder: sortOrder,
        }
    );
    const COL_ARR_USER = [
        { name: 'Plan Name', sortable: true, fieldName: 'plan_title', type: 'text' },
        { name: 'Price', sortable: true, fieldName: 'plan_price', type: 'number' },
        { name: 'Session Count', sortable: true, fieldName: 'no_of_sessions', type: 'number' },
        { name: 'Plan Description', sortable: true, fieldName: 'plan_description', type: 'text' },
        { name: 'Status', sortable: true, type: 'status', fieldName: 'status', headerCenter: true },
    ] as IColumnsProps[];

    const handleAddPlanmangment = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.planManagement}/${ROUTES.add}`);
    }, []);

    return (
        <div>
            <div className='card-table'>
                <div className='flex-wrap gap-2 card-header'>
                    <div className='flex items-center'>
                        <span className='w-3.5 h-3.5 mr-2 text-md leading-sm inline-block svg-icon'>
                            <PlanManagementIcon />
                        </span>
                        {('Plan Management List')}
                    </div>
                    <div className='flex flex-wrap space-x-2'>
                        <div className='justify-start table-select-dropdown-container'>
                        </div>
                        <RoleBaseGuard permissions={[PERMISSION_LIST.PlanManagement.AddAccess]}>
                            <Button className='btn-primary ' onClick={handleAddPlanmangment} type='button' label={('Add New')}>
                                <span className='inline-block w-4 h-4 mr-1 svg-icon'>
                                    <PlusCircle />
                                </span>
                            </Button>
                        </RoleBaseGuard>
                    </div>
                </div>
                <div className='flex justify-between mb-3'>
                </div>
                <div className='card-body'>
                    <BVDataTable
                        defaultActions={['edit', 'delete','change_status']}
                        columns={COL_ARR_USER}
                        queryName={FETCH_PLANS}
                        singleDeleteMutation={DELETE_SUBSCRIPTION_PLAN}
                        updateStatusMutation={UPDATE_SUBSCRIPTION_PLAN}
                        sessionFilterName='planManagement'
                        actionWisePermissions={{
                            edit: PERMISSION_LIST.PlanManagement.EditAccess,
                            delete: PERMISSION_LIST.PlanManagement.DeleteAccess,
                            changeStatus: PERMISSION_LIST.PlanManagement.ChangeStatusAccess,
                        }}
                        statusChangeApiId={'uuid'}
                        statusChangeApiKeyTitle={'status'}
                        statusKey={'status'}
                        updatedFilterData={filterPlanData}
                        idKey={'uuid'}
                        actionData={{
                            edit: {
                                route: ROUTES.planManagement,
                            }
                        }}

                    />
                </div>
            </div>
        </div>

    )
}
export default PlanManagement;



