/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType, PaginationParams } from 'src/types/cms';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik'
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_WARNING_TEXT, PAGE_LIMIT, PAGE_NUMBER, ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { toast } from 'react-toastify';
import Button from '@components/button/button';
import { ArrowSortingDown, ArrowSortingUp, Cross, Filter, GetDefaultIcon } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import CommonModel from '@components/common/commonModel';
import filterServiceProps from '@components/filter/filter';
import Pagination from '@components/Pagination/Pagination';
import DeleteBtn from '@components/common/deleteBtn';
import UpdatedHeader from '@components/header/updatedHeader';
import { GET_LOCATION } from '@framework/graphql/queries/location';
import useValidation from '@framework/hooks/validations'
import { CREATE_LOCATION, DELETE_LOCATION, UPDATE_LOCATION } from '@framework/graphql/mutations/location';
import { Location } from 'src/types/technicalManual'
import { whiteSpaceRemover } from '@utils/helpers';
import EditBtnPopup from '@components/common/EditButtonPopup';
import { Link } from 'react-router-dom';

const initialValues = {
  uuid: '',
  location: '',
  city: '',
};

const Index = () => {
  const { t } = useTranslation();
  const [toggleFilterOption, setToggleFilterOption] = useState(false);
  const { addLocationSchema } = useValidation();
  const [togglePopUp, setTogglePopUp] = useState(false);
  const [manualCategoryId, deleteLoading] = useMutation(DELETE_LOCATION)
  const [searchCity, setSearchCity] = useState('')
  const [searchLocation, setSearchLocation] = useState('')

  const [filterData, setFilterData] = useState<PaginationParams>({
    limit: PAGE_LIMIT,
    page: PAGE_NUMBER,
    sortField: 'createdAt',
    sortOrder: 'descend',
    citySearch: searchCity,
    locationSearch:searchLocation,
    index: 0
  });
  const [isDeleteCategory, setIsDeleteCategory] = useState<boolean>(false)
  const [createLocation] = useMutation(CREATE_LOCATION);
  const [categoryObj, setCategoryObj] = useState({} as any)
  const [updateLocation] = useMutation(UPDATE_LOCATION);
  const { data: getLocations, refetch } = useQuery(GET_LOCATION, {
    variables: {
      sortOrder: filterData.sortOrder,
      limit: filterData.limit,
      page: filterData.page,
      citySearch: filterData.citySearch ?? '',
      locationSearch:filterData.locationSearch ?? '',
      sortField: filterData.sortField,
    },
    fetchPolicy:'network-only'
  });
  const COL_ARR = [
    { name: t('Sr.No'), sortable: false },
    { name: t('Location Name'), sortable: true, fieldName: t('location'), },
    { name: t('City'), sortable: true, fieldName: t('city'), },
    {name:t('Zone Count'),sortable:true,fieldName:t('zoneCount')}
  ] as ColArrType[];

  const formik = useFormik({
    initialValues,
    validationSchema: addLocationSchema,
    onSubmit: async (values) => {
      if (values?.uuid) {
        updateLocation({
          variables: {
            locationData: {
              location: values.location,
              city: values.city,
              location_id: values.uuid
            },
          },
        })
          .then((res) => {

            const data = res.data;
            toast.success(data?.updateLocation?.message);
            refetch();
            formik.resetForm();
            setTogglePopUp(!togglePopUp);
          })
          .catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message)
          })
      } else {
        createLocation({
          variables: {
            locationData: {
              location: values.location,
              city: values.city,
            },
          },
        })
          .then((res) => {
            const data = res.data
            toast.success(data?.createLocation?.message);
            refetch();
            formik.resetForm();
            setTogglePopUp(!togglePopUp);
          })
          .catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message)
          })
      }

    }
  })
  /**
   *
   * @param sortFieldName Method used for storing sort data
   */
  const onHandleSortCms = (sortFieldName: string) => {
    setFilterData({
      ...filterData,
      sortField: sortFieldName,
      sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
    });
  };

  /**
   * Method used for close model
   */
  const onClose = useCallback(() => {
    setIsDeleteCategory(false)
  }, []);


  const handleChange = () => {
    setFilterData({
      ...filterData,
      citySearch: searchCity,
      locationSearch: searchLocation,
    });
  }

  const handleAddPage = () => {
    formik.resetForm();
    setToggleFilterOption(!toggleFilterOption)
  }
  const headerActionConst = () => {
    return (
      <Button className={`${toggleFilterOption ? 'btn-primary' : 'border border-primary btn-secondary'} md:w-[50px] md:h-[50px] w-10`} label='' type='button' onClick={handleAddPage} >
        <Filter />
      </Button>
    )
  };

  /**
   * 
   * @param fieldName particular field name pass base on error show
   * @returns 
   */
  const getErrorTechnicalMessage = (fieldName: keyof Location) => {
    return formik.errors[fieldName] && formik.touched[fieldName]
      ? formik.errors[fieldName]
      : ''
  }

  const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
  }, []);

  function editButtonClick(data: { uuid?: string; location?: string; city?: string }) {
    formik.setFieldValue('uuid', data?.uuid);
    formik.setFieldValue('location', data?.location);
    formik.setFieldValue('city', data?.city);
    setTogglePopUp(!togglePopUp);
  }

  const deleteCategoryData = useCallback(() => {
    manualCategoryId({
      variables: {
        locationId: categoryObj.uuid,
      },
    })
      .then((res) => {
        const data = res.data

        toast.success(data.deleteLocation.message)
        refetch(filterData).catch((err) => toast.error(err))
        setIsDeleteCategory(false)
      })
      .catch((err) => {
        if (err.networkError.statusCode === 400) {
          toast.error(err.networkError.result.errors[0].message)
          setIsDeleteCategory(false)
        } else {
          toast.error(err.networkError.result.errors[0].message)
        }
      })
  }, [isDeleteCategory])

  const handleReset = () => {
    refetch({
      ...filterData,
      citySearch: '',
      locationSearch: '',
    })
    setFilterData({
      ...filterData,
      citySearch: '',
      locationSearch: '',
    })
    setSearchCity('')
    setSearchLocation('')
  };

  const handleSearchLocation = (e: any) => {
    setSearchLocation(e.target.value)
  }
  const handleSearchCity = (e: any) => {
    setSearchCity(e.target.value)
  }
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
        citySearch: '',
        locationSearch: '',
        index: 0,
      };
      setFilterData(updatedFilterData);
      filterServiceProps.saveState('location', JSON.stringify(updatedFilterData));
    };

  const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
  const totalUserManagement = getLocations?.getLocationsWithPagination?.data?.count || 0;
  const totalPages = Math.ceil(totalUserManagement / recordsPerPage);
  const handlePageChange = useCallback((newPage: number): void => {
    const updatedFilterData = {
      ...filterData,
      page: newPage,
      index: (newPage - 1) * filterData.limit,
    };
    setFilterData(updatedFilterData);
    filterServiceProps.saveState('location', JSON.stringify(updatedFilterData));
  }, [filterData.limit]);

  useEffect(() => {
    setRecordsPerPage(filterData.limit);
  }, [filterData.limit]);
  return (
    <>
      <UpdatedHeader headerActionConst={headerActionConst} />
      <div>
        {toggleFilterOption &&
          <div className="flex justify-start flex-wrap 2xl:flex-nowrap p-3 md:p-5 mb-3 md:mb-5 border border-border-primary rounded-xl bg-light-blue gap-2 2xl:gap-[18px] items-start">
            <div className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>
              <TextInput placeholder={t('Location Name')} required={true} name='categoryName' onChange={handleSearchLocation} value={searchLocation} />
            </div>
            <div className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>
              <TextInput placeholder={t('City')} required={true} name='categoryName' onChange={handleSearchCity} value={searchCity} />
            </div>
            <Button className='btn-primary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={t('Search')} onClick={() => handleChange()}  title={`${t('Search')}`} />
            <Button className='btn-secondary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={t('Reset')} onClick={handleReset} 
             title={`${t('Reset')}`}  />
          </div>
        }
        <div className='p-3 mb-3 overflow-auto bg-white border border-solid md:p-5 rounded-xl border-border-primary'>
          <div className='flex flex-wrap items-center justify-between gap-3 mb-3 md:mb-5'>
            <h6>{t('Locations List')}</h6>
            <Button
              className='btn-normal btn-secondary w-full md:w-[140px] whitespace-nowrap lg:h-[50px]'
              type='button'
              onClick={() => setTogglePopUp(!togglePopUp)}
              label={t('+ Add New')}
              title={`${t('Add New')}`} 
            />
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
                            <button onClick={() => onHandleSortCms(cmsVal.fieldName)} title=''>
                              {(filterData.sortOrder === '' || filterData.sortBy !== cmsVal.fieldName) && <GetDefaultIcon className='text-white' />}
                              {filterData.sortOrder === 'ascend' && filterData.sortBy === cmsVal.fieldName && <ArrowSortingUp className='text-white' />}
                              {filterData.sortOrder === 'descend' && filterData.sortBy === cmsVal.fieldName && <ArrowSortingDown className='text-white' />}
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
                {getLocations?.getLocationsWithPagination?.data?.location?.map((data: any, index: number) => {
                  const displayIndex = filterData?.index as number + index + 1;
                  return (
                    <tr key={data.id}>
                      <td scope='row' className='text-left pl-7'>{displayIndex}</td>
                      <td className='text-left whitespace-nowrap'>{data?.location}</td>
                      <td className='text-left'>{data?.city}</td>
                      <td className='text-left'><Link className='hover:text-primary' to={`/${ROUTES.app}/${ROUTES.zone}?locationId=${data?.uuid}`}>{data?.zoneCount}</Link></td>
                      <td>
                        <div className='flex gap-3 text-left md:gap-5 btn-group'>
                          {/* <EditBtn data={data} onClick={() => editButtonClick(data)} /> */}
                          <EditBtnPopup data={data} setData={setCategoryObj} onClick={() => editButtonClick(data)} />
                          <DeleteBtn data={data} setObj={setCategoryObj} setIsDelete={setIsDeleteCategory} />
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(getLocations?.getLocationsWithPagination?.data?.count === 0 ||
            getLocations?.getLocationsWithPagination?.data?.location === null) && (
              <div className='flex justify-center'>
                <div>{t('No Data')}</div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-wrap items-center gap-5 mt-2'>
          <span className='text-xs text-slate-400'>
            {`${getLocations?.getLocationsWithPagination?.data?.count === null || getLocations?.getLocationsWithPagination?.data?.count=== undefined
              ? '0'
              : getLocations?.getLocationsWithPagination?.data?.count
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
      </div>
      {togglePopUp &&
        <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${togglePopUp ? '' : 'hidden'}`}>
          <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className="flex items-center justify-center h-full py-5 transition-all duration-300">
            <div className='w-full mx-5 sm:max-w-[780px]'>
              {/* <!-- Modal content --> */}
              <div className='relative bg-white rounded-xl'>
                {/* <!-- Modal header --> */}
                <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                  <p className='text-lg font-bold md:text-xl text-baseColor'>{formik.values.uuid ? 'Update Location' : 'Add Location'}</p>
                  <Button onClick={() => { setTogglePopUp(!togglePopUp); formik.resetForm(); }} label={t('')}  title={`${t('Close')}`} >
                    <span className='text-xl-22'><Cross className='text-error' /></span>
                  </Button>
                </div>
                {/* <!-- Modal body --> */}
                <div className='w-full'>
                  <form onSubmit={formik.handleSubmit}>
                    <div className='p-5 max-h-[calc(100vh-260px)] overflow-auto flex'>
                      <div className='max-sm:mb-3 sm:w-[calc(50%-10px)] sm:inline-block'>
                        <TextInput onBlur={OnBlur} placeholder={t('Location')} required={true} name='location' onChange={formik.handleChange} label={t('Location')} value={formik.values.location} error={getErrorTechnicalMessage('location')} />
                      </div>
                      <div className='sm:w-[calc(50%-10px)] sm:ml-[20px] sm:inline-block'>
                        <TextInput onBlur={OnBlur} placeholder={t('City')} required={true} name='city' onChange={formik.handleChange} label={t('City')} value={formik.values.city} error={getErrorTechnicalMessage('city')} />
                      </div>
                    </div>
                    <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                      <Button className='btn-primary btn-normal w-full md:w-auto min-w-[160px]' type='submit' label={formik.values.uuid ? t('Update') : t('Create')}  title={`${formik.values.uuid ? t('Update') : t('Create')}`}  />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {isDeleteCategory && (
        <CommonModel
          warningText={DELETE_WARNING_TEXT}
          onClose={onClose}
          action={deleteCategoryData}
          show={isDeleteCategory}
          disabled={deleteLoading?.loading} />
      )}
    </>

  );
};
export default Index;
