
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
import Button from '@components/button/button';
import { PlusCircle, ProfileIcon } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, UserGenderEnum, sortBy, sortOrder } from '@config/constant';
import { PERMISSION_LIST } from '@config/permission';
import { DELETE_INFLUENCER, UPDATE_INFLUENCER_STATUS } from '@framework/graphql/mutations/influencer';
import { GET_INFLUENCER } from '@framework/graphql/queries/influencer';
import { FilterInfluencerProps, PaginationParamsList } from '@type/influencer';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import filterServiceProps from '@components/filter/filter';
import InfluencerFilter from './filterInfluencer';
import RoleBaseGuard from '@components/roleGuard';


const Influencer = () => {
    const navigate = useNavigate();
    const { localFilterData } = useSaveFilterData();
    const [filterData, setFilterData] = useState<PaginationParamsList>(
        localFilterData('influecer') ?? {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sortBy: sortBy,
            sortOrder: sortOrder,
            search: ''
        }
    );
    const COL_ARR = [
        { name: 'First Name', sortable: true, fieldName: 'first_name', type: 'text' },
        { name: 'Last Name', sortable: true, fieldName: 'last_name', type: 'text' },
        { name: 'Email', sortable: true, fieldName: 'email', type: 'number' },
        { name: 'Gender', sortable: true, type: 'badge', fieldName: 'gender', conversationValue: UserGenderEnum, headerCenter: true },
        { name: 'Phone Code', sortable: true, fieldName: 'country_code_id', type: 'number' },
        { name: 'Mobile Number', sortable: true, fieldName: 'phone_number', type: 'text' },
        { name: 'Created At', sortable: true, fieldName: 'created_at', type: 'date' },
        { name: 'Status', sortable: true, type: 'status', fieldName: 'status', headerCenter: true },

    ] as IColumnsProps[];
    /**
     * Method redirects to add page
     */
    const handleAddusermangment = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.influencer}/${ROUTES.add}`);
    }, []);

    /**
     *
     * @param values Method used for set filter data
     */
    const onSearchInfluencer = useCallback((values: FilterInfluencerProps) => {
        const updatedFilterData = {
            ...filterData,
            search: values.search,

        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('influecer', JSON.stringify(updatedFilterData));

    }, [filterData])

    return (
        <div>
            <InfluencerFilter onSearchInfluencer={onSearchInfluencer} filterData={filterData} />
            <div className='card-table'>
                <div className='flex-wrap gap-2 card-header'>
                    <div className='flex items-center'>
                        <span className='w-3.5 h-3.5 mr-2 text-md leading-sm inline-block svg-icon'>
                            <ProfileIcon />
                        </span>
                        {('Influencer List')}
                    </div>
                    <div className='flex flex-wrap space-x-2'>
                        <div className='justify-start table-select-dropdown-container'>
                        </div>
			            <RoleBaseGuard permissions={[PERMISSION_LIST.Influencer.AddAccess]}>
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
                        defaultActions={['edit', 'delete', 'view', 'change_status']}
                        columns={COL_ARR}
                        queryName={GET_INFLUENCER}
                        singleDeleteMutation={DELETE_INFLUENCER}
                        updateStatusMutation={UPDATE_INFLUENCER_STATUS}
                        sessionFilterName='influecer'
                        actionWisePermissions={{
                            edit: PERMISSION_LIST.Influencer.EditAccess,
                            delete: PERMISSION_LIST.Influencer.DeleteAccess,
                            view: PERMISSION_LIST.Influencer.ViewAccess,
                            changeStatus: PERMISSION_LIST.Influencer.ChangeStatusAccess,
                        }}
                        updatedFilterData={filterData}
                        statusKey={'status'}
                        idKey={'uuid'}
                        statusChangeApiId={'uuid'}
                        statusChangeApiKeyTitle={'status'}
                        actionData={{
                            edit: {
                                route: ROUTES.influencer,
                            },
                            view: {
                                route: ROUTES.influencer,
                            },
                        }}
                    />
                </div>
            </div>
        </div>

    )
}
export default Influencer;



