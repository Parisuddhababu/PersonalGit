import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccesibilityNames, DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, SHOW_PAGE_COUNT_ARR, sortBy, sortOrder } from '@config/constant';
import Button from '@components/button/button';
import { AngleDown, AngleUp, ArrowSmallLeft, GetDefaultIcon, ProfileIcon } from '@components/icons/icons';
import { FETCH_INFLUENCER_PRODUCTS } from '@framework/graphql/queries/influencer';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
import { InfluencerProductDetails, PaginationParamsList } from '@type/influencer';
import { useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import { toast } from 'react-toastify';
import DescriptionModel from '@views/discriptionModel';

const ViewInfluencer = () => {
    const params = useParams();
    const { data, refetch: getInfluencerProducts } = useQuery(FETCH_INFLUENCER_PRODUCTS, {
        variables: { userId: params.id }
    });
    const [filterData, setFilterData] = useState<PaginationParamsList>(
        {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sortBy: sortBy,
            sortOrder: sortOrder,
            userId: params.id
        }
    );
    const [isDescriptionModelShow, setShowDescriptionModelShow] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [showMoreTitle, setShowMoreTitle] = useState<string>('');
    const [recordsPerPage, setRecordsperpage] = useState<number>(filterData.limit);
    const totalRuleSets = data?.fetchInfluencerProducts?.data?.count || 0;
    const totalPages = Math.ceil(totalRuleSets / recordsPerPage);
    const COL_ARR = [
        { name: 'Image Url', sortable: false, fieldName: 'url' },
        { name: 'Product Name', sortable: true, fieldName: 'name' },
        { name: 'Description', sortable: true, fieldName: 'description' },
        { name: 'Product Url', sortable: false, fieldName: 'url' },
        { name: 'sku', sortable: true, fieldName: 'sku' },
        { name: 'Color', sortable: true, fieldName: 'color' },
        { name: 'Size', sortable: true, fieldName: 'size' },
        { name: 'Price', sortable: true, fieldName: 'price' },
    ] as IColumnsProps[];

    const navigate = useNavigate();
    /**
     * on clicking cancel it will redirect to main influencer page
     */
    const onInfluencerCancel = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.influencer}/${ROUTES.list}`);
    }, []);

    /**
 *
 * @param e Method used for  dropdown for page limit
 */
    const onPageDrpSelectEvent = (e: string) => {
        setRecordsperpage(Number(e));
        const updatedFilterData = {
            ...filterData,
            limit: parseInt(e),
            page: DEFAULT_PAGE,
        };
        setFilterData(updatedFilterData);

    };
    /**
 * Method that sets total number of records to show
 */
    useEffect(() => {
        setRecordsperpage(filterData.limit);
    }, [filterData.limit]);

    /**
 * Handle's page chnage
 */
    const handlePageChangeEvent = useCallback((newPage: number): void => {
        const updatedFilterData = {
            ...filterData,
            page: newPage,
        };
        setFilterData(updatedFilterData);
    }, []);

    /**
 *
 * @param sortFieldName Method used for storing sort data
 */
    const onHandleSortEvent = (sortFieldName: string) => {
        setFilterData({
            ...filterData,
            sortBy: sortFieldName,
            sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
        });
    };

    /**
 * Used for refetch listing of subadmin data after filter
 */
    useEffect(() => {
        if (filterData) {
            getInfluencerProducts(filterData).catch((err) => {
                toast.error(err);
            });
        }
    }, [filterData]);

    const descriptionHandler = (value: string,title : string) => {
        setDescription(value);
        setShowMoreTitle(title);
        setShowDescriptionModelShow((prev) => !prev);
    };

    /**
     * Method used for close model
     */
    const onCloseEvent = useCallback(() => {
        setShowDescriptionModelShow(false);
    }, []);


    return (
        <div className='card'>
            <div className='card-header'>
                <div className='flex items-center'>
                    <span className='w-3.5 h-3.5 mr-2 text-md leading-sm inline-block svg-icon'>
                        <ProfileIcon />
                    </span>
                    {('Influencer Product Details')}
                </div>
                <Button className='btn-primary  text-bold' label={('Back')} onClick={onInfluencerCancel}>
                    <span className='mr-1 w-4 h-4 inline-block svg-icon '>
                        <ArrowSmallLeft />
                    </span>
                </Button>
            </div>
            <div className='card-body'>
                <div className='table-select-dropdown-container justify-start'>
                    <span className='table-select-dropdown-label'>{('Show')}</span>
                    <select aria-label={AccesibilityNames.Entries} className='table-select-dropdown' onChange={(e) => onPageDrpSelectEvent(e.target.value)} value={filterData.limit}>
                        {SHOW_PAGE_COUNT_ARR?.map((item: number) => {
                            return <option key={item}>{item}</option>;
                        })}
                    </select>
                    <span className='table-select-dropdown-label'>{('entries')}</span>
                </div>
                <div className='overflow-auto custom-datatable'>
                    <table>
                        <thead>
                            <tr>
                                {COL_ARR?.map((eventVal: IColumnsProps) => {
                                    return (
                                        <th scope='col' key={eventVal.fieldName}>
                                            <div className={`flex items-center ${eventVal.name === 'Sr.No' || eventVal.name === ('Description') ? 'justify-center' : ''} `}>
                                                {eventVal.name}
                                                {eventVal.sortable && (
                                                    <a onClick={() => onHandleSortEvent(eventVal.fieldName)} className='cursor-pointer'>
                                                        {(filterData.sortOrder === '' || filterData.sortBy !== eventVal.fieldName) && (
                                                            <span className='svg-icon inline-block ml-1 w-3 h-3'>
                                                                <GetDefaultIcon />
                                                            </span>
                                                        )}
                                                        {filterData.sortOrder === 'asc' && filterData.sortBy === eventVal.fieldName && <AngleUp />}
                                                        {filterData.sortOrder === 'desc' && filterData.sortBy === eventVal.fieldName && <AngleDown />}
                                                    </a>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.fetchInfluencerProducts?.data?.productData?.map((data: InfluencerProductDetails) => {
                                return (
                                    <tr key={data.uuid}>
                                        <td className='w-wide-3 m-auto cursor-pointer'><img src={data.images ? data?.images[0]?.url : '-'} alt="influencer-product" title="influencer-product" /></td>
                                        <td>
                                            {data.name.length > 30 ? data.name.slice(0, 30) : data.name}
                                            {data.name.length > 30 ? (
                                                <a className='text-red-500 hover:underline hover:cursor-pointer ml-1' onClick={() => descriptionHandler(data.name,COL_ARR[1].name)}>
                                                    show more...
                                                </a>
                                            ) : (
                                                ''
                                            )}
                                        </td>
                                        <td>
                                            {data.description.length > 50 ? data.description.slice(0, 50) : data.description}
                                            {data.description.length > 50 ? (
                                                <a className='text-red-500 hover:underline hover:cursor-pointer ml-1' onClick={() => descriptionHandler(data.description,COL_ARR[2].name)}>
                                                    show more...
                                                </a>
                                            ) : (
                                                ''
                                            )}
                                        </td>

                                        <td>
                                            {data.url.length > 50 ? data.url.slice(0, 50) : data.url}
                                            {data.url.length > 50 ? (
                                                <a className='text-red-500 hover:underline hover:cursor-pointer ml-1' onClick={() => descriptionHandler(data.url,COL_ARR[3].name)}>
                                                    show more...
                                                </a>
                                            ) : (
                                                ''
                                            )}
                                        </td>
                                        <td>{data?.sku}</td>
                                        <td>{data?.color}</td>
                                        <td>{data?.size}</td>
                                        <td>{data?.price}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {(data?.fetchInfluencerProducts?.data?.count === 0) && (
                        <div className='no-data'>
                            <div>{('No Data')}</div>
                        </div>
                    )}
                </div>
                <div className='datatable-footer'>
                    <div className='datatable-total-records'>
                        {`${data?.fetchInfluencerProducts?.data?.count === null || data?.fetchInfluencerProducts?.data?.count === undefined ? '0' : data?.fetchInfluencerProducts?.data?.count}`}
                        <span className='ml-1'>{(' Total Records')}</span>
                    </div>
                    {(data?.fetchInfluencerProducts?.data?.count !== 0) && <Pagination currentPage={filterData.page} totalPages={totalPages} onPageChange={handlePageChangeEvent} recordsPerPage={recordsPerPage} />}
                </div>
            </div>
            {isDescriptionModelShow && <DescriptionModel onClose={onCloseEvent} data={description} show={isDescriptionModelShow} title={showMoreTitle} />}
        </div>
    );
};

export default ViewInfluencer;

