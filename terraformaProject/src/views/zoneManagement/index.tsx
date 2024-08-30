import { useMutation, useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import UpdatedHeader from '@components/header/updatedHeader';
import {  DELETE_WARNING_TEXT, PAGE_LIMIT, PAGE_NUMBER, SHOW_PAGE_COUNT_ARR, ZoneManagementDrpData } from '@config/constant';
import { CREATE_OR_UPDATE_ZONE, DELETE_ZONE, GET_ACTIVE_SITES, GET_ZONES_BY_ID } from '@framework/graphql/mutations/zoneManagement';
import { ColArrType, DropdownOptionType } from '@types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import filterServiceProps from '../../components/filter/filter';
import Button from '@components/button/button';
import { ArrowSortingDown, ArrowSortingUp, Cross, Edit, GetDefaultIcon, Search } from '@components/icons/icons';
import { FormikTouched, useFormik } from 'formik';
import TextInput from '@components/textInput/TextInput';
import { whiteSpaceRemover } from '@utils/helpers';
import useValidation from '@framework/hooks/validations';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopUp, setZoneData, zoneSliceType, setButtonContent, setZones, setZonesPaginationCount, setActiveLocationsDataArray, setPopUpConetent } from 'src/redux/zone-slice';
import { toast } from 'react-toastify';
import DropDown from '@components/dropdown/dropDown';
import DeleteBtn from '@components/common/deleteBtn';
import { ParentDataArr, ZoneDataArr, existingZones, initialState } from 'src/types/zoneManagement';
import { GET_ZONES_WITH_FILTER } from '@framework/graphql/queries/zoneManagement';
import CommonModel from '@components/common/commonModel';

