import APPCONFIG from "@config/app.config";
import { useState } from "react";
import { ICompareProductsState } from "@components/Hooks/compareProduct";
import { useToast } from "@components/Toastr/Toastr";

const useCompareProduct = () => {
  const { showError, showSuccess } = useToast();

  /**
   * Get Current Compare Product records List
   * @returns array
   */
  const getCompareProductList = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const compareList = localStorage.getItem(APPCONFIG.LOCALSTORAGEKEY.productCompareList);
      if (compareList) {
        const tempCompare = JSON.parse(compareList);
        const tempCompareArray = tempCompare ? tempCompare : [];
        return tempCompareArray;
      }
      return [];
    }
  };

  const [compareProducts, setCompareProducts] = useState<ICompareProductsState[]>(() => {
    return getCompareProductList();
  });

  /**
   * Remove All Compare Product & If Id pass then that Id records remove from compare product records
   * @param id string
   */
  const clearCompareProduct = (id = "") => {
    if (id === "") {
      localStorage.setItem(APPCONFIG.LOCALSTORAGEKEY.productCompareList, JSON.stringify([]));
      setCompareProducts([]);
    } else {
      const pCompareList = localStorage.getItem(APPCONFIG.LOCALSTORAGEKEY.productCompareList);
      let tempCompare = [];
      if (pCompareList) {
        tempCompare = JSON.parse(pCompareList);
      }
      const index = tempCompare?.findIndex((ele: ICompareProductsState) => ele.product_id === id);
      if (index !== -1) {
        tempCompare.splice(index, 1);
        localStorage.setItem(APPCONFIG.LOCALSTORAGEKEY.productCompareList, JSON.stringify(tempCompare));
        setCompareProducts(tempCompare);
      }
    }
  };

  /**
   * Add Any Product to Compare Product if exits then also remove from compare list
   * @param title string
   * @param product_id string
   */
  const addProductInCompare = (title: string, product_id: string) => {
    const pCompareList = localStorage.getItem(APPCONFIG.LOCALSTORAGEKEY.productCompareList);
    let tempCompare: ICompareProductsState[] = [];
    if (pCompareList) {
      tempCompare = JSON.parse(pCompareList);
    }

    const index = tempCompare?.findIndex((ele: ICompareProductsState) => ele.product_id === product_id);
    if (index !== -1) {
      tempCompare.splice(index, 1);
      localStorage.setItem(APPCONFIG.LOCALSTORAGEKEY.productCompareList, JSON.stringify(tempCompare));
      setCompareProducts(tempCompare);
      showSuccess("Product removed from compare list");
    } else {
      if (tempCompare.length + 1 > 4) {
        showError("Only Four Prodcuct can compare");
        return;
      }
      tempCompare.push({
        product_id: product_id,
        title: title,
      });
      localStorage.setItem(APPCONFIG.LOCALSTORAGEKEY.productCompareList, JSON.stringify(tempCompare));
      showSuccess("Product is added in compare list");
    }
  };

  return {
    compareProducts,
    getCompareProductList,
    clearCompareProduct,
    addProductInCompare,
  };
};

export default useCompareProduct;
