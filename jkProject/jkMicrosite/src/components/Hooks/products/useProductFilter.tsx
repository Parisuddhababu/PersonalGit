import {
  ICustomURLState,
  IFilterStates,
} from "@templates/ProductList/components/FilterSection";
import { useEffect, useState } from "react";
import { IUseProductFilterProps } from "@components/Hooks/products";
import {
  IFilterAppliedState,
  IFilterOptions,
  IModuleData,
} from "@type/Pages/ProductFilters";
import APPCONFIG from "@config/app.config";

const useProductFilter = (props: IUseProductFilterProps) => {
  const [filter, setFilter] = useState<IFilterStates>({
    filter: props?.options,
  });
  const [isDisplay, setIsDisplay] = useState<boolean>(false);

  const [isAppliedFilter, setIsAppliedFilter] = useState<boolean>(false);
  const [appliedFilterData, setAppliedFilterData] =
    useState<IFilterAppliedState[]>();
  const [routeCustomURL, setRouteCustomURL] = useState<ICustomURLState[]>([]);

  /**
   * Check particular Id Match with any array records
   * @param data
   * @param id string
   * @returns
   */
  const checkArrayValueMatch = (data: { _id: string }[], id: string) => {
    let isMatch = false;
    if (data && data.length > 0) {
      data?.map(async (ele) => {
        if (ele?._id === id) {
          isMatch = true;
        }
      });
    }
    return isMatch;
  };

  /**
   * Set URL Filter Data To Handle URL with filter
   */
  const setURLValueFilterData = () => {
    const data = filter;
    const apply: IFilterAppliedState[] = [];
    data?.filter?.map((ele) => {
      if (ele?.module?.code === APPCONFIG.filterModuleName.category) {
        const tmpCategoryTypeArray: string[] = [];
        const tmpCategoryArray: string[] = [];
        const ids: string[] = [];
        ele?.module_data?.map((ca) => {
          ca?.sub_category?.map((sc: any) => {
            if (sc.filter_values) {
              tmpCategoryTypeArray.push(sc.category_type_id);
              tmpCategoryArray.push(ele?.module?._id);
              ids.push(sc?._id);
            }
          });
        });
        apply.push({
          module_name: ele?.module?.code,
          ids: ids,
          category_type_id: tmpCategoryTypeArray,
          category_id: tmpCategoryArray,
        });
      } else if (ele?.module?.code !== APPCONFIG.filterModuleName.priceRange) {
        const tmpOmdIds: string[] = [];
        ele?.module_data?.map((omd) => {
          if (omd?.filter_values) {
            tmpOmdIds.push(omd?._id);
          }
        });
        apply.push({
          module_name: ele?.module?.code,
          ids: tmpOmdIds,
        });
      }
    });
    // New Arriaval Logic
    const nInd = routeCustomURL?.findIndex((e) => e?.name === APPCONFIG.SEARCH_URL_TYPE.NEW_ARRIVAL);
    if (nInd !== -1) {
      apply.push({
        module_name: APPCONFIG.filterModuleName.newArrival,
        ids: ["true"]
      })
    }
    makeAppliedFilterURL(apply);
  };

  const checkIsCategoryTypeId = (data: IModuleData[]) => {
    let available = false;
    if (data?.length > 0) {
      data.map((ele) => {
        if (ele?.category_type) {
          available = true;
        }
      });
    }
    return available;
  };

  /**
   * Make Category Data like below format
   * [mainCategoryName: '', subCategory: [{ }]]
   */
  const setCategoryDataInFormat = () => {
    const index = props?.options?.findIndex(
      (ele) => ele?.module?.code === APPCONFIG.filterModuleName?.category
    );
    const mainCategory: any = [];
    if (checkIsCategoryTypeId(props?.options[index]?.module_data)) {
      if (index !== -1) {
        const data = props?.options[index]?.module_data;
        data.map((ele) => {
          const mainIndex = mainCategory.findIndex(
            (mc: IModuleData) =>
              mc?.category_type_id === ele?.category_type?.category_type_id
          );
          if (mainIndex === -1) {
            mainCategory.push(ele?.category_type);
          }
        });
      }
      if (mainCategory.length >= 0) {
        mainCategory.map((mc: IModuleData) => {
          const moduleData = props?.options[index]?.module_data;
          moduleData.map((md) => {
            if (md?.category_type?.category_type_id === mc?.category_type_id) {
              if (mc) {
                if (mc["sub_category"]?.length >= 0) {
                  mc["sub_category"].push(md);
                } else {
                  mc["sub_category"] = [md];
                }
              }
            }
          });
        });
      }
    } else {
      mainCategory.push({ sub_category: props?.options[index]?.module_data });
    }
    let formatedCategoryData = {
      module: {},
      module_data: [],
      _id: "",
      type_id: "",
    };
    if (mainCategory.length >= 0) {
      formatedCategoryData.module = props?.options[index]?.module;
      formatedCategoryData.module_data = mainCategory;
      formatedCategoryData.type_id = props?.options[index]?.type_id;
      formatedCategoryData._id = props?.options[index]?._id;
    }

    const data = filter;
    const filterIndex = data?.filter?.findIndex(
      (fe) => fe?.module?.code === APPCONFIG.filterModuleName?.category
    );
    if (index !== -1) {
      data?.filter?.splice(filterIndex, 1);
      if (data?.filter) {
        // @ts-ignore
        data?.filter.unshift(formatedCategoryData);
      }
    }
    let newData ={
      ...filter, ...data
    }
    let subCatData;
    if(newData.filter[0]?.module_data?.[0]?.sub_category?.[0]?.sub_category?.length){
      subCatData = newData.filter[0]?.module_data?.[0].sub_category[0]?.sub_category;
      newData.filter[0].module_data[0].sub_category =subCatData 
    }
    setFilter(newData);
  };

  const bindURLApplyFilterData = () => {
    if (props?.URLFilterData) {
      const data = filter;
      const customURL = routeCustomURL;
      Object.keys(props?.URLFilterData).forEach(function (key) {
        const moduleNameIndex = data?.filter?.findIndex(
          (ele) => ele?.module?.code === key
          );
          if (
            key !== APPCONFIG.filterModuleName.category &&
            key !== APPCONFIG.filterModuleName.priceRange &&
            key !== APPCONFIG.filterModuleName.newArrival
            ) {
          data.filter?.[moduleNameIndex]?.module_data?.map((omd) => {
            // @ts-ignore
            if (checkArrayValueMatch(props?.URLFilterData[key], omd?._id)) {
              omd.filter_values = true;
              const indexC = customURL.findIndex(
                // @ts-ignore
                (ele) => ele.name === APPCONFIG.SEARCH_URL_TYPE[key]
              );
              if (indexC !== -1) {
                customURL[indexC].value.push(omd?.name || omd?.title);
              } else {
                customURL.push({
                  // @ts-ignore
                  name: APPCONFIG.SEARCH_URL_TYPE[key],
                  value: [omd?.name || omd?.title],
                });
              }
            }
          });
        } else if (key === APPCONFIG.filterModuleName.priceRange) {
          customURL.push({
            name: APPCONFIG.SEARCH_URL_TYPE.PRICE_RANGE,
            // @ts-ignore
            value: [props?.URLFilterData[key][0], props?.URLFilterData[key][1]],
          });
        } else if (key === APPCONFIG.filterModuleName.newArrival) {
          customURL.push({
            name: APPCONFIG.SEARCH_URL_TYPE.NEW_ARRIVAL,
            value: ['true']
          });
        } else {
          data?.filter[moduleNameIndex]?.module_data?.map((subCate) => {
            subCate?.sub_category?.map((scatmd: any) => {
              if (
                // @ts-ignore
                checkArrayValueMatch(props?.URLFilterData[key], scatmd?._id)
              ) {
                scatmd.filter_values = true;
                subCate.filter_values = true;
                const indexCa = customURL.findIndex(
                  // @ts-ignore
                  (ele) => ele.name === APPCONFIG.SEARCH_URL_TYPE[key]
                );
                if (indexCa !== -1) {
                  customURL[indexCa].value.push(scatmd?.name || scatmd?.title);
                } else {
                  customURL.push({
                    // @ts-ignore
                    name: APPCONFIG.SEARCH_URL_TYPE[key],
                    value: [scatmd?.name || scatmd?.title],
                  });
                }
              }
            });
          });
        }
      });
      //   setRouteCustomURL(customURL);
      // Add Filter Apply
      setIsAppliedFilter(true);
      // Set changed filter data
      setFilter({ ...filter, ...data });
      setURLValueFilterData();
    }
  };

  useEffect(() => {
    setCategoryDataInFormat();
    // eslint-disable-next-line
  }, [filter?.filter]);

  useEffect(() => {
    setFilter({ filter: props?.options });
    setIsDisplay(true);
    if (props?.URLFilterData) {
      bindURLApplyFilterData();
    }
    // eslint-disable-next-line
  }, [props?.options, props.URLFilterData]);

  useEffect(() => {
    if (props.options) {
      setFilter({ filter: props.options });
    }
    // eslint-disable-next-line
  }, []);

  /**
   * Make a URL From Applied Filter Data
   * @param newFilterData Applied Filter Data
   */
  const makeAppliedFilterURL = (
    newFilterData: IFilterAppliedState[],
    normalURL = false
  ) => {
    const customRoute = routeCustomURL || [];
    let url = "?";
    if (customRoute?.length > 0) {
      customRoute?.map((ele) => {
        if (ele?.value && ele?.value?.length > 0) {
          if (ele?.name === APPCONFIG.SEARCH_URL_TYPE.PRICE_RANGE) {
            url = url + ele?.name + ele?.value?.join("+");
          } else {
            const name = ele?.value?.join(",");
            url = url + ele?.name + name.replaceAll(" ", "+");
          }
        }
      });
    }
    let finalURl = url.replace("?--", "?");
    setAppliedFilterData(newFilterData || appliedFilterData);
    if (normalURL) {
      finalURl = "";
      setRouteCustomURL([]);
    }
    if (props.applyFilterData) {
      props.applyFilterData(newFilterData || appliedFilterData, finalURl);
    }
  };

  /**
   * Add Apply Filter New Value to URL
   * @param name Filter Name
   * @param value Filter Value
   */
  const addURLValue = (name: string, value: string) => {
    const customURL = routeCustomURL;
    const index = customURL.findIndex((ele) => ele.name === name);
    if (index !== -1) {
      if (name === APPCONFIG.SEARCH_URL_TYPE.PRICE_RANGE) {
        customURL[index].value = [value];
      } else {
        customURL[index].value.push(value);
      }
    } else {
      customURL.push({
        name: name,
        value: [value],
      });
    }
    setRouteCustomURL(customURL);
  };

  /**
   * Add Sorted (Applied) Filter Data to props and pass to calling component
   * @param id
   * @param filterModuleName
   * @param mainCategoryId
   */
  const addFilterData = (
    id: string,
    filterModuleName: string,
    categoryTypeId = null,
    categoryId = null
  ) => {
    const apply = appliedFilterData || [];
    if (apply?.length > 0) {
      const index = apply.findIndex(
        (ele) => ele.module_name === filterModuleName
      );
      if (index !== -1) {
        if (APPCONFIG.filterModuleName.priceRange === filterModuleName) {
          apply[index].ids = [id];
        } else {
          if (!apply[index]?.ids?.includes(id)) {
            apply[index].ids.push(id);
            if (categoryTypeId) {
              if (
                apply[index].category_type_id &&
                apply[index].category_type_id !== undefined
              ) {
                apply[index]?.category_type_id?.push(categoryTypeId);
              } else {
                apply[index].category_type_id = [categoryTypeId];
              }
            }
            if (categoryId) {
              if (
                apply[index].category_id &&
                apply[index].category_id !== undefined
              ) {
                apply[index].category_id?.push(categoryId);
              } else {
                apply[index].category_id = [categoryId];
              }
            }
          }
        }
      } else {
        apply.push({
          module_name: filterModuleName,
          ids: [id],
          category_type_id: [categoryTypeId || ""],
          category_id: [categoryId || ""],
        });
      }
    } else {
      apply.push({
        module_name: filterModuleName,
        ids: [id],
        category_type_id: [categoryTypeId || ""],
        category_id: [categoryId || ""],
      });
    }
    setAppliedFilterData(apply);
    makeAppliedFilterURL(apply);
  };

  /**
   * Remove Apply Filter value from URL
   * @param name Filter Name
   * @param value Filter value
   */
  const removeURLValue = (name: string, value: string) => {
    const customURL = routeCustomURL;
    const index = customURL.findIndex((ele) => ele.name === name);
    if (index !== -1) {
      const valueIndex = customURL[index]?.value.findIndex((ev) => ev === value);
      if (index !== -1) {
        customURL[index].value.splice(valueIndex, 1);
      }
    }
    setRouteCustomURL(customURL);
  };

  /**
   * Delete applied Filter Data to props and pass to calling component
   * @param data New Updated Data
   * @param type single or multiple
   * @param id if single then removed Id
   */
  const removeFilterData = (
    data: IFilterOptions[],
    type: string,
    id: string
  ) => {
    const newFilterData = appliedFilterData;
    if (data.length > 0 && newFilterData && newFilterData?.length > 0) {
      data.map(async (removeEle: IFilterOptions) => {
        const cIndex = newFilterData?.findIndex(
          (cfd) => cfd.module_name === removeEle.module?.code
        );
        if (APPCONFIG.filterModuleName.category === removeEle?.module?.code) {
          if (cIndex !== -1) {
            newFilterData[cIndex].category_id = [];
            newFilterData[cIndex].category_type_id = [];
            let tempCIDs: string[] = [];
            let tempCTIDs: string[] = [];
            let tempIds: string[] = [];
            await removeEle.module_data.map(async (md) => {
              md?.sub_category?.map((sc: any) => {
                if (sc.filter_values) {
                  tempIds.push(sc._id);
                  tempCIDs.push(removeEle.module._id);
                  tempCTIDs.push(md.category_type_id);
                }
              });

              let uniqueTempCIDs: string[] = [];
              tempCIDs.forEach((cids) => {
                if (!uniqueTempCIDs.includes(cids)) {
                  uniqueTempCIDs.push(cids);
                }
              });

              let uniqueTempCTIDs: string[] = [];
              tempCTIDs.forEach((ctids) => {
                if (uniqueTempCTIDs.includes(ctids)) {
                  uniqueTempCTIDs.push(ctids);
                }
              });

              let uniqueTempIds: string[] = [];
              tempIds.forEach((ids) => {
                if (!uniqueTempIds.includes(ids)) {
                  uniqueTempIds.push(ids);
                }
              });

              newFilterData[cIndex].category_id = uniqueTempCIDs;
              newFilterData[cIndex].category_type_id = uniqueTempCTIDs;
              newFilterData[cIndex].ids = uniqueTempIds;
            });
          }
        } else {
          if (
            APPCONFIG.filterModuleName.priceRange === removeEle?.module?.code
          ) {
            // const pindex = data?.findIndex((pr) => pr.module?.code === APPCONFIG.filterModuleName.priceRange);
            // if (pindex !== -1) {
            //   newFilterData.splice(pindex, 1);
            // }
          } else {
            if (type === "single") {
              if (cIndex !== -1) {
                const soIndex = newFilterData[cIndex].ids.findIndex(
                  (soe) => soe === id
                );
                if (soIndex !== -1) {
                  newFilterData[cIndex].ids.splice(soIndex, 1);
                }
              }
            }
            if (type === "multiple") {
              const moIndex = removeEle.module_data.findIndex(
                (rmd) => rmd.filter_values === true
              );
              if (moIndex <= -1) {
                if (cIndex !== -1) {
                  newFilterData.splice(cIndex, 1);
                }
              }
            }
          }
        }
      });
      setAppliedFilterData(newFilterData);
      makeAppliedFilterURL(newFilterData);
    }
  };

  /**
   *
   * @param value Event
   * @param filterName Module Name
   * @param dataObj Full data Object
   */
  const handleOnChangeFilter = (event: any, filterName: string, id: string) => {
    const data = filter;
    const moduleNameIndex = data?.filter?.findIndex(
      (ele) => ele?.module?.code === filterName
    );
    if (
      filterName !== APPCONFIG.filterModuleName.category &&
      filterName !== APPCONFIG.filterModuleName.priceRange
    ) {
      // Other Module Data Handling
      if (moduleNameIndex !== -1) {
        const mdIndex = data?.filter[moduleNameIndex]?.module_data?.findIndex(
          (md) => md._id === id
        );
        if (mdIndex !== -1) {
          data.filter[moduleNameIndex].module_data[mdIndex].filter_values =
            event;
          if (event) {
            addURLValue(
              // @ts-ignore
              APPCONFIG?.SEARCH_URL_TYPE?.[filterName],
              data.filter[moduleNameIndex].module_data[mdIndex].name ||
                data.filter[moduleNameIndex].module_data[mdIndex].title
            );
            addFilterData(
              data.filter[moduleNameIndex].module_data[mdIndex]._id,
              filterName
            );
          } else {
            removeURLValue(
              // @ts-ignore
              APPCONFIG.SEARCH_URL_TYPE[filterName],
              data.filter[moduleNameIndex].module_data[mdIndex].name ||
                data.filter[moduleNameIndex].module_data[mdIndex].title
            );
            removeFilterData(
              data.filter,
              "single",
              data.filter[moduleNameIndex].module_data[mdIndex]._id
            );
          }
        }
      }
    } else if (filterName === APPCONFIG.filterModuleName.priceRange) {
      if (
        // @ts-ignore
        data?.filter?.[moduleNameIndex]?.module_data?.min === event?.min &&
        // @ts-ignore
        data?.filter?.[moduleNameIndex]?.module_data?.max === event?.max
      ) {
        data.filter[moduleNameIndex]["applyRange"] = null;
        addFilterData(event, filterName);
        removeURLValue(
          // @ts-ignore
          APPCONFIG.SEARCH_URL_TYPE.PRICE_RANGE,
          APPCONFIG.filterInputType.range
        );
      } else {
        if (event) {
          const range = [event?.min, event?.max];
          // @ts-ignore
          data.filter[moduleNameIndex]["applyRange"] = {
            min: event.min,
            max: event.max,
          };
          addURLValue(APPCONFIG.SEARCH_URL_TYPE.PRICE_RANGE, range as any);
          addFilterData(event, filterName);
        }
      }
    } else {
      // Category Module Data handling
      if (moduleNameIndex !== -1) {
        data?.filter[moduleNameIndex]?.module_data?.map((subCate) => {
          const subIndex = subCate?.sub_category?.findIndex(
            (sc: any) => sc._id === id
          );
          if (subIndex !== -1) {
            subCate.sub_category[subIndex].filter_values =
              !subCate.sub_category[subIndex]?.filter_values ?? event;
            if (event) {
              addURLValue(
                // @ts-ignore
                APPCONFIG.SEARCH_URL_TYPE[filterName],
                subCate.sub_category[subIndex].name
              );
              addFilterData(
                subCate.sub_category[subIndex]._id,
                filterName,
                // @ts-ignore
                subCate.category_type_id,
                data?.filter[moduleNameIndex]?.module?._id
              );
            } else {
              removeURLValue(
                // @ts-ignore
                APPCONFIG.SEARCH_URL_TYPE[filterName],
                subCate.sub_category[subIndex].name
              );
              removeFilterData(
                data.filter,
                "single",
                subCate.sub_category[subIndex]._id
              );
            }
          }
        });
      }
    }

    // Add Filter Apply
    setIsAppliedFilter(true);
    // Set changed filter data
    setFilter({ ...filter, ...data });
  };

  /**
   * Check Global Filter Value Is Available
   */
  const checkIsFilterApply = () => {
    const filterData = filter?.filter;
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
        if (ele?.applyRange?.min && ele?.applyRange?.max) {
          isFilter = true;
        }
      }
    });
    setIsAppliedFilter(isFilter);
  };

  /**
   * Reset Filter Values
   */
  const resetUpdatedFilters = (
    e: any,
    categoryIds: string,
    updatedRouteURL: ICustomURLState[]
  ) => {
    const data = filter;
    data.filter = e;
    if (updatedRouteURL) {
      setRouteCustomURL(updatedRouteURL);
      if (updatedRouteURL?.length <= 0) {
        makeAppliedFilterURL([], true);
      }
    }
    setFilter({ ...data });
    checkIsFilterApply();
    removeFilterData(e, "multiple", categoryIds);
  };

  return {
    isDisplay,
    isAppliedFilter,
    routeCustomURL,
    filter,
    handleOnChangeFilter,
    resetUpdatedFilters,
    appliedFilterData
  };
};

export default useProductFilter;
