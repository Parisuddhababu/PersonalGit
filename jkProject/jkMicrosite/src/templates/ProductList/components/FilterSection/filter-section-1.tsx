import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath, getUserDetails } from "@util/common";
import Head from "next/head";
import { IFilterSection1Props } from "@templates/ProductList/components/FilterSection";
import APPCONFIG from "@config/app.config";
import { useEffect, useRef, useState } from "react";
import { getComponents } from "@templates/ProductList/components";
import useProductFilter from "@components/Hooks/products/useProductFilter";
import CustomRangeSlider from "@components/customRangeSlider/customRangeSlider";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const IFilterSection1 = (props: IFilterSection1Props) => {
  const {
    isDisplay,
    isAppliedFilter,
    routeCustomURL,
    handleOnChangeFilter,
    resetUpdatedFilters,
    filter,
  } = useProductFilter({
    options: props.options,
    applyFilterData: props.applyFilterData,
    URLFilterData: props.URLFilterData,
  });
  const forceLogin = parseInt(Cookies.get("forceLogin") ?? '') === 1 ? true : false;

  const [openBox, setOpenBox] = useState<number>(-1);
  const parentRef = useRef<HTMLDivElement>(null);
  const [minMaxPriceRange, setMinMaxPriceRange] = useState<{
    min: number;
    max: number;
  } | null>();
  const [isApplyPriceRange, setIsApplyPriceRange] = useState<boolean>(false);
  const router = useRouter();

  // const handleOptionOutside = (event: any) => {
  //   if (parentRef !== null) {
  //     if (parentRef?.current && parentRef.current !== null) {
  //       if (!parentRef.current.contains(event.target)) {
  //         setOpenBox(-1);
  //       }
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (IsBrowser) {
  //     window.addEventListener("click", handleOptionOutside, true);
  //   }
  // }, []);

  useEffect(() => {
    // @ts-ignore
    if (props.URLFilterData?.["PRICE_RANGE"]) {
      // @ts-ignore
      if (props.URLFilterData?.["PRICE_RANGE"]?.[0]) {
        // @ts-ignore
        const splitData = props.URLFilterData?.["PRICE_RANGE"]?.[0]?.split(",");
        if (splitData?.length > 0) {
          setTimeout(() => {
            onChangePriceFilter(
              {
                min: splitData[0],
                max: splitData[1],
              },
              APPCONFIG.filterModuleName.priceRange
            );
            setIsApplyPriceRange(true);
          }, 200);
        }
      }
    }
    // @ts-ignore
    // eslint-disable-next-line
  }, [props.URLFilterData?.["PRICE_RANGE"]]);

  // Apply Price Range Filter
  useEffect(() => {
    if (isApplyPriceRange && minMaxPriceRange) {
      onChangePriceFilter(
        minMaxPriceRange,
        APPCONFIG.filterModuleName.priceRange
      );
    }
    // eslint-disable-next-line
  }, [isApplyPriceRange]);

  const onChangePriceFilter = (
    value: { min: number; max: number },
    code: string
  ) => {
    if (
      minMaxPriceRange?.min !== value.min ||
      minMaxPriceRange?.max !== value.max
    ) {
      setMinMaxPriceRange(value);
    }
   const random = Math.random()
    if (isApplyPriceRange) {
      handleOnChangeFilter(value, code, random?.toString());
      setIsApplyPriceRange(false);
    }
  };

  const resetPriceRange = () => {
    const findIndex = filter?.filter?.findIndex(
      (option) => option?.module?.code === APPCONFIG.filterModuleName.priceRange
    );
    if (findIndex !== -1) {
      filter.filter[findIndex].applyRange = null;
      setMinMaxPriceRange({
        // @ts-ignore
        min: filter?.filter[findIndex].module_data?.min,
        // @ts-ignore
        max: filter?.filter[findIndex].module_data?.max,
      });
    }
    setIsApplyPriceRange(true);
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productListCategoryDrp)}
        />
        <link
          rel="preload"
          as="style"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productListCategoryDrp)}
        />
      </Head>

      <div className="category-dropdown-section">
        {isDisplay &&
          filter.filter.map((option, opIndex) =>
            option?.module?.input_type ===
              APPCONFIG.filterInputType.multiSelectCheckbox &&
              option?.module?.code !== APPCONFIG.filterModuleName.priceRange &&
              option?.module?.code !== APPCONFIG.filterModuleName.category &&
              option?.module_data?.length > 0 ? (
              <div key={opIndex} className="select-box">
                <div
                  onClick={() => {
                    if (!getUserDetails() && forceLogin) {
                      router.replace("/sign-in");
                    } else {
                      setOpenBox(opIndex === openBox ? -1 : opIndex);
                    }
                  }}
                  className={`option-box ${opIndex === openBox ? "active" : ""
                    }`}
                >
                  {option?.module?.name}{" "}
                  <i className="jkm-arrow-down"></i>
                </div>
                {opIndex === openBox ? (
                  <div ref={parentRef} className="option-dropdown-box">
                    <div className="row">
                      {option?.module_data?.map((module, mIndex) => (
                        <div key={"checm_" + mIndex} className="d-col d-col-4">
                          <div className="cmn-checkbox">
                            <input
                              id={`${module?._id}`}
                              type="checkbox"
                              name={`${module?.name}`}
                              checked={module?.filter_values}
                              onChange={() =>
                                handleOnChangeFilter(
                                  !module?.filter_values,
                                  option?.module?.code,
                                  module?._id
                                )
                              }
                              value={module?._id}
                            />
                            <span></span>
                            <label htmlFor={`${module?._id}`}>
                              {module?.name
                                ? module?.name
                                : module?.title
                                  ? module?.title
                                  : ""}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="row d-reverse">
                      <div className="d-col d-col-4">
                        <button
                          type="button"
                          onClick={() => setOpenBox(-1)}
                          className="btn btn-primary btn-small ml-1"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : option?.module?.code === APPCONFIG.filterModuleName.category ? (
              <>
                <div key={opIndex} className="select-box">
                  <div
                    onClick={() => {
                      if (!getUserDetails() && forceLogin) {
                        router.replace("/sign-in");
                      } else {
                        setOpenBox(opIndex === openBox ? -1 : opIndex);
                      }
                    }}
                    className={`option-box ${opIndex === openBox ? "active" : ""
                      }`}
                  >
                    {option?.module?.name}{" "}
                    <i className="jkm-arrow-down"></i>
                  </div>
                  {opIndex === openBox ? (
                    <div ref={parentRef} className="option-dropdown-box">
                      <div className="row">
                        {option?.module_data?.map((module) =>
                          module?.sub_category?.map((subCate: any, sIndex: number) => (
                            <div key={sIndex} className="d-col d-col-4">
                              <div className="cmn-checkbox">
                                <input
                                  id={`${subCate?._id}`}
                                  type="checkbox"
                                  name={`${subCate?.name}`}
                                  checked={subCate?.filter_values}
                                  onChange={() =>
                                    handleOnChangeFilter(
                                      !subCate?.filter_values,
                                      option?.module?.code,
                                      subCate?._id
                                    )
                                  }
                                  value={subCate?._id}
                                />
                                <span></span>
                                <label htmlFor={`${subCate?._id}`}>
                                  {subCate?.name
                                    ? subCate?.name
                                    : subCate?.title
                                      ? subCate?.title
                                      : ""}
                                </label>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="row d-reverse">
                        <div className="d-col d-col-4">
                          <button
                            type="button"
                            onClick={() => setOpenBox(-1)}
                            className="btn btn-primary btn-small ml-1"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : option?.module?.code === APPCONFIG.filterModuleName.priceRange ? (
              <>
                <div key={opIndex} className="select-box">
                  <div
                    onClick={() => {
                      if (!getUserDetails() && forceLogin) {
                        router.replace("/sign-in");
                      } else {
                        setOpenBox(opIndex === openBox ? -1 : opIndex);
                      }
                    }}
                    className={`option-box ${opIndex === openBox ? "active" : ""
                      }`}
                  >
                    {option?.module?.name}{" "}
                    <i className="jkm-arrow-down"></i>
                  </div>
                  {opIndex === openBox ? (
                    <div ref={parentRef} className="option-dropdown-box">
                      <div className="row">
                        <label>{option?.module?.name}</label>
                        <CustomRangeSlider
                          // @ts-ignore
                          min={option?.module_data?.min}
                          // @ts-ignore
                          max={option?.module_data?.max}
                          // @ts-ignore
                          currentApplyRange={
                            minMaxPriceRange
                              ? minMaxPriceRange
                              : {
                                // @ts-ignore
                                min: option?.module_data?.min,
                                // @ts-ignore
                                max: option?.module_data?.max,
                              }
                          }
                          onChange={({ min, max }) =>
                            onChangePriceFilter(
                              { min: min, max: max },
                              option?.module?.code
                            )
                          }
                          setApplyClick={() => {
                            setIsApplyPriceRange(true);
                            setOpenBox(-1);
                          }}
                          resetFilterButton={() => {
                            resetPriceRange();
                            setOpenBox(-1);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : (
              <></>
            )
          )}

        {/* <div className="btn-more-filter">
          <p>More Filter</p>
        </div> */}
      </div>
      {getComponents("1", "current_filter_section", {
        options: filter?.filter,
        isFilterApply: isAppliedFilter,
        customRouteURL: routeCustomURL,
        // @ts-ignore
        resetFilters: (e, categoryIds, updatedRouteURL) =>
          resetUpdatedFilters(e, categoryIds, updatedRouteURL),
        resetAllFiltersPrice: () => resetPriceRange(),
      })}
    </>
  );
};

export default IFilterSection1;
