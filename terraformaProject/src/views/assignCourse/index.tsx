import React, { useCallback, useEffect, useState } from 'react'
import UpdatedHeader from '@components/header/updatedHeader'
import { useTranslation } from 'react-i18next';
import { ArrowSortingDown, ArrowSortingUp, Filter2, GetDefaultIcon, Search } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import Pagination from '@components/Pagination/Pagination';
import { ColArrType, PaginationParamsNew } from 'src/types/cms';
import { AssignCourseDrpData, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import filterServiceProps from '@components/filter/filter';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_WITH_STATUS } from '@framework/graphql/queries/assignCourse';
import { toast } from 'react-toastify';
import DropDown from '@components/dropdown/dropDown';
import Button from '@components/button/button';
import { ASSIGN_COURSE } from '@framework/graphql/mutations/assignedCourse';
import Loader from '@components/common/loader';

function Index() {
  const { t } = useTranslation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('course_uuid');
  const [selectedBanner, setSelectedBanner] = useState<string[]>([])
  const [filterData, setFilterData] = useState<PaginationParamsNew>({
    sortOrder: 'descend',
    sortField: 'first_name',
    limit: 10,
    page: 1,
    search: '',
    index: 0,
    user_types: [3, 4, 5, 6, 7],
    course_id: courseId ?? '',
  });
  const { data, refetch } = useQuery(GET_USER_WITH_STATUS, {
    variables: {
      inputData: {
        sortOrder: 'descend',
        sortField: 'first_name',
        limit: 10,
        page: 1,
        search: '',
        user_types: [3, 4, 5, 6, 7],
        course_id: courseId,
      }
    },
  });
  const COL_ARR = [
    { name: t('Sr.No'), sortable: false },
    { name: t('Name'), sortable: true, fieldName: t('first_name'), },
    { name: t('Email'), sortable: false, fieldName: t('email'), },
    { name: t('Status'), sortable: false, fieldName: 'status' },
  ] as ColArrType[];
  const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
  const [assignUserCourse, loading] = useMutation(ASSIGN_COURSE);
  const totalUserManagement = data?.getUsersWithStatusForCourse?.data?.count || 0;
  const totalPages = Math.ceil(totalUserManagement / recordsPerPage);
  const [selectedAll, setSelectedAll] = useState<boolean>(false);

  function onHandleSort(sortFieldName: string) {
    setFilterData({
      ...filterData,
      sortField: sortFieldName,
      sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
    })
  }

  const onPageDrpSelect = (e: string) => {
    setRecordsPerPage(Number(e))
    const newLimit = Number(e);
    const updatedFilterData = {
      ...filterData,
      limit: newLimit,
      page: 1,
      index: 0
    };
    setFilterData(updatedFilterData);
    filterServiceProps.saveState('filterAssignCourse', JSON.stringify(updatedFilterData));
  };

  const handlePageChange = useCallback((newPage: number): void => {
    const updatedFilterData = {
      ...filterData,
      page: newPage,
      index: (newPage - 1) * filterData.limit,
    };
    setFilterData(updatedFilterData);
    filterServiceProps.saveState('filterAssignCourse', JSON.stringify(updatedFilterData));
  }, [filterData.limit])

  useEffect(() => {
    setRecordsPerPage(filterData.limit);
  }, [filterData.limit]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { index, ...newObject } = filterData;
    refetch({ inputData: newObject }).catch((err) => toast.error(err))
  }, [filterData])

  const onSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, search: e.target.value })
  }, [])

  const onFilterDrpHandle = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSortOption = event.target.value;
    const [sortField, sortOrder] = selectedSortOption.split(':');
    setFilterData({
      ...filterData,
      sortField,
      sortOrder,
    });
  }

  const onAssignUserCourse = useCallback(() => {
    assignUserCourse({
      variables: {
        userCourseData: {
          course_id: courseId,
          user_ids: selectedBanner,
          is_assign_course_to_all: selectedAll,
          user_types: [3, 4, 5, 6, 7],
        }
      },
    })
      .then((res) => {
        const data = res?.data
        toast.success(data?.assignUserCourse?.message)
        refetch();
      })
      .catch((err) => {
        toast.error(err?.networkError?.result?.errors[0]?.message)
      })
  }, [selectedBanner, courseId])

  const handleSelectAllBanner = (event: React.ChangeEvent<HTMLInputElement>) => {
    let updateSelectedBannerSets: string[] = [];

    setSelectedAll(!selectedAll);

    if (!event.target.checked) {
      // Deselect all checkboxes
      setSelectedBanner([]);
    } else {
      // Select all checkboxes
      updateSelectedBannerSets = data?.getUsersWithStatusForCourse?.data?.usersWithStatus?.map((i: { uuid: string }) => i?.uuid) || [];
      setSelectedBanner(updateSelectedBannerSets);
    }
  };

  const handleSelectBannerSet = (bannerId: string) => {
    // Check if the value is already selected
    const isSelected = selectedBanner?.includes(bannerId);

    if (isSelected) {
      // If selected, remove the value from the state
      const updatedSelection = selectedBanner?.filter(id => id !== bannerId);
      setSelectedBanner(updatedSelection);
    } else {
      // If not selected, add the value to the state
      const newSelection = [...selectedBanner, bannerId];
      setSelectedBanner(newSelection);
    }
  };

  useEffect(() => {
    const assignCourseData = data?.getUsersWithStatusForCourse?.data?.usersWithStatus?.filter((data: { status: string; }) => data?.status === 'Assign');
    const selectedBannerSets = assignCourseData?.map((i: { uuid: string }) => i?.uuid) || [];
    setSelectedBanner(selectedBannerSets);
  }, [data])

  return (
    <>
      <UpdatedHeader />
      {loading?.loading && <Loader />}
      <div>
        <div className='p-5 border border-solid rounded-xl border-border-primary'>
          <div className='flex flex-wrap items-center justify-between gap-3 mb-5 md:gap-5'>
            <h6 className='w-full md:w-auto'>{t('User List')}</h6>
            <div className="flex flex-wrap w-full gap-3 md:gap-5 md:w-auto">
              <div className='w-full md:w-[236px]'>
                <TextInput
                  type='text'
                  id='table-search'
                  value={filterData.search}
                  placeholder={t('Search')}
                  onChange={onSearch}
                  inputIcon={<Search fontSize='18' className='font-normal' />}
                />
              </div>
              <div className='w-full sm:w-[150px]'>
                <DropDown
                  className='w-full -mt-2'
                  label=''
                  inputIcon={<Filter2 className='order-2' />}
                  name='filterDrpData'
                  onChange={onFilterDrpHandle}
                  value={filterData.sortField + ':' + filterData.sortOrder}
                  error=""
                  options={AssignCourseDrpData}
                  id='filterDrpData' />
              </div>
            </div>
          </div>
          <div className='overflow-auto custom-dataTable'>
            <table>
              <thead>
                <tr>
                  <th scope='col' className='text-center'>
                    <input
                      type='checkbox'
                      className='checkbox'
                      checked={selectedBanner?.length === data?.getUsersWithStatusForCourse?.data?.usersWithStatus?.length}
                      onChange={handleSelectAllBanner}
                    />
                  </th>
                  {COL_ARR?.map((cmsVal: ColArrType) => {
                    return (
                      <th scope='col' key={cmsVal.name} className={`${cmsVal.fieldName === 'sr_no' ? 'pl-7 w-[100px] md:w-[140px]' : 'min-w-[20px]'}`}>
                        <div className='flex items-center'>
                          {cmsVal.name}
                          {cmsVal.sortable && (
                            <button onClick={() => onHandleSort(cmsVal.fieldName)}>
                              {(filterData.sortOrder === '' || filterData.sortField !== cmsVal.fieldName) && <GetDefaultIcon className="fill-white" />}
                              {filterData.sortOrder === 'ascend' && filterData.sortField === cmsVal.fieldName && <ArrowSortingUp className="ml-1 fill-white" />}
                              {filterData.sortOrder === 'descend' && filterData.sortField === cmsVal.fieldName && <ArrowSortingDown className="ml-1 fill-white" />}
                            </button>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {data?.getUsersWithStatusForCourse?.data?.usersWithStatus?.map((courseData: { uuid: string, first_name: string, last_name: string, status: string, email: string }, index: number) => {
                  const displayIndex = filterData?.index + index + 1;
                  return (
                    <tr key={courseData?.uuid}>
                      <td className='text-center'>
                        <input
                          type='checkbox'
                          className='checkbox '
                          id={`${courseData?.uuid}`}
                          checked={selectedBanner?.includes(courseData?.uuid)}
                          onChange={() => handleSelectBannerSet(courseData?.uuid)}
                        />
                      </td>
                      <td scope='row' className='text-left pl-7'>{displayIndex}</td>
                      <td className='text-left'>{courseData?.first_name + ' ' + courseData?.last_name}</td>
                      <td className='text-left'>{courseData?.email}</td>
                      <td>
                        <div className='flex text-left btn-group'>{courseData?.status === 'Not Assign' ? <span className='text-error'>Not assign</span> : <span className='text-success'>Assigned</span>}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(data?.getUsersWithStatusForCourse?.data === undefined || data?.getUsersWithStatusForCourse?.data === null || data?.getUsersWithStatusForCourse?.data?.count === 0) && (
              <div className='flex justify-center'>
                <div>No Data</div>
              </div>
            )}
          </div>
          <div className='flex flex-wrap items-center gap-3 px-5 mt-2 overflow-auto md:gap-5 text-slate-700'>
            <div className='flex items-center'>
              <span className='mr-2 text-sm whitespace-nowrap'>{t('Per Page')}</span>
              <select value={filterData.limit} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white' onChange={(e) => onPageDrpSelect(e.target.value)}>
                {SHOW_PAGE_COUNT_ARR?.map((pageData: number) => {
                  return <option key={pageData}>{pageData}</option>;
                })}
              </select>
            </div>
            <div>
              <Pagination currentPage={filterData.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                recordsPerPage={recordsPerPage}
              />
            </div>
          </div>
        </div>
        <div className='flex justify-end m-9'>
          <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={() => onAssignUserCourse()} label={t('Submit')} disabled={loading?.loading || selectedBanner?.length === 0} title={`${t('Submit')}`}/>
        </div>
      </div>
    </>
  )
}

export default Index
