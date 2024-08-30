import React, { useCallback, useEffect, useState } from "react";
import { FETCH_CATEGORIES } from "@framework/graphql/queries/category";
import { useMutation, useQuery } from "@apollo/client";
import {
  CategoryDataArr,
  UpdateCategoryStatusType,
  categoryData,
  categoryDataArr,
} from "@framework/graphql/graphql";
import { ColArrType, PaginationParams } from "src/types/category";
import GetDefaultIcon from "@components/common/getDefaultIcon";
import GetAscIcon from "@components/common/getAscIcon";
import GetDescIcon from "@components/common/getDescIcon";
import { Edit, MenuBurger, PlusCircle, Star, Trash } from "@components/icons";
import ChangeStatusModel from "./changeStatusModel";
import { ROUTES, SHOW_PAGE_COUNT_ARR } from "@config/constant";
import TextInput from "@components/input/TextInput";
import {
  CATEGORY_STATUS_UPDATE,
  DELETE_CATEGORY_ID,
} from "@framework/graphql/mutations/category";
import { toast } from "react-toastify";
import { t } from "i18next";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import DeleteModel from "./deleteCategory";

const Category = () => {
  const { data, refetch } = useQuery(FETCH_CATEGORIES);
  const [updateCategoryStatus] = useMutation(CATEGORY_STATUS_UPDATE);
  const [deleteCategoryById] = useMutation(DELETE_CATEGORY_ID);
  const [categoryData, setCategoryData] = useState({} as categoryData); //all category data
  const [categoryObj, setCategoryObj] = useState({} as categoryDataArr);
  const [searchTerm, setSearchTerm] = useState(""); //for search term
  const [isDeleteCategory, setIsDeleteCategory] = useState(false); //to show model for delete
  const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false); //To show model for status change

  const navigate = useNavigate();
  //filter data
  const [filterData, setFilterData] = useState<PaginationParams>({
    limit: 10,
    page: 1,
    search: "",
    sortBy: "",
    sortOrder: "",
  });
  //col data
  const COL_ARR = [
    { name: "Sr.No", sortable: false },
    { name: "CategoryName", sortable: true, feildName: "category_name" },
    { name: "Parent Category", sortable: true, feildName: "parent_category" },
    { name: "Status", sortable: true, feildName: "status" },
    { name: "Action", sortable: false, feildName: "created_by" },
  ] as ColArrType[];

  /* handler to store sort data*/
  const categorySortHandler = (sortFieldName: string) => {
    setFilterData({
      ...filterData,
      sortBy: sortFieldName,
      sortOrder: filterData.sortOrder === "asc" ? "desc" : "asc",
    });
  };

  /* Handler for page click*/
  const pageClickHandler = useCallback(
    (event: number) => {
      setFilterData({ ...filterData, page: event + 1 });
    },
    [filterData]
  );

  /* dropdown for page limit*/
  const dropdownSelectHandler = (e: string) => {
    setFilterData({ ...filterData, limit: parseInt(e) });
  };

  /* Used for setcategory data from res in local variable*/
  useEffect(() => {
    if (data?.fetchCategory) {
      setCategoryData(data?.fetchCategory?.data);
    }
  }, [data?.fetchCategory]);

  //refetch filter data

  useEffect(() => {
    if (filterData) {
      refetch(filterData);
    }
  }, [filterData, refetch]);

  //for status updating model
  const onChangeStatus = (data: categoryDataArr) => {
    setIsStatusModelShow(true);
    setCategoryObj(data);
  };
  //model for close
  const onClose = () => {
    setIsStatusModelShow(false);
  };
  //function to change status
  const changecategoryStatus = () => {
    updateCategoryStatus({
      variables: {
        categoryStatusUpdateId: categoryObj?.id,
        status: categoryObj.status === 1 ? 0 : 1,
      },
    })
      .then((res) => {
        const data = res.data as UpdateCategoryStatusType;
        if (data.categoryStatusUpdate.meta.statusCode === 200) {
          toast.success(data.categoryStatusUpdate.meta.message);
          setIsStatusModelShow(false);
          refetch(filterData);
        }
      })
      .catch(() => {
        toast.error(t("Failed to update"));
      });
  };

  //delete category
  const onCloseDeleteModel = () => {
    setIsDeleteCategory(false);
  };
  //delete handler
  const deleteCategory = (data: CategoryDataArr) => {
    setCategoryObj(data);
    setIsDeleteCategory(true);
  };
  //function to delete data
  const deleteCategoryData = useCallback(() => {
    console.log(categoryObj);
    deleteCategoryById({
      variables: {
        deleteCategoryId: categoryObj.id,
      },
    })
      .then((res) => {
        const data = res.data;
        if (data.deleteCategory.meta.statusCode === 200) {
          toast.success(data.deleteCategory.meta.message);
          setIsDeleteCategory(false);
        } else if (data.deleteCategory.meta.status === "ERROR") {
          toast.error(data.deleteCategory.meta.message);
          refetch(filterData).catch((e) => toast.error(e));
          setIsDeleteCategory(false);
        }
      })
      .catch(() => {
        toast.error(data.deleteCategory.meta.message);
      });
  }, [
    categoryObj,
    data?.deleteCategory?.meta.message,
    deleteCategoryById,
    filterData,
    refetch,
  ]);

  return (
    <div className=' w-full '>
      <h6 className='page-title mb-5 px-6 py-2 text-red-600'>Category</h6>
      <div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto m-5'>
        <div>
          <div className='bg-gray-200 p-3 flex items-center justify-between'>
            <h6>
              <MenuBurger className='inline-block mr-1' /> Category List
            </h6>
            <button
              className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'
              onClick={() =>
                navigate(`/${ROUTES.app}/${ROUTES.category}/addTreeView`)
              }
            >
              <Star className='mr-1' />
              <span>Category TreeView</span>
            </button>
            <button
              className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center'
              onClick={() => navigate(`/${ROUTES.app}/${ROUTES.category}/add`)}
            >
              <PlusCircle className='mr-1' />
              <span>Add New</span>
            </button>
          </div>
          <div className='mx-8 my-4'>
            <div className='mb-2'>
              select Entries
              <select
                className='bg-gray-50 border border-gray-300 text-gray-900
                   text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
                   block p-2.5 dark:bg-gray-700 dark:border-gray-600
                   dark:placeholder-gray-400 dark:text-white
                   dark:focus:ring-blue-500 dark:focus:border-blue-500'
                onChange={(e) => dropdownSelectHandler(e.target.value)}
              >
                {SHOW_PAGE_COUNT_ARR?.map((item: number) => {
                  return <option key={item}>{item}</option>;
                })}
              </select>
            </div>
            <div className='w-40'>
              <TextInput
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search Users'
              />
            </div>
          </div>
          <div className='mx-8 my-4'>
            {/* table */}
            <div className=' max-w-[calc(100vw-29px)] md:max-w-[calc(100vw-230px)] overflow-auto'>
              <table>
                <thead>
                  <tr>
                    {COL_ARR?.map((colVal: ColArrType) => {
                      return (
                        <th
                          scope='col'
                          key={colVal.feildName}
                          className='border border-slate-500'
                        >
                          <div className='flex items-center'>
                            {colVal.name}
                            {colVal.sortable && (
                              <p
                                onClick={() =>
                                  categorySortHandler(colVal.feildName)
                                }
                              >
                                {(filterData.sortOrder === "" ||
                                  filterData.sortBy !== colVal.feildName) &&
                                  GetDefaultIcon()}
                                {filterData.sortOrder === "asc" &&
                                  filterData.sortBy === colVal.feildName &&
                                  GetAscIcon()}
                                {filterData.sortOrder === "desc" &&
                                  filterData.sortBy === colVal.feildName &&
                                  GetDescIcon()}
                              </p>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data?.fetchCategory?.data?.Categorydata?.filter(
                    (i: categoryDataArr) =>
                      i.category_name.toLowerCase().includes(searchTerm)
                  ).map((data: categoryDataArr, index: number) => {
                    return (
                      <tr key={`${index + 1}`}>
                        <th
                          scope='row'
                          className='px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-slate-500 '
                        >
                          {index + 1}
                        </th>
                        <td className='px-4 py-4 border border-slate-500 '>
                          {data.category_name}
                        </td>
                        <td className='px-4 py-4 border border-slate-500 '>
                          {data?.parentData?.category_name}
                        </td>
                        <td className='px-4 py-4 border border-slate-500 text-center'>
                          {data.status === 1 ? (
                            <span className='bg-green-800 text-white p-1 rounded-md'>
                              Active{" "}
                            </span>
                          ) : (
                            <span className='bg-red-500 text-white p-1 rounded-md'>
                              InActive
                            </span>
                          )}
                        </td>
                        <td className='px-4 py-4 border border-slate-500 flex flex-row justify-center'>
                          <div className='mx-2'>
                            <span
                              onClick={() => onChangeStatus(data)}
                              className='font-medium text-red-600 dark:text-red-500 hover:underline'
                            >
                              <label className='relative inline-flex items-center cursor-pointer'>
                                <input
                                  type='checkbox'
                                  value={data.status}
                                  className='sr-only peer'
                                  checked={data.status === 1}
                                  onChange={() => onChangeStatus(data)}
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
                            className='mx-2'
                            onClick={() =>
                              navigate(
                                `/${ROUTES.app}/${ROUTES.category}/edit/${data.id}`
                              )
                            }
                          >
                            <Edit className='text-red-500' />
                          </div>

                          <div
                            className='mx-2'
                            onClick={() => {
                              deleteCategory(data);
                            }}
                          >
                            <Trash className='text-red-500' />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className='flex items-center justify-between mt-8'>
              <span className='text-slate-400'>
                Total {categoryData?.count} Records
              </span>
              <ReactPaginate
                containerClassName='flex items-center'
                pageLinkClassName='btn mx-1'
                activeLinkClassName='btn btn-primary'
                previousClassName='btn btn-default mr-1'
                nextClassName='btn btn-default ml-1'
                breakLabel='...'
                nextLabel='>>'
                onPageChange={(e) => pageClickHandler(e.selected)}
                pageRangeDisplayed={1}
                pageCount={Math.ceil(categoryData?.count / filterData.limit)}
                previousLabel='<<'
                renderOnZeroPageCount={null}
              />
            </div>
          </div>
          {/* changing status model */}
          {isStatusModelShow && (
            <ChangeStatusModel
              onClose={onClose}
              changeCategoryStatus={changecategoryStatus}
            />
          )}
          {isDeleteCategory && (
            <DeleteModel
              onClose={onCloseDeleteModel}
              deleteCategoryData={deleteCategoryData}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Category;

// REACT_APP_API_GATEWAY_URL=https://basenodeapi.demo.brainvire.dev/gql
