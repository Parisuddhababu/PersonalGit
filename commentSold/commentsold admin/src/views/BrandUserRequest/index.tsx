
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
import { ProfileIcon } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortBy, sortOrder } from '@config/constant';
import { PERMISSION_LIST } from '@config/permission';
import { FilterInfluencerProps, PaginationParamsList } from '@type/influencer';
import React, { useCallback, useState } from 'react';
import { DELETE_BRAND_USER_REQUEST } from '@framework/graphql/mutations/brandManagement';
import { FETCH_BRAND_USERS_REQUEST } from '@framework/graphql/queries/brandManagement';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import filterServiceProps from '@components/filter/filter';
import SearchBrandRequests from './filterBrandUserRequest';


const BrandUserRequestManagement = () => {
    const { localFilterData } = useSaveFilterData();
    const [filterBrandRequestData, setBrandRequestFilterData] = useState<PaginationParamsList>(
        localFilterData('brandUserRequest') ?? {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sortBy: sortBy,
            sortOrder: sortOrder,
            search: ''
        }
    );
    const BRAND_REQUEST_COL_ARR = [
        { name: 'Domain Name', sortable: true, fieldName: 'brand_name', type: 'text' },
        { name: 'Company Name', sortable: true, fieldName: 'company_name', type: 'text' },
        { name: 'First Name', sortable: true, fieldName: 'first_name', type: 'text' },
        { name: 'Last Name', sortable: true, fieldName: 'last_name', type: 'text' },
        { name: 'Brand Email', sortable: true, fieldName: 'brand_email', type: 'number' },
        { name: 'Influencer Count', sortable: false, fieldName: 'influencer_count', type: 'number' },
        { name: 'Session Count', sortable: false, fieldName: 'session_count', type: 'number' },
        { name: 'Created At', sortable: true, fieldName: 'created_at', type: 'date' },
        { name: 'Updated At', sortable: true, fieldName: 'updated_at', type: 'date' },
        { name: 'Status', sortable: true, fieldName: 'request_status', type: 'status', headerCenter: true },

    ] as IColumnsProps[];

    /**
     *
     * @param values Method used for set filter data
     */
    const onSearchBrandRequest = useCallback((values: FilterInfluencerProps) => {
        const updatedFilterData = {
            ...filterBrandRequestData,
            search: values.search,

        };
        setBrandRequestFilterData(updatedFilterData);
        filterServiceProps.saveState('brandUserRequest', JSON.stringify(updatedFilterData));

    }, [])
    return (
        <div>
            <SearchBrandRequests onSearchBrandUser={onSearchBrandRequest} filterData={filterBrandRequestData} />
            <div className='card-table'>
                <div className='flex-wrap gap-2 card-header'>
                    <div className='flex items-center'>
                        <span className='w-3.5 h-3.5 mr-2 text-md leading-sm inline-block svg-icon'>
                            <ProfileIcon />
                        </span>
                        {('Brand Users Request List')}
                    </div>
                    <div className='flex flex-wrap space-x-2'>
                        <div className='justify-start table-select-dropdown-container'>
                        </div>
                    </div>
                </div>
                <div className='flex justify-between mb-3'>
                </div>
                <div className='card-body'>
                    <BVDataTable
                        defaultActions={['edit', 'delete']}
                        columns={BRAND_REQUEST_COL_ARR}
                        queryName={FETCH_BRAND_USERS_REQUEST}
                        singleDeleteMutation={DELETE_BRAND_USER_REQUEST}
                        sessionFilterName='brandUserRequest'
                        actionWisePermissions={{
                            edit: PERMISSION_LIST.brandUserRequest.EditAccess,
                            delete: PERMISSION_LIST.brandUserRequest.DeleteAccess,
                        }}
                        updatedFilterData={filterBrandRequestData}
                        idKey={'uuid'}
                        actionData={{
                            edit: {
                                route: ROUTES.brandUserRequest,
                            }
                        }}

                    />
                </div>
            </div>
        </div>

    )
}
export default BrandUserRequestManagement;



