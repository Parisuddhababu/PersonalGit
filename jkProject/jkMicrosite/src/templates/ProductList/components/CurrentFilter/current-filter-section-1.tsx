import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import useProductListCurrentFilter from "@components/Hooks/products/useProductListCurrentFilter";
import APPCONFIG from "@config/app.config";
import { ICurrentFilterProps } from "@templates/ProductList/components/CurrentFilter";
import { uuid } from "@util/uuid";

const ICurrentFilterSection1 = (props: ICurrentFilterProps) => {
  const {
    selectedFilter,
    checkIsFilterApply,
    getOtherSelectedModuleFilterData,
    removeSingleFilter,
    resetAllFilters,
    checkFilterValueAvailable,
  } = useProductListCurrentFilter(props);
  const currencySymbol = useCurrencySymbol();

  return props?.isFilterApply && checkIsFilterApply() ? (
    <div className="current-filter-section">
      <div className="filter-label">Current Filters :</div>
      <div className="selected-item">
        {selectedFilter?.map((element) =>
          element?.module?.input_type ===
            APPCONFIG.filterInputType.multiSelectCheckbox &&
            element?.module?.code !== APPCONFIG.filterModuleName.category &&
            element?.module_data?.length &&
            checkFilterValueAvailable(element?.module_data) ? (
            <div key={uuid()} className="selected-box">
              <strong>{`${element?.module?.name}:`}</strong>
              {getOtherSelectedModuleFilterData(element?.module_data)?.length >
                0 ? (
                <p>
                  {getOtherSelectedModuleFilterData(
                    element?.module_data
                  )?.toString()}
                </p>
              ) : (
                <></>
              )}
              <button
                className="btn-icon-close"
                onClick={() =>
                  removeSingleFilter(element?._id, element?.module?.code)
                }
              >
                <i className="jkm-close"></i>
              </button>
            </div>
          ) : element?.module?.code === APPCONFIG.filterModuleName.category ? (
            element?.module_data?.map(
              (category, cIndex) =>
                checkFilterValueAvailable(category?.sub_category) && (
                  <div key={cIndex} className="selected-box">
                    <strong>{`${element?.module?.name}:`}</strong>
                    {category?.sub_category?.map(
                      (subCate: any, subInd: number) =>
                        subCate?.filter_values && (
                          <p key={subInd}>{`${subCate?.name},`}</p>
                        )
                    )}
                    <button
                      className="btn-icon-close"
                      onClick={() =>
                        removeSingleFilter(
                          category?.category_type_id,
                          element?.module?.code
                        )
                      }
                    >
                      <i className="jkm-close"></i>
                    </button>
                  </div>
                )
            )
          ) : element?.module?.code === APPCONFIG.filterModuleName.priceRange &&
            // @ts-ignore
            (element?.applyRange?.min !== element.module_data?.min ||
              // @ts-ignore
              element?.applyRange?.max !== element.module_data?.max) ? (
            <>
              {element?.applyRange?.min && element?.applyRange?.max ? (
                <div className="selected-box">
                  <strong>{`${element?.module?.name}:`}</strong>
                  <p>{`${currencySymbol} ${element?.applyRange?.min} - ${currencySymbol} ${element?.applyRange?.max}`}</p>
                  <button
                    className="btn-icon-close"
                    onClick={() => props.resetAllFiltersPrice()}
                  >
                    <i className="jkm-close"></i>
                  </button>
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )
        )}
        {checkIsFilterApply() ? (
          <button
            className="btn-filter btn-clear"
            onClick={() => {
              resetAllFilters();
              props.resetAllFiltersPrice();
            }}
          >
            Clear All
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ICurrentFilterSection1;
