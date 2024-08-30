import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { CHANGE_STATUS_WARNING_TEXT, DELETE_WARNING_TEXT, ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant'
import Button from '@components/button/button'
import CommonModel from '@components/common/commonModel'
import { ArrowSortingDown, ArrowSortingUp, GetDefaultIcon, Search } from '@components/icons/icons'
import TextInput from '@components/textInput/TextInput'
import filterServiceProps from '@components/filter/filter';
import Pagination from '@components/Pagination/Pagination'
import DeleteBtn from '@components/common/deleteBtn'
import EditBtn from '@components/common/EditButton'
import { CategoryData, CategoryDataArr } from '@framework/graphql/graphql'
import { DELETE_CATEGORY, UPDATE_CATEGORY_STATUS } from '@framework/graphql/mutations/category'
import { FETCH_CATEGORY } from '@framework/graphql/queries/category'
import { PaginationParams, ColArrType, UserRoles } from 'src/types/common'
// import TreePageBtn from './TreeRoute'

import { useQuery, useMutation } from '@apollo/client'
import UpdatedHeader from '@components/header/updatedHeader'
import { useSelector } from 'react-redux'

const ManageCategory = () => {
  const { data, refetch } = useQuery(FETCH_CATEGORY, {
    variables: {
      limit: 10,
      page: 1,
      sortField: 'name',
      sortOrder: '',
      search: '',
    }
  })
  const [categoryData, setCategoryData] = useState({} as CategoryData)
  const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false)
  const [isDeleteCategory, setIsDeleteCategory] = useState<boolean>(false)
  const [categoryObj, setCategoryObj] = useState({} as CategoryDataArr)
  const [updateCategoryStatus, loading] = useMutation(UPDATE_CATEGORY_STATUS)
  const [selectedAllCategory, setSelectedAllCategory] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<number[][]>([])
  const [deleteCategoryById, deleteLoading] = useMutation(DELETE_CATEGORY)
  const { t } = useTranslation()
  const [filterData, setFilterData] = useState<PaginationParams>({
    limit: 10,
    page: 1,
    sortField: 'name',
    sortOrder: '',
    search: '',
    index: 0
  })
  const COL_ARR = [
    { name: t('Sr.No'), sortable: false },
    { name: t('Tag Name'), sortable: true, fieldName: 'name' },
    { name: t('Tag Description'), sortable: true, fieldName: 'description' },
    { name: t('Status'), sortable: true, fieldName: 'status' },
  ] as ColArrType[]
  const navigate = useNavigate()
  const { category } = useSelector(((state: { rolesManagement: { category: UserRoles } }) => state.rolesManagement));

  /**
   * Used for refetch listing of category data after filter
   */
  useEffect(() => {
    if (data?.getCategories) {
      setCategoryData(data?.getCategories?.data)
    }
    if (!selectedCategory?.length) {
      const totalPages = Math.ceil(
        data?.getCategories?.data?.count / filterData?.limit
      )
      const pages = []
      for (let i = 0; i < totalPages; i++) {
        pages.push([])
      }
      setSelectedCategory(pages)
    }
  }, [data?.getCategories])
  /**method that sets all rules sets s selected */
  useEffect(() => {
    if (selectedAllCategory) {
      refetch().then((res) => {
        setSelectedCategory(
          res?.data?.getCategories?.data?.categories?.map(
            (i: CategoryDataArr) => i.id
          )
        )
      })
    }
  }, [data?.getCategories])

  /**
   *
   * @param obj Method Used for edit Category data
   */
  /**
   * Method used for close model
   */
  const onCloseCategory = useCallback(() => {
    setIsDeleteCategory(false)
    setIsStatusModelShow(false)
  }, [])
  /**
   * Method used for change Category status model
   */
  const onChangeStatus = useCallback((data: CategoryDataArr) => {
    setIsStatusModelShow(true)
    setCategoryObj(data)
  }, [])
  /**
   * Method used for change Category status with API
   */
  const changeCategoryStatus = useCallback(() => {
    updateCategoryStatus({
      variables: {
        categoryId: categoryObj?.uuid,
        status: categoryObj.status === 1 ? 2 : 1,
      },
    })
      .then((res) => {
        const data = res.data
        toast.success(data.activeDeActiveCategory.message)
        setIsStatusModelShow(false)
        refetch(filterData).catch((error) => toast.error(error))
      })
      .catch((err) => {
        toast.error(err.networkError.result.errors[0].message)
      })
  }, [isStatusModelShow])

  /**
   *
   * @param event Method used for on page click
   */

  /**
   *
   * @param e Method used for store search value
   */
  const onSearchCategory = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, search: e.target.value })
  }, [])
  /**
   *
   * @param sortFieldName Method used for storing sort data
   */
  const onHandleSortCategory = (sortFieldName: string) => {
    setFilterData({
      ...filterData,
      sortField: sortFieldName,
      sortOrder: filterData.sortOrder === 'ascend' ? 'descend' : 'ascend',
    })
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
      search: '',
      index: 0,
    };
    setFilterData(updatedFilterData);
    filterServiceProps.saveState('filterCategoryManagement', JSON.stringify(updatedFilterData));
  };
  /**
   *
   * @param data Method used for delete Category
   */
  const deleteCategoryData = useCallback(() => {
    deleteCategoryById({
      variables: {
        categoryId: categoryObj.uuid,
      },
    })
      .then((res) => {
        const data = res.data
        toast.success(data.deleteCategory.message)
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

  useEffect(() => {
    refetch(filterData).catch((err) => toast.error(err))
  }, [filterData])

  useEffect(() => {
    if (
      selectedCategory?.length ===
      data?.getCategories?.data?.categories?.length
    ) {
      setSelectedAllCategory(true)
    } else {
      setSelectedAllCategory(false)
    }
  }, [selectedCategory])

  const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
  const totalUserManagement = data?.getCategories?.data?.count || 0;
  const totalPages = Math.ceil(totalUserManagement / recordsPerPage);
  const handlePageChange = useCallback((newPage: number): void => {
    const updatedFilterData = {
      ...filterData,
      page: newPage,
      index: (newPage - 1) * filterData.limit,
    };
    setFilterData(updatedFilterData);
    filterServiceProps.saveState('filterCategoryManagement', JSON.stringify(updatedFilterData));
  }, []);
  useEffect(() => {
    setRecordsPerPage(filterData.limit);
  }, [filterData.limit]);
  const Navigation = useCallback(() => {
    navigate(`/${ROUTES.app}/${ROUTES.category}/add`);
  }, []);

  const headerActionConst = () => {
    return (
      <div className='flex gap-3 xl:gap-5 md:w-auto md:flex-row'>
        {category?.write && <Button
          className='btn-primary btn-normal'
          onClick={Navigation}
          type='button'
          label={t('Add New')}
        />}
        {/* <TreePageBtn route={`${ROUTES.category}`} /> */}
      </div>
    )
  }
  return (
    <>
      <UpdatedHeader headerActionConst={headerActionConst} />
      <div className='p-3 mb-3 overflow-auto bg-white border rounded-xl border-border-primary mx-7 md:p-5'>
        <div className='flex flex-col justify-between gap-3 mb-3 md:items-center md:gap-5 md:mb-5 btn-group md:flex-row'>
          <h6>{t('Tags List')}</h6>
          <div className='flex flex-wrap w-full gap-3 md:w-auto xl:gap-5'>
            <div className='flex flex-col justify-start text-slate-700 w-full md:w-auto md:max-w-[487px]'>
              <TextInput
                placeholder={t('Search')}
                name='search'
                type='text'
                onChange={onSearchCategory}
                inputIcon={<Search fontSize='18' className='font-normal' />}
              />
            </div>
          </div>
        </div>
        <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
          <table>
            <thead>
              <tr>
                {COL_ARR?.map((colVal: ColArrType, index: number) => {
                  return (
                    <th
                      scope='col'
                      className={`items-center ${colVal.name == t('Sr.No') ? 'pl-7' : ''}`}
                      key={`${index + 1}`}
                    >
                      <div
                        className='flex items-center'
                      >
                        {colVal.name}
                        {colVal.sortable && (
                          <a
                            onClick={() =>
                              onHandleSortCategory(colVal.fieldName)
                            }
                          >
                            {(filterData.sortOrder === '' ||
                              filterData.sortField !== colVal.fieldName) && (
                                <GetDefaultIcon className="fill-white" />
                              )}
                            {filterData.sortOrder === 'ascend' &&
                              filterData.sortField === colVal.fieldName && (
                                <ArrowSortingUp className="ml-1 fill-white" />
                              )}
                            {filterData.sortOrder === 'descend' &&
                              filterData.sortField === colVal.fieldName && (
                                <ArrowSortingDown className="ml-1 fill-white" />
                              )}
                          </a>
                        )}
                      </div>
                    </th>
                  )
                })}
                <th scope='col'>
                  <div>Action</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.getCategories?.data?.categories?.map(
                (data: CategoryDataArr, index: number) => {
                  const displayIndex = filterData?.index + index + 1;
                  return (
                    <tr key={data.uuid}>
                      <td className='text-left pl-7' scope='row'>
                        {displayIndex}
                      </td>
                      <td className='text-left'>{data?.name}</td>
                      <td className='text-left'>
                        {data?.description}
                      </td>
                      <td className='text-left'>
                        <div className='flex'>
                          {data.status === 1 ? (
                            <span className='rounded badge badge-success'>
                              Active
                            </span>
                          ) : (
                            <span className='rounded badge badge-danger'>
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className='flex gap-2 btn-group'>
                          {category?.update && <EditBtn data={data} route={ROUTES.category} />}
                          <div className='flex justify-center mr-2'>
                            {category?.update && <span
                              className='mt-2 font-medium text-blue-600 dark:text-blue-500 hover:underline'
                            >
                              <label className='relative inline-flex items-center cursor-pointer'>
                                <input
                                  type='checkbox'
                                  className='sr-only peer'
                                  value={data.status}
                                  onChange={() => onChangeStatus(data)}
                                  checked={data.status === 1}
                                />
                                <div
                                  className={
                                    'w-[30px] h-[14px] bg-secondary rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-[-1px] after:left-0 after:bg-white after:drop-shadow-outline-2 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary'
                                  }
                                ></div>
                              </label>
                            </span>}
                          </div>
                          {category?.delete && <DeleteBtn data={data} setObj={setCategoryObj} setIsDelete={setIsDeleteCategory} />}
                        </div>
                      </td>
                    </tr>
                  )
                }
              )}
            </tbody>
          </table>
          {(data?.getCategories?.data?.count === 0 ||
            data?.getCategories?.data === null) && (
              <div className='flex justify-center'>
                <div>{t('No Data')}</div>
              </div>
            )}
        </div>
        <div className='flex flex-wrap items-center gap-5 mt-2'>
          <span className='text-xs text-slate-400'>
            {`${categoryData?.count === null || categoryData?.count === undefined
              ? '0'
              : categoryData?.count
              }` + t(' Total Records')}
          </span>

          <div className='flex items-center'>
            <span className='text-sm font-normal text-gray-700 '>
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
      {isStatusModelShow && (
        <CommonModel
          warningText={CHANGE_STATUS_WARNING_TEXT}
          onClose={onCloseCategory}
          action={changeCategoryStatus}
          show={isStatusModelShow}
          disabled={loading?.loading}
        />
      )}
      {isDeleteCategory && (
        <CommonModel
          warningText={DELETE_WARNING_TEXT}
          onClose={onCloseCategory}
          action={deleteCategoryData}
          show={isDeleteCategory}
          disabled={deleteLoading?.loading}
        />
      )}
    </ >
  )
}
export default ManageCategory
