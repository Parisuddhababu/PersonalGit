import { useMutation, useQuery } from "@apollo/client";
import {
  Document,
  Edit,
  GetAscIcon,
  GetDefaultIcon,
  GetDescIcon,
  PlusCircle,
  Trash,
} from "@components/icons";
import { SHOW_PAGE_COUNT_ARR } from "@config/constant";
import { GET_BANNER_DETAILS } from "@framework/graphql/queries/banner";
import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  BannerDataType,
  ColArrType,
  FilterDataProps,
  PaginationParams,
} from "src/types/banner";
import ChangeStatus from "./changeStatus";
import {
  CHANGE_BANNER_STATUS,
  DELETE_BANNER,
} from "@framework/graphql/mutations/banner";
import { toast } from "react-toastify";
import AddEditBanner from "./addEditBanner";
import DeleteBannerModel from "./deleteModel";
import FilterBannerData from "./filterData";

const Banner = () => {
  const { data, refetch } = useQuery(GET_BANNER_DETAILS);
  const [changeBannerStatus] = useMutation(CHANGE_BANNER_STATUS);
  const [deleteBanner] = useMutation(DELETE_BANNER);
  const [isChangeStatusModelShow, setStatusModelShow] =
    useState<boolean>(false);
  const [bannerObj, setBannerObj] = useState({} as BannerDataType);
  const [isShowAddEditForm, setShowAddEditForm] = useState<boolean>(false);
  const [isBannerEditable, setBannerEditable] = useState<boolean>(false);
  const [isDeleteModelShow, setDeleteModelShow] = useState<boolean>(false);

  const COL_ARR_banner = [
    { name: "Sr.No", sortable: false },
    { name: "Thumb", sortable: false, fildName: "banner_image " },
    { name: "Banner Title", sortable: true, fildName: "banner_title" },
    { name: "Created by", sortable: true, fildName: "created_by" },
    { name: "Created_at", sortable: true, fildName: " created_at" },
    { name: "Status", sortable: true, fildName: "status" },
  ] as ColArrType[];
  /*filter data values*/
  const [filterData, setFilterData] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    bannerTitle: "",
    createdBy: "",
    status: null,
    sortBy: "",
    sortOrder: "",
  });

  useEffect(() => {
    if (filterData) {
      refetch(filterData);
    }
  }, [filterData, refetch]);
  /*to sort the data asc or desc*/
  const sortHandler = (sortValue: string) => {
    setFilterData({
      ...filterData,
      sortBy: sortValue,
      sortOrder: filterData.sortOrder === "asc" ? "desc" : "asc",
    });
  };
  /*select drop down handler*/
  const dropdownHandler = (e: string) => {
    setFilterData({ ...filterData, limit: parseInt(e) });
  };
  /*handler for pagination*/
  const pageClickHandler = (selectedItem: { selected: number }) => {
    setFilterData({ ...filterData, page: selectedItem.selected + 1 });
  };
  /*to close model*/
  const onCloseHandler = () => {
    setStatusModelShow(false);
    setDeleteModelShow(false);
  };
  /*to show model & get id*/
  const onChangeBannerStatus = (data: BannerDataType) => {
    setStatusModelShow(true);
    setBannerObj(data);
  };
  const changeStatusHandler = useCallback(() => {
    changeBannerStatus({
      variables: {
        updateBannerStatusId: bannerObj?.id,
        status: +(bannerObj?.status === 1 ? 0 : 1),
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.updateBannerStatus.meta.statusCode === 200) {
          toast.success(data.updateBannerStatus.meta.message);
          setStatusModelShow(false);
          refetch(filterData);
        }
      })
      .catch((error) => {
        toast.error("failed to update banner status");
      });
  }, [
    filterData,
    refetch,
    bannerObj?.id,
    bannerObj.status,
    changeBannerStatus,
  ]);
  /*add new handler*/

  const addNewHandler = () => {
    setShowAddEditForm(true);
    setBannerEditable(false);
  };

  /*edit banner*/
  const editBanner = (data: BannerDataType) => {
    setBannerObj(data);
    setShowAddEditForm(true);
    setBannerEditable(true);
  };
  /*submit handler*/
  const onSubmitBanner = useCallback(() => {
    setShowAddEditForm(false);
  }, []);
  /*onClose*/
  const onClose = useCallback(() => {
    setShowAddEditForm(false);
    refetch(filterData);
  }, [refetch, filterData]);
  /*delete banner*/
  const onBannerDeleteHandler = () => {
    deleteBanner({
      variables: {
        deleteBannerId: bannerObj.id,
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.deleteBanner.meta.statusCode === 200) {
          toast.success(data.deleteBanner.meta.message);
          setDeleteModelShow(false);
          refetch(filterData);
        }
      })
      .catch((error) => {
        toast.error("failed to delete banner data");
      });
  };
  const deleteBannerHandler = (data: BannerDataType) => {
    setDeleteModelShow(true);
    setBannerObj(data);
  };
  /*filter banner data on search*/
  const bannerSearchHandler = useCallback(
    (value: FilterDataProps) => {
      setFilterData({
        ...filterData,
        bannerTitle: value.bannerTitle,
        createdBy: value.createdBy,
        status: +value.status,
      });
    },
    [filterData]
  );

  return (
    <div className=' w-full '>
      <h6 className='page-title mb-5 p-3'>Banner Management</h6>
      <div className='p-3'>
        <FilterBannerData filterBanner={bannerSearchHandler} />
      </div>
      <div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto m-5'>
        <div className='bg-gray-200 p-3 flex items-center justify-between'>
          <h6>
            <Document className='inline-block mr-1' /> banner List
          </h6>
          <div>
            <button onClick={addNewHandler} className='btn btn-primary'>
              <PlusCircle className='mr-1' />
              AddNew
            </button>
          </div>
        </div>
        <div className='p-3'>
          <div className='flex items-center justify-start mb-3 overflow-x-auto'>
            select
            <select
              className='bg-gray-50 border border-gray-300 text-gray-900
                   text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
                   block p-2.5 dark:bg-gray-700 dark:border-gray-600
                   dark:placeholder-gray-400 dark:text-white
                   dark:focus:ring-blue-500 dark:focus:border-blue-500'
              onChange={(e) => dropdownHandler(e.target.value)}>
              {SHOW_PAGE_COUNT_ARR?.map((item: number) => {
                return <option key={item}>{item}</option>;
              })}
            </select>
            Entries
          </div>
        </div>
        <div className=' max-w-[calc(100vw-29px)] md:max-w-[calc(100vw-230px)] overflow-auto p-2'>
          <table>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                {COL_ARR_banner?.map(
                  (bannerValues: ColArrType, index: number) => {
                    return (
                      <th
                        scope='col'
                        className='border border-slate-500'
                        key={`${index + 1}`}>
                        <div className='flex items-center'>
                          {bannerValues.name}
                          {bannerValues.sortable && (
                            <p
                              onClick={() =>
                                sortHandler(bannerValues.fildName)
                              }>
                              {(filterData.sortOrder === "" ||
                                filterData.sortBy !==
                                  bannerValues.fildName) && <GetDefaultIcon />}
                              {filterData.sortOrder === "asc" &&
                                filterData.sortBy === bannerValues.fildName && (
                                  <GetAscIcon />
                                )}
                              {filterData.sortOrder === "desc" &&
                                filterData.sortBy === bannerValues.fildName && (
                                  <GetDescIcon />
                                )}
                            </p>
                          )}
                        </div>
                      </th>
                    );
                  }
                )}
                <th scope='col' className='border border-slate-500'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.fetchBanner?.data?.BannerData?.map(
                (data: BannerDataType, index: number) => {
                  return (
                    <tr key={data.id}>
                      <th
                        scope='row'
                        className='px-6 py-4 font-medium text-gray-900
                          whitespace-nowrap dark:text-white border
                          border-slate-500'>
                        {index + 1}
                      </th>
                      <td className='px-6 py-4 border border-slate-500'>
                        <img
                          src={data.banner_image}
                          alt='banner_image'
                          style={{ height: 80, width: 100 }}
                        />
                      </td>
                      <td className='px-6 py-4 border border-slate-500'>
                        {data?.banner_title}
                      </td>
                      <td className='px-6 py-4 border border-slate-500'>
                        {data.User.first_name}
                      </td>
                      <td className='px-6 py-4 border border-slate-500'>
                        {`${data?.created_at?.slice(0, 10)}`}
                      </td>
                      <td className='px-6 py-4 border border-slate-500'>
                        {data.status === 1 ? (
                          <span className='bg-green-500 text-white p-1 rounded-md'>
                            Active
                          </span>
                        ) : (
                          <span className='bg-red-500 text-white p-1 rounded-md'>
                            InActive
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4  border border-slate-500 '>
                        <div className='flex'>
                          <div className='mx-2'>
                            <span
                              onClick={() => onChangeBannerStatus(data)}
                              className='font-medium text-red-600 dark:text-red-500 hover:underline'>
                              <label className='relative inline-flex items-center cursor-pointer'>
                                <input
                                  type='checkbox'
                                  value={data.status}
                                  className='sr-only peer'
                                  checked={data.status === 1}
                                  onClick={() => onChangeBannerStatus(data)}
                                />
                                <div
                                  className={
                                    "w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"
                                  }></div>
                              </label>
                            </span>
                          </div>

                          <div
                            className='mx-2'
                            onClick={() => editBanner(data)}>
                            <Edit className='text-red-500' />
                          </div>
                          <div
                            className='mx-2'
                            onClick={() => deleteBannerHandler(data)}>
                            <Trash className='text-red-500' />
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
        <div className='flex items-center justify-between p-3 mt-8'>
          <span>{data?.fetchBanner?.data?.count} Total records </span>
          <ReactPaginate
            containerClassName='flex items-center'
            pageLinkClassName='btn mx-1'
            activeLinkClassName='btn btn-primary'
            previousClassName='btn btn-default mr-1'
            nextClassName='btn btn-default ml-1'
            breakLabel='...'
            nextLabel='>>'
            onPageChange={pageClickHandler}
            pageRangeDisplayed={1}
            pageCount={Math.ceil(
              data?.fetchBanner?.data?.count / filterData.limit
            )}
            previousLabel='<<'
            renderOnZeroPageCount={null}
          />
        </div>
      </div>

      {isChangeStatusModelShow && (
        <ChangeStatus
          onClose={onCloseHandler}
          changeStatus={changeStatusHandler}
        />
      )}
      {isDeleteModelShow && (
        <DeleteBannerModel
          onClose={onCloseHandler}
          deleteHandler={onBannerDeleteHandler}
        />
      )}
      {isShowAddEditForm && (
        <AddEditBanner
          isShowAddEditForm={isShowAddEditForm}
          isBannerEditable={isBannerEditable}
          onSubmitBanner={onSubmitBanner}
          onClose={onClose}
          bannerObj={bannerObj}
        />
      )}
    </div>
  );
};
export default Banner;
