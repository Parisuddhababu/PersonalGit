import React, { useCallback, useEffect, useState } from 'react';
import DropDown from '@components/dropdown/dropDown';
import UpdatedHeader from '@components/header/updatedHeader';
import { ArrowSortingDown, ArrowSortingUp,  Edit,  GetDefaultIcon, Map,  } from '@components/icons/icons';
import { ColArrType, DropdownOptionType } from '@types';
import { useTranslation } from 'react-i18next';
import {  PAGE_LIMIT, PAGE_NUMBER,  ROUTES,  SHOW_PAGE_COUNT_ARR, USER_TYPE,  } from '@config/constant';
import Pagination from '@components/Pagination/Pagination';
import filterServiceProps from '@components/filter/filter';
import { GET_ALL_LOCATIONS } from '@framework/graphql/queries/location';
import {  useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileType } from 'src/types/common';
import { GET_DIVERSION_CONTRACTOR_WITH_PAGINATION } from '@framework/graphql/queries/diversionContractor';
import { DiversionContractorType,  setDiversionContractorData } from 'src/redux/diversion-contractor-slice';
import { DiversionContractorDataArr } from 'src/types/diversionContractors';
import { useNavigate } from 'react-router-dom';



export type GetAllLocations ={
    uuid:string;
    location:string;
}


