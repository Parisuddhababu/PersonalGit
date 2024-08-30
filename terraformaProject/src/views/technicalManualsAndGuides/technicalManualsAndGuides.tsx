import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { DELETE_WARNING_TEXT, ImageUrl, PAGE_LIMIT, PAGE_NUMBER, SHOW_PAGE_COUNT_ARR } from '@config/constant'
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
import { GET_MANUAL_CATEGORIES_PAGINATION } from '@framework/graphql/queries/technicalManual'
import AddEditTechnicalManualsGuides from './addEditTechnicalManualsGuides'
import { DELETE_MANUAL_CATEGORY } from '@framework/graphql/mutations/technicalManual'
import EditBtnPopup from '@components/common/EditButtonPopup'
import { useSelector } from 'react-redux';
import UpdatedHeader from '@components/header/updatedHeader'

const TechnicalManualsAndGuidesComponent = () => {
  const [technicalManualData, setTechnicalManualData] = useState({} as CategoryData)
  const [isDeleteTechnicalManual, setIsDeleteTechnicalManual] = useState<boolean>(false)
  const [technicalObj, setTechnicalManualObj] = useState({} as CategoryDataArr)
  const [manualCategoryId, deleteLoading] = useMutation(DELETE_MANUAL_CATEGORY)
  const { t } = useTranslation()
  const [isOpenAddTechManualForm, setIsOpenAddTechManualForm] = useState(false);
  const [isOpenAddTechManualFormEdit, setIsOpenAddTechManualFormEdit] = useState(false);
  const { technicalManualsGuides } = useSelector(((state: { rolesManagement: { technicalManualsGuides: UserRoles } }) => state.rolesManagement));
  const [filterTechManualData, setFilterManualData] = useState<PaginationParams>({
    limit: PAGE_LIMIT,
    page: PAGE_NUMBER,
    sortField: 'createdAt',
    sortOrder: 'descend',
    search: '',
    index: 0
  })

  const { data, refetch } = useQuery(GET_MANUAL_CATEGORIES_PAGINATION, {
    variables: {
      sortOrder: filterTechManualData.sortOrder,
      limit: filterTechManualData.limit,
      page: filterTechManualData.page,
      search: filterTechManualData.search,
      sortField: filterTechManualData.sortField,
    },
  });
  const COL_TECH_MANUAL_ARR = [
    { name: t('Sr.No'), sortable: false },
    { name: t('Image'), sortable: false, fieldName: 'image_url' },
    { name: t('Name'), sortable: true, fieldName: 'name' },
    { name: t('Description'), sortable: true, fieldName: 'description' },
  ] as ColArrType[]

  /**
   * Used for refetch listing of category data after filter
   */
  useEffect(() => {
    if (data?.getManualCategories) {
      setTechnicalManualData(data?.getManualCategories?.data)
    }


  }, [data?.getManualCategories])


  /**
   *
   * @param obj Method Used for edit Category data
   */
  /**
   * Method used for close model
   */
  const onCloseTechManual = useCallback(() => {
    setIsDeleteTechnicalManual(false)

  }, [])


  /**
   *
   * @param e Method used for store search value
   */
  const onSearchTechManual = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterManualData({ ...filterTechManualData, search: e.target.value })
  }, [])
  /**
   *
   * @param sortFieldName Method used for storing sort data
   */
  const onHandleSortTechManual = (sortFieldName: string) => {
    setFilterManualData({
      ...filterTechManualData,
      sortField: sortFieldName,
      sortOrder: filterTechManualData.sortOrder === 'ascend' ? 'descend' : 'ascend',
    })
  }
  /**
   *
   * @param e Method used for change dropdown for page limit
   */

  const onPageDrpSelectTechManual = (e: string) => {
    setRecordsTechManualPerPage(Number(e))
    const updatedFilterData = {
      ...filterTechManualData,
      limit: parseInt(e),
      page: 1,
      search: '',
      index: 0,
    };
    setFilterManualData(updatedFilterData);
    filterServiceProps.saveState('filterCategoryManagementListingData', JSON.stringify(updatedFilterData));
  };

  /**
   *
   * @param data Method used for delete Category
   */
  const deleteTechManualData = useCallback(() => {
    manualCategoryId({
      variables: {
        manualCategoryId: technicalObj.uuid,
      },
    })
      .then((res) => {
        const data = res.data

        toast.success(data.deleteManualCategory.message)
        refetch(filterTechManualData).catch((err) => toast.error(err))
        setIsDeleteTechnicalManual(false)
      })
      .catch((err) => {
        if (err.networkError.statusCode === 400) {
          toast.error(err.networkError.result.errors[0].message)
          setIsDeleteTechnicalManual(false)
        } else {
          toast.error(err.networkError.result.errors[0].message)
        }
      })
  }, [isDeleteTechnicalManual])

  useEffect(() => {
    refetch(filterTechManualData).catch((err) => toast.error(err))
  }, [filterTechManualData])

  const [recordsTechManualPerPage, setRecordsTechManualPerPage] = useState<number>(filterTechManualData.limit);
  const totalTechManualManagement = data?.getManualCategories?.data?.count || 0;
  const totalTechManualPages = Math.ceil(totalTechManualManagement / recordsTechManualPerPage);
  const handlePageManualChange = useCallback((newPage: number): void => {
    const updatedTechManualFilterData = {
      ...filterTechManualData,
      page: newPage,
      index: (newPage - 1) * filterTechManualData.limit,
    };
    setFilterManualData(updatedTechManualFilterData);
    filterServiceProps.saveState('filterCategoryManagementListingData', JSON.stringify(updatedTechManualFilterData));
  }, [filterTechManualData.limit]);

  useEffect(() => {
    setRecordsTechManualPerPage(filterTechManualData.limit);
  }, [filterTechManualData.limit]);

  const [techManualUpdateData, setTechManualUpdateData] = useState('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getTechManualData(category: any) {
    setTechManualUpdateData(category);
    setIsOpenAddTechManualFormEdit(!isOpenAddTechManualFormEdit);
    setIsOpenAddTechManualForm(false);
  }

  const headerTchManualActionConst = () => {
    return (
      <>
        {technicalManualsGuides?.write && <Button
          className='btn-normal btn btn-secondary '
          onClick={() => { setTechManualUpdateData(''); setIsOpenAddTechManualFormEdit(false); setIsOpenAddTechManualForm(true); }}
          type='button'
          label={t('Create Technical Manuals')}
        />}
      </>
    )
  }

  return (
    <>
      <UpdatedHeader headerActionConst={headerTchManualActionConst} />
      <div className='p-3 mb-3 overflow-auto bg-white border rounded-xl border-border-primary mx-7 md:p-5'>
        <div className='flex flex-col justify-between gap-3 mb-3 md:items-center md:gap-5 md:mb-5 btn-group md:flex-row'>
          <h6>{t('Categories')}</h6>
          <div className='flex flex-wrap w-full md:w-auto '>
            <div className='flex flex-col justify-start text-slate-700 w-full md:w-auto md:max-w-[487px]'>
              <TextInput
                placeholder={t('Search')}
                name='search'
                type='text'
                onChange={onSearchTechManual}
                inputIcon={<Search fontSize='18' className='font-normal' />}
              />
            </div>
            <div className='flex flex-col btn-group md:flex-row w-full md:w-auto md:max-w-[487px]'>

              {isOpenAddTechManualForm &&
                <AddEditTechnicalManualsGuides onCloseAddForm={() => setIsOpenAddTechManualForm(false)} onData={refetch} />
              }
            </div>
          </div>
        </div>
        <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
          <table>
            <thead>
              <tr>
                {COL_TECH_MANUAL_ARR?.map((colVal: ColArrType, index: number) => {
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
                          : ''
                          }`}
                      >
                        {colVal.name}
                        {colVal.sortable && (
                          <button
                            onClick={() =>
                              onHandleSortTechManual(colVal.fieldName)
                            }
                          >
                            {(filterTechManualData.sortOrder === '' ||
                              filterTechManualData.sortField !== colVal.fieldName) && (
                                <GetDefaultIcon className="fill-white" />
                              )}
                            {filterTechManualData.sortOrder === 'ascend' &&
                              filterTechManualData.sortField === colVal.fieldName && (
                                <ArrowSortingUp className="ml-1 fill-white" />
                              )}
                            {filterTechManualData.sortOrder === 'descend' &&
                              filterTechManualData.sortField === colVal.fieldName && (
                                <ArrowSortingDown className="ml-1 fill-white" />
                              )}
                          </button>
                        )}
                      </div>
                    </th>
                  )
                })}
                <th className='items-center' scope='col'>
                  <div className='flex items-center justify-center'>Action</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.getManualCategories?.data?.manualCategories?.map(
                (data: TechnicalDatalist, index: number) => {
                  const imageUrl = data?.image_url?.startsWith(ImageUrl)
                    ? data?.image_url
                    : `${ImageUrl}/${data?.image_url}`;
                  const displayIndex = filterTechManualData?.index as number + index + 1;
                  return (
                    <tr key={data.uuid}>
                      <td className='text-center' scope='row'>
                        {displayIndex}
                      </td>
                      <td className='py-3 text-left border-none'>
                        <div className='w-[60px] h-[60px] rounded-md overflow-hidden'><img src={imageUrl} /></div>
                      </td>
                      <td className='text-left'>{data?.name}</td>
                      <td className='text-left'>
                        {data?.description}
                      </td>
                      <td>
                        <div className='flex justify-center gap-2 btn-group'>
                          {technicalManualsGuides?.update && <EditBtnPopup data={data} onClick={() => getTechManualData(data)} />}
                          {technicalManualsGuides?.delete && <DeleteBtn data={data} setObj={setTechnicalManualObj} setIsDelete={setIsDeleteTechnicalManual} />}
                        </div>
                      </td>
                    </tr>
                  )
                }
              )}
            </tbody>
          </table>
          {(data?.getManualCategories?.data?.count === 0 ||
            data?.getManualCategories?.data?.manualCategories === null) && (
              <div className='flex justify-center'>
                <div>{t('No Data')}</div>
              </div>
            )}
        </div>
        <div className='flex flex-wrap items-center gap-5 mt-2'>
          <span className='text-xs text-slate-400'>
            {`${technicalManualData?.count === null || technicalManualData?.count === undefined
              ? '0'
              : technicalManualData?.count
              }` + t(' Total Records')}
          </span>

          <div className='flex items-center'>
            <span className='text-sm font-normal text-gray-700 whitespace-nowrap'>
              {t('Per Page')}
            </span>
            <select
              className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white'
              onChange={(e) => onPageDrpSelectTechManual(e.target.value)}
              value={filterTechManualData.limit}
            >
              {SHOW_PAGE_COUNT_ARR?.map((data: number) => {
                return <option key={data}>{data}</option>
              })}
            </select>
          </div>
          <Pagination currentPage={filterTechManualData.page}
            totalPages={totalTechManualPages}
            onPageChange={handlePageManualChange}
            recordsPerPage={recordsTechManualPerPage}
          />
        </div>
      </div>

      {isDeleteTechnicalManual && (
        <CommonModel
          warningText={DELETE_WARNING_TEXT}
          onClose={onCloseTechManual}
          action={deleteTechManualData}
          show={isDeleteTechnicalManual}
          disabled={deleteLoading?.loading}
        />
      )}
      {isOpenAddTechManualFormEdit && (
        <AddEditTechnicalManualsGuides
          onCloseAddForm={() => setIsOpenAddTechManualFormEdit(false)}
          onData={techManualUpdateData}
          dataRefetch={() => refetch()}
        />
      )}
    </>
  )
}
export default TechnicalManualsAndGuidesComponent