export enum ZoneManagementEnums {
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete'
}
export const ZONE_POP_UP_MESSAGES: { [key: string]: string } = {
  ['Create']: 'Add new zone',
  ['Update']: 'Update zones',
  ['Delete']: 'Update zone before delete'
}
export type fetchZonesFilter = {
  sortOrder: string,
  limit: number,
  page: number,
  parent_ids: string[],
  search: string,
  sortField: string
}
const ZoneManagement = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const zoneDetails = useSelector(((state: { zoneManagement: zoneSliceType }) => state.zoneManagement));
  const [zoneObj, setZoneObj] = useState<ZoneDataArr>();
  const [locationsDrpData, setLocationsDrpData] = useState<DropdownOptionType[]>([]);
  const deleteRef = useRef<string>('');
  const [isDeleteZone,setIsDeleteZone]= useState(false);
  const COL_ARR = [
    { name: t('Sr.No'), sortable: false },
    { name: t('Zone Name'), sortable: true, fieldName: t('location'), },
    { name: t('Location'), sortable: false, fieldName: t('location'), },
    // { name: t('Diversion Percentage'), sortable: true, fieldName: ('diversion_percentage') }
  ] as ColArrType[];

  const [filterData, setFilterData] = useState({
    limit: PAGE_LIMIT,
    page: PAGE_NUMBER,
    sortField: 'createdAt',
    sortOrder: 'descend',
    parent_ids: '',
    search: '',
    index: 0
  })
  const { refetch: getAllActiveZones } = useQuery(GET_ACTIVE_SITES, { fetchPolicy: 'network-only', skip: !searchParams.get('locationId') });
  const [getAllZones, { loading: getAllZonesLoader }] = useMutation(GET_ZONES_BY_ID, { fetchPolicy: 'network-only' });
  const [createOrUpdateZone, { loading: createOrUpdateLodingState }] = useMutation(CREATE_OR_UPDATE_ZONE, { fetchPolicy: 'network-only' });
  const [deleteZone, { loading: deleteZoneLoadingState }] = useMutation(DELETE_ZONE, { fetchPolicy: 'network-only' });
  const { refetch: refetchZoneListData } = useQuery(GET_ZONES_WITH_FILTER, {
    fetchPolicy: 'network-only', skip: true, variables: {
      zoneData: {
        sortOrder: filterData.sortOrder,
        limit: filterData.limit,
        page: filterData.page,
        parent_ids: [filterData.parent_ids],
        search: filterData.search ?? '',
        sortField: filterData.sortField
      }
    }
  });

  const fetchZonesList = (fetchZonesFilter: fetchZonesFilter) => {
    refetchZoneListData({
      zoneData: {
        ...fetchZonesFilter,

      }
    }).then((res) => {
      dispatch(setZones(res?.data?.getZonesWithFilter?.data?.zones));
      dispatch(setZonesPaginationCount(res?.data?.getZonesWithFilter?.data?.count));
    }).catch((err) => {
      toast.error(err?.networkError?.result?.errors[0]?.message);
    })
  }

  useEffect(() => {
    if (searchParams?.get('locationId')) {
      const parentIds = searchParams?.get('locationId');
      if (parentIds) {
        dispatch(setActiveLocationsDataArray([parentIds]))
        fetchZonesList({
          sortOrder: filterData.sortOrder,
          limit: filterData.limit,
          page: filterData?.page,
          parent_ids: [parentIds],
          search: filterData.search ?? '',
          sortField: filterData?.sortField
        });
      }
    } else {
      getAllActiveZones().then((res) => {
        const locationArr = res?.data?.getActiveSites?.data?.map((location: ParentDataArr) => {
          return location?.uuid;
        })
        setLocationsDrpData(res?.data?.getActiveSites?.data?.map((location: ParentDataArr) => {
          return { name: location?.location, key: location?.uuid, uuid: location?.uuid };
        }))
        if (locationArr) {
          dispatch(setActiveLocationsDataArray(locationArr));
          fetchZonesList({
            sortOrder: filterData.sortOrder,
            limit: filterData.limit,
            page: filterData?.page,
            parent_ids: [...locationArr],
            search: filterData.search ?? '',
            sortField: filterData?.sortField
          });
        }
      }).catch((err) => {
        toast.error(err?.networkError?.result?.errors[0]?.message);
      })
    }
  }, [])

  const initialValues: initialState = {
    siteId: searchParams.get('locationId') ?? '',
    existingZones: [
      {
        uuid: '',
        name: '',
        // diversion_percentage: '',
      },
    ]
  }
  const { zoneManagementValidationSchema } = useValidation();
  const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
  const totalUserManagement = zoneDetails?.zonesPaginationCount || 0;
  const totalPages = Math.ceil(totalUserManagement / recordsPerPage);

  const handlePageChange = useCallback((newPage: number): void => {
    fetchZonesList({
      sortOrder: filterData.sortOrder,
      limit: filterData.limit,
      page: newPage,
      parent_ids: zoneDetails.activeLocationsDataArray,
      search: filterData.search ?? '',
      sortField: filterData.sortField
    });
    const updatedFilterData = {
      ...filterData,
      page: newPage,
      index: (newPage - 1) * filterData.limit,
    };
    setFilterData(updatedFilterData);
    filterServiceProps.saveState('location', JSON.stringify(updatedFilterData));

  }, [filterData.limit, zoneDetails]);



  useEffect(() => {
    if (zoneDetails) {
      formik.setFieldValue('existingZones', zoneDetails?.existingZones);
    }
  }, [zoneDetails])

  useEffect(() => {
    setRecordsPerPage(filterData.limit);
  }, [filterData.limit])


  /**
*
* @param sortFieldName Method used for storing sort data
*/
  const onHandleSortZone = (sortFieldName: string) => {
    setFilterData({
      ...filterData,
      sortField: sortFieldName,
      sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
    });
    fetchZonesList({
      sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
      limit: filterData.limit,
      page: filterData?.page,
      parent_ids: zoneDetails.activeLocationsDataArray,
      search: filterData.search ?? '',
      sortField: sortFieldName
    });
  };

  /**
*
* @param e Method used for change dropdown for page limit
*/

  const onPageDrpSelectCategory = (e: string) => {
    setRecordsPerPage(Number(e))
    const updatedFilterData = {
      ...filterData,
      limit: parseInt(e),
      page: 1,
      search: '',
      index: 0,
    };
    setFilterData(updatedFilterData);
    fetchZonesList({
      sortOrder: filterData.sortOrder,
      limit: parseInt(e),
      page: 1,
      parent_ids: zoneDetails.activeLocationsDataArray,
      search: '',
      sortField: filterData?.sortField
    });
    filterServiceProps.saveState('location', JSON.stringify(updatedFilterData));
  };

  /**
   * Method used to create new zones
   */
  const onAddZone = useCallback(() => {
    getAllActiveZones().then((res) => {
      setLocationsDrpData(res?.data?.getActiveSites?.data?.map((location: ParentDataArr) => {
        return { name: location?.location, key: location?.uuid, uuid: location?.uuid };
      }))
    }).catch((err) => {
      toast.error(err?.networkError?.result?.errors[0]?.message);
    })
    dispatch(setOpenPopUp(true));
    dispatch(setButtonContent(ZoneManagementEnums.Create));
    dispatch(setPopUpConetent(ZONE_POP_UP_MESSAGES['Create']));
    const ParentId = searchParams.get('locationId');
    if (ParentId) {

      setDynamicFields(ZoneManagementEnums.Create, ParentId);
    } else {
      setDynamicFields(ZoneManagementEnums.Create);
    }
  }, [locationsDrpData]);
  /**
   * Method used to Update existing zones
   */
  const onEditZone = useCallback((parentId: string) => {
    getAllActiveZones().then((res) => {
      setLocationsDrpData(res?.data?.getActiveSites?.data?.map((location: ParentDataArr) => {
        return { name: location?.location, key: location?.uuid, uuid: location?.uuid };
      }))
    }).catch((err) => {
      toast.error(err?.networkError?.result?.errors[0]?.message);
    })
    dispatch(setOpenPopUp(true));
    dispatch(setButtonContent(ZoneManagementEnums.Update));
    dispatch(setPopUpConetent(ZONE_POP_UP_MESSAGES['Update']))
    formik.setFieldValue('siteId', parentId);
    if (searchParams.get('locationId')) {
      setDynamicFields(ZoneManagementEnums.Update);
    } else {
      setDynamicFields(ZoneManagementEnums.Update, parentId)
    }
  }, [locationsDrpData]);
  /**
   * Method used to Delete Zone 
   */
  const onDeleteZone = useCallback(() => {
    setIsDeleteZone(true);
   /**
    *  // getAllActiveZones().then((res) => {
    //   setLocationsDrpData(res?.data?.getActiveSites?.data?.map((location: ParentDataArr) => {
    //     return { name: location?.location, key: location?.uuid, uuid: location?.uuid };
    //   }))
    // }).catch((err) => {
    //   toast.error(err?.networkError?.result?.errors[0]?.message);
    // })
    // dispatch(setOpenPopUp(true));
    // dispatch(setPopUpConetent(ZONE_POP_UP_MESSAGES[ZoneManagementEnums.Delete]))
    // dispatch(setButtonContent(ZoneManagementEnums.Update));
    formik.setFieldValue('siteId', data?.parent?.uuid);
     */
   /** // deleteRef.current = ZoneManagementEnums?.Delete;
    // setDynamicFields(ZoneManagementEnums.Update, data?.parent?.uuid, data?.uuid); */
  }, [
    /** locationsDrpData */
  ]);


  const handleDeleteZone = useCallback(() => {
    if (zoneObj) {
      deleteZone({ variables: { siteId: zoneObj?.parent?.uuid, zoneId: zoneObj?.uuid } }).then((res) => {
        toast.success(res?.data?.deleteZone?.message);
        fetchZonesList({
          sortOrder: filterData.sortOrder,
          limit: filterData?.limit,
          page: filterData?.page,
          parent_ids: zoneDetails.activeLocationsDataArray,
          search: filterData?.search,
          sortField: filterData?.sortField
        });
        onClose();
        deleteRef.current = '';
      }).catch((err) => {
        toast.error(err?.networkError?.result?.errors[0]?.message);
      })
    }
  }, [zoneObj]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: zoneManagementValidationSchema,
    onSubmit: async (values) => {
      createOrUpdateZone({
        variables: {
          zoneData: {
            site_id: values?.siteId,
            existingZones: values.existingZones
          }
        }
      }).then((res) => {
        if (zoneDetails?.popupContent !== ZONE_POP_UP_MESSAGES[ZoneManagementEnums.Delete]) {
          if(zoneDetails?.buttonContent === ZoneManagementEnums.Create ){
            toast.success('Zone is created successfully');
          }else{
            toast.success(res?.data?.createOrUpdateZone?.message)
          }
          fetchZonesList({
            sortOrder: filterData.sortOrder,
            limit: filterData?.limit,
            page: filterData?.page,
            parent_ids: zoneDetails.activeLocationsDataArray,
            search: filterData?.search,
            sortField: filterData?.sortField
          });
        }
        if(deleteRef.current === ZoneManagementEnums.Delete){
          handleDeleteZone();
        }
        onClose();
      }).catch((err) => {
        toast.error(err?.networkError?.result?.errors[0]?.message);
        onClose();
      })
    }
  });

  const setDataForDynamicFields = (reqData: existingZones[], eventType: string) => {
    if (reqData && eventType === ZoneManagementEnums.Create) {
      dispatch(setZoneData([...reqData, ...initialValues.existingZones]));
    }
    if (reqData && eventType !== ZoneManagementEnums.Create) {
      dispatch(setZoneData([...reqData]));
    }
  }

  const setDataForDynamicFieldsWithoutEventType = (reqData: existingZones[]) => {
    if (reqData && zoneDetails?.buttonContent === ZoneManagementEnums.Create) {
      dispatch(setZoneData([...reqData, ...initialValues.existingZones]));
    }
    if (reqData && zoneDetails?.buttonContent !== ZoneManagementEnums.Create) {
      dispatch(setZoneData([...reqData]));
    }
  }
  /**
   * Sets the dynamic fields in add/edit popup based on user location selection 
   */
  const parentID = (parent?: string) => {
    if (parent) {
      return parent;
    } else {
      return searchParams.get('locationId') ?? formik?.values?.siteId;
    }
  }
  const deleteDataArrProvider=(uuid:string,res:{ location: string, diversion_percentage: number, uuid: string }[],eventType?:string)=>{
    
      const reqData = res?.filter((zone: { location: string, diversion_percentage: number, uuid: string }) => {
        if (uuid !== zone?.uuid) {
          return zone;
        }
      }).map((zone: { location: string, diversion_percentage: number, uuid: string }) => {
        return {
          uuid: zone?.uuid,
          name: zone?.location,
          // diversion_percentage: zone?.diversion_percentage
        }
      })
      if (eventType) {
        setDataForDynamicFields(reqData, eventType);
      }
      else {
        setDataForDynamicFieldsWithoutEventType(reqData);
      }
    

  };

  const setDynamicFields = (eventType?: string, parent?: string, uuid?: string) => {
    if (parentID(parent)) {
      getAllZones({
        variables: {
          siteId: parentID(parent),
        }
      }).then((res) => {
        if (uuid) {
          deleteDataArrProvider(uuid,res?.data?.getZoneBySiteId?.data,eventType);
        } else {
          const reqData = res?.data?.getZoneBySiteId?.data?.map((zone: { location: string, diversion_percentage: number, uuid: string },) => {
            return {
              uuid: zone?.uuid,
              name: zone?.location,
              // diversion_percentage: zone?.diversion_percentage
            };

          });
          if (eventType) {
            setDataForDynamicFields(reqData, eventType);
          }
          else {
            setDataForDynamicFieldsWithoutEventType(reqData);
          }
        }
      }).catch((err) => {
        toast.error(err?.networkError?.result?.errors[0]?.message);
      })
    }
  }

  useEffect(() => {
    if (zoneDetails?.openPopUp && zoneDetails?.buttonContent === ZoneManagementEnums?.Create) {
      setDynamicFields();
    }
  }, [formik?.values?.siteId,])

  const headerActionConst = () => {
    return (
      <Button
        className='btn-normal btn-secondary w-full md:w-[140px] whitespace-nowrap lg:h-[50px]'
        type='button'
        onClick={onAddZone}
        label={t('+ Add New')}
      />
    )
  };

  const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
  }, []);

  const zoneErrors = (index: number, fieldName: string) => {
    if (typeof (formik?.errors?.existingZones) !== 'string') {
      return (formik?.errors?.existingZones as [])?.[`${index}`]?.[`${fieldName}`];
    } else {
      return fieldName !== 'name' && formik?.errors?.existingZones;
    }
  }

  /**
     *
     * @param e Method used for store search value
    */
  const onSearchZoneName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    fetchZonesList({
      sortOrder: filterData?.sortOrder,
      limit: filterData?.limit,
      page: filterData?.page,
      parent_ids: zoneDetails.activeLocationsDataArray,
      search: e.target.value,
      sortField: filterData?.sortField
    });
    setFilterData({ ...filterData, search: e.target.value })

  }, [zoneDetails])

  const handleZoneSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSortOption = event.target.value;
    const [sortField, sortOrder] = selectedSortOption.split(':');
    setFilterData({
      ...filterData,
      sortField,
      sortOrder,
    });
    fetchZonesList({
      sortOrder: sortOrder,
      limit: filterData?.limit,
      page: filterData?.page,
      parent_ids: zoneDetails.activeLocationsDataArray,
      search: filterData?.search,
      sortField: sortField
    });

  }

  const onClose = useCallback(() => {
    formik.resetForm();
    dispatch(setOpenPopUp(false));
    deleteRef.current = '';
    setIsDeleteZone(false);
  }, []);

  const touched = formik?.touched?.existingZones as FormikTouched<{ uuid: string; name: string; diversion_percentage: string | number; }[]>;

  return <> <UpdatedHeader headerActionConst={headerActionConst} />
    <div>
      <div className='p-3 mb-3 overflow-auto bg-white border border-solid md:p-5 rounded-xl border-border-primary'>
        <div className='flex flex-wrap items-center justify-between gap-3 mb-3 md:mb-5'>
          <h6>{t('Zone Management List')}</h6>
          <div className="flex flex-wrap w-full gap-3 xmd:w-auto">
            <div className='w-full xmd:w-[236px]'>
              <TextInput
                type='text'
                id='zone-search'
                value={filterData.search}
                placeholder={t('Search')}
                onChange={onSearchZoneName}
                inputIcon={<Search fontSize='18' className='font-normal' />}
              />
            </div>
            <div className='flex flex-wrap items-center w-full gap-4 xmd:w-auto'>
              <span className='leading-5.5 w-full xmd:w-auto whitespace-nowrap'>Sort By</span>
              <div className='w-full xmd:w-[150px]'>
                <DropDown
                  className='w-full -mt-2'
                  label=''
                  name='zoneSort'
                  onChange={handleZoneSortChange}
                  value={filterData.sortField + ':' + filterData.sortOrder}
                  error=""
                  options={ZoneManagementDrpData}
                  id='zoneSort'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
          <table>
            <thead>
              <tr>
                {COL_ARR?.map((cmsVal: ColArrType) => {
                  return (
                    <th scope='col' key={cmsVal.name} className={`${cmsVal.name === 'Sr.No' ? 'pl-7' : 'whitespace-nowrap'}`}>
                      <div className='flex items-center'>
                        {cmsVal.name}
                        {cmsVal.sortable && (
                          <button onClick={() => onHandleSortZone(cmsVal.fieldName)}>
                            {(filterData.sortOrder === '') && <GetDefaultIcon className='text-white' />}
                            {filterData.sortOrder === 'ascend' && <ArrowSortingUp className='text-white' />}
                            {filterData.sortOrder === 'descend' && <ArrowSortingDown className='text-white' />}
                          </button>
                        )}
                      </div>
                    </th>
                  );
                })}

                <th scope='col'>
                  <div>{t('Action')}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {zoneDetails?.zones?.map((data: ZoneDataArr, index: number) => {
                const displayIndex = filterData?.index  + index + 1;
                return (
                  <tr key={data.uuid}>
                    <td scope='row' className='text-left pl-7'>{displayIndex}</td>
                    <td className='text-left whitespace-nowrap'>{data?.location}</td>
                    <td className='text-left'>{data?.parent?.location}</td>
                    {/* <td className='text-left'>{data?.diversion_percentage}</td> */}
                    <td>
                      <div className='flex gap-3 text-left md:gap-5 btn-group'>
                        <Button className='bg-transparent btn-default' onClick={() => onEditZone(data?.parent?.uuid)} label={''} title='Edit'>
                          <Edit />
                        </Button>
                        <DeleteBtn data={data} setObj={setZoneObj} customClick={onDeleteZone} />
                      </div>
                    </td>
                  </tr>
                );
              })}

            </tbody>
          </table>
          {(zoneDetails?.zonesPaginationCount === 0 ||
            zoneDetails?.zonesPaginationCount === null) && (
              <div className='flex justify-center'>
                <div>{t('No Data')}</div>
              </div>
            )}
        </div>
      </div>
      <div className='flex flex-wrap items-center gap-5 mt-2'>
        <span className='text-xs text-slate-400'>
          {`${zoneDetails?.zonesPaginationCount === null || zoneDetails?.zonesPaginationCount === undefined
            ? '0'
            : zoneDetails?.zonesPaginationCount
            }` + t(' Total Records')}
        </span>

        <div className='flex items-center'>
          <span className='text-sm font-normal text-gray-700 whitespace-nowrap'>
            {t('Per Page')}
          </span>
          <select
            className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white'
            onChange={(e) => onPageDrpSelectCategory(e.target.value)}
            value={filterData.limit}
          >
            {SHOW_PAGE_COUNT_ARR?.map((data: number) => {
              return <option key={data}>{data}</option>
            })}
          </select>
        </div>
        <Pagination currentPage={filterData.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          recordsPerPage={recordsPerPage}
        />
      </div>
      {zoneDetails?.openPopUp &&
        <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${zoneDetails?.openPopUp ? '' : 'hidden'}`}>
          <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className="flex items-center justify-center h-full py-5 transition-all duration-300">
            <div className='w-full mx-5 sm:max-w-[780px]'>
              {/* <!-- Modal content --> */}
              <div className='relative bg-white rounded-xl'>
                {/* <!-- Modal header --> */}
                <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                  <p className='text-lg font-bold md:text-xl text-baseColor'>{zoneDetails.popupContent}</p>
                  <Button onClick={() => onClose()} label={t('')} title={`${t('Close')}`} >
                    <span className='text-xl-22'><Cross className='text-error' /></span>
                  </Button>
                </div>
                {/* <!-- Modal body --> */}
                <div className='w-full'>
                  <form onSubmit={formik.handleSubmit}>
                    <div className='p-5 max-h-[calc(100vh-260px)] overflow-auto grid grid-cols-2 gap-4'>
                      <div className='max-sm:mb-3 sm:w-[calc(50%-10px)] sm:inline-block col-span-2'>
                        <DropDown
                          placeholder={t('Select location')}
                          name='siteId'
                          onChange={formik.handleChange}
                          value={formik?.values?.siteId}
                          options={locationsDrpData}
                          id='site_id'
                          label={t('Location')}
                          required={true}
                          error={(formik.errors.siteId && formik.touched.siteId) ? formik.errors.siteId : ''}
                          disabled={!!searchParams.get('locationId') || zoneDetails?.buttonContent === ZoneManagementEnums?.Update} />
                      </div>
                {getAllZonesLoader &&<div className='relative  col-span-2 bg-black bg-opacity-70'>
                <div className='w-12 h-12 mx-auto rounded-[50%] border-solid border-4 border-[#E8E8EA] border-r-[#2575d6] animate-spin absolute left-[50%] top-[40%] z-[9999]'></div>
                      </div>} 
                      
                      {
                        !!formik?.values?.siteId && zoneDetails?.existingZones?.map((data: { uuid: string; name: string; diversion_percentage: string | number; }, index: number) => {
                          return (<div key={`zone-${data?.name}-${data?.diversion_percentage}`} className='col-span-1 flex gap-4'>
                            <div className='w-full'>
                              <TextInput
                                id={data?.uuid}
                                name={`existingZones[${index}].name`}
                                onBlur={OnBlur}
                                placeholder={t('Zone')}
                                onChange={formik.handleChange}
                                label={t(`Zone - ${index + 1}`)}
                                value={formik?.values?.existingZones[`${index}`]?.name}
                                required={true}
                                error={zoneErrors(index, 'name') && touched?.[`${index}`]?.name ? zoneErrors(index, 'name') : ''}
                              />
                            </div>
                            {/* <div className='sm:w-[calc(50%-10px)] sm:inline-block'>
                              <TextInput
                                id={data?.uuid}
                                name={`existingZones[${index}].diversion_percentage`}
                                onBlur={OnBlur}
                                placeholder={t('Diversion percentage')}
                                onChange={formik.handleChange}
                                label={t(`Zone - ${index + 1} - Diversion percentage`)}
                                value={formik?.values?.existingZones[`${index}`]?.diversion_percentage}
                                required={true}
                                error={zoneErrors(index, 'diversion_percentage') && touched?.[`${index}`]?.diversion_percentage ? zoneErrors(index, 'diversion_percentage') : ''} />
                            </div> */}
                          </div>);
                        })
                      }
                      {!!formik?.values?.siteId && !zoneDetails?.existingZones?.length &&
                        <div className='flex justify-center col-span-2'>
                          <div className='font-bold'><span className='text-error'>Note:</span>&nbsp;{t('No records found to update. You can directly delete zone.')}</div>
                        </div>}
          
                    </div>
                    <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                      {<Button className={'btn-primary btn-normal w-full md:w-auto min-w-[160px]'} type='submit' label={ t(zoneDetails?.buttonContent)} disabled={createOrUpdateLodingState || !!formik?.values?.siteId && !zoneDetails?.existingZones?.length} title='' />}
                      {!!formik?.values?.siteId && !zoneDetails?.existingZones?.length&&<Button className={ 'btn-error text-white btn-normal w-full md:w-auto min-w-[160px]'} onClick={handleDeleteZone} label={ t(ZoneManagementEnums?.Delete)} disabled={deleteZoneLoadingState} title=''/>}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {isDeleteZone && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={() => setIsDeleteZone(false)} action={handleDeleteZone} show={isDeleteZone} />}
    </div>
  </>
}

export default ZoneManagement;