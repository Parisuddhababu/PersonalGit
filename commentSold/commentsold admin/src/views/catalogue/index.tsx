
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
import Button from '@components/button/button';
import { PlusCircle, ProfileIcon } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortBy, sortOrder } from '@config/constant';
import { PERMISSION_LIST } from '@config/permission';
import { GET_PRODUCTS } from '@framework/graphql/queries/catalogue';
import { FilterCatalogueProps, PaginationParamsList } from '@type/influencer';
import React, { Fragment, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DELETE_CATALOGUE } from '@framework/graphql/mutations/catalouge';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import filterServiceProps from '@components/filter/filter';
import CatalogueFilter from './filterCatalogue';


const Catalogue = () => {
    const navigate = useNavigate();
    const { localFilterData } = useSaveFilterData();

    const [filterData, setFilterData] = useState<PaginationParamsList>(
        localFilterData('catelogue') ?? {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sortBy: sortBy,
            sortOrder: sortOrder,
            name: ''
        }
    );
    const COL_ARR = [
        { name: 'Name', sortable: true, fieldName: 'name', type: 'text' },
        { name: 'sku', sortable: true, fieldName: 'sku', type: 'text' },
        { name: 'Color', sortable: true, fieldName: 'color', type: 'text' },
        { name: 'Size', sortable: true, fieldName: 'size', type: 'text' },
        { name: 'Price', sortable: true, fieldName: 'price', type: 'text' },
        { name: 'Created At', sortable: true, fieldName: 'created_at', type: 'date' },

    ] as IColumnsProps[];
    /**
     * Method redirects to add page
     */
    const handleAddCatalougemangment = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.catalouge}/${ROUTES.add}`);
    }, []);

    const onSearchCatelogue = useCallback((values: FilterCatalogueProps) => {
        const updatedFilterData = {
            ...filterData,
            name: values.search,

        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('catelogue', JSON.stringify(updatedFilterData));

    }, [])

    return (
        <Fragment>

            <CatalogueFilter onSearchCatalogue={onSearchCatelogue} filterData={filterData} />
            <div className='card-table'>
                <div className='card-header flex-wrap gap-2'>
                    <div className='flex items-center'>
                        <span className='w-3.5 h-3.5 mr-2 text-md leading-sm inline-block svg-icon'>
                            <ProfileIcon />
                        </span>
                        {('Catalogue List')}
                    </div>
                    <div className='flex space-x-2 flex-wrap'>
                        <div className='table-select-dropdown-container justify-start'>
                        </div>
                        <Button className='btn-primary ' onClick={handleAddCatalougemangment} type='button' label={('Add New')}>
                            <span className='inline-block w-4 h-4 mr-1 svg-icon'>
                                <PlusCircle />
                            </span>
                        </Button>
                    </div>
                </div>
                <div className='flex justify-between mb-3'>
                </div>
                <div className='card-body'>
                    <BVDataTable
                        defaultActions={['edit', 'delete']}
                        columns={COL_ARR}
                        queryName={GET_PRODUCTS}
                        singleDeleteMutation={DELETE_CATALOGUE}
                        sessionFilterName='catelogue'
                        actionWisePermissions={{
                            edit: PERMISSION_LIST.Catalogue.EditAccess,
                            delete: PERMISSION_LIST.Catalogue.DeleteAccess,
                        }}
                        updatedFilterData={filterData}
                        statusKey={'status'}
                        idKey={'uuid'}
                        actionData={{
                            edit: {
                                route: ROUTES.catalouge,
                            },
                            view: {
                                route: ROUTES.catalouge,
                            },
                        }}
                    />
                </div>
            </div>
        </Fragment>
    )
}
export default Catalogue;



