
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
import { PlusCircle, ProfileIcon } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortBy, sortOrder } from '@config/constant';
import { PERMISSION_LIST } from '@config/permission';
import { FilterInfluencerProps, PaginationParamsList } from '@type/influencer';
import React, { useCallback, useState } from 'react';
import SearchBrandUserRequests from './filterBrandUser';
import { FETCH_BRAND_USERS } from '@framework/graphql/queries/brandUsers';
import { DELETE_BRAND_USER } from '@framework/graphql/mutations/brandUser';
import Button from '@components/button/button';
import { useNavigate } from 'react-router-dom';
import RoleBaseGuard from '@components/roleGuard';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import filterServiceProps from '@components/filter/filter';


const BrandUserManagement = () => {
    const navigate = useNavigate();
    const { localFilterData } = useSaveFilterData();
    const [filterUserData, setUserFilterData] = useState<PaginationParamsList>(
        localFilterData('brandUser') ?? {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sortBy: sortBy,
            sortOrder: sortOrder,
            search: ''
        }
    );
    const COL_ARR_USER = [
        { name: 'Domain Name', sortable: true, fieldName: 'UserBrandDomainData.domain_name', type: 'text' },
        { name: 'Company Name', sortable: true, fieldName: 'UserBrandDomainData.company_name', type: 'text' },
        { name: 'First Name', sortable: true, fieldName: 'first_name', type: 'text' },
        { name: 'Last Name', sortable: true, fieldName: 'last_name', type: 'text' },
        { name: 'Email', sortable: true, fieldName: 'email', type: 'number' },
        { name: 'Phone Code', sortable: true, fieldName: 'country_code_id', type: 'number' },
        { name: 'Mobile Number', sortable: true, fieldName: 'phone_number', type: 'number' },
        { name: 'Status', sortable: true, fieldName: 'status', type: 'status', headerCenter: true },

    ] as IColumnsProps[];

    /**
     *
     * @param values Method used for set filter data
     */
    const onSearchUser = useCallback((values: FilterInfluencerProps) => {
        const updatedFilterData = {
            ...filterUserData,
            search: values.search,

        };
        setUserFilterData(updatedFilterData);
        filterServiceProps.saveState('brandUser', JSON.stringify(updatedFilterData));

    }, [])
    const handleAddusermangment = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.ManageBrandUser}/${ROUTES.add}`);
    }, []);

    return (
        <div>
            <SearchBrandUserRequests onSearchBrandUser={onSearchUser} filterData={filterUserData} />
            <div className='card-table'>
                <div className='flex-wrap gap-2 card-header'>
                    <div className='flex items-center'>
                        <span className='w-3.5 h-3.5 mr-2 text-md leading-sm inline-block svg-icon'>
                            <ProfileIcon />
                        </span>
                        {('Brand User List')}
                    </div>
                    <div className='flex flex-wrap space-x-2'>
                        <div className='justify-start table-select-dropdown-container'>
                        </div>
                        <RoleBaseGuard permissions={[PERMISSION_LIST.manageBrandUser.AddAccess]}>
                            <Button className='btn-primary ' onClick={handleAddusermangment} type='button' label={('Add New')}>
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
                        defaultActions={['edit', 'delete', 'view']}
                        columns={COL_ARR_USER}
                        queryName={FETCH_BRAND_USERS}
                        singleDeleteMutation={DELETE_BRAND_USER}
                        sessionFilterName='brandUser'
                        actionWisePermissions={{
                            edit: PERMISSION_LIST.manageBrandUser.EditAccess,
                            delete: PERMISSION_LIST.manageBrandUser.DeleteAccess,
                            view: PERMISSION_LIST.manageBrandUser.ViewAccess,
                        }}
                        updatedFilterData={filterUserData}
                        idKey={'uuid'}
                        actionData={{
                            edit: {
                                route: ROUTES.ManageBrandUser,
                            },
                            view: {
                                route: ROUTES.ManageBrandUser,
                            },
                        }}

                    />
                </div>
            </div>
        </div>

    )
}
export default BrandUserManagement;



