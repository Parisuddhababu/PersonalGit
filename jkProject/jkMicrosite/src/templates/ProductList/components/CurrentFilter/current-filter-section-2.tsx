import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import useProductListCurrentFilter from "@components/Hooks/products/useProductListCurrentFilter";
import APPCONFIG from "@config/app.config";
import { ICurrentFilterProps } from "@templates/ProductList/components/CurrentFilter";

const CurrentFilterSection2 = (props: ICurrentFilterProps) => {
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
    <>
      <div className="filter-tab current-filter">
        <h3>Current Filters</h3>
        <div className="filter-content current-filter">
          {selectedFilter?.map((element, eInd) =>
            element?.module?.input_type ===
              APPCONFIG.filterInputType.multiSelectCheckbox &&
              element?.module?.code !== APPCONFIG.filterModuleName.category &&
              element?.module_data?.length &&
              checkFilterValueAvailable(element?.module_data) ? (
              <p key={eInd}>
                <a
                  onClick={() =>
                    removeSingleFilter(element?._id, element?.module?.code)
                  }
                >
                  <i className="jkms2-close close-icon"></i>
                </a>
                <strong>{`${element?.module?.name}:`}</strong>
                {getOtherSelectedModuleFilterData(element?.module_data)
                  ?.length > 0 ? (
                  getOtherSelectedModuleFilterData(
                    element?.module_data
                  )?.toString()
                ) : (
                  <></>
                )}
              </p>
            ) : element?.module?.code ===
              APPCONFIG.filterModuleName.category ? (
              element?.module_data?.map(
                (category, cInd) =>
                  checkFilterValueAvailable(category?.sub_category) && (
                    <p key={cInd}>
                      <a
                        onClick={() =>
                          removeSingleFilter(
                            category?.category_type_id,
                            element?.module?.code
                          )
                        }
                      >
                        <i className="jkms2-close close-icon"></i>
                      </a>
                      <strong>{`${element?.module?.name}:`}</strong>
                      {category?.sub_category?.map(
                        (sc: any, scIndex: number) => (
                          <strong key={scIndex}>
                            {scIndex === 0 && (
                              <>
                                {category?.name 
                                  ? `${category?.name}:`
                                  : <></>}
                              </>
                            )}
                            {sc.filter_values && `${sc?.name},`}
                          </strong>
                        )
                      )}
                    </p>
                  )
              )
            ) : element?.module?.code ===
              APPCONFIG.filterModuleName.priceRange &&
              // @ts-ignore
              (element?.applyRange?.min !== element.module_data?.min ||
                // @ts-ignore
                element?.applyRange?.max !== element.module_data?.max) ? (
              <>
                {element?.applyRange?.min && element?.applyRange?.max ? (
                  <p>
                    <a onClick={() => props.resetAllFiltersPrice()}>
                      <i className="jkms2-close close-icon"></i>
                    </a>
                    <strong>{`${element?.module?.name}:`}</strong>
                    {`${currencySymbol} ${element?.applyRange?.min} - ${currencySymbol} ${element?.applyRange?.max}`}
                  </p>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )
          )}
          {checkIsFilterApply() ? (
            <div
              className="action-toolbar"
              onClick={() => {
                resetAllFilters();
                props.resetAllFiltersPrice();
              }}
            >
              <a className="filter-btn filer-clear-btn">Clear All</a>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default CurrentFilterSection2;
