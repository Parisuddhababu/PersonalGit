import React, { useCallback, useEffect, useState } from 'react';
import DropDown from '@components/dropdown/dropDown';
import UpdatedHeader from '@components/header/updatedHeader';
import { ArrowSortingDown, ArrowSortingUp, Edit, GetDefaultIcon, Map,  } from '@components/icons/icons';
import { DropdownOptionType } from '@types';
import { useTranslation } from 'react-i18next';
import { PAGE_LIMIT, PAGE_NUMBER, ROUTES, SHOW_PAGE_COUNT_ARR, USER_TYPE,  } from '@config/constant';
import Pagination from '@components/Pagination/Pagination';
import filterServiceProps from '@components/filter/filter';
import { GET_ALL_LOCATIONS } from '@framework/graphql/queries/location';
import { useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { ColArrType,  GetAllLocations, } from 'src/types/diversionReporttemplate';
import { UserProfileType } from 'src/types/common';
import { Link } from 'react-router-dom';
import { GET_DIVERSION_HISTORY } from '@framework/graphql/queries/diversionReportHistoryList';
import { DiversionReportHistorySliceType, setDiversionHistroyData, setHistoryLocationId } from 'src/redux/diversionHistory-slice';
import moment from 'moment';
import { getDateFromTimestamp } from '@utils/helpers';
import { DiversionReportHistoryType } from 'src/types/diversionReport';

const DiversionReportHistoryList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterData, setFilterData] = useState({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortOrder: 'descend',
        search: '',
        sortField: 'createdAt',
        locationId: '',
        index: 0
    });
    const COL_ARR_SERVICE = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Title'), sortable: false },
        { name: t('Frequency'), sortable: true, fieldName: 'frequency' },
        { name: t('Period'), sortable: false, fieldName: '' },
    ] as ColArrType[];
    const [branchDrpData, setBranchDrpData] = useState<DropdownOptionType[]>([]);
    const { userProfileData: userData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const diversionReportHistoryDetails = useSelector(((state: { diversionReportHistroyManagement: DiversionReportHistorySliceType }) => state.diversionReportHistroyManagement));
    const { data: getAllLocations, loading } = useQuery(GET_ALL_LOCATIONS, { fetchPolicy: 'network-only', skip: (userData?.getProfile?.data?.user_type === USER_TYPE.SUPER_ADMIN) });
    const { refetch: getAllReports,  } = useQuery(GET_DIVERSION_HISTORY, { fetchPolicy: 'network-only', skip:true});
    
    /**
     * Method used set dropdown data for location
     */
    useEffect(() => {
        if (getAllLocations?.getLocations?.data && userData?.getProfile?.data?.user_type && userData?.getProfile?.data?.user_type === USER_TYPE.SUBSCRIBER_ADMIN) {
            dispatch(setHistoryLocationId(getAllLocations?.getLocations?.data?.[0]?.uuid))
            setBranchDrpData(getAllLocations?.getLocations?.data?.map((data: GetAllLocations) => {
                return { name: data?.location, key: data?.uuid, uuid: data?.uuid }
            }));
            getAllReports({
                limit: PAGE_LIMIT,
                page: PAGE_NUMBER,
                sortOrder: 'descend',
                search: '',
                sortField: 'createdAt',
                locationId: getAllLocations?.getLocations?.data[0]?.uuid,
            }).then((res) => {
                dispatch(setDiversionHistroyData(res?.data?.getDiversionReportHistory?.data));
            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));

        }
        if (getAllLocations?.getLocations?.data && userData?.getProfile?.data?.user_type && userData?.getProfile?.data?.user_type === USER_TYPE.DIVERSION_ADMIN) {
            dispatch(setHistoryLocationId(userData?.getProfile?.data?.branch_locations[0]?.uuid))
            setBranchDrpData(getAllLocations?.getLocations?.data?.map((data: GetAllLocations) => {
                return { name: data?.location, key: data?.uuid, uuid: data?.uuid }
            }));
            getAllReports({
                limit: PAGE_LIMIT,
                page: PAGE_NUMBER,
                sortOrder: 'descend',
                search: '',
                sortField: 'createdAt',
                locationId: userData?.getProfile?.data?.branch_locations[0]?.uuid,
            }).then((res) => {
                dispatch(setDiversionHistroyData(res?.data?.getDiversionReportHistory?.data));
            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));

        }
    }, [getAllLocations?.getLocations, userData]);

    /**
     * Method that fetchs the history of reports if user chnaged location in dropdown
     */
    useEffect(()=>{
        if(diversionReportHistoryDetails?.locationId){
            getAllReports({
                limit: PAGE_LIMIT,
                page: PAGE_NUMBER,
                sortOrder: 'descend',
                search: '',
                sortField: 'createdAt',
                locationId: diversionReportHistoryDetails?.locationId,
            }).then((res) => {
                dispatch(setDiversionHistroyData(res?.data?.getDiversionReportHistory?.data));
            }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
        }
    },[diversionReportHistoryDetails?.locationId])

    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
    const totalService = diversionReportHistoryDetails?.diversionReportHistroyData?.count ?? 0;
    const totalPages = Math.ceil(totalService / recordsPerPage);

    /**
     * Method used to change the page 
     */
    const handlePageChange = useCallback((newPage: number): void => {
        const updatedFilterData = {
            ...filterData,
            page: newPage,
            index: (newPage - 1) * filterData.limit,
        };
        setFilterData(updatedFilterData);
        getAllReports({
            limit: filterData?.limit,
            page: newPage,
            sortOrder: filterData?.sortOrder,
            sortField: filterData?.sortField,
            locationId: filterData?.locationId,
        }).then((res) => {
            dispatch(setDiversionHistroyData(res?.data?.getDiversionReportHistory?.data));
        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
        filterServiceProps.saveState('filterDiversionReportHistory', JSON.stringify(updatedFilterData));
    }, [filterData.limit]);


    /**
     * Method sets records per page in filter data when ever it changes
     */
    useEffect(() => {
        setRecordsPerPage(filterData.limit);
    }, [filterData.limit]);


    /**
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortDiversionReport = (sortFieldName: string) => {
        setFilterData({
            ...filterData,
            sortField: sortFieldName,
            sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
        });
        getAllReports({
            limit: filterData?.limit,
            page: filterData?.page,
            sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
            sortField: sortFieldName,
            locationId: filterData?.locationId,
        }).then((res) => {
            dispatch(setDiversionHistroyData(res?.data?.getDiversionReportHistory?.data));
        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));
    };

    /**
    * @param e Method used for change dropdown for page limit
    */
    const onPageDrpSelectDiversionHistory = (e: string) => {
        setRecordsPerPage(Number(e))
        const updatedFilterData = {
            ...filterData,
            limit: parseInt(e),
            page: 1,
            search: '',
            index: 0,
        };

        getAllReports({
            limit: parseInt(e),
            page: 1,
            sortOrder: filterData.sortOrder,
            sortField: filterData?.sortField,
            locationId: filterData?.locationId,
        }).then((res) => {
            dispatch(setDiversionHistroyData(res?.data?.getDiversionReportHistory?.data));
        }).catch((err) => toast.error(err?.networkError?.result?.errors[0]?.message));

        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterDiversionReportHistory', JSON.stringify(updatedFilterData));
    };


    /**
     * Method that provides header content
     * @returns React Element
     */
    const headerActionConst = () => {
        return (
            <>
                {
                    <div className={`flex w-full gap-3 xmd:gap-5 lg:w-auto ${loading ? 'pointer-events-none' : ''}`}>
                        <DropDown className='w-[212px] -mt-2 max-md:mr-2' label='' inputIcon={<Map fontSize='18' />} name='diversionReportTemplateData.location_id' onChange={(e) => {
                            dispatch(setHistoryLocationId(e.target.value))
                        }} value={diversionReportHistoryDetails?.locationId} options={branchDrpData} id='userLocation' disabled={userData?.getProfile?.data?.user_type !== USER_TYPE.SUBSCRIBER_ADMIN} />
                    </div>
                }
            </>
        )
    }

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />    
            <div className='mb-3 bg-white rounded-xl overflow-auto border border-[#c8ced3] mx-7 p-3 md:p-5'>
                <div className='flex flex-col justify-between gap-3 mb-3 sm:gap-5 md:mb-5 btn-group sm:flex-row'>
                    <h6 className='w-full leading-7 xmd:w-auto'>{t('Reports List')}</h6>
                </div>
                <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                    <table>
                        <thead >
                            <tr>
                                {COL_ARR_SERVICE?.map((colValUser: ColArrType,index:number) => {
                                    const key= colValUser.name+index+1;
                                    return (
                                        <th scope='col'key={key}>
                                            <div className={`flex items-center ${colValUser.fieldName == 'frequency' ? 'justify-center' : ''}`}>
                                                {colValUser.name}
                                                {colValUser.sortable && (
                                                    <button onClick={() => onHandleSortDiversionReport(colValUser.fieldName)}>
                                                        {(filterData.sortOrder === '' || filterData.sortField !== colValUser.fieldName) &&
                                                            <GetDefaultIcon className='w-3 h-3 ml-1 fill-white' />}
                                                        {filterData.sortOrder === 'ascend' && filterData.sortField === colValUser.fieldName &&
                                                            <ArrowSortingUp className="ml-1 fill-white" />}
                                                        {filterData.sortOrder === 'descend' && filterData.sortField === colValUser.fieldName &&
                                                            <ArrowSortingDown className="ml-1 fill-white" />}
                                                    </button>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                                <th scope='col'>
                                    <div className='flex justify-center items-center'>{t('Action')}</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {diversionReportHistoryDetails?.diversionReportHistroyData?.diversionReportHistory?.map((data: DiversionReportHistoryType, index: number) => {
                                const displayIndex = filterData?.index + index + 1;
                                return (<tr key={data?.uuid}>
                                    <td className='text-left'>{displayIndex}</td>
                                    <td className='text-left'>{data?.title}</td>
                                    <td className='text-center'>{data?.frequency}</td>
                                    <td className='text-left'>{moment(getDateFromTimestamp(data?.start_date)).format('MMM, YY')}&nbsp;to&nbsp;{moment(getDateFromTimestamp(data?.end_date)).format('MMM, YY')}</td>
                                    <td className='text-left'>
                                        <div className='flex justify-center'>
                                            <Link className='bg-transparent btn-default' to={`/${ROUTES.app}/${ROUTES.viewReports}/${ROUTES.diversionReport1}/?historyId=${data?.uuid}`} title='Edit' >
                                                <Edit />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>);
                            })}
                        </tbody>
                    </table>
                    {(diversionReportHistoryDetails?.diversionReportHistroyData?.count === 0 ||
                        diversionReportHistoryDetails?.diversionReportHistroyData?.count === null) && (
                            <div className='flex justify-center'>
                                <div>{t('No Data')}</div>
                            </div>
                        )}
                </div>
                <div className='flex flex-wrap items-center mt-2'>
                    <div className='flex items-center mr-3 md:mr-7'>
                        <span className='text-sm font-normal text-gray-700 whitespace-nowrap '>
                            {t('Per Page')}
                        </span>
                        <select value={filterData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white' onChange={(e) => onPageDrpSelectDiversionHistory(e.target.value)} >
                            {SHOW_PAGE_COUNT_ARR?.map((item: number) => {
                                return <option key={item}>{item}</option>;
                            })}
                        </select>
                    </div>
                    <Pagination currentPage={filterData.page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        recordsPerPage={recordsPerPage}
                    />
                </div>
            </div>
        </>
    );
}

export default DiversionReportHistoryList;
