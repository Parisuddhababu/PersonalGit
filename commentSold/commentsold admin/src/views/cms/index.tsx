import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortBy, sortOrder } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import Button from '@components/button/button';
import { AngleDown, AngleUp, Document, Edit, GetDefaultIcon } from '@components/icons/icons';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import { FETCH_CMS } from '@framework/graphql/queries/cms';
import { Cms, ColArrTypeNew, PaginationParams } from '@type/cms';
import { toast } from 'react-toastify';
import { useQuery } from '@apollo/client';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';

const CMS = (): ReactElement => {
    const navigate = useNavigate();
    const { localFilterData } = useSaveFilterData();
    const [cmsFilterData, setCmsFilterData] = useState<PaginationParams>(
        localFilterData('filterValuecms') ?? {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sortBy: sortBy,
            sortOrder: sortOrder,
            search: '',
        }
    );
    const { data, refetch: getFetchPolicy } = useQuery(FETCH_CMS);
    const COL_ARR_CMS = [
        {
            name: 'Content Page Title',
            sortable: true,
            fieldName: 'key',
            type: 'text',
            headerCenter: true,
        },
        {
            name: 'Actions', headerCenter: true,
        },
    ] as ColArrTypeNew[];

    const onCmsHandleSortEvent = (sortFieldName: string) => {
        setCmsFilterData({
            ...cmsFilterData,
            sortBy: sortFieldName,
            sortOrder: cmsFilterData.sortOrder === 'asc' ? 'desc' : 'asc',
        });
    };
    /**
 * Used for refetch listing of subadmin data after filter
 */
    useEffect(() => {
        if (cmsFilterData) {
            getFetchPolicy(cmsFilterData).catch((err) => {
                toast.error(err);
            });
        }
    }, [cmsFilterData]);
    /**
 * Method redirects to edit page
 */
    const editCmsManagement = useCallback((id: string) => {
        navigate(`/${ROUTES.app}/${ROUTES.cms}/${ROUTES.edit}/${id}`)
    }, []);
    return (
        <div className='card'>
            <div className='card-header'>
                <div className='flex items-center'>
                    <span className='w-3.5 h-3.5 mr-2 text-md leading-sm inline-block svg-icon'>
                        <Document />
                    </span>
                    {('CMS List')}
                </div>
            </div>
            <div className='card-body'>
                <div className='overflow-auto custom-datatable'>
                    <table>
                        <thead>
                            <tr>
                                {COL_ARR_CMS?.map((eventVal: IColumnsProps) => {
                                    return (
                                        <RoleBaseGuard permissions={eventVal.name === 'Actions' ? [PERMISSION_LIST.CMS.EditAccess] : [PERMISSION_LIST.CMS.ListAccess]} key={eventVal.fieldName}>
                                        <th scope='col' key={eventVal.fieldName}>
                                            <div className={`flex items-center ${eventVal.name === 'Status'||eventVal.name === 'Actions' || eventVal.name === ('Content Page Title') ? 'justify-center' : ''} `}>
                                                {eventVal.name}
                                                {eventVal.sortable && (
                                                    <a onClick={() => onCmsHandleSortEvent(eventVal.fieldName)} className='cursor-pointer'>
                                                        {(cmsFilterData.sortOrder === '' || cmsFilterData.sortBy !== eventVal.fieldName) && (
                                                            <span className='svg-icon inline-block ml-1 w-3 h-3'>
                                                                <GetDefaultIcon />
                                                            </span>
                                                        )}
                                                        {cmsFilterData.sortOrder === 'asc' && cmsFilterData.sortBy === eventVal.fieldName && <AngleUp />}
                                                        {cmsFilterData.sortOrder === 'desc' && cmsFilterData.sortBy === eventVal.fieldName && <AngleDown />}
                                                    </a>
                                                )}
                                            </div>
                                        </th>
                                        </RoleBaseGuard>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody >
                            {data?.fetchPolicyDetails?.data?.map((data: Cms) =>
                                <tr key={data?.uuid} className='text-center'>
                                    <td >{data?.key?.replaceAll('_',' ')}</td>
                                    <RoleBaseGuard permissions={[PERMISSION_LIST.CMS.EditAccess]}>
                                    <td><Button icon={<Edit />} className='btn-default' onClick={() => editCmsManagement(data?.uuid)} /></td>
                                    </RoleBaseGuard>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {(data?.fetchPolicyDetails?.data?.count === 0) && (
                        <div className='no-data'>
                            <div>{('No Data')}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};
export default CMS;


