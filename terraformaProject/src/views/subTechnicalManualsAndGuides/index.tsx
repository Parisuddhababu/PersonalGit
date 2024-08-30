import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { DELETE_WARNING_TEXT, ImageUrl, PAGE_LIMIT, PAGE_NUMBER, ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant'
import Button from '@components/button/button'
import CommonModel from '@components/common/commonModel'
import { ArrowSortingDown, ArrowSortingUp, GetDefaultIcon, Search } from '@components/icons/icons'
import TextInput from '@components/textInput/TextInput'
import filterServiceProps from '@components/filter/filter';
import Pagination from '@components/Pagination/Pagination'
import DeleteBtn from '@components/common/deleteBtn'
import { CategoryData, CategoryDataArr, TechnicalDatalist } from '@framework/graphql/graphql'
import { PaginationParams, ColArrType, UserRoles } from 'src/types/common'
import { useQuery, useMutation } from '@apollo/client'
import AddEditTechnicalManualsGuides from './subAddEditTechnicalManualsGuides'
import { DELETE_MANUAL_CATEGORY } from '@framework/graphql/mutations/technicalManual'
import { GET_MANUAL_CATEGORIES_PAGINATION_CHILD } from '@framework/graphql/queries/technicalManualChild'
import EditBtnPopup from '@components/common/EditButtonPopup';
import UpdatedHeader from '@components/header/updatedHeader';

const TechnicalManualsAndGuidesComponent = () => {
  const [categoryData, setCategoryData] = useState({} as CategoryData)
  const [isDeleteCategory, setIsDeleteCategory] = useState<boolean>(false)
  const [categoryObj, setCategoryObj] = useState({} as CategoryDataArr)
  const [manualCategoryId, deleteLoading] = useMutation(DELETE_MANUAL_CATEGORY)
  const { t } = useTranslation()
  const navigate = useNavigate();
  const [isOpenAddForm, setIsOpenAddForm] = useState(false);
  const [isOpenAddFormEdit, setIsOpenAddFormEdit] = useState(false);
  const [categoryUpdateData, setCategoryUpdateData] = useState('')
  const { technicalManualsGuides } = useSelector(((state: { rolesManagement: { technicalManualsGuides: UserRoles } }) => state.rolesManagement));
  const [filterData, setFilterData] = useState<PaginationParams>({
    limit: PAGE_LIMIT,
    page: PAGE_NUMBER,
    sortField: 'createdAt',
    sortOrder: 'descend',
    search: '',
    index: 0
  })

  const { data, refetch } = useQuery(GET_MANUAL_CATEGORIES_PAGINATION_CHILD, {
    variables: {
      sortOrder: filterData.sortOrder,
      limit: filterData.limit,
      page: filterData.page,
      search: filterData.search,
      sortField: filterData.sortField,
    },
  });
  const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
  const COL_ARR = [
    { name: t('Sr.No'), sortable: false },
    { name: t('Image'), sortable: false, fieldName: 'image_url' },
    { name: t('Name'), sortable: true, fieldName: 'name' },
    { name: t('Parent Categories Name'), sortable: true, fieldName: 'parent.name' },
    { name: t('Description'), sortable: true, fieldName: 'description' },
  ] as ColArrType[]

  /**
   * Used for refetch listing of category data after filter
   */
  useEffect(() => {
    if (data?.getAllChildCategories) {
      setCategoryData(data?.getAllChildCategories?.data)
    }


  }, [data?.getAllChildCategories])

  /**
   *
   * @param obj Method Used for edit Category data
   */
  /**
   * Method used for close model
   */
  const onCloseCategory = useCallback(() => {
    setIsDeleteCategory(false)

  }, [])


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
    filterServiceProps.saveState('filterCategoryManagementList', JSON.stringify(updatedFilterData));
  };

  /**
   *
   * @param data Method used for delete Category
   */
  const deleteCategoryData = useCallback(() => {
    manualCategoryId({
      variables: {
        manualCategoryId: categoryObj.uuid,
      },
    })
      .then((res) => {
        const data = res.data

        toast.success(data.deleteManualCategory.message)
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

  const totalUserManagement = data?.getAllChildCategories?.data?.count || 0;
  const totalPages = Math.ceil(totalUserManagement / recordsPerPage);
  const handlePageChange = useCallback((newPage: number): void => {
    const updatedFilterData = {
      ...filterData,
      page: newPage,
      index: (newPage - 1) * filterData.limit,
    };
    setFilterData(updatedFilterData);
    filterServiceProps.saveState('filterCategoryManagementList', JSON.stringify(updatedFilterData));
  }, [filterData.limit]);

  useEffect(() => {
    setRecordsPerPage(filterData.limit);
  }, [filterData.limit]);

  function handleAddManuals() {
    navigate(`/${ROUTES.app}/${ROUTES.subTechnicalManualsGuides}/${ROUTES.userManual}`);
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getCategoryData(category: any) {
    setCategoryUpdateData(category);
    setIsOpenAddFormEdit(true)
  }
  const headerActionConst = () => {
    return (
      <>
        {technicalManualsGuides?.write && <Button
          className='btn-normal btn btn-secondary '
          onClick={() => setIsOpenAddForm(true)}
          type='button'
          label={t('Create Technical Manuals')}
        />}
        {technicalManualsGuides?.write && <Button
          className='btn-normal btn btn-secondary '
          onClick={handleAddManuals}
          type='button'
          label={t('Add Manuals')}
        />}
      </>
    )
  }
  return (
    <>
      <UpdatedHeader headerActionConst={headerActionConst} />
      <div className='p-3 mb-3 overflow-auto bg-white border rounded-xl border-border-primary mx-7 md:p-5'>
        <div className='flex flex-col justify-between gap-3 mb-3 md:items-center md:gap-5 md:mb-5 btn-group md:flex-row'>
          <h6>{t('Sub-Categories')}</h6>
          <div className='flex flex-wrap w-full md:w-auto '>
            <div className='flex flex-col justify-start text-slate-700 w-full md:w-auto md:max-w-[487px]'>
              <TextInput
                placeholder={t('Search')}
                name='search'
                type='text'
                onChange={onSearchCategory}
                inputIcon={<Search fontSize='18' className='font-normal' />} />
            </div>
            <div className='flex flex-col w-full gap-3 xl:gap-5 md:w-auto md:flex-row'>

              {isOpenAddForm &&
                <AddEditTechnicalManualsGuides onCloseAddForm={() => setIsOpenAddForm(false)} onData={refetch} />}
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
                      className='items-center'
                      key={`${index + 1}`}
                    >
                      <div
                        className={`flex items-center ${colVal.name == t('Status') ||
                          colVal.name == t('Sr.No')
                          ? 'justify-center'
                          : ''}`}
                      >
                        {colVal.name}
                        {colVal.sortable && (
                          <button
                            onClick={() => onHandleSortCategory(colVal.fieldName)}
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
                          </button>
                        )}
                      </div>
                    </th>
                  );
                })}
                <th className='items-center' scope='col'>
                  <div className='flex items-center justify-center'>Action</div>
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.getAllChildCategories?.data?.childCategories?.map((category: TechnicalDatalist, index: number) => {
                const imageUrl = category?.image_url?.startsWith(ImageUrl)
                  ? category?.image_url
                  : `${ImageUrl}/${category?.image_url}`;
                const displayIndex = filterData?.index as number + index + 1;
                return (
                  <tr key={`${category.uuid}-child-${index + 1}`}>
                    <td className='text-center' scope='row'>
                      {displayIndex}
                    </td>
                    <td className='text-left border-none'>
                      <div className='w-[60px] h-[60px] rounded-md overflow-hidden'><img src={imageUrl} alt={category.name} className='object-cover' /></div>
                    </td>
                    <td className='text-left'>{category.name}</td>
                    <td className='text-left'>{category.parent?.name ?? 'No Parent Category'}</td>
                    <td className='text-left'>
                      {category.description}
                    </td>
                    <td>
                      <div className='flex justify-center gap-2 btn-group'>
                        {technicalManualsGuides?.update && <EditBtnPopup data={category} onClick={() => getCategoryData(category)} />}
                        {technicalManualsGuides?.delete && <DeleteBtn data={category} setObj={setCategoryObj} setIsDelete={setIsDeleteCategory} />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
          {(data?.getAllChildCategories?.data?.count === 0 ||
            data?.getAllChildCategories?.data?.childCategories === null) && (
              <div className='flex justify-center'>
                <div>{t('No Data')}</div>
              </div>
            )}
        </div>
        <div className='flex flex-wrap items-center gap-5 mt-2'>
          <span className='text-xs text-slate-400'>

            {`${categoryData?.count === null || categoryData?.count === undefined
              ? '0'
              : categoryData?.count}` + t(' Total Records')}
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
                return <option key={data}>{data}</option>;
              })}
            </select>
          </div>
          <Pagination currentPage={filterData.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            recordsPerPage={recordsPerPage} />
        </div>
      </div>

      {isDeleteCategory && (
        <CommonModel
          warningText={DELETE_WARNING_TEXT}
          onClose={onCloseCategory}
          action={deleteCategoryData}
          show={isDeleteCategory}
          disabled={deleteLoading?.loading} />
      )}
      {isOpenAddFormEdit && (
        <AddEditTechnicalManualsGuides
          onCloseAddForm={() => setIsOpenAddFormEdit(false)}
          onData={categoryUpdateData}
          dataRefetch={() => refetch()}
        />
      )}
    </>
  )
}
export default TechnicalManualsAndGuidesComponent
