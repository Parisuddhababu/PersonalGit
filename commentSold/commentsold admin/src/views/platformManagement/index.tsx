
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
import { PlanManagementIcon } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortBy, sortOrder } from '@config/constant';
import { PaginationParamsList } from '@type/influencer';
import React, {useState } from 'react';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import { GET_ALL_SOCIAL_CONNECTIONS } from '@framework/graphql/queries/platformManagement';
import { SOCIAL_PLATFORM_STATUS_CHANGE } from '@framework/graphql/mutations/platformManagement';
import { PERMISSION_LIST } from '@config/permission';


const PlatformManagement = () => {
    const { localFilterData } = useSaveFilterData();
    const [filterPlanData] = useState<PaginationParamsList>(
        localFilterData('platformManagement') ?? {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sortBy: sortBy,
            sortOrder: sortOrder,
        }
    );
    const COL_ARR_USER = [
        { name: 'Platform Name', sortable: false, fieldName: 'connection_name', type: 'text' },
        { name: 'Status', sortable: false, type: 'status', fieldName: 'status', headerCenter: true },
    ] as IColumnsProps[];

    return (
        <div>
            <div className='card-table'>
                <div className='flex-wrap gap-2 card-header'>
                    <div className='flex items-center'>
                        <span className='w-3.5 h-3.5 mr-2 text-md leading-sm inline-block svg-icon'>
                            <PlanManagementIcon />
                        </span>
                        {('Platform Management List')}
                    </div>
                </div>
                <div className='flex justify-between mb-3'>
                </div>
                <div className='card-body'>
                    <BVDataTable
                        defaultActions={['change_status']}
                        columns={COL_ARR_USER}
                        queryName={GET_ALL_SOCIAL_CONNECTIONS}
                        updateStatusMutation={SOCIAL_PLATFORM_STATUS_CHANGE}
                        sessionFilterName='platformManagement'
                        statusChangeApiId={'uuid'}
                        statusChangeApiKeyTitle={'status'}
                        statusKey={'status'}
                        updatedFilterData={filterPlanData}
                        idKey={'uuid'}
                        isPagination={false}
                        actionWisePermissions={{
                            changeStatus: PERMISSION_LIST.PlatformManagement.ChangeStatusAccess,
                        }}
                    />
                </div>
            </div>
        </div>

    )
}
export default PlatformManagement;



