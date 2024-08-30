import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import AddEditRole from './addEditRole'
import { CHANGE_STATUS_WARNING_TEXT, DELETE_WARNING_TEXT, SHOW_PAGE_COUNT_ARR } from '@config/constant'
import Button from '@components/button/button'
import { ArrowSortingDown, ArrowSortingUp, GetDefaultIcon, Search } from '@components/icons/icons'
import CommonModel from '@components/common/commonModel'
import TextInput from '@components/textInput/TextInput'
import filterServiceProps from '@components/filter/filter'
import Pagination from '@components/Pagination/Pagination'
import DeleteBtn from '@components/common/deleteBtn'
import EditRoleBtn from './editRoleBtn'
import { UpdateRoleStatusType, RoleDataArr, RoleData, DeleteRoleRes } from '@framework/graphql/graphql'
import { UPDATE_ROLE_STATUS, DELETE_ROLE } from '@framework/graphql/mutations/role'
import { GET_ROLES_DATA } from '@framework/graphql/queries/role'
import { ColArrType, PaginationParams } from 'src/types/role'

import { useMutation, useQuery } from '@apollo/client'
import { useSelector } from 'react-redux'
import { UserRoles } from 'src/types/common'

type RolePermissionProps = {
  updatedRoleDataFunction: () => void; // Function that doesn't return a value
};

