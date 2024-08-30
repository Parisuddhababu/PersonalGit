import ErrorHandler from "@components/ErrorHandler";
import { useToast } from "@components/Toastr/Toastr";
import APICONFIG from "@config/api.config";
import APPCONFIG from "@config/app.config";
import pagesServices from "@services/pages.services";
import {
  IonAppliedFilterChangeState,
  productSortByOptionsProps,
} from "@templates/ProductList";
import {
  IFilterAppliedState,
  IFilterOptions,
  IURLFilterApplyData,
} from "@type/Pages/ProductFilters";
import { IListMainProductProps } from "@type/Pages/productList";
import { setDynamicDefaultStyle } from "@util/common";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Action_UpdateDisplayQuickViewSKUReducer } from "src/redux/displayQuickViewSKU/displayQuickViewSKUAction";
import { setLoader } from "src/redux/loader/loaderAction";

const useProductListFilter = (props: any) => {
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [templateType, setTemplateType] = useState<string>("1");
  const [productList, setProductList] = useState<IListMainProductProps[]>([]);
  const { showError } = useToast();
  const dispatch = useDispatch();
  const[pageTitle,setPageTitle] = useState<string>("")

  // Filter State - start
  const [filter, setFilter] = useState<IFilterOptions[]>(
    props?.FilterOptions ? props?.FilterOptions : []
  );
  const [urlFilterData, setUrlFilterData] =
    useState<IURLFilterApplyData | null>(null);
  const [appliedFilter, setAppliedFilter] = useState<
    IFilterAppliedState[] | null
  >(null);
  const [sortByProd, setSortByProd] = useState<string>('created_at');
  const [isNewFilterApply, setIsNewFilterApply] = useState<boolean>(false);
  const [sortByOption] = useState<productSortByOptionsProps[]>(
    APPCONFIG.PRODUCT_SORT_BY
  );
  // Filter State - end

  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const router = useRouter();
  const { slug, query, param1, param2 } = router.query;

  useEffect(() => {
    if (page === 1 && !isNewFilterApply) {
      getLeftFilterList();
    }
    if (!isNewFilterApply || props?.commingFromOther) {
      getProductList(true);
    }
    // getProductList();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    // @ts-ignore
    dispatch(setLoader(isLoading)); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  /**
   * Apply Filter Data from generated Dynamic URL
   */

  useEffect(() => {
    getDisplaySKUQuickView()
  }, [])

  const getDisplaySKUQuickView = async () => {
    const response = await pagesServices.getPage(APICONFIG.GET_SHOW_SKU_QUICK_VIEW, {});
    if (response?.status && response?.status_code === 200) {
      const showQuickView = response?.data?.is_show_quick_view;
      const showProductSku = response?.data?.is_show_sku;
      const showAddToCart = response?.data?.is_show_add_to_cart;
      const isShowProductDetails = response?.data?.is_show_product_detail ?? 1;
      Cookies.set("showQuickView", showQuickView.toString());
      Cookies.set("showProductSku", showProductSku.toString());
      Cookies.set("showAddToCart", showAddToCart.toString());
      Cookies.set("isShowProductDetails", isShowProductDetails);
      dispatch(
        // @ts-ignore
        Action_UpdateDisplayQuickViewSKUReducer({
          showQuickView: showQuickView.toString() === '1' ? true : false,
          showProductSku: showProductSku.toString() === '1' ? true : false,
          showAddToCart: showAddToCart.toString() === '1' ? true : false,
        })
      );
    }
  }
  const getApplyFilterDataFromURL = async () => {
    const url = router.asPath;
    const query = url.split("?");
    if (query && query.length >= 1) {
      await pagesServices
        .postPage(APICONFIG.SEARCH_GET_SLUG_VALUE, {
          slug: query[1],
        })
        .then((res) => {
          if (res?.data) {
            setUrlFilterData(res?.data);
            Object.keys(res?.data).forEach(function (key) {
              if (key === "SORT") {
                const index = APPCONFIG.PRODUCT_SORT_BY.findIndex(
                  (ele) => ele.urlValue === res?.data?.[key].name
                );
                if (index !== -1) {
                  setSortByProd(APPCONFIG.PRODUCT_SORT_BY[index]?.urlValue);
                }
              }
            });
          }
        })
        .catch(() => { });
    }
  };

  /**
   * Get Left Filter Data and store in state
   */
  const getLeftFilterList = async (pageChange = false) => {
    const formData = new FormData();
    if (pageChange) {
      setFilter([]);
    }
    if (props?.commingFromOther && props?.pageName !== "" && props?.pageName) {
      formData.append(props?.pageName, `${query}`);
    } else if (
      query == APPCONFIG.READY_TO_SHIP_SLUG ||
      query == APPCONFIG.MAKE_TO_ORDER_SLUG
    ) {
      formData.append(
        "product_type",
        APPCONFIG.READY_TO_SHIP_SLUG == query
          ? APPCONFIG.READY_TO_SHIP
          : APPCONFIG.MAKE_TO_ORDER
      );
    } else if (query === APPCONFIG.NEW_ARRIVAL_SLUG) {
      formData.append(
        "product_tag_code",
        APPCONFIG.filterModuleName.newArrival
      );
    } else {
      if (param2) {
        formData.append("sub_category", `${slug}/${query}/${param1}/${param2}`);
      } else if (param1) {
        formData.append("category", `${slug}/${query}/${param1}`);
      } else {
        formData.append("category_type", `${slug}/${query}`);
      }
    }
    await pagesServices.postPage(APICONFIG.GET_LEFT_FILTER_LIST, formData).then(
      (result) => {
        if (result?.data && result?.data) {
          const data = result?.data;

          if (
            param2 &&
            data?.category_sub_filter &&
            data?.category_sub_filter?.length > 0
          ) {
            setFilter(data?.category_sub_filter[0]?.category_filter);
          }
          if (param1 && data?.category_filter?.length > 0) {
            setFilter(data?.category_filter[0].category_filter);
          } else if (query && data?.category_type_filter?.length > 0) {
            setFilter(data?.category_type_filter[0].category_filter);
          } else if (
            props?.pageName === APPCONFIG.PRODUCT_LIST_WITH_FILTER.collection
          ) {
            // if call from collection page
            setFilter(data?.collection_filter?.collection_filter);
          } else if (
            props?.pageName === APPCONFIG.PRODUCT_LIST_WITH_FILTER.catalogue
          ) {
            // if call from catalogue page
            setFilter(data?.catalogue_filter?.catalogue_filter);
          }
        }
      },
      () => {
        setIsLoading(false);
      }
    );
    getApplyFilterDataFromURL();
  };

  /**
   * Applied Filter response from Filter Component.
   * @param data
   */
  const onAppliedFilterChange = (
    data: IonAppliedFilterChangeState[],
    url: string
  ) => {
    const apiFormatData = data;
    const temp: any = [];
    apiFormatData?.map((ele) => {
      if (ele.module_name === APPCONFIG.filterModuleName.priceRange) {
        temp.push({
          module_name: "price_min",
          // @ts-ignore
          ids: [ele?.ids?.[0]?.min],
        });
        temp.push({
          module_name: "price_max",
          // @ts-ignore
          ids: [ele.ids?.[0]?.max],
        });
      } else {
        temp.push({
          module_name: ele.module_name?.toLowerCase(),
          ids: ele.ids,
          category_type_id: ele?.category_type_id,
          category_id: ele.category_id,
        });
      }
    });
    setAppliedFilter(temp);
    if (temp?.length <= 0 || url === "?") {
      setTimeout(() => {
        router.replace(router.asPath.slice(0, router.asPath.indexOf("?")));
      }, 100);
      return;
    }
    if (url !== "?" && url !== "") {
      let finalURL = router.asPath.slice(0, router.asPath.indexOf("?")) + url;
      let newURL = finalURL;
      if (sortByProd) {
        const sortIndex = APPCONFIG.PRODUCT_SORT_BY.findIndex(
          (psb) => psb.name === sortByProd
        );
        if (sortIndex !== -1) {
          newURL =
            finalURL +
            APPCONFIG.SEARCH_URL_TYPE.SORT +
            APPCONFIG.PRODUCT_SORT_BY?.[sortIndex]?.urlValue +
            "-" +
            APPCONFIG.PRODUCT_SORT_BY?.[sortIndex]?.sortby;
        }
      }
      router.replace(newURL);
    }

    // if (url === "?" || url === "") {
    //   router.replace(router.asPath.slice(0, router.asPath.indexOf("?")));
    // }
    // New filter value then need to make true for starting page value as 0
    setIsNewFilterApply(true);
  };

  /**
   * Filter value change then Product list api
   */
  useEffect(() => {
    if ((appliedFilter && appliedFilter?.length !== 0) || sortByProd) {
      getProductList();
    }
    // eslint-disable-next-line
  }, [appliedFilter, sortByProd]);

  /**
   * Get Product List
   */
  const getProductList = async (scrollIntoView = false) => {
    let formData = new FormData();
    let pageValue = (page - 1) * parseInt(props?.ListLimit || APPCONFIG.PRODUCT_LIST_PAGE_LIMIT);
    // If New filter apply then need to set page value 0 as starting
    if (isNewFilterApply && !props?.commingFromOther) {
      pageValue = 0;
      setPage(1);
    }
    formData.append("page_offset", pageValue.toString());
    formData.append("page_limit", props?.ListLimit || APPCONFIG.PRODUCT_LIST_PAGE_LIMIT);
    if (
      query == APPCONFIG.READY_TO_SHIP_SLUG ||
      query == APPCONFIG.MAKE_TO_ORDER_SLUG
    ) {
      formData.append(
        "product_type",
        APPCONFIG.READY_TO_SHIP_SLUG == query
          ? APPCONFIG.READY_TO_SHIP
          : APPCONFIG.MAKE_TO_ORDER
      );
    } else if (query === APPCONFIG.NEW_ARRIVAL_SLUG) {
      formData.append(
        "product_tag_code",
        APPCONFIG.filterModuleName.newArrival
      );
    } else if (
      props?.commingFromOther &&
      props?.pageName !== "" &&
      props?.pageName
    ) {
      // Collection page filter
      formData.append(props?.pageName, `${query}`);
    } else {
      if (query) formData.append("category_type", `${slug}/${query}`);
      if (param1) formData.append("category", `${slug}/${query}/${param1}`);
      if (param2)
        formData.append("sub_category", `${slug}/${query}/${param1}/${param2}`);
    }

    // Applied Filter request parameters create
    if (appliedFilter && appliedFilter.length > 0) {
      appliedFilter.map((ele) => {
        //   Price Request parameters
        if (
          ele.module_name === "price_min" ||
          ele.module_name === "price_max"
        ) {
          formData.append(ele.module_name, ele.ids.toString());
        } else if (
          APPCONFIG.filterModuleName.category?.toLowerCase() === ele.module_name
        ) {
          //  Category Type Data create
          const tempCategoryTypeIds = ele.category_type_id?.filter(function (
            item,
            pos
          ) {
            return ele.category_type_id?.indexOf(item) == pos;
          });
          if (tempCategoryTypeIds) {
            tempCategoryTypeIds.map((CTI, ctiInd) => {
              if (CTI) {
                formData.append("category_type_id[" + ctiInd + "]", CTI);
              }
            });
          }
          //   Category Data Create
          for (let catInd = 0; catInd < ele.ids.length; catInd++) {
            formData.append("category_id[" + catInd + "]", ele.ids[catInd]);
          }
        } else if (
          APPCONFIG.filterModuleName.subCategory.toLocaleLowerCase() ===
          ele.module_name
        ) {
          for (let subInd = 0; subInd < ele.ids.length; subInd++) {
            formData.append("sub_category_id[" + subInd + "]", ele.ids[subInd]);
          }
        } else if (
          APPCONFIG.filterModuleName.newArrival.toLocaleLowerCase() ===
          ele.module_name
        ) {
          formData.append(
            "product_tag_code",
            APPCONFIG.filterModuleName.newArrival
          );
        } else {
          for (let ind = 0; ind < ele.ids.length; ind++) {
            formData.append(ele.module_name + "[" + ind + "]", ele.ids[ind]);
          }
        }
      });
    }
    if (sortByProd) {
      const sortIndex = APPCONFIG.PRODUCT_SORT_BY.findIndex(
        (psb) => psb.urlValue === sortByProd
      );
      let url = APPCONFIG.PRODUCT_SORT_BY?.[sortIndex]?.urlValue;
      if (url === "low_to_high" || url === "high_to_low") {
        url = "total_price";
      }
      if (sortIndex !== -1) {
        formData.append("sort_param", url);
        formData.append(
          "sort_type",
          APPCONFIG.PRODUCT_SORT_BY?.[sortIndex]?.sortby
        );
      }
      if(sortIndex === 4){
        formData.append("product_tag_code", APPCONFIG.filterModuleName.featured);
      }
    }
    setIsLoading(true);
    await pagesServices.postPage(APICONFIG.PRODUCT_LIST, formData).then(
      (result) => {
        setPageTitle(result?.meta?.title)
        setIsLoading(false);
        setDynamicDefaultStyle(result?.default_style, result?.theme);
        if (result?.data && result?.data?.data) {
          setTemplateType(result?.data?.type);
          setTotalRecords(result?.data?.totalRecords);
          if (appliedFilter && appliedFilter.length > 0 && !isFetching) {
            // setProductList([...result?.data?.data]);
            setProductList(result?.data?.data);
            setIsNewFilterApply(false);
          } else {
            if (isNewFilterApply) {
              // setProductList([...result?.data?.data]);
              setProductList(result?.data?.data);
            } else {
              // setProductList([...productList, ...result?.data?.data]);
              setProductList(result?.data?.data);
            }
            setIsNewFilterApply(false);
          }
          setIsFetching(false);
        } else {
          if (appliedFilter && appliedFilter.length > 0) {
            if (result?.data?.data?.length > 0) {
              // setProductList([...result?.data?.data]);
              setProductList(result?.data?.data);
            } else {
              setProductList([]);
              setTotalRecords(0);
            }
          }
          // if (isNewFilterApply) {
          //   if (productListRef) {
          //     window.scrollTo({
          //       top: productListRef.current.offsetTop,
          //       left: 0,
          //       behavior: "smooth",
          //     });
          //   }
          // }
          setIsNewFilterApply(false);
        }
        const scrollNode = document.getElementById("main-product-list");
        if (scrollNode && scrollIntoView) {
          setTimeout(() => {
            scrollNode.scrollIntoView({
              behavior: "smooth",
            });
          }, 200);
        }
      },
      (error) => {
        setIsLoading(false);
        setIsNewFilterApply(false);
        ErrorHandler(error, showError);
      }
    );
  };

  /**
   * Sort Dropdown Value Change
   * @param e
   */
  const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let value = e.target.value;
    if (value === "low_to_high" || value === "high_to_low") {
      value = "total_price";
    }
    generateURL(value, sortByProd || "");
    setIsNewFilterApply(true);
    setSortByProd(e.target.value);
  };

  /**
   * Generate As predefine URL Based on Selected Filters
   * @param value string
   * @param oldName string
   */
  const generateURL = (value: string, oldName: string) => {
    let url = router.asPath;
    const sortByInd = APPCONFIG.PRODUCT_SORT_BY.findIndex(
      (ele) => ele.name === value
    );
    const sortByIndOld = APPCONFIG.PRODUCT_SORT_BY.findIndex(
      (ele) => ele.name === oldName
    );
    let tempURL = url.replace(
      APPCONFIG.SEARCH_URL_TYPE.SORT +
      APPCONFIG.PRODUCT_SORT_BY[sortByIndOld]?.urlValue +
      "-" +
      APPCONFIG.PRODUCT_SORT_BY[sortByIndOld]?.sortby,
      ""
    );
    tempURL = url.replace(
      "SORT++" +
      APPCONFIG.PRODUCT_SORT_BY[sortByIndOld]?.urlValue +
      "-" +
      APPCONFIG.PRODUCT_SORT_BY[sortByIndOld]?.sortby,
      ""
    );

    if (sortByInd !== -1) {
      url = `${tempURL}${tempURL.indexOf("?") > -1 ? "" : "?"}${APPCONFIG.SEARCH_URL_TYPE.SORT
        }${APPCONFIG.PRODUCT_SORT_BY[sortByInd].urlValue}-${APPCONFIG.PRODUCT_SORT_BY[sortByInd].sortby
        }`;
    }
    let mainTempURl = url.replace("?--", "?");
    let finalURl = mainTempURl.replace("??", "?");
    router.replace(finalURl);
  };

  return {
    isLoading,
    filter,
    urlFilterData,
    sortByOption,
    totalRecords,
    productList,
    sortByProd,
    page,
    templateType,
    onAppliedFilterChange,
    onSortChange,
    setPage,
    setIsNewFilterApply,
    getProductList,
    getLeftFilterList,
    pageTitle
  };
};

export default useProductListFilter;
