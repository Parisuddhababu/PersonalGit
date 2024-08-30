import { useState } from "react";
import APPCONFIG from "@config/app.config";
import pagesServices from "@services/pages.services";
import { API_SECTION_NAME } from "@config/apiSectionName";
import { useDispatch } from "react-redux";
import { setLoader } from "src/redux/loader/loaderAction";


const useLoadMoreHook = () => {
  const [loadedMoreData, setLoadedMoreData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState<boolean>(true);
  const dispatch = useDispatch()

  const checkForLoadMoreButtonAtInitialLoad = (drawCount: number) => {
    if (drawCount === 0) {
      setShowLoadMoreButton(false);
    }
  };

  const loadMoreData = (
    postPageAPI: string,
    apiSectionName: string,
    formData: any,
    apiMethod: string
  ) => {
    // @ts-ignore
    pagesServices?.[apiMethod](postPageAPI, formData)
      .then((result: any) => {
        if (result?.data) {
          // @ts-ignore
          dispatch(setLoader(false))
          if (apiSectionName === API_SECTION_NAME.collection_list ) {
            setLoadedMoreData([
              ...result?.data?.[apiSectionName]?.original?.data,
            ]);
            setCurrentPage(
              result?.data?.[apiSectionName]?.original?.currentPage
            );
            checkIfShowOrNot(result?.data?.[apiSectionName]?.original);
          }else if(apiSectionName === API_SECTION_NAME.recently_view_list ){
            setLoadedMoreData([...result?.data?.original?.data]);
            setCurrentPage(result?.data?.original?.currentPage);
            checkIfShowOrNot(result?.data?.original);
          } 
          else {
            setLoadedMoreData([...result?.data?.[apiSectionName]?.data]);
            setCurrentPage(result?.data?.[apiSectionName]?.currentPage);
            checkIfShowOrNot(result?.data?.[apiSectionName]);
          }
        }
      })
      .catch((err: any) => err);
  };

  const checkIfShowOrNot = (data: any) => {
    if (data?.currentPage * APPCONFIG.ANY_LIST_LENGTH >= data?.recordsTotal)
      setShowLoadMoreButton(false);
  };

  const loadMoreFunc = async (
    postPageAPI: string,
    apiSectionName: string,
    formData: any,
    apiMethod: string = "postPage"
  ): Promise<void> => {
    // @ts-ignore
    dispatch(setLoader(true));
    loadMoreData(postPageAPI, apiSectionName, formData, apiMethod);
  };
  return {
    loadedMoreData,
    currentPage,
    showLoadMoreButton,
    loadMoreFunc,
    setCurrentPage,
    setShowLoadMoreButton,
    checkForLoadMoreButtonAtInitialLoad,
  };
};

export default useLoadMoreHook;