const RolePermission = ({ updatedRoleDataFunction }: RolePermissionProps) => {
  const { data, refetch } = useQuery(GET_ROLES_DATA, { variables: { limit: 500, page: 1, search: '', sortOrder: '', sortField: 'name' } })
  const [roleData, setRoleData] = useState({} as RoleData)
  const [isRoleModelShow, setIsRoleModelShow] = useState<boolean>(false)
  const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false)
  const [isDeleteRole, setIsDeleteRole] = useState<boolean>(false)
  const [roleObj, setRoleObj] = useState({} as RoleDataArr)
  const [updateRoleStatus] = useMutation(UPDATE_ROLE_STATUS)
  const [deleteRoleById] = useMutation(DELETE_ROLE)
  const [roleVal, setRoleVal] = useState<string>('')
  const { t } = useTranslation()
  const [isRoleEditable, setIsRoleEditable] = useState<boolean>(false)
  const [filterData, setFilterData] = useState<PaginationParams>({ limit: 10, page: 1, sortField: 'name', sortOrder: '', search: '', index : 0 })
  const COL_ARR_ROLE = [
    { name: 'Sr.No', sortable: false, fieldName: 'id' },
    { name: t('Title'), sortable: true, fieldName: 'name' },
    { name: t('Status'), sortable: true, fieldName: 'status' },
  ] as ColArrType[]
  const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit)
  const totalRuleSets = roleData?.count || 0
  const totalPages = Math.ceil(totalRuleSets / recordsPerPage);
  const { rolePermission } = useSelector(((state: { rolesManagement: { rolePermission: UserRoles } }) => state.rolesManagement));

  const handlePageChangeRole = useCallback((newPage: number): void => {
    const updatedFilterData = {
      ...filterData,
      page: newPage,
      index: (newPage - 1) * filterData.limit,
    }

    setFilterData(updatedFilterData)
    filterServiceProps.saveState(
      'filterRuleSets',
      JSON.stringify(updatedFilterData)
    )
  }, [])

  useEffect(() => {
    const savedFilterDataJSON = filterServiceProps.getState(
      'filterRuleSets',
      JSON.stringify(filterData)
    )
    if (savedFilterDataJSON) {
      const savedFilterData = JSON.parse(savedFilterDataJSON)
      setFilterData(savedFilterData)
    }
  }, [])

  /**
   * Used for refetch listing of role data after filter
   */
  useEffect(() => {
    if (filterData) {
      refetch(filterData)
    }
  }, [filterData])

  /**
   * Used for set role data from res in local variable
   */
  useEffect(() => {
    if (data?.getRoles) {
      setRoleData(data?.getRoles.data)
    }
  }, [data?.getRoles])

  /**
   * Method used for close model
   */
  const onClose = useCallback(() => {
    setIsRoleModelShow(false)
    setIsStatusModelShow(false)
    setIsDeleteRole(false);
  }, [])

  /**
   * Method used for refetch data and close model after submit
   */
  const onSubmitRole = useCallback(() => {
    setIsRoleModelShow(false)
    refetch(filterData)
    updatedRoleDataFunction();
  }, [])

  /**
   * Method used for add new role
   */
  const createNewRole = useCallback(() => {
    setIsRoleModelShow(true)
    setIsRoleEditable(false)
    setRoleVal('')
  }, [])

  /**
   * Method used for change role status model
   */
  const onChangeRoleStatus = (data: RoleDataArr) => {
    setIsStatusModelShow(true)
    setRoleObj(data)
  }

  /**
   * Method used for change role status with API
   */
  const changeRoleStatus = useCallback(() => {
    updateRoleStatus({
      variables: {
        roleId: roleObj?.uuid,
      },
    })
      .then((res) => {
        const data = res.data as UpdateRoleStatusType
        toast.success(data.activateRole.message)
        setIsStatusModelShow(false)
        refetch(filterData)
      })
      .catch((err) => {
        toast.error(err.networkError.result.errors[0].message)
      })
  }, [isStatusModelShow])

  /**
   *
   * @param e Method used for store search value
   */
  const onSearchRole = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, search: e.target.value })
  }, [])

  /**
   *
   * @param sortFieldName Method used for storing sort data
   */
  const onHandleSortRole = (sortFieldName: string) => {
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
  const onPageDrpSelectRole = (e: string) => {
    setRecordsPerPage(Number(e))
    const updatedFilterData = {
      ...filterData,
      limit: parseInt(e),
      page: 1,
      search: '',
      index: 0,
    }
    setFilterData(updatedFilterData)
    filterServiceProps.saveState(
      'filterRuleSets',
      JSON.stringify(updatedFilterData)
    )
  }
  /**
   * Method used for delete rules sets data
   */
  const deleteRoleData = useCallback(() => {
    deleteRoleById({
      variables: {
        roleId: roleObj.uuid,
      },
    })
      .then((res) => {
        updatedRoleDataFunction();
        const data = res?.data as DeleteRoleRes
        toast.success(data?.deleteRole?.message)
        setIsDeleteRole(false)
        refetch(filterData).catch((err) => {
          toast.error(err)
        })
      })
      .catch((err) => {
        toast.error(err.networkError.result.errors[0].message)
      })
  }, [isDeleteRole])
  useEffect(() => {
    setRecordsPerPage(filterData.limit)
  }, [filterData.limit])

  return (
    <div className='w-full mb-3 overflow-hidden bg-white border sm:w-auto rounded-xl border-border-primary'>
      <div className='flex items-center justify-between px-3 py-2 border-b md:px-5 border-border-primary bg-accents-2'>
        <h5 className='font-bold font-primary'>
          {t('Basic Details')}
        </h5>
        <div>
          {rolePermission?.write && <Button
            className='btn-primary btn-normal md:w-[100px] 2xl:w-[150px] ml-5 whitespace-nowrap'
            onClick={createNewRole}
            type='button'
            label={t('Add New')}
            title={`${t('Add New')}`}
          >
          </Button>}
        </div>
      </div>

      <div className='flex flex-col items-center justify-start gap-3 p-3 md:p-5 md:justify-between xl:flex-row'>
        <h5 className='font-bold font-primary'>
          {t('Role List')}
        </h5>
        <div className='relative w-full xl:w-auto'>
          <TextInput
            type='text'
            id='table-search'
            value={filterData.search}
            placeholder={t('Search')}
            onChange={onSearchRole}
            inputIcon={<Search fontSize='18' className='font-normal' />}
          />
        </div>
      </div>
      <div className='mx-3 overflow-hidden md:mx-5'>
        <div className='overflow-auto border border-solid rounded-t-xl custom-dataTable border-border-primary'>
          <table>
            <thead>
              <tr>
                {COL_ARR_ROLE?.map((roleVal: ColArrType, index: number) => {
                  return (
                    <th scope='col' key={`${index + 1}`}>
                      <div
                        className={`flex items-center ${roleVal.name == 'Sr.No'
                          ? 'justify-center'
                          : ''
                          }`}
                      >
                        {roleVal.name}
                        {roleVal.sortable && (
                          <a onClick={() => onHandleSortRole(roleVal.fieldName)}>
                            {(filterData.sortOrder === '' ||
                              filterData.sortField !== roleVal.fieldName) && (
                                <GetDefaultIcon className="fill-white" />
                              )}
                            {filterData.sortOrder === 'ascend' &&
                              filterData.sortField === roleVal.fieldName && (
                                <ArrowSortingUp className="ml-1 fill-white" />
                              )}
                            {filterData.sortOrder === 'descend' &&
                              filterData.sortField === roleVal.fieldName && (
                                <ArrowSortingDown className="ml-1 fill-white" />
                              )}
                          </a>
                        )}
                      </div>
                    </th>
                  )
                })}

                <th scope='col'>
                  <div className='flex items-center'>
                    {t('Action')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.getRoles.data?.role?.map(
                (data: RoleDataArr, index: number) => {
                  const displayIndex = filterData?.index as number  + index + 1;
                  return (
                    <tr key={data.uuid}>
                      <td>{displayIndex}</td>

                      <td className='truncate text-left text-ellipsis max-w-[360px]'>{data.name}</td>
                      <td>
                        <div className='flex'>
                          {data.status === 1 ? (
                            <span className='text-bright-green-shade'>
                              Active
                            </span>
                          ) : (
                            <span className='text-error'>
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className='flex btn-group'>
                          {rolePermission?.update && <EditRoleBtn
                            data={data}
                            setRoleObj={setRoleObj}
                            setIsRoleModelShow={setIsRoleModelShow}
                            setRoleVal={setRoleVal}
                            setIsRoleEditable={setIsRoleEditable}
                          />}
                          <div className='flex justify-center ml-2 mr-3'>
                            {rolePermission?.update && <span
                              onClick={() => onChangeRoleStatus(data)}
                              className='font-medium text-blue-600 hover:underline'
                            >
                              <label className='relative inline-flex items-center mb-0 cursor-pointer'>
                                <input
                                  type='checkbox'
                                  className='sr-only peer'
                                  value={data.status}
                                  checked={data.status === 1}
                                  onChange={() => onChangeRoleStatus(data)}
                                />
                                <div
                                  className={
                                    'w-[30px] h-[14px] bg-secondary rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-[-1px] after:left-0 after:bg-white after:drop-shadow-outline-2 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary'
                                  }
                                ></div>
                              </label>
                            </span>}
                          </div>
                          {rolePermission?.delete && <DeleteBtn
                            data={data}
                            setObj={setRoleObj}
                            setIsDelete={setIsDeleteRole}
                          />}
                        </div>
                      </td>
                    </tr>
                  )
                }
              )}
            </tbody>
          </table>
        </div>
        <div className='flex flex-wrap items-center gap-5 mt-2'>
          {(data?.getRoles?.data?.count === 0 ||
            data?.getRoles?.data?.role === null) && (
              <div className='flex justify-center'>
                <div>{t('No Data')}</div>
              </div>
            )}
          <div className='flex items-center gap-5 mb-4 md:gap-7'>
            <div className='flex items-center justify-start'>
              <span className='text-sm font-normal text-gray-900 whitespace-nowrap'>
                {t('Per Page')}
              </span>
              <select
                className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white'
                onChange={(e) => onPageDrpSelectRole(e.target.value)}
                value={filterData.limit}
              >
                {SHOW_PAGE_COUNT_ARR?.map((item: number) => {
                  return <option key={item}>{item}</option>
                })}
              </select>
            </div>
            <Pagination
              currentPage={filterData.page}
              totalPages={totalPages}
              onPageChange={handlePageChangeRole}
              recordsPerPage={recordsPerPage}
            />
          </div>
        </div>
      </div>

      {isRoleModelShow && (
        <AddEditRole
          isRoleModelShow={isRoleModelShow}
          isRoleEditable={isRoleEditable}
          onSubmitRole={onSubmitRole}
          onClose={onClose}
          roleVal={roleVal}
          roleObj={roleObj}
        />
      )}
      {isDeleteRole && (
        <CommonModel
          warningText={DELETE_WARNING_TEXT}
          onClose={onClose}
          action={deleteRoleData}
          show={isDeleteRole}
        />
      )}

      {isStatusModelShow && (
        <CommonModel
          warningText={CHANGE_STATUS_WARNING_TEXT}
          onClose={onClose}
          action={changeRoleStatus}
          show={isStatusModelShow}
        />
      )}
    </div>
  )
}
export default RolePermission
