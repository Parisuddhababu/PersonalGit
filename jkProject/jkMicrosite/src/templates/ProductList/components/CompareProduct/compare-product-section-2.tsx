import { ICompareProductsState } from "@components/Hooks/compareProduct";
import useCompareProduct from "@components/Hooks/compareProduct/useCompareProduct";
import { useRouter } from "next/router";

const CompareProductSection2 = () => {
  const { getCompareProductList, clearCompareProduct } = useCompareProduct();
  const router = useRouter();
  return getCompareProductList() && getCompareProductList()?.length > 0 ? (
    <>
      <div className="filter-tab compare-product-section">
        <h3>
          Compare Products
          <span>({getCompareProductList()?.length} Items)</span>
        </h3>

        <div className="filter-content compare-content">
          {getCompareProductList()?.map(
            (ele: ICompareProductsState, eIndex: number) => (
              <p key={eIndex}>
                <a onClick={() => clearCompareProduct(ele?.product_id)}>
                  <i className="jkms2-close close-icon"></i>
                </a>
                {ele?.title}
              </p>
            )
          )}
        </div>
        <div className="action-toolbar">
          <button
            aria-label="compare"
            className="btn btn-primary btn-small btn-compare"
            onClick={() => router.push("/compare-products")}
          >
            Compare
          </button>
          <button
            aria-label="clear all"
            className="btn btn-secondary btn-small btn-clearAll"
            onClick={() => clearCompareProduct("")}
          >
            Clear All
          </button>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default CompareProductSection2;
