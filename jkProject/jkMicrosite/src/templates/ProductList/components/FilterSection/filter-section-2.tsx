import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath, getUserDetails } from "@util/common";
import Head from "next/head";
import { IFilterSection1Props } from "@templates/ProductList/components/FilterSection";
import APPCONFIG from "@config/app.config";
import { useEffect, useState } from "react";
import { getComponents } from "@templates/ProductList/components";
import useProductFilter from "@components/Hooks/products/useProductFilter";
import CustomRangeSlider from "@components/customRangeSlider/customRangeSlider";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const FilterSection2 = (props: IFilterSection1Props) => {
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

  const [minMaxPriceRange, setMinMaxPriceRange] = useState<{
    min: number;
    max: number;
  } | null>();
  const [isApplyPriceRange, setIsApplyPriceRange] = useState<boolean>(false);
  const [openMenuList, setOpenMenuList] = useState<string[]>();
  const [rerender, setRerender] = useState<boolean>(true);
  const router = useRouter();
  const forceLogin = parseInt(Cookies.get("forceLogin") ?? '') === 1 ? true : false;
  
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
      handleOnChangeFilter(value, code, random.toString());
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

  const toggleOptions = (e: React.MouseEvent<HTMLElement>, menuId: string) => {
    // const classNames = e.currentTarget.classList || [];
    // if (classNames.contains("jkms2-plus")) {
    //   e.currentTarget.classList.replace("jkms2-plus", "jkms2-minus");
    // } else {
    //   e.currentTarget.classList.replace("jkms2-minus", "jkms2-plus");
    // }
    const closeMenu = openMenuList || [];
    const index = closeMenu?.findIndex((ele) => ele === menuId);
    if (index !== -1) {
      closeMenu.splice(index, 1);
    } else {
      closeMenu?.push(menuId);
    }
    setRerender(false);
    setOpenMenuList(closeMenu);
  };

  useEffect(() => {
    setRerender(true);
  }, [rerender]);

  const checkFilterMenuOpen = (id: string) => {
    const openMenu = openMenuList || [];
    return !openMenu.includes(id);
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(
            "2",
            CSS_NAME_PATH.productListFilterSidebar
          )}
        />
      </Head>
      <aside className="filter-option-section">
        {getComponents("2", "current_filter_section", {
          options: filter?.filter,
          isFilterApply: isAppliedFilter,
          customRouteURL: routeCustomURL,
          // @ts-ignore
          resetFilters: (e, categoryIds, updatedRouteURL) =>
            resetUpdatedFilters(e, categoryIds, updatedRouteURL),
          resetAllFiltersPrice: () => resetPriceRange(),
        })}

        {isDisplay &&
          filter.filter.map((option, opIndex) =>
            option?.module?.input_type ===
              APPCONFIG.filterInputType.multiSelectCheckbox &&
              option?.module?.code !== APPCONFIG.filterModuleName.priceRange &&
              option?.module?.code !== APPCONFIG.filterModuleName.category &&
              option?.module_data?.length > 0 &&
              rerender ? (
              <>
                <div
                  key={opIndex}
                  onClick={() => {
                    if(!getUserDetails() && forceLogin) {
                      router.replace("/sign-in");
                    }
                  }}
                  className="filter-tab metal-weight-filter"
                >
                  <h3
                    onClick={(e) =>
                      toggleOptions(e, `${option?.module?.name}_${opIndex}`)
                    }
                  >
                    {option?.module?.name}
                    <i
                      className={`${checkFilterMenuOpen(
                        `${option?.module?.name}_${opIndex}`
                      )
                          ? "jkms2-minus"
                          : "jkms2-plus"
                        } filter-icon active`}
                    ></i>
                  </h3>
                  {checkFilterMenuOpen(
                    `${option?.module?.name}_${opIndex}`
                  ) && (
                      <div
                        className="filter-content metal-wieght-filte-content"
                        id={`${option?.module?.name}_${opIndex}`}
                      >
                        <form>
                          <ul>
                            {option?.module_data?.map((module, mIndex) => (
                              <>
                                <li key={mIndex}>
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
                                    <label htmlFor={`${module?._id}`}>
                                      {module?.name
                                        ? module?.name
                                        : module?.title
                                          ? module?.title
                                          : ""}{" "}
                                    </label>
                                  </div>
                                </li>
                              </>
                            ))}
                          </ul>
                        </form>
                      </div>
                    )}
                </div>
              </>
            ) : option?.module?.code === APPCONFIG.filterModuleName.category ? (
              <>
                <div
                  onClick={() => {
                    if (!getUserDetails() && forceLogin) {
                      router.replace("/sign-in");
                    }
                  }}
                  className="filter-tab category-filter"
                >
                  <h3
                    onClick={(e) =>
                      toggleOptions(e, `${option?.module?.name}_${opIndex}`)
                    }
                  >
                    {option?.module?.name}
                    <i
                      className={`${checkFilterMenuOpen(
                        `${option?.module?.name}_${opIndex}`
                      )
                        ? "jkms2-minus"
                        : "jkms2-plus"
                        } filter-icon active`}
                    ></i>
                  </h3>
                  {checkFilterMenuOpen(
                    `${option?.module?.name}_${opIndex}`
                  ) && (
                  
                  <div className="filter-content category-filter-content">
                    <ul>
                      <li className="filter-list">
                        {/* <a href="#" className="active">
                          {option?.module?.name}
                          <i className="jkms2-plus filter-icon"></i>
                          <i className="jkms2-minus filter-icon active"></i>
                        </a> */}
                        <div className="filter-list-content">
                          <ul>
                            {option?.module_data?.map((module) =>
                              module?.sub_category?.map(
                                (subCate: any, subCateInd: number) => (
                                  <li key={subCateInd}>
                                    <a
                                      onClick={() =>
                                        handleOnChangeFilter(
                                          !subCate?.filter_values,
                                          option?.module?.code,
                                          subCate?._id
                                        )
                                      }
                                    >
                                      {subCate?.name
                                        ? subCate?.name
                                        : subCate?.title
                                          ? subCate?.title
                                          : ""}
                                    </a>
                                  </li>
                                )
                              )
                            )}
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                  )}
                </div>
              </>
            ) : option?.module?.code ===
              APPCONFIG.filterModuleName.priceRange ? (
              <>
                <div
                  className="filter-tab price-range"
                  onClick={() => {
                    if (!getUserDetails() && forceLogin) {
                      router.replace("/sign-in");
                    }
                  }}
                >
                  <h3
                    onClick={(e) =>
                      toggleOptions(e, `${option?.module?.name}_${opIndex}`)
                    }
                  >
                    {option?.module?.name}
                    <i
                      className={`${checkFilterMenuOpen(
                        `${option?.module?.name}_${opIndex}`
                      )
                          ? "jkms2-minus"
                          : "jkms2-plus"
                        } filter-icon active`}
                    ></i>
                  </h3>
                  <div className="filter-content price-range-content">
                    <div className="form-group">
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
                        }}
                        resetFilterButton={() => {
                          resetPriceRange();
                        }}
                      />
                    </div>
                    {/* <div className="action-toolbar">
                      <a className="filter-btn filer-btn-reset">Reset</a>
                    </div> */}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )
          )}
        {getComponents("2", "compare_product_section", {})}
      </aside>
    </>
  );
};

export default FilterSection2;
