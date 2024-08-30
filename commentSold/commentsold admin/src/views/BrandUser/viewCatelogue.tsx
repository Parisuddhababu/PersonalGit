import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, UserGenderEnum, sortBy, sortOrder } from '@config/constant';
import Button from '@components/button/button';
import { ArrowSmallLeft, ProfileIcon } from '@components/icons/icons';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
import { PaginationParamsList } from '@type/influencer';
import { FETCH_BRAND_INFLUENCERS } from '@framework/graphql/queries/brandUsers';
const ViewCatalogueBrandWise = () => {
    const params = useParams();
    const [filterData] = useState<PaginationParamsList>(
        {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sortBy: sortBy,
            sortOrder: sortOrder,
            name: '',
            brandId: params.id
        }
    );
    const COL_ARR = [
        { name: 'First Name', sortable: true, fieldName: 'first_name', type: 'text' },
        { name: 'Last Name', sortable: true, fieldName: 'last_name', type: 'text' },
        { name: 'Email', sortable: true, fieldName: 'email', type: 'number' },
        { name: 'Domain Name', sortable: true, fieldName: 'UserBrandDomainData.domain_name', type: 'text' },
        { name: 'Gender', sortable: true, type: 'badge', fieldName: 'gender', conversationValue: UserGenderEnum, headerCenter: true },
        { name: 'Phone Code', sortable: true, fieldName: 'country_code_id', type: 'number' },
        { name: 'Mobile Number', sortable: false, fieldName: 'phone_number', type: 'number' },
        { name: 'Status', sortable: true, fieldName: 'status', type: 'status', headerCenter: true },
    ] as IColumnsProps[];
    const navigate = useNavigate();

    const onCancel = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.ManageBrandUser}/${ROUTES.list}`);
    }, []);

    return (
        <div className='card'>
            <div className='card-header'>
                <div className='flex items-center'>
                    <span className='w-3.5 h-3.5 mr-2 text-md leading-sm inline-block svg-icon'>
                        <ProfileIcon />
                    </span>
                    {('Brand Influencer List')}
                </div>
                <Button className='btn-primary text-bold' label={('Back')} onClick={onCancel}>
                    <span className='inline-block w-4 h-4 mr-1 svg-icon '>
                        <ArrowSmallLeft />
                    </span>
                </Button>
            </div>
            <div className='card-body'>
                <BVDataTable
                    defaultActions={[]}
                    columns={COL_ARR}
                    queryName={FETCH_BRAND_INFLUENCERS}
                    sessionFilterName='viewBrandUser'
                    updatedFilterData={filterData}
                    statusKey={'status'}
                    idKey={'uuid'}
                />
            </div>
        </div>
    );
};
export default ViewCatalogueBrandWise;