const DiversionContractorList = () => {
    const { t } = useTranslation();
    const Navigate = useNavigate();
    const [branchDrpData, setBranchDrpData] = useState<DropdownOptionType[]>([]);
    const { userProfileData:userData } = useSelector(((state: { userProfile: { userProfileData:UserProfileType  } }) => state.userProfile));
    const { data: getAllLocations, loading } = useQuery(GET_ALL_LOCATIONS, { fetchPolicy: 'network-only',skip:(userData?.getProfile?.data?.user_type ===USER_TYPE.SUPER_ADMIN)});
    const contractorsDetails = useSelector(((state:{diversionContractors:DiversionContractorType})=>state.diversionContractors));
    const dispatch = useDispatch();
    const [filterData, setFilterData] = useState({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        sortOrder: 'descend',
        search: '',
        sortField: 'createdAt',
        locationId:'',
        index: 0
    });
    const { refetch: refetchContractorsList } = useQuery(GET_DIVERSION_CONTRACTOR_WITH_PAGINATION, {
        fetchPolicy: 'network-only' ,skip :true ,
    });

    /**
     * Method used set dropdown data for location
     */
    useEffect(() => {
        if (getAllLocations?.getLocations?.data&&userData?.getProfile?.data?.user_type &&userData?.getProfile?.data?.user_type ===USER_TYPE.SUBSCRIBER_ADMIN) {
            setBranchDrpData(getAllLocations?.getLocations?.data?.map((data: GetAllLocations) => {
                return { name: data?.location, key: data?.uuid, uuid: data?.uuid }
            }));
            setFilterData((prev)=>{
                return {...prev,locationId:getAllLocations?.getLocations?.data[0]?.uuid}
            });
            refetchContractorsList({
                limit: PAGE_LIMIT,
                page: PAGE_NUMBER,
                sortOrder: 'descend',
                search: '',
                sortField: 'createdAt',
                locationId:getAllLocations?.getLocations?.data[0]?.uuid,
            }).then((res)=>{
                dispatch(setDiversionContractorData(res?.data?.getDiversionContractorsWithPagination?.data))
              
            }).catch((err)=>toast.error(err?.networkError?.result?.errors[0]?.message));
            
        }
        if(getAllLocations?.getLocations?.data&&userData?.getProfile?.data?.user_type &&userData?.getProfile?.data?.user_type !==USER_TYPE.SUBSCRIBER_ADMIN){
            setBranchDrpData(getAllLocations?.getLocations?.data?.map((data: GetAllLocations) => {
                return { name: data?.location, key: data?.uuid, uuid: data?.uuid }
            }));
            setFilterData({
                   ...filterData,
                    locationId:userData?.getProfile?.data?.branch_locations[0]?.uuid,
            })
            refetchContractorsList({
                limit: PAGE_LIMIT,
                page: PAGE_NUMBER,
                sortOrder: 'descend',
                search: '',
                sortField: 'createdAt',
                locationId:userData?.getProfile?.data?.branch_locations[0]?.uuid,
            }).then((res)=>{
                dispatch(setDiversionContractorData(res?.data?.getDiversionContractorsWithPagination?.data))

            }).catch((err)=>toast.error(err?.networkError?.result?.errors[0]?.message));
        }
    }, [getAllLocations?.getLocations,userData]);

    const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
    const totalService =  contractorsDetails?.contractorData?.count ?? 0;
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
        refetchContractorsList({
            limit: filterData?.limit,
            page: newPage,
            sortOrder: filterData?.sortOrder,
            sortField: filterData?.sortField,
            locationId:filterData?.locationId,
        }).then((res)=>{
            dispatch(setDiversionContractorData(res?.data?.getDiversionContractorsWithPagination?.data))
        }).catch((err)=>toast.error(err?.networkError?.result?.errors[0]?.message));

        filterServiceProps.saveState('filterDiversionReport', JSON.stringify(updatedFilterData));
    }, [filterData.limit]);


    /**
     * Method sets records per page in filter data when ever it changes
     */
    useEffect(() => {
        setRecordsPerPage(filterData.limit);
    }, [filterData.limit]);

    const COL_ARR_SERVICE = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Title'), sortable: false,fieldName:'contractor_company.name' },
        { name: t('Services Count'), sortable: false, fieldName: 'service_count' },
    ] as ColArrType[];

    /**
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortDiversionContractor = (sortFieldName: string) => {
        setFilterData({
            ...filterData,
            sortField: sortFieldName,
            sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
        });
        refetchContractorsList({
            limit: filterData?.limit,
            page: filterData?.page,
            sortOrder:filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
            sortField:sortFieldName,
            locationId:filterData?.locationId,
        }).then((res)=>{
            dispatch(setDiversionContractorData(res?.data?.getDiversionContractorsWithPagination?.data))

        }).catch((err)=>toast.error(err?.networkError?.result?.errors[0]?.message));
    };

    /**
    * @param e Method used for change dropdown for page limit
    */
    const onPageDrpSelectDiversionContrctor = (e: string) => {
        setRecordsPerPage(Number(e))
        const updatedFilterData = {
            ...filterData,
            limit: parseInt(e),
            page: 1,
            search: '',
            index: 0,
        };
        
        refetchContractorsList({
            limit: parseInt(e),
            page: 1,
            sortOrder:filterData.sortOrder ,
            sortField:filterData?.sortField,
            locationId:filterData?.locationId,
        }).then((res)=>{
            dispatch(setDiversionContractorData(res?.data?.getDiversionContractorsWithPagination?.data))

        }).catch((err)=>toast.error(err?.networkError?.result?.errors[0]?.message));

        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterDiversionReport', JSON.stringify(updatedFilterData));
    };


    /**
     * Method used to navigate to diversion report page update the diversion report 
     */
    const onEditDiversionContractor = useCallback((data:DiversionContractorDataArr) => {
        Navigate(`/${ROUTES.app}/${ROUTES.diversionContractor}/${ROUTES.createDiversionReport}/?locationId=${data?.location?.uuid}&companyId=${data?.contractor_company?.uuid}&companyName=${data?.contractor_company?.name}`);
    }, []);

    const onChangeLocation =useCallback((e:React.ChangeEvent<HTMLSelectElement>)=>{
        setFilterData((prev)=>{
            return{...prev,
            locationId:e.target.value}
        })
        refetchContractorsList({
            ...filterData,
            locationId:e.target.value
        }).then((res)=>{
            dispatch(setDiversionContractorData(res?.data?.getDiversionContractorsWithPagination?.data));
        }).catch((err)=>toast.error(err?.networkError?.result?.errors[0]?.message));
    },[]);

    /**
     * Method that provides header content
     * @returns React Element
     */
    const headerActionConst = () => {
        return (
            <>
                {
                    <div className={`flex w-full gap-3 xmd:gap-5 lg:w-auto ${loading ? 'pointer-events-none' : ''}`}>
                        <DropDown className='w-[212px] -mt-2 max-md:mr-2' label='' inputIcon={<Map fontSize='18' />} name='diversionReportTemplateData.location_id' onChange={onChangeLocation} value={filterData?.locationId} options={branchDrpData} id='userLocation' disabled={userData?.getProfile?.data?.user_type !== USER_TYPE.SUBSCRIBER_ADMIN} />
                    </div>
                }
            </>
        )
    };

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConst} />
            <div className='mb-3 bg-white rounded-xl overflow-auto border border-[#c8ced3] mx-7 p-3 md:p-5'>
                <div className='flex flex-col justify-between gap-3 mb-3 sm:gap-5 md:mb-5 btn-group sm:flex-row'>
                    <h6 className='w-full leading-7 xmd:w-auto'>{t('Contractors')}</h6>
                </div>
                <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                    <table>
                        <thead >
                            <tr>
                                {COL_ARR_SERVICE?.map((colValUser: ColArrType) => {
                                    return (
                                        <th scope='col' key={colValUser.name}>
                                            <div className={`flex items-center ${['service_count'].includes(colValUser.fieldName)? 'justify-center' : ''}`}>
                                                {colValUser.name}
                                                {colValUser.sortable && (
                                                    <button onClick={() => onHandleSortDiversionContractor(colValUser.fieldName)}>
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
                                    <div className='flex items-center'>{t('Action')}</div>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                               {contractorsDetails?.contractorData?.diversionContractors?.map((data:DiversionContractorDataArr,index:number)=>{
                                   const displayIndex = filterData?.index + index + 1;
                                return (<tr key={data?.uuid}>
                                    <td className='text-left'>{displayIndex}</td>
                                    <td className='text-left'>{data?.contractor_company?.name}</td>
                                    <td className='text-center'>{data?.service_count}</td>
                                    <td className='text-left'>
                                        <div className='btn-group'>
                                        <button type="button" className='btn bg-transparent cursor-pointer btn-default' onClick={() => onEditDiversionContractor(data)}  ><Edit /></button>
                                            {/* <EditBtnPopup data={data} setData={setDiversionContractorObj} onClick={() => onEditDiversionContractor(data)} /> */}
                                            {/* <EditBtn data={data} onClick={() => onEditDiversionContractor(data)} /> */}
                                            {/* <DeleteBtn data={data} setObj={setDiversionContractorObj} setIsDelete={setIsDeleteDiversionContractor} /> */}
                                        </div>
                                    </td>
                                </tr>)
                               }) }
                        </tbody>
                    </table>
                    {(contractorsDetails?.contractorData?.count === 0 ||
                        contractorsDetails?.contractorData?.count === null) && (
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
                        <select value={filterData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white' onChange={(e) => onPageDrpSelectDiversionContrctor(e.target.value)} >
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

export default DiversionContractorList;
