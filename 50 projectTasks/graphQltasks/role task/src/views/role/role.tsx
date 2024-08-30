import React, { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { FETCH_ROLES_DATA } from "@framework/graphql/queries/role";
import {
  UpdateRoleStatusType,
  RoleDataArr,
  RoleData,
} from "@framework/graphql/graphql";
import { UPDATE_ROLE_STATUS } from "@framework/graphql/mutations/role";
import { toast } from "react-toastify";
import { ColArrType, PaginationParams } from "src/types/role";
import { SHOW_PAGE_COUNT_ARR } from "@config/constant";
import ReactPaginate from "react-paginate";
import AddEditRole from "./AddEditRole";
import ChangeStatus from "@views/role/ChangeStatus";
import {
  GetDefaultIcon,
  GetAscIcon,
  GetDescIcon,
} from "@components/icons/index";
import { Edit, MenuBurger, PlusCircle } from "@components/icons";
const Role = () => {
  const { data, refetch } = useQuery(FETCH_ROLES_DATA);
  const [roleData, setRoleData] = useState({} as RoleData);
  const [isRoleModelShow, setIsRoleModelShow] = useState<boolean>(false);
  const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
  const [roleObj, setRoleObj] = useState({} as RoleDataArr);
  const [updateRoleStatus] = useMutation(UPDATE_ROLE_STATUS);

  const [roleVal, setRoleVal] = useState<string>("");
  const [isRoleEditable, setIsRoleEditable] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<PaginationParams>({
    limit: 10,
    page: 1,
    sortBy: "",
    sortOrder: "",
    search: "",
  });

  const COL_ARR_ROLE = [
    { name: "Sr.No", sortable: false },
    { name: "Title", sortable: true, fildName: "role_name" },
    { name: "Status", sortable: true, fildName: "status" },
  ] as ColArrType[];
  /*handler for page click*/
  const pageClickHandler = (selectedItem: { selected: number }) => {
    setFilterData({ ...filterData, page: selectedItem.selected + 1 });
  };

  /*to refetch filter data*/
  useEffect(() => {
    if (filterData) {
      refetch(filterData);
    }
  }, [filterData, refetch]);

  /*storing data in local  variable*/

  useEffect(() => {
    if (data?.fetchRoles) {
      setRoleData(data?.fetchRoles.data);
    }
  }, [data?.fetchRoles]);

  /*to show model for edit*/
  const editRole = (obj: RoleDataArr) => {
    setRoleObj(obj);
    setIsRoleModelShow(true);
    setRoleVal(obj.role_name);
    setIsRoleEditable(true);
  };
  /*to close model*/
  const onClose = useCallback(() => {
    setIsRoleModelShow(false);
    setIsStatusModelShow(false);
  }, []);
  /*submit handler for Role*/
  const onSubmitRole = useCallback(() => {
    setIsRoleModelShow(false);
    refetch(filterData);
  }, [filterData, refetch]);

  /*model for add & edit role*/
  const createNewRole = () => {
    setIsRoleModelShow(true);
    setIsRoleEditable(false);
    setRoleVal("");
  };
  /*model for status model*/
  const onChangeRoleStatus = (data: RoleDataArr) => {
    setIsStatusModelShow(true);
    setRoleObj(data);
  };

  /*function for change status*/
  const changeRoleStatus = useCallback(() => {
    updateRoleStatus({
      variables: {
        updateStatusRoleId: roleObj?.id,
        status: roleObj.status === 1 ? 0 : 1,
      },
    })
      .then((res) => {
        const data = res.data as UpdateRoleStatusType;
        if (data.updateStatusRole.meta.statusCode === 200) {
          toast.success(data.updateStatusRole.meta.message);
          setIsStatusModelShow(false);
          refetch(filterData);
        }
      })
      .catch(() => {
        toast.error("Failed to update");
      });
  }, [filterData, refetch, roleObj?.id, roleObj.status, updateRoleStatus]);

  /*to search data*/

  const onSearchRole = (e: string) => {
    setFilterData({ ...filterData, search: e });
  };

  /*to sort data*/

  const sortDataHandler = (sortFieldName: string) => {
    setFilterData({
      ...filterData,
      sortBy: sortFieldName,
      sortOrder: filterData.sortOrder === "asc" ? "desc" : "asc",
    });
  };
  /*for drop down select role*/
  const pageDropDownSelect = (e: string) => {
    setFilterData({ ...filterData, limit: parseInt(e) });
  };

  return (
    <div className="w-full">
      <div className="bg-gray-200 p-1 flex items-center justify-between">
        <h6>
          <div className="flex items-start mx-1">
            <MenuBurger className="mx-2 my-2" />
            <span>Role List</span>
          </div>
        </h6>
        <button
          className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          onClick={createNewRole}
        >
          <PlusCircle className="mr-1" />
          <span>Add New</span>
        </button>
      </div>
      <div className="p-3 ">
        <div className="max-w-screen-2xl px-4 md:px-8 mx-auto ">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="flex items-center justify-between pb-2">
              <div className="flex">
                <span className="my-2">Show</span>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900
                   text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
                   block p-2.5 dark:bg-gray-700 dark:border-gray-600
                   dark:placeholder-gray-400 dark:text-white
                   dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => pageDropDownSelect(e.target.value)}
                >
                  {SHOW_PAGE_COUNT_ARR?.map((item: number, index: number) => {
                    return <option key={item}>{item}</option>;
                  })}
                </select>
                <span className="my-2">Entries</span>
              </div>
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="table-search"
                  value={filterData.search}
                  className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search..."
                  onChange={(e) => onSearchRole(e.target.value)}
                />
              </div>
            </div>
            <div className=" max-w-[calc(100vw-29px)] md:max-w-[calc(100vw-230px)] overflow-auto">
              <table>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {COL_ARR_ROLE?.map((roleVal: ColArrType, index: number) => {
                      return (
                        <th
                          scope="col"
                          className="border border-slate-500"
                          key={`${index + 1}`}
                        >
                          <div className="flex items-center">
                            {roleVal.name}
                            {roleVal.sortable && (
                              <p
                                onClick={() =>
                                  sortDataHandler(roleVal.fildName)
                                }
                              >
                                {(filterData.sortOrder === "" ||
                                  filterData.sortBy !== roleVal.fildName) && (
                                  <GetDefaultIcon />
                                )}
                                {filterData.sortOrder === "asc" &&
                                  filterData.sortBy === roleVal.fildName && (
                                    <GetAscIcon />
                                  )}
                                {filterData.sortOrder === "desc" &&
                                  filterData.sortBy === roleVal.fildName && (
                                    <GetDescIcon />
                                  )}
                              </p>
                            )}
                          </div>
                        </th>
                      );
                    })}

                    <th scope="col" className="border border-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.fetchRoles.data?.Roledata?.map(
                    (data: RoleDataArr, index: number) => {
                      return (
                        <tr key={data.id}>
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900
                          whitespace-nowrap dark:text-white border
                          border-slate-500"
                          >
                            {index + 1}
                          </th>
                          <td className="px-6 py-4 border border-slate-500">
                            {data.role_name}
                          </td>
                          <td className="px-6 py-4 border border-slate-500">
                            {data.status === 1 ? (
                              <span className="bg-green-400 text-white p-1 rounded-md">
                                Active
                              </span>
                            ) : (
                              <span className="bg-red-500 text-white p-1 rounded-md">
                                InActive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4  border border-slate-500 ">
                            <div className="flex">
                              <div className="mx-2">
                                <span
                                  onClick={() => onChangeRoleStatus(data)}
                                  className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                >
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      value={data.status}
                                      className="sr-only peer"
                                      checked={data.status === 1}
                                      onClick={() => onChangeRoleStatus(data)}
                                    />
                                    <div
                                      className={
                                        "w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"
                                      }
                                    ></div>
                                  </label>
                                </span>
                              </div>

                              <div
                                className="mx-2"
                                onClick={() => editRole(data)}
                              >
                                <Edit className="text-red-500" />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end mt-8">
              <span>Total {roleData?.count} records </span>
              <ReactPaginate
                containerClassName="flex items-center"
                pageLinkClassName="btn mx-1"
                activeLinkClassName="btn btn-primary"
                previousClassName="btn btn-default mr-1"
                nextClassName="btn btn-default ml-1"
                breakLabel="..."
                nextLabel=">>"
                onPageChange={pageClickHandler}
                pageRangeDisplayed={1}
                pageCount={Math.ceil(roleData?.count / filterData.limit)}
                previousLabel="<<"
                renderOnZeroPageCount={null}
              />
            </div>
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

      {isStatusModelShow && (
        <ChangeStatus onClose={onClose} changeStatus={changeRoleStatus} />
      )}
    </div>
  );
};
export default Role;
