import { IUseProductListCurrentFilterProps } from "@components/Hooks/products";
import APPCONFIG from "@config/app.config";
import { ICustomURLState } from "@templates/ProductList/components/FilterSection";
import { IFilterOptions, IModuleData } from "@type/Pages/ProductFilters";
import { useEffect, useState } from "react";

const useProductListCurrentFilter = (
  props: IUseProductListCurrentFilterProps
) => {
  const [selectedFilter, setSelectedFilter] = useState<IFilterOptions[]>(
    props?.options
  );
  const [selectedRouteURL, setSelectedRouteURL] = useState<ICustomURLState[]>(
    props?.customRouteURL
  );

  useEffect(() => {
    setSelectedFilter(props?.options);
  }, [props?.options]);
  /**
   * Check Global Filter Value Is Available
   */
  const checkIsFilterApply = () => {
    const filterData = props?.options;
    let isFilter = false;
    filterData?.map((ele) => {
      if (ele?.module_data?.length > 0) {
        if (ele?.module?.code !== APPCONFIG.filterModuleName.category) {
          ele?.module_data?.map((md) => {
            if (md?.filter_values) {
              isFilter = true;
            }
          });
        } else {
          ele?.module_data?.map((mod) => {
            mod?.sub_category?.map((esc: any) => {
              if (esc?.filter_values) {
                isFilter = true;
              }
            });
          });
        }
      } else if (ele?.module?.code === APPCONFIG.filterModuleName.priceRange) {
        if (
          // @ts-ignore
          (ele?.applyRange?.min !== ele.module_data?.min ||
            // @ts-ignore
            ele?.applyRange?.max !== ele.module_data?.max) &&
          ele?.applyRange?.min !== null &&
          ele?.applyRange?.max !== null &&
          ele?.applyRange?.min !== undefined &&
          ele?.applyRange?.max !== undefined
        ) {
          isFilter = true;
        }
      }
    });
    return isFilter;
  };

  /**
   * Check Filter Value Is Available for particular module (single)
   * @param data Array
   * @returns boolean
   */
  const checkFilterValueAvailable = (data: IModuleData[]) => {
    let isFilter = false;
    data?.map((ele) => {
      if (ele?.filter_values) {
        isFilter = true;
      }
    });
    return isFilter;
  };

  /**
   * Convert selected filter data
   * @param data array of data
   * @returns array of string
   */
  const getOtherSelectedModuleFilterData = (data: IModuleData[]) => {
    const dataArray: string[] = [];
    data?.map((ele) => {
      if (ele?.filter_values) {
        dataArray.push(ele?.name ? ele?.name : ele?.title ? ele?.title : "");
      }
    });
    return dataArray;
  };

  /**
   * Remove URL Value From Deleted Applied Filter
   * @param name string
   * @param value string
   */
  const removeURLValue = (name: string, value: string | []) => {
    const customURL = props.customRouteURL;
    const index = customURL.findIndex((ele) => ele.name === name);
    if (index !== -1) {
      const valueIndex = customURL[index].value.findIndex((ev) => ev === value);
      if (index !== -1) {
        customURL[index].value.splice(valueIndex, 1);
      }
    }
    setSelectedRouteURL(customURL);
  };

  /**
   * Remove Single selected filters
   * @param id String
   * @param type Module Code
   */
  const removeSingleFilter = (id: string, type: string) => {
    const filter = selectedFilter;
    let tempIds: string[] = [];
    if (type === APPCONFIG.filterInputType.range) {
      const index = filter.findIndex(
        (pr) => pr?.module?.code === APPCONFIG.filterModuleName.priceRange
      );
      if (index !== -1) {
        filter[index].applyRange = null;
      }
      removeURLValue(
        // @ts-ignore
        APPCONFIG.filterModuleName.priceRange,
        []
      );
    } else if (type === APPCONFIG.filterModuleName.category) {
      filter?.map((ele) => {
        if (ele?.module?.code !== APPCONFIG.filterModuleName.priceRange) {
          ele?.module_data?.map((mod) => {
            if (mod?.category_type_id === id) {
              mod?.sub_category?.map((esc: any) => {
                if (esc.filter_values) {
                  tempIds.push(esc._id);
                }
                removeURLValue(
                  // @ts-ignore
                  APPCONFIG.SEARCH_URL_TYPE[ele?.module?.code],
                  esc.name || esc.title
                );
                esc.filter_values = false;
              });
              if (!checkFilterValueAvailable(mod?.sub_category)) {
                tempIds = [];
              }
            }
          });
        }
      });
    } else {
      filter.map((omd) => {
        if (omd?.module_data.length > 0) {
          omd?.module_data?.map((omdd) => {
            if (omd?._id === id) {
              omdd.filter_values = false;
              removeURLValue(
                // @ts-ignore
                APPCONFIG.SEARCH_URL_TYPE[omd?.module?.code],
                omdd.name || omdd.title
              );
            }
          });
        }
      });
    }
    props.resetFilters(filter, tempIds, selectedRouteURL);
  };

  /**
   * Reset All the Applied filters
   */
  const resetAllFilters = () => {
    const filter = selectedFilter;
    filter?.map((ele) => {
      if (
        ele?.module?.code !== APPCONFIG.filterModuleName.category &&
        ele?.module?.code !== APPCONFIG.filterModuleName.priceRange
      ) {
        ele?.module_data?.map((md) => {
          md.filter_values = false;
        });
      } else {
        if (ele?.module?.code !== APPCONFIG.filterModuleName.priceRange) {
          ele?.module_data?.map((mod) => {
            mod?.sub_category?.map((esc: any) => {
              esc.filter_values = false;
            });
          });
        } else if (
          ele?.module?.code === APPCONFIG.filterModuleName.priceRange
        ) {
          ele.applyRange = null;
        }
      }
    });
    setSelectedRouteURL([]);
    props.resetFilters(filter, [], []);
  };

  return {
    selectedFilter,
    selectedRouteURL,
    checkIsFilterApply,
    getOtherSelectedModuleFilterData,
    removeSingleFilter,
    resetAllFilters,
    checkFilterValueAvailable,
  };
};

export default useProductListCurrentFilter;
